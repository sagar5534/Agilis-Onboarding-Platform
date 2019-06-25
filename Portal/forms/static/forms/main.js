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

function PromptNewAddress(period) {
    if (period == "0") {
        document.getElementById('NewAddress').style.display = "block"
    } else {
        document.getElementById('NewAddress').style.display = "none"
    }
}


function getAddress(element) {

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
            if (element != 'SelectAddress2'){
                document.getElementById(element).innerHTML += '<option value=0>Add a new Address</option>'
            }

        });
}


function getPhone(element) {

    $.ajax({
            url: '/forms/getPhone',
            data: {},
            method: 'POST',
        })
        .done(function (data) {
            document.getElementById(element).innerHTML = ""
            
            if (element == "SelectPhone2"){
                document.getElementById(element).innerHTML += '<option value="0">---------</option>'
            }
            for (x in data.phone) {
                document.getElementById(element).innerHTML += '<option value=' + data.phone[x].id + '>' + data.phone[x].phone + '</option>'
            }

        });
}


let portId = 1;
let discId = 1;

function removePortNumber(x) {
    document.getElementById("portnumber" + x).remove();
    document.getElementById("portremoveNumber" + x).remove();
    document.getElementById("portbr" + x).remove();
}

function removeDiscNumber(x) {
    document.getElementById("discnumber" + x).remove();
    document.getElementById("discremoveNumber" + x).remove();
    document.getElementById("discbr" + x).remove();
}

function addPortNumber() {
    portId++;
    $('#portnumberForm').append("<br id='portbr" + portId + "'><input id=portnumber" + portId + " name='phone' type='text'><button id='portremoveNumber" + portId + "' type=button onclick='removePortNumber(" + portId + ")'>X</button>");
}

function addDiscNumber() {
    discId++;
    $('#discnumberForm').append("<br id='discbr" + discId + "'><input id=discnumber" + discId + " name='phone' type='text'><button id='discremoveNumber" + discId + "' type=button onclick='removeDiscNumber(" + discId + ")'>X</button>");
}

function validatePhone(val) {
    var x = val
    x = x.replace('+1', '');
    x = x.replace(/[-+()\s]/g, '');
    return x;
}

let ruleID = 1;

var nums = {

    "647": "89 Bleasdale"
}

var output = ""
for (var property in nums) {
    output += nums[property] + '\n';
}
console.log(output)

function addRule() {
    
    var phone = document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].value
    
    if (phone != "0"){
        var phone = document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].text
        var address = document.getElementById("SelectAddress3").options[document.getElementById("SelectAddress3").selectedIndex].text

        document.getElementById('RulesTable').innerHTML += '<tr id="rule' + document.getElementById("SelectPhone2").selectedIndex + '">' +
                                                                '<td>' + phone + '</td>' + 
                                                                '<td>' + address + '</td>' +
                                                                '<td>' +
                                                                    '<button type=button onclick="removeRule(' + document.getElementById("SelectPhone2").selectedIndex + ')">X</button>' +
                                                                '</td>' +
                                                            '</tr>'

        nums.push({num : 3, app:'helloagain_again',message:'yet another message'});

        document.getElementById("SelectPhone2").options[document.getElementById("SelectPhone2").selectedIndex].disabled = true;
        document.getElementById("SelectPhone2").selectedIndex = 0;
    }
    
}

function removeRule(id){
    
    document.getElementById("SelectPhone2").options[id].disabled = false;
    document.getElementById("rule" + id).remove();
    
}

$(document).ready(function () {
    
    //For Step 2 --- Yes or No for Directory Listing
    $("input:radio[name='option']").click(function () {
        var radioValue = $("input[name='option']:checked").val();
        if (radioValue == 1) {
            document.getElementById('CompanyName411').disabled = false;
            document.getElementById('Category').disabled = false;
            document.getElementById('phone').disabled = false;
            document.getElementById('SelectAddress').disabled = false;
            document.getElementById('SelectPhone').disabled = false;
            PromptNewAddress(document.getElementById("SelectAddress").options[document.getElementById("SelectAddress").selectedIndex].value)
            PromptNewPhone(document.getElementById("SelectPhone").options[document.getElementById("SelectPhone").selectedIndex].value)

        } else {
            document.getElementById('NewAddress').style.display = "none"
            document.getElementById('CompanyName411').value = '';
            document.getElementById('CompanyName411').disabled = true;
            document.getElementById('Category').disabled = true;
            document.getElementById('phone').disabled = true;
            document.getElementById('SelectAddress').disabled = true;
            document.getElementById('SelectPhone').disabled = true;
        }
    });

});