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
            document.getElementById(element).innerHTML = ""

            for (x in data.address) {
                document.getElementById(element).innerHTML += '<option value=' + data.address[x].id + '>' + data.address[x].address + '</option>'
            }
            if (element == 'SelectAddress411' || element == 'SelectAddressExc911') {
                document.getElementById(element).innerHTML += '<option value=0>Add a new Address</option>'
            }

            if (element == 'SelectAddress411') {
                window.RuleAddress = data.address;
            }

            callback(data.address);
        });
};

//Function to getPhone
function getPhone(element, callback) {

    $.ajax({
            url: '/forms/getPhone',
            data: {},
            method: 'POST',
        })
        .done(function (data) {
            document.getElementById(element).innerHTML = ""
            
            console.log(data)
            //RulePhone = data.phone
            if (element == "SelectPhoneExc911") {
                document.getElementById(element).innerHTML += '<option value="0">---------</option>'

            }
            for (x in data.phone) {
                document.getElementById(element).innerHTML += '<option value=' + data.phone[x].id + '>' + data.phone[x].phone + '</option>'
            }

            callback(data.phone);
        });
}
//-----------------------------------------------------------//



//-----------------------------------------------------------//
//Global Vars for Numbers - Form 
let portId = 0;
let discId = 0;
let extId = 0;

//Both Functions are for Numbers - Forms 
//Functions to remove Port Number
function removePortNumber(x) {
    //document.getElementById("portnumber" + x).remove();
    //document.getElementById("portremoveNumber" + x).remove();
    document.getElementById("portid" + x).remove();
    portNumbers[x] = null
    console.log(portNumbers)
}

//Functions to remove Disc Number
function removeDiscNumber(x) {
    //document.getElementById("discnumber" + x).remove();
    //document.getElementById("discremoveNumber" + x).remove();
    document.getElementById("discid" + x).remove();
    discNumbers[x] = null
    console.log(discNumbers)
}

//Functions to Add a Port Number
function addPortNumber() {

    console.log("AddPortNumber")
    var x = document.getElementById("PortNumber").value
    portId++;
    $('#numbersPort').append("<div class='div-block-17 w-clearfix' id='portid" + portId + "'>"
    + "<div class='text-block-14'>#</div>"
    + "<div class='form-number'>" + x + "</div>"
    + "<a class='form-x-btn w-button' onclick='removePortNumber(" + portId + ")'>X</a></div>")
    
    portNumbers[portId] = x

    document.getElementById("PortNumber").value = ""

}

//Function to Add a Disconnect Number
function addDiscNumber() {

    console.log("AddPortNumber")
    var x = document.getElementById("DiscNumber").value
    discId++;    
    $('#numbersDisc').append("<div class='div-block-17 w-clearfix' id='discid" + discId + "'>"
    + "<div class='text-block-14'>#</div>"
    + "<div class='form-number'>" + x + "</div>"
    + "<a class='form-x-btn w-button' onclick='removeDiscNumber(" + discId + ")'>X</a></div>")

    discNumbers[discId] = x

    document.getElementById("DiscNumber").value = ""
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

    console.log(normalRules)
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
            document.getElementById("rule" + phoneID).remove();

            document.getElementById("SelectPhoneExc911").options[document.getElementById("SelectPhoneExc911").selectedIndex].disabled = true;
            document.getElementById("SelectPhoneExc911").selectedIndex = 0;
        } else {
            //Create a new address
            data = {
                Suite: document.getElementById("Suite-Exc911").value,
                StreetAddress: document.getElementById("GoogleAddress-Exc911").value,
                Postal: document.getElementById("postal_codeExc911").value,
                Country: document.getElementById("countryExc911").value,
            }

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
                        console.log("done")
                        getAddress('SelectAddressExc911', function (address) {
                            document.getElementById("SelectAddressExc911").selectedIndex = address.length - 1;
                            addRule()
                            document.getElementById('NewAddressExc911').style.display = "none"
                        });
                    }
                });
        }
    }
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
    document.getElementById("SelectPhoneExc911").options[location].disabled = false;
    document.getElementById("exception" + id).remove();

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
    console.log("PrompNewAddress" + id)
    var sel = "SelectAddress" + id

    var address = document.getElementById(sel).options[document.getElementById(sel).selectedIndex].value;
    if (address == "0") {
        //Clear
        document.getElementById("postal_code" + id).value = ""
        document.getElementById("country" + id).value = ""
        document.getElementById("Suite-" + id).value = ""
        document.getElementById("GoogleAddress-" + id).value = ""

        //Enable
        document.getElementById("postal_code" + id).disabled = false;
        document.getElementById("country" + id).disabled = false;
        document.getElementById("Suite-" + id).disabled = false;
        document.getElementById("GoogleAddress-" + id).disabled = false;
        //Show
        document.getElementById('NewAddress' + id).style.display = "block"

    } else {
        //Hide
        document.getElementById('NewAddress' + id).style.display = "none"
        //Enable
        document.getElementById("postal_code" + id).disabled = true;
        document.getElementById("country" + id).disabled = true;
        document.getElementById("Suite-" + id).disabled = true;
        document.getElementById("GoogleAddress-" + id).disabled = true;
    }
}

