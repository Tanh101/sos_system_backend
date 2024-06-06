const mongoose = require("mongoose");

const dangerAreasSchema = new mongoose.Schema(
    {
        requestId: { type: Number, required: true },
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
        radius: { type: Number, required: true },
        message: { type: String, required: true },
        status: { type: String, required: true, default: "active" },
    },
    {
        timestamps: true,
    }
);

dangerAreasSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('danger_area', dangerAreasSchema);
