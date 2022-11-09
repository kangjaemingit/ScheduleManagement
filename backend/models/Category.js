const mongoose = require('mongoose');

/**
 * 담당자 : 강재민, 김건희
 * 함수 설명 : 카테고리 항목의 스키마입니다.
 * 주요 기능 : - 함수명, 태그, 공유자, 작성자로 구성되어있습니다.
 *              - 태그, 공유자, 카테고리 작성자는 각각 태그 모델, 유저 모델과 단방향으로 매핑되어 있습니다.
 * */
const CategorySchema = mongoose.Schema({
    categoryName : { // 카테고리명
        type : String
    },
    tags : { // 태그
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"Tags"}]
    },
    sharer : { // 공유자
        type : [{type : mongoose.Schema.Types.ObjectId, ref:"User"}]
    },
    categoryWriter:{ // 카테고리 작성자
        type : mongoose.Schema.Types.ObjectId, ref:"User",
        index : true
    }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };