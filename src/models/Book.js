const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    description: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    authors: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return (
            Array.isArray(arr) &&
            arr.length >= 1 &&
            arr.every((a) => typeof a === "string" && a.trim().length > 0)
          );
        },
        message: "At least 1 valid author name is required",
      },
    },
  },
  { timestamps: true },
);

/* ================= INDEXES ================= */
bookSchema.index({ isActive: 1 });
bookSchema.index({ isFeatured: 1 });
bookSchema.index({ isActive: 1, isFeatured: 1 });

/*
  IMPORTANT:
  Slug is generated & normalized in controller using slugify.
  Do NOT mutate slug here to avoid collisions.
*/

module.exports = mongoose.model("Book", bookSchema);
