window.onload = function() {
    var func = document.querySelector("[data-func]");
    
    if(func){
        document.documentElement.setAttribute("class",func.getAttribute("data-func"));
    };

    Method.button.all();
    Method.search.keyWord();
    Method.common.heightLight();
    Method.common.train();
    Method.common.multiIntent();

};

window.onfocus = function() {
    Method.common.train();
};

window.onpopstate = function() {
    var history = location.pathname;
    console.log(history)
    Method.common.page(history,"history");
};

worker = new Worker("/javascript/worker.js");


Method={};

Method.button={};

//button action
Method.button.all = function(){
    Method.button.saveButton();
    Method.button.addButton();
    Method.button.delButton();
    Method.button.closeButton();
    Method.button.repwdButton();
    Method.button.forgetButton();
    Method.button.resetPwd();
    Method.button.backToTopBtn();
    Method.button.addStoryButton();
    Method.button.editStoryButton();
};

//save button
Method.button.saveButton = function(){
    if(document.querySelector("#save")){
        save.onclick = function(event){

            var data = "";
            var symbol;

            var inputs = document.querySelectorAll("[required]");
            for(var i=0;i<inputs.length;i++){
                if(inputs[i].value==""){
                    return;
                };

                i == 0 ? symbol = "?" : symbol = "&";

                data += symbol + inputs[i].name + "=" + inputs[i].value;
            };

            var infoId = this.getAttribute("data-infoId");
            if(infoId != null){
                data += "&infoId=" + infoId;
            };
            
            Method.common.loading();

            event.preventDefault();
                            
            function back(info){

                var info = JSON.parse(info.data);
                console.log(info)

                var html = "<h2><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h2>";

                var prevPage = null;
                if(info.status == "success"){
                    prevPage = function(){
                        document.querySelector("#cancel").click();
                    };
                };

                Method.common.loadingClose();
                Method.common.showBox(html,"message","",prevPage);
            };

            var url = location.href + "/update" + encodeURI(data);
            console.log(url)

            Method.common.asyncAjax(url,back);
        };
    };
};

//add button
Method.button.addButton = function(){
    if(document.querySelector("#add")){
        add.onclick = function(event){
            var data="?";
            var inputs = document.querySelectorAll("[required]");
            for(var i=0;i<inputs.length;i++){
                if(inputs[i].value==""){
                    return;
                };
                data += "&" + inputs[i].name + "=" + inputs[i].value;
            };

            event.preventDefault();
            
            Method.common.loading();            
                            
            function back(info){
                var info = JSON.parse(info.data);
                console.log(info)
                
                var html = "<h2><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h2>";

                var prevPage = null;
                if(info.status == "success"){

                    if(document.querySelector("#cancel")){
                        prevPage = function(){
                            document.querySelector("#cancel").click();
                        };
                    }else{
                        prevPage = function(){
                            Method.common.page("/");
                        };
                    };
                };

                Method.common.loadingClose();
                Method.common.showBox(html,"message","",prevPage);
            };

            var url = location.href + "/insert" + encodeURI(data);
            console.log(url)

            Method.common.asyncAjax(url,back);
        };
    };
};

//del button
Method.button.delButton = function(){

    var delButton = document.querySelectorAll("#del");

    for(var i=0;i<delButton.length;i++){
        delButton[i].onclick = function(){
            run(this);
        };
    };

    function run(obj){

        var listName = obj.getAttribute("data-title");

        var html = "<h2><div class='sa-icon warning'><span></span></div>???????????? " + listName + "</h2>";

        Method.common.showBox(html,"message");

        var content = document.querySelector("#message .content");

        var footButton = document.createElement("div");
        footButton.setAttribute("class","button");
        content.appendChild(footButton);

        var cencelButton = document.createElement("button");
        cencelButton.innerText = "??????";
        cencelButton.setAttribute("class","btn btn-primary");
        cencelButton.onclick = function() {
            document.querySelector("#message").remove();
        };
        footButton.appendChild(cencelButton);

        var delButton = document.createElement("button");
        delButton.innerText = "??????";
        delButton.setAttribute("class","btn btn-info");

        delButton.onclick = function() {
            document.querySelector("#message").remove();
            deleteList();
        };
        footButton.appendChild(delButton);
        
        function deleteList(){
            Method.common.loading();

            function back(info){
                var info = JSON.parse(info.data);
                console.log(info)

                var html = "<h2><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h2>";

                if(info.status == "success"){
                    obj.parentNode.parentNode.remove();
                };
                Method.common.loadingClose();
                Method.common.showBox(html,"message");
            };

            var data = "";

            if(obj.getAttribute("data-category")){
                data += "&category=" + obj.getAttribute("data-category");
            };
            
            var url = location.href + "/delete?infoId=" + obj.getAttribute("data-infoId") + data;
            
            console.log(url)

            Method.common.asyncAjax(url,back);
        };
    };
};

//close button
Method.button.closeButton = function(){
    if(document.querySelector("button.close")){
        document.querySelector("button.close").onclick = function(){
            this.parentNode.remove();
        };
    };
};

//repwd button
Method.button.repwdButton = function(){

    var repwdButton = document.querySelectorAll("#repwd");

    for(var i=0;i<repwdButton.length;i++){
        repwdButton[i].onclick = function(){
            run(this);
        };
    };

    function run(obj){

        var listName = obj.getAttribute("data-title");

        Method.common.showBox("","message");

        var content = document.querySelector("#message .content");

        var h1 = document.createElement("h1");
        h1.innerText = "????????????";
        content.appendChild(h1);

        var rePassword = document.createElement("form");
        rePassword.setAttribute("action","");
        rePassword.setAttribute("name","form");
        rePassword.setAttribute("id","rePassword");
        content.appendChild(rePassword);

        var password = document.createElement("input");
        password.setAttribute("type","password");
        password.setAttribute("name","password");
        password.setAttribute("class","form-control");
        password.setAttribute("placeholder","??????????????????");
        password.setAttribute("required","");
        rePassword.appendChild(password);

        var confirmPassword = document.createElement("input");
        confirmPassword.setAttribute("type","password");
        confirmPassword.setAttribute("name","confirmPassword");
        confirmPassword.setAttribute("class","form-control");
        confirmPassword.setAttribute("placeholder","?????????????????????");
        confirmPassword.setAttribute("required","");
        rePassword.appendChild(confirmPassword);

        var footButton = document.createElement("div");
        footButton.setAttribute("class","button");
        rePassword.appendChild(footButton);

        var cencelButton = document.createElement("button");
        cencelButton.innerText = "??????";
        cencelButton.setAttribute("class","btn btn-primary");
        cencelButton.onclick = function() {
            document.querySelector("#message").remove();
        };
        footButton.appendChild(cencelButton);

        var saveButton = document.createElement("button");
        saveButton.innerText = "??????";
        saveButton.type = "submit";
        saveButton.setAttribute("class","btn btn-info");

        saveButton.onclick = function(event) {

            function back(info){
                var info = JSON.parse(info.data);
                console.log(info)

                var html = "<h2><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h2>";

                if(info.status == "success"){
                    document.querySelector("#message .content").innerHTML = html;
                }else{
                    Method.common.showBox(html,"message","");
                };
                Method.common.loadingClose();
            };

            var data="/repwd?infoId=" + listName;
            var inputs = document.querySelectorAll("#message [required]");
            console.log(inputs)
            for(var i=0;i<inputs.length;i++){
                
                if(inputs[i].value==""){
                    return;
                };

                data += "&" + inputs[i].name + "=" + inputs[i].value;
            };

            event.preventDefault();

            Method.common.loading();

            var url = location.href + data;
            console.log(url)

            Method.common.asyncAjax(url,back);
        };

        footButton.appendChild(saveButton);
        
    };
};

//forget button
Method.button.forgetButton  = function(){

    if(document.querySelector("#forget")){

        document.querySelector("#forget").onclick = function(){

            var html = 
                '<h1>????????????</h1>'+
                '<form action="" name="forgetForm">'+
                    '<input type="email" class="form-control" name="email" placeholder="????????????????????????????????????E-mail">'+
                    '<div>'+
                        '<button id="sendEmail" type="button" class="btn btn-info">??????</button>'+
                    '</div>'+
                '</form>';

            Method.common.showBox(html,"forgetBox");

            document.querySelector("#sendEmail").onclick = function(event) {
                
                function back(info){
                    var info = JSON.parse(info.data);
                    console.log(info)
    
                    var html = "<h5><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h5>";
    
                    document.querySelector("#forgetBox .content").innerHTML = html;
    
                    Method.common.loadingClose();
                };

                if(forgetForm.email.value == ""){
                    forgetForm.email.focus();
                };

                event.preventDefault();

                Method.common.loading();

                var url = location.origin + "/users/sendResetMail?email=" + forgetForm.email.value;
                console.log(url)
                Method.common.asyncAjax(url,back);
            }
        };
    };
};

//resetPassword button
Method.button.resetPwd = function(){
    if(document.querySelector("#resetPwd")){
        resetPwd.onclick = function(event){

            function back(info){
                var info = JSON.parse(info.data);
                console.log(info)

                var html = "<h2><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h2>";

                function goLogin(){
                    Method.common.page("/")
                };

                Method.common.showBox(html,"message","",goLogin);

                Method.common.loadingClose();
            };

            var data = "/update";
            var inputs = document.querySelectorAll("[required]");
            for(var i=0;i<inputs.length;i++){
                if(inputs[i].value==""){
                    return;
                };

                i == 0 ? symbol = "?" : symbol = "&";

                data += symbol + inputs[i].name + "=" + inputs[i].value;
            };

            event.preventDefault();

            var url = location.href + data;
            console.log(url)
            Method.common.asyncAjax(url,back);
        };
    };
};

// js_conversations & jh_story backTopBtn
Method.button.backToTopBtn = function(){
    if(document.querySelector('.jh_conversations') || document.querySelector('.jh_story')){
        const footButton = document.querySelector('.footButton');
        window.onscroll = function(){
            const px = 300;
            if(document.body.scrollTop > px || document.documentElement.scrollTop > px){
                if(!document.querySelector('#backTopBtn')){
                    const backTopBtn = document.createElement('button');
                    backTopBtn.setAttribute('class', 'btn btn-light');
                    backTopBtn.setAttribute('id', 'backTopBtn');
                    const btnIcon = document.createElement('i');
                    btnIcon.setAttribute('class', 'fas fa-chevron-circle-up fa-2x');
                    backTopBtn.appendChild(btnIcon);
                    footButton.appendChild(backTopBtn);

                    backTopBtn.onclick = function(){
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        })
                    }
                }
            }else{
                if(document.querySelector('#backTopBtn')){
                    document.querySelector('#backTopBtn').remove();
                }
            }
        }
    }
}

// ??????????????? ????????????
Method.button.addStoryButton = function(){
    if(document.querySelector('.jh_new_story') || document.querySelector('.jh_new_simple_story')){
        const stories = document.querySelector('#stories');
        const btnDiv = document.querySelector('#btnDiv')
        const userBtn = document.querySelector('#userBtn')
        const botBtn = document.querySelector('#botBtn')

        Method.story.editStoryTitle()
        Method.story.getStoryTitle()
        
        Method.story.stepControlBtn(userBtn, botBtn)

        Method.story.showBorder(stories, btnDiv, userBtn, botBtn)
        
    }
}

// ???????????????????????? ????????????
Method.button.editStoryButton = function(){
    if(document.querySelector('.jh_story') || document.querySelector('.jh_simple_story')){
        const storyFilter = document.querySelector('#storyFilter')
        const filterBtn = document.querySelector('#filterBtn')
        const btnDiv = document.querySelector('#btnDiv')
        const userBtn = document.querySelector('#userBtn')
        const botBtn = document.querySelector('#botBtn')
        const stories = document.querySelector('#stories')
        const storyRemoveBtn = document.querySelector('#storyRemoveBtn')
        if(storyFilter.value){
            // ????????????render?????????????????????????????????0.5?????????????????????
            setTimeout(() => {
                /* 
                ??????????????????
                editStoryTitle - ??????????????????
                getStoryTitle - ??????????????????
                showBorder - ????????????
                stepControlBtn - ??????????????????
                clickStoryRemoveBtnEvent - ??????????????????
                */
                Method.story.editStoryTitle()
                Method.story.getStoryTitle()
                Method.story.showBorder(stories, btnDiv, userBtn, botBtn)
                Method.story.stepControlBtn(userBtn, botBtn)
                Method.story.clickStoryRemoveBtnEvent(storyRemoveBtn)

                // ??????????????????element
                const userStepRemoveBtns = document.querySelectorAll('.userStep #removeBtn')
                const userStepIntentBtns = document.querySelectorAll('.userStep #intentBtn')
                const userStepStorySpans = document.querySelectorAll('.userStep #storySpan')
                const userStepInputs = document.querySelectorAll('.userStep #userInput')
                const userStepIntentSpans = document.querySelectorAll('.userStep #intent-span')

                // ??????????????????element
                const botStepRemoveBtns = document.querySelectorAll('.botRes #removeBtn')
                const botStepBottomRightDivs = document.querySelectorAll('.botRes .bottom-right')
                const botStepResNameInputs = document.querySelectorAll('.botRes #res-name-input')
                const botStepResInputs = document.querySelectorAll('.botRes #botInput')

                // ???????????????????????????
                Array.from(botStepRemoveBtns).map(botStepRemoveBtn => Method.story.botStep.removeBtnClickEvent(botStepRemoveBtn))
                Array.from(botStepBottomRightDivs).map(botStepBottomRightDiv => Method.story.botStep.resNameDivMouseEvent(botStepBottomRightDiv))
                Array.from(botStepResNameInputs).map(botStepResNameInput => Method.story.botStep.resNameInputEvent(botStepResNameInput))
                Array.from(botStepResInputs).map(botStepResInput => Method.story.botStep.resTextAreaEvent(botStepResInput))

                // ??????????????????????????????????????????
                Array.from(botStepResInputs).map(botStepResInput => {
                    botStepResInput.style.height = botStepResInput.scrollHeight + 20 + 'px'
                })

                // ???????????????
                if(document.querySelector('.jh_story')){
                    // ???????????????????????????
                    Array.from(userStepRemoveBtns).map(userStepRemoveBtn => Method.story.userStep.removeBtnClickEvent(userStepRemoveBtn))
                    Array.from(userStepIntentBtns).map(userStepIntentBtn => Method.story.userStep.intentBtnClickEvent(userStepIntentBtn))
                    Array.from(userStepStorySpans).map(userStepStorySpan => Method.story.userStep.inputClickEvent(userStepStorySpan))
                    Array.from(userStepInputs).map(userStepInput => Method.story.userStep.inputEvent(userStepInput))
                    Array.from(userStepIntentSpans).map(userStepIntentSpan => Method.story.clickIntentSpanEvent(userStepIntentSpan))
                }

                // ??????????????????
                if(document.querySelector('.jh_simple_story')){
                    // ???????????????????????????
                    Array.from(userStepRemoveBtns).map(userStepRemoveBtn => Method.story.userStep.simpleClickRemoveBtnEvent(userStepRemoveBtn))
                    Array.from(userStepStorySpans).map(userStepStorySpan => Method.story.userStep.simpleInputClickEvent(userStepStorySpan))
                    Array.from(userStepInputs).map(userStepInput => Method.story.userStep.simpleInputEvent(userStepInput))
                }

            }, 500)
            
        }
    }
}

