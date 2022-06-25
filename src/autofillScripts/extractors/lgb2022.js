let csv = require('fast-csv');
let fs = require('fs');

let id = '011525';
let list = [];

var stream = fs.createReadStream("./extractors/lgb2022.csv");

//object generator for task
const Item = function(data){
	this.pn = data[0].substring(1);
	this.des = data[1];
	this.cost = ((data[5].replace('$','').replace(',',''))*0.9).toFixed(2);
	this.price = (this.cost*1.3).toFixed(2);
}

csv.parseStream(stream, {headers : false}).on("data", function(data){
    if(data[0].length == 6){
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