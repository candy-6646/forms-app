//adding logic for option text click to make checked
let allOptionsCont = document.querySelectorAll(".form-option-resp-question");
for(let i = 0; i < allOptionsCont.length; i++) {
    allOptionsCont[i].addEventListener("click", function(e) {
        
        let optsContainer = e.currentTarget.parentElement.parentElement;
        let allOptOfCurrent = optsContainer.querySelectorAll(".custom-checkbtn");
        for(let j = 0; j < allOptOfCurrent.length; j++) {
            if(allOptOfCurrent[j].classList[2] === "checked") {
                allOptOfCurrent[j].classList.remove("checked");
                allOptOfCurrent[j].classList.add("unchecked");
            }
        }

        let optParent = e.currentTarget.parentElement;
        let currentCheckedBtn = optParent.querySelector(".custom-checkbtn");
        currentCheckedBtn.classList.remove("unchecked");
        currentCheckedBtn.classList.add("checked");

        let optionText = allOptionsCont[i].innerText;
        optsContainer.querySelector(".user-selected-answer").value = optionText;
    });
}