

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
    scheduleModal.classList.toggle('show');
    bodyScrollHidden[0].style.overflow='auto';

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

    // readOnly 해제
    document.getElementById('scheduleModalName').readOnly = false
    document.getElementById('scheduleTitle').readOnly = false
    document.getElementById('contents').readOnly = false
    document.getElementById('startDate').readOnly = false
    document.getElementById('endDate').readOnly = false
    document.getElementById('priority').disabled = false
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

    console.log(document.getElementById('startDate').value)
}

function validCheck(schedule){
    if(schedule.title.trim() === ""){
        window.alert("제목을 입력하세요")
        return false;
    }

    if(schedule.startDate.trim() === ""){
        window.alert("시작일을 입력하세요")
        return false;
    }

    if(schedule.endDate.trim() === ""){
        window.alert("마감일을 입력하세요")
        return false;
    }

    if(schedule.startDate >= schedule.endDate){
        window.alert("시작시간과 마감시간이 동일하거나, 시작시간이 마감시간보다 늦을 수 없습니다.")
        return false
    }

    if(!schedule.tag.length){
        window.alert("태그는 1개 이상 입력해야 합니다.")
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
        window.alert("동일한 내용의 태그를 작성할 수 없습니다.");
        return;
    }
    if(tag === ""){
        window.alert("태그를 입력해주세요");
        return;
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
        window.alert("동일한 내용의 태그를 작성할 수 없습니다.");
        return;
    }

    tags.push(tagName);
    tagRender();
    autoCompleteModal.classList.remove('show');
}

