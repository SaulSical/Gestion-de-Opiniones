import Comment from './comment.model.js';
import Opinion from '../opinions/opinion.model.js';

// Crear comentario
export const createComment = async (req, res) => {
  try {
    const { opinionId, content } = req.body;
    const { userId, user } = req;

    // Verificar que la opinión existe
    const opinion = await Opinion.findById(opinionId);
    if (!opinion || !opinion.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Opinión no encontrada',
      });
    }

    const comment = new Comment({
      opinionId,
      content,
      authorId: userId,
      authorName: `${user.Name} ${user.Surname}`,
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      data: comment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear comentario',
      error: error.message,
    });
  }
};

// Obtener comentarios de una opinión
export const getCommentsByOpinion = async (req, res) => {
  try {
    const { opinionId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Verificar que la opinión existe
    const opinion = await Opinion.findById(opinionId);
    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinión no encontrada',
      });
    }

    const filter = { opinionId, isActive: true };

    const comments = await Comment.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Comment.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener comentarios',
      error: error.message,
    });
  }
};

// Obtener comentario por ID
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener comentario',
      error: error.message,
    });
  }
};

// Actualizar comentario (solo el autor)
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const { content } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado',
      });
    }

    // Verificar que el usuario sea el autor
    if (comment.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este comentario',
      });
    }

    if (content !== undefined) {
      comment.content = content;
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comentario actualizado exitosamente',
      data: comment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar comentario',
      error: error.message,
    });
  }
};

// Eliminar comentario (solo el autor) - soft delete
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comentario no encontrado',
      });
    }

    // Verificar que el usuario sea el autor
    if (comment.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este comentario',
      });
    }

    // Soft delete
    comment.isActive = false;
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comentario eliminado exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar comentario',
      error: error.message,
    });
  }
};
