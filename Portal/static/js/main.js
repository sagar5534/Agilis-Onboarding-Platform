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



//-----------------------------------------------------------//
//Function to getAddress
function getAddress(element, callback) {
    $.ajax({
            url: '/forms/getAddress',
            data: {},
            method: 'POST',
        })
        .done(function (data) {
            var obj = JSON.parse(data);

            document.getElementById(element).innerHTML = ""

            for (x in obj) {
                document.getElementById(element).innerHTML += '<option value=' + obj[x].id + '>' + obj[x].address + '</option>'
            }
            if (element == 'SelectAddressExc911') {
                document.getElementById(element).innerHTML += '<option value=0>Add a new Address</option>'
            }
            if (element.includes("ExtCallerID")){
                document.getElementById(element).innerHTML += '<option value="custom">Custom</option>'
            }

            callback(obj);
        });
}

//Function to getPhone
function getPhone(element, callback) {

    $.ajax({
            url: '/forms/getPhone',
            data: {},
            method: 'POST',
        })
        .done(function (data) {
            //console.log(element)
            document.getElementById(element).innerHTML = ""
            
            //RulePhone = data.phone
            if (element == "SelectPhoneExc911") {
                document.getElementById(element).innerHTML += '<option value="0">---------</option>'
            }

            for (x in data.phone) {
                document.getElementById(element).innerHTML += '<option value=' + data.phone[x].id + '>' + data.phone[x].phone + '</option>'
            }

            // if (element.includes("ExtCallerNumber")){
            //     document.getElementById(element).innerHTML += '<option value="custom">Custom</option>'
            // }

            callback(data.phone);
        });
}

//-----------------------------------------------------------//
//Global Vars for Numbers - Form 
let portId = 0;
let discId = 0;
let extId = 0;
let extCount = 0;

//Both Functions are for Numbers - Forms 
//Functions to remove Port Number
function removePortNumber(x) {
    //document.getElementById("portnumber" + x).remove();
    //document.getElementById("portremoveNumber" + x).remove();
    document.getElementById("portid" + x).remove();
    portNumbers[x] = null
    //console.log(portNumbers)
}

//Functions to remove Disc Number
function removeDiscNumber(x) {
    //document.getElementById("discnumber" + x).remove();
    //document.getElementById("discremoveNumber" + x).remove();
    document.getElementById("discid" + x).remove();
    discNumbers[x] = null
    //console.log(discNumbers)
}

//Functions to Add a Port Number
function addPortNumber() {
    document.getElementById("PortError").style.display = "None"
    var x = document.getElementById("PortNumber").value

    var exists = false; 
    for (i in portNumbers){
        if (portNumbers[i] == x){
            exists = true;
        }
    }

    if (x == ""){
        exists = true;
    }

    if (exists == false){
        portId++;
        $('#numbersPort').append("<div class='div-block-17 w-clearfix' id='portid" + portId + "'>"
        + "<div class='text-block-14'>#</div>"
        + "<div class='form-number'>" + x + "</div>"
        + "<a class='form-x-btn w-button' onclick='removePortNumber(" + portId + ")'>X</a></div>")
        
        portNumbers[portId] = x
    
        document.getElementById("PortNumber").value = ""
    }

}

//Function to Add a Disconnect Number
function addDiscNumber() {

    var x = document.getElementById("DiscNumber").value


    var exists = false; 
    for (i in discNumbers){
        if (discNumbers[i] == x){
            exists = true;
        }
    }

    if (x == ""){
        exists = true;
    }

    if (exists == false){
        discId++;    
        $('#numbersDisc').append("<div class='div-block-17 w-clearfix' id='discid" + discId + "'>"
        + "<div class='text-block-14'>#</div>"
        + "<div class='form-number'>" + x + "</div>"
        + "<a class='form-x-btn w-button' onclick='removeDiscNumber(" + discId + ")'>X</a></div>")

        discNumbers[discId] = x

        document.getElementById("DiscNumber").value = ""
    }
}
//-----------------------------------------------------------//

//Function to validate a phone number
function validatePhone(val) {
    var x = val
    x = x.replace('+1', '');
    x = x.replace(/[-+()\s]/g, '');
    return x;
}



//-----------------------------------------------------------//

//Global Vars for 911 Info 
var normalRules = {}
var ExceptionRules = {}

//Globals for Porting
var portNumbers = []
var discNumbers = []

