import express from "express";
const app = express.Router();

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

app.get('/logout', async (req, res) =>{
    req.logout();
    res.redirect("/");
})
export default app;
