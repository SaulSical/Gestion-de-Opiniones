import { findUserById, updateUserProfile, checkUsernameExists } from './user-db.js';
import { buildUserResponse } from '../utils/user-helpers.js';
import { verifyPassword, hashPassword } from '../utils/password-utils.js';

export const getUserProfileHelper = async (userId) => {
  // Obtener el perfil del usuario por su ID
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  return buildUserResponse(user);
};

export const updateUserProfileHelper = async (userId, updateData) => {
  // Validar que el usuario existe
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }

  // Preparar datos a actualizar
  const dataToUpdate = {};

  // Si se intenta actualizar el nombre de usuario, validar que no esté en uso
  if (updateData.username && updateData.username !== user.Username) {
    const usernameExists = await checkUsernameExists(updateData.username);
    if (usernameExists) {
      throw new Error('El nombre de usuario ya está en uso');
    }
    dataToUpdate.Username = updateData.username.trim();
  }

  // Actualizar nombre
  if (updateData.name) {
    dataToUpdate.Name = updateData.name.trim();
  }

  // Actualizar apellido
  if (updateData.surname) {
    dataToUpdate.Surname = updateData.surname.trim();
  }

  // Si se desea cambiar la contraseña, validar la contraseña anterior
  if (updateData.newPassword) {
    if (!updateData.currentPassword) {
      throw new Error('La contraseña actual es requerida para cambiar la contraseña');
    }

    // Verificar que la contraseña actual sea correcta
    const isPasswordValid = await verifyPassword(
      updateData.currentPassword,
      user.Password
    );

    if (!isPasswordValid) {
      throw new Error('La contraseña actual es incorrecta');
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hashPassword(updateData.newPassword);
    dataToUpdate.Password = hashedPassword;
  }

  // Si hay datos para actualizar, realizar la actualización
  if (Object.keys(dataToUpdate).length === 0) {
    throw new Error('No hay datos para actualizar');
  }

  const updatedUser = await updateUserProfile(userId, dataToUpdate);
  return buildUserResponse(updatedUser);
};
