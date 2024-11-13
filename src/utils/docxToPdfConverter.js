// docxToPdfConverter.js

const { exec } = require('child_process');
const path = require('path');

const convertDocxToPdf = async (inputFilePath, outputFilePath) => {
    return new Promise((resolve, reject) => {
        const command = `libreoffice --headless --convert-to pdf --outdir "${outputFilePath}" "${inputFilePath}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log("4")
                const result = {status: "Bad", message: `Ошибка при конвертации: ${error.message}`}
                console.error(result);
                return reject(result);
            }
            if (stderr) {
                const result = {status: "Bad", message: `Ошибка: ${stderr}`}
                console.error(result);
                return reject(result);
            }
            const result = {status: "OK", message: `Конвертация завершена. PDF сохранен как ${outputFilePath}`}
            console.log(result);
            resolve(result)
        });
    
    })
};

module.exports = convertDocxToPdf;