// story??????function
Method.story = {
    // ???????????????????????????????????????
    stepControlBtn: (userBtn, botBtn) => {
        userBtn.addEventListener('click', e => {
            Method.story.clickUserBtn(stories);
        })
    
        botBtn.addEventListener('click', e => {
            Method.story.clickBotBtn(stories);
        })
    },
    // ?????????????????????function
    userStep: {
        // ???????????????????????????
        allUserStepEvent: (removeBtn, intentBtn, storySpan, input) => {
            if(document.querySelector('.jh_new_story') || document.querySelector('.jh_story')){
                Method.story.userStep.removeBtnClickEvent(removeBtn)
                Method.story.userStep.intentBtnClickEvent(intentBtn)
                Method.story.userStep.inputClickEvent(storySpan)
                Method.story.userStep.inputEvent(input)
            }else{
                Method.story.userStep.simpleClickRemoveBtnEvent(removeBtn)
                Method.story.userStep.simpleInputClickEvent(storySpan)
                Method.story.userStep.simpleInputEvent(input)
            }
            
        },
        // ?????????????????????????????????
        removeBtnClickEvent: (removeBtn) => {
            // ????????????????????????
            removeBtn.addEventListener('click', e => {
                // storyName - ???????????????????????????
                const target = e.target;
                const storyName = document.querySelector('#storyTitle').innerText
        
                // userStoryDiv - ??????????????????????????????????????????????????????????????????????????????
                // text - ????????????????????????????????????????????????????????????
                // intent - ???????????????????????????????????????????????????????????????slice()???????????????????????????????????????????????????: ????????????????????????????????????4??????
                if(target.matches('#removeBtn')){
                    const userStoryDiv = target.parentElement.parentElement.parentElement
                    if(target.parentElement.parentElement.previousElementSibling.children[0].id == 'userInput'){
                        if(target.parentElement.parentElement.previousElementSibling.children[0].value){
                            const text = target.parentElement.parentElement.previousElementSibling.children[0].value
                            let intent = target.parentElement.parentElement.previousElementSibling.children[1].children[0].children[1].innerText
                            intent = intent.slice(4, intent.length)
                            removeUserStep(storyName, text, intent, userStoryDiv)
                        }else{
                            userStoryDiv.remove()
                        }
                    }else{
                        const text = ''
                        let intent = target.parentElement.parentElement.previousElementSibling.children[0].children[0].children[1].innerText
                        intent = intent.slice(4, intent.length)
                        removeUserStep(storyName, text, intent, userStoryDiv)
                    }
                }
        
                if(target.tagName == 'svg'){
                    const userStoryDiv = target.parentElement.parentElement.parentElement.parentElement
                    if(target.parentElement.parentElement.parentElement.previousElementSibling.children[0].id == 'userInput'){
                        if(target.parentElement.parentElement.parentElement.previousElementSibling.children[0].value){
                            const text = target.parentElement.parentElement.parentElement.previousElementSibling.children[0].value
                            let intent = target.parentElement.parentElement.parentElement.previousElementSibling.children[1].children[0].children[1].innerText
                            intent = intent.slice(4, intent.length)
                            removeUserStep(storyName, text, intent, userStoryDiv)
                        }else{
                            userStoryDiv.remove()
                        }
                    }else{
                        const text = ''
                        let intent = target.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[0].children[1].innerText
                        intent = intent.slice(4, intent.length)
                        removeUserStep(storyName, text, intent, userStoryDiv)
                    }
                }
        
                if(target.tagName == 'path'){
                    const userStoryDiv = target.parentElement.parentElement.parentElement.parentElement.parentElement
                    if(target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].id == 'userInput'){
                        if(target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].value){
                            const text = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].value
                            let intent = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[1].children[0].children[1].innerText
                            intent = intent.slice(4, intent.length)
                            removeUserStep(storyName, text, intent, userStoryDiv)
                        }else{
                            userStoryDiv.remove()
                        }
                    }else{
                        const text = ''
                        let intent = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[0].children[1].innerText
                        intent = intent.slice(4, intent.length)
                        removeUserStep(storyName, text, intent, userStoryDiv)
                    }
                }
        
                // ??????????????????function
                function removeUserStep(storyName, userSays, intent, userStoryDiv){
                    const payload = {
                        storyName,
                        userSays,
                        intent
                    }
                    fetch(`http://192.168.10.127:3030/jh_story/userStep/fragments`,{
                        method: 'delete',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': "application/json",
                        },
                    })
                    .then(response => response.json())
                    .then(info => {
                        if(info.status == 'success'){
                            userStoryDiv.remove()
                        }
                    })
                    .catch(err => console.log(err))
        
                    fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu/example`,{
                        method: 'delete',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': "application/json",
                        },
                    })
                    .catch(err => console.log(err))
                }
            })
        },
        // ?????????????????????????????????
        intentBtnClickEvent: (intentBtn) => {
            // ????????????????????????
            intentBtn.addEventListener('click', e => {
                const target = e.target;
                let indexNum = 0
                let storyContainer
                let targetInput

                if(target.matches('#intentBtn')){
                    storyContainer = target.parentElement.parentElement.previousElementSibling
                    targetInput = target.parentElement.parentElement.previousElementSibling.childNodes[0]
                    storyContainer.children[0].setAttribute('data-status', 'typing')
                }

                if(target.tagName == 'svg'){
                    storyContainer = target.parentElement.parentElement.parentElement.previousElementSibling
                    targetInput = target.parentElement.parentElement.parentElement.previousElementSibling.childNodes[0]
                    storyContainer.children[0].setAttribute('data-status', 'typing')
                }

                if(target.tagName == 'path'){
                    storyContainer = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling
                    targetInput = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.childNodes[0]
                    storyContainer.children[0].setAttribute('data-status', 'typing')
                }

                const allStorySpan = document.querySelectorAll('#storySpan')
                for(i = 0; i < allStorySpan.length; i++){
                    if(allStorySpan[i].childNodes[0].dataset.status == 'typing'){
                        indexNum = i
                    }
                }
                
                Method.story.clickIntentBtn(storyContainer, targetInput, allStorySpan, indexNum);
            })
        },
        // ????????????????????????????????????
        inputClickEvent: (storySpan) => {
            // storySpan????????????
            // ??????userInput??????disabled???????????????????????????????????????????????????????????????storySpan???
            // ?????????????????????
            storySpan.addEventListener('click', e => {
                const target = e.target

                // ????????????????????????????????????
                if(target.matches('#userInput') && target.getAttribute('disabled') == ''){
                    
                    const userText = target.value.trim()
                    const intent = target.nextElementSibling.children[0].innerText.slice(4, target.nextElementSibling.innerText.length)
                    console.log(intent)
                    getTextExam(userText, intent)
                }

                // ?????????????????????????????????????????????function
                function getTextExam(userText, intent){
                    // ??????API - ??????????????????????????????
                    fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu/getTextExams?text=${userText}&intent=${intent}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        localStorage.setItem('textExamData', JSON.stringify(data))
                        // ??????????????????????????????
                        let examsTitleHtml = ''
                        data.forEach(item => {
                            if(item.text == userText && item.intent == intent){
                                // if(item.entities.length){
                                    examsTitleHtml = Method.story.createTextHtml(item, userText)
                                // }
                            }
                        })


                        let html = `
                        <div class="userBoxTitle">
                            <span class="userTextTitle" id="userTextTitle">${examsTitleHtml.text}</span>
                            <span id="intent-span" class="nluSpan"><i class="fas fa-tag" style="font-size: 7px;"></i><span id="intent-text" class="nluText">${intent}</span></span>
                        </div>
                        <div class="userTextExam" style="width:800px;">
                            <input type="text" class="form-control" name="userExamInput" id="userExamInput" placeholder="????????????..." autocomplete="off">
                            <div id="textExams-panel">
                        `

                        const filterData = data.filter(item => item.text !== userText)
                        html = Method.story.createTextsFunc(filterData, html, examsTitleHtml)

                        html += `
                            </div>
                            <div class="textExams--footer">
                                <div id="errorMessageBox"></div>
                                <button id="sendExam" type="button" class="btn btn-info">??????</button>
                            </div>
                        </div>
                        `

                        Method.common.showBox(html,"userTextBox");

                        // ????????????????????????????????????
                        const userExamInput = document.querySelector('#userExamInput')
                        // ????????????????????????????????????
                        userExamInput.addEventListener('focus', e => {
                            const target = e.target
                            target.setAttribute('data-event', 'blur')
                        })

                        // ????????????????????????????????????
                        // userExamInput.addEventListener('blur', e => {
                        //     const target = e.target
                        //     const examText = target.value
                        //     if(target.dataset.event != 'blur' || !examText) return
                        //     // ????????????API - ???????????????????????????????????????????????????
                        //     fetch(`http://192.168.10.127:3030/jh_story/parse?userInput=${examText}`)
                        //     .then(response => response.json())
                        //     .then(inputParse => {
                        //         // ????????????????????????????????????object
                        //         const newExam = {
                        //             text: inputParse.text,
                        //             intent: inputParse.intent.name,
                        //             entities: inputParse.entities,
                        //             metadata: {
                        //                 language: 'zh'
                        //             }
                        //         }
                        //         // ??????????????????
                        //         const repeatExam = data.filter(item => item.text == newExam.text)
                        //         if(!repeatExam.length){
                        //             data.push(newExam)
                        //             let newExamHtml = ''
                        //             newExamHtml = createTextsFunc(data, newExamHtml, examsTitleHtml)
                        //             document.querySelector('#textExams-panel').innerHTML = newExamHtml
                        //             eventFunc()
                        //             userExamInput.value = ''
                        //         }
                        //     })
                        //     .catch(err => console.log(err))
                        // })

                        // ????????????????????????????????????
                        userExamInput.addEventListener('keydown', e => {
                            const target = e.target
                            const exampleTitle = Method.story.sliceText(document.querySelector('#userTextTitle').innerText)
                            const examText = target.value
                            localStorage.setItem('exampleTitle', exampleTitle)
                            if(e.keyCode == 13){
                                if(!examText) return
                                const regex = /\'|\`|\"|\[|\]|\{|\}|\(|\)/g
                                if(regex.test(target.value)){
                                    target.value = ''
                                    var html = `<h2><div class='sa-icon warning'><span></span></div>???????????????????????????</h2>`;
                                    Method.common.showBox(html, 'message', '')
                                    return
                                }
                                target.setAttribute('data-event', 'keydown')
                                fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu/checkRepeat?userInput=${examText}`)
                                .then(res => res.json())
                                .then(info => {
                                    if(info.status !== 'success'){
                                        target.value = ''
                                        var html = `<h2><div class='sa-icon warning'><span></span></div>${info.message}</h2>`;
                                        Method.common.showBox(html, 'message', '')
                                        return
                                    }
                                    // ????????????API - ???????????????????????????????????????????????????
                                    fetch(`http://192.168.10.127:3030/jh_story/parse?userInput=${examText}`)
                                    .then(response => response.json())
                                    .then(inputParse => {
                                        // ????????????????????????????????????object
                                        const newExam = {
                                            text: inputParse.text,
                                            intent: inputParse.intent.name,
                                            entities: inputParse.entities
                                        }
                                        // ??????????????????
                                        const textExamData = JSON.parse(localStorage.getItem('textExamData'))
                                        const repeatExam = textExamData.filter(item => item.text == newExam.text)
                                        if(repeatExam.length){
                                            target.value = ''
                                            var html = `<h2><div class='sa-icon warning'><span></span></div>????????????</h2>`;
                                            Method.common.showBox(html, 'message', '')
                                            return
                                        }
                                        textExamData.push(newExam)
                                        localStorage.setItem('textExamData', JSON.stringify(textExamData))
                                        const exampleTitle = localStorage.getItem('exampleTitle')
                                        const newData = textExamData.filter(item => item.text !== exampleTitle)
                                        
                                        return newData
                                    })
                                    .then(newData => {
                                        let newExamHtml = ''
                                        newExamHtml = Method.story.createTextsFunc(newData, newExamHtml, examsTitleHtml)
                                        document.querySelector('#textExams-panel').innerHTML = newExamHtml
                                        Method.story.checkAllExampleIntent(newData)
                                        Method.story.eventFunc(newData, examsTitleHtml)
                                        userExamInput.value = ''
                                    })
                                    .catch(err => console.log(err))
                                })
                                .catch(err => console.log(err))
                            }
                        })

                        // ??????????????? ??????????????????
                        const sendExamBtn = document.querySelector('#sendExam')
                        sendExamBtn.addEventListener('click', e => {
                            const target = e.target
                            const textExamData = localStorage.getItem('textExamData')
                            const payload = {
                                textExamData
                            }
                            fetch('http://192.168.10.127:3030/jh_story/userStep/nlu/addExamples', {
                                method: 'post',
                                body: JSON.stringify(payload),
                                headers: {
                                    'Content-Type': "application/json",
                                }
                            })
                            .then(res => res.json())
                            .then(info => {
                                if(info.status === 'success'){
                                    document.querySelector('#userTextBox').remove()
                                }else{
                                    var html = `<h2><div class='sa-icon ${info.status}'><span></span></div>${info.message}</h2>`;
                                    Method.common.showBox(html, 'message', '')
                                    return
                                }
                            })
                            .catch(err => console.log(err))
                        })

                        Method.story.eventFunc(data, examsTitleHtml)
                    })
                    .catch(err => console.log(err))
                }
            })
        },
        // ??????????????????????????????
        inputEvent: (input) => {
                // userInput????????????
                input.addEventListener('focus', e => {
                    const target = e.target
                    target.setAttribute('data-event', 'blur')
                    target.setAttribute('data-status', 'typing')
                })

                // userInput????????????
                input.addEventListener('keydown', e => {
                    const target = e.target;

                    if(!target.value || target.value.trim() == '') return

                    if(e.keyCode == 13){
                        // ????????????????????????????????????
                        let indexNum = 0
                        const allStorySpan = document.querySelectorAll('#storySpan')
                        for(i = 0; i < allStorySpan.length; i++){
                            if(allStorySpan[i].children[0].dataset.status == 'typing'){
                                indexNum = i
                            }
                        }

                        const regex = /\'|\`|\"|\[|\]|\{|\}|\(|\)/g
                        if(regex.test(target.value)){
                            target.value = ''
                            var html = `<h2><div class='sa-icon warning'><span></span></div>???????????????????????????</h2>`;
                            Method.common.showBox(html, 'message', '')
                            return
                        }

                        target.setAttribute('data-event', 'keydown')
                        if(document.querySelector('#storyTitle').innerText == '???????????????'){
                            target.setAttribute('data-status', 'waiting')
                            target.value = ''
                            var html = "<h2><div class='sa-icon warning'><span></span></div>????????????????????????</h2>";
                            Method.common.showBox(html, 'message', '')
                            return
                        }

                        // ????????????API ??????????????????rasa??????????????????????????????????????????
                        fetch(`http://192.168.10.127:3030/jh_story/parse?userInput=${target.value}`)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            const storyName = document.querySelector('#storyTitle').innerText
                            const payload = {
                                parse: data,
                                storyName,
                                indexNum
                            }
                            // ????????????API??????????????????
                            fetch(`http://192.168.10.127:3030/jh_story/userStep/fragments`,{
                                method: 'post',
                                body: JSON.stringify(payload),
                                headers: {
                                    'Content-Type': "application/json",
                                },
                            })
                            .then(response => response.json())
                            .then(info => {
                                if(info.status == 'success'){
                                    // ??????nlu
                                    const payload = {
                                        userParse: data
                                    }
                                    fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu`,{
                                        method: 'post',
                                        body: JSON.stringify(payload),
                                        headers: {
                                            'Content-Type': "application/json",
                                        },
                                    })
                                    .then(response => response.json())
                                    .then(info => {
                                        if(info.status == 'warning'){
                                            const userStoryDiv = target.parentElement.parentElement
                                            var html = `<h2><div class='sa-icon warning'><span></span></div>${info.message}</h2>`;
                                            Method.common.showBox(html, 'message', '')
                                            const payload = {
                                                storyName,
                                                userSays: data.text,
                                                intent: data.intent.name
                                            }
                                            fetch(`http://192.168.10.127:3030/jh_story/userStep/fragments`,{
                                                method: 'delete',
                                                body: JSON.stringify(payload),
                                                headers: {
                                                    'Content-Type': "application/json",
                                                },
                                            })
                                            .then(response => response.json())
                                            .then(info => {
                                                if(info.status == 'success'){
                                                    userStoryDiv.remove()
                                                }
                                            })
                                            .catch(err => console.log(err))
                                            return
                                        }
                                        // ??????domain
                                        const payload = {
                                            userParse: data
                                        }
                                        fetch(`http://192.168.10.127:3030/jh_story/userStep/domain`,{
                                            method: 'post',
                                            body: JSON.stringify(payload),
                                            headers: {
                                                'Content-Type': "application/json",
                                            }
                                        })
                                        .catch(err => console.log(err))

                                        target.value = `${target.value}`;
                                        target.setAttribute('data-status', 'waiting')
                                        target.setAttribute('disabled', '');
                                        target.setAttribute('style', 'cursor: pointer;')
                                        Method.story.showNluSpan(data, allStorySpan, indexNum)
                                        // ???stepIndex??????intentSpan???????????????????????????????????????????????????intentSpan????????????
                                        allStorySpan[indexNum].children[1].firstElementChild.dataset.stepindex = indexNum
                                    })
                                    .catch(err => console.log(err))
                                }else{
                                    var html = `<h2><div class='sa-icon ${info.status}'><span></span></div>${info.message}</h2>`;
                                    Method.common.showBox(html, 'message', '')
                                    return
                                }
                            })
                            .catch(err => console.log(err))
                        })
                        .catch(err => console.log(err))
                    }
                })

                // userInput????????????
                input.addEventListener('blur', e => {
                    const target = e.target;

                    // ????????????????????????????????????
                    let indexNum = 0
                    const allStorySpan = document.querySelectorAll('#storySpan')
                    for(i = 0; i < allStorySpan.length; i++){
                        if(allStorySpan[i].children[0].dataset.status == 'typing'){
                            indexNum = i
                        }
                    }

                    const regex = /\'|\`|\"|\[|\]|\{|\}|\(|\)/g
                    if(regex.test(target.value)){
                        target.value = ''
                        var html = `<h2><div class='sa-icon warning'><span></span></div>???????????????????????????</h2>`;
                        Method.common.showBox(html, 'message', '')
                        return
                    }

                    if(target.dataset.event != 'blur') return
                    if(target.value == ''){
                        target.setAttribute('data-status', 'waiting')
                        target.parentElement.parentElement.remove();
                    }else{
                        if(document.querySelector('#storyTitle').innerText == '???????????????'){
                            target.setAttribute('data-status', 'waiting')
                            target.value = ''
                            var html = "<h2><div class='sa-icon warning'><span></span></div>????????????????????????</h2>";
                            Method.common.showBox(html, 'message', '')
                            return
                        }
                        // ????????????API ??????????????????rasa??????????????????????????????????????????
                        fetch(`http://192.168.10.127:3030/jh_story/parse?userInput=${target.value}`)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            const storyName = document.querySelector('#storyTitle').innerText
                            const payload = {
                                parse: data,
                                storyName,
                                indexNum
                            }
                            // ????????????API??????????????????
                            fetch(`http://192.168.10.127:3030/jh_story/userStep/fragments`,{
                                method: 'post',
                                body: JSON.stringify(payload),
                                headers: {
                                    'Content-Type': "application/json",
                                },
                            })
                            .then(response => response.json())
                            .then(info => {
                                if(info.status == 'success'){
                                    // ??????nlu
                                    const payload = {
                                        userParse: data
                                    }
                                    fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu`,{
                                        method: 'post',
                                        body: JSON.stringify(payload),
                                        headers: {
                                            'Content-Type': "application/json",
                                        },
                                    })
                                    .then(response => response.json())
                                    .then(info => {
                                        if(info.status == 'warning'){
                                            const userStoryDiv = target.parentElement.parentElement
                                            var html = `<h2><div class='sa-icon warning'><span></span></div>${info.message}</h2>`;
                                            Method.common.showBox(html, 'message', '')
                                            const payload = {
                                                storyName,
                                                userSays: data.text,
                                                intent: data.intent.name
                                            }
                                            fetch(`http://192.168.10.127:3030/jh_story/userStep/fragments`,{
                                                method: 'delete',
                                                body: JSON.stringify(payload),
                                                headers: {
                                                    'Content-Type': "application/json",
                                                },
                                            })
                                            .then(response => response.json())
                                            .then(info => {
                                                if(info.status == 'success'){
                                                    userStoryDiv.remove()
                                                }
                                            })
                                            .catch(err => console.log(err))
                                            return
                                        }
                                        // ??????domain
                                        const payload = {
                                            userParse: data
                                        }
                                        fetch(`http://192.168.10.127:3030/jh_story/userStep/domain`,{
                                            method: 'post',
                                            body: JSON.stringify(payload),
                                            headers: {
                                                'Content-Type': "application/json",
                                            }
                                        })
                                        .catch(err => console.log(err))

                                        target.value = `${target.value}`;
                                        target.setAttribute('data-status', 'waiting')
                                        target.setAttribute('disabled', '');
                                        target.setAttribute('style', 'cursor: pointer;')
                                        Method.story.showNluSpan(data, allStorySpan, indexNum)
                                        // ???stepIndex??????intentSpan???????????????????????????????????????????????????intentSpan????????????
                                        allStorySpan[indexNum].children[1].firstElementChild.dataset.stepindex = indexNum
                                    })
                                    .catch(err => console.log(err))
                                }else{
                                    var html = `<h2><div class='sa-icon ${info.status}'><span></span></div>${info.message}</h2>`;
                                    Method.common.showBox(html, 'message', '')
                                    return
                                }
                            })
                            .catch(err => console.log(err))
                        })
                        .catch(err => console.log(err))
                    }
                })
        },
        simpleInputEvent: (input) => {
            // userInput????????????
            input.addEventListener('focus', e => {
                const target = e.target
                target.setAttribute('data-event', 'blur')
                target.setAttribute('data-status', 'typing')
            })

            // userInput????????????
            input.addEventListener('keydown', e => {
                const target = e.target;

                if(!target.value || target.value.trim() == '') return

                if(e.keyCode == 13){
                    // ????????????????????????????????????
                    let indexNum = 0
                    const allStorySpan = document.querySelectorAll('#storySpan')
                    for(i = 0; i < allStorySpan.length; i++){
                        if(allStorySpan[i].children[0].dataset.status == 'typing'){
                            indexNum = i
                        }
                    }

                    target.setAttribute('data-event', 'keydown')
                    if(document.querySelector('#storyTitle').innerText == '???????????????'){
                        target.setAttribute('data-status', 'waiting')
                        target.value = ''
                        var html = "<h2><div class='sa-icon warning'><span></span></div>????????????????????????</h2>";
                        Method.common.showBox(html, 'message', '')
                        return
                    }

                    const regex = /\'|\`|\"|\[|\]|\{|\}|\(|\)/g
                    if(regex.test(target.value)){
                        target.value = ''
                        var html = `<h2><div class='sa-icon warning'><span></span></div>???????????????????????????</h2>`;
                        Method.common.showBox(html, 'message', '')
                        return
                    }

                    // ????????????API ??????????????????rasa??????????????????????????????????????????
                    fetch(`http://192.168.10.127:3030/jh_story/parse?userInput=${target.value}`)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        const storyName = document.querySelector('#storyTitle').innerText
                        const payload = {
                            parse: data,
                            storyName,
                            indexNum
                        }
                        // ????????????API??????????????????
                        fetch(`http://192.168.10.127:3030/jh_simple_story/userStep/fragments`,{
                            method: 'post',
                            body: JSON.stringify(payload),
                            headers: {
                                'Content-Type': "application/json",
                            },
                        })
                        .then(response => response.json())
                        .then(info => {
                            if(info.status == 'success'){
                                // ??????nlu
                                const payload = {
                                    userParse: data
                                }
                                fetch(`http://192.168.10.127:3030/jh_simple_story/userStep/nlu`,{
                                    method: 'post',
                                    body: JSON.stringify(payload),
                                    headers: {
                                        'Content-Type': "application/json",
                                    },
                                })
                                .then(response => response.json())
                                .then(info => {
                                    if(info.status == 'warning'){
                                        const userStoryDiv = target.parentElement.parentElement
                                        var html = `<h2><div class='sa-icon warning'><span></span></div>${info.message}</h2>`;
                                        Method.common.showBox(html, 'message', '')
                                        const payload = {
                                            storyName,
                                            userSays: data.text,
                                            intent: data.text
                                        }
                                        fetch(`http://192.168.10.127:3030/jh_simple_story/userStep/fragments`,{
                                            method: 'delete',
                                            body: JSON.stringify(payload),
                                            headers: {
                                                'Content-Type': "application/json",
                                            },
                                        })
                                        .then(response => response.json())
                                        .then(info => {
                                            if(info.status == 'success'){
                                                userStoryDiv.remove()
                                            }
                                        })
                                        .catch(err => console.log(err))
                                        return
                                    }
                                    // ??????domain
                                    const payload = {
                                        userParse: data
                                    }
                                    fetch(`http://192.168.10.127:3030/jh_simple_story/userStep/domain`,{
                                        method: 'post',
                                        body: JSON.stringify(payload),
                                        headers: {
                                            'Content-Type': "application/json",
                                        }
                                    })
                                    .catch(err => console.log(err))

                                    target.value = `${target.value}`;
                                    target.setAttribute('data-status', 'waiting')
                                    target.setAttribute('disabled', '');
                                    target.setAttribute('style', 'cursor: pointer;')
                                    // Method.story.showNluSpan(data, allStorySpan, indexNum)
                                    // ???stepIndex??????intentSpan???????????????????????????????????????????????????intentSpan????????????
                                    // allStorySpan[indexNum].children[1].firstElementChild.dataset.stepindex = indexNum
                                })
                                .catch(err => console.log(err))
                            }else{

                            }
                        })
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                }
            })

            // userInput????????????
            input.addEventListener('blur', e => {
                const target = e.target;

                // ????????????????????????????????????
                let indexNum = 0
                const allStorySpan = document.querySelectorAll('#storySpan')
                for(i = 0; i < allStorySpan.length; i++){
                    if(allStorySpan[i].children[0].dataset.status == 'typing'){
                        indexNum = i
                    }
                }

                const regex = /\'|\`|\"|\[|\]|\{|\}|\(|\)/g
                if(regex.test(target.value)){
                    target.value = ''
                    var html = `<h2><div class='sa-icon warning'><span></span></div>???????????????????????????</h2>`;
                    Method.common.showBox(html, 'message', '')
                    return
                }

                if(target.dataset.event != 'blur') return
                if(target.value == ''){
                    target.setAttribute('data-status', 'waiting')
                    target.parentElement.parentElement.remove();
                }else{
                    if(document.querySelector('#storyTitle').innerText == '???????????????'){
                        target.setAttribute('data-status', 'waiting')
                        target.value = ''
                        var html = "<h2><div class='sa-icon warning'><span></span></div>????????????????????????</h2>";
                        Method.common.showBox(html, 'message', '')
                        return
                    }
                    // ????????????API ??????????????????rasa??????????????????????????????????????????
                    fetch(`http://192.168.10.127:3030/jh_story/parse?userInput=${target.value}`)
                    .then(response => {
                        return response.json();
                    })
                    .then(data => {
                        const storyName = document.querySelector('#storyTitle').innerText
                        const payload = {
                            parse: data,
                            storyName,
                            indexNum
                        }
                        // ????????????API??????????????????
                        fetch(`http://192.168.10.127:3030/jh_simple_story/userStep/fragments`,{
                            method: 'post',
                            body: JSON.stringify(payload),
                            headers: {
                                'Content-Type': "application/json",
                            },
                        })
                        .then(response => response.json())
                        .then(info => {
                            if(info.status == 'success'){
                                // ??????nlu
                                const payload = {
                                    userParse: data
                                }
                                fetch(`http://192.168.10.127:3030/jh_simple_story/userStep/nlu`,{
                                    method: 'post',
                                    body: JSON.stringify(payload),
                                    headers: {
                                        'Content-Type': "application/json",
                                    },
                                })
                                .then(response => response.json())
                                .then(info => {
                                    if(info.status == 'warning'){
                                        const userStoryDiv = target.parentElement.parentElement
                                        var html = `<h2><div class='sa-icon warning'><span></span></div>${info.message}</h2>`;
                                        Method.common.showBox(html, 'message', '')
                                        const payload = {
                                            storyName,
                                            userSays: data.text,
                                            intent: data.text
                                        }
                                        fetch(`http://192.168.10.127:3030/jh_simple_story/userStep/fragments`,{
                                            method: 'delete',
                                            body: JSON.stringify(payload),
                                            headers: {
                                                'Content-Type': "application/json",
                                            },
                                        })
                                        .then(response => response.json())
                                        .then(info => {
                                            if(info.status == 'success'){
                                                userStoryDiv.remove()
                                            }
                                        })
                                        .catch(err => console.log(err))
                                        return
                                    }
                                    // ??????domain
                                    const payload = {
                                        userParse: data
                                    }
                                    fetch(`http://192.168.10.127:3030/jh_simple_story/userStep/domain`,{
                                        method: 'post',
                                        body: JSON.stringify(payload),
                                        headers: {
                                            'Content-Type': "application/json",
                                        }
                                    })
                                    .catch(err => console.log(err))

                                    target.value = `${target.value}`;
                                    target.setAttribute('data-status', 'waiting')
                                    target.setAttribute('disabled', '');
                                    target.setAttribute('style', 'cursor: pointer;')
                                    // Method.story.showNluSpan(data, allStorySpan, indexNum)
                                    // ???stepIndex??????intentSpan???????????????????????????????????????????????????intentSpan????????????
                                    // allStorySpan[indexNum].children[1].firstElementChild.dataset.stepindex = indexNum
                                })
                                .catch(err => console.log(err))
                            }
                        })
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                }
            })
        },
        simpleInputClickEvent: (storySpan) => {
            // storySpan????????????
            // ??????userInput??????disabled???????????????????????????????????????????????????????????????storySpan???
            // ?????????????????????
            storySpan.addEventListener('click', e => {
                const target = e.target

                // ????????????????????????????????????
                if(target.matches('#userInput') && target.getAttribute('disabled') == ''){
                    
                    const userText = target.value.trim()
                    const intent = target.value.trim()
                    getTextExam(userText, intent)
                }

                // ?????????????????????????????????????????????function
                function getTextExam(userText, intent){
                    // ??????API - ??????????????????????????????
                    fetch(`http://192.168.10.127:3030/jh_simple_story/userStep/nlu/getTextExams?text=${userText}&intent=${intent}`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        localStorage.setItem('textExamData', JSON.stringify(data))
                        // ??????????????????????????????
                        let examsTitleHtml = ''
                        data.forEach(item => {
                            if(item.text == userText && item.intent == intent){
                                // if(item.entities.length){
                                    examsTitleHtml = Method.story.createTextHtml(item, userText)
                                // }
                            }
                        })


                        let html = `
                        <div class="userBoxTitle">
                            <span class="userTextTitle" id="userTextTitle">${examsTitleHtml.text}</span>
                        </div>
                        <div class="userTextExam" style="width:800px;">
                            <input type="text" class="form-control" name="userExamInput" id="userExamInput" placeholder="????????????..." autocomplete="off">
                            <div id="textExams-panel">
                        `

                        const filterData = data.filter(item => item.text !== userText)
                        html = Method.story.createTextsFunc(filterData, html, examsTitleHtml)

                        html += `
                            </div>
                            <div class="textExams--footer">
                                <div id="errorMessageBox"></div>
                                <button id="sendExam" type="button" class="btn btn-info">??????</button>
                            </div>
                        </div>
                        `

                        Method.common.showBox(html,"userTextBox");

                        // ????????????????????????????????????
                        const userExamInput = document.querySelector('#userExamInput')
                        // ????????????????????????????????????
                        userExamInput.addEventListener('focus', e => {
                            const target = e.target
                            target.setAttribute('data-event', 'blur')
                        })

                        // ????????????????????????????????????
                        userExamInput.addEventListener('keydown', e => {
                            const target = e.target
                            const exampleTitle = Method.story.sliceText(document.querySelector('#userTextTitle').innerText)
                            const examText = target.value
                            
                            localStorage.setItem('exampleTitle', exampleTitle)
                            if(e.keyCode == 13){
                                if(!examText) return
                                const regex = /\'|\`|\"|\[|\]|\{|\}|\(|\)/g
                                if(regex.test(examText)){
                                    target.value = ''
                                    var html = `<h2><div class='sa-icon warning'><span></span></div>???????????????????????????</h2>`;
                                    Method.common.showBox(html, 'message', '')
                                    return
                                }
                                target.setAttribute('data-event', 'keydown')
                                fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu/checkRepeat?userInput=${examText}`)
                                .then(res => res.json())
                                .then(info => {
                                    if(info.status !== 'success'){
                                        target.value = ''
                                        var html = `<h2><div class='sa-icon warning'><span></span></div>${info.message}</h2>`;
                                        Method.common.showBox(html, 'message', '')
                                        return
                                    }
                                    // ????????????API - ???????????????????????????????????????????????????
                                    fetch(`http://192.168.10.127:3030/jh_story/parse?userInput=${examText}`)
                                    .then(response => response.json())
                                    .then(inputParse => {
                                        // ????????????????????????????????????object
                                        const newExam = {
                                            text: inputParse.text,
                                            intent,
                                            entities: inputParse.entities
                                        }
                                        // ??????????????????
                                        const textExamData = JSON.parse(localStorage.getItem('textExamData'))
                                        const repeatExam = textExamData.filter(item => item.text == newExam.text)
                                        if(repeatExam.length){
                                            target.value = ''
                                            var html = `<h2><div class='sa-icon warning'><span></span></div>????????????</h2>`;
                                            Method.common.showBox(html, 'message', '')
                                            return
                                        }
                                        textExamData.push(newExam)
                                        localStorage.setItem('textExamData', JSON.stringify(textExamData))
                                        const exampleTitle = localStorage.getItem('exampleTitle')
                                        const newData = textExamData.filter(item => item.text !== exampleTitle)
                                        return newData
                                    })
                                    .then(newData => {
                                        let newExamHtml = ''
                                        newExamHtml = Method.story.createTextsFunc(newData, newExamHtml, examsTitleHtml)
                                        document.querySelector('#textExams-panel').innerHTML = newExamHtml
                                        // Method.story.checkAllExampleIntent(newData)
                                        Method.story.eventFunc(newData, examsTitleHtml)
                                        userExamInput.value = ''
                                    })
                                    .catch(err => console.log(err))
                                })
                                .catch(err => console.log(err))
                            }
                        })

                        // ??????????????? ??????????????????
                        const sendExamBtn = document.querySelector('#sendExam')
                        sendExamBtn.addEventListener('click', e => {
                            const target = e.target
                            const textExamData = localStorage.getItem('textExamData')
                            const payload = {
                                textExamData
                            }
                            fetch('http://192.168.10.127:3030/jh_simple_story/userStep/nlu/addExamples', {
                                method: 'post',
                                body: JSON.stringify(payload),
                                headers: {
                                    'Content-Type': "application/json",
                                }
                            })
                            .then(res => res.json())
                            .then(info => {
                                if(info.status === 'success'){
                                    document.querySelector('#userTextBox').remove()
                                }else{
                                    var html = `<h2><div class='sa-icon ${info.status}'><span></span></div>${info.message}</h2>`;
                                    Method.common.showBox(html, 'message', '')
                                    return
                                }
                            })
                            .catch(err => console.log(err))
                        })

                        Method.story.eventFunc(data, examsTitleHtml)
                    })
                    .catch(err => console.log(err))
                }
            })
        },
        simpleClickRemoveBtnEvent: (removeBtn) => {
            // ????????????????????????
            removeBtn.addEventListener('click', e => {
                // storyName - ???????????????????????????
                const target = e.target;
                const storyName = document.querySelector('#storyTitle').innerText
        
                // userStoryDiv - ??????????????????????????????????????????????????????????????????????????????
                // text - ????????????????????????????????????????????????????????????
                // intent - ???????????????????????????????????????????????????????????????slice()???????????????????????????????????????????????????: ????????????????????????????????????4??????
                if(target.matches('#removeBtn')){
                    const userStoryDiv = target.parentElement.parentElement.parentElement
                    if(target.parentElement.parentElement.previousElementSibling.children[0].id == 'userInput'){
                        if(target.parentElement.parentElement.previousElementSibling.children[0].value){
                            const text = target.parentElement.parentElement.previousElementSibling.children[0].value
                            const intent = text
                            removeUserStep(storyName, text, intent, userStoryDiv)
                        }else{
                            userStoryDiv.remove()
                        }
                    }
                }
        
                if(target.tagName == 'svg'){
                    const userStoryDiv = target.parentElement.parentElement.parentElement.parentElement
                    if(target.parentElement.parentElement.parentElement.previousElementSibling.children[0].id == 'userInput'){
                        if(target.parentElement.parentElement.parentElement.previousElementSibling.children[0].value){
                            const text = target.parentElement.parentElement.parentElement.previousElementSibling.children[0].value
                            const intent = text
                            removeUserStep(storyName, text, intent, userStoryDiv)
                        }else{
                            userStoryDiv.remove()
                        }
                    }
                }
        
                if(target.tagName == 'path'){
                    const userStoryDiv = target.parentElement.parentElement.parentElement.parentElement.parentElement
                    if(target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].id == 'userInput'){
                        if(target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].value){
                            const text = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0].value
                            const intent = text
                            intent = intent.slice(4, intent.length)
                            removeUserStep(storyName, text, intent, userStoryDiv)
                        }else{
                            userStoryDiv.remove()
                        }
                    }
                }
        
                // ??????????????????function
                function removeUserStep(storyName, userSays, intent, userStoryDiv){
                    const payload = {
                        storyName,
                        userSays,
                        intent
                    }
                    fetch(`http://192.168.10.127:3030/jh_story/userStep/fragments`,{
                        method: 'delete',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': "application/json",
                        },
                    })
                    .then(response => response.json())
                    .then(info => {
                        if(info.status == 'success'){
                            userStoryDiv.remove()
                        }
                    })
                    .catch(err => console.log(err))
        
                    fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu/example`,{
                        method: 'delete',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': "application/json",
                        },
                    })
                    .catch(err => console.log(err))
                }
            })
        }
    },
    // ?????????????????????function
    botStep: {
        // ???????????????????????????
        allBotStepEvent: (removeBtn, bottomRightDiv, resNameInput, textArea) => {
            Method.story.botStep.removeBtnClickEvent(removeBtn)
            Method.story.botStep.resNameDivMouseEvent(bottomRightDiv)
            Method.story.botStep.resNameInputEvent(resNameInput)
            Method.story.botStep.resNameRandom(resNameInput)
            Method.story.botStep.resTextAreaEvent(textArea)
        },
        // ?????????????????????????????????
        removeBtnClickEvent: (removeBtn) => {
            // ????????????????????????
            removeBtn.addEventListener('click', e => {
                const target = e.target;
                const storyName = document.querySelector('#storyTitle').innerText
                let resCode
                let botStoryDiv
                let response
    
    
                if(target.matches('#removeBtn')){
                    botStoryDiv =target.parentElement.parentElement.parentElement
                    resCode = target.parentElement.parentElement.nextElementSibling.children[0].children[0].children[0].value
                    response = target.parentElement.parentElement.previousElementSibling.firstElementChild.value
                }
    
                if(target.tagName == 'svg'){
                    botStoryDiv = target.parentElement.parentElement.parentElement.parentElement
                    resCode = target.parentElement.parentElement.parentElement.nextElementSibling.children[0].children[0].children[0].value
                    response = target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.value
                }
    
                if(target.tagName == 'path'){
                    botStoryDiv = target.parentElement.parentElement.parentElement.parentElement.parentElement
                    resCode = target.parentElement.parentElement.parentElement.parentElement.nextElementSibling.children[0].children[0].children[0].value
                    response = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.value
                }
    
                if(!response){
                    botStoryDiv.remove()
                    return
                }
    
                const payload = {
                    storyName,
                    resCode
                }
                // ????????????API ?????????????????????????????????????????????
                fetch('http://192.168.10.127:3030/jh_story/botStep/fragments', {
                    method: 'delete',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': "application/json",
                    }
                })
                .then(res => res.json())
                .then(info => {
                    if(info.status === 'success'){
                        const payload = {
                            resCode
                        }
                        // ????????????API ?????????domain???????????????????????????
                        fetch('http://192.168.10.127:3030/jh_story/botStep/domain', {
                            method: 'delete',
                            body: JSON.stringify(payload),
                            headers: {
                                'Content-Type': "application/json",
                            }
                        })
                        .then(res => res.json())
                        .then(info => {
                            if(info.status === 'success'){
                                botStoryDiv.remove()
                            }
                        })
                        .catch(err => console.log(err))
                    }
                })
                .catch(err => console.log(err))
            })
        },
        // ?????????????????????????????????(?????????????????????????????????????????????)
        resNameDivMouseEvent: (bottomRightDiv) => {
            // ??????????????????
            bottomRightDiv.addEventListener('mousemove', e => {
                const target = e.target;
                if(target.matches('#res-name-input')){
                    target.style.border = '1px solid #ccc';
                }
            })
    
            // ??????????????????
            bottomRightDiv.addEventListener('mouseleave', e => {
                const target = e.target;
                // ???????????????foucs?????????????????????
                if(target.dataset.isfocus == 'false'){
                    target.children[0].children[0].children[0].style.border = 'none';
                }
            })
        },
        // ????????????????????????????????????
        resNameInputEvent: (resNameInput) => {
            // ?????????????????????
            resNameInput.addEventListener('focus', e => {
                const target = e.target;
                target.parentElement.parentElement.parentElement.dataset.isfocus = 'true';
            })
    
            // ?????????????????????
            resNameInput.addEventListener('blur', e => {
                const target = e.target;
                target.parentElement.parentElement.parentElement.dataset.isfocus = 'false';
                if(bottomRightDiv.dataset.ismouseleave == 'true'){
                    target.parentElement.parentElement.parentElement.style.visibility = 'hidden';
                }else{
                    target.style.border = 'none';
                }
                
            })

            // ?????????enter??????
            resNameInput.addEventListener('keyup', e => {
                const target = e.target
                if(e.keyCode === 13){
                    console.log(target.value)
                }
            })
        },
        // ?????????????????????????????????
        resNameRandom: (resNameInput) => {
            fetch(`http://192.168.10.127:3030/jh_story/domain/getResponses`)
            .then(res => res.json())
            .then(responses => {
                
                let resCode = Method.story.randomBotResName()

                const responsesKeyArr = []

                for(let key in responses){
                    responsesKeyArr.push(key)
                }

                while(responsesKeyArr.indexOf(resCode) > -1){
                    resCode = Method.story.randomBotResName()
                }

                resNameInput.value = resCode
            })
            .catch(err => console.log(err))
        },
        // ??????????????????????????????
        resTextAreaEvent: (textArea) => {
            // ????????????????????????????????????
            textArea.addEventListener('focus', e => {
                const target = e.target
                if(!target.readOnly){
                    target.setAttribute('data-event', 'blur')
                    target.setAttribute('data-status', 'typing')
                }
            })

            // ???????????????????????????????????? - ?????????????????????
            textArea.addEventListener('input', e => {
                textArea.style.height = '100px';
                textArea.style.height = e.target.scrollHeight + 'px';
            })

            /* ????????????????????????enter ??????
            // textArea.addEventListener('keyup', e => {
            //     const target = e.target
            //     if(e.keyCode === 13){

            //         if(!target.value) return

            //         // ??????????????????
            //         let indexNum = 0
            //         const allStorySpan = document.querySelectorAll('#storySpan')
            //         for(i = 0; i < allStorySpan.length; i++){
            //             if(allStorySpan[i].childNodes[0].dataset.status == 'typing'){
            //                 indexNum = i
            //             }
            //         }

            //         // ?????????????????????????????????
            //         target.setAttribute('data-event', 'keydown')
            //         if(document.querySelector('#storyTitle').innerText == '???????????????'){
            //             target.setAttribute('data-status', 'waiting')
            //             target.value = ''
            //             var html = "<h2><div class='sa-icon warning'><span></span></div>????????????????????????</h2>";
            //             Method.common.showBox(html, 'message', '')
            //             return
            //         }

            //         // ?????????????????????????????????
            //         const storyName = document.querySelector('#storyTitle').innerText
            //         const resCode = target.parentElement.parentElement.lastChild.children[0].children[0].children[0].value

            //         // ??????API ?????????????????? fragments
            //         const payload = {
            //             storyName,
            //             resCode,
            //             indexNum
            //         }
            //         fetch(`http://192.168.10.127:3030/jh_story/botStep/fragments`,{
            //             method: 'post',
            //             body: JSON.stringify(payload),
            //             headers: {
            //                 'Content-Type': "application/json",
            //             },
            //         })
            //         .then(response => response.json())
            //         .then(info => {
            //             if(info.status === 'success'){
            //                 // ??????API ????????????????????? domain
            //                 const payload = {
            //                     resCode,
            //                     botReply: target.value
            //                 }
            //                 fetch(`http://192.168.10.127:3030/jh_story/botStep/domain`, {
            //                     method: 'post',
            //                     body: JSON.stringify(payload),
            //                     headers: {
            //                         'Content-Type': "application/json",
            //                     },
            //                 })
            //                 .then(res => res.json())
            //                 .then(info => {
            //                     if(info.status === 'success'){
            //                         target.setAttribute('data-status', 'waiting')
            //                         target.setAttribute('disabled', '')
            //                     }
            //                 })
            //                 .catch(err => console.log(err))
            //             }
            //         })
            //         .catch(err => console.log(err))
            //     }
            // })
        */

            // ?????????????????????????????? ??????
            textArea.addEventListener('blur', e => {
                const target = e.target;

                // ????????????????????????????????????
                let indexNum = 0
                const allStorySpan = document.querySelectorAll('#storySpan')
                for(i = 0; i < allStorySpan.length; i++){
                    if(allStorySpan[i].children[0].dataset.status == 'typing'){
                        indexNum = i
                    }
                }

                const regex = /\'|\`|\"|\[|\]|\{|\}|\(|\)/g
                if(regex.test(target.value)){
                    target.value = ''
                    var html = `<h2><div class='sa-icon warning'><span></span></div>?????????????????????????????????</h2>`;
                    Method.common.showBox(html, 'message', '')
                    return
                }

                if(target.dataset.event != 'blur') return
                if(target.value == ''){
                    target.setAttribute('data-status', 'waiting')
                    target.parentElement.parentElement.remove();
                }else{
                    if(document.querySelector('#storyTitle').innerText == '???????????????'){
                        target.setAttribute('data-status', 'waiting')
                        target.value = ''
                        var html = "<h2><div class='sa-icon warning'><span></span></div>????????????????????????</h2>";
                        Method.common.showBox(html, 'message', '')
                        return
                    }
                    // ?????????????????????????????????
                    const storyName = document.querySelector('#storyTitle').innerText
                    const resCode = target.parentElement.parentElement.lastElementChild.children[0].children[0].children[0].value

                    // ??????resCode???????????????????????????????????????????????????
                    // ????????????resCode????????????????????????????????????????????????????????????????????????????????????resCode
                    fetch(`http://192.168.10.127:3030/jh_story/domain/getResponses`)
                    .then(res => res.json())
                    .then(responses => {
                        // ???responses???key?????????resCode?????????????????????responses???key
                        const responsesKeyArr = []
                        for(let key in responses){
                            responsesKeyArr.push(key)
                        }

                        // ?????????action???????????????
                        // ??????????????????????????????
                        // ???????????????????????????
                        if(responsesKeyArr.indexOf(resCode) > -1){
                            // ??????
                            // ???????????????????????????????????????????????????textarea????????????readO??????readonly??????
                            if(responses[resCode][0].text === target.value){
                                target.setAttribute('data-status', 'waiting')
                                target.readOnly = true
                                return
                            }

                            // ???????????????????????????????????????
                            // ????????????API ?????????????????????????????????
                            const payload = {
                                resCode,
                                botReply: target.value
                            }
                            fetch(`http://192.168.10.127:3030/jh_story/botStep/domain`, {
                                method: 'put',
                                body: JSON.stringify(payload),
                                headers: {
                                    'Content-Type': "application/json",
                                }
                            })
                            .then(res => res.json())
                            .then(info => {
                                if(info.status === 'success'){
                                    target.setAttribute('data-status', 'waiting')
                                    target.readOnly = true
                                }else{
                                    var html = `<h2><div class='sa-icon ${info.status}'><span></span></div>${info.message}</h2>`;
                                    Method.common.showBox(html, 'message', '')
                                    return
                                }
                            })
                            .catch(err => console.log(err))
                        }else{
                            // ??????
                            // ??????API ?????????????????? fragments
                            const payload = {
                                storyName,
                                resCode,
                                indexNum
                            }
                            fetch(`http://192.168.10.127:3030/jh_story/botStep/fragments`,{
                                method: 'post',
                                body: JSON.stringify(payload),
                                headers: {
                                    'Content-Type': "application/json",
                                },
                            })
                            .then(response => response.json())
                            .then(info => {
                                if(info.status === 'success'){
                                    // ??????API ????????????????????? domain
                                    const payload = {
                                        resCode,
                                        botReply: target.value
                                    }
                                    fetch(`http://192.168.10.127:3030/jh_story/botStep/domain`, {
                                        method: 'post',
                                        body: JSON.stringify(payload),
                                        headers: {
                                            'Content-Type': "application/json",
                                        },
                                    })
                                    .then(res => res.json())
                                    .then(info => {
                                        if(info.status === 'success'){
                                            target.setAttribute('data-status', 'waiting')
                                            target.readOnly = true
                                        }else{
                                            const payload = {
                                                storyName,
                                                resCode
                                            }
                                            fetch('http://192.168.10.127:3030/jh_story/botStep/fragments', {
                                                method: 'delete',
                                                body: JSON.stringify(payload),
                                                headers: {
                                                    'Content-Type': "application/json",
                                                },
                                            })
                                            .then(res => res.json())
                                            .then(() => {
                                                var html = `<h2><div class='sa-icon ${info.status}'><span></span></div>${info.message}</h2>`;
                                                Method.common.showBox(html, 'message', '')
                                                return
                                            })
                                        }
                                    })
                                    .catch(err => console.log(err))
                                }
                            })
                            .catch(err => console.log(err))
                        }
                    })
                }
            })

            // ????????????????????????????????????(??????readonly)
            textArea.addEventListener('click', e => {
                const target = e.target
                if(target.readOnly && target.dataset.status === 'waiting'){
                    target.readOnly = false
                }
            })
        }
    },
    // ??????????????????????????????
    showBorder: (stories, btnDiv, userBtn, botBtn) => {
        // ????????????
        stories.addEventListener('mousemove', e => {
            btnDiv.style.opacity = '1';
            btnDiv.style.transition = 'opacity .1s ease-in-out';

            if(document.querySelectorAll('#storyDiv').length){
                const allStoryDiv = document.querySelectorAll('#storyDiv');
                const allTopRightDiv = document.querySelectorAll('.top-right');
                const allBottomRightDiv = document.querySelectorAll('.bottom-right');
                const allResNameInput = document.querySelectorAll('#res-name-input');
                const allIntentBtn = document.querySelectorAll('#intentBtn');

                // ????????????????????????????????????
                Array.from(allStoryDiv).map(storyDiv => storyDiv.style.border = '1px solid #ccc');

                // ?????????????????????????????????????????????(???????????????????????????)
                Array.from(allTopRightDiv).map(topRightDiv => topRightDiv.style.visibility = 'visible');

                // ?????????????????????????????????
                Array.from(allBottomRightDiv).map(bottomRightDiv => {
                    bottomRightDiv.style.visibility = 'visible';
                    bottomRightDiv.setAttribute('data-ismouseleave', 'false');
                })

                // ????????????????????????
                Array.from(allIntentBtn).map(intentBtn => {
                    const attrSpan = intentBtn.parentElement.parentElement.previousElementSibling.lastElementChild
                    const hasIntent = []

                    // ??????????????????????????????????????????????????????
                    // ??????????????????????????????
                    if(attrSpan.children.length){
                        hasIntent.push(attrSpan.children[0])
                    }

                    if(hasIntent.length){
                        intentBtn.style.visibility = 'hidden'
                    }else{
                        intentBtn.style.visibility = 'visible'
                    }
                })
            }

            // ???????????????????????????
            if(stories.children.length > 1){
                if(stories.lastElementChild.previousElementSibling.className == 'userStep'){
                    if(document.querySelector('#userBtn')){
                        userBtn.style.display = 'none';
                        botBtn.style.marginLeft = '0';
                    }
                }else{
                    userBtn.style.display = 'inline-block';
                    botBtn.style.marginLeft = '12px';
                }
            }else{
                userBtn.style.display = 'inline-block';
                botBtn.style.marginLeft = '12px';
            }
        })

        // ????????????
        stories.addEventListener('mouseleave', e => {
            btnDiv.style.opacity = '0';
            btnDiv.style.transition = 'opacity .1s ease-in-out';

            if(document.querySelectorAll('#storyDiv').length){
                const allStoryDiv = document.querySelectorAll('#storyDiv');
                const allTopRightDiv = document.querySelectorAll('.top-right');
                const allBottomRightDiv = document.querySelectorAll('.bottom-right');
                const allResNameInput = document.querySelectorAll('#res-name-input');
                const allIntentBtn = document.querySelectorAll('#intentBtn')

                // ??????????????????????????????
                Array.from(allStoryDiv).map(storyDiv => storyDiv.style.border = '1px solid transparent')

                // ?????????????????????????????????????????????(???????????????????????????)
                Array.from(allTopRightDiv).map(topRightDiv => topRightDiv.style.visibility = 'hidden')

                // ????????????????????????
                Array.from(allIntentBtn).map(intentBtn => intentBtn.style.visibility = 'hidden')
                
                // ?????????????????????????????????
                if(allBottomRightDiv.length){
                    Array.from(allBottomRightDiv).map(bottomRightDiv => {
                        bottomRightDiv.setAttribute('data-ismouseleave', 'true');
                        if(bottomRightDiv.dataset.isfocus == 'false'){
                            bottomRightDiv.style.visibility = 'hidden';
                        }
                    })
                }
            }
        })
    },
    // ?????????????????????????????????????????????
    clickStoryRemoveBtnEvent: (storyRemoveBtn) => {
        storyRemoveBtn.addEventListener('click', e => {
            const target = e.target
            const storyName = target.dataset.storyname
            const payload = {
                storyName
            }
            fetch(`http://192.168.10.127:3030/jh_story/fragments`,{
                method: 'delete',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': "application/json",
                },
            })
            .then(res => res.json())
            .then(info => {
                if(info.status === 'success'){
                    // ???????????????????????????
                    document.querySelector('#stories').innerHTML = ``

                    // ???stories?????????????????????
                    const storyArr = []
                    info.data.stories.map(item => storyArr.push(item.story))

                    // ???????????????????????????
                    let html = `
                        <option value="" selected>?????????</option>
                    `

                    storyArr.map(story => {
                        html += `
                            <option value="${story}" selected>${story}</option>
                        `
                    })

                    // ??????select?????????
                    document.querySelector('#storyFilter').innerHTML = html
                }
            })
            .catch(err => console.log(err))
        })
    },
    // ?????????????????????
    clickUserBtn: () => {
        const stories = document.querySelector('#stories');
        const storyDiv = document.createElement('div');
        storyDiv.setAttribute('id', 'storyDiv');
        storyDiv.setAttribute('class', 'userStep');
        storyDiv.setAttribute('style', 'border: 1px solid transparent;border-radius: 5px')

        const storySpan = document.createElement('span');
        storySpan.setAttribute('id', 'storySpan');
        const attrSpan = document.createElement('span')
        attrSpan.setAttribute('id', 'attrSpan')

        const input = document.createElement('input');
        input.setAttribute('placeholder', '????????????....');
        input.setAttribute('name', 'userInput');
        input.setAttribute('id', 'userInput');
        input.setAttribute('class', 'form-control story-user');
        input.setAttribute('data-event', 'blur')
        input.setAttribute('data-status', 'waiting')
        input.setAttribute('autocomplete', 'off')

        const removeBtn = document.createElement('button');
        removeBtn.setAttribute('type', 'button');
        removeBtn.setAttribute('id', 'removeBtn');
        removeBtn.setAttribute('class', 'btn btn-danger');
        removeBtn.setAttribute('style', 'margin-left: 5px;');

        const removeIcon = document.createElement('i');
        removeIcon.setAttribute('class', 'fas fa-trash-alt');
        removeIcon.setAttribute('style', 'font-size: 7px;');
        removeBtn.appendChild(removeIcon);

        

        const btnSpan = document.createElement('span');

        if(document.querySelector('.jh_story') || document.querySelector('.jh_new_story')){
            const intentBtn = document.createElement('button');
            intentBtn.setAttribute('type', 'button');
            intentBtn.setAttribute('id', 'intentBtn');
            intentBtn.setAttribute('class', 'btn btn-warning');

            const intentIcon = document.createElement('i');
            intentIcon.setAttribute('class', 'fas fa-tag');
            intentIcon.setAttribute('style', 'font-size: 7px;');
            intentBtn.appendChild(intentIcon);

            btnSpan.appendChild(intentBtn);
        }
        btnSpan.appendChild(removeBtn);

        const topRightDiv = document.createElement('div');
        topRightDiv.setAttribute('class', 'top-right');
        topRightDiv.setAttribute('style', 'max-width: 100px;position: absolute;top: 9px;right: 9px;visibility: hidden;');
        topRightDiv.appendChild(btnSpan);

        storySpan.appendChild(input);
        storySpan.appendChild(attrSpan)
        storyDiv.appendChild(storySpan);
        storyDiv.appendChild(topRightDiv);
        stories.insertBefore(storyDiv, stories.lastElementChild);

        if(document.querySelector('.jh_story') || document.querySelector('.jh_new_story')){
            Method.story.userStep.allUserStepEvent(removeBtn, intentBtn, storySpan, input)
        }else{
            Method.story.userStep.allUserStepEvent(removeBtn, null, storySpan, input)
        }
    },
    // ?????????????????????
    clickBotBtn: () => {
        const stories = document.querySelector('#stories');
        const storyDiv = document.createElement('div');
        storyDiv.setAttribute('id', 'storyDiv');
        storyDiv.setAttribute('class', 'botRes');
        storyDiv.setAttribute('style', 'margin-left: 20%;border: 1px solid transparent;border-radius: 5px')

        const storySpan = document.createElement('span');
        storySpan.setAttribute('id', 'storySpan');

        const textArea = document.createElement('textArea');
        textArea.setAttribute('placeholder', '???????????????....');
        textArea.setAttribute('name', 'botInput');
        textArea.setAttribute('id', 'botInput');
        textArea.setAttribute('class', 'form-control story-bot');
        textArea.setAttribute('data-status', 'waiting')

        const removeBtn = document.createElement('button');
        removeBtn.setAttribute('type', 'button');
        removeBtn.setAttribute('id', 'removeBtn');
        removeBtn.setAttribute('class', 'btn btn-danger');

        const removeIcon = document.createElement('i');
        removeIcon.setAttribute('class', 'fas fa-trash-alt');
        removeIcon.setAttribute('style', 'font-size: 7px;')
        removeBtn.appendChild(removeIcon);

        const btnSpan = document.createElement('span');
        btnSpan.appendChild(removeBtn);

        const topRightDiv = document.createElement('div');
        topRightDiv.setAttribute('class', 'top-right');
        topRightDiv.setAttribute('style', 'max-width: 100px;position: absolute;top: 9px;right: 9px;visibility: hidden;');
        topRightDiv.appendChild(btnSpan);

        const resName = document.createElement('div');
        resName.setAttribute('class', 'res-name');
        resName.setAttribute('style', 'display: flex;');

        const resNameInputDiv = document.createElement('div');
        resNameInputDiv.setAttribute('class', 'res-name-input-div');
        
        const resNameInput = document.createElement('input');
        resNameInput.setAttribute('id', 'res-name-input');
        resNameInputDiv.appendChild(resNameInput);
        resName.appendChild(resNameInputDiv);

        const bottomRightDiv = document.createElement('div');
        bottomRightDiv.setAttribute('class', 'bottom-right');
        bottomRightDiv.setAttribute('data-isFocus', 'false');
        bottomRightDiv.setAttribute('style', 'position: absolute;right: 9px;bottom: 9px;visibility: hidden;');
        bottomRightDiv.appendChild(resName);

        storySpan.appendChild(textArea);
        storyDiv.appendChild(storySpan);
        storyDiv.appendChild(topRightDiv);
        storyDiv.appendChild(bottomRightDiv);
        stories.insertBefore(storyDiv, stories.lastElementChild);

        Method.story.botStep.allBotStepEvent(removeBtn, bottomRightDiv, resNameInput, textArea)
    },
    // ??????????????????
    clickIntentBtn: (storyContainer, targetInput, allStorySpan, indexNum) => {
        if(document.querySelector('#storyTitle').innerText == '???????????????'){
            var html = "<h2><div class='sa-icon warning'><span></span></div>????????????????????????</h2>";
            Method.common.showBox(html, 'message', '')
            return
        }
        const prop = prompt(`???????????????`, '');
        if(prop != '' && prop != null){
            const storyName = document.querySelector('#storyTitle').innerText
            const payload = {
                intent: prop,
                storyName,
                indexNum
            }
            // ????????????API ??????????????????
            fetch(`http://192.168.10.127:3030/jh_story/userStep/fragments/onlyIntent`, {
                method: 'post',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': "application/json",
                },
            })
            .then(response => response.json())
            .then(info => {
                if(info.status == 'success'){
                    const userParse = {
                        intent:{
                            name: prop
                        },
                        entities: []
                    }
    
                    const payload = {
                        userParse
                    }
                    // ????????????API ??????????????????
                    fetch(`http://192.168.10.127:3030/jh_story/userStep/domain`, {
                        method: 'post',
                        body: JSON.stringify(payload),
                        headers: {
                            'Content-Type': "application/json",
                        },
                    })
                    .then(res => res.json())
                    .then(info => {
                        if(info.status == 'success'){
                            Method.story.showIntent(prop, allStorySpan, indexNum)
                            storyContainer.children[0].setAttribute('data-status', 'waiting')
                            targetInput.nextElementSibling.children[0].classList.toggle('mt-10')
                            targetInput.remove()
                        }
                    })
                    .catch(err => console.log(err))
                }else{
                    const html = "<h2><div class='sa-icon error'><span></span></div>????????????</h2>";
                    Method.common.showBox(html, 'message', '');
                }
            })
            .catch(err => console.log(err))
        }else{
            if(prop != null){
                const html = "<h2><div class='sa-icon warning'><span></span></div>?????????????????????</h2>";
                Method.common.showBox(html, 'message', '');
            }
        }
    },
    // ??????????????????????????????
    randomBotResName: () => {
        const lower = 'abcdefghijklmnopqrstuvwxyz'
        const upper = lower.toUpperCase()
        const num = '1234567890'
        const randomText = lower + upper + num
        let text = 'utter_'
        for(i = 0; i < 9; i++){
            text += randomText[Math.floor(Math.random() * randomText.length)]
        }
        return text
    },
    // ?????????????????????????????????
    showNluSpan: (data, allStorySpan, indexNum) => {
        let intentName = ''
        if(data.intent.name){
            intentName = data.intent.name
        }else{
            intentName = data.intent
        }
        Method.story.showIntent(intentName, allStorySpan, indexNum)
    
        data.entities.map(item => {
            const entitiesSpan = document.createElement('span')
            entitiesSpan.setAttribute('id', 'entities-span')
            entitiesSpan.setAttribute('class', 'nluSpan mt-10')
    
            const entityIcon = document.createElement('i');
            entityIcon.setAttribute('class', 'fas fa-key');
            entityIcon.setAttribute('style', 'font-size: 9px;');
    
            const entityText = document.createElement('span')
            entityText.setAttribute('id', 'entity-text')
            entityText.setAttribute('class', 'nluText')
    
            const keyWord = data.text.slice(item.start, item.end)
    
            entityText.innerHTML = `?????????: <span id="entity">${keyWord}</span>, ??????: <span id="entity--code">${item.entity}</span>, ?????????: <span id="entity--value">${item.value}</span>`
            entitiesSpan.appendChild(entityIcon)
            entitiesSpan.appendChild(entityText)
            allStorySpan[indexNum].children[1].appendChild(entitiesSpan)
        })
    },
    // ?????????????????????
    showIntent: (intentName, allStorySpan, indexNum) => {
        const intentSpan = document.createElement('span')
        intentSpan.setAttribute('id', 'intent-span')
        intentSpan.setAttribute('class', 'nluSpan mt-10')

        const intentIcon = document.createElement('i');
        intentIcon.setAttribute('class', 'fas fa-tag');
        intentIcon.setAttribute('style', 'font-size: 7px;');

        const intentText = document.createElement('span')
        intentText.setAttribute('id', 'intent-text')
        intentText.setAttribute('class', 'nluText')
        intentText.innerText = `??????: ${intentName}`

        intentSpan.appendChild(intentIcon)
        intentSpan.appendChild(intentText)
        allStorySpan[indexNum].children[1].appendChild(intentSpan)
        // ??????????????????
        Method.story.clickIntentSpanEvent(intentSpan, indexNum)
    },
    // ??????????????????
    clickIntentSpanEvent: (intentSpan, indexNum) => {
        // ??????????????????
        intentSpan.addEventListener('click', e => {
            const target = e.target
            let examText = ``
            let intent = ``
            let stepIndex = indexNum

            // ??????????????????????????????
            if(target.matches('#intent-span')){
                examText = target.parentElement.previousElementSibling.value
                intent = target.lastElementChild.innerText.slice(4, target.lastElementChild.innerText.length)
                if(!stepIndex && stepIndex !== 0){
                    stepIndex = target.dataset.stepindex
                }
            }else if(target.matches('#intent-text') || target.tagName == 'svg'){
                examText = target.parentElement.parentElement.previousElementSibling.value
                intent = target.innerText.slice(4, target.innerText.length)
                if(!stepIndex && stepIndex !== 0){
                    stepIndex = target.parentElement.dataset.stepindex
                }
                if(target.tagName == 'svg'){
                    intent = target.nextElementSibling.innerText.slice(4, target.nextElementSibling.innerText.length)
                }
            }else{
                examText = target.parentElement.parentElement.parentElement.previousElementSibling.value
                intent = target.parentElement.nextElementSibling.innerText.slice(4, target.parentElement.nextElementSibling.innerText.length)
                if(!stepIndex && stepIndex !== 0){
                    stepIndex = target.parentElement.parentElement.dataset.stepindex
                }
            }

            Method.story.setIntentShowBox(examText, intent, stepIndex, Method.story.showNluSpan)
        })
    },
    // ??????????????????function
    sliceText: (entityText) => {
        entityText = entityText.replace(/\n/g, '')
        while(entityText.indexOf('???') > -1){
            const startNum = entityText.indexOf('???')
            const endNum = entityText.indexOf('???')
            const entityValueText = entityText.slice(startNum, endNum + 1)
            entityText = entityText.replace(entityValueText, '')
        }
        return entityText
    },
    // ???????????????????????????
    checkAllExampleIntent: (data) => {
        console.log(data)
        // ??????????????????
        document.querySelector('#errorMessageBox').innerHTML = ''

        // ????????????????????????????????????
        const currentIntent = document.querySelector('#userTextBox .userBoxTitle #intent-text').innerText

        // ???????????????????????????????????????
        const titleEntityNames = document.querySelectorAll('#userTextBox .content .userBoxTitle .entity-name')
        const titleEntityNamesArray = Array.from(titleEntityNames).map(entity => entity.innerText.trim()) 

        // ????????????
        const checkError = []
        
        // ?????????????????????
        const textExamples = document.querySelectorAll('.textExams--examples')

        data.map((example, index) => {
            if(example.intent !== currentIntent){
                checkError.push('??????????????????')
                textExamples[index].firstElementChild.firstElementChild.classList.toggle('errorIntent')
            }
            
            const exampleEntityArray = example.entities.map(item => item.entity.trim())
            if((exampleEntityArray.length !== titleEntityNamesArray.length) || (JSON.stringify(exampleEntityArray.sort()) !== JSON.stringify(titleEntityNamesArray.sort()))){
                checkError.push('?????????????????????')
                if(!textExamples[index].firstElementChild.firstElementChild.classList.contains('errorIntent')){
                    textExamples[index].firstElementChild.firstElementChild.classList.toggle('errorIntent')
                }
            }
        })

        if(checkError.length){
            checkError.forEach(text => Method.story.createErrorMessage(text))
            document.querySelector('#sendExam').setAttribute('disabled', '')
        }else{
            document.querySelector('#sendExam').removeAttribute('disabled')
        }
    },
    // ??????????????????
    createErrorMessage: (messageText) => {
        const errorMessageBox = document.querySelector('#errorMessageBox')
        const errorMessageSpan = document.createElement('span')
        errorMessageSpan.setAttribute('class', 'errorMessageSpan')
        errorMessageSpan.innerText = messageText
        const allErrorSpan = document.querySelectorAll('.errorMessageSpan')
        if((Array.from(allErrorSpan).map(item => item.innerText).indexOf(messageText) === -1) || allErrorSpan.length === 0){
            errorMessageBox.appendChild(errorMessageSpan)
        }
    },
    // ????????????????????? function
    createTextsFunc: (data, html, examsTitleHtml) => {
        data.forEach(item => {
            // ????????????html function
            const examsTextHtml = Method.story.createTextHtml(item, item.text, examsTitleHtml.titleInfo)
            html += `
            <div class="textExams--examples">
            `

            if(document.querySelector('.jh_story') || document.querySelector('.jh_new_story')){
                html += `
                <span>
                    <span id="intent-span" class="nluSpan">
                        <i class="fas fa-tag" style="font-size: 7px;"></i>
                        <span id="intent-text" class="nluText">${item.intent}</span>
                    </span>
                </span>
                `
            }else{
                // ?????????????????????????????????
                html += `
                <span>
                    <span id="intent-span" class="nluSpan" style="cursor: text;">
                        <i class="fas fa-pencil-alt" style="font-size: 12px"></i>
                    </span>
                </span>
                `
            }
            
            html += `
                <span class="textExams-span">
                    ${examsTextHtml.text}
                </span>
                <span>
                    <span class="textExams--actionBtn">
                        <span class="textExams--actionBtn_group">
                            <button type="button" id="textExams--actionBtn_editBtn"><i class="fas fa-edit"></i></button>
                            <button type="button" id="textExams--actionBtn_trashBtn"><i class="fas fa-trash-alt"></i></button>
                        </span>
                        <button type="button" id="textExams--actionBtn_starBtn"><i class="far fa-star"></i></button>
                    </span>
                </span>
            </div>
            `
        })
        return html
    },
    // ???????????????????????????
    randomRgba: () => {
        let rgba = ''
        for(i = 0; i < 3; i++){
            if(i == 2){
                rgba += `${Math.floor(Math.random() * 256)}`
            }else{
                rgba += `${Math.floor(Math.random() * 256)}, `
            }
        }
        return rgba
    },
    // ????????????????????????
    entityTextColor: (rgba) => {
        const rgbaCode = rgba.trim().split(',')
        let textColor = ''
        const maxNum = rgbaCode.filter(code => code >= 128)
        if(maxNum.length){
            for(i = 0; i < rgbaCode.length; i++){
                if((rgbaCode[i] - 50) < 0){
                    rgbaCode[i] = 0
                }else{
                    rgbaCode[i] = rgbaCode[i] - 50
                }
            }
        }else{
            for(i = 0; i < rgbaCode.length; i++){
                if((rgbaCode[i] + 50) > 255){
                    rgbaCode[i] = 255
                }else{
                    rgbaCode[i] = rgbaCode[i] + 50
                }
            }
        }

        for(i = 0; i < rgbaCode.length; i++){
            if(i == (rgbaCode.length - 1)){
                textColor += `${rgbaCode[i]}`
            }else{
                textColor += `${rgbaCode[i]}, `
            }
        }
        
        return textColor
    },
    // ??????????????????
    // ??????title?????????????????????titleInfo
    // ?????????????????????????????????titleInfo??????????????????????????????title??????
    createTextHtml: (item, userText, titleInfo) => {
        /*
        currentUserText: ??????????????????html??????
        textTmp: ??????????????????
        testText: ???????????????????????????????????????????????????????????????
        bkgColor: ??????????????????
        textColor: ?????????????????????????????????
        colorObj: ???????????????????????????????????????????????????????????????????????????????????????
        */ 
        let currentUserText = '<div class="waiting" id="textExams-div">' 
        let textTmp = '' 
        let testText ='' 
        let bkgColor = ''
        let textColor = ''
        let colorObj = {}
        
        // ???entities????????????entity.start??????????????????
        // ?????????????????????????????????????????????
        item.entities.sort((a, b) => a.start - b.start)

        item.entities.forEach(entityEle => {
            // ??????????????????????????????
            if(entityEle.start > 0 && currentUserText == '<div id="textExams-div">'){
                textTmp = userText.slice(0, entityEle.start)
                currentUserText += `
                    <span>${textTmp}</span>
                `
                testText = textTmp
            }

            // ?????????????????????????????????????????????
            if((entityEle.start - testText.length) > 0){
                textTmp = userText.slice(testText.length, entityEle.start)
                currentUserText += `
                    <span>${textTmp}</span>
                `
                testText += textTmp
            }

            textTmp = userText.slice(entityEle.start, entityEle.end)
            testText += textTmp

            // ??????
            if(!titleInfo){
                // ????????????????????????????????????
                if(Object.keys(colorObj).indexOf(entityEle.entity) > -1){
                    // ????????????????????????????????????????????????????????????????????????
                    bkgColor = colorObj[entityEle.entity].bkgColor
                    textColor = colorObj[entityEle.entity].textColor
                }else{
                    // ???????????????????????????????????????
                    bkgColor = Method.story.randomRgba()
                    textColor = Method.story.entityTextColor(bkgColor)
                    colorObj[entityEle.entity] = {bkgColor, textColor}
                }
                
                currentUserText += `
                    <span>
                        <div class="entity-label" style="background: rgba(${bkgColor}, 0.5);">
                            <span class="entity-name" style="display:none;">
                                ${entityEle.entity}
                            </span>
                            <div>
                                <span id="entity-text">
                                    ${textTmp}
                `

                if(textTmp != entityEle.value){
                    currentUserText += `
                    <span class="value-synonym" id="entity-value" style="color: rgb(${textColor});font-weight: bold;">???"${entityEle.value}"???</span>
                    `
                }

                currentUserText += `
                        </span>
                    </div>
                `
            }else{
                // ??????
                /***************** ??????????????????????????? ******************/

                if(Object.keys(titleInfo).indexOf(entityEle.entity) > -1){
                    // ????????????????????????????????????????????????????????????????????????
                    bkgColor = titleInfo[entityEle.entity].bkgColor
                    textColor = titleInfo[entityEle.entity].textColor
                }else{
                    // ???????????????????????????????????????
                    bkgColor = Method.story.randomRgba()
                    textColor = Method.story.entityTextColor(bkgColor)
                    colorObj[entityEle.entity] = {bkgColor, textColor}
                }
                /***************** ??????????????????????????? ******************/

                currentUserText += `
                    <span>
                        <div class="examples-entity-label" style="background: rgba(${bkgColor}, 0.5);">
                            <div>
                `

                if(textTmp != entityEle.value){
                    currentUserText += `
                    <span id="examples-entity-text" data-entityname="${entityEle.entity}">
                        ${textTmp}
                        <span class="value-synonym" id="examples-entity-value" style="color: rgb(${textColor});font-weight: bold;">???"${entityEle.value}"???</span>
                    `
                }else{
                    currentUserText += `
                    <span id="examples-entity-text" class="entity-no-value"  data-entityname="${entityEle.entity}">
                        ${textTmp}
                    `
                }

                currentUserText += `
                    </span>
                </div>
                <span class="examples-entity-box entity-info" data-status="hidden">
                    <span class="examples-entity-title entity-info">???????????????</span>
                    <div>
                        <label for="entity-code-input" class="entity-info">??????</label>
                        <p id="entity-code-input" class="form-control entity-info">${entityEle.entity}</p>
                    </div>
                `

                if(textTmp != entityEle.value){
                    currentUserText += `
                            <div>
                                <label for="entity-value-input" class="entity-info">?????????</label>
                                <p id="entity-code-input" class="form-control entity-info">${entityEle.value}</p>
                            </div>
                    `
                }

                /*************************** ???????????????????????????html(????????????????????????) ***************************/  
                // currentUserText += `
                //     </span>
                // </div>
                // <span class="examples-entity-box entity-info" data-status="hidden">
                //     <span class="examples-entity-title entity-info">?????????????????????</span>
                //     <div>
                //         <label for="entity-code-input" class="entity-info">??????</label>
                //         <input id="entity-code-input" type="text" class="form-control entity-info" value="${entityEle.entity}">
                //         <button type="button" id="entity-code-removeBtn" class="btn btn-danger entity-info"><i class="fas fa-trash-alt"></i></button>
                //     </div>
                // `

                // if(textTmp != entityEle.value){
                //     currentUserText += `
                //             <div>
                //                 <label for="entity-value-input" class="entity-info">?????????</label>
                //                 <input id="entity-value-input" type="text" class="form-control entity-info" value="${entityEle.value}">
                //                 <button type="button" id="entity-value-removeBtn" class="btn btn-danger entity-info"><i class="fas fa-trash-alt"></i></button>
                //             </div>
                //     `
                // }else{
                //     currentUserText += `
                //             <div class="entity-option-btns entity-info">
                //                 <button type="button" id="entity-value-addBtn" class="btn btn-info entity-info"><i class="fas fa-plus" style="margin-right: 5px;"></i>?????????</button>
                //             </div>
                //     `
                // }
            }

            currentUserText += `
                    </div>
                </span>
            `
        })

        // ???????????????????????????????????????????????????
        if(userText.length - testText.length > 0){
            textTmp = userText.slice(testText.length, userText.length)
            currentUserText += `
                <span>${textTmp}</span>
            `
            testText += textTmp
        }
        
        currentUserText += `</div>`

        if(titleInfo){
            currentUserText += `<input class="waiting" type="text" name="entityTextInput" id="entityTextInput" style="width: 100%;" autocomplete="off">`
        }
        
        return {text: currentUserText, titleInfo: colorObj}
    },
    // ????????????????????????function
    eventFunc: (data, examsTitleHtml) => {
        // ?????????title???????????? - ?????????????????????
        const allEntityLabels = document.querySelectorAll('.entity-label')
        allEntityLabels.forEach(entityLabel => {
            entityLabel.addEventListener('mouseenter', e => {
                const target = e.target
                target.children[0].setAttribute('style', 'position: absolute;bottom: -90%; left:0;background-color: #fff;')
            })

            entityLabel.addEventListener('mouseleave', e => {
                const target = e.target
                target.children[0].setAttribute('style', 'display: none;')
            })
        })
        
        // ???????????????????????????
        const allTextExams = document.querySelectorAll('.textExams--examples')
        allTextExams.forEach(element => {
            // ??????????????????
            element.addEventListener('mouseenter', e => {
                const target = e.target
                target.children[2].children[0].setAttribute('style', 'visibility:visible')
            })

            // ??????????????????
            element.addEventListener('mouseleave', e => {
                const target = e.target
                target.children[2].children[0].setAttribute('style', 'visibility:hidden')
                if(target.lastElementChild.lastElementChild.lastElementChild.children[0].classList.value.includes('fa fa-star') && 
                target.lastElementChild.lastElementChild.lastElementChild.children[0].dataset.prefix == 'fas'){
                    target.lastElementChild.lastElementChild.lastElementChild.setAttribute('style', 'visibility:visible')
                }
            })
        })

        if(document.querySelector('#examples-entity-text') || document.querySelector('#examples-entity-value')){
            const exampleEntityTexts = document.querySelectorAll('#examples-entity-text')
            exampleEntityTexts.forEach(exampleEntityText => {
                exampleEntityText.addEventListener('click', e => {
                    const target = e.target

                    /*
                    examplesEntityLabel => ??????entityBox?????????dom??????
                    entityBox => ????????????entityBox???dom??????
                    entityBoxIndex => ????????????entityBox dom???????????????entityBox dom?????????index
                    currentEntityBox => ??????entityBoxIndex?????????entityBox dom????????????????????????entityBox dom??????(????????????????????????)
                    closeShowBox => showBox???????????????????????????????????????????????????entityBox???data-status??????hidden?????????entityBox???????????????dom????????????
                    */
                    let examplesEntityLabel
                    let entityBox
                    if(target.matches('#examples-entity-text')){
                        examplesEntityLabel = target.parentElement.parentElement
                        entityBox = target.parentElement.nextElementSibling
                    }else if(target.matches('#examples-entity-value')){
                        examplesEntityLabel = target.parentElement.parentElement.parentElement
                        entityBox = target.parentElement.parentElement.nextElementSibling
                    }

                    entityBox.setAttribute('data-status', 'show')
                    const allEntityBox = document.querySelectorAll('.examples-entity-box')
                    let entityBoxIndex
                    for(i = 0; i < allEntityBox.length; i++){
                        if(allEntityBox[i].dataset.status === 'show'){
                            entityBoxIndex = i
                        }
                    }
                    const currentEntityBox = allEntityBox[entityBoxIndex]
                    
                    Method.common.showBox('', 'entityShowBox', '',closeShowBox)
                    document.querySelector('#entityShowBox .content').appendChild(entityBox)

                    function closeShowBox(){
                        currentEntityBox.setAttribute('data-status', 'hidden')
                        examplesEntityLabel.appendChild(currentEntityBox)
                    }
                })
            })
        }

        // ????????????????????????
        if(document.querySelector('.jh_story') || document.querySelector('.jh_new_story')){
            const textExamsExamples = document.querySelectorAll('.textExams--examples')
            textExamsExamples.forEach(textExamsExample => {
                textExamsExample.children[0].addEventListener('click', e => {
                    const target = e.target
                    let intent = ''
                    let examText = ''
                    if(target.matches('#intent-text')){
                        console.log('#intent-text examText: ', target.parentElement.parentElement.nextElementSibling.children[0].innerText)
                        intent = target.innerText
                        examText = Method.story.sliceText(target.parentElement.parentElement.nextElementSibling.children[0].innerText)
                    }

                    if(target.matches('#intent-span')){
                        console.log('#intent-span examText: ', target.parentElement.nextElementSibling.children[0].innerText)
                        intent = target.lastElementChild.innerText
                        examText = Method.story.sliceText(target.parentElement.nextElementSibling.children[0].innerText)
                    }

                    if(target.matches('svg')){
                        console.log('svg examText: ', target.parentElement.parentElement.nextElementSibling.children[0].innerText)
                        intent = target.nextElementSibling.innerText
                        examText = Method.story.sliceText(target.parentElement.parentElement.nextElementSibling.children[0].innerText)
                    }

                    if(target.matches('path')){
                        console.log('path examText: ', target.parentElement.parentElement.parentElement.nextElementSibling.children[0].innerText)
                        intent = target.parentElement.nextElementSibling.innerText
                        examText = Method.story.sliceText(target.parentElement.parentElement.parentElement.nextElementSibling.children[0].innerText)
                    }
                    console.log('intent: ', intent)
                    console.log('examText: ', examText)
                    const examTempData = JSON.parse(localStorage.getItem('textExamData'))
                    Method.story.setIntentShowBox(examText, intent, null, null, examTempData, examsTitleHtml)
                })
            })
        }

        // ?????????????????????????????????
        const starBtns = document.querySelectorAll('#textExams--actionBtn_starBtn')
        starBtns.forEach(startBtn => {
            startBtn.addEventListener('click', e => {
                const target = e.target
                if(target.matches('#textExams--actionBtn_starBtn')){
                    // ????????????????????????
                    clickStarBtn(target.children[0], target, starBtns)
                }

                if(target.tagName == 'svg'){
                    clickStarBtn(target, target.parentElement, starBtns)
                }

                if(target.tagName == 'path'){
                    clickStarBtn(target.parentElement, target.parentElement.parentElement, starBtns)
                }

                // ????????????????????????function
                function clickStarBtn(targetIcon, target, starBtns){
                    if(targetIcon.classList.value.includes('fa fa-star') && targetIcon.dataset.prefix == 'far'){
                        // ????????????????????????????????????
                        starBtns.forEach(item => {
                            if(item.children[0].classList.value.includes('fa fa-star') && item.children[0].dataset.prefix == 'fas'){
                                item.innerHTML = `<i class="far fa-star"></i>`
                                item.previousElementSibling.setAttribute('style', 'display:inline-block')
                                item.removeAttribute('style')
                            }
                        })
                        target.innerHTML = `<i class="fas fa-star"></i>`
                        target.previousElementSibling.setAttribute('style', 'display:none')
                    }else{
                        target.innerHTML = `<i class="far fa-star"></i>`
                        target.previousElementSibling.setAttribute('style', 'display:inline-block')
                        target.removeAttribute('style')
                    }
                }
            })
        })

        // ?????????????????????????????????
        const editBtns = document.querySelectorAll('#textExams--actionBtn_editBtn')
        editBtns.forEach(editBtn => {
            // ????????????????????????
            editBtn.addEventListener('click', e => {
                const target = e.target

                // ???????????????????????????????????????
                // ???????????????????????????????????????????????????????????????
                for(i = 0; i < editBtns.length; i++){
                    if(editBtns[i].getAttribute('disabled') === ''){
                        editBtns[i].parentElement.parentElement.parentElement.previousElementSibling.children[1].setAttribute('class', 'waiting')
                        editBtns[i].parentElement.parentElement.parentElement.previousElementSibling.children[0].setAttribute('class', 'waiting')
                        editBtns[i].removeAttribute('disabled')
                    }
                }

                if(target.matches('#textExams--actionBtn_editBtn')){
                    const targetElement = target.parentElement.parentElement.parentElement.previousElementSibling.children[0]
                    const targetInput = target.parentElement.parentElement.parentElement.previousElementSibling.children[1]
                    target.setAttribute('disabled', '')
                    clickEditBtn(targetElement, targetInput)
                }

                if(target.tagName == 'svg'){
                    const targetElement = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0]
                    const targetInput = target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[1]
                    target.parentElement.setAttribute('disabled', '')
                    clickEditBtn(targetElement, targetInput)
                }

                if(target.tagName == 'path'){
                    const targetElement = target.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[0]
                    const targetInput = target.parentElement.parentElement.parentElement.parentElement.parentElement.previousElementSibling.children[1]
                    target.parentElement.parentElement.setAttribute('disabled', '')
                    clickEditBtn(targetElement, targetInput)
                }

                // ??????????????????function
                function clickEditBtn(targetElement, targetInput){
                    let entityText = targetElement.innerText
                    const exampleTitle = Method.story.sliceText(document.querySelector('#userTextTitle').innerText)
                    entityText = Method.story.sliceText(entityText)
                    targetElement.setAttribute('class', 'editing')
                    targetInput.setAttribute('class', 'editing')
                    targetInput.value = entityText
                    targetInput.select()
                    localStorage.setItem('editExamText', entityText)
                    localStorage.setItem('exampleTitle', exampleTitle)

                    // ???????????????enter??????
                    const allEntityTextInput = document.querySelectorAll('#entityTextInput')
                    allEntityTextInput.forEach(entityTextInput => {
                        entityTextInput.addEventListener('keyup', e => {
                            const target = e.target
                            if(e.keyCode == 13){
                                target.setAttribute('class', 'waiting')
                                target.previousElementSibling.setAttribute('class', 'waiting')
                                target.parentElement.nextElementSibling.children[0].children[0].children[0].removeAttribute('disabled')
                                let arrayNum
                                // ??????????????????????????????????????????????????????
                                if(target.value === entityText || target.value === '') return

                                const textExamData = JSON.parse(localStorage.getItem('textExamData'))

                                // ????????????????????????????????????????????????
                                for(let i = 0; i < textExamData.length; i++){
                                    if(textExamData[i].text === target.value){
                                        var html = "<h2><div class='sa-icon warning'><span></span></div>????????????</h2>";
                                        Method.common.showBox(html, 'message', '')
                                        return
                                    }
                                }

                                const editingExamText = localStorage.getItem('editExamText')

                                for(i = 0; i < data.length; i++){
                                    if(textExamData[i].text == editingExamText){
                                        arrayNum = i
                                    }
                                }

                                fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu/checkRepeat?userInput=${target.value}`)
                                .then(res => res.json())
                                .then(info => {
                                    if(info.status !== 'success'){
                                        var html = `<h2><div class='sa-icon warning'><span></span></div>${info.message}</h2>`;
                                        Method.common.showBox(html, 'message', '')
                                        return
                                    }
                                    fetch(`http://192.168.10.127:3030/jh_story/parse?userInput=${target.value}`)
                                    .then(response => response.json())
                                    .then(textParse => {
                                        const newExamText = {
                                            text: textParse.text,
                                            intent: textParse.intent.name,
                                            entities: textParse.entities
                                        }
                                        textExamData.splice(arrayNum, 1, newExamText)
                                        const exampleTitle = localStorage.getItem('exampleTitle')
                                        const newData = textExamData.filter(item => item.text !== exampleTitle)
                                        localStorage.setItem('textExamData', JSON.stringify(newData))
                                        return newData
                                    })
                                    .then(newData => {
                                        let newExamHtml = ''
                                        newExamHtml = Method.story.createTextsFunc(newData, newExamHtml, examsTitleHtml)
                                        document.querySelector('#textExams-panel').innerHTML = newExamHtml
                                        Method.story.checkAllExampleIntent(newData)
                                        Method.story.eventFunc(newData, examsTitleHtml)
                                    })
                                    .catch(err => console.log(err))
                                })
                            }
                        })
                    })
                }
            })
        })

        // ??????????????? ????????????????????????
        const removeBtns = document.querySelectorAll('#textExams--actionBtn_trashBtn')
        removeBtns.forEach(removeBtn => {
            removeBtn.addEventListener('click', e => {
                const target = e.currentTarget
                const examText = Method.story.sliceText(target.parentElement.parentElement.parentElement.previousElementSibling.innerText)

                const exampleTitle = Method.story.sliceText(document.querySelector('#userTextBox .content .userTextTitle').innerText)

                const textExamData = JSON.parse(localStorage.getItem('textExamData'))
                const newData = textExamData.filter(exam => {
                    if(exam.text !== examText){
                        return exam
                    }
                })
                localStorage.setItem('textExamData', JSON.stringify(newData)) // ????????????????????????????????????localStorage???????????????
                const currentData = newData.filter(exam => exam.text !== exampleTitle) // ??????????????????????????????

                let newExamHtml = ''
                newExamHtml = Method.story.createTextsFunc(currentData, newExamHtml, examsTitleHtml)
                document.querySelector('#textExams-panel').innerHTML = newExamHtml
                if(document.querySelector('.jh_story') || document.querySelector('.jh_new_story')){
                    Method.story.checkAllExampleIntent(currentData)
                }
                Method.story.eventFunc(currentData, examsTitleHtml)
            })
        })
    },
    // ?????????????????????
    setIntentShowBox: (examText, intent, indexNum, showNluSpan, examTempData, examsTitleHtml) => {
        let intentHtml = ``
        let entitiesHtml = ``
        // ????????????API??????????????????
        fetch(`http://192.168.10.127:3030/jh_story/userStep/domain/getAllIntents`)
        .then(response => response.json())
        .then(intents => {
            // ???????????????????????????????????????
            let intentArray = [...intents]
            let defaultIntent = ''
            intentHtml = createIntentList(intentArray, intent)
            
            function createIntentList(intentArray, intent){
                let intentHtml = ''

                // ??????????????????????????????????????????
                for(i = 0; i < intentArray.length; i++){
                    if(intentArray[i] == intent){
                        defaultIntent = intentArray[i]
                        intentArray.splice(0, 0 , intentArray[i])
                        intentArray.splice(i + 1, 1)
                    }
                }

                // ??????????????????
                for(i = 0; i < intentArray.length; i++){
                    if(intentArray[i] == intent){
                        intentHtml += `
                            <span class="setExamInfo--intents_item selected">
                                ${intentArray[i]}
                            </span>
                        `
                    }else{
                        intentHtml += `
                            <span class="setExamInfo--intents_item">
                                ${intentArray[i]}
                            </span>
                        `
                    }
                }

                // ????????????????????????????????????
                intentHtml += `
                    <span class="setExamInfo--intents_item create-intent">
                        ???????????????
                    </span>

                    <span class="setExamInfo--intents_item cancel">
                        ??????
                    </span>
                `
                return intentHtml
            }

            fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu/setEntity/getTextExam?examText=${examText}`)
            .then(response => response.json())
            .then(targetNlu => {
                // tempNlu????????????targetNlu?????????tempNlu?????????????????????targetNlu?????????????????????????????????????????????
                let tempNlu = ''
                if(!examTempData){
                    tempNlu = JSON.parse(JSON.stringify(targetNlu[0]))
                    localStorage.setItem('tempNlu', JSON.stringify(tempNlu))
                    entitiesHtml = createEntitiesHtml(tempNlu, examText)
                }else{
                    tempNlu = examTempData.filter(examData => examData.text === examText)
                    localStorage.setItem('tempNlu', JSON.stringify(tempNlu[0]))
                    entitiesHtml = createEntitiesHtml(tempNlu[0], examText)
                }

                // ?????????html?????? function
                function createEntitiesHtml(data, examText){
                    let entitiesHtmlLoop = ''
                    if(data.entities.length){
                        for(i = 0; i < data.entities.length; i++){
                            const keyWord = examText.slice(data.entities[i].start, data.entities[i].end) 
                            if(data.entities[i].value == keyWord){
                                entitiesHtmlLoop += `
                                    <div class="entity--container">
                                        <span class="entity--text">
                                            ????????????<span id="entity">${keyWord}</span>, 
                                            ?????????<span id="entity--code">${data.entities[i].entity}</span>
                                        </span>
                                        <button type="button" class="btn-danger entity--remove_btn"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                `
                            }else{
                                entitiesHtmlLoop += `
                                    <div class="entity--container">
                                        <span class="entity--text">
                                            ?????????: <span id="entity">${keyWord}</span>, 
                                            ??????: <span id="entity--code">${data.entities[i].entity}</span>, 
                                            ?????????: <span id="entity--value">${data.entities[i].value}</span>
                                        </span>
                                        <button type="button" class="btn-danger entity--remove_btn"><i class="fas fa-trash-alt"></i></button>
                                    </div>
                                `
                            }
                        }
                    }else{
                        entitiesHtmlLoop = ''
                    }
                    return entitiesHtmlLoop
                }
                
                let html = ``

                html += `
                    <div>
                        <h1>????????????????????????</h1>
                        <span class="setExamInfo--content">
                            <input class="setExamInfo--examText form-control" value="${examText}" readonly>
                            <span class="setExamInfo--intents">
                                <input id="intentInput" name="intentInput" type="text" class="form-control" placeholder="??????????????????????????????" value="${defaultIntent}" autocomplete="off" disabled>
                                <span class="setExamInfo--intents_list list--disabled">${intentHtml}</span>
                            </span>
                            <span class="setExamInfo--entities">
                                ${entitiesHtml}
                            </span>
                        </span>
                        <span class="setExamInfo--footer">
                            <button id="saveExamInfo" type="button" class="btn btn-info">??????</button>
                        </span>
                    </div>
                `
                Method.common.showBox(html, "setExamInfo")

                entitiesEvent()

                function entitiesEvent(){
                    // ???????????????????????????
                    // ?????????????????????
                    document.querySelector('#intentInput').addEventListener('focus', e => {
                        const target = e.target
                        target.select()
                        target.nextElementSibling.classList.remove('list--disabled')
                    })

                    // ???????????????????????????
                    // ???????????????disabled???????????????????????????????????????????????????????????????
                    document.querySelector('.setExamInfo--intents').addEventListener('click', e => {
                        const target = e.target
                        if(target.matches('#intentInput') && target.getAttribute('disabled') == ''){
                            target.removeAttribute('disabled')
                            target.focus()
                        }
                    })

                    // ???????????????enter??????
                    document.querySelector('#intentInput').addEventListener('keyup', e => {
                        const target = e.target
                        if(e.keyCode === 13){
                            const intentList = target.nextElementSibling
                            createIntent(target, intentArray, intentList)
                        }
                    })

                    // ????????????????????????
                    document.querySelector('.setExamInfo--intents_list').addEventListener('click', e => {
                        const target = e.target

                        // ??????????????????
                        if(target.matches('.setExamInfo--intents_item')){
                            const intentList = target.parentElement
                            const intentInput =  target.parentElement.previousElementSibling
                            const selectIntent = target.innerText.trim()

                            if(!target.matches('.create-intent') && !target.matches('.cancel')){
                                // ??????????????????
                                intentList.classList.add('list--disabled')
                                
                                // ??????????????????
                                if(!target.matches('.selected')){
                                    const newIntentListHtml = createIntentList(intentArray, selectIntent)
                                    intentList.innerHTML = newIntentListHtml
                                }

                                // ????????????????????????input??????input??????disabled
                                editExamInfo(selectIntent, intentInput)
                            }
                            
                            // ????????????????????????
                            if(target.matches('.cancel')){
                                intentList.classList.add('list--disabled')
                                intentInput.setAttribute('disabled', '')
                            }

                            // ????????????????????????
                            if(target.matches('.create-intent')){
                                createIntent(intentInput, intentArray, intentList)
                            }

                            // ???????????? function
                            function editExamInfo(intent, input){
                                input.value = intent
                                input.setAttribute('disabled', '')
                                const tempNlu = JSON.parse(localStorage.getItem('tempNlu'))
                                tempNlu.intent = intent
                                localStorage.setItem('tempNlu', JSON.stringify(tempNlu))
                            }
                        }
                    })

                    // ??????????????????????????????????????????
                    document.querySelector('#saveExamInfo').addEventListener('click', e => {
                        const target = e.target
                        const intentInput = target.parentElement.previousElementSibling.children[1].children[0]
                        const storyName = document.querySelector('#storyTitle').innerText

                        // ????????????????????????
                        if(!intentInput.value){
                            var warningHtml = "<h2><div class='sa-icon warning'><span></span></div>?????????????????????</h2>";
                            Method.common.showBox(warningHtml, 'message', '')
                            return
                        }

                        // ??????????????????nlu??????
                        const tempNlu = localStorage.getItem('tempNlu')
                        console.log('examTempData:', examTempData)
                        if(!examTempData){
                            const payload = {
                                tempNlu
                            }
                            // ????????????API??????rasa nlu???????????????????????????
                            fetch(`http://192.168.10.127:3030/jh_story/userStep/nlu`, {
                                method: 'put',
                                body: JSON.stringify(payload),
                                headers: {
                                    'Content-Type': "application/json",
                                },
                            })
                            .then(response => response.json())
                            .then(nluStatus => {
                                if(nluStatus.status == 'success'){
                                    // ????????????API??????rasa domain???????????????????????????
                                    fetch(`http://192.168.10.127:3030/jh_story/userStep/domain`, {
                                        method: 'put',
                                        body: JSON.stringify(payload),
                                        headers: {
                                            'Content-Type': "application/json",
                                        },
                                    })
                                    .then(response => response.json())
                                    .then(domainStatus=> {
                                        if(domainStatus.status == 'success'){
                                            // ????????????API??????rasa 
                                            const payload = {
                                                tempNlu,
                                                storyName,
                                                indexNum
                                            }
                                            fetch(`http://192.168.10.127:3030/jh_story/userStep/fragments`,{
                                                method: 'put',
                                                body: JSON.stringify(payload),
                                                headers: {
                                                    'Content-Type': "application/json",
                                                },
                                            })
                                            .then(response => response.json())
                                            .then(data => {
                                                if(data.status == 'success'){
                                                    // ??????????????????
                                                    document.querySelector('#setExamInfo').remove()
                                                    // ??????????????????????????????
                                                    const allStorySpan = document.querySelectorAll('#storySpan')
                                                    allStorySpan[indexNum].children[1].innerHTML = ''
                                                    // ????????????????????????
                                                    showNluSpan(JSON.parse(tempNlu), allStorySpan, indexNum)
                                                }
                                            })
                                            .catch(err => console.log(err))
                                        }
                                    })
                                    .catch(err => console.log(err))
                                }
                            })
                            .catch(err => console.log(err))
                        }else{
                            const examTextTitle = Method.story.sliceText(document.querySelector('#userTextBox .content #userTextTitle').innerText)
                            const textExamPanel = document.querySelector('#userTextBox .content #textExams-panel')
                            examTempData.map(exam => {
                                if(exam.text === examText){
                                    const examIndex = examTempData.indexOf(exam)
                                    examTempData.splice(examIndex, 1, JSON.parse(tempNlu))
                                }
                            })
                            document.querySelector('#setExamInfo').remove()
                            localStorage.setItem('textExamData', JSON.stringify(examTempData))
                            examTempData = examTempData.filter(exam => exam.text !== examTextTitle)
                            let newExamHtml = ''
                            console.log('final examTempData:', examTempData)
                            newExamHtml = Method.story.createTextsFunc(examTempData, newExamHtml, examsTitleHtml)
                            textExamPanel.innerHTML = newExamHtml
                            Method.story.checkAllExampleIntent(examTempData)
                            Method.story.eventFunc(examTempData, examsTitleHtml) 
                        }
                        
                    })
                    // ??????????????? function
                    function createIntent(intentInput, intentArray, intentList){
                        // ????????????
                        if(intentInput.value == ""){
                            var warningHtml = "<h2><div class='sa-icon warning'><span></span></div>??????????????????</h2>";
                            Method.common.showBox(warningHtml, 'message', '')
                            return
                        }

                        function editExamInfo(intent, input){
                            input.value = intent
                            input.setAttribute('disabled', '')
                            const tempNlu = JSON.parse(localStorage.getItem('tempNlu'))
                            tempNlu.intent = intent
                            localStorage.setItem('tempNlu', JSON.stringify(tempNlu))
                        }

                        // ????????????????????????
                        for(i = 0; i < intentArray.length; i++){
                            if(intentInput.value == intentArray[i]){
                                intentList.classList.add('list--disabled')
                                intentInput.setAttribute('disabled', '')
                                editExamInfo(intentArray[i], intentInput)
                                const newIntentListHtml = createIntentList(intentArray, intentArray[i])
                                intentList.innerHTML = newIntentListHtml
                                return
                            }
                        }

                        // ????????????
                        intentList.classList.add('list--disabled')
                        const tempNlu = JSON.parse(localStorage.getItem('tempNlu'))
                        tempNlu.intent = intentInput.value.trim()
                        intentInput.setAttribute('disabled', '')
                        intentArray.push(intentInput.value.trim())
                        localStorage.setItem('tempNlu', JSON.stringify(tempNlu))
                        const newIntentListHtml = createIntentList(intentArray, intentInput.value.trim())
                        intentList.innerHTML = newIntentListHtml
                    }
                    
                    entitiesRemoveBtnEvent()

                    // ?????????????????????????????????
                    function entitiesRemoveBtnEvent(){
                        const allEntityRemoveBtns = document.querySelectorAll('.entity--remove_btn')
                        const tempNlu = JSON.parse(localStorage.getItem('tempNlu'))

                        allEntityRemoveBtns.forEach(removeBtn => {
                            removeBtn.addEventListener('click' , e => {
                                const target = e.target
                                let entityCode = ''
                                // ?????????????????????????????????tempNlu??????entity
                                if(target.matches('.entity--remove_btn')){
                                    const entitySpan = target.parentElement.children[0]
                                    entityCode = entitySpan.children[1].innerText
                                    tempNlu.entities = tempNlu.entities.filter(item => {
                                        if(item.entity != entityCode){
                                            return item
                                        }
                                    })
                                    target.parentElement.remove()
                                }
            
                                if(target.tagName == 'svg'){
                                    const entitySpan = target.parentElement.parentElement.children[0]
                                    entityCode = entitySpan.children[1].innerText
                                    tempNlu.entities = tempNlu.entities.filter(item => {
                                        if(item.entity != entityCode){
                                            return item
                                        }
                                    })
                                    target.parentElement.parentElement.remove()
                                }
            
                                if(target.tagName == 'path'){
                                    const entitySpan = target.parentElement.parentElement.parentElement.children[0]
                                    entityCode = entitySpan.children[1].innerText
                                    tempNlu.entities = tempNlu.entities.filter(item => {
                                        if(item.entity != entityCode){
                                            return item
                                        }
                                    })
                                    target.parentElement.parentElement.parentElement.remove()
                                }

                                localStorage.setItem('tempNlu', JSON.stringify(tempNlu))
                            })
                        })
                    }

                    createEntity()

                    // ?????????????????????function
                    function createEntity(){
                        if(document.querySelector('.setExamInfo--examText')){
                            let m_MouseDown = false
                            const examContent = document.querySelector('.setExamInfo--content')

                            // ?????????????????????
                            examContent.addEventListener('mousedown', e => {
                                const target = e.target
                                if(target.matches('.setExamInfo--examText')){
                                    m_MouseDown = true
                                }
                            })
                
                            // ?????????????????????
                            examContent.addEventListener('mouseup', e => {
                                const target = e.target
                                if(target.matches('.setExamInfo--examText')){
                                    m_MouseDown = false
                                    if(getText().text){
                                        setEntityBox(getText().text, getText().start, getText().end)
                                    }
                                }
                            })
                
                            // ?????????????????????
                            function getText(){
                                const elem = document.querySelector('.setExamInfo--examText')
                                return {text:elem.value.substring(elem.selectionStart, elem.selectionEnd), start: elem.selectionStart, end: elem.selectionEnd}
                            }

                            // ????????????????????????
                            function setEntityBox(getText, start, end){
                                const tempNlu = JSON.parse(localStorage.getItem('tempNlu'))

                                if(tempNlu.entities.length){
                                    // ???????????????????????????
                                    for(i = 0; i < tempNlu.entities.length; i++){
                                        // ???????????????
                                        const keyWord = tempNlu.text.slice(tempNlu.entities[i].start, tempNlu.entities[i].end)
                                        // ?????????????????????????????????????????????array
                                        const keyWordArr = Array.from(keyWord)
                                        const textArr = Array.from(getText)
                                        // ?????????array?????????????????????
                                        for(j = 0; j < keyWordArr.length; j++){
                                            for(k = 0; k < textArr.length; k++){
                                                if(keyWordArr[j] == textArr[k]){
                                                    var warningHtml = "<h2><div class='sa-icon warning'><span></span></div>?????????????????????????????????????????????????????????</h2>";
                                                    Method.common.showBox(warningHtml, 'message', '')
                                                    return
                                                }
                                            }
                                        }
                                    }
                                }

                                const html = `
                                    <h1>???????????????</h1>
                                    <form action="" name="setEntity">
                                        <div>
                                            <label for="entity-code">???${getText}?????????????????????</label>
                                            <input type="text" class="form-control" name="entity-code" id="entity-code" placeholder="?????????????????????????????????????????????">
                                        </div>
                                        <div>
                                            <label for="entity-value">???${getText}????????????????????????</label>
                                            <input type="text" class="form-control" name="entity-value" id="entity-value" placeholder="????????????????????????????????????????????????${getText}??????????????????">
                                        </div>
                                        <div>
                                            <button id="sendEntity" type="button" class="btn btn-info">??????</button>
                                        </div>
                                    </form>
                                `
                                Method.common.showBox(html,"setEntityBox");

                                // ???????????????????????????????????????????????????_
                                document.querySelector('#entity-code').addEventListener('change', e => {
                                    const target = e.target
                                    const regex = /\{|\[|\]|\'|\"\;|\:\?|\\|\/|\.|\,|\>|\<|\=|\+|\-|\(|\)|\!|\@|\#|\$|\%|\^|\&|\*|\`|\~|[\u4E00-\u9FA5]/g
                                    if(regex.test(target.value)){
                                        target.value = ''
                                        var warningHtml = "<h2><div class='sa-icon warning'><span></span></div>?????????????????????????????????????????????_</h2>";
                                        Method.common.showBox(warningHtml, 'message', '')
                                        return
                                    }
                                })

                                // ?????????????????????????????????????????????
                                document.querySelector('#entity-value').addEventListener('change', e => {
                                    const target = e.target
                                    const regex = /\{|\[|\]|\'|\"\;|\:\?|\\|\/|\.|\,|\>|\<|\=|\+|\-|\(|\)|\!|\@|\#|\$|\%|\^|\&|\*|\`|\~/g
                                    if(regex.test(target.value)){
                                        target.value = ''
                                        var warningHtml = "<h2><div class='sa-icon warning'><span></span></div>???????????????????????????????????????</h2>";
                                        Method.common.showBox(warningHtml, 'message', '')
                                        return
                                    }
                                })
                                
                                // ?????????????????????
                                document.querySelector('#sendEntity').addEventListener('click', e => {
                                    const target = e.target
                                    const entityCode = target.parentElement.parentElement.children[0].children[1].value
                                    let entityValue = target.parentElement.parentElement.children[1].children[1].value
                                    if(entityValue == '') {
                                        entityValue = getText
                                    }
                                    const newEntityInfo = {
                                        entity: entityCode,
                                        value: entityValue,
                                        start,
                                        end
                                    }
                                    tempNlu.entities.push(newEntityInfo)
                                    localStorage.setItem('tempNlu', JSON.stringify(tempNlu))
                                    const newEntitiesHtml = createEntitiesHtml(tempNlu, examText)
                                    document.querySelector('#setEntityBox').remove()
                                    document.querySelector('.setExamInfo--entities').innerHTML = newEntitiesHtml
                                    entitiesRemoveBtnEvent()
                                })
                            }
                        }
                    }
                }
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    },
    // ????????????????????????
    editStoryTitle: () => {
        const storyTitleEdit = document.querySelector('#storyTitleEdit')
        storyTitleEdit.addEventListener('click', e => {
            const originalTitle = storyTitle.innerText
            const updateTitle = prompt('?????????????????????', '')

            if(updateTitle == null) return 

            if(updateTitle == ''){
                var html = "<h2><div class='sa-icon warning'><span></span></div>???????????????????????????</h2>";
                Method.common.showBox(html, 'message', '')
                return
            }
            const payload = {
                originalTitle,
                updateTitle
            }
            fetch(`http://192.168.10.127:3030/jh_story/storyTitle`,{
                method: 'put',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': "application/json",
                },
            })
            .then(response => response.json())
            .then(data => {
                if(data.status){
                    var html = "<h2><div class='sa-icon " + data.status + "'><span></span></div>" + data.message + "</h2>";
                    Method.common.showBox(html, 'message', '')
                    return
                }
                storyTitle.innerText = data.updateTitle
                if(document.querySelector('#removeStoryName')){
                    document.querySelector('#removeStoryName').innerText = data.updateTitle
                }
                if(document.querySelector('#storyFilter')){
                    Array.from(document.querySelector('#storyFilter').children).map(item => {
                        if(item.innerText === originalTitle){
                            item.setAttribute('value', data.updateTitle)
                            item.innerText = data.updateTitle
                        }
                    })
                }
            })
            .catch(err => console.log(err))
        })
    },
    // ????????????????????????
    getStoryTitle: () => {
        const titleContainer = document.querySelector('#title-container')
        const storyTitle = document.querySelector('#storyTitle')
        const titleBtn = document.querySelector('#titleBtn')
    
        // ??????????????????
        if(!storyTitle.innerText){
            storyTitle.innerText = '???????????????'
        }
    
        // ????????????????????????storyTitle????????????????????????????????????
        titleContainer.addEventListener('mouseenter', e => {
            if(storyTitle.innerText == '???????????????'){
                storyTitle.setAttribute('contenteditable', 'true')
                storyTitle.setAttribute('data-event', 'blur')
                storyTitle.focus()
            }else{
                // ???????????????????????????????????????????????????????????????
                if(storyTitle.getAttribute('contenteditable') == 'false'){
                    tittleBtn.style.opacity = '1';
                    tittleBtn.style.transition = 'opacity .1s ease-in-out';
                    tittleBtn.children[0].removeAttribute('disabled')
                }
            }
        })
    
        // ????????????????????????
        titleContainer.addEventListener('mouseleave', e => {
            if(storyTitle.innerText != '???????????????' && storyTitle.getAttribute('contenteditable') == 'false'){
                tittleBtn.style.opacity = '0';
                tittleBtn.style.transition = 'opacity .1s ease-in-out';
                tittleBtn.children[0].setAttribute('disabled', '')
            }
        })
    
        // ???storyTitle????????????????????????storyTitle?????????????????????
        storyTitle.addEventListener('focus', e => {
            const target = e.target
            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(target)
            selection.removeAllRanges()
            selection.addRange(range)
        })
    
        // ???storyTitle???????????????
        storyTitle.addEventListener('blur', e => {
            const target = e.target
            storyTitle.setAttribute('contenteditable', 'false')
            if(!storyTitle.innerText || storyTitle.innerText == ''){
                storyTitle.innerText = '???????????????'
            }
            if(storyTitle.dataset.event == 'blur'){
                const payload = {
                    storyTitle: target.innerText
                }
                fetch(`http://192.168.10.127:3030/jh_story/storyTitle`,{
                    method: 'post',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': "application/json",
                    },
                })
                .then(response => {
                    return response.json()
                })
                .then(info => {
                    if(info.status != 'success'){
                        target.setAttribute('contenteditable', 'true')
                        target.innerText = '???????????????'
                        var html = "<h2><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h2>";
                        Method.common.showBox(html, 'message', '')
                    }
                })
                .catch(err => console.log(err))
            }
        })
    
        // ??????????????????????????????enter?????????
        storyTitle.addEventListener('keydown', e => {
            const target = e.target
            if(e.keyCode == 13){
                e.preventDefault()  // ????????????
                e.stopPropagation() // ????????????
                target.setAttribute('data-event', 'keydown')
                target.setAttribute('contenteditable', 'false')
                if(!target.innerText || target.innerText == ''){
                    target.innerText = '???????????????'
                }
                const payload = {
                    storyTitle: target.innerText
                }
                fetch(`http://192.168.10.127:3030/jh_story/storyTitle`,{
                    method: 'post',
                    body: JSON.stringify(payload),
                    headers: {
                        'Content-Type': "application/json",
                    },
                })
                .then(response => {
                    return response.json()
                })
                .then(info => {
                    if(info.status != 'success'){
                        target.setAttribute('contenteditable', 'true')
                        target.innerText = '???????????????'
                        var html = "<h2><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h2>";
                        Method.common.showBox(html, 'message', '')
                    }
                })
                .catch(err => console.log(err))
            }
        })
    }
}

