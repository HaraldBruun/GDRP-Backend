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

router.get("/:id", async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.send(error);
    }
});

router.post("/", async (req, res) => {
    // evt AES med password som key?

    const data = new Data({
        userId: req.body.userId,
        content: req.body.content
    });

    try {
        const newData = await data.save();
        res.json(newData);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;
