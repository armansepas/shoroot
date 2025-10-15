// Types for external football API response
export interface ExternalTeam {
  id: string;
  slug: string;
  title: string;
  english_name: string;
  logo: string;
  thumbnail: string;
  is_active: boolean;
  full_title: string;
  is_national: boolean;
  country: {
    name: string;
    english_name: string;
    flag_1x1: string;
    flag_4x3: string;
  };
  to_be_decided: boolean;
}

export interface ExternalMatchStatus {
  status_id: number;
  title: string;
  status_type: "notstarted" | "live" | "finished" | "postponed";
}

export interface ExternalMatch {
  id: string;
  home_team: ExternalTeam;
  away_team: ExternalTeam;
  home_score: number | null;
  away_score: number | null;
  holds_at: number; // Unix timestamp
  home_ordinary_time_score: number;
  away_ordinary_time_score: number;
  is_postponed: boolean;
  is_finished: boolean;
  status: ExternalMatchStatus;
  minute: number | null;
  slug: string;
  home_penalty_score: number | null;
  away_penalty_score: number | null;
  round_type: {
    name: string;
    value: number;
    is_knockout: boolean;
    display_name: string;
  };
  spectators: number | null;
  to_be_decided: boolean;
  live_detail: any | null; // Can be extended if needed
}

export interface ExternalCompetitionStage {
  id: string;
  name: string;
  english_name: string;
  stage_type: string;
  start_time: number;
  end_time: number;
  order: number | null;
  is_default: boolean;
  has_live_match: boolean;
  matches: ExternalMatch[];
}

export interface ExternalCompetition {
  id: string;
  title: string;
  english_name: string;
  slug: string | null;
  current_stage: string;
  start_time: number;
  end_time: number;
  banner: string;
  live_score_page_order: number;
  competition: string;
  is_multistage: boolean;
  logo: string;
  thumbnail: string;
  seo_slug: string;
  competition_trend_stages: ExternalCompetitionStage[];
}

export interface ExternalFootballResponse {
  data: ExternalCompetition[];
  ir_dst_troubled: boolean;
  lite_mode: {
    live_score_interval_time: number;
    track_live_stream_interval: number;
  };
}

// Normalized types for our application
export interface TypedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  status: "upcoming" | "live" | "finished";
  date: string; // ISO format
  time: string; // HH:MM format
  score?: { home: number; away: number };
  venue?: string;
}

export interface FootballMatchesResponse {
  matches: TypedMatch[];
}
