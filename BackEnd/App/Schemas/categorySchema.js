const mongoose = require("../../Database");

const CategorySchema = new mongoose.Schema({
    category: {
        type: String,
        require: true
    },
    uses : {
        type: Number,
        default: 0
    }
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;