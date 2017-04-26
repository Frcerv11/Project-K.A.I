var temp = 0;
var over = true;
var change = 0
var limit = 60 * 1,
    duration = 750,
    now = new Date(Date.now() - duration)

var width = 400,
    height = 150


var groups = {
    current: {
        value: 0,
        data: d3.range(limit).map(function() {
            return 0
        })
    }
}

var x = d3.time.scale()
    .domain([now - (limit - 2), now - duration])
    .range([0, width])

var y = d3.scale.linear()
    .domain([0, 600])
    .range([height, 0])

var line = d3.svg.line()
    .interpolate('basis')
    .x(function(d, i) {
        return x(now - (limit - 1 - i) * duration)
    })
    .y(function(d) {
        return y(d)
    })

var svg = d3.select('.graph').append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height + 50)

var axis = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

var colors = d3.scale.linear()
    .domain([300, 500])
    .range(['#D4FF45','red'])



var paths = svg.append('g')

for (var name in groups) {
    var group = groups[name]
    group.path = paths.append('path')
        .data([group.data])
        .attr('class', name + ' group')
        .style('stroke', group.color)
}
var socket = io.connect()
socket.on('pulse', function (duinoData) {

    function tick() {
    	now = new Date()
        // Add new values
        for (var name in groups) {
            var group = groups[name]
            //group.data.push(group.value) // Real values arrive at irregular intervals
            group.data.push(duinoData)
            group.path.attr('d', line)
            // group.path.style("stroke", function(d,i) {console.log('rgb(100, 100, ' + ((d.slice(-1)[0]  * 1) - 200) + ')'); return 'rgb(20, 20, ' + ((d.slice(-1)[0]  * 1) - 200) + ')'});
            group.path.style('stroke', function(d,i) {
		        return colors(d.slice(-1)[0]);
		    })
        }

        // Shift domain
        x.domain([now - (limit - 2) * duration, now - duration])

        // Slide x-axis left
        axis.transition()
            .duration(duration)
            .ease('linear')
            .call(x.axis)

        // Slide paths left
        paths.attr('transform', null)
            .transition()
            .duration(duration)
            .ease('linear')
            .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
            .each('end', tick)


        // Remove oldest data point from each group
        for (var name in groups) {
            var group = groups[name]
            group.data.shift()
        }
    }
    tick()

    var num = duinoData
    Number.prototype.map = function (in_min, in_max, out_min, out_max) {
      return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
    if(num.map(300, 460, 0, 100) < 0){
        num = 0
        $("#effort").text(num + "%")
    }else{
        $("#effort").text(num.map(300, 460, 0, 100) + "%")
    }
    
    
    if(duinoData > change){
        console.log("grossing")
    }else{
        console.log("falling")
    }
    change = duinoData

})