const express = require('express');
const router = express.Router();

const auth = require("../../Middleware/AuthToken");

const Posts = require("../../Schemas/postSchema");

router.use(auth);

/***************************************************************************
 *
 *                       Posts
 *
 ***************************************************************************/

// Add Like in a Post
router.put("likepost/:postId", async (req, res) => {
    try {
        const curtidas = Post.findById(req.params.postId);

        if ( curtidas.includes(req.userId) ) {
            await Posts.update(
                { _id: req.params.postId },
                {
                    "$pull": {
                        "likedBy": req.userId
                    }
                }
            );
        } else {
            await Posts.update(
                { _id: req.params.postId },
                {
                    "$push": {
                        "likedBy": req.userId
                    }
                }
            );
        }

        return res.send({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Unespected Error" });
    }
});

/***************************************************************************
 *
 *                       Comments
 *
 ***************************************************************************/

// Add Like in a comment
router.put("likecomment/:commentId", async (req, res) => {
    try {
        await Comments.update(
            { _id: req.params.commentId },
            {
                "$addToSet": {
                    "likedBy": req.userId
                }
            }
        );

        return res.send({ like: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Liking Comment" });
    }
});

// Remove Like from a comment
router.put("unlikecomment/:commentId", async (req, res) => {
    try {
        await Comments.update(
            { _id: req.params.commentId },
            {
                "$pull": {
                    "likedBy": req.userId
                }
            }
        );

        return res.send({ unlike: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Unliking Comment" });
    }
});

module.exports = app => app.use("/", router);