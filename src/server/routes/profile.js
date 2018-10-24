import express from "express";
import ensureLogined from "../util/ensure_logined";
import {upload} from "../util/s3";
import User from "../models/User";

const app = express.Router();

app.get('/profile', ensureLogined, (req, res) => {
    const registerType = req.user.getRegisterType()
    res.renderLogined('profile', {
        isEmail: registerType === 'EMAIL',
        isFacebook: registerType === 'FACEBOOK',
        isGoogle: registerType === 'GOOGLE',
    })
});

app.post('/profile', ensureLogined, upload.single('profileImage'), async (req, res) => {
    const {userName, password, passwordNew} = req.body
    const file = req.file
    const updateCriteria = {
        userName
    }
    if(file){
        // profile image sent
        updateCriteria.profileImage = file.location
    }
    if(password && passwordNew && password === req.user.password && passwordNew && passwordNew !== ''){
        updateCriteria.password = passwordNew
    }
    await req.user.update(updateCriteria)
    res.send('ok')
});
export default app;
