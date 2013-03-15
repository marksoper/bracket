/* Exception array for "Features" and "Betting Tools" special placement */
var ff_990 = new Array(
['/link_hitcount.cfm?ltid=124','Bookie Banter','_blank'],
['/contests/','Contests','_self'],
['/twitter/','Follow us on Twitter','_self'],
['/link_hitcount.cfm?ltid=10549','Join us on Facebook','_blank'],
['/newsletters/','Newsletters','_self'],
['/radio/','VI Radio','_self'],
['/link_hitcount.cfm?ltid=10550','Mobile Odds','_self'],
['/las-vegas-travel/','Las Vegas Travel','_self']
);
var news_990 = new Array();

var ff_991 = new Array(
["/live-odds/signup/","Live Odds","_self"],
["/parlay-calculator/","Parlay Calculator","_self"],
['/csw-stats/','CSW Stats Database','_self'],
['/gaming-terms/','Gaming Terms','_self'],
['/tv-listing/','TV Listings','_self'],
['/picks/records/','Handicapper Records','_self']
);
var news_991 = new Array();

var dd_ns4 = (document.layers) ? 1 : 0;
var dd_ie4 = (document.all) ? 1 : 0;
var dd_dom = ((document.getElementById) && (!dd_ie4)) ? 1 : 0; // ns6
var isOver = false;
var timer = null;
var cmTop = 0;
var cmLeft = 0;

// dd_ns4 redraw on resize
if (dd_ns4) {
        origWidth = innerWidth;
        origHeight = innerHeight;
}

function reDo() {
        if (innerWidth != origWidth || innerHeight != origHeight) {location.reload();}
}

if (dd_ns4) onresize = reDo;
if (dd_dom) onload = InitObj;


//build all dropdowns  ** altered by TEK jpk 6-13-03 **
for ( i = 0 ; i < tt.length; i++ ) {
	var ff = eval("ff_" + tt[i][1]);
	var news = eval("news_" + tt[i][1]);
	
	var divNum = "gndd" + tt[i][2];
	if (news.length > 0) {
		var strDiv = "<div class=\"cm\" id=\"" + divNum + "\" onMouseOver=\"OverLayer();\" onMouseOut=\"OutLayer('"+ divNum + "');\">";
		strDiv = strDiv + "<table cellspacing=0 cellpadding=0 width=375 border=0><tr valign=top><td nowrap class=NavTbl_dropdown><img src=/graphics/spacer.gif width=2 height=2></td><td nowrap class=NavTbl_dropdown><img src=/graphics/spacer.gif width=2 height=2></td><td nowrap class=NavTbl_dropdown><img src=/graphics/spacer.gif width=2 height=2></td></tr><tr valign=top><td class=NavTbl_dropdown><img src=/graphics/spacer.gif width=2 height=2></td><td nowrap><table cellspacing=0 cellpadding=3 width=100% border=0><tr valign=top><td nowrap class=cmLff width=105>";
	}
	else {
		var strDiv = "<div class=\"cmMat\" id=\"" + divNum + "\" onMouseOver=\"OverLayer();\" onMouseOut=\"OutLayer('"+ divNum + "');\">";
		strDiv = strDiv + "<table cellspacing=0 cellpadding=0 width=140 border=0><tr valign=top><td nowrap class=NavTbl_dropdown><img src=/graphics/spacer.gif width=2 height=2></td><td nowrap class=NavTbl_dropdown></td><td nowrap><img src=/graphics/spacer.gif width=2 height=2></td></tr><tr valign=top><td class=NavTbl_dropdown></td><td nowrap><table cellspacing=0 cellpadding=3 width=100% border=0><tr valign=top><td nowrap class=cmLff width=140>";
	}
	for ( j = 0 ; j < ff.length ; j++ ) {
		var linkString = new String(ff[j][0]);
		if (linkString.indexOf('http:') == -1) ff[j][0] = "http://www.vegasinsider.com" + ff[j][0];		
		strDiv = strDiv + "&nbsp\;&#183\;&nbsp\;<a class='cmLff' href='" + ff[j][0] + "' target='" + ff[j][2] + "'>" + ff[j][1] + "</a><br>";
	}
//do not build right side if no news ** altered by TEK jpk 6-13-03 **
	if (news.length > 0) {
		strDiv = strDiv + "</td><td class=cmL width=275 nowrap><div class='cmH'>&nbsp\;" + tt[i][0] + "News</div>";
		for ( j = 0 ; j < news.length ; j++ ) {
			var linkString = new String(news[j][0]);
			if (linkString.indexOf('http:') == -1) news[j][0] = "http://www.vegasinsider.com" + news[j][0];		
			strDiv = strDiv + "&nbsp\;<b>&#183\;</b>&nbsp\;<a href='" + news[j][0] + "'>" + news[j][1] + "</a><br>";
		}
	}
	strDiv = strDiv + "</td></tr></table></td><td nowrap class=NavTbl_dropdown><img src=/graphics/spacer.gif width=2 height=2></td></tr><tr valign=top><td nowrap class=NavTbl_dropdown><img src=/graphics/spacer.gif width=2 height=2></td><td nowrap class=NavTbl_dropdown><img src=/graphics/spacer.gif width=2 height=2></td><td nowrap class=NavTbl_dropdown><img src=/graphics/spacer.gif width=2 height=2></td></tr></table></div>\n";

	

	document.write(strDiv);
	// alert(strDiv);
}



