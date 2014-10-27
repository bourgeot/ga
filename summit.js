var Summit = (function() {
	var _frame = 0,
		WIDTH = 930,
		HEIGHT = 600,
		RADIUS = 30,
		CELL = 10,
		//RADIUS = 22,
		DISPLAY = 640,
		//size of the adjacency matrix rectangle
		KNOWPROB = 0.1,  //probability that source KNOWS target
		LIKEPROB = 0.05,  //probability that source LIKES target
		_svg,
		_teacher,
		_classRoom = [],
		_classRoomG,
		_classMatesG,
		_adjacencyG,
		_students,
		_counter = 0,
		_relationships = [];
	var startButton = document.getElementById('start-button'),
		nextButton = document.getElementById('next-button'),
		nDisabled = document.createAttribute('disabled'),
		sDisabled = document.createAttribute('disabled');
		nDisabled.value = 'disabled';
		sDisabled.value = 'disabled';
		
	function setup() {
		startButton.attributes.setNamedItem(sDisabled);
		nextButton.attributes.setNamedItem(nDisabled);
		_counter = 0;
		_teacher = {name:'00', teacher: true, x: 0, y: 0};
		_classRoom = [
			_teacher,
			{name: 'A', student: true, x: 0, y: 0},
			{name: 'B', student: true, x: 0, y: 0},
			{name: 'C', student: true, x: 0, y: 0},
			{name: 'D', student: true, x: 0, y: 0},
			{name: 'E', student: true, x: 0, y: 0},
			{name: 'F', student: true, x: 0, y: 0},
			{name: 'G', student: true, x: 0, y: 0},
			{name: 'H', student: true, x: 0, y: 0},
			{name: 'I', student: true, x: 0, y: 0},
			{name: 'J', student: true, x: 0, y: 0},
			{name: 'K', student: true, x: 0, y: 0},
			{name: 'L', student: true, x: 0, y: 0},
			{name: 'M', student: true, x: 0, y: 0},
			{name: 'N', student: true, x: 0, y: 0},
			{name: 'O', student: true, x: 0, y: 0},
			{name: 'P', student: true, x: 0, y: 0},
			{name: 'Q', student: true, x: 0, y: 0},
			{name: 'R', student: true, x: 0, y: 0},
			{name: 'S', student: true, x: 0, y: 0},
			{name: 'T', student: true, x: 0, y: 0},
			{name: 'U', student: true, x: 0, y: 0},
			{name: 'V', student: true, x: 0, y: 0},
			{name: 'W', student: true, x: 0, y: 0},
			{name: 'X', student: true, x: 0, y: 0},
			{name: 'Y', student: true, x: 0, y: 0},
			{name: 'Z', student: true, x: 0, y: 0}
		];
		//setupRelationships();
		var dSvg, dClassRoomGX, dClassRoomGY, dClassMatesY, dCircles;
		//var edges = [{source: 'A', target: 'B', weight: 3}];
		_classRoomG = d3.select('svg').append('g')
			.attr('id', 'classroom-X')
			.attr('transform', 'translate(40,3)');
		_classMatesG = _classRoomG
			.selectAll('g')
			.data(_classRoom)
			.enter()
			.append('g')
			.attr('id', function(d) { return d.name;})
			.attr('x', function(d, i) {
				var m = i % 8;
				d.x = m*RADIUS * 4;
				return d.x;
			})
			.attr('y', function(d, i) { 
				var m = Math.floor(i/8);
				d.y = 40 + (m * RADIUS*4);
				return d.y;
			})
     		.attr('transform', function(d) { return 'translate(' + d.x + ', ' + d.y + ')';});

			//.attr('transform', function(d, i) { return 'translate(' + i * RADIUS * 2.3 + ', ' + RADIUS + ')';});
		_classMatesG.append('text')
				.attr('text-anchor', 'middle')
				.text(function(d) {
					return d.name;
				})
				.attr('font-family', 'sans-serif')
				.attr('font-size', 0.5 * RADIUS)
				.attr('y', -0.25*RADIUS)
				.attr('fill', 'none')
				.attr('fill-opacity', 0)
				.transition().delay(700).duration(1250)
				.attr('fill', 'black')
				.attr('fill-opacity', 1)
				.attr('font-weight', 'bold');
		_classMatesG.append('text')
				.attr('text-anchor', 'middle')
				.text(function(d) {
					var t = '';
					if(d.student) {
						t = 'student';
					}
					else {
						t=  'teacher';
					}
					return t;
				})
				.attr('font-family', 'sans-serif')
				.attr('font-size', 0.5 * RADIUS)
				.attr('y', RADIUS*0.5 - (0.25*RADIUS))
				.attr('fill', 'none')
				.attr('fill-opacity', 0)
				.transition().delay(700).duration(1250)
				.attr('fill', 'black')
				.attr('fill-opacity', 1)
				.attr('font-weight', 'bold');

		_classMatesG.append('circle')
				.attr('r', 0)
				//.attr('cx', function (d, i) {return (i * RADIUS * 2.3);})
				//.attr('cy', function (d, i) {return RADIUS;})
				.style('stroke', 'black')
				.style('stroke-width', '1px')
				.style('fill', 'steelblue')
				.style('fill-opacity', 0.3)
				.transition().duration(1250)
				.attr('r', RADIUS);	
		send(_classRoom,'nodes', dbStatus);
		//createAdjacencyMatrix(_classRoom,_relationships);
	}

	function setupRelationships() {
		var i, j, r, m, relProb = [[KNOWPROB, 'KNOWS'], [LIKEPROB, 'LIKES']];
		//console.log(relProb);
		//turn down the circles
		_classMatesG.selectAll('circle')
			.transition().duration(1250)
			.attr('r', 0);
		_classMatesG.selectAll('text')
			.transition().duration(1250)
			.attr('fill-opacity', 0);
		//done turning down
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
		//console.log(_relationships.length);
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
	  
      _adjacencyG = d3.select("svg")
		.append("g")
		.attr("transform", "translate(30,23)")
		.attr("id", "adjacencyG");
      _adjacencyG.selectAll("rect")
		  .data(matrix)
		  .enter()
		  .append("rect")
		  .attr("width", CELL * 2)
		  .attr("height", CELL * 2)
		  .attr("x", function (d) {return d.x * CELL * 2.3;})
		  .attr("y", function (d) {return d.y * CELL * 2.3})
		  .style("stroke", "black")
		  .style("stroke-width", "1px")
		  .style("fill", function (d) {
			var f;
			//console.log (d.type);
			if (d.type == 'KNOWS') {
				f = 'red';
			}
			else if (d.type == 'LIKES') {
				f = 'blue';
			}
			else {
				f = 'purple';
			}
			return f;
		  })
		  .on("mouseover", gridOver);
	
	  dbStatus('matrix done');
      
      var scaleSize = nodes.length * CELL*2.3;
      var nameScale = d3.scale.ordinal().domain(nodes.map(function (el) {return el.name})).rangePoints([0,scaleSize],1);
      
      xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);    
     yAxis = d3.svg.axis().scale(nameScale).orient("left").tickSize(4);    
      d3.select("#adjacencyG").append("g").call(xAxis)
		.selectAll("text").transition().style("text-anchor", "end").attr("transform", "translate(-10,-10) rotate(90)");
      d3.select("#adjacencyG").append("g").call(yAxis);
      
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
		_counter = 5;
		neo4J.query(q, dbStatus, true);
		if(startButton.attributes.getNamedItem('disabled') !== null) {
			startButton.attributes.removeNamedItem('disabled');
		}
	}
	function next() {
		nextButton.attributes.setNamedItem(nDisabled);
		switch(_counter) {
			case 1:
				setupRelationships();
			break;
			case 2:
				createAdjacencyMatrix(_classRoom, _relationships);
			break;
			case 3:
				network();
			break;
			case 4:
				//alert(_counter);
			break;
			default:
				console.log(_counter);
		}
	}
	function dbStatus(result) {
		/*  update the counter
			enable the next button
		*/
		console.log(result);
		_counter++;
		if(nextButton.attributes.getNamedItem('disabled') !== null) {
			nextButton.attributes.removeNamedItem('disabled');
		}
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
							+ "'})  CREATE (m)-[r:" + array[i].type + "]->(n) RETURN m.name, n.name, type(r)"

						}
					);
				}
			
			break;
			case 'query':
				for(i=0; i < array.length; i++) {
					q.statements.push(array[i]);
				}
			break;
			default:
				//send the query as written for beter or worse
		}
		neo4J.query(q, callback, true);
	}
	function network() {
		//turn down adjacencyG
		d3.select('#adjacencyG').remove();
			//.selectAll('rect')
			//.transition()
			//.attr('fill-opacity',0);

		//done turn down
		/*var radius = 250,
			offset = 300,
			theta = 0,
			i, j, x, y,
			step = 2 * Math.PI / _classRoom.length;*/
		//d3.select('#adjacencyG').selectAll('rect')
			//.transition().style('fill-opacity', '0.0').style('stroke-opacity', '0.0');
		//nodes
		//d3.select('#classroom-X').selectAll('g')
		_classMatesG
			.data(_classRoom)

			.attr('x', function(d, i) {
				//d.x = radius * Math.cos(step * i) + offset;
				d.x = (-0.5 * RADIUS + Math.random() * WIDTH) + 1;
				return d.x;
			})
			.attr('y', function(d, i) { 
				//d.y = radius * Math.sin(step * i) + offset;
				d.y = ( RADIUS + Math.random() * HEIGHT) + 1;
				return d.y;
			})
			.attr('transform', 
				function(d, i) {
					return 'translate(' + d.x + ', ' + d.y + ')';
				}
			);
		//lines
		//console.log(_relationships);


		d3.select('#classroom-X').append('g').selectAll('path')
			.data(_relationships)
			.enter()
			.append('path')
			.attr('class', function(d) {
				return 'link ' + d.type;
			})
			.attr('d', function(d) {
				var dx = d.target.x - d.source.x,
					dy = d.target.y - d.source.y,
					dr = Math.sqrt(dx * dx + dy * dy);
					return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
			});
		_classMatesG.selectAll('circle')
				//.attr('cx', function (d, i) {return (i * RADIUS * 2.3);})
				//.attr('cy', function (d, i) {return RADIUS;})
				.style('stroke', 'black')
				.style('stroke-width', '1px')
				.style('fill', 'steelblue')
				.style('fill-opacity', 0)
				//.on('click',findFriends)
				.transition().duration(750)
				.attr('r', RADIUS)
				.style('fill-opacity', 1);	
		_classMatesG.selectAll('text')
			.transition().delay(700).duration(1250)
			.attr('fill-opacity', 1);
		//done turning down				
		dbStatus('network done');
	}
	function findFriends(d) {
		//console.log(d);
		//console.log(i);
		//console.log(this);
		var q = [
			{
				statement: "MATCH p = (m)-[:KNOWS]->(n)  WHERE m.name='" + d.name + "' RETURN nodes(p)"
			},
			{
				statement: "MATCH p = (m)-[:LIKES]->(n)  WHERE m.name='" + d.name + "' RETURN nodes(p)"
			}
		];
		send(q, 'query', highlightPaths);
	}
	function highlightPaths(response) {
		console.log(response.result.results[0]);
		//check the contents of the data array
		var highlights = {
			knows: response.result.results[0].data[0].row[0],
			likes: response.result.results[0].data[0].row[0]
		};
		console.log(highlights);
	}
	//return public methods
	return {
		start: function() {return setup();}, 
		reset: function() {return reset();},
		next: function() {return next(); }
	};
}) ();

/*
how much is someone liked and known
match (n)-[r]->(x) return count(n), type(r), x.name order by x.name
how many does someone know and like
match (n:Person)-[r]->(x) return n.name, type(r), count(x) order by n.name

*/