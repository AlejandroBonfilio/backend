const Message = require('../models/messages');

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
};

const createMessage = async (req, res) => {
  const { author, content } = req.body;
  const newMessage = new Message({ author, content });
  try {
    const createdMessage = await newMessage.save();
    res.status(201).json(createdMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el mensaje' });
  }
};

module.exports = {
  getAllMessages,
  createMessage,
};
