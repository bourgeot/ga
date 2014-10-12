var Summit = (function() {
	var _frame = 0,
		RADIUS = 10,
		DISPLAY = 640,
		CELLSIZE = 17,    //size of the adjacency matrix rectangle
		KNOWPROB = 0.4,  //probability that source KNOWS target
		LIKEPROB = 0.2,  //probability that source LIKES target
		RECOMMENDSPROB = 0.1,    //probability that source RECOMMENDS [to] target
		_svg,
		_teacher,
		_classRoom = [],
		_students,
		_relationships = [];
		
	function setup() {
		_teacher = {name:'00', teacher: true};
		_classRoom = [
			_teacher,
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
		];
		//ship it
		send(_classRoom,'nodes', dbStatus);
		setupRelationships();
		var dSvg, dClassRoomGX, dClassRoomGY, dClassMatesX, dClassMatesY, dCircles;
		//var edges = [{source: 'A', target: 'B', weight: 3}];
		dClassRoomGX = d3.select('svg').append('g')
			.attr('id', 'classroom-X')
			.attr('transform', 'translate(40,3)');
		dClassMatesX = dClassRoomGX
			.selectAll('g')
			.data(_classRoom)
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
			.data(_classRoom)
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

		createAdjacencyMatrix(_classRoom,_relationships);
	}

	function setupRelationships() {
		var i, j, r, m, relProb = [[KNOWPROB, 'KNOWS'], [LIKEPROB, 'LIKES']];
		//console.log(relProb);

		
		for (i = 0; i < _classRoom.length; i++) {
			for (j = 0; j < _classRoom.length; j++) {
				if (i == j) {
					continue;
				}
				for (r = 0; r < 2; r++) {
					m = Math.random();
					//teacher knows everyone but likes no one.
					if(_classRoom[i].teacher == true) {
						if (relProb[r][1] == 'KNOWS') {
							m = 0.001;
						}
						else {
							m = .999;
						}
					}
					if (m <= relProb[r][0]) {					
						_relationships.push( 
							{ 
								source: _classRoom[i],
								target: _classRoom[j],
								type: relProb[r][1] 
							}
						);
					}
				}
			}
		}
		console.log(_relationships.length);
		send(_relationships, 'relationships', dbStatus);
	}
	
	function createAdjacencyMatrix(nodes,edges) {
      var edgeHash = {}, id, n;
      for (x in edges) {
        id = edges[x].source.name + "-" + edges[x].target.name;
		if (edgeHash[id] === undefined) {
			edgeHash[id] = edges[x].type;
		}
		else {
			edgeHash[id] = edgeHash[id] + edges[x].type;
			//console.log(edgeHash[id]);
		}
      }
      matrix = [];
	  //console.log(edgeHash);
      //create all possible edges
      for (a in nodes) {
        for (b in nodes) {
          var grid = {id: nodes[a].name + "-" + nodes[b].name, x: b, y: a, type: ''};
          if (edgeHash[grid.id] === undefined) {
			continue;
		}
		else {
			//console.log(edgeHash[grid.id]);
			grid.type = edgeHash[grid.id];
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
      .style("fill", function (d) {
		var f;
		//console.log (d.type);
		if (d.type == 'KNOWS') {
			f = 'blue';
		}
		else if (d.type == 'LIKES') {
			f = 'red';
		}
		else {
			f = 'purple';
		}
		return f;
	  })
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
	
	function reset() {
		//if the service is available then reset the database to remove all the relationships and delete
		//the nodes
		var q= {statements:[ 
			{statement: "MATCH (:Person)-[r:KNOWS]-(:Person) DELETE r"},
			{statement: "MATCH (:Person)-[r:LIKES]-(:Person) DELETE r"},
			{statement: "MATCH (n:Person) DELETE n"}
		]};
		neo4J.query(q, dbStatus, true);
	}
	function dbStatus(result) {
		console.log(result);
	}
	function send(array, arrayType, callback) {
		//send the array to the database
	/*
		query = {statements:[]};
		var cQ = {statement: 'CREATE (n:Person {nodes}) RETURN n', parameters: {}};
		cQ.parameters = {nodes: data};
		query.statements.push(cQ);
	*/
		var i,q = {statements:[]};
		switch (arrayType) {
			case 'nodes':
				q.statements.push(
					{
						statement: "CREATE (n:Person {nodes}) RETURN n",
						parameters: {nodes: array}
					}
				);
			break;
			case 'relationships':
				for(i=0; i<array.length; i++) {
					q.statements.push(
						{
							statement: "MATCH (m:Person {name: '" + array[i].source.name 
							+ "'}), (n:Person {name: '" + array[i].target.name 
							+ "'})  CREATE (m)-[:" + array[i].type + "]->(n) RETURN m.name, n.name"

						}
					);
				}
			
			break;
			default:
		}
		neo4J.query(q, callback, true);
	}
	//return public methods
	return {
		start: function() {return setup();}, 
		reset: function() {return reset();}
	};
}) ();