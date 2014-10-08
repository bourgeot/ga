var Summit = (function() {
	var _frame = 0,
		RADIUS = 10,
		DISPLAY = 640,
		CELLSIZE = 17,    //size of the adjacency matrix rectangle
		KNOWPROB = 0.6,  //probability that source KNOWS target
		LIKEPROB = 0.5,  //probability that source LIKES target
		CRAVEPROB = 0.1,    //probability that source CRAVES target
		_svg,
		_teacher,
		_students,
		_crave,
		_likes=[],
		_knows=[],
		_craves=[];
		
	function setup() {
		var teacher = {name:'00', teacher: true},
			classRoom = [
				teacher,
				{name: 'A', student: true},
				{name: 'B', student: true},
				{name: 'C', student: true},
				{name: 'D', student: true},
				{name: 'E', student: true},
				{name: 'F', student: true},
				{name: 'G', student: true},
				{name: 'H', student: true},
				{name: 'I', student: true},
				{name: 'J', student: true},
				{name: 'K', student: true},
				{name: 'L', student: true},
				{name: 'M', student: true},
				{name: 'N', student: true},
				{name: 'O', student: true},
				{name: 'P', student: true},
				{name: 'Q', student: true},
				{name: 'R', student: true},
				{name: 'S', student: true},
				{name: 'T', student: true},
				{name: 'U', student: true},
				{name: 'V', student: true},
				{name: 'W', student: true},
				{name: 'X', student: true},
				{name: 'Y', student: true},
				{name: 'Z', student: true}
			],
			knows = [],
			likes = [],
			craves =[];
		var dSvg, dClassRoomGX, dClassRoomGY, dClassMatesX, dClassMatesY, dCircles;
		var edges = [{source: 'A', target: 'B', weight: 3}];
		dClassRoomGX = d3.select('svg').append('g')
			.attr('id', 'classroom-X')
			.attr('transform', 'translate(40,3)');
		dClassMatesX = dClassRoomGX
			.selectAll('g')
			.data(classRoom)
			.enter()
			.append('g')
			.attr('transform', function(d, i) { return 'translate(' + i * RADIUS * 2.3 + ', ' + RADIUS + ')';});
		dClassMatesX.append('text')
				.attr('text-anchor', 'middle')
				.text(function(d) {return d.name;})
				.attr('font-family', 'sans-serif')
				.attr('font-size', RADIUS)
				.attr('y', 0.33 * RADIUS)
				.attr('fill', 'none')
				.transition().duration(1250)
				.attr('fill', 'black')
				.attr('font-weight', 'bold');
		dClassMatesX.append('circle')
				.attr('r', 0)
				//.attr('cx', function (d, i) {return (i * RADIUS * 2.3);})
				//.attr('cy', function (d, i) {return RADIUS;})
				.style('stroke', 'black')
				.style('stroke-width', '1px')
				.style('fill', 'steelblue')
				.style('fill-opacity', 0.3)
				.transition().duration(1250)
				.attr('r', RADIUS);
				
		dClassRoomGY = d3.select('svg').append('g')
			.attr('id', 'classroom-X')
			.attr('transform', 'translate(9, 33)');				
		dClassMatesY = dClassRoomGY
			.selectAll('g')
			.data(classRoom)
			.enter()
			.append('g')
			.attr('transform', function(d, i) { return 'translate(' + RADIUS + ', ' + i * RADIUS * 2.3 + ')';});
		dClassMatesY.append('text')
				.attr('text-anchor', 'middle')
				.text(function(d) {return d.name;})
				.attr('font-family', 'sans-serif')
				.attr('font-size', RADIUS)
				.attr('y', 0.33 * RADIUS)
				.attr('fill', 'none')
				.transition().duration(1250)
				.attr('fill', 'black')
				.attr('font-weight', 'bold');
		dClassMatesY.append('circle')
				.attr('r', 0)
				//.attr('cx', function (d, i) {return (i * RADIUS * 2.3);})
				//.attr('cy', function (d, i) {return RADIUS;})
				.style('stroke', 'black')
				.style('stroke-width', '1px')
				.style('fill', 'steelblue')
				.style('fill-opacity', 0.3)
				.transition().duration(1250)
				.attr('r', RADIUS);

		createAdjacencyMatrix(classRoom,edges);
	}
	function addNode(node, list, sendIt) {
		//add a node to the list (and push it to db)
		list.push(node);
		if (sendIt) {
			//send it along to the database
		}
		
	}
	function addRelationship(relType, source, target, sendIt) {
		
		//console.log(k);
	}
	
	function createAdjacencyMatrix(nodes,edges) {
      var edgeHash = {};
      for (x in edges) {
        var id = edges[x].source + "-" + edges[x].target;
        edgeHash[id] = edges[x];
      }
      matrix = [];
      //create all possible edges
      for (a in nodes) {
        for (b in nodes) {
          //var grid = {id: nodes[a].id + "-" + nodes[b].id, x: b, y: a, weight: 0};
          var grid = {id: nodes[a].name + "-" + nodes[b].name, x: b, y: a, weight: 0};
          if (edgeHash[grid.id]) {
            grid.weight = edgeHash[grid.id].weight;
          }
          matrix.push(grid);
        }
      }
      //console.log(matrix);
      d3.select("svg")
      .append("g")
      .attr("transform", "translate(30,23)")
      .attr("id", "adjacencyG")
      .selectAll("rect")
      .data(matrix)
      .enter()
      .append("rect")
      .attr("width", RADIUS * 2)
      .attr("height", RADIUS * 2)
      .attr("x", function (d) {return d.x * RADIUS * 2.3;})
      .attr("y", function (d) {return d.y * RADIUS * 2.3})
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("fill", "red")
      .style("fill-opacity", function (d) {return d.weight * .2;})
      .on("mouseover", gridOver)
      
      //var scaleSize = nodes.length * CELLSIZE;
      //var nameScale = d3.scale.ordinal().domain(nodes.map(function (el) {return el.name})).rangePoints([0,scaleSize],1);
      
      //xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);    
     // yAxis = d3.svg.axis().scale(nameScale).orient("left").tickSize(4);    
      //d3.select("#adjacencyG").append("g").call(xAxis); //.selectAll("text").transition().style("text-anchor", "end").attr("transform", "translate(-10,-10) rotate(90)");
      //d3.select("#adjacencyG").append("g").call(yAxis);
      
      function gridOver(d,i) {
        d3.selectAll("rect").style("stroke-width", function (p) {return p.x == d.x || p.y == d.y ? "3px" : "1px"})
      }

    }
	return {start: function() {return setup();}};
}) ();