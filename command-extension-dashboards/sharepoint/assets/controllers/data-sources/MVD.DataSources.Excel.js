var MVD = MVD || {};
MVD.DataSources = MVD.DataSources || {};
MVD.DataSources.Excel = MVD.DataSources.Excel || {};


MVD.DataSources.Excel.getData = function (source) {
    return new Promise(function (resolve, reject) {
        var url = source.typeSettings.url;
        var sheet = source.typeSettings.sheet;
        var sourceId = source.id;
        if (sourceId > 0 && window.location.href.toLowerCase().includes('lists/mvddatasources') === false) {
            var decodeURL = decodeURI(url);
            var lists = [
                { listUrl: url.substring(0, url.lastIndexOf('/')), queryText: '<View><Query><Where><Eq><FieldRef Name="FileRef" /><Value Type="Text">' + decodeURL + '</Value></Eq></Where></View></Query>', includes: '' },
                { listUrl: '/MVDDataSourcesCache', queryText: '<View><Query><Where><Eq><FieldRef Name="FileRef" /><Value Type="Text">/MVDDataSourcesCache/' + sourceId + '.txt</Value></Eq></Where></View></Query>', includes: '' }
            ];
            MVD.SPHelpers.ListItems.getListItemsMultiple(new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl), lists)
                .then(function (args) {
                    var ret = [];
                    var modifiedDateExcel, modifiedDateCache;
                    if (args[0].items.get_count() > 0) {
                        var enumerator = args[0].items.getEnumerator();
                        enumerator.moveNext();
                        modifiedDateExcel = enumerator.get_current().get_item('Modified');
                    } //si no hay planilla hay que lanzar error
                    if (args[1].items.get_count() > 0) {
                        var enumerator = args[1].items.getEnumerator();
                        enumerator.moveNext();
                        modifiedDateCache = enumerator.get_current().get_item('Modified');
                    }
                    if (modifiedDateExcel < modifiedDateCache) {
                        var getUrl = '/MVDDataSourcesCache/' + sourceId + '.txt';
                        getXMLHttpRequest(getUrl)
                            .then(function (request) {
                                var new_zip = new JSZip();
                                new_zip.load(request.responseText, { base64: true });
                                resolve(JSON.parse(new_zip.file(sourceId + '.txt').asText()));
                            })
                            .catch(function (args) { reject(args); });
                    }
                    else {
                        getXMLHttpRequest(url, 'arraybuffer')
                            .then(function (request) {
                                var workbookData = new Uint8Array(request.response);
                                var workbook = XLSX.read(workbookData, { type: 'array', cellDates: true });
                                var spreadSheet = {};

                                let sheetNamesToProcess = workbook.Workbook.Sheets.filter(e => !e.Hidden).map(e => e.name);
                                if (source.typeSettings.indicatorType) {
                                    let historyIndex = sheetNamesToProcess.findIndex(e => ['Históricos', 'History'].includes(e));
                                    sheetNamesToProcess = sheetNamesToProcess.slice(0, historyIndex + 1);
                                }
                                sheetNamesToProcess.forEach(function (e) {
                                    if (Object.keys(workbook.Sheets[e]).length > 1) {
                                        spreadSheet[e] = MVD.DataSources.Excel.translateWorkbookData(workbook, e, source.typeSettings.indicatorType);
                                    }
                                });
                                var data = (sheet) ? spreadSheet[sheet] : spreadSheet;
                                if (source.typeSettings.indicatorType) data = spreadSheet;
                                //uploadFile(data, sourceId);
                                resolve(data);
                            })
                            .catch(function (args) { reject(args); });
                    }
                },
                    function (args) {
                        throw (args);
                    });
        }
        else {
            getXMLHttpRequest(url, 'arraybuffer')
                .then(function (request) {
                    var workbookData = new Uint8Array(request.response);
                    var workbook = XLSX.read(workbookData, { type: 'array', cellDates: true });
                    var spreadSheet = {};
                    let sheetNamesToProcess = workbook.Workbook.Sheets.filter(e => !e.Hidden).map(e => e.name);
                    if (source.typeSettings.indicatorType) {
                        let historyIndex = sheetNamesToProcess.findIndex(e => ['Históricos', 'History'].includes(e));
                        sheetNamesToProcess = sheetNamesToProcess.slice(0, historyIndex + 1);
                    }
                    sheetNamesToProcess.forEach(function (e) {
                        if (Object.keys(workbook.Sheets[e]).length > 1) {
                            spreadSheet[e] = MVD.DataSources.Excel.translateWorkbookData(workbook, e, source.typeSettings.indicatorType);
                        }
                    });
                    (sheet) ? resolve(spreadSheet[sheet]) : resolve(spreadSheet);
                    //resolve(spreadSheet);
                })
                .catch(function (args) { reject(args); });
        }
    });

    function getXMLHttpRequest(url, responseType) {
        return new Promise(function (resolve, reject) {
            url = url.replace(_spPageContextInfo.siteAbsoluteUrl, '');
            if (!url.startsWith('/')) {
                url = '/' + url;
            }
            var req = new XMLHttpRequest();
            req.open('GET', url, true);
            if (responseType) {
                req.responseType = responseType;
            }

            req.onload = function (e) {
                if (req.status != 200) {
                    reject({ error: req, msg: 'Error en GET XMLHttpRequest ' + url });
                } else {
                    resolve(req);
                }
            }
            req.onerror = function (e) {
                reject({ error: e, msg: 'Error en GET XMLHttpRequest ' + url });
            }
            req.send();
        });
    };
    function uploadFile(data, sourceId) {
        var zip = new JSZip();
        zip.file(sourceId + '.txt', JSON.stringify(data));
        var zipGenerated = zip.generate({
            type: 'base64',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 9
            }
        });

        var digest = document.getElementById('__REQUESTDIGEST').value;
        var url = sourceId + '.txt';
        var urlPost = _spPageContextInfo.webAbsoluteUrl + `//_api/web/GetFolderByServerRelativeUrl('/MVDDataSourcesCache')/Files/add(url='${url}',overwrite=true)`;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', urlPost, true);
        xhr.setRequestHeader('accept', 'application/json;odata=verbose');
        xhr.setRequestHeader('X-RequestDigest', digest);
        xhr.onload = function (e) { }
        xhr.onerror = function (e) {
            console.warn(e);
        }
        xhr.send(zipGenerated);
    }
};

