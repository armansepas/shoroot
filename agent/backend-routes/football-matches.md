GET /api/football/matches

Input:

- date: string (YYYY-MM-DD format, required) - the date for which to fetch matches

Logic: Call external third-party API to get football matches for the specified date. The API URL and response structure will be provided by the user. The response should be typed properly. Return the typed matches data.

Output:

- 200: { matches: TypedMatch[] }
- 400: Invalid date format
- 500: External API error

TypedMatch interface:

- id: string
- homeTeam: string
- awayTeam: string
- league: string
- status: 'upcoming' | 'live' | 'finished'
- date: string (ISO format)
- time: string (HH:MM format)
- score?: { home: number, away: number } (only if finished)
- venue?: string
- // Add other fields as per the external API response

External Api Logic and Response Structure:

GET API : https://football360.ir/api/base/v2/competition-trends/fixtures/2025-10-19/?live_detail=yes&slugs=

HEADERS:
accept:application/json
accept-language:en-US,en;q=0.9
iso-8601-datetime:2025-10-15T15:13:29.476+03:30
priority:u=1, i
referer:https://football360.ir/results?day=2025-10-18
sec-ch-ua:"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"
sec-ch-ua-mobile:?0
sec-ch-ua-platform:"Windows"
sec-fetch-dest:empty
sec-fetch-mode:cors
sec-fetch-site:same-origin
user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36

2025-10-19 is the date for which to fetch matches. the input should be today | yesterday | tomorrow | day after tomorrow. and the backend map that to the correct date to fetch the matches from the external API.

Response Structure:

