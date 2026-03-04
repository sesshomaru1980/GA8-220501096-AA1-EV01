/**
 * appointment.model.js
 * Modelo/Mongoose schema del módulo **appointments**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    barberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    status: { type: String, enum: ["Pendiente", "Confirmada", "Cancelada", "Completada"], default: "Pendiente" },
    notes: { type: String },
  },
  { timestamps: true }
);

AppointmentSchema.index({ barberId: 1, startAt: 1, endAt: 1 });

module.exports = mongoose.model("Appointment", AppointmentSchema);
