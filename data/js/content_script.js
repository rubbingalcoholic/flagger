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
    var cloned = cloneInto(response, document.defaultView);
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent("flagger_add_on_response", true, true, cloned);
    document.documentElement.dispatchEvent(event);
});

self.port.on('message', function(message) {
    var cloned = cloneInto(message, document.defaultView);
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent("flagger_add_on_message", true, true, cloned);
    document.documentElement.dispatchEvent(event);
});