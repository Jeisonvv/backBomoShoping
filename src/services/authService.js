const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Asegúrate de que la ruta esté correcta

// Servicio para el login de usuario
const loginService = async (username, password) => {
    try {
        // Buscar al usuario por su nombre de usuario
        let user = await User.findOne({ username });
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        // Comprobar si la contraseña almacenada tiene el formato de un hash bcrypt
        const isPasswordHashed = user.password.length === 60;  // El hash de bcrypt tiene una longitud de 60 caracteres

        let isMatch = false;
        if (isPasswordHashed) {
            // Si la contraseña está hasheada, usar bcrypt para compararlas
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Si no está hasheada, comparar directamente
            isMatch = (password === user.password);
        }

        if (!isMatch) {
            throw new Error('Contraseña incorrecta');
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: user._id, numPhone: user.numPhone, role: user.role }, // Datos que se guardan en el token
            'miSecreto', // Secreto de JWT (cámbialo por algo más seguro)
            { expiresIn: '1h' } // Expiración del token
        );

        // Retornar el token y el usuario
        return {
            message: "Login exitoso",
            token,
            user: {
                numPhone: user.numPhone,
                username: user.username,
                role: user.role
            }
        };
    } catch (error) {
        throw new Error('Error al iniciar sesión: ' + error.message);
    }
};

module.exports = { loginService };
