const mongoose = require("mongoose");

const userLocationSchema = new mongoose.Schema(
    {
        userId: { type: Number, required: true },
        role: String,
        location: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    {
        timestamps: true
    }
);

userLocationSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("user_location", userLocationSchema);
