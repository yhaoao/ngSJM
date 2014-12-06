angular.module('ngSJM.controllers', []).controller('mainCtrl', function($scope, $window, Grid, Cat) {
	var uintWidth = parseInt($window.innerWidth / 10);
	var canJump = function(row, col) {
		return _.some(Grid.getAdjUints(row, col), function(unit) {
			return !unit.isObstacle;
		});
	};

	var randomJump = function(row, col) {
		_.some(Grid.getAdjUints(row, col), function(unit) {
			return !unit.isObstacle;
		})
	};

	$scope.units = Grid.units;

	$scope.setObstacle = function(unit) {
		if (unit.isObstacle) {
			return;
		} else {
			unit.isObstacle = true;
			if (Grid.isOnEdge(Cat.row, Cat.col)) {
				alert('你让它跑啦');
				Grid.reset();
				Cat.reset();
			}
			if (!canJump(Cat.row, Cat.col)) {
				alert('你赢啦');
				return;
			}

			var nextStep = Grid.getNextStep(Cat);
			if(nextStep){
				Cat.row = nextStep.row;
				Cat.col = nextStep.col;
			}
		}
	};

	$scope.getUintStyle = function(unit) {
		var bottom = (8 - unit.row) * uintWidth;
		var left = uintWidth / 4 + unit.col * uintWidth;
		if (unit.row % 2 == 1) {
			left += uintWidth / 2;
		}

		var backgroundImage = 'url(http://192.168.199.120:8080//pot1.png)';

		if (unit.isObstacle) {
			backgroundImage = 'url(http://192.168.199.120:8080//pot2.png)';
		}

		return {
			bottom: bottom,
			left: left,
			width: uintWidth,
			height: uintWidth,
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