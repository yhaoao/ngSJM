angular.module('ngSJM.services', [])
    .factory('UnitProto', function($window) {

        var init = function(row, col) {
            this.row = row;
            this.col = col;
            this.isObstacle = false;

            return this;
        }
        return {
            init: init
        };
    })
    .factory('NodeProto', function() {
        var init = function(value) {
            this.adj = [];
            this.value = value;

            return this;
        };

        var connectTo = function(node) {
            if (!_.contains(this.adj, node)) {
                this.adj.push(node);
            }
        };
        return {
            init: init,
            connectTo: connectTo
        };
    })
    .factory('GraphProto', function(NodeProto) {
        var init = function(n) {
            self = this;
            self.adj = [];

            _.each(_.range(n), function(i) {
                self.adj[i] = [];
            });

            return self;
        };
        var connect = function(s, v) {

            if (!_.contains(this.adj[s], v)) {
                this.adj[s].push(v);
            }

            if (!_.contains(this.adj[v], s)) {
                this.adj[v].push(s);
            }
        };

        var shortestPath = function(s, v) {
            var mem = {};
            var queue = [];
            var visitedNodes = [];
            var found = false;
            var path = null;

            queue.unshift(s);
            visitedNodes.push(s);

            while (queue.length !== 0 && !found) {
                var temp = queue.pop();

                if (temp === v) {
                    found = true;
                } else {
                    var newNodes = _.difference(this.adj[temp], visitedNodes);
                    visitedNodes = newNodes.concat(visitedNodes);
                    queue = newNodes.concat(queue);

                    _.each(newNodes, function(node) {
                        mem[node] = temp;
                    });
                }

            }

            if (found) {
                path = [v];
                var pathNode = v;

                while (pathNode !== s) {
                    pathNode = mem[pathNode];
                    path.unshift(pathNode);
                }
            }
            return path;
        };
        return {
            init: init,
            connect: connect,
            shortestPath: shortestPath
        };
    })
    .factory('Cat', function() {
        var reset = function() {
            this.row = 4;
            this.col = 4;
            this.isFree = true;
            this.state = 'stay';
        }

        return {
            isFree: true,
            row: 4,
            col: 4,
            state: 'stay',
            reset: reset
        }

    })
    .factory('Grid', function(UnitProto, GraphProto) {

        //var obstacleProb = 0.12;
        var obstacleProb = 0;
        var rowCount = 9;
        var colCount = 9;
        var unitCount = rowCount * colCount;



        var units = _.chain(_.range(rowCount * colCount)).map(function(index) {
            var row = parseInt(index / colCount);
            var col = index % colCount;

            var unit = Object.create(UnitProto).init(row, col);

            if (_.random(0, 1, true) < obstacleProb) {
                unit.isObstacle = true;
            }
            return unit;
        }).valueOf()
        units[rowCount * Math.floor(rowCount / 2) + Math.floor(colCount / 2)].isObstacle = false;


        var isInGrid = function(row, col) {
            return row < rowCount && row >= 0 && col < colCount & col >= 0;
        }

        var getUnitCount = function() {
            return rowCount * colCount;
        };

        var getUint = function(row, col) {
            return isInGrid(row, col) ? units[row * rowCount + col] : null;
        };

        var getAdjUints = function(row, col) {
            var results = [];
            _.each(['left', 'right', 'topRight', 'topLeft', 'bottomRight', 'bottomLeft'], function(direction) {
                var temp = getAdjUnitByDirection(row, col, direction);
                if (temp) {
                    results.push(temp);
                }
            });

            return results;

        };

        var isOnEdge = function(row, col) {
            return row === 0 || row === (rowCount - 1) || col === 0 || col === (colCount - 1);
        };

        var getAdjUnitByDirection = function(row, col, direction) {
            switch (direction) {
                case 'left':
                    col--;
                    return getUint(row, col);
                case 'right':
                    col++;
                    return getUint(row, col);
                case 'topRight':
                    row--;
                    if (row % 2 === 0) {
                        col++;
                    }
                    return getUint(row, col);
                case 'topLeft':
                    row--;
                    if (row % 2 === 1) {
                        col--;
                    }
                    return getUint(row, col);
                case 'bottomRight':
                    row++;
                    if (row % 2 === 0) {
                        col++;
                    }
                    return getUint(row, col);
                case 'bottomLeft':
                    row++;
                    if (row % 2 === 1) {
                        col--;
                    }
                    return getUint(row, col);
                default:
                    return null;
            };

        };

        var getNextStep = function(row, col) {
            var visualNodeValue = unitCount;

            var graph = Object.create(GraphProto).init(unitCount + 1);
            var unitToValue = function(unit) {
                return unit.row * colCount + unit.col;
            };
            _.each(units, function(unit) {
                if (unit.isObstacle) {
                    if (unit.row !== row || unit.col !== col) {
                        return;
                    }
                }
                _.each(getAdjUints(unit.row, unit.col), function(adjUnit) {
                    if (adjUnit.isObstacle) {
                        return;
                    }

                    graph.connect(unitToValue(unit), unitToValue(adjUnit));

                    if (isOnEdge(unit.row, unit.col)) {
                        graph.connect(unitToValue(unit), visualNodeValue);
                    }
                });
            });
            var path = graph.shortestPath(row * colCount + col, visualNodeValue);

            if (path) {
                var nextStepValue = path[1];
                return {
                    row: Math.floor(nextStepValue / colCount),
                    col: nextStepValue % colCount
                }
            } else {
                return null;
            }

        };



        var reset = function() {
            _.each(units, function(unit) {
                if (_.random(0, 1, true) < obstacleProb) {
                    unit.isObstacle = true;
                } else {
                    unit.isObstacle = false;
                }
            });
            units[rowCount * Math.floor(rowCount / 2) + Math.floor(colCount / 2)].isObstacle = false;
        };
        var getRandomStep = function(row, col) {

            var unit = _.find(getAdjUints(row, col), function(unit) {
                return !unit.isObstacle;
            });

            return unit ? {
                row: unit.row,
                col: unit.col
            } : null;
        }


        return {
            units: units,
            isInGrid: isInGrid,
            reset: reset,
            getNextStep: getNextStep,
            getAdjUints: getAdjUints,
            isOnEdge: isOnEdge,
            getRandomStep: getRandomStep,
            getUint: getUint

        };
    }).factory('Env', function($window, $timeout) {
        var init = function() {
            var ratio = $window.innerWidth / 500;
            ratio = ratio < 1 ? ratio : 1;
            var styleElm = document.createElement('style');
            styleElm.innerHTML =
                '.scale-x{ -webkit-transform: scale(' + ratio + ', 1);-webkit-transform-origin: bottom left;}' +
                '.scale-y-center{ -webkit-transform: scale(1, ' + ratio + ');-webkit-transform-origin: center center;}' +
                '.scale-y{ -webkit-transform: scale(1, ' + ratio + ');-webkit-transform-origin: bottom;}';
            $window.document.querySelector('head').appendChild(styleElm);
            this.ratio = ratio;
            this.main = $window.document.querySelector('.main-container');
        };

        return {
            init: init
        };
    }).factory('ImgLoader', function($q) {
        var images = [
            '/images/bg.jpg',
            '/images/btn_start.png',
            '/images/fail.png',
            '/images/mao2.png',
            '/images/pot1.png',
            '/images/pot2.png',
            '/images/replay.png',
            '/images/shareBTN.png',
            '/images/stay.png',
            '/images/success.png',
            '/images/weizhu.png'
        ];


        var loadImg = function() {

            var notify = function(src) {
                result.notify(src);
            }

            var deferred = $q.defer();
            var imagesLen = images.length;
            var loadedImagesLen = 0;

            _.each(images, function(src) {
                var img = new Image();
                img.src = src;
                img.addEventListener('load', function() {
                    loadedImagesLen += 1;
                    if (loadedImagesLen === imagesLen) {
                        deferred.resolve();

                    } else {
                        deferred.notify(loadedImagesLen + '/' + imagesLen);
                    }
                });
            });

            return deferred.promise;
        }

        return {
            loadImg: loadImg
        }
    });