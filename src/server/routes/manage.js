import express from "express";
import Deal from "../models/Deal";

const app = express.Router();

app.get('/manage', async (req, res) => {
    if (req.isAuthenticated()) {
        const deals = await Deal.find({
            author: req.user._id,
            deletedAt: {
                $exists: false
            }
        }).sort( { createdAt: -1 } )
        const dealList = deals.map(deal => {
            return {
                createdAt: new Date(deal.createdAt),
                title: deal.title,
                deleteAuto: deal.deleteAuto,
                _id: deal._id
            }
        }).reduce((accumulator, item) => {
            const index = (item.createdAt.getMonth()+1).toString()+'-'+item.createdAt.getFullYear().toString()
            if(accumulator.findIndex((item)=>{
                return item.time === index
            }) === -1){
                accumulator.push({
                    time: index,
                    items: []
                })
            }
            accumulator[accumulator.findIndex((item)=>{
                return item.time === index
            })].items.push(item)
            return accumulator
        }, [])
        console.log(JSON.stringify(dealList))
        res.renderLogined(
            'manage', {
                dealList
            }
        )
    } else {
        res.redirect('/login')
    }
});

export default app
