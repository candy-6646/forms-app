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


let formDivs = document.querySelectorAll('.form-card-text');
for(let i=1;i<formDivs.length;i++) {
    let str = formDivs[i].innerText;
    if(str.length >= 40) {
        formDivs[i].innerText = formDivs[i].innerText.substring(0,40) + "....";
    }
    
}


var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})