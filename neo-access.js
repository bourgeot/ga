//returns the service object which has all the urls in it.
function neoSetup() {

var request,
	neoServiceRoot = 'http://localhost:7474/db/data/',
	service = {},
	xhr = new XMLHttpRequest(),
	i,j,
	people = [ 
		{name: 'Shawn', birthDay: '22', birthMonth: 'March', birthYear: '1965', children: ['Yvonne'], parents: ['Margo', 'Paul']}, 
		{name:'Thomas', birthDay: '19', birthMonth: 'December', birthYear: '1964', children: ['Yvonne'], parents: ['Michael', 'Verna']},
		{name: 'Yvonne', birthDay: '01', birthMonth: 'March', birthYear: '1995',parents: ['Thomas', 'Shawn']},
		{name: 'Michael', birthDay: '16', birthMonth: 'November', birthYear: '1942',  children: ['Thomas'], parents: ['Walter', 'Marion']},
		{name: 'Verna', birthDay: '01', birthMonth: 'November', birthYear: '1937', children: ['Mark', 'Celeste', 'Christopher', 'Thomas'], parents: ['Rose']}
	];
	//xhr.open(method, url, async)...send(post request)
	/* 
	xmlhttp.open("POST","ajax_test.asp",true);
xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlhttp.send("fname=Henry&lname=Ford")
*/	
function getService() {
	xhr.open('GET', neoServiceRoot, true);	
	xhr.setRequestHeader("Access-Control-Allow-Origin", '*');
	xhr.setRequestHeader("Accept", "application/json; charset=UTF-8");
	xhr.setRequestHeader("X-Stream", "true");
	xhr.send();
	xhr.onreadystatechange=function() {
		if (xhr.readyState==4 && xhr.status==200) {
			//document.getElementById("response").innerHTML=xhr.responseText;
			service = JSON.parse(xhr.responseText);
			console.log(service);
			return service;
		}
	}
}
//run a query and return a result.


function neoQuery(query, result) {

}