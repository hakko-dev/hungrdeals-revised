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
        const meta = {
            meta: {
                title: 'Hungrdeals - ' + dealInfo.title,
                description: `[${dealInfo.category} / ${dealInfo.cuisineType}] ${dealInfo.description_raw}`,
                image: (dealInfo.images && dealInfo.images.length !== 0) ? dealInfo.images[0] : process.env.DOMAIN + '/assets/5cae799e09ba9df684d89c32e9780ada.jpg'
            }
        }
        if (req.isAuthenticated()) {
            res.renderLogined(
                'deal', {
                    ...dealInfo, ...meta
                }
            )
        } else {
            res.render(
                'deal', {...dealInfo, ...meta}
            )
        }
    } catch (e) {
        res.redirect('/')
    }
});

export default app
