import { Router } from 'express';
import {
  createOpinion,
  getOpinions,
  getOpinionById,
  updateOpinion,
  deleteOpinion,
} from './opinion.controller.js';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import {
  validateCreateOpinion,
  validateUpdateOpinion,
  validateOpinionId,
  validateOpinionQuery,
} from '../../middlewares/opinion-validation.js';
import { handleValidationErrors } from '../../middlewares/validation.js';

const router = Router();

/**
 * POST /
 * Crear una nueva opinión
 * Requiere autenticación
 */
router.post(
  '/',
  validateJWT,
  validateCreateOpinion,
  handleValidationErrors,
  createOpinion
);

/**
 * GET /
 * Obtener todas las opiniones activas
 * Soporta paginación y filtros
 */
router.get('/', validateOpinionQuery, handleValidationErrors, getOpinions);

/**
 * GET /:id
 * Obtener una opinión por ID
 */
router.get('/:id', validateOpinionId, handleValidationErrors, getOpinionById);

/**
 * PUT /:id
 * Actualizar una opinión
 * Solo el autor puede editar
 */
router.put(
  '/:id',
  validateJWT,
  validateUpdateOpinion,
  handleValidationErrors,
  updateOpinion
);

/**
 * DELETE /:id
 * Eliminar una opinión (soft delete)
 * Solo el autor puede eliminar
 */
router.delete('/:id', validateJWT, validateOpinionId, handleValidationErrors, deleteOpinion);

export default router;
