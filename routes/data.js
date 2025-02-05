const express = require("express");
const { Query } = require("mongoose");
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

router.get("/id/:id", async (req, res) => {
    try {
        const data = await Data.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.send(error);
    }
});

router.get("/datatype/id/:id", async (req, res) => {
    let ids = req.params.id.split("&");
    if (ids.length === 1) {
        try {
            const data = await Data.findById(req.params.id).select('-content');
            res.json([data]); // send as array
        } catch (error) {
            res.send(error);
        }
    } else {
        try {
            const found = await Data.find().where('_id').in(ids).select('-content').exec();
            res.json(found);
        } catch (err) {
            res.send(err);
        }
    }
});

router.put("/id/:id", async (req, res) => {
    try {
        await Data.updateOne(
            { _id: req.params.id },
            {
                content: req.body.content,
                dataType: req.body.dataType
            }
        );
        res.json({ message: "Data updated" });
    } catch (error) {
        res.send(error);
    }
});

router.get("/userid/:id", async (req, res) => {
    try {
        const data = await Data.find({ userId: req.params.id });
        res.json(data);
    } catch (error) {
        res.send(error);
    }
});

router.delete("/id/:id", async (req, res) => {
    try {
        const data = await Data.findByIdAndDelete(req.params.id);
        // returnér 200 eller data også?
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post("/", async (req, res) => {
    // evt AES med password som key?

    const data = new Data({
        userId: req.body.userId,
        content: req.body.content,
        dataType: req.body.dataType,
    });

    try {
        const newData = await data.save();
        res.json(newData);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;
