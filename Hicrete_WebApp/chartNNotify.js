myApp.controller('mainPageController', function($scope,$http) {
  /** create $scope.template **/
    
    

        Morris.Donut({
            element: 'dashboard-donut-1',
            data: [
                {label: "Completed", value: 542},
                {label: "New", value: 10},
                {label: "Ongoing", value: 25}
            ],
            colors: ['#1caf9a','#1c7baf','#FEA223'],
            resize: true
        });
        /* END Donut dashboard chart */


        /* Bar dashboard chart */
        Morris.Bar({
            element: 'dashboard-bar-1',
            data: [
                { y: 'Oct 10', a: 35, b: 75 },
                { y: 'Oct 11', a: 26, b: 64 },
                { y: 'Oct 12', a: 39, b: 78 },
                { y: 'Oct 13', a: 34, b: 82 },
                { y: 'Oct 14', a: 39, b: 86 },
                { y: 'Oct 15', a: 40, b: 94 },
                { y: 'Oct 16', a: 41, b: 96 }
            ],
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Estimated', 'Actual'],
            barColors: ['#33414E', '#1caf9a'],
            gridTextSize: '10px',
            hideHover: true,
            resize: true,
            gridLineColor: '#E5E5E5'
        });
        /* END Bar dashboard chart */

        /* Line dashboard chart */
        Morris.Line({
            element: 'dashboard-line-1',
            data: [
                { y: '2014-10-10', a: 2,b: 4},
                { y: '2014-10-11', a: 4,b: 6},
                { y: '2014-10-12', a: 7,b: 10},
                { y: '2014-10-13', a: 5,b: 7},
                { y: '2014-10-14', a: 6,b: 9},
                { y: '2014-10-15', a: 9,b: 12},
                { y: '2014-10-16', a: 18,b: 20}
            ],
            xkey: 'y',
            ykeys: ['a','b'],
            labels: ['Sales','Event'],
            resize: true,
            hideHover: true,
            xLabels: 'day',
            gridTextSize: '10px',
            lineColors: ['#1caf9a','#33414E'],
            gridLineColor: '#E5E5E5'
        });
        /* EMD Line dashboard chart */
        /* Moris Area Chart */
        Morris.Area({
            element: 'dashboard-area-1',
            data: [
                { y: '2014-10-10', a: 17,b: 19},
                { y: '2014-10-11', a: 19,b: 21},
                { y: '2014-10-12', a: 22,b: 25},
                { y: '2014-10-13', a: 20,b: 22},
                { y: '2014-10-14', a: 21,b: 24},
                { y: '2014-10-15', a: 34,b: 37},
                { y: '2014-10-16', a: 43,b: 45}
            ],
            xkey: 'y',
            ykeys: ['a','b'],
            labels: ['Sales','Event'],
            resize: true,
            hideHover: true,
            xLabels: 'day',
            gridTextSize: '10px',
            lineColors: ['#1caf9a','#33414E'],
            gridLineColor: '#E5E5E5'
        });
        /* End Moris Area Chart */
        /* Vector Map */
        var jvm_wm = new jvm.WorldMap({container: $('#dashboard-map-seles'),
            map: 'world_mill_en',
            backgroundColor: '#FFFFFF',
            regionsSelectable: true,
            regionStyle: {selected: {fill: '#B64645'},
                initial: {fill: '#33414E'}},
            markerStyle: {initial: {fill: '#1caf9a',
                stroke: '#1caf9a'}},
            markers: [{latLng: [50.27, 30.31], name: 'Kyiv - 1'},
                {latLng: [52.52, 13.40], name: 'Berlin - 2'},
                {latLng: [48.85, 2.35], name: 'Paris - 1'},
                {latLng: [51.51, -0.13], name: 'London - 3'},
                {latLng: [40.71, -74.00], name: 'New York - 5'},
                {latLng: [35.38, 139.69], name: 'Tokyo - 12'},
                {latLng: [37.78, -122.41], name: 'San Francisco - 8'},
                {latLng: [28.61, 77.20], name: 'New Delhi - 4'},
                {latLng: [39.91, 116.39], name: 'Beijing - 3'}]
        });
     

});



