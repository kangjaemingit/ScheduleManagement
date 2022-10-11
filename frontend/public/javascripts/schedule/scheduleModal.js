const body = document.querySelector('body');
const scheduleModal = document.querySelector('.scheduleModal');
let tags = [];
function scheduleModalOpen(){
    scheduleModal.classList.toggle('show');

    if(scheduleModal.classList.contains('show')){
        body.style.overflow = 'hidden';
        relayout();
    }
}

function scheduleModalClose(){
    scheduleModal.classList.toggle('show');

    document.getElementById('scheduleTitle').value = null;
    document.getElementById('contents').value = null;
    document.getElementById('startDate').value = null;
    document.getElementById('endDate').value = null;
    document.getElementById('priority').value = "1";
    document.getElementById('address').value = null;
    document.getElementById('tagInput').value = null;
    document.getElementById('addressExist').checked = false;
    document.getElementById('tagList').innerHTML = null;

    document.getElementById('mapArea').style.display = 'none';
    document.getElementById('scheduleModalBody').style.width = "30%"
    document.getElementById('scheduleModalBody').style.height = "400px"

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
        document.getElementById('scheduleModalBody').style.width = "50%"
        document.getElementById('scheduleModalBody').style.height = "800px"
        document.getElementById('mapArea').style.display = 'block';
        setTimeout(function() {
            relayout();
        }, 700);

    } else{
        document.getElementById('mapArea').style.display = 'none';
        document.getElementById('scheduleModalBody').style.width = "30%"
        document.getElementById('scheduleModalBody').style.height = "400px"
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
        rows +=`<div class="tags"><span class="tagSpan">${tag}</span><img class="deleteTag" id="deleteTag" onclick="deleteTag('${tag}')" src="/images/close_bg_none.png"></div>`
    });

    document.getElementById('tagList').innerHTML = rows;
    document.getElementById('tagInput').value = "";
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
    if(keyword === ""){
        autoCompleteModal.classList.remove('show');
        autoCompleteModalBottom.innerHTML = "";
        return;
    }

    fetch('schedule/autoComplete/' + keyword, {
        method : 'get'
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

