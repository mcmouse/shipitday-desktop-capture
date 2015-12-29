# VidSketch
Chrome extension and NodeJS server to capture a user's desktop, add some simple overlays, and distribute in a variety of formats.

[Published on the Chrome App Store](https://chrome.google.com/webstore/detail/vidsketch/pmfeakipkeenfhglebfbbfiopaghdodd)!

---

To get the project going, you will need to install a few dependencies. I'm open to splitting the repo into server and client projects so that the back-end guys don't need to install Compass but if you've got Ruby installed it takes two seconds so I'm not gonna do that unless you ask.

## Dependencies

1. [NodeJS/NPM](http://nodejs.org/) for the server and the build pipeline. Make sure that you've got node/npm installed globally.
2. [FFMPEG](https://www.google.com/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#safe=off&q=install+ffmpeg) for the server. This one is a little more of a pain to get going, let me know if you have issues. I recommend [this guide](https://trac.ffmpeg.org/wiki/CompilationGuide/MacOSX) for installing on OSX. Again, important that this is installed globally.
3. [Ruby](https://www.ruby-lang.org/en/documentation/installation/), [Bundler](http://bundler.io/), and [Compass](http://compass-style.org/) for SASS compilation

## Startup
1. `git clone https://github.com/mcmouse/shipitday-desktop-capture.git`
2. `cd shipitday-desktop-capture`
3. `npm install`
4. `bundle install`
5. `cd src/server`
6. `npm install` (to install server-specific packages)
7. `cd ../..`
8. `gulp watch`

### What `gulp watch` will do is:

* Build src to dist, moving files, preprocessing SCSS and JS.
* Watch directory for changes, firing individual build tasks when files are updated.
* Launch the node server at localhost:3100, restarting it when it detects local changes
* Launch a webserver at localhost:3000, serving the dist/extension directory and restarting it when it detects local changes.

Note that we'll need to figure out a better way of watching for changes on the extension once we have chrome.desktopCapture working, as we don't have access to that API in the browser (only in the extension).

## Working with the project

Work in the dev branch. Commit frequently! Ideally our tasks are separate enough that we'll all be working in different areas of the project. If you find you're stepping on a lot of toes, bring it up so we can figure out how to work around that. Once we've got a baseline product, we'll start merging "releases" into master so that we've always got a working copy.

To run the extension, you will need to go into Chrome > More Tools > Extensions, click "Load unpacked extension...", and choose the "dist/extension" directory in the project.
