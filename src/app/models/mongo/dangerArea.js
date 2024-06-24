const mongoose = require("mongoose");

const dangerAreasSchema = new mongoose.Schema(
    {
        rescuerId: { type: Number, required: true },
        requestId: { type: Number, required: false },
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
        address: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

dangerAreasSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('danger_area', dangerAreasSchema);
