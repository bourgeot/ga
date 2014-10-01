

var request,
	i,j,
	people = [ 
		{name: 'Shawn', key: "shawnbourgeois", birthDay: '22', birthMonth: 'March', birthYear: '1965', children: ['Yvonne'], parents: ['Margo', 'Paul']}, 
		{name:'Thomas', key: "thomasbourgeois", birthDay: '19', birthMonth: 'December', birthYear: '1964', children: ['Yvonne'], parents: ['Michael', 'Verna']},
		{name: 'Yvonne', key: "yvonnebourgeois", birthDay: '01', birthMonth: 'March', birthYear: '1995',parents: ['Thomas', 'Shawn']},
		{name: 'Michael', key: "michaelbourgeois", birthDay: '16', birthMonth: 'November', birthYear: '1942',  children: ['Thomas'], parents: ['Walter', 'Marion']},
		{name: 'Verna', key: "vernabourgeois", birthDay: '01', birthMonth: 'November', birthYear: '1937', children: ['Mark', 'Celeste', 'Christopher', 'Thomas'], parents: ['Rose']}
	];
	//xhr.open(method, url, async)...send(post request)
	/* 
	xmlhttp.open("POST","ajax_test.asp",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("fname=Henry&lname=Ford")
*/	
function setup() {
//returns the service object which has all the urls in it.
	var 	neoServiceRoot = 'http://localhost:7474/db/data/',
		xhr = new XMLHttpRequest();
	xhr.open('GET', neoServiceRoot, true);	
	xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
	xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
	xhr.setRequestHeader("X-Stream", "true");
	xhr.send();
	xhr.onreadystatechange=function() {
		if (xhr.readyState==4 && xhr.status==200) {
			//document.getElementById("response").innerHTML=xhr.responseText;
			service = JSON.parse(xhr.responseText);
			//console.log(service);
			//
			load(service);
		}
	}
}
//run a query and return a result.
function logIt(data) {
	console.log(data);
}
function load(service) {
	//assume data is a list of objects. add them if they haven't already been added based on 'key' value
	//NOT YET--> let each property be a node with name and key attrs same as value, and add a relationship 'has' for it.
	//CREATE (n:Person { name : 'Andres', title : 'Developer' })
	/* {
  "statements" : [ {
    "statement" : "CREATE (n {props}) RETURN n",
    "parameters" : {
      "props" : {
        "name" : "My Node"
      }
    }
  } ]
} */
	var data = people;
	var result,
		query = {statements:[]};
	var cQ = {statement: 'CREATE (n:Person {nodes}) RETURN n', parameters: {}};
	cQ.parameters = {nodes: data};
	query.statements.push(cQ);
	//query.params = {nodes: []};
	
	//console.log(query);
		var xhr = new XMLHttpRequest();
		xhr.open("POST", service.transaction + '/commit', true);
		xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
		xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
		//xhr.setRequestHeader("X-Stream", "true");
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(query));
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4 && xhr.status==200) {
				//document.getElementById("response").innerHTML=xhr.responseText;
				result = JSON.parse(xhr.responseText);
				console.log(result);
			}
		}
}
function neoQuery(query, result) {
	
}