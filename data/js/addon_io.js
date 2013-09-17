/**
 *	asson_io.js - core functionality for communication to and from the add-ons
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
var addon_io = {

	addon_object: null,

	callbacks: {},

	chrome_mode: false,

	initialize: function()
	{
		if (typeof chrome != "undefined" && typeof chrome.extension != "undefined")
		{
			console.log('chrome mode is on!');
			this.chrome_mode = true;

			this.call('addon_page_open');

			chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

				console.log('addon_io: received message: ', request);

				if (typeof request.is_message != "undefined" && request.is_message)
					document.dispatchEvent(new CustomEvent("flagger_add_on_message", {detail:request}));
				else
					this.handle_response(request);
			}.bind(this));
		}
		else
		{
			document.addEventListener('flagger_add_on_response', function(e) {

				this.handle_response(e.detail);
			}.bind(this));
		}

		return this;		
	},

	call: function(msg_type, data, callback)
	{
		data || (data = {});

		var id = this.generate_id();

		if (callback)
		{
			console.log('setting callbacks['+id+']!');
			this.callbacks[id] = callback;
		}

		var request = {
			msg_type: msg_type,
			data: data,
			id: id
		}

		console.log('addon_io: sending message ('+request.id+': '+request.msg_type+'): ', request);

		if (!this.chrome_mode)
			document.dispatchEvent(new CustomEvent("flagger_add_on_request", {detail:request}));
		else
			chrome.extension.getBackgroundPage().do_request(request);
	},

	handle_response: function(data)
	{
		console.log('addon_io: received message ('+data.id+': '+data.msg_type+')');

		if (typeof this.callbacks[data.id] != "undefined")
		{
			this.callbacks[data.id](data.data);
			delete this.callbacks[data.id];
		}
	},

	generate_id: function()
	{
		var num = Math.round(Math.random() * 1000000000);

		if (typeof this.callbacks[num] != "undefined")
			return this.generate_id();
		
		return num;
	}
}.initialize();