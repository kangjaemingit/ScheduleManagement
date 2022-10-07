const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    categoryName : {
        type : String
    },
    Tags : {
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"Tags"}]
    },
    sharer : {
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"User"}]
    },
    categoryWriter:{
      type:String
    }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };