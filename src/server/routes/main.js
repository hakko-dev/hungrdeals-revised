import express from "express";
import Deal from "../models/Deal";
import _ from 'lodash'
const app = express.Router();

app.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        res.renderLogined(
            'main', {mainPage: true, path: null}
        )
    } else {
        res.render(
            'main', {mainPage: true, path: null}
        )
    }
});

const BIG_CATEGORY = [
    'Weekday Specials',
    'Weekend Deals',
    'Happy Hour',
    'Combo',
    'Miscellaneous',
    'Menus'
]
const SUB_CATEGORY = [
    'All Weekday Specials',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'All Weekend Deals',
    'Saturday',
    'Sunday',
    'All Happy Hours',
    'All Combos',
    'All Miscellaneous',
    'Grand Openings',
    'Homemade Deals',
    'Volunteer',
    'Giveaway',
    'Buffet',
    'All Menus',
    'Restaurant',
    'Bar',
    'Cafe'
]
app.get('/:bigCategory/:subCategory', async (req, res, next) => {
    const {bigCategory, subCategory} = req.params
    if(BIG_CATEGORY.indexOf(bigCategory) === -1 || SUB_CATEGORY.indexOf(subCategory) === -1) return next()
    if (req.isAuthenticated()) {
        res.renderLogined(
            'main', {
                mainPage: true,
                path: {
                    big: bigCategory,
                    sub: subCategory
                }
            }
        )
    } else {
        res.render(
            'main', {
                mainPage: true,
                path: {
                    big: bigCategory,
                    sub: subCategory
                }
            }
        )
    }
});


export default app
