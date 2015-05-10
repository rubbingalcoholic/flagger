/**
 *	popup.js - functionality related to Flagger's pop-up toolbar icon menu.
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

var site_url 		= 'http%3A%2F%2Fflagger.io';
var facebook_url	= 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fflagger.io';
var twitter_url 	= 'https://twitter.com/intent/tweet?source=webclient&text='
var twitter_body	= 'Get%20Flagger%E2%80%94the%20app%20that%20trolls%20the%20NSA%20with%20red%20flags%20%26%20free%20speech!';
var google_url		= 'https://plus.google.com/share?url=http%3A%2F%2Fflagger.io';

document.addEventListener('flagger_add_on_message', function(e) {
	switch (e.detail.msg_type) {
		case 'panel_data':
			var settings = e.detail.data.settings;

			document.getElementById("toggle_switch").checked = settings.flagger_active;
			handle_toggle_color();

			if (settings.flagger_active)
				show_red_flags();
			else
				hide_red_flags();

			break;

		case 'close_panel':
			window.close();

			break;
	}
});
$(document).ready(function() {
	$('#toggle_switch').on('focus', function() {
		$(this).blur();
	});

	$('#toggle_switch').on('change', function() {

		handle_toggle_color();

		if ($('#toggle_switch').prop('checked'))
		{
			addon_io.call('get_settings', {}, function(data) {

				if (data.settings.tos_accepted != true)
				{
					$('#toggle_switch').prop('checked', false);
					handle_toggle_color();
					addon_io.call('open_settings_screen');
				}
				else
				{
					addon_io.call('set_setting', {setting: 'flagger_active', val: true}, function() {
						show_red_flags();
					});
				}
			});
		}
		else
		{
			addon_io.call('set_setting', {setting: 'flagger_active', val: false}, function(response) {
				console.log('set one setting successfully');
				handle_toggle_color();
			});
		}
	});

	$('#settings_button').on('click', function(e) {
		e.preventDefault();
		open_settings();
	});
});

var open_settings = function()
{
	addon_io.call('open_settings_screen');
}

var handle_toggle_color = function()
{
	if (!$('#toggle_switch').prop('checked'))
	{
		$('.slide-button').addClass('gray');
		hide_red_flags();
	}
	else
	{
		$('.slide-button').removeClass('gray');
	}
}
var kill_flags = function() {
	var flags = document.getElementById('flags');

	while (flags.firstChild) 
	    flags.removeChild(flags.firstChild);

}
var hide_red_flags = function()
{
	$('.turn_me_on').css('opacity', 1);
	$('#flags').css('opacity', 0);
	$('.subhead').css('opacity', 0);
	$('#flags_area').removeClass('active');
	kill_flags();

	$('#facebook').prop('href', facebook_url);
	$('#twitter').prop('href', twitter_url + '%20' + twitter_body + '%20' + site_url);
	$('#google').prop('href', google_url);
}

var show_red_flags = function()
{
	$('.turn_me_on').css('opacity', 0);
	$('#flags').css('opacity', 1);
	$('.subhead').css('opacity', 1);
	$('#flags_area').addClass('active');
	kill_flags();

	addon_io.call('get_red_flags', {}, function(response) {

		var flags = response.red_flags;

		if (flags.length && flags[0] != '')
		{
			console.log('flags.length: '+flags.length);
			for (var i = 0; i < flags.length; i++)
			{
				var flag = flags[i];
				console.log('adding flag: '+flag);

				var li = document.createElement('li');
				li.className = 'new';
				li.textContent = flag;
				document.getElementById('flags').appendChild(li);
			}
			
			window.setTimeout(function() {
				$('#flags li').each(function(index, el) {
					window.setTimeout(function() {
						$(this).removeClass('new');
					}.bind(this), 250*index);
				});
			}, 420); // trippy
		}
		else
		{
			console.log('no flags :(');
			var li = document.createElement('li');
			li.className = 'tiny';
			li.textContent = 'None :(';
			document.getElementById('flags').appendChild(li);
			
			var li = document.createElement('li');
			li.className = 'tiny';
			li.textContent = 'Go to settings and choose some…';
			document.getElementById('flags').appendChild(li);
		}

		flags = escape(flags.join('+'));

		$('#facebook').prop('href', facebook_url + '%3Flulz%3D'+flags);
		$('#twitter').prop('href', twitter_url + (flags.toUpperCase() ? flags.toUpperCase() + '%21+' : '') + twitter_body + '+' + site_url);
		$('#google').prop('href', google_url + '%3Flulz%3D'+flags);
	});
}