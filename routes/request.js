const express = require("express");
const Permission = require("../models/Permission");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const data = await Permission.find({status: "pending"});
        res.json(data);
    } catch (error) {
        res.send(error);
    }
});

// Get all requests to a specific contract (user)
router.get("/contract/:id", async (req, res) => {
    try {
        const data = await Permission.find({ contractAddress: req.params.id, status: "pending" })
        res.json(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;


// router.post("/", async (req, res) => {
//     const permission = new Permission({
//         requesterAddress: req.body.requesterAddress,
//         contractAddress: req.body.contractAddress,
//         retention: req.body.retention,
//         dataId: req.body.dataId,
//         status: "pending"
//     });

//     try {
//         const newPermission = await permission.save();
//         res.json(newPermission);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// router.get("/id/:id", async (req, res) => {
//     try {
//         const data = await Permission.findById(req.params.id);
//         res.json(data);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });
