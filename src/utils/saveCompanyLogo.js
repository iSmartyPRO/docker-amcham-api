const fs = require('fs');
const path = require('path');

/**
 * Определяет тип файла на основе первых байтов Base64 строки
 * @param {string} base64Data - строка Base64
 * @returns {string|null} - тип файла или null, если не удалось определить
 */
function getFileExtensionFromBase64(base64Data) {
  if (base64Data.startsWith('iVBORw0KGgo')) {
    return 'png'; // PNG
  } else if (base64Data.startsWith('/9j/')) {
    return 'jpg'; // JPEG
  } else if (base64Data.startsWith('JVBERi0x')) {
    return 'pdf'; // PDF
  } else if (base64Data.startsWith('PHN2Zy')) {
    return 'svg'; // SVG
  } else if (base64Data.startsWith('CDR')) {
    return 'cdr'; // CDR (CorelDRAW)
  } else if (base64Data.startsWith('U1PD')) {
    return 'ai'; // AI (Adobe Illustrator)
  }
  return null; // Не удалось определить
}

/**
 * Функция для сохранения логотипа компании, полученного в JSON строке с Base64
 * @param {string} jsonString - строка JSON с полем base64 (Base64 кодированное изображение)
 * @param {string} outputPath - путь для сохранения файла
 */
function saveCompanyLogo(base64String, outputPath) {
  try {
    if (!base64String) {
      throw new Error('Отсутствует поле base64 в JSON');
    }

    const base64Data = base64String.replace(/^data:.*?;base64,/, '');
    const fileExtension = getFileExtensionFromBase64(base64Data);

    if (!fileExtension) {
      throw new Error('Не удалось определить тип файла');
    }

    const filePath = `${outputPath}.${fileExtension}`;
    const buffer = Buffer.from(base64Data, 'base64');

    fs.writeFileSync(filePath, buffer);
    const result = {status: "OK", message: `Файл успешно сохранён: ${filePath}`, logoFilePath: filePath}
    return result

  } catch (err) {
    const result = {status: "Bad", message: `Ошибка при сохранении логотипа: ${err.message}`}
    console.error(result);
  }
}

module.exports = saveCompanyLogo;
