angular.module('ngSJM', ['ngSJM.services', 'ngSJM.controllers', 'ngSJM.directives']).config(function() {

}).run(function($window) {

    var ratio = $window.innerWidth / 500;
    ratio = ratio < 1 ? ratio : 1;
    var styleElm = document.createElement('style');
    styleElm.innerHTML =
        '.scale-x{ -webkit-transform: scale(' + ratio + ', 1);-webkit-transform-origin: bottom left;}' +
        '.scale-y{ -webkit-transform: scale(1, ' + ratio + ');-webkit-transform-origin: center center;}';
    document.querySelector('head').appendChild(styleElm);

});