var MVD = MVD || {};
MVD.DataSources = MVD.DataSources || {};
MVD.DataSources.Sharepoint = MVD.DataSources.Sharepoint || {};


MVD.DataSources.Sharepoint.analyzeElement = function (element) {
    var nodesToRemove = [];
    var nodesToIsNull = [];
    for (var i = 0; i < element.childNodes.length; i++) {
        var itemNode = element.childNodes[i];
        if (itemNode.nodeName.toUpperCase() == "WHERE") {
            MVD.DataSources.Sharepoint.analyzeElement(itemNode);
        } else if (itemNode.nodeName.toUpperCase() == "AND" || itemNode.nodeName.toUpperCase() == "OR") {
            MVD.DataSources.Sharepoint.analyzeElement(itemNode);
            if (itemNode.childNodes.length != 2) {
                if (itemNode.childNodes.length > 0) {
                    element.appendChild(itemNode.childNodes[0]);
                }
                nodesToRemove.push(itemNode);
            }
        } else {
            for (var j = 0; j < itemNode.childNodes.length; j++) {
                var itemNode2 = itemNode.childNodes[j];
                if (itemNode2.nodeName.toUpperCase() == "VALUE") {
                    if (itemNode2.textContent.trim().startsWith("{") && itemNode2.textContent.trim().endsWith("}")) {
                        nodesToRemove.push(itemNode);
                    } else if (!itemNode2.textContent) {
                        if (itemNode.nodeName.toUpperCase() == "EQ") {
                            nodesToIsNull.push(itemNode);
                        } else {
                            nodesToRemove.push(itemNode);
                        }
                    }
                    break;
                }
            }
        }
    }
    for (var i = 0; i < nodesToRemove.length; i++) {
        element.removeChild(nodesToRemove[i]);
    }
    for (var j = 0; j < nodesToIsNull.length; j++) {
        var xmlNode = nodesToIsNull[j];
        var auxNode = element.ownerDocument.createElement("IsNull");
        for (var keyItemNode3 in xmlNode.childNodes) {
            var itemNode3 = xmlNode.childNodes[keyItemNode3];
            if (itemNode3.nodeName.toUpperCase() == "FIELDREF") {
                auxNode.appendChild(itemNode3);
                break;
            }
        }
        element.appendChild(auxNode);
        element.removeChild(xmlNode);
    }
};

