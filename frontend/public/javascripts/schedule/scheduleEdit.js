/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 상세페이지의 일정 편집, 삭제버튼 렌더 함수 입니다.
 * 주요 기능 : - 일정 작성자 본인인지 아닌지 판단하고, 본인이면 수정과 삭제 버튼을 보이게합니다.
 * */
function scheduleEditControlRender(scheduleOwner, schedule){
    if(scheduleOwner){ // 일정 작성자이면
        document.getElementById('editModeBtn').style.display = 'block';
        document.getElementById('editModeBtn').setAttribute("onclick", `scheduleEditModalOpen('${schedule._id}')`)
        if(schedule.complete){ // 일정이 완료 상태이면
            document.querySelector('.scheduleDetailCompleteImg').setAttribute("onclick", `editComplete('${schedule._id}', false)`)
        } else{ // 일정이 미완료 상태이면
            document.querySelector('.scheduleDetailCompleteImg').setAttribute("onclick", `editComplete('${schedule._id}', true)`)
        }
        document.querySelector('.scheduleDetailCompleteImg').style.cursor = 'pointer'; // 커서 포인터 설정
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 상세모달을 여는 함수 입니다.
 * 주요 기능 : - 일정을 불러와 일정에 맞도록 데이터를 바인딩하고, input을 모두 readOnly로 변경합니다.
 * */
function scheduleDetailModalOpen(scheduleId, calendarPage){
    const scheduleModal = document.querySelector('.scheduleModal'); // 일정 모달
    const replaceBody=document.getElementById('replaceBody')
    if(replaceBody) {
        replaceBody.style.overflow = 'hidden' // 스크롤 숨기기
    }
    // 일정 정보 불러오기
    fetch('/schedule/getScheduleById/' + scheduleId, {
        method : "get"
    }).then((res) => res.json())
        .then((res) => {
            if(res.getScheduleSuccess === false){
                console.log(res.message);
                window.alert(res.message);
                return;
            }

            // 완료 이미지 세팅
            const completeImg = res.schedule.complete ?
                `<img class="scheduleDetailCompleteImg" src="images/complete.png" style="width: 25px; height: 25px;">` :
                `<img class="scheduleDetailCompleteImg" src="images/ready.png" style="width: 25px; height: 25px;">`

            // 데이터 바인딩
            document.getElementById('scheduleModalName').innerText = `<${res.schedule.title}>`; // 모달 제목
            document.getElementById('scheduleModalTitleBox').innerHTML += completeImg; // 완료 상태 이미지
            document.getElementById('scheduleTitle').value = res.schedule.title; // 일정 제목
            document.getElementById('contents').value = res.schedule.contents; // 일정 내용
            document.getElementById('startDate').value = dateFormat(res.schedule.date.startDate).toISOString().slice(0, 16) // 시작일
            document.getElementById('endDate').value = dateFormat(res.schedule.date.endDate).toISOString().slice(0, 16) // 마감일
            document.getElementById('priority').value = res.schedule.priority; // 우선순위
            if(res.schedule.address !== ""){ // 주소가 있으면
                document.getElementById('addressExist').checked = true; // 주소여부 체크박스 true
                document.getElementById('address').value = res.schedule.address; // 주소
                document.getElementById('keyword').value = res.schedule.address; // 주소 검색 창
                useAddress(document.getElementById('addressExist')); // 주소여부 체크박스 변경에 따른 함수 실행
                searchPlaces(); // 위치 검색 및 지도 표시
                relayout(); // 지도 재 렌더링
            }
            tags = res.schedule.tag.map((t) => {
                return t.tagName;
            }) // 태그를 태그 변수에 담아줌

            tagRenderNotDeleteBtn(); // 태그 렌더(삭제 버튼 없이)

            // 뷰에서 readOnly 처리
            document.getElementById('scheduleModalName').readOnly = true
            document.getElementById('scheduleTitle').readOnly = true
            document.getElementById('contents').readOnly = true
            document.getElementById('startDate').readOnly = true
            document.getElementById('endDate').readOnly = true
            document.getElementById('priority').disabled = true
            document.getElementById('addressExist').disabled = true
            document.getElementById('menu_wrap').style.display = 'none';
            document.getElementById('scheduleCompleteBtnArea').style.display = 'none';
            document.getElementById('tagInputDiv').style.display = 'none';

            // input readOnly 디자인으로 변경
            document.getElementById('scheduleModalName').classList.replace('input-primary', 'input-primary-readOnly');
            document.getElementById('scheduleTitle').classList.replace('input-primary', 'input-primary-readOnly');
            document.getElementById('contents').classList.replace('input-primary', 'input-primary-readOnly');
            document.getElementById('startDate').classList.replace('input-primary', 'input-primary-readOnly');
            document.getElementById('endDate').classList.replace('input-primary', 'input-primary-readOnly');

            // 일정 작성자이면 편집모드 버튼 보이게함(캘린터 페이지에서만)
            if(calendarPage){
                scheduleEditControlRender(res.scheduleOwner, res.schedule);
            }

            if(!res.scheduleOwner){
                let scheduleWriteArea = document.getElementById('scheduleWriterArea');

                scheduleWriteArea.innerHTML = `
                    <span class="scheduleWriterTitle">작성자 : </span>
                    <img class="scheduleWriterProfilePhoto" src="${res.schedule.scheduleWriter.profilePhoto}"/>
                    <span>${res.schedule.scheduleWriter.name}</span>
                `
            }


        }).catch((e) => {
        console.log(e);
    })

    scheduleModal.classList.toggle('show');
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 수정 모달을 여는 함수 입니다.
 * 주요 기능 : - 일정 상세 모달에서 수정으로 넘어가도록 하는 함수입니다.
 *           - 데이터 바인딩 및 input readOnly 해제, 버튼 함수 속성 변경을 합니다.
 * */
function scheduleEditModalOpen(scheduleId){
    document.getElementById('scheduleModalName').innerText += " 일정 편집"; //모달 제목 변경
    tagRender(); // 삭제버튼 있는 태그로 다시 렌더

    // readOnly 해제
    document.getElementById('scheduleModalName').readOnly = false
    document.getElementById('scheduleTitle').readOnly = false
    document.getElementById('contents').readOnly = false
    document.getElementById('startDate').readOnly = false
    document.getElementById('endDate').readOnly = false
    document.getElementById('priority').disabled = false
    document.getElementById('addressExist').disabled = false

    // input 디자인 변경을 위한 클래스 변경
    document.getElementById('scheduleModalName').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('scheduleTitle').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('contents').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('startDate').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('endDate').classList.replace('input-primary-readOnly', 'input-primary');

    document.getElementById('menu_wrap').style.display = 'block' // 버튼 그룹을 보이게
    document.getElementById('scheduleCompleteBtnArea').style.display = 'flex'; // 완료 버튼 영역을 보이게
    document.getElementById('tagInputDiv').style.display = 'block'; // 태그 입력란 보이게
    document.getElementById('editModeBtn').style.display = 'none'; // 수정 버튼 안보이게

    document.getElementById('btnDeleteSchedule').setAttribute("onclick", `deleteSchedule('${scheduleId}')`); // 삭제 버튼 속성 변경
    document.getElementById('btnDeleteSchedule').style.display = 'block'; // 삭제 버튼 보이게

    document.getElementById('btnSaveSchedule').setAttribute("onclick", `updateSchedule('${scheduleId}')`) // 완료 버튼 속성 변경
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 편집을 완료하는 함수입니다.
 * 주요 기능 : - 편집된 데이터를 받아와 데이터를 가공하고
 *            - 수정 API를 요청합니다.
 * */
function updateSchedule(scheduleId){
    const schedule = {
        scheduleId : scheduleId,
        title : document.getElementById('scheduleTitle').value,
        contents : document.getElementById('contents').value,
        startDate : document.getElementById('startDate').value,
        endDate : document.getElementById('endDate').value,
        priority : document.getElementById('priority').value,
        tag : tags,
        address : document.getElementById('address').value
    } // 데이터 가공

    if(!document.getElementById('addressExist').checked){ // 주소 지정 여부 체크 해제시 일정 공백 처리
        schedule.address = "";
    }

    if(!validCheck(schedule)){ // 유효성 검사
        return;
    }

    // 일정 수정 API 요청
    fetch('schedule/updateSchedule', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(schedule)
    }).then((res) => res.json())
        .then((res) => {
            if(res.updateScheduleSuccess){
                window.alert("일정이 정상적으로 수정되었습니다.");
                window.location.reload();
            } else{
                window.alert(res.message);
            }
        }).catch((err) => {
        console.log(err);
    })

}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정을 삭제하는 함수입니다.
 * 주요 기능 : - 일정 id로 불러와 일정을 삭제 합니다.
 * */
function deleteSchedule(scheduleId){
    if(window.confirm("정말 일정을 삭제하시겠습니까?")){
        fetch('schedule/deleteSchedule', {
            method : 'post',
            headers : {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({scheduleId : scheduleId})
        }).then((res) => res.json())
            .then((res) => {
                if(res.deleteScheduleSuccess){
                    window.alert("일정이 정상적으로 삭제되었습니다.");
                    window.location.reload();
                } else{
                    window.alert(res.message);
                }
            }).catch((err) => {
            console.log(err);
        })
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 완료 상태를 수정하는 함수입니다.
 * 주요 기능 : - 완료 아이콘 클릭 시 완료 상태를 변경해주는 함수입니다.
 * */
function editComplete(id, bool){
    const data = {
        id : id,
        bool : bool
    }

    fetch('/updateComplete', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then((res) => {
            if(!res.updateCompleteSuccess){
                return window.alert(res.message);
            }
            let completeImg = document.querySelector('.scheduleDetailCompleteImg');

            if(bool){
                completeImg.src = "/images/complete.png";
                completeImg.setAttribute("onclick", `editComplete('${id}', false)`)
            } else{
                completeImg.src = "/images/ready.png";
                completeImg.setAttribute("onclick", `editComplete('${id}', true)`)
            }


        }).catch((err) => {
        console.log(err);
    })
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 날짜 포맷을 변경하는 함수입니다.
 * 주요 기능 : - 날짜를 한국시간으로 표시하기 위해 포멧을 변경해주는 역할을 합니다.
 * */
function dateFormat(date){
    let today = new Date();
    let inputDate = new Date(date)
    let offset = today.getTimezoneOffset() * 60000
    let DateOffset = new Date(inputDate.getTime() - offset);

    return DateOffset;
}