//CHECK IF MAIN WINDOW
if (window.top === window) {

/* Messaging Setup */

function equivalentURL(countryCode) {
	/*Creates regular expression of country code plus hyphen. sets default link. loops through available language links. if one is found, newLoc is set to it. newLoc is returned. */
	langExp = RegExp("-"+countryCode);
	newLoc = "javascript: alert('This page does not exist (or cannot be accessed) in your chosen language.');";
	ul = document.getElementById("p-lang");
	if (!ul)
		return newLoc;
	
	ul = ul.getElementsByTagName("li");
	for (i = 0; i < ul.length; ++i) {
		if (langExp.test(ul[i].getAttribute("class"))) {
			newLoc = ul[i].getElementsByTagName("a")[0].getAttribute("href");
		}
	}
	return newLoc;
}

function changeDisplayMlLinksDiv(on) {
	if (on)
		document.getElementById("mlLinksDiv").setAttribute("class","mlLinksDivShow");
	else
		document.getElementById("mlLinksDiv").setAttribute("class","mlLinksDivHide");
}

function changeColorLinks(color) {
	var bc = document.getElementById("bodyContent");
	var cl = /fwpColorLinksNone|fwpColorLinksGrey|fwpColorLinksBlue/;
	switch (color) {
		case "blue":
			bc.setAttribute("class", bc.getAttribute("class").replace(cl, "fwpColorLinksBlue"));
			break;
		case "grey":
			bc.setAttribute("class", bc.getAttribute("class").replace(cl, "fwpColorLinksGrey"));
			break;
		default:
			bc.setAttribute("class", bc.getAttribute("class").replace(cl, "fwpColorLinksNone"));
			break;
	}
}

function changeIndent(on) {
	var bc = document.getElementById("bodyContent");
	if (on)
		bc.setAttribute("class", bc.getAttribute("class").replace(/fwpIndentOn|fwpIndentOff/, "fwpIndentOn"));
	else
		bc.setAttribute("class", bc.getAttribute("class").replace(/fwpIndentOn|fwpIndentOff/, "fwpIndentOff"));
}

function changeEnableFLS(on) {
	var ls = document.getElementById("fwpLangSwitch");
	if (on) 
		ls.setAttribute("class", "on");
	else 
		ls.setAttribute("class", "off");
}

function changeOtherLang(code) {
	var ls, otherLangCode;
	
	otherLangCode = /http:\/\/en\.|https:\/\/secure.wikimedia.org\/wikipedia\/en\//.test(window.location.href) ? code : "en";
	
	ls = document.getElementById("fwpLangSwitch");
	ls.setAttribute("href", equivalentURL(otherLangCode));
}

function changeFixedMenu(on) {
	var hr = document.getElementById("fwpHeaderContainer");
	if (on) {
		hr.setAttribute("class", hr.getAttribute("class").replace(/fwpFixedMenuOn|fwpFixedMenuOff/, "fwpFixedMenuOn"));
	}
	else {
		hr.setAttribute("class", hr.getAttribute("class").replace(/fwpFixedMenuOn|fwpFixedMenuOff/, "fwpFixedMenuOff"));
	}
}

function retrieveMessage(event) {
	console.log("message retrieved: " + event.name);
	if (event.name === "settings") {
		/* Settings
			0 = displayMlLinksDiv | 1 = linkColor | 2 = textIndent | 3 = enableFLS | 4 = otherLang | 5 = fixedMenu
		*/
		changeDisplayMlLinksDiv(event.message[0]);
		
		changeColorLinks(event.message[1]);
		
		changeIndent(event.message[2]);

		//Language stuff
		changeEnableFLS(event.message[3]);
		changeOtherLang(event.message[4]);
		changeFixedMenu(event.message[5]);
	}
	if (event.name === "change") {
		switch (event.message.key) {
			case "displayMlLinksDiv":
				changeDisplayMlLinksDiv(event.message.newValue);
				break;
			case "linkColor":
				changeColorLinks(event.message.newValue);
				break;
			case "textIndent":
				changeIndent(event.message.newValue);
				break;
			case "enableFLS":
				changeEnableFLS(event.message.newValue);
				break;
			case "otherLang":
				changeOtherLang(event.message.newValue);
				break;
			case "fixedMenu":
				changeFixedMenu(event.message.newValue);
				break;
		}
	}
}

function keyboardControl(e) {
	var keyEvent = window.event ? event : e;
	if ((keyEvent.keyCode == 83) && (keyEvent.altKey == true) && (keyEvent.ctrlKey == true)) {
		if (/on/.test(document.getElementById("fwpLangSwitch").getAttribute("class"))) {
			window.location.href = document.getElementById("fwpLangSwitch").getAttribute("href");
		}
	}
}

document.onkeydown = keyboardControl;
safari.self.addEventListener("message", retrieveMessage, false);

function createLink(text, hrefAttr, classAttr, idAttr) {
	var mlLink = document.createElement("a");
	if (hrefAttr)
		mlLink.setAttribute("href", hrefAttr);
	if (text)
		mlLink.appendChild(document.createTextNode(text));
	if (classAttr)
		mlLink.setAttribute("class", classAttr);
	if (idAttr)
		mlLink.setAttribute("id", idAttr);
	return mlLink
}

var mainLink, mlDiv, linkHref;

/* Main Link (in upper right corner) */
mainLink = createLink("W", "http://www.wikipedia.org/wiki/Main_Page", null, "mainLink");
mlDiv = document.createElement("div");

/*  Set up links for link box. Each block of text uses the mlLink variable set to a new element. At the end of each block, the element is appended to mlLinksDiv.*/
function createMenu() {
	var mlLinksDiv = document.createElement("div");
	mlLinksDiv.setAttribute("id", "mlLinksDiv");
	mlLinksDiv.setAttribute("class", "mlLinksDivHide");
	
	mlLinksDiv.appendChild(createLink("Main Page", "http://www.wikipedia.org/wiki/Main_Page"));
	
	mlLinksDiv.appendChild(createLink("Random Page", "http://www.wikipedia.org/wiki/Special:Random"));
	
	mlLinksDiv.appendChild(createLink("Switch", null, "off", "fwpLangSwitch"));
	
	/*	In this if/else statement, the script checks if the userpage link exists (and therefore the user is logged in). If it does, it will add the rest of the user links. Otherwise, it will add a login link. The user links also adds an <hr> element for legibility. */
	
	if (document.getElementById("pt-userpage")) {
		mlLinksDiv.appendChild(document.createElement("hr"));
		
		/*User Page*/
		var mlLink = createLink(null, document.getElementById("pt-userpage").getElementsByTagName("a")[0].getAttribute("href"));
		mlLink.appendChild(document.createTextNode(document.getElementById("pt-userpage").getElementsByTagName("a")[0].childNodes[0].nodeValue));
		mlLinksDiv.appendChild(mlLink);
		
		
		mlLinksDiv.appendChild(createLink("Preferences", document.getElementById("pt-preferences").getElementsByTagName("a")[0].getAttribute("href")));
		
		mlLinksDiv.appendChild(createLink("Watchlist", document.getElementById("pt-watchlist").getElementsByTagName("a")[0].getAttribute("href")));
		
		mlLinksDiv.appendChild(createLink("Log Out", document.getElementById("pt-logout").getElementsByTagName("a")[0].getAttribute("href")));
	}
	else {
		mlLinksDiv.appendChild(createLink("Log In", "http://www.wikipedia.org/w/index.php?title=Special:UserLogin"));
	}

	/* This Article Link */
	if (document.getElementById("ca-nstab-main")) {
		mlLinksDiv.appendChild(document.createElement("hr"));
		mlLinksDiv.appendChild(createLink("This Page", document.getElementById("ca-nstab-main").getElementsByTagName("a")[0].getAttribute("href")));
		
	}

	/* Watch/Unwatch Link */
	if (document.getElementById("ca-watch")) {
		mlLinksDiv.appendChild(createLink("Watch", document.getElementById("ca-watch").getElementsByTagName("a")[0].getAttribute("href")));
	}
	else if (document.getElementById("ca-unwatch")) {
		mlLinksDiv.appendChild(createLink("Unwatch", document.getElementById("ca-unwatch").getElementsByTagName("a")[0].getAttribute("href")));
	}

	/*	Edit link, switches between an edit link (if the page can be edited) and a view source link(if the page cannot be edited). Both links will never appear on the same page. If neither appear, it's most likely a special page like Preferences.*/
	mlLink = document.createElement("a");
	if (document.getElementById("ca-edit")) {
		mlLinksDiv.appendChild(createLink("Edit", document.getElementById("ca-edit").getElementsByTagName("a")[0].getAttribute("href")));
	}
	else if (document.getElementById("ca-viewsource")) {
		mlLinksDiv.appendChild(createLink("View Source", document.getElementById("ca-viewsource").getElementsByTagName("a")[0].getAttribute("href")));
	}

	/* Talk Link */
	if (document.getElementById("ca-talk")) {
		mlLinksDiv.appendChild(createLink("Talk", document.getElementById("ca-talk").getElementsByTagName("a")[0].getAttribute("href")));
	}

	/* History Link */
	if (document.getElementById("ca-history")) {
		mlLinksDiv.appendChild(createLink("History", document.getElementById("ca-history").getElementsByTagName("a")[0].getAttribute("href")));
	}
	
	return mlLinksDiv;
}

mainLink.appendChild(createMenu());

/* Append "W" to main DIV */
mlDiv.setAttribute("id", "mlDiv");
mlDiv.setAttribute("class", "noprint fwpFixedMenuOff");
mlDiv.appendChild(mainLink);

var hcontainer = document.createElement("div");
	hcontainer.setAttribute("id", "fwpHeaderContainer");
	hcontainer.setAttribute("class", "fwpFixedMenuOff");
var h = document.createElement("div");
	h.setAttribute("id", "fwpHeader");
var psearch = document.getElementById("p-search").parentNode.removeChild(document.getElementById("p-search")); // very convoluted - attempt simpler method
	//psearch.setAttribute

h.appendChild(psearch);
h.appendChild(mlDiv);
hcontainer.appendChild(h);

document.body.appendChild(hcontainer);

/* Add indication that user is not logged in */
if (!document.getElementById("pt-userpage")) {
	before = document.getElementById("fwpHeader");
	before.insertBefore(createLink("Log In", "http://www.wikipedia.org/w/index.php?title=Special:UserLogin", "noprint", "notLoggedIn"), before.firstChild);
}

/* change edit links to icon */
var bold = document.getElementsByClassName("mw-editsection");
for( var i = 0; i < bold.length; ++i ) {
	bold[i].className = bold[i].className +" subtleEditIcons";

	anchors = bold[i].getElementsByTagName("a");
	for( var a = 0; a < anchors.length; ++a ) {
		anchors = anchors[a].innerHTML = '';
	}
}

/*Fix search menu blurring*/
var searchInput = document.getElementById('searchInput');
	searchInput.setAttribute("onfocus", "document.getElementById('p-search').setAttribute('class', document.getElementById('p-search').getAttribute('class').replace(/fwpFocused|fwpUnfocused/, 'fwpFocused'));");
	searchInput.setAttribute("onblur", "document.getElementById('p-search').setAttribute('class', document.getElementById('p-search').getAttribute('class').replace(/fwpFocused|fwpUnfocused/, 'fwpUnfocused'));");

/*set up link coloring inititally*/
var bc, sm;
bc = document.getElementById("bodyContent");
sm = document.getElementById("p-search");

bc.setAttribute("class", bc.getAttribute("class") ? bc.getAttribute("class") + "" : "" + "fwpColorLinksNone");

/*continue setup of search menu blurring*/
bc.setAttribute("class", bc.getAttribute("class") + " fwpUnfocused");
	
/*set up initial indent*/
bc.setAttribute("class", bc.getAttribute("class") + " fwpIndentOn");

/*set up fixed menu*/
sm.setAttribute("class", bc.getAttribute("class") + " fwpFixedMenuOff");
	
/*Change (id=spoken-icon) to something monochrome*/
var si = document.getElementById("spoken-icon");
if (si) {
	si.childNodes[0].childNodes[0].setAttribute("src", safari.extension.baseURI + "speaker15.png");
	si.childNodes[0].childNodes[0].setAttribute("height", "15");
}

/*Add info about Beautipedia into Wikipedia's footer*/
var footer, fwpfooter, fwplink, fwplink2, text; 
footer = document.getElementById("footer-info");
if (footer) {
	fwplink = document.createElement("a");
	fwplink.setAttribute("href","https://github.com/gingerbeardman/Beautipedia.safariextension");
	fwplink.appendChild(document.createTextNode("the Beautipedia page on GitHub"));
	
	fwpfooter = document.createElement("li");
	
	fwpfooter.appendChild(document.createTextNode("Beautipedia was originally created by David Ben Jones, but it is now Open Source. To request a feature or report a bug, visit "));
	fwpfooter.appendChild(fwplink);
	fwpfooter.appendChild(document.createTextNode("."));
	
	footer.insertBefore(fwpfooter, footer.childNodes[2]);
}

console.log("sending message");	
safari.self.tab.dispatchMessage("getSettings", "all");
console.log("message sent");
} //DO NOT DELETE | CLOSING BRACKET FOR CHECK IF MAIN WINDOW.