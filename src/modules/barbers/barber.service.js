/**
 * barber.service.js
 * Lógica de negocio del módulo **barbers**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const repo = require("./barber.repository");

const list = () => repo.list();
const upsert = (userId, data) => repo.upsert(userId, data);

module.exports = { list, upsert };
