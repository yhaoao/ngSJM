angular.module('ngSJM.controllers', []).controller('MainController', function($scope, $window, Grid, Cat, ImgLoader, Env) {
    var uintWidth = 50;
    var steps = 0;
    var evenMargin = uintWidth / 4;
    var oddMargin = (uintWidth * 3) / 4;
    Env.init();

    var setObstacle = function(unit) {
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

    $scope.units = Grid.units;
    $scope.cat = Cat;
    $scope.global = {
        gameState: 'loading'
    };
    

    ImgLoader.loadImg().then(
        function() {
            Env.init();
            console.log('hello');
            $scope.global.gameState = 'start';
        },
        function() {
            alert('网络错误,请检查网络');
        },
        function(process) {
            $scope.global.loadingProcess = process;
        }
    );

    $scope.startGame = function() {
        $scope.global.gameState = 'running';
        steps = 0;
        Cat.reset();
        Grid.reset();
    };

    $scope.gameHandler = function(event) {
        var row, col;
        row = Math.floor((event.y - Env.main.getBoundingClientRect().top) / (uintWidth * Env.ratio));
        if (row % 2 === 1) {
            col = Math.floor((event.x - Env.main.getBoundingClientRect().left - oddMargin * Env.ratio) / (uintWidth * Env.ratio));
        } else {
            col = Math.floor((event.x - Env.main.getBoundingClientRect().left - evenMargin * Env.ratio) / (uintWidth * Env.ratio));
        }
        var unit = Grid.getUint(row, col);
        if (unit) {
            setObstacle(unit);
        }
    };

    $scope.getUintStyle = function(unit) {
        var bottom = (9 - unit.row) * uintWidth;
        var left = unit.col * uintWidth;
        if (unit.row % 2 === 1) {
            left += oddMargin;
        } else {
            left += evenMargin;
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
        var bottom = (9 - Cat.row) * uintWidth + uintWidth / 3;
        var left = Cat.col * uintWidth - (60 - uintWidth) / 2;
        if (Cat.row % 2 == 1) {
            left += oddMargin;
        } else {
            left += evenMargin;
        }
        return {
            bottom: bottom,
            left: left,
        }
    };
});