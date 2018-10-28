import ensureLogined from "../util/ensure_logined";
import ensureAdmin from "../util/ensure_admin";
import {upload} from "../util/s3";
import app from "./profile";
import {instance} from "../config/mongoose";
import Deal from "../models/Deal";

app.post('/api/image', ensureLogined, upload.single('file'), async (req, res) => {
    const file = req.file
    res.json({
        url: file.location
    })
});

app.get('/api/geo2postcode', async (req, res) => {
    const {lat, lng} = req.query
    const myCursor = instance.db.collection('postcodes').aggregate([
        {
            "$geoNear": {
                "near": {
                    "type": "Point", "coordinates": [parseFloat(lng),
                        parseFloat(lat)]
                },
                "distanceField": "dist",
                "spherical": true
            }
        },
        {"$sort": {"dist": 1, "_id": 1}}
    ]).limit(1)
    const result = await myCursor.hasNext() ? await myCursor.next() : null;
    if (result) {
        res.json({postcode: result.postcode})
    } else {
        res.json({postcode: null})
    }
});

app.get('/api/postcode2geo', async (req, res) => {
    const {postcode} = req.query
    var myCursor = instance.db.collection('postcodes').find({
        postcode: parseInt(postcode)
    }).limit(1)
    const result = await myCursor.hasNext() ? await myCursor.next() : null;
    if (result) {
        res.json({lat: result.lat, lng: result.lon})
    } else {
        res.json({lat: null, lng: null})
    }
});

app.post('/api/search', async (req, res) => {
    const result = await Deal.search(req.body)
    res.json({
        list: result
    })
});

app.post('/api/admin/unverified', ensureLogined, async (req, res) => {
    const result = await Deal.find({
        verified: false
    })
    res.json({
        list: result
    })
});

app.post('/api/admin/verify', ensureAdmin, async (req, res) => {
    const {_id} = req.query
    await Deal.update(
        {
            _id
        }, {
            verified: true
        })
    res.json({
        result: true
    })
});

app.delete('/api/deal', ensureAdmin, async (req, res) => {
    const {_id} = req.body
    await Deal.deleteOne({_id}).exec()
    res.json({
        result: true
    })
});



import {sendEmail, getTemplate, getHtmlTemplate} from '../util/email'

app.post('/api/mail', async (req, res) => {
    const {email, firstName, lastName, message} = req.body
    try {
        await sendEmail({
            to: 'hungrdeals@outlook.com',
            subject: 'Customer Inquiry',
            template: `${email} ${firstName} ${lastName} ${message}`
        })
        await sendEmail({
            to: 'lee.kim.dev.au@gmail.com',
            subject: 'Customer Inquiry',
            template: `${email} ${firstName} ${lastName} ${message}`
        })
        res.json({
            result: true
        })
    } catch (e) {
        console.log(e)
        res.json({
            result: false
        })
    }
});

app.post('/api/mail/about', async (req, res) => {
    const {email, name, phone, message} = req.body
    try {
        await sendEmail({
            to: 'hungrdeals@outlook.com',
            subject: 'Customer Inquiry',
            template: `${email} ${name} ${phone} ${message}`
        })
        await sendEmail({
            to: 'lee.kim.dev.au@gmail.com',
            subject: 'Customer Inquiry',
            template: `${email} ${name} ${phone} ${message}`
        })
        res.json({
            result: true
        })
    } catch (e) {
        console.log(e)
        res.json({
            result: false
        })
    }
});



export default app
