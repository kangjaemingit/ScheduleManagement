let express = require('express');

const todoListController = require("../controller/todoListController");

let router = express.Router();

router.post('/createTodoList', todoListController.newTodoList);

//add
router.post('/updateTodoList',todoListController.updateTodoList)

// delete
router.post('/deleteTodoList', todoListController.deleteTodoList);

module.exports=router;