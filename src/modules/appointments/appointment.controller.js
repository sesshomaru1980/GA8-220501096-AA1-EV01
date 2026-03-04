/**
 * appointment.controller.js
 * Controlador HTTP del módulo **appointments**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const service = require("./appointment.service");

async function create(req, res, next) { try { res.status(201).json(await service.create(req.user.sub, req.body)); } catch (e) { next(e); } }
async function listMine(req, res, next) { try { res.json(await service.listMine(req.user)); } catch (e) { next(e); } }
async function updateStatus(req, res, next) { try { res.json(await service.updateStatus(req.params.id, req.body.status, req.user)); } catch (e) { next(e); } }

module.exports = { create, listMine, updateStatus };
