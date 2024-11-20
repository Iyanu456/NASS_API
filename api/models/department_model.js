const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    thumbnail: {
        type: String,
      },
    description: {
      type: String,
      trim: true,
    },
    executives: [
      {
        name: { type: String, required: true, trim: true },
        image: { type: String},
        email: { type: String, required: true, trim: true },
        position: { type: String, required: true, trim: true },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("NASS_Department", departmentSchema);

module.exports = Department;
