// emailAppForm.js
const config = require("../config")
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

// Функция для генерации массива вложений
const generateAttachments = (filePaths) => {
    return filePaths.map(filePath => ({
        filename: path.basename(filePath), // Имя файла
        path: filePath, // Путь к файлу
    }));
};

// Функция для отправки письма с использованием шаблона
const emailAppForm = async (recipients, subject, templateData, attachmentsArr) => {
    try {
        // Шаблон письма (HTML-шаблон)
        const emailTemplate = fs.readFileSync(path.join(__dirname, '..', 'templates', 'appFormEmail.html'), 'utf-8');
        
        // Компиляция шаблона с использованием Handlebars
        const compiledTemplate = handlebars.compile(emailTemplate);

        // Генерация HTML содержимого письма
        const htmlToSend = compiledTemplate(templateData);

        // Генерация фпйлов вложений
        const attachments = generateAttachments(attachmentsArr); 

        // Создаем транспорт для отправки письма
        console.log(config.mailServer)
        const transporter = nodemailer.createTransport(config.mailServer);

        // Параметры письма
        const mailOptions = {
            from: `${config.appForm.fromName} <${config.mailServer.auth.user}>`, // Ваш e-mail
            to: recipients.join(', '), // Получатели (массив адресов)
            subject: subject, // Тема письма
            html: htmlToSend, // Сгенерированное HTML-содержимое
            attachments
        };

        // Отправка письма
        const info = await transporter.sendMail(mailOptions);
        console.log('Письмо отправлено:', info.response);
        return {status: "OK", message: "Письмо отправлено", details: info.response, attachmentsArr}
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        return {status: "Bad", message: "Ошибка при отправке письма", details: error}

    }
};

// Экспортируем функцию sendEmail
module.exports = emailAppForm;
