var MVD = MVD || {};
MVD.DataSources = MVD.DataSources || {};
MVD.DataSources.UI = MVD.DataSources.UI || {};

document.addEventListener('DOMContentLoaded', function () {
    _ribbonStartInit('Ribbon.Browse', true);
    if (location.href.toLowerCase().includes('/lists/mvddatasources') && !location.href.toLowerCase().includes('pageview=shared')) {
        MVD.DataSources.UI.operatorsTypes = [
            { value: 'Eq', text: 'Igual', type: 'Text;Note;Number;Boolean;DateTime;User;UserMulti;Lookup;LookupMulti;Choice;MultiChoice;ListDatasource;DistinctList;Calculated' },
            { value: 'Neq', text: 'No igual', type: 'Text;Note;Number;DateTime;User;UserMulti;Lookup;LookupMulti;Choice;MultiChoice;Calculated' },
            { value: 'BeginsWith', text: 'Empieza con', type: 'Text;Note' },
            { value: 'Contains', text: 'Contiene', type: 'Text;Note' },
            { value: 'Range', text: 'Rango', type: 'Number;DateTime' },
            { value: 'Lt', text: 'Menor', type: 'Number;DateTime' },
            { value: 'Gt', text: 'Mayor', type: 'Number;DateTime' },
            { value: 'Gt', text: 'Mayor', type: 'Number;DateTime' },
            { value: 'Leq', text: 'Menor igual', type: 'Number;DateTime' },
            { value: 'Geq', text: 'Mayor igual', type: 'Number;DateTime' }
        ];
        MVD.DataSources.UI.parametersTypes = [
            { text: 'Texto', value: 'Text', type: 'Sharepoint;Excel;Javascript;External' },
            //{ text: 'Lista de fuente de datos', value: 'ListDatasource', type: 'Sharepoint;Excel;Javascript;External' },
            { text: 'Número', value: 'Number', type: 'Sharepoint;Excel;Javascript;External' },
            { text: 'Fecha', value: 'DateTime', type: 'Sharepoint;Excel;Javascript;External' },
            { text: 'Lista automática', value: 'DistinctList', type: 'Sharepoint;Excel;Javascript;External' },
            { text: 'Varias líneas de texto', value: 'Note', type: 'Sharepoint' },
            { text: 'Elección sharepoint', value: 'Choice', type: 'Sharepoint' },
            { text: 'Elección múltiple sharepoint', value: 'MultiChoice', type: 'Sharepoint' },
            { text: 'Búsqueda sharepoint', value: 'Lookup', type: 'Sharepoint' },
            { text: 'Búsqueda múltiple sharepoint', value: 'LookupMulti', type: 'Sharepoint' },
            { text: 'Persona sharepoint', value: 'User', type: 'Sharepoint' },
            { text: 'Persona múltiple sharepoint', value: 'UserMulti', type: 'Sharepoint' },
            { text: 'Booleano', value: 'Boolean', type: 'Sharepoint' },
            { text: 'Calculado', value: 'Calculated', type: 'Sharepoint' }
        ];

        MVD.DataSources.newRowNumber = 1;
        if (window.location.href.toLowerCase().includes('dispform') === false) {
            MVD.SPHelpers.Common.insertCSS(' #contentBox {max-width: ' + (document.getElementById('contentBox').clientWidth - 40) + 'px !important;}');
            MVD.SPHelpers.Common.pageLoader(true);
            var scriptsToLoad = [
                {
                    tag: 'link',
                    url: '/SiteAssets/MVD.Syncfusion/18.1/ej2/material.css',
                    level: 1
                }, {
                    tag: 'link',
                    url: '/SiteAssets/MVD.DataSources/MVD.DataSources.css',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.SPHelpersJs/Js/MVD.SPHelpers.ListItems.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.SPHelpersJs/Js/MVD.SPHelpers.Fields.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.Syncfusion/external/js/xlsx.full.min.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.Syncfusion/18.1/ej2/ej2.min.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.Syncfusion/external/js/linq.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.Syncfusion/external/js/moment.min.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.Syncfusion/external/js/jszip.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.DataSources/MVD.DataSources.Sharepoint.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.DataSources/MVD.DataSources.External.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.DataSources/MVD.DataSources.Pivot.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.DataSources/MVD.DataSources.Excel.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.DataSources/MVD.DataSources.Javascript.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.DataSources/MVD.DataSources.Indicator.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.DataSources/MVD.DataSources.Complex.js',
                    level: 1
                }, {
                    tag: 'script',
                    url: '/SiteAssets/MVD.Syncfusion/18.1/ej2/MVD.SyncfusionUtilities.js',
                    level: 1
                }
            ];
            Promise.all([
                MVD.SPHelpers.Common.loadScripts(scriptsToLoad),
                import((_spPageContextInfo.webServerRelativeUrl === '/' ? '' : _spPageContextInfo.webServerRelativeUrl) + '/SiteAssets/MVD.SPHelpers/Fields.js'),
                import((_spPageContextInfo.webServerRelativeUrl === '/' ? '' : _spPageContextInfo.webServerRelativeUrl) + '/SiteAssets/MVD.SPHelpers/ListItems.js'),
            ]).then(function (args) {
                MVD.SPHelpers.Fields = args[1];
                MVD.SPHelpers.ListItems = args[2];
                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
                    MVD.SyncfusionUtilities.setCulture('es');
                    MVD.SPHelpers.ListItems.getAllLists(_spPageContextInfo.siteServerRelativeUrl)
                        .then(function (args) {
                            MVD.DataSources.inEditMode = (window.location.href.toLowerCase().indexOf('/editform.aspx') > -1) ? true : false;
                            MVD.DataSources.inNewMode = (window.location.href.toLowerCase().indexOf('/newform.aspx') > -1) ? true : false;
                            Promise.all([MVD.DataSources.UI.initializePage(), MVD.DataSources.initDataSourcesCache(), MVD.DataSources.initExternalCache()])
                                .then(function () {
                                    MVD.DataSources.bindingFunctions();
                                    Promise.all([
                                        MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.siteServerRelativeUrl, '/lists/Configuracion'),
                                        MVD.DataSources.UI.initComplexJavascriptAndPivotDataSourceConfig(),
                                        MVD.DataSources.UI.initSharepointDataSourceSettings(),
                                        MVD.DataSources.UI.initSpreadsheetDataSourceConfig(),
                                        MVD.DataSources.UI.initExternalDataSourceConfig(),
                                    ]).then(function (args) {
                                        if (document.getElementById('commnetsWrapper') && document.querySelector('textarea[id^="Comments_"]')) {
                                            document.getElementById('commnetsWrapper').appendChild(document.querySelector('textarea[id^="Comments_"]').closest('tr'));
                                        }

                                        try {
                                            let enumerator = args[0].getEnumerator()
                                            enumerator.moveNext();
                                            MVD.DataSources.UI.dataSourcesGroupingFieldinternalName = enumerator.get_current().get_item('DataSourcesGroupingField');
                                            let dataSourcesGroupingFieldInfo = MVD.SPHelpers.Fields.getFieldInfoByInternalName(MVD.DataSources.UI.dataSourcesGroupingFieldinternalName);
                                            let options = Array.from(dataSourcesGroupingFieldInfo.td.querySelector('select').children);
                                            let dataSourcesGroupingFieldOptions = options.map(function (e) {
                                                return {
                                                    text: e.innerText,
                                                    value: parseInt(e.value)
                                                }
                                            });
                                            let dataSourcesGroupingFieldOptionsObj = new ej.dropdowns.DropDownList({
                                                placeholder: dataSourcesGroupingFieldInfo.displayName,
                                                floatLabelType: 'Auto',
                                                fields: { text: 'text', value: 'value' },
                                                dataSource: dataSourcesGroupingFieldOptions,
                                            });
                                            dataSourcesGroupingFieldOptionsObj.appendTo('#dataSourcesGroupingField');
                                        } catch (error) {
                                            if (document.getElementById('dataSourcesGroupingField')) document.getElementById('dataSourcesGroupingField').style.display = 'none';
                                        }


                                        if (MVD.DataSources.inEditMode) {
                                            ej.base.getComponent(document.getElementById('sourceTitle'), 'textbox').value = MVD.SPHelpers.Fields.getFieldValueByInternalName('Title');
                                            ej.base.getComponent(document.getElementById('internalUse'), 'checkbox').checked = MVD.SPHelpers.Fields.getFieldValueByInternalName('InternalUse');
                                            const source = JSON.parse(MVD.SPHelpers.Fields.getFieldValueByInternalName('JSON'));
                                            source.type = MVD.SPHelpers.Fields.getFieldValueByInternalName('Type');
                                            MVD.DataSources.UI.setSourceSettings(source);
                                        }
                                        setTimeout(function () {
                                            document.getElementById('contentBox').style.visibility = 'visible';
                                            MVD.SPHelpers.Common.pageLoader(false);
                                        }, 700);
                                    });
                                })
                                .catch(function (args) {
                                    MVD.SyncfusionUtilities.showToast(args.msg);
                                    console.error(args);
                                    document.getElementById('contentBox').style.visibility = 'visible';
                                    MVD.SPHelpers.Common.pageLoader(false);
                                })
                            MVD.DataSources.preSaveAction();
                        });
                });
            })
                .catch(function (args) {
                    console.error(args);
                    document.getElementById('contentBox').style.visibility = 'visible';
                    MVD.SPHelpers.Common.pageLoader(false);
                });
        }
        else {
            document.querySelector('a[name="SPBookmark_JSON"]').closest('tr').style.display = 'none';
            document.getElementById('contentBox').style.visibility = 'visible';
        }
    }
    if (location.href.toLowerCase().includes('pageview=shared')) {
        document.getElementById('contentBox').style.visibility = 'visible';
    }

    if (location.href.toLowerCase().includes('/lists/indicatorsplans') && (location.href.toLowerCase().includes('newform.aspx') || location.href.toLowerCase().includes('editform.aspx'))) {
        //Cuando se haga el modulo de datasources borrar esto.  Ahora se utiliza dentro de indicatorsplans
        import((_spPageContextInfo.webServerRelativeUrl === '/' ? '' : _spPageContextInfo.webServerRelativeUrl) + '/SiteAssets/MVD.SPHelpers/ListItems.js')
            .then(function (listItemsModule) {
                MVD.SPHelpers = {
                    ListItems: listItemsModule
                };
                MVD.DataSources.initDataSourcesCache();
            });
    }

})

MVD.DataSources.applyParametersToData = function (data, parameters) {
    var retData = {};
    if (Array.isArray(data)) {
        retData = auxApplyFiltersToData(data, parameters);
    } else {
        for (var keyData in data) {
            retData[keyData] = auxApplyFiltersToData(data[keyData], parameters);
        }
    }
    return retData;

    function auxApplyFiltersToData(data, parameters) {
        var el = Enumerable.from(data);
        for (var i = 0; i < parameters.length; i++) {
            el = chainWhere(el, parameters[i]);
        }
        return el.toArray();

        function chainWhere(el, parameter) {
            try {
                if (parameter.visible && typeof parameter.value !== 'undefined' && typeof parameter.dateSubType === 'undefined') {
                    if (parameter.type === 'Text') {
                        if (parameter.value) {
                            parameter.value = parameter.value.toLowerCase();
                        }
                        el = el.where(function (e) {
                            if (e[parameter.field]) {
                                if (parameter.operator === 'Eq') {
                                    return e[parameter.field].toLowerCase() === parameter.value;
                                }
                                else if (parameter.operator === 'Neq') {
                                    return e[parameter.field].toLowerCase() !== parameter.value;
                                }
                                else if (parameter.operator === 'BeginsWith') {
                                    return e[parameter.field].toLowerCase().startsWith(parameter.value);
                                }
                                else if (parameter.operator === 'Contains') {
                                    return (e[parameter.field].toLowerCase().indexOf(parameter.value) > -1);
                                }
                            }
                            else {
                                return ((parameter.value === null && parameter.allowNull) || parameter.operator === 'Neq');
                            }
                        });
                    }
                    else if (parameter.type === 'Number') {
                        el = el.where(function (e) {
                            if (e[parameter.field]) {
                                if (parameter.operator === 'Eq') {
                                    return e[parameter.field] === parameter.value;
                                }
                                else if (parameter.operator === 'Neq') {
                                    return e[parameter.field] !== parameter.value;
                                }
                                else if (parameter.operator === 'Lt') {
                                    return e[parameter.field] < parameter.value;
                                }
                                else if (parameter.operator === 'Gt') {
                                    return e[parameter.field] > parameter.value;
                                }
                                else if (parameter.operator === 'Leq' || parameter.operator === 'ToRange') {
                                    return e[parameter.field] <= parameter.value;
                                }
                                else if (parameter.operator === 'Geq' || parameter.operator === 'Range') {
                                    return e[parameter.field] >= parameter.value;
                                }
                            }
                            else {
                                return ((parameter.value === null && parameter.allowNull) || parameter.operator === 'Neq');
                            }
                        });
                    }
                    else if (parameter.type === 'DateTime') {
                        el = el.where(function (e) {
                            if (e[parameter.field]) {
                                var limitGranularity = null;
                                if (parameter.dateType === 'year') {
                                    limitGranularity = 'year';
                                }
                                else if (parameter.dateType === 'monthAndYear') {
                                    limitGranularity = 'month';
                                }
                                else if (parameter.dateType === 'date') {
                                    limitGranularity = 'day';
                                }
                                if (parameter.operator === 'Eq') {
                                    return moment(e[parameter.field]).isSame(moment(parameter.value), limitGranularity);
                                }
                                else if (parameter.operator === 'Neq') {
                                    return !moment(e[parameter.field]).isSame(moment(parameter.value), limitGranularity);
                                }
                                else if (parameter.operator === 'Lt') {
                                    return moment(e[parameter.field]).isBefore(moment(parameter.value), limitGranularity);
                                }
                                else if (parameter.operator === 'Gt') {
                                    return moment(e[parameter.field]).isAfter(moment(parameter.value), limitGranularity);
                                }
                                else if (parameter.operator === 'Leq' || parameter.operator === 'ToRange') {
                                    return moment(e[parameter.field]).isSameOrBefore(moment(parameter.value), limitGranularity);
                                }
                                else if (parameter.operator === 'Geq' || parameter.operator === 'Range') {
                                    return moment(e[parameter.field]).isSameOrAfter(moment(parameter.value), limitGranularity);
                                }
                            }
                            else {
                                return ((parameter.value === null && parameter.allowNull) || parameter.operator === 'Neq');
                            }
                        });
                    }
                    else if (parameter.type === 'DistinctList' || parameter.type === 'ListDatasource') {
                        el = el.where(function (e) {
                            if (e[parameter.field]) {
                                if (parameter.allowMultiple) {
                                    return (parameter.value.length === 0) ? true : parameter.value.includes(e[parameter.field].toString());
                                } else {
                                    return parameter.value == e[parameter.field];
                                }
                            }
                            else {
                                if (parameter.allowMultiple) {
                                    return (parameter.value.length === 0) ? true : parameter.value.includes('MVDNullValue');
                                } else {
                                    return (parameter.value === 'MVDNullValue');
                                }
                            }
                        });
                    }
                }
            } catch (e) {
                console.error(e);
            }
            return el;
        }
    }
}

MVD.DataSources.bindingFunctions = function () {
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id.indexOf('DeferUpdateButton') !== -1) {
            if (typeof document.querySelector('[id*="DeferUpdateButton"]').ej2_instances !== 'undefined')
                document.querySelector('[id*="DeferUpdateButton"]').ej2_instances[0].element.type = 'button';
        }
        else if (e.target && e.target.classList.contains('deleteComplexCondition')) {
            e.target.closest('div.complexConditionRow').remove();
        }
        else if (e.target && e.target.classList.contains('deleteComplexField')) {
            e.target.closest('div.complexSelectFieldRow').remove();
        }
        else if (e.target && e.target.classList.contains('deleteParameterRow')) {
            var source = MVD.DataSources.UI.getSourceSettings();
            var parameters = MVD.DataSources.UI.getRowParametersSettings(e.target.closest('div.parameterRow').dataset.idparameterrow, source.type);
            if (!parameters || parameters.length === 0) {
                return false;
            }
            for (var i = 0; i < parameters.length; i++) {
                MVD.DataSources.removeParameter(parameters[i]);
            }
            e.target.closest('div.parameterRow').remove();
            if (!source.advancedParameters && (source.type === 'Sharepoint' || source.type === 'External')) {
                var query = MVD.DataSources.Sharepoint.getQueryFromParamters(source.parameters);
                if (source.type === 'Sharepoint') {
                    ej.base.getComponent(document.getElementById('sharepointQuery'), 'textbox').value = query;
                } else {
                    ej.base.getComponent(document.getElementById('externalSharepoinQuery'), 'textbox').value = query;
                }
            }
        }
    });
    document.getElementById('btnGetSourceData').addEventListener('click', function (e) {
        MVD.DataSources.UI.btnGetSourceData();
        e.stopPropagation();
    });
    document.getElementById('btnAddComplexSelectFieldRow').addEventListener('click', function (e) {
        MVD.DataSources.UI.btnAddComplexSelectFieldRow();
    });
    document.getElementById('btnAddComplexConditionRow').addEventListener('click', function (e) {
        MVD.DataSources.UI.btnAddComplexConditionRow();
    });
    document.getElementById('btnAddParameterRowSettings').addEventListener('click', function (e) {
        var sourceType = ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value;
        var excelIndicatorType = ej.base.getComponent(document.getElementById('excelIndicatorType'), 'checkbox').checked;
        if (sourceType === 'Pivot' || sourceType === 'Complex') {
            MVD.SyncfusionUtilities.showToast('Este tipo de fuente de datos solamente no permite la creación de parámetros. \n Si heredan los parámetros de la/s fuente/s que la componen.', null, 10000);
        } else if (excelIndicatorType) {
            MVD.SyncfusionUtilities.showToast('Este tipo de fuente de datos no permite la creación de parámetros.', null, 10000);
        } else {
            MVD.DataSources.UI.btnAddParameterRowSettings();
        }
    });
}

MVD.DataSources.getAllSourceParameters = function (source, includeEntryValueFixed) {
    if (!source) return [];
    var parameters = JSON.parse(JSON.stringify(source.parameters)).filter(e => e.entryValue !== 'fixed');
    if (includeEntryValueFixed) parameters = JSON.parse(JSON.stringify(source.parameters));
    if (source.type === 'Pivot' && typeof source.subType === 'undefined') {
        var auxSource = MVD.DataSources.cacheDataSources.find(e => e.id == source.typeSettings.sourceId);
        parameters = parameters.concat(MVD.DataSources.getAllSourceParameters(auxSource));
    }
    else if (source.type === 'Javascript') {
        for (var i = 0; i < source.typeSettings.sourcesIds.length; i++) {
            var auxSource = MVD.DataSources.cacheDataSources.find(e => e.id == source.typeSettings.sourcesIds[i]);
            parameters = parameters.concat(MVD.DataSources.getAllSourceParameters(auxSource, includeEntryValueFixed));
        }
    }
    else if (source.type === 'Complex') {
        var auxSourceIdOne = MVD.DataSources.cacheDataSources.find(e => e.id == source.typeSettings.sourceOneId);
        var auxSourceIdTwo = MVD.DataSources.cacheDataSources.find(e => e.id == source.typeSettings.sourceTwoId);
        parameters = parameters.concat(MVD.DataSources.getAllSourceParameters(auxSourceIdOne));
        parameters = parameters.concat(MVD.DataSources.getAllSourceParameters(auxSourceIdTwo));
    }
    //En esta primera instancia los parameteros se mergean por el nombre de creación.
    parameters = parameters.reduce(function (accu, e) {
        var isRepeat = accu.find(el => el.createdName === e.createdName);
        if (typeof isRepeat !== 'undefined') {
            if (typeof e.sourcesIds !== 'undefined') {
                e.sourcesIds.forEach(function (r) {
                    if (!isRepeat.sourcesIds.includes(r)) {
                        isRepeat.sourcesIds.push(r);
                        isRepeat.fields[r] = e.fields[r];
                        if (e.required) {
                            isRepeat.required = true;
                        }
                    }
                });
            }
            else if (!isRepeat.sourcesIds.includes(e.sourceId)) {
                isRepeat.sourcesIds.push(e.sourceId);
                isRepeat.fields[e.sourceId] = e.field;
                if (e.required) {
                    isRepeat.required = true;
                }
            }
        }
        else {
            if (typeof e.sourcesIds === 'undefined') {
                e.sourcesIds = [];
            }
            if (!e.sourcesIds.includes(e.sourceId)) {
                e.sourcesIds.push(e.sourceId);
            }
            if (typeof e.fields === 'undefined') {
                e.fields = {};
            }
            e.fields[e.sourceId] = e.field;
            accu.push(e);
        }
        return accu;
    }, []);
    return parameters;
}

MVD.DataSources.getFields = function (source, force) {
    return new Promise(function (resolve, reject) {
        if (source.type === 'Sharepoint') {
            MVD.DataSources.Sharepoint.getFields(source)
                .then(function (args) { resolve(args); })
                .catch(function (args) { reject(args) });
        }
        else if (source.type === 'Excel') {
            MVD.DataSources.Excel.getFields(source)
                .then(function (args) { resolve(args); })
                .catch(function (args) { reject(args); });
        }
        else if (source.type === 'Complex') {
            MVD.DataSources.Complex.getFields(source)
                .then(function (args) { resolve(args); })
                .catch(function (args) { reject(args); });
        }
        else if (source.type === 'Javascript') {
            MVD.DataSources.Javascript.getFields(source)
                .then(function (args) { resolve(args); })
                .catch(function (args) { reject(args); });
        }
        else if (source.type === 'Pivot') {
            var extraSettings = source.typeSettings.extraSettings
            if (!extraSettings) {
                extraSettings = { columnsLevel: 0, rowsLevel: 1 }
            }
            MVD.DataSources.Pivot.getFields(source.typeSettings.dataSourceSettings, extraSettings)
                .then(function (fields) { resolve(fields); })
                .catch(function (args) { reject(args); });
        }
        else if (source.type === 'Indicador') {
            MVD.DataSources.Indicator.getFields(source)
                .then(function (fields) { resolve(fields); })
                .catch(function (args) { reject(args) });
        }
        else if (source.type === 'External') {
            MVD.DataSources.External.getFields(source, force)
                .then(function (args) { resolve(args); })
                .catch(function (args) { reject(args); });
        }
    });
}

MVD.DataSources.getFieldsOfData = function (data) {
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
                        fields.push({ internalName: keyFields[j], name: keyFields[j], type: 'Text' });
                    } else if (typeof data[i][keyFields[j]] === 'number') {
                        fields.push({ internalName: keyFields[j], name: keyFields[j], type: 'Number' });
                    } else if (typeof data[i][keyFields[j]] === 'object') {
                        fields.push({ internalName: keyFields[j], name: keyFields[j], type: 'DateTime' })
                    }
                }
            }
        }
    }
    return fields;
}

