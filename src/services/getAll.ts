/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import {
  USER_DATA,
  JUNIORS_REPORT,
  CURRENT_WEEK_TRAINING,
  TRAINING_SUMMARY,
  getPlayerFullReportURL,
  getTeamPlayersURL
} from './apiURLs'
import { apiClient } from './apiClient'

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

    const pdata = await apiClient
      .get(getTeamPlayersURL(teamId))
      .then((response) => {
        const { status, data } = response || null

        if (status === 200 && data && !data?.error) {
          return data
        }
        if (data?.error) {
          return null
        }
      })
      .catch((error: AxiosError) => {
        console.log('🚀 ~ error:', error)
        return null
      })

    if (!pdata?.players) return null

    const fullReportPromises = pdata.players.map((player: any) => {
      return apiClient.get(getPlayerFullReportURL(player.id))
    })

    const tResponse = await Promise.all(fullReportPromises)

    if (!tResponse) return null

    return {
      user,
      juniors,
      cweek,
      tsummary,
      players: pdata,
      training: tResponse.map((t, i) => ({
        ...t.data,
        id: pdata.players[i].id
      }))
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
