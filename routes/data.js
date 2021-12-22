const express = require("express");
const Data = require("../models/Data");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const data = await Data.find();
        res.json(data);
    } catch (error) {
        res.send(error);
    }
});