MVD.DataSources.Sharepoint.applyParameters = function (parameters) {
    var query = MVD.DataSources.Sharepoint.getQueryFromParamters(parameters);//source.typeSettings.query;
    if (!query) {
        return null;
    }
    for (var i = parameters.length - 1; i >= 0; i--) {
        var parameter = parameters[i];
        if (parameter.visible && typeof parameter.value !== 'undefined' && typeof parameter.dateSubType === 'undefined') {
            query = replaceParameterValueInQuery(query, parameter);
        }
    }
    query = query.replace('<View><Query>', '');
    query = query.replace('</Query></View>', '');
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(query, 'application/xml');
    MVD.DataSources.Sharepoint.analyzeElement(xmlDoc);
    var queryAnalyzed = (new XMLSerializer()).serializeToString(xmlDoc);
    queryAnalyzed = (queryAnalyzed.indexOf('FieldRef') === -1) ? null : '<View Scope="RecursiveAll"><Query>' + queryAnalyzed + '</Query></View>';
    return queryAnalyzed;

    function replaceParameterValueInQuery(query, parameter) {
        var renderId = (parameter.referenceInQuery) ? parameter.referenceInQuery : MVD.DataSources.getParameterRenderId(parameter);
        if (Array.isArray(parameter.value)) {
            if (parameter.value.length > 0) {
                var auxQuery = getNestedQuery(parameter, parameter.value);
                var auxToReplace = MVD.DataSources.Sharepoint.getParameterFieldQuery(parameter);
                query = query.replace(auxToReplace, auxQuery);
            }
        }
        else {
            if (parameter.value === null || parameter.value === 'MVDNullValue') {
                if (parameter.allowNull) {
                    var auxToReplace = MVD.DataSources.Sharepoint.getParameterFieldQuery(parameter);
                    query = query.replace(auxToReplace, '<IsNull><FieldRef Name="' + parameter.field + '"></FieldRef></IsNull>');
                }
            } else {
                var auxValueReplace = parameter.value;
                if (typeof auxValueReplace === 'string') {
                    auxValueReplace = auxValueReplace.replace(/&/g, '&amp;')
														.replace(/</g, '&lt;')
														.replace(/>/g, '&gt;')
														.replace(/"/g, '&quot;')
														.replace(/'/g, '&apos;');
                }
                query = query.replace('{' + renderId + '}', auxValueReplace);
                if (parameter.auxValue) {
                    query = query.replace('{aux' + renderId + '}', parameter.auxValue);
                }
            }
        }
        if (parameter.operator === 'Neq') {
            query = query.replace('<IsNull><FieldRef Name="' + parameter.field + '"></FieldRef></IsNull></Or>', '');
            query = query.replace('<Or>', '');
        }
        return query;
    }
    function getNestedQuery(parameter, parametersValues) {
        var str = '<Or>';
        for (var i = 0; i < parametersValues.length; i++) {
            var auxValueReplace = parametersValues[i];
            if (typeof auxValueReplace === 'string') {
                auxValueReplace = auxValueReplace.replace(/&/g, '&amp;') //<= start with
														.replace(/</g, '&lt;')
														.replace(/>/g, '&gt;')
														.replace(/"/g, '&quot;')
														.replace(/'/g, '&apos;');
            }
            if (i < 2) {
                if (auxValueReplace === 'MVDNullValue') {
                    str += '<IsNull><FieldRef Name="' + parameter.field + '"></FieldRef></IsNull>'
                } else {
                    str += '<' + parameter.operator + '><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameter.spType + '" >' + auxValueReplace + '</Value></' + parameter.operator + '>';
                }
            } else {
                str = '<Or>' + str;
                if (parametersValues[i] === 'MVDNullValue') {
                    str += '</Or><IsNull><FieldRef Name="' + parameter.field + '"></FieldRef></IsNull>'
                } else {
                    str += '</Or><' + parameter.operator + '><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameter.spType + '" >' + auxValueReplace + '</Value></' + parameter.operator + '>';
                }
            }
        }
        str += '</Or>';
        return str;
    }
};

MVD.DataSources.Sharepoint.getData = function (source, camlQuery) {//getListItems(siteUrl, listUrl, queryText, includes, getAttachments)
    return new Promise(function (resolve, reject) {
        let includesQuery = (source.typeSettings.fields.length === 0) ? null : source.typeSettings.fields.join(',');
        let arrayPromises = [MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.siteServerRelativeUrl, source.typeSettings.listUrl, camlQuery, includesQuery, false), MVD.DataSources.Sharepoint.getFields(source)]
        Promise.all(arrayPromises)
            .then(function (args) {
                var fields = (source.typeSettings.fields && source.typeSettings.fields.length > 0) ? args[1].fields.filter(e => source.typeSettings.fields.includes(e.internalName)) : args[1].fields.filter(e => e.allowedUseInUI === true);
                resolve(MVD.SPHelpers.ListItems.getItemsFromQueryForDataSource(args[0], fields, source.typeSettings.fieldsToOpen));
            })
            .catch(function (args) {
                reject({ error: args, msg: args.get_message() });
            });
    });
}

MVD.DataSources.Sharepoint.getDetailData = function (source, row, columnName, data) {
    var retData = [];
    if (!row && !columnName) {
        retData = data;
    } else {
        retData.push(row);
    }
    return retData;
};

MVD.DataSources.Sharepoint.getFields = function (source) {
    return new Promise(function (resolve, reject) {
        MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.siteServerRelativeUrl, source.typeSettings.listUrl)
            .then(function (listFields) {
                var fields = MVD.DataSources.Sharepoint.openMultipleChoiceAndRemoveNotAllowedFields(listFields, source.typeSettings.listUrl.includes('/lists'));
                resolve({ fields: fields, dynamicFields: [] });
            })
            .catch(function (args) {
                args.msg = 'Error al obtener los campos de la lista ' + source.typeSettings.listUrl;
                reject(args);
            });
    });
};

MVD.DataSources.Sharepoint.getParameterFieldQuery = function (parameter) {
    var query = '';
    var renderId = MVD.DataSources.getParameterRenderId(parameter);
    var parameterType = /*(parameter.type === 'Calculated') ? parameter.extraConfig.resultType :*/ parameter.spType;
    if (parameter.operator === 'Range') {
        var renderToId = MVD.DataSources.getParameterRenderId(parameter, parameter.createdToName);
        query = '<And><Geq><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameterType + '" >{' + renderId + '}</Value></Geq><Leq><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameterType + '" >{' + renderToId + '}</Value></Leq></And>';
    }
    else if (parameterType === 'DateTime' && parameter.operator === 'Eq' && (parameter.dateType === 'year' || parameter.dateType === 'monthAndYear')) {
        query = '<And><Geq><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameterType + '" >{' + renderId + '}</Value></Geq><Leq><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameterType + '" >{' + 'aux' + renderId + '}</Value></Leq></And>';
    }
    else if (parameterType === 'DateTime' && parameter.operator === 'Neq' && (parameter.dateType === 'year' || parameter.dateType === 'monthAndYear')) {
        query = '<Or><Gt><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameterType + '" >{' + 'aux' + renderId + '}</Value></Gt><Lt><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameterType + '" >{' + renderId + '}</Value></Lt></Or>';
    }
    else {
        if (parameterType === 'DateTime' && parameter.dateType === 'dateTime') {
            query = '<' + parameter.operator + '><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameterType + '" IncludeTimeValue="True" >{' + renderId + '}</Value></' + parameter.operator + '>';
        } else {
            query = '<' + parameter.operator + '><FieldRef Name="' + parameter.field + '" /><Value Type="' + parameterType + '" >{' + renderId + '}</Value></' + parameter.operator + '>';
        }
    }
    if (parameter.operator === 'Neq') {
        query = '<Or>' + query + '<IsNull><FieldRef Name="' + parameter.field + '"></FieldRef></IsNull></Or>';
    }
    return query;
};

MVD.DataSources.Sharepoint.getParametersFromQuery = function (listUrl, query) {
    return new Promise(function (resolve, reject) {
        MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.siteServerRelativeUrl, listUrl)
            .then(function (fields) {
                var parameters = validateQueryAndGetParameters(query);
                if (parameters.length > 0) {
                    var parametersNotExistinList = [];
                    for (var i = 0; i < parameters.length; i++) {
                        var parameterName = parameters[i].field;
                        var isParameterInList = false;
                        for (var j = 0; j < fields.length; j++) {
                            if (fields[j].internalName === parameterName) {
                                isParameterInList = true;
                                var schemaXml = MVD.SPHelpers.Common.convertXmlToObject(fields[j].schemaXml);
                                parameters[i].type = schemaXml.Type;
                                if (parameters[i].type.includes('Lookup')) {
                                    parameters[i].listId = schemaXml.List;
                                    parameters[i].showField = schemaXml.ShowField;
                                }
                                else if (parameters[i].type.includes('User')) {
                                    parameters[i].userSelectionMode = schemaXml.UserSelectionMode;
                                } else if (parameters[i].type.includes('Choice')) {
                                    parameters[i].listUrl = listUrl;
                                }
                                break;
                            }
                        }
                        if (!isParameterInList) {
                            parametersNotExistinList.push(parameterName);
                        }
                    }
                    if (parametersNotExistinList.length !== 0) {
                        reject({ error: null, msg: 'La query ingresada tiene parámetros que no se encuentran en la lista seleccionada.\n' + parametersNotExistinList.toString() });
                    } else {
                        resolve(parameters);
                    }
                }
                else {
                    resolve(parameters);
                }
            })
            .catch(function (args) {
                reject({ error: args, msg: 'Error en al obtener los campos de ' + listUrl });
            })
    });

    function validateQueryAndGetParameters(query) {
        if (!query || query.trim().length === 0 || query.indexOf('{') === -1) {
            return [];
        } else {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(query, "text/xml");
            try {
                function getFilters(obj, parameters) {
                    for (var key in obj) {
                        if (key === 'FieldRef') {
                            if (obj.Value.startsWith("{") && obj.Value.endsWith("}")) {
                                parameters.push({
                                    'field': obj.FieldRef.Name,
                                    'value': obj.Value,
                                });
                            }
                            break;
                        } else {
                            getFilters(obj[key], parameters)
                        }
                    }
                }
                var auxFilters = [];
                getFilters(Object.values(MVD.SPHelpers.Common.convertXmlToObject(xmlDoc)), auxFilters);
                return auxFilters;
            } catch (e) {
                alert('error validate/queryAndGetFilters');
                return [];
            }
        }
    }
};

MVD.DataSources.Sharepoint.getQueryFromParamters = function (parameters) {
    var query = '';
    if (!parameters) {
        return '';
    }
    var auxParameters = [];
    for (var i = parameters.length - 1; i >= 0; i--) {
        if (parameters[i].dateSubType || parameters[i].operator === 'ToRange') {
            continue;
        }
        auxParameters.push(parameters[i]);
    }
    if (auxParameters.length === 1) {
        query += MVD.DataSources.Sharepoint.getParameterFieldQuery(auxParameters[0]);
    } else
        for (var i = 0; i < auxParameters.length; i++) {
            if (i > 1) {
                query = '<And>' + query;
                query += MVD.DataSources.Sharepoint.getParameterFieldQuery(auxParameters[i]);
                query += '</And>';
            } else {
                query = '<And>';
                query += MVD.DataSources.Sharepoint.getParameterFieldQuery(auxParameters[0]);
                query += MVD.DataSources.Sharepoint.getParameterFieldQuery(auxParameters[1]);
                query += '</And>';
                i++;
            }
        }
    return '<Where>' + query + '</Where>';
};

MVD.DataSources.Sharepoint.openMultipleChoiceAndRemoveNotAllowedFields = function (fields, isList) {
    var fieldsToAdd = [];
    fields = fields.filter(function (field) {
        var retValue = true;
        if (field.internalName.startsWith('MVDRF_')) retValue = false;
        else if (field.type === 'MVDRelationPropertyField') retValue = false;
        else if (isList && field.internalName === 'FileLeafRef') retValue = false;
        else if (!isList && field.internalName === 'Title') retValue = false;
        return retValue;
    });
    fields.forEach(function (field) {
        if (field.type === 'MultiChoice') {
            field.schema.OpenField = true;
            var choices = field.schema.CHOICES.CHOICE;
            var fillInChoice = (field.schema.FillInChoice === 'TRUE');
            if (fillInChoice) {
                fieldsToAdd.push({
                    name: field.name + ' - Rellenar',
                    internalName: field.internalName + '__FillInChoice',
                    type: 'Boolean',
                    schema: {
                        Type: 'Boolean',
                        OpenFrom: field.internalName,
                    },
                    allowedUseInUI: false,
                });
            }
            choices.forEach(function (choice, index) {
                var auxField = {};
                //var choiceIdentifier = MVD.SPHelpers.Common.getValidJavacriptIndentifier(choice);
                auxField.name = field.name + ' - ' + choice;
                auxField.internalName = field.internalName + '__' + index;
                auxField.type = 'Boolean';
                auxField.schema = {
                    Type: 'Boolean',
                    OpenFrom: field.internalName,
                };
                auxField.allowedUseInUI = false;
                fieldsToAdd.push(auxField);
            });
        }
        else if (field.type === 'GridChoice') {
            field.schema.OpenField = true;
            var openGridChoiceSchema = {
                Type: 'Number',
                OpenFrom: field.internalName,
            }
            var choices = field.schema.CHOICES.CHOICE;
            choices.forEach(function (choice, index) {
                var auxField = {};
                //var choiceIdentifier = MVD.SPHelpers.Common.getValidJavacriptIndentifier(choice);
                auxField.name = field.name + ' - ' + choice;
                auxField.internalName = field.internalName + '__' + index
                auxField.type = 'Number';
                auxField.schema = {
                    Type: 'Number',
                    OpenFrom: field.internalName,
                };
                auxField.allowedUseInUI = false;
                fieldsToAdd.push(auxField);
            });
        }
        field.allowedUseInUI = true;
    })
    fields = fields.concat(fieldsToAdd).sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    return fields;
};