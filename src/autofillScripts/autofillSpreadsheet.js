const {GoogleSpreadsheet} = require('google-spreadsheet');
//import 'regenerator-runtime/runtime';

const config = require('../config/config.json');
const auth = require('../config/Inventory-System-Auth.json');

let invWorksheet;
let invHeaderIndexToName = [];
let invHeaderNameToIndex = {};
//let invBCToRow = {};

let siWorksheet;
let siHeaderIndexToName = [];
let siHeaderNameToIndex = {};
//let siBCToRow = {};

let manWorksheet;
let manHeaderIndexToName = [];
let manHeaderNameToIndex = {};
let manToID = {};
let idToMan = {};

const customPre = 27;//dont change

const FillSheet = require('./extractors/schleich2021.js');

let matches = 0;
let changes = 0;
let fills = 0;

const init = async function(){
	try{
		let doc = new GoogleSpreadsheet(config.spreadsheet_id);
		
		console.log("Authenticating...");
		await doc.useServiceAccountAuth(auth);
		
		console.log("Loading document information...");
		await doc.getInfo();
		invWorksheet = doc.sheetsByTitle["Inventory"];
		siWorksheet = doc.sheetsByTitle["Special Inventory"];
		manWorksheet = doc.sheetsByTitle["Manufacturers"];
		
		console.log("Loading Cells...");
		await invWorksheet.loadCells({
			"startRowIndex": 0,
			"endRowIndex": invWorksheet.rowCount,
			"startColumnIndex": 0,
			"endColumnIndex": invWorksheet.columnCount
		});
		
		await siWorksheet.loadCells({
			"startRowIndex": 0,
			"endRowIndex": siWorksheet.rowCount,
			"startColumnIndex": 0,
			"endColumnIndex": siWorksheet.columnCount
		});
		
		await manWorksheet.loadCells({
			"startRowIndex": 0,
			"endRowIndex": manWorksheet.rowCount,
			"startColumnIndex": 0,
			"endColumnIndex": manWorksheet.columnCount
		});
		
		console.log("Mapping Headers/Columns...");
		
		let cell;
		for(let i = 0; i < invWorksheet.columnCount; i++){
			cell = invWorksheet.getCell(0,i);
			if(cell.value == null)
				break;
			invHeaderNameToIndex[cell.value] = i;
            invHeaderIndexToName[i] = cell.value;
		}
		for(let i = 0; i < siWorksheet.columnCount; i++){
			cell = siWorksheet.getCell(0,i);
			if(cell.value == null)
				break;
			siHeaderNameToIndex[cell.value] = i;
            siHeaderIndexToName[i] = cell.value;
		}
		for(let i = 0; i < manWorksheet.columnCount; i++){
			cell = manWorksheet.getCell(0,i);
			if(cell.value == null)
				break;
			manHeaderNameToIndex[cell.value] = i;
            manHeaderIndexToName[i] = cell.value;
		}
		/*
		console.log("Mapping Rows...");
		//invBCToRow
		let c = invHeaderNameToIndex["Barcode Number"];
		for(let r = 1; r < invWorksheet.rowCount; r++){
			cell = invWorksheet.getCell(r,c);
			if(cell.value == null)
				continue;
			invBCToRow[cell.value] = r;
		}
		//siBCToRow
		c = siHeaderNameToIndex["Barcode Number"];
		for(let r = 1; r < siWorksheet.rowCount; r++){
			cell = siWorksheet.getCell(r,c);
			if(cell.value == null)
				continue;
			siBCToRow[cell.value] = r;
		}
		*/
		//man <-> id
		
		
		
		let cMan = manHeaderNameToIndex["Manufacturer"];
		let cManID = manHeaderNameToIndex["ManufacturerID"];
		for(let r = 1; r < manWorksheet.rowCount; r++){
			let cellMan = manWorksheet.getCell(r,cMan);
			let cellManID = manWorksheet.getCell(r,cManID);
			if(cellMan.value == null || cellManID.value == null)
				continue;
			manToID[cellMan.value] = cellManID.value;
			idToMan[cellManID.value] = cellMan.value;
		}
		
		let items = FillSheet.Items().list;
		let id = FillSheet.Items().id;
		
		console.log("Matching from auto-fill file");
		console.log("Inventory Size: " + invWorksheet.rowCount);
		console.log("Autofilling Item Count: " + items.length);
		
		
		//columns to match item
		let pnc = invHeaderNameToIndex["Part Number"];
		let midc = invHeaderNameToIndex["ManufacturerID"];
		let bcc = invHeaderNameToIndex["Barcode Number"];
		//columns for autofill
		let desc = invHeaderNameToIndex["Description"];
		let costc = invHeaderNameToIndex["Cost"];
		let pricec = invHeaderNameToIndex["Price"];
		
		//loop through inventory
		for(let r = 1; r < invWorksheet.rowCount; r++){
			let pn_cell = invWorksheet.getCell(r,pnc);
			let manID_cell = invWorksheet.getCell(r,midc);
			let bc_cell = invWorksheet.getCell(r,bcc);
			//loop through items
			for(let i = 0; i < items.length; i++){
				//matching via barcode
				if(items[i].bc){
					if(bc_cell.value == items[i].bc){
						//found item in inventory
						matches++;
						//decsriptions
						let cell = invWorksheet.getCell(r,desc);
						if(cell.value == null){
							cell.value = items[i].des;
							fills++;
						}
						else if(cell.value != items[i].des){
							cell.value = items[i].des;
							changes++;
						}
						
						//cost
						cell = invWorksheet.getCell(r,costc);
						if(cell.value == null){
							cell.value = items[i].cost;
							fills++;
						}
						else if(cell.value != items[i].cost){
							cell.value = items[i].cost;
							changes++;
						}
						
						//price
						cell = invWorksheet.getCell(r,pricec);
						if(cell.value == null){
							cell.value = items[i].price;
							fills++;
						}
						else if(cell.value != items[i].price){
							cell.value = items[i].price;
							changes++;
						}
						
						break;
					}
				}
				//matching by pn/manID
				else if(pn_cell.value == items[i].pn && manID_cell.value == id){
					//found item in inventory
					matches++;
					//decsriptions
					let cell = invWorksheet.getCell(r,desc);
					if(cell.value == null){
						cell.value = items[i].des;
						fills++;
					}
					else if(cell.value != items[i].des){
						cell.value = items[i].des;
						changes++;
					}
					
					//cost
					cell = invWorksheet.getCell(r,costc);
					if(cell.value == null){
						cell.value = items[i].cost;
						fills++;
					}
					else if(cell.value != items[i].cost){
						cell.value = items[i].cost;
						changes++;
					}
					
					//price
					cell = invWorksheet.getCell(r,pricec);
					if(cell.value == null){
						cell.value = items[i].price;
						fills++;
					}
					else if(cell.value != items[i].price){
						cell.value = items[i].price;
						changes++;
					}
					
					break;
				}
			}
			
		}
		await invWorksheet.saveUpdatedCells();
		console.log('Matches: '+matches);
		console.log('Fills: '+fills);
		console.log('Changes: '+changes);
		
		console.log("Done.");
	}catch (err) {
		console.log("ERROR: " + err.message);
	}
	
}

init();


