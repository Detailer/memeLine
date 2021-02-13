var memeContainer = document.getElementById('memeStream');
var apiUrl = 'https://memeline.herokuapp.com/memes';

// Function to conver MongoDB ID to timestamp
// https://stackoverflow.com/questions/10346067/pull-date-from-mongo-id-on-the-client-side
function getDateFromId(id){
	// first 4 bytes are the timestamp portion (8 hex chars)
	var timehex = id.substring(0,8);
	
	// convert to a number... base 16
	var secondsSinceEpoch = parseInt(timehex, 16);
	
	// convert to milliseconds, and create a new date
	var dt = new Date(secondsSinceEpoch*1000);
	return dt;
}

function jsonToHtml(data) {
	var singleMeme = document.createElement("div");
	var memeCaption = document.createElement("div");
	var memeUser = document.createElement("div");
	var memeDate = document.createElement("div");
	var memeImg = document.createElement("img");
	var editButton = document.createElement("button");

	singleMeme.setAttribute("class", "memeContainer shadow");
	memeCaption.setAttribute("id", "memeCaption");
	memeUser.setAttribute("id", "memeUser");
	memeDate.setAttribute("id", "memeDate");
	memeImg.setAttribute("id", "memeImg");
	memeImg.setAttribute("onerror", "imgNotFound(this)");
	editButton.setAttribute("class", "editButton");
	editButton.setAttribute("id", data.id);
	editButton.setAttribute("onclick", "editClick(this)");
	
	memeCaption.innerHTML = data.caption;
	editButton.innerHTML = "✎";
	memeCaption.appendChild(editButton);
	memeUser.innerHTML = "By " + data.name + "<hr>";
	memeImg.src = data.url;
	memeDate.innerHTML = getDateFromId(data.id);

	singleMeme.appendChild(memeCaption);
	singleMeme.append(memeUser);
	singleMeme.appendChild(memeImg);
	singleMeme.appendChild(memeDate);
	memeContainer.appendChild(singleMeme);
}

function getMemes() {
	fetch(apiUrl)
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				jsonToHtml(data[i]);
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
		body: JSON.stringify(content)
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

// Image Not Found Error Handling
function imgNotFound(image) {
	image.onerror = '';
	image.src = 'res/img/404img.jpg';
	return true;
}

// Modal Popup Functionality
function editClick(button){
	// Get the modal
	var modal = document.getElementById("myModal");

	// When the user clicks the button, open the modal 
	modal.style.display = "block";

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}

	// Call the PATCH API
	var submitButton = document.getElementById('updateFromSubmit');
	submitButton.onclick = function(submitButton) {
		var newCaption = document.getElementById("updateCaption").value;
		var newUrl = document.getElementById("updateUrl").value;

		// Only patch if at least one of the new fields is not empty
		if (newCaption != '' || newUrl != ''){
			var content = {};
			if (newCaption != '')
				content['caption'] = newCaption;
			if (newUrl != '')
				content['url'] = newUrl;
			console.log(content);
			console.log(button.id);
			fetch(apiUrl + "/" + button.id, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(content),
			})
				.then((res) => {
					// Update the Stream locally and close modal
					document.getElementById("memeUpdateForm").reset();
					memeContainer.innerHTML = "";
					getMemes();
					modal.style.display = "none";
				})
				.catch((err) => console.log(err));
		}
	};
}