//-----------------------------------------------------------//

 
//Instructions that occur once document is ready
$(document).ready(function () {


//-----------------------------------------------------------//
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

            document.getElementById('RulesTable').innerHTML += "<div class='grid-entry'>" + 
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

        console.log(normalRules)
    });
    
     //Does user want to be listed in 411 Directory - 411 Directory - Forms
    $("input:radio[name='411-Directory']").click(function () {
        var radioValue = $("input[name='411-Directory']:checked").val();
        console.log(radioValue)
        if (radioValue == 'Yes') {
            document.getElementById('CompanyNameList').disabled = false;
            document.getElementById('Category411').disabled = false;
            document.getElementById('SelectAddress411').disabled = false;
            document.getElementById('SelectPhone411').disabled = false;
            PromptNewAddress("411")
            document.getElementById('411Box').display = "Block";

        } else {
            document.getElementById('CompanyNameList').value = '';
            document.getElementById('Category411').value = '';
            document.getElementById('CompanyNameList').disabled = true;
            document.getElementById('Category411').disabled = true;
            document.getElementById('SelectPhone411').disabled = true;
            document.getElementById('SelectAddress411').disabled = true;
            document.getElementById('411Box').style.display = "none";

        }
    });

    $("#addExt").click(function () {
        
        document.getElementById('accordian-wrapper').innerHTML += "<div class='accordian-item' id='Ext'" + extId + ">"
                + "<div data-w-id='b0bea07e-42c7-1040-d18f-66f6ec874e03' class='accordian-trigger w-clearfix'>"
                +    "<h5 class='tigger-header'># 4566 - Sagar Patel<br></h5><a href='#' class='form-x-btn w-button'>X</a>"
                +"</div>"
                +"<div style='height:0PX' class='accordian-content'>"
                +  "<div class='form-heading-8'>Create a 4 Digit Extension Number</div>"
                +  "<input type='number' class='form-field w-input' maxlength='256' name='ExtNumber' data-name='ExtNumber' placeholder='Extension Number' id='ExtNumber' required=''>"
                +  " <div class='div-block-33 ext'>"
                +       "<div>Error</div>"
                +   "</div>"
                +   "<div class='form-heading-8'>User for this Extension Number</div>"
                +   "<input type='text' class='form-field w-input' maxlength='256' name='ExtName' data-name='ExtName' placeholder='User&#x27;s Name' id='ExtName' required=''>"
                +   "<div class='form-heading-8'>Caller ID Name</div>"
                +   "<select id='ExtCallerID' name='ExtCallerID' data-name='ExtCallerID' required='' class='form-select w-select'>"
                +       "<option value=''>Select one...</option>"
                +       "<option value='First'>Company Name</option>"
                +       "<option value='custom'>Custom Name</option>"
                +   "</select>"
                +   "<input type='text' class='form-field w-input' maxlength='256' name='CustomCallerID' data-name='CustomCallerID' placeholder='Caller ID Name' id='CustomCallerID' required=''>"
                +   "<div class='form-heading-8'>Caller ID Phone Number</div>"
                +   "<select id='ExtCallerNumber' name='ExtCallerNumber' data-name='ExtCallerNumber' class='form-select w-select'>"
                +       "<option value=''>Select one...</option>"
                +       "<option value='First'>First Choice</option>"
                +       "<option value='Second'>Second Choice</option>"
                +   "</select>"
                +   "<input type='tel' class='form-field w-input' maxlength='256' name='CustomCallerNumber' data-name='CustomCallerNumber' placeholder='Caller ID Phone Number' id='CustomCallerNumber' required=''>"
                +   "<div class='form-heading-8'>Would you like Voicemail for this Extension?</div>"
                +   "<div class='div-block-23'>"
                +      "<label class='w-radio'>"
                +          "<input type='radio' data-name='ExtVoicemail' id='Yes' name='ExtVoicemail' value='Yes' required='' data-w-id='14e89844-9a87-ce92-3d00-5d3f58c3e8c2' class='w-radio-input'><span for='Yes' class='w-form-label'>Yes</span></label>"
                +       "<label class='radio-button-field-2 w-radio'>"
                +           "<input type='radio' data-name='ExtVoicemail' id='No' name='ExtVoicemail' value='No' data-w-id='e0a5d27c-e8c1-c3a9-0430-4b939c9bc02f' class='w-radio-input'><span for='No' class='w-form-label'>No</span></label>"
                +   "</div>"
                +   "<div data-w-id='762d5bde-f86c-3acb-bf97-a700c63c9cb3' style='opacity:0;height:0PX' class='div-block-32'>"
                +      "<div class='form-heading-8'>Type of Voicemail</div>"
                +       "<div class='div-block-23'>"
                +           "<label class='w-radio'>"
                +               "<input type='radio' data-name='ExtVoicemailEmail' id='Yes' name='ExtVoicemailEmail' value='Yes' required='' class='w-radio-input'><span for='Yes-2' class='w-form-label'>Voicemail via Phone</span></label>"
                +           "<label class='radio-button-field-2 w-radio'>"
                +              " <input type='radio' data-name='ExtVoicemailEmail' id='No' name='ExtVoicemailEmail' value='No' class='w-radio-input'><span for='No-2' class='w-form-label'>Voicemail via Email</span></label>"
                +      "</div>"
                +       "<input type='email' class='form-field w-input' maxlength='256' name='VoicemailEmail' data-name='VoicemailEmail' placeholder='Email for Voicemail' id='VoicemailEmail' required=''>"
                +   "</div>"
                +"</div>"
                +"</div>"




    });
 //-----------------------------------------------------------//


    //Showing Screens
    $(".formcompany").show();
    $(".formporting").hide();

    //TEMP
    getAddress('SelectAddress411', function () {})
    getPhone('SelectPhone411', function () {})

    $(".form411").hide();

    //TEMP
    getAddress("SelectAddress911", function (address) {
        getPhone("SelectPhoneExc911", function (phone) {
            createRuleTable(phone, address);
        });
    });
    getAddress("SelectAddressExc911")


