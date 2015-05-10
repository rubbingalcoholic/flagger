/**
 *	flag.js - BackBone Model and Collection definitions relevant to flags
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

var Flag = Backbone.Model.extend({

	defaults: {
		t: '',
		is_active: false,
		is_hidden: false	// for tag filtering
	},

	initialize: function(data) {
		if (typeof data.id == "undefined")
			this.set({id: this.generate_id()});

		return this;
	},

	generate_id: function() {

		if (typeof Backbone.unique_id_seed == "undefined")
			Backbone.unique_id_seed = 0;

		return Backbone.unique_id_seed++;
	},

	toggle_is_active: function() {

		this.set({is_active: !this.get('is_active')});
		this.trigger('toggle');

		return this;
	}
});

var Flags = Backbone.Collection.extend({

	model: Flag,

	comparator: function(a, b) {

		if (Math.random() < 0.5) return -1;
		else return 1;
	},

	add_list: function(flags, active, debug) {
		active || (active = false);
		debug || (debug = false)

		for (var i = 0; i < flags.length; i++) {

			if (debug)
				console.log('flag: '+flags[i]);

			var _found_existing = false;

			for (var j = 0; j < this.models.length; j++)
				if (this.models[j].get('t').toLowerCase() == flags[i].toLowerCase()) {

					_found_existing = true;
					this.models[j].set({is_active: active});
				}

			if (_found_existing == false)
				this.add({t: flags[i], is_active: active});
			
		}

		return this;
	},

	filter_list: function(criteria) {

		for (var i = 0; i < this.models.length; i++)
			if (criteria && this.models[i].get('t').toLowerCase().indexOf(criteria.toLowerCase()) == -1)
				this.models[i].set({is_hidden: true});
			else
				this.models[i].set({is_hidden: false});

		return this;
	},

	set_is_active: function(state) {

		for (var i = 0; i < this.models.length; i++) {

			this.models[i].set({is_active: state});
		}

		return this;
	},

	render_list: function() {

		var active_flags = this.where({is_active: true});

		var list = [];

		for (var i = 0; i < active_flags.length; i++)
			list.push(active_flags[i].get('t'));

		console.log('list: ', list);

		return list;
	},

	are_all_active: function() {

		return this.models.length == this.render_list().length;
	}
});