let selectedSchedule = {
    id: null,
    title : null
};
function feedModalOpen(){
    fetch('calendar/getMySchedule', {
        method : 'get',
    }).then((res) => res.json())
        .then((res) => {
            if(!res.getMyScheduleSuccess){
                return window.alert(res.message);
            }
            feedScheduleRender(res.schedule);
        }).catch((err) => {
        console.log(err);
    })


    const feedModal = document.querySelector('.feedModal');
    const bodyScrollHidden=document.getElementsByTagName('body');

    feedModal.classList.toggle('show');
    bodyScrollHidden[0].style.overflow='hidden'
    if(feedModal.classList.contains('show')){
        // body.style.overflow = 'hidden';
    }
}

function feedEditModalOpen(feed){
    console.log(feed);
    document.getElementById('feedContentsInput').value = feed.feedContents;
    feedScheduleSelect(feed.schedule.title, feed.schedule._id)
    document.getElementById('btnSaveFeed').setAttribute('onclick', `updateFeed('${feed._id}')`)

    feedModalOpen();
}

function feedModalClose(){
    document.getElementById('selectedSchedule').innerHTML = "";
    document.getElementById('inputScheduleSearch').value = "";
    document.getElementById('feedContentsInput').value = "";
    document.getElementById('feedScheduleDeleteBtn').style.display = 'none';
    document.getElementById('btnSaveFeed').setAttribute('onclick', `createFeed()`)

    const feedModal = document.querySelector('.feedModal');
    const bodyScrollHidden=document.getElementsByTagName('body');
    feedModal.classList.toggle('show');
    bodyScrollHidden[0].style.overflow='auto';
}

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

function feedScheduleSelect(title, id){
    selectedSchedule = {
        id : id,
        title : title
    }
    let rows = "";

    rows += `<div style="display: flex; align-items: center">`
        + `<div class="listIcon"></div>`
        + `<span style="margin-left: 5px;">${title}</span></div>`

    document.getElementById('selectedSchedule').innerHTML = rows;
    document.getElementById('feedScheduleDeleteBtn').style.display = 'block';
}

function createFeed()  {
    const contents = document.getElementById('feedContentsInput').value;

    if(contents === ""){
        return window.alert("내용을 입력해주세요");
    }

    const data = {
        contents : contents,
        scheduleId : selectedSchedule.id
    }


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
            appendFeed(res.feed, res.user);
            feedModalClose();

        }).catch((err) => {
        console.log(err);
    })
}

function appendFeed(feed, user){
    const feedContentContainer = document.createElement('div');
    feedContentContainer.classList.add('feedContentContainer');
    feedContentContainer.id = feed._id;

    let rows = "";

    rows +=
        `
            <div class="feedTitleArea">
            <div style="display: flex; align-items: center">
                <img class="feedProfilePhoto" src="${user.profilePhoto}">
                <h4>${user.name}</h4>
            </div>
            <div class="feedControlBox">
                <img class="feedDeleteBtn" src="images/editing.png" onclick="feedEditModalOpen(${JSON.stringify(feed)})">
                <img class="feedDeleteBtn" src="/images/trash.png" onclick="deleteFeed('${feed._id}')"/>
            </div>
            </div>
            <div class="feedContents" >
                <p id="feedContents_${feed._id}">${feed.feedContents}</p>
            </div>
            <div class="feedFooter">
                <img class="feedFooterIcon" src="images/chat.png" >
                <span style="margin-left: 3px;">${feed.comments.length}</span>
        `;

        rows += feed.schedule ?
        `
            <img class="feedFooterIcon" src="images/calendar.png" style="margin-left: 10px;">
            <div style="display: flex; align-items: center">
            <div class="listIcon"></div>
            <span style="margin-left: 5px;" id="selectedSchedule_${feed._id}">${selectedSchedule.title}</span>
            </div>
        ` : "";

        rows +=
            `
                <img class="feedFooterIcon" src="images/clock.png" style="margin-left: 10px; margin-right: 5px">
                <span style="opacity: 0.4; font-size: 12px">방금 전</span>
            `

        rows += `</div>`

    feedContentContainer.innerHTML = rows;
    const parent = document.getElementById('feedArea');
    parent.insertBefore(feedContentContainer, parent.firstChild);

    document.getElementById('feedContentsInput').value = "";
}

function updateFeed(feedId){
    console.log(feedId);
    const contents = document.getElementById('feedContentsInput').value;

    const data = {
        feedId : feedId,
        feedContents : contents,
        scheduleId : selectedSchedule.id
    }
    if(contents === ""){
        return window.alert("내용을 입력해주세요");
    }

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
            document.getElementById('feedContents_' + feedId).innerText = contents;
            document.getElementById('selectedSchedule_' + feedId).innerText = selectedSchedule.title;

            feedModalClose();


        }).catch((err) => {
        console.log(err);
    })

}

function feedScheduleDelete(){
    selectedSchedule.id = null;
    selectedSchedule.title = null;

    document.getElementById('selectedSchedule').innerHTML = "";
    document.getElementById('feedScheduleDeleteBtn').style.display = 'none';

}

function dateFormatter(date){
    let today = new Date();
    let inputDate = new Date(date)
    let offset = today.getTimezoneOffset() * 60000
    let DateOffset = new Date(inputDate.getTime() - offset);

    let dateString = DateOffset.toISOString().slice(0, 16).replace("T", " ")

    return dateString;
}