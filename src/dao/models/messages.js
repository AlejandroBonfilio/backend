const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Definir los campos del esquema del mensaje
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
