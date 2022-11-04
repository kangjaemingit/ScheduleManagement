const {TodoList} = require('../models/TodoList');

const todoListController = {
    newTodoList: async (req, res) => {
        await TodoList.create({
            todoListVal: req.body.todoListVal,
            todoListWriter: req.user._id,
        }, (err, result) => {
            console.log(result)
            if (err) {
                console.log("new Category create Error:" + err);
                return res.json({newTodoListSuccess: false, message: err});
            } else {
                return res.json({newTodoListSuccess: true, todoList:result, user : req.user}).status(200);
            }
        });
    },
    updateTodoList : (req,res)=>{
        TodoList.updateOne({_id : req.body.id},
            {$set:{todoListVal:req.body.todoListVal}},(err)=>
            {
                if(err){
                    console.log(err);
                    return res.json({updateTodoListSuccess:false,message:err})
                }
                return res.json({updateTodoListSuccess:true}).status(200);
            });
    },
    deleteTodoList : (req,res)=>{
        TodoList.findOneAndDelete({_id : req.body._id, todoListWriter:req.user._id},(err)=>
        {
            if(err){
                console.log(err);
                return res.json({deleteTodoListSuccess:false,message:err});
            }
            return res.json({deleteTodoListSuccess:true}).status(200);
        })
    }
}
module.exports = todoListController;