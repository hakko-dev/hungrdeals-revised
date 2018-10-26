import express from "express";
const app = express.Router();

app.get('/policy', (req, res) => {
    res.render(
        'policy'
    )
});

export default app