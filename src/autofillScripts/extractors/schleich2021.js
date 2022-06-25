let csv = require('fast-csv');
let fs = require('fs');

let id = 'dna';//doing barcode matching
let list = [];

var stream = fs.createReadStream("./extractors/schleich2021.csv");

//object generator for task
const Item = function(data){
	this.bc = data[8];
	this.des = 'Schleich #'+data[1]+' '+data[2];
	this.cost = (data[15].replace('$','').replace(',','')*0.5).toFixed(2);
	this.price = (this.cost*1.5).toFixed(2);
}

csv.parseStream(stream, {headers : false}).on("data", function(data){
    if(Number.isInteger(parseInt(data[8])) && data[8].length == 13){
		list.push(new Item(data));
	}

}).on("end", function(){
	console.log("done");
});

const Items = function(){
	return ({
		id,
		list
	});
}

module.exports = {
	Items
}