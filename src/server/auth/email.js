import express from "express";
import passport from 'passport'
import LocalStrategy from 'passport-local'
import User from '../models/User'
import {getReferer} from '../util/referer_path'

const app = express.Router();

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, cb) => {
        try {
            // 이미 가입된 유저가 있는지 확인
            const user = await User.findOne({email}).exec()
            if (user) {
                // 가입된 유저가 있다면
                // 비번 맞는지 확인
                if (user.password === password) {
                    // 비밀번호가 일치 한다면
                    cb(null, user);
                } else {
                    cb(new Error("Password Not Match"), {});
                }
            }else{
                // 가입된 유저가 없다면
                cb(new Error("No account with this email"), {});
            }
        } catch (err) {
            cb(err, {});
        }
    }
));
import validator from 'validator'
import {getHtmlTemplate, sendEmail} from "../util/email";
import jwt from 'jsonwebtoken';
import ensureLogined from "../util/ensure_logined";
app.post('/register/email', async (req, res, next) => {
    const {email, password, username:userName} = req.body
    const v_email = validator.isEmail(email)
    if(!v_email){
        req.flash('error', "Email should be in email format")
        return res.redirect('/register')
    }
    if (password === '') {
        req.flash('error', "Password is empty")
        return res.redirect('/register')
    }
    const user = await User.findOne({email}).exec()
    if (user) {
        if(user.verified){
            req.flash('error', "This email is taken")
            return res.redirect('/register')
        }else{
            req.flash('error', "Email verification needed. Please check your mailbox. Or login with this email and resend verification email.")
            return res.redirect('/register')
        }
    }
    const newUser = await User.create({email, password, userName, emailVerified: false})
    req.login(newUser, async function (err) {
        if (err) {
            return next(err);
        }
        const template = await getHtmlTemplate('confirmEmail')
        const token = jwt.sign({ id: newUser._id }, 'hungrdeals');
        try{
            await sendEmail({
                to: email,
                subject: 'Hungrdeals email verification',
                template: template({name: userName,
                    activationLink: `${process.env.DOMAIN}/auth/email/confirm?token=${token}`})
            })
            res.redirect('/verification');
        }catch (e) {
            console.log(e)
            res.redirect('/verification');
        }
    });
})
app.get('/auth/email/confirm',
    async (req, res, next) => {
        const { token } = req.query
        try {
            const decoded = jwt.verify(token, 'hungrdeals');
            await User.update({_id: decoded.id}, {emailVerified: true})
            req.login({
                _id: decoded.id
            }, async function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/verification/done')
            });
        } catch(err) {
            res.text("Sth wrong happened")
        }
    })
app.post('/auth/email', getReferer(),
    (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                // 비밀번호 일치하지 않을 때
                console.log("Password not match")
                req.flash('error', "Password not match")
                return res.redirect(req.refererPath);
            }
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/');
            });
        })(req, res, next)
    }
)

app.get('/verification', async (req, res) => {
    if(req.isAuthenticated()){
        res.renderLogined('verification')
    }else{
        res.redirect('/login')
    }
});

app.get('/verification/done', async (req, res) => {
    if(req.isAuthenticated()){
        res.renderLogined('verification-done')
    }else{
        res.render('verification-done')
    }
});

app.post('/verification/resend', async (req, res) => {
    if(req.isAuthenticated()){
        const template = await getHtmlTemplate('confirmEmail')
        const token = jwt.sign({ id: req.user._id }, 'hungrdeals');
        await sendEmail({
            to: req.user.email,
            subject: 'Hungrdeals email verification',
            template: template({name: req.user.userName,
                activationLink: `${process.env.DOMAIN}/auth/email/confirm?token=${token}`})
        })
        res.json({
            result: true
        })
    }else{
        res.json({
            err: "You should be logined to resend verification email"
        })
    }
})

export default app;
