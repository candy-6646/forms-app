//adding logic for option text click to make checked
let allOptionsCont = document.querySelectorAll(".form-option-resp-question");
for(let i = 0; i < allOptionsCont.length; i++) {
    allOptionsCont[i].addEventListener("click", function(e) {
        
        let optsContainer = e.currentTarget.parentElement.parentElement;
        let allOptOfCurrent = optsContainer.querySelectorAll(".custom-checkbtn-form");
        for(let j = 0; j < allOptOfCurrent.length; j++) {
            if(allOptOfCurrent[j].innerText == "radio_button_checked") {
                allOptOfCurrent[j].innerText = "radio_button_unchecked";
            }
        }

        let optParent = e.currentTarget.parentElement;
        let currentCheckedBtn = optParent.querySelector(".custom-checkbtn-form");
        currentCheckedBtn.innerText = "radio_button_checked";

        let optionText = allOptionsCont[i].innerText;
        optsContainer.querySelector(".user-selected-answer").value = optionText;
    });
}