MVD.DataSources.Excel.getDetailData = function (source, row, columnName, data) {
    var retData = [];
    if (!row && !columnName) {
        retData = data;
    } else {
        retData.push(row);
    }
    return retData;
};

MVD.DataSources.Excel.getFields = function (source) {
    return new Promise(function (resolve, reject) {
        if (source.typeSettings.indicatorType) {
            var fields = [];
            fields.push({ internalName: 'Date', name: 'Fecha', type: 'NotNumber' });
            fields.push({ internalName: 'Value', name: 'Valor', type: 'Number' });
            fields.push({ internalName: 'YearAccumulatedValue', name: 'YTD', type: 'Number' });
            fields.push({ internalName: 'AccumulatedValue', name: 'Valor acumulado', type: 'Number' });
            fields.push({ internalName: 'PredictedValue', name: 'Valor meta', type: 'Number' });
            fields.push({ internalName: 'History', name: 'Valor histórico', type: 'Number' });
            resolve({ fields: fields, dynamicFields: [] });
        }
        else {
            MVD.DataSources.Excel.getData(source)
                .then(function (data) {
                    var allFields = {};
                    var fields = null;
                    var dynamicFields = [];
                    if (Array.isArray(data)) {
                        fields = MVD.DataSources.Excel.getSheetFields(data);
                    } else {
                        for (var keySheet in data) {
                            allFields[keySheet] = MVD.DataSources.Excel.getSheetFields(data[keySheet]);
                            if (fields === null) {
                                fields = allFields[keySheet];
                            }
                        }
                    }
                    resolve({ fields: fields, dynamicFields: dynamicFields, allFields: allFields });
                })
                .catch(function (args) { reject(args); });
        }
    });
};

MVD.DataSources.Excel.getSheetFields = function (data) {
    var fields = [];
    for (var i = 0; i < data.length; i++) {
        var keyFields = Object.keys(data[i]);
        for (var j = 0; j < keyFields.length; j++) {
            if (data[i][keyFields[j]] !== null && typeof data[i][keyFields[j]] !== 'undefined') {
                var auxField = fields.find(function (element) {
                    return element.internalName === keyFields[j];
                });
                if (typeof auxField === 'undefined') {
                    if (typeof data[i][keyFields[j]] === 'string') {
                        fields.push({ internalName: keyFields[j], name: keyFields[j], type: 'Text', allowedUseInUI: true });
                    } else if (typeof data[i][keyFields[j]] === 'number') {
                        fields.push({ internalName: keyFields[j], name: keyFields[j], type: 'Number', allowedUseInUI: true });
                    } else if (typeof data[i][keyFields[j]] === 'object') {
                        fields.push({ internalName: keyFields[j], name: keyFields[j], type: 'DateTime', allowedUseInUI: true })
                    }
                }
            }
        }
    }
    fields = fields.sort(function (a, b) { return a.name.localeCompare(b.name); });
    return fields;
};

