/**
 * appointment.routes.js
 * Rutas del módulo **appointments**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const router = require("express").Router();
const Joi = require("joi");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRoles } = require("../../middlewares/roles.middleware");
const controller = require("./appointment.controller");

const createSchema = Joi.object({
  barberId: Joi.string().required(),
  serviceId: Joi.string().required(),
  startAt: Joi.date().iso().required(),
  notes: Joi.string().allow("", null),
});

const statusSchema = Joi.object({
  status: Joi.string().valid("Pendiente", "Confirmada", "Cancelada", "Completada").required(),
});
/**
 * @openapi
 * /api/appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Agendar cita (solo Client)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [barberId, serviceId, startAt]
 *             properties:
 *               barberId: { type: string, example: "69a45fcfbe4b11b7307acc22" }
 *               serviceId: { type: string, example: "69a3c25790d7bd4942599a7e" }
 *               startAt: { type: string, format: date-time, example: "2026-04-03T20:00:00.000Z" }
 *               notes: { type: string, example: "Por favor puntual" }
 *     responses:
 *       201: { description: Cita creada (Pendiente) }
 *       403: { description: No autorizado }
 *       409: { description: Horario ocupado }
 */
router.post("/", authMiddleware, requireRoles("Client"), validate(createSchema), controller.create);
/**
 * @openapi
 * /api/appointments/me:
 *   get:
 *     tags: [Appointments]
 *     summary: Listar mis citas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas del usuario
 */
router.get("/me", authMiddleware, controller.listMine);
/**
 * @openapi
 * /api/appointments/{id}/status:
 *   put:
 *     tags: [Appointments]
 *     summary: Cambiar estado de una cita
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       403:
 *         description: No autorizado
 */
router.put("/:id/status", authMiddleware, validate(statusSchema), controller.updateStatus);

module.exports = router;
