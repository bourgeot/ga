/*
 * Bourgeois 2014. Mat Buckland's genetic algorithm ported to javascript by me I hope.
 * So I can learn it.
 */
 
var CROSSOVER_RATE = 0.7,
	MUTATION_RATE = 0.001,
	POP_SIZE = 30,  //must be an even number
	CHROMO_LENGTH = 300,
	GENE_LENGTH = 4,
	MAX_ALLOWABLE_GENERATIONS = 40,
	EPSILON = 0.001;
//set up the html to record the target value and the geneology table.
var nodes = [], links = [];
/*
	d3 uses key, source, target 
	fate is a binary string of flags. mated-crossed-mutated
	For us the  nodes is a list of the chromosomes. {key(p.generation+p.key), fate, name(name), value, tValue, fitness}
	Links is {parent key, offspring key}
*/

/*
outputDiv = document.createElement("div");
outputDiv.id = 'outputDiv';
document.getElementsByTagName('BODY')[0].appendChild(outputDiv);
//output = document.createElement("p");
for (var i=0; i<10; i++) {
	output = document.createElement("div");
	output.appendChild(document.createTextNode('hello: ' + i));
	outputDiv.appendChild(output);
}*/

//output.appendChild(document.createElement("p")).innerHTML('Line 2');

//----------------------------------------------------------------------------------------
//
//	define a data structure which will define a chromosome
//
//----------------------------------------------------------------------------------------
function chromosome (bts) {	
	this.bits = bts.toString();
	this.fitness = 0.0;
	this.value = 0.0;
	this.name = '';
	this.tValue = 0;
	this.key = 0;
	this.fate = 0; //
	this.mutate = mutate;
	this.setValue = setValue;
	this.setName = setName;
	this.assignFitness = assignFitness;
	function setValue(value) {
		this.value = value;
	}
	function setName(output) {
		this.name = output;
	}
	function assignFitness(target) {
		//---------------------------------AssignFitness--------------------------------------
		//
		//	given a string of bits and a target value this function will calculate its  
		//  representation and return a fitness score accordingly
		//  THIS IS THE FUNCTION THAT EVALUATES THE QUALITY OF THE GENE
		//------------------------------------------------------------------------------------
		//holds decimal values of gene sequence
		var buffer = [];
		parseBits(this.bits, buffer);
		//console.log(buffer);
		// ok, we have a buffer filled with valid values of: operator - number - operator - number..
		// now we calculate what this represents.
		var result = 0.0;
		var i;
		this.tValue = target;
		for (i=0; i < buffer.length; i+=2)	{
			switch (buffer[i]) {
				case 10:
					result += buffer[i+1];
					break;
				case 11:
					result -= buffer[i+1];
					break;
				case 12:
					result *= buffer[i+1];
					break;
				case 13:
					result /= buffer[i+1];
					break;
			}//end switch
		}
		// Now we calculate the fitness. First check to see if a solution has been found
		// and assign an arbitrarily high fitness score if this is so.
		if (isNaN(result)) {
			result = 0;
		}
		this.value = result;
		this.name = printChromo(this.bits);
		if (Math.abs(result - target) <= EPSILON) {
			this.fitness = 999.0;
		}
		else {
			this.fitness = 1/Math.abs(target - result);
		//	return result;
		}
	}
	
	function mutate() {
		//------------------------------------Mutate---------------------------------------
		//
		//	Mutates a chromosome's bits dependent on the MUTATION_RATE
		//-------------------------------------------------------------------------------------
		var i,
			result = this.bits,
			bMutated = false;
		for (i=0; i<this.bits.length; i++) {
			if (Math.random() < MUTATION_RATE)	{
				bMutated = true;
				if (this.bits.charAt(i) == '1') {
					result = this.bits.slice(0, i-1) + '0' + this.bits.slice(i+1);
				}
				else {
					result = this.bits.slice(0, i-1) + '0' + this.bits.slice(i+1);
				}
			}
		}
		this.bits = result;
		if (bMutated) {
			this.assignFitness(this.tValue);
			this.fate = this.fate + 1;
		}
	}
}
//define population
function population() {
	this.members = [];
	this.generation = 1;
	this.tValue = 0;
	this.fitness = 0.0;
	//methods
	this.assignFitness = assignFitness;
	this.addMember = addMember;
	this.roulette = roulette;
	this.evolve = evolve;
	
	function addMember(member) {
		this.fitness += member.fitness;
		this.members.push(member);
		member.key = this.generation*1000 + this.members.length-1;
	}
	
	function assignFitness(target) {
		var i, m = [];
		this.tValue = target;
		this.fitness = 0.0;
		for (i = 0; i < this.members.length; i++) {
			this.members[i].assignFitness(target);
			m.push(this.members[i].fitness);
			this.fitness += this.members[i].fitness;
		}
		//console.log(m);
	}
	//--------------------------------Roulette-------------------------------------------
	//
	//	selects a chromosome from the population via roulette wheel selection
	//------------------------------------------------------------------------------------
	function roulette() {
		var slice,
			i,
			bSuccess = false,
			fitnessSoFar,
			result;
		//generate a random number between 0 & total fitness count
		while(!bSuccess) {
			slice = Math.random() * this.fitness;
			//go through the chromosones adding up the fitness so far
			fitnessSoFar = 0.0;
			//console.log('slice: ' + slice + ' fitness: ' + this.fitness);
			for (i=0; i<POP_SIZE; i++) {
				fitnessSoFar += this.members[i].fitness;
				//if the fitness so far > random number return the chromo at this point
				if (fitnessSoFar >= slice) {
					this.members[i].fate = this.members[i].fate | 4;
					result = this.members[i];
					bSuccess = true;
					break;
				}
			}
		}
		return result;
		//console.log('roulette failed.
		//return null;
	}
	function evolve() {
		//console.log(this);
		var parents, 
			offspring,
			i, 
			k = 0, 
			tempPop = [];
		//select two parents at a time for breeding
		while (k < POP_SIZE) {
			offspring = [];
			parents = [this.roulette(), this.roulette()];
			//console.log([parents[0].key, parents[1].key].join());
			offspring = crossover(parents);
			for (i=0; i < offspring.length; i++) {
				offspring[i].mutate();
				tempPop.push(offspring[i]);
				//won't work b/c k is not key value. need to add population key specifically as out put of roulette
				//or something.
				offspring[i].key = 1000*(this.generation+1) +tempPop.length -1;
				recordGeneology(parents, offspring[i], this.generation);
				k++;
			}
			
		}
		//replace the population
		//first add all the previous members to the node list
		for(i=0;i<this.members.length; i++) {
			addNode(this.members[i]);
		}
		this.members = tempPop;
		++this.generation;
	}
}

