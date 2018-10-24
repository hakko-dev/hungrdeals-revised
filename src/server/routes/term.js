import express from "express";
const app = express.Router();

app.get('/term', (req, res) => {
    res.render(
        'term'
    )
});

export default app