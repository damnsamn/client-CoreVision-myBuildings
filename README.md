# Description
This repository is a new static front-end framework for the CoreVision myBuildings product. The meat of the project will be SCSS and corresponding HTML templates per-component. You will see some liquid tags for Jekyll scattered throughout **some** of the HTML though, which can be ignored - this was used to build the website using Jekyll during development.

# Framework Dependencies
Below are the technologies and dependencies the myBuildings framework will require. Version numbers are those used in this front-end package. Any upgrades should be done with caution, and according to the appropriate documentation.
* [Sass/SCSS](https://sass-lang.com/)
* [Bootstrap](https://getbootstrap.com/docs/4.3/getting-started/introduction/) v4.3.1
* [jQuery DataTables](https://datatables.net/) v1.10.20
    * FixedColumns v3.3.0 extension
    * Buttons v1.6.1 extension
* [Font Awesome](https://fontawesome.com/icons?d=gallery) v5.11
* **[Jekyll](https://jekyllrb.com/) v4.0.0 (static templating)**
	* Jekyll is used as an analog for any equivalent templating method
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
