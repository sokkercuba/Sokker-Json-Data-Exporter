import {
  USER_DATA,
  JUNIORS_REPORT,
  CURRENT_WEEK_TRAINING,
  TRAINING_SUMMARY,
  getTeamPlayersURL,
} from "./apiURLs";
import { AxiosError } from "axios";
import { apiClient } from "./apiClient";
import { getTrainingReport } from "./getTrainingReport";
import { cweekToTrainingData } from "../utils/cweekToTrainingData";

const getInitialPromises = () => [
  apiClient
    .get(USER_DATA)
    .then((res) => res)
    .catch((err) => ({ data: [], error: err })),
  apiClient
    .get(JUNIORS_REPORT)
    .then((res) => res)
    .catch((err) => ({ data: [], error: err })),
  apiClient
    .get(CURRENT_WEEK_TRAINING)
    .then((res) => res)
    .catch((err) => ({ data: [], error: err })),
  apiClient
    .get(TRAINING_SUMMARY)
    .then((res) => res)
    .catch((err) => ({ data: [], error: err })),
];

export const getAll = async () => {
  try {
    const [
      { data: user },
      { data: juniors },
      { data: cweek },
      { data: tsummary },
    ] = await Promise.all(getInitialPromises());

    const teamId = user?.team?.id;
    const plus = user?.plus;

    if (!teamId) return { code: "404" };

    const players = await apiClient
      .get(getTeamPlayersURL(teamId))
      .then((response) => {
        const { status, data } = response || null;

        if (status === 200 && data && !data?.error) {
          return data;
        }
        if (data?.error) {
          return data?.error;
        }
      })
      .catch((error: AxiosError) => {
        console.log("🚀 ~ error:", error);
        return error;
      });

    if (!plus) {
      if (!cweek || !cweek?.players || !players) {
        return { code: "404" };
      }

      return {
        user,
        juniors,
        cweek,
        tsummary,
        players,
        training: cweekToTrainingData(cweek?.players),
        code: 200,
      };
    }

    const { training } = await getTrainingReport(players);

    if (!training) return null;

    return {
      user,
      juniors,
      cweek,
      tsummary,
      players,
      training,
      code: 200,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};
