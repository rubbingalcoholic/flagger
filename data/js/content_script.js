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

	console.log('content script sending request to add-on ('+e.detail.id+': '+e.detail.msg_type+')');
	self.port.emit('request', e.detail);
});

self.port.on('response', function(response) {

	console.log('content script sending response to page ('+response.id+': '+response.msg_type+')');
	document.dispatchEvent(new CustomEvent("flagger_add_on_response", {detail:response}));
});

self.port.on('message', function(message) {

	console.log('content script sending one-off message to page ('+message.msg_type+')');
	document.dispatchEvent(new CustomEvent("flagger_add_on_message", {detail:message}));
});