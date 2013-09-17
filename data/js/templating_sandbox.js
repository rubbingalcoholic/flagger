/**
 *	templating_sandbox.js - manages an asynchronous communication layer between
 *	                        a sandboxed iframe and Flagger's BackBone settings
 *							application. The iframe is used for view rendering,
 *	                        and is sandboxed for security reasons.
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

var templating_sandbox = function(el, callback)
{
	this.initialize(el, callback)
}
templating_sandbox.prototype = {
	
	el: null,
	callbacks: {},
	interval_id: null,
	is_initialized: false,

	initialize: function(el, callback)
	{
		this.el = el;

		window.addEventListener('message', function(event) {
			if (typeof event.data.HELO != 'undefined')
			{
				console.log('HELO!!!!!!!');
				window.clearInterval(this.interval_id);

				if (this.is_initialized)
					return;

				this.is_initialized = true;
				callback();
			}
			else
			{
				this.handle_render_response(event.data);
			}
		}.bind(this));

		this.interval_id = window.setInterval(function() {

			console.log('HELO?');
			this.send_command('are_you_alive');
		}.bind(this), 25);

		return this;
	},

	load_templates: function(templates, callback)
	{
		var templates_loaded = 0;

		var complete = function(template_name)
		{
			var template_name = template_name;

			return function(data) {

				this.send_command('init_template', {name: template_name, content: data});
				templates_loaded++;

				if (templates_loaded == templates.length)
				{
					callback();
				}
			}.bind(this);
		}.bind(this)

		for (var i = 0; i < templates.length; i++)
		{
			$.ajax('templates/' + templates[i] + '.html', {
				iterator: Number(i),
				dataType: 'html',
				success: complete(templates[i]),
				error: function() {	}
			});
		}
	},

	render: function(name, context, callback) {

		context || (context = {});

		var id = this.generate_id();

		if (callback)
		{
			this.callbacks[id] = callback;
		}
		this.send_command('render', {name: name, id: id, context: context});
	},

	handle_render_response: function(data)
	{
		if (typeof this.callbacks[data.id] != "undefined")
		{
			this.callbacks[data.id](data.html);
			delete this.callbacks[data.id];
		}
	},

	send_command: function(command_name, data) {

		data || (data = {});

		var message = {
			command: command_name,
			data: data
		};
		this.el.contentWindow.postMessage(message, '*');
	},

	generate_id: function()
	{
		var num = Math.round(Math.random() * 1000000000);

		if (typeof this.callbacks[num] != "undefined")
			return 'templating_'+this.generate_id();
		
		return num;
	}
}