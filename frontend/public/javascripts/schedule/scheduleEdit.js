
function scheduleEditControlRender(scheduleOwner, schedule){
    if(scheduleOwner){
        document.getElementById('editModeBtn').style.display = 'block';
        document.getElementById('editModeBtn').setAttribute("onclick", `scheduleEditModalOpen('${schedule._id}')`)
        if(schedule.complete){
            document.querySelector('.scheduleDetailCompleteImg').setAttribute("onclick", `editComplete('${schedule._id}', false)`)
        } else{
            document.querySelector('.scheduleDetailCompleteImg').setAttribute("onclick", `editComplete('${schedule._id}', true)`)
        }
        document.querySelector('.scheduleDetailCompleteImg').style.cursor = 'pointer';
    }
}

function scheduleDetailModalOpen(scheduleId, calendarPage){
    const scheduleModal = document.querySelector('.scheduleModal');
    const bodyScrollHidden=document.getElementsByTagName('body');
    bodyScrollHidden[0].style.overflow='hidden'

    // openDayModalBG.style.display='none'
    // openDayModal.style.display='none'
    fetch('/schedule/getScheduleById/' + scheduleId, {
        method : "get"
    }).then((res) => res.json())
        .then((res) => {
            if(res.getScheduleSuccess === false){
                console.log(res.message);
                window.alert(res.message);
                return;
            }

            const completeImg = res.schedule.complete ?
                `<img class="scheduleDetailCompleteImg" src="images/complete.png" style="width: 25px; height: 25px;">` :
                `<img class="scheduleDetailCompleteImg" src="images/ready.png" style="width: 25px; height: 25px;">`

            // 데이터 바인딩
            document.getElementById('scheduleModalName').innerText = `<${res.schedule.title}>`;
            document.getElementById('scheduleModalTitleBox').innerHTML += completeImg;
            document.getElementById('scheduleTitle').value = res.schedule.title;
            document.getElementById('contents').value = res.schedule.contents;
            document.getElementById('startDate').value = dateFormat(res.schedule.date.startDate).toISOString().slice(0, 16)
            document.getElementById('endDate').value = dateFormat(res.schedule.date.endDate).toISOString().slice(0, 16)
            document.getElementById('priority').value = res.schedule.priority;
            if(res.schedule.address !== ""){
                document.getElementById('addressExist').checked = true;
                document.getElementById('address').value = res.schedule.address;
                document.getElementById('keyword').value = res.schedule.address;
                useAddress(document.getElementById('addressExist'));
                searchPlaces();
            }
            tags = res.schedule.tag.map((t) => {
                return t.tagName;
            })
            tagRenderNotDeleteBtn();

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

            // 일정 작성자이면 편집모드 버튼 보이게함
            if(calendarPage){
                scheduleEditControlRender(res.scheduleOwner, res.schedule);
            }


            // 태그 삭제 버튼 보이지 않게 함
            let tagsEl = document.getElementsByClassName('deleteTag')

        }).catch((e) => {
        console.log(e);
    })

    scheduleModal.classList.toggle('show');
}

function scheduleEditModalOpen(scheduleId){
    // scheduleModalOpen();
    // openDayModalBG.style.display='none'
    // openDayModal.style.display='none'

    document.getElementById('scheduleModalName').innerText += " 일정 편집";
    tagRender();
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

    document.getElementById('btnDeleteSchedule').setAttribute("onclick", `deleteSchedule('${scheduleId}')`);
    document.getElementById('btnDeleteSchedule').style.display = 'block';

    document.getElementById('btnSaveSchedule').setAttribute("onclick", `updateSchedule('${scheduleId}')`)
}

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
    }

    if(!document.getElementById('addressExist').checked){
        schedule.address = "";
    }

    if(!validCheck(schedule)){
        return;
    }

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

function dateFormat(date){
    let today = new Date();
    let inputDate = new Date(date)
    let offset = today.getTimezoneOffset() * 60000
    let DateOffset = new Date(inputDate.getTime() - offset);

    return DateOffset;
}