const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');

// Функция генерации DOCX
const generateAppFormDocx = async (data) => {
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
                case 'date':
                    return 'Дата не указана';
                default:
                    return 'Не указано'; // Пустая строка для всех остальных переменных
            }
        }
    });

    // Шаг 4: Установка данных (замена заполнителей на реальные значения)
    doc.setData(data);

    try {
        // Шаг 5: Рендеринг документа (замена заполнителей на данные)
        doc.render();

        // Шаг 6: Получение итогового документа в виде буфера
        const buf = doc.getZip().generate({ type: 'nodebuffer' });

        // Шаг 7: Сохранение итогового документа в файл
        // Генерация уникального имени файла
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // Формат YYYY-MM-DD
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, ''); // Формат HHMMSS
        const uniqueId = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Уникальный 4-значный ID
        const outputFileName = `appForm_${dateStr}_${timeStr}_${uniqueId}.docx`;
        const outputPath = path.join(__dirname, '..', 'output', outputFileName);
        fs.writeFileSync(outputPath, buf);
        if (fs.existsSync(path.join(__dirname, '..', 'output', outputFileName))) {
            return {status: "OK", message: 'Документ успешно сгенерирован!', outputFileName}
        }
    } catch (error) {
        console.error('Ошибка при генерации документа:', error);
        return {status: "Bad", message: "Ошибка при генерации документа"}
    }
};

// Экспортируем функцию для использования в других файлах
module.exports = generateAppFormDocx;