//---------------------------------GetRandomBits-----------------------------------------
//
//	This function returns a string of random 1s and 0s of the desired length.
//
//-----------------------------------------------------------------------------------------
function getRandomBits(length) {
	var bits = '';
	var i; 

	for ( i=0; i<length; i++) {
		if (Math.random() > 0.5) {
			bits += "1";
		}
		else {
			bits += "0";
		}
	}
	return bits;
}

//---------------------------------BinToDec-----------------------------------------
//
//	converts a binary string into a decimal integer
//
//-----------------------------------------------------------------------------------
function binToDec(bits) {
	var val	= 0, valueToAdd = 1, i;

	for (i = bits.length; i > 0; i--) {
		if (bits.charAt(i-1) == '1') {
			val += valueToAdd;
		}
		valueToAdd *= 2;
	}//next bit
	return val;
}
function run() {
	//var t = document.getElementById('target');
//console.log(t.value);
	runSimulation(document.getElementById('target').value);
}
function runSimulation(target) {
	var i,
		c,
		bSuccess = false,
		p = new population();
	nodes = [];
	links = [];
	for (i = 0; i < POP_SIZE; i++) {
		c = new chromosome(getRandomBits(CHROMO_LENGTH));
		//c.assignFitness(target);
		p.addMember(c);
	}

	//see if the population has been successful at reaching the target
	while(!bSuccess) {
		p.assignFitness(target);
		//console.log(p);		//alert('ding');
		for(i = 0; i < p.members.length; i++) {
			if (p.members[i].fitness == 999.0) {
				alert('Success after ' + p.generation + ' generations!\n\n'
					+ printChromo(p.members[i].bits));
				bSuccess = true;
				addNode(p.members[i]);
			}
		}
		if(bSuccess == true) { break; };
		//if max generations exceeded stop
		if ( p.generation > MAX_ALLOWABLE_GENERATIONS) {
			alert('Solution not found for this simulation.');
			bSuccess = true;
			for(i = 0; i < p.members.length; i++) {
				addNode(p.members[i]);
			}
			break;
		}
		if (!bSuccess) {
			p.evolve();
		}
	}
	diagramSimulation(nodes, links);
	console.log([nodes, links]);
}


