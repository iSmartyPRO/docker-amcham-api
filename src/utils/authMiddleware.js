// authMiddleware.js

const config = require("../config")

// Middleware для проверки заголовка Authorization
const checkAuthHeader = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        // Если заголовок отсутствует, отправляем ошибку 401
        return res.status(401).json({ error: 'Отсутствует заголовок Authorization' });
    }

    // Если требуется, можно добавить проверку токена (например, JWT)
    const token = authHeader.split(' ')[1]; // Предполагаем, что заголовок имеет формат "Bearer <token>"
    if (token !== config.AuthorizationKey) { // Замените на свою логику проверки
        return res.status(403).json({ error: 'Неверный токен' });
    }

    next(); // Переходим к следующему middleware или маршруту
};

module.exports = checkAuthHeader;