{
"data": [
{
"id": "5aea49f9-41ed-4b08-9f79-a479151ddb3a",
"title": "2025/2026 - Premier League",
"english*name": "2025/2026 - Premier League",
"slug": null,
"current_stage": "ec772274-bc29-48d8-a9e3-68f5f71347b9",
"start_time": 1755216000,
"end_time": 1779580800,
"banner": "https://static.football360.ir/nesta2/media/missing_competition_trend_banner.png",
"live_score_page_order": 40,
"competition": "fcec7abb-dead-49c3-a907-1948e33fa438",
"is_multistage": false,
"logo": "https://static.football360.ir/nesta2/media/uploads/competitions/2022/12/20/%D9%84%DB%8C%DA%AF*%D8%A8%D8%B1*QZ0Pc5c.png",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/competitions/thumbnails/2025/10/15/uploads/competitions/2022/12/20/%D9%84%DB%8C%DA%AF*%D8%A8%D8%B1*QZ0Pc5c_thumb.png",
"seo_slug": "20252026-Premier-League",
"competition_trend_stages": [
{
"id": "ec772274-bc29-48d8-a9e3-68f5f71347b9",
"name": "لیگ برتر انگلیس",
"english_name": "2025/2026 - Premier League - Regular Season",
"stage_type": "GROUP",
"start_time": 1755216000,
"end_time": 1779580800,
"order": null,
"is_default": false,
"has_live_match": false,
"matches": [
{
"id": "2443e0d9-4bd1-4ed7-bbfd-f9c34a54e33a",
"home_team": {
"id": "9edeb025-1e55-4212-8d13-7ff755a26184",
"slug": "Tottenham-Hotspur",
"title": "تاتنهام",
"english_name": "Tottenham Hotspur",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/25409_Fk83acI.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2023/05/28/uploads/teams/2021/11/24/25409_Fk83acI_thumb_JZa8eKU.png",
"is_active": true,
"full_title": "Tottenham Hotspur",
"is_national": false,
"country": {
"name": "انگلیس",
"english_name": "England",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18784.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18785.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"away_team": {
"id": "8e4a191c-31fb-403b-8d9d-9534b48fefa8",
"slug": "Aston-Villa",
"title": "استون ویلا",
"english_name": "Aston Villa",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2024/09/16/astonvilla-min.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2024/09/16/astonvilla-min_thumb.png",
"is_active": true,
"full_title": "Aston Villa",
"is_national": false,
"country": {
"name": "انگلیس",
"english_name": "England",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18784.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18785.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"home_score": null,
"away_score": null,
"holds_at": 1760878800,
"home_ordinary_time_score": 0,
"away_ordinary_time_score": 0,
"is_postponed": false,
"is_finished": false,
"status": {
"status_id": 0,
"title": "آغاز نشده",
"status_type": "notstarted"
},
"minute": null,
"slug": "لیگ-برتر-انگلیس-تاتنهام-استون-ویلا",
"home_penalty_score": null,
"away_penalty_score": null,
"round_type": {
"name": "8",
"value": 0,
"is_knockout": false,
"display_name": "8"
},
"spectators": null,
"to_be_decided": false,
"live_detail": null
},
{
"id": "8350c1d9-7943-49cf-978d-4abaf06b9e34",
"home_team": {
"id": "262b6330-2700-491f-90f1-cba8dba57d38",
"slug": "Liverpool",
"title": "لیورپول",
"english_name": "Liverpool",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2024/09/07/3745.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2024/09/07/3745_thumb.png",
"is_active": true,
"full_title": "Liverpool",
"is_national": false,
"country": {
"name": "انگلیس",
"english_name": "England",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18784.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18785.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"away_team": {
"id": "abf40ff4-d347-47bb-a5f8-2e8dd7a9c91c",
"slug": "Manchester-United",
"title": "منچستر یونایتد",
"english_name": "Manchester United",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/26346_gsnCYW8.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2023/05/28/uploads/teams/2021/11/24/26346_gsnCYW8_thumb_HQYNl1a.png",
"is_active": true,
"full_title": "Manchester United",
"is_national": false,
"country": {
"name": "انگلیس",
"english_name": "England",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18784.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18785.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"home_score": null,
"away_score": null,
"holds_at": 1760887800,
"home_ordinary_time_score": 0,
"away_ordinary_time_score": 0,
"is_postponed": false,
"is_finished": false,
"status": {
"status_id": 0,
"title": "آغاز نشده",
"status_type": "notstarted"
},
"minute": null,
"slug": "لیگ-برتر-انگلیس-لیورپول-منچستر-یونایتد",
"home_penalty_score": null,
"away_penalty_score": null,
"round_type": {
"name": "8",
"value": 0,
"is_knockout": false,
"display_name": "8"
},
"spectators": null,
"to_be_decided": false,
"live_detail": null
}
]
}
]
},
{
"id": "8ab365b1-f56a-417c-89a2-a39347aa77c0",
"title": "2025/2026 - Serie A",
"english_name": "2025/2026 - Serie A",
"slug": null,
"current_stage": "aaf30a80-1195-4149-b327-a79db1e6595d",
"start_time": 1755907200,
"end_time": 1779580800,
"banner": "https://static.football360.ir/nesta2/media/missing_competition_trend_banner.png",
"live_score_page_order": 50,
"competition": "9b0bf5c1-a71a-4381-af8c-a8e17c832903",
"is_multistage": false,
"logo": "https://static.football360.ir/nesta2/media/uploads/competitions/2022/12/20/%D8%B3%D8%B1%DB%8C*%D8%A2**XRBG0Aj.png",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/competitions/thumbnails/2025/10/15/uploads/competitions/2022/12/20/%D8%B3%D8%B1%DB%8C_%D8%A2**XRBG0Aj_thumb.png",
"seo_slug": "20252026-Serie-A",
"competition_trend_stages": [
{
"id": "aaf30a80-1195-4149-b327-a79db1e6595d",
"name": "سری آ ایتالیا",
"english_name": "2025/2026 - Serie A - Regular Season",
"stage_type": "GROUP",
"start_time": 1755907200,
"end_time": 1779580800,
"order": null,
"is_default": false,
"has_live_match": false,
"matches": [
{
"id": "c6fe7ba9-49be-400c-9102-72a89c6428cf",
"home_team": {
"id": "00eb24f9-941f-42a5-bb0a-f34601a2ec92",
"slug": "Como",
"title": "کومو",
"english_name": "Como",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2022/03/24/28602_tWrd1hD.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2022/07/23/uploads/teams/2022/03/24/28602_tWrd1hD_thumb.png",
"is_active": true,
"full_title": "Como",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"away_team": {
"id": "f3de180e-89b0-468a-a191-6ace4182bdec",
"slug": "Juventus",
"title": "یوونتوس",
"english_name": "Juventus",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/26171_h2dFxIq.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2023/05/29/uploads/teams/2021/11/24/26171_h2dFxIq_thumb_UP5l1Vs.png",
"is_active": true,
"full_title": "Juventus",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"home_score": null,
"away_score": null,
"holds_at": 1760869800,
"home_ordinary_time_score": 0,
"away_ordinary_time_score": 0,
"is_postponed": false,
"is_finished": false,
"status": {
"status_id": 0,
"title": "آغاز نشده",
"status_type": "notstarted"
},
"minute": null,
"slug": "سری-آ-ایتالیا-کومو-یوونتوس",
"home_penalty_score": null,
"away_penalty_score": null,
"round_type": {
"name": "7",
"value": 0,
"is_knockout": false,
"display_name": "7"
},
"spectators": null,
"to_be_decided": false,
"live_detail": null
},
{
"id": "04b44515-4ddf-417b-810d-3ecaabbde689",
"home_team": {
"id": "6a41085f-7826-4f6d-b63b-479465322517",
"slug": "Genoa",
"title": "جنوا",
"english_name": "Genoa",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/25742_O5n5ClK.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2022/05/23/uploads/teams/2021/11/24/25742_O5n5ClK_thumb_gKFvo5D.png",
"is_active": true,
"full_title": "Genoa",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"away_team": {
"id": "6006ce2d-ee68-4bba-93f4-5c53089d0359",
"slug": "Parma-Calcio-1913",
"title": "پارما",
"english_name": "Parma Calcio 1913",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/31882_AbIVElp.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2022/04/11/uploads/teams/2021/11/24/31882_AbIVElp_thumb_c1Xprar.png",
"is_active": true,
"full_title": "Parma Calcio 1913",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"home_score": null,
"away_score": null,
"holds_at": 1760878800,
"home_ordinary_time_score": 0,
"away_ordinary_time_score": 0,
"is_postponed": false,
"is_finished": false,
"status": {
"status_id": 0,
"title": "آغاز نشده",
"status_type": "notstarted"
},
"minute": null,
"slug": "سری-آ-ایتالیا-جنوا-پارما",
"home_penalty_score": null,
"away_penalty_score": null,
"round_type": {
"name": "7",
"value": 0,
"is_knockout": false,
"display_name": "7"
},
"spectators": null,
"to_be_decided": false,
"live_detail": null
},
{
"id": "63b56a5e-0285-47cd-9c5c-8855fd0fc029",
"home_team": {
"id": "00846ea8-6d18-46a4-8d71-6ac94e057d28",
"slug": "Cagliari",
"title": "کالیاری",
"english_name": "Cagliari",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/26383_XqnmJiy.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2022/05/23/uploads/teams/2021/11/24/26383_XqnmJiy_thumb_JZaDgzM.png",
"is_active": true,
"full_title": "Cagliari",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"away_team": {
"id": "a04d9e18-12f2-4fc4-925f-67121faa3abf",
"slug": "Bologna",
"title": "بولونیا",
"english_name": "Bologna",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/25552_1vFUInz.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2023/05/29/uploads/teams/2021/11/24/25552_1vFUInz_thumb_f4FLVT2.png",
"is_active": true,
"full_title": "Bologna",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"home_score": null,
"away_score": null,
"holds_at": 1760878800,
"home_ordinary_time_score": 0,
"away_ordinary_time_score": 0,
"is_postponed": false,
"is_finished": false,
"status": {
"status_id": 0,
"title": "آغاز نشده",
"status_type": "notstarted"
},
"minute": null,
"slug": "سری-آ-ایتالیا-کالیاری-بولونیا",
"home_penalty_score": null,
"away_penalty_score": null,
"round_type": {
"name": "7",
"value": 0,
"is_knockout": false,
"display_name": "7"
},
"spectators": null,
"to_be_decided": false,
"live_detail": null
},
{
"id": "046e038a-1fd2-40f8-a6e3-1fcdfba5752d",
"home_team": {
"id": "0528346c-0c05-40dd-a79d-d817808c2b69",
"slug": "Atalanta",
"title": "آتالانتا",
"english_name": "Atalanta",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/25867_Vck4VLs.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2023/05/29/uploads/teams/2021/11/24/25867_Vck4VLs_thumb_fF3DLh6.png",
"is_active": true,
"full_title": "Atalanta",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"away_team": {
"id": "e5a8bfa8-b5a1-4bd7-b55e-247299f852f4",
"slug": "Lazio",
"title": "لاتسیو",
"english_name": "Lazio",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/26472_oztRVon.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2023/05/29/uploads/teams/2021/11/24/26472_oztRVon_thumb_3e7GHrB.png",
"is_active": true,
"full_title": "Lazio",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"home_score": null,
"away_score": null,
"holds_at": 1760889600,
"home_ordinary_time_score": 0,
"away_ordinary_time_score": 0,
"is_postponed": false,
"is_finished": false,
"status": {
"status_id": 0,
"title": "آغاز نشده",
"status_type": "notstarted"
},
"minute": null,
"slug": "سری-آ-ایتالیا-آتالانتا-لاتسیو",
"home_penalty_score": null,
"away_penalty_score": null,
"round_type": {
"name": "7",
"value": 0,
"is_knockout": false,
"display_name": "7"
},
"spectators": null,
"to_be_decided": false,
"live_detail": null
},
{
"id": "663c320f-509d-49a5-bb7a-cd1bbaaa00d8",
"home_team": {
"id": "32c99462-83db-4939-a99e-1f15e774c5b7",
"slug": "AC-Milan",
"title": "میلان",
"english_name": "AC Milan",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/26351_AkC8Rf7.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2023/05/29/uploads/teams/2021/11/24/26351_AkC8Rf7_thumb_2sxaBDs.png",
"is_active": true,
"full_title": "AC Milan",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"away_team": {
"id": "b98b914a-5f4d-47fc-b368-3a594f507ca4",
"slug": "Fiorentina",
"title": "فیورنتینا",
"english_name": "Fiorentina",
"logo": "https://static.football360.ir/nesta2/media/uploads/teams/2021/11/24/26314_T7dm0oz.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"thumbnail": "https://static.football360.ir/nesta2/media/uploads/teams/thumbnails/2023/05/29/uploads/teams/2021/11/24/26314_T7dm0oz_thumb_y7FiqZv.png",
"is_active": true,
"full_title": "Fiorentina",
"is_national": false,
"country": {
"name": "ایتالیا",
"english_name": "Italy",
"flag_1x1": "https://static.football360.ir/nesta2/media/countries/flags/1x1/18852.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,",
"flag_4x3": "https://static.football360.ir/nesta2/media/countries/flags/4x3/18853.png?x-img=v1/optimize,q_100,lossless_false,/resize,w_72,"
},
"to_be_decided": false
},
"home_score": null,
"away_score": null,
"holds_at": 1760899500,
"home_ordinary_time_score": 0,
"away_ordinary_time_score": 0,
"is_postponed": false,
"is_finished": false,
"status": {
"status_id": 0,
"title": "آغاز نشده",
"status_type": "notstarted"
},
"minute": null,
"slug": "سری-آ-ایتالیا-میلان-فیورنتینا",
"home_penalty_score": null,
"away_penalty_score": null,
"round_type": {
"name": "7",
"value": 0,
"is_knockout": false,
"display_name": "7"
},
"spectators": null,
"to_be_decided": false,
"live_detail": null
}
]
}
]
},
],
"ir_dst_troubled": true,
"lite_mode": {
"live_score_interval_time": 60000,
"track_live_stream_interval": 60000
}
}
