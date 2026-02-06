export const getImageUrl = (path?: string) => {
  if (!path) return "";

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.BACKEND_BASE_URL
      : "http://localhost:5000";

  return `${baseUrl}${path}`;
};
