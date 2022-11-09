let express = require('express');

const todoListController = require("../controller/todoListController");

let router = express.Router();

/**********************************************************************************
 * 담당자 : 김건희
 * 함수 설명 : 새로운 할 일을 생성해주는 함수
 * 주요 기능 : - todoListController의 newTodoList 함수와 주소를 연결해주는 역할을 합니다.
 * * ********************************************************************************/
router.post('/createTodoList', todoListController.newTodoList);

/**********************************************************************************
 * 담당자 : 김건희
 * 함수 설명 : 할 일을 수정해주는 함수
 * 주요 기능 : - todoListController의 updateTodoList 함수와 주소를 연결해주는 역할을 합니다.
 * * ********************************************************************************/
//add
router.post('/updateTodoList',todoListController.updateTodoList)
/**********************************************************************************
 * 담당자 : 김건희
 * 함수 설명 : 할 일을 수정해주는 함수
 * 주요 기능 : - todoListController의 deleteTodoList 함수와 주소를 연결해주는 역할을 합니다.
 * ********************************************************************************/
// delete
router.post('/deleteTodoList', todoListController.deleteTodoList);

module.exports=router;