const express = require('express');
const router = express.Router();

const auth = require("../../Middleware/AuthToken");

const Posts = require("../../Schemas/postSchema");
const Category = require("../../Schemas/categorySchema");

router.use(auth);

// Exibe todos os pots
router.get("/", async (req, res) => {
    try {
        const posts = await Posts.find().populate('author').populate('comments.author').populate('comments.likedBy');

        return res.send({ posts });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Finding Posts" });
    }
});

// Exibe um post especifico
router.get("/:postId", async (req, res) => {
    try {
        const post = await Posts.findById(req.params.postId).populate('author').populate('comments.author').populate('comments.likedBy');

        return res.send({ post });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Finding Post" });
    }
});

// Exibe todos os post de determinado autor
router.get("/author/:authorId", async (req, res) => {
    try {
        const post = await Posts.findOne({ author: req.params.authorId }).populate('author').populate('comments.author').populate('comments.likedBy');

        return res.send({ post });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Finding Post" });
    }
});

// Cria um novo Post
router.post("/", async (req, res) => {
    if ( !req.admins.includes(req.userId) ) {
        return res.status(403).send({ error: "No Permission To Access This Resource" });
    }
    try {
        const post = await Posts.create({
            ...req.body,
            author: req.userId
        });

        return res.send({ post });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Creating New Post" });
    }
});

// Atualiza um Post
router.put("/:postId", async (req, res) => {
    if ( ! req.admins.includes(req.userId) ) {
        return res.status(403).send({ error: "No Permission To Access This Resource" });
    }
    try {
        const post = await Posts.findByIdAndUpdate(req.params.postId, { ...req.body }, { new: true });

        return res.send({ post });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Updating New Post" });
    }
});

// Delete um Post
router.delete("/:postId", async (req, res) => {
    if ( ! req.admins.includes(req.userId) ) {
        return res.status(403).send({ error: "No Permission To Access This Resource" });
    }
    try {
        await Posts.findByIdAndRemove(req.params.postId);

        return res.send({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Deleting Post" });
    }
});

// Gerencia os Likes de um Post
router.put("/like/:postId", async (req, res) => {
    try {
        const post = await Posts.findOne({ _id: req.params.postId });

        if (post == undefined) {
            return res.status(404).send({ error: 'Post Not Find' });
        } else {
            const likes = post.likedBy;
            if (likes != undefined && likes.includes(req.userId)) {
                if ( likes.includes(req.userId) ) {
                    const newPost = await Posts.findOneAndUpdate(
                        { _id: req.params.postId },
                        { "$pull": { "likedBy": req.userId } },
                        { returnOriginal: false }
                    );
                    return res.send({ newPost });
                }
            } else {
                const newPost = await Posts.findOneAndUpdate(
                    { _id: req.params.postId },
                    { "$push": { "likedBy": req.userId } },
                    { returnOriginal: false }
                );
                return res.send({ newPost });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Unexpected Error" });
    }
});

module.exports = app => app.use("/posts", router);