/**
 *	main.js - main add-on functionality for Flagger's Firefox add-on.
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
exports.main = function (options, callbacks) {

	var bind_content_script_listener = function(panel)
	{
		panel.port.on("request", function(request) {

			console.log('add-on received message ('+request.id+': '+request.msg_type+')');

			var response = {
				msg_type: request.msg_type,
				id: request.id,
				data: {}
			};

			switch (request.msg_type)
			{
				case 'open_settings_screen':

					open_settings_screen();
					break;

				case 'get_settings':

					response.data.settings = flagger.get_settings();
					break;

				case 'get_red_flags':

					var red_flags = read_flags_from_tab()

					if (!red_flags)
						red_flags = unescape(flagger.get_flags_content());

					console.log('add-on call to get_red_flags returning: '+red_flags);

					response.data.red_flags = red_flags.split('+');

					break;

				case 'set_setting':

					flagger.set_setting(request.data.setting, request.data.val);

					if (request.data.setting == 'flagger_active')
					{
						var _settings_tab_exists = find_settings_tab();

						if (_settings_tab_exists && settings_worker)
							send_content_script_message(settings_worker, 'flagger_active_change', request.data.val);

						set_icon(panel_showing);
					}

					break;
			}
			
			console.log('add-on sending response ('+response.id+': '+response.msg_type+')');

			panel.port.emit('response', response);
		});
	}

	var send_content_script_message = function(worker, msg_type, message)
	{
		worker.port.emit('message', {msg_type: msg_type, data: message});
	}

	var open_settings_screen = function()
	{
		close_any_open_panels();

		var _settings_tab_exists = find_settings_tab();

		if (_settings_tab_exists)
		{
			_settings_tab_exists.activate();
			return true;
		}
		
		tabs.open({
			url: data.url("index.html"),
			onReady: function onReady(tab) {

				settings_worker = tab.attach({
					contentScriptFile: ["js/content_script.js"].map(data.url),
				});
				bind_content_script_listener(settings_worker);
				send_content_script_message(settings_worker, 'activate', true);

			},
			onClose: function onClose(tab) {
				settings_worker = null;
			}
		});	
	}

	var find_settings_tab = function()
	{
		var settings_url = data.url("index.html");

		for each (var tab in tabs)
		{
			if (tab.url == settings_url)
			{
				return tab;
			}
		}
		return false;
	}

	var read_flags_from_tab = function()
	{
		var flag_param	= flagger.get_flag_param();
		var url			= tabs.activeTab.url;
		var flags_index	= url.indexOf(flag_param + '=');

		if (flags_index == -1)
			return false;

		url 			= url.substr((flags_index + flag_param.length + 1));

		if (url.indexOf('&') != -1)
			url 		= url.substr(0, url.indexOf('&'));

		if (url.indexOf('#') != -1)
			url 		= url.substr(0, url.indexOf('#'));

		return unescape(url);
	}


	var close_any_open_panels = function()
	{
		quick_controls_panel.hide();
	}

	var set_icon = function(hover)
	{
		hover || (hover = false);

		if (hover)
			if (flagger.get_is_active())
				widget.icon = {
					"16": data.url("images/flag_red_hover.png"),
					"32": data.url("images/flag_red_hover_38.png")
				};
			else
				widget.icon = {
					"16": data.url("images/flag_gray_hover.png"),
					"32": data.url("images/flag_gray_hover_38.png")
				};
		else
			if (flagger.get_is_active())
				widget.icon = {
					"16": data.url("images/flag_red.png"),
					"32": data.url("images/flag_red_38.png")
				};
			else
				widget.icon = {
					"16": data.url("images/flag_gray.png"),
					"32": data.url("images/flag_gray_38.png")
				};
	}


	// Main functionality 
	var data 			= require("sdk/self").data;
	var ui				= require("sdk/ui");
	var tabs			= require("sdk/tabs");
	var storage			= require("sdk/simple-storage").storage;
	var preferences		= require("sdk/simple-prefs");
	var http_observer	= require( "./flagger_http_observer" ).flagger_http_observer;
	var flagger			= require( "./flagger" ).flagger;

	var panel_showing	= false;

	var settings_worker	= null;
	var settings		= null;

	if (typeof storage.flagger_settings != "undefined")
		settings		= JSON.parse(storage.flagger_settings);

	flagger.initialize(settings, new http_observer(), require("sdk/timers"), storage);
	
	preferences.on("open_dashboard", function() {
		open_settings_screen();
	});

	var widget = ui.ToggleButton({
		id: "open_popup_button",
		label: "Flagger",
		icon: {
			"16": data.url("images/flag_gray.png"),
			"32": data.url("images/flag_gray_38.png")
		},
		onChange: function(state) {
			if (state.checked) {
				quick_controls_panel.show({position: widget});
			}
		}
	});

	var quick_controls_panel = require("sdk/panel").Panel({
		width:330,
		height:250,
		contentURL: data.url("html/popup.html"),
		contentScriptFile: data.url("js/content_script.js"),
		contentScriptWhen: "ready",
		onShow: function() {
			send_content_script_message(quick_controls_panel, 'panel_data', {settings: flagger.get_settings()});
			panel_showing = true;
			set_icon(true);
		},
		onHide: function() {
			set_icon(false);
			panel_showing = false;
			widget.state('window', {checked: false});
		}
	});
	set_icon();


	bind_content_script_listener(quick_controls_panel);

	if (options.loadReason == 'install' || options.loadReason == 'downgrade')
		open_settings_screen();
};