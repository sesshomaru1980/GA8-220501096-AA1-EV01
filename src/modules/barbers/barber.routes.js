/**
 * barber.routes.js
 * Rutas del módulo **barbers**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */
/**
 * @openapi
 * tags:
 *   - name: Barbers
 *     description: Perfiles de barberos y disponibilidad semanal
 */
const router = require("express").Router();
const Joi = require("joi");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRoles } = require("../../middlewares/roles.middleware");
const controller = require("./barber.controller");

const upsertSchema = Joi.object({
  userId: Joi.string().required(),
  bio: Joi.string().allow("", null),
  weeklyAvailability: Joi.array().items(
    Joi.object({
      dayOfWeek: Joi.number().integer().min(0).max(6).required(),
      start: Joi.string().required(),
      end: Joi.string().required(),
    })
  ).default([]),
});
/**
 * @openapi
 * /api/barbers:
 *   get:
 *     tags: [Barbers]
 *     summary: Listar barberos
 *     description: Lista perfiles de barberos con datos básicos del usuario (fullName, email, role).
 *                   Lista perfiles de barberos con usuario activo (isActive=true).
 *     responses:
 *       200:
 *         description: Lista de barberos
 */
router.get("/", controller.list);
/**
 * @openapi
 * /api/barbers/upsert:
 *   post:
 *     tags: [Barbers]
 *     summary: Crear o actualizar perfil del barbero
 *     description: Crea o actualiza el perfil del barbero (bio + disponibilidad semanal).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario con rol Barber
 *                 example: 69a45fcfbe4b11b7307acc22
 *               bio:
 *                 type: string
 *                 example: Especialista en fades y barba
 *               weeklyAvailability:
 *                 type: array
 *                 description: Disponibilidad semanal (0=Domingo ... 6=Sábado)
 *                 items:
 *                   type: object
 *                   required: [dayOfWeek, start, end]
 *                   properties:
 *                     dayOfWeek:
 *                       type: integer
 *                       example: 1
 *                     start:
 *                       type: string
 *                       example: "09:00"
 *                     end:
 *                       type: string
 *                       example: "18:00"
 *     responses:
 *       200:
 *         description: Perfil guardado
 *       401:
 *         description: Token requerido o inválido
 *       403:
 *         description: No autorizado (solo Admin o Barber)
 */
router.post("/upsert", authMiddleware, requireRoles("Admin", "Barber"), validate(upsertSchema), controller.upsert);

module.exports = router;
