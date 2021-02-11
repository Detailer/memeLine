var memeContainer = document.getElementById('memeStream');
var apiUrl = 'https://memeline.herokuapp.com/memes';

// https://stackoverflow.com/questions/10346067/pull-date-from-mongo-id-on-the-client-side
function getDateFromId(id){
	// first 4 bytes are the timestamp portion (8 hex chars)
	var timehex = id.substring(0,8);
	console.log(timehex); // gives: 4f94c2a1

	// convert to a number... base 16
	var secondsSinceEpoch = parseInt(timehex, 16);
	console.log(secondsSinceEpoch); // gives: 1335149217

	// convert to milliseconds, and create a new date
	var dt = new Date(secondsSinceEpoch*1000);
	console.log(dt); // gives: Sun Apr 22 2012 22:46:57 GMT-0400 (EDT)
	return dt;
}

function getMemes() {
	fetch(apiUrl)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				var singleMeme = document.createElement("div");
				var memeCaption = document.createElement("div");
				var memeUser = document.createElement("div");
				var memeDate = document.createElement("div");
				var memeImg = document.createElement("img");

				singleMeme.setAttribute("class", "memeContainer shadow");
				memeCaption.setAttribute("id", "memeCaption");
				memeUser.setAttribute("id", "memeUser");
				memeDate.setAttribute("id", "memeDate");
				memeImg.setAttribute("id", "memeImg");

				memeCaption.innerHTML = data[i].caption;
				memeUser.innerHTML = "By " + data[i].name + "<hr>";
				memeImg.src = data[i].url;
				memeDate.innerHTML = getDateFromId(data[i].id);

				singleMeme.appendChild(memeCaption);
				singleMeme.append(memeUser);
				singleMeme.appendChild(memeImg);
				singleMeme.appendChild(memeDate);
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
