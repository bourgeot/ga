var neo4J = (function() {
	//local private variables.
	//service root
	var aService;
	//transaction 
	function rQuery (statements, callback, autoCommit) {
		var response = {},
			endpoint = aService.transaction,
			xhr = new XMLHttpRequest();
		if (!autoCommit) {
			endpoint = aService.commit;
		}
		xhr.open('POST', endpoint, true);	
		xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
		xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
		xhr.setRequestHeader("X-Stream", "true");
		xhr.send(JSON.stringify(statements)); //send the serialized object
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				switch(xhr.status) {
					case 200:
					//document.getElementById("response").innerHTML=xhr.responseText;
						response = JSON.parse(xhr.responseText);
					break;
				}
				//console.log(aService);
				//load(service);
			}
		}
		callback(response);
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
	
	
	return {service : function() { return pService();}}
})(); 