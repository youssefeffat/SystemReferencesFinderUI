var queryAllObjectReferences = Class.create();
queryAllObjectReferences.prototype = Object.extendsObject(AbstractAjaxProcessor, {

    dataTables: function() {
        res = ['task', 'cmdb'];

        for (var i = 0; i < res.length; i++) {
			//Adding all child tables to the list
            var rec = new GlideRecord('sys_db_object');
            rec.addQuery('super_class.name', res[i]);
            rec.query();
            while (rec.next()) {
                res.push(rec.name);
            }
        }
        return res;
    },
    getAllReferences: function() {

        //Communicated variables
        var objectName = this.getParameter('objectName');
        var objectType = this.getParameter('objectType');
        var objectTable = this.getParameter('objectTable');
        var section1 = this.getParameter('section1');
        var section2 = this.getParameter('section2');
        var section3 = this.getParameter('section3');

		result = {};
		result[section1] = '';
		result[section2] = '';
		result[section3] = '';


        // get the object sys_id
        var object = new GlideRecord(objectTable);
        object.addQuery('name', objectName).addOrCondition('sys_id', objectName);
        object.query();
        if (!object.next()) {
            // throw Error(objectType + 'not found');
			result = {
				error : true,
			};
			return new global.JSON().encode(result);
        }
        var objectSysId = object.sys_id.toString();
        var objectName = object.name.toString();

        var scriptInclude = new global.queryAllObjectReferences;
        var allowedTables = scriptInclude.dataTables();

        //initialise the result
        var resultInit = '<table class=styled-table border=1>' +
            '<tr>' +
            '<th> Table referencing the ' + objectType + '</th>' +
            '<th> Technical name </th>' +
            '<th> Column </th>' +
            '<th> Number of records referencing the ' + objectType + ' </th>' +
            '<th> link to records</th>' +
            '</tr>';

        var data1 = scriptInclude.getObjectDependantConfig(objectName, objectSysId, objectTable, allowedTables, resultInit);
        var data2 = scriptInclude.getObjectReferencedData(objectName, objectSysId, objectTable, allowedTables, resultInit);
        var data3 = scriptInclude.getObjectReferencedData(objectName, objectSysId, objectTable, allowedTables, resultInit);

		result[section1] = data1;
		result[section2] = data2;
		result[section3] = data3;

        return new global.JSON().encode(result);
    },

    getObjectDependantConfig: function(objectName, objectSysId, objectTable, allowedTables, result) {

        // Query dictionary table for reference and condition fields
        var dict = new GlideRecord('sys_dictionary');
        dict.addQuery('reference', 'CONTAINS', objectTable).addAndCondition('internal_type', 'Reference');
        dict.addQuery('name', 'NOT IN', allowedTables);
        //Do not query audit and log fields
        dict.addQuery('name', 'DOES NOT CONTAIN', 'var__m_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'ecc_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'ha_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'syslog');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'sys_history');
        dict.addQuery('name', 'DOES NOT CONTAIN', '_log');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'text_search');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'ts_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'sys_watermark');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'sys_audit');
        dict.orderBy('name');
        dict.orderBy('element');
        dict.query();
        while (dict.next()) {
            var tblName = dict.name.toString();
            // Skip tables used for Table Rotation
            var gr = new GlideRecord("sys_table_rotation_schedule");
            gr.addQuery("name.name", '!=', tblName);
            gr.addQuery("table_name", tblName);
            gr.query();
            if (!gr.hasNext()) {
                // var tableUtils = new TableUtils(dict.name);
                // var tableDisplayName = tableUtils.getLabel();
                var filterOperator = '=';
                var refType = dict.internal_type;
                if (refType == 'glide_list' || refType == 'conditions') {
                    filterOperator = 'LIKE';
                }
                //Query each table for matching records
                var rec = new GlideRecord(tblName);
                if (refType == 'glide_list' || refType == 'conditions') {
                    rec.addQuery(dict.element, 'CONTAINS', objectSysId);
                } else {
                    rec.addQuery(dict.element, objectSysId);
                }
                rec.query();
                if (rec.getRowCount() > 0) {
                    //Display table/column info
                    result += '<tr>' +
                        '<td>' + rec.getLabel() + '</td>' +
                        '<td>' + dict.name + '</td>' +
                        '<td>' + dict.column_label + '</td>' +
                        '<td>' + rec.getRowCount() + '</td>' +
                        '<td><a href="' + dict.name + '_list.do?sysparm_query=' + dict.element + filterOperator + objectSysId + '" target="_blank" rel="noopener"><u>link</u></a></td>' +
                        '</tr>';
                }
            }
        }

        // Query dictionary table for reference and condition fields
        var dict2 = new GlideRecord('sys_dictionary');
        dict2.addQuery('internal_type', 'CONTAINS', 'script');
        //Do not query audit and log fields
        dict2.addQuery('name', 'DOES NOT CONTAIN', 'var__m_');
        dict2.addQuery('name', 'DOES NOT CONTAIN', 'ecc_');
        dict2.addQuery('name', 'DOES NOT CONTAIN', 'ha_');
        dict2.addQuery('name', 'DOES NOT CONTAIN', 'syslog');
        dict2.addQuery('name', 'DOES NOT CONTAIN', 'sys_history');
        dict2.addQuery('name', 'DOES NOT CONTAIN', '_log');
        dict2.addQuery('name', 'DOES NOT CONTAIN', 'text_search');
        dict2.addQuery('name', 'DOES NOT CONTAIN', 'ts_');
        dict2.addQuery('name', 'DOES NOT CONTAIN', 'sys_watermark');
        dict2.addQuery('name', 'DOES NOT CONTAIN', 'sys_audit');
        dict2.orderBy('name');
        dict2.orderBy('element');
        dict2.query();
        while (dict2.next()) {
            var tblName2 = dict2.name.toString();
            // Skip tables used for Table Rotation
            var gr2 = new GlideRecord("sys_table_rotation_schedule");
            gr2.addQuery("name.name", '!=', tblName2);
            gr2.addQuery("table_name", tblName2);
            gr2.query();
            if (!gr2.hasNext()) {
                var filterOperator2 = '=';
                var refType2 = dict2.internal_type;
                //Query each table for matching records
                var rec2 = new GlideRecord(tblName2);
                encodedQuery = dict2.element + "LIKE" + objectName + '^OR' + dict2.element + "LIKE" + objectSysId;
                rec2.addEncodedQuery(encodedQuery);
                rec2.query();
                if (rec2.getRowCount() > 0) {
                    //Display table/column info
                    result += '<tr>' +
                        '<td>' + rec2.getLabel() + '</td>' +
                        '<td>' + tblName2 + '</td>' +
                        '<td>' + dict2.column_label + '</td>' +
                        '<td>' + rec2.getRowCount() + '</td>' +
                        '<td><a href="' + dict.name + '_list.do?sysparm_query=' + encodedQuery + '" target="_blank" rel="noopener"><u>link</u></a></td>' +
                        '</tr>';
                }
            }
        }

        result += '</table>';

        return result;
    },

    getObjectReferencedData: function(objectName, objectSysId, objectTable, allowedTables, result) {

        // Query dictionary table for reference and condition fields
        var dict = new GlideRecord('sys_dictionary');
        dict.addQuery('reference', 'CONTAINS', objectTable).addAndCondition('internal_type', 'Reference');
        dict.addQuery('name', 'IN', allowedTables);
        //Do not query audit and log fields
        dict.addQuery('name', 'DOES NOT CONTAIN', 'var__m_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'ecc_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'ha_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'syslog');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'sys_history');
        dict.addQuery('name', 'DOES NOT CONTAIN', '_log');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'text_search');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'ts_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'sys_watermark');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'sys_audit');
        dict.orderBy('name');
        dict.orderBy('element');
        dict.query();
        while (dict.next()) {
            var tblName = dict.name.toString();
            // Skip tables used for Table Rotation
            var gr = new GlideRecord("sys_table_rotation_schedule");
            gr.addQuery("name.name", '!=', tblName);
            gr.addQuery("table_name", tblName);
            gr.query();
            if (!gr.hasNext()) {
                var filterOperator = '=';
                var refType = dict.internal_type;
                if (refType == 'glide_list' || refType == 'conditions') {
                    filterOperator = 'LIKE';
                }
                //Query each table for matching records
                var rec = new GlideRecord(tblName);
                if (refType == 'glide_list' || refType == 'conditions') {
                    rec.addQuery(dict.element, 'CONTAINS', objectSysId);
                } else {
                    rec.addQuery(dict.element, objectSysId);
                }
                rec.query();
                if (rec.getRowCount() > 0) {
                    //Display table/column info
                    result += '<tr>' +
                        '<td>' + rec.getLabel() + '</td>' +
                        '<td>' + dict.name + '</td>' +
                        '<td>' + dict.column_label + '</td>' +
                        '<td>' + rec.getRowCount() + '</td>' +
                        '<td><a href="' + dict.name + '_list.do?sysparm_query=' + dict.element + filterOperator + objectSysId + '" target="_blank" rel="noopener"><u>link</u></a></td>' +
                        '</tr>';
                }
            }
        }

        result += '</table>';
        return result;
    },

    getScriptsCallingObjectByName: function(objectName, objectSysId, objectTable, allowedTables, result) {

        // Query dictionary table for reference and condition fields
        var dict = new GlideRecord('sys_dictionary');
        dict.addQuery('internal_type', 'CONTAINS', 'script');
        //Do not query audit and log fields
        dict.addQuery('name', 'DOES NOT CONTAIN', 'var__m_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'ecc_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'ha_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'syslog');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'sys_history');
        dict.addQuery('name', 'DOES NOT CONTAIN', '_log');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'text_search');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'ts_');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'sys_watermark');
        dict.addQuery('name', 'DOES NOT CONTAIN', 'sys_audit');
        dict.orderBy('name');
        dict.orderBy('element');
        dict.query();
        while (dict.next()) {
            var tblName2 = dict.name.toString();
            // Skip tables used for Table Rotation
            var gr2 = new GlideRecord("sys_table_rotation_schedule");
            gr2.addQuery("name.name", '!=', tblName2);
            gr2.addQuery("table_name", tblName2);
            gr2.query();
            if (!gr2.hasNext()) {
                //Query each table for matching records
                var rec2 = new GlideRecord(tblName2);
                encodedQuery = dict.element + "LIKE" + objectName;
                rec2.addEncodedQuery(encodedQuery);
                rec2.query();
                if (rec2.getRowCount() > 0) {
                    //Display table/column info
                    result += '<tr>' +
                        '<td>' + rec2.getLabel() + '</td>' +
                        '<td>' + tblName2 + '</td>' +
                        '<td>' + dict.column_label + '</td>' +
                        '<td>' + rec2.getRowCount() + '</td>' +
                        '<td><a href="' + dict.name + '_list.do?sysparm_query=' + encodedQuery + '" target="_blank" rel="noopener"><u>link</u></a></td>' +
                        '</tr>';
                }
            }
        }
        return result;
    },

    type: 'queryAllObjectReferences'
});