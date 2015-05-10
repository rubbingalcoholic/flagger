Flagger
==========================================
#### Browser add-on for Firefox and Chrome

Introduction
------------
Flagger is a browser add-on that automatically puts red flag keywords (like
_bomb_, _Taliban_ and _anthrax_) into the web addresses you visit. Install
Flagger to make a statement: _government surveillance has gone too far._

Flagger is licensed under version 3 the [GNU General Public License][1] as
published by the Free Software Foundation.

This source code is for both Firefox and Chrome. The vast majority of the
source files are the same across both browsers. Any browser-specific files are
loaded in via the manifest.json file (for Chrome) or the Firefox Add-on SDK.


How to use (and test) Flagger
-----------------------------
1. Accept the Terms of Use to view the Settings screen
2. Click the switch in the upper left of the Settings screen to turn Flagger on
3. Write a short message in the "Choose your message" box.
4. Click some of the red flags to enable them. You can also "select all", or
   "enter your own" using the text entry box.
5. Now try visiting a site (or two). Notice how some of your red flags and
   message get added to the URL. The NSA will get a real kick out of that! Every
   few seconds, Flagger will randomly choose new red flags from your selections,
   so there will always be fun possibilities
6. Click the toolbar icon to open the quick controls panel
7. You can turn Flagger on and off here. If it is causing a problem on the page
   you're on, turn it off and reload.
8. You can also share your red flags on Twitter and Facebook! Fight the power!
9. You can also set Flagger to modify your HTTP headers instead of the URLs.
   This improves compatibility with some web sites. To do this, click the
   "Settings..." link in the toolbar panel. Make sure Flagger is turned on.
   In the Settings screen, a white gear icon will appear next to the On/Off
   switch. Click this to open the Advanced Options pane.

   - Click "Don't mangle URLs" to switch to HTTP header mode. Now, instead of
     modifying your URL query parameters, Flagger is sending HTTP headers
     containing your red flags and message. You can test this with an extension
     like Live HTTP Headers.

   - Click "Randomize parameter names" to switch to randomized parameter names.
     This will change the default parameter names from "lulz" and "dear_nsa" to
     something more randomized. Useful if you don't want your flags being easily
     filtered out.


Installation from Source
------------------------
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