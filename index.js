require('dotenv').config();
const { connectDB } = require('./src/config/condb');

const appMogoShoping = require('./src/server');

const PORT = process.env.PORT || 3000;



connectDB().then(() => {
    appMogoShoping.listen(PORT, () => {
        console.log(`escuchando por el puert: ${PORT}`);
       
    });
}).catch((err) => {
    console.log(err);
});