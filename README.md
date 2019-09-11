# Mallzee: Insights

Mallzee Insights theme for Ghost blogging platform.

## Versions

- Please maintain the version log found in CHANGELOG.md. This project follows [Semantic Versioning](http://semver.org/).

## Dependencies

- Node 8 LTS

## Installation

- Clone this repo into your Ghost theme folder. Example: `ghost/content/themes/`
- `npm install`

## Running

`gulp serve`

Starts NodeMon and Watch process. The terminal will present you with a host and port that you can hit with your browser.

`gulp`

Compiles files into `assets/dist/`

## Developing with this theme: CSS

* CSS is transpiled from SCSS. Never edit the CSS files directly.
* SCSS files are losley componentised. Creating a new component? Add a new SCSS file and import it into `screen.scss`
* SCSS documents are linted via SASS Lint. Ensure your editor is set-up to lint. The configuration can be found in `/sass-lint.yml`.
* Rem units should be used where logical (anything that should scale against the base font size), using the `rem` mixin.

## Developing with this theme: JS

* Avoid using jQuery and use native JS where possible

## Local development

From the theme folder, `gulp serve` to start the theme in development mode. This will monitor various files for change and re-compile the project on the fly. Assets will be compiled into `assets/dist/` on change. By default Ghost will be available at `localhost:2368`, however to enable testing you'll need to change this (see testing)

## Testing

To enable cross-browser testing with BrowserStack, it is recommended that you run Ghost on port 3000. In the root of your ghost instance, edit `config.development.json`, modifying the `url` and `server.port`:

```
"url": "http://localhost:3000/",
"server": {
  "port": 3000,
  "host": "127.0.0.1"
}
```

Remember to `ghost restart` for this to take effect.
