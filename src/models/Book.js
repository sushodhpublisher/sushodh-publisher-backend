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
      validate: [
        {
          validator: function (arr) {
            return (
              Array.isArray(arr) &&
              arr.length >= 1 &&
              arr.every((a) => typeof a === "string" && a.trim().length > 0)
            );
          },
          message: "At least 1 valid author name is required",
        },
      ],
    },
  },
  { timestamps: true },
);

/* ================= SLUG NORMALIZATION (CREATE) ================= */
bookSchema.pre("save", function (next) {
  if (this.slug) {
    this.slug = this.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }
  next();
});

/* ================= SLUG NORMALIZATION (UPDATE) ================= */
bookSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update && update.slug) {
    update.slug = update.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    this.setUpdate(update);
  }

  next();
});

module.exports = mongoose.model("Book", bookSchema);
