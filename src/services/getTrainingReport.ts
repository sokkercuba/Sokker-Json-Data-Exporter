/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios'
import { apiClient } from './apiClient'
import { USER_DATA, getPlayerFullReportURL, getTeamPlayersURL } from './apiURLs'

const emptyResult = { players: null, training: null }

export const getTrainingReport = async (teamId: string) => {
  const players = await apiClient
    .get(getTeamPlayersURL(teamId))
    .then((response) => {
      const { status, data } = response || null

      if (status === 200 && data && !data?.error) {
        return data
      }
      if (data?.error) {
        return emptyResult
      }
    })
    .catch((error: AxiosError) => {
      console.log('🚀 ~ error:', error)
      return emptyResult
    })

  if (!players?.players) return emptyResult

  const fullReportPromises = players.players.map((player: any) => {
    return apiClient.get(getPlayerFullReportURL(player.id))
  })

  const tResponse = await Promise.all(fullReportPromises)

  if (!tResponse) return emptyResult

  const { today } = await apiClient
    .get(USER_DATA)
    .then((res) => res.data)
    .catch((err) => ({ data: [], error: err }))

  return {
    players,
    training: tResponse.map((t, i) => {
      const { reports } = t.data
      reports?.pop()

      return {
        reports: reports.map((report: any) => {
          if (report.week === today.week) {
            return {
              ...report,
              age: players.players[i].info.characteristics.age
            }
          }
          return report
        }),
        id: players.players[i].id
      }
    })
  }
}
