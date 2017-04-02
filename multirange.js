(function() {
	"use strict";
	var fix=true;
	var supportsMultiple = self.HTMLInputElement && "valueLow" in HTMLInputElement.prototype;
	var descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
	self.multirange = function(input) {
		if (supportsMultiple || input.classList.contains("multirange")) {
			return;
		}
		var lowTip = document.createElement("span");
		var highTip = document.createElement("span");
		var sider_bar = document.createElement("div");
		sider_bar.classList.add("multiple_sider_bar");
		lowTip.classList.add("multiple_tip","multiple_tip_low","multiple_tip_hide");
		highTip.classList.add("multiple_tip","multiple_tip-heigh","multiple_tip_hide");
		var values = input.getAttribute("value").split(",");
		var min = +input.min || 0;
		var max = +input.max || 100;
		var ghost = input.cloneNode();

		input.classList.add("multirange", "original");
		ghost.classList.add("multirange", "ghost");
		input.value = values[0] || min + (max - min) / 2;
		ghost.value = values[1] || min + (max - min) / 2;
		input.parentNode.insertBefore(ghost, input.nextSibling);
		input.parentNode.appendChild(lowTip);
		input.parentNode.appendChild(highTip);
		fix&&input.parentNode.appendChild(sider_bar);
		Object.defineProperty(input, "originalValue", descriptor.get ? descriptor : {
			// Fuck you Safari >:(
			get: function() { return this.value; },
			set: function(v) { this.value = v; }
		});
		Object.defineProperties(input, {
			valueLow: {
				get: function() { return Math.min(this.originalValue, ghost.value); },
				set: function(v) { this.originalValue = v; },
				enumerable: true
			},
			valueHigh: {
				get: function() { return Math.max(this.originalValue, ghost.value); },
				set: function(v) { ghost.value = v; },
				enumerable: true
			}
		});
		if (descriptor.get) {
			// Again, fuck you Safari
			Object.defineProperty(input, "value", {
				get: function() { return this.valueLow + "," + this.valueHigh; },
				set: function(v) {
					var values = v.split(",");
					this.valueLow = values[0];
					this.valueHigh = values[1];
					update();
				},
				enumerable: true
			});
		}
		function update() {
			fix&&sider_bar.style.setProperty("left", 100 * ((input.valueLow - min) / (max - min)) + 1 + "%");
			fix&&sider_bar.style.setProperty("width", 100 * (((input.valueHigh - min) -(input.valueLow - min))/ (max - min))-2 + "%");
			ghost.style.setProperty("--low", 100 * ((input.valueLow - min) / (max - min)) + 1 + "%");
			ghost.style.setProperty("--high", 100 * ((input.valueHigh - min) / (max - min)) + "%");
			lowTip.style.setProperty("left",100 * ((input.valueLow - min) / (max - min)) + 1 + "%");
			highTip.style.setProperty("left", 100 * ((input.valueHigh - min) / (max - min)) + "%");
		}
		lowTip.innerHTML = input.valueLow;
		highTip.innerHTML = input.valueHigh;
		input.addEventListener("input", update);
		ghost.addEventListener("input", update);
		update();

	}
	multirange.init = function() {

		Array.from(document.querySelectorAll("input[type=range][multiple]:not(.multirange)")).forEach(function(node,inx){
			var newNode = document.createElement("div");
			newNode.classList.add("multiple-box")
			node.parentNode.insertBefore(newNode,node.nextSibling);
			newNode.appendChild(node);

			multirange(node);
		});
	}

	if (document.readyState == "loading") {
		document.addEventListener("DOMContentLoaded", multirange.init);
	}
	else {
		multirange.init();
	}
})();
