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
            if (element == "SelectPhone2") {
                document.getElementById(element).innerHTML += '<option value="0">---------</option>'

            }
            for (x in data.phone) {
                document.getElementById(element).innerHTML += '<option value=' + data.phone[x].id + '>' + data.phone[x].phone + '</option>'
            }

            callback(data.phone);
        });
}


//Global Vars for Numbers - Form 
let portId = 0;
let discId = 0;

//Both Functions are for Numbers - Forms 
//Functions to remove Port Number
function removePortNumber(x) {
    //document.getElementById("portnumber" + x).remove();
    //document.getElementById("portremoveNumber" + x).remove();
    document.getElementById("portid" + x).remove();
}

//Functions to remove Disc Number
function removeDiscNumber(x) {
    //document.getElementById("discnumber" + x).remove();
    //document.getElementById("discremoveNumber" + x).remove();
    document.getElementById("discid" + x).remove();
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
    document.getElementById("DiscNumber").value = ""
}


//Function to validate a phone number
function validatePhone(val) {
    var x = val
    x = x.replace('+1', '');
    x = x.replace(/[-+()\s]/g, '');
    return x;
}


//Global Vars for 911 Info 
var normalRules = {}
var ExceptionRules = {}


//Creating the rule table on page startup 911 Info - Forms
function createRuleTable(phone, address) {
    Object.keys(phone).forEach(function (key) {
        normalRules[phone[key].id] = {
            phoneID: phone[key].id,
            addressID: address[0].id,
            phone: phone[key].phone,
            address: address[0].address
        }

        document.getElementById('RulesTable').innerHTML += "<div class='grid-entry'>" + 
        "<div id='w-node-7ad72b18e096-37815fb7' class='form-grid-entry'>" + phone[key].phone + "</div>" +
        "<div class='form-grid-entry'>" + address[0].address + "</div>" +
        "</div>"

    });

    console.log(normalRules)
}


//Adding a Rule into 911 Info - Forms
function addRule() {

    var phoneID = document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].value
    var addressID = document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].value
    console.log(document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].text)
    if (phoneID != "0") {
        var phone = document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].text

        if (addressID != '0') {

            var address = document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].text

            document.getElementById('ExceptionsTable').innerHTML += '<tr id="exception' + phoneID + '">' +
                '<td>' + phone + '</td>' +
                '<td>' + address + '</td>' +
                '<td>' +
                '<button type=button onclick="removeRule(' + phoneID + ', ' + document.getElementById("SelectPhone2").selectedIndex + ')">X</button>' +
                '</td>' +
                '</tr>'

            ExceptionRules[document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].value] = {
                phoneID: document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].value,
                phone: document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].text,
                addressID: document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].value,
                address: document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].text
            }

            delete normalRules[phoneID]
            document.getElementById("rule" + phoneID).remove();

            document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].disabled = true;
            document.getElementById("SelectPhone2").selectedIndex = 0;
        } else {
            //Create a new address
            data = {
                Suite: document.getElementById("Suite3").value,
                StreetNum: document.getElementById("street_number3").value,
                Street: document.getElementById("route3").value,
                City: document.getElementById("locality3").value,
                Prov: document.getElementById("administrative_area_level_13").value,
                Postal: document.getElementById("postal_code3").value,
                Country: document.getElementById("country3").value,
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
                        getAddress('SelectAddress3', function (address) {
                            document.getElementById("SelectAddress3").selectedIndex = address.length - 1;
                            addRule()
                            document.getElementById('NewAddress3').style.display = "none"
                        });
                    }
                });
        }
    }
}


//Removing an Exception from 911 Info - Forms
function removeRule(id, location) {

    var addressID = document.getElementById("SelectAddress2").options[document.getElementById("SelectAddress2").selectedIndex].value
    var address = document.getElementById("SelectAddress2").options[document.getElementById("SelectAddress2").selectedIndex].text

    normalRules[id] = {
        phoneID: ExceptionRules[id].phoneID,
        addressID: addressID,
        phone: ExceptionRules[id].phone,
        address: address
    }

    document.getElementById('RulesTable').innerHTML += '<tr id="rule' + normalRules[id].phoneID + '">' +
        '<td>' + normalRules[id].phone + '</td>' +
        '<td>' + normalRules[id].address + '</td>' +
        '</tr>'

    delete ExceptionRules[id]
    document.getElementById("SelectPhone2").options[location].disabled = false;
    document.getElementById("exception" + id).remove();

    console.log(ExceptionRules)
    console.log(normalRules)

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

//Instructions that occur once document is ready
$(document).ready(function () {

    $('#SelectAddress411').change(function () {
        PromptNewAddress('411')
    }); 

    $('#SelectAddressExc911').change(function () {
        PromptNewAddress('Exc911')
    }); 

    //A main site is changed on 911 Info - Form
    $("#SelectAddress2").change( function(e){
        e.preventDefault();
        document.getElementById('RulesTable').innerHTML = "<tr><th>Phone</th><th>Address</th><th></th></tr>"
    
        Object.keys(normalRules).forEach(function (key) {
            normalRules[key] = {
                phone: normalRules[key].phone,
                phoneID: normalRules[key].phoneID,
                address: document.getElementById("SelectAddress2").options[document.getElementById("SelectAddress2").selectedIndex].text,
                addressID: document.getElementById("SelectAddress2").options[document.getElementById("SelectAddress2").selectedIndex].value
            }

            document.getElementById('RulesTable').innerHTML += '<tr id="rule' + normalRules[key].phoneID + '">' +
                '<td>' + normalRules[key].phone + '</td>' +
                '<td>' + normalRules[key].address + '</td>' +
                '</tr>'
        });
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


    //Showing Screens
    $(".formcompany").hide();
    $(".formporting").hide();


    getAddress('SelectAddress411', function () {})
    getPhone('SelectPhone411', function () {})

    $(".form411").hide();

    getAddress("SelectAddress911", function (address) {
        getPhone("SelectPhoneExc911", function (phone) {
            createRuleTable(phone, address);
        });
    });
    getAddress("SelectAddressExc911")


    $(".form911").show();
    $(".formext").hide();
    $(".formupload").hide();
    $(".formconfirm").hide();

    //Company Info
    $(".companyFormNext").submit(function (e) {
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
    $(".portingFormNext").submit(function (e) {
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



});

