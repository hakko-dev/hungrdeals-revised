if(process.env.NODE_ENV === 'production'){
    // require('babel-polyfill')
}

import express from "express";
import path from "path";
import {
    configureRedisSession,
    configureLogging,
    configureCors,
    configureBodyparser,
    configurePassport,
    configureFlash
} from "./config/configure";

const app = express();
if(process.env.NODE_ENV === 'production'){
    app.use("/assets", express.static(path.join(__dirname , "../dist")));
}else{
    app.use("/assets", express.static(path.join(__dirname , "../../dist")));

}
configureLogging(app);
configureCors(app);
configureBodyparser(app);
configureRedisSession(app);
configurePassport(app)
configureFlash(app)

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

import routes from "./routes";
import auth from './auth'

app.use(auth) // 소셜 로그인
app.use(routes);



app.listen(3000);

import mongoose from './config/mongoose'
import User from './models/User'
