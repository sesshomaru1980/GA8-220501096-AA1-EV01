/**
 * service.controller.js
 * Controlador HTTP del módulo **services**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const service = require("./service.service");

async function list(req, res, next) { try { res.json(await service.list()); } catch (e) { next(e); } }
async function create(req, res, next) { try { res.status(201).json(await service.create(req.body)); } catch (e) { next(e); } }
async function update(req, res, next) { try { res.json(await service.update(req.params.id, req.body)); } catch (e) { next(e); } }
async function remove(req, res, next) { try { await service.remove(req.params.id); res.status(204).send(); } catch (e) { next(e); } }

module.exports = { list, create, update, remove };
