# What is that ?

This is a test repository I used for experimenting the auto deployment of a basic electron app to create, with electron-builder, the bundles for the different platforms (win32, macos, linux).

Building of the app is done with the CI services integrated with github, especially github actions. I initially tried with travis CI but got issue having a working travis.yml config. I certainly more quickly found an appropriate github action workflow file than a travis file (in a word, this experience does not mean it cannot work with travis ... and to tell you the truth I struggled installing snapcraft for the linux packages but anyway disabled that build with electron-builder).

For MacOS, the auto-update does not work. And, well, you must sign your app to make it work it seems and to sign an app you need a certificate from Apple, which, and that's unbelievable, requires you to pay fees. So if you want to provide a service to Mac users, you need to pay fees. Great.

## Licenses

The icon `icons/markdown-brands.svg` is provided by [fontawesome.com](fontawesome.com) and is released under the [Creative Commons Attribution 4.0 International license](https://fontawesome.com/license).

It has been then converted to png and icns for this demo application.

For the creation of the png 1024x1024 icon using [imagemagick convert](https://imagemagick.org/index.php) :

	convert markdown-brands.svg -resize x1024 -thumbnail '1024>x1024' -background white -gravity center -extent 1024x1024 icon.png

And then for the creation of the icns icon for MacOS, using [png2icns](https://www.npmjs.com/package/png2icns) :

	for s in {16,32,48,128,256,512}; do convert icon.png -resize $sx$s icon_${s}px.png; done
	png2icns icon.icns icon_*.png 

For the creation of the Windows ico file: 

	convert icon.png -define icon:auto-resize=16,32,48,64,256 icon.ico

Let me tell you Open Source is fantastic.

## Testing the app

For testing the app, you simply :

	cd app
	yarn
	yarn start

The app has been developed following the book "Electron project: build over 9 cross-platform desktop applications from scratch"

## Building with Github actions

Building the packages and providing draft releases is done with github actions especially the [samuelmeuli/action-electron-builder](https://github.com/samuelmeuli/action-electron-builder/) GitHub Action.

That's the GitHub action which is automatically building the app and pushing the assets in a draft release. The only thing you have to do at the end is validate the release.
