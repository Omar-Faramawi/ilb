$(document).ready(function (){
	$("input").focusin(function(){
		if(jQuery.trim($(this).val()) == "You missed this !!"){
			$(this).css('color','#555');
			$(this).val("");
		}
	});
	$("input[name='password']").focusin(function(){
		if(jQuery.trim($("input[name='email']").val()) == ""){
			$("input[name='email']").css('color','#DF3636');
			$("input[name='email']").val("You missed this !!");
		}
	});
	$('#submit').on('click', function(){
		var usernameoremail=jQuery.trim($("input[name='email']").val());
		var password=jQuery.trim($("input[name='password']").val());
		if(usernameoremail != "" && password != ""){
			$("form[name='login']").submit();
		}else{
			$("span#error").text("Please fill all the required information");
		}
	});
});