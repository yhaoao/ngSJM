angular.module('ngSJM', ['ngSJM.services', 'ngSJM.controllers', 'ngSJM.directives']).config(function() {

}).run(function($window, Env) {
    Env.init();
});