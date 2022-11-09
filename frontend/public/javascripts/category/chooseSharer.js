/**
 * 담당자 : 강재민
 * 파일 설명 : 카테고리 생성 모달에서 공유자 선택 모달의 기능을 위한 javaScript 파일 입니다.
 * */

let userList = []; // 유저 목록 배열 선언

/**
 * 담당자 : 강재민
 * 함수 설명 : 사용자 선택 창에 사용자 목록을 입력받아 선택된 사용자, 선택되지 않은 사용자, 검색된 사용자 등을 렌더링 하는 함수입니다.
 * 주요 기능 : - userList 배열에 담겨있는 사용자는 체크 표시된 채로 렌더, 담겨있지 않은 사용자는 체크 표시가 해제된 상태로 렌더링 됩니다.
 * */
function userRender(users){
    let rows = [];

    users.map((user) => {
        rows += `<tr>`
            // 유저리스트에 선택된 사용자봐 받아온 사용자의 id가 존재하는지 여부 판단
            + (userList.some(u => u._id === user._id) ?
                `<td><input type="checkbox" checked="true" id="cb_${user._id}" onchange='userChecked(${JSON.stringify(user)}, this)'></td>` // 존재할 시
                : `<td><input type="checkbox" id="cb_${user._id}" onchange='userChecked(${JSON.stringify(user)}, this)'></td>`) // 존재하지 않을 시
            + `<td><img class="chooseSharerProfilePhoto" src="${user.profilePhoto}"></td>`
            + `<td>${user.name}</td>`
            + `<td>${user.email}</td></tr>`;
    })

    document.getElementById('userTableBody').innerHTML = rows; // 유저 목록에 삽입
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 선택된 사용자 목록을 렌더링하는 함수입니다.
 * 주요 기능 : - userList 배열에 담겨있는 사용자를 선택된 사용자 목록에 렌더링 합니다.
 * */
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

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유자 선택 모달을 열어주는 함수입니다.
 * 주요 기능 : - 유저목록 전체를 받아와 userRender함수를 통해 사용자 목록을 전체 렌더링 합니다.
 * */
async function chooseSharerModalOpen(){
    const chooseSharerModal = document.querySelector('.chooseSharerModal');

    // 사용자 목록 불러오기
    fetch('calendar/getUserList', {
        method:"get"
    }).then((res) => res.json())
        .then((res) => {
            if(res.getUserSuccess === false){
                console.log(res.message);
                window.alert("유저정보 불러오기 실패");
                return;
            }

            // 불러온 사용자 목록 렌더
            userRender(res.users);
        })

    // 모달 열기
    chooseSharerModal.classList.toggle('show');
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유자 선택 모달을 닫는 함수입니다.
 * */
function chooseSharerModalClose(){
    const chooseSharerModal = document.querySelector('.chooseSharerModal');
    chooseSharerModal.classList.toggle('show');
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유자를 검색으로 찾아오는 함수입니다.
 * 주요 기능 : - 키워드에 따라 API에서 사용자를 검색하여 렌더링합니다.
 * */
function searchUser(){
    event.preventDefault();

    // 키워드로 사용자 검색
    // get 함수 사용시 특수문자 검색이 안되는 이슈가 있어 post로 변경
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

/**
 * 담당자 : 강재민
 * 함수 설명 : 사용자목록에서 사용자가 체크되었을 때 실행되는 함수입니다.
 * 주요 기능 : - 체크가 되었을 시에 userList 배열에 유저정보를 담아줍니다.
 *            - 체크가 해제되었을 시에는 userList 배열에서 해당유저를 삭제합니다.
 *            - chosenUserRender 함수를 통해 선택된 사용자를 렌더링합니다.
 * */
function userChecked(user, checkbox){
    if(checkbox.checked){ // 체크박스에 체크가 되었을 시
        userList.push(user);
    } else{ // 체크박스에 체크가 해제되었을 시
        userList = userList.filter((u) => u._id !== user._id);
    }

    chosenUserRender(); // 선택된 사용자 렌더
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 선택된 사용자목록에서 사용자 삭제 버튼을 클릭했을 때 실행되는 함수입니다.
 * 주요 기능 : - userList에서 사용자정보를 삭제합니다.
 *            - 사용자 선택란에서 해당 사용자의 체크박스를 해제합니다.
 *            - chosenUserRender 함수를 통해 선택된 사용자를 렌더링합니다.
 * */
function chosenUserDelete(user){
    userList = userList.filter((u) => u._id !== user._id);

    document.getElementById(`cb_${user._id}`).checked = false;

    chosenUserRender();
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 공유자 모달에서 공유자 선택 후 완료 버튼을 클릭했을때 실행되는 함수입니다.
 * 주요 기능 : - 카테고리 모달의 선택된 공유자에 사용자를 추가하여 렌더합니다.
 *            - 공유자 모달을 닫습니다.
 * */
function saveChooseSharer(){
    const chooseSharerModal = document.querySelector('.chooseSharerModal');
    let rows = [];

    // 카테고리 모달의 선택된 공유자 목록 렌더링
    userList.map((user) => {
        rows += `<div class="sharersP" style="margin-left: 5px"><img id="sharerProfilePhoto" class="sharerProfilePhoto" src="${user.profilePhoto}"><span class="sharerSpan">${user.name}</span></img></div>`
            // `<div class="sharersP" style="margin-left: 5px"><span class="sharerSpan">${user.name}(${user.email})</span></div>`
    })
    document.getElementById('chosenSharer').innerHTML = rows;

    // 공유자 선택 모달 닫기
    chooseSharerModal.classList.remove('show');
}