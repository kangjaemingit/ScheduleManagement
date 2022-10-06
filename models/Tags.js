const mongoose = require('mongoose');

const TagsSchema = mongoose.Schema({
    tagName : {
        type : String
    },
    tagWriter : {
        type : String
    },
    schedule : [{type : mongoose.Schema.Types.ObjectId, ref:"Schedule"}]
})

const Tags = mongoose.model('Tags', TagsSchema);

module.exports = { Tags };
