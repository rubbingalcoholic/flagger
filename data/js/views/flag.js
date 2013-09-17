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

	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render: function(callback) {

		(callback && typeof callback == 'function') || (callback = function() {});

		// prevent reflows lololo
		if (!this.$el.html())
		{
			flagger.templating.render('flag', this.model.attributes, function(html) {

				this.$el.html(html);
				this.toggle_classes();
				callback(this);
			}.bind(this));
			
		}
		else
		{
			this.toggle_classes();
			callback(this);
		}
	},

	toggle: function(e)
	{
		e.preventDefault();
		this.model.toggle_is_active();
	},

	toggle_classes: function()
	{
		this.$el.toggleClass('is_active', this.model.get('is_active'));
		this.$el.toggleClass('is_hidden', this.model.get('is_hidden'));
	}
	
});