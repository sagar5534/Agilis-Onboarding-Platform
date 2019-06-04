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
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


$(document).ready(function()
{   
    $(".step1").hide();
    $(".step2").show();
    $(".step3").hide();
    
    $(".step1").submit(function(e)
    {
        e.preventDefault();
        
        $.ajax({
           url : '/echo/html/',
           data : { name : $(".step1").children("input[name='username']").val(), html : 'test' },
           method : 'POST'
       })
       .done(function(data)
       {
           $(".step2").show();
           $(".step1").hide();
       });
    });

    $(".step2").submit(function(e)
    {
        e.preventDefault();
        
        $.ajax({
           url : '/forms/1/catch',
           data : 
           { 
            email : $(".step2").children("input[name='email']").val(),
           },
           method : 'POST'
       })
       .done(function(data)
       {
           $(".step3").show();
           $(".step2").hide();
       });
    });

    $(".step3").submit(function(e)
    {
        e.preventDefault();
        
        $.ajax({
           url : '/echo/html/',
           data : { phone : $(".step3").children("input[name='phone']").val(), html : 'test' },
           method : 'POST'
       })
       .done(function(data)
       {
           $(".step3").hide();

           // We're done :)
       });
    });
});