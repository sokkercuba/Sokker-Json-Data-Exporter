export const cweekToTrainingData = (data: any) => {
  if (!data || !data?.length) return {};

  return data.map(({ id, report }: any) => ({ id, reports: [report] }));
};
