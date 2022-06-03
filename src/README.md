## Inventory Manager

Application Consists of three main parts: User Interface, Barcode Parsing, SpreadSheet fetching/updating

### Scripts

#### BarcodeParser.js

Converts input from a barcode scanner into usable data (part number, manufacturer id)

#### Spreadsheet.js

Provides function for updating/fetching information in database
	- Uses Google's Sheets API

### Components

#### App.js

Main page that routes and sets the structure for a given page

#### Navbar.js

Navigation bar present at the top of each page. Responsible for routing application.

#### Add.js, Remove.js, Create.js, Custom.js, Search.js

Pages responsible for functionality related to a given user  
interaction (adding/removing items, printing barcodes)

#### ScannerListener.js

Passive component that listens for keyboard strokes from a  
barcode scanner an updates scan history




