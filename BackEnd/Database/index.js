const mongoose = require("mongoose");

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://localhost/blogFATEC", { useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;