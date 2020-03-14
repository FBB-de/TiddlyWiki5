/*\
title: $:/core/modules/parsers/wikiparser/rules/dot.js
type: application/javascript
module-type: wikirule

Wiki text block rule for dot-paragraphs

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

exports.name = "dot";
exports.types = {block: true};

exports.init = function(parser) {
	this.parser = parser;
	// Regexp to match
//	this.matchRegExp = /(\´{1,3})/mg; //a  OK
//	this.matchRegExp = /(\.{1,3})/mg; //b  CSS interference
//	this.matchRegExp = /(\. )/mg;     //y  OK see: dot-space!
//	this.matchRegExp = /(\´)(\t{1,2})?/mg; //x  OK
//	this.matchRegExp = /(\´)(\´{1,2})?/mg; //x  OK
	this.matchRegExp = /(\. )|(\.{2,4} )/mg; //y  OK
};

/*
Parse the most recent match
*/
exports.parse = function() {
	// Get all the details of the match
//	var level = this.match[1].length; //abc
//	var level = (this.match[2]) ? this.match[2].length + 1 : 1; //x
	var level = (this.match[2]) ? this.match[2].length - 1 : 1; //y
	// Move past the !s
	this.parser.pos = this.matchRegExp.lastIndex;
	// Parse any classes, whitespace and then the heading itself
	var classes = this.parser.parseClasses();
	classes.push("tc-p" + level);
	this.parser.skipWhitespace({treatNewlinesAsNonWhitespace: true});
	var tree = this.parser.parseInlineRun(/(\r?\n)/mg);
	// Return the paragraph
	return [{
		type: "element",
		tag: "p",
		attributes: {
			"class": {type: "string", value: classes.join(" ")}
		},
		children: tree
	}];
};
})();
