function uaOrgs(data) {
	var i, k, root = {}, rootId = 'UNAZ', prop, bFound = false;
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
	console.log(data);
	console.log(root);
}