/**
 *	content_script.js - communication between add-on and page in Firefox add-on
 *
 *	This file is part of Flagger, which is licensed under version 3 of the GNU
 *	General Public License as published by the Free Software Foundation.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program; if not, see <http://www.gnu.org/licenses/>.
 */

console.log('INITIALIZED CONTENT SCRIPT');

document.addEventListener('flagger_add_on_request', function(e) {

	self.port.emit('request', e.detail);
});

self.port.on('response', function(response) {

	unsafeWindow._FLAGGER_ADD_ON_RESPONSE = cloneInto(response, unsafeWindow);
	document.dispatchEvent(new CustomEvent("flagger_add_on_response", {detail:unsafeWindow._FLAGGER_ADD_ON_RESPONSE}));
});

self.port.on('message', function(message) {

	unsafeWindow._FLAGGER_ADD_ON_MESSAGE = cloneInto(message, unsafeWindow);
	document.dispatchEvent(new CustomEvent("flagger_add_on_message", {detail:unsafeWindow._FLAGGER_ADD_ON_MESSAGE}));
});