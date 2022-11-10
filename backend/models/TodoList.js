const mongoose = require('mongoose');
/**
 * 담당자 : 김건희
 * 함수 설명 : 할일 항목의 스키마입니다.
 * 주요 기능 : - 할일의 타이틀, 할일 작성자, 체크박스 체크여부로 구성되어있습니다.
 *              - 할일 작성자는 사용자 모델과 단방향으로 매핑되어있습니다.
 * */
const TodoListSchema = mongoose.Schema({
    todoListVal : {type : String},
    todoListWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    success:{type:String}
});

const TodoList = mongoose.model('TodoList', TodoListSchema);

module.exports = { TodoList };