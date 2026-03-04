/**
 * barber.model.js
 * Modelo/Mongoose schema del módulo **barbers**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const mongoose = require("mongoose");

const WeeklyAvailabilitySchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const BarberSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bio: { type: String },
    weeklyAvailability: { type: [WeeklyAvailabilitySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BarberProfile", BarberSchema);
