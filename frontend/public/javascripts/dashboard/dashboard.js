function drag_handler(event) {
//  ondrag =  드래그할때 동작 
    console.log("Drag");
}

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
                window.location.reload();
            }
        }).catch((err) => {
        console.log(err);
    })
}

function dragover_handler(event) {
    //ondragover = draggable 엘리먼트가 drop영역위에 올라가면
    console.log("dragOver");
    event.preventDefault();
}

function drop_handler(event) {
    //ondrop = draggable 엘리먼트를 drop영역위에 떨어트리면
    console.log(event)
    console.log("droooop!");
    document.getElementsByClassName("dashboardScheduleBox")[0].style.top=event.layerX+"px";
    document.getElementsByClassName("dashboardScheduleBox")[0].style.left=event.layerY+"px";
    event.preventDefault();
}

