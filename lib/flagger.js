/**
 *	flagger.js - core Flagger functionality for Chrome and Firefox add-ons
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
var flagger = {

	settings: {
		tos_accepted: 		false,
		flagger_active: 	false,
		user_flags: 		[],
		user_message: 		'',
		randomize_params: 	false,
		generation_delay: 	5000,
		flags_per_request: 	3,
		http_header_mode: 	false,
		allow_duplicates: 	true,	// not implemented

		// promo related -- prompts for FFTF donation after 3 settings hits
		promo_1_hits: 		0,
		promo_1_dismissed: 	false
	},

	defaults: {
		flag_param: 'lulz',
		message_param: 'dear_nsa'
	},

	// system services
	http_observer: null,
	timer: null,
	interval_id: null,
	storage: null,

	// internal params
	flag_param: null,
	message_param: null,
	flags_content: 'bunnybunnybunny',
	is_active: false,	

	get_settings: function() { return this.settings; },
	get_flag_param: function() { return this.flag_param; },
	get_flags_content: function() { return this.flags_content; },
	get_message_param: function() { return this.message_param; },
	get_message_content: function() { return this.settings.user_message },	
	get_http_header_mode: function() { return this.settings.http_header_mode },
	get_is_active: function() { return this.is_active; },

	set_setting: function(setting, val)
	{ 
		this.settings[setting] = val;

		switch (setting)
		{
			case 'flagger_active':

				if (val) this.activate();
				else this.deactivate();
				break;

			case 'randomize_params':

				if (val) this.randomize_params();
				else this.set_default_params();
				break;

			case 'user_flags':

				this.compute_flags();
				break;

		}
		return this.save();
	},

	initialize: function(settings, http_observer, timer, storage)
	{
		this.http_observer = http_observer.initialize(this);
		this.timer = timer;
		this.storage = storage;

		if (settings)
			this.settings = settings;

		if (this.settings.randomize_params)
			this.randomize_params();
		else
			this.set_default_params();

		if (this.settings.flagger_active)
			this.activate();

		return this;
	},

	activate: function()
	{
		if (this.is_active)
			return this;

		this.http_observer.activate();

		this.interval_id = this.timer.setInterval(function() {
			this.compute_flags();
		}.bind(this), this.settings.generation_delay);

		this.is_active = true;

		this.compute_flags();		

		return this;
	},

	deactivate: function()
	{
		if (!this.is_active)
			return this;

		this.http_observer.deactivate();

		this.timer.clearInterval(this.interval_id);

		this.is_active = false;

		return this;
	},

	save: function()
	{
		this.storage.flagger_settings = JSON.stringify(this.settings);
		return this;
	},

	compute_flags: function()
	{
		var str			= '';
		var settings	= this.settings;
		var avail_flags	= settings.user_flags.length;
		var num_flags	= settings.flags_per_request;


		if (settings.user_flags.length < settings.flags_per_request)
			num_flags	= avail_flags;

		for (var i = 0; i < num_flags; i++)
			str += (i ? '+' : '') + escape(settings.user_flags[Math.round(Math.random() * (avail_flags*10)) % avail_flags]);
		
		this.flags_content = str;

		// console.log('computed flags: '+str);
	},

	randomize_params: function()
	{
		var alpha	= ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		var numeric = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

		var randomize = function()
		{
			var str = '';

			for (var i = 0, num_chars = (Math.round(Math.random() * 10) % 5) + 1; i < num_chars; i++)
				str += alpha[Math.round(Math.random() * 100) % 26];
			
			for (var i = 0, num_chars = (Math.round(Math.random() * 10) % 5) + 1; i < num_chars; i++)
				str += numeric[Math.round(Math.random() * 100) % 10];

			return str;
		}
		this.flag_param = randomize();
		this.message_param = randomize();
	},

	set_default_params: function()
	{
		this.flag_param = this.defaults.flag_param;
		this.message_param = this.defaults.message_param;
	}
};
if (typeof exports != "undefined") exports.flagger = flagger;