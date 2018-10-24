import express from "express";
import ensureLogined from "../util/ensure_logined";
import Deal from "../models/Deal";

const app = express.Router();

app.get('/sell', ensureLogined, (req, res) => {
    res.renderLogined(
        'sell'
    )
});

app.post('/sell', ensureLogined, async (req, res) => {
    const deal = await Deal.addNewDeal({...req.body, authorId: req.user._id})
    res.json({
        _id: deal._id
    })
});

app.post('/sell/edit/:dealId', ensureLogined, async (req, res) => {
    const {dealId} = req.params
    const deal = await Deal.updateDeal({...req.body, dealId})
    res.json({
        _id: deal._id
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
    console.log(deal.getDealEditInfo())
    res.renderLogined('edit', {deal: deal.getDealEditInfo()})
});

export default app
