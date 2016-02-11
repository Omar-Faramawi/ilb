$(document).ready(function(){
	$("input").focusin(function(){
		if(jQuery.trim($(this).val()) == "You missed this !!"){
			$(this).css('color','#555');
			$(this).val("");
		}
	});
	$("input[name='email']").focusin(function(){
		if(jQuery.trim($("input[name='username']").val()) == ""){
			$("input[name='username']").css('color','#DF3636');
			$("input[name='username']").val('You missed this !!');
		}
	});
	$("input[name='password']").focusin(function(){
		if(jQuery.trim($("input[name='username']").val()) == ""){
			$("input[name='username']").css('color','#DF3636');
			$("input[name='username']").val('You missed this !!');
		}
		if(jQuery.trim($("input[name='email']").val()) == ""){
			$("input[name='email']").css('color','#DF3636');
			$("input[name='email']").val('You missed this !!');
		}
	});
	$("span[type='colorbtn']").on('click',function(){
		$("input[name='color']").val($(this).attr('val'));
		$("span#colorid").text(" : "+$(this).attr('val'));
	});
	$('#submit').on('click',function(){
		var username=jQuery.trim($("input[name='username']").val());
		var email=jQuery.trim($("input[name='email']").val());
		var password=jQuery.trim($("input[name='password']").val());
		var color=jQuery.trim($("input[name='color']").val());

		if(username != "" && email != "" && password != "" && color != ""){
			$("form[name='signup']").submit();
		}else{
			$('span#error_span').text("Please fill all the required information");
		}
	});

});