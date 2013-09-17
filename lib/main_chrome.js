/**
 *	main_chrome.js - main add-on functionality for Flagger's Chrome extension.
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

var do_request = function(request)
{
	console.log('add-on received message ('+request.id+': '+request.msg_type+'): ',request.data);

	var response = {
		msg_type: request.msg_type,
		id: request.id,
		data: {}
	};

	switch (request.msg_type)
	{
		case 'addon_page_open':

			return send_content_script_message('panel_data', {settings: flagger.get_settings()});
			break;
			
		case 'open_settings_screen':

			open_settings_screen();
			break;

		case 'get_settings':

			response.data.settings = flagger.get_settings();
			break;

		case 'get_red_flags':

			return read_flags_from_tab(function(red_flags) {
				if (!red_flags)
					red_flags = unescape(flagger.get_flags_content());

				console.log('add-on call to get_red_flags returning: '+red_flags);

				response.data.red_flags = red_flags.split('+');

				chrome.runtime.sendMessage(response);
			}.bind(this))

			break;

		case 'set_setting':

			flagger.set_setting(request.data.setting, request.data.val);

			if (request.data.setting == 'flagger_active')
			{
				send_content_script_message('flagger_active_change', request.data.val);

				set_icon();
			}

			break;
	}
	
	console.log('add-on sending response ('+response.id+': '+response.msg_type+')');

	chrome.runtime.sendMessage(response);
}
var send_content_script_message = function(msg_type, message)
{
	chrome.runtime.sendMessage({is_message: true, msg_type: msg_type, data: message});
}

var open_settings_screen = function()
{
	close_any_open_panels();

	find_settings_tab({
		exists: function(tab) {
			chrome.tabs.update(tab.id, {selected: true});
		},
		not_exists: function() {
			chrome.tabs.create({url: "data/index.html"}, function(tab) {
				send_content_script_message('activate', true);
			});
		}
	});
}

var find_settings_tab = function(options)
{
	options || (options = {})
	options.exists || (options.exists = function() {});
	options.not_exists || (options.not_exists = function() {});

	var settings_url = chrome.extension.getURL("data/index.html");

	chrome.tabs.query({url: settings_url}, function(tabs) {

		if (tabs.length == 0)
			return options.not_exists()

		options.exists(tabs[0]);
	});
}

var read_flags_from_tab = function(callback)
{
	callback || (callback = function() {});

	var flag_param	= flagger.get_flag_param();

	chrome.tabs.query({active: true, currentWindow: true}, function(tab) {

		var url			= tab[0].url;
		var flags_index	= url.indexOf(flag_param + '=');

		if (flags_index == -1)
			return callback(false);

		url 			= url.substr((flags_index + flag_param.length + 1));

		if (url.indexOf('&') != -1)
			url 		= url.substr(0, url.indexOf('&'));

		if (url.indexOf('#') != -1)
			url 		= url.substr(0, url.indexOf('#'));

		callback(unescape(url));
	});
}

var close_any_open_panels = function()
{
	send_content_script_message('close_panel', true);
}

var set_icon = function(hover)
{
	hover || (hover = false);

	if (hover)
		if (flagger.get_is_active())
			chrome.browserAction.setIcon({path  : {19: "data/images/flag_red_hover.png", 38: "data/images/flag_red_hover_38.png"} });
		else
			chrome.browserAction.setIcon({path  : {19: "data/images/flag_gray_hover.png", 38: "data/images/flag_gray_hover_38.png"} });
	else
		if (flagger.get_is_active())
			chrome.browserAction.setIcon({path  : {19: "data/images/flag_red.png", 38: "data/images/flag_red_38.png"} });
		else
			chrome.browserAction.setIcon({path  : {19: "data/images/flag_gray.png", 38: "data/images/flag_gray_38.png"} });
}

var storage		= localStorage;
var exports 	= {};
var settings	= null;

if (typeof storage.flagger_settings != "undefined")
	settings = JSON.parse(storage.flagger_settings);
else
	open_settings_screen();

flagger.initialize(settings, new flagger_http_observer(), window, storage);

set_icon();