
let tags = [];
function scheduleModalOpen(){
    const scheduleModal = document.querySelector('.scheduleModal');
    const bodyScrollHidden=document.getElementsByTagName('body');
    const currTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('startDate').value = currTime;
    document.getElementById('endDate').value = currTime;
    document.getElementById('scheduleModalName').innerText = "새로운 일정 생성";

    scheduleModal.classList.toggle('show');
    bodyScrollHidden[0].style.overflow='hidden'
    if(scheduleModal.classList.contains('show')){
        // body.style.overflow = 'hidden';
    }
}

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
    if(document.querySelector('.scheduleDetailCompleteImg')){
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

    document.getElementById('scheduleModalName').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('scheduleTitle').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('contents').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('startDate').classList.replace('input-primary-readOnly', 'input-primary');
    document.getElementById('endDate').classList.replace('input-primary-readOnly', 'input-primary');

    document.getElementById('addressExist').disabled = false
    document.getElementById('menu_wrap').style.display = 'block'
    document.getElementById('scheduleCompleteBtnArea').style.display = 'flex';
    document.getElementById('tagInputDiv').style.display = 'block';
    document.getElementById('editModeBtn').style.display = 'none';

    document.getElementById('mapArea').style.display = 'none';
    document.getElementById('scheduleModalBody').style.width = "25%";
    document.getElementById('scheduleModalContents').style.width = "100%";

    document.getElementById('btnSaveSchedule').setAttribute("onClick", `saveSchedule()`)

    document.getElementById('btnDeleteSchedule').removeAttribute('onclick');
    document.getElementById('btnDeleteSchedule').style.display = 'none';

    removeMarker();
}



function changeStartDate(){
    // 마감일이 선택한 시작일보다 이전일 경우 현재선택된 시작일로 변경
    if(document.getElementById('endDate').value < document.getElementById('startDate').value){
        document.getElementById('endDate').value = document.getElementById('startDate').value;
        document.getElementById('endDate').min = document.getElementById('startDate').value;
    }
}

function changeEndDate(){
    if(document.getElementById('startDate').value >= document.getElementById('endDate').value){
        document.getElementById('endDate').value = document.getElementById('startDate').value
        return window.alert("마감일을 시작일과 같거나 시작시간 이전으로 설정할 수 없습니다.");
    }
}

function validCheck(schedule){
    if(schedule.title.trim() === ""){
        toast("일정의 제목을 입력하세요")
        return false;
    }

    if(schedule.startDate.trim() === ""){
        toast("시작일을 입력하세요")
        return false;
    }

    if(schedule.endDate.trim() === ""){
        toast("마감일을 입력하세요")
        return false;
    }

    if(schedule.startDate >= schedule.endDate){
        toast("시작시간과 마감시간이 동일하거나, 시작시간이 마감시간보다 늦을 수 없습니다.")
        return false
    }

    if(!schedule.tag.length){
        toast("태그는 1개 이상 입력해야 합니다.")
        return false;
    }

    return true;
}

function saveSchedule(){
    const newSchedule = {
        title : document.getElementById('scheduleTitle').value,
        contents : document.getElementById('contents').value,
        startDate : document.getElementById('startDate').value,
        endDate : document.getElementById('endDate').value,
        priority : document.getElementById('priority').value,
        tag : tags,
        address : document.getElementById('address').value
    }

    if(!document.getElementById('addressExist').checked){
        newSchedule.address = "";
    }

    if(!validCheck(newSchedule)){
        return;
    }

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
                window.location.reload();
            } else{
                window.alert(res.message);
            }
        }).catch((err) => {
            console.log(err);
        })
}

function useAddress(checked){
    if(checked.checked){
        document.getElementById('scheduleModalBody').style.width = "60%";
        document.getElementById('mapArea').style.display = 'block';
        document.getElementById('scheduleModalContents').style.width = "40%";
        setTimeout(function() {
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

function tagKeyUpEvent(event){
    let key = event.key || event.keyCode;

    if(key === 'Enter' || key === 13 ){
        newTag();
    }
    if(key === 'Backspace' || key === 8){ // 이슈
        if(document.getElementById('tagInput').value === ""){
            popTag();
        }
    }
}
let enterKey = document.getElementById('tagListArea');
enterKey.addEventListener('keyup', event => tagKeyUpEvent(event));

function tagRender(){
    let rows = ""
    tags.map((tag) => {
        rows +=`<div class="tags"><span class="tagSpan">${tag}</span><img class="deleteTag" id="deleteTag" onclick="deleteTag('${tag}')" src="/images/schedule/tag_delete.png"></div>`
    });

    document.getElementById('tagList').innerHTML = rows;
    document.getElementById('tagInput').value = "";
}

function tagRenderNotDeleteBtn(){
    let rows = ""
    tags.map((tag) => {
        rows +=`<div class="tags"><span class="tagSpan">${tag}</span></div>`
    });

    document.getElementById('tagList').innerHTML = rows;
}

function newTag(){
    let tag = document.getElementById('tagInput').value.trim();
    if(tags.includes(tag)){
        toast("동일한 내용의 태그를 작성할 수 없습니다.");
        return;
    }
    if(tag === ""){
        toast("태그를 입력해주세요");
        return;
    }
    if(tag.charAt(0) === "#"){
        tag = tag.slice(1);
    }

    tags.push(tag);
    tagRender();
}

function deleteTag(tagName){
    let filteredTags = tags.filter((tag) => tag !== tagName)
    tags = filteredTags;
    tagRender();
}

function popTag(){
    tags.pop();
    tagRender();
}

const autoCompleteModal = document.querySelector('.autoCompleteModal');
const autoCompleteModalBottom = document.querySelector('.autoCompleteModalBottom');
function autoComplete(key){
    const keyword = key.value;
    if(keyword.trim() === ""){
        autoCompleteModal.classList.remove('show');
        autoCompleteModalBottom.innerHTML = "";
        return;
    }

    if(keyword.length > 49){
        toast("태그는 50자를 초과할 수 없습니다.")
    }

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
                result.autoComplete.map((k) => {
                    rows += `<li class="autoCompleteLi" onclick="autoCompleteLiClick('${k.tagName}')">${k.tagName}</li>`
                })
                autoCompleteModalBottom.innerHTML = rows;
                autoCompleteModal.classList.toggle('show');
            } else{
                    autoCompleteModal.classList.remove('show');
                    autoCompleteModalBottom.innerHTML = "";
            }

        }).catch((err) => {
            console.log(err);
    })
}

function autoCompleteModalClose(){
    autoCompleteModal.classList.remove('show');
}

function autoCompleteLiClick(tagName){
    console.log("autoCompleteClick")
    if(tags.includes(tagName)){
        toast("동일한 내용의 태그를 작성할 수 없습니다.");
        return;
    }

    tags.push(tagName);
    tagRender();
    autoCompleteModal.classList.remove('show');
}

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
    let reg = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
    //특수문자 검증
    if(reg.test(tag)){
        //특수문자 제거후 리턴
        return tag.replace(reg, "");
    } else {
        //특수문자가 없으므로 본래 문자 리턴
        console.log(tag)
        return tag;
    }
}