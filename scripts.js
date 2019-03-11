function setupFilter(filterID,filterStructJSON){
	var keys = Object.keys(filterStructJSON);
	//init input values to empty
	keys.forEach(function(key){
		if(filterStructJSON[key].type === "number"){
			filterStructJSON[key].valueFrom = "";
			filterStructJSON[key].valueTo = "";
		} else {
			filterStructJSON[key].value = "";
		}
	});

	// Creation of form
	var container = document.getElementById(filterID);
	form = document.createElement("form");
  	container.insertBefore(form, container.childNodes[0]);

	generateInputs(form, filterStructJSON);
};


// Main filter function
function filter(element, filterStructJSON){
	var keys = Object.keys(filterStructJSON);
	var searchArea = element.parentElement.parentElement;
	switch(filterStructJSON[element.name].type){
		case "number":
			if(element.className.includes("filter-form-from")){
				filterStructJSON[element.name].valueFrom = element.value;
			} 
			if(element.className.includes("filter-form-to")){
				filterStructJSON[element.name].valueTo = element.value;	
			}
			break;
		case "text":
			filterStructJSON[element.name].value = element.value;
			break;
		case "select":
			filterStructJSON[element.name].value = element.options[element.selectedIndex].text;
			break;
		default:
			break;
	}	

	var items = searchArea.querySelectorAll(".item"); //Todo

	items.forEach(function(item) {
		var found = true;
		keys.forEach(function(key){
			var itemAttributes = item.getElementsByClassName(key);

			if(filterStructJSON[key].type === "select" && itemAttributes.length === 0 && filterStructJSON[key].value !== ""){
					found = false;
			} 

			for (let itemAttribute of itemAttributes){
				// if not substr
				if(filterStructJSON[key].type === "text" && !itemAttribute.innerText.includes(filterStructJSON[key].value)){
					found = false;
				}
				// if not in range
				if(filterStructJSON[key].type === "number" &&
				   !((Number(itemAttribute.innerText) >= Number(filterStructJSON[key].valueFrom) || filterStructJSON[key].valueFrom === "") &&
				     (Number(itemAttribute.innerText) <= Number(filterStructJSON[key].valueTo) || filterStructJSON[key].valueTo === ""))){
					found = false;
				}
				// if not selected value
				if(filterStructJSON[key].type === "select" && !itemAttribute.innerText.includes(filterStructJSON[key].value)){
					found = false;
				} 
			};
		});

		if(found){
			item.style.display = null;
		} else {
			item.style.display = "none";
		}
	});

};

function generateInputs(form, filterStructJSON){
	var keys = Object.keys(filterStructJSON);
	var element;

	keys.forEach(function(name) {
		switch (filterStructJSON[name].type){
			case "text":
				element = addInputText(form, name, filterStructJSON);
				element.addEventListener("input", function(){
					filter(this, filterStructJSON);
				});
				break;
			case "number":
				element = addInputRange(form, name, filterStructJSON);
				element[0].addEventListener("input", function(){
					filter(this, filterStructJSON);
				});
				element[1].addEventListener("input", function(){
					filter(this, filterStructJSON);
				});
				break;
			case "select":
				element = addInputSelect(form, name, filterStructJSON);
				element.addEventListener("input", function(){
					filter(this, filterStructJSON);
				});
				break;
			default:
				console.error("WAP Filter - Invalid type: " + filterStructJSON[name].type + " (Possible types: text, number, select)")
		}
	});
}

function addInputText(form, name, filterStructJSON){
	var newInputText = document.createElement("input");
	newInputText.setAttribute("name",name);
	newInputText.setAttribute("type", "text");

	var label = document.createElement("label");
	var labelText = document.createTextNode(filterStructJSON[name].label);
	label.setAttribute("for", name);
	label.appendChild(labelText);

	form.appendChild(label);
	form.appendChild(newInputText);

	return newInputText;
}

function addInputRange(form, name, filterStructJSON){
	var newInputFrom = document.createElement("input");
	newInputFrom.setAttribute("name", name);
	newInputFrom.setAttribute("type", "number");
	newInputFrom.className = "filter-form-from";

	var newInputTo = document.createElement("input");
	newInputTo.setAttribute("name",name);
	newInputTo.setAttribute("type", "number");
	newInputTo.className = "filter-form-to";

	var labelFrom = document.createElement("label");
	var labelFromText = document.createTextNode(filterStructJSON[name].labelFrom);
	labelFrom.setAttribute("for", name);
	labelFrom.appendChild(labelFromText);

	var labelTo = document.createElement("label");
	var labelToText = document.createTextNode(filterStructJSON[name].labelTo);
	labelTo.setAttribute("for", name);
	labelTo.appendChild(labelToText);

	form.appendChild(labelFrom);
	form.appendChild(newInputFrom);
	form.appendChild(labelTo);
	form.appendChild(newInputTo);

	return [newInputFrom, newInputTo];
}

/**
 * Adds an input select element to form.
 *
 * @param      HTML object  	form              The form
 * @param      string  			name              The name of element
 * @param      JSON object  	filterStructJSON  The filter structure json
 * @return     HTML object  	Return  HTML object of created select element.
 */
function addInputSelect(form, name, filterStructJSON){
	var newInputSelect = document.createElement("select");
	newInputSelect.setAttribute("name",name);

	console.log(typeof form);
	var label = document.createElement("label");
	var labelText = document.createTextNode(filterStructJSON[name].label);
	label.setAttribute("for", name);
	label.appendChild(labelText);

	//Options get dynamic
	const elements = form.parentElement.getElementsByClassName("item");
	var optionsArray = [];
    for (let element of elements) 
    {
    	let opt = element.getElementsByClassName(name)[0];
    	if (opt != undefined){
    	    optionsArray.push(element.getElementsByClassName(name)[0].innerText);
    	}
    }
    const options = [...new Set(optionsArray)]

    //Options set
	var newOption = document.createElement("option");
	newOption.setAttribute("value", "");
	newInputSelect.appendChild(newOption);

	options.forEach(function(option) {
		newOption = document.createElement("option");
		newOption.setAttribute("value", option);

		var newOptionText = document.createTextNode(option);
		newOption.appendChild(newOptionText);

		newInputSelect.appendChild(newOption);
	})


	form.appendChild(label);
	form.appendChild(newInputSelect);

	return newInputSelect;
}

