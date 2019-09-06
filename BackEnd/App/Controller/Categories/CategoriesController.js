const express = require('express');
const router = express.Router();

const auth = require("../../Middleware/AuthToken");

const Categories = require("../../Schemas/categorySchema");
const Posts = require("../../Schemas/postsSchema");

router.use(auth);

// Exibe todos as Categorias
router.get("/", async (req, res) => {
    try {
        const category = await Categories.find();

        return res.send({ category });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Finding Categories" });
    }
});

// Cria uma nova Categoria
router.post("/", async (req, res) => {
    if ( !req.admins.includes(req.userId) ) {
        return res.status(403).send({ error: "No Permission To Access This Resource" });
    }
    try {
        const category = await Categories.create( req.body );

        return res.send({ category });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Creating New Post" });
    }
});

// Atualiza uma Categoria
router.put("/:categoryId", async (req, res) => {
    if ( ! req.admins.includes(req.userId) ) {
        return res.status(403).send({ error: "No Permission To Access This Resource" });
    }
    try {
        const category = await Categories.findByIdAndUpdate(req.params.categoryId, req.body, { new: true });

        return res.send({ category });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Updating New Post" });
    }
});

// Delete uma Categoria e Retira a Categoria dos posts
router.delete("/:categoryId", async (req, res) => {
    if ( ! req.admins.includes(req.userId) ) {
        return res.status(403).send({ error: "No Permission To Access This Resource" });
    }
    try {
        Posts.updateMany({ category: req.params.categoryId }, { category: null });

        await Categories.findByIdAndRemove(req.params.categoryId);

        return res.send({ ok: true });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "Error Deleting Category" });
    }
});

module.exports = app => app.use("/categories", router);