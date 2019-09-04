const express = require('express');
const router = express.Router();

const auth = require("../../Middleware/AuthToken");

const Posts = require("../../Schemas/postSchema");

router.use(auth);

// Cria um Comentario
router.post("/:postId", async (req, res) => {
    try {
        const comment = {
            ...req.body,
            author: req.userId
        };

        await Posts.findByIdAndUpdate(req.params.postId, { $push: { comments: comment } });

        return res.send({ comment });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Creating New Comment" });
    }
});

// Atualiza um Comentario
router.put("/:commentId", async (req, res) => {
    try {
        const checkAuthor = await Posts.findOne({ "comments._id": req.params.commentId });

        if (checkAuthor.author._id == req.userId) {
            const comment = await Posts.update(
                { "comments._id": req.params.commentId },
                {
                    "$set": {
                        "comments.$.text": req.body.text
                    }
                }
            );
        }

        return res.send({ comment });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Updating Comment" });
    }
});

// Delete um Comentario
router.delete("/:commentId", async (req, res) => {
    try {
        const checkAuthor = await Posts.findOne({ "comments._id": req.params.commentId });

        if (checkAuthor.author._id == req.userId) {
            await Posts.update(
                { "comments._id": req.params.commentId },
                { $pull: { "comments": { _id: req.params.commentId } } }
            );
        }

        return res.send({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Deleting Comment" });
    }
});

// Gerencia os Likes de um Post
router.put("/like/:commentId", async (req, res) => {
    try {
        const post = await Posts.findOne(
            { comments: { $elemMatch: { _id: req.params.commentId } } },
            { comments: { $elemMatch: { _id: req.params.commentId } } }
        );

        if (post == undefined) {
            return res.status(404).send({ error: 'Comment Not Find' });
        } else {
            const comment = post.comments[0];

            if (comment.likedBy != undefined && comment.likedBy.includes(req.userId)) {
                const newPost = await Posts.findOneAndUpdate(
                    { comments: { $elemMatch: { _id: req.params.commentId } } },
                    { "$pull": { "comments.$.likedBy": req.userId } },
                    { returnOriginal: false }
                );
                return res.send({ newPost });
            } else {
                const newPost = await Posts.findOneAndUpdate(
                    { comments: { $elemMatch: { _id: req.params.commentId } } },
                    { "$push": { "comments.$.likedBy": req.userId } },
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

module.exports = app => app.use("/comments", router);