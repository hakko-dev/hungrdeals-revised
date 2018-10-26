import express from "express";

const app = express.Router();
import _ from 'lodash'

// filling default meta tags
app.use((req, res, next) => {
    // grab reference of render
    const _render = res.render;
    // override logic
    res.render = function (view, options, fn) {
        // do some custom logic
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        options = _.extend({
            meta: {
                title: 'Hungrdeals - The ultimate food finder',
                description: 'Hungry for deals nearby? Seize your wallet & get on Hungerdeals! At one click away, Australia’s #1 affordable food catalogue will ease your day.',
                url: fullUrl,
                image: process.env.DOMAIN +'/assets/5cae799e09ba9df684d89c32e9780ada.jpg'
            },...options
        });
        // continue with original render
        _render.call(this, view, options, fn);
    }
    next();
});

app.use(async (req, res, next) => {
    // 로그인 되어있다면 유저 정보 같이 가져옴
    if (req.isAuthenticated()) {
        res.renderLogined = (route, data) => {
            res.render(route, {
                ...data,
                ...{
                    user: req.user.getProfile(),
                    isAdmin: req.user.isAdmin
                }
            });
        };
    }
    next();
});

import FacebookAuth from './facebook'

app.use(FacebookAuth)

import GoogleAuth from './google'

app.use(GoogleAuth)

import EmailAuth from './email'

app.use(EmailAuth)

import FindPassword from './password'
import User from "../models/User";
import Deal from "../models/Deal";

app.use(FindPassword)

app.get('/logout', async (req, res) => {
    req.logout();
    res.redirect("/");
})
app.get('/auth/withdraw', async (req, res) => {
    await User.deleteOne({
        _id: req.user._id
    }).exec()
    await Deal.deleteMany({
        author: req.user._id
    }).exec()
    req.logout()
    res.redirect('/')
})
export default app;
