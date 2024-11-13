const config = require("../config")
const generateAppFormDocx = require("../utils/generateAppFormDocx")
const convertDocxToPdf = require('../utils/docxToPdfConverter')
const emailAppForm = require("../utils/emailAppForm")
const path = require('path');




module.exports.home = (req, res) => {
    res.json({status: "ok", description: "home"})
}
module.exports.appForm = async (req, res) => {
    const data = req.body;
    // Проверка наличия обязательных данных
    if (!data || !data.company || !data.companyEstablishmentDate) {
        return res.status(400).send('Некоторые обязательные данные отсутствуют');
    }

    // Генерация docx документа
    const genDocx = await generateAppFormDocx(data);
    if (genDocx.status == "OK") {
        const docxPath = path.join(__dirname, '..', 'output', genDocx.outputFileName);
        const pdfPath = path.join(__dirname, '..', 'output')
        const pdfFile = path.join(__dirname, '..', 'output', `${genDocx.outputFileName.split(".")[0]}.pdf`);
        // Генерация pdf документа из odcx документа
        const pdfConvert = await convertDocxToPdf(docxPath, pdfPath)
        if(pdfConvert.status == "OK"){
            const mailSend = await emailAppForm(config.appForm.recipients, `Application Form from ${data.company}`, {company: `${data.company}`}, pdfFile)
            if(mailSend.status == "OK") {
                res.status(200).json({status: "OK", message: "App Form generated and email is sent", filename: pdfFile})
            } else {
                res.status(500).json({status: "Bad", message: "Something happened during sending email", details: mailSend })
            }
        } else {
            res.status(500).json({status: "Bad", message: "something happaned during convert from docx to pdf", details: pdfConvert.message})
        }
    }
}