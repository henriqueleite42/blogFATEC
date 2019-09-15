const express = require('express');
const router = express.Router();

const adm = require('../../../Config/Adm.json');
const auth = require('../../Middleware/AuthToken');

const Posts = require('../../Schemas/postSchema');

router.use(auth);

// Cria um Comentario
router.post('/:postId', async (req, res) => {
    try {
        const comment = {
            ...req.body,
            author: req.userId
        };

        await Posts.findByIdAndUpdate(req.params.postId, { $push: { comments: comment } });

        return res.send({
            status: 'OK',
            results: comment
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR',
            results: []
        });
    }
});

// Atualiza um Comentario
router.put('/:commentId', async (req, res) => {
    try {
        const checkAuthor = await Posts.findOne({ 'comments._id': req.params.commentId });

        if ( ! checkAuthor.length > 0 ) {
            return res.status(404).send({
                status: 'ZERO_RESULTS',
                results: []
            });
        }

        var comment;

        if (checkAuthor.author._id == req.userId) {
            comment = await Posts.update(
                { 'comments._id': req.params.commentId },
                { '$set': { 'comments.$.text': req.body.text, 'comments.$.modified': Date.now } }
            );
        }

        return res.send({
            status: 'OK',
            results: comment
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR',
            results: []
        });
    }
});

// Delete Comment
router.delete('/:commentId', async (req, res) => {
    try {
        const checkAuthor = await Posts.findOne(
            { comments: { $elemMatch: { _id: req.params.commentId } } },
            { comments: { $elemMatch: { _id: req.params.commentId } } }
        );

        if (checkAuthor.comments[0].author == req.userId || req.userId.includes( adm.admins )) {
            await Posts.update(
                { 'comments._id': req.params.commentId },
                { $pull: { 'comments': { _id: req.params.commentId } } }
            );

            return res.send({
                status: 'OK'
            });
        } else {
            return res.status(403).send({ error: "No Authorization" });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR',
            results: []
        });
    }
});

// Gerencia os Likes de um Post
router.put('/like/:commentId', async (req, res) => {
    try {
        const post = await Posts.findOne(
            { comments: { $elemMatch: { _id: req.params.commentId } } },
            { comments: { $elemMatch: { _id: req.params.commentId } } }
        );

        if (post == null) {
            return res.status(404).send({
                status: 'ZERO_RESULTS',
                results: []
            });
        } else {
            const comment = post.comments[0];

            if (comment == null || typeof comment == 'undefined') {
                return res.status(404).send({
                    status: 'ZERO_RESULTS',
                    results: []
                });
            }

            if (comment.likedBy != undefined && comment.likedBy.includes(req.userId)) {
                await Posts.findOneAndUpdate(
                    { comments: { $elemMatch: { _id: req.params.commentId } } },
                    { '$pull': { 'comments.$.likedBy': req.userId } },
                    { returnOriginal: false }
                );
            } else {
                await Posts.findOneAndUpdate(
                    { comments: { $elemMatch: { _id: req.params.commentId } } },
                    { '$push': { 'comments.$.likedBy': req.userId } },
                    { returnOriginal: false }
                );
            }

            return res.send({
                status: 'OK',
                results: []
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({
            status: 'UNKNOWN_ERROR',
            results: []
        });
    }
});

module.exports = app => app.use('/comments', router);