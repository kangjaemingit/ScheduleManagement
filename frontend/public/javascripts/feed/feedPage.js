/**
 * 담당자 : 강재민
 * 함수 설명 : 새로운 댓글을 작성하는 함수입니다.
 * 주요 기능 : - 피드댓글 내용과 피드 id로 새로운 피드 댓글 컴포넌트를 만들어 추가합니다.
 *          - DB에 댓글 내용을 저장합니다.
 * */
function commentCreate(feedId){
    event.preventDefault();

    const feedComment = document.getElementById('commentInput_' + feedId).value; // 피드 댓글 내용

    const data = {
        comment : feedComment,
        feedId : feedId
    } // 데이터 가공

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
            appendComment(feedId, res.comment, res.user); // 댓글 렌더링
            document.getElementById('commentInput_' + feedId).value = "";
        }).catch((err) => {
        console.log(err);
    })
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 새로운 댓글을 바인딩하는 함수입니다.
 * 주요 기능 : - 피드댓글 내용과 피드 id로 새로운 피드 댓글 컴포넌트를 만들어 추가합니다.
 * */
function appendComment(feedId, comment, user){
    let commentBox = document.createElement('div'); // 엘리먼트 생성
    commentBox.classList.add('feedCommentBox'); // 클래스 추가
    commentBox.id = comment._id; // id 추가

    // 댓글 렌더링
    let rows = ""

    rows += `
                <img class="feedCommentWriterProfile" src="${user.profilePhoto}">
                <span class="feedCommentWriterName">${user.name}</span>
                <span class="feedCommentContents">${comment.comment}</span>
                <span class="feedCommentTime">방금 전</span>
                <img class="feedCommentDeleteBtn" src="images/close.png" onclick="deleteComment('${comment._id}', '${feedId}')">
            `

    commentBox.innerHTML = rows;

    document.getElementById('feedCommentArea_' + feedId).appendChild(commentBox);
    setCommentsLength(1, feedId); // 댓글 수 증가
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 댓글을 삭제하는 함수입니다.
 * 주요 기능 : - 댓글 id와 피드 id를 인자로 받아 댓글삭제와 피드에있는 댓글 매핑관계도 끊어줍니다.
 * */
function deleteComment(commentId, feedId){
    // 댓글 삭제
    fetch('feed/commentDelete', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({id : commentId})
    }).then((res) => res.json())
        .then((res) => {
            if(!res.deleteCommentSuccess){
                console.log(res.message);
                return window.alert(res.message);
            }
            document.getElementById(commentId).remove(); // 엘리먼트 삭제
            setCommentsLength(-1, feedId); // 댓글 수 감소
        }).catch((err) => {
        console.log(err);
    })
}

/**
 * 담당자 : 강재민
 * 함수 설명 : 댓글 길이를 변경해주는 함수입니다.
 * 주요 기능 : - 댓글 생성 혹은 삭제 시 댓글의 갯수를 변경해주는 역할을 합니다.
 * */
function setCommentsLength(n, feedId){
    let count = document.getElementById('commentsLength_' + feedId).innerText;
    count = parseInt(count) + n;

    document.getElementById('commentsLength_' + feedId).innerText = count;

}