MVD.DataSources.getSourceData = function (source, parameters, indicatorPanel) {
    return new Promise(function (resolve, reject) {
        if (!source) {
            reject({ msg: 'Se a eliminado la fuente de datos.' });
            return;
        }
        try {
            for (var i = 0; i < parameters.length; i++) {
                if (typeof parameters[i].parameterIndicatorType !== 'undefined' || typeof parameters[i].dateSubType !== 'undefined') {
                    continue;
                }
                var sourceId = (typeof source.subType !== 'undefined' && source.subType === 'ResumePivot') ? source.typeSettings.sourceId : source.id;
                if (parameters[i].sourcesIds && parameters[i].sourcesIds.includes(sourceId)) {
                    var field = parameters[i].fields[sourceId];
                    var sourceParameter = source.parameters.find(e => e.field === field);
                    if (sourceParameter) {
                        var createdName = '';
                        if (location.href.toLowerCase().includes('/lists/mvddatasources/') && ['Sharepoint', 'External', 'Excel', 'Javascript'].includes(source.type)) {

                        } else {
                            sourceParameter.name = MVD.DataSources.cacheDataSources.find(e => e.id == sourceId).parameters.find(e => e.field === field).createdName;
                        }
                        //['Text', 'ListDatasource', 'Number', 'DateTime', 'DistinctList', 'Note', 'Choice', 'MultiChoice', 'Lookup', 'LookupMulti', 'User', 'UserMulti', 'Boolean', 'Calculated']
                        sourceParameter.value = parameters[i].value;
                        if (['ListDatasource', 'DistinctList', 'Choice', 'MultiChoice', 'Lookup', 'LookupMulti', 'User', 'UserMulti'].includes(sourceParameter.type) && sourceParameter.allowMultiple && parameters[i].value && !Array.isArray(parameters[i].value)) {
                            sourceParameter.value = [sourceParameter.value];
                        }
                        if (parameters[i].auxValue) {
                            sourceParameter.auxValue = parameters[i].auxValue;
                        }

                        if (parameters[i].toRangeValue) sourceParameter.toRangeValue = parameters[i].toRangeValue;


                    }
                }
            }
            if (!location.href.toLowerCase().includes('/lists/mvddatasources/') && ['Sharepoint', 'External', 'Excel', 'Javascript'].includes(source.type)) {
                var fixedParameters = MVD.DataSources.cacheDataSources.find(e => e.id == source.id).parameters.filter(e => e.entryValue === 'fixed');
                if (source.parameters.filter(e => e.entryValue === 'fixed').length === 0) {
                    source.parameters = source.parameters.concat(fixedParameters);
                }
            }
            if (source.type === 'Sharepoint') {
                var camlQuery = MVD.DataSources.Sharepoint.applyParameters(source.parameters);
                MVD.DataSources.Sharepoint.getData(source, camlQuery)
                    .then(function (args) {
                        var sourceParameters = parameters.filter(e => e.sourcesIds.includes(source.id));
                        MVD.DataSources.setParameterDistinctListDataSource(sourceParameters, args);
                        resolve(args);
                    })
                    .catch(function (args) { reject(args); });
            }
            else if (source.type === 'Excel') {
                if (source.typeSettings.indicatorSheet) {
                    var data = [];
                    var cacheIndicator = null;
                    try {
                        var planValue = (source.parameters[0].value) ? source.parameters[0].value : source.parameters[0].defaultValue;
                        if (MVD.DataSources.cacheIndicatorsSheet[source.id].plans[planValue]) {
                            var titleColumn = Object.keys(MVD.DataSources.cacheIndicatorsSheet[source.id].plans[planValue][0].indicator)[2];
                            var originalTitle = '';
                            if (!Array.isArray(source.typeSettings.indicatorSheet)) {
                                source.typeSettings.indicatorSheet = [source.typeSettings.indicatorSheet];
                            }
                            for (var j = 0; j < source.typeSettings.indicatorSheet.length; j++) {
                                var auxData = [];
                                cacheIndicator = MVD.DataSources.cacheIndicatorsSheet[source.id].plans[planValue].find(e => e.indicator[titleColumn] === source.typeSettings.indicatorSheet[j]);
                                if (cacheIndicator) {
                                    auxData = JSON.parse(JSON.stringify(cacheIndicator.data));
                                    originalTitle = cacheIndicator.indicator[titleColumn];
                                    if (auxData[0].FilterKey) {
                                        var filterKey = auxData[0].FilterKey;
                                        var parameter = source.parameters.find(e => e.field === filterKey);
                                        var value = (parameter.value) ? parameter.value : parameter.defaultValue;
                                        auxData = auxData.filter(e => e.FilterValue === value);
                                        originalTitle = cacheIndicator.indicator.DimensioningTitles.find(e => e.includes(value));
                                    }
                                }
                                if (!indicatorPanel) {
                                    var history = MVD.DataSources.cacheIndicatorsSheet[source.id].history.find(e => e[titleColumn] === originalTitle);
                                    if (history) {
                                        var plans = Object.keys(history).filter(e => parseInt(e) < planValue).map(e => parseInt(e)).sort(function (a, b) { return b - a });
                                        var endIndex = (plans.length > 3) ? 3 : plans.length;
                                        for (var k = 0; k < endIndex; k++) {
                                            auxData.unshift({
                                                Date: plans[k],
                                                History: history[plans[k]],
                                            });
                                        }
                                    }
                                }
                                data.push(auxData);
                            }
                        } else {
                            if (!indicatorPanel) data.push([]);
                        }

                        var parametersData = [];
                        source.parameters.forEach(function (e) {
                            for (var i = 0; i < e.values.length; i++) {
                                if (typeof parametersData[i] === 'undefined') {
                                    var row = {};
                                    row[e.field] = e.values[i].value;
                                    parametersData.push(row);
                                } else {
                                    var row = parametersData[i];
                                    row[e.field] = e.values[i].value;
                                }
                            }
                        });
                        var keyData = Object.keys(parametersData[0]);
                        parametersData.forEach(function (e) {
                            for (var i = 0; i < keyData.length; i++) {
                                if (typeof e[keyData[i]] === 'undefined') e[keyData[i]] = parametersData[0][keyData[i]];
                            }
                        });
                        var sourceParameters = parameters.filter(e => e.sourcesIds.includes(source.id));
                        MVD.DataSources.setParameterDistinctListDataSource(sourceParameters, parametersData);
                    } catch (e) {

                    }
                    resolve(indicatorPanel ? data : data[0]);
                }
                else {
                    MVD.DataSources.Excel.getData(source)
                        .then(function (args) {
                            var auxData = args;
                            if (!Array.isArray(args)) {
                                auxData = auxData[Object.keys(auxData)[0]];
                            }
                            if (source.typeSettings.indicatorType) {
                                auxData = Object.keys(args).reduce(function (accu, e) {
                                    if (Number.isInteger(parseInt(e))) {
                                        accu.push({ 'Plan': e });
                                    }
                                    return accu;
                                }, []);
                            }
                            var sourceParameters = parameters.filter(e => e.sourcesIds.includes(source.id));
                            MVD.DataSources.setParameterDistinctListDataSource(sourceParameters, auxData);
                            var filteredData = MVD.DataSources.applyParametersToData(args, source.parameters);
                            resolve((source.typeSettings.indicatorType) ? args : filteredData);
                        })
                        .catch(function (args) { reject(args); });
                }
            }
            else if (source.type === 'Complex') {
                MVD.DataSources.Complex.getData(source, parameters)
                    .then(function (data) {
                        //var auxData = args;
                        //if (!Array.isArray(args)) {
                        //    auxData = auxData[Object.keys(auxData)[0]];
                        //}
                        //MVD.DataSources.setParameterDistinctListDataSource(parameters, auxData);
                        //var filteredData = MVD.DataSources.applyParametersToData(args, parameters);
                        resolve(data);
                    })
                    .catch(function (args) { reject(args); });
            }
            else if (source.type === 'Pivot') {
                var sourceData = JSON.parse(JSON.stringify(MVD.DataSources.cacheDataSources.find(element => element.id === source.typeSettings.sourceId)));
                //if (sourceData.type !== 'Pivot') {
                //    sourceData.typeSettings.extraSettings = source.typeSettings.extraSettings;
                //}
                MVD.DataSources.getSourceData(sourceData, parameters)
                    .then(function (args) {
                        var dataSourceSettings = JSON.parse(JSON.stringify(source.typeSettings.dataSourceSettings));
                        dataSourceSettings.data = args;
                        var data = MVD.DataSources.Pivot.getData({
                            dataSource: dataSourceSettings,
                            columnsLevel: (source.typeSettings.extraSettings) ? source.typeSettings.extraSettings.columnsLevel : 0,
                            rowsLevel: (source.typeSettings.extraSettings) ? source.typeSettings.extraSettings.rowsLevel : 1
                        });
                        if (source.typeSettings.extraSettings.transpose) {
                            MVD.DataSources.getFields(sourceData)
                                .then(function (args) {
                                    var fieldsToIgnore = [];
                                    resolve(MVD.DataSources.transposeData(data, source.typeSettings.extraSettings.transposeField, fieldsToIgnore, args.fields));
                                })
                                .catch(function (args) {
                                    resolve([]);
                                    console.error(args);
                                });

                        }
                        else {
                            resolve(data);
                        }
                    })
                    .catch(function (args) { reject(args); });
            }
            else if (source.type === 'Indicador') {
                MVD.DataSources.Indicator.getData(source, source.typeSettings.planName, parameters, null, indicatorPanel)
                    .then(function (args) { resolve(args) })
                    .catch(function (args) { reject(args) });
            }
            else if (source.type === 'Javascript') {
                MVD.DataSources.Javascript.getData(source, parameters)
                    .then(function (args) { resolve(args); })
                    .catch(function (args) { reject(args); });
            }
            else if (source.type === 'External') {
                var query = MVD.DataSources.Sharepoint.applyParameters(source);
                MVD.DataSources.External.getData(source, query)
                    .then(function (data) {
                        var sourceParameters = parameters.filter(e => e.sourcesIds.includes(source.id));
                        MVD.DataSources.setParameterDistinctListDataSource(sourceParameters, data);
                        resolve(data);
                    })
                    .catch(function (args) { reject(args); });
            }
        } catch (e) {
            reject(e);
            conosle.error(e);
        }
    });
}

MVD.DataSources.getSourceDataDetails = function (source, parameters, row, columnName) {
    return new Promise(function (resolve, reject) {
        if (source.type === 'Sharepoint') {
            MVD.DataSources.getSourceData(source, parameters)
                .then(function (data) {
                    resolve(MVD.DataSources.Sharepoint.getDetailData(source, row, columnName, data));
                })
                .catch(function (args) { reject(args) });
        }
        else if (source.type === 'Excel') {
            MVD.DataSources.getSourceData(source, parameters)
                .then(function (data) {
                    resolve(MVD.DataSources.Excel.getDetailData(source, row, columnName, data));
                })
                .catch(function (args) { reject(args) });
        }
        else if (source.type === 'Complex') {
            MVD.DataSources.getSourceData(source, parameters)
                .then(function (data) {
                    resolve(MVD.DataSources.Complex.getDetailData(source, row, columnName, data));
                })
                .catch(function (args) { reject(args) });
        }
        else if (source.type === 'Pivot') {
            var sourceData = MVD.DataSources.cacheDataSources.find(element => element.id === source.typeSettings.sourceId);
            MVD.DataSources.getSourceData(sourceData, parameters)
                .then(function (args) {
                    var dataSourceSettings = JSON.parse(JSON.stringify(source.typeSettings.dataSourceSettings));
                    dataSourceSettings.data = args;
                    resolve(MVD.DataSources.Pivot.getDetailData({
                        dataSource: dataSourceSettings,
                        columnsLevel: source.typeSettings.extraSettings.columnsLevel,
                        rowsLevel: source.typeSettings.extraSettings.rowsLevel
                    }, columnName, row));
                })
                .catch(function (args) { reject(args); });
        }
        else if (source.type === 'Indicador') {
            MVD.DataSources.getSourceData(source, parameters)
                .then(function (data) {
                    resolve(MVD.DataSources.Indicator.getDetailData(source, row, columnName, parameters));
                })
                .catch(function (args) { reject(args) });
        }
        else if (source.type === 'Javascript') {
            MVD.DataSources.getSourceData(source, parameters)
                .then(function (data) {
                    resolve(MVD.DataSources.Javascript.getDetailData(source, row, columnName, data));
                })
                .catch(function (args) { reject(args) });
        }
        else if (source.type === 'External') {
            MVD.DataSources.getSourceData(source, parameters)
                .then(function (data) {
                    resolve(MVD.DataSources.External.getDetailData(source, row, columnName, data));
                })
                .catch(function (args) { reject(args) });
        }
    });
}

MVD.DataSources.getParameterLookupData = function (parameterId, parameter) {
    var caml = (parameter.extraConfig.caml) ? parameter.extraConfig.caml : '';
    if (parameter.extraConfig.showField === 'LinkTitleNoMenu') parameter.extraConfig.showField = 'Title';
    MVD.SPHelpers.ListItems.getListItemsByGUID(_spPageContextInfo.siteServerRelativeUrl, parameter.extraConfig.listId, caml, 'ID,' + parameter.extraConfig.showField, false)
        .then(function (listsItems) {
            var ret = [];
            var value = null;
            if (listsItems.get_count() > 0) {
                var enumerator = listsItems.getEnumerator();
                while (enumerator.moveNext()) {
                    var listItem = enumerator.get_current();
                    var item = {
                        id: listItem.get_item('ID'),
                        value: listItem.get_item(parameter.extraConfig.showField),
                        text: listItem.get_item(parameter.extraConfig.showField)
                    };
                    //PARCHE espantoso para SAI, aca lo que pasas es que se hace un complejo de cuatro fuentes de datos, que tienen el mismo campo lookup con distintos ShowFields. Cada lista apunta a un calculado diferente... Hay que pensarlo
                    try {
                        if (parameter.extraConfig.listId === '{f8af04a4-fe7a-434e-a53e-33e5a9efde51}') {
                            item = {
                                id: listItem.get_item('ID'),
                                value: listItem.get_item('ylpm'),
                                text: listItem.get_item('ylpm')
                            };
                        }
                    } catch (error) {

                    }
                    //FIN PARCHE
                    if (item.text == parameter.defaultValue) {
                        value = item.value;
                    }
                    ret.push(item);
                }
                if (parameter.allowNull) {
                    ret.push({
                        id: -1,
                        text: 'Vacío',
                        value: 'MVDNullValue'
                    })
                }
                //if (parameter.extraConfig.uniques) {
                //    var aux = [];
                //    var map = new Map();
                //    for (var j = 0; j < ret.length; j++) {
                //        if (!map.has(ret[j].text)) {
                //            map.set(ret[j].text, true);
                //            aux.push(ret[j]);
                //        }
                //    }
                //    ret = aux;
                //}

                if (parameter.allowMultiple || parameter.type === 'LookupMulti') {
                    var oldData = ej.base.getComponent(document.getElementById(parameterId), 'multiselect').dataSource;
                    ej.base.getComponent(document.getElementById(parameterId), 'multiselect').dataSource = getDistict('value', ret, oldData);
                } else {
                    var oldData = ej.base.getComponent(document.getElementById(parameterId), 'dropdownlist').dataSource;
                    ej.base.getComponent(document.getElementById(parameterId), 'dropdownlist').dataSource = getDistict('value', ret, oldData);
                }
            }
        }, function (args) {
            args.msg = '';
            throw ({ msg: 'El parámetro ' + parameter.name + ' presenta errores con la fuente de datos que requería.' });
        });

    function getDistict(field, data, oldData) {
        var aux = [];
        var distinctsRows = Enumerable.from(data).distinct(function (e) { return e[field] }).orderBy(function (e) { return e[field] }).toArray();
        for (var i = 0; i < distinctsRows.length; i++) {
            try {
                if (typeof distinctsRows[i][field] === 'boolean') {

                } else {
                    if (distinctsRows[i][field]) {
                        if (distinctsRows[i][field] instanceof Date) {
                            aux.push({ text: distinctsRows[i].text, value: distinctsRows[i][field].toISOString() });
                        } else {
                            aux.push({ text: distinctsRows[i].text, value: distinctsRows[i][field].toString() });
                        }
                    } else {
                        aux.push({ text: 'Vacío', value: 'MVDNullValue' });
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
        for (var j = 0; j < oldData.length; j++) {
            var isRepeat = aux.find(e => e.value == oldData[j].value);
            if (typeof isRepeat === 'undefined') {
                aux.push(oldData[j]);
            }
        }
        return aux.sort(function (a, b) {
            return (a.text === b.text) ? 0 : (a.text < b.text) ? -1 : 1;
        });
    }
}

MVD.DataSources.getParametersValues = function (parameters, getEntryValue) {
    var arrayMissingParameters = [];
    for (var i = parameters.length - 1; i >= 0; i--) {
        try {
            if (!parameters[i].visible) continue;
            var renderId = MVD.DataSources.getParameterRenderId(parameters[i]);
            if (document.getElementById(renderId) === null) {
                if (parameters[i].required) {
                    arrayMissingParameters.push(parameters[i].name);
                }
                continue;
            }
            switch (parameters[i].type) {
                case 'Calculated':
                case 'Note':
                case 'Text':
                    parameters[i].value = document.getElementById(renderId).ej2_instances[0].value;
                    if (parameters[i].value !== null && typeof parameters[i].value === 'string') {
                        parameters[i].value = parameters[i].value.trim();
                    }
                    if (parameters[i].value === '' || parameters[i].value === null) {
                        if (parameters[i].allowNull) {
                            var isNull = ej.base.getComponent(document.getElementById(renderId + 'AcceptNull'), 'checkbox').checked;
                            if (!isNull) {
                                if (parameters[i].required) {
                                    arrayMissingParameters.push(parameters[i].name);
                                } else {
                                    delete parameters[i].value;
                                }
                            }
                        }
                        else if (parameters[i].required) {
                            arrayMissingParameters.push(parameters[i].name);
                        }
                        else {
                            delete parameters[i].value;
                        }
                    }
                    break;
                case 'Counter':
                case 'Number':
                    parameters[i].value = document.getElementById(renderId).ej2_instances[0].value;
                    if (!parameters[i].value && parameters[i].value != 0) {
                        if (parameters[i].allowNull) {
                            var isNull = ej.base.getComponent(document.getElementById(renderId + 'AcceptNull'), 'checkbox').checked;
                            if (!isNull) {
                                delete parameters[i].value;
                            }
                        }
                        else if (parameters[i].required) {
                            arrayMissingParameters.push(parameters[i].name);
                        }
                        else {
                            delete parameters[i].value;
                        }
                    }
                    break;
                case 'Choice':
                case 'MultiChoice':
                case 'Lookup':
                case 'LookupMulti':
                case 'LookupFieldWithPicker':
                case 'LookupFieldWithPickerMulti':
                    parameters[i].value = document.getElementById(renderId).ej2_instances[0].value;
                    if (parameters[i].value === null || parameters[i].value.length === 0) {
                        if (parameters[i].required) {
                            arrayMissingParameters.push(parameters[i].name);
                        }
                        else {
                            delete parameters[i].value;
                        }
                    }
                    break;
                case 'ListDatasource':
                    parameters[i].value = document.getElementById(renderId).ej2_instances[0].value;
                    if (parameters[i].value === null || parameters[i].value.length === 0) {
                        if (parameters[i].required) {
                            (parameters[i].operator === 'ToRange') ? arrayMissingParameters.push(parameters[i].createdToName) : arrayMissingParameters.push(parameters[i].name);
                        } else {
                            delete parameters[i].value;
                        }
                    }
                    break;
                case 'DistinctList':
                    parameters[i].value = document.getElementById(renderId).ej2_instances[0].value;
                    if (parameters[i].value === null || parameters[i].value.length === 0) {
                        delete parameters[i].value;
                    }
                    break;
                case 'User':
                case 'UserMulti':
                    var spanUsers = document.getElementById(renderId + '_TopSpan').querySelectorAll('span.ms-entity-resolved');
                    if (spanUsers.length === 0) {
                        if (parameters[i].allowNull) {
                            var isNull = ej.base.getComponent(document.getElementById(renderId + 'AcceptNull'), 'checkbox').checked;
                            if (isNull) {
                                parameters[i].value = ['MVDNullValue'];
                            } else {
                                if (parameters[i].required) {
                                    arrayMissingParameters.push(parameters[i].name);
                                } else {
                                    delete parameters[i].value;
                                }
                            }
                        } else {
                            if (parameters[i].required) {
                                arrayMissingParameters.push(parameters[i].name);
                            } else {
                                delete parameters[i].value;
                            }
                        }
                    }
                    else {
                        parameters[i].value = [];
                        for (var k = 0; k < spanUsers.length; k++) {
                            parameters[i].value.push(spanUsers[k].getAttribute('title'));
                        }
                        if (parameters[i].allowNull) {
                            var isNull = ej.base.getComponent(document.getElementById(renderId + 'AcceptNull'), 'checkbox').checked;
                            if (!isNull) {
                                parameters[i].value.push('MVDNullValue');
                            }
                        }
                    }
                    break;
                case 'DateTime':
                    parameters[i].value = document.getElementById(renderId).ej2_instances[0].value;
                    if (parameters[i].value === null) {
                        if (parameters[i].allowNull && typeof parameters[i].dateSubType === 'undefined') {
                            var isNull = ej.base.getComponent(document.getElementById(renderId + 'AcceptNull'), 'checkbox').checked;
                            if (!isNull) {
                                if (parameters[i].required) {
                                    arrayMissingParameters.push(parameters[i].name);
                                } else {
                                    delete parameters[i].value;
                                }
                            }
                        }
                        else if (parameters[i].required) {
                            arrayMissingParameters.push(parameters[i].name);
                        }
                        else {
                            delete parameters[i].value;
                        }
                    } else {
                        if (parameters[i].dateType === 'year') {
                            var year = parameters[i].value;
                            if (parameters[i].operator === 'ToRange' || parameters[i].operator === 'Gt' || parameters[i].operator === 'Leq') {
                                parameters[i].value = moment(new Date('12/31/' + year)).toISOString(true);
                            } else {
                                parameters[i].value = moment(new Date('01/01/' + year)).toISOString(true);
                                if (parameters[i].operator === 'Eq' || parameters[i].operator === 'Neq') {
                                    parameters[i].auxValue = moment(new Date('12/31/' + year)).toISOString(true);
                                }
                            }
                        }
                        else if (parameters[i].dateType.indexOf('date') > -1) {
                            var isoString = moment(parameters[i].value).toISOString(true);
                            if (parameters[i].operator === 'ToRange' || parameters[i].operator === 'Gt' || parameters[i].operator === 'Leq') {
                                parameters[i].value = isoString.substring(0, isoString.length - 10) + 'Z';
                            } else {
                                parameters[i].value = moment(new Date('01/01/' + year)).toISOString(true);
                            }
                        }
                    }
                    break;
                case 'Boolean':
                    parameters[i].value = (ej.base.getComponent(document.getElementById(renderId), 'checkbox').checked) ? 1 : 0;
                    break;
            }
        } catch (error) {
            delete parameters[i].value;
            console.error(error);
        }

    }
    mergeCompoundParameters(parameters);
    if (getEntryValue) {
        parameters.forEach(function (e) {
            var value = e.value;
            if (value && e.type === 'DateTime' && ['monthAndYear', 'year'].includes(e.dateType)) {
                value = moment(value).year();
            }
            if (e.entryValue === 'userAndDefault' || e.entryValue === 'fixed') {
                e.defaultValue = value;
            }
        });
    }

    var strErrorMsg = 'Parámetros faltantes: ';
    for (var j = 0; j < arrayMissingParameters.length; j++) {
        strErrorMsg += arrayMissingParameters[j] + ', ';
    }
    strErrorMsg = strErrorMsg.substring(0, strErrorMsg.length - 2) + '.';
    if (arrayMissingParameters.length > 0) {
        throw { msg: strErrorMsg };
    }

    function mergeCompoundParameters(parameters) {
        for (var i = 0; i < parameters.length; i++) {
            if (parameters[i].type === 'DateTime' && parameters[i].dateType === 'monthAndYear') {
                if (!parameters[i].dateSubType && typeof parameters[i].value !== 'undefined') {
                    var year = parameters[i].value;
                    var month = parameters.find(e => e.field === parameters[i].field && typeof e.dateSubType !== 'undefined');
                    month = (!month) ? null : month.value;
                    if (!month) {
                        if (parameters[i].operator === 'ToRange' || parameters[i].operator === 'Gt' || parameters[i].operator === 'Leq') {
                            parameters[i].value = moment(new Date('12/31/' + year)).toISOString(true);
                        } else {
                            parameters[i].value = moment(new Date('01/01/' + year)).toISOString(true);
                            if (parameters[i].operator === 'Eq' || parameters[i].operator === 'Neq') {
                                parameters[i].auxValue = moment(new Date('12/31/' + year)).toISOString(true);
                            }
                        }

                    } else {
                        if (parameters[i].operator === 'ToRange' || parameters[i].operator === 'Gt' || parameters[i].operator === 'Leq') {
                            parameters[i].value = moment(new Date(month + '/31/' + year)).toISOString(true);
                        } else {
                            parameters[i].value = moment(new Date(month + '/01/' + year)).toISOString(true);
                            if (parameters[i].operator === 'Eq' || parameters[i].operator === 'Neq') {
                                parameters[i].auxValue = moment(new Date(month + '/31/' + year)).toISOString(true);
                            }
                        }
                    }
                }
            }
        }
        let rangeParameters = parameters.filter(e => e.operator === 'Range');
        rangeParameters.forEach(element => {
            let toRange = parameters.find(e => e.field === element.field && e.operator === 'ToRange');
            element.toRangeValue = toRange.value;
        });
    }
}

MVD.DataSources.getParameterRenderId = function (parameter, toName) {
    var name = (toName) ? 'MVD' + parameter.createdToName : 'MVD' + parameter.name;
    if (parameter.referenceInQuery) {
        name = parameter.referenceInQuery;
    }
    return MVD.SPHelpers.Common.getValidJavaScriptIndentifier(name);
}

MVD.DataSources.initDataSourcesCache = function () {
    return new Promise(function (resolve, reject) {
        MVD.DataSources.cacheDataSources = [];
        var query = null;
        MVD.SPHelpers.ListItems.getCurrentUserListPermission('/Lists/MVDDataSources')
            .then(function (listPermissions) {
                if (location.href.toLowerCase().includes('/lists/mvddatasources/')) {
                    var type = MVD.SPHelpers.Fields.getFieldValueByInternalName('Type');
                    if (MVD.DataSources.inEditMode && (type === 'Complex' || type === 'Pivot')) {
                        query = '<View><Query><Where><Neq><FieldRef Name="ID" /><Value Type="Counter">' + MVD.SPHelpers.Common.getParameterByName('ID') + '</Value></Neq></Where></Query></View>';
                    }
                }
                MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.siteServerRelativeUrl, '/Lists/MVDDataSources', query)
                    .then(function (items) {
                        if (items && items.get_count() > 0) {
                            var enumerator = items.getEnumerator();
                            while (enumerator.moveNext()) {
                                var listItem = enumerator.get_current();
                                var source = JSON.parse(listItem.get_item('JSON'));
                                source.id = listItem.get_item('ID');
                                source.title = listItem.get_item('Title');
                                source.type = listItem.get_item('Type');
                                source.internalUse = listItem.get_item('InternalUse');
                                try {
                                    if (source.parameters.length > 0 && typeof source.parameters[0].sourceId !== -1) {
                                        for (var i = 0; i < source.parameters.length; i++) {
                                            source.parameters[i].sourceId = source.id;
                                        }
                                    }
                                } catch (e) {
                                    console.error(e);
                                }
                                MVD.DataSources.cacheDataSources.push(source);
                            }
                            MVD.DataSources.cacheDataSources = MVD.DataSources.cacheDataSources.sort(function (a, b) {
                                return a.title.localeCompare(b.title);
                            });
                        }
                        resolve();
                    })
                    .catch(function (err) {
                        reject({ error: err, msg: 'Error al obtener la lista /Lists/MVDDataSources' });
                    })
            })
            .catch(function (err) {
                reject({ error: err, msg: 'Error al obtener la lista /Lists/MVDDataSources' });
            })
    });
}

MVD.DataSources.initExternalCache = function () {
    return new Promise(function (resolve, reject) {
        MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.siteServerRelativeUrl, '/Lists/MVDDataSourcesExternalConnections').then(function (items) {
            MVD.DataSources.cacheExternalDataSources = [];
            if (items && items.get_count() > 0) {
                var enumerator = items.getEnumerator();
                while (enumerator.moveNext()) {
                    var listItem = enumerator.get_current();
                    var aux = {
                        id: listItem.get_item('ID'),
                        title: listItem.get_item('Title'),
                        type: listItem.get_item('Type'),
                    };
                    MVD.DataSources.cacheExternalDataSources.push(aux);
                }
            }
            resolve();
        })
            .catch(function (err) {
                reject({ error: args, msg: 'Error al obtener la lista /Lists/MVDDataSourcesExternalConnections' });
            })
    });
}

MVD.DataSources.initIndicatorsCache = function (indicatorsIds) {
    return new Promise(function (resolve, reject) {
        MVD.DataSources.cacheIndicators = [];
        var loadFields = Promise.all([
            MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.siteServerRelativeUrl, '/Lists/Indicators'),
            MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.siteServerRelativeUrl, '/Lists/IndicatorsPlans'),
            MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.siteServerRelativeUrl, '/Lists/IndicatorsValues'),
            //MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.siteServerRelativeUrl, '/Lists/Records'),
            MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.siteServerRelativeUrl, '/Lists/ScalesValues'),
        ]);
        MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.siteServerRelativeUrl, '/Lists/Indicators')
            .then(function (items) {
                if (items && items.get_count() > 0) {
                    var enumerator = items.getEnumerator();
                    while (enumerator.moveNext()) {
                        var listItem = enumerator.get_current();
                        var source = {};
                        source.id = listItem.get_item('ID');
                        source.title = listItem.get_item('Title');
                        source.type = 'Indicador';
                        source.history = [];
                        source.dateFormat = listItem.get_item('DateFormat');
                        source.numberFormatValues = listItem.get_item('NumberFormatValues');
                        source.numberFormatDeviations = listItem.get_item('NumberFormatDeviations');
                        source.isCumulative = listItem.get_item('IsCumulative');
                        source.responsiblePersons = [];
                        var responsiblePersons = listItem.get_item('ResponsiblePersons');
                        if (responsiblePersons) {
                            source.responsiblePersons = [];
                            responsiblePersons.forEach(function (e) {
                                source.responsiblePersons.push(e.get_lookupValue());
                            });
                        }
                        source.plans = [];
                        MVD.DataSources.cacheIndicators.push(source);
                    }
                    MVD.DataSources.cacheIndicators = MVD.DataSources.cacheIndicators.sort(function (a, b) {
                        return a.title.localeCompare(b.title);
                    });
                }
                loadFields.then(function () {
                    resolve();
                });
            })
            .catch(function (err) {
                reject({ error: err, msg: 'Error al obtener la lista /Lists/Indicators' });
            })
    });
}

