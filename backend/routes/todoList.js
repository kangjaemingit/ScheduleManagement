let express = require('express');
const {checkAuth} = require("../config/auth");
const todoListController = require("../controller/todoListController");
const calendarController = require("../controller/calendarController");
const categoryController = require("../controller/categoryController");
let router = express.Router();

router.post('/newTodoList', todoListController.newTodoList);

//add
router.get('/:id',todoListController.addTodoList)

// delete
router.delete('/deleteTodoList/:id', todoListController.deleteTodoList);