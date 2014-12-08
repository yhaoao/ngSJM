angular.module('ngSJM.controllers', []).controller('mainCtrl', function($scope, $window, Grid, Cat, ImgLoader) {
    var uintWidth = 50;
    var steps = 0;

    $scope.units = Grid.units;
    $scope.cat = Cat;
    $scope.global = {
        gameState: 'loading'
    };

    ImgLoader.loadImg().then(
        function() {
            $scope.global.gameState='start';
        },
        function() {
            alert('网络错误');
        },
        function(process) {
            $scope.global.loadingProcess=process;
        }
    );

    $scope.startGame = function() {
        $scope.global.gameState = 'running';
        steps = 0;
        Cat.reset();
        Grid.reset();
    }

    $scope.setObstacle = function(unit) {
        if (unit.isObstacle) {
            return;
        }
        steps += 1;
        unit.isObstacle = true;

        if (Grid.isOnEdge(Cat.row, Cat.col)) {
            $scope.global.gameState = "end";
            $scope.global.gameResult = {
                state: 'fail'
            }
            return;
        }
        var nextEscapStep = Grid.getNextStep(Cat.row, Cat.col);
        var nextRandomStep = Grid.getRandomStep(Cat.row, Cat.col);

        if (!nextEscapStep) {
            $scope.cat.state = 'weizhu';
        }
        var nextStep = nextEscapStep || nextRandomStep;
        if (nextStep) {
            Cat.row = nextStep.row;
            Cat.col = nextStep.col;
            return;
        }

        $scope.global.gameState = "end";
        $scope.global.gameResult = {
            state: "success",
            steps: steps
        }
        return;
    };

    $scope.getUintStyle = function(unit) {
        var bottom = (8 - unit.row) * uintWidth;
        var left = uintWidth / 4 + unit.col * uintWidth;
        if (unit.row % 2 == 1) {
            left += uintWidth / 2;
        }

        var backgroundImage = 'url(/images/pot1.png)';

        if (unit.isObstacle) {
            backgroundImage = 'url(/images/pot2.png)';
        }

        return {
            bottom: bottom + 'px',
            left: left + 'px',
            width: uintWidth + 'px',
            height: uintWidth + 'px',
            backgroundImage: backgroundImage
        };
    };

    $scope.getCatStyle = function() {
        var bottom = (8 - Cat.row) * uintWidth + uintWidth / 3;
        var left = uintWidth / 4 + Cat.col * uintWidth - (60 - uintWidth) / 2;
        if (Cat.row % 2 == 1) {
            left += uintWidth / 2;
        }

        return {
            bottom: bottom,
            left: left,
        }
    };
});