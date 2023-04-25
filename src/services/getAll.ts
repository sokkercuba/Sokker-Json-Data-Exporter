import {
  USER_DATA,
  JUNIORS_REPORT,
  CURRENT_WEEK_TRAINING,
  TRAINING_SUMMARY
} from './apiURLs'
import { apiClient } from './apiClient'
import { getTrainingReport } from './getTrainingReport'

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
    .catch((err) => ({ data: [], error: err }))
]

export const getAll = async () => {
  try {
    const [
      { data: user },
      { data: juniors },
      { data: cweek },
      { data: tsummary }
    ] = await Promise.all(getInitialPromises())

    const teamId = user?.team?.id

    if (!teamId) return null

    const { players, training } = await getTrainingReport(teamId)

    if (!players || !training) return null

    return {
      user,
      juniors,
      cweek,
      tsummary,
      players,
      training
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
