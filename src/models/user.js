const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Librería para hashear contraseñas

const userSchema = new mongoose.Schema({
    numPhone: { 
        type: String, 
        required: true, 
    },
    username: { 
        type: String, 
        default: '' 
    },
    password: { 
        type: String, 
        default: '' 
    },
    name: { type: String, default: '' },
    address: { type: String, default: '' },
    locality: { type: String, default: '' },
    neighborhood: { type: String, default: '' },
    purchases: [
        {
            urlProduct: { type: String, required: true },
            productId: { type: String, required: true },
            productName: { type: String, required: true },
            price: { type: Number, required: true },
            purchaseDate: { type: String, required: true},
            purchaseTime: { type: String, required: true },
            status: { type: String, enum: ['bodega', 'entregado'], default: 'bodega' },
            paid: { type: Boolean, default: false },
        }
    ],
    role: { 
        type: String, 
        enum: ['comprador', 'trabajador', 'administrador'], 
        default: 'comprador' // Asignar el rol "comprador" por defecto
    },  // Campo para definir el rol del usuario
    autoGeneratedPassword: { // Asegúrate de definir esta propiedad en el esquema
        type: Boolean,
        default: false
    },
});

// Hashear la contraseña antes de guardarla
userSchema.pre('save', async function (next) {

    if (this.autoGeneratedPassword) {
        
        return next();  // Skip hashing if password is auto-generated
    }

    // Si la contraseña es modificada por el usuario, la hasheamos
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
    }

    next();
});



// Método para verificar si la contraseña ingresada es correcta
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
