/**
 *	flagger_http_oberserver_chrome.js - HTTP packet observing and rewriting
 *	                                    features for Flagger Chrome extension.
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

function flagger_http_observer()
{
}
flagger_http_observer.prototype = {

	is_active: false,

	flagger: null,

	initialize: function(flagger)
	{
		this.flagger = flagger;

		chrome.webRequest.onBeforeRequest.addListener(
			this.observe_urls.bind(this),
			{urls: ["http://*/*", "https://*/*"]},
			["blocking"]
		);
		chrome.webRequest.onBeforeSendHeaders.addListener(
			this.observe_headers.bind(this),
			{urls: ["http://*/*", "https://*/*"]},
			["blocking", "requestHeaders"]
		);

		return this;
	},

	activate: function() {

		this.is_active = true;
	},

	deactivate: function() {

		this.is_active = false;
	},

	observe_urls: function(details)
	{
		if (this.flagger.get_http_header_mode() == true)
			return {}

		return this.observe(details);
	},

	observe_headers: function(details)
	{
		if (this.flagger.get_http_header_mode() == false)
			return {}

		return this.observe(details);
	},

	observe: function(details) {

		if (this.is_active == false)
			return {};

		// console.log('observing! ', details);
		// console.log('url: ', details.url);

		var _flagger 		= this.flagger;
		var _param_name		= _flagger.get_flag_param();
		var _flags_content	= _flagger.get_flags_content();
		var _message_param	= _flagger.get_message_param();
		var _message_body	= _flagger.get_message_content();
		var url 			= details.url;

		if (_flagger.get_http_header_mode() == false)
		{
			// don't do this twice
			if (url.indexOf(_param_name+'=') != -1)
				return {};

			// console.log('redirecting! '+url + (url.indexOf('?') === -1 ? '?' : '&') + _param_name + '=' + _flags_content + (_message_body ? ('&' + _message_param + '=' + _message_body) : ''))
			return {redirectUrl: url + (url.indexOf('?') === -1 ? '?' : '&') + _param_name + '=' + _flags_content + (_message_body ? ('&' + _message_param + '=' + _message_body) : '')}
		}
		
		details.requestHeaders.push({name: 'x-'+_param_name, value: _flags_content});

		if (_message_body)
			details.requestHeaders.push({name: 'x-'+_message_param, value: _message_body});

		// console.log('setting headers! ', details.requestHeaders)
		return {requestHeaders: details.requestHeaders};
		
	}
};