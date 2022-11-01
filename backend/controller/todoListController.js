const {TodoList} = require('../models/TodoList');
const {User} = require('../models/User');
const {Category} = require("../models/Category");

const todoListController = {
    newTodoList: async (req, res) => {
        await TodoList.create({
            todoListVal: req.body.todoListVal,
            todoListWriter: req.user._id,

        }, (err, result) => {
            if (err) {
                console.log("new Category create Error:" + err);
                return res.json({newTodoListSuccess: false, message: err});
            } else {
                return res.json({newTodoListSuccess: true})
                    .status(200);
            }
        });
    },

}
module.exports = todoListController;