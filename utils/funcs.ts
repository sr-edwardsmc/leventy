export const getISODateGMTminus5 = (date: Date): string => {
  return new Date(date.getTime() - 5 * 60 * 60000).toISOString();
};