MVD.DataSources.Excel.getWorkbookStructure = function (workbook, sheetName) {
    var structure = new Object;
    structure.Columns = [];

    var sheet = workbook.Sheets[sheetName];
    //TODO ver si no hay que usar .filter(function(e) { return e.match(/^[A-Z]*1$/); });
    var sheetColumns = [];
    for (var key in sheet) {
        if (key.endsWith('1')) {
            var aux = key.substring(0, key.length - 1);
            sheetColumns.push(aux);
        } else if (key.endsWith('2')) {
            break;
        }
    }

    var currentSheetColumnIndex = 0;

    while (true) {
        var sheetColumnName = sheetColumns[currentSheetColumnIndex];
        var sheetColumn = sheet[sheetColumnName + "1"];

        if (typeof (sheetColumn) == 'undefined') break;

        var column = {};
        column.Name = sheetColumn.v + "";
        column.SheetName = sheetColumnName;

        structure.Columns.push(column);

        currentSheetColumnIndex++;
    }

    return structure;
};

MVD.DataSources.Excel.translateWorkbookData = function (workbook, sheetName, indicatorType) {
    var data = [];
    var workbookStructure = MVD.DataSources.Excel.getWorkbookStructure(workbook, sheetName);
    var sheet = workbook.Sheets[sheetName];
    var sheetKeys = Object.keys(sheet);
    let marginsIndex = (sheetKeys.indexOf('!margins') > 0) ? sheetKeys.indexOf('!margins') : Number.MAX_SAFE_INTEGER;
    sheetKeys = sheetKeys.filter(e => e.match(/^[A-Z]/) && sheetKeys.indexOf(e) < marginsIndex);
    var rowsLength = sheetKeys[sheetKeys.length - 1].match(/\d+/g).map(n => parseInt(n))[0];
    for (var i = 2; i <= rowsLength; i++) {//La fila 1 tiene los nombres de las columnas
        var row = {};
        var currentProperty = null;
        for (var j = 0; j < workbookStructure.Columns.length; j++) {
            try {
                currentProperty = workbookStructure.Columns[j].SheetName + i;
                var rowValue = (typeof sheet[currentProperty] !== 'undefined') ? sheet[currentProperty].v : null;
                if (rowValue !== null && sheet[currentProperty].t === 's') {
                    rowValue = rowValue.trim();
                }
                if (indicatorType && moment(workbookStructure.Columns[j].Name).isValid() && !Number.isFinite(rowValue)) {
                    rowValue = null;
                }
                row[workbookStructure.Columns[j].Name] = rowValue;
            } catch (e) {
                console.error(e);
            }
        }
        data.push(row);
        if (indicatorType) {
            let objectiveOrToleranceIndex = 7;
            let firstMeasureIndex = 8;
            try {
                row.MeasureFormat = getMeasureFormat(firstMeasureIndex, i);
                row.ToleranceFormat = getMeasureFormat(objectiveOrToleranceIndex, i);
            } catch (e) {
                console.error(e);
            }
        }
    }

    return data;

    function getMeasureFormat(measureIndex, rowIndex) {
        var measureFormat = '1.23';
        var currentProperty = workbookStructure.Columns[measureIndex].SheetName + rowIndex;
        var rowValue = (typeof sheet[currentProperty] !== 'undefined') ? sheet[currentProperty].v : null;
        if (rowValue === null) {
            return measureFormat;
        }
        var rowStringValue = sheet[currentProperty].w;
        var type = '';
        if (rowStringValue.indexOf('%') > -1) {
            rowStringValue = rowStringValue.replace('%', '').trim();
            type = '%';
        }
        else if (rowStringValue.indexOf('$') > -1) {
            rowStringValue = rowStringValue.replace('$', '').trim();
            type = '$';
        }
        var decimals = 0;
        var auxDecimals = rowStringValue.split('.');
        if (auxDecimals.length > 1) {
            auxDecimals = auxDecimals[auxDecimals.length - 1];
            decimals = (auxDecimals.length > 2 && type === '%') ? 2 : auxDecimals.length;
        }
        if (decimals === 0) {
            if (type === '%') {
                measureFormat = '0%';
            } else if (type === '$') {
                measureFormat = '$1,234';
            } else {
                measureFormat = '1';
            }
        }
        else if (decimals === 1) {
            if (type === '%') {
                measureFormat = '0.1%';
            } else if (type === '$') {
                measureFormat = '$1,234.5';
            } else {
                measureFormat = '1.2';
            }
        }
        else {
            if (type === '%') {
                measureFormat = '0.12%';
            } else if (type === '$') {
                measureFormat = '$1,234.56';
            } else {
                measureFormat = '1.23';
            }
        }
        return measureFormat;
    }
};