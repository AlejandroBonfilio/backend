const express = require('express');
const messagesController = require('../dao/controllers/messagesController');

const router = express.Router();

router.get('/', messagesController.getAllMessages);
router.post('/', messagesController.createMessage);

module.exports = router;
