/**
 * 담당자 : 강재민
 * 함수 설명 : 피드를 삭제하는 함수입니다.
 * 주요 기능 : - 삭제할 피드의 id를 받아와서 피드를 삭제하는 API를 실행합니다.
 * */
function deleteFeed(id){
    fetch('feed/deleteFeed', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({id : id})
    }).then((res) => res.json())
        .then((res) => {
            if(!res.deleteFeedSuccess){
                console.log(res.message);
                return window.alert(res.message);
            }
            document.getElementById(id).remove();
        }).catch((err) => {
        console.log(err);
    })
}