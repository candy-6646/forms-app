let profileContainer = document.querySelector(".profile-container");
let profileVisible = false;
profileContainer.addEventListener("click", function(e) {
    if(profileVisible) {
        profileVisible = false;
        document.querySelector(".profile-card").style.display = "none";
    }else {
        profileVisible = true;
        document.querySelector(".profile-card").style.display = "flex";
    }
});


let formPublicBtn = document.getElementById("form-public");
formPublicBtn.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        document.querySelector(".resp-not-accepting-text").style.color = "#0d6efd";
        document.querySelector(".resp-not-accepting-text").innerText = "Please save changes";
    } else {
        document.querySelector(".resp-accepting-text").style.color = "#FC4F4F";
        document.querySelector(".resp-accepting-text").innerText = "Please save changes";
    }

    document.querySelector(".form-header-item-container").style.display = "flex";
});


let saveChangesBtn = document.querySelector(".form-header-item-btn");
saveChangesBtn.addEventListener("click", function(e) {
    if(formPublicBtn.checked) {
        document.getElementById("share-response").value = "on";
    }else {
        document.getElementById("share-response").value = "off";
    }
    document.querySelector(".make-public-form-btn").click();
});


function copyFunc() {
	let text = document.getElementById("form-link").value;
    document.querySelector(".copy-link-btn").innerText = "Copied!";
	navigator.clipboard.writeText(text);
}