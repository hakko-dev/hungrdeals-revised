import express from "express";
const app = express.Router();

app.get('/about', (req, res) => {
    res.render(
        'about'
    )
});

export default app