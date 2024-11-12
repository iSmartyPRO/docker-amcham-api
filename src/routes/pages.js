const express = require("express")
const router = express.Router()
const controller = require("../controllers/pages")
const checkAuthHeader = require('../utils/authMiddleware'); // Импортируем middleware

router.get('/', controller.home)
router.post('/appForm', checkAuthHeader, controller.appForm)


module.exports = router