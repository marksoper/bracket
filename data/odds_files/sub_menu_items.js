
var dd_ns4 = (document.layers) ? 1 : 0;
var dd_ie4 = (document.all) ? 1 : 0; //IE
var dd_dom = ((document.getElementById) && (!dd_ie4)) ? 1 : 0; // ns6

var timer = null;
var cmTop = 0;
var cmLeft = 0;

function showSubMenu(divID){
	clearTimeout(timer);
	hideSubMenu(divID);
	
	whichAnchor = divID + "A";
	
	if (dd_dom) {
		var addy = 0;
	} else {
		var addy = 10;
	}
	
	cmTop = findy(document.all[whichAnchor]) + addy;  // Takes the position of the link and sets the dropdown to happen  
	cmLeft = findx(document.all[whichAnchor]) - 20;
	
	document.getElementById(divID).style.top = cmTop;
	document.getElementById(divID).style.left = cmLeft;
	document.getElementById(divID).style.visibility = "visible";
	
	cmTop = 0; 
	cmLeft = 0;
}

function hideSubMenu(divID){
	document.getElementById(divID).style.visibility = "hidden";
}

function findy(item) {
	if (item.offsetParent) {
		return item.offsetTop + findy(item.offsetParent);
	}
	else {
		return item.offsetTop;
	}
}

function findx(item) {
	if (item.offsetParent) {
		return item.offsetLeft + findx(item.offsetParent);
	}
	else {
		return item.offsetLeft;
	}
}
