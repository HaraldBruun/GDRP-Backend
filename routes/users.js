const express = require("express");
const User = require("../models/User");
const router = express.Router();
const crypto = require("crypto");

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.send(error);
    }
});

// Get single user from _id
router.get("/id/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.send(err);
    }
});

// Update user info
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    username: req.body.username,
                    password: crypto
                        .createHash("sha256")
                        .update(req.body.password)
                        .digest("hex"),
                    accountAddress: req.body.accountAddress,
                    citizenContract: req.body.citizenContract,
                },
            }
        );
        res.json(updatedUser);
    } catch (err) {
        res.send(err);
    }
});

// Get usernames from the requester address
router.get("/accaddress/:id", async (req, res) => {
    let ids = req.params.id.split("&");
    if (ids.length === 1) {
        try {
            const user = await User.find({accountAddress: req.params.id});
            res.json(user);
        } catch (err) {
            res.send(err);
        }
    } else {
        try {
            const users = await User.find().where('accountAddress').in(ids).exec();
            res.json(users)
        } catch (err) {
            res.send(err);
        }
    }
});

// Update user info
router.put("/:id", async (req, res) => {
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    username: req.body.username,
                    password: crypto
                        .createHash("sha256")
                        .update(req.body.password)
                        .digest("hex"),
                    accountAddress: req.body.accountAddress,
                    citizenContract: req.body.citizenContract,
                },
            }
        );
        res.json(updatedUser);
    } catch (err) {
        res.send(err);
    }
});

// Delete user with _id
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.remove({ _id: req.params.id });
        res.json(deletedUser);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;
