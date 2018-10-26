import express from "express";
import ensureLogined from "../util/ensure_logined";
import Deal from "../models/Deal";
import {getHtmlTemplate, sendEmail} from "../util/email";

const app = express.Router();

app.get('/sell', ensureLogined, (req, res) => {
    res.renderLogined(
        'sell'
    )
});

app.post('/sell', ensureLogined, async (req, res) => {
    const deal = await Deal.addNewDeal({...req.body, authorId: req.user._id})
    try {
        const template = await getHtmlTemplate('verifyingStatus')
        await sendEmail({
            to: req.user.email,
            subject: 'We are verifying your Ad',
            template: template({name: req.user.userName})
        })
        res.json({
            _id: deal._id
        })
    } catch (e) {
        console.log(e)
        res.json({
            _id: deal._id
        })
    }
});

app.post('/sell/edit/:dealId', ensureLogined, async (req, res) => {
    const {dealId} = req.params
    const deal = await Deal.findById(dealId)
    if(deal.author.toString() !== req.user._id.toString() && !req.user.isAdmin){
        return res.json({
            fail: 'Unauthorized Call'
        })
    }
    const result = await Deal.updateDeal({...req.body, dealId})
    res.json({
        _id: result._id
    })
});

app.get('/sell/close/:postId', ensureLogined, async (req, res) => {
    const {postId} = req.params
    await Deal.update({_id: postId}, {deleteAuto: new Date()})
    res.redirect('/manage')
});

app.get('/sell/delete/:postId', ensureLogined, async (req, res) => {
    const {postId} = req.params
    await Deal.update({_id: postId}, {deletedAt: new Date()})
    res.redirect('/manage')
});

app.get('/sell/edit/:postId', ensureLogined, async (req, res) => {
    const {postId} = req.params
    const deal = await Deal.findById(postId)
    if(deal.author.toString() !== req.user._id.toString() && !req.user.isAdmin){
        return res.redirect('/')
    }
    res.renderLogined('edit', {deal: deal.getDealEditInfo()})
});

export default app
