var memeContainer = document.getElementById('memeStream');
var apiUrl = 'https://memeline.herokuapp.com/memes';

function getMemes() {
	fetch(apiUrl)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				var singleMeme = document.createElement("div");
				var memeCaption = document.createElement("div");
				var memeUser = document.createElement("div");
				var memeImg = document.createElement("img");

				singleMeme.setAttribute("class", "memeContainer shadow");
				memeCaption.setAttribute("id", "memeCaption");
				memeUser.setAttribute("id", "memeUser");
				memeImg.setAttribute("id", "memeImg");

				memeCaption.innerHTML = data[i].caption;
				memeUser.innerHTML = "By " + data[i].name + "<hr>";
				memeImg.src = data[i].url;

				singleMeme.appendChild(memeCaption);
				singleMeme.append(memeUser);
				singleMeme.appendChild(memeImg);
				memeContainer.appendChild(singleMeme);
			}
		})
		.catch((err) => console.log(err));
}

getMemes();

document.getElementById('memeForm').onsubmit = function () {
	var content = {
		name: document.getElementById("name").value,
		caption: document.getElementById("caption").value,
		url: document.getElementById("url").value,
	};
	console.log(content);
	fetch(apiUrl, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(content),
	})
		.then((res) => {
			console.log(res);
			document.getElementById("memeForm").reset();
			memeContainer.innerHTML = "";
			getMemes();
		})
		.catch((err) => console.log(err));
	return false;
};
