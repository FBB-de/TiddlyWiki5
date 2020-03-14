/*\
title: $:/core/modules/parsers/wikiparser/rules/emphasis/br.js
type: application/javascript
module-type: wikirule

Wiki text inline rule for <space><space><line-break> example:

```
	There are 2 spaces and 1 linebreak at the end of this line  
	So we should see 2 lines
```

This wikiparser can be modified using the rules eg:

```
\rules except br
\rules only br
```

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false exports:false */
"use strict";

exports.name = "br";
exports.types = {inline: true};

exports.init = function(parser) {
	this.parser = parser;
	// Regexp to match
	this.matchRegExp = /([ ]{2}|  \\)$/mg;
};

exports.parse = function() {
	// Move past the match
	this.parser.pos = this.matchRegExp.lastIndex;
	// Parse the run including the terminator
	var tree = this.parser.parseInlineRun(/\r?\n/mg,{eatTerminator: true});

	return [{
		type: "element",
		tag: "br",
		children: tree
	}];
};

})();