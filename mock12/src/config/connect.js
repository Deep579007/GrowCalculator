const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connect = () => {
    return mongoose.connect("mongodb+srv://deepactor:Sumasoft007@cluster0.b709iuz.mongodb.net/GROWCALCULATOR?retryWrites=true&w=majority");
};

module.exports = connect;
