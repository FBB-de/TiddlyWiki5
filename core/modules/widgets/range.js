/*\
title: $:/core/modules/widgets/range.js
type: application/javascript
module-type: widget

Range widget

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var RangeWidget = function(parseTreeNode,options) {
	this.initialise(parseTreeNode,options);
};

/*
Inherit from the base widget class
*/
RangeWidget.prototype = new Widget();

/*
Render this widget into the DOM
*/
RangeWidget.prototype.render = function(parent,nextSibling) {
	// Save the parent dom node
	this.parentDomNode = parent;
	// Compute our attributes
	this.computeAttributes();
	// Execute our logic
	this.execute();
	// Create our elements
	this.inputDomNode = this.document.createElement("input");
	this.inputDomNode.setAttribute("type","range");
	this.inputDomNode.setAttribute("class",this.elementClass);
	if(this.minValue){
		this.inputDomNode.setAttribute("min", this.minValue);
	}
	if(this.maxValue){
		this.inputDomNode.setAttribute("max", this.maxValue);
	}
	if(this.increment){
		this.inputDomNode.setAttribute("step", this.increment);
	}
	if(this.isDisabled === "yes") {
		this.inputDomNode.setAttribute("disabled",true);
	}
	this.inputDomNode.value = this.getValue();
	// Add a click event handler
	$tw.utils.addEventListeners(this.inputDomNode,[
		{name: "mousedown",handlerObject: this,handlerMethod: "handleMouseDownEvent"},
		{name: "mouseup",handlerObject: this,handlerMethod: "handleMouseUpEvent"},
		{name: "change", handlerObject: this, handlerMethod: "handleChangeEvent"},
		{name: "input", handlerObject: this, handlerMethod: "handleInputEvent"},
	]);
	// Insert the label into the DOM and render any children
	parent.insertBefore(this.inputDomNode,nextSibling);
	this.domNodes.push(this.inputDomNode);
};

RangeWidget.prototype.getValue = function() {
	var tiddler = this.wiki.getTiddler(this.tiddlerTitle),
		fieldName = this.tiddlerField || "text",
		value   = this.defaultValue;
	if(tiddler) {
		if(this.tiddlerIndex) {
			value = this.wiki.extractTiddlerDataItem(tiddler,this.tiddlerIndex,this.defaultValue || "");
		} else {
			if($tw.utils.hop(tiddler.fields,fieldName)) {
				value = tiddler.fields[fieldName] || "";
			} else {
				value = this.defaultValue || "";
			}
		}
	}
	return value;
};

RangeWidget.prototype.handleMouseDownEvent = function(event) {
	this.handleInputEvent(event);
	// Trigger actions
	if(this.actionsMouseDown) {
		this.invokeActionString(this.actionsMouseDown,this,event);
	}
}

RangeWidget.prototype.handleMouseUpEvent = function(event) {
	this.handleInputEvent(event);
	// Trigger actions
	if(this.actionsMouseUp {
		this.invokeActionString(this.actionsMouseUp,this,event);
	}
}

RangeWidget.prototype.handleChangeEvent = function(event) {
	this.handleInputEvent(event);
	// Trigger actions
	if(this.actionsChange) {
		this.invokeActionString(this.actionsChange,this,event);
	}
};

RangeWidget.prototype.handleInputEvent = function(event) {
	if(this.getValue() !== this.inputDomNode.value) {
		if(this.tiddlerIndex) {
			this.wiki.setText(this.tiddlerTitle,"",this.tiddlerIndex,this.inputDomNode.value);
		} else {
			this.wiki.setText(this.tiddlerTitle,this.tiddlerField,null,this.inputDomNode.value);
		}
	}
	// Trigger actions
	if(this.actionsInput) {
		this.invokeActionString(this.actionsInput,this,event);
	}
};

/*
Compute the internal state of the widget
*/
RangeWidget.prototype.execute = function() {
	// Get the parameters from the attributes
	this.tiddlerTitle = this.getAttribute("tiddler",this.getVariable("currentTiddler"));
	this.tiddlerField = this.getAttribute("field");
	this.tiddlerIndex = this.getAttribute("index");
	this.minValue = this.getAttribute("min");
	this.maxValue = this.getAttribute("max");
	this.increment = this.getAttribute("increment");
	this.defaultValue = this.getAttribute("default");
	this.elementClass = this.getAttribute("class","");
	this.isDisabled = this.getAttribute("disabled","no");
	// Actions since 5.1.23
	// Next 3 only fire once!
	this.actionsMouseDown = this.getAttribute("actionsMouseDown");
	this.actionsMouseUp = this.getAttribute("actionsMouseUp");
	// Change only fires, if start-value is different to end-value
	this.actionsChange = this.getAttribute("actionsChange");
	// input fires very often!!
	this.actionsInput = this.getAttribute("actionsInput");
	// Make the child widgets
	this.makeChildWidgets();
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
RangeWidget.prototype.refresh = function(changedTiddlers) {
	var changedAttributes = this.computeAttributes();
	if(changedAttributes.tiddler || changedAttributes.field || changedAttributes.index || changedAttributes['min'] || changedAttributes['max'] || changedAttributes['increment'] || changedAttributes["default"] || changedAttributes["class"] || changedAttributes.disabled) {
		this.refreshSelf();
		return true;
	} else {
		var refreshed = false;
		if(changedTiddlers[this.tiddlerTitle]) {
			var value = this.getValue();
			if(this.inputDomNode.value !== value) {
				this.inputDomNode.value = value;
			}
			refreshed = true;
		}
		return this.refreshChildren(changedTiddlers) || refreshed;
	}
};

exports.range = RangeWidget;

})();
