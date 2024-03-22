// server/models/Document.js
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    content: String,
});

const Document = mongoose.model('Document', DocumentSchema);

module.exports = Document;
