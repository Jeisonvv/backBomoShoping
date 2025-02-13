// controllers/folderController.js
const {
  deleteFoldersAfterRestart,
} = require("../services/deleteFolderService");

// Controlador para eliminar las carpetas
const deleteFoldersController = async (req, res) => {
  try {
    const result = await deleteFoldersAfterRestart(); // Llamar al servicio
    res.status(200).json(result); // Respuesta exitosa
  } catch (error) {
    res.status(500).json({ message: error.message }); // Manejo de errores
  }
};

module.exports = { deleteFoldersController };
