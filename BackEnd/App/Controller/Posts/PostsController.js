const express = require('express');
const router = express.Router();

const adm = require('../../Middleware/Adm');
const auth = require('../../Middleware/AuthToken');

const Posts = require('../../Schemas/postSchema');
const Categories = require('../../Schemas/categorySchema');

router.use(auth);

// Exibe todos os posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find().populate('author').populate('category').select('-comments');

        return res.send({ posts });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Finding Posts' });
    }
});

// Exibe um post especifico
router.get('/:postId', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.postId).populate('author').populate('comments.author').populate('category').populate('comments.likedBy').select('+likedBy');

        return res.send({ post });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Finding Post' });
    }
});

// Exibe todos os post de determinado autor
router.get('/author/:authorId', async (req, res) => {
    try {
        const post = await Posts.findOne({ author: req.params.authorId }).populate('author').populate('category').select('-comments');

        return res.send({ post });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Finding Posts' });
    }
});

// Exibe todos os post de determinada Categoria
router.get('/category/:categoryId', async (req, res) => {
    try {
        const post = await Posts.find({ category: req.params.categoryId }).populate('author').populate('category').select('-comments');

        return res.send({ post });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Finding Posts' });
    }
});

// Cria um novo Post
router.post('/', adm, async (req, res) => {
    try {
        const { category } = req.body;

        const post = await Posts.create({
            ...req.body,
            author: req.userId
        });

        await Categories.findByIdAndUpdate(category, { $inc: { uses: 1 } }, { new: true });

        return res.send({ post });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Creating New Post' });
    }
});

// Atualiza um Post
router.put('/:postId', adm, async (req, res) => {
    try {
        const { title, text } = req.body;

        const post = await Posts.findByIdAndUpdate(req.params.postId, { title, text }, { new: true });

        return res.send({ post });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Updating New Post' });
    }
});

// Delete um Post e -1 dos usos da Categoria
router.delete('/:postId', adm, async (req, res) => {
    try {
        const category = await Posts.findOne({ _id: req.params.postId }, { category: 1 });

        await Categories.findOneAndUpdate(
            { _id: category.category },
            { '$inc': { 'uses': -1 } }
        );

        await Posts.findByIdAndRemove(req.params.postId);

        return res.send({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Deleting Post' });
    }
});

// Gerencia os Likes de um Post
router.put('/like/:postId', async (req, res) => {
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
                        { '$pull': { 'likedBy': req.userId } },
                        { returnOriginal: false }
                    );
                    return res.send({ newPost });
                }
            } else {
                const newPost = await Posts.findOneAndUpdate(
                    { _id: req.params.postId },
                    { '$push': { 'likedBy': req.userId } },
                    { returnOriginal: false }
                );
                return res.send({ newPost });
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Unexpected Error' });
    }
});

module.exports = app => app.use('/posts', router);