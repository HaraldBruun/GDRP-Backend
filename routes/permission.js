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
    const permission = new Permission({
        requesterAddress: req.body.requesterAddress,
        contractAddress: req.body.contractAddress,
        retention: req.body.retention,
        dataId: req.body.dataId,
        status: "pending",
    });

    try {
        const newPermission = await permission.save();
        res.json(newPermission);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/id/:id", async (req, res) => {
    try {
        const data = await Permission.findById(req.params.id);
        res.json(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/received/:address", async (req, res) => {
    try {
        const data = await Permission.find({
            requesterAddress: req.params.address,
            status: "accepted",
        });
        res.json(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get("/denied/:address", async (req, res) => {
    try {
        const data = await Permission.find({
            requesterAddress: req.params.address,
            status: "denied",
        });
        res.json(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put("/:id", async (req, res) => {
    try {
        await Permission.updateOne(
            { _id: req.params.id },
            {
                status: req.body.status,
                retention: req.body.retention,
            }
        );

        res.json({ message: "Data updated" });
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Permission.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Permission deleted" });
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
