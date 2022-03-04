//on getting input in titlte or desc make save btn visible
let formTitleInput = document.getElementById("formTitle");
let formDescInput = document.getElementById("formDesc");
formTitleInput.addEventListener("input", function(e) {
    document.querySelector(".form-header-item-container").style.display = "flex";
});
formDescInput.addEventListener("input", function(e) {
    document.querySelector(".form-header-item-container").style.display = "flex";
});

let formHeaderBtn = document.querySelector(".form-header-item-btn");
formHeaderBtn.addEventListener("click", function(e) {
    document.getElementById("save-form-title").click();
});

//bootstrap tooltip
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-tooltip="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});

//making new text question form submit
let newTextQuestionAddBtn = document.querySelector(".new-text-save-btn");
newTextQuestionAddBtn.addEventListener("click", function(e) {
    document.getElementById("new-text-submit-btn").click();
});

//making new mcq question form submit
let newMCQQuestionAddBtn = document.querySelector(".new-mcq-save-btn");
newMCQQuestionAddBtn.addEventListener("click", function(e) {
    document.getElementById("new-mcq-submit-btn").click();
});

//adding logic for new option using add option btn
let optNumber = 1;
let addOptionBtn = document.querySelector(".add-option-btn");
addOptionBtn.addEventListener("click", function(e) {
    let newMcqQuesModalContent = document.getElementById("new-question-mcq-options");
    let nextOptionNumber = optNumber + 1;
    optNumber++;
    let div = document.createElement("div");
    div.classList.add("new-question-content-mcq-item");
    div.innerHTML = `<span class="material-icons custom-radio-btn">radio_button_checked</span>
    <input class="form-control" name="option-${nextOptionNumber}" placeholder="option ${nextOptionNumber}" type="text" required autocomplete="off" />
    <span class="material-icons custom-option-close-btn">close</span>`;
    newMcqQuesModalContent.append(div);
    applyCloseOption();
});

//adding logic to remove an option
function applyCloseOption() {
    let allRemoveOptBtn = document.querySelectorAll(".custom-option-close-btn");
    for(let i = 0; i < allRemoveOptBtn.length; i++) {
        allRemoveOptBtn[i].addEventListener("click", function(e) {
            let closeOpBtnParent = e.currentTarget.parentElement;
            closeOpBtnParent.remove();
        });
    }
}





//theme
let allThemeBtns = document.querySelectorAll(".form-theme-item");
for(let i = 0; i < allThemeBtns.length; i++) {
    allThemeBtns[i].addEventListener("click", function(e) {
        let themeBtnParentElement = e.currentTarget.parentElement;
        let allIndicators = themeBtnParentElement.querySelectorAll(".form-color-choosed-indicator");
        for(let j = 0; j < allIndicators.length; j++) {
            allIndicators[j].style.display = "none";
        }
        e.currentTarget.querySelector(".form-color-choosed-indicator").style.display = "flex";


        // changing color of form
        let colorClass = e.currentTarget.classList[1];
        document.getElementById("theme-modal-color").value = colorClass;
    });
}

//making theme form submit
let themeSaveBtn = document.querySelector(".theme-form-save-btn");
themeSaveBtn.addEventListener("click", function(e) {
    document.getElementById("theme-form-submit-btn").click();
});

//making border as bg color
let formContainer = document.querySelector(".form-container");
let currentColor = formContainer.classList[2];
let formHeader = document.querySelector(".form-header");
let hederCurrColor = formHeader.classList[1];
formHeader.classList.remove(hederCurrColor);
formHeader.classList.add(currentColor + "-border");

let changeThemeBtinManager = document.querySelector(".change-theme-modal-open");
changeThemeBtinManager.addEventListener("click", function(e) {
    let themeModal = document.getElementById("form-theme");
    themeModal.querySelector("." + currentColor).click();
});


//submitting delete form
let deleteFormMangerBtn = document.querySelector(".delete-form-modal-open");
deleteFormMangerBtn.addEventListener("click", function(e) {
    document.getElementById("delete-modal-quesId").value = 'form';
    document.querySelector(".delete-note-text").innerText = 'Do you really want to delete this Form?';
});

