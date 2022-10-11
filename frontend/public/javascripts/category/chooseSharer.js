let userIdList = [];
let userList = [];
function userRender(users){
    let rows = [];
    users.map((user) => {
        rows += `<tr>`
            + (userIdList.includes(user._id) ? `<td><input type="checkbox" checked="true" onchange='userChecked(${JSON.stringify(user)}, this)'></td>` : `<td><input type="checkbox" onchange='userChecked(${JSON.stringify(user)}, this)'></td>`)
            + `<td><img class="chooseSharerProfilePhoto" src="${user.profilePhoto}"></td>`
            + `<td>${user.name}</td>`
            + `<td>${user.email}</td></tr>`;
    })
    document.getElementById('userTableBody').innerHTML = rows;
}

function chosenUserRender(users){
    let rows = [];
    users.map((user) => {
        rows += `<tr><td><img class="chooseSharerProfilePhoto" src="${user.profilePhoto}"></td>`
            + `<td>${user.name}</td>`
            + `<td>${user.email}</td>`
            + `<td><button onclick='chosenUserDelete(${JSON.stringify(user)})'>삭제</button></td></tr>`;
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
    // if(checkbox.checked){
    //     userIdList.push(id);
    //     userList.push({id : id, profilePhoto : profilePhoto, name : name, email : email});
    // } else{
    //     userIdList = userIdList.filter((user) => user !== id);
    //     userList = userList.filter((user) => user.id !== id);
    // }
    // chosenUserRender(userList);
}

function chosenUserDelete(user){
    console.log(user);
}