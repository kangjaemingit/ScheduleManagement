let tags = []; // 선택된 태그를 담는 배열

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 생성 모달을 여는 함수 입니다.
 * 주요 기능 : - 시간을 현재 시간으로 모두 변경하여 시작일과 마감일을 표시하고 일정생성 모달을 열어줍니다.
 * */
function scheduleModalOpen(){
    const scheduleModal = document.querySelector('.scheduleModal');
    const bodyScrollHidden=document.getElementsByTagName('body');

    const currTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16); // 현재 시간

    document.getElementById('startDate').value = currTime; // 시작 시간 설정
    document.getElementById('endDate').value = currTime; // 마감 시간 설정
    document.getElementById('scheduleModalName').innerText = "새로운 일정 생성"; // 모달 제목 변경

    scheduleModal.classList.toggle('show');
    bodyScrollHidden[0].style.overflow='hidden'
    if(scheduleModal.classList.contains('show')){
        // body.style.overflow = 'hidden';
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 생성 모달을 닫는 함수 입니다.
 * 주요 기능 : - 상황에 따라 바인딩된 값들을 모두 제거 하고, 일정모달을 닫습니다.
 * */
function scheduleModalClose(){
    const scheduleModal = document.querySelector('.scheduleModal');
    const bodyScrollHidden=document.getElementsByTagName('body');
    bodyScrollHidden[0].style.overflow='auto';
    scheduleModal.classList.toggle('show');


    // 값 비우기
    tags = [];
    document.getElementById('scheduleTitle').value = null;
    document.getElementById('contents').value = null;
    document.getElementById('startDate').value = null;
    document.getElementById('endDate').value = null;
    document.getElementById('priority').value = "1";
    document.getElementById('address').value = null;
    document.getElementById('tagInput').value = null;
    document.getElementById('addressExist').checked = false;
    document.getElementById('tagList').innerHTML = null;
    document.getElementById('keyword').value = "";

    if(document.querySelector('.scheduleDetailCompleteImg')){ // 완료 상태 이미지 삭제
        document.querySelector('.scheduleDetailCompleteImg').remove();
    }

    document.getElementById('scheduleWriterArea').innerHTML = "";

    // readOnly 해제
    document.getElementById('scheduleModalName').readOnly = false
    document.getElementById('scheduleTitle').readOnly = false
    document.getElementById('contents').readOnly = false
    document.getElementById('startDate').readOnly = false
    document.getElementById('endDate').readOnly = false
    document.getElementById('priority').disabled = false

    // input 디자인 변경을 위한 클래스 변경
    document.getElementById('scheduleModalName').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('scheduleTitle').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('contents').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('startDate').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('endDate').classList.replace('input-primary-readOnly', 'input-primary');

    document.getElementById('addressExist').disabled = false // 체크박스 disabled 해제
    document.getElementById('menu_wrap').style.display = 'block'
    document.getElementById('scheduleCompleteBtnArea').style.display = 'flex'; // 완료버튼 영역 표시
    document.getElementById('tagInputDiv').style.display = 'block'; // 태그 입력란 표시
    document.getElementById('editModeBtn').style.display = 'none'; // 편집 버튼 안보이게

    document.getElementById('mapArea').style.display = 'none'; // 지도 영역 안보이게
    document.getElementById('scheduleModalBody').style.width = "25%"; // 일정 모달 크기 변경
    document.getElementById('scheduleModalContents').style.width = "100%"; // 일정 모달 내용 컨테이너 크기 변경

    document.getElementById('btnSaveSchedule').setAttribute("onClick", `saveSchedule()`) // 완료버튼 onclick 속성 변경

    document.getElementById('btnDeleteSchedule').removeAttribute('onclick'); // 삭제 버튼 onclick 해제
    document.getElementById('btnDeleteSchedule').style.display = 'none'; // 삭제 버튼 안보이게

    removeMarker(); // 지도 마커 모두 삭제
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 상세 모달에서 시작일이 바뀌었을 때 실행되는 함수입니다.
 * 주요 기능 : - 마감일이 선택한 시작일보다 이전일경우 시작일과 동일하게 변경합니다.
 * */
function changeStartDate(){
    // 마감일이 선택한 시작일보다 이전일 경우 현재선택된 시작일로 변경
    if(document.getElementById('endDate').value < document.getElementById('startDate').value){
        document.getElementById('endDate').value = document.getElementById('startDate').value;
        document.getElementById('endDate').min = document.getElementById('startDate').value;
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 상세 모달에서 마감일이 바뀌었을 때 실행되는 함수입니다.
 * 주요 기능 : - 마감일이 선택한 시작일보다 이전일경우 시작일과 동일하게 변경합니다.
 * */
function changeEndDate(){
    if(document.getElementById('startDate').value >= document.getElementById('endDate').value){
        document.getElementById('endDate').value = document.getElementById('startDate').value
        return toast("마감일을 시작일과 같거나 시작시간 이전으로 설정할 수 없습니다.");
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 저장시 유효성 검사 함수입니다.
 * 주요 기능 : - 조건에 맞는지 판단 후 맞지 않다면 토스트 메시지를 표시합니다.
 * */
function validCheck(schedule){
    if(schedule.title.trim() === ""){ // 제목 미입력시
        toast("일정의 제목을 입력하세요")
        return false;
    }

    if(schedule.startDate.trim() === ""){ // 시작일 미입력시
        toast("시작일을 입력하세요")
        return false;
    }

    if(schedule.endDate.trim() === ""){ // 마감일 미 입력시
        toast("마감일을 입력하세요")
        return false;
    }

    if(schedule.startDate >= schedule.endDate){ // 시작시간이 마감시간과 같거나 마감시간이 시작시간보다 이를 시
        toast("시작시간과 마감시간이 동일하거나, 시작시간이 마감시간보다 늦을 수 없습니다.")
        return false
    }

    if(!schedule.tag.length){ // 태그를 선택하지 않을 시
        toast("태그는 1개 이상 입력해야 합니다.")
        return false;
    }

    return true;
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정을 저장하는 함수입니다/
 * 주요 기능 : - 데이터를 가공하고, 유효성검사 후 일정 저장 API를 호출합니다.
 * */
function saveSchedule(){
    const newSchedule = {
        title : document.getElementById('scheduleTitle').value,
        contents : document.getElementById('contents').value,
        startDate : document.getElementById('startDate').value,
        endDate : document.getElementById('endDate').value,
        priority : document.getElementById('priority').value,
        tag : tags,
        address : document.getElementById('address').value
    } // 데이터 가공

    if(!document.getElementById('addressExist').checked){
        newSchedule.address = "";
    } // 주소 여부 미 체크 시 주소 공백 처리

    if(!validCheck(newSchedule)){ // 유효성검사
        return;
    }

    // 일정 생성 API 요청
    fetch('schedule/newSchedule', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(newSchedule)
    }).then((res) => res.json())
        .then((res) => {
            if(res.newScheduleSuccess){
                window.alert("일정이 정상적으로 등록되었습니다.");
                window.location.reload(); // 새로고침
            } else{
                window.alert(res.message);
            }
        }).catch((err) => {
            console.log(err);
        })
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 생성 모달에서 주소 사용 여부 체크박스 체크 시 발생하는 함수입니다.
 * 주요 기능 : - 체크가 되었을 시에는 모달 크기를 늘리고, 지도를 표시합니다.
 *            - 체크가 해제되었을 경우에는 모달 크기를 줄이고, 지도를 안보이게 합니다.
 * */
function useAddress(checked){
    if(checked.checked){
        document.getElementById('scheduleModalBody').style.width = "60%";
        document.getElementById('mapArea').style.display = 'block';
        document.getElementById('scheduleModalContents').style.width = "40%";
        setTimeout(function() { // 지도 재렌더링
            relayout();
        }, 700);

    } else{
        document.getElementById('mapArea').style.display = 'none';
        document.getElementById('scheduleModalBody').style.width = "25%";
        document.getElementById('scheduleModalContents').style.width = "100%";
        document.getElementById('address').value = null;
    }
}

function selectOptionClick(){
    let langSelect = document.getElementById("priority");
    let selectId = langSelect.options[langSelect.selectedIndex].id;
    let hurry = document.getElementById('hurryup');
    let high = document.getElementById('high');
    let normal = document.getElementById('normal');
    let low = document.getElementById('low');
    let laze = document.getElementById('laze');
    if(selectId===hurry.id)
    {
        langSelect.style.border='rgba(255,0,0,0.3)1px solid';
        langSelect.style.color='red';
        setOptionColorDefault()
    }
    else if(selectId===high.id){
        langSelect.style.border='rgba(255,165,0,1) 1px solid';
        langSelect.style.color='orange';
        setOptionColorDefault()
    }
    else if(selectId===normal.id){
        langSelect.style.border='rgba(255,165,0,0.3) 1px solid';
        langSelect.style.color='darkgoldenrod';
        setOptionColorDefault()
    }
    else if(selectId===low.id){
        langSelect.style.border='rgba(0,0,255,0.3) 1px solid';
        langSelect.style.color='blue';
        setOptionColorDefault()
    }
    else if(selectId===laze.id){
        langSelect.style.border='rgba(0,255,0,0.3) 1px solid';
        langSelect.style.color='green';
        setOptionColorDefault()
    }
}

function setOptionColorDefault(){
    let langSelect = document.getElementById("priority");
    let hurry = document.getElementById('hurryup');
    let high = document.getElementById('high');
    let normal = document.getElementById('normal');
    let low = document.getElementById('low');
    let laze = document.getElementById('laze');

    langSelect.style.backgroundColor='white';
    hurry.style.color='rgba(255,0,0,1)';
    normal.style.color = 'darkgoldenrod';
    low.style.color='rgba(0,0,255,1)';
    laze.style.color='rgba(0,255,0,1)';
    high.style.color='rgba(255,165,0,1)';
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 입력란에서 엔터키와 백스페이스 키를 눌렀을 때 실행하는 함수입니다.
 * 주요 기능 : - 엔터를 눌렀을 때에는 새로운 태그를 추가합니다.
 *            - 백스페이스를 눌렀을 때는 가장 최근에 추가한 태그를 삭제합니다.
 * */
let enterKey = document.getElementById('tagListArea');
enterKey.addEventListener('keyup', event => tagKeyUpEvent(event));
function tagKeyUpEvent(event){
    let key = event.key || event.keyCode;

    if(key === 'Enter' || key === 13 ){ // 엔터
        newTag(); // 태그 추가
    }
    if(key === 'Backspace' || key === 8){ // 백스페이스( 이슈 )
        if(document.getElementById('tagInput').value === ""){
            popTag(); // 최근 등록한 태그 삭제
        }
    }
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 입력 시 태그를 렌더 해주는 함수입니다.
 * 주요 기능 : - 태그 리스트 배열에 있는 태그들을 태그 영역에 렌더합니다.
 * */
function tagRender(){
    let rows = ""
    tags.map((tag) => {
        rows +=`<div class="tags"><span class="tagSpan">${tag}</span><img class="deleteTag" id="deleteTag" onclick="deleteTag('${tag}')" src="/images/schedule/tag_delete.png"></div>`
    });

    document.getElementById('tagList').innerHTML = rows;
    document.getElementById('tagInput').value = "";
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 입력 시 태그를 렌더 해주는 함수입니다.
 * 주요 기능 : - 태그 리스트 배열에 있는 태그들을 태그 영역에 렌더합니다.
 *            - 위 함수와 같으나 삭제 버튼이 없이 렌더합니다.(상세 페이지용)
 * */
function tagRenderNotDeleteBtn(){
    let rows = ""
    tags.map((tag) => {
        rows +=`<div class="tags"><span class="tagSpan">${tag}</span></div>`
    });

    document.getElementById('tagList').innerHTML = rows;
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 새로운 태그를 추가하는 함수입니다.
 * 주요 기능 : - 태그의 유효성 검사를 거치고 문제가 없으면 태그리스트에 추가하고 태그를 렌더합니다.
 * */
function newTag(){
    let tag = document.getElementById('tagInput').value.trim();
    if(tags.includes(tag)){ // 동일한 태그 검증
        return toast("동일한 내용의 태그를 작성할 수 없습니다.");
    }
    if(tag === ""){ // 태그 공백여부 검증
        return toast("태그를 입력해주세요");

    }
    if(tag.charAt(0) === "#"){ // 태그 맨 앞에 #이 포함되어있으면 # 제거
        tag = tag.slice(1);
    }

    if(!regExp(tag)){ // 특수문자 검증
        return toast("'_' 를 제외한 특수문자는 사용할 수 없습니다.")
    }

    tags.push(tag); // 태그 추가
    tagRender(); // 태그 렌더
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 생성 모달에서 입력한 태그를 삭제하는 함수입니다.
 * 주요 기능 : - 태그 배열에서 삭제한 태그를 삭제합니다.
 *            - 태그영역을 재 렌더합니다.
 * */
function deleteTag(tagName){
    let filteredTags = tags.filter((tag) => tag !== tagName)
    tags = filteredTags;
    tagRender();
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 가장 최근에 입력한 태그를 삭제하는 함수입니다.
 * 주요 기능 : - 태그 배열에서 제일 마지막에 있는 태그를 삭제합니다.
 * */
function popTag(){
    tags.pop();
    tagRender();
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 자동완성을 위한 함수입니다.
 * 주요 기능 : - 입력받은 값으로 API 요청을 보내 키워드가 포함된 태그를 불러와 자동완성 모달을 표시합니다.
 * */
function autoComplete(key){
    const autoCompleteModal = document.querySelector('.autoCompleteModal');
    const autoCompleteModalBottom = document.querySelector('.autoCompleteModalBottom');
    const keyword = key.value; // 키워드
    if(keyword.trim() === ""){ // 키워드가 없으면 모달 닫기
        autoCompleteModal.classList.remove('show');
        autoCompleteModalBottom.innerHTML = "";
        return;
    }

    if(keyword.length > 49){ // 태그 글자 수 제한
        toast("태그는 50자를 초과할 수 없습니다.")
    }

    // 태그 데이터 요청
    fetch('schedule/autoComplete', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({keyword : keyword})
    })
        .then((res) => res.json())
        .then((result) => {
            if(result.autoComplete.length){
                let rows = "";
                result.autoComplete.map((k) => { // 자동완성 모달에 검색된 태그 값 매핑
                    rows += `<li class="autoCompleteLi" onclick="autoCompleteLiClick('${k.tagName}')">${k.tagName}</li>`
                })
                autoCompleteModalBottom.innerHTML = rows;
                autoCompleteModal.classList.toggle('show');
            } else{ // 태그가 없으면 모달 닫기
                    autoCompleteModal.classList.remove('show');
                    autoCompleteModalBottom.innerHTML = "";
            }

        }).catch((err) => {
            console.log(err);
    })
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 자동완성 모달을 닫는 함수입니다.
 * */
function autoCompleteModalClose(){
    const autoCompleteModal = document.querySelector('.autoCompleteModal');
    autoCompleteModal.classList.remove('show');
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 태그 자동완성 모달에서 태그를 선택했을때 실행되는 함수입니다.
 * 주요 기능 : - 태그 영역에 태그를 추가합니다.
 * */
function autoCompleteLiClick(tagName){
    const autoCompleteModal = document.querySelector('.autoCompleteModal');

    if(tags.includes(tagName)){ // 동일한 태그가 있을 시
        toast("동일한 내용의 태그를 작성할 수 없습니다.");
        return;
    }

    tags.push(tagName); // 태그 배열에 태그 담기
    tagRender(); // 태그 렌더
    autoCompleteModal.classList.remove('show');
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정 제목 유효성 검증 함수 입니다.
 * 주요 기능 : - 제목이 200자가 넘을 시 오류메시지를 출력합니다.
 * */
function scheduleTitleValidCheck(title){
    const keyword = title.value;

    if(keyword.length >= 200){
        toast("제목은 200자를 초과할 수 없습니다.");
    }

}

function tagInputCursor(){
    document.getElementById('tagInput').focus();
}

//특수문제 제거를 위한 정규식 함수
function regExp(tag){
    //특수문자 정규식
    let reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi
    //특수문자 검증
    if(reg.test(tag)){
        //특수문자 제거후 리턴
        return false;
    } else {
        //특수문자가 없으므로 본래 문자 리턴
        return true;
    }
}