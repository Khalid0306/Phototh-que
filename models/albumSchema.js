const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    images: [String],
}, { timestamps: true }, { bufferTimeoutMS: 30000 });

module.exports = mongoose.model('Album', albumSchema);