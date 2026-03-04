/**
 * appointment.repository.js
 * Acceso a datos (repositorio) del módulo **appointments**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const Appointment = require("./appointment.model");

const create = (data) => Appointment.create(data);
const findByClient = (clientId) => Appointment.find({ clientId }).populate("serviceId").lean();
const findByBarber = (barberId) => Appointment.find({ barberId }).populate("serviceId").lean();
const findById = (id) => Appointment.findById(id).lean();

async function hasOverlap(barberId, startAt, endAt) {
  const count = await Appointment.countDocuments({
    barberId,
    status: { $ne: "Cancelada" },
    startAt: { $lt: endAt },
    endAt: { $gt: startAt },
  });
  return count > 0;
}

const updateStatus = (id, status) => Appointment.findByIdAndUpdate(id, { status }, { new: true }).lean();

module.exports = { create, findByClient, findByBarber, findById, hasOverlap, updateStatus };
