function changeComplete(id, bool){
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
                window.alert(res.message);
            }
            else{
                moveScheduleBox(id, bool);
            }
        }).catch((err) => {
        console.log(err);
    })
}

function moveScheduleBox(id, bool){
    const readyArea = document.getElementById('readyArea');
    const completeArea = document.getElementById('completeArea');
    const component = document.getElementById(id);
    const readyScheduleCount = document.getElementById('readyScheduleCount');
    const completeScheduleCount = document.getElementById('completeScheduleCount');

    const icon = document.getElementById(`icon_${id}`)
    const iconAll = document.getElementById(`icon_all_${id}`)

    if(!bool){
        readyArea.removeChild(component);
        completeArea.appendChild(component);
        component.classList.replace('completeBox', 'readyBox');
        icon.src = "/images/ready.png";
        iconAll.src = "/images/ready.png";

        icon.setAttribute('onclick', `changeComplete('${id}', true)`);
        iconAll.setAttribute('onclick', `changeComplete('${id}', true)`);

    } else{
        completeArea.removeChild(component);
        readyArea.appendChild(component);
        component.classList.replace('readyBox', 'completeBox');
        document.getElementById(`icon_${id}`).src = "/images/complete.png";
        document.getElementById(`icon_all_${id}`).src = "/images/complete.png";

        icon.setAttribute('onclick', `changeComplete('${id}', false)`);
        iconAll.setAttribute('onclick', `changeComplete('${id}', false)`);

    }

    const readyCount = document.getElementsByClassName('readyBox').length;
    const completeCount = document.getElementsByClassName('completeBox').length;
    const allCount = readyCount + completeCount;

    readyScheduleCount.innerText = readyCount.toString();
    completeScheduleCount.innerText = completeCount.toString();

    const completeRate = ((completeCount / allCount) * 100).toFixed(1);
    document.getElementById('completeBar').style.width = completeRate + '%';
    document.getElementById('completeBar').innerText = completeRate + '%';
}

function readyDragStart(event) {
    event.dataTransfer.setData("scheduleBox", event.target.id);
}

function readyToCompleteDrop(event) {
    event.preventDefault();

    let id = event.dataTransfer.getData("scheduleBox");
    if(id === undefined || null) return;
    else changeComplete(id, true)
}

function completeToReadyDrop(event){
    event.preventDefault();

    let id = event.dataTransfer.getData("scheduleBox");
    if(id === undefined || null) return;
    else changeComplete(id, false)
}

function dragover_handler(event) {
    event.preventDefault();
    //
    // let id = event.dataTransfer.getData("scheduleBox");
    //
    //
    // const readyArea = document.getElementById('readyArea');
    // const completeArea = document.getElementById('completeArea');
    // const component = document.getElementById(`${___id}`);
    // console.log(___id);
    //
    // readyArea.removeChild(component);
    // completeArea.appendChild(component);
}



