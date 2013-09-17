Flagger
==========================================
#### Browser add-on for Firefox and Chrome

Introduction
------------
Flagger is a browser add-on that automatically puts red flag keywords (like
_bomb_, _Taliban_ and _anthrax_) into the web addresses you visit. Install
Flagger and help us send a message: _government surveillance has gone too far._

Flagger is licensed under version 3 the [GNU General Public License][1] as
published by the Free Software Foundation.

This source code is for both Firefox and Chrome. The vast majority of the
source files are the same across both browsers. Any browser-specific files are
loaded in via the manifest.json file (for Chrome) or the Firefox Add-on SDK.


Installation Instructions
-------------------------
**Firefox:**

* Install the [Firefox Add-on SDK][2]
* DEPENDENCY: Install [Rob--W's toolbarwidget-jplib][2] Add-on SDK package (Rob
              provides really nice installation directions)
* With the SDK activated, `cd` to the directory with the Flagger source code
* Run `cfx xpi` to build the extension, saves to _flagger.xpi_.
* Open the add-ons settings screen in Firefox
* Click "Install Add-on From File..."
* Open the _flagger.xpi_ file you just built. You're good to go.

**Chrome:**

* Open the [extensions tab][3] on the Chrome Settings screen
* Make sure the box for "Developer Mode" is checked
* Click "Load unpacked extension..."
* Select the folder you unpacked Flagger to and click OK. You're good to go.


Contributing
------------
Please let me know if you have any suggestions for improvements. If you're code
savvy, fork the project and make the change yourself! I will do my best to help
if something doesn't work or isn't clear. You can find me on Twitter
@rubbingalcohol or email me at <<jeff@rubbingalcoholic.com>>.


[1]: http://www.gnu.org/licenses/gpl-3.0.html
[2]: https://addons.mozilla.org/en-us/developers/builder
[3]: chrome://extensions/