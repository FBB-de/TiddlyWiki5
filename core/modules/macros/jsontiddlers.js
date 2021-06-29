/*\
title: $:/core/modules/macros/jsontiddlers.js
type: application/javascript
module-type: macro

Macro to output tiddlers matching a filter to JSON

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "jsontiddlers";

exports.params = [
	{name: "filter"},
	{name: "spaces"},
	{name: "escapeUnsafeScriptCharacters"}
];

/*
Run the macro
*/
exports.run = function(filter,spaces,escapeUnsafeScriptCharacters) {
	var json = this.wiki.getTiddlersAsJson(filter,{
		spaces: spaces,
		escapeUnsafeScriptCharacters: escapeUnsafeScriptCharacters === "yes"
	});
	return json;
};

})();
