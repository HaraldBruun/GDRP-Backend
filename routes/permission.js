const express = require("express");
const Permission = require("../models/Permission");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const data = await Permission.find();
        res.json(data);
    } catch (error) {
        res.send(error);
    }
});

router.post("/", async (req, res) => {
    console.log(req);
    const permission = new Permission({
        requesterAddress: req.body.requesterAddress,
        contractAddress: req.body.contractAddress,
        validUntil: req.body.validUntil,
        dataId: req.body.dataId
    });

    try {
        const newPermission = await permission.save();
        res.json(newPermission);
    } catch (err) {
        res.send(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const data = await Permission.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.send(error);
    }
});
module.exports = router;