function InitObj() {
	for (i = 0; i < tt.length; i++) { 
		whichEl = "gndd" + tt[i][2];
		if (dd_dom) {
			whichEl = document.getElementById(whichEl);
			
		}
		else {	
			whichEl = (dd_ns4) ? document.layers[whichEl] : document.all[whichEl].style;
		} 
		whichEl.onmouseover = OverLayer;
		whichEl.onmouseout = OutLayer;
	}
	
}
InitObj();


function msieversion()
   {
      var ua = window.navigator.userAgent;
	 
      var msie = ua.indexOf ( "MSIE " );

      if ( msie > 0 )      // If Internet Explorer, return version number
         return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )))
      else                 // If another browser, return 0
         return 0

   }


function ShowLayer(showEl,event) {
	if (showEl == "gnddhome") return;
	clearTimeout(timer);
	HideAllLayers();
	
	if (dd_dom) {
		var whichEl = document.getElementById(showEl);
	
			}
	else {	
		var whichEl = (dd_ns4) ? document.layers[showEl] : document.all[showEl].style;
	
	}
	whichAnchor = showEl + "A";   //set the variable whichAnchor = to  say  gnddmoreA
		
		  //Note: this  is the variable set to grab the coordinate for each link below.	
	if (dd_ie4) {
		if (document.all[whichAnchor]){ 
			cmTop = findy(document.all[whichAnchor]) + 24;  // Takes the position of the link and sets the dropdown to happen  
			cmLeft = findx(document.all[whichAnchor]) - 57; // there, but then also adds 20 pix so it will appear below the link
															// so not to cover it.  Same applys for the cmLeft.  Sets it as far
															// left as the link is and then takes away 10 so it will happen a bit 
															// little before the link.
		}
	}
	if (dd_ns4) {
		if (document.anchors[whichAnchor]) {
			cmTop = document.anchors[whichAnchor].y + 24;  //same but for NS
			cmLeft = document.anchors[whichAnchor].x - 57;
		}
	}
	if (dd_dom){
		if (document.anchors[whichAnchor]){                 //same but for DOM
			var myObject = document.anchors[whichAnchor];
			while (myObject.offsetParent) {
				cmTop  = cmTop  + myObject.offsetTop;
				cmLeft = cmLeft + myObject.offsetLeft;
				myObject = myObject.offsetParent
		 	//alert(cmLeft);
			}
		}
	}
	
	//if(showEl == "gnddhcDiv")
	//{
		if (msieversion() > 6)
		{
			cmLeft = cmLeft + 57;
		}
	//}
	
	if (dd_dom) {
		whichEl.style.visibility = "visible";		
		whichEl.style.top = cmTop + 11;
		
	
	
                if (showEl != 'gnddmore') {
                        if (cmLeft > 1600) cmLeft = 1600;
						
                }
		whichEl.style.left = cmLeft;		
	}
	else {	
		whichEl.visibility = "visible";   //setting the link that is hovered over visible
		whichEl.top = cmTop;              //you set the top of that link to cmTop which you already set above to be the position + 	
										// 20.
										  
                if (showEl != 'gnddmore')
			
				 {    // if its not gnddmore
                        if (cmLeft > 1600) cmLeft = 1600;  // then go ahead and make sure that if cmLeft is more then 367, then set
														// set it always to be 367.  This is to assure that it wont happen to far.	
                }
		whichEl.left = cmLeft;  //and then set the left of that link to cmLeft.
	} 	
	cmTop = 0; cmLeft = 0;
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





function HideAllLayers() {
	if (dd_dom) {
		var divTemp = document.getElementsByTagName('div');
		for (i = 0; i < divTemp.length; i++) { 
			var divString = new String(divTemp[i].id);
			if (divString.indexOf('gndd') != -1) divTemp[i].style.visibility = "hidden";
		}
	}	
	if (dd_ie4) {
		var divTemp = document.all.tags("div");
		
		for (i = 0; i < divTemp.length; i++) { 
			var divString = new String(divTemp[i].id);
		    if (divString.indexOf('gndd') != -1) divTemp[i].style.visibility = "hidden";
	
		}
	}
	if (dd_ns4) {
		for (i = 0; i < document.layers.length; i++) { 
			var divString = new String(document.layers[i].name);
			if (divString.indexOf('gndd') != -1) document.layers[i].visibility = "hidden";
		}
	}
}

function OverLayer() { clearTimeout(timer); isOver = true; }

function OutLayer() { 
	clearTimeout(timer);
	isOver = false; 
	timer = setTimeout("HideAllLayers()",300);
}
