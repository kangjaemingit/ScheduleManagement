/*************************************************************************
 * 담당자 : 김건희
 * 함수 설명 : 대시보드 페이지의 할 일 메모를 backend에 저장하는 함수
 * 주요 기능 : - 사용자가 적은 값을 저장하고 삭제하기 전까지 해당페이지에 띄워준다
 *           - 사용자가 삭제시 해당값을 backend에서 삭제
 * **********************************************************************/
const {TodoList} = require('../models/TodoList');

const todoListController = {
/*************************************************************************
 * 담당자 : 김건희
 * 함수 설명 : 대시보드 페이지의 할 일 메모를 backend에 저장하는 함수
 * 주요 기능 : - 사용자가 적은 값을 저장하고 삭제하기 전까지 해당페이지에 띄워준다
 * ***********************************************************************/
    newTodoList: async (req, res) => {
        await TodoList.create({
            todoListVal: req.body.todoListVal,
            todoListWriter: req.user._id,
        }, (err, result) => {
            if (err) {
                console.log("new Category create Error:" + err);
                return res.json({newTodoListSuccess: false, message: err});
            } else {
                return res.json({newTodoListSuccess: true, todoList:result, user : req.user}).status(200);
            }
        });
    },
    /*************************************************************************
     * 담당자 : 김건희
     * 함수 설명 : 대시보드 페이지의 할 일 메모를 backend에 저장하는 함수
     * 주요 기능 : - 사용자 해당 일정을
     * ***********************************************************************/
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
    /*************************************************************************
     * 담당자 : 김건희
     * 함수 설명 : 대시보드 페이지의 할 일 메모를 backend에 저장하는 함수
     * 주요 기능 : - 사용자가 삭제시 해당값을 backend에서 삭제
     * ***********************************************************************/
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