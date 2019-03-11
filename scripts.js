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

	keys.forEach(function(elem) {
		switch (filterStructJSON[elem].type){
			case "text":
				element = addInputText(form, elem, filterStructJSON);
				element.addEventListener("input", function(){
					filter(this, filterStructJSON);
				});
				break;
			case "number":
				element = addInputRange(form, elem, filterStructJSON);
				element[0].addEventListener("input", function(){
					filter(this, filterStructJSON);
				});
				element[1].addEventListener("input", function(){
					filter(this, filterStructJSON);
				});
				break;
			case "select":
				element = addInputSelect(form, elem, filterStructJSON);
				element.addEventListener("input", function(){
					filter(this, filterStructJSON);
				});
				break;
			default:
				console.error("WAP Filter - Invalid type: " + filterStructJSON[elem].type + " (Possible types: text, number, select)")
		}
	});
}

function addInputText(form, elem, filterStructJSON){
	var newInputText = document.createElement("input");
	newInputText.setAttribute("name",elem);
	newInputText.setAttribute("type", "text");

	var label = document.createElement("label");
	var labelText = document.createTextNode(filterStructJSON[elem].label);
	label.setAttribute("for", elem);
	label.appendChild(labelText);

	form.appendChild(label);
	form.appendChild(newInputText);

	return newInputText;
}

function addInputRange(form, elem, filterStructJSON){
	var newInputFrom = document.createElement("input");
	newInputFrom.setAttribute("name", elem);
	newInputFrom.setAttribute("type", "number");
	newInputFrom.className = "filter-form-from";

	var newInputTo = document.createElement("input");
	newInputTo.setAttribute("name",elem);
	newInputTo.setAttribute("type", "number");
	newInputTo.className = "filter-form-to";

	var labelFrom = document.createElement("label");
	var labelFromText = document.createTextNode(filterStructJSON[elem].labelFrom);
	labelFrom.setAttribute("for", elem);
	labelFrom.appendChild(labelFromText);

	var labelTo = document.createElement("label");
	var labelToText = document.createTextNode(filterStructJSON[elem].labelTo);
	labelTo.setAttribute("for", elem);
	labelTo.appendChild(labelToText);

	form.appendChild(labelFrom);
	form.appendChild(newInputFrom);
	form.appendChild(labelTo);
	form.appendChild(newInputTo);

	return [newInputFrom, newInputTo];
}

function addInputSelect(form, elem, filterStructJSON){
	var newInputSelect = document.createElement("select");
	newInputSelect.setAttribute("name",elem);

	var label = document.createElement("label");
	var labelText = document.createTextNode(filterStructJSON[elem].label);
	label.setAttribute("for", elem);
	label.appendChild(labelText);

	//Options get dynamic
	const elements = form.parentElement.getElementsByClassName("item");
	var optionsArray = [];
    for (let element of elements) 
    {
    	let opt = element.getElementsByClassName(elem)[0];
    	if (opt != undefined){
    	    optionsArray.push(element.getElementsByClassName(elem)[0].innerText);
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

