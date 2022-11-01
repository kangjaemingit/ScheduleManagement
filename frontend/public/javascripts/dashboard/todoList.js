
function saveTodoList() {
    const newTodoList = {
        todoListVal: document.getElementById('todaySelect').value,

    }
}

function createTodoList() {
    let todayScheduleAdd = "";
    let addValue = document.getElementById('todaySelect').value;

    todayScheduleAdd += `<div id="addDiv" style="display: flex;"><input type="checkbox" id="todayCheckbox" onclick="todayCheckbox();"><div id="scheduleName"></div><div id="scheduleDate"></div></div>`

    document.getElementById('todayScheduleBox').innerHTML += todayScheduleAdd;
    let todaySchedule = document.getElementsByClassName('scheduleName')
    let todayScheduleTag = document.getElementById('addDiv')
    let checkBox = document.getElementsByClassName('todayCheckbox')
    let todayScheduleTagId = todayScheduleTag.id

    for (let i = 0; i < todaySchedule.length; i++) {
        if (i + 1 == todaySchedule.length) {
            document.getElementById('addDiv').id = todayScheduleTagId + addValue
            todaySchedule[i].innerHTML = addValue
            document.getElementById('todayCheckbox').id = addValue

            todayCheckbox();
        }

    }

}

let toggleButtonType = 'false'

function todayCheckbox() {
    let addValue = document.getElementById('todaySelect').value;
    document.getElementById('todayCheckbox');
    toggleButtonType

    console.log(toggleButtonType)
    if (toggleButtonType == true) {
        if (addValue === document.getElementById(addValue).id) {
            console.log("왜 안지워짐")
            .innerHTML=""
        }
    }
}

