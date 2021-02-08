var memeContainer = document.getElementById('memeStream');

function getMemes() {
    fetch('http://localhost:8080/memes')
    .then(res => res.json())
    .then(data => {
        data.reverse();
        console.log(data);
        for (var i = 0; i < data.length; i++){
            var singleMeme = document.createElement('div');
            var div = document.createElement('div');
            var img = document.createElement('img');
            img.setAttribute('id', 'memeImg');
            div.innerHTML = '<b>Name</b>: ' + data[i].name + '<Br>' + '<b>Caption</b>: ' + data[i].caption;
            img.src = data[i].url;
            singleMeme.appendChild(div);
            singleMeme.appendChild(img);
            memeContainer.appendChild(singleMeme);
        }
    })
    .catch(err => console.log(err));    
}

getMemes();

document.getElementById('memeForm').onsubmit = function() {
    var content = {
        name : document.getElementById('name').value,
        caption: document.getElementById('caption').value,
        url: document.getElementById('url').value
    };
    console.log(content);
    fetch('http://localhost:8080/memes', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    })
    .then(res => {
        console.log(res);
        memeContainer.innerHTML = "";
        getMemes();
    })
    .catch(err => console.log(err));
    return false;
}