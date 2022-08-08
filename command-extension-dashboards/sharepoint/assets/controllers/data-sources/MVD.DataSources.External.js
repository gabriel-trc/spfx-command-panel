var MVD = MVD || {};
MVD.DataSources = MVD.DataSources || {};
MVD.DataSources.External = MVD.DataSources.External || {};


MVD.DataSources.External.getData = function (source, query, force) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('POST', '/_layouts/15/MVD.ServerDatasources/ServerDatasource.ashx', true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        req.timeout = 120000; // time in milliseconds
        req.onerror = function (e) {
            reject({ error: e, msg: 'Error al obtener los datos de la fuente externa.' });
        }
        req.ontimeout = function (e) {
            reject({ error: e, msg: 'La consulta tarda demasiado en responder; sugerimos que agregue parámetros y/o seleccione la menor cantidad de campos posibles.' });
        };
        var caml = (query) ? encodeURIComponent(query) : '';
        var fields = '';
        if (source.typeSettings.fields) {
            for (var i = 0; i < source.typeSettings.fields.length; i++) {
                if (i === source.typeSettings.fields.length - 1) {
                    fields += source.typeSettings.fields[i];
                } else {
                    fields += source.typeSettings.fields[i] + ';';
                }
            }
        }
        if (source.typeSettings.type === 'External Sharepoint') {
            req.onload = function (e) {
                if (req.status != 200) { //TODO chequear si no podria dar otro codigo
                    reject({ error: req, msg: 'Error al obtener los datos de la fuente externa' });
                }
                var data = [];
                try {
                    data = JSON.parse(req.response);
                    data.forEach(function (e, i) {
                        for (var keyField in e) {
                            if (e[keyField]) {
                                if (Array.isArray(e[keyField])) {
                                    var aux = e[keyField].reduce(function (acu, curr) {
                                        acu += curr.LookupValue + '; ';
                                        return acu;
                                    }, '');
                                    e[keyField] = aux.substring(0, aux.length - 2);
                                } else if (typeof e[keyField].LookupValue !== 'undefined') {
                                    e[keyField] = e[keyField].LookupValue;
                                }
                            } else {
                                e[keyField] = 'Nulo';
                            }
                        }
                    })
                    resolve(data);
                } catch (e) {
                    reject({ error: e, msg: 'Error al obtener los datos de la fuente externa.' });
                    console.error(e);
                }
            }
            var send = (window.location.href.toLowerCase().includes('/lists/mvddatasources')) ?
               'op=getsplistitemsbylistguid&id=' + source.typeSettings.dataSourceConnectionId + '&listGuid=' + encodeURIComponent(source.typeSettings.listGuid) + '&caml=' + caml + '&fields=' + encodeURIComponent(fields) :
               'op=getsplistitemsbymvddatasourceid&id=' + source.id + '&caml=' + caml;
            req.send(send);
        }
        else if (source.typeSettings.type === 'DataBase Connection') {
            req.onload = function (e) {
                var data = [];
                try {
                    data = JSON.parse(req.response);
                    data.forEach(function (e, i) {
                        for (var keyField in e) {
                            if (!e[keyField]) {
                                e[keyField] = 'Nulo';
                            }
                        }
                    })
                    resolve(data);
                } catch (e) {
                    reject({ error: e, msg: 'Error al obtener los datos de la fuente externa.' });
                    console.error(e);
                }
            }
            var parameters = [];
            source.parameters.forEach(function (e) {
                var valor = (typeof e.value === 'undefined' || e.value === null) ? null : e.value;
                parameters.push({ name: e.referenceInQuery, value: valor });
            });
            var send = (window.location.href.toLowerCase().includes('/lists/mvddatasources')) ? 'op=getdbdata&id=' + source.typeSettings.dataSourceConnectionId + '&commandtype=' + encodeURIComponent(source.typeSettings.commandType) + '&commandtext=' + encodeURIComponent(source.typeSettings.commandText) + '&fields=' + encodeURIComponent(fields) + '&parameters=' + encodeURIComponent(JSON.stringify(parameters)) :
                'op=getdbdatabymvddatasourceid&id=' + source.id + '&parameters=' + encodeURIComponent(JSON.stringify(parameters));
            req.send(send);
        }
        else {
            req.onload = function (e) {
                var data = [];
                try {
                    if (document.getElementById('error')) {
                        document.getElementById('error').innerText = '';
                    }
                    data = JSON.parse(req.response);
                    data.forEach(function (e, i) {
                        for (var keyField in e) {
                            if (!e[keyField]) {
                                e[keyField] = 'Nulo';
                            }
                        }
                    })
                    resolve(data);
                } catch (e) {
                    if (document.getElementById('error')) {
                        document.getElementById('error').style.display = 'block';
                        document.getElementById('error').innerText = req.response;
                    }
                    reject({ error: e, msg: 'Error al obtener los datos de la fuente externa.' });
                    console.error(e);
                }
            }
            var fields = '';
            if (source.typeSettings.fields) {
                for (var i = 0; i < source.typeSettings.fields.length; i++) {
                    if (i === source.typeSettings.fields.length - 1) {
                        fields += source.typeSettings.fields[i];
                    } else {
                        fields += source.typeSettings.fields[i] + ',';
                    }
                }
            }
            var parameters = {}
            if (source.typeSettings.headers.length > 0) {
                parameters.headers = {};
                source.typeSettings.headers.forEach(e => parameters.headers[e.name] = e.value);
            }
            if (source.typeSettings.queryStringParams.length > 0 && !force) {
                parameters.queryStringParams = {};
                source.typeSettings.queryStringParams.forEach(function (e) {
                    var value = e.value;
                    var referenceInQuery = e.value.match(/{.*?}/g);
                    if (referenceInQuery.length === 1) {
                        var keyReferenceInQuery = referenceInQuery[0].substring(1, referenceInQuery[0].length - 1);
                        var auxParameter = source.parameters.find(p => p.referenceInQuery === keyReferenceInQuery);
                        if (typeof auxParameter.value !== 'undefined') {
                            value = value.replace(referenceInQuery[0], auxParameter.value);
                        }
                    }
                    parameters.queryStringParams[e.name] = value;
                });
            }
            if (source.typeSettings.postParams.length > 0 && !force) {
                parameters.postParams = {};
                source.typeSettings.postParams.forEach(function (e) {
                    var value = e.value;
                    var referenceInQuery = e.value.match(/{.*?}/g);
                    if (referenceInQuery.length === 1) {
                        var keyReferenceInQuery = referenceInQuery[0].substring(1, referenceInQuery[0].length - 1);
                        var auxParameter = source.parameters.find(p => p.referenceInQuery === keyReferenceInQuery);
                        if (typeof auxParameter.value !== 'undefined') {
                            value = value.replace(referenceInQuery[0], auxParameter.value);
                        }
                    }
                    parameters.postParams[e.name] = value;
                });
            }
            var send = (window.location.href.toLowerCase().includes('/lists/mvddatasources')) ?
                'op=getsvcdata&id=' + source.typeSettings.dataSourceConnectionId + '&method=' + encodeURIComponent(source.typeSettings.method) + '&jsonPath=' + encodeURIComponent(source.typeSettings.jsonPath) + '&fields=' + encodeURIComponent(fields) + '&returnRawResponse=' + encodeURIComponent(source.typeSettings.returnRawResponse) + '&parameters=' + encodeURIComponent(JSON.stringify(parameters)) :
                'op=getsvcdatabymvddatasourceid&id=' + source.id + '&parameters=' + encodeURIComponent(JSON.stringify(parameters));
            req.send(send);
        }
    });
};

