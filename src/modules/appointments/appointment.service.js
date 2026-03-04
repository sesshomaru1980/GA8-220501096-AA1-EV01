/**
 * appointment.service.js
 * Lógica de negocio del módulo **appointments**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const appointmentRepo = require("./appointment.repository");
const serviceRepo = require("../services/service.repository");
const timeBlockRepo = require("../availability/timeblock.repository");

async function create(clientId, { barberId, serviceId, startAt, notes }) {
  const service = await serviceRepo.getById(serviceId);
  if (!service || !service.isActive) {
    const err = new Error("Servicio inválido");
    err.statusCode = 400;
    throw err;
  }

  const start = new Date(startAt);
  if (isNaN(start.getTime())) {
    const err = new Error("Fecha startAt inválida (ISO)");
    err.statusCode = 400;
    throw err;
  }

  if (start.getTime() < Date.now() - 60 * 1000) {
    const err = new Error("No puedes agendar en el pasado");
    err.statusCode = 400;
    throw err;
  }

  const end = new Date(start.getTime() + service.durationMinutes * 60000);

  const overlapAppt = await appointmentRepo.hasOverlap(barberId, start, end);
  if (overlapAppt) {
    const err = new Error("El barbero ya tiene una cita en ese horario");
    err.statusCode = 409;
    throw err;
  }

  const overlapBlock = await timeBlockRepo.hasOverlap(barberId, start, end);
  if (overlapBlock) {
    const err = new Error("El barbero no está disponible en ese horario (bloqueado)");
    err.statusCode = 409;
    throw err;
  }

  return appointmentRepo.create({ clientId, barberId, serviceId, startAt: start, endAt: end, notes });
}

async function listMine(user) {
  if (user.role === "Barber") return appointmentRepo.findByBarber(user.sub);
  return appointmentRepo.findByClient(user.sub);
}

async function updateStatus(id, status, user) {
  const appt = await appointmentRepo.findById(id);
  if (!appt) { const err = new Error("Cita no encontrada"); err.statusCode = 404; throw err; }

  const isAdmin = user.role === "Admin";
  const allowed = isAdmin || appt.clientId?.toString() === user.sub || appt.barberId?.toString() === user.sub;
  if (!allowed) { const err = new Error("No autorizado"); err.statusCode = 403; throw err; }

  return appointmentRepo.updateStatus(id, status);
}

module.exports = { create, listMine, updateStatus };
