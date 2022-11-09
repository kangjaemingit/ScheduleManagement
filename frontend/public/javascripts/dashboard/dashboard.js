/**
 * 담당자 : 강재민
 * 함수 설명 : 일정의 완료 상태를 변경해주는 함수입니다.
 * 주요 기능 : - 완료 상태를 변경할 id와 boolean을 입력받아 변경합니다.
 *          - boolean이 true일 경우 완료로, false일 경우 미완료 입니다.
 *          - 상태 변경이 완료되면 일정 박스를 알맞게 이동시키는 함수를 실행합니다.
 * */
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

/**
 * 담당자 : 강재민
 * 함수 설명 : 일정의 완료 상태가 변경되었을 때 일정을 이동시켜주는 함수입니다.
 * 주요 기능 : - 완료 상태가 변경되었을 때 일정 컴포넌트를 찾아 이동시켜주는 역할을 합니다.
 *           - 완료 상태에 따라 버튼의 모양을 변경시켜줍니다.
 * */
function moveScheduleBox(id, bool){
    const readyArea = document.getElementById('readyArea'); // 미완료 박스
    const completeArea = document.getElementById('completeArea'); // 완료 박스
    const component = document.getElementById(id); // 일정 컴포넌트
    const readyScheduleCount = document.getElementById('readyScheduleCount'); // 미완료 갯수 란
    const completeScheduleCount = document.getElementById('completeScheduleCount'); // 완료 갯수 란

    const icon = document.getElementById(`icon_${id}`) // 일정 컴포넌트의 완료 아이콘
    const iconAll = document.getElementById(`icon_all_${id}`) // 일정 전체에 있는 일정 컴포넌트의 완료 아이콘

    if(!bool){ // 미완료로 변경
        completeArea.removeChild(component); // 완료에서 컴포넌트 삭제
        readyArea.appendChild(component); // 미완료에 컴포넌트 추가
        component.classList.replace('completeBox', 'readyBox'); // 컴포넌트 클래스 변경
        icon.src = "/images/ready.png"; // 아이콘 변경
        iconAll.src = "/images/ready.png"; // 일정 전체 컴포넌트 아이콘 변경

        icon.setAttribute('onclick', `changeComplete('${id}', true)`); // 아이콘 onclick 속성 변경
        iconAll.setAttribute('onclick', `changeComplete('${id}', true)`); // 아이콘 onclick 속성 변경

    } else{ // 완료로 변경
        readyArea.removeChild(component); // 미완료 박스에서 컴포넌트 삭제
        completeArea.appendChild(component); // 완료 박스에 컴포넌트 추가
        component.classList.replace('readyBox', 'completeBox'); // 컴포넌트 클래스 변경
        document.getElementById(`icon_${id}`).src = "/images/complete.png"; // 아이콘 변경
        document.getElementById(`icon_all_${id}`).src = "/images/complete.png"; // 아이콘 변경

        icon.setAttribute('onclick', `changeComplete('${id}', false)`); // 아이콘 onclick 속성 변경
        iconAll.setAttribute('onclick', `changeComplete('${id}', false)`); // 아이콘 onclick 속성 변경

    }
    chartDataChange(); // 차트 데이터 변경

    const readyCount = document.getElementsByClassName('readyBox').length; // 미완료 컴포넌트의 갯수 카운트
    const completeCount = document.getElementsByClassName('completeBox').length; // 완료 컴포넌트의 갯수 카운트

    readyScheduleCount.innerText = readyCount.toString();
    completeScheduleCount.innerText = completeCount.toString();
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
}



