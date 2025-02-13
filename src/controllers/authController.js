const { loginService } = require("../services/authService"); // Asegúrate de que la ruta esté correcta

// Controlador para login
const loginController = async (req, res) => {
  const { username, password } = req.body; // Recibimos numPhone y password

  try {
    // Llamar al servicio de login
    const result = await loginService(username, password);

    // Responder con el mensaje y el token
    res.status(200).json(result);
  } catch (error) {
    // Manejo de errores
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { loginController };
