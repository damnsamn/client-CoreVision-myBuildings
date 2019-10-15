# Framework Dependencies
Below are the technologies and dependencies the myBuildings framework will require.
* Sass SCSS
* Bootstrap 4.3.1
* Font Awesome 5.11
* **Jekyll 4.0.0 (static templating)**
	* Jekyll is used as an analog for any equivalent templating method (myBuildings ASP.NET)
	* Solely for the development and display of this front-end framework - *this should not be ported over to the actual solution*

## Jekyll Instructions
To run:

1. Install Jekyll:
```
gem install bundler jekyll
```
2. Open cmd/terminal and cd to directory:
```
cd client-CoreVision-myBuildings
```
3. Run bundle install to ensure the right gems are installed:
```
bundle install
```
4. Execute Jekyll build & serve:
```
bundle exec jekyll serve --watch -l -H
```