function uaOrgs(data) {
	var i, k, root = {}, rootId = 'UNAZ', prop, bFound = false,
		//payload =[],
		wrapper = {statements:[]},
		query = {statement: "CREATE (n:UaOrg {orgs}) Return n", parameters: {orgs: []}};
	//name, id, children, parent.
	//for d3 the tree root has no parent.
	for(i=data.length - 1; i >= 0; i--) {
		//special case for the root node
		if (data[i].UaOrg.id == rootId) {
			root = data[i].UaOrg;
		}
		//find this node's parent in the inner loop
		//and add this node to it's children attribute.
		for (k = 0; k<data.length; k++) {
			if (data[i].ParentUaOrg.id == data[k].UaOrg.id) {
				//make sure the parent has a children property
				bFound = false;
				for(prop in data[k].UaOrg) {
					if (prop == 'children') {
						bFound = true;
					}
				}
				if(!bFound) {
					data[k].UaOrg.children = [];
				}
				if ( data[i].UaOrg.id != rootId) {
					data[k].UaOrg.children.push(data[i].UaOrg);
				}
			}
		}
	}

	//cQ.parameters = {nodes: data};
	//query.statements.push(cQ);
	//query.params = {nodes: []};

	for(i = 0; i<data.length; i++) {
		if (i<2) {
			console.log(data[i]);
		}
		//construct query
		/*
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
		query.parameters.orgs.push(
			{
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

			}
		);	
	}
	wrapper.statements.push(query);
	console.log( wrapper);

	//call the neo service
	neo4J.query(wrapper, loaded, true);
}
function loaded(response) {
	//now add the relationships.
	var i, k;
	//results.data[i].row[0] 
	for(i = 0; i < data.length; i++) {
		
	}
}