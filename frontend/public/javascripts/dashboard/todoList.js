function createTodoList() {
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


