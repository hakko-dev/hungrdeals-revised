import express from "express";
import ensureAdmin from "../util/ensure_admin";
const app = express.Router();

app.get('/admin', ensureAdmin, (req, res) => {
    res.renderLogined(
        'admin-unverified'
    )
});

export default app
