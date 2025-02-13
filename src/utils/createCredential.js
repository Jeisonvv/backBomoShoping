const crypto = require("crypto");

const createRandomUsernameAndPassword = () => {
  const username = `user${Math.floor(Math.random() * 100000)}`; // Ejemplo: user12345
  const password = `${crypto.randomBytes(6).toString("hex")}`; // Genera una contraseña aleatoria de 12 caracteres
  return { username, password };
};

module.exports = createRandomUsernameAndPassword;
