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

Performance.prototype.log = function() {
	var self = this,
		totalTime = 0,
		orderedMeasures = Object.keys(this.measures).sort(function(a,b) {
			if(self.measures[a].time > self.measures[b].time) {
				return -1;
			} else if (self.measures[a].time < self.measures[b].time) {
				return + 1;
			} else {
				return 0;
			}
		});
	$tw.utils.each(orderedMeasures,function(name) {
		totalTime += self.measures[name].time;
	});
	var results = []
	$tw.utils.each(orderedMeasures,function(name) {
		var measure = self.measures[name];
		results.push({name: name,invocations: measure.invocations, avgTime: measure.time / measure.invocations, totalTime: measure.time, percentTime: (measure.time / totalTime) * 100})
	});
	self.logger.table(results);
};

Performance.prototype.createTiddler = function(from, to, useMD, fullRes) {
	var self = this,
		NAME = "$:/temp/filter/measurement/asTable",
		from = from || 0,
		to = to || 1000,
		to = to + 1,
		useMD = useMD || false,
		fullRes = fullRes || false;
		lines = [],
		header = [],
		totalTime = 0,
		orderedMeasures = Object.keys(this.measures).sort(function(a,b) {
			if(self.measures[a].time > self.measures[b].time) {
				return -1;
			} else if (self.measures[a].time < self.measures[b].time) {
				return + 1;
			} else {
				return 0;
			}
		});
	if (useMD) {
		header.push("```\n");
		header.push("Pos |Filter |Invoke |Average |Total |% \n");
		header.push("--- |------ |------ |------- |----- |- \n");
		header = header.join("");
	} else {
		header.push("\\rules only table \n\n");
		header.push("|filterPerformanceTable |k\n");
		header.push("|Pos |Filter |Invoke |Average |Total |% |\n");
		header = header.join("");
	}
	$tw.utils.each(orderedMeasures,function(name) {
		totalTime += self.measures[name].time;
	});
	var results = [];
	var cnt = 0;
	$tw.utils.each(orderedMeasures,function(name) {
		var left, right, 
			measure = self.measures[name],
			average = measure.time / measure.invocations,
			percent = (measure.time / totalTime) * 100,
			filter = name.trim().replace(/\r?\n/g," ");
		average = (fullRes) ? average : (average > 0) ? average.toFixed(3) : 0;
		percent = (fullRes) ? percent : (percent > 0) ? percent.toFixed(2) : 0;
		left = (useMD) ? "" : "|";
		right = (useMD) ? "" : " |";
		lines.push( left + cnt++ + " |" + filter + " |" + measure.invocations + 
					" |" + average + " |" + measure.time + " |" + percent + right);
	});
	lines = lines.slice(from, to);
	if (useMD) {
		lines.push("```\n")
	}
	$tw.wiki.addTiddler(new $tw.Tiddler($tw.wiki.getCreationFields(),{title: NAME, text: header + lines.join("\n")},$tw.wiki.getModificationFields()));
	$tw.wiki.addTiddler(new $tw.Tiddler({title: "$:/StoryList",list: [NAME]}));
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