MVD.DataSources.mergeCompoundParameters = function (parameters) {
    var aux = [];
    for (var i = 0; i < parameters.length; i++) {
        if (parameters[i].operator === 'ToRange' || parameters[i].dateSubType) continue;
        if (parameters[i].operator === 'Range') {
            var toRangeParameter = parameters.find(e => e.field === parameters[i].field && e.operator === 'ToRange');
            parameters[i].createdToName = toRangeParameter.createdName;
            if (parameters[i].dateType === 'monthAndYear') {
                var rangeParameter = parameters.find(e => e.field === parameters[i].field && e.operator === 'Range' && e.dateSubType);
                parameters[i].parameterCreatedNameMonth = rangeParameter.createdName;
                var toRangeParameter = parameters.find(e => e.field === parameters[i].field && e.operator === 'ToRange' && e.dateSubType);
                parameters[i].parameterCreatedToNameMonth = toRangeParameter.createdName;
            }
        } else {
            if (parameters[i].type === 'DateTime' && parameters[i].dateType === 'monthAndYear' && !parameters[i].dateSubType) {
                var monthParameter = parameters.find(e => e.field === parameters[i].field && e.dateType === 'monthAndYear' && e.dateSubType);
                parameters[i].parameterCreatedNameMonth = monthParameter.createdName;
            }
        }
        aux.push(parameters[i]);
    }
    return aux;
}

MVD.DataSources.preSaveAction = function () {
    PreSaveAction = function () {
        var retValue = true;
        var source = MVD.DataSources.UI.getSourceSettings();
        source.parameters = MVD.DataSources.UI.getParametersRowsSettings();
        try {
            MVD.DataSources.getParametersValues(source.parameters, true);
            if (source.parameters.length > 0 && source.parameters.filter(e => e.entryValue === 'fixed').length > 0) {
                var fixedWithoutValue = false
                source.parameters.filter(e => e.entryValue === 'fixed').forEach(function (e) {
                    if (typeof e.value === 'undefined' || (e.value === null && e.allowNull === false)) {
                        fixedWithoutValue = true;
                    }
                });
                if (fixedWithoutValue) {
                    MVD.SyncfusionUtilities.showToast('Revise la configuración de los parámetros ya que hay parámetros con ingreso fijo de valor, pero actualmente no tienen ningún valor asignado.', null, 8000);
                    retValue = false;
                }
            }
            source.parameters.forEach(function (e) {
                if (e.entryValue !== 'fixed') {
                    delete e.value;
                    delete e.auxValue;
                }
            });
        } catch (err) {
            console.error(err);
        }
        MVD.SPHelpers.Fields.setFieldValueByInternalName('Title', ej.base.getComponent(document.getElementById('sourceTitle'), 'textbox').value);
        MVD.SPHelpers.Fields.setFieldValueByInternalName('InternalUse', ej.base.getComponent(document.getElementById('internalUse'), 'checkbox').checked);
        MVD.SPHelpers.Fields.setFieldValueByInternalName('Type', source.type);
        try {
            MVD.SPHelpers.Fields.setFieldValueByInternalName(MVD.DataSources.UI.dataSourcesGroupingFieldinternalName, ej.base.getComponent(document.getElementById('dataSourcesGroupingField'), 'dropdownlist').value);
        } catch (error) {
            console.error(error);
        }
        for (var keySourceProp in source) {
            if (keySourceProp === 'typeSettings' || keySourceProp === 'advancedParameters' || keySourceProp === 'parameters') {
                continue;
            } else {
                delete source[keySourceProp];
            }
        }
        MVD.SPHelpers.Fields.setFieldValueByInternalName('JSON', JSON.stringify(source));
        return retValue;
    }
}

MVD.DataSources.removeParameter = function (parameter) {
    var renderId = MVD.DataSources.getParameterRenderId(parameter);
    var source = MVD.DataSources.UI.getSourceSettings();
    source.parameters = MVD.DataSources.UI.getParametersRowsSettings();
    var allParameters = MVD.DataSources.getAllSourceParameters(source);
    var isDuplicated = allParameters.filter(e => MVD.DataSources.getParameterRenderId(e) === renderId);
    if (isDuplicated.length <= 1 && document.getElementById(renderId + 'PanelWrapper')) {
        document.getElementById(renderId + 'PanelWrapper').remove();
    }
}