//Creating the rule table on page startup 911 Info - Forms
function createRuleTable(phone, address) {

    document.getElementById('RulesTable').innerHTML = ""
    
    Object.keys(phone).forEach(function (key) {
        normalRules[phone[key].id] = {
            phoneID: phone[key].id,
            addressID: address[0].id,
            phone: phone[key].phone,
            address: address[0].address
        }

        document.getElementById('RulesTable').innerHTML += "<div class='grid-entry' id='rule" + phone[key].id + "'>" + 
        "<div id='w-node-7ad72b18e096-37815fb7' class='form-grid-entry'>" + phone[key].phone + "</div>" +
        "<div class='form-grid-entry'>" + address[0].address + "</div>" +
        "</div>"

    });

    //console.log(normalRules)
    console.log(normalRules)
    console.log(ExceptionRules)
}
//Adding a Rule into 911 Info - Forms
function addRule() {

    var phoneID = document.getElementById("SelectPhoneExc911").options[document.getElementById("SelectPhoneExc911").selectedIndex].value
    var addressID = document.getElementById("SelectAddressExc911").options[document.getElementById("SelectAddressExc911").selectedIndex].value
    
    if (phoneID != "0") {
        var phone = document.getElementById("SelectPhoneExc911").options[document.getElementById("SelectPhoneExc911").selectedIndex].text

        if (addressID != '0') {

            var address = document.getElementById("SelectAddressExc911").options[document.getElementById("SelectAddressExc911").selectedIndex].text

            document.getElementById('RulesTable').innerHTML += "<div class='grid-entry' id='exception" + phoneID + "'>" +
                    "<div id='w-node-7ad72b18e096-37815fb7' class='form-grid-entry'>" + phone + "</div>" +
                    "<div class='form-grid-entry'>" + address + "</div>" +
                    "<input type='button' class='w-button' value='X' onclick='removeRule(" + phoneID + ", " + document.getElementById('SelectPhoneExc911').selectedIndex + ")'>" +
                "</div>"

            
            ExceptionRules[document.getElementById("SelectPhoneExc911").options[document.getElementById("SelectPhoneExc911").selectedIndex].value] = {
                phoneID: document.getElementById("SelectPhoneExc911").options[document.getElementById("SelectPhoneExc911").selectedIndex].value,
                phone: document.getElementById("SelectPhoneExc911").options[document.getElementById("SelectPhoneExc911").selectedIndex].text,
                addressID: document.getElementById("SelectAddressExc911").options[document.getElementById("SelectAddressExc911").selectedIndex].value,
                address: document.getElementById("SelectAddressExc911").options[document.getElementById("SelectAddressExc911").selectedIndex].text,
                location: document.getElementById('SelectPhoneExc911').selectedIndex
            }

            delete normalRules[phoneID]

            var myEle = document.getElementById("rule" + phoneID)
            if(myEle){
                myEle.remove();
            }

            document.getElementById("SelectPhoneExc911").options[document.getElementById("SelectPhoneExc911").selectedIndex].disabled = true;
            document.getElementById("SelectPhoneExc911").selectedIndex = 0;
        } else {
            //Create a new address
            data = {
                Suite: document.getElementById("Suite-Exc911").value,
                StreetAddress: document.getElementById("GoogleAddress-Exc911").value,
                Postal: document.getElementById("postal_codeExc911").value,
                // Country: document.getElementById("countryExc911").value,
            }

            if (data['StreetAddress'] == "") {
                document.getElementById("GoogleAddress-Exc911").setCustomValidity("Enter a Value");
                document.getElementById("GoogleAddress-Exc911").reportValidity();
                
                
            } else if (data['Postal'] == ""){
                document.getElementById("postal_codeExc911").setCustomValidity("Enter a Value");
                document.getElementById("postal_codeExc911").reportValidity();

            }else{
                document.getElementById("GoogleAddress-Exc911").setCustomValidity("");
                document.getElementById("GoogleAddress-Exc911").reportValidity();

                document.getElementById("postal_codeExc911").setCustomValidity("");
                document.getElementById("GoogleAddress-Exc911").reportValidity();

                $.ajax({
                    url: '/forms/setAddress',
                    data: data,
                    method: 'POST',
                })
                .done(function (data) {
                    if (data.status == "form-invalid") {
                        var output = '';
                        for (var property in data.formerrors) {
                            output += data.formerrors[property] + '\n';
                        }
                        alert(output);
                    } else {
                        getAddress('SelectAddressExc911', function (address) {
                            $('#SelectAddressExc911').val(data.address);
                            // document.getElementById("SelectAddressExc911").selectedIndex = address.length - 1;
                            addRule()
                            document.getElementById('NewAddressExc911').style.display = "none"
                        });
                    }
                });
            }

        }
    }
    console.log(normalRules)
    console.log(ExceptionRules)
}
//Removing an Exception from 911 Info - Forms
function removeRule(id, location) {

    var addressID = document.getElementById("SelectAddress911").options[document.getElementById("SelectAddress911").selectedIndex].value
    var address = document.getElementById("SelectAddress911").options[document.getElementById("SelectAddress911").selectedIndex].text

    normalRules[id] = {
        phoneID: ExceptionRules[id].phoneID,
        addressID: addressID,
        phone: ExceptionRules[id].phone,
        address: address
    }

    document.getElementById('RulesTable').innerHTML += "<div class='grid-entry' id='rule" + normalRules[id].phoneID + "'>" + 
    "<div id='w-node-7ad72b18e096-37815fb7' class='form-grid-entry'>" + normalRules[id].phone + "</div>" +
    "<div class='form-grid-entry'>" + normalRules[id].address + "</div>" +
    "</div>"

    delete ExceptionRules[id]

    if (location != 'location'){
        document.getElementById("SelectPhoneExc911").options[location].disabled = false;
    }

    var myEle = document.getElementById("exception" + id)
    if(myEle){
        myEle.remove();
    }

    console.log(normalRules)
    console.log(ExceptionRules)
}
//To merge two objects into one - 911 Info 
//Check if needed
function merge_options(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
}

