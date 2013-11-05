 /**************************************************************************\
 *																			*
 \**************************************************************************/


(function($) 
{
	$.fn.docker = function(options)
	{
		var elements = this;
		var defaults = {
			top: function(){return $(window).scrollTop()},
			bottom: function(){return $(window).scrollTop() + $(window).height()},
			height: function(){return $(this).outerHeight();}
		}
		options = $.extend({}, defaults, options);



		elements.not('.docker-inited').each(function()
		{
			var $this = $(this);

			if (options.init)
			{
				options.init.apply(this);
			}

			var classes = ['docker-wrapper']
			if ($this.attr('class'))
			{
				classes = classes.concat($this.attr('class').match(/((docker\-)+\w+)/g));
			}	

			var $floater = $('<div>').addClass('docker-floater');
			var $wrapper = $('<div>').addClass(classes.join(' ')).append($floater);

			$this.addClass('docker-inited');
			$this.wrap($wrapper);

			setDimensions($this);
			setPosition($this);
			setVisible($this);

			$(window).bind('scroll.docker', function()
			{
				setVisible($this);
			});

			$(window).bind('resize.docker', function()
			{
				setDimensions($this);
				setPosition($this);
				setVisible($this);
			});
		});

		function value(obj, apply)
		{
			return !!(obj && obj.constructor && obj.call && obj.apply) ? (apply ? obj.apply(apply) : obj()) : obj;
		}

		function setDimensions(el)
		{
			var flush = {width: '', height: ''}
			el.parent().css(flush).parent().css(flush).removeClass('docked');
			el.parent().css({width: el.outerWidth(), height: value(options.height, el)}).parent().css({width: el.outerWidth(), height: value(options.height, el)});
		}

		function setPosition(el)
		{
			if (el.hasClass('docker-top'))
			{
				el.parent().css('top', value(options.top));
			}
			else if (el.hasClass('docker-bottom'))
			{
				el.parent().css('bottom', 0);
			}
		}

		function setVisible(el)
		{
			$wrapper = el.parent().parent();
			$wrapper.toggleClass('docked',
				($wrapper.hasClass('docker-top') && (value(options.top) > ($wrapper.offset().top - $(window).scrollTop())))
				||
				($wrapper.hasClass('docker-bottom') && (value(options.bottom) < ($wrapper.offset().top + $wrapper.outerHeight())))
			);
		}
	};

	

})(jQuery);