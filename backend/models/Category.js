const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    categoryName : {
        type : String
    },
    tags : {
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"Tags"}]
    },
    sharer : {
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"User"}]
    },
    categoryWriter:{type : mongoose.Schema.Types.ObjectId, ref:"User"}
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };