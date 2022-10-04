const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    categoryName : {
        type : String
    },
    Tags : {
        type : [String]
    },
    sharer : {
        type : [String]
    }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };