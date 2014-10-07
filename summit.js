var Summit = (function() {
	var _frame = 0,
		CELLSIZE = 17,    //size of the adjacency matrix rectangle
		KNOWPROB = 0.6,  //probability that source KNOWS target
		LIKEPROB = 0.5,  //probability that source LIKES target
		YUMPROB = 0.1,    //probability that source YUMS target
		_svg,
		_teacher,
		_students,
		_yum,
		_likes=[],
		_knows=[],
		_yums=[];
		
	function setup() {
		var teacher = {name:'zero', teacher: true},
			classRoom = [
				teacher,
				{name: 'A'},
				{name: 'B'},
				{name: 'C'},
				{name: 'D'},
				{name: 'E'},
				{name: 'F'},
				{name: 'G'},
				{name: 'H'},
				{name: 'I'},
				{name: 'J'},
				{name: 'K'},
				{name: 'L'},
				{name: 'M'},
				{name: 'N'},
				{name: 'O'},
				{name: 'P'},
				{name: 'Q'},
				{name: 'R'},
				{name: 'S'},
				{name: 'T'},
				{name: 'U'},
				{name: 'V'},
				{name: 'W'},
				{name: 'X'},
				{name: 'Y'},
				{name: 'Z'}
			],
			knows = [],
			likes = [],
			yums =[];
		var edges = [{source: 'A', target: 'B', weight: 3}];
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
	
	function diagramSimulation(nodes,links) {
		//draw a diagram
		var w = 900, h = 500;
		var svg = d3.select("#vis").append("svg")
			.attr("width", w)
			.attr("height", h);

		var vNodes = svg.selectAll('circle')
			.data(nodes)
			.enter()
			.append('circle')
			.attr('r', 3)
			.attr('cx', function(d) {
				return 20*Math.floor(d.key / 1000);
			})
			.attr('cy', function(d) {
				return 20*(d.key - 1000*Math.floor(d.key / 1000)) + 5;
			})
			.attr('key', function(d) {return d.key;})
			.attr('class', function(d) { if (d.fate > 3) return 'breeder';});
			
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
      .attr("transform", "translate(" + (CELLSIZE + 4) * 2 + ", " + (CELLSIZE + 4) * 2 + ")")
      .attr("id", "adjacencyG")
      .selectAll("rect")
      .data(matrix)
      .enter()
      .append("rect")
      .attr("width", CELLSIZE)
      .attr("height", CELLSIZE)
      .attr("x", function (d) {return d.x * CELLSIZE})
      .attr("y", function (d) {return d.y * CELLSIZE})
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("fill", "red")
      .style("fill-opacity", function (d) {return d.weight * .2})
      .on("mouseover", gridOver)
      
      var scaleSize = nodes.length * CELLSIZE;
      var nameScale = d3.scale.ordinal().domain(nodes.map(function (el) {return el.name})).rangePoints([0,scaleSize],1);
      
      xAxis = d3.svg.axis().scale(nameScale).orient("top").tickSize(4);    
      yAxis = d3.svg.axis().scale(nameScale).orient("left").tickSize(4);    
      d3.select("#adjacencyG").append("g").call(xAxis).selectAll("text").transition().style("text-anchor", "end").attr("transform", "translate(-10,-10) rotate(90)");
      d3.select("#adjacencyG").append("g").call(yAxis);
      
      function gridOver(d,i) {
        d3.selectAll("rect").style("stroke-width", function (p) {return p.x == d.x || p.y == d.y ? "3px" : "1px"})
      }

    }
	return {start: function() {return setup();}};
}) ();