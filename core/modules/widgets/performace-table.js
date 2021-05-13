/*\
title: $:/core/modules/widgets/performace-table.js
type: application/javascript
module-type: widget

Qualify text to a variable 

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var PerformanceTable = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
PerformanceTable.prototype = new Widget();

/*
Render this widget into the DOM
*/
PerformanceTable.prototype.render = function(parent,nextSibling) {

	// TODO 

	// Save the parent dom node
	this.parentDomNode = parent;
	// Compute our attributes
	this.computeAttributes();
	// Execute our logic
	this.execute();
	// Get the value of the tv-wikilinks configuration macro
	var wikiLinksMacro = this.getVariable("tv-wikilinks"),
		useWikiLinks = wikiLinksMacro ? (wikiLinksMacro.trim() !== "no") : true,
		missingLinksEnabled = !(this.hideMissingLinks && this.isMissing && !this.isShadow);
	// Render the link if required
	if(useWikiLinks && missingLinksEnabled) {
		this.renderLink(parent,nextSibling);
	} else {
		// Just insert the link text
		var domNode = this.document.createElement("span");
		parent.insertBefore(domNode,nextSibling);
		this.renderChildren(domNode,null);
		this.domNodes.push(domNode);
	}

};

/*
Compute the internal state of the widget
*/
PerformanceTable.prototype.execute = function() {
	// Get our parameters
	this.qualifyName = this.getAttribute("filter");
	this.qualifyTitle = this.getAttribute("class");  // table-class
	this.qualifyTitle = this.getAttribute("variable");
	this.qualifyTitle = this.getAttribute("format");

// TODO

	// Construct the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
PerformanceTable.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.filter || changedAttributes.format) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);
	}
};

exports.performanceintrumentation = PerformanceTable;

})();
