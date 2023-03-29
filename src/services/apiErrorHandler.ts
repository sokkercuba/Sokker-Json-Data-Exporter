export const parseApiErrors = (code?: string) => {
  switch (code) {
    case "401":
      return "Your request was not authorized. Please log in to your sokker.org account.";
    case "404":
      return "The requested data was not found.";
    case "400":
      return "There was bad request error. This would possible mean that sokker api has changed. Please send us an email to sokkercuba@gmail.com or feel free to create an issue here: https://github.com/sokkercuba/Sokker-Json-Data-Exporter/issues";
    default:
      return "Something went wrong while trying to obtain sokker data. Please try again in a few seconds. Remember this will not work if sokker update process is active or you are not logged in sokker.org";
  }
};
