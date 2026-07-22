const REQUIRED_PRODUCTION_VARIABLES = [
  "MONGO_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "BREVO_API_KEY",
  "CONTACT_EMAIL",
];

const validateEnvironment = () => {
  const missing = REQUIRED_PRODUCTION_VARIABLES.filter(
    (name) => !process.env[name]?.trim(),
  );

  if (process.env.NODE_ENV === "production" && missing.length) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(", ")}`,
    );
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.JWT_SECRET.trim().length < 32
  ) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }

  if (missing.length) {
    console.warn(
      `Optional local services are not fully configured: ${missing.join(", ")}`,
    );
  }
};

module.exports = validateEnvironment;
