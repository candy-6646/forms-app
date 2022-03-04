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