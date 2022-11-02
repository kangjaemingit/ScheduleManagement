function commentCreate(feedId){
    event.preventDefault();

    const feedComment = document.getElementById('commentInput_' + feedId).value;

    const data = {
        comment : feedComment,
        feedId : feedId
    }

    fetch('feed/commentCreate', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data)
    }).then((res) => res.json())
        .then((res) => {
            if(!res.createCommentSuccess){
                console.log(res.message);
                return window.alert(res.message);
            }

            // TODO : 코멘트 등록 후 결과 출력
        }).catch((err) => {
        console.log(err);
    })
}