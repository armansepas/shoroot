import { NextRequest, NextResponse } from "next/server";
import {
  ExternalFootballResponse,
  ExternalMatch,
  ExternalCompetition,
  ExternalCompetitionStage,
  TypedMatch,
  FootballMatchesResponse,
} from "@/types/football";

// Map input date to YYYY-MM-DD format for API
function mapDateInput(dateInput: string): string {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // YYYY-MM-DD

  switch (dateInput.toLowerCase()) {
    case "today":
      return todayStr;
    case "yesterday":
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return yesterday.toISOString().split("T")[0];
    case "tomorrow":
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    case "day after tomorrow":
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);
      return dayAfterTomorrow.toISOString().split("T")[0];
    default:
      // Assume it's already in YYYY-MM-DD format
      return dateInput;
  }
}

// Normalize external match to TypedMatch
function normalizeMatch(
  extMatch: ExternalMatch,
  competition: ExternalCompetition,
  stage: ExternalCompetitionStage
): TypedMatch {
  const statusMap: Record<string, TypedMatch["status"]> = {
    notstarted: "upcoming",
    live: "live",
    finished: "finished",
    postponed: "upcoming", // Treat postponed as upcoming
  };

  // Convert Unix timestamp to date and time
  const matchDate = new Date(extMatch.holds_at * 1000);
  const isoDate = matchDate.toISOString().split("T")[0];
  const time = matchDate.toTimeString().substring(0, 5); // HH:MM

  const score =
    extMatch.is_finished &&
    extMatch.home_score !== null &&
    extMatch.away_score !== null
      ? { home: extMatch.home_score, away: extMatch.away_score }
      : undefined;

  return {
    id: extMatch.id,
    homeTeam: extMatch.home_team.english_name || extMatch.home_team.title,
    awayTeam: extMatch.away_team.english_name || extMatch.away_team.title,
    league: stage.english_name || stage.name,
    status: statusMap[extMatch.status.status_type] || "upcoming",
    date: isoDate,
    time: time,
    score: score,
  };
}

// Fetch matches from external API
async function fetchExternalMatches(date: string): Promise<TypedMatch[]> {
  const url = `https://football360.ir/api/base/v2/competition-trends/fixtures/${date}/?live_detail=yes&slugs=`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "accept-language": "en-US,en;q=0.9",
        "iso-8601-datetime": new Date().toISOString(),
        priority: "u=1, i",
        referer: `https://football360.ir/results?day=${date}`,
        "sec-ch-ua":
          '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(
        `External API error: ${response.status} ${response.statusText}`
      );
    }

    const data: ExternalFootballResponse = await response.json();

    // Flatten all matches from all competitions and stages
    const matches: TypedMatch[] = [];
    data.data.forEach((competition: ExternalCompetition) => {
      competition.competition_trend_stages.forEach(
        (stage: ExternalCompetitionStage) => {
          stage.matches.forEach((match: ExternalMatch) => {
            matches.push(normalizeMatch(match, competition, stage));
          });
        }
      );
    });

    return matches;
  } catch (error) {
    console.error("Error fetching external matches:", error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateInput = searchParams.get("date");

    if (!dateInput) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    // Validate date input
    const validDateInputs = [
      "today",
      "yesterday",
      "tomorrow",
      "day after tomorrow",
    ];
    const isValidInput =
      validDateInputs.includes(dateInput.toLowerCase()) ||
      /^\d{4}-\d{2}-\d{2}$/.test(dateInput);

    if (!isValidInput) {
      return NextResponse.json(
        {
          error:
            "Invalid date format. Use YYYY-MM-DD or: today, yesterday, tomorrow, day after tomorrow",
        },
        { status: 400 }
      );
    }

    const apiDate = mapDateInput(dateInput);
    const matches = await fetchExternalMatches(apiDate);

    const response: FootballMatchesResponse = {
      matches,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in football matches API:", error);
    return NextResponse.json({ error: "External API error" }, { status: 500 });
  }
}
