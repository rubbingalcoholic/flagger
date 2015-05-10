/**
 *	tos.js - BackBone View for Terms of Service screen
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
var TosView = Backbone.View.extend({

	el: '#tos',

	events: {
		'click a.agree_to_terms': 'accept_tos'
	},

	initialize: function() {
		this.render();
	},

	render: function() {
		$('#tos').show();
		
		return this;
	},

	accept_tos: function(e) {
		e.preventDefault();
		
		SETTINGS.tos_accepted = true;

		addon_io.call('set_setting', {setting: 'tos_accepted', val: SETTINGS.tos_accepted}, function(data) {
			flagger.handle_route();
		});
	}
});