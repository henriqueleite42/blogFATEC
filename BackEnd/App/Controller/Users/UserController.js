const express = require('express');
const router = express.Router();

const auth = require("../../Middleware/AuthToken");
const adm = require("../../Middleware/Adm");

const Users = require("../../Schemas/userSchema");
const Posts = require("../../Schemas/postSchema");

router.use(auth);
router.use(adm);

// List All Users
router.get("/", async (req, res) => {
    try {
        const users = await Users.find().select(["+created", "+email", "+status"]);

        return res.send({ users });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Finding Users" });
    }
});

// Show Specifc User
router.get("/:userId", async (req, res) => {
    try {
        const user = await Users.findById(req.params.userId).select(["+created", "+email", "+status"]);

        return res.send({ user });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Finding User" });
    }
});

// Delete User
router.delete("/:userId", async (req, res) => {
    try {
        await Posts.findByIdAndRemove(req.params.userId);

        return res.send({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Deleting User" });
    }
});

module.exports = app => app.use("/users", router);