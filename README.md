# Product filter JS plugin

Simple Javascript plugin for filtering items on webpage. Created as project for Web Application (WAP) course at VUT FIT Brno.

## Usage
Following steps describing how to use this plugin:
1. To the html document link reference to Javascript file with plugin. 
    `<script src='filter.js'></script>`
2. Then you can add the css for this plugin in header of your HTML page.
    `<link rel='stylesheet' type='text/css' href='css/filter.css'>`
    `<link rel='stylesheet' type='text/css' href='css/general.css'>`
3. Next step have to be insertion of filter indicatior, where should be filter placed.
  `<div id='my-fitler1'>`
4. Every single item in html file, which is object of filtered set have to be signed with class keyword `item`. Filter attributes are possible insert to item block element in form of class names.
5. Configuration object for filter creation have this form:
   ```
    var myFitler1Structure = {
    	"name": {
    		"label": "Název",
    		"type": "text",
    		},
    	"size": {
    		"labelFrom": "Od",
    		"labelTo": "Do",
    		"type": "number",
    	},
    	 "type": {
    		"label": "Typ",
    		"type": "select",
    	},
    };
    ```
    The first level of this JSON means filter attribute name and it has more settings like label and type (text, number, select) of filter field. 
6. At the end is important to call init function of the filter plugin in html document. 
  `window.onload = setupFilter("my-fitler1", myFitler1Structure);`

## Example
Example of filter usage is in the file `demo.html`.
