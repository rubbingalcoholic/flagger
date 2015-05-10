/**
 *	flagger.js - the core logic for the Flagger settings BackBone app, also
 *	             defines some event listeners to hear from the add-on
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
 
document.addEventListener('flagger_add_on_message', function(e) {

	switch (e.detail.msg_type)
	{
		case 'panel_data':
		case 'activate':

			addon_io.call('get_settings', {}, function(data) {

				SETTINGS = data.settings;
				flagger.initialize();
			})
			break;

		case 'flagger_active_change':

			SETTINGS.flagger_active = e.detail.data;

			if (typeof VIEWS.flagger_switch != "undefined")
				VIEWS.flagger_switch.handle_switch_state();
			
			break;
	}
});

var flagger = {

	is_initialized: false,

	initialize: function() {
		
		if (this.is_initialized)
			return false;

		$(function() {
			
			this.is_initialized = true;
			this.handle_route();
			
		}.bind(this));

	},

	handle_route: function() {
		if (SETTINGS.tos_accepted == false)
			VIEWS.tos = new TosView({});
		else
		{
			var flags_collection = new Flags(DEFAULT_FLAGS);
			
			flags_collection.add_list(SETTINGS.user_flags, true);

			VIEWS.flagger = new FlaggerView({flags_collection: flags_collection});
			VIEWS.options = new OptionsView({});
			VIEWS.flagger_switch = new FlaggerSwitchView({});
		}
	}
};