function PromptNewAddress(id) {
    //console.log("PrompNewAddress" + id)
    var sel = "SelectAddress" + id

    var address = document.getElementById(sel).options[document.getElementById(sel).selectedIndex].value;
    if (address == "0") {
        //Clear
        document.getElementById("postal_code" + id).value = ""
        // document.getElementById("country" + id).value = ""
        document.getElementById("Suite-" + id).value = ""
        document.getElementById("GoogleAddress-" + id).value = ""

        //Enable
        document.getElementById("postal_code" + id).disabled = false;
        document.getElementById("Suite-" + id).disabled = false;
        document.getElementById("GoogleAddress-" + id).disabled = false;
        //Show
        document.getElementById('NewAddress' + id).style.display = "block"

    } else {
        //Hide
        document.getElementById('NewAddress' + id).style.display = "none"
        //Enable
        document.getElementById("postal_code" + id).disabled = true;
        document.getElementById("Suite-" + id).disabled = true;
        document.getElementById("GoogleAddress-" + id).disabled = true;
    }
}

function removeExt(id) {

    document.getElementById('Ext' + String(id)).remove()
    if (extCount != 0){
        extCount--; 
    }

}

var newFileList = ""

function removeFile(i){

    newFileList.splice(i,1);
    //console.log(newFileList)

    var list = document.getElementById("FileList")
    list.innerHTML = "<h6 class='form-heading-8'>Files to Upload</h6>"
    for (i in newFileList){
        //console.log()
        list.innerHTML += "<div class='div-block-17 w-clearfix' id='file" + i + "'><div class='form-number'>" + newFileList[i].name + "</div><a onclick='removeFile(" + i + ")' class='form-x-btn w-button'>X</a></div>"
    }


}


//-----------------------------------------------------------//
 
