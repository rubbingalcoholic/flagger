/**
 *	flagger_http_oberserver.js - HTTP packet observing and rewriting features
 *	                             for the Flagger Firefox add-on.
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

var {Cc, Ci, Cu} = require("chrome");

function flagger_http_observer()
{
	this.initialize();
}
flagger_http_observer.prototype = {

	is_active: false,

	flagger: null,

	initialize: function(flagger)
	{
		this.flagger = flagger;

		return this;
	},

	activate: function() {

		if (this.is_active)
			return this;

		var observer_service = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
    	observer_service.addObserver(this, "http-on-modify-request", false);

		this.is_active = true;
	},

	deactivate: function() {

		if (!this.is_active)
			return this;

		var observer_service = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
    	observer_service.removeObserver(this, "http-on-modify-request");

		this.is_active = false;
	},

	observe: function(subject, topic, data) {

		// console.log('observing! ', topic);

		var _flagger 		= this.flagger;
		var _param_name		= _flagger.get_flag_param();
		var _flags_content	= _flagger.get_flags_content();
		var _message_param	= _flagger.get_message_param();
		var _message_body	= _flagger.get_message_content();

		if (topic == "http-on-modify-request")
		{
			subject.QueryInterface(Ci.nsIHttpChannel);
			var url = subject.URI.spec;

			// console.log('url: ', url);

			// subject.setRequestHeader("Referer", "http://example.com", false);

			if (_flagger.get_http_header_mode() == false)
			{
				// don't do this twice
				if (url.indexOf(_param_name+'=') != -1)
					return;

				subject.URI.spec = url + (url.indexOf('?') === -1 ? '?' : '&') + _param_name + '=' + _flags_content + (_message_body ? ('&' + _message_param + '=' + _message_body) : '');
			}
			else
			{
				subject.setRequestHeader('x-'+_param_name, _flags_content, false);

				if (_message_body)
					subject.setRequestHeader('x-'+_message_param, _message_body, false);					
			}
		}
	}
};
exports.flagger_http_observer = flagger_http_observer;