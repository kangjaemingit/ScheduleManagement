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
                appendTodoList(res.todoList);
                todayCheckbox(res.todoList);
            }).catch((err) => {
            console.log(err);
        })
    })
}

function appendTodoList(todoList) {
    let todayScheduleAdd = "";
    let addValue = document.getElementById('todaySelect').value;

    todayScheduleAdd += `<div id="${todoList._id}" class="scheduleCheckBox" style="display: flex;">`
        + `<input type="checkbox" onclick="todayCheckbox('${todoList._id}', this)">`
        + `<div id="scheduleName">${addValue}</div>`
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

};
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

document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        createTodoList();
    };
}, true);