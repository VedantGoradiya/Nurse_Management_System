export const validateString = (data: string) => {
  if (data === "" || data === null || data === undefined) {
    return false
  }
  return true
};
