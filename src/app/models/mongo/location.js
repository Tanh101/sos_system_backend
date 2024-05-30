const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
    {
        requestId: { type: Number, required: true },
        userId: { type: Number, required: true },
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
        updatedAt: { type: Date, default: Date.now },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

locationSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('locations', locationSchema);
