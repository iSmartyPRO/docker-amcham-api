const config = require("../config")
const generateAppFormDocx = require("../utils/generateAppFormDocx")
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

    // Генерация документа
    const genResult = await generateAppFormDocx(data);
    if (genResult.status == "OK") {
        const filePath = path.join(__dirname, '..','output', genResult.outputFileName);
        const mailSend = await emailAppForm(config.appForm.recipients, `Application Form from ${data.company}`, {company: `${data.company}`},filePath)
        if(mailSend.status == "OK") {
            res.status(200).json({status: "OK", message: "App Form generated and email is sent", filename: genResult.outputFileName})
        } else {
            res.status(500).json({status: "Bad", message: "something happened", details: mailSend })
        }
    }
    console.log(genResult)
}