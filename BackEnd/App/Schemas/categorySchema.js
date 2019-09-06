const mongoose = require("../../Database");

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    uses : {
        type: Number,
        default: 0
    }
}, { versionKey: false });

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;