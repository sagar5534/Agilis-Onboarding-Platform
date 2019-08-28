//All Methods for CSRF Token Sending between JS and Python
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


function fillCompany(callback){

    $.ajax({
            url: '/forms/initCompany',
            method: 'POST',
        })
        .done(function (data) {

            var obj = JSON.parse(data);

            if (obj["ignore"] != 1){
                document.getElementById("Provider").value = obj.currentProvider
                document.getElementById("CompanyName").value = obj.company_name
                document.getElementById("Type").value = obj.type
                document.getElementById("GoogleAddress").value = obj.StreetAddress
                document.getElementById("postal_code").value = obj.Postal
                document.getElementById("Suite").value = obj.Suite
            }

            callback(data);

        });

}

function fillPort(callback){

    $.ajax({
            url: '/forms/initPort',
            method: 'POST',
        })
        .done(function (data) {

            var obj = JSON.parse(data);

            for (x in obj){
    
                if (obj[x] == 1){
                    portId++;
    
                    $('#numbersPort').append("<div class='div-block-17 w-clearfix' id='portid" + portId + "'>"
                    + "<div class='text-block-14'>#</div>"
                    + "<div class='form-number'>" + x + "</div>"
                    + "<a class='form-x-btn w-button' onclick='removePortNumber(" + portId + ")'>X</a></div>")
                    
                    portNumbers[portId] = x
                }
                else{
                    discId++; 
                    
                    $('#numbersDisc').append("<div class='div-block-17 w-clearfix' id='discid" + discId + "'>"
                    + "<div class='text-block-14'>#</div>"
                    + "<div class='form-number'>" + x + "</div>"
                    + "<a class='form-x-btn w-button' onclick='removeDiscNumber(" + discId + ")'>X</a></div>")
    
                    discNumbers[discId] = x
                }
    
            }
            callback(data);

        });

}

function fillTollPort(callback){

    $.ajax({
            url: '/forms/initTollPort',
            method: 'POST',
        })
        .done(function (data) {

            var obj = JSON.parse(data);

            if (obj['ignore'] == 1){
                $(".TollNo").trigger("click")
                var prev = document.getElementById("prevSubmittedToll")
                prev.innerHTML = ""
                
            }else{

                $(".TollYes").trigger("click")
                var prev = document.getElementById("prevSubmittedToll")
                prev.innerHTML = "<p><br><br>Previously Submitted File: </p><a target='_blank' href='" + obj['url'] + "' >" + obj['name'] + "</a>" 
                $("#inputResp").prop('required',false);
            }

            callback(data);

        });

}

function fill911(callback){

    $.ajax({
            url: '/forms/init911',
            method: 'POST',
        })
        .done(function (data) {

            var obj = JSON.parse(data);

            console.log(obj)
      
            getAddress("SelectAddress911", function (address) {
                getPhone("SelectPhoneExc911", function (phone) {
                    createRuleTable(phone, address);
                    getAddress("SelectAddressExc911")
                    PromptNewAddress('Exc911')

                    var phoneList = document.getElementById("SelectPhoneExc911")

                    for (x in obj){
                        
                        var test = 0

                        for (i = 1; i < phoneList.childNodes.length; i++){
                            if (phoneList[i].innerHTML == obj[x].number){
                                test = i
                            }
                        }
                        
                        document.getElementById('RulesTable').innerHTML += "<div class='grid-entry' id='exception" + obj[x].id + "'>" +
                                "<div id='w-node-7ad72b18e096-37815fb7' class='form-grid-entry'>" + obj[x].number + "</div>" +
                                "<div class='form-grid-entry'>" + obj[x].address + "</div>" +
                                "<input type='button' class='w-button' value='X' onclick='removeRule(" + obj[x].id + ", " + test + ")'>" +
                            "</div>"
            
                        
                        ExceptionRules[obj[x].id] = {
                            phoneID: obj[x].id,
                            phone: obj[x].number,
                            addressID: obj[x].address_id,
                            address: obj[x].address,
                            location: test
                        }
            
                        delete normalRules[obj[x].id]
                        document.getElementById("rule" + obj[x].id).remove();
                        document.getElementById("SelectPhoneExc911").options[test].disabled = true;
                    }
                });
            });

            callback(data);

        });
}

