const express = require('express');
const router = express.Router();

const adm = require('../../Middleware/Adm');
const auth = require('../../Middleware/AuthToken');

const Categories = require('../../Schemas/categorySchema');
const Posts = require('../../Schemas/postSchema');

router.use(auth);

// Exibe todos as Categorias
router.get('/', async (req, res) => {
    try {
        const category = await Categories.find().select('+uses');

        return res.send({ category });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Finding Categories' });
    }
});

// Cria uma nova Categoria
router.post('/', adm, async (req, res) => {
    try {
        const category = await Categories.create( req.body );

        return res.send({ category });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Creating New Category' });
    }
});

// Atualiza uma Categoria
router.put('/:categoryId', adm, async (req, res) => {
    try {
        const category = await Categories.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });

        return res.send({ category });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Updating New Post' });
    }
});

// Delete uma Categoria e Retira a Categoria dos posts
router.delete('/:categoryId', adm, async (req, res) => {
    try {
        await Posts.updateMany({ category: req.params.categoryId }, { category: null });

        await Categories.findByIdAndRemove(req.params.categoryId);

        return res.send({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Error Deleting Category' });
    }
});

module.exports = app => app.use('/categories', router);