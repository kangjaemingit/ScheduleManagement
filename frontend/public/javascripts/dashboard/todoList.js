/*************************************************************
 * 담당자 : 김건희
 * 함수 : createTodoList()
 * 기능 : 할 일에 메모를 할때 생성되는 문자열을 입력 받아 backend에 저장
 *************************************************************/
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
            }).catch((err) => {
            console.log(err);
        })
    })
}
/*********************************************************************
 * 담당자 : 김건희
 * 함수 : appendTodoList()
 * 기능 : 1. backend에 저장했는 값을 가지고 frondend에 값들을 뿌려주는 역할
 *       2. 입력값을 입력하기 위해 엔터 또는 버튼을 누를시 input 입력값을 초기화
 *********************************************************************/
function appendTodoList(todoList) {
    let todayScheduleAdd = "";
    let addValue = document.getElementById('todaySelect').value;
    if(addValue===""){
        alert("입력란에 아무것도 없습니다. 입력하여주세요")
    }
    else {
        todayScheduleAdd += `<div id="${todoList._id}" onclick="deleteTodoList('${todoList._id}')" class="scheduleCheckBox" style="display: flex;">`
            + `<input type="checkbox" class="todayScheduleCheckBox" onclick="todayCheckbox('${todoList._id}', this)">`
            + `<div id="scheduleName">${addValue}</div>`
            + `</div>`

        document.getElementById('todayScheduleBox').innerHTML += todayScheduleAdd;
        document.getElementById('todaySelect').value = ""
    }
}
/************************************************************************
 * 담당자 : 김건희
 * 함수 : todayCheckbox()
 * 기능 : backend에 저장했는 값을 지움과 동시에 frontend에서도 같이 지워주는 기능
 ************************************************************************/
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
                if (checkbox.checked === true) {
                    document.getElementById(id).remove()
                }
            }
        }).catch((err)=>{
      console.log(err)
    })
}
/************************************************************************
 * 담당자 : 김건희
 * 기능 : 아래 쓴 것은 input에 입력값을 타이핑할때 이루어질 디테일 작성
 ************************************************************************/
let input = document.getElementById('todaySelect')
    input.oninput = function() {
    input.style.background='white'
    input.style.border='1px solid'

};
/************************************************************************
 * 담당자 : 김건희
 * 함수 : focusOut()
 * 기능 : input에서 포커스가 사라졌을때 디테일 작성
 ************************************************************************/
function focusOut(){
    //포커스가 사라지고 input 입력값이 비었을때
    if(document.getElementById('todaySelect').value=="")
    {
        input.style.outline= 'none';
        input.style.border= 'none';
        input.style.background= 'lightgrey';
    }
    //포커스가 사라지고 input 입력값이 있을때
    else {
        input.style.background='white'
        input.style.border='1px solid'
        input.style.textIndent='5px';
    }
}
/************************************************************************
 * 담당자 : 김건희
 * 기능 : 엔터를 입력시 input란의 입력값을 입력 div 영역에 입력
 ************************************************************************/

document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        createTodoList();
    };
}, true);

function deleteTodoList(id){
    console.log(id)
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
                    document.getElementById(id).remove()

            }
        }).catch((err)=>{
        console.log(err)
    })
}