//-----------------------------------------------------------//

    $(".form911").hide();
    $(".formext").hide();
    $(".formupload").hide();
    $(".formconfirm").hide();

//-----------------------------------------------------------//
    //Company Info
    $("#companyFormNext").submit(function (e) {
        e.preventDefault();
        $.ajax({
                url: '/forms/catch',
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

        var formCorrect = true;

        
        // var div = document.getElementById('numbersPort')
        // var children = div.childNodes;
        // var elements = [];
        // for (var i = 0; i < div.childNodes.length; i++) {
        //     var child = div.childNodes[i];
        //     if (child.name == 'phone') {
        //         if (!(child.value == "")) {
        //             child.value = validatePhone(child.value)
        //             if (child.value.length == 10 && (/^\d+$/.test(child.value))) {
        //                 elements.push(child.value)
        //             } else {
        //                 formCorrect = false;
        //                 break;
        //             }
        //         }
        //     }
        // }

        // var div = document.getElementById('discnumberForm')
        // var children = div.childNodes;
        // var discelements = [];
        // for (var i = 0; i < div.childNodes.length; i++) {
        //     var child = div.childNodes[i];
        //     if (child.name == 'phone') {
        //         if (!(child.value == "")) {
        //             child.value = validatePhone(child.value)
        //             if (child.value.length == 10 && (/^\d+$/.test(child.value))) {
        //                 discelements.push(child.value)
        //             } else {
        //                 formCorrect = false;
        //                 break;
        //             }
        //         }
        //     }
        // }

        if (formCorrect == true) {
            //Data
            let Data = {
                port: elements,
                disc: discelements
            }

            $.ajax({
                    url: '/forms/catch2',
                    data: JSON.stringify(Data),
                    contentType: "application/json",
                    method: 'POST'
                })
                .done(function (data) {
                    if (data.status == "form-invalid") {
                        alert(data.formerrors.Phone411)
                    } 
                    else {
                        getAddress('SelectAddress', function () {
                            $('#SelectAddress').on('change', PromptNewAddress(''))
                        })
                        getPhone('SelectPhone', function () {})
                       
                        $(".step2").hide();
                        $(".step3").show();
                    }
                });
        } else {
            alert("Please enter a Valid Phone Number")
        }

    });

    //411 Info
    $(".411FormNext").submit(function (e) {

        if (document.getElementById('radio-yes').checked == true) {
            if (document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value == 0) {
                data = {
                    CompanyName411: document.getElementById('CompanyName411').value,
                    Category: document.getElementById('Category').value,
                    Phone411: document.getElementById("SelectPhone").options[document.getElementById("SelectPhone").selectedIndex].text,
                    Suite: document.getElementById("Suite2").value,
                    StreetNum: document.getElementById("street_number2").value,
                    Street: document.getElementById("route2").value,
                    City: document.getElementById("locality2").value,
                    Prov: document.getElementById("administrative_area_level_12").value,
                    Postal: document.getElementById("postal_code2").value,
                    Country: document.getElementById("country2").value,
                }
            } else {
                data = {
                    CompanyName411: document.getElementById('CompanyName411').value,
                    Category: document.getElementById('Category').value,
                    Phone411: document.getElementById("SelectPhone").options[document.getElementById("SelectPhone").selectedIndex].text,
                    address: document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value
                }
            }
        } else {
            data = {
                ignore: 1
            }
        }

        e.preventDefault();
        $.ajax({
                url: '/forms/catch3',
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
                    getAddress("SelectAddress2", function (address) {
                        getPhone("SelectPhone2", function (phone) {
                            createRuleTable(phone, address);
                            
                        });
                    });

                    $(".step3").hide();
                    $(".step4").show();
                    getAddress('SelectAddress3', function(){
                        $('#SelectAddress3').on('change', PromptNewAddress('3'))
                    })
                }
            });
    });

    //911 Info 
    $(".step4").submit(function (e) {

        data = merge_options(normalRules, ExceptionRules)

        e.preventDefault();
        $.ajax({
                url: '/forms/catch4',
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
                    $(".step4").hide();
                    //addExt()
                    $(".step5").show();
                }
            });
    });

     
    $(".step5").submit(function (e) {

        data = merge_options(normalRules, ExceptionRules)

        e.preventDefault();
        $.ajax({
                url: '/forms/catch4',
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
                    $(".step5").hide();
                }
            });
    });
//-----------------------------------------------------------//

});

