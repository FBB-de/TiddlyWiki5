/*\
title: $:/core/modules/widgets/linkcatcher.js
type: application/javascript
module-type: widget

Linkcatcher widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false, require:false, exports:false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var LinkCatcherWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
	this.addEventListeners([
		{type: "tm-navigate", handler: "handleNavigateEvent"}
	]);
};

/*
Inherit from the base widget class
*/
LinkCatcherWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
LinkCatcherWidget.prototype.render = function(parent,nextSibling) {
	this.parentDomNode = parent;
	this.computeAttributes();
	this.execute();
	this.renderChildren(parent,nextSibling);
};

/*
Compute the internal state of the widget
*/
LinkCatcherWidget.prototype.execute = function() {
	var self = this;
	// Get our parameters
	this.catchTo = this.getAttribute("to");
	this.catchMessage = this.getAttribute("message");
	this.catchSet = this.getAttribute("set");
	this.catchSetTo = this.getAttribute("setTo");
	this.catchActions = this.getAttribute("actions");
	this.variables = {};

	// keys from above are usedKeys and need to be excluded.
	// Extend this array, if the above elements are changed!
	var usedKeys = ["to", "message", "set", "setTo", "actions"];
	
	$tw.utils.each(this.attributes,function(val,key) {
		if(usedKeys.indexOf(key) === -1 ) {
			self.variables[key] = val;
		}
	});
	// Construct the child widgets
	this.makeChildWidgets();
	// When executing actions we avoid trapping navigate events, so that we don't trigger ourselves recursively
	this.executingActions = false;
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
LinkCatcherWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.to || changedAttributes.message || changedAttributes.set || changedAttributes.setTo) {
		this.refreshSelf();
		return true;
	} else {
		return this.refreshChildren(changedTiddlers);
	}
};

/*
Handle a tm-navigate event
*/
LinkCatcherWidget.prototype.handleNavigateEvent = function(event) {
	if(!this.executingActions) {
		// Execute the actions
		if(this.catchTo) {
			this.wiki.setTextReference(this.catchTo,event.navigateTo,this.getVariable("currentTiddler"));
		}
		if(this.catchMessage && this.parentWidget) {
			this.parentWidget.dispatchEvent({
				type: this.catchMessage,
				param: event.navigateTo,
				navigateTo: event.navigateTo,
				variables: this.variables
			});
		}
		if(this.catchSet) {
			var tiddler = this.wiki.getTiddler(this.catchSet);
			this.wiki.addTiddler(new $tw.Tiddler(tiddler,{title: this.catchSet, text: this.catchSetTo}));
		}
		if(this.catchActions) {
			this.executingActions = true;
			this.invokeActionString(this.catchActions,this,event,{navigateTo: event.navigateTo});
			this.executingActions = false;
		}
	} else {
		// This is a navigate event generated by the actions of this linkcatcher, so we don't trap it again, but just pass it to the parent
		this.parentWidget.dispatchEvent({
			type: "tm-navigate",
			param: event.navigateTo,
			navigateTo: event.navigateTo,
			variables: event.variables
		});
	}
	return false;
};

exports.linkcatcher = LinkCatcherWidget;

})();