//Instructions that occur once document is ready
$(document).ready(function () {

    

    $(document).on("click", "input.TollYes" , function(e) {
        var x = document.getElementById("downloadDiv")
        x.style.display = "Block"
        x.disabled = false
        var x = document.getElementById("downloadDiv2")
        x.style.display = "Block"
        x.disabled = false
        var x = document.getElementById("inputResp")
        x.disabled = false
    });


    $(document).on("click", "input.TollNo" , function(e) {
        var x = document.getElementById("inputResp")
        x.disabled = true
        var x = document.getElementById("downloadDiv")
        x.style.display = "none"
        x.disabled = true
        var x = document.getElementById("downloadDiv2")
        x.style.display = "none"
        x.disabled = true
    
    });

    //911 and 411 Selects
    $('#SelectAddress411').change(function () {
        PromptNewAddress('411')
    }); 

    $('#SelectAddressExc911').change(function () {
        PromptNewAddress('Exc911')
    }); 
    
    //A main site is changed on 911 Info - Form
    $("#SelectAddress911").change( function(e){
        e.preventDefault();
        document.getElementById('RulesTable').innerHTML = ""
    
        Object.keys(normalRules).forEach(function (key) {
            normalRules[key] = {
                phone: normalRules[key].phone,
                phoneID: normalRules[key].phoneID,
                address: document.getElementById("SelectAddress911").options[document.getElementById("SelectAddress911").selectedIndex].text,
                addressID: document.getElementById("SelectAddress911").options[document.getElementById("SelectAddress911").selectedIndex].value
            }

            document.getElementById('RulesTable').innerHTML += "<div class='grid-entry' id='rule" + normalRules[key].phoneID + "'>" +
            "<div id='w-node-7ad72b18e096-37815fb7' class='form-grid-entry'>" + normalRules[key].phone + "</div>" +
            "<div class='form-grid-entry'>" + normalRules[key].address + "</div>" +
            "</div>"
        });

        Object.keys(ExceptionRules).forEach(function (key) {
            document.getElementById('RulesTable').innerHTML += "<div class='grid-entry' id='exception" + ExceptionRules[key].phoneID + "'>" +
                    "<div id='w-node-7ad72b18e096-37815fb7' class='form-grid-entry'>" + ExceptionRules[key].phone + "</div>" +
                    "<div class='form-grid-entry'>" + ExceptionRules[key].address + "</div>" +
                    "<input type='button' class='w-button' value='X' onclick='removeRule(" + ExceptionRules[key].phoneID + ", " + ExceptionRules[key].location + ")'>" +
                "</div>"
        });

        //console.log(normalRules)
    });
    
     //Does user want to be listed in 411 Directory - 411 Directory - Forms
    $("input:radio[name='411-Directory']").click(function () {
        var radioValue = $("input[name='411-Directory']:checked").val();
        if (radioValue == 'Yes') {
            document.getElementById('CompanyName411').disabled = false;
            document.getElementById('Category411').disabled = false;
            document.getElementById('SelectAddress411').disabled = false;
            document.getElementById('SelectPhone411').disabled = false;
            document.getElementById("Suite-411").disabled = false;
            document.getElementById("GoogleAddress-411").disabled = false;
            document.getElementById("postal_code411").disabled = false;
            // document.getElementById("country411").disabled = true;
            PromptNewAddress("411")
            document.getElementById('411Box').style.display = "Block";

        } else {
            //console.log("click")
            document.getElementById('411Box').disabled = true;
            document.getElementById('CompanyName411').disabled = true;
            document.getElementById('Category411').disabled = true;
            document.getElementById('SelectPhone411').disabled = true;
            document.getElementById('SelectAddress411').disabled = true;
            document.getElementById("Suite-411").disabled = true;
            document.getElementById("GoogleAddress-411").disabled = true;
            document.getElementById("postal_code411").disabled = true;
            // document.getElementById("country411").disabled = true;
            document.getElementById('411Box').style.display = "none";

        }
    });

    //-----------------------------------------------------------//

    $(document).on("click", "div.accordian-trigger" , function(e) {
        var panel = e.currentTarget.nextElementSibling;
        
        //console.log(panel.style.display)
        if (panel.style.display == "block" ){
            panel.style.display = "none"
        }else{
            panel.style.display = "block"
        }
    });

    $(document).on("click", "input.ExtVoicemailYes" , function(e) {
        //console.log($(e.currentTarget).parent().parent()[0].nextElementSibling)
        $(e.currentTarget).parent().parent()[0].nextElementSibling.style.display = "Block"
        $(e.currentTarget).parent().parent()[0].nextElementSibling.disabled = false
    });

    $(document).on("click", "input.ExtVoicemailNo" , function(e) {
        //console.log($(e.currentTarget).parent().parent()[0].nextElementSibling)
        $(e.currentTarget).parent().parent()[0].nextElementSibling.style.display = "none"
        $(e.currentTarget).parent().parent()[0].nextElementSibling.disabled = true
    });

    $(document).on("click", "input.ExtVoicemailPhone" , function(e) {
        //console.log($(e.currentTarget).parent().parent()[0].nextElementSibling)
        $(e.currentTarget).parent().parent()[0].nextElementSibling.style.display = "none"
        $(e.currentTarget).parent().parent()[0].nextElementSibling.disabled = true
    });

    $(document).on("click", "input.ExtVoicemailEmail" , function(e) {
        //console.log($(e.currentTarget).parent().parent()[0].nextElementSibling)
        $(e.currentTarget).parent().parent()[0].nextElementSibling.style.display = "Block"
        $(e.currentTarget).parent().parent()[0].nextElementSibling.disabled = false
    });

    $(document).on("change", "select.ExtCallerID" , function(e) {
        //console.log(e)
        if (e.currentTarget.value == "custom"){
            e.currentTarget.nextElementSibling.style.display = "Block"
            e.currentTarget.nextElementSibling.disabled = false
        }else{
            e.currentTarget.nextElementSibling.style.display = "none"
            e.currentTarget.nextElementSibling.disabled = true
        }
    });

    $(document).on("change", "select.ExtCallerNumber" , function(e) {
        //console.log(e)
        if (e.currentTarget.value == "custom"){
            e.currentTarget.nextElementSibling.style.display = "Block"
            e.currentTarget.nextElementSibling.disabled = false
        }else{
            e.currentTarget.nextElementSibling.style.display = "none"
            e.currentTarget.nextElementSibling.disabled = true
        }
    });

    $(document).on("keyup", "input.ExtNumber" , function(e) {
        console.log(e)
        e.preventDefault()

        var input = e.currentTarget
        var issues = ""
        var userValidation = true
        //Rules for Extensions
        //Catching 3 Letter or Less
        if (input.value.length < 3){
            issues += "Must be larger then 2 Digits"
            userValidation = false
        }
        if (input.value.length == 3 && input.value.endsWith("11")){
            issues += "Cannot end with *11"
            userValidation = false
        }
        if (input.value.length > 6){
            issues += "Must be less then 6 Digits"
            userValidation = false
        }

        //Existing
        var tableFields = document.getElementById("accordian-wrapper")
        var children = tableFields.children;

        counter = 0
        for (var i = 0; i < children.length; i++) {
            if (input.value == children[i].childNodes[1].childNodes[1].value){
                counter++;
            }
            if (counter > 1){
                issues += "Extension number already exists"
                userValidation = false
                break
            }
        }

        //validate if the pattern match
        if (userValidation) {
            e.currentTarget.setCustomValidity("");
            var isValid = e.currentTarget.reportValidity();

        } else {
            e.currentTarget.setCustomValidity(issues);
            var isValid = e.currentTarget.reportValidity();
        }

        var str = $(e.currentTarget).parent().parent()[0].firstChild.firstChild.innerHTML
        if (str == "#&nbsp;New Extention<br>"){
 
            $(e.currentTarget).parent().parent()[0].firstChild.firstChild.innerHTML = "#" + e.currentTarget.value + " - "
            
        }else{
            var res = str.split(" - ");
            //console.log(res)
            $(e.currentTarget).parent().parent()[0].firstChild.firstChild.innerHTML = "#" + e.currentTarget.value + " - " + res[1]
        }

    });

    $(document).on("change", "input.ExtName" , function(e) {
        var str = $(e.currentTarget).parent().parent()[0].firstChild.firstChild.innerHTML

        if (str == "#&nbsp;New Extention<br>"){

            $(e.currentTarget).parent().parent()[0].firstChild.firstChild.innerHTML = "#" + " - " + e.currentTarget.value
            
        }else{
            var res = str.split(" - ");
            //console.log(res)
            $(e.currentTarget).parent().parent()[0].firstChild.firstChild.innerHTML =  res[0] + " - " + e.currentTarget.value
        }
    });
    
    $(document).on("change", "#fileUploadBtn" , function(e) {
        var list = document.getElementById("FileList")
        
        document.getElementById("uploadError").style.display = "none"

        //Send to Array
        var oldList = document.getElementById("fileUploadBtn")
        newFileList = Array.from(oldList.files);

        list.innerHTML = "<h6 class='form-heading-8'>Files to Upload</h6>"
        for (i = 0; i < e.currentTarget.files.length; i++){
            //console.log(e.currentTarget.files[i])
            list.innerHTML += "<div class='div-block-17 w-clearfix' id='file" + i + "'><div class='form-number'>" + e.currentTarget.files[i].name + "</div><a onclick='removeFile(" + i + ")' class='form-x-btn w-button'>X</a></div>"
        }
    });

    $(document).on("keyup", "#signiture-input" , function(e) {
        document.getElementById("signiture_text").innerHTML = e.currentTarget.value
    });



    $("#addExt").click(function () {

        var tableFields = document.getElementById("accordian-wrapper")
        var children = tableFields.children;
        console.log(children)

        for (var i = 0; i < children.length; i++) {
            var content = children[i].childNodes[1];
            if (content.childHeight != 0){
                //children[i].childNodes[0] .trigger("click")
                $("#"+children[i].childNodes[0].id).trigger("click")
                $(children[i].childNodes[0]).trigger("click")
            }
        }

        extCount++
        extId++

        x = "<div class='accordian-item' id='Ext" + extId + "'>"
        + "<div class='accordian-trigger w-clearfix' id='accordian-trigger" + extId + "' disabled=''>"
        +    "<h5 disabled='' class='tigger-header'># New Extention<br></h5>"
        +    "<a class='form-x-btn w-button' onclick='removeExt(" + extId +")'>X</a>"
        + "</div>" 
        + "<div class='accordian-content' id='accordian-content" + extId + "'>"
        +  "<div class='form-heading-8'>Extension Number</div>"
        +  "<input type='number' class='form-field w-input ExtNumber' maxlength='6' name='ExtNumber' data-name='ExtNumber' placeholder='Extension Number' id='ExtNumber' required=''>"
        +  " <div class='div-block-33 ext'>"
        +       "<div>Error</div>"
        +   "</div>"
        +   "<div class='form-heading-8'>Full name of the user for this extension</div>"
        +   "<input type='text' class='form-field w-input ExtName' maxlength='256' name='ExtName' data-name='ExtName' placeholder='User&#x27;s Name' id='ExtName' required=''>"
        +   "<div class='form-heading-8'>Caller ID Name</div>"
        +   "<select id='ExtCallerID" + extId + "' name='ExtCallerID' data-name='ExtCallerID' required='' class='form-select w-select ExtCallerID'>"
        +       "<option value='1'>" + document.getElementById("CompanyName").value + "</option>"
        +       "<option value='custom'>Custom Name</option>"
        +   "</select>"
        +   "<input type='text' class='form-field w-input' maxlength='256' name='CustomCallerID' data-name='CustomCallerID' placeholder='Caller ID Name' id='CustomCallerID" + extId + "' required='' style='display:none' disabled=''>"
        +   "<div class='form-heading-8'>Caller ID Phone Number</div>"
        +   "<select id='ExtCallerNumber" + extId + "' name='ExtCallerNumber' data-name='ExtCallerNumber' class='form-select w-select ExtCallerNumber'>"
        +       "<option value=''>Select one...</option>"
        +       "<option value='First'>First Choice</option>"
        +       "<option value='Second'>Second Choice</option>"
        +   "</select>"
        +   "<input type='tel' class='form-field w-input' minlength='10' maxlength='10' pattern='[0-9]{3}[0-9]{3}[0-9]{4}' name='CustomCallerNumber' data-name='CustomCallerNumber' placeholder='Caller ID Phone Number - XXXXXXXXXX' id='CustomCallerNumber" + extId + "' required='' style='display:none' disabled=''>"
        +   "<div class='form-heading-8'>Would you like Voicemail for this Extension?</div>"
        +   "<div class='div-block-23'>"
        +       "<label class='w-radio'>"
        +       "<input type='radio' id='ExtVoicemailYes" + extId + "' name='ExtVoicemail" + extId + "' value='Yes' required='' class='w-radio-input ExtVoicemailYes'><span for='Yes' class='w-form-label'>Yes</span></label>"
        +       "<label class='radio-button-field-2 w-radio'>"
        +       "<input type='radio' id='ExtVoicemailNo" + extId + "' name='ExtVoicemail" + extId + "' value='No' class='w-radio-input ExtVoicemailNo'><span for='No' class='w-form-label'>No</span></label>"
        +   "</div>"
        +   "<div class='div-block-32' id='ExtVoicemailBox" + extId + "'>"
        +      "<div class='form-heading-8'>Type of Voicemail</div>"
        +       "<div class='div-block-23'>"
        +           "<label class='w-radio'>"
        +               "<input type='radio' id='ExtVoicemailEmailYes" + extId + "' name='ExtVoicemailEmail" + extId + "' value='Yes' required='' class='w-radio-input ExtVoicemailPhone'><span for='Yes-2' class='w-form-label'>Voicemail via Phone</span></label>"
        +           "<label class='radio-button-field-2 w-radio'>"
        +              " <input type='radio' id='ExtVoicemailEmailNo" + extId + "' name='ExtVoicemailEmail" + extId + "' value='No' class='w-radio-input ExtVoicemailEmail'><span for='No-2' class='w-form-label'>Voicemail via Email</span></label>"
        +      "</div>"
        +       "<input type='email' class='form-field w-input' maxlength='256' name='VoicemailEmail' data-name='VoicemailEmail' placeholder='Email for Voicemail' id='VoicemailEmail" + extId + "' required=''>"
        +   "</div>"
        +"</div>"
        +"</div>"

        document.getElementById('accordian-wrapper').insertAdjacentHTML("beforeend", x)

        getPhone("ExtCallerNumber" + String(extId), function(){});
        $('#ExtVoicemailNo' + String(extId)).trigger("click")
        $("#ExtVoicemailEmailYes"  + String(extId)).trigger("click");

        
    });

    
 //-----------------------------------------------------------//
 
    //Showing Screens
    $(".formcompany").show();   
    $(".formporting").hide();
    $(".formtoll").hide();
    $(".form911").hide();
    $(".form411").hide();
    $(".formext").hide();
    $(".formupload").hide();
    $(".formconfirm").hide();

//-----------------------------------------------------------//
    //Company Info
    $("#companyFormNext").submit(function (e) {
        e.preventDefault();
        $.ajax({
                url: '/forms/catchCompany',
                data: {
                    companyName: document.getElementById("CompanyName").value,
                    type: document.getElementById("Type").options[document.getElementById("Type").selectedIndex].text,
                    CurProvider: document.getElementById("Provider").value,
                    Suite: document.getElementById("Suite").value,
                    Postal: document.getElementById("postal_code").value,
                    StreetAddress: document.getElementById("GoogleAddress").value,
                },
                method: 'POST',
            })
            .done(function (data) {
                if (data.status == "form-invalid") {
                    alert(data.formerrors.Phone411)
                } else {
                    //If valid form
                    
                    $(".formcompany").hide();
                    $(".formporting").show();
                
                    
                }
            });
    });

    //Port Number
    $("#portingFormNext").submit(function (e) {
        e.preventDefault();
        
        var filteredport = portNumbers.filter(function (el) {
            return el != null;
          });
        var filtereddisc = discNumbers.filter(function (el) {
        return el != null;
        });

        let Data = {
            port: filteredport,
            disc: filtereddisc
        }

        if (filteredport.length == 0){

            document.getElementById("PortError").style.display = "Block"

        }else{

            document.getElementById("PortError").style.display = "None"

            $.ajax({
                url: '/forms/catchPorting',
                data: JSON.stringify(Data),
                contentType: "application/json",
                method: 'POST'
            })
            .done(function (data) {
                if (data.status == "form-invalid") {
                    alert(data.formerrors.Phone411)
                } 
                else {
                    fillTollPort( function() {
                        fill911(function(){});
                        $(".formporting").hide();
                        $(".formtoll").show();
                    })
                }
            });
        }
        

       
    });


    $("#portingTollNext").submit(function (e) {
        e.preventDefault();

        var formData = new FormData();

        if (document.getElementById("TollYes").checked == true){
            //Enter a File
            //If File is there
            if (e.currentTarget[0].files.length > 0){

                formData.set("file", e.currentTarget[0].files[0])
                $.ajax({
                    url: '/forms/catchToll',
                    type: 'POST',
                    data: formData,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        fill911(function(data){
                            $(".formtoll").hide();
                            $(".form911").show();
                        });
                    }
                });
            //If file is being used from Prev
            }else{
                fill911(function(data){
                    $(".formtoll").hide();
                    $(".form911").show();
                });
            }

        }else{
            //No File
            $.ajax({
                url: '/forms/catchTollRemove',
                type: 'POST',
                success: function(data) {
                    fill911(function(data){
                        $(".formtoll").hide();
                        $(".form911").show();
                    });
                }
            });
        }

    });

    //911 Info
    $("#Exc911FormNext").submit(function (e) {
        e.preventDefault();
        //console.log("911Next")
        data = merge_options(normalRules, ExceptionRules)

        $.ajax({
                url: '/forms/catch911',
                data: JSON.stringify(data),
                contentType: "application/json",
                method: 'POST',
            })
            .done(function (data) {
                if (data.status == "form-invalid") {
                    var output = '';
                    for (var property in data.formerrors) {
                        output += data.formerrors[property] + '\n';
                    }
                    alert(output);
                } else {
                    $(".form911").hide();

                    getAddress('SelectAddress411', function () {})
                    getPhone('SelectPhone411', function () {})

                    $(".form411").show();
                }
            });
    });

     //411 Info
    $("#411FormNext").submit(function (e) {
        e.preventDefault();

        if (document.getElementById('411Yes').checked == true) {
            if (document.getElementById("SelectAddress411").options[document.getElementById("SelectAddress411").selectedIndex].value == 0) {
                data = {
                    CompanyName411: document.getElementById('CompanyName411').value,
                    Category: document.getElementById('Category411').value,
                    Phone411: document.getElementById("SelectPhone411").options[document.getElementById("SelectPhone411").selectedIndex].text,
                    Suite: document.getElementById("Suite-411").value,
                    StreetAddress: document.getElementById("GoogleAddress-411").value,
                    Postal: document.getElementById("postal_code411").value,
                    // Country: document.getElementById("country411").value,
                }
            } else {
                data = {
                    CompanyName411: document.getElementById('CompanyName411').value,
                    Category: document.getElementById('Category411').value,
                    Phone411: document.getElementById("SelectPhone411").options[document.getElementById("SelectPhone411").selectedIndex].text,
                    address: document.getElementById("SelectAddress411").options[document.getElementById("SelectAddress411").selectedIndex].value
                }
            }
        } else {
            data = {
                ignore: 1
            }
        }

        e.preventDefault();
        $.ajax({
                url: '/forms/catch411',
                data: data,
                method: 'POST',
            })
            .done(function (data) {
                if (data.status == "form-invalid") {
                    var output = '';
                    for (var property in data.formerrors) {
                        output += data.formerrors[property] + '\n';
                    }
                    alert(output);
                } else {
                    fillExt(function(data) {
                        console.log(data)
                        $(".form411").hide();
                        $(".formext").show(); 
                    });
                }
            });
    });

    
    $(document).on("click", "#FormExtNext" , function(e) {
        console.log("Worked")
        var tableFields = document.getElementById("accordian-wrapper")
        var children = tableFields.children;
        console.log(children)

        for (var i = 0; i < children.length; i++) {
            var content = children[i].childNodes[1];

            console.log(content.childNodes)

            if (content.childNodes[1].value == "" || content.childNodes[5].value == "" || content.childNodes[7].selectedIndex == -1 || content.childNodes[10].selectedIndex == -1){
                console.log("Error")
            }
            else if (content.childNodes[13].childNodes[0].firstChild.checked == true){
                if (content.childNodes[14].childNodes[1].firstChild.firstChild.checked == true){
                    
                }else{
                    if (content.childNodes[14].childNodes[2].value == ""){
                        console.log("Error")

                    }
                }
            }



        }

    });
    
    $("#FormExtNext").submit(function (e) {

        if (extCount == 0){
            data = {
                ignore: 1
            }
        }else{
            data = []
            var tableFields = document.getElementById("accordian-wrapper")
            var children = tableFields.children;
            console.log(children)

            for (var i = 0; i < children.length; i++) {
                var content = children[i].childNodes[1];
                var voicemail = true; 

                console.log(content.childNodes)

                data.push({
                    "Ext": content.childNodes[1].value,
                    "ExtUser": content.childNodes[5].value,
                });

                //Caller ID Handler
                var callerId = content.childNodes[7].options[content.childNodes[7].selectedIndex].value
                data[i].caller_id = content.childNodes[7].options[content.childNodes[7].selectedIndex].text
                if (callerId == "custom"){
                   data[i].caller_id = callerId
                   data[i].callerIdCustom = content.childNodes[8].value
                }

                //Phone ID Handler
                var phoneId = content.childNodes[10].options[content.childNodes[10].selectedIndex].value
                data[i].phone_id = phoneId
                if (phoneId == "custom"){
                    data[i].phoneCustom = content.childNodes[11].value
                }


                if (content.childNodes[13].childNodes[0].firstChild.checked == true){
                    voicemail = true

                    if (content.childNodes[14].childNodes[1].firstChild.firstChild.checked == true){
                        data[i].voicemail = voicemail
                        data[i].voicemail_type = "phone"
                    }else{
                        data[i].voicemail = voicemail
                        data[i].voicemail_type = "email"
                        data[i].email = content.childNodes[14].childNodes[2].value
                    }

                }else{
                    voicemail = false
                    data[i].voicemail = voicemail
                }
            }
        }

        console.log(data)
        e.preventDefault();
        $.ajax({
                url: '/forms/catchExt',
                data: JSON.stringify(data),
                contentType: "application/json",
                method: 'POST',
            })
        .done(function (data) {
            //console.log(data)
            if (data.status == "form-invalid") {
                var output = '';
                for (var property in data.formerrors) {
                    output += data.formerrors[property] + '\n';
                }
                alert(output);
            } else {
                $(".formext").hide();  
                $(".formupload").show();
            }
        });

    });

    function upload(event) {
        event.preventDefault();

        var formData = new FormData();

        for (i in newFileList){
            //console.log(newFileList[i])

            formData.set("file", newFileList[i])

            $.ajax({
                url: '/forms/catchUpload',
                type: 'POST',
                data: formData,
                cache: false,
                processData: false,
                contentType: false,
                success: function(data) {
                    $(".formupload").hide();
                    $(".formconfirm").show();
                }
            });
        }

        if (newFileList.length == 0 || newFileList == ""){
            document.getElementById("uploadError").style.display = "Block"
        }
    }
        
    $("#FormUploadNext").submit(upload);


    $("#FormConfirmNext").submit(function (e) {
        e.preventDefault();
        document.getElementById("loader").style.display = "Block"

        var image_data = ""
        var element = document.getElementById("sig-area");
        html2canvas(element, {
            onrendered: function (canvas) {
                image_data = canvas.toDataURL()
                //console.log(image_data)

                $.ajax({
                    url: '/forms/catchConfirm',
                    type: 'POST',
                    data: {
                        "imgData": image_data
                    },
                    success: function(data) {
                        document.location.href = '/'
                    }
                });
            }
        });
        

    });

//-----------------------------------------------------------//
//Back Buttons

    $("#NumbersBack").click(function (e) {
        $(".formcompany").show();
        $(".formporting").hide();
    });

    $("#TollBack").click(function (e) {
            $(".formporting").show();
            $(".formtoll").hide();
    });

    $("#911Back").click(function (e) {
        fillTollPort(function(data) {
            console.log("did back")
            $(".formtoll").show();
            $(".form911").hide();
        });
    });

    $("#411Back").click(function (e) {
        fill911(function(data){
            $(".form911").show();
            $(".form411").hide();
        });
    });


    $("#ExtBack").click(function (e) {
        $(".form411").show();
        $(".formext").hide();
    });

    $("#UploadBack").click(function (e) {
            $(".formext").show();
            $(".formupload").hide();
    });

    $("#ConfirmBack").click(function (e) {
        $(".formupload").show();
        $(".formconfirm").hide();
    });

});