//search
Method.search={};

Method.search.keyWord = function(){

    if(!document.querySelector("#search")){
        return;
    };

    if(document.querySelector("form select[required]")){

        //admin_search
        //cs_function
        //cs_question
        //cs_new_question"

        if(document.querySelector("#categorySelect")){
            categorySelect.onchange = function(){
                Method.search.question();
            };
        };
        
        document.querySelector("[type='submit']").onclick = function(event){

            var data = "";

            var required = document.querySelectorAll("form [required]");

            for(var i=0;i<required.length;i++){
                //??????????????????
                if(required[i].value == ""){
                    return;
                };
            };


            var inputs = document.querySelectorAll("form [name]");
            var symbol;
            for(var i=0;i<inputs.length;i++){
                i == 0 ? symbol = "?" : symbol = "&";
                data += symbol + inputs[i].name + "=" + inputs[i].value;
            };

            event.preventDefault();

            var url = "";

            if(document.querySelector(".admin_search")){
                url += "/admin_search/filter";
            };
            
            if(document.querySelector(".cs_function")){
                url += "/cs_function/filter";
            };

            if(document.querySelector(".cs_question")){
                url += "/cs_question/filter";
            };

            if(document.querySelector(".jh_conversations")){
                url += "/jh_conversations/filter";
            };

            if(document.querySelector(".jh_story")){
                url += "/jh_story/filter";
            };

            if(document.querySelector(".jh_simple_story")){
                url += "/jh_simple_story/filter";
            };

            url += data;

            console.log(url)
            
            Method.common.page(url,"search");

        };

    }else{

        search.onkeyup = function(){

            if(search.value == ""){
                searchCss.innerHTML="";
                document.querySelector("#data-panel").removeAttribute("class");
                return;
            };

            if(document.querySelector("#msg")){
                msg.remove();
            };

            var code =  "{}[]',:?/><=+-()!@#$%^&*`~|\\" + '"';
            var x = [].slice.call(code);
            var y = [].slice.call(search.value);

            for(var i=0;i<y.length;i++){
                if(x.includes(y[i])){
                    search.value = search.value.replace(y[i],"");
                    var html = "<h2><div class='sa-icon warning'><span></span></div>???????????????</h2>";
                    Method.common.showBox(html,"message");
                    return;
                };
            };

            searchCss.innerHTML = "#data-panel > :not([data-search*='" + search.value + "']){display:none;}";

            if(document.querySelector("#data-panel").clientHeight == 50){
                document.querySelector("#data-panel").setAttribute("class","noList");
            }else{
                document.querySelector("#data-panel").removeAttribute("class");
            };
        };
    };
};

