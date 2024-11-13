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
    console.log(genDocx)
    if (genDocx.status == "OK") {
        const docxPath = genDocx.outputFiles.docx;
        const logoPath = genDocx.outputFiles.logo;
        const pdfPath = path.join(__dirname, '..', 'output')
        const pdfFile = `${genDocx.outputFiles.docx.split(".")[0]}.pdf`;
        // Генерация pdf документа из docx документа
        console.log({docxPath, pdfFile})
        const pdfConvert = await convertDocxToPdf(docxPath, pdfPath)
        if(pdfConvert.status == "OK"){
            const attachments = [pdfFile, docxPath]
            logoPath ? attachments.push(logoPath) : undefined
            const mailSend = await emailAppForm(config.appForm.recipients, `Application Form from ${data.company}`, {company: `${data.company}`}, attachments)
            if(mailSend.status == "OK") {
                res.status(200).json({status: "OK", message: "App Form generated and email is sent", attachments: mailSend.attachmentsArr})
            } else {
                res.status(500).json({status: "Bad", message: "Something happened during sending email", details: mailSend })
            }
        } else {
            res.status(500).json({status: "Bad", message: "something happaned during convert from docx to pdf", details: pdfConvert.message})
        }
    }
}