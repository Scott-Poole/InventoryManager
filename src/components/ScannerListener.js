import React from 'react';

const prefix = 'F1';
const suffix = 'Enter';


function ScannerListener({onScan}) {
    
	const [input, _setInput] = React.useState('');
	const inputRef = React.useRef(input);
	const setInput = (i) => {
		inputRef.current = i;
		_setInput(i);
	}
	
	const [active, _setActive] = React.useState(false);
	const activeRef = React.useRef(active);
	const setActive = (value) => {
		activeRef.current = value;
		_setActive(value);
	}
	
	const inputHandler = function(e){
		if(e.key == prefix){
			setInput('');
			setActive(true);
		}else if(e.key == suffix && activeRef.current && inputRef.current != ''){
			onScan(inputRef.current);
			setInput('');
			setActive(false);
		}else if(activeRef.current){
			setInput(inputRef.current + e.key);
		}
	}
	
	//add event listener once
	React.useEffect(() => {
		// Make sure element supports addEventListener
		const isSupported = window && window.addEventListener;
		if (!isSupported) return;

		// Add event listener
		window.addEventListener('keydown', inputHandler);
		
	},[]);

	return(<></>)
}
    


export default ScannerListener;