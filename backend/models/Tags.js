const mongoose = require('mongoose');

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 항목의 스키마입니다.
 * 주요 기능 : - 태그명, 태그작성자, 일정으로 구성되어있습니다.
 *              - 태그 작성자는 사용자 모델과 단방향으로 매핑되어있습니다.
 *              - 일정은 일정 모델과 양방향으로 매핑되어 있습니다.
 * */
const TagsSchema = mongoose.Schema({
    tagName : { // 태그 명
        type : String
    },
    tagWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"}, // 태그 작성자
    schedule : [{type : mongoose.Schema.Types.ObjectId, ref:"Schedule"}] // 일정
})

const Tags = mongoose.model('Tags', TagsSchema);

module.exports = { Tags };
