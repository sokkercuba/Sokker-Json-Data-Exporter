import axios from 'axios'

const TYPE = 'application/json'
const CONTENT_TYPE = 'Content-Type'
const baseURL = 'https://sokker.org/api'

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: TYPE,
    [CONTENT_TYPE]: TYPE
  }
})
