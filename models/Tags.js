const mongoose = require('mongoose');

const TagSchema = mongoose.Schema({
    tagName : {
        type : String
    },
    tagWriter : {
        type : String
    },
    count : {
        type : Number
    }
})

const Tag = mongoose.model('Tag', TagSchema);

module.exports = { Tag };
