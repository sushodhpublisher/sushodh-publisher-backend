export const getImageUrl = (path?: string) => {
  if (!path) return "";
  return `http://localhost:5000${path}`;
};
