/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "./apiClient";
import { USER_DATA, getPlayerFullReportURL } from "./apiURLs";

export const getTrainingReport = async (players: any) => {
  if (!players?.players) return { training: [] };

  const fullReportPromises = players.players.map((player: any) => {
    return apiClient.get(getPlayerFullReportURL(player.id));
  });

  const tResponse = await Promise.all(fullReportPromises);

  if (!tResponse) return { training: [] };

  const { today } = await apiClient
    .get(USER_DATA)
    .then((res) => res.data)
    .catch((err) => ({ data: [], error: err }));

  return {
    players,
    training: tResponse.map((t, i) => {
      const { reports } = t.data;
      reports?.pop();

      return {
        reports: reports.map((report: any) => {
          if (report.week === today.week) {
            return {
              ...report,
              age: players.players[i].info.characteristics.age,
            };
          }
          return report;
        }),
        id: players.players[i].id,
      };
    }),
  };
};
