var neo4J = (function() {
	//local private variables.
	//service root
	var aService;
	//transaction 

	function rQuery (statements, callback, sendCommit) {
		var response = {result: {}, commited: "open"},
			endpoint = aService.transaction,
			xhr = new XMLHttpRequest();
		//if (!sendCommit) {
		//	endpoint = aService.commit;
		//}
		xhr.open('POST', endpoint, true);	
		xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
		xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
		//xhr.setRequestHeader("X-Stream", "true");
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(JSON.stringify(statements)); //send the serialized object
		//xhr.send(statements);
		xhr.onreadystatechange=function() {
			if (xhr.readyState==4) {
				switch(xhr.status) {
					case 200:
					case 201:
					//document.getElementById("response").innerHTML=xhr.responseText;
						response.result = JSON.parse(xhr.responseText);
						if (sendCommit) {
							xhr.open('POST', response.result.commit, true);
							xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
							xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
							xhr.setRequestHeader("Content-Type", "application/json");
							xhr.send(); //send the commit request.
							xhr.onreadystatechange=function() {
								if (xhr.readyState==4) {
									switch(xhr.status) {
										case 200:
										case 201:
										//document.getElementById("response").innerHTML=xhr.responseText;
											response.commited = 'committed';
											callback(response);
											break;
										default:
											alert('commit failed');
											console.log(JSON.parse(xhr.responseText));
									}
								}
							}
						}
						else {
							callback(response);
						}
						break;
					default:
						alert('something went wrong');
						console.log(response);
				}
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
	return {service : function() { return pService();}, query: rQuery}
})(); 

