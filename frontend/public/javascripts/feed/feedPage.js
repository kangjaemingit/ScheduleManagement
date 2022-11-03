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
            appendComment(feedId, res.comment, res.user);
            document.getElementById('commentInput_' + feedId).value = "";
        }).catch((err) => {
        console.log(err);
    })
}

function appendComment(feedId, comment, user){
    let commentBox = document.createElement('div');
    commentBox.classList.add('feedCommentBox');
    commentBox.id = comment._id;

    let rows = ""

    rows += `<img class="feedCommentWriterProfile" src="${user.profilePhoto}">`
        + `<span class="feedCommentWriterName">${user.name}</span>`
        + `<span class="feedCommentContents">${comment.comment}</span>`
        + `<img class="feedCommentDeleteBtn" src="images/close.png" onclick="deleteComment('${comment._id}', '${feedId}')">`

    commentBox.innerHTML = rows;

    document.getElementById('feedCommentArea_' + feedId).appendChild(commentBox);
    setCommentsLength(1, feedId);
}

function deleteComment(commentId, feedId){
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
            document.getElementById(commentId).remove();
            setCommentsLength(-1, feedId);
        }).catch((err) => {
        console.log(err);
    })
}

function setCommentsLength(n, feedId){
    let count = document.getElementById('commentsLength_' + feedId).innerText;
    count = parseInt(count) + n;

    document.getElementById('commentsLength_' + feedId).innerText = count;

}