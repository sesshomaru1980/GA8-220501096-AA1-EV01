/**
 * barber.controller.js
 * Controlador HTTP del módulo **barbers**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const service = require("./barber.service");

async function list(req, res, next) { try { res.json(await service.list()); } catch (e) { next(e); } }
async function upsert(req, res, next) { try { res.json(await service.upsert(req.body.userId, req.body)); } catch (e) { next(e); } }

module.exports = { list, upsert };
