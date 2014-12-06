angular.module('ngSJM.directives', [])
.directive('startDialog', function() {

    return {
        restrict: 'E',
        template: 	'<div class="dialog">'+
        				'<div class="start-dialog">'+
        					// '<img src="images/btn_start.png"/>'+
        				'</div>'+
        			'</div>',
        replace:true,
        scope: true,
        link: function($scope, $element, $attr) {
        }
    }

})
.directive('endDialog', function() {

    return {
        restrict: 'E',
        transclude: true,
        templateUrl:'tempelate/end_dialog.html',
        scope: {
        	result:'='
        },
        link: function($scope, $element, $attr) {
            $scope.style={
            	"background-image":'url(images/mao2.png),url(images/'+$scope.result+'.png)'
            }

            console.log($scope.style);
        }
    }

});