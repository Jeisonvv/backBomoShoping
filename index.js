require('dotenv').config();
const { connectDB } = require('./src/config/condb');

const appMogoShoping = require('./src/server');

const PORT = process.env.PORT || 3000;

const HOST = process.env.HOST 

connectDB().then(() => {
    appMogoShoping.listen(PORT, () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
       
    });
}).catch((err) => {
    console.log(err);
});