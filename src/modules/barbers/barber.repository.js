/**
 * barber.repository.js
 * Acceso a datos (repositorio) del módulo **barbers**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const BarberProfile = require("./barber.model");

/**
 * Lista barberos activos.
 * Nota: Filtra por usuarios activos usando populate + match.
 * Si el usuario está desactivado (isActive=false), no se incluye en la lista.
 */
const list = async () => {
  const barbers = await BarberProfile.find()
    .populate({
      path: "userId",
      select: "fullName email role isActive",
      match: { isActive: true }, // ✅ solo usuarios activos
    })
    .lean();

  // populate con match deja userId = null cuando no cumple; los filtramos
  return barbers.filter((b) => b.userId);
};
const getByUserId = (userId) => BarberProfile.findOne({ userId }).lean();
const upsert = (userId, data) =>
  BarberProfile.findOneAndUpdate({ userId }, { userId, ...data }, { upsert: true, new: true }).lean();

module.exports = { list, getByUserId, upsert };
