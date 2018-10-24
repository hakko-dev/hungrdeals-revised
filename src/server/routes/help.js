import express from "express";
const app = express.Router();

app.get('/help', (req, res) => {
    res.render(
        'help'
    )
});

export default app