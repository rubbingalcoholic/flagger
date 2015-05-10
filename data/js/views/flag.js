/**
 *	flag.js - BackBone View for a flag rendered inside Flagger's Settings UI
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
var FlagView = Backbone.View.extend({

	tagName:  "li",

	events: {
		"click a": 	"toggle"
	},

	is_rendered: false,

	initialize: function() {
		
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
		this.render();
	},

	render: function(callback) {

		if (!this.is_rendered) {
			this.is_rendered = true;
			var a = document.createElement('a');
			a.href = '#';
			a.id = 'flag_'+this.model.attributes.id;
			a.textContent  = this.model.attributes.t;
			this.el.appendChild(a);
			this.toggle_classes();
		}
		else
			this.toggle_classes();
		
		return this;
	},

	toggle: function(e) {

		e.preventDefault();
		this.model.toggle_is_active();
	},

	toggle_classes: function() {

		this.$el.toggleClass('is_active', this.model.get('is_active'));
		this.$el.toggleClass('is_hidden', this.model.get('is_hidden'));
	}
	
});