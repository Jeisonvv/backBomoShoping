const fs = require('fs-extra');
const path = require('path');

// Función para reiniciar el servidor y eliminar las carpetas
const deleteFoldersAfterRestart = () => {
    // Reiniciar el servidor
    setTimeout(() => {
        const folderPaths = [
            path.join(__dirname, '..', '.wwebjs_cache'),
            path.join(__dirname, '..', '.wwebjs_auth')
        ];

        folderPaths.forEach(folderPath => {
            if (fs.existsSync(folderPath)) {
                console.log(`Eliminando la carpeta: ${folderPath}`);
                fs.remove(folderPath, err => {
                    if (err) console.error("Error al eliminar carpeta:", err);
                    else console.log(`${folderPath} eliminada con éxito`);
                });
            }
        });
    }, 5000);  // Espera 5 segundos para dar tiempo a que el servidor se reinicie

    return { message: "Intentando eliminar las carpetas después de reiniciar." };
};

module.exports = { deleteFoldersAfterRestart };
