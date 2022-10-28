let userList = [];

function userRender(users){
    let rows = [];

    users.map((user) => {
        rows += `<tr>`
            + (userList.some(u => u._id === user._id) ?
                `<td><input type="checkbox" checked="true" id="cb_${user._id}" onchange='userChecked(${JSON.stringify(user)}, this)'></td>`
                : `<td><input type="checkbox" id="cb_${user._id}" onchange='userChecked(${JSON.stringify(user)}, this)'></td>`)
            + `<td><img class="chooseSharerProfilePhoto" src="${user.profilePhoto}"></td>`
            + `<td>${user.name}</td>`
            + `<td>${user.email}</td></tr>`;
    })

    document.getElementById('userTableBody').innerHTML = rows;
}

function chosenUserRender(){
    let rows = [];
    userList.map((user) => {
        rows += `<tr><td><img class="chooseSharerProfilePhoto" src="${user.profilePhoto}"></td>`
            + `<td>${user.name}</td>`
            + `<td>${user.email}</td>`
            + `<td><img src="/images/trash.png" class="deleteBtn" onclick='chosenUserDelete(${JSON.stringify(user)})'></td></tr>`;
    })

    document.getElementById('chosenUserTableBody').innerHTML = rows;
}

const chooseSharerModal = document.querySelector('.chooseSharerModal');
async function chooseSharerModalOpen(){
    fetch('calendar/getUserList', {
        method:"get"
    }).then((res) => res.json())
        .then((res) => {
            if(res.getUserSuccess === false){
                console.log(res.message);
                window.alert("유저정보 불러오기 실패");
                return;
            }
            userRender(res.users);
        })

    chooseSharerModal.classList.toggle('show');
}

function chooseSharerModalClose(){
    chooseSharerModal.classList.toggle('show');
}

function searchUser(){
    event.preventDefault();

    fetch('calendar/searchUser', {
        method : "post",
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify({keyword : document.getElementById('searchKeyword').value})
    }).then((res) => res.json())
        .then((res) => {
            if(res.searchUserSuccess === false){
                window.alert("유저 검색에 실패했습니다.")
                console.log(res.message);
            }
            userRender(res.users);
        })
}


function userChecked(user, checkbox){
    console.log(user);
    if(checkbox.checked){
        userList.push(user);
    } else{
        userList = userList.filter((u) => u._id !== user._id);
    }
    chosenUserRender();
}

function chosenUserDelete(user){
    userList = userList.filter((u) => u._id !== user._id);


    document.getElementById(`cb_${user._id}`).checked = false;

    chosenUserRender();
}

function saveChooseSharer(){
    let rows = [];
    ;
    userList.map((user) => {
        rows += `<div class="sharersP" style="margin-left: 5px"><img id="sharerProfilePhoto" class="sharerProfilePhoto" src="${user.profilePhoto}"><span class="sharerSpan">${user.name}</span></img></div>`
            // `<div class="sharersP" style="margin-left: 5px"><span class="sharerSpan">${user.name}(${user.email})</span></div>`
    })
    document.getElementById('chosenSharer').innerHTML = rows;
    chooseSharerModal.classList.remove('show');
}