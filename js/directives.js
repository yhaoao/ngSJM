angular.module('ngSJM.directives', [])
    .directive('startDialog', function() {

        return {
            restrict: 'E',
            templateUrl: 'tempelate/start_dialog.html',
            replace: true,
            scope: true,
            link: function($scope, $element, $attr) {}
        }
    })
    .directive('loadDialog',function(){
        return {
            restrict: 'E',
            templateUrl: 'tempelate/load_dialog.html',
            replace: true,
            scope: {
                process: '='
            },
            link: function($scope, $element, $attr) {}
        }
    })
    .directive('endDialog', function() {

        return {
            restrict: 'E',
            templateUrl: 'tempelate/end_dialog.html',
            replace: true,
            scope: {
                result: '='
            },
            link: function($scope, $element, $attr) {

                $scope.$watch('result', function(newValue, oldValue) {
                    if (newValue) {
                        $scope.style = {
                            "background-image": 'url(images/mao2.png),url(images/' + newValue.state + '.png)'
                        }
                    }

                });

                $scope.getTitle = function() {
                    return '笑而不语'
                };
            }
        }

    });