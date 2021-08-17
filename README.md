# What is that ?

This is a test repository I used for experimenting the auto deployment of a basic electron app to create, with electron-builder, the bundles for the different platforms (win32, macos, linux).

Building of the app is done with the CI services integrated with github, especially Travis CI.

## Testing the app

For testing the app, you simply :

	cd app
	yarn
	yarn start

The app has been developed following the book "Electron project: build over 9 cross-platform desktop applications from scratch"

## Building with Travis

electron-builder will build the bundles, by default in the `app/dist` directory.

For example, when ran on the mac os image, we get that kind of outputs :

```
./dist
./dist/MyMarkdownEditor-1.0.0-mac.zip
./dist/builder-debug.yml
./dist/MyMarkdownEditor-1.0.0.dmg
./dist/mac
./dist/mac/MyMarkdownEditor.app
./dist/mac/MyMarkdownEditor.app/Contents
./dist/mac/MyMarkdownEditor.app/Contents/MacOS
[...]
```

## My notes

for publishing on github, I did generate a personnal access token that I registered in the settings of the repo on travis as `GH_TOKEN` env variable. This is detected by electron-builder and used to post the releases.

see also https://medium.com/@johndyer24/creating-and-deploying-an-auto-updating-electron-app-for-mac-and-windows-using-electron-builder-6a3982c0cee6