function fill411(callback){

    $.ajax({
            url: '/forms/init411',
            method: 'POST',
        })
        .done(function (data) {

            //console.log(data)
            if (data == "No" || data == "None"){
                $("#411No").prop("checked", true).trigger("click");
                
            }
            else{
                $("#411Yes").prop("checked", true).trigger("click");

                getAddress('SelectAddress411', function () {
                    getPhone('SelectPhone411', function () {

                        var obj = JSON.parse(data);
                        
                        document.getElementById('CompanyName411').value = obj.listing_name;
                        document.getElementById('Category411').value = obj.category_listing;
                        document.getElementById('SelectAddress411').value = obj.listing_address_id;
                        document.getElementById('SelectPhone411').value = obj.listing_phone;
            
                    })
                })
            }

            callback(data);

        });
}

function fillExt(callback){

    $.ajax({
            url: '/forms/initExt',
            method: 'POST',
        })
        .done(function (data) {

            extCount = 0
            extId = 0
            document.getElementById('accordian-wrapper').innerHTML = ""

            var obj = JSON.parse(data);
            //console.log(obj)
    
            for (each in obj){
                $("#addExt").click()
            }
            
            var tableFields = document.getElementById("accordian-wrapper")
            var children = tableFields.children;
            //console.log(children)

            for (var i = 0; i < children.length; i++) {
                var content = children[i].childNodes[1];
                var voicemail = true; 
    
                //console.log(content.childNodes)
                //console.log(obj)
    
                //Ext and Name
                content.childNodes[1].value = obj[i].Ext
                content.childNodes[5].value = obj[i].ExtName
    
                $(content.childNodes[1]).trigger("keyup")
                $(content.childNodes[5]).trigger("change")
    
                //Caller ID Setting
                if (obj[i].caller_id == "custom"){
                    content.childNodes[7].value = 'custom'
    
                    content.childNodes[7].nextElementSibling.style.display = "Block"
                    content.childNodes[7].nextElementSibling.disabled = false
    
                    content.childNodes[8].value = obj[i].callerIdCustom
                }else{
                    content.childNodes[7].value = 1
                }
    
                var changeTo = ""
    
                if (obj[i].phone_id == "custom"){
    
                    changeTo = 'custom'
                    content.childNodes[10].nextElementSibling.style.display = "Block"
                    content.childNodes[10].nextElementSibling.disabled = false
    
                    content.childNodes[11].value = obj[i].phoneIdCustom
                }else{
                    changeTo = obj[i].phone_id
                }
    
                //cons
                getPhone(content.childNodes[10].id, function(){
                    $(content.childNodes[10]).val(changeTo).change();
                });
    
                if (obj[i].voicemail == true){
                    $(content.childNodes[13].childNodes[0].firstChild).trigger('click');
                }else{
                    $(content.childNodes[13].childNodes[1].firstChild).trigger('click');
                }
    
                //Phone
                if (obj[i].voicemail_toEmail == true){
                    $(content.childNodes[14].childNodes[1].lastChild).trigger('click');
                    content.childNodes[14].childNodes[2].style.display = "Block"
                    content.childNodes[14].childNodes[2].disabled = false
                    content.childNodes[14].childNodes[2].value = obj[i].voicemail_email
                }else{
                    $(content.childNodes[14].childNodes[1].firstChild).trigger('click');
                    content.childNodes[14].childNodes[2].style.display = "none"
                    content.childNodes[14].childNodes[2].disabled = true
                }
    
            }
            callback(data);

        });
}

function fillUpload(callback){

    $.ajax({
            url: '/forms/initUpload',
            method: 'POST',
        })
        .done(function (data) {


            var obj = JSON.parse(data);

            if (obj['ignore'] == 1){
                $(".TollNo").trigger("click")
                var prev = document.getElementById("prevSubmittedToll")
                prev.innerHTML = ""
                
            }else{

                $(".TollYes").trigger("click")
                var prev = document.getElementById("prevSubmittedToll")
                prev.innerHTML = "<p><br><br>Previously Submitted File: </p><a target='_blank' href='" + obj['url'] + "' >" + obj['name'] + "</a>" 
                $("#inputResp").prop('required',false);
            }

            
            callback(data);

        });
}


$(document).ready(function () {

    fillCompany(function(data) {});

    fillPort(function(data) {});

    fillTollPort(function(data) {});

    fill911(function(data){});

    fill411(function(data){});

    //fillExt(function(data) {});

    //fillUpload(function(data) {});

});