MVD.DataSources.External.getDetailData = function (source, row, columnName, data) {
    var retData = [];
    if (!row && !columnName) {
        retData = data;
    } else {
        retData.push(row);
    }
    return retData;
};

MVD.DataSources.External.getSPLists = function (connectionId) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('POST', '/_layouts/15/MVD.ServerDatasources/ServerDatasource.ashx', true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        req.onload = function (e) {
            if (req.status != 200) { //TODO chequear si no podria dar otro codigo
                reject({ error: req, msg: 'Error al obtener las listas externas.' });
            }
            var externalLists = [];
            try {
                externalLists = JSON.parse(req.response);
                resolve(externalLists);
            } catch (e) {
                console.error(req.response);
                console.error(e);
                reject({ error: e, msg: 'Error al obtener las listas externas.' });
            }
        }
        req.onerror = function (e) {
            reject({ error: e, msg: 'Error al obtener las listas externas.' });
        }
        req.send('op=getsplists&id=' + connectionId);
    });
};

MVD.DataSources.External.getFields = function (source, force) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('POST', '/_layouts/15/MVD.ServerDatasources/ServerDatasource.ashx', true);
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        req.ontimeout = function (e) {
            reject({ error: e, msg: 'La consulta tarda demasiado en responder; sugerimos que agregue parámetros y/o seleccione la menor cantidad de campos posibles.' });
        };
        req.onerror = function (e) {
            reject({ error: e, msg: 'Error al obtener los campos de la lista externa.' });
        }
        if (source.typeSettings.type === 'External Sharepoint') {
            req.onload = function (e) {
                if (req.status != 200) { //TODO chequear si no podria dar otro codigo
                    reject({ error: req, msg: 'Error al obtener los campos de la lista externa.' });
                }
                try {
                    resolve({ fields: JSON.parse(req.response), dynamicFields: [] });
                } catch (e) {
                    console.error(req.response);
                    console.error(e);
                    reject({ error: e, msg: 'Error al obtener los campos de la lista externa.' });
                }
            }
            req.send('op=getsplistfields&id=' + source.typeSettings.dataSourceConnectionId + '&listguid=' + encodeURIComponent(source.typeSettings.listGuid));
        } else if (source.typeSettings.type === 'DataBase Connection') {
            req.onload = function (e) {
                var externalFields = [];
                try {
                    var aux = JSON.parse(req.response);
                    aux.forEach(function (e) {
                        var type = '';
                        if (['datetime'].includes(e.DataTypeName)) {
                            type = 'DateTime';
                        } else if (['int', 'bigint', 'bit'].includes(e.DataTypeName)) {
                            type = 'Number';
                        } else {
                            type = 'Text';
                        }
                        externalFields.push({
                            name: e.ColumnName,
                            internalName: e.ColumnName,
                            type: type,
                        });
                    });
                    resolve({ fields: externalFields, dynamicFields: [] });
                } catch (e) {
                    console.error(req.response);
                    console.error(e);
                    reject({ error: e, msg: 'Error al obtener los campos de la lista externa.' });
                }
            };
            var parameters = [];
            source.parameters.forEach(function (e) {
                var valor = (typeof e.value === 'undefined' || e.value === null) ? null : e.value;
                parameters.push({ name: e.referenceInQuery, value: valor });
            });
            var fields = '';
            if (source.typeSettings.fields) {
                for (var i = 0; i < source.typeSettings.fields.length; i++) {
                    if (i === source.typeSettings.fields.length - 1) {
                        fields += source.typeSettings.fields[i];
                    } else {
                        fields += source.typeSettings.fields[i] + ';';
                    }
                }
            }
            var send = 'op=getdbdataschema&id=' + source.typeSettings.dataSourceConnectionId + '&commandtype=' + encodeURIComponent(source.typeSettings.commandType) + '&commandtext=' + encodeURIComponent(source.typeSettings.commandText) + '&parameters=' + encodeURIComponent(JSON.stringify(parameters));
            req.send(send);
        } else {
            MVD.DataSources.External.getData(source, null, force)
              .then(function (data) {
                  var fields = MVD.DataSources.getFieldsOfData(data);
                  var dynamicFields = [];
                  resolve({ fields: fields, dynamicFields: dynamicFields });
              })
              .catch(function (args) { reject(args) });
        };
    });

    
};

MVD.DataSources.External.getParametersFromQuery = function (fields, query) {
    return new Promise(function (resolve, reject) {
        var parameters = validateQueryAndGetParameters(query);
        if (parameters.length > 0) {
            var parametersNotExistinList = [];
            for (var i = 0; i < parameters.length; i++) {
                var parameterName = parameters[i].field;
                var isParameterInList = false;
                for (var j = 0; j < fields.length; j++) {
                    if (fields[j].internalName === parameterName) {
                        isParameterInList = true;
                        var schemaXml = MVD.SPHelpers.Common.convertXmlToObject($.parseXML(fields[j].schemaXml));
                        parameters[i].type = schemaXml.Type;
                        parameters[i].type = 'Text';
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