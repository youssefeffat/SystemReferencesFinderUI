var objectsTables = {
    "Group": 'sys_user_group',
    "LoB/Region": 'cmn_department',
    "Business Service": 'cmdb_ci_service',
    "Business Segment": 'cmn_department',
    "Location": 'cmn_location'
};
document.querySelector("#loader").style.visibility = "hidden";


function fillAllSections(section1Id, section2Id, section3Id) {

    emptyAllsections([section1Id, section2Id, section3Id]);
    var objectName = document.getElementById('searchedName').value;
    var objectType = document.getElementById('objectType').value;
    var objectTable = objectsTables[objectType];

    if (objectName === '') {
        alert('no object name was provided');

    } else {
        alert("this search will take some time, on average 10-15 seconds");

        document.querySelector("body").style.visibility = "hidden";
        document.querySelector("#loader").style.visibility = "visible";

        var ga = new GlideAjax('global.queryAllObjectReferences');
        ga.addParam('sysparm_name', 'getAllReferences');
        ga.addParam('objectName', objectName);
        ga.addParam('objectType', objectType);
        ga.addParam('objectTable', objectTable);
        ga.addParam('section1', section1Id);
        ga.addParam('section2', section2Id);
        ga.addParam('section3', section3Id);

        // ga.getXMLWait();
        // var parsedData = JSON.parse(ga.getAnswer());

        var parsedData;
        ga.getXML(function(response) {
            //Get the answer from the response
            var parsedData = JSON.parse(response.responseXML.documentElement.getAttribute("answer"));
            document.querySelector("body").style.visibility = "visible";
            document.querySelector("#loader").style.visibility = "hidden";

            // //Display an alert with the answer
            // alert('DEBUG' +parsedData['error']+ parsedData);

            if (parsedData['error']) {
                alert(objectType + ' not Found');
            } else {

                alert('Search finished !');

                var htmlElement1 = document.getElementById(section1Id);
                var htmlElement2 = document.getElementById(section2Id);
                var htmlElement3 = document.getElementById(section3Id);

                htmlElement1.innerHTML = parsedData[section1Id];
                htmlElement2.innerHTML = parsedData[section2Id];
                htmlElement3.innerHTML = parsedData[section3Id];

            }

        });
    }


}

function emptyAllsections(sections) {
    for (var i = 0; i < sections.length; i++) {
        var htmlElement1 = document.getElementById(sections[i]);
        htmlElement1.innerHTML = '';
    }
}