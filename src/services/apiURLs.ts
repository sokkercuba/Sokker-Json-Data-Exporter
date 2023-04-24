export const USER_DATA = `/current`;

export const JUNIORS_REPORT = `/junior`;

export const CURRENT_WEEK_TRAINING = `/training`;
export const TRAINING_SUMMARY = `/training/summary`;
export const getPlayerFullReportURL = (playerId: string) =>
  `/training/${playerId}/report`;

export const getPlayerData = (playerId: string) => `/player/${playerId}`;
export const getTeamPlayersURL = (teamId: string) =>
  `/player?filter[team]=${teamId}&filter[limit]=200&filter[offset]=0`;
