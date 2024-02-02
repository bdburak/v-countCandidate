const mongoose = require('mongoose');

const countriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    }
});

//                             name of the model in databese, schema
module.exports = mongoose.model('Countries', countriesSchema);

