const compile = require("string-template/compile")
import mjml2html from 'mjml'
import fs from 'fs'
import path from 'path'
import util from 'util'
import configureMailgun from 'mailgun-js'

const readFile = util.promisify(fs.readFile)


export const getTemplate = async (templateName)=>{
    try{
        const mjml = await readFile(path.join(__dirname, `../email-templates/${templateName}.mjml`))
        const htmlOutput = mjml2html(mjml.toString())
        const template = compile(htmlOutput.html)
        return template
    }catch (e) {
        console.log(e)
        return new Error(`NO TEMPLATE WITH NAME: ${templateName}`)
    }
}
export const getHtmlTemplate = async (templateName)=>{
    try{
        const html = await readFile(path.join(__dirname, `../email-templates/${templateName}.html`))
        const template = compile(html.toString())
        return template
    }catch (e) {
        console.log(e)
        return new Error(`NO TEMPLATE WITH NAME: ${templateName}`)
    }
}

const api_key = process.env.MAILGUN_KEY;
const mailDomain = process.env.MAILGUN_URL;
const mailgun = configureMailgun({apiKey: api_key, domain: mailDomain});

export const sendEmail = async ({to, template, subject}) => {
    const mailData = {
        from: `<no-reply@${mailDomain}>`,
        to,
        subject,
        html: template
    };
    return new Promise((resolve, reject) => {
        mailgun.messages().send(mailData, function (error, body) {
            if(error){
                reject(error)
            }
            resolve()
        });
    })
}
