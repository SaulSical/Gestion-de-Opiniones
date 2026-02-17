import { Router } from 'express';
import {
  updateUserRole,
  getUserRoles,
  getUsersByRole,
  getProfile,
  updateProfile,
} from './user.controller.js';
import { validateUpdateProfile } from '../../middlewares/validation.js';

const router = Router();

// Ruta para obtener el perfil del usuario actual autenticado
router.get('/profile/me', ...getProfile);

// Ruta para actualizar el perfil del usuario actual autenticado
router.put('/profile/me', validateUpdateProfile, ...updateProfile);
router.get('/:userId/roles', ...getUserRoles);

// GET /api/v1/users/by-role/:roleName
router.get('/by-role/:roleName', ...getUsersByRole);

export default router;