Method.search.question = function(){

    function back(info){

        var info = JSON.parse(info.data);

        console.log("info",info);

        if(info.status != "success"){
            var html = "<h2><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h2>";
            Method.common.showBox(html,"message");
            return;
        };

        functionSelect.innerHTML = "";

        for(var i=0;i<info.data.length;i++){
            var option = document.createElement("option");
            option.value = info.data[i].FUNCTION_ID;
            option.innerText = info.data[i].FUNCTION_NAME;
            functionSelect.appendChild(option);
        };

    };

    var url = location.origin + "/cs_question/getData?category_id=" + categorySelect.value;
    Method.common.asyncAjax(url,back);

};


Method.common={}

//loading
Method.common.loading = function(){
    
    var InpBox = document.createElement("div");
    InpBox.setAttribute("id","loading");
    
    var loading = document.createElement("img");
    loading.src = "/images/loading.svg";

    InpBox.appendChild(loading);

    document.body.appendChild(InpBox);
    
};

Method.common.loadingClose = function(){
    document.querySelector("#loading") && document.querySelector("#loading").remove();
};

//showBox
Method.common.showBox = function(INFO,ID,CLOSE,FUN){
    
    /*
    INFO =????????????????????? html
    ID = ?????????????????????
    CLOSE = ?????????????????????????????????????????? "N"
    FUN = ??????????????????,???????????????????????????
    */
    
    var InpBox = document.createElement("div");
    InpBox.setAttribute("class","showBox");
    
    if(ID !== undefined){
        InpBox.setAttribute("id",ID);
    };
    
    document.body.style.overflow = "hidden";
    document.body.appendChild(InpBox);
    
    var InpBoxDiv1 = document.createElement("div");
    var InpBoxDiv2 = document.createElement("div");
    InpBoxDiv2.setAttribute("class","content");
    InpBoxDiv2.style.overflow = "auto";    
    InpBoxDiv2.innerHTML = INFO;
    
    InpBoxDiv1.appendChild(InpBoxDiv2);
    InpBox.appendChild(InpBoxDiv1);
    
    window.addEventListener("resize",RESIZE);

    function RESIZE(){
        var WH = document.documentElement.clientHeight;
        var MH2 = InpBoxDiv2;
        if(localStorage.getItem("ZOOM")==null){
            MH2.style.maxHeight = Math.floor(WH * .9 - 40) + "px";
        }else{
            MH2.style.maxHeight = Math.floor(WH * .9 - 40) / localStorage.getItem("ZOOM") + "px";
        };
    };

    RESIZE();

    /*???????????????????????????*/
    if(CLOSE == undefined || CLOSE !== "N"){
        Method.common.showboxClose(InpBox,FUN);
    }else{
        InpBox.classList.add("noClose");
    };
    
};