MVD.DataSources.renderParameter = function (parameter, containerHTML) {
    var renderId = MVD.DataSources.getParameterRenderId(parameter);
    if (document.getElementById(renderId) === null) {
        var div = document.createElement('div');
        div.setAttribute('id', renderId + 'Wrapper');
        div.className = 'parameterWrapper';
        document.getElementById(containerHTML).append(div);
        var input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('id', renderId);
        div.appendChild(input);
        try {
            createSyncfusionComponent(parameter);
        }
        catch (e) {
            MVD.SyncfusionUtilities.showToast(e.msg);
            console.error(e);
        }
        if (parameter.allowNull && (parameter.type === 'Text' || parameter.type === 'Note' || parameter.type === 'Number' || parameter.type === 'Counter'
            || parameter.type === 'User' || parameter.type === 'UserMulti' || (parameter.type === 'DateTime' && typeof parameter.dateSubType === 'undefined'))) {
            var divNullWrapper = document.createElement('div');
            divNullWrapper.setAttribute('id', renderId + 'NullWrapper');
            divNullWrapper.style.width = '25%';
            divNullWrapper.style.display = 'flex';
            document.getElementById(containerHTML).append(divNullWrapper);
            document.getElementById(containerHTML).style.display = 'flex';
            document.getElementById(renderId + 'Wrapper').style.width = '74.5%';

            var div = document.createElement('div');
            div.style.margin = 'auto';
            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('id', renderId + 'AcceptNull');
            div.appendChild(input);
            divNullWrapper.appendChild(div);
            var checkbox = new ej.buttons.CheckBox({
                label: 'Vacío',
                value: false,
                cssClass: 'e-small',
                change: function (args) {
                    if (args.event) {
                        var paramterId = args.event.target.id.replace('AcceptNull', '');
                        if (typeof document.getElementById(paramterId).ej2_instances !== 'undefined') {
                            try {
                                document.getElementById(paramterId).ej2_instances[0].enabled = !args.checked;
                                document.getElementById(paramterId).ej2_instances[0].value = null;
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                }
            });
            checkbox.appendTo('#' + renderId + 'AcceptNull');
        }
    }

    function createSyncfusionComponent(parameter) {
        var renderId = MVD.DataSources.getParameterRenderId(parameter);
        var placeholder = (parameter.required) ? parameter.name + ' *' : parameter.name;
        var defaultValue = (parameter.defaultValue) ? parameter.defaultValue : null;
        if (parameter.queryStringValue) {
            defaultValue = parameter.queryStringValue;
        }
        if (parameter.type === 'Text' || parameter.type === 'Note' || parameter.type === 'Calculated' || parameter.type === 'File') {
            renderInputOrNoteComponent(renderId, placeholder, defaultValue);
        }
        else if (parameter.type === 'Number' || parameter.type === 'Counter') {
            renderNumberComponent(renderId, placeholder, defaultValue, '###.##', 0);
        }
        else if (parameter.type === 'Choice' || parameter.type === 'Lookup' || parameter.type === 'LookupFieldWithPicker') {
            if (parameter.allowMultiple) {
                renderMultiselectComponent(renderId, placeholder, defaultValue);
            }
            else {
                renderDropDownComponent(renderId, placeholder, defaultValue);
            }

            if (parameter.type === 'Choice') {
                getChoicesData(renderId, parameter);
            }
            else {
                MVD.DataSources.getParameterLookupData(renderId, parameter);
            }
        }
        else if (parameter.type === 'MultiChoice' || parameter.type === 'LookupMulti' || parameter.type === 'LookupFieldWithPickerMulti') {
            renderMultiselectComponent(renderId, placeholder, defaultValue);
            if (parameter.type === 'MultiChoice') {
                getChoicesData(renderId, parameter);
            } else {
                MVD.DataSources.getParameterLookupData(renderId, parameter);
            }
        }
        else if (parameter.type === 'ListDatasource' || parameter.type === 'DistinctList') {
            if (parameter.allowMultiple) {
                renderMultiselectComponent(renderId, placeholder, defaultValue, parameter.values);
            }
            else {
                renderDropDownComponent(renderId, placeholder, defaultValue, parameter.values);
            }
            if (parameter.type === 'ListDatasource') {
                getLookupDatasourceData(renderId, parameter);
            }
        }
        else if (parameter.type === 'User' || parameter.type === 'UserMulti') {
            var elem = document.getElementById(renderId);
            var parentNode = elem.parentNode;
            parentNode.removeChild(elem);
            var newLbl = document.createElement('label');
            newLbl.style.color = 'rgba(0, 0, 0, 0.54)';
            newLbl.style.fontSize = '13px';
            newLbl.innerHTML = placeholder;
            parentNode.appendChild(newLbl);
            var newEl = document.createElement('div');
            newEl.setAttribute('id', renderId);
            newEl.style.width = '90% !important';
            parentNode.appendChild(newEl);

            try {
                MVD.SPHelpers.Fields.createPeoplePicker(renderId, { Type: parameter.extraConfig.type, UserSelectionMode: parameter.extraConfig.userSelectionMode });
            } catch (e) {
                console.error(e);
            }

        }
        else if (parameter.type === 'Boolean') {
            renderCheckboxComponent(renderId, placeholder, defaultValue);
        }
        else if (parameter.type === 'DateTime') {
            if (parameter.dateType === 'dateTime') {
                var dateObj = new ej.calendars.DateTimePicker({
                    placeholder: placeholder,
                    floatLabelType: 'Auto',
                    value: defaultValue,
                    format: 'dd/MM/yyyy HH:mm',
                });
                dateObj.appendTo('#' + renderId);
            }
            else if (parameter.dateType === 'date') {
                var dateObj = new ej.calendars.DatePicker({
                    placeholder: placeholder,
                    floatLabelType: 'Auto',
                    value: defaultValue,
                    format: 'dd/MM/yyyy',
                });
                dateObj.appendTo('#' + renderId);
            }
            else if (parameter.dateType === 'monthAndYear') {
                if (!parameter.dateSubType) {
                    renderNumberComponent(renderId, placeholder, defaultValue, 'n', 0, 1900, 2100);
                } else {
                    renderNumberComponent(renderId, placeholder, defaultValue, 'n', 0, 1, 12);
                }
            }
            else if (parameter.dateType === 'year') {
                renderNumberComponent(renderId, placeholder, defaultValue, 'n', 0, 1900, 2100);
            }
        }

        function renderInputOrNoteComponent(renderId, placeholder, defaultValue) {
            var input = new ej.inputs.TextBox({
                placeholder: placeholder,
                floatLabelType: 'Auto',
                type: 'text',
                showClearButton: true,
                value: defaultValue
            });
            input.appendTo('#' + renderId);
        };
        function renderNumberComponent(renderId, placeholder, defaultValue, format, decimals, min, max) {
            var min = (min) ? min : Number.MIN_SAFE_INTEGER;
            var max = (max) ? max : Number.MAX_SAFE_INTEGER;
            var numeric = new ej.inputs.NumericTextBox({
                placeholder: placeholder,
                floatLabelType: 'Auto',
                decimals: decimals,
                format: format,
                value: defaultValue,
                max: max,
                min: min,
            });
            numeric.appendTo('#' + renderId);
        };
        function renderMultiselectComponent(renderId, placeholder, defaultValue, dataSource) {
            if (defaultValue && !Array.isArray(defaultValue)) {
                defaultValue = [defaultValue];
            }
            var multiSelectObj = new ej.dropdowns.MultiSelect({
                dataSource: (dataSource) ? dataSource : [],
                locale: 'es',
                value: defaultValue,
                fields: { text: 'text', value: 'value' },
                floatLabelType: 'Auto',
                placeholder: placeholder,
                mode: 'CheckBox',
                showSelectAll: true,
                showDropDownIcon: true,
                popupHeight: '350px',
                popupHeight: '350px',
                actionComplete: function (args) {
                    console.log(args);
                },
                change: function (args) {
                    console.log(args);
                },
            });
            multiSelectObj.appendTo('#' + renderId);
        };
        function renderDropDownComponent(renderId, placeholder, defaultValue, dataSource) {
            var dropDownList = new ej.dropdowns.DropDownList({
                locale: 'es',
                placeholder: placeholder,
                floatLabelType: 'Auto',
                fields: { text: 'text', value: 'value' },
                dataSource: (dataSource) ? dataSource : [],
                showClearButton: true,
                value: defaultValue
            });
            dropDownList.appendTo('#' + renderId);
        };
        function renderCheckboxComponent(renderId, placeholder, defaultValue) {
            var checkbox = new ej.buttons.CheckBox({
                label: placeholder,
                value: defaultValue,
                cssClass: 'e-small'
            });
            checkbox.appendTo('#' + renderId);
        };
    }
    function getLookupDatasourceData(parameterId, parameter) {
        if (parameter.extraConfig.sourceId < 0) {
            return;
        }
        var source = MVD.DataSources.cacheDataSources.find(element => element.id == parameter.extraConfig.sourceId);
        if (!source) {
            throw ({ msg: 'El parámetro ' + parameter.name + ' presenta errores al haberse eliminado del origen de datos.' });
        }
        MVD.DataSources.getSourceData(source, source.parameters)
            .then(function (data) {
                var ret = [];
                if (parameter.allowNull) {
                    ret.push({ value: 'MVDNullValue', text: 'Vacío' });
                }
                for (var j = 0; j < data.length; j++) {
                    ret.push({ value: data[j][parameter.extraConfig.valueField], text: data[j][parameter.extraConfig.showField] });
                }
                ret = Enumerable.from(ret).distinct(function (e) { return e.value }).orderBy(function (e) { return e.text }).toArray();
                ej.base.getComponent(document.getElementById(parameterId), 'dropdownlist').dataSource = ret;
            })
            .catch(function (args) {
                throw ({ msg: 'El parámetro ' + parameter.name + ' presenta errores con el origen de datos requerido.' });
            });
    }
    function getChoicesData(parameterId, parameter) {
        MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.siteServerRelativeUrl, parameter.extraConfig.listUrl)
            .then(function (fields) {
                var auxField = fields.find(function (e) {
                    return e.internalName === parameter.field;
                });
                var ret = [];
                for (var j = 0; j < auxField.schema.CHOICES.CHOICE.length; j++) {
                    var data = {
                        text: auxField.schema.CHOICES.CHOICE[j],
                        value: auxField.schema.CHOICES.CHOICE[j]
                    };
                    ret.push(data);
                }
                if (parameter.allowNull) {
                    ret.push({
                        text: 'Vacío',
                        value: 'MVDNullValue'
                    })
                }
                if (parameter.allowMultiple || parameter.type === 'MultiChoice') {
                    ej.base.getComponent(document.getElementById(parameterId), 'multiselect').dataSource = ret;
                } else {
                    ej.base.getComponent(document.getElementById(parameterId), 'dropdownlist').dataSource = ret;
                }
            })
            .catch(function (args) {
                console.error(args);
            })
    };
}

MVD.DataSources.setParameterDistinctListDataSource = function (parameters, data) {
    for (var i = 0; i < parameters.length; i++) {
        if (parameters[i].type === 'DistinctList') {
            try {
                var dropdown = null;
                var oldValue = null;
                var renderId = MVD.DataSources.getParameterRenderId(parameters[i]);
                if (parameters[i].allowMultiple) {
                    dropdown = ej.base.getComponent(document.getElementById(renderId), 'multiselect');
                } else {
                    dropdown = ej.base.getComponent(document.getElementById(renderId), 'dropdownlist');
                }
                oldValue = dropdown.value;
                dropdown.dataSource = getDistict(parameters[i].field, data, dropdown.dataSource);
                dropdown.value = oldValue;
            } catch (e) {
                console.log('ERROR setFilterDistinctDataSource ', e)
            }
        }
    }

    function getDistict(field, data, oldData) {
        var aux = [];

        var distinctsRows = Enumerable.from(data).distinct(function (e) { return e[field] }).toArray();
        for (var i = 0; i < distinctsRows.length; i++) {
            try {
                if (distinctsRows[i][field]) {
                    if (distinctsRows[i][field] instanceof Date) {
                        aux.push({ text: distinctsRows[i][field], value: distinctsRows[i][field].toISOString() });
                    } else {
                        aux.push({ text: distinctsRows[i][field], value: distinctsRows[i][field].toString() });
                    }
                } else {
                    aux.push({ text: 'Vacío', value: 'MVDNullValue' });
                }
            } catch (e) {
                console.error(e);
            }
        }

        for (var j = 0; j < oldData.length; j++) {
            var isRepeat = aux.find(e => e.value == oldData[j].value);
            if (typeof isRepeat === 'undefined') {
                aux.push(oldData[j]);
            }
        }
        return aux.sort(function (a, b) {
            return (a.text === b.text) ? 0 : (a.text < b.text) ? -1 : 1;
        });
    }
}

MVD.DataSources.transposeData = function (data, x, fieldsToIgnore, sourceFields) {
    var trasposeData = [];
    if (!x) {
        x = null
    };
    var nameDictionary = {};
    var keys = Object.keys(data[0]).filter(e => e !== x);
    if (fieldsToIgnore) {
        keys = keys.filter(e => !fieldsToIgnore.includes(e));
    }
    keys.forEach(function (e) {
        try {
            nameDictionary[e] = sourceFields.find(el => el.internalName === e).name;
            trasposeData.push({ x: nameDictionary[e] });
        } catch (e) {
            console.warn('Transpose data:  ' + e);
        }
    });
    for (var i = 0; i < data.length; i++) {
        var xTranspose = (x) ? data[i][x] : ((data.length === 1) ? 'y' : 'y' + (i + 1));
        for (var key in keys) {
            try {
                var row = trasposeData.find(e => e.x === nameDictionary[keys[key]]);
                row[xTranspose] = data[i][keys[key]];
            } catch (e) {
                console.warn('Transpose data:  ' + e);
            }
        }
    }
    return trasposeData;
}

//----------------------------------------------------------------- UI - Users Actions -------------------------------------------------------------//

MVD.DataSources.UI.addParameterRowSettings = function (source) {
    var isAdvanced = source.advancedParameters;
    var type = source.type;
    var div = document.createElement('div');
    div.className = 'parameterRow';
    div.setAttribute('data-idParameterRow', MVD.DataSources.newRowNumber);
    div.innerHTML = getParameterRowTemplateHTML();
    document.getElementById('parameters').append(div);

    var fields = [];
    if (type !== 'Javascript') {
        var auxType = type;
        if (type === 'External') {
            if (source.typeSettings.type === 'External Sharepoint') {
                auxType = 'externalSharepoint';
            } else if (source.typeSettings.type === 'DataBase Connection') {
                auxType = 'externalDataBase';
            } else {
                auxType = 'webService';
            }
        } else {
            auxType = type.toLowerCase();
        }
        fields = ej.base.getComponent(document.getElementById(auxType + 'Fields'), 'multiselect').dataSource;
        fields = fields.filter(function (field) {
            return field.type !== 'GridChoice';
        });
    }

    var parameterFieldObj = new ej.dropdowns.DropDownList({
        placeholder: 'Campo',
        floatLabelType: 'Auto',
        fields: { value: 'internalName', text: 'name' },
        dataSource: fields,
        change: function (args) {
            if (args.isInteracted) {
                var rowId = args.element.id.replace('parameterField', '');
                var source = MVD.DataSources.UI.getSourceSettings();
                ej.base.getComponent(document.getElementById('parameterCreatedName' + rowId), 'textbox').value = args.itemData.name;
                var auxFieldType = args.itemData.type;
                var parameterTypeObj = ej.base.getComponent(document.getElementById('parameterType' + rowId), 'dropdownlist');
                parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.type.split(';').includes(source.type)));
                if (source.type === 'Sharepoint') {
                    if (auxFieldType === 'LookupMulti' || auxFieldType === 'LookupFieldWithPickerMulti') {
                        auxFieldType = 'LookupMulti';
                    }
                    else if (auxFieldType.includes('Lookup')) {
                        auxFieldType = 'Lookup';
                    }
                    else if (auxFieldType.includes('Cascading')) {
                        auxFieldType = 'Text';
                    }
                    else if (auxFieldType === 'Counter') {
                        auxFieldType = 'Number';
                    }
                    else if (auxFieldType === 'File') {
                        auxFieldType = 'Text';
                    }
                    else if (auxFieldType === 'Attachments') {
                        auxFieldType = 'Boolean';
                    }
                    parameterTypeObj.value = auxFieldType;
                    if (auxFieldType === 'Lookup' || auxFieldType === 'LookupMulti') {
                        let showField = (args.itemData.schema.ShowField === 'LinkTitleNoMenu') ? 'Title' : args.itemData.schema.ShowField;
                        document.getElementById('parameterExtraConfig' + rowId).value = JSON.stringify({ listId: args.itemData.schema.List, showField: showField, type: args.itemData.type, uniques: true });
                        parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === auxFieldType));
                    } else if (auxFieldType === 'User' || auxFieldType === 'UserMulti') {
                        document.getElementById('parameterExtraConfig' + rowId).value = JSON.stringify({ userSelectionMode: args.itemData.schema.UserSelectionMode, type: args.itemData.type });
                        parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === auxFieldType));
                    } else if (auxFieldType === 'Choice' || auxFieldType === 'MultiChoice') {
                        document.getElementById('parameterExtraConfig' + rowId).value = JSON.stringify({ listUrl: source.typeSettings.listUrl, type: args.itemData.type });
                        parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === auxFieldType));
                    } else if (auxFieldType === 'Calculated') {
                        document.getElementById('parameterExtraConfig' + rowId).value = JSON.stringify({ resultType: args.itemData.schema.ResultType });
                        parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === auxFieldType || e.value === 'DistinctList'));
                    } else {
                        document.getElementById('parameterExtraConfig' + rowId).value = '';
                        parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === auxFieldType || (e.value === 'DistinctList' && !(['Boolean', 'DateTime', 'Note']).includes(auxFieldType))));
                    }
                }
                else if (source.type === 'External' && source.typeSettings.listGuid) {
                    if (args.itemData.type.includes('LookupMulti')) {
                        auxFieldType = 'LookupMulti';
                    } else if (args.itemData.type.includes('Lookup')) {
                        auxFieldType = 'Lookup';
                    }
                    auxFieldType = (auxFieldType === 'User' || auxFieldType === 'UserMulti' || auxFieldType === 'Choice' || auxFieldType === 'MultiChoice' || auxFieldType === 'Lookup' || auxFieldType === 'LookupMulti') ? 'DistinctList' : auxFieldType;
                }
                parameterTypeObj.value = auxFieldType;
                var parameterOperatorObj = ej.base.getComponent(document.getElementById('parameterOperator' + rowId), 'dropdownlist');
                parameterOperatorObj.dataSource = MVD.DataSources.UI.operatorsTypes.filter(e => (e.type.split(';').includes(auxFieldType)));
                parameterOperatorObj.value = 'Eq';

                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterFieldObj.appendTo('#parameterField' + MVD.DataSources.newRowNumber);
    document.getElementById('parameterField' + MVD.DataSources.newRowNumber).parentElement.parentElement.style.display = (type === 'Javascript') ? 'none' : 'inline-flex';

    var parameterCreatedNameObj = new ej.inputs.TextBox({
        placeholder: 'Nombre',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true,
        change: function (args) {
            if (args.isInteracted) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterCreatedNameObj.appendTo('#parameterCreatedName' + MVD.DataSources.newRowNumber);
    document.getElementById('parameterCreatedName' + MVD.DataSources.newRowNumber).parentElement.parentElement.style.display = (type === 'Javascript') ? 'inline-flex' : 'none';

    var parameterCreatedNameMonthObj = new ej.inputs.TextBox({
        placeholder: 'Nombre mes',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true,
        change: function (args) {
            if (args.isInteracted) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterCreatedNameMonthObj.appendTo('#parameterCreatedNameMonth' + MVD.DataSources.newRowNumber);

    var parameterCreatedToNameObj = new ej.inputs.TextBox({
        placeholder: 'Nombre hasta',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true,
        change: function (args) {
            if (args.isInteracted) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterCreatedToNameObj.appendTo('#parameterCreatedToName' + MVD.DataSources.newRowNumber);

    var parameterCreatedNameToMonthObj = new ej.inputs.TextBox({
        placeholder: 'Nombre mes hasta',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true,
        change: function (args) {
            if (args.isInteracted) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterCreatedNameToMonthObj.appendTo('#parameterCreatedToNameMonth' + MVD.DataSources.newRowNumber);

    var parameterReferenceInQueryObj = new ej.inputs.TextBox({
        placeholder: 'Referencía en query',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true,
        change: function (args) {
            if (args.isInteracted) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterReferenceInQueryObj.appendTo('#parameterReferenceInQuery' + MVD.DataSources.newRowNumber);

    var parameterTypeObj = new ej.dropdowns.DropDownList({
        placeholder: 'Tipo',
        floatLabelType: 'Auto',
        fields: { value: 'value', text: 'text' },
        dataSource: MVD.DataSources.UI.parametersTypes.filter(e => (e.type.split(';').includes(type))),
        change: function (args) {
            var rowId = args.element.id.replace('parameterType', '');
            var parameterOperatorObj = ej.base.getComponent(document.getElementById('parameterOperator' + rowId), 'dropdownlist');
            parameterOperatorObj.dataSource = MVD.DataSources.UI.operatorsTypes.filter(e => (e.type.split(';').includes(args.value)));
            if (args.value === 'DistinctList') {
                parameterOperatorObj.dataSource = parameterOperatorObj.dataSource.splice(0, 1);
            }
            if (!parameterOperatorObj.dataSource.find(e => e.value === parameterOperatorObj.value)) {
                parameterOperatorObj.value = 'Eq';
            }
            showAndHideParametersRowSettings(rowId);
            if (args.isInteracted) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterTypeObj.appendTo('#parameterType' + MVD.DataSources.newRowNumber);

    var rangeDateTypes = [{ text: 'Año', value: 'year' }, { text: 'Mes/Año', value: 'monthAndYear' }, { text: 'Fecha', value: 'date' }, { text: 'Fecha y hora', value: 'dateTime' }];
    var parameterRangeDateTypeObj = new ej.dropdowns.DropDownList({
        placeholder: 'Tipo selección',
        floatLabelType: 'Auto',
        dataSource: rangeDateTypes,
        fields: { value: 'value', text: 'text' },
        value: rangeDateTypes[0].value,
        change: function (args) {
            var rowId = args.element.id.replace('parameterDateType', '');
            ej.base.getComponent(document.getElementById('parameterCreatedName' + rowId), 'textbox').placeholder = 'Nombre año';
            document.querySelector('div[data-idparameterrow="' + rowId + '"]').querySelector('div[data-type="monthAndYear"]').style.display = (args.value === 'monthAndYear') ? 'flex' : 'none';
            var parameterOperator = ej.base.getComponent(document.getElementById('parameterOperator' + rowId), 'dropdownlist').value;
            document.querySelector('div[data-idparameterrow="' + rowId + '"]').querySelector('div[data-type="rangeMonthAndYear"]').style.display = (args.value === 'monthAndYear' && parameterOperator === 'Range') ? 'flex' : 'none';
            if (args.isInteracted) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterRangeDateTypeObj.appendTo('#parameterDateType' + MVD.DataSources.newRowNumber);

    var parameterAllowMultipleObj = new ej.buttons.CheckBox({
        label: 'Es múltiple',
        labelPosition: 'Before',
        change: function (args) {
            if (args.event) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterAllowMultipleObj.appendTo('#parameterAllowMultiple' + MVD.DataSources.newRowNumber);

    var parameterOperatorObj = new ej.dropdowns.DropDownList({
        placeholder: 'Tipo operador',
        floatLabelType: 'Auto',
        fields: { value: 'value', text: 'text' },
        dataSource: MVD.DataSources.UI.operatorsTypes,
        change: function (args) {
            if (args.isInteracted) {
                var rowId = args.element.id.replace('parameterOperator', '');
                showAndHideParametersRowSettings(rowId);

                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterOperatorObj.appendTo('#parameterOperator' + MVD.DataSources.newRowNumber);

    var parameterEntryValueObj = new ej.dropdowns.DropDownList({
        placeholder: 'Ingreso de valor',
        floatLabelType: 'Auto',
        fields: { value: 'value', text: 'text' },
        dataSource: [{ value: 'user', text: 'Usuario' }, { value: 'userAndDefault', text: 'Usuario y por defecto' }, { value: 'fixed', text: 'Fijo' }],
        value: 'user',
        change: function (args) {
            if (args.isInteracted) {
                var rowId = args.element.id.replace('parameterEntryValue', '');
                showAndHideParametersRowSettings(rowId);

                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterEntryValueObj.appendTo('#parameterEntryValue' + MVD.DataSources.newRowNumber);

    var parameterAllowNulldObj = new ej.buttons.CheckBox({
        label: 'Acepta nulo',
        labelPosition: 'Before',
        cssClass: 'parameterWidthAux',
        change: function (args) {
            if (args.event) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterAllowNulldObj.appendTo('#parameterAllowNull' + MVD.DataSources.newRowNumber);

    var parameterRequiredObj = new ej.buttons.CheckBox({
        label: 'Es obligatorio',
        labelPosition: 'Before',
        cssClass: 'parameterWidthAux',
        change: function (args) {
            if (args.event) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterRequiredObj.appendTo('#parameterRequired' + MVD.DataSources.newRowNumber);

    var dataSourcesNoneRequiredParameter = MVD.DataSources.cacheDataSources.filter(e => e.parameters.find(e => e.required === false));
    var parameterSourceObj = new ej.dropdowns.DropDownList({
        placeholder: 'Fuente del parámetro',
        floatLabelType: 'Auto',
        fields: { value: 'id', text: 'title' },
        dataSource: dataSourcesNoneRequiredParameter,
        change: function (args) {
            if (args.isInteracted) {
                var rowId = args.element.id.replace('parameterSource', '');
                if (!args.value) {
                    ej.base.getComponent(document.getElementById('parameterFieldShow' + rowId), 'dropdownlist').dataSource = [];
                    ej.base.getComponent(document.getElementById('parameterFieldValue' + rowId), 'dropdownlist').dataSource = [];
                    return;
                }
                MVD.DataSources.getFields(args.itemData)
                    .then(function (returnArgs) {
                        var rowId = args.element.id.replace('parameterSource', '');
                        ej.base.getComponent(document.getElementById('parameterFieldShow' + rowId), 'dropdownlist').dataSource = returnArgs.fields;
                        ej.base.getComponent(document.getElementById('parameterFieldShow' + rowId), 'dropdownlist').value = returnArgs.fields[0].internalName;
                        ej.base.getComponent(document.getElementById('parameterFieldValue' + rowId), 'dropdownlist').dataSource = returnArgs.fields;
                        ej.base.getComponent(document.getElementById('parameterFieldValue' + rowId), 'dropdownlist').value = returnArgs.fields[0].internalName;
                        MVD.DataSources.UI.beforeRefreshRenderParameters();
                        MVD.DataSources.UI.refreshRenderParameters();
                    })
                    .catch(function (args) {
                        console.error(args)
                    });
            }
        }
    });
    parameterSourceObj.appendTo('#parameterSource' + MVD.DataSources.newRowNumber);

    var parameterFieldShowObj = new ej.dropdowns.DropDownList({
        placeholder: "Campo a mostrar",
        floatLabelType: 'Auto',
        fields: { value: 'internalName', text: 'name' },
        showClearButton: true,
        dataSource: [],
        change: function (args) {
            if (args.isInteracted) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterFieldShowObj.appendTo('#parameterFieldShow' + MVD.DataSources.newRowNumber);

    var parameterFieldValueObj = new ej.dropdowns.DropDownList({
        cssClass: 'parameterInput',
        placeholder: "Campo valor",
        floatLabelType: 'Auto',
        fields: { value: 'internalName', text: 'name' },
        showClearButton: true,
        dataSource: [],
        change: function (args) {
            if (args.isInteracted) {
                MVD.DataSources.UI.beforeRefreshRenderParameters();
                MVD.DataSources.UI.refreshRenderParameters();
            }
        }
    });
    parameterFieldValueObj.appendTo('#parameterFieldValue' + MVD.DataSources.newRowNumber);

    var parameterDeleteBtnObj = new ej.buttons.Button({
        cssClass: 'e-small deleteParameterRow e-warning e-round',
        iconCss: 'e-icons e-delete-icon deleteParameterRow',
    });
    parameterDeleteBtnObj.appendTo('#parameterDeleteBtn' + MVD.DataSources.newRowNumber);
    if (type === 'Javascript') {
        ej.base.getComponent(document.getElementById('parameterOperator' + MVD.DataSources.newRowNumber), 'dropdownlist').value = 'Eq';
        ej.base.getComponent(document.getElementById('parameterType' + MVD.DataSources.newRowNumber), 'dropdownlist').value = 'Text';
        showAndHideParametersRowSettings(MVD.DataSources.newRowNumber);
    }
    MVD.DataSources.newRowNumber++;

    function getParameterRowTemplateHTML() {
        var strRow =
            '<div class="flexItem10Width"><input id="parameterField' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="all" style="display:none"><input id="parameterCreatedName' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="monthAndYear" style="display:none"><input id="parameterCreatedNameMonth' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="range" style="display:none"><input id="parameterCreatedToName' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="rangeMonthAndYear" style="display:none"><input id="parameterCreatedToNameMonth' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="referenceInQuery" style="display:none"><input id="parameterReferenceInQuery' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="all" style="display:none"><input id="parameterType' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="DateTime" style="display:none"><input id="parameterDateType' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="allNotAdvanced" style="display:none"><input id="parameterOperator' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="all" style="display:none"><input id="parameterEntryValue' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="parameterCheckbox" data-type="allowNull" style="display:none"><div style="margin:auto"><input id="parameterAllowNull' + MVD.DataSources.newRowNumber + '" /></div></div>' +
            '<div class="parameterCheckbox" data-type="allowMultiple" style="display:none"><div style="margin:auto"><input id="parameterAllowMultiple' + MVD.DataSources.newRowNumber + '" /></div></div>' +
            '<div class="parameterCheckbox" data-type="required" style="display:none"><div style="margin:auto"><input id="parameterRequired' + MVD.DataSources.newRowNumber + '" /></div></div>' +
            '<div class="flexItem10Width" data-type="ListDatasource" style="display:none"><input id="parameterSource' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="ListDatasource" style="display:none"><input id="parameterFieldShow' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<div class="flexItem10Width" data-type="ListDatasource" style="display:none"><input id="parameterFieldValue' + MVD.DataSources.newRowNumber + '" /></div>' +
            '<input id="parameterExtraConfig' + MVD.DataSources.newRowNumber + '" type="hidden" value="" />' +
            '<div style="display:inline-flex"><div style="margin:auto"><button id="parameterDeleteBtn' + MVD.DataSources.newRowNumber + '" type="button"></button></div></div>';
        return strRow;
    }
    function showAndHideParametersRowSettings(rowId) {
        var fieldType = ej.base.getComponent(document.getElementById('parameterType' + rowId), 'dropdownlist').value;
        var dateType = ej.base.getComponent(document.getElementById('parameterDateType' + rowId), 'dropdownlist').value;
        var sourceType = ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value;
        var isAdvanced = ej.base.getComponent(document.getElementById('advancedParameters'), 'checkbox').checked;
        var operatorType = ej.base.getComponent(document.getElementById('parameterOperator' + rowId), 'dropdownlist').value;
        var divsParameterSettings = document.querySelector('div[data-idparameterrow="' + rowId + '"]').querySelectorAll('div[data-type]');
        for (var i = 0; i < divsParameterSettings.length; i++) {
            if (divsParameterSettings[i].dataset.type === 'all') {
                divsParameterSettings[i].style.display = 'flex';
            }
            else if (divsParameterSettings[i].dataset.type === 'allNotAdvanced') {
                divsParameterSettings[i].style.display = (!isAdvanced) ? 'flex' : 'none';
            }
            else if (divsParameterSettings[i].dataset.type === 'referenceInQuery') {
                divsParameterSettings[i].style.display = (isAdvanced) ? 'flex' : 'none';
            }
            else if (divsParameterSettings[i].dataset.type === 'allowNull') {
                //ej.base.getComponent(document.getElementById('parameterAllowNull' + rowId), 'checkbox').checked = (operatorType === 'Eq' && fieldType === 'DistinctList') ? true : false;
                divsParameterSettings[i].style.display = ((operatorType === 'Eq' || operatorType === 'Neq') && fieldType !== 'DistinctList') ? 'flex' : 'none';
                if (divsParameterSettings[i].style.display === 'none') ej.base.getComponent(document.getElementById('parameterAllowNull' + rowId), 'checkbox').checked = false;
            }
            else if (divsParameterSettings[i].dataset.type === 'allowMultiple') {
                if (['ListDatasource', 'DistinctList', 'Choice', 'Lookup', 'User'].includes(fieldType)) {
                    divsParameterSettings[i].style.display = 'flex';
                } else {
                    ej.base.getComponent(document.getElementById('parameterAllowMultiple' + rowId), 'checkbox').checked = (['MultiChoice', 'LookupMulti', 'UserMulti'].includes(fieldType)) ? true : false;
                    divsParameterSettings[i].style.display = 'none';
                }
            }
            else if (divsParameterSettings[i].dataset.type === 'required') {
                divsParameterSettings[i].style.display = ((sourceType === 'Sharepoint' || sourceType === 'External') && fieldType !== 'DistinctList') ? 'flex' : 'none';
                if (divsParameterSettings[i].style.display === 'none') {
                    ej.base.getComponent(document.getElementById('parameterRequired' + rowId), 'checkbox').checked = false;
                }
            }
            else if (divsParameterSettings[i].dataset.type === fieldType) {
                divsParameterSettings[i].style.display = 'flex';
            }
            else if (divsParameterSettings[i].dataset.type === 'range') {
                if (operatorType === 'Range') {
                    divsParameterSettings[i].style.display = 'flex';
                    ej.base.getComponent(document.getElementById('parameterCreatedName' + rowId), 'textbox').placeholder = (fieldType === 'DateTime' && dateType === 'monthAndYear') ? 'Nombre año desde' : 'Nombre desde';
                    ej.base.getComponent(document.getElementById('parameterCreatedToName' + rowId), 'textbox').placeholder = (fieldType === 'DateTime' && dateType === 'monthAndYear') ? 'Nombre año hasta' : 'Nombre hasta';
                    ej.base.getComponent(document.getElementById('parameterCreatedNameMonth' + rowId), 'textbox').placeholder = 'Nombre mes desde';
                    document.querySelector('div[data-idparameterrow="' + rowId + '"]').querySelector('div[data-type="rangeMonthAndYear"]').style.display = (fieldType === 'DateTime' && ej.base.getComponent(document.getElementById('parameterDateType' + rowId), 'dropdownlist').value === 'monthAndYear') ? 'flex' : 'none';
                } else {
                    divsParameterSettings[i].style.display = 'none';
                    ej.base.getComponent(document.getElementById('parameterCreatedName' + rowId), 'textbox').placeholder = (dateType === 'monthAndYear') ? 'Nombre año' : 'Nombre';
                    if (dateType === 'monthAndYear') {
                        ej.base.getComponent(document.getElementById('parameterCreatedNameMonth' + rowId), 'textbox').placeholder = 'Nombre mes desde';
                        ej.base.getComponent(document.getElementById('parameterCreatedNameMonth' + rowId), 'textbox').placeholder = 'Nombre mes';
                    }
                }
            }
            else {
                divsParameterSettings[i].style.display = 'none';
            }
        }
    }
}

MVD.DataSources.UI.btnAddComplexConditionRow = function () {
    var newEl = document.createElement('div');
    newEl.className = 'complexConditionRow flexContainer';
    newEl.setAttribute('data-idComplexRow', MVD.DataSources.newRowNumber);
    newEl.innerHTML =
        '<div class="flexItem45Width"><input id="complexDataSourceField1_' + MVD.DataSources.newRowNumber + '" /></div>' +
        '<div class="flexItem45Width"><input id="complexDataSourceField2_' + MVD.DataSources.newRowNumber + '" /></div>' +
        '<div class="flexItem10Width" style="display:flex"><button id="btnDeleteComplexCondition' + MVD.DataSources.newRowNumber + '" type="button" style="margin:auto"></button></div></div>';
    document.getElementById('complexConditionsWrapper').append(newEl);
    var complexDataSourcesFieldObj = new ej.dropdowns.DropDownList({
        locale: 'es',
        cssClass: 'complexDataSourceField',
        placeholder: 'Campo de la primera fuente de datos',
        floatLabelType: 'Auto',
        fields: { value: 'internalName', text: 'name' },
        showClearButton: true,
        dataSource: ej.base.getComponent(document.getElementById('complexDataSourceField1_0'), 'dropdownlist').dataSource
    });
    complexDataSourcesFieldObj.appendTo('#complexDataSourceField1_' + MVD.DataSources.newRowNumber);
    var complexDataSourcesFieldObj2 = new ej.dropdowns.DropDownList({
        locale: 'es',
        cssClass: 'complexDataSourceField',
        placeholder: 'Campo de la segunda fuente de datos',
        floatLabelType: 'Auto',
        fields: { value: 'internalName', text: 'name' },
        showClearButton: true,
        dataSource: ej.base.getComponent(document.getElementById('complexDataSourceField2_0'), 'dropdownlist').dataSource
    });
    complexDataSourcesFieldObj2.appendTo('#complexDataSourceField2_' + MVD.DataSources.newRowNumber);
    var complexDataSourcesBtnObj = new ej.buttons.Button({
        cssClass: 'e-small e-warning e-round deleteComplexCondition',
        iconCss: 'e-icons e-delete-icon deleteComplexCondition',
    });
    complexDataSourcesBtnObj.appendTo('#btnDeleteComplexCondition' + MVD.DataSources.newRowNumber);

    MVD.DataSources.newRowNumber++;
}

MVD.DataSources.UI.btnAddComplexSelectFieldRow = function () {
    var newEl = document.createElement('div');
    newEl.className = 'complexSelectFieldRow flexContainer';
    newEl.setAttribute('data-idComplexRow', MVD.DataSources.newRowNumber);
    newEl.innerHTML =
        '<div class="flexItem50Width"><input id="complexSelectField_' + MVD.DataSources.newRowNumber + '" /></div>' +
        '<div class="flexItem30Width" style="padding-top: 3px;"><input id="complexSelectFieldLabel_' + MVD.DataSources.newRowNumber + '" /></div>' +
        '<div class="flexItem10Width" style="display:flex"><button id="btnDeleteComplexField' + MVD.DataSources.newRowNumber + '" type="button" style="margin:auto"></button></div></div>';
    document.getElementById('complexSelectFieldsWrapper').append(newEl);

    var complexSelectField = new ej.dropdowns.DropDownList({
        locale: 'es',
        cssClass: 'complexDataSourceSelectField',
        placeholder: 'Campo a mostrar',
        floatLabelType: 'Auto',
        fields: { groupBy: 'source', text: 'name', value: 'value' },
        showClearButton: true,
        dataSource: ej.base.getComponent(document.getElementById('complexSelectField_0'), 'dropdownlist').dataSource,
        valueTemplate: '<div style="width:100%;height:100%;">' +
            '<div style="font-size: x-small"> ${source}</div>' +
            '<div> ${name}</div></div>',
    });
    complexSelectField.appendTo('#complexSelectField_' + MVD.DataSources.newRowNumber);

    var complexSelectFieldLabel = new ej.inputs.TextBox({
        placeholder: 'Etiqueta',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true,
        cssClass: 'complexSelectFieldWrapper'
    });
    complexSelectFieldLabel.appendTo('#complexSelectFieldLabel_' + MVD.DataSources.newRowNumber);

    var complexSelectFieldDeleteBtnObj = new ej.buttons.Button({
        cssClass: 'e-small e-warning e-round deleteComplexField',
        iconCss: 'e-icons e-delete-icon deleteComplexField',
    });
    complexSelectFieldDeleteBtnObj.appendTo('#btnDeleteComplexField' + MVD.DataSources.newRowNumber);

    MVD.DataSources.newRowNumber++;
}

MVD.DataSources.UI.btnAddParameterRowSettings = function () {
    var source = MVD.DataSources.UI.getSourceSettings();
    if (showError(source)) {
        MVD.SyncfusionUtilities.showToast('La fuente presenta errores en su configuración, revisé que tenga los campos completados.');
        return false;
    }
    if (source.type === 'External' && source.typeSettings.type === 'DataBase Connection' && source.typeSettings.commandText) {
        var externalDataBaseFields = ej.base.getComponent(document.getElementById('externalDataBaseFields'), 'multiselect');
        source.parameters = [];
        MVD.DataSources.getFields(source)
            .then(function (args) {
                externalDataBaseFields.dataSource = args.fields;
                MVD.DataSources.UI.addParameterRowSettings(source);
            })
            .catch(function (args) {
                reject('Revisé function GetFields() de la fuente de datos.');
            });
    } else {
        MVD.DataSources.UI.addParameterRowSettings(source);
    }

    function showError(source) {
        if (source.type === 'Sharepoint' && source.typeSettings.listUrl) {
            return false;
        } else if (source.type === 'Excel' && source.typeSettings.url && typeof MVD.DataSources.cacheExcelData[source.typeSettings.url] !== 'undefined') {
            return false;
        } else if (source.type === 'External' && Object.keys(source.typeSettings).length > 0) {
            if (source.typeSettings.type === 'External Sharepoint' && source.typeSettings.listGuid) {
                return false;
            }
            else if (source.typeSettings.type === 'DataBase Connection' && source.typeSettings.commandText) {
                return false;
            }
            return false;
        } else if (source.type === 'Complex' && source.typeSettings.sourceOneId && source.typeSettings.sourceTwoId && source.typeSettings.fields.length > 0 &&
            ((source.typeSettings.conditions.length === 0 && ['union', 'cartesian'].includes(source.typeSettings.operator)) ||
                (source.typeSettings.conditions.length > 0 && ['join', 'leftJoin'].includes(source.typeSettings.operator)))) {
            return false;
        } else if (source.type === 'Javascript' && source.typeSettings.sourcesIds.length > 0) {
            return false;
        } else if (source.type === 'Pivot' && source.typeSettings.sourceId) {
            return false;
        }
        return true;
    }
}

MVD.DataSources.UI.btnGetSourceData = function () {
    var source = MVD.DataSources.UI.getSourceSettings();
    if (showError(source)) {
        MVD.SyncfusionUtilities.showToast('La fuente presenta errores en su configuración, revise que tenga los campos completados.');
        return false;
    }
    source.parameters = MVD.DataSources.UI.getParametersRowsSettings();

    let parameters = MVD.DataSources.getAllSourceParameters(source, ['Sharepoint', 'External', 'Excel', 'Javascript'].includes(source.type));
    var auxSource = MVD.DataSources.UI.getSourceSettings();
    auxSource.parameters = MVD.DataSources.UI.getParametersRowsSettings();
    if (source.type === 'Pivot') {
        auxSource = MVD.DataSources.cacheDataSources.find(e => e.id === source.typeSettings.sourceId);
    }
    /*else if (source.type === 'Excel') {
        auxSource.typeSettings.sheet = null;
        if (typeof MVD.DataSources.cacheExcelData[source.typeSettings.url] !== 'undefined') {
            MVD.SyncfusionUtilities.showToast('Los datos ya se encuentran actualizados.');
            return;
        }
    }*/
    try {
        MVD.DataSources.getParametersValues(parameters);
    } catch (args) {
        MVD.SyncfusionUtilities.showToast('Faltan parámetros obligatorios.\n' + args.msg);
        return;
    }

    if (auxSource.typeSettings.fields === null) auxSource.typeSettings.fields = [];
    MVD.SPHelpers.Common.pageLoader(true);
    MVD.DataSources.getSourceData(auxSource, parameters)
        .then(function (data) {
            if (source.type === 'Excel') {
                if (typeof MVD.DataSources.cacheExcelData[source.typeSettings.url] === 'undefined') {
                    MVD.DataSources.cacheExcelData[source.typeSettings.url] = {};
                }
                var sheets = [];
                if (Array.isArray(data)) {
                    sheets.push(source.typeSettings.sheet);
                    MVD.DataSources.cacheExcelData[source.typeSettings.url][source.typeSettings.sheet] = JSON.parse(JSON.stringify(data));
                }
                else {
                    MVD.DataSources.cacheExcelData[source.typeSettings.url] = JSON.parse(JSON.stringify(data));
                    sheets = Object.keys(data);
                    data = (source.typeSettings.indicatorType) ? data[source.typeSettings.sheet] : data[sheets[0]];
                }
                ej.base.getComponent(document.getElementById('excelSheetSelect'), 'dropdownlist').dataSource = sheets;
                ej.base.getComponent(document.getElementById('excelSheetSelect'), 'dropdownlist').value = (source.typeSettings.sheet) ? source.typeSettings.sheet : sheets[0];
            }

            MVD.DataSources.getFields(auxSource)
                .then(function (args) {
                    if (source.type === 'Pivot') {
                        var firstLoadSettings = document.getElementById('pivotSettings').value;
                        if (firstLoadSettings !== '') {
                            source.typeSettings.dataSourceSettings = JSON.parse(firstLoadSettings);
                            document.getElementById('pivotSettings').value = '';
                        }
                        MVD.DataSources.UI.initSyncfusionComponent('pivot', { dataSource: data, dataSourceSettings: source.typeSettings.dataSourceSettings, fields: args.fields });
                    }
                    else {
                        var fields = [];
                        if (source.type === 'Complex') {
                            fields = source.typeSettings.fields;
                        }
                        else if (source.type === 'Javascript') {
                            fields = args.fields;
                        }
                        else if (source.type === 'Excel') {
                            if (source.typeSettings.indicatorType) {

                            } else {
                                fields = args.fields;
                            }
                        }
                        else {
                            var auxType = source.type;
                            if (auxType === 'External') {
                                if (source.typeSettings.type === 'External Sharepoint') {
                                    auxType = 'externalSharepoint';
                                } else if (source.typeSettings.type === 'DataBase Connection') {
                                    auxType = 'externalDataBase';
                                } else {
                                    auxType = 'webService';
                                }
                            }
                            else {
                                auxType = auxType.toLowerCase();
                            }
                            var multiSelectFields = ej.base.getComponent(document.getElementById(auxType + 'Fields'), 'multiselect');
                            var selectedFields = (!multiSelectFields.value || multiSelectFields.value.length === 0) ? [] : multiSelectFields.value;
                            fields = (selectedFields.length === 0) ? multiSelectFields.dataSource : multiSelectFields.dataSource.filter(e => multiSelectFields.value.includes(e.internalName));
                        }
                        var notAllowedUseInUI = args.fields.filter(e => e.allowedUseInUI === false);
                        if (notAllowedUseInUI.length > 0) {
                            fields = fields.concat(args.fields.filter(function (field) {
                                return selectedFields.includes(field.schema.OpenFrom);
                            }));
                            fields = fields.filter(function (field) {
                                return !field.schema.OpenField;
                            })
                        }
                        var columns = processFields(fields);
                        MVD.DataSources.UI.initSyncfusionComponent('grid', { dataSource: data, columns: columns });
                    }
                    MVD.SPHelpers.Common.pageLoader(false);
                })
                .catch(function (msg) {
                    MVD.SyncfusionUtilities.showToast(msg);
                });
        })
        .catch(function (args) {
            var sourceType = ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value;
            document.getElementById('pivotWrapper').style.display = (sourceType === 'Pivot') ? 'block' : 'none';
            document.getElementById('gridWrapper').style.display = (sourceType === 'Pivot') ? 'none' : 'block';
            MVD.DataSources.UI.initSyncfusionComponent('grid');
            MVD.DataSources.UI.initSyncfusionComponent('pivot');
            MVD.SPHelpers.Common.pageLoader(false);
            MVD.SyncfusionUtilities.showToast(args.msg);
            console.error(args);
        });

    function processFields(fields) {
        var columns = [];
        for (var i = 0; i < fields.length; i++) {
            if (fields[i].type === 'DateTime') {
                columns.push({ 'field': fields[i].internalName, 'headerText': fields[i].name, 'type': 'date', 'format': { type: 'date', format: 'dd/MM/yyyy' } });
            } else {
                columns.push({ 'field': fields[i].internalName, 'headerText': fields[i].name });
            }
        }
        return columns;
    }
    function showError(source) {
        if (source.type === 'Sharepoint' && source.typeSettings.listUrl) {
            return false;
        }
        else if (source.type === 'Excel' && source.typeSettings.url) {
            return false;
        }
        else if (source.type === 'External' && Object.keys(source.typeSettings).length > 0) {
            if (source.typeSettings.type === 'External Sharepoint' && source.typeSettings.listGuid) {
                return false;
            } else if (source.typeSettings.type === 'DataBase Connection' && source.typeSettings.commandText) {
                return false;
            }
            return false;
        }
        else if (source.type === 'Complex' && source.typeSettings.sourceOneId && source.typeSettings.sourceTwoId && source.typeSettings.fields.length > 0 &&
            ((source.typeSettings.conditions.length === 0 && ['union', 'cartesian'].includes(source.typeSettings.operator)) ||
                (source.typeSettings.conditions.length > 0 && ['join', 'leftJoin'].includes(source.typeSettings.operator)))) {
            return false;
        }
        else if (source.type === 'Javascript' && source.typeSettings.sourcesIds.length > 0) {
            return false;
        }
        else if (source.type === 'Pivot' && source.typeSettings.sourceId) {
            return false;
        }
        return true;
    };
}

MVD.DataSources.UI.getParametersRowsSettings = function () {
    var source = MVD.DataSources.UI.getSourceSettings();
    var rows = document.getElementById('parameters').children;
    var parameters = [];
    for (var i = 0; i < rows.length; i++) {
        var idParameterRow = rows[i].dataset.idparameterrow;
        var parameter = MVD.DataSources.UI.getRowParametersSettings(idParameterRow, source);
        if (parameter) parameters = parameters.concat(parameter);
    }
    return parameters;
}

MVD.DataSources.UI.getRowParametersSettings = function (idParameterRow, source) {
    var parameters = [];
    var parameter = {};
    var createdName = ej.base.getComponent(document.getElementById('parameterCreatedName' + idParameterRow), 'textbox').value;
    if (source.type === 'Javascript' && !createdName) {
        createdName = 'Parámetro ' + idParameterRow;
        ej.base.getComponent(document.getElementById('parameterCreatedName' + idParameterRow), 'textbox').value = 'Parámetro ' + idParameterRow;
    }
    parameter.field = (source.type === 'Javascript') ? createdName : ej.base.getComponent(document.getElementById('parameterField' + idParameterRow), 'dropdownlist').value;
    parameter.createdName = createdName;
    if (parameter.field == -1 || !parameter.field) {
        document.querySelectorAll('[data-idParameterRow="' + idParameterRow + '"]')[0].remove();
        return null;
    }
    if (!parameter.createdName) {
        parameter.createdName = ej.base.getComponent(document.getElementById('parameterField' + idParameterRow), 'dropdownlist').itemData.name;
    }
    // la propiedad name es el nombre que el usuario le dio en el dashboard.
    //Como aca no ha dashboard se le asigna el nombre de creación. Esto es porque la funcion que hace el render se basa en el nombre que se le da en el dashboard.
    parameter.name = parameter.createdName;
    parameter.allowMultiple = ej.base.getComponent(document.getElementById('parameterAllowMultiple' + idParameterRow), 'checkbox').checked;
    parameter.required = ej.base.getComponent(document.getElementById('parameterRequired' + idParameterRow), 'checkbox').checked;
    parameter.allowNull = ej.base.getComponent(document.getElementById('parameterAllowNull' + idParameterRow), 'checkbox').checked;
    parameter.sourceId = (MVD.DataSources.inEditMode) ? Number(MVD.SPHelpers.Common.getParameterByName('ID')) : -1;
    parameter.visible = true;
    parameter.defaultValue = null;
    try {
        parameter.entryValue = ej.base.getComponent(document.getElementById('parameterEntryValue' + idParameterRow), 'dropdownlist').value;
    } catch (e) {

    }
    parameter.referenceInQuery = ej.base.getComponent(document.getElementById('parameterReferenceInQuery' + idParameterRow), 'textbox').value;
    try {
        parameter.extraConfig = JSON.parse(document.getElementById('parameterExtraConfig' + idParameterRow).value);
    } catch (e) {

    }
    parameter.operator = ej.base.getComponent(document.getElementById('parameterOperator' + idParameterRow), 'dropdownlist').value;
    parameter.type = ej.base.getComponent(document.getElementById('parameterType' + idParameterRow), 'dropdownlist').value;
    if (source.type === 'Sharepoint' || source.type === 'External') {
        var auxSPType = ej.base.getComponent(document.getElementById('parameterField' + idParameterRow), 'dropdownlist').itemData.type;
        if (auxSPType === 'LookupMulti' || auxSPType === 'LookupFieldWithPickerMulti') {
            auxSPType = 'LookupMulti';
        } else if (auxSPType.includes('Lookup')) {
            auxSPType = 'Lookup';
        } else if (auxSPType.includes('Cascading')) {
            auxSPType = 'Text';
        } else if (auxSPType.includes('Calculated')) {
            auxSPType = parameter.extraConfig.resultType;
        }
        parameter.spType = auxSPType;
    }
    if (parameter.type === 'ListDatasource') {
        parameter.extraConfig = {
            sourceId: ej.base.getComponent(document.getElementById('parameterSource' + idParameterRow), 'dropdownlist').value,
            showField: ej.base.getComponent(document.getElementById('parameterFieldShow' + idParameterRow), 'dropdownlist').value,
            valueField: ej.base.getComponent(document.getElementById('parameterFieldValue' + idParameterRow), 'dropdownlist').value
        };
    }
    else if (parameter.type === 'DateTime') {
        parameter.dateType = ej.base.getComponent(document.getElementById('parameterDateType' + idParameterRow), 'dropdownlist').value;
        if (parameter.dateType === 'monthAndYear') {
            var monthName = ej.base.getComponent(document.getElementById('parameterCreatedNameMonth' + idParameterRow), 'textbox').value;
            if (!monthName) {
                monthName = 'Mes ' + parameter.createdName;
            }
            parameter.monthName = monthName;
            parameters.push({
                field: parameter.field,
                createdName: monthName,
                name: monthName,
                allowMultiple: parameter.allowNull,
                required: parameter.required,
                allowNull: parameter.allowNull,
                sourceId: parameter.sourceId,
                visible: parameter.visible,
                defaultValue: parameter.defaultValue,
                type: parameter.type,
                dateType: parameter.dateType,
                dateSubType: 'month',
                operator: parameter.operator
            });
        }
    }
    if (parameter.operator === 'Range') {
        var createdToName = ej.base.getComponent(document.getElementById('parameterCreatedToName' + idParameterRow), 'textbox').value;
        if (!createdToName) {
            createdToName = parameter.createdName + '_2';
        }
        parameter.createdToName = createdToName;
        parameters.push({
            field: parameter.field,
            createdName: createdToName,
            name: createdToName,
            allowMultiple: parameter.allowNull,
            required: parameter.required,
            allowNull: parameter.allowNull,
            sourceId: parameter.sourceId,
            visible: parameter.visible,
            defaultValue: parameter.defaultValue,
            type: parameter.type,
            dateType: parameter.dateType,
            //dateSubType: (parameter.dateType === 'monthAndYear') ? 'month' : null,
            operator: 'ToRange'
        });
        if (parameter.type === 'DateTime' && parameter.dateType === 'monthAndYear') {
            var monthName = ej.base.getComponent(document.getElementById('parameterCreatedToNameMonth' + idParameterRow), 'textbox').value;
            if (!monthName) {
                monthName = 'Mes ' + createdToName;
            }
            parameter.monthName = monthName;
            parameters.push({
                field: parameter.field,
                createdName: monthName,
                name: monthName,
                allowMultiple: parameter.allowNull,
                required: parameter.required,
                allowNull: parameter.allowNull,
                sourceId: parameter.sourceId,
                visible: parameter.visible,
                defaultValue: parameter.defaultValue,
                type: parameter.type,
                dateType: parameter.dateType,
                dateSubType: 'month',
                operator: 'ToRange'
            });
        }
    }
    parameters.unshift(parameter);
    return parameters
}

MVD.DataSources.UI.getSourceSettings = function () {
    var type = ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value;
    var typeSettings = getTypeSettings(type);
    return {
        advancedParameters: ej.base.getComponent(document.getElementById('advancedParameters'), 'checkbox').checked,
        id: (MVD.DataSources.inEditMode) ? Number(MVD.SPHelpers.Common.getParameterByName('ID')) : -1,
        internalUse: ej.base.getComponent(document.getElementById('internalUse'), 'checkbox').checked,
        title: ej.base.getComponent(document.getElementById('sourceTitle'), 'textbox').value,
        type: type,
        typeSettings: typeSettings
    }

    function getTypeSettings() {
        var ret = {};
        if (type === 'Sharepoint') {
            ret.query = ej.base.getComponent(document.getElementById('sharepointQuery'), 'textbox').value;
            ret.listUrl = ej.base.getComponent(document.getElementById('sharepointDataSource'), 'dropdownlist').value;
            var sharepointFields = ej.base.getComponent(document.getElementById('sharepointFields'), 'multiselect');
            var isSelectedAllFields = sharepointFields.value === null || sharepointFields.value.length === 0 || sharepointFields.dataSource.length === sharepointFields.value.length;
            ret.fields = (isSelectedAllFields) ? [] : ej.base.getComponent(document.getElementById('sharepointFields'), 'multiselect').value;
            ret.fieldsToOpen = ej.base.getComponent(document.getElementById('sharepointLookupFieldsToOpen'), 'multiselect').value;
            if (!isSelectedAllFields) {
                ret.fieldsToOpen.forEach(function (field) {
                    if (ret.fields.includes(field) === false) {
                        sharepointFields.value.push(field);
                        sharepointFields.refresh();
                    }
                });
            }
        }
        else if (type === 'Excel') {
            ret.url = ej.base.getComponent(document.getElementById('excelDataSource'), 'textbox').value;
            ret.url = (ret.url) ? ret.url.replace(_spPageContextInfo.siteAbsoluteUrl, '') : ret.url;
            ret.sheet = ej.base.getComponent(document.getElementById('excelSheetSelect'), 'dropdownlist').value;
            ret.indicatorType = ej.base.getComponent(document.getElementById('excelIndicatorType'), 'checkbox').checked;
        }
        else if (type === 'Pivot') {
            ret.sourceId = ej.base.getComponent(document.getElementById('pivotDataSource'), 'dropdownlist').value;
            ret.dataSourceSettings = MVD.DataSources.Pivot.getDataSourceSettings('pivot');
            var rowsLevel = ej.base.getComponent(document.getElementById('rowsLevel'), 'numerictextbox').value;
            var columnsLevel = ej.base.getComponent(document.getElementById('columnsLevel'), 'numerictextbox').value;
            var firstLoadSettings = document.getElementById('pivotSettings').value;
            if (firstLoadSettings === '') {
                if (ret.dataSourceSettings.rows && rowsLevel > ret.dataSourceSettings.rows.length) {
                    rowsLevel = ret.dataSourceSettings.rows.length;
                    ej.base.getComponent(document.getElementById('rowsLevel'), 'numerictextbox').value = ret.dataSourceSettings.rows.length;
                    MVD.SyncfusionUtilities.showToast('El nivel de aperturas de filas fue modificado. \nYa que no puede ser mayor que la cantidad de filas de la pivot.');
                }
                if (ret.dataSourceSettings.columns && columnsLevel > ret.dataSourceSettings.columns.length) {
                    columnsLevel = ret.dataSourceSettings.columns.length;
                    ej.base.getComponent(document.getElementById('columnsLevel'), 'numerictextbox').value = ret.dataSourceSettings.columns.length;
                    MVD.SyncfusionUtilities.showToast('El nivel de aperturas de columnas fue modificado. \nYa que no puede ser mayor que la cantidad de columnas de la pivot.');
                }
            }
            ret.extraSettings = {
                rowsLevel: rowsLevel,
                columnsLevel: columnsLevel,
            }
        }
        else if (type === 'Complex') {
            ret.sourceOneId = ej.base.getComponent(document.getElementById('complexDataSource_1'), 'dropdownlist').value;
            ret.sourceTwoId = ej.base.getComponent(document.getElementById('complexDataSource_2'), 'dropdownlist').value;
            ret.fields = getSelectComplexFields(ret.sourceOneId, ret.sourceTwoId)
            ret.operator = ej.base.getComponent(document.getElementById('complexDataSourceOperator'), 'dropdownlist').value;
            ret.conditions = getComplexConditions(ret.operator);
        }
        else if (type === 'External') {
            var external = ej.base.getComponent(document.getElementById('externalDataSourceConnection'), 'dropdownlist').itemData;
            if (external) {
                ret.dataSourceConnectionId = external.id;
                ret.type = external.type;
                if (ret.type === 'External Sharepoint') {
                    ret.listGuid = ej.base.getComponent(document.getElementById('externalSharepointSPLists'), 'dropdownlist').value;
                    ret.query = ej.base.getComponent(document.getElementById('externalSharepoinQuery'), 'textbox').value;
                    ret.fields = ej.base.getComponent(document.getElementById('externalSharepointFields'), 'multiselect').value;
                }
                else if (ret.type === 'DataBase Connection') {
                    ret.commandType = ej.base.getComponent(document.getElementById('externalDataBaseCommandType'), 'dropdownlist').value;
                    ret.commandText = ej.base.getComponent(document.getElementById('externalDataBaseCommandText'), 'textbox').value;
                    ret.fields = ej.base.getComponent(document.getElementById('externalDataBaseFields'), 'multiselect').value;
                    if (!ret.fields) {
                        ret.fields = [];
                    }
                }
                else {
                    ret.method = ej.base.getComponent(document.getElementById('webServiceMethod'), 'dropdownlist').value;
                    ret.returnRawResponse = ej.base.getComponent(document.getElementById('webServiceReturnRawResponse'), 'checkbox').checked;
                    ret.jsonPath = ej.base.getComponent(document.getElementById('webServiceJsonPath'), 'textbox').value;
                    ret.headers = ej.base.getComponent(document.getElementById('webServiceHeaders'), 'grid').dataSource;
                    ret.queryStringParams = ej.base.getComponent(document.getElementById('webServiceQueryStringParams'), 'grid').dataSource;
                    ret.postParams = ej.base.getComponent(document.getElementById('webServicePostParams'), 'grid').dataSource;
                    ret.fields = ej.base.getComponent(document.getElementById('webServiceFields'), 'multiselect').value;
                    if (!ret.fields) {
                        ret.fields = [];
                    }
                }
            }
        }
        else if (type === 'Javascript') {
            ret.sourcesIds = ej.base.getComponent(document.getElementById('javascriptDataSource'), 'multiselect').value;
            ret.function = document.getElementById('jsFunction').value;
            ret.functionFields = document.getElementById('jsFunctionFields').value;
        }
        return ret;

        function getSelectComplexFields(sourceOneId) {
            var aux = [];
            if (!sourceOneId) {
                MVD.DataSources.sourceFieldsCache = aux;
                return aux;
            }
            var source = MVD.DataSources.cacheDataSources.find(e => e.id == sourceOneId);
            var complexRows = document.getElementsByClassName('complexSelectFieldRow');
            for (var i = 0; i < complexRows.length; i++) {
                var idParameterRow = complexRows[i].getAttribute('data-idComplexRow');
                var field = ej.base.getComponent(document.getElementById('complexSelectField_' + idParameterRow), 'dropdownlist').itemData;
                var label = ej.base.getComponent(document.getElementById('complexSelectFieldLabel_' + idParameterRow), 'textbox').value;
                if (field != null) {
                    //if (field.value === 'ComplexAllFields') {
                    //    aux = [];
                    //    break;
                    //}
                    label = (label) ? label : field.name;
                    let auxField = {
                        internalName: field.internalName,
                        name: label,
                        source: (source.title === field.source) ? 'sourceOne' : 'sourceTwo',
                        type: field.type
                    }
                    if (field.schema) auxField.schema = field.schema;
                    aux.push(auxField);
                }
            }
            MVD.DataSources.sourceFieldsCache = aux;
            return aux;
        }
        function getComplexConditions(operator) {
            //TODO alertar por condiciones con errores. Actualmente se pasa por alto las condiciones que tienen uno o ambos campos vacios. No se mira tipos de campos
            var aux = [];
            if (['union', 'cartesian'].includes(operator)) {
                return aux;
            }
            var complexRows = document.getElementsByClassName('complexConditionRow');
            for (var i = 0; i < complexRows.length; i++) {
                var idParameterRow = complexRows[i].getAttribute('data-idComplexRow');
                var field1 = ej.base.getComponent(document.getElementById('complexDataSourceField1_' + idParameterRow), 'dropdownlist').value;
                var field2 = ej.base.getComponent(document.getElementById('complexDataSourceField2_' + idParameterRow), 'dropdownlist').value;
                if (field1 != null && field2 != null) {
                    aux.push({ field1: field1, field2: field2 });
                }
            }
            return aux;
        }
    }
}

MVD.DataSources.UI.initializePage = function () {
    return new Promise(function (resolve, reject) {
        ej.base.enableRipple(true);
        //var listForm = (document.getElementById('onetIDListForm')) ? document.getElementById('onetIDListForm') : document.getElementById('DeltaPlaceHolderMain');
        var listForm = document.getElementById('onetIDListForm');
        listForm.style.display = 'none';
        //var pageTitle = (document.getElementById('pageContentTitle')) ? document.getElementById('pageContentTitle') : document.getElementById('pageTitle');
        //pageTitle.style.display = 'none';

        var newEl = document.createElement('div');
        newEl.setAttribute('id', 'parentMainContainer');
        document.getElementById('DeltaPlaceHolderMain').append(newEl);

        var req = new XMLHttpRequest();
        req.open('GET', _spPageContextInfo.webAbsoluteUrl + '/SiteAssets/MVD.DataSources/MVD.DataSourcesFormSettings.html', true);
        req.onload = function (e) {
            document.getElementById('parentMainContainer').innerHTML = req.response;
            var sourceTitleObj = new ej.inputs.TextBox({
                placeholder: 'Titulo',
                floatLabelType: 'Auto',
                type: 'text',
                showClearButton: true,
            });
            sourceTitleObj.appendTo('#sourceTitle');

            var checkbox = new ej.buttons.CheckBox({
                label: 'Es de uso interno',
                labelPosition: 'Before',
            });
            checkbox.appendTo('#internalUse');

            var advancedParameters = new ej.buttons.CheckBox({
                label: 'Parámetros avanzados',
                labelPosition: 'Before',
                checked: false,
                change: function (args) {
                    var sourceType = ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value.toLowerCase();
                    var divsToHide = document.querySelectorAll('[class*="AdvancedParameters"]');
                    for (var i = 0; i < divsToHide.length; i++) {
                        divsToHide[i].style.display = (divsToHide[i].classList.contains(sourceType + 'AdvancedParameters') && args.checked) ? 'flex' : 'none';
                    }
                    if (args.event) {
                        document.getElementById('parameters').innerHTML = '';
                        document.getElementById('parametersPreView').innerHTML = '';
                    }
                }
            });
            advancedParameters.appendTo('#advancedParameters');

            var btnGetSourceDataSettings = {
                content: 'Actualizar datos',
                cssClass: 'e-small e-info',
                iconCss: 'e-icons e-reload',
            };
            new ej.buttons.Button(btnGetSourceDataSettings, '#btnGetSourceData');

            var btnAddParameterRowSettings = {
                content: 'Parámetro',
                cssClass: 'e-small e-info',
                iconCss: 'e-icons e-add',
            };
            new ej.buttons.Button(btnAddParameterRowSettings, '#btnAddParameterRowSettings');

            var options = document.querySelector('select[id^="Type_"]').children;
            var sourceTypes = [];
            for (var i = 0; i < options.length; i++) {
                if (options[i].text === 'Complex') sourceTypes.push({ text: 'Compleja', value: options[i].text });
                else if (options[i].text === 'External') sourceTypes.push({ text: 'Externa', value: options[i].text });
                else sourceTypes.push({ text: options[i].text, value: options[i].text });
            }
            var sourceTypeObj = new ej.dropdowns.DropDownList({
                placeholder: 'Tipo de fuente',
                floatLabelType: 'Auto',
                fields: { text: 'text', value: 'value' },
                dataSource: sourceTypes,
                value: sourceTypes[0].value,
                change: function (args) {
                    //document.getElementById('error').value = '';
                    //document.getElementById('error').style.display = 'block';
                    var divsToHide = document.getElementById('sourceTypeSettings').children;
                    for (var i = 0; i < divsToHide.length; i++) {
                        divsToHide[i].style.display = (divsToHide[i].classList.contains(args.value.toLowerCase() + 'DataSource')) ? 'flex' : 'none';
                    }
                    document.getElementById('advancedParametersWrapper').style.display = (args.value === 'Sharepoint') ? 'flex' : 'none';
                    document.getElementById('pivotWrapper').style.display = (args.value === 'Pivot') ? 'block' : 'none';
                    document.getElementById('gridWrapper').style.display = (args.value === 'Pivot') ? 'none' : 'block';
                    document.getElementById('btnAddParameterRowSettings').style.display = (args.value === 'Pivot' || args.value === 'Complex') ? 'none' : 'inline';
                    if (args.isInteracted) {
                        ej.base.getComponent(document.getElementById('pivotDataSource'), 'dropdownlist').value = null;
                        ej.base.getComponent(document.getElementById('sharepointDataSource'), 'dropdownlist').value = null;
                        ej.base.getComponent(document.getElementById('excelDataSource'), 'textbox').value = null;
                        ej.base.getComponent(document.getElementById('externalDataSourceConnection'), 'dropdownlist').value = null;

                        var advancedParametersObj = ej.base.getComponent(document.getElementById('advancedParameters'), 'checkbox');
                        advancedParametersObj.checked = false;
                        advancedParametersObj.change({ checked: false });
                        ej.base.getComponent(document.getElementById('excelIndicatorType'), 'checkbox').checked = false;
                        document.getElementById('parameters').innerHTML = '';
                        document.getElementById('parametersPreView').innerHTML = '';
                        MVD.DataSources.UI.initSyncfusionComponent('grid');
                        MVD.DataSources.UI.initSyncfusionComponent('pivot');
                    }
                }
            });
            sourceTypeObj.appendTo('#sourceType');

            MVD.DataSources.UI.initSyncfusionComponent('grid');
            MVD.DataSources.UI.initSyncfusionComponent('pivot');

            resolve();
        }
        req.onerror = function (e) { reject(e); }
        req.send();
    });
}

MVD.DataSources.UI.initComplexJavascriptAndPivotDataSourceConfig = function () {
    return new Promise(function (resolve, reject) {
        //INIT COMPLEX
        var complexDataSourcesObj = new ej.dropdowns.DropDownList({
            locale: 'es',
            placeholder: 'Primera fuente de datos',
            filterBarPlaceholder: 'Buscar',
            allowFiltering: true,
            floatLabelType: 'Auto',
            fields: { value: 'id', text: 'title' },
            dataSource: MVD.DataSources.cacheDataSources.filter(e => e.id != MVD.SPHelpers.Common.getQueryParam('ID')),
            showClearButton: true,
            change: function (args) {
                if (args.isInteracted) {
                    MVD.DataSources.UI.onChangeComplexDataSource();
                }
            },
            filtering: function (args) {
                var dropdownQuery = new ej.data.Query();
                dropdownQuery = (args.text !== '') ? dropdownQuery.where('title', 'contains', args.text, true) : dropdownQuery;
                args.updateData(MVD.DataSources.cacheDataSources, dropdownQuery);
            }
        });
        complexDataSourcesObj.appendTo('#complexDataSource_1');

        var complexDataSourcesFieldObj = new ej.dropdowns.DropDownList({
            locale: 'es',
            cssClass: 'complexDataSourceField',
            placeholder: 'Campo de la primera fuente de datos',
            floatLabelType: 'Auto',
            fields: { value: 'internalName', text: 'name' },
            showClearButton: true
        });
        complexDataSourcesFieldObj.appendTo('#complexDataSourceField1_0');

        var complexDataSourcesOperatorObj = new ej.dropdowns.DropDownList({
            placeholder: 'Operador',
            fields: { value: 'value', text: 'text' },
            dataSource: [{ value: 'join', text: 'Join' }, { value: 'leftJoin', text: 'Left Join' }, { value: 'union', text: 'Unión' }, { value: 'cartesian', text: 'Cartesiano' }],
            floatLabelType: 'Auto',
            value: 'join',
            change: function (args) {
                document.getElementById('complexConditionsWrapper').style.display = (['union', 'cartesian'].includes(args.value)) ? 'none' : 'block';
            }
        });
        complexDataSourcesOperatorObj.appendTo('#complexDataSourceOperator');

        var complexDataSourcesObj2 = new ej.dropdowns.DropDownList({
            locale: 'es',
            placeholder: 'Segunda fuente de datos',
            filterBarPlaceholder: 'Buscar',
            allowFiltering: true,
            floatLabelType: 'Auto',
            fields: { value: 'id', text: 'title' },
            dataSource: MVD.DataSources.cacheDataSources,
            showClearButton: true,
            change: function (args) {
                if (args.isInteracted) {
                    MVD.DataSources.UI.onChangeComplexDataSource();
                }
            },
            filtering: function (args) {
                var dropdownQuery = new ej.data.Query();
                dropdownQuery = (args.text !== '') ? dropdownQuery.where('title', 'contains', args.text, true) : dropdownQuery;
                args.updateData(MVD.DataSources.cacheDataSources, dropdownQuery);
            }
        });
        complexDataSourcesObj2.appendTo('#complexDataSource_2');

        var complexDataSourcesFieldObj2 = new ej.dropdowns.DropDownList({
            locale: 'es',
            cssClass: 'complexDataSourceField',
            placeholder: 'Campo de la segunda fuente de datos',
            floatLabelType: 'Auto',
            fields: { value: 'internalName', text: 'name' },
            showClearButton: true
        });
        complexDataSourcesFieldObj2.appendTo('#complexDataSourceField2_0');

        var complexSelectField = new ej.dropdowns.DropDownList({
            locale: 'es',
            cssClass: 'complexDataSourceSelectField',
            placeholder: 'Campo a mostrar',
            floatLabelType: 'Auto',
            fields: { groupBy: 'source', text: 'name', value: 'value' },
            showClearButton: true,
            valueTemplate: '<div style="width:100%;height:100%;">' +
                '<div style="font-size: x-small"> ${source}</div>' +
                '<div> ${name}</div></div>',
        });
        complexSelectField.appendTo('#complexSelectField_0');

        var btnAddComplexConditionRowObj = new ej.buttons.Button({
            cssClass: 'e-small e-success e-round',
            iconCss: 'e-icons e-add',
        });
        btnAddComplexConditionRowObj.appendTo('#btnAddComplexConditionRow');

        var complexSelectFieldLabel = new ej.inputs.TextBox({
            placeholder: 'Etiqueta',
            floatLabelType: 'Auto',
            type: 'text',
            showClearButton: true,
            cssClass: 'complexSelectFieldWrapper'
        });
        complexSelectFieldLabel.appendTo('#complexSelectFieldLabel_0');

        var btnAddComplexSelectFieldRowObj = new ej.buttons.Button({
            cssClass: 'e-small e-success e-round',
            iconCss: 'e-icons e-add',
        });
        btnAddComplexSelectFieldRowObj.appendTo('#btnAddComplexSelectFieldRow');


        //INIT PIVOT
        var pivotDataSourceObj = new ej.dropdowns.DropDownList({
            locale: 'es',
            placeholder: 'Fuente de datos',
            filterBarPlaceholder: 'Buscar',
            allowFiltering: true,
            floatLabelType: 'Auto',
            fields: { value: 'id', text: 'title' },
            dataSource: MVD.DataSources.cacheDataSources.filter(e => e.id != MVD.SPHelpers.Common.getQueryParam('ID')),
            showClearButton: true,
            change: function (args) {
                if (args.isInteracted) {
                    document.getElementById('parameters').innerHTML = '';
                    document.getElementById('parametersPreView').innerHTML = '';
                    MVD.DataSources.UI.initSyncfusionComponent('pivot');
                    if (args.value) {
                        var parameters = MVD.DataSources.getAllSourceParameters(args.itemData);
                        for (var i = 0; i < parameters.length; i++) {
                            var div = document.createElement('div');
                            var renderId = MVD.DataSources.getParameterRenderId(parameters[i]);
                            div.setAttribute('id', renderId + 'PanelWrapper');
                            document.getElementById('parametersPreView').append(div);
                            MVD.DataSources.renderParameter(parameters[i], renderId + 'PanelWrapper');
                        }
                    }
                }
            },
            filtering: function (args) {
                var dropdownQuery = new ej.data.Query();
                dropdownQuery = (args.text !== '') ? dropdownQuery.where('title', 'contains', args.text, true) : dropdownQuery;
                args.updateData(MVD.DataSources.cacheDataSources, dropdownQuery);
            }
        });
        pivotDataSourceObj.appendTo('#pivotDataSource');

        var columnsLevel = new ej.inputs.NumericTextBox({
            locale: 'es',
            placeholder: 'Nivel de apertura de las columnas',
            floatLabelType: 'Auto',
            decimals: 0,
            min: 0,
            max: 8,
            format: '###.##',
            value: 0
        });
        columnsLevel.appendTo('#columnsLevel');

        var rowsLevel = new ej.inputs.NumericTextBox({
            locale: 'es',
            placeholder: 'Nivel de apertura de las filas',
            floatLabelType: 'Auto',
            decimals: 0,
            min: 0,
            max: 10,
            format: '###.##',
            value: 0
        });
        rowsLevel.appendTo('#rowsLevel');


        //INIT JAVASCRIPT
        var javascriptDataSourceObj = new ej.dropdowns.MultiSelect({
            dataSource: MVD.DataSources.cacheDataSources.filter(e => e.id != MVD.SPHelpers.Common.getQueryParam('ID')),
            fields: { text: 'title', value: 'id' },
            placeholder: 'Fuentes',
            mode: 'CheckBox',
            showSelectAll: false,
            showDropDownIcon: true,
            filterBarPlaceholder: 'Búsqueda de fuente',
            popupHeight: '350px',
            change: function (args) {
                if (args.isInteracted) {
                    document.getElementById('parameters').innerHTML = '';
                    document.getElementById('parametersPreView').innerHTML = '';
                    MVD.DataSources.UI.initSyncfusionComponent('grid');
                    for (var i = 0; i < args.value.length; i++) {
                        var source = MVD.DataSources.cacheDataSources.find(element => element.id == args.value[i]);
                        var allParameters = MVD.DataSources.getAllSourceParameters(source);
                        for (var j = 0; j < allParameters.length; j++) {
                            var div = document.createElement('div');
                            var renderId = MVD.DataSources.getParameterRenderId(allParameters[j]);
                            div.setAttribute('id', renderId + 'PanelWrapper');
                            document.getElementById('parametersPreView').append(div);
                            MVD.DataSources.renderParameter(allParameters[j], renderId + 'PanelWrapper');
                        }
                    }
                }
            }
        });
        javascriptDataSourceObj.appendTo('#javascriptDataSource');
        resolve();
    });
}

MVD.DataSources.UI.initExternalDataSourceConfig = function () {
    return new Promise(function (resolve, reject) {
        var externalDataSourcesObj = new ej.dropdowns.DropDownList({
            locale: 'es',
            placeholder: 'Conexión externa',
            filterBarPlaceholder: 'Búsqueda de conexión',
            allowFiltering: true,
            floatLabelType: 'Auto',
            fields: { value: 'id', text: 'title' },
            dataSource: MVD.DataSources.cacheExternalDataSources,
            showClearButton: true,
            change: function (args) {
                var type = null;
                if (args.value) {
                    var external = MVD.DataSources.cacheExternalDataSources.find(e => e.id === args.value);
                    type = external.type.replace(/ /g, '');
                }
                var divs = document.getElementsByClassName('externalDataSource')[0].querySelectorAll('div[data-type]');
                for (var i = 0; i < divs.length; i++) {
                    divs[i].style.display = (divs[i].dataset.type === type) ? 'flex' : 'none';
                }
                if (args.isInteracted) {
                    document.getElementById('parameters').innerHTML = '';
                    document.getElementById('parametersPreView').innerHTML = '';
                    MVD.DataSources.UI.initSyncfusionComponent('grid');
                    if (args.value) {
                        document.getElementById('advancedParametersWrapper').style.display = (external.type === 'External Sharepoint') ? 'flex' : 'none';
                        if (external.type === 'External Sharepoint') {
                            var externalSPListsDropDown = ej.base.getComponent(document.getElementById('externalSharepointSPLists'), 'dropdownlist');
                            if (external.SPLists) {
                                externalSPListsDropDown.dataSource = external.SPLists;
                            } else {
                                MVD.SPHelpers.Common.pageLoader(true);
                                MVD.DataSources.External.getSPLists(args.value)
                                    .then(function (externalLists) {
                                        if (externalLists.length === 0) {
                                            MVD.SyncfusionUtilities.showToast('El sitio externo no compartio ninguna lista.');
                                        }
                                        external.SPLists = externalLists;
                                        externalSPListsDropDown.dataSource = external.SPLists;
                                    })
                                    .catch(function (args) {
                                        MVD.SyncfusionUtilities.showToast(args.msg);
                                        console.error(args);
                                    })
                                    .finally(function () { MVD.SPHelpers.Common.pageLoader(false); });
                            }
                        }
                        else {
                            ej.base.getComponent(document.getElementById('advancedParameters'), 'checkbox').checked = true;
                        }
                    }
                }
            },
            filtering: function (args) {
                var dropdown_query = new ej.data.Query();
                dropdown_query = (args.text !== '') ? dropdown_query.where('title', 'contains', args.text, true) : dropdown_query;
                args.updateData(MVD.DataSources.cacheExternalDataSources, dropdown_query);
            }
        });
        externalDataSourcesObj.appendTo('#externalDataSourceConnection');

        var externalSharepointSPListsObj = new ej.dropdowns.DropDownList({
            placeholder: 'Listas del sitio',
            filterBarPlaceholder: 'Buscar',
            allowFiltering: true,
            floatLabelType: 'Auto',
            fields: { value: 'guid', text: 'name' },
            locale: 'es',
            dataSource: [],
            showClearButton: true,
            change: function (args) {
                if (args.isInteracted) {
                    document.getElementById('parameters').innerHTML = '';
                    document.getElementById('parametersPreView').innerHTML = '';
                    MVD.DataSources.UI.initSyncfusionComponent('grid');
                    if (args.value) {
                        var source = MVD.DataSources.UI.getSourceSettings();
                        var external = MVD.DataSources.cacheExternalDataSources.find(e => e.id === source.typeSettings.dataSourceConnectionId);
                        var SPLists = external.SPLists.find(e => e.guid === args.value);
                        if (SPLists.fields) {
                            ej.base.getComponent(document.getElementById('externalSharepointFields'), 'multiselect').dataSource = SPLists.fields;
                        } else {
                            MVD.SPHelpers.Common.pageLoader(true);
                            MVD.DataSources.getFields(source)
                                .then(function (args) {
                                    ej.base.getComponent(document.getElementById('externalSharepointFields'), 'multiselect').dataSource = args.fields;
                                })
                                .catch(function (args) { console.error(args) })
                                .finally(function () { MVD.SPHelpers.Common.pageLoader(false); });
                        }
                    } else {
                        // ej.base.getComponent(document.getElementById('sharepointFields'), 'multiselect').dataSource = [];
                    }
                }
            },
            filtering: function (args) {
                var dataSource = ej.base.getComponent(document.getElementById('externalSharepointSPLists'), 'dropdownlist').dataSource;
                var dropdown_query = new ej.data.Query();
                dropdown_query = (args.text !== '') ? dropdown_query.where('name', 'contains', args.text, true) : dropdown_query;
                args.updateData(dataSource, dropdown_query);
            }
        });
        externalSharepointSPListsObj.appendTo('#externalSharepointSPLists');

        var externalSharepointFieldsObj = new ej.dropdowns.MultiSelect({
            dataSource: [],
            locale: 'es',
            fields: { text: 'name', value: 'internalName' },
            floatLabelType: 'Auto',
            placeholder: 'Campos a traer',
            mode: 'CheckBox',
            showSelectAll: true,
            selectAllText: 'Seleccionar todos',
            unSelectAllText: 'Deseleccionar todos',
            showDropDownIcon: true,
            popupHeight: '350px',
        });
        externalSharepointFieldsObj.appendTo('#externalSharepointFields');

        var externalSharepoinQueryObj = new ej.inputs.TextBox({
            placeholder: 'Query',
            floatLabelType: 'Auto',
            type: 'text',
            showClearButton: true,
            multiline: true,
            input: function () {
                this.element.style.height = 'auto';
                this.element.style.height = (this.element.scrollHeight) + "px";
            }
        });
        externalSharepoinQueryObj.appendTo('#externalSharepoinQuery');

        var externalDataBaseCommandTypeObj = new ej.dropdowns.DropDownList({
            placeholder: 'Tipo de consulta',
            floatLabelType: 'Auto',
            fields: { value: 'value', text: 'text' },
            locale: 'es',
            dataSource: [{ value: 'text', text: 'Query' }, { value: 'storedprocedure', text: 'Stored Procedure' }],
            value: 'text',
            change: function (args) {
                document.getElementById('externalDataBaseFieldsWrapper').style.display = (args.value === 'text') ? 'none' : 'flex';
                document.getElementById('externalDataBaseStoreProcedureWrapper').style.display = (args.value === 'text') ? 'none' : 'flex';
                if (args.isInteracted) {
                    document.getElementById('parameters').innerHTML = '';
                    document.getElementById('parametersPreView').innerHTML = '';
                    MVD.DataSources.UI.initSyncfusionComponent('grid');
                    ej.base.getComponent(document.getElementById('externalDataBaseCommandText'), 'textbox').value = '';
                    ej.base.getComponent(document.getElementById('externalDataBaseFields'), 'multiselect').dataSource = [];
                    ej.base.getComponent(document.getElementById('externalDataBaseFields'), 'multiselect').value = [];
                }
            }
        });
        externalDataBaseCommandTypeObj.appendTo('#externalDataBaseCommandType');

        var externalDataBaseCommandTextObj = new ej.inputs.TextBox({
            placeholder: 'Consulta',
            floatLabelType: 'Auto',
            type: 'text',
            showClearButton: true,
            multiline: true,
            input: function () {
                this.element.style.height = 'auto';
                this.element.style.height = (this.element.scrollHeight) + 'px';
            },
            change: function () {
                ej.base.getComponent(document.getElementById('externalDataBaseFields'), 'multiselect').dataSource = [];
            }
        });
        externalDataBaseCommandTextObj.appendTo('#externalDataBaseCommandText');

        var externalDataBaseStoreProcedureObj = new ej.inputs.TextBox({
            placeholder: 'Nombre del procedimiento',
            floatLabelType: 'Auto',
            type: 'text',
            showClearButton: true,
            change: function () {
                console.log('change');
                ej.base.getComponent(document.getElementById('externalDataBaseFields'), 'multiselect').dataSource = [];
            }
        });
        externalDataBaseStoreProcedureObj.appendTo('#externalDataBaseStoreProcedure');

        var externalDataBaseFieldsObj = new ej.dropdowns.MultiSelect({
            dataSource: [],
            locale: 'es',
            value: [],
            fields: { text: 'name', value: 'internalName' },
            floatLabelType: 'Auto',
            placeholder: 'Campos a traer',
            mode: 'CheckBox',
            showSelectAll: true,
            selectAllText: 'Seleccionar todos',
            unSelectAllText: 'Deseleccionar todos',
            showDropDownIcon: true,
            popupHeight: '350px',
        });
        externalDataBaseFieldsObj.appendTo('#externalDataBaseFields');

        var webServiceMethodObj = new ej.dropdowns.DropDownList({
            placeholder: 'Tipo de consulta',
            floatLabelType: 'Auto',
            fields: { value: 'value', text: 'text' },
            locale: 'es',
            dataSource: [{ value: 'GET', text: 'GET' }, { value: 'POST', text: 'POST' }],
            value: 'POST',
        });
        webServiceMethodObj.appendTo('#webServiceMethod');

        var webServiceReturnRawResponseObj = new ej.buttons.CheckBox({
            label: 'Retornar raw response',
            labelPosition: 'Before',
        });
        webServiceReturnRawResponseObj.appendTo('#webServiceReturnRawResponse');

        var webServiceJsonPathObj = new ej.inputs.TextBox({
            placeholder: 'jsonPath',
            floatLabelType: 'Auto',
            type: 'text',
            showClearButton: true,
        });
        webServiceJsonPathObj.appendTo('#webServiceJsonPath');

        var webServiceFieldsObj = new ej.dropdowns.MultiSelect({
            dataSource: [],
            locale: 'es',
            fields: { text: 'name', value: 'internalName' },
            floatLabelType: 'Auto',
            placeholder: 'Campos a traer',
            mode: 'CheckBox',
            showSelectAll: true,
            selectAllText: 'Seleccionar todos',
            unSelectAllText: 'Deseleccionar todos',
            showDropDownIcon: true,
            popupHeight: '350px',
        });
        webServiceFieldsObj.appendTo('#webServiceFields');

        MVD.DataSources.UI.initSyncfusionComponent('webServiceHeaders');
        MVD.DataSources.UI.initSyncfusionComponent('webServiceQueryStringParams');
        MVD.DataSources.UI.initSyncfusionComponent('webServicePostParams');
        resolve();
    });
}

MVD.DataSources.UI.initSharepointDataSourceSettings = function () {
    return new Promise(function (resolve, reject) {
        MVD.SPHelpers.ListItems.getAllLists(_spPageContextInfo.siteServerRelativeUrl)
            .then(function (allLists) {
                MVD.DataSources.cacheSherpointLists = [];
                for (var keyList in allLists) {
                    if (['/siteassets', '/style library'].includes(keyList)) continue;
                    MVD.DataSources.cacheSherpointLists.push({ value: allLists[keyList].listUrl, text: allLists[keyList].title });
                }

                var sharepointDataSourcesObj = new ej.dropdowns.DropDownList({
                    locale: 'es',
                    placeholder: 'Listas del sitio',
                    filterBarPlaceholder: 'Buscar',
                    allowFiltering: true,
                    floatLabelType: 'Auto',
                    fields: { value: 'value', text: 'text' },
                    dataSource: MVD.DataSources.cacheSherpointLists,
                    showClearButton: true,
                    change: function (args) {
                        if (args.isInteracted) {
                            document.getElementById('parameters').innerHTML = '';
                            document.getElementById('parametersPreView').innerHTML = '';
                            MVD.DataSources.UI.initSyncfusionComponent('grid');
                            if (args.value) {
                                var source = MVD.DataSources.UI.getSourceSettings();
                                MVD.DataSources.getFields(source)
                                    .then(function (args) {
                                        var fields = args.fields.filter(function (e) { return e.allowedUseInUI });
                                        var sharepointFields = ej.base.getComponent(document.getElementById('sharepointFields'), 'multiselect');
                                        sharepointFields.dataSource = fields;
                                        sharepointFields.value = fields.map(e => e.internalName);

                                        var fieldsToOpen = fields.filter(function (e) { return ['UserMulti', 'LookupMulti'].includes(e.type) });
                                        var sharepointLookupFieldsToOpen = ej.base.getComponent(document.getElementById('sharepointLookupFieldsToOpen'), 'multiselect');
                                        sharepointLookupFieldsToOpen.dataSource = fieldsToOpen;
                                        sharepointLookupFieldsToOpen.value = [];
                                    })
                                    .catch(function (args) { console.error(args) });
                            } else {
                                ej.base.getComponent(document.getElementById('sharepointFields'), 'multiselect').dataSource = [];
                            }
                        }
                    },
                    filtering: function (args) {
                        var dropdownQuery = new ej.data.Query();
                        dropdownQuery = (args.text !== '') ? dropdownQuery.where('text', 'contains', args.text, true) : dropdownQuery;
                        args.updateData(MVD.DataSources.cacheSherpointLists, dropdownQuery);
                    }
                });
                sharepointDataSourcesObj.appendTo('#sharepointDataSource');

                var sharepointQueryObj = new ej.inputs.TextBox({
                    placeholder: 'Query',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true,
                    multiline: true,
                    input: function () {
                        this.element.style.height = 'auto';
                        this.element.style.height = (this.element.scrollHeight) + 'px';
                    },
                });
                sharepointQueryObj.appendTo('#sharepointQuery');

                var sharepointFieldsObj = new ej.dropdowns.MultiSelect({
                    dataSource: [],
                    locale: 'es',
                    fields: { text: 'name', value: 'internalName' },
                    floatLabelType: 'Auto',
                    placeholder: 'Campos a mostrar',
                    mode: 'CheckBox',
                    showSelectAll: true,
                    selectAllText: 'Seleccionar todos',
                    unSelectAllText: 'Deseleccionar todos',
                    showDropDownIcon: true,
                    popupHeight: '350px',
                });
                sharepointFieldsObj.appendTo('#sharepointFields');

                var sharepointLookupFieldsToOpenObj = new ej.dropdowns.MultiSelect({
                    dataSource: [],
                    locale: 'es',
                    fields: { text: 'name', value: 'internalName' },
                    floatLabelType: 'Auto',
                    placeholder: 'Apertura de filas por',
                    mode: 'CheckBox',
                    showSelectAll: true,
                    selectAllText: 'Seleccionar todos',
                    unSelectAllText: 'Deseleccionar todos',
                    showDropDownIcon: true,
                    popupHeight: '350px',
                });
                sharepointLookupFieldsToOpenObj.appendTo('#sharepointLookupFieldsToOpen');
                resolve();
            });
    });
}

MVD.DataSources.UI.initSpreadsheetDataSourceConfig = function () {
    return new Promise(function (resolve, reject) {
        MVD.DataSources.cacheExcelData = {};
        var excelDataSourcesObj = new ej.inputs.TextBox({
            placeholder: 'URL',
            floatLabelType: 'Auto',
            type: 'text',
            showClearButton: true,
            change: function (args) {
                if (args.isInteracted) {
                    document.getElementById('parameters').innerHTML = '';
                    document.getElementById('parametersPreView').innerHTML = '';
                    MVD.DataSources.UI.initSyncfusionComponent('grid');
                    ej.base.getComponent(document.getElementById('excelSheetSelect'), 'dropdownlist').dataSource = [];
                    ej.base.getComponent(document.getElementById('excelSheetSelect'), 'dropdownlist').value = null;
                }
            }
        });
        excelDataSourcesObj.appendTo('#excelDataSource');

        var excelSheetSelectObj = new ej.dropdowns.DropDownList({
            placeholder: 'Hoja',
            floatLabelType: 'Auto',
            fields: { value: 'value', text: 'text' },
            change: function (args) {
                var source = MVD.DataSources.UI.getSourceSettings();
                if (typeof args.value === 'undefined' || !args.value || typeof MVD.DataSources.cacheExcelData[source.typeSettings.url] === 'undefined') return;
                var fields = MVD.DataSources.Excel.getSheetFields(MVD.DataSources.cacheExcelData[source.typeSettings.url][args.value]);
                var excelFields = ej.base.getComponent(document.getElementById('excelFields'), 'multiselect');
                excelFields.dataSource = fields;
                excelFields.value = fields.map(e => e.internalName);
                if (args.isInteracted) {
                    if (!source.typeSettings.indicatorType) {
                        document.getElementById('parameters').innerHTML = '';
                        document.getElementById('parametersPreView').innerHTML = '';
                    }
                    var columns = processFields(fields);
                    MVD.DataSources.UI.initSyncfusionComponent('grid', { dataSource: MVD.DataSources.cacheExcelData[source.typeSettings.url][args.value], columns: columns });
                }
            }
        });
        excelSheetSelectObj.appendTo('#excelSheetSelect');
        function processFields(fields) {
            var columns = [];
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].type === 'DateTime') {
                    columns.push({ 'field': fields[i].internalName, 'headerText': fields[i].name, 'type': 'date', 'format': { type: 'date', format: 'dd/MM/yyyy' } });
                } else {
                    columns.push({ 'field': fields[i].internalName, 'headerText': fields[i].name });
                }
            }
            return columns;
        }
        var excelIndicatorTypeObj = new ej.buttons.CheckBox({
            label: 'Tipo excel indicadores',
            labelPosition: 'Before',
            checked: false,
            change: function (args) {
                if (args.event) {
                    document.getElementById('parameters').innerHTML = '';
                    document.getElementById('parametersPreView').innerHTML = '';
                }
            }
        });
        excelIndicatorTypeObj.appendTo('#excelIndicatorType');

        var excelFields = new ej.dropdowns.MultiSelect({
            dataSource: [],
            locale: 'es',
            fields: { text: 'name', value: 'internalName' },
            floatLabelType: 'Auto',
            placeholder: 'Campos a mostrar',
            mode: 'CheckBox',
            showSelectAll: true,
            selectAllText: 'Seleccionar todos',
            unSelectAllText: 'Deseleccionar todos',
            showDropDownIcon: true,
            popupHeight: '350px',
        });
        excelFields.appendTo('#excelFields');

        resolve();
    });
}

MVD.DataSources.UI.initSyncfusionComponent = function (elementId, extraSettings) {
    if (extraSettings) {
        extraSettings = JSON.parse(JSON.stringify(extraSettings));
    };
    if (elementId === 'grid') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div id="' + elementId + '"></div>';
        var settings = {
            locale: 'es',
            dataSource: [],
            allowReordering: true,
            allowPaging: true,
            pageSettings: { pageSize: 15 },
            allowSorting: true,
            allowGrouping: true,
            allowResizing: true,
            allowScrolling: true,
            allowFiltering: true,
            filterSettings: { type: 'Excel' },
            editSettings: { allowEditing: false, allowAdding: false, allowDeleting: false },
            showColumnChooser: true,
            toolbar: ['ColumnChooser'],
            actionComplete: function (args) {
                if (args.requestType === 'columnstate') {
                    this.refreshColumns();
                }
            },
            beforeDataBound: function (args) {
                MVD.DataSources.dataBound = false;
            },
            dataBound: function (args) {
                if (!MVD.DataSources.dataBound) {
                    this.autoFitColumns();
                    MVD.DataSources.dataBound = true;
                }
            },
        };
        if (extraSettings && extraSettings.columns) {
            settings.columns = extraSettings.columns;
        }
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSource = extraSettings.dataSource;
        }
        var grid = new ej.grids.Grid(settings);
        grid.appendTo('#' + elementId);
    }
    else if (elementId === 'pivot') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div><div id="' + elementId + '"></div></div>';
        var settings = {
            locale: 'es',
            height: 450,
            width: '100%',
            dataSourceSettings: {
                enableSorting: true,
                valueSortSettings: { headerDelimiter: " - " },
                dataSource: [],
                expandAll: false
            },
            showFieldList: true,
            allowCalculatedField: true,
            load: function (args) {
                MVD.DataSources.enginePopulated = false;
                //if (MVD.DataSources.enginePopulated === true) {
                //    MVD.DataSources.enginePopulated = false;
                //}
            },
            enginePopulated: function (args) {
                if (extraSettings && extraSettings.fields) {
                    var obj = this.engineModule.fieldList;
                    for (var key in obj) {
                        if (obj[key].aggregateType === 'CalculatedField') continue;
                        if (obj.hasOwnProperty(key)) {
                            var field = extraSettings.fields.find(e => e.internalName === obj[key].id);
                            if (typeof field !== 'undefined') {
                                obj[key].caption = field.name;
                            } else {
                                delete obj[key];
                            }
                        }
                    }
                }

            }
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSourceSettings.dataSource = extraSettings.dataSource;
        }
        if (extraSettings && extraSettings.dataSourceSettings) {
            for (var key in extraSettings.dataSourceSettings) {
                if (['showSubTotals', 'showRowSubTotals', 'showColumnSubTotals', 'showGrandTotals', 'showRowGrandTotals', 'showColumnGrandTotals'].includes(key)) {
                    settings[key] = extraSettings.dataSourceSettings[key];
                } else {
                    settings.dataSourceSettings[key] = extraSettings.dataSourceSettings[key];
                }

            }
        }
        var pivot = new ej.pivotview.PivotView(settings);
        pivot.appendTo('#' + elementId);
    }
    else if (elementId === 'webServicePostParams' || elementId === 'webServiceQueryStringParams' || elementId === 'webServiceHeaders') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div id="' + elementId + '"></div>';
        var settings = {
            toolbar: ['Add', 'Edit', 'Update', 'Cancel', 'Delete'],
            locale: 'es',
            dataSource: [],
            allowPaging: true,
            pageSettings: { pageSize: 5 },
            allowSorting: true,
            sortSettings: { columns: [{ field: 'name', direction: 'Ascending' }] },
            columns: [{ field: 'id', isPrimaryKey: true, visible: false }, { field: 'name', headerText: 'Nombre' }, { field: 'value', headerText: 'Valor' }],
            editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
            actionComplete: function (args) {
                if (args.requestType === 'add') {
                    args.rowData.id = Math.floor(Math.random() * 1000000);
                }
            }
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSource = extraSettings.dataSource;
        }
        var grid = new ej.grids.Grid(settings);
        grid.appendTo('#' + elementId);
    }
}

MVD.DataSources.UI.onChangeComplexDataSource = function () {
    return new Promise(function (resolve, reject) {
        MVD.SPHelpers.Common.pageLoader(true);
        document.getElementById('parameters').innerHTML = '';
        document.getElementById('parametersPreView').innerHTML = '';
        MVD.DataSources.UI.initSyncfusionComponent('grid');

        var sourceOneId = ej.base.getComponent(document.getElementById('complexDataSource_1'), 'dropdownlist').value;
        var sourceTwoId = ej.base.getComponent(document.getElementById('complexDataSource_2'), 'dropdownlist').value;
        if (sourceOneId && sourceOneId === sourceTwoId) {
            ej.base.getComponent(document.getElementById('complexDataSource_2'), 'dropdownlist').value = null;
            sourceTwoId = null;
        }
        var sourceOne = MVD.DataSources.cacheDataSources.find(e => e.id == sourceOneId);
        var sourceTwo = MVD.DataSources.cacheDataSources.find(e => e.id == sourceTwoId);

        var fieldPromises = [];
        if (typeof sourceOne !== 'undefined') {
            fieldPromises.push(MVD.DataSources.getFields(sourceOne));
            var allParameters = MVD.DataSources.getAllSourceParameters(sourceOne);
            for (var i = 0; i < allParameters.length; i++) {
                var div = document.createElement('div');
                var renderId = MVD.DataSources.getParameterRenderId(allParameters[i]);
                div.setAttribute('id', renderId + 'PanelWrapper');
                document.getElementById('parametersPreView').append(div);
                MVD.DataSources.renderParameter(allParameters[i], renderId + 'PanelWrapper');
            }
        }
        else {
            fieldPromises.push(Promise.resolve({ fields: [] }));
        }

        if (typeof sourceTwo !== 'undefined') {
            fieldPromises.push(MVD.DataSources.getFields(sourceTwo));
            var allParameters = MVD.DataSources.getAllSourceParameters(sourceTwo);
            for (var i = 0; i < allParameters.length; i++) {
                var div = document.createElement('div');
                var renderId = MVD.DataSources.getParameterRenderId(allParameters[i]);
                div.setAttribute('id', renderId + 'PanelWrapper');
                document.getElementById('parametersPreView').append(div);
                MVD.DataSources.renderParameter(allParameters[i], renderId + 'PanelWrapper');
            }
        }
        else {
            fieldPromises.push(Promise.resolve({ fields: [] }));
        }

        Promise.all(fieldPromises)
            .then(function (args) {
                var sourceOneFields = args[0].fields.filter(function (e) { return e.allowedUseInUI });
                var sourceTwoFields = args[1].fields.filter(function (e) { return e.allowedUseInUI });

                var inputsFieldsSourceOne = document.querySelectorAll('input[id*="complexDataSourceField1_"]');
                if (typeof sourceOne !== 'undefined' && ['Sharepoint'].includes(sourceOne.type)) {
                    sourceOneFields = sourceOneFields.filter(function (field) {
                        if (sourceOne.typeSettings.fields.length === 0) {
                            return true;
                        } else {
                            return sourceOne.typeSettings.fields.includes(field.internalName);
                        }
                    });
                }
                for (var i = 0; i < inputsFieldsSourceOne.length; i++) {
                    ej.base.getComponent(document.getElementById(inputsFieldsSourceOne[i].id), 'dropdownlist').dataSource = sourceOneFields;
                }

                var inputsFieldsSourceTwo = document.querySelectorAll('input[id*="complexDataSourceField2_"]');
                if (typeof sourceTwo !== 'undefined' && ['Sharepoint'].includes(sourceTwo.type)) {
                    sourceTwoFields = sourceTwoFields.filter(function (field) {
                        if (sourceTwo.typeSettings.fields.length === 0) {
                            return true;
                        } else {
                            return sourceTwo.typeSettings.fields.includes(field.internalName);
                        }
                    });
                }
                for (var i = 0; i < inputsFieldsSourceTwo.length; i++) {
                    ej.base.getComponent(document.getElementById(inputsFieldsSourceTwo[i].id), 'dropdownlist').dataSource = sourceTwoFields;
                }

                //var dataSource = [{
                //    source: '*',
                //    name: 'Todos los campos',
                //    value: 'ComplexAllFields',
                //    type: '',
                //}];
                var dataSource = [];
                for (var j = 0; j < sourceOneFields.length; j++) {
                    dataSource.push({
                        source: sourceOne.title,
                        name: sourceOneFields[j].name,
                        value: sourceOne.title + '||' + sourceOneFields[j].internalName,
                        type: sourceOneFields[j].type,
                        internalName: sourceOneFields[j].internalName
                    });
                }
                for (var k = 0; k < sourceTwoFields.length; k++) {
                    dataSource.push({
                        source: sourceTwo.title,
                        name: sourceTwoFields[k].name,
                        value: sourceTwo.title + '||' + sourceTwoFields[k].internalName,
                        type: sourceTwoFields[k].type,
                        internalName: sourceTwoFields[k].internalName
                    });
                }
                var inputs = document.querySelectorAll('input[id*="complexSelectField_"]');
                for (var i = 0; i < inputs.length; i++) {
                    ej.base.getComponent(document.getElementById(inputs[i].id), 'dropdownlist').dataSource = dataSource;
                }
                resolve();
            })
            .catch(function (args) {
                MVD.SyncfusionUtilities.showToast(args.msg);
                console.error(args);
                reject();
            })
            .finally(function (args) { MVD.SPHelpers.Common.pageLoader(false); });
    });
}

MVD.DataSources.UI.renderParametersRowsSettings = function (source, fieldsInternalNames) {
    var parameters = MVD.DataSources.mergeCompoundParameters(source.parameters);
    for (var i = 0; i < parameters.length; i++) {
        var parameter = parameters[i];
        MVD.DataSources.UI.addParameterRowSettings(source);
        var rowId = MVD.DataSources.newRowNumber - 1;

        ej.base.getComponent(document.getElementById('parameterField' + rowId), 'dropdownlist').value = parameter.field;
        ej.base.getComponent(document.getElementById('parameterCreatedName' + rowId), 'textbox').value = parameter.createdName;

        var parameterTypeObj = ej.base.getComponent(document.getElementById('parameterType' + rowId), 'dropdownlist');
        parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.type.split(';').includes(source.type)));
        if (source.type === 'Sharepoint') {
            var auxFieldType = parameter.spType;
            if (auxFieldType === 'LookupMulti' || auxFieldType === 'LookupFieldWithPickerMulti') {
                auxFieldType = 'LookupMulti';
            }
            else if (auxFieldType.includes('Lookup')) {
                auxFieldType = 'Lookup';
            }
            else if (auxFieldType.includes('Cascading')) {
                auxFieldType = 'Text';
            }
            else if (auxFieldType === 'Counter') {
                auxFieldType = 'Number';
            }
            else if (auxFieldType === 'File') {
                auxFieldType = 'Text';
            }
            else if (auxFieldType === 'Attachments') {
                auxFieldType = 'Boolean';
            }

            if (auxFieldType === 'Lookup' || auxFieldType === 'LookupMulti') {
                document.getElementById('parameterExtraConfig' + rowId).value = JSON.stringify({ listId: parameter.extraConfig.listId, showField: parameter.extraConfig.showField, type: parameter.extraConfig.type, uniques: true });
                parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === auxFieldType));
            } else if (auxFieldType === 'User' || auxFieldType === 'UserMulti') {
                document.getElementById('parameterExtraConfig' + rowId).value = JSON.stringify({ userSelectionMode: parameter.extraConfig.userSelectionMode, type: parameter.extraConfig.type });
                parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === auxFieldType));
            } else if (auxFieldType === 'Choice' || auxFieldType === 'MultiChoice') {
                document.getElementById('parameterExtraConfig' + rowId).value = JSON.stringify({ listUrl: source.typeSettings.listUrl, type: parameter.extraConfig.type });
                parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === auxFieldType));
            } else if (parameter.type === 'Calculated') {
                document.getElementById('parameterExtraConfig' + rowId).value = JSON.stringify({ resultType: parameter.extraConfig.resultType });
                parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === parameter.type || e.value === 'DistinctList'));
            } else {
                document.getElementById('parameterExtraConfig' + rowId).value = '';
                parameterTypeObj.dataSource = MVD.DataSources.UI.parametersTypes.filter(e => (e.value === auxFieldType || (e.value === 'DistinctList' && !(['Boolean', 'DateTime', 'Note']).includes(auxFieldType))));
            }
        }
        parameterTypeObj.value = parameter.type;

        //ej.base.getComponent(document.getElementById('parameterType' + rowId), 'dropdownlist').value = parameter.type;

        var parameterOperatorObj = ej.base.getComponent(document.getElementById('parameterOperator' + rowId), 'dropdownlist');
        parameterOperatorObj.dataSource = MVD.DataSources.UI.operatorsTypes.filter(e => (e.type.split(';').includes(parameter.type)));
        ej.base.getComponent(document.getElementById('parameterRequired' + rowId), 'checkbox').checked = parameter.required;
        if (parameter.extraConfig) {
            document.getElementById('parameterExtraConfig' + rowId).value = JSON.stringify(parameter.extraConfig);
            if (parameter.type === 'ListDatasource') {
                ej.base.getComponent(document.getElementById('parameterSource' + rowId), 'dropdownlist').value = parameter.extraConfig.sourceId;
                setRenderParametersExtra(MVD.DataSources.newRowNumber - 1, parameter.extraConfig);
            }
        }
        ej.base.getComponent(document.getElementById('parameterAllowMultiple' + rowId), 'checkbox').checked = parameter.allowMultiple;
        if (parameter.operator === 'Range') {
            ej.base.getComponent(document.getElementById('parameterCreatedToName' + rowId), 'textbox').value = parameter.createdToName;
        }
        if (parameter.type === 'DateTime') {
            ej.base.getComponent(document.getElementById('parameterDateType' + rowId), 'dropdownlist').value = parameter.dateType;
            if (parameter.dateType === 'monthAndYear') {
                ej.base.getComponent(document.getElementById('parameterCreatedNameMonth' + rowId), 'textbox').value = parameter.parameterCreatedNameMonth;
                if (parameter.operator === 'Range') {
                    ej.base.getComponent(document.getElementById('parameterCreatedToNameMonth' + rowId), 'textbox').value = parameter.parameterCreatedToNameMonth;
                }
            }
        }
        ej.base.getComponent(document.getElementById('parameterOperator' + rowId), 'dropdownlist').value = parameter.operator;

        ej.base.getComponent(document.getElementById('parameterAllowNull' + rowId), 'checkbox').checked = parameter.allowNull;
        if (parameter.entryValue) {
            ej.base.getComponent(document.getElementById('parameterEntryValue' + rowId), 'dropdownlist').value = parameter.entryValue;
        }
        if (source.advancedParameters) {
            ej.base.getComponent(document.getElementById('parameterReferenceInQuery' + rowId), 'textbox').value = parameter.referenceInQuery;
        }
    }

    function setRenderParametersExtra(idParameterRow, settings) {
        setTimeout(function () {
            var source = ej.base.getComponent(document.getElementById('parameterSource' + idParameterRow), 'dropdownlist').itemData;
            MVD.DataSources.getFields(source)
                .then(function (returnArgs) {
                    ej.base.getComponent(document.getElementById('parameterFieldShow' + idParameterRow), 'dropdownlist').dataSource = returnArgs.fields;
                    ej.base.getComponent(document.getElementById('parameterFieldShow' + idParameterRow), 'dropdownlist').value = settings.showField;
                    ej.base.getComponent(document.getElementById('parameterFieldValue' + idParameterRow), 'dropdownlist').dataSource = returnArgs.fields;
                    ej.base.getComponent(document.getElementById('parameterFieldValue' + idParameterRow), 'dropdownlist').value = settings.valueField;
                })
                .catch(function (args) {
                    console.error(args)
                });
        }, 500);
    };
}

MVD.DataSources.UI.beforeRefreshRenderParameters = function () {
    MVD.DataSources.UI.oldParametersSettings = {};
    var oldParametersSettings = MVD.DataSources.UI.getParametersRowsSettings();
    MVD.DataSources.getParametersValues(oldParametersSettings, true);
    oldParametersSettings.forEach(function (param) {
        if (['fixed', 'userAndDefault'].includes(param.entryValue)) {
            MVD.DataSources.UI.oldParametersSettings[param.field] = { value: param.value, data: [] }
        }
    });
}

MVD.DataSources.UI.refreshRenderParameters = function () {
    document.getElementById('parametersPreView').innerHTML = '';
    var source = MVD.DataSources.UI.getSourceSettings();
    source.parameters = MVD.DataSources.UI.getParametersRowsSettings();
    var allParameters = MVD.DataSources.getAllSourceParameters(source, ['Sharepoint', 'External', 'Excel', 'Javascript'].includes(source.type));
    for (var i = 0; i < allParameters.length; i++) {
        var renderId = MVD.DataSources.getParameterRenderId(allParameters[i]);
        var div = document.createElement('div');
        div.setAttribute('id', renderId + 'PanelWrapper');
        document.getElementById('parametersPreView').append(div);
        if (typeof MVD.DataSources.UI.oldParametersSettings[allParameters[i].field] !== 'undefined') {
            allParameters[i].defaultValue = MVD.DataSources.UI.oldParametersSettings[allParameters[i].field].value;
        }
        MVD.DataSources.renderParameter(allParameters[i], renderId + 'PanelWrapper');
    }
    if (!source.advancedParameters && (source.type === 'Sharepoint' || source.type === 'External')) {
        var query = MVD.DataSources.Sharepoint.getQueryFromParamters(source.parameters);
        if (source.type === 'Sharepoint') {
            ej.base.getComponent(document.getElementById('sharepointQuery'), 'textbox').value = query;
        } else {
            ej.base.getComponent(document.getElementById('externalSharepoinQuery'), 'textbox').value = query;
        }
    }
    if (source.type === 'Excel') {
        try {
            MVD.DataSources.setParameterDistinctListDataSource(allParameters, ((typeof MVD.DataSources.cacheExcelData[source.typeSettings.url][source.typeSettings.sheet] !== 'undefined') ? MVD.DataSources.cacheExcelData[source.typeSettings.url][source.typeSettings.sheet] : []));
        } catch (error) {

        }
    }
}

MVD.DataSources.UI.setSourceSettings = function (source) {
    var auxSource = JSON.parse(JSON.stringify(source));
    if (auxSource.type === 'Sharepoint') {
        auxSource.typeSettings.fields = [];
    }
    var promises = [MVD.DataSources.getFields(auxSource)];
    if (source.type === 'External') {
        if (source.typeSettings.type === 'External Sharepoint') {
            promises.push(MVD.DataSources.External.getSPLists(source.typeSettings.dataSourceConnectionId));
        }
    }
    Promise.all(promises)
        .then(function (args) {
            var fields = args[0].fields;
            ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value = source.type;
            ej.base.getComponent(document.getElementById('advancedParameters'), 'checkbox').checked = source.advancedParameters;
            ej.base.getComponent(document.getElementById('advancedParameters'), 'checkbox').change({ checked: source.advancedParameters });
            document.getElementById('advancedParametersWrapper').style.display = (source.type === 'Sharepoint' || (source.type === 'External' && source.typeSettings.type === 'External')) ? 'flex' : 'none';
            if (source.type === 'Sharepoint') {
                ej.base.getComponent(document.getElementById('sharepointDataSource'), 'dropdownlist').value = source.typeSettings.listUrl;
                ej.base.getComponent(document.getElementById('sharepointQuery'), 'textbox').value = source.typeSettings.query;
                var sharepointFields = ej.base.getComponent(document.getElementById('sharepointFields'), 'multiselect');
                sharepointFields.dataSource = fields.filter(e => e.allowedUseInUI);
                let fieldsInternalNames = fields.filter(e => e.allowedUseInUI).map(e => e.internalName);
                if (source.typeSettings.fields) {
                    source.typeSettings.fields = source.typeSettings.fields.filter(e => fieldsInternalNames.includes(e));
                }
                sharepointFields.value = (!source.typeSettings.fields || source.typeSettings.fields.length === 0) ? sharepointFields.dataSource.map(e => e.internalName) : source.typeSettings.fields;

                var sharepointLookupFieldsToOpen = ej.base.getComponent(document.getElementById('sharepointLookupFieldsToOpen'), 'multiselect');
                sharepointLookupFieldsToOpen.dataSource = fields.filter(e => e.allowedUseInUI && ['UserMulti', 'LookupMulti'].includes(e.type));
                if (source.typeSettings.fieldsToOpen) {
                    source.typeSettings.fieldsToOpen = source.typeSettings.fieldsToOpen.filter(e => fieldsInternalNames.includes(e));
                }
                sharepointLookupFieldsToOpen.value = (!source.typeSettings.fieldsToOpen || source.typeSettings.fieldsToOpen.length === 0) ? [] : source.typeSettings.fieldsToOpen;

            }
            else if (source.type === 'Excel') {
                ej.base.getComponent(document.getElementById('excelDataSource'), 'textbox').value = source.typeSettings.url;
                ej.base.getComponent(document.getElementById('excelSheetSelect'), 'dropdownlist').dataSource = [source.typeSettings.sheet];
                ej.base.getComponent(document.getElementById('excelSheetSelect'), 'dropdownlist').value = source.typeSettings.sheet;
                ej.base.getComponent(document.getElementById('excelIndicatorType'), 'checkbox').checked = source.typeSettings.indicatorType;
                var excelFields = ej.base.getComponent(document.getElementById('excelFields'), 'multiselect');
                excelFields.dataSource = fields;
                excelFields.value = fields.map(e => e.internalName);
            }
            else if (source.type === 'Pivot') {
                ej.base.getComponent(document.getElementById('pivotDataSource'), 'dropdownlist').value = source.typeSettings.sourceId;
                ej.base.getComponent(document.getElementById('rowsLevel'), 'numerictextbox').value = source.typeSettings.extraSettings.rowsLevel;
                ej.base.getComponent(document.getElementById('columnsLevel'), 'numerictextbox').value = source.typeSettings.extraSettings.columnsLevel;
                document.getElementById('pivotSettings').value = JSON.stringify(source.typeSettings.dataSourceSettings);
            }
            else if (source.type === 'Complex') {
                ej.base.getComponent(document.getElementById('complexDataSource_1'), 'dropdownlist').value = source.typeSettings.sourceOneId;
                ej.base.getComponent(document.getElementById('complexDataSource_2'), 'dropdownlist').value = source.typeSettings.sourceTwoId;
                ej.base.getComponent(document.getElementById('complexDataSourceOperator'), 'dropdownlist').value = source.typeSettings.operator;
                MVD.DataSources.UI.onChangeComplexDataSource()
                    .then(function () {
                        for (var k = 0; k < source.typeSettings.conditions.length; k++) {
                            var aux = source.typeSettings.conditions[k];
                            if (k !== 0) {
                                MVD.DataSources.UI.btnAddComplexConditionRow();
                            }
                            ej.base.getComponent(document.getElementById('complexDataSourceField1_' + (MVD.DataSources.newRowNumber - 1)), 'dropdownlist').value = aux.field1;
                            ej.base.getComponent(document.getElementById('complexDataSourceField2_' + (MVD.DataSources.newRowNumber - 1)), 'dropdownlist').value = aux.field2;
                        }
                        var sourceOne = MVD.DataSources.cacheDataSources.find(element => element.id == source.typeSettings.sourceOneId);
                        var sourceTwo = MVD.DataSources.cacheDataSources.find(element => element.id == source.typeSettings.sourceTwoId);
                        for (var k = 0; k < source.typeSettings.fields.length; k++) {
                            var aux = source.typeSettings.fields[k];
                            var auxField = (aux.source === 'sourceOne') ? sourceOne.title + '||' + aux.internalName : sourceTwo.title + '||' + aux.internalName
                            if (k === 0) {
                                ej.base.getComponent(document.getElementById('complexSelectField_0'), 'dropdownlist').value = auxField;
                                ej.base.getComponent(document.getElementById('complexSelectFieldLabel_0'), 'textbox').value = aux.name;
                            } else {
                                MVD.DataSources.UI.btnAddComplexSelectFieldRow();
                                ej.base.getComponent(document.getElementById('complexSelectField_' + (MVD.DataSources.newRowNumber - 1)), 'dropdownlist').value = auxField;
                                ej.base.getComponent(document.getElementById('complexSelectFieldLabel_' + (MVD.DataSources.newRowNumber - 1)), 'textbox').value = aux.name;
                            }
                        }
                    })
                    .catch(function () { });
            }
            else if (source.type === 'Javascript') {
                ej.base.getComponent(document.getElementById('javascriptDataSource'), 'multiselect').value = source.typeSettings.sourcesIds;
                document.getElementById('jsFunction').value = source.typeSettings.function;
                document.getElementById('jsFunctionFields').value = source.typeSettings.functionFields;
            }
            else if (source.type === 'External') {
                var externalConnection = MVD.DataSources.cacheExternalDataSources.find(e => e.id === source.typeSettings.dataSourceConnectionId);
                ej.base.getComponent(document.getElementById('externalDataSourceConnection'), 'dropdownlist').value = source.typeSettings.dataSourceConnectionId;
                ej.base.getComponent(document.getElementById('externalSharepoinQuery'), 'textbox').value = source.typeSettings.query;
                if (externalConnection.type === 'External Sharepoint') {
                    var externalSPListsDropDown = ej.base.getComponent(document.getElementById('externalSharepointSPLists'), 'dropdownlist');
                    externalConnection.SPLists = args[1];
                    externalSPListsDropDown.dataSource = externalConnection.SPLists;
                    externalSPListsDropDown.value = source.typeSettings.listGuid;
                    ej.base.getComponent(document.getElementById('externalSharepointFields'), 'multiselect').dataSource = fields;
                    ej.base.getComponent(document.getElementById('externalSharepointFields'), 'multiselect').value = source.typeSettings.fields;
                }
                else if (externalConnection.type === 'DataBase Connection') {
                    ej.base.getComponent(document.getElementById('externalDataBaseCommandType'), 'dropdownlist').value = source.typeSettings.commandType;
                    ej.base.getComponent(document.getElementById('externalDataBaseCommandText'), 'textbox').value = source.typeSettings.commandText;
                    MVD.SPHelpers.Common.pageLoader(true);
                    MVD.DataSources.getFields(source)
                        .then(function (args) {
                            MVD.DataSources.sourceFieldsCache = args.fields;
                            ej.base.getComponent(document.getElementById('externalDataBaseFields'), 'multiselect').dataSource = args.fields;
                            ej.base.getComponent(document.getElementById('externalDataBaseFields'), 'multiselect').value = source.typeSettings.fields;
                            MVD.DataSources.UI.renderParametersRowsSettings(source, args.fields.map(e => e.internalName));
                            renderParameters(source);
                        })
                        .catch(function (args) {
                            console.error(args)
                        })
                        .finally(function () {
                            MVD.SPHelpers.Common.pageLoader(false);
                        });
                }
                else {
                    ej.base.getComponent(document.getElementById('webServiceMethod'), 'dropdownlist').value = source.typeSettings.method;
                    ej.base.getComponent(document.getElementById('webServiceReturnRawResponse'), 'checkbox').checked = source.typeSettings.returnRawResponse;
                    ej.base.getComponent(document.getElementById('webServiceJsonPath'), 'textbox').value = source.typeSettings.jsonPath;
                    MVD.DataSources.UI.initSyncfusionComponent('webServiceHeaders', { dataSource: source.typeSettings.headers });
                    MVD.DataSources.UI.initSyncfusionComponent('webServiceQueryStringParams', { dataSource: source.typeSettings.queryStringParams });
                    MVD.DataSources.UI.initSyncfusionComponent('webServicePostParams', { dataSource: source.typeSettings.postParams });
                    MVD.SPHelpers.Common.pageLoader(true);
                    MVD.DataSources.getFields(source, true)
                        .then(function (args) {
                            MVD.DataSources.sourceFieldsCache = args.fields;
                            ej.base.getComponent(document.getElementById('webServiceFields'), 'multiselect').dataSource = args.fields;
                            ej.base.getComponent(document.getElementById('webServiceFields'), 'multiselect').value = source.typeSettings.fields;
                            MVD.DataSources.UI.renderParametersRowsSettings(source, args.fields.map(e => e.internalName));
                            renderParameters(source);
                        })
                        .catch(function (args) {
                            console.error(args)
                        })
                        .finally(function () {
                            MVD.SPHelpers.Common.pageLoader(false);
                        });
                }
            }

            if (source.type !== 'Pivot') {
                let fieldsInternalNames = fields.map(e => e.internalName);
                let parametersToDelete = source.parameters.filter(e => !fieldsInternalNames.includes(e.field));
                parametersToDelete.forEach(function (parameter) {
                    MVD.SyncfusionUtilities.showToast(`El parámetro ${parameter.createdName} contiene errores, ya que fue eliminado el campo al que se relacionaba.`);
                });

                source.parameters = source.parameters.filter(e => fieldsInternalNames.includes(e.field));
                MVD.DataSources.UI.renderParametersRowsSettings(source, fields.map(e => e.internalName));
            }

            var parameters = MVD.DataSources.getAllSourceParameters(source, ['Sharepoint', 'External', 'Excel', 'Javascript'].includes(source.type));
            renderParameters(parameters);
        })
        .catch(function (args) { console.error(args) });

    function renderParameters(parameters) {
        for (var i = 0; i < parameters.length; i++) {
            var div = document.createElement('div');
            var renderId = MVD.DataSources.getParameterRenderId(parameters[i]);
            div.setAttribute('id', renderId + 'PanelWrapper');
            document.getElementById('parametersPreView').append(div);
            MVD.DataSources.renderParameter(parameters[i], renderId + 'PanelWrapper');
        }
    };
}