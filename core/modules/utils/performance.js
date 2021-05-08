/*\
title: $:/core/modules/utils/performance.js
type: application/javascript
module-type: global

Performance measurement.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var PERF_TABLE = "$:/temp/filter/measurement/asTable";
function Performance(enabled) {
	this.enabled = !!enabled;
	this.measures = {}; // Hashmap by measurement name of {time:, invocations:}
	this.logger = new $tw.utils.Logger("performance");
	this.showGreeting();
}

Performance.prototype.showGreeting = function() {
	if($tw.browser && this.enabled) {
		this.logger.log("Execute $tw.perf.log(); to see filter execution timings in the console");
		this.logger.log("Execute $tw.perf.createTiddler(from,to,useMD,rullRes); to show timings in a temporary tiddler");
	}
};

Performance.prototype.orderedMeasures = function() {
	var self = this;
	return Object.keys(self.measures).sort(function(a,b) {
		if(self.measures[a].time > self.measures[b].time) {
			return -1;
		} else if (self.measures[a].time < self.measures[b].time) {
			return + 1;
		} else {
			return 0;
		}
	});
}

/*
Wrap performance reporting around a top level function
*/
Performance.prototype.report = function(name,fn) {
	var self = this;
	if(this.enabled) {
		return function() {
			var startTime = $tw.utils.timer(),
				result = fn.apply(this,arguments);
			self.logger.log(name + ": " + $tw.utils.timer(startTime).toFixed(2) + "ms");
			return result;
		};
	} else {
		return fn;
	}
};

/*
Show log in browser console
*/
Performance.prototype.log = function() {
	var self = this,
		totalTime = 0;
	$tw.utils.each(this.orderedMeasures(),function(name) {
		totalTime += self.measures[name].time;
	});
	var results = [];
	$tw.utils.each(this.orderedMeasures(),function(name) {
		var measure = self.measures[name];
		results.push({name: name,invocations: measure.invocations, avgTime: measure.time / measure.invocations, totalTime: measure.time, percentTime: (measure.time / totalTime) * 100})
	});
	self.logger.table(results);
};

/*
Show log as tiddler
*/
Performance.prototype.createTiddler = function(from, to, useMD) {
	var self = this,
		from = from || 0,
		to = (to) ? to + 1 : 1000,
		useMD = useMD || false,
		totalTime = 0,
		header = [];
	if (useMD) {
		header.push("Pos |Filter |Invoke |Average |Total |% \n");
		header.push("--- |------ |------ |------- |----- |- \n");
	} else {
		header.push("\\rules only table\n\n");
		header.push("|filterPerformanceTable |k\n");
		header.push("|Pos |Filter |Invoke |Average |Total |% |\n");
	}
	$tw.utils.each(this.orderedMeasures(),function(name) {
		totalTime += self.measures[name].time;
	});
	var cnt = 0,
		lines = [];
	$tw.utils.each(this.orderedMeasures(),function(name) {
		var left = (useMD) ? "" : "|",
			right = (useMD) ? "" : " |",
			measure = self.measures[name],
			filter = name.trim().replace(/\r?\n/g," ");
		lines.push( left + (cnt++) + " |" + filter + " |" + measure.invocations + 
					" |" + (measure.time / measure.invocations).toFixed(3) + " |" + measure.time + 
					" |" + ((measure.time / totalTime) * 100).toFixed(2) + right);
	});
	lines = lines.slice(from, to);
	$tw.wiki.addTiddler(new $tw.Tiddler($tw.wiki.getCreationFields(),
				{title:PERF_TABLE, text:header.join("") + lines.join("\n"), type:(useMD) ? "text/plain" : ""},
				$tw.wiki.getModificationFields()));
	$tw.wiki.addTiddler(new $tw.Tiddler({title: "$:/StoryList",list: [PERF_TABLE]}));
};

/*
Wrap performance measurements around a subfunction
*/
Performance.prototype.measure = function(name,fn) {
	var self = this;
	if(this.enabled) {
		return function() {
			var startTime = $tw.utils.timer(),
				result = fn.apply(this,arguments);
			if(!(name in self.measures)) {
				self.measures[name] = {time: 0, invocations: 0};
			}
			self.measures[name].time += $tw.utils.timer(startTime);
			self.measures[name].invocations++;
			return result;
		};
	} else {
		return fn;
	}
};

exports.Performance = Performance;

})();
