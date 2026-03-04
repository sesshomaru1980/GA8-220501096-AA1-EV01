/**
 * service.routes.js
 * Rutas del módulo **services**. Archivo parte de la arquitectura por capas (routes → controller → service → repository/model).
 *
 * Nota: Este archivo incluye comentarios para facilitar mantenimiento, revisión y evaluación académica.
 */

const router = require("express").Router();
const Joi = require("joi");
const { validate } = require("../../middlewares/validate.middleware");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const { requireRoles } = require("../../middlewares/roles.middleware");
const controller = require("./service.controller");

const createSchema = Joi.object({
  name: Joi.string().min(3).max(80).required(),
  description: Joi.string().allow("", null),
  durationMinutes: Joi.number().integer().min(10).max(240).required(),
  price: Joi.number().min(0).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(80),
  description: Joi.string().allow("", null),
  durationMinutes: Joi.number().integer().min(10).max(240),
  price: Joi.number().min(0),
  isActive: Joi.boolean(),
});
/**
 * @openapi
 * /api/services:
 *   get:
 *     tags: [Services]
 *     summary: Listar todos los servicios
 *     responses:
 *       200:
 *         description: Lista de servicios
 */
router.get("/", controller.list);
/**
 * @openapi
 * /api/services:
 *   post:
 *     tags: [Services]
 *     summary: Crear servicio (solo Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - durationMinutes
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Corte Ejecutivo
 *               description:
 *                 type: string
 *                 example: Corte clásico profesional
 *               durationMinutes:
 *                 type: integer
 *                 example: 30
 *               price:
 *                 type: number
 *                 example: 20000
 *     responses:
 *       201:
 *         description: Servicio creado correctamente
 *       403:
 *         description: No autorizado
 */
router.post("/", authMiddleware, requireRoles("Admin"), validate(createSchema), controller.create);
/**
 * @openapi
 * /api/services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Actualizar servicio (solo Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               durationMinutes: { type: integer }
 *               price: { type: number }
 *               isActive: { type: boolean }
 *     responses:
 *       200: { description: Servicio actualizado }
 *       403: { description: No autorizado }
 */
router.put("/:id", authMiddleware, requireRoles("Admin"), validate(updateSchema), controller.update);
/**
 * @openapi
 * /api/services/{id}:
 *   delete:
 *     tags: [Services]
 *     summary: Eliminar servicio (solo Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Eliminado }
 *       403: { description: No autorizado }
 */
router.delete("/:id", authMiddleware, requireRoles("Admin"), controller.remove);

module.exports = router;