//showBox close
Method.common.showboxClose = function(inputBox,fun){
    var boxBack = document.createElement("span");
    boxBack.setAttribute("style","width:100%;height:100%;display:block;position:fixed;top:0;left:0;");
    inputBox.appendChild(boxBack);

    //????????????????????????
    var CLOSE = document.createElement("span");
    CLOSE.setAttribute("class","close");
    inputBox.querySelector("div").appendChild(CLOSE);

    //X ????????????
    CLOSE.onclick = function(){boxClose();};

    //????????? ????????????
    boxBack.onclick = function(){boxClose();};

    //?????????????????? ESC ????????????
    if(window.event){
        document.documentElement.onkeydown = function(event){
            if(window.event.keyCode == 27){boxClose();};
        };
    }else{
        document.documentElement.onkeydown = function(event){
            if(event.key == "Escape"){boxClose();};
        };
    };

    function boxClose(){
        inputBox.outerHTML="";
        if(!document.querySelector(".showBox")){
            document.body.style.overflow = "";
        };
        document.documentElement.onkeydown = "";
        
        if(fun){
            fun();
        };
    };
};

//jump page
Method.common.page = function(url,type){

    Method.common.loading();
    
    function back(info){

        var parse = new DOMParser();
        var html = parse.parseFromString(info.data,"text/html");

        //??????
        if(html.querySelector("pre")){
            Method.common.loadingClose();
            var info = JSON.parse(html.querySelector("pre").innerHTML);
            var html = "<h2><div class='sa-icon " + info.status + "'><span></span></div>" + info.message + "</h2>";

            function cancel(){
                if(document.querySelector("#cancel")){
                    document.querySelector("#cancel").click();
                };
            };

            Method.common.showBox(html,"message","",cancel);
            return;
        };

        //??????
        if(document.querySelector(".login")){

            if(!html.querySelector(".container")){
                history.go(0);
                Method.common.loadingClose();
                return;
            };

            document.querySelector(".container").innerHTML = html.querySelector(".container").innerHTML;
            Method.common.loadingClose();
        };

        //??????
        if(document.querySelector(".index")){
            
            if(!html.querySelector(".setting")){
                history.go(0);
                Method.common.loadingClose();
                return;
            };            

            if(type == "search"){
                document.querySelector("#data-panel").innerHTML = html.querySelector("#data-panel").innerHTML;
                Method.common.loadingClose();
            }else{

                if(type != "history"){
                    //??????????????? ??????????????????
                    history.pushState("","",url);
                };
                
                document.querySelector(".setting").innerHTML = html.querySelector(".setting").innerHTML;

                //
                if(document.querySelector("#categorySelect")){
                    Method.search.question();
                };

                Method.search.keyWord();
                Method.common.loadingClose();
            };

            Method.button.all();
            Method.common.heightLight();
            Method.common.multiIntent();
        };

    };
    
    Method.common.asyncAjax(location.origin + url,back);
};

