// wait until document loads and then call menus and toggleSelect
$(document).ready(function() {
	configureMenus();
	toggleSelect();
});


//function to control menu behavior based on screen size
function configureMenus() {
			// variable to hold current window state - small, medium, or large
			 var windowState = 'large';
			  
			  // check intital width of the screen, respond with appropriate menu
			 var sw = document.body.clientWidth;
			 if (sw < 481) {
				 smMenu();
			 } else if (sw >= 481 && sw <= 768) {
					 medMenu();
			 } else {
					 lgMenu();
				  };
			  
			  // take care of resizing the window
			  $(window).resize(function() {
				  var sw = document.body.clientWidth;
				  if (sw < 481 && windowState != 'small') {
					 smMenu();
				  }
				  if (sw > 480 && sw < 769 && windowState != 'medium') {
					 medMenu();
				  }  
				  if (sw > 768 && windowState != 'large') {
					 lgMenu();
				  } 
			  });

			function smMenu() {
			// since we may be switching from another menu, reset the menu first
			//unbind click and touch events    
			$('.menuToggle a').off('click');
			$('.topMenu h3').off('click touchstart');
			$('html').off('touchstart');
			$('#mainNav').off('touchstart');
			//reset the menu in case it's being resized from a medium screen    
			// remove any expanded menus
			$('.expand').removeClass('expand');
			$('.menuToggle').remove();
			//now that the menu is reset, add the toggle and reinitialize the indicator
			 $('.topMenu').before('<div class="menuToggle"><a href="#">menu<span class="indicator">+</span></a></div>');
			// append the + indicator
			 $('.topMenu h3').append('<span class="indicator">+</span>');
		
			// wire up clicks and changing the various menu states
			//using clicks instead of touch in case a smaller screen has a pointer device
			//first, let's deal with the menu toggle
			$('.menuToggle a').click(function() {
				//expand the menu
				$('.topMenu').toggleClass('expand');
				// figure out whether the indicator should be changed to + or -
				var newValue = $(this).find('span.indicator').text() == '+' ? '-' : '+';
				// set the new value of the indicator
				$(this).find('span.indicator').text(newValue);
			});
			
			//now we'll wire up the submenus
			$(".topMenu h3").click(function() {
				//find the current submenu
				var currentItem = $(this).siblings('.submenu');
				//remove the expand class from other submenus to close any currently open submenus
				$('ul.submenu').not(currentItem).removeClass('expand');
				//change the indicator of any closed submenus 
				$('.topMenu h3').not(this).find('span.indicator:contains("-")').text('+');
				//open the selected submenu
				$(this).siblings('.submenu').toggleClass('expand');
				//change the selected submenu indicator
				var newValue = $(this).find('span.indicator').text() == '+' ? '-' : '+';
				$(this).find('span.indicator').text(newValue);
			});
			//indicate current window state
			windowState = 'small';
		}
		
		function medMenu() {
			//reset the menu in case it's being resized from a small screen
			// unbind click events    
			$('.menuToggle a').off('click');
			$('.topMenu h3').off('click');
			// remove any expanded menus
			$('.expand').removeClass('expand');
			// remove the span tags inside the menu
			$('.topMenu h3').find('span.indicator').remove();
			// remove the "menu" element
			$('.menuToggle').remove();
			
			//check to see if the device supports touch
			//we'll use touch events instead of click as it will allow us
			//to support both a CSS-driven hover and touch enabled
			//menu for this screen range
			if ('ontouchstart' in document.documentElement)
			{
				//find all 'hover' class and strip them
				 $('.topMenu').find('li.hover').removeClass('hover');
				 //add touch events to submenu headings
				 $(".topMenu h3").bind('touchstart', function(e){
					//find the current submenu
					var currentItem = $(this).siblings('.submenu');
					//remove the expand class from other submenus to close any currently open submenus
					$('ul.submenu').not(currentItem).removeClass('expand');
					//open the selected submenu
					$(this).siblings('.submenu').toggleClass('expand');
				});
				//close submenus if users click outside the menu
				$('html').bind('touchstart', function(e) {
					$('.topMenu').find('ul.submenu').removeClass('expand');
				});
				//stop clicks on the menu from bubbling up
				$('#mainNav').bind('touchstart', function(e){
					e.stopPropagation();
			   });
			}
			//indicate current window state
			windowState = 'medium';
		}
		
		function lgMenu() {
			//largely what we'll do here is simple remove functionality that
			//may be left behind by other screen sizes
			//at this size the menu will function as a pure-css driven dropdown
			//advances in touch screen are beginning to make us re-think
			//this approach
			// unbind click and touch events    
			$('.menuToggle a').off('click');
			$('.topMenu h3').off('click touchstart');
			$('html').off('touchstart');
			$('#mainNav').off('touchstart');
			
			// remove any expanded submenus
			$('.topMenu').find('ul.submenu').removeClass('expand');
			
			// remove the span tags inside the menu
			$('.topMenu h3').find('span.indicator').remove();
			
			// remove the "menu" element
			$('.menuToggle').remove();
			
			//indicate current window state
			windowState = 'large';
		}
}


//function to swap ul menus for select elements at smaller screen sizes
function toggleSelect() {
	//establish the default window state
	var windowState = 'large';
	
	//check to see if the screen is smaller than 769 pixels
	$(document).ready(function() {
		var sw = document.body.clientWidth;
		if (sw < 769) {
		   smScreen();
		}
	})
	// take care of resizing the window
	$(window).resize(function() {
		var sw = document.body.clientWidth;
		if (sw < 769 && windowState == 'large') {
		   smScreen();
		} 
		if (sw > 768 && windowState == 'small') {
			lgScreen();
		}
	});
	//convert list menus to select elements
	function smScreen() {
		//find the ul you wish to change
		$('nav.archives ul').each(function() {
			//add a select element
			var $select = $('<select />');
			//add an initial choice for the select element and assign its attributes
			var $initial = $('<option>Choose a gallery</option>');
			$initial.attr({
				value: '#',
				selected: 'selected'
			});
			//add the initial choice to the select element
			$select.append($initial);
			//populate the select element with links from the list menu
			$(this).find('a').each(function() {
				//go through each link and create an option in the select for each one
				var $option = $('<option />');
				//populate the option with data from the links
				$option.attr('value', $(this).attr('href')).html($(this).html());
				$option.attr('title', $(this).attr('title'));
				//add each option to the select element
				$select.append($option);
			});
			//when an option is selected, navigate to the selected page
			$select.change(function() {
	  window.location = $(this).find("option:selected").val();
	});
			//target the ul and replace it with the generated select element
			$(this).replaceWith($select);
		});
		 //set the current window state to small
		  windowState = 'small';
	  };
	//convert select elements to list menus
	function lgScreen() {
		//target the select menu
	   $('nav.archives select').each(function() {
				//remove the initial selection option
				$(this).find(':first-child').remove();
				//create an unordered list
			   var $ul = $('<ul />');
			   //go through the select and cycle through each option
			   $(this).find('option').each(function() {
				   //for each option create a li and an anchor
				   var $li = $('<li />');
				   var $a = $('<a />');
				   //populate the anchor attributes from the option
				   $a.attr('href', $(this).attr('value')).html($(this).html());
				   $a.attr('title', $(this).attr('title'));
				   //add the li and anchors to the ul
				   $ul.append($li);
				   $li.append($a);
			   });
			   //replace the select with the generated ul
			   $(this).replaceWith($ul);
		   });
		   //set the current window state
		   windowState = 'large';
	  };
}