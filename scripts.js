function setupFilter(filterID,filterStructJSON){
	var keys = Object.keys(filterStructJSON);
	//init input values to empty
	keys.forEach(function(key){
		if(filterStructJSON[key].type == "number"){
			filterStructJSON[key].valueFrom = "";
			filterStructJSON[key].valueTo = "";
		} else {
			filterStructJSON[key].value = "";
		}
	});

	var container = document.getElementById(filterID);

	// main filter function
	function filter(){
		var searchArea = this.parentElement.parentElement;
		
		if(filterStructJSON[this.name].type == "number"){
			if(this.className.includes("filter-form-from")){
				filterStructJSON[this.name].valueFrom = this.value;
			} 

			if(this.className.includes("filter-form-to")){
				filterStructJSON[this.name].valueTo = this.value;	
			}
		} else {
			filterStructJSON[this.name].value = this.value;
		}

		console.log(filterStructJSON);
		var items = searchArea.querySelectorAll(".item");

		items.forEach(function(item) {
			var found = true;
			keys.forEach(function(classAttribute){
				var itemAttributes = item.querySelectorAll("."+classAttribute);
				itemAttributes.forEach(function(itemAttribute){
					console.log(itemAttribute.innerText);

					// if not substr
					if(filterStructJSON[classAttribute].type == "text" && !itemAttribute.innerText.includes(filterStructJSON[classAttribute].value)){
						found = false;
					}
					// if not in range
					console.log(Number(""));
					console.log((itemAttribute.innerText >= filterStructJSON[classAttribute].valueFrom || filterStructJSON[classAttribute].valueFrom == ""));
					console.log((itemAttribute.innerText <= filterStructJSON[classAttribute].valueTo || filterStructJSON[classAttribute].valueTo == ""));
					if(filterStructJSON[classAttribute].type == "number" &&
					   !((Number(itemAttribute.innerText) >= Number(filterStructJSON[classAttribute].valueFrom) || filterStructJSON[classAttribute].valueFrom == "") &&
					     (Number(itemAttribute.innerText) <= Number(filterStructJSON[classAttribute].valueTo) || filterStructJSON[classAttribute].valueTo == ""))){
						found = false;
					}
					// if not selected value
					// TODO
				});
			});

			if(found){
				item.style.display = null;
			} else {
				item.style.display = "none";
			}
		});

	};

	// creation of form
	var formName = filterID + "-form";
	container.innerHTML = "<form id='" + formName + "'></form>" + container.innerHTML;
	form = document.getElementById(formName);

	keys.forEach(function(elem) {
		var input = "";
		switch (filterStructJSON[elem].type){
			case "text":
				input = "" + filterStructJSON[elem].label+"<input type="+ filterStructJSON[elem].type +" name="+elem+"></input></br>";
				break;
			case "number":
				input = "" + filterStructJSON[elem].labelFrom+"<input class='filter-form-from' type="+ filterStructJSON[elem].type +" name="+elem+"></input></br>";
				input += "" + filterStructJSON[elem].labelTo+"<input class='filter-form-to' type="+ filterStructJSON[elem].type +" name="+elem+"></input></br>";
				break;
			case "select":
				break;
			default:
				console.error("WAP Filter - Invalid type: " + filterStructJSON[elem].type + " (Possible types: text, number, select)")
		}

	   	form.innerHTML += input;
	});

	var inputArr = form.getElementsByTagName("input");

	//register listeners to each input of form
	for (var i = 0; i < inputArr.length; i++) {
	    inputArr[i].addEventListener("input", filter); 
	}

};

document.addEventListener('DOMContentLoaded', function() {
    setupFilter("my-fitler1", myFitler1Structure);
}, false);


var myFitler1Structure = {
	"name": {
		"label": "Název",
		"type": "text",
    },
    "size": {
    	"labelFrom": "Od",
    	"labelTo": "Do",
		"type": "number",
    } 
};