//async ajax
Method.common.asyncAjax = function(url,back){
    //url ??????
    //back is call back function

    if(!back){
        console.log("missing back function!");
        return;
    };
    
    worker.postMessage(["asyncAjax",url]);
    worker.onmessage = function(e){
        back(e);
    };
};

//???????????????
Method.common.heightLight = function(){
    if(document.querySelector(".des")){
        var des = document.querySelectorAll(".des");
        var enName = document.querySelectorAll(".enName");
        for(var i=0;i<des.length;i++){
            if(des[i].getAttribute("title").match("?????????") || !enName[i].getAttribute("title").match("_")){
                des[i].parentNode.parentNode.parentNode.classList.add("highlight");
            };
        };
    };
};

//????????????
Method.common.train = function(){

    var train = document.querySelector("#train");

    if(train){

        function back(data){
            if(data.data != "0"){
                train.setAttribute("disabled","");
            }else{
                train.removeAttribute("disabled");
                return;
            };
    
            setTimeout(function(){
                Method.common.train();
            },5000)
        };
        
        Method.common.asyncAjax("/train/jh/status",back);

    };
    
};

// ?????????????????????
Method.common.multiIntent = function(){
    if(document.querySelector('.jh_new_des')){
        if(document.querySelector('#cnName')){
            let m_MouseDown = false
            const cnNameInput = document.querySelector('#cnName')

            cnNameInput.addEventListener('mousedown', e => {
                m_MouseDown = true
            })

            cnNameInput.addEventListener('mouseup', e => {
                m_MouseDown = false
                if(getText()){
                    const prop = prompt(`????????????${getText()}???????????????`, '')
                    if(prop != null && prop != ''){
                        document.querySelector('#entity_name').value = prop
                        const appendEle = document.createElement('div')

                        const appendLabel = document.createElement('label')
                        appendLabel.setAttribute('for', 'appendEntity')
                        appendLabel.innerText = `${getText()}???????????????`
                        appendEle.appendChild(appendLabel)

                        const appendEntity = document.createElement('input')
                        appendEntity.setAttribute('disabled', '')
                        appendEntity.setAttribute('type', 'text')
                        appendEntity.setAttribute('class', 'form-control')
                        appendEntity.setAttribute('id', 'appendEntity')
                        appendEntity.value = prop
                        appendEle.appendChild(appendEntity)
                        const node = document.querySelector('#jh_new_des')
                        node.children[0].insertBefore(appendEle, node.children[0].children[0].nextElementSibling)
                    }
                }
            })

            function getText(){
                const elem = document.querySelector('#cnName')
                return elem.value.substring(elem.selectionStart, elem.selectionEnd)
            }
        }
    }
}