let deleteFormBtn = document.querySelector(".modal-delete-form-btn");
deleteFormBtn.addEventListener("click", function(e) {
    let deleteFormSubmitBtn = document.getElementById("delete-form-submit-btn");
    deleteFormSubmitBtn.click();
});



//deleting single question
let deleteQuestionBtns = document.querySelectorAll(".form-controllers-delete-btn");
for(let i = 0; i < deleteQuestionBtns.length; i++) {
    deleteQuestionBtns[i].addEventListener("click", function(e) {
        let quesId = e.currentTarget.parentElement.parentElement.id;
        document.getElementById("delete-modal-quesId").value = quesId;
        document.querySelector(".delete-note-text").innerText = 'Do you really want to delete this Question?';
    });
}


//manging new text question modal
let newTextQuesManageBtn = document.querySelector(".edit-text-form-modal-open");
newTextQuesManageBtn.addEventListener("click", function(e) {
    document.getElementById("new-question-title").value = "";
    document.getElementById("text-modal-quesId").value = "form";
    document.querySelector(".new-text-save-btn").innerText = "Add";
});

let newTextQuesBtns = document.querySelectorAll(".form-controllers-edit-text-btn");
for(let i = 0; i < newTextQuesBtns.length; i++) {
    newTextQuesBtns[i].addEventListener("click", function(e) {
        let parentOfBtn = e.currentTarget.parentElement.parentElement;
        let quesId = parentOfBtn.id;
        let ques = parentOfBtn.querySelector(".form-question").innerText;
        document.getElementById("new-question-title").value = ques;
        document.getElementById("text-modal-quesId").value = quesId;
        document.querySelector(".new-text-save-btn").innerText = "Save Changes";
    });
}


//manging new mcq question modal
let newMCQQuesManageBtn = document.querySelector(".edit-mcq-form-modal-open");
newMCQQuesManageBtn.addEventListener("click", function(e) {
    document.getElementById("new-question-title-mcq").value = "";
    document.getElementById("mcq-modal-quesId").value = "form";
    document.querySelector(".new-mcq-save-btn").innerText = "Add";

    let mcqOptionsContainer = document.getElementById("new-question-mcq-options");
    mcqOptionsContainer.innerHTML = ``;
    optNumber = 1;
    let div = document.createElement("div");
    div.classList.add("new-question-content-mcq-item");
    div.innerHTML = `<span class="material-icons custom-radio-btn">radio_button_checked</span>
    <input class="form-control" name="option-1" placeholder="option 1" type="text" required autocomplete="off"/>
    <span class="material-icons custom-option-close-btn">close</span>`;
    mcqOptionsContainer.append(div);
    applyCloseOption();
});

let newMCQQuesBtns = document.querySelectorAll(".form-controllers-edit-mcq-btn");
for(let i = 0; i < newMCQQuesBtns.length; i++) {
    newMCQQuesBtns[i].addEventListener("click", function(e) {

        let parentOfBtn = e.currentTarget.parentElement.parentElement;
        let quesId = parentOfBtn.id;
        let ques = parentOfBtn.querySelector(".form-question").innerText;
        let allCurrentOptions = parentOfBtn.querySelectorAll(".form-option-text");

        document.getElementById("new-question-title-mcq").value = ques;
        document.getElementById("mcq-modal-quesId").value = quesId;
        document.querySelector(".new-mcq-save-btn").innerText = "Save Changes";

        optNumber = 0;
        let mcqOptionsContainer = document.getElementById("new-question-mcq-options");
        mcqOptionsContainer.innerHTML = ``;
        for(let j = 0; j < allCurrentOptions.length; j++) {
            let nextOptionNumber = optNumber + 1;
            optNumber++;
            let div = document.createElement("div");
            div.classList.add("new-question-content-mcq-item");
            div.innerHTML = `<span class="material-icons custom-radio-btn">radio_button_checked</span>
            <input class="form-control" name="option-${nextOptionNumber}" value="${allCurrentOptions[j].value}" placeholder="option ${nextOptionNumber}" type="text" required autocomplete="off" />
            <span class="material-icons custom-option-close-btn">close</span>`;
            mcqOptionsContainer.append(div);
        }

        
        applyCloseOption();
    });
}

