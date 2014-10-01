var neo4J = (function() {
	//local private variables.
	//service root
	var aService;
	//transaction 
	function rQuery (statements, callback, autoCommit) {
		
		var response = {},
			endpoint = neo4J.service().transaction,
			xhr = new XMLHttpRequest();
		if (!autoCommit) {
			endpoint = neo4J.service().transaction + '/commit';
		}
		console.log(typeof endpoint);
		xhr.open("POST", endpoint, true);	
		xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("Content-Type", "application/json");
		//xhr.setRequestHeader("X-Stream", "true");
		xhr.send(JSON.stringify(statements)); //send the serialized object
		//xhr.send(statements);
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				switch(xhr.status) {
					case 200, 201:
					//document.getElementById("response").innerHTML=xhr.responseText;
						response = JSON.parse(xhr.responseText);
						callback(response);
						break;
				}
				//console.log(aService);
				//load(service);
			}
		}

	}
	function pService() {
		//var aService;
		if (aService == null) {
			//var aService;
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
					aService = JSON.parse(xhr.responseText);
					//console.log(aService);
					//load(service);
				}
				return aService;
			}
		}

		else {
			return aService;
		}
	}
	pService();
	
	
	return {service : function() { return pService();}, query : rQuery}
})(); 

function logIt(data) {console.log(data);}
function load() {
	var 	people = [ 
		{name: 'Shawn', key: "shawnbourgeois", birthDay: '22', birthMonth: 'March', birthYear: '1965', children: ['Yvonne'], parents: ['Margo', 'Paul']}, 
		{name:'Thomas', key: "thomasbourgeois", birthDay: '19', birthMonth: 'December', birthYear: '1964', children: ['Yvonne'], parents: ['Michael', 'Verna']},
		{name: 'Yvonne', key: "yvonnebourgeois", birthDay: '01', birthMonth: 'March', birthYear: '1995',parents: ['Thomas', 'Shawn']},
		{name: 'Michael', key: "michaelbourgeois", birthDay: '16', birthMonth: 'November', birthYear: '1942',  children: ['Thomas'], parents: ['Walter', 'Marion']},
		{name: 'Verna', key: "vernabourgeois", birthDay: '01', birthMonth: 'November', birthYear: '1937', children: ['Mark', 'Celeste', 'Christopher', 'Thomas'], parents: ['Rose']}
	];
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
	var query = {statements:[]};
	var cQ = {statement: 'CREATE (n:Person {nodes}) RETURN n', parameters: {}};
	cQ.parameters = {nodes: people};
	query.statements.push(cQ);
	neo4J.query(query, logIt, true);
}