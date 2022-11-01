const mongoose = require('mongoose');

const TodoListSchema = mongoose.Schema({
    todoListVal : {type : String},
    todoListWriter : {type : mongoose.Schema.Types.ObjectId, ref:"User"}

});

const TodoList = mongoose.model('TodoList', TodoListSchema);

module.exports = { TodoList };