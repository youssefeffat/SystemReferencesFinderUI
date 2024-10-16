var objectsTables = {
    "group": 'sys_user_group',
    "LoB/Region": 'cmn_department',
    "business service": 'cmdb_ci_service',
    "business segment": '',
    "location ": ''
};

function fillDashboard(sectionId) {

	alert("this search will take some time, on average 10-15 seconds");
	fillImpactedConfig('configuration');
	fillImpactedData('data');
	fillImpactedScriptsByName('scripts-name');
	alert("Search done!");

    // var objectName = document.getElementById('searchedName').value;
    // var objectType = document.getElementById('objectType').value;
    // var objectTable = objectsTables[objectType];

    // alert("this search will take some time, on average 10-15 seconds");

    // var ga = new GlideAjax('global.queryAllObjectReferences');
    // ga.addParam('sysparm_name', 'getScriptsCallingObjectByName');
    // ga.addParam('objectName', objectName);
    // ga.addParam('objectType', objectType);
    // ga.addParam('objectTable', objectTable);

    // ga.getXMLWait();
    // alert("Search done!");

    // var htmlElement = document.getElementById(sectionId);
    // var parsedData = JSON.parse(ga.getAnswer());
    // htmlElement.innerHTML = parsedData;
}


function fillImpactedData(sectionId) {

    var objectName = document.getElementById('searchedName').value;
    var objectType = document.getElementById('objectType').value;
    var objectTable = objectsTables[objectType];	

    // alert("this search will take some time, on average 10-15 seconds");

    var ga = new GlideAjax('global.queryAllObjectReferences');
    ga.addParam('sysparm_name', 'getObjectReferencedData');
    ga.addParam('objectName', objectName);
    ga.addParam('objectType', objectType);
    ga.addParam('objectTable', objectTable);

    ga.getXMLWait();
    // alert("Search done!");

    var htmlElement = document.getElementById(sectionId);
    var parsedData = JSON.parse(ga.getAnswer());
	// console.log(sectionId, " : ",parsedData);
    htmlElement.innerHTML = parsedData;

}

function fillImpactedConfig(sectionId) {

    var objectName = document.getElementById('searchedName').value;
    var objectType = document.getElementById('objectType').value;
    var objectTable = objectsTables[objectType];

    // alert("this search will take some time, on average 10-15 seconds");

    var ga = new GlideAjax('global.queryAllObjectReferences');
    ga.addParam('sysparm_name', 'getObjectDependantConfig');
    ga.addParam('objectName', objectName);
    ga.addParam('objectType', objectType);
    ga.addParam('objectTable', objectTable);

    ga.getXMLWait();
    // alert("Search done!");

    var htmlElement = document.getElementById(sectionId);
    var parsedData = JSON.parse(ga.getAnswer());
	// console.log(sectionId, " : ",parsedData);
    htmlElement.innerHTML = parsedData;
}


function fillImpactedScriptsByName(sectionId) {

    var objectName = document.getElementById('searchedName').value;
    var objectType = document.getElementById('objectType').value;
    var objectTable = objectsTables[objectType];

    // alert("this search will take some time, on average 10-15 seconds");

    var ga = new GlideAjax('global.queryAllObjectReferences');
    ga.addParam('sysparm_name', 'getScriptsCallingObjectByName');
    ga.addParam('objectName', objectName);
    ga.addParam('objectType', objectType);
    ga.addParam('objectTable', objectTable);

    ga.getXMLWait();
    // alert("Search done!");

    var htmlElement = document.getElementById(sectionId);
    var parsedData = JSON.parse(ga.getAnswer());
	// console.log(sectionId, " : ",parsedData);
    htmlElement.innerHTML = parsedData;
}