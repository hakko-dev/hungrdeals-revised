import express from "express";
const app = express.Router();

import profile from './profile';
import register from './register';
import main from './main';
import login from './login';
import deal from './deal';
import sell from './sell';
import api from './api';
import about from './about';
import manage from './manage';
import help from './help';
import term from './term';
import policy from './policy';
import admin from './admin'

app.use(profile);
app.use(register);
app.use(main);
app.use(login);
app.use(deal);
app.use(sell);
app.use(api);
app.use(about);
app.use(manage);
app.use(help);
app.use(term);
app.use(policy);
app.use(admin);

export default app;
