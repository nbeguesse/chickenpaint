# ChickenPaint

ChickenPaint is an HTML5 port of Marc Schefer's excellent multi-layer drawing Oekaki Java applet
[ChibiPaint](http://www.chibipaint.com/). I decided to port it to JavaScript because Java applet support in browsers 
has been dropping continuously, while JavaScript support continues to strengthen. Like the original, it is licensed
under GPLv3.

![ChickenPaint screenshot](help/screenshot.png)

The artwork being edited here is ["Woof Woof"](http://www.chickensmoothie.com/Forum/viewtopic.php?t=3079211) by [Swiftalu](http://www.chickensmoothie.com/Forum/memberlist.php?mode=viewprofile&u=91654).
You can color-in to create your own version of this drawing using ChickenPaint [on Chicken Smoothie](http://www.chickensmoothie.com/Forum/viewtopic.php?t=3079211)!

## Features

- A wide variety of brushes
- Multiple layers and 15 Photoshop-style layer blending modes
- Rotating canvas, work at any angle!
- Tablet pen pressure support (see notes below)
- Keyboard shortcuts
- New gradient fill tool
- New free-transform feature (rotate, scale, stretch)

## Supported browsers
ChickenPaint is supported in IE10 and 11, Edge, Chrome, Safari, Firefox and Opera, though it runs fastest in Chrome.

Tablet pressure support by Wacom plugin is available for browsers that still support NPAPI plugins (IE 10, IE 11,
Firefox 32-bit, Safari and Opera).

Native pen pressure support via Pointer Events is available for IE and Edge on Windows 8 and 10 (Windows 7 does not 
support it). Firefox and Chrome will be adding support shortly, with Firefox already offering it as an experimental
option which you can enable in [about:config](https://hacks.mozilla.org/2015/08/pointer-events-now-in-firefox-nightly/).

## Try it out
ChickenPaint is used as the default painting tool on [Chicken Smoothie's Oekaki forum](http://www.chickensmoothie.com/Forum/viewforum.php?f=29)
if you're using the Google Chrome or Microsoft Edge web browsers (a free account is required).

## Building
Building ChickenPaint requires [Node](https://nodejs.org/en/) to be installed (I'm using v4.4 LTS) along with GNU Make.

In the root of ChickenPaint, run `npm install` to install required dependencies. Then run `make all` to build ChickenPaint.
The resulting `chickenpaint.js` file will be written to `resources/js`, and `chickenpaint.css` will be written to `resources/css`.
You can use `make min` to build a minified version.

## Usage

Add something like this to your &lt;head> to load the required libraries in:

```html
<script type="text/javascript">
	/* Check for native pointer event support before PEP adds its polyfill */
	if (window.PointerEvent) {
	    window.hasNativePointerEvents = true;
	}
</script>

<script src="lib/raf.js"></script>
<script src="lib/es6-promise.min.js"></script>
<script src="lib/jquery-2.2.1.min.js"></script>
<script src="lib/pep.min.js"></script>
<script src="lib/pako.min.js"></script>
<script src="lib/keymaster.js"></script>
<script src="lib/EventEmitter.min.js"></script>
<script src="lib/FileSaver.min.js"></script>
<script src="lib/bootstrap.min.js"></script>
```

Then include ChibiPaint's main JS and CSS files:

```html
<script src="chickenpaint/js/chickenpaint.js"></script>
<link rel="stylesheet" type="text/css" href="chickenpaint/css/chickenpaint.css">
```

Add an element to serve as the container for ChickenPaint:

```html
<div id="chickenpaint-parent"></div>
```

Then construct ChickenPaint and tell it which DOM element to add to:

```js
new ChickenPaint({
    uiElem: document.getElementById("chickenpaint-parent"),
    saveUrl: "save.php",
    postUrl: "complete.php",
    exitUrl: "index.php",
    resourcesRoot: "chickenpaint/"
});
```

The possible options, including additional options for loading saved .chi or .png files for editing, are described
in the comments for the constructor of the ChickenPaint object in `/js/ChickenPaint.js`.

See `/test/index.html` for a complete example of a page that hosts ChickenPaint.

Your `saveUrl` will receive the uploaded .chi layer file (if the drawing had multiple layers), flat PNG image (always)
and .aco color palette (if the user edited it), which would arrive in PHP as `$_FILES["picture"]`, `$_FILES["chibifile"]`
and `$_FILES["swatches"]`. For an example of an upload script, see `/test/save.php`.

ChickenPaint's saving workflow has been customised for use on Chicken Smoothie. The user can save their drawing, and
then either continue editing the drawing, publish their completed drawing to the forum, or exit their drawing session
and come back and finish it later. The ability to create a new drawing and then save it multiple times before
publishing it to the forum effectively requires that the saveUrl contains a unique session ID in it. This way each
`POST` to the saveUrl can be associated with the same drawing session..

You might want to tweak that saving flow in `/js/gui/CPSendDialog.js` for your own forum.
