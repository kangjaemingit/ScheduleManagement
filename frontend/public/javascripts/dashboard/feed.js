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