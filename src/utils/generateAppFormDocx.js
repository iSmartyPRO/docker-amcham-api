const config = require('../config');
const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const moment = require('moment-timezone');
const saveCompanyLogo = require('../utils/saveCompanyLogo');

// Функция генерации DOCX
const generateAppFormDocx = async (data) => {
    // Генерация уникального имени файла
    const timeDateStr = moment().tz(config.TZ).format('YYYY-MM-DD_HHmmss');
    const uniqueId = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Уникальный 4-значный ID
    const outputFileName = `appForm_${timeDateStr}_${uniqueId}.docx`;
    const outputLogoFileName = path.join(__dirname, '..', 'output', `company-logo_${timeDateStr}_${uniqueId}`);
    const outputPath = path.join(__dirname, '..', 'output', outputFileName);
    
    let logoResult
    if(data.companyLogo){
        logoResult = await saveCompanyLogo(data.companyLogo, outputLogoFileName)
    }
    // Шаг 1: Чтение шаблона .docx
    const templatePath = path.join(__dirname, '..', 'templates', 'appForm.docx');
    const content = fs.readFileSync(templatePath, 'binary');

    // Шаг 2: Загрузка шаблона с помощью PizZip
    const zip = new PizZip(content);

    // Шаг 3: Создание экземпляра Docxtemplater с загруженным шаблоном
    const doc = new Docxtemplater(zip, {
        nullGetter: (part) => {
            // Проверка, какая переменная отсутствует, и возвращение значения по умолчанию
            switch(part.value) {
                case 'company':
                    return 'Название компании не указано';
                case 'companyEstablishmentDate':
                    return 'Дата основания компании не указана';
                default:
                    return 'Не указано'; // Пустая строка для всех остальных переменных
            }
        }
    });

    // Дата заполнения заявки:
    data.appFormDateTime = `Дата: ${moment().tz(config.TZ).format('DD.MM.YYYY')}, Время: ${moment().tz(config.TZ).format('HH:mm:ss')}`
    data.appFormAcceptance = data.appFormAcceptance == '1' ? "Подтверждено согласие на обработку персональных данных" : "Не указано"
    // Шаг 4: Установка данных (замена заполнителей на реальные значения)
    doc.setData(data);

    try {
        // Шаг 5: Рендеринг документа (замена заполнителей на данные)
        doc.render();

        // Шаг 6: Получение итогового документа в виде буфера
        const buf = doc.getZip().generate({ type: 'nodebuffer' });

        // Шаг 7: Сохранение итогового документа в файл
        fs.writeFileSync(outputPath, buf);
        const docxFilePath = path.join(__dirname, '..', 'output', outputFileName)
        if (fs.existsSync(docxFilePath)) {
            const outputFiles = {docx: docxFilePath}
            if(logoResult && logoResult.status == "OK") {
                outputFiles.logo = logoResult.logoFilePath
            }
            return {status: "OK", message: 'Документ успешно сгенерирован!', outputFiles}
        }
    } catch (error) {
        console.error('Ошибка при генерации документа:', error);
        return {status: "Bad", message: "Ошибка при генерации документа"}
    }
};

// Экспортируем функцию для использования в других файлах
module.exports = generateAppFormDocx;
