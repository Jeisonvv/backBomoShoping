const { connectDB } = require('./src/config/condb');
const appMogoShoping = require('./src/server');
const {initializeReactionListener, } = require('./src/services/whatsappService');

const PORT = process.env.PORT || 3000;

const HOST = process.env.HOST 

connectDB().then(() => {
    appMogoShoping.listen(PORT, HOST, () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
       
    });
}).catch((err) => {
    console.log(err);
});