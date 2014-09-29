var neo4J = (function() {
	var aService;
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