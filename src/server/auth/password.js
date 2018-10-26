import express from "express";
import User from '../models/User'
import {getHtmlTemplate, sendEmail} from "../util/email";
import jwt from 'jsonwebtoken';
const app = express.Router();

app.get('/auth/password', async (req, res)=>{
    res.render('find-password', {
        errMsg: req.flash('errMsg')
    })
})

app.post('/auth/password', async (req, res)=>{
    const {email} = req.body
    try {
        const user = await User.findOne({email}).exec()
        if(!user){
            req.flash('errMsg', 'No user with this email')
            return res.redirect('/auth/password')
        }
        if(user.getRegisterType() === 'FACEBOOK'){
            req.flash('errMsg', 'Please login with facebook')
            return res.redirect('/auth/password')
        }
        if(user.getRegisterType() === 'GOOGLE'){
            req.flash('errMsg', 'Please login with google')
            return res.redirect('/auth/password')
        }
        const template = await getHtmlTemplate('passwordFind')
        const token = jwt.sign({ id: user._id }, 'hungrdeals');
        await sendEmail({
            to: email,
            subject: 'Reset Password',
            template: template({name: user.userName, resetLink: `${process.env.DOMAIN}/auth/password/reset?token=${token}`})
        })
        res.render('find-password-done')
    } catch (e) {
        console.log(e)
        res.render('find-password-done')
    }
})

app.get('/auth/password/reset', async (req, res) => {
    const {token} = req.query
    try {
        const decoded = jwt.verify(token, 'hungrdeals');
        res.render('reset-password', {token})
    } catch(err) {
        res.send("Wrong access")
    }
})
app.post('/auth/password/reset', async (req, res) => {
    const {password, token} = req.body
    try {
        const decoded = jwt.verify(token, 'hungrdeals');
        await User.update({
            _id: decoded.id
        }, {
            password
        })
        res.redirect('/login')
    } catch(err) {
        res.send("Wrong access")
    }
})
export default app;
