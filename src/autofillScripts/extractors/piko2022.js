let csv = require('fast-csv');
let fs = require('fs');

let id = '015615';
let list = [];

var stream = fs.createReadStream("./extractors/piko2022.csv");

//object generator for task
const Item = function(data){
	this.pn = data[0];
	this.des = data[1];
	this.cost = data[4].replace('$','').replace(',','');
	this.price = (this.cost*1.3).toFixed(2);
}

csv.parseStream(stream, {headers : false}).on("data", function(data){
    if(Number.isInteger(parseInt(data[0])) && data[0].length == 5){
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