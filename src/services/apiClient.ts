import axios from "axios";

const TYPE = "application/json";
const CONTENT_TYPE = "Content-Type";
const baseURL = "https://sokker.org/api";

const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: TYPE,
    [CONTENT_TYPE]: TYPE,
  },
});

export default apiClient;
