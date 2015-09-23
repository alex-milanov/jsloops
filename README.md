# JSLoops
JSLoops is Full-Stack JavaScript Music Production Web App in development, 
part of a the live coding stream "Fun Stuff With JavaScript" at https://www.livecoding.tv/alex_milanov/

The core idea behind it is to create a cloud based music making app that I would actualy use myself.

## Technologies
- Full Stack JavaScript
- Web Audio API
- HTML5 Canvas
- jQuery, sass, jade, gulp

## Links
- [Live coding stream](https://www.livecoding.tv/alex_milanov/) (Mon-Fri 21:00/22:00 EEST)
- [Demo](http://jsloops.wp.alexmilanov.com)
- [Trello](https://trello.com/b/R25n686F/jsloops)


## Setup

### Dependencies
```sh
npm install -g gulp node-serve
# we will need sass
gem install sass
```

### Install & build
```sh
npm install
bower install
gulp build
```

### Running options
the easiest way
```sh
# launches gulp build and gulp serve
gulp
```
just serving
```sh
# launches static server, watch and livereload
gulp serve
```
less resource heavy opiton
```sh
# open in 2 tabs
serve --path dist
gulp watch
```
