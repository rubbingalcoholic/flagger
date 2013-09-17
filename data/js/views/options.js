/**
 *	options.js - BackBone View for advanced options panel
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */
var OptionsView = Backbone.View.extend({

	tagName:  "div",

	events:
	{
		'click #options': 'show_panel',
		'mouseleave #options_panel': 'hide_panel',
		'click #options_panel .blocker': 'hide_panel',
		'change #options_panel input': 'toggle_setting'
	},

	initialize: function()
	{
		this.render();
	},

	render: function()
	{
		flagger.templating.render('options', {settings: SETTINGS}, function(html) {
			this.$el.html(html);
			$("#options_container").html(this.$el);
		}.bind(this));	

		return this;
	},

	show: function()
	{
		$('#options').show();
		window.setTimeout(function() { $('#options').css('opacity', 1);	}, 50);
	},

	hide: function()
	{
		$('#options').css('opacity', 0)
		window.setTimeout(function() { $('#options').hide(); }, 500);
	},

	show_panel: function(e)
	{
		if (e) e.preventDefault();

		$('#options_panel').show();
		window.setTimeout(function() { $('#options_panel').css('opacity', 1); }, 50);
	},

	hide_panel: function(e)
	{
		if (e) e.preventDefault();
		
		$('#options_panel').css('opacity', 0)
		window.setTimeout(function() { $('#options_panel').hide(); }, 200);
	},

	toggle_setting: function(e)
	{
		SETTINGS[e.target.id] = $(e.target).prop('checked');

		addon_io.call('set_setting', {setting: e.target.id, val: SETTINGS[e.target.id]}, function(data) {
		}.bind(this));
	}
});