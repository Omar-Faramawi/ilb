$(document).ready(function(){
	/*Upload Avatar Handler*/
	$('a.upload-avatar-icon').on("click",function(){
		open_upload('uploadavatar');
	});

	/* off-canvas sidebar toggle */
	$('[data-toggle=offcanvas]').click(function() {
	    $(this).toggleClass('visible-xs text-center');
	    $(this).find('i').toggleClass('glyphicon-chevron-right glyphicon-chevron-left');
	    $('.row-offcanvas').toggleClass('active');
	    $('#lg-menu').toggleClass('hidden-xs').toggleClass('visible-xs');
	    $('#xs-menu').toggleClass('visible-xs').toggleClass('hidden-xs');
	    $('#btnShow').toggle();
	});

	/* Cancel uploading img */
	$('#cancelImg').click(function(){
		$('#target').attr('src',"");
		$("#upload").val("");
		$(this).hide();
	});

	/* Tag Suggestoins handlers */
	var showTagList = 0; // tag list flag, 1 means shown, 0 means not
	var atVar = 0; // length of the typed expression to the @ character
	$('#expressionarea').on('keyup',function(event){
		$('#status').removeClass('alert-success').removeClass('alert-danger').addClass('alert-info').html("Example: iLuv my brothers Sam and Zeek bcoz they are the best baseball players ever");
		var value = $(this).val();
		var lastCharTyped = value.charAt(value.length-1);
		var lastCharTypedPrefix = value.charAt(value.length-2);
		var firstCharTyped = value.charAt(0);
		if(event.keyCode == 13){
			// When pressing enter
			if($('#tag-area').is(':visible')){
				var active = $('#tag-area .list-group a.active');
				var userName = active.find('span#name').html();
				var at=value.lastIndexOf('@');
				var stringToTheAt=value.substring(0,at);
				var newValue=stringToTheAt+"@"+userName;
				$(this).val(newValue);
			}
		}
		if(lastCharTyped == " "){
			$('#tag-area').hide();
		}
		if(lastCharTyped == "@" && lastCharTypedPrefix == " ")
		{
			// if the last character typed is @
			$('#tag-area').show();
			atVar = value.length;
		}
		if($('#tag-area').is(':visible')){
			// if the tag list is already shown
			var afterAtVar = value.substring(atVar); // to get characters typed after the @ character
			if(event.keyCode == 40){
				// to handle the down arrow button
				var theActiveItem=$('#tag-area .list-group a.active');
				var itemNextToActive=theActiveItem.next('#tag-area .list-group a');
				if(itemNextToActive.attr('class')!=null){
					theActiveItem.removeClass('active');
					itemNextToActive.addClass('active');
				}
			}
			else if(event.keyCode == 38){
				// to handle the up arrow button
				var theActiveItem=$('#tag-area .list-group a.active');
				var itemPreviousToActive=theActiveItem.prev('#tag-area .list-group a');
				if(itemPreviousToActive.attr('class')!=null){
					theActiveItem.removeClass('active');
					itemPreviousToActive.addClass('active');
				}
			}
			else if(afterAtVar != ""){
				// request to the server to get the suggested members names for tagging
				$.ajax({
					url:'/tag',
					type:'POST',
					data:'string='+afterAtVar,
					success:function(data){
						var tagElements = "";
						for (var i = 0; i < data.names.length; i++){
							tagElements = tagElements + '<a href="#" class="list-group-item"><img class="img-circle" src="/img/' + data.ids[i] + '/40/40" /> <span id="name">' + data.names[i] + '</span></a>';
						}
						$('#tag-area .list-group').html(tagElements);
						$('#tag-area').show();
						$('#tag-area .list-group a:nth-child(1)').addClass("active");
					}
				});
			}
		}
	});

	/* Attach Handler for submission of express form*/
	$( '#expressform' ).on( 'submit', function() {
		if(jQuery.trim($('#expressionarea').val()) != ""){
			$('#express').hide();
			$('.l-c').show();
			loading('express');
			var formData = new FormData($(this)[0]);
			$.ajax({
			    url: "/express",
			    type: 'POST',
			    data: formData,
			    async: false,
			    success: function (data) {
			    	if(data.result == "Done"){
			    		$('#status').removeClass('alert-info').addClass('alert-success').html("Expression posted successfully !");
			    	}else{
			    		$('#status').removeClass('alert-info').addClass('alert-danger').html(data.result);
			    	}
			        $('#express').show();
		   			$('.l-c').hide();
			    },
			    cache: false,
			    contentType: false,
			    processData: false
			});
		}
		return false;
    });
	/* Attach Handler for submission of create collection form*/
	$( '#collectionform' ).on( 'submit', function() {
		if(jQuery.trim($('#title').val()) != "" && jQuery.trim($('#des').val()) != "" && $('#cCover').val() != ""){
			$('#cCollection').hide();
			$('.l-c').show();
			loading('collection');
			var formData = new FormData($(this)[0]);
			/*$.ajax({
			    url: "/express",
			    type: 'POST',
			    data: formData,
			    async: false,
			    success: function (data) {
			    	if(data.result == "Done"){
			    		$('#status').removeClass('alert-info').addClass('alert-success').html("Expression posted successfully !");
			    	}else{
			    		$('#status').removeClass('alert-info').addClass('alert-danger').html(data.result);
			    	}
			        $('#express').show();
		   			$('.l-c').hide();
			    },
			    cache: false,
			    contentType: false,
			    processData: false
			});*/
		}
		return false;
    });

    /* Handlers for remove-membership */
    $('a#remove-member').on('click', function(){
    	var confirmDiv = $(this).next();
    	$(this).hide();
    	confirmDiv.show();
    });
    $('a#not-sure').on('click', function(){
    	$(this).parent().hide();
    	$(this).parent().prev().show();
    });
    $('a#sure').on('click', function(){
    	$(this).hide();
    	$(this).next().hide();
    	$(this).next().next().show();
    	loading();
    	var userId = $(this).attr('i');
    	$.ajax({
    		url: '/remove-member',
    		type: 'POST',
    		data: 'id=' + userId,
    		success:function(data){
    			if(data.result == "removed"){
    				$('div#member-badge[i="'+userId+'"]').fadeOut();
    			}else{
    				$(this).parent().html(data.result);
    			}
    		}
    	});
    });
});
function avatarControl(input){
	$('a.upload-avatar-icon').hide();
	//readURL(input);
	if(input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('img#target2').attr('src', e.target.result);
		}
		reader.readAsDataURL(input.files[0]);
		$('#submitavatar').show();
	}
}
/* For Expression Upload Image */
function readURL(input) {
	if(input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('img#target').attr('src', e.target.result);
		}
		reader.readAsDataURL(input.files[0]);
		$('#cancelImg').show();
	}
}

/* Loadig bar */
var color = ["#017ec4", "#82b440", "#DF3636"];
var colorKey = -1;
function loading(element){
    if(colorKey == 2){
        colorKey = -1;
    }
    colorKey++;
    $('.l-c#'+element).css('background-color', color[colorKey]);
    $('.l-c#'+element).animate({
        width: "+=30"
    },500,function(){
        $(this).css('width','0px');
        loading(element);
	});
}

function open_upload(element){
	$('#'+element).click();
}
