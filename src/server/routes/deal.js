import express from "express";
import Deal from "../models/Deal";

const app = express.Router();

app.get('/deal/:dealId', async (req, res) => {
    try {
        const deal = await Deal.findOne({_id: req.params.dealId}).exec()
        if (!deal) {
            res.redirect('/')
            return;
        }
        const dealInfo = deal.getDealInfo()
        console.log(dealInfo)
        if (req.isAuthenticated()) {
            res.renderLogined(
                'deal', {...dealInfo}
            )
        } else {
            res.render(
                'deal', {...dealInfo}
            )
        }
    } catch (e) {
        res.redirect('/')
    }
});

export default app
