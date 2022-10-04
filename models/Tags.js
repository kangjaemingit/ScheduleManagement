const mongoose = require('mongoose');

const TagSchema = mongoose.Schema({
    tagName : {
        type : String
    },
    tagWriter : {
        type : String
    }
})

const Tag = mongoose.model('Tag', TagSchema);

module.exports = { Tag };
