function createFeed()  {
    event.preventDefault();

    const contents = document.getElementById('feedContentsInput').value;

    fetch('feed/createFeed', {
        method : 'post',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({contents : contents})
    }).then((res) => res.json())
        .then((res) => {
            if(!res.createFeedSuccess){
                console.log(res.message);
                return window.alert(res.message);
            }
            appendFeed(res.feed, res.user);

        }).catch((err) => {
        console.log(err);
    })

}

function appendFeed(feed, user){
    const feedContentContainer = document.createElement('div');
    feedContentContainer.classList.add('feedContentContainer');
    feedContentContainer.id = feed._id;

    let rows = "";

    rows += `<div class="feedTitleArea">`
        + `<div style="display: flex; align-items: center">`
        + `<img class="feedProfilePhoto" src="${user.profilePhoto}">`
        + `<h4>${user.name}</h4>`
        + `</div>`
        + `<div class="feedControlBox">`
        + `<img src="/images/trash.png" style="width: 15px; height: 15px;" onclick="deleteFeed('${feed._id}')"/>`
        + `</div>`
        + `</div>`
        + `<div class="feedContents">`
        + `<p>${feed.feedContents}</p>`
        + `</div>`;

    feedContentContainer.innerHTML = rows;
    const parent = document.getElementById('feedArea');
    parent.insertBefore(feedContentContainer, parent.firstChild);

    document.getElementById('feedContentsInput').value = "";
}

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