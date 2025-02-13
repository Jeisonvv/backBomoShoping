const { createUserWithPhoneService, updateUserService, getUserService, getUserByIdService, deleteUserService, getUserCredentialsService, updateCredentialsService, addProductToUserService, clearPurchasesService, getUserPurchasesService, deleteProductFromUserService, registerUserService , updatePurchasesServiceUsers } = require('../services/userService');

// Ruta para registrar un usuario solo con el número de teléfono
const registerUserController = async (req, res) => {
    try {
        const { numPhone } = req.body;

        if (!numPhone) {
            return res.status(400).json({ error: 'El número de teléfono es obligatorio' });
        }

        const newUser = await createUserWithPhoneService(numPhone);
        res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// controlador para registrar un usurio con nmumPhone, userName y Password
const registerUserPhoneControler = async (req, res) => {
    try {
        const user = await registerUserService(req.body);
        res.status(201).json({ message: 'Usuario registrado con éxito', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Controlador para actualizar los datos del usuario
const updateUserController = async (req, res) => {
    try {
        const {numPhone} = req.params; // Obtener el número de teléfono de los parámetros de la URL
        const userData = req.body; // Obtener los datos a actualizar del cuerpo de la solicitud
        // Llamamos al servicio para actualizar el usuario
        const updatedUser = await updateUserService(numPhone, userData);

        // Responder con el usuario actualizado
        res.status(200).json({
            message: "Usuario actualizado correctamente",
            user: updatedUser,
        });
    } catch (error) {
        // En caso de error, respondemos con el error
        res.status(400).json({
            message: "Error al actualizar el usuario",
            error: error.message,
        });
    }
};
//controlador para agregar un producto a un usuario
const addProductToUserController = async (req, res) => {
    try {
        const { numPhone } = req.params; // Obtener el número de teléfono desde los parámetros de la URL
        const productData = req.body; // Obtener los datos del producto desde el cuerpo de la solicitud

        // Llamar al servicio para agregar el producto al usuario
        const result = await addProductToUserService(numPhone, productData);

        // Responder con el mensaje de éxito
        res.status(200).json(result);
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
// controlador para modifar el array de compras
const updatePurchasesController = async (req, res) => {
    const { numPhone } = req.params; // Obtenemos el número de teléfono del usuario
    const { productsToUpdate } = req.body; // Obtenemos el array de productos a actualizar desde el cuerpo de la solicitud
  
    if (!Array.isArray(productsToUpdate) || productsToUpdate.length === 0) {
      return res.status(400).json({ message: 'Debe enviar un array de productos a actualizar', error });
    }
  
    try {
      // Llamamos al servicio para actualizar los productos
      const updatedUser = await updatePurchasesServiceUsers(numPhone, productsToUpdate);
  
      // Respondemos con éxito
      res.status(200).json({ message: 'Productos actualizados con éxito', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar productos', error: error.message });
    }
  };

// Controlador para actualizar las credenciales del usuario
const updateCredentialsController = async (req, res) => {
    const { numPhone } = req.params;
    const { username, password } = req.body;

    try {
        // Llamar al servicio para actualizar las credenciales
        const result = await updateCredentialsService(numPhone, username, password);

        // Responder con el mensaje de éxito
        res.status(200).json(result);
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Ruta para obtener todos los usuarios
const getUserController = async (req, res) => {
    try {
        const users = await getUserService();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Ruta para obtener un usuario por su id
const getUserByIdController = async (req, res) => {
    try {
        const { numPhone } = req.params;
        const user = await getUserByIdService(numPhone);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// optener las credenciales por el numero
const getUserCredentialsController = async (req, res) => {
    try {
        const { numPhone } = req.params; // Obtener el número de teléfono desde los parámetros de la URL

        // Llamar al servicio para obtener las credenciales
        const credentials = await getUserCredentialsService(numPhone);

        // Enviar las credenciales en la respuesta
        res.status(200).json({
            message: 'Credenciales obtenidas exitosamente.',
            credentials,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error al obtener las credenciales.',
            error: error.message,
        });
    }
};
// controlador para obtener las compras de un usuario
const getUserPurchasesController = async (req, res) => {
    try {
        const { numPhone } = req.params;
        const purchases = await getUserPurchasesService(numPhone);
        res.status(200).json(purchases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Controlador para eliminar un usuario
const deleteUserComtroller = async (req, res) => {
    try {
        const { numPhone } = req.params;
        await deleteUserService(numPhone);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//controlador para eliminar los productos de un usuario
const deleteProductFromUserController = async (req, res) => {
    const { numPhone } = req.params;
    try {
        // Llamar al servicio para vaciar el array de compras
        const result = await clearPurchasesService(numPhone);

        // Responder con el resultado
        res.status(200).json(result);
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

//controlador para eliminar un producto de un usuario
const removeProductUserController = async (req, res) => {
    const {numPhone} = req.params;
    const {productId} = req.body;

    try {
        // Llamar al servicio para eliminar el producto
        const result = await deleteProductFromUserService(numPhone, productId);

        // Responder con un mensaje de éxito
        res.status(200).json(result);
    } catch (error) {
        // Manejo de errores
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = { registerUserController, updateUserController, getUserController, getUserByIdController, deleteUserComtroller, getUserCredentialsController, updateCredentialsController, addProductToUserController, deleteProductFromUserController, getUserPurchasesController, removeProductUserController, registerUserPhoneControler, updatePurchasesController }; //exportamos los controladores