//---------------------------------ParseBits------------------------------------------
//
// Given a chromosome this function will step through the genes one at a time and insert 
// the decimal values of each gene (which follow the operator -> number -> operator rule)
// into a buffer array. Returns the number of elements in the buffer.
//------------------------------------------------------------------------------------
function parseBits(bits, buffer) {
	// step through bits a gene at a time until end and store decimal values
	// of valid operators and numbers. Don't forget we are looking for operator - 
	// number - operator - number and so on... We ignore the unused genes 1111
	// and 1110
	
	//flag to determine if we are looking for an operator or a number
	var bOperator = true;
	
	//storage for decimal value of currently tested gene
	var thisGene = 0;
	
	var i;
	for (i=0; i<CHROMO_LENGTH; i+=GENE_LENGTH) {
		//convert the current gene to decimal
		thisGene = binToDec(bits.substr(i, GENE_LENGTH));
		//find a gene which represents an operator
		if (bOperator) {
			if ( (thisGene < 10) | (thisGene > 13) ) {
				continue;
			}			
			else {
				bOperator		= false;
				buffer.push(thisGene);
				continue;
			}
		}
		//find a gene which represents a number
		else {
			if (thisGene > 9) {
				continue;
			}
			else {
				bOperator		= true;
				buffer.push(thisGene);
				continue;
			}
		}
	}//next gene

	//	now we have to run through buffer to see if a possible divide by zero
	//	is included and delete it. (ie a '/' followed by a '0'). We take an easy
	//	way out here and just change the '/' to a '+'. This will not effect the 
	//	evolution of the solution
	for (i=0; i<buffer.length; i++)	{
		if ( (buffer[i] == 13) && (buffer[i+1] == 0) ) {
			buffer[i] = 10;
		}
	}
	return buffer;
}
	


//---------------------------------PrintChromo---------------------------------------
//
// decodes and prints a chromo to screen
//-----------------------------------------------------------------------------------
function printChromo(bits) {
	//holds decimal values of gene sequence
	var buffer = [],
		output = '0 ',
		i;
	parseBits(bits, buffer);
	for (i=0; i<buffer.length; i++)  {
		output += printGeneSymbol(buffer[i]);
  }
  return output;
}
	
//--------------------------------------PrintGeneSymbol-----------------------------
//	
//	given an integer this function outputs its symbol to the screen 
//----------------------------------------------------------------------------------
function printGeneSymbol(val) {
	var result = '';
	if (val < 10 ) {
		result += val.toString();
	}
	else {
		switch (val) {
		case 10:
			result +=  "+";
			break;
		case 11:
			result +=  "-";
			break;
		case 12:
			result +=  "*";
			break;
		case 13:
			result +=  "/";
			break;
		}

	}
	result +=  " ";
	return result;
}



//---------------------------------- Crossover ---------------------------------------
//
//  Dependent on the CROSSOVER_RATE this function selects a random point along the 
//  lenghth of the chromosomes and swaps all the  bits after that point.
//------------------------------------------------------------------------------------
function crossover(parents) {
	var co = 0,
		t1 = '',
		t2 = '',
		//bug: should make copies of parents b/c js passes by reference.
		result = [parents[0], parents[1]];
	var c1 = new chromosome(parents[0].bits),
		c2 = new chromosome(parents[1].bits);
	result = [c1, c2];
	//console.log(result);
  //dependent on the crossover rate
  if (Math.random() < CROSSOVER_RATE) {
	//console.log("crossing over");
    //create a random crossover point
	c1.fate = c1.fate | (1 << 1);
	c2.fate = c2.fate | (1 << 1);
    co = (Math.random() * CHROMO_LENGTH);
    t1 = c1.bits.substr(0, co) + c2.bits.substr(co, CHROMO_LENGTH);
    t2 = c2.bits.substr(0, co) + c1.bits.substr(co, CHROMO_LENGTH);
	c1.bits = t1;
	c2.bits = t2;
    //result = [c1, c2];  
  }
  //console.log([c1.fate, c2.fate].join(', '));
  return result;
}
function recordGeneology(parents, kid) {
//{generation, key, value, name, children [{generation, key}, {generation, key}]}
//output = document.createElement("p");
	var output, m, n;
	//console.log([parents[0].key, parents[1].key, kid.key].join());	
	for (m=0; m < parents.length; m++) {
		//addNode(parents[m]);
		addLink(parents[m], kid);
		//var row = [generation, parents[m].key, parents[m].name, parents[m].value, generation+1, offspring[n].key].join(', ');
		/*
		output = document.createElement("div");
		document.getElementsByTagName("BODY")[0].appendChild(output);
		output.appendChild(
			document.createTextNode(
				[generation, parents[m].key, parents[m].name, parents[m].value, parents[m].fate, generation+1, kid.key].join(', ')
			)
		);
		*/
		//outputDiv.appendChild(output);
	}
}
function addNode(c) {
	//add a chromosome to the node list
	var a = { key: c.key, 
		name: c.name, 
		value: c.value, 
		fate: c.fate, 
		tValue: c.tValue, 
		fitness: c.fitness
		};
	nodes.push(a);
	//console.log(a);
}
function addLink(c1, c2) {
	var k = {source: c1.key, target: c2.key};
	links.push(k);
	//console.log(k);
}
//=============>>>>>>>>>GOT HERE
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