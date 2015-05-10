/**
 *	flagger_switch.js - BackBone View for Flagger on/off switch
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
var FlaggerSwitchView = Backbone.View.extend({

	el: '#flagger_switch',

	events: {
		'click #toggle_switch': 'toggle'
	},

	initialize: function() {

		this.render();
	},

	render: function() {

		if (SETTINGS.flagger_active)
			document.getElementById('toggle_switch').checked = true;

		this.handle_switch_state();

		window.setTimeout(function() {
			$('#flagger_switch').css('opacity', 1);
		}, 50);

		return this;
	},

	toggle: function() {

		SETTINGS.flagger_active = $('#toggle_switch').prop('checked');

		addon_io.call('set_setting', {setting: 'flagger_active', val: SETTINGS.flagger_active}, function(data) {
			this.handle_switch_state();
		}.bind(this));
	},

	handle_switch_state: function() {

		$('body').toggleClass('inactive', !SETTINGS.flagger_active);
		$('#toggle_switch').prop('checked', SETTINGS.flagger_active);

		if (typeof VIEWS.options == 'undefined')
			return;

		if (SETTINGS.flagger_active)
			VIEWS.options.show();
		else
			VIEWS.options.hide();
	}
});