import Opinion from './opinion.model.js';

// Crear opinión
export const createOpinion = async (req, res) => {
  try {
    const { title, category, content } = req.body;
    const { userId, user } = req;

    const opinion = new Opinion({
      title,
      category,
      content,
      authorId: userId,
      authorName: `${user.Name} ${user.Surname}`,
    });

    await opinion.save();

    res.status(201).json({
      success: true,
      message: 'Opinión creada exitosamente',
      data: opinion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear opinión',
      error: error.message,
    });
  }
};

// Obtener todas las opiniones (con paginación y filtros)
export const getOpinions = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, authorId } = req.query;

    const filter = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (authorId) {
      filter.authorId = authorId;
    }

    const opinions = await Opinion.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Opinion.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: opinions,
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
      message: 'Error al obtener opiniones',
      error: error.message,
    });
  }
};

// Obtener opinión por ID
export const getOpinionById = async (req, res) => {
  try {
    const { id } = req.params;

    const opinion = await Opinion.findById(id);

    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinión no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      data: opinion,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener opinión',
      error: error.message,
    });
  }
};

// Actualizar opinión (solo el autor)
export const updateOpinion = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;
    const { title, category, content } = req.body;

    const opinion = await Opinion.findById(id);

    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinión no encontrada',
      });
    }

    // Verificar que el usuario sea el autor
    if (opinion.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar esta opinión',
      });
    }

    // Actualizar campos
    if (title !== undefined) opinion.title = title;
    if (category !== undefined) opinion.category = category;
    if (content !== undefined) opinion.content = content;

    await opinion.save();

    res.status(200).json({
      success: true,
      message: 'Opinión actualizada exitosamente',
      data: opinion,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar opinión',
      error: error.message,
    });
  }
};

// Eliminar opinión (solo el autor) - soft delete
export const deleteOpinion = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req;

    const opinion = await Opinion.findById(id);

    if (!opinion) {
      return res.status(404).json({
        success: false,
        message: 'Opinión no encontrada',
      });
    }

    // Verificar que el usuario sea el autor
    if (opinion.authorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta opinión',
      });
    }

    // Soft delete
    opinion.isActive = false;
    await opinion.save();

    res.status(200).json({
      success: true,
      message: 'Opinión eliminada exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar opinión',
      error: error.message,
    });
  }
};
