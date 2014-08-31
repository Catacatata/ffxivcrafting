var global = {
	init:function() {
		$('[rel=tooltip]').tooltip({
			container: 'body'
		});

		global.reset_popovers();

		$('#buymeabeer').click(function(event) {
			event.preventDefault();

			$('#buymeabeer_button').trigger('click');
		});

		// Add to "cart"
		$(document).on('click', '.add-to-list', function() {
			var id = $(this).data('itemId'),
				name = $(this).data('itemName')
				qty = $(this).data('itemQuantity');

			$.ajax({
				url: '/list/add',
				type: 'post',
				data: { 'item-id' : id , 'qty' : qty },
				beforeSend:function() {
					global.noty({
						type: 'success', 
						text: 'Adding ' + (qty > 1 ? (qty + ' x ') : '') + name + ' to your list'
					});
				}
			});
		});

		/* Android mobile menu support */
		if (/Android/i.test(navigator.userAgent)) {
			$('#nav-handler').on('click', function(e) {
				e.preventDefault();
				var mainContainer = $('#main-container');
				mainContainer[(mainContainer.hasClass('nav-handler-checked') ? 'remove' : 'add') + 'Class']('nav-handler-checked');
			});
		}
	},
	visible_popover:null,
	reset_popovers:function(el) {
		$('[data-toggle=popover][data-content-id]').each(function() {
			$(this).data('content', $($(this).data('contentId')).html());
			$($(this).data('contentId')).remove();
		})

		// thanks to http://fuzzytolerance.info/blog/quick-hack-one-bootstarp-popover-at-a-time/

		var popovers = $('[data-toggle=popover]');

		// enable popovers
		popovers.popover({ 
			'container': 'body',
			'html': 'true'
		});

		// only allow 1 popover at a time
		// all my popovers hav
		popovers.on('click', function(event) {
			event.stopPropagation();

			var el = $(this);

			if (global.visible_popover !== null && global.visible_popover.data('contentId') == el.data('contentId'))
			{
				global.visible_popover = null;
				el.popover('hide');
			}
			else
			{
				if (global.visible_popover !== null)
					global.visible_popover.popover('hide');

				global.visible_popover = el;

				el.popover('show');

				$('[rel=tooltip]', el).tooltip();
			}
		});

		$(document).click(function(event) {
			if ($(event.target).closest('.popover').length == 0 && $(event.target).data('toggle') != 'popover')
			{
				if (global.visible_popover !== null)
					global.visible_popover.trigger('click');
				
				global.visible_popover = null;
				popovers.popover('hide');
			}
		});
	},
	noty:function(options) {
		noty({
			text: options.text,
			type: options.type,
			layout: 'bottomCenter',
			timeout: 2500
		});
	},
	notification:function(type, message, id) {
		$('#notifications').append('<div class="alert alert-' + type + '" id="' + id + '">' + message);
	},
	fade_and_destroy:function(el)
	{
		el.fadeOut(500, function() { el.remove(); });
	},
	get_cookie:function(name) {
		name += '=';
		var cookie_array = document.cookie.split(';');

		for (var x = 0; x < cookie_array.length; x++) {
			var cookie = cookie_array[x];
			while (cookie.charAt(0) == ' ')
				cookie = cookie.substring(1, cookie.length);

			if (cookie.indexOf(name) === 0)
				return cookie.substring(name.length, cookie.length);
		}

		return null;
	},
	set_cookie:function(name, val) {
		var expire = new Date();
		expire.setDate(expire.getDate() + 365);

		val = escape(val) + '; expires=' + expire.toUTCString() + ';path=/';

		document.cookie = name + '=' + val;

		return true;
	},
	// Special thanks: http://stackoverflow.com/a/24922761/286467
	exportToCsv:function(filename, rows) {
		var processRow = function (row) {
			var finalVal = '';
			for (var j = 0; j < row.length; j++) {
				var innerValue = row[j] === null ? '' : row[j].toString();
				var result = innerValue.replace(/"/g, '""');
				if (result.search(/("|,|\n)/g) >= 0)
					result = '"' + result + '"';
				if (j > 0)
					finalVal += ',';
				finalVal += result;
			}
			return finalVal + '\n';
		};

		var csvFile = '';
		for (var i = 0; i < rows.length; i++) {
			csvFile += processRow(rows[i]);
		}

		var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
		if (navigator.msSaveBlob) { // IE 10+
			navigator.msSaveBlob(blob, filename);
		} else {
			var link = document.createElement("a");
			if (link.download !== undefined) { // feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", filename);
				link.style = "visibility:hidden";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}
}

$(global.init);

// Tour Moogle Addition
$(function() {
	var tma = $.fn.popover.Constructor.prototype.show;
	$.fn.popover.Constructor.prototype.show = function() {
		// Get original template
		var template = $('<div>').html('<div class="popover tour-tour">          <div class="arrow"></div>          <h3 class="popover-title"></h3>          <div class="popover-content"></div>          <nav class="popover-navigation">            <div class="btn-group">              <button class="btn btn-sm btn-default disabled" data-role="prev">« Prev</button>              <button class="btn btn-sm btn-default" data-role="next">Next »</button>            </div>            <button class="btn btn-sm btn-default" data-role="end">End tour</button>          </nav>        </div>');
		
		// Add Moogle
		template.find('h3').before('<img src="/img/tour_moogle.png" class="tour_moogle">');

		this.options.template = template.html();

		// Call
		tma.call(this);
	};
});

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}