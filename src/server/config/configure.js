// use redis as session storage
import session from "express-session";
import connectRedis from "connect-redis";

const RedisStore = connectRedis(session);

export function configureRedisSession(app) {
    const {REDIS_HOST, REDIS_PORT, REDIS_SECRET} = process.env;
    app.use(
        session({
            store: new RedisStore({
                host: REDIS_HOST,
                port: REDIS_PORT
            }),
            secret: REDIS_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {secure: false,
                maxAge: 315360000000}
        })
    );
    app.use(function (req, res, next) {
        if (!req.session) {
            return next(new Error("redis connection failure")); // handle error
        }
        next(); // otherwise continue
    });
}

// logging setting
import morgan from "morgan";

export function configureLogging(app) {
    app.use(
        morgan((tokens, req, res) => {
            return [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                tokens.res(req, res, "content-length"),
                "-",
                tokens["response-time"](req, res),
                "ms"
            ].join(" ");
        })
    );
}

// cors setting
import cors from "cors";

export function configureCors(app) {
    app.use(cors());
}

// bodyparser setting
import bodyParser from "body-parser";

export function configureBodyparser(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
}

import passport from "passport";
import User from '../models/User'

export function configurePassport(app) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, {
            _id: user._id
        });
    });

    passport.deserializeUser(async (obj, done) => {
        const user = await User.findOne({_id: obj._id}).exec()
        done(null, user);
    });
}

import flash from 'connect-flash'
export function configureFlash(app) {
    app.use(flash())
}

