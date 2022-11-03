function createTodoList() {
        input.style.outline= 'none';
        input.style.border= 'none';
        input.style.background= 'lightgrey';

    const todoListVal = document.getElementById('todaySelect').value
    fetch('todoList/createTodoList', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({todoListVal: todoListVal})
    }).then((res) => {
        res.json()
            .then((res) => {
                if (!res.newTodoListSuccess) {
                    console.log(res.message);
                    return window.alert(res.message);
                }
                appendTodoList(res.todoList, res.user);
                todayCheckbox(res.todoList, res.user)
            }).catch((err) => {
            console.log(err);
        })
    })
}

function appendTodoList(todoList, user) {
    let todayScheduleAdd = "";
    let addValue = document.getElementById('todaySelect').value;

    todayScheduleAdd += `<div id="${todoList._id}" style="display: flex;">`
        + `<input type="checkbox" onclick="todayCheckbox('${todoList._id}', this)">`
        + `<div id="scheduleName">${addValue}</div>`
        + `<div id="scheduleDate"></div>`
        + `</div>`

    document.getElementById('todayScheduleBox').innerHTML += todayScheduleAdd;
    document.getElementById('todaySelect').value = ""
}

function todayCheckbox(id, checkbox) {
    fetch('todoList/deleteTodoList', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id: id})
    }).then((res) => res.json())
        .then((res) => {
            if (!res.deleteTodoListSuccess) {
                console.log(res.message);
                return window.alert(res.message);
            } else {
                console.log(id)
                if (checkbox.checked === true) {
                    document.getElementById(id).remove()
                }
            }
        }).catch((err)=>{
      console.log(err)
    })
}
let input = document.getElementById('todaySelect')
input.oninput = function() {
    input.style.background='white'
    input.style.border='1px solid'
    // if(input.value==""){
    //     input.style.outline= 'none';
    //     input.style.border= 'none';
    //     input.style.background= 'lightgrey';
    // }
};
function todaySelectFocus(){
    let target = event.target
    if(target == event.currentTarget.querySelector("#todaySelect")){
        input.style.outline= 'none';
        input.style.border= 'none';
        input.style.background= 'lightgrey';
    }
    else{
        input.style.background='white';
        input.style.border='1px solid';
        input.style.textIndent='5px';
        input.style.width= '100%';
        input.style.height= '100%';
        input.style.outline= 'none';
        input.style.borderRadius= '10px';


    }
}
function focusOut(){
    if(document.getElementById('todaySelect').value=="")
    {
        input.style.outline= 'none';
        input.style.border= 'none';
        input.style.background= 'lightgrey';
    }
    else {
        input.style.background='white'
        input.style.border='1px solid'
        input.style.textIndent='5px';
    }
}
function enterEvent(){
    createTodoList();
    focusOut();
}