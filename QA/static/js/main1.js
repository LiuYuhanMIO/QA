$(document).ready(function(){

	$box = $('.content');
	$ht = $box.height()+175;
	$win_ht = $(window).height();

	if ($win_ht>$ht) {
		$box.css({
			'left' : '50%',
			'top' : '50%',
			'margin-left' : -$box.width()/2 + 'px',
			'margin-top' : -$ht/2 + 'px'
		});
	}else{
		$box.css({
			'left' : '50%',
			'margin-left' : -$box.width()/2 + 'px',
			'margin-top' : '60px',
			'margin-bottom' : '60px'
		});
	}

	$('#sub_form').submit(function(){
			submit_icons('icon', 'loading');
	})

	if($('#sub_form').length){
		$('#sub_form').ajaxChimp({
		    callback: bcFunction
		});
	}
	
	function bcFunction (resp) {
   		if (resp.result === 'success') {
			submit_icons('loading', 'icon');
	        show_tooltip('OK');
	        $('#sub_form #mc-email').val('');
	    }else{
			submit_icons('loading', 'icon');
	        show_tooltip('邮箱验证');
	    }
	}

	//show and hide loading icon
	function submit_icons(hide, show){
			$('#mc_submit i').removeClass(hide);
			$('#mc_submit i').addClass(show);
	}

	//Show ToolTip
    function show_tooltip(msg){

    	if ($(".tooltip").length){
	    	$(".tooltip").remove(); 
	    }

        $('.subscription_form').append('<span class="tooltip"></span>');
        
        var tooltip = $(".tooltip");
        tooltip.append(msg);
         
        var tipwidth = tooltip.outerWidth();
        var a_width = $('.subscription_form').width();
        var a_hegiht = $('.subscription_form').height() + 10;

        var tipwidth = ( a_width- tipwidth)/2;
        $('.tooltip').css({
            'left' : tipwidth + 'px',
            'bottom' : a_hegiht + 'px'
        }).stop().animate({
            opacity : 1
        }, 300);

        setTimeout(function(){
        	hide_tooltip();
        }, 2000);
       
	}

	//Hide ToolTip
	function hide_tooltip(){

		var tooltip = $(".tooltip"); 
		 tooltip.animate({
            opacity : 0
        }, 300, function(){
        	tooltip.remove();
        });

	}

    //code for the background slider
	$.backstretch([
      "static/img/bg_img.jpg"
    ], {
        fade: 750,
        duration: 2500
    });

    Bmob.initialize("c53be0ddb90567a5", "123456");
	Bmob.debug(true);
});
