function uaOrgs(data) {
	var i, k, root = {}, rootId = 'UNAZ', prop, bFound = false,
		//payload =[],
		wrapper = {statements:[]},
		//query = {statement: "", parameters: {orgs: []}},
		oList = {hrAndFin:[], hr: [], fin: []},
		org = {};
		//query = {statement: "CREATE (n:UaOrg {orgs}) Return n", parameters: {orgs: []}};
		//going to use labels :UaOrg, :Financial, :HR
		//adding relationships [:PARENT], [:CHILD], [:ISOMORPH]
		//for financial nodes add the RCM data fields.
		/*
			q = "CREATE (n:UaOrg"
			q+= (hrAndFin == '1') ? ":HR:Financial " : "";
			q+= (hrOnly == '1') ? ":HR " : "";
			q+= (
			q = "CREATE (n:UaOrg:HR {orgs}) Return n";
			
		
		*/

	for(i = 0; i<data.length; i++) {
		/*	
		if (i<2) {
			console.log(data[i]);
		}
		//construct query

			{ChildUaOrg:<org>, ParentUaOrg:<org>, UaOrg: <org>}
			CY_RCU_DESCR
			CY_RCU_GROUP
			finOnly
			fin_code
			fin_name
			fin_parent_code
			fin_parent_name
			hrAndFin
			hrOnly
			hr_code
			hr_name
			hr_parent_code
			hr_parent_name
			id <-- use this as the unique identifier
			name
			parent_id
			parent_name	
		*/
		org = {
			name: data[i].UaOrg.name,
			orgId: data[i].UaOrg.id,
			parentOrgId: data[i].UaOrg.parent_id,
			finParentOrgId: data[i].UaOrg.fin_parent_code,
			hrParentOrgId: data[i].UaOrg.hr_parent_code,
			financial: data[i].UaOrg.finOnly,
			hr: data[i].UaOrg.hrOnly,
			hrAndFin: data[i].UaOrg.hrAndFin,
			cyRcuDesr: (data[i].UaOrg.CY_RCU_DESCR === null) ? "0": data[i].UaOrg.CY_RCU_DESCR,
			cyRcuGroup: (data[i].UaOrg.CY_RCU_GROUP === null) ? "0": data[i].UaOrg.CY_RCU_GROUP

		};
		if (data[i].UaOrg.hrAndFin == '1') {
			oList.hrAndFin.push(org);
		}
		else if (data[i].UaOrg.hrOnly == '1') {
			oList.hr.push(org);
		}
		else if (data[i].UaOrg.finOnly == '1') {
			oList.fin.push(org);
		}
		else {
			console.log('data error:' + org.toString());
		}
		//query.parameters.orgs.push(

		//);	
	}
	wrapper.statements.push( 
		{
			statement: "CREATE (n:UaOrg:Financial:Hr {orgs} ) RETURN n.orgId, n.parentOrgId",
			//resultDataContents : [ "REST" ],
			parameters: {orgs: oList.hrAndFin}
		}	
	);
		wrapper.statements.push( 
		{
			statement: "CREATE (n:UaOrg:Hr {orgs} ) RETURN n.orgId, n.hrParentOrgId",
			//resultDataContents : [ "REST" ],
			parameters: {orgs: oList.hr}
		}	
	);
		wrapper.statements.push( 
		{
			statement: "CREATE (n:UaOrg:Financial {orgs} ) RETURN n.orgId, n.finParentOrgId",
			//resultDataContents : [ "REST" ],
			parameters: {orgs: oList.fin}
		}	
	);
	//wrapper.statements.push(query);
	//console.log( wrapper);

	//call the neo service
	neo4J.query(wrapper, loaded, true);
}
function loaded(response) {
	//now add the relationships.
	var i, j, wrapper = {statements: []};
	console.log(response);
	for (i=0; i<response.result.results.length; i++) {
		for (j=0; j<response.result.results[i].data.length; j++) {
			//result.results[i].data[j].row[0] //<--orgId
			//result.results[i].data[j].row[1] //<--parentOrgId
			wrapper.statements.push(
			{
				statement:"MATCH (a), (b) WHERE a.orgId ='" 
				+ response.result.results[i].data[j].row[0]
				+ "' AND b.orgId ='"
				+ response.result.results[i].data[j].row[1]
				+ "' CREATE (a)-[x:PARENT]->(b)-[y:CHILD]->(a)"
			}
			);
		}
	}
	neo4J.query(wrapper, logIt, true);
}
function logIt(response) {
	console.log(response);
}

	//results.data[i].row[0] 
	//for(i = 0; i < data.length; i++) {
		//for each element, add three relationships and some labels
		//and maybe some nodes as well.
		//posting to db/data/node/#/labels
	//}
