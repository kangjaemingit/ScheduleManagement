let selectedSchedule = { // 선택된 일정 배열 선언
    id: null,
    title : null
};

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 생성 모달을 열어주는 함수입니다.
 * 주요 기능 : - 일정 선택란에 나의 모든 일정을 담아 렌더합니다.
 *            - 피드 생성 모달을 열어줍니다.
 * */
function feedModalOpen(){
    // 일정 불러오기
    fetch('calendar/getMySchedule', {
        method : 'get',
    }).then((res) => res.json())
        .then((res) => {
            if(!res.getMyScheduleSuccess){
                return window.alert(res.message);
            }
            feedScheduleRender(res.schedule); // 피드 모달 일정 렌더
        }).catch((err) => {
        console.log(err);
    })

    const feedModal = document.querySelector('.feedModal');
    const bodyScrollHidden=document.getElementsByTagName('body');

    feedModal.classList.toggle('show');
    bodyScrollHidden[0].style.overflow='auto'
    if(feedModal.classList.contains('show')){
        // body.style.overflow = 'hidden';
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 수정 모달을 열어주는 함수입니다.
 * 주요 기능 : - 피드 내용을 바인딩해줍니다.
 *           - 선택된 일정을 바인딩 합니다.
 *           - 저장 버튼의 onclick 속성을 변경합니다.
 * */
function feedEditModalOpen(feed){
    document.getElementById('feedContentsInput').value = feed.feedContents; // 피드 내용 바인딩
    if(feed.schedule){ // 스케줄이 있을 경우
        feedScheduleSelect(feed.schedule.title, feed.schedule._id) // 일정 렌더
    }

    document.getElementById('btnSaveFeed').setAttribute('onclick', `updateFeed('${feed._id}')`) // 저장 버튼 속성 변경

    feedModalOpen(); // 모달 열기
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 모달을 닫는 함수입니다.
 * 주요 기능 : - 모든 값들을 비우고 속성을 초기값으로 변경합니다.
 * */
function feedModalClose(){
    document.getElementById('selectedSchedule').innerHTML = ""; // 선택 일정 초기화
    document.getElementById('inputScheduleSearch').value = ""; // 검색란 초기화
    document.getElementById('feedContentsInput').value = ""; // 피드 내용 초기화
    document.getElementById('feedScheduleDeleteBtn').style.display = 'none'; // 피드 일정 삭제 버튼 안보이게에 함
    document.getElementById('btnSaveFeed').setAttribute('onclick', `createFeed()`) // 저장 버튼 속성 변경

    selectedSchedule.id = null;
    selectedSchedule.title = null;

    const feedModal = document.querySelector('.feedModal');
    const bodyScrollHidden=document.getElementsByTagName('body');
    feedModal.classList.toggle('show');
    bodyScrollHidden[0].style.overflow='auto';
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 모달 내의 일정 목록을 렌더하는 함수입니다.
 * 주요 기능 : - 일정 데이터를 인자로 받아 목록을 바인딩 합니다.
 * */
function feedScheduleRender(schedule){
    let rows = "";

    schedule.map((s) => {
        let startDate = new Date(s.date.startDate);
        let endDate = new Date(s.date.endDate);
        rows += `<div class="feedScheduleBox" onclick="feedScheduleSelect('${s.title}', '${s._id}')">`
            +`<div class="listIcon"></div>`
            + `<span style="margin-left: 5px; margin-right: 5px">${startDate.getFullYear()}.${startDate.getMonth() + 1}.${startDate.getDate()}
            - ${endDate.getFullYear()}.${endDate.getMonth() + 1}.${endDate.getDate()}</span>`
            + `<span>${s.title}</span>`;

        for(let i = 0; i<s.tag.length; i++){
            if(i > 1){
                rows += `<span class="feedScheduleTag">...</span>`
                break;
            }
            rows += `<span class="feedScheduleTag">#${s.tag[i].tagName}</span>`
        }

        rows += `</div>`

    });

    document.getElementById('scheduleViewArea').innerHTML = rows;
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 모달 내의 일정 목록을 검색하는 함수입니다.
 * 주요 기능 : - 키워드로 일정을 검색하는 API를 실행하여 값을 받아와 피드 일정 렌더 함수를 실행합니다.
 * */
function searchFeedSchedule(){
    event.preventDefault();
    const keyword = document.getElementById('inputScheduleSearch').value;
    fetch('schedule/getMyScheduleByKeyword', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({keyword : keyword})
    }).then((res) => res.json())
        .then((res) => {
            if(!res.getMyScheduleSuccess){
                console.log(res.message);
                return window.alert(res.message);
            }

            feedScheduleRender(res.schedule);
        }).catch((err) => {
        console.log(err);
    })
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 모달 내에서 일정을 선택했을 때 실행되는 함수입니다.
 * 주요 기능 : - 일정 선택 시 선택한 일정 영역에 일정 이름을 표시합니다.
 * */
function feedScheduleSelect(title, id){
    selectedSchedule = {
        id : id,
        title : title
    } // 전역변수에 일정 정보 담기

    // 데이터 바인딩
    let rows = "";

    rows += `<div style="display: flex; align-items: center">`
        + `<div class="listIcon"></div>`
        + `<span style="margin-left: 5px;">${title}</span></div>`

    document.getElementById('selectedSchedule').innerHTML = rows;
    document.getElementById('feedScheduleDeleteBtn').style.display = 'block';
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드를 생성하는 함수입니다.
 * 주요 기능 : - 피드 입력 데이터를 가공하여 피드 생성 API를 요청합니다.
 *            - 피드 저장 후에 새로운 피드를 페이지에 등록합니다.
 * */
function createFeed()  {
    const contents = document.getElementById('feedContentsInput').value; // 피드 내용

    if(contents === ""){ // 피드 내용 공백 여부 검증
        return toast("내용을 입력해주세요");
    }

    // 데이터 가공
    const data = {
        contents : contents,
        scheduleId : selectedSchedule.id
    }

    // 피드 생성 요청
    fetch('feed/createFeed', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then((res) => {
            if(!res.createFeedSuccess){
                console.log(res.message);
                return window.alert(res.message);
            }
            appendFeed(res.feed, res.user, [], true); // 피드 추가
            feedModalClose();

        }).catch((err) => {
        console.log(err);
    })
}
/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 등록 시 새로운 피드를 렌더 해주는 함수입니다.
 * 주요 기능 : - 피드 내용과 id로 새로운 피드 컴포넌트를 만들어 추가합니다.
 * */
function appendFeed(feed, user, comments, create){
    const feedContentContainer = document.createElement('div'); // 컨테이너 생성
    feedContentContainer.classList.add('feedContentContainer'); // 클래스 추가
    feedContentContainer.id = feed._id; // 컨테이너 아이디 지정

    let rows = "";

    // 피드 추가
    rows +=
        `
            <div class="feedTitleArea">
            <div style="display: flex; align-items: center">
                <img class="feedProfilePhoto" src="${feed.feedWriter.profilePhoto}">
                <h4>${feed.feedWriter.name}</h4>
            </div>
        `;

    if(feed.feedWriter._id.toString() === user._id.toString()){
        rows +=
            `
            <div class="feedControlBox">
                <img class="feedDeleteBtn" src="/images/editing.png" onclick=\`feedEditModalOpen(${feed})\`>
                <img class="feedDeleteBtn" src="/images/trash.png" onclick="deleteFeed('${feed._id}')"/>
            </div>
        `
    }


    rows +=
        `
            </div>
            <div class="feedContents" >
                <pre class="feedContentsTextArea" id="feedContents_${feed._id}">${feed.feedContents}</pre>
            </div>
            <div class="feedFooter">
                <img class="feedFooterIcon" src="images/chat.png">
                <span style="margin-left: 3px;" id="commentsLength_${feed._id}">${comments.length}</span>
        `;

    rows += feed.schedule ?
    `
        <img class="feedFooterIcon" src="images/calendar.png" style="margin-left: 10px;">
        <div style="display: flex; align-items: center;">
        <div class="listIcon"></div>
        <span style="margin-left: 5px;" id="selectedSchedule_${feed._id}">${feed.schedule.title}</span>
        </div>
    ` : "";

    rows +=
        `
            <img class="feedFooterIcon" src="images/clock.png" style="margin-left: 10px; margin-right: 5px">
            <span style="opacity: 0.4; font-size: 12px">${dateFormatter(feed.createDate)}</span>
        `

    rows += `</div>`;

    rows +=`<div class="feedCommentArea" id="feedCommentArea_${feed._id}">`
    comments.map((c) => {
        rows +=
            `
                <div class="feedCommentBox" id="${c._id}">
                <img class="feedCommentWriterProfile" src="${c.commentWriter.profilePhoto}">
                <span class="feedCommentWriterName">${c.commentWriter.name}</span>
                <span class="feedCommentContents">${c.comment}</span>
                <span class="feedCommentTime">${dateFormatter(c.createDate)}</span>
            `
            if((feed.feedWriter._id.toString() === user._id.toString()) || (c.commentWriter._id.toString() === user._id.toString())){
                    rows += `<img class="feedCommentDeleteBtn" src="images/close.png" onclick="deleteComment('${c._id}', '${feed._id}')">`
                }
        rows += `</div>`

    })
    rows += `</div>`
    rows +=
        `
            <div class="feedCommentWriteArea">
                <img class="feedCommentWriterProfile" style="width: 30px; height: 30px;" src="${user.profilePhoto}">
                <form class="commentWriteForm" onsubmit="commentCreate('${feed._id}')">
                    <input class="input-primary" type="text" style="height: 24px; width: 100%" id="commentInput_${feed._id}">
                    <button type="submit" class="btn-secondary commentBtn">작성</button>
                </form>
            </div>
        `;



    feedContentContainer.innerHTML = rows;
    const parent = document.getElementById('feedArea');
    if(create){
        parent.insertBefore(feedContentContainer, parent.firstChild); // 첫 번째 위치
    } else{
        parent.appendChild(feedContentContainer); // 마지막 위치
    }


    document.getElementById('feedContentsInput').value = "";
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드를 수정하는 함수입니다.
 * 주요 기능 : - 수정된 피드 내용으로 피드 수정 API를 요청합니다.
 * */
function updateFeed(feedId){
    const contents = document.getElementById('feedContentsInput').value; // 피드 내용

    const data = { // 데이터 가공
        feedId : feedId,
        feedContents : contents,
        scheduleId : selectedSchedule.id
    }

    if(contents === ""){ // 내용 공백 여부 검증
        return toast("내용을 입력해주세요");
    }

    // API 요청
    fetch('feed/updateFeed', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then((res) => {
            if(!res.updateFeedSuccess){
                console.log(res.message);
                return window.alert(res.message);
            }
            document.getElementById('feedContents_' + feedId).innerText = contents; // 기존 피드의 내용 변경
            document.getElementById('selectedSchedule_' + feedId).innerText = selectedSchedule.title; // 기존 피드의 일정 변경

            feedModalClose();

        }).catch((err) => {
        console.log(err);
    })

}

/**
 * 담당자 : 강재민
 * 함수 설명 : 피드 생성 혹은 수정시 매핑된 일정을 삭제하는 함수입니다.
 * 주요 기능 : - 선택된 일정 변수를 비우고, 모달 내의 html text도 비워줍니다.
 * */
function feedScheduleDelete(){
    // 변수 초기화
    selectedSchedule.id = null;
    selectedSchedule.title = null;

    // html 바인딩
    document.getElementById('selectedSchedule').innerHTML = "";
    document.getElementById('feedScheduleDeleteBtn').style.display = 'none';

}

function dateFormatter(date){
    let today = new Date();
    let inputDate = new Date(date);
    let todayToSeconds = (today.getTime() / 1000); // 오늘 날짜를 초로 변환
    let dateToSeconds = (inputDate.getTime() / 1000); // 인자로 받아온 날짜를 초로 변환
    let elapsedSec = todayToSeconds - dateToSeconds;

    let result;

    // 시간 별로 '방금전', 'n 분전', 'n 시간 전', 'n 일전' 표시
    if(elapsedSec > 86400){
        result = (elapsedSec / 86400).toFixed(0).toString() + "일 전"
    } else if(elapsedSec > 3600){
        result = (elapsedSec / 3600).toFixed(0).toString() + "시간 전"
    } else if(elapsedSec > 60){
        result = (elapsedSec / 60).toFixed(0).toString() + "분 전"
    } else{
        result = "방금 전";
    }
    return result;
}