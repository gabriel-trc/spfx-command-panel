var MVD = MVD || {};
MVD.Dashboards = MVD.Dashboards || {};
MVD.Dashboards.panels = {};
MVD.Dashboards.parametersExtras = {};
MVD.Dashboards.colorPalette = ['#404041', '#357cd2', '#f8b883', '#70ad47', '#7f84e8', '#7bb4eb', '#ea7a57', '#00bdae', '#a16ee5', '#f7ce69', '#55a5c2', '#7ddf1e', '#7953ac', '#b99b4f', '#407c92', '#5ea716', '#b91c52', '#4472c4', '#ffc000', '#5b9bd5', '#c1c1c1', '#6f6fe2', '#9e480e', '#997300', '#ed7d31', '#79ece4', '#e98272', '#dfe6b6', '#c6e773', '#ba98ff', '#00c27a', '#43acef', '#d681ef', '#d8bc6e'];
MVD.Dashboards.colorPaletteIndexed = [];
MVD.Dashboards.parametersStates = [];


//if (location.href.toLowerCase().includes('/lists/mvddashboards') || location.href.toLowerCase().includes('/paginas/indicadores')) {
if (window.location.href.toLowerCase().includes('pageview=shared')) {
    document.getElementById('contentBox').style.visibility = 'visible';
} else {
    document.getElementById('contentBox').style.visibility = 'hidden';
}
//};


document.addEventListener('DOMContentLoaded', function () {
    if (((location.href.toLowerCase().includes('/lists/mvddashboards') && location.href.toLowerCase().includes('form.aspx')) || location.href.toLowerCase().includes('/paginas/indicadores') || location.href.toLowerCase().includes('/lists/dashboards')) && !location.href.toLowerCase().includes('pageview=shared')) {
        MVD.SPHelpers.Common.pageLoader(true);
        var scriptsToLoad = [
            {
                tag: 'link',
                url: '/SiteAssets/MVD.Syncfusion/18.1/ej2/material.css',
                level: 1
            }, {
                tag: 'link',
                url: '/SiteAssets/MVD.Dashboards/MVD.Dashboards.css',
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
                url: '/SiteAssets/MVD.Syncfusion/18.1/ej2/MVD.SyncfusionUtilities.js',
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
                url: '/SiteAssets/MVD.Syncfusion/external/js/numeral.min.js',
                level: 1
            }, {
                tag: 'script',
                url: '/SiteAssets/MVD.Syncfusion/external/js/jszip.js',
                level: 1
            }, {
                tag: 'script',
                url: '/SiteAssets/MVD.DataSources/MVD.DataSources.js',
                level: 1
            }, {
                tag: 'script',
                url: '/SiteAssets/MVD.DataSources/MVD.DataSources.Sharepoint.js',
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
                url: '/SiteAssets/MVD.DataSources/MVD.DataSources.External.js',
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
                url: '/SiteAssets/MVD.Dashboards/MVD.Dashboards.UI.js',
                level: 1
            }
        ];
        Promise.all([
            MVD.SPHelpers.Common.loadScripts(scriptsToLoad),
            import((_spPageContextInfo.webServerRelativeUrl === '/' ? '' : _spPageContextInfo.webServerRelativeUrl) + '/SiteAssets/MVD.SPHelpers/Fields.js'),
            import((_spPageContextInfo.webServerRelativeUrl === '/' ? '' : _spPageContextInfo.webServerRelativeUrl) + '/SiteAssets/MVD.SPHelpers/ListItems.js')
        ]).then(function (args) {
            MVD.SPHelpers.Fields = args[1];
            MVD.SPHelpers.ListItems = args[2];
            moment.lang('es', {
                months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
                monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sept_Oct_Nov_Dec'.split('_'),
                weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
                weekdaysShort: 'Dom_Lun_Mar_Mier_Jue_Vier_Sab'.split('_'),
                weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
            });
            SP.SOD.executeFunc('sp.js', 'SP.ClientContext', async function () {
                MVD.Dashboards.inNewMode = (location.href.toLowerCase().indexOf('/newform.aspx') > -1) ? true : false;
                MVD.Dashboards.inEditMode = (location.href.toLowerCase().indexOf('/editform.aspx') > -1) ? true : false;
                MVD.Dashboards.inDispMode = (location.href.toLowerCase().indexOf('/dispform.aspx') > -1) ? true : false;
                MVD.Dashboards.indicatorsPage = (location.href.toLowerCase().includes('/paginas/indicadores') || location.href.toLowerCase().includes('/lists/dashboards')) ? true : false;
                var listForm = (document.getElementById('onetIDListForm')) ? document.getElementById('onetIDListForm') : document.getElementById('DeltaPlaceHolderMain');
                listForm.style.display = 'none';
                var pageTitle = (document.getElementById('pageContentTitle')) ? document.getElementById('pageContentTitle') : document.getElementById('pageTitle');
                pageTitle.style.display = 'none';
                _ribbonStartInit('Ribbon.Browse', true);
                MVD.SyncfusionUtilities.setCulture('es');
                MVD.Dashboards.preSaveAction();


                MVD.DataSources.listPersonsPermissions = await MVD.SPHelpers.ListItems.getCurrentUserListPermission('/lists/personas');




                var promises = [MVD.DataSources.initIndicatorsCache(), MVD.DataSources.initDataSourcesCache(), MVD.DataSources.Indicator.getAllScalesValues()];
                if (MVD.DataSources.listPersonsPermissions.view) {
                    promises.push(MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.siteServerRelativeUrl, '/lists/personas'));
                }
                if (MVD.Dashboards.indicatorsPage) {
                    promises.push(MVD.Dashboards.getIndicatorPageDashboard());
                }
                Promise.all(promises)
                    .then(async function (args) {
                        MVD.DataSources.indicatorsSheetsPromises = {}
                        let sourcesIdsFieldsPromises = [];
                        if (MVD.DataSources.listPersonsPermissions.view) {
                            var groupFieldDataSource = args[3].filter(e => e.type.indexOf('Lookup') > -1 || e.type.indexOf('Choice') > -1 || e.type.indexOf('User') > -1);
                            findLookupAndChoiceOptions(groupFieldDataSource);
                        }
                        await MVD.Dashboards.initializeDashboard();
                        let indicatorsResponsibles = null;

                        try {
                            indicatorsResponsibles = await MVD.DataSources.Indicator.getResponsibles();
                        } catch (error) {
                            indicatorsResponsibles = Promise.resolve();
                        }

                        document.getElementById('contentBox').style.visibility = 'visible';
                        MVD.SPHelpers.Common.pageLoader(false);
                        if (!MVD.Dashboards.inNewMode) {
                            let promises = [indicatorsResponsibles];
                            let fieldPromises = [];
                            for (var keyPanel in MVD.Dashboards.panels) {
                                for (var keyGrid in MVD.Dashboards.panels[keyPanel].dataSourcesSettings) {
                                    if (MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].sourceType === 'Indicador') {
                                        if (MVD.Dashboards.panels[keyPanel].type === 'indicatorsPanel') {
                                            if (!MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].indicatorSheet) {
                                                MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].sourceId.forEach(function (e) {
                                                    var indicator = MVD.DataSources.cacheIndicators.find(function (ind) { return ind.id == e });
                                                    if (indicator) {
                                                        promises.push(MVD.DataSources.Indicator.getPlansAndHistory(e));
                                                    }
                                                });
                                            }
                                        } else {
                                            var indicator = MVD.DataSources.cacheIndicators.find(function (e) { return e.id == MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].sourceId });
                                            if (indicator) {
                                                promises.push(MVD.DataSources.Indicator.getPlansAndHistory(MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].sourceId));
                                            }
                                        }
                                    } else {
                                        let source = MVD.DataSources.cacheDataSources.find(e => e.id === MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].sourceId)
                                        if (typeof source.fieldsPromise === 'undefined') {
                                            let fieldsPromise = MVD.DataSources.getFields(source);
                                            source.fieldsPromise = fieldsPromise;
                                            sourcesIdsFieldsPromises.push(source.id);
                                            fieldPromises.push(fieldsPromise);
                                        }
                                    }
                                    if (MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].indicatorSheet) {
                                        var source = MVD.DataSources.cacheDataSources.find(e => e.id === MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].sourceId);
                                        var parameters = MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[keyPanel].dataSourcesSettings);
                                        if (!MVD.DataSources.indicatorsSheetsPromises[source.id]) {
                                            MVD.DataSources.indicatorsSheetsPromises[source.id] = true;
                                            var auxCachePromise = MVD.DataSources.getSourceData(source, parameters);
                                            promises.push(auxCachePromise);
                                            auxCreateCacheExcelIndicator(source.id, auxCachePromise);
                                        }
                                    }
                                }
                            }
                            Promise.all(promises)
                                .then(function (retPromises) {
                                    auxGetIndicatorsPlansSourcesFields();
                                    let indicatorTypesSources = MVD.DataSources.cacheDataSources.filter(e => e.typeSettings.indicatorType).map(e => e.id.toString());
                                    let indicatorTypesSourcesLoaded = Object.keys(MVD.DataSources.indicatorsSheetsPromises);
                                    indicatorTypesSourcesLoaded.forEach(function (e) {
                                        let index = indicatorTypesSources.findIndex(function (element) { return element == e });
                                        indicatorTypesSources.splice(1, index);
                                    });
                                    delete MVD.DataSources.indicatorsSheetsPromises;
                                    indicatorTypesSources.forEach(function (e) {
                                        let source = MVD.DataSources.cacheDataSources.find(element => element.id == e);
                                        auxCreateCacheExcelIndicator(source.id, MVD.DataSources.getSourceData(source, []));
                                    });
                                    Promise.all(fieldPromises)
                                        .then(function (retFieldsPromises) {
                                            for (let i = 0; i < sourcesIdsFieldsPromises.length; i++) {
                                                let source = MVD.DataSources.cacheDataSources.find(e => e.id === sourcesIdsFieldsPromises[i]);
                                                let args = retFieldsPromises[i];
                                                if (source.type === 'External') {
                                                    args.fields = args.fields.filter(e => source.typeSettings.fields.includes(e.internalName));
                                                }
                                                source.fields = args.fields;
                                                source.dynamicFields = args.dynamicFields;
                                                delete source.fieldsPromise;
                                            }

                                            for (var keyPanel in MVD.Dashboards.panels) {
                                                var parameters = MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[keyPanel].dataSourcesSettings);
                                                for (var i = 0; i < parameters.length; i++) {
                                                    var queryValue = MVD.SPHelpers.Common.getQueryParam(parameters[i].name);
                                                    if (queryValue) {
                                                        if (queryValue.includes(';')) {
                                                            parameters[i].queryStringValue = queryValue.split(';');
                                                        } else {
                                                            parameters[i].queryStringValue = queryValue;
                                                        }
                                                    }
                                                    var renderId = MVD.DataSources.getParameterRenderId(parameters[i]);
                                                    /*PARCHE POR VERSION QUE MODIFICA EL IDENTIFICADOR DE JAVASCRIPT*/
                                                    for (var key in MVD.Dashboards.parametersExtras) {
                                                        var newKey = MVD.SPHelpers.Common.getValidJavaScriptIndentifier(key);
                                                        MVD.Dashboards.parametersExtras[newKey] = MVD.Dashboards.parametersExtras[key];
                                                    }
                                                    /*FIN PARCHE POR VERSION QUE MODIFICA EL IDENTIFICADOR DE JAVASCRIPT*/
                                                    if (MVD.Dashboards.parametersExtras[renderId].defaultValue) {
                                                        if (MVD.Dashboards.parametersExtras[renderId].defaultValueType === 'year') MVD.Dashboards.parametersExtras[renderId].defaultValue = new Date().getFullYear();
                                                        parameters[i].defaultValue = MVD.Dashboards.parametersExtras[renderId].defaultValue;
                                                    }
                                                    MVD.Dashboards.renderParameter(parameters[i], MVD.Dashboards.parametersExtras[renderId]);
                                                    MVD.Dashboards.parametersExtras[renderId].isRender = true;
                                                }
                                                try {
                                                    if (MVD.Dashboards.panels[keyPanel].type === 'chart') {
                                                        let series = MVD.Dashboards.panels[keyPanel].settings.series;
                                                        for (let i = 0; i < series.length; i++) {
                                                            if (!series[i].name || series[i].name !== series[i].displayName) continue;
                                                            let dataSourcesSettingsId = series[i].id.split('_')[0];
                                                            let source = MVD.Dashboards.UI.getSourceOfDataSourceSettings(MVD.Dashboards.panels[keyPanel].dataSourcesSettings[dataSourcesSettingsId]);

                                                            if (source.type === 'Indicador') {
                                                                let indicator = MVD.DataSources.cacheIndicators.find(e => e.id === source.id);
                                                                MVD.Dashboards.panels[keyPanel].settings.horizontalLabelFormat = MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes'].find(e => e.value === indicator.dateFormat);
                                                                MVD.Dashboards.panels[keyPanel].settings.verticalLabelFormat = MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes'].find(e => e.value === indicator.numberFormatValues);
                                                            } else {

                                                                let fields = (source.fields) ? source.fields : source.detailsFields;
                                                                let field = fields.find(e => e.internalName === series[i].internalName);
                                                                if (field) {
                                                                    series[i].name = field.name;
                                                                }
                                                            }
                                                        }
                                                    } else if (MVD.Dashboards.panels[keyPanel].type === 'grid') {
                                                        let source = MVD.Dashboards.UI.getSourceOfDataSourceSettings(MVD.Dashboards.panels[keyPanel].dataSourcesSettings['grid']);
                                                        if (source.type === 'DataSource') {
                                                            let fields = (source.fields) ? source.fields : source.detailsFields;
                                                            let columns = MVD.Dashboards.panels[keyPanel].settings.columns;
                                                            for (let i = 0; i < columns.length; i++) {
                                                                let field = fields.find(e => e.internalName === columns[i].field);
                                                                if (field && field.name !== columns[i].headerText) {
                                                                    columns[i].headerText = field.name;
                                                                }
                                                            }
                                                        };
                                                    } else if (MVD.Dashboards.panels[keyPanel].type === 'pivot') {
                                                        let source = MVD.Dashboards.UI.getSourceOfDataSourceSettings(MVD.Dashboards.panels[keyPanel].dataSourcesSettings['pivot']);
                                                        if (source.type === 'DataSource') {
                                                            let fields = (source.fields) ? source.fields : source.detailsFields;
                                                            let values = MVD.Dashboards.panels[keyPanel].settings.values;
                                                            values.forEach(function (e) {
                                                                let field = fields.find(eField => eField.internalName === e.name);
                                                                if (field && field.name !== e.caption) {
                                                                    e.caption = field.name;
                                                                }
                                                            });
                                                            let rows = MVD.Dashboards.panels[keyPanel].settings.rows;
                                                            rows.forEach(function (e) {
                                                                let field = fields.find(eField => eField.internalName === e.name);
                                                                if (field && field.name !== e.caption) {
                                                                    e.caption = field.name;
                                                                }
                                                            });
                                                            let columns = MVD.Dashboards.panels[keyPanel].settings.columns;
                                                            columns.forEach(function (e) {
                                                                let field = fields.find(eField => eField.internalName === e.name);
                                                                if (field && field.name !== e.caption) {
                                                                    e.caption = field.name;
                                                                }
                                                            });
                                                        };
                                                    } else if (MVD.Dashboards.panels[keyPanel].type === 'gauge') {

                                                    }
                                                    MVD.Dashboards.renderPanel(MVD.Dashboards.panels[keyPanel], keyPanel);
                                                } catch (args) {
                                                    console.error(args);
                                                }
                                            }

                                            for (var keyParam in MVD.Dashboards.parametersExtras) {
                                                if (!MVD.Dashboards.parametersExtras[keyParam].isRender) {
                                                    ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').removePanel(MVD.Dashboards.parametersExtras[keyParam].position.replace('Content', ''));
                                                    delete MVD.Dashboards.parametersExtras[keyParam];
                                                }
                                                /*else {
                                                    delete MVD.Dashboards.parametersExtras[keyParam].isRender;
                                                }*/
                                            }

                                            MVD.Dashboards.parametersStates = MVD.Dashboards.UI.getDashboardParametersState(true);
                                        })
                                        .catch(function (args) {
                                            MVD.SPHelpers.Common.pageLoader(false);
                                            console.error(args);
                                            MVD.SyncfusionUtilities.showToast(args.msg);
                                        });
                                })
                                .catch(function (args) {
                                    MVD.SPHelpers.Common.pageLoader(false);
                                    console.error(args);
                                    MVD.SyncfusionUtilities.showToast(args.msg);
                                });
                        } else {
                            let indicatorTypesSources = MVD.DataSources.cacheDataSources.filter(e => e.typeSettings.indicatorType).map(e => e.id.toString());
                            let indicatorTypesSourcesLoaded = Object.keys(MVD.DataSources.indicatorsSheetsPromises);
                            indicatorTypesSourcesLoaded.forEach(function (e) {
                                let index = indicatorTypesSources.findIndex(function (element) { return element == e });
                                indicatorTypesSources.splice(1, index);
                            });
                            delete MVD.DataSources.indicatorsSheetsPromises;
                            indicatorTypesSources.forEach(function (e) {
                                let source = MVD.DataSources.cacheDataSources.find(element => element.id == e);
                                auxCreateCacheExcelIndicator(source.id, MVD.DataSources.getSourceData(source, []));
                            });
                        }
                        MVD.Dashboards.bindingFunctions();
                    })
                    .catch(function (args) {
                        MVD.SPHelpers.Common.pageLoader(false);
                        console.error(args);
                        MVD.SyncfusionUtilities.showToast(args.msg);
                    });

            });
        }).catch(function (args) {
            console.error(args);
            document.getElementById('contentBox').style.visibility = 'visible';
            MVD.SPHelpers.Common.pageLoader(false);
            alert(args);
        });

        function findLookupAndChoiceOptions(groupFieldDataSource) {
            var lists = [];
            try {
                for (var i = 0; i < groupFieldDataSource.length; i++) {
                    if (groupFieldDataSource[i].type.includes('Lookup')) {
                        lists.push({ listGUID: groupFieldDataSource[i].schema.List, field: groupFieldDataSource[i].schema.ShowField, queryText: '', includes: 'ID,' + groupFieldDataSource[i].schema.ShowField });
                    } else if (groupFieldDataSource[i].type.includes('Choice')) {
                        groupFieldDataSource[i].data = groupFieldDataSource[i].schema.CHOICES.CHOICE;
                    }
                }
                if (lists.length > 0) {
                    MVD.SPHelpers.ListItems.getListItemsMultiple(new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl), lists)
                        .then(function (listsItems) {
                            var index = 0;
                            for (var i = 0; i < groupFieldDataSource.length; i++) {
                                //if (!groupFieldDataSource[i].schemaXml) continue;
                                if (groupFieldDataSource[i].type.includes('Lookup')) {
                                    var aux = [];
                                    if (listsItems[index].items.get_count() > 0) {
                                        var enumerator = listsItems[index].items.getEnumerator();
                                        while (enumerator.moveNext()) {
                                            var listItem = enumerator.get_current();
                                            var item = {};
                                            item['value'] = listItem.get_item('ID');
                                            item['text'] = listItem.get_item(groupFieldDataSource[i].schema.ShowField);
                                            item['indicators'] = [];
                                            aux.push(item);
                                        }
                                    }
                                    groupFieldDataSource[i].data = aux;
                                    index++;
                                }
                            };
                        }, function (args) {
                            console.error('Error al traer los items de los lookups.  ', args);
                        });
                }
            } catch (args) {
                console.warn('Error en la busqueda de lookups.   ', args);
            }
        };
        function auxCreateCacheExcelIndicator(source, cachePromise) {
            cachePromise.then(function (args) {
                MVD.DataSources.Indicator.getIndicatorsFromExcelSheet(source, args);
            });
        };
        function auxGetIndicatorsPlansSourcesFields() {
            for (var keyPanel in MVD.Dashboards.panels) {
                if (MVD.Dashboards.panels[keyPanel].type === 'indicatorsPanel') continue;
                for (var keyGrid in MVD.Dashboards.panels[keyPanel].dataSourcesSettings) {
                    if (MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].sourceType === 'Indicador') {
                        let indicator = MVD.DataSources.cacheIndicators.find(function (e) { return e.id == MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keyGrid].sourceId });
                        indicator.plans.forEach(function (e) {
                            if (e.DataSourceType === 'Fuente de datos') {
                                let source = MVD.DataSources.cacheDataSources.find(element => element.id === e.MVDDataSource_SPData.value);
                                if (typeof source.fieldsPromise === 'undefined') {
                                    source.fieldsPromise = MVD.DataSources.getFields(source)
                                        .then(function (args) {
                                            if (source.type === 'External') {
                                                args.fields = args.fields.filter(e => source.typeSettings.fields.includes(e.internalName));
                                            }
                                            source.fields = args.fields;
                                            source.dynamicFields = args.dynamicFields;
                                            delete source.fieldsPromise;
                                        });
                                }
                            }
                        });
                    }
                }
            }
        }
    };
})

/*MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.siteServerRelativeUrl, '/lists/Configuracion'),
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

}*/



MVD.Dashboards.getIndicatorPageDashboard = function () {
    return new Promise(function (resolve, reject) {
        if (window.location.href.toLowerCase().includes('/lists/dashboards')) {
            import((_spPageContextInfo.webServerRelativeUrl === '/' ? '' : _spPageContextInfo.webServerRelativeUrl) + '/SiteAssets/MVD.RelationField/RelationField.js')
                .then(function (args) {
                    MVD.RelationField = args;
                    MVD.RelationField.whenRenderedByInternalName('MVDRF_Indicators')
                        .finally(async function () {
                            try {
                                deleteFabricCSS();
                            } catch (error) {

                            }
                            var sourceId = MVD.RelationField.getDataSourceByInternalName('MVDRF_Indicators').map(e => e.ID);
                            var camlValues = '';
                            for (var i = 0; i < sourceId.length; i++) {
                                camlValues += '<Value Type="Lookup">' + sourceId[i].toString() + '</Value>';
                            }
                            var camlQuery = '<View><Query><Where><In><FieldRef Name="Indicator" LookupId="True" />' +
                                '<Values>{Values}</Values></In></Where></Query></View>';
                            camlQuery = camlQuery.replace('{Values}', camlValues);
                            let indicatorsplansGUID = await MVD.SPHelpers.ListItems.getGUIDByListUrl('/lists/indicatorsplans', _spPageContextInfo.webServerRelativeUrl);
                            var dashboardJson = {
                                'title': MVD.SPHelpers.Fields.getFieldValueByInternalName('Title'),
                                'columns': 6,
                                'dashboard': [
                                    { 'id': 'panel_1', 'sizeX': 6, 'sizeY': 6, 'row': 1, 'col': 0 },
                                    { 'id': 'panel_2', 'sizeX': 1, 'sizeY': 1, 'row': 0, 'col': 0 }
                                ],
                                'panels': {
                                    'panelContent_1': {
                                        type: 'indicatorsPanel',
                                        title: '',
                                        dataSourcesSettings: {
                                            indicatorsPanel: {
                                                id: 'indicatorsPanel',
                                                indicatorsPanelSelectorType: 'Indicador',
                                                sourceId: sourceId,
                                                sourceType: 'Indicador',
                                                resumeDataSettings: '',
                                                drillingSettings: '',
                                                detailsDataSettings: '',
                                                parameters: [{
                                                    'createdName': 'Plan',
                                                    'visible': true,
                                                    'sourcesIds': [-1],
                                                    'indicatorsIds': [sourceId]
                                                }],
                                                indicatorParameter: [{
                                                    'name': 'Plan',
                                                    'createdName': 'Plan',
                                                    'field': 'Plan',
                                                    'type': 'Lookup',
                                                    'defaultValue': null,
                                                    'extraConfig': {
                                                        'listId': indicatorsplansGUID,
                                                        'showField': 'Title',
                                                        'caml': camlQuery,
                                                        'uniques': true
                                                    },
                                                    'required': true,
                                                    'visible': true,
                                                    'parameterIndicatorType': 'planSelector',
                                                    'indicatorsIds': sourceId,
                                                    'sourceId': -1,
                                                    'sourcesIds': [-1],
                                                    'createdNames': { 'undefined': 'Plan' },
                                                    'value': null
                                                }]
                                            }

                                        },
                                        settings: {
                                            groupName: '',
                                            showData: ['Value', 'PredictedValue'],
                                            panelGroups: {},
                                            showYTD: true
                                        }
                                    },
                                },
                                'parametersExtras': {
                                    "MVDPlan": {
                                        "position": "panelContent_2",
                                        defaultValue: new Date().getFullYear(),
                                        defaultValueType: "value"
                                    }
                                }
                            }
                            MVD.Dashboards.indicatorPageDashboard = dashboardJson;
                            resolve();
                        })
                })
                .catch(function (error) {
                    console.error(error);
                    reject();
                })

        } else {
            MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.webServerRelativeUrl, '/lists/configuracion')
                .then(function (items) {
                    var enumerator = items.getEnumerator();
                    enumerator.moveNext();
                    var listItem = enumerator.get_current();
                    var id = null;
                    try {
                        id = listItem.get_item('DashboardIndicatorsPage').get_lookupId();
                    } catch (e) {

                    }

                    if (id) {
                        MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.webServerRelativeUrl, '/lists/mvddashboards',
                            '<View><Query><Where><Eq><FieldRef Name="ID"/><Value Type="Counter">' + id + '</Value></Eq></Where></Query></View>')
                            .then(function (items) {
                                if (items.get_count() > 0) {
                                    var enumerator = items.getEnumerator();
                                    enumerator.moveNext();
                                    var listItem = enumerator.get_current();
                                    MVD.Dashboards.indicatorPageDashboard = JSON.parse(listItem.get_item('JSON'));
                                    MVD.Dashboards.indicatorPageDashboard.title = listItem.get_item('Title');
                                } else {
                                    MVD.Dashboards.indicatorPageDashboard = {
                                        'title': 'El tablero seleccionado a sido eliminado.',
                                        'dashboard': [],
                                        'panels': {},
                                        'parametersExtras': {}
                                    };
                                }
                                resolve();
                            })
                            .catch(function (err) { reject(err) })
                    } else {
                        MVD.Dashboards.indicatorPageDashboard = {
                            'title': 'El tablero seleccionado a sido eliminado.',
                            'dashboard': [],
                            'panels': {},
                            'parametersExtras': {}
                        };
                        resolve();
                    }
                })
                .catch(function (error) { reject(error) })
        }
    });

    function deleteFabricCSS() {
        if (document.querySelector('link[rel="stylesheet"][href$="fabric.css"]')) {
            document.querySelector('link[rel="stylesheet"][href$="fabric.css"]').remove()
            return
        } else {
            setTimeout(() => deleteFabricCSS(), 100);
        }
    }
}

MVD.Dashboards.preSaveAction = function () {
    PreSaveAction = function () {
        var ret = true;
        var dashboardTitle = document.getElementById('dashboardTitle').value;
        MVD.SPHelpers.Fields.setFieldValueByInternalName('Title', (dashboardTitle) ? dashboardTitle : 'Nuevo Dashboard');
        MVD.SPHelpers.Fields.setFieldValueByInternalName('JSON', JSON.stringify(MVD.Dashboards.getDashboardJSON()));
        return ret;
    }
}

MVD.Dashboards.initializeDashboard = async function () {
    ej.base.enableRipple(true);
    var newEl = document.createElement('div');
    newEl.setAttribute('id', 'parentMainContainer');
    document.getElementById('contentBox').append(newEl);
    var innerHTML = '';
    if (location.href.toLowerCase().includes('/paginas/indicadores')) {
        MVD.Dashboards.renderIndicatorPageActionsBtn();
        innerHTML =
            '<div class="flexContainer" >' +
            '<div class="flexItem80Width"><h1>Indicadores</h1></div>' +
            '<div class="flexItem20Width" style="display:flex"><div style="margin:auto"><button id="linkActions" type="button"></button></div></div>' +
            '</div>';
    }
    innerHTML +=
        '<div class="flexContainer" style="justify-content: space-between;">' +
        '<div class="flexItem50Width"><input id="dashboardTitle"/></div>' +
        '<div class="flexItem30Width" style="display:flex">' +
        '<div style="margin:auto"><button id="dashboardUpdateBtn" type="button"></button ><button id="dashboardDropDownMenu" type="button"></button</div>' +
        '</div>' +
        '</div>' +
        '<div id="dashboardLayout"></div>' +
        '<ul id="dashboardContextMenu"></ul>' +
        '<div id="templateMapTooltip" style="display:none"><div class="tooltip"><div class="tooltipListingItems"><center>${tootltipTitle}</center></div><hr style="margin-top: 2px; margin-bottom: 5px; border: 0.5px solid #DDDDDD">${tootltipProperties}</div></div>' +
        '<div id="hiddenPeoplePicker" style="display:none"></div>';
    document.getElementById('parentMainContainer').innerHTML = innerHTML;

    var inputTitle = new ej.inputs.TextBox({
        placeholder: 'Título',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true
    });
    inputTitle.appendTo('#dashboardTitle');

    var dashboardSettings = {
        cellSpacing: [10, 10],
        columns: 6,
        cellAspectRatio: 100 / 30,
        allowResizing: true,
        allowFloating: true,
        resizeStop: function (args) {
            var panelId = args.element.id.replace('panel', 'panelContent');
            if (MVD.Dashboards.panels[panelId]) {
                MVD.Dashboards.UI.refreshPanelSize(MVD.Dashboards.panels[panelId], panelId);
            }
            flexFont();
        },
    };
    if (!MVD.Dashboards.inNewMode || MVD.Dashboards.indicatorsPage) {
        var dashboardData = (MVD.Dashboards.indicatorsPage) ? MVD.Dashboards.indicatorPageDashboard : JSON.parse(MVD.SPHelpers.Fields.getFieldValueByInternalName('JSON'));
        dashboardSettings.columns = dashboardData.columns;
        MVD.Dashboards.colorPaletteIndexed = dashboardData.colorPalette;
        MVD.Dashboards.parametersExtras = (typeof dashboardData.parametersExtras === 'undefined') ? {} : dashboardData.parametersExtras;
        for (var key in dashboardData.parametersExtras) {
            var panelId = dashboardData.parametersExtras[key].position.replace('Content', '');
            var panel = dashboardData.dashboard.find(e => e.id === panelId);
            if (panel) {
                panel.header = '';
                panel.content = '<div id="panelContent_' + panelId.replace('panel_', '') + '"><span class="e-icon e-template e-editPanel editParameterIcon"></span></div>';
            }
        }
        for (var j = 0; j < dashboardData.dashboard.length; j++) {
            if (!dashboardData.dashboard[j].content) {
                var aux = dashboardData.dashboard[j].id.replace('panel_', '');
                dashboardData.dashboard[j].content = '<div id="panelContent_' + aux + '"></div><div id="panelSpinner_' + aux + '" class="panelSpinner"></div>';
                dashboardData.dashboard[j].header = '<div id="panelTitle_' + aux + '" class="panelTitleBorder">Título del panel ' + aux + '</div>' +
                    '<span class="e-icon e-template e-exportPngPanel"></span>' +
                    '<span class="e-icon e-template e-exportExcelPanel"></span>' +
                    '<span class="e-icon e-template e-clearPanel"></span>' +
                    '<span class="e-icon e-template e-editPanel"></span>';
            }
        }
        dashboardSettings.panels = dashboardData.dashboard;
        MVD.Dashboards.panels = dashboardData.panels;
        ej.base.getComponent(document.getElementById('dashboardTitle'), 'textbox').value = (MVD.Dashboards.indicatorsPage) ? dashboardData.title : MVD.SPHelpers.Fields.getFieldValueByInternalName('Title');
    }

    var dashboard = new ej.layouts.DashboardLayout(dashboardSettings);
    dashboard.appendTo('#dashboardLayout');

    if (MVD.Dashboards.inNewMode && !MVD.Dashboards.indicatorsPage) {
        MVD.Dashboards.mixColorPalette();
        MVD.Dashboards.addPanel(0, 0, 2, 4);
        MVD.Dashboards.addPanel(0, 2, 2, 4);
        MVD.Dashboards.addPanel(0, 4, 2, 4);
        MVD.Dashboards.addPanel(4, 0, 3, 4);
        MVD.Dashboards.addPanel(4, 3, 3, 4);
    }

    var dashboardContextMenuSettings = {
        target: '#dashboardLayout',
        items: [
            { text: 'Ver datos', iconCss: 'e-icons e-gridIcon' },
            { text: 'Ver gráfico', iconCss: 'e-icons e-chartIcon' }
        ],
        select: function (args) {
            if (args.item.properties.text === 'Ver datos') {
                if (MVD.Dashboards.selectedPoint) {
                    MVD.Dashboards.UI.showDataDetails(MVD.Dashboards.selectedPanelId, MVD.Dashboards.dataSourceId, { serie: MVD.Dashboards.selectedPoint['serie'], point: MVD.Dashboards.selectedPoint['point'] });
                } else {
                    MVD.Dashboards.UI.showDataDetails(MVD.Dashboards.selectedPanelId, MVD.Dashboards.dataSourceId);
                }
            }
            else if (args.item.properties.text === 'Ver gráfico') {
                MVD.Dashboards.UI.showDrilling(MVD.Dashboards.selectedPanelId, MVD.Dashboards.dataSourceId, { serie: MVD.Dashboards.selectedPoint['serie'], point: MVD.Dashboards.selectedPoint['point'] });
            }
        },
        onClose: function (args) {
            delete MVD.Dashboards.selectedPanelId;
            delete MVD.Dashboards.selectedPoint;
            delete MVD.Dashboards.dataSourceId;
        },
        beforeOpen: function (args) {
            var menu = ej.base.getComponent(document.getElementById('dashboardContextMenu'), 'contextmenu');
            if (args.event.target.id.includes('panelContent_')) {
                var aux = args.event.target.id.split('_');
                MVD.Dashboards.selectedPanelId = aux[0] + '_' + aux[1];
                if (MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId].type === 'chart') {
                    var seriesGroupSelector = ej.base.getComponent(document.getElementById('seriesGroupSelector_' + MVD.Dashboards.selectedPanelId), 'dropdownlist');
                    if (args.event.target.id.includes('Series_') && args.event.target.id.includes('Point_')) {
                        MVD.Dashboards.selectedPoint = { 'serie': +aux[aux.indexOf('Series') + 1], 'point': +aux[aux.indexOf('Point') + 1] };
                        MVD.Dashboards.dataSourceId = seriesGroupSelector.itemData.series[+aux[aux.indexOf('Series') + 1]].dataSourceId;
                        menu.enableItems(['Ver datos'], true);
                        menu.enableItems(['Ver gráfico'], (MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId].dataSourcesSettings[MVD.Dashboards.dataSourceId].drillingSettings !== ''));
                    } else {
                        var distinctDataSourceIds = Enumerable.from(seriesGroupSelector.itemData.series).distinct(function (e) { return e.dataSourceId }).select(function (e) { return e.dataSourceId }).toArray();
                        if (distinctDataSourceIds.length > 1) {
                            args.cancel = true;
                        } else {
                            MVD.Dashboards.dataSourceId = seriesGroupSelector.itemData.series[0].dataSourceId;
                            menu.enableItems(['Ver datos'], true);
                            menu.enableItems(['Ver gráfico'], false);
                        }
                    }
                }
                else if (MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId].type === 'pivot') {
                    MVD.Dashboards.dataSourceId = 'pivot';
                    menu.enableItems(['Ver datos'], true);
                    menu.enableItems(['Ver gráfico'], false);
                }
                else if (MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId].type === 'map') {
                    args.cancel = true;
                } else {
                    args.cancel = true;
                }
            }
            else {
                args.cancel = true;
            }
            if (args.cancel) {
                delete MVD.Dashboards.selectedPanelId;
            }
        }
    };
    new ej.navigations.ContextMenu(dashboardContextMenuSettings, '#dashboardContextMenu');

    var dashboardUpdateBtnSettings = {
        content: 'Actualizar datos',
        cssClass: 'e-small e-info',
        iconCss: 'e-icons e-reload',
    };
    new ej.buttons.Button(dashboardUpdateBtnSettings, '#dashboardUpdateBtn');

    try {
        await MVD.SPHelpers.Fields.createPeoplePicker('hiddenPeoplePicker', { Type: 'UserMulti', UserSelectionMode: 'PeopleOnly' });
    } catch (error) {

    }


    if (MVD.Dashboards.inDispMode || MVD.Dashboards.indicatorsPage) {
        dashboard.allowResizing = false;
        dashboard.allowDragging = false;
        var rules = '.e-editPanel, .e-clearPanel { display:none !important;}';
        MVD.SPHelpers.Common.insertCSS(rules);
        inputTitle.placeholder = '';
        inputTitle.readonly = true;
        document.getElementById('dashboardDropDownMenu').style.display = 'none';
    }
    else {
        var dashboardDropDownMenuSettings = {
            cssClass: 'e-small e-info',
            iconCss: 'e-icons e-gear',
            items: [
                { text: 'Agregar panel', iconCss: 'e-icons e-add', id: 'addPanel' },
                { text: 'Agregar columna', iconCss: 'e-icons e-add', id: 'addColumn' },
                { text: 'Quitar columna', iconCss: 'e-icons e-remove', id: 'removeColumn' },
                { separator: true },
                { text: 'Importar tablero', iconCss: 'e-icons e-import', id: 'importDashboard' },
                { text: 'Exportar tablero', iconCss: 'e-icons e-export', id: 'exportDashboard' },
                { separator: true },
                { text: 'Planilla de indicadores', iconCss: 'e-icons e-import', id: 'importIndicatorsSheet' },
            ],
            select: function (args) {
                if (args.item.id === 'addPanel') {
                    MVD.Dashboards.addPanel();
                }
                else if (args.item.id === 'addColumn') {
                    var columns = ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').columns;
                    if (columns < 8) {
                        ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').columns = ++columns;
                        setTimeout(function () {
                            MVD.Dashboards.UI.refreshAllPanelsSize();
                        }, 1000);
                    }
                }
                else if (args.item.id === 'removeColumn') {
                    var columns = ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').columns;
                    if (columns > 1) {
                        ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').columns = --columns;
                        setTimeout(function () {
                            MVD.Dashboards.UI.refreshAllPanelsSize();
                        }, 1000)
                    }
                }
                else if (args.item.id === 'importDashboard') {
                    MVD.SyncfusionUtilities.importTxt(function (result) {
                        var id = MVD.SPHelpers.Common.getQueryParam('ID');
                        for (var key in result.dashboard.panels) {
                            for (var keySurce in result.dashboard.panels[key].dataSourcesSettings) {
                                if (result.dashboard.panels[key].dataSourcesSettings[keySurce].sourceType === 'DataSource') {
                                    var source = MVD.DataSources.cacheDataSources.find(e => e.title === result.dashboard.panels[key].dataSourcesSettings[keySurce].sourceId);
                                    if (source) {
                                        result.dashboard.panels[key].dataSourcesSettings[keySurce].sourceId = source.id;
                                    } else {
                                        delete result.dashboard.panels[key].dataSourcesSettings[keySurce];
                                    }
                                }
                                else {
                                    var source = MVD.DataSources.cacheIndicators.find(e => e.title == result.dashboard.panels[key].dataSourcesSettings[keySurce].sourceId);
                                    if (source) {
                                        result.dashboard.panels[key].dataSourcesSettings[keySurce].sourceId = source.id;
                                    } else {
                                        delete result.dashboard.panels[key].dataSourcesSettings[keySurce];
                                    }
                                }
                            }
                        }
                        for (var key in result.dashboard.panels) {
                            if (Object.keys(result.dashboard.panels[key].dataSourcesSettings) === 0) {
                                delete result.dashboard.panels[key];
                            }
                        }
                        MVD.SPHelpers.ListItems.updateListItem(_spPageContextInfo.siteServerRelativeUrl, '/Lists/MVDDashboards', id,
                            [{ name: 'Title', value: result.title },
                            { name: 'JSON', value: JSON.stringify(result.dashboard) }],
                            function (id) {
                                window.location.href = _spPageContextInfo.siteAbsoluteUrl + '/Lists/MVDDashboards/EditForm.aspx?id=' + id;
                            },
                            function (args) {
                                ej.base.getComponent(document.getElementById('importTxtDialog'), 'dialog').hide();
                                console.error(args);
                                MVD.SyncfusionUtilities.showToast('El archivo seleccionado no pudo ser procesado.');
                                return false;
                            })
                    });
                }
                else if (args.item.id === 'exportDashboard') {
                    var fileName = ej.base.getComponent(document.getElementById('dashboardTitle'), 'textbox').value;
                    fileName = (fileName) ? fileName : 'DashboardSettings';
                    var json = {
                        title: ej.base.getComponent(document.getElementById('dashboardTitle'), 'textbox').value,
                        dashboard: MVD.Dashboards.getDashboardJSON()
                    };
                    for (var key in json.dashboard.panels) {
                        for (var keySurce in json.dashboard.panels[key].dataSourcesSettings) {
                            if (json.dashboard.panels[key].dataSourcesSettings[keySurce].sourceType === 'DataSource') {
                                json.dashboard.panels[key].dataSourcesSettings[keySurce].sourceId = MVD.DataSources.cacheDataSources.find(e => e.id === json.dashboard.panels[key].dataSourcesSettings[keySurce].sourceId).title;
                            } else {
                                json.dashboard.panels[key].dataSourcesSettings[keySurce].sourceId = MVD.DataSources.cacheIndicators.find(e => e.id == json.dashboard.panels[key].dataSourcesSettings[keySurce].sourceId).title;
                            }
                        }
                    }
                    MVD.SyncfusionUtilities.exportToTxt(fileName, json);
                }
                else if (args.item.id === 'importIndicatorsSheet') {
                    MVD.Dashboards.UI.openIndicatorsPanelsSheetDialog();
                }
            },
        };
        new ej.splitbuttons.DropDownButton(dashboardDropDownMenuSettings, '#dashboardDropDownMenu');
    }

    function flexFont() {
        var divs = document.getElementsByClassName("flexFont");
        for (var i = 0; i < divs.length; i++) {
            var relFontsize = divs[i].offsetWidth * 0.05;
            divs[i].style.fontSize = relFontsize + 'px';
            console.log(3);
        }
    };
}

MVD.Dashboards.mixColorPalette = function () {
    var arr = []
    MVD.Dashboards.colorPaletteIndexed = [];
    while (arr.length < MVD.Dashboards.colorPalette.length) {
        var r = Math.floor(Math.random() * MVD.Dashboards.colorPalette.length);
        if (arr.indexOf(r) === -1) arr.push(r);
    }
    for (var i = 0; i < arr.length; i++) {
        MVD.Dashboards.colorPaletteIndexed.push(MVD.Dashboards.colorPalette[arr[i]]);
    }
}

MVD.Dashboards.bindingFunctions = function () {
    document.getElementById('dashboardLayout').addEventListener('click', function (event) {
        if (event.target.classList.contains('e-clearPanel')) {
            if (event.target.offsetParent) {
                MVD.Dashboards.removePanel(event.target.offsetParent.id);
            }
        }
        else if (event.target.classList.contains('e-editPanel')) {
            if (event.target.offsetParent) {
                if (event.target.classList.contains('editParameterIcon')) {
                    MVD.Dashboards.UI.openParameterSettingsDialog(event.target.offsetParent.querySelector('.parameterWrapper').id.replace('Wrapper', ''));
                } else {
                    MVD.Dashboards.selectedPanelId = 'panelContent_' + event.target.offsetParent.id.replace('panel_', '');
                    MVD.Dashboards.UI.openPanelSettingsDialog();
                }
            }
        }
        else if (event.target.classList.contains('e-exportExcelPanel')) {
            if (event.target.offsetParent) {
                try {
                    var panelId = 'panelContent_' + event.target.offsetParent.id.replace('panel_', '');
                    var panel = MVD.Dashboards.panels[panelId]
                    if (MVD.Dashboards.panels[panelId].type === 'chart') {
                        var chart = ej.base.getComponent(document.getElementById(panelId), 'chart');
                        if (!chart) {
                            chart = ej.base.getComponent(document.getElementById(panelId), 'accumulationchart');
                        }
                        if (chart.series.length > 0) {
                            var divContainer = document.createElement('div');
                            divContainer.id = 'gridToExportChart';
                            divContainer.style.display = 'none';
                            document.getElementById('parentMainContainer').appendChild(divContainer);
                            var grid = new ej.grids.Grid({
                                dataSource: chart.series[0].dataSource,
                                allowExcelExport: true,
                                toolbar: ['ExcelExport'],
                                height: 260,
                                created: function (args) {
                                    var titleColSpan = Object.keys(this.dataSource[0]).length;
                                    var fileName = (panel.title) ? panel.title.replace(/'\.'/g, '') + '.xlsx' : 'Excel ' + event.target.offsetParent.id + '.xlsx'
                                    var exportSettings = {
                                        includeHiddenColumn: false,
                                        fileName: fileName,
                                        header: {
                                            headerRows: 2,
                                            rows: [
                                                { cells: [{ colSpan: titleColSpan, value: panel.title, style: { fontSize: 20, hAlign: 'Center', bold: true } }] },
                                            ]
                                        },
                                        title: panel.title
                                    };
                                    this.excelExport(exportSettings);
                                },
                                excelExportComplete: function (args) {
                                    this.destroy();
                                    document.getElementById('gridToExportChart').remove();
                                }
                            });
                            grid.appendTo('#gridToExportChart');
                        }
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'grid') {
                        var gird = ej.base.getComponent(document.getElementById(panelId), 'grid');
                        var titleColSpan = Object.keys(gird.dataSource[0]).length;
                        var fileName = (panel.title) ? panel.title.replace(/'\.'/g, '') + '.xlsx' : 'Excel ' + event.target.offsetParent.id + '.xlsx'
                        var exportSettings = {
                            includeHiddenColumn: false,
                            fileName: fileName,
                            header: {
                                headerRows: 2,
                                rows: [
                                    { cells: [{ colSpan: titleColSpan, value: panel.title, style: { fontSize: 20, hAlign: 'Center', bold: true } }] },
                                ]
                            },
                            title: panel.title
                        };
                        gird.excelExport(exportSettings);
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'pivot') {
                        var pivot = ej.base.getComponent(document.getElementById(panelId), 'pivotview');
                        var titleColSpan = Object.keys(pivot.dataSourceSettings.dataSource[0]).length;
                        var fileName = (panel.title) ? panel.title.replace(/'\.'/g, '') + '.xlsx' : 'Excel ' + event.target.offsetParent.id + '.xlsx'
                        var exportSettings = {
                            includeHiddenColumn: false,
                            fileName: fileName,
                            header: {
                                headerRows: 2,
                                rows: [
                                    { cells: [{ colSpan: titleColSpan, value: panel.title, style: { fontSize: 20, hAlign: 'Center', bold: true } }] },
                                ]
                            },
                            title: panel.title
                        };
                        pivot.excelExport(exportSettings);
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'map') {
                        MVD.SyncfusionUtilities.showToast('El panel de tipo mapa no puede ser exportado a excel.');
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'gauge') {
                        MVD.SyncfusionUtilities.showToast('El panel de tipo gauge no puede ser exportado a excel.');
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'indicatorsPanel') {
                        MVD.SyncfusionUtilities.showToast('El panel de tipo grafico no puede ser exportado a excel.');
                        //var treegrid = ej.base.getComponent(document.getElementById(panelId), 'treegrid');
                        //var titleColSpan = Math.round(Object.keys(treegrid.dataSource[0]).length / 2);
                        //var filename = (panel.title) ? panel.title.replace(/'\.'/g, '') + '.xlsx' : 'Excel ' + event.target.offsetParent.id + '.xlsx'
                        //var exportSettings = {
                        //    includeHiddenColumn: false,
                        //    fileName: filename,
                        //    header: {
                        //        headerRows: 2,
                        //        rows: [
                        //            { cells: [{ colSpan: titleColSpan, value: panel.title, style: { fontSize: 20, hAlign: 'Center', bold: true } }] },
                        //        ]
                        //    },
                        //    title: panel.title
                        //};
                        //treegrid.excelExport(exportSettings);
                    }
                } catch (e) { }
            }
        }
        else if (event.target.classList.contains('e-exportPngPanel')) {
            if (event.target.offsetParent) {
                try {
                    var panelId = 'panelContent_' + event.target.offsetParent.id.replace('panel_', '');
                    var panel = MVD.Dashboards.panels[panelId]
                    if (MVD.Dashboards.panels[panelId].type === 'chart') {
                        var fileName = (panel.title) ? panel.title : 'PNG ' + event.target.offsetParent.id;
                        var chart = ej.base.getComponent(document.getElementById(panelId), 'chart');
                        if (!chart) {
                            chart = ej.base.getComponent(document.getElementById(panelId), 'accumulationchart');
                        }
                        chart.exportModule.export('PNG', fileName);
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'grid') {
                        MVD.SyncfusionUtilities.showToast('El panel de tipo mapa no puede ser exportado a PNG.');
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'pivot') {
                        MVD.SyncfusionUtilities.showToast('El panel de tipo mapa no puede ser exportado a PNG.');
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'map') {
                        var map = ej.base.getComponent(document.getElementById(panelId), 'maps');
                        var fileName = (panel.title) ? panel.title : 'Mapa ' + event.target.offsetParent.id;
                        map.export('PNG', fileName);
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'gauge') {
                        MVD.SyncfusionUtilities.showToast('El panel de tipo gauge no puede ser exportado a PNG.');
                    }
                    else if (MVD.Dashboards.panels[panelId].type === 'indicatorsPanel') {
                        var treegrid = ej.base.getComponent(document.getElementById(panelId), 'treegrid');
                        treegrid.print();
                    }
                }
                catch (e) { }
            }
        }


    });
    document.getElementById('dashboardUpdateBtn').addEventListener('click', function (event) {
        MVD.Dashboards.updateDashboardData();
    });
    document.addEventListener('click', function (e) {
        if (e.target && e.target.id.indexOf('DeferUpdateButton') !== -1) {
            if (typeof document.querySelector('[id*="DeferUpdateButton"]').ej2_instances !== 'undefined')
                document.querySelector('[id*="DeferUpdateButton"]').ej2_instances[0].element.type = 'button';
        }
        else if (e.target && e.target.id === 'btnAddRowScaleChoice') {
            var container, type;
            var panelType = ej.base.getComponent(document.getElementById('panelType'), 'dropdownlist').value;
            if (panelType === 'map') {
                container = 'colorMapTypeRanges';
                type = ej.base.getComponent(document.getElementById('colorFieldType'), 'dropdownlist').value;
            }
            else if (panelType === 'gauge') {
                container = 'colorGaugeTypeRanges';
                type = 'range';
            }
            else if (panelType === 'indicatorsPanel') {
                container = 'colorIndicatorsPanelGroupTypeRanges';
                type = 'range';
            }
            MVD.Dashboards.UI.colorRangeAddRowChoice(container, type);
        }
        else if (e.target && e.target.id === 'btnGridColumnsSettings') {
            MVD.Dashboards.UI.openGridColumnsSettingsDialog();
        }
        else if (e.target && e.target.classList.contains('indicatorPanelLink')) {
            MVD.Dashboards.UI.openIndicatorChartDetails(event.target.dataset.id.split('_')[0], event.target.closest('div.e-panel').id.replace('panel', 'panelContent'));
        }
        else if (e.target && event.target.classList.contains('e-exportPng')) {
            try {
                var chart = ej.base.getComponent(document.getElementById('panelContent_indicatorChartDetail'), 'chart');
                chart.exportModule.export('PNG', document.getElementById('chartDetailDialog_title').innerText);
            } catch (e) {

            }
        }
    });
    document.addEventListener('wheel', (evt) => { }, { passive: true });
    document.addEventListener('touchmove', (evt) => { }, { passive: true });
    document.addEventListener('touchstart', (evt) => { }, { passive: true });
}

MVD.Dashboards.addPanel = function (row, col, sizeX, sizeY, isParameterPanel) {
    var panelId = 0;
    var nodes = document.getElementById('dashboardLayout').querySelectorAll('[id^="panel_"].e-panel');
    for (var i = 0; i < nodes.length; i++) {
        var auxPanelId = +nodes[i].id.split('_')[1];
        if (auxPanelId > panelId) {
            panelId = auxPanelId;
        }
    }
    panelId++;
    var header = '';
    var panel = {
        'id': 'panel_' + panelId,
        'sizeX': (typeof sizeX !== 'undefined') ? sizeX : 2,
        'sizeY': (typeof sizeY !== 'undefined') ? sizeY : 4,
        'row': (typeof row !== 'undefined') ? row : 0,
        'col': (typeof col !== 'undefined') ? col : 0,
        'content': '<div id="panelContent_' + panelId + '" style="overflow:hidden"></div><div id="panelSpinner_' + panelId + '" class="panelSpinner"></div>',
    }
    if (typeof isParameterPanel !== "undefined" && isParameterPanel) {
        panel.header = '';
        panel.content = '<div id="panelContent_' + panelId + '"><span class="e-icon e-template e-editPanel editParameterIcon"></span></div>';
    } else {
        panel.header = '<div id="panelTitle_' + panelId + '" class="panelTitleBorder">Título del panel ' + panelId + '</div>' +
            '<span class="e-icon e-template e-exportPngPanel"></span>' +
            '<span class="e-icon e-template e-exportExcelPanel"></span>' +
            '<span class="e-icon e-template e-clearPanel"></span>' +
            '<span class="e-icon e-template e-editPanel"></span>';
    }
    ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').addPanel(panel);
    return panelId;
}

MVD.Dashboards.removePanel = function (parentPanelId) {
    var panelContentId = 'panelContent_' + parentPanelId.replace('panel_', '');
    if (typeof MVD.Dashboards.panels[panelContentId] !== "undefined") {
        var parametersToRemove = MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[panelContentId].dataSourcesSettings);
        parametersToRemove.forEach(e => MVD.Dashboards.removeParameter(e));
    }
    delete MVD.Dashboards.panels[panelContentId];
    ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').removePanel(parentPanelId);
}

MVD.Dashboards.renderPanel = async function (panel, panelId) {
    document.getElementById(panelId).parentElement.innerHTML = '<div id="' + panelId + '"></div><div id="' + panelId.replace('Content', 'Spinner') + '" class="panelSpinner"></div>';
    MVD.Dashboards.UI.handlerSpinner(panelId.replace('Content', 'Spinner'), true);
    if (panelId !== 'panelContent_indicatorChartDetail') {
        var element = document.getElementById('panelTitle_' + panelId.replace('panelContent_', ''));
        element.innerHTML = panel.title;
        if (!panel.title && element.classList.contains('panelTitleBorder')) {
            element.classList.remove('panelTitleBorder')
        } else if (panel.title && !element.classList.contains('panelTitleBorder')) {
            element.classList.add('panelTitleBorder')
        }
    }
    var panelParameters = MVD.Dashboards.UI.getPanelParameters(panel.dataSourcesSettings);
    try {
        MVD.DataSources.getParametersValues(panelParameters);
    } catch (e) {
        MVD.SyncfusionUtilities.showToast(e.msg);
        if (panel.type === 'chart') {
            MVD.Dashboards.renderPanelChart([], panel, panelId);
        } else if (panel.type === 'grid') {
            MVD.Dashboards.renderPanelGrid([], panel, panelId);
        } else if (panel.type === 'pivot') {
            MVD.Dashboards.renderPanelPivot([], panel, panelId);
        } else if (panel.type === 'map') {
            MVD.Dashboards.renderPanelMap([[], []], panel, panelId);
        } else if (panel.type === 'gauge') {
            let field = panel.settings.fieldValue;
            MVD.Dashboards.renderPanelGauge([{ field: panel.settings.axeEndValue * .75 }], panel, panelId);
        } else if (panel.type === 'indicatorsPanel') {
            MVD.Dashboards.renderPanelIndicatorGroup([], panel, panelId);
        }
        MVD.Dashboards.UI.refreshPanelSize(panel, panelId);
        MVD.Dashboards.UI.handlerSpinner(panelId.replace('Content', 'Spinner'), false);
        return;
    }
    var dataPromises = [];
    for (var key in panel.dataSourcesSettings) {
        var idsToGetData = panel.dataSourcesSettings[key].sourceId;
        if (panel.type === 'indicatorsPanel') {
            var indicatorsMasks = [];
            if (panel.dataSourcesSettings.indicatorsPanel.indicatorSheet) {
                var auxSource = MVD.DataSources.cacheDataSources.find(e => e.id === panel.dataSourcesSettings.indicatorsPanel.sourceId)
                if (auxSource) {
                    if (MVD.DataSources.cacheIndicatorsSheet[auxSource.id].plans[panelParameters[0].value]) {
                        auxSource = JSON.parse(JSON.stringify(auxSource));
                        auxSource.typeSettings.indicatorSheet = panel.dataSourcesSettings.indicatorsPanel.indicatorSheet;
                        dataPromises.push(MVD.DataSources.getSourceData(auxSource, panelParameters, true));

                        let titleColumn = Object.keys(MVD.DataSources.cacheIndicatorsSheet[auxSource.id].plans[panelParameters[0].value][0].indicator)[2];
                        for (var j = 0; j < auxSource.typeSettings.indicatorSheet.length; j++) {
                            let auxMask = MVD.DataSources.cacheIndicatorsSheet[auxSource.id].plans[panelParameters[0].value].find(e => e.indicator[titleColumn] === auxSource.typeSettings.indicatorSheet[j]);
                            auxMask = JSON.parse(JSON.stringify(auxMask));
                            indicatorsMasks.push(auxMask);
                        }
                    }

                }
            } else {
                var planName = null;
                try {
                    MVD.DataSources.getParametersValues(panel.dataSourcesSettings[key].indicatorParameter);
                    planName = (panel.dataSourcesSettings[key].indicatorParameter[0].value) ? panel.dataSourcesSettings[key].indicatorParameter[0].value : panel.dataSourcesSettings[key].indicatorParameter[0].defaultValue;
                } catch (e) {

                }
                if (panel.dataSourcesSettings[key].indicatorsPanelSelectorType === 'Responsible') {
                    idsToGetData = await MVD.DataSources.Indicator.transformResponsibleDataSourceSettingsInIndicators(panel.dataSourcesSettings[key], panel.settings.panelGroups, panelId);
                }
                for (var i = 0; i < idsToGetData.length; i++) {
                    var auxSource = MVD.DataSources.Indicator.getSourceMask(idsToGetData[i], planName);
                    if (auxSource) {
                        dataPromises.push(MVD.DataSources.getSourceData(auxSource, panelParameters, true));
                        indicatorsMasks.push(auxSource);
                    }
                }
            }
        }
        else {
            let auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(panel.dataSourcesSettings[key]);
            if (auxSource) {
                dataPromises.push(MVD.DataSources.getSourceData(auxSource, panelParameters));
            }
        }
    }
    if (dataPromises.length === 0) {
        if (panel.type === 'chart') {
            MVD.Dashboards.renderPanelChart([], panel, panelId);
        } else if (panel.type === 'grid') {
            MVD.Dashboards.renderPanelGrid([], panel, panelId);
        } else if (panel.type === 'pivot') {
            MVD.Dashboards.renderPanelPivot([], panel, panelId);
        } else if (panel.type === 'map') {
            MVD.Dashboards.renderPanelMap([[], []], panel, panelId);
        } else if (panel.type === 'gauge') {
            let field = panel.settings.fieldValue;
            MVD.Dashboards.renderPanelGauge([{ field: panel.settings.axeEndValue * .75 }], panel, panelId);
        } else if (panel.type === 'indicatorsPanel') {
            MVD.Dashboards.renderPanelIndicatorGroup([], panel, panelId);
        }
        MVD.Dashboards.UI.refreshPanelSize(panel, panelId);
        MVD.Dashboards.UI.handlerSpinner(panelId.replace('Content', 'Spinner'), false);
        return;
    }
    Promise.all(dataPromises)
        .then(function (args) {
            if (panel.type === 'chart') {
                MVD.Dashboards.renderPanelChart(args, panel, panelId);
            }
            else if (panel.type === 'grid') {
                MVD.Dashboards.renderPanelGrid(args, panel, panelId);
            }
            else if (panel.type === 'pivot') {
                MVD.Dashboards.renderPanelPivot(args, panel, panelId);
            }
            else if (panel.type === 'map') {
                MVD.Dashboards.renderPanelMap(args, panel, panelId);
            }
            else if (panel.type === 'gauge') {
                if (args[0].length > 0) {
                    args = args[0];
                }
                MVD.Dashboards.renderPanelGauge(args, panel, panelId);
            }
            else if (panel.type === 'indicatorsPanel') {
                if (panel.dataSourcesSettings.indicatorsPanel.indicatorSheet && args.length > 0) {
                    args = args[0];
                    //    indicatorsMasks = panel.dataSourcesSettings.indicatorsPanel.indicatorSheet;
                    //    let data = [];
                    //    indicatorsMasks.forEach(function (e) {
                    //    });
                    //    //MVD.Dashboards.UI.indicatorsPanelsData = JSON.parse(JSON.stringify(args[0]));
                    //    //args = args[0];
                    //    //var dashboardColumn = Object.keys(args[0])[0];
                    //    //var groupColumn = Object.keys(args[0])[1];
                    //    //args = args.filter(e => e[dashboardColumn] === panel.settings.groupDashboard && e[groupColumn] === panel.settings.groupName);
                    //    //args = MVD.DataSources.Indicator.transformExcelImportDataToIndicatorPanelsData(args);
                }
                MVD.Dashboards.renderPanelIndicatorGroup(args, panel, panelId, indicatorsMasks);
            }
        })
        .catch(function (args) {
            console.error(args);
            MVD.SyncfusionUtilities.showToast(args.msg);
        })
        .finally(function () {
            MVD.Dashboards.UI.refreshPanelSize(panel, panelId);
            MVD.Dashboards.UI.handlerSpinner(panelId.replace('Content', 'Spinner'), false);
        });
}

MVD.Dashboards.updateDashboardData = function () {
    var newParametersStates = MVD.Dashboards.UI.getDashboardParametersState();
    var anyChanged = false;
    for (var keyPanel in MVD.Dashboards.panels) {
        var panelParameters = MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[keyPanel].dataSourcesSettings);
        var changeParameter = false;
        panelParameters.forEach(function (parameter) {
            var auxNewState = newParametersStates.find(e => e.name === parameter.name);
            var auxOldState = MVD.Dashboards.parametersStates.find(e => e.name === parameter.name);
            if (auxNewState && auxOldState && auxNewState.value !== auxOldState.value) {
                changeParameter = true;
            }
            else if ((auxNewState && !auxOldState) || (!auxNewState && auxOldState)) {
                changeParameter = true;
            }
        });
        if (changeParameter) {
            anyChanged = true;
            MVD.Dashboards.renderPanel(MVD.Dashboards.panels[keyPanel], keyPanel);
        }
    }
    if (anyChanged) {
        MVD.Dashboards.parametersStates = MVD.Dashboards.UI.getDashboardParametersState();
    } else {
        MVD.SyncfusionUtilities.showToast('El tablero ya se encuentra actualizado', null, 8000);
    }
}

MVD.Dashboards.renderPanelChart = function (argsData, panel, panelId) {
    var maximumDataAllowed = argsData.find(e => e.length > 300);
    var noData = argsData.filter(e => e.length === 0);
    noData = (noData.length === argsData.length) ? true : false;
    var indicatorChart = false;
    var annotations = [];
    var chartSettings = {
        locale: 'es',
        legendSettings: {
            visible: true,
            toggleSeriesVisibility: true
        },
        tooltip: {
            enable: true
        },
        width: '100%',
        height: '100%',
    };
    var series = [];
    var auxSeries = [];
    var keyCount = 0;
    if (noData || maximumDataAllowed) {
        annotations = (noData) ? [{
            content: '<div class="annotationMsg">No hay datos a graficar.</div>',
            x: '50%',
            y: '50%',
            coordinateUnits: 'Pixel',
            region: 'Series'
        }] : [{
            content: '<div class="annotationMsg">La cantidad de datos para graficar es muy grande, considere resumir los datos.</div>',
            x: '50%',
            y: '50%',
            coordinateUnits: 'Pixel',
            region: 'Series'
        }];
        chartSettings.annotations = annotations;
        var chart = new ej.charts.Chart(chartSettings);
        chart.appendTo('#' + panelId);
    }
    else {
        for (var key in panel.dataSourcesSettings) {
            indicatorChart = (panel.dataSourcesSettings[key].sourceType === 'Indicador' || panel.dataSourcesSettings[key].indicatorSheet);
            var seriesData = argsData[keyCount];
            var dataSourceSeries = panel.settings.series.filter(e => e.visible && e.id.startsWith(key));
            var dataSourceDynamicSeries = panel.settings.dynamicSeries.filter(e => e.visible && e.sourceId.startsWith(key));
            dataSourceDynamicSeries = dataSourceDynamicSeries.sort(function (a, b) {
                return (a.isCreated) ? -1 : 1;
            });
            transformAndMergeSeriesInDynamicSeries(dataSourceDynamicSeries, dataSourceSeries);
            if (!indicatorChart) {
                let horizontalFields = dataSourceDynamicSeries.map(e => e.horizontalField);
                if (['M', 'M/yy', 'M/yyyy', 'MMM', 'MMM/yy', 'MMM/yyyy', 'M/d/yy', 'M/d/yyyy', 'E', 'E MMM yyyy', 'd/M/yy', 'd/M/yyyy'].includes(panel.settings.horizontalLabelFormat.format)) {
                    console.groupCollapsed('Datos eliminados para aplicar el formato del eje X');
                    for (let i = seriesData.length - 1; i >= 0; i--) {
                        for (var j = 0; j < horizontalFields.length; j++) {
                            if (!seriesData[i][horizontalFields[j]]) {
                                console.table(seriesData[i]);
                                seriesData.splice(i, 1);
                                break;
                            }
                            else if (typeof seriesData[i][horizontalFields[j]] === 'number') {
                                let isMonthDate = parseToMonthDate(seriesData[i][horizontalFields[j]]);
                                if (isMonthDate) {
                                    seriesData[i][horizontalFields[j]] = isMonthDate;
                                } else {
                                    console.table(seriesData[i]);
                                    seriesData.splice(i, 1);
                                }
                                break;
                            }
                            else if (typeof seriesData[i][horizontalFields[j]] === 'string') {
                                let parseDate = moment(seriesData[i][horizontalFields[j]]);
                                if (parseDate.isValid()) {
                                    seriesData[i][horizontalFields[j]] = parseDate._d;
                                } else {
                                    let isMonthDate = parseToMonthDate(seriesData[i][horizontalFields[j]]);
                                    if (isMonthDate) {
                                        seriesData[i][horizontalFields[j]] = isMonthDate;
                                    } else {
                                        console.table(seriesData[i]);
                                        seriesData.splice(i, 1);
                                    }
                                }
                                break;
                            }
                        }
                    }
                    console.groupEnd('Datos eliminados para aplicar el formato del eje X');
                } else if (['$#,###', '$#,###.#', '$#,###.##', '$#,###.###', 'n0', 'n1', 'n2', 'p0', 'p1', 'p2', 'p3', '%'].includes(panel.settings.horizontalLabelFormat.format)) {
                    for (let i = seriesData.length - 1; i >= 0; i--) {
                        for (var j = 0; j < horizontalFields.length; j++) {
                            if (seriesData[i][horizontalFields[j]] === null || typeof seriesData[i][horizontalFields[j]] === 'object') {
                                console.table(seriesData[i]);
                                seriesData.splice(i, 1);
                                break;
                            } else if (typeof seriesData[i][horizontalFields[j]] === 'string') {
                                let parseNumber = parseFloat(seriesData[i][horizontalFields[j]]);
                                if (Number.isFinite(parseNumber)) {
                                    seriesData[i][horizontalFields[j]] = parseNumber;
                                } else {
                                    console.table(seriesData[i]);
                                    seriesData.splice(i, 1);
                                }
                                break;
                            }
                        }
                    }
                }
                //else if (['n0', 'n1', 'n2'].includes(panel.settings.horizontalLabelFormat.formatType)) {
                //    for (let i = seriesData.length - 1; i >= 0; i--) {
                //        for (var j = 0; j < horizontalFields.length; j++) {
                //            if (!seriesData[i][horizontalFields[j]]) {
                //                seriesData.splice(i, 1);
                //                break;
                //            }
                //        }
                //    }
                //}
                //else if (['p0', 'p1', 'p2', 'p3'].includes(panel.settings.horizontalLabelFormat.formatType)) {
                //    for (let i = seriesData.length - 1; i >= 0; i--) {
                //        for (var j = 0; j < horizontalFields.length; j++) {
                //            if (!seriesData[i][horizontalFields[j]]) {
                //                seriesData.splice(i, 1);
                //                break;
                //            }
                //        }
                //    }
                //}
                else if (['text'].includes(panel.settings.horizontalLabelFormat.format)) {
                    for (let i = seriesData.length - 1; i >= 0; i--) {
                        for (var j = 0; j < horizontalFields.length; j++) {
                            if (seriesData[i][horizontalFields[j]] === null || typeof seriesData[i][horizontalFields[j]] === '') {
                                seriesData[i][horizontalFields[j]] = 'Nulo';
                                break;
                            } else if (seriesData[i][horizontalFields[j]] === false) {
                                seriesData[i][horizontalFields[j]] = false;
                            }
                        }
                    }
                }
            } else {
                if (!dataSourceDynamicSeries.find(e => e.searchValue === 'History')) {
                    for (let i = seriesData.length - 1; i >= 0; i--) {
                        if (seriesData[i].Date !== 'YTD' && Number.isFinite(parseInt(seriesData[i].Date))) {
                            seriesData.splice(i, 1);
                        }
                    }
                }
                if (!dataSourceDynamicSeries.find(e => e.searchValue === 'YearAccumulatedValue')) {
                    seriesData.splice(seriesData.findIndex(e => e.Date === 'YTD'), 1);
                }
            }
            var possibleSeries = getPossibleSeries(seriesData);
            for (var i = 0; i < possibleSeries.length; i++) {
                for (var j = 0; j < dataSourceDynamicSeries.length; j++) {
                    var searchType = dataSourceDynamicSeries[j].searchType;
                    var searchValue = dataSourceDynamicSeries[j].searchValue;
                    if (searchType === 'regEx') {
                        //TODO
                    } else if (searchType === 'equal' && possibleSeries[i] == searchValue) {
                        auxSeries.push(createSerie(possibleSeries[i], dataSourceDynamicSeries[j], seriesData));
                        break;
                    } else if (searchType === 'notEqual' && possibleSeries[i] != searchValue) {
                        auxSeries.push(createSerie(possibleSeries[i], dataSourceDynamicSeries[j], seriesData));
                        break;
                    } else if (searchType === 'contains' && possibleSeries[i].indexOf(searchValue) > -1) {
                        auxSeries.push(createSerie(possibleSeries[i], dataSourceDynamicSeries[j], seriesData));
                        break;
                    } else if (searchType === 'notContains' && possibleSeries.indexOf(searchValue) === -1) {
                        auxSeries.push(createSerie(possibleSeries[i], dataSourceDynamicSeries[j], seriesData));
                        break;
                    } else if (searchType === 'startsWith' && possibleSeries[i].startsWith(searchValue)) {
                        auxSeries.push(createSerie(possibleSeries[i], dataSourceDynamicSeries[j], seriesData));
                        break;
                    } else if (searchType === 'notStartsWith' && !possibleSeries[i].startsWith(searchValue)) {
                        auxSeries.push(createSerie(possibleSeries[i], dataSourceDynamicSeries[j], seriesData));
                        break;
                    } else if (searchType === 'endsWith' && possibleSeries[i].endsWith(searchValue)) {
                        auxSeries.push(createSerie(possibleSeries[i], dataSourceDynamicSeries[j], seriesData));
                        break;
                    } else if (searchType === 'notEndsWith' && !possibleSeries[i].endsWith(searchValue)) {
                        auxSeries.push(createSerie(possibleSeries[i], dataSourceDynamicSeries[j], seriesData));
                        break;
                    }
                }
            }
            keyCount++;
            auxSeries.forEach(function (e, i) {
                series.push({
                    name: e.name,
                    dataSourceId: key,
                    type: (panel.dataSourcesSettings[key].sourceType === 'Indicador') ? 'Indicador' : e.type,
                    serie: e, //JSON.parse(JSON.stringify(e)),
                    group: e.group
                });
            });
            auxSeries = [];
        }
        if (series.length === 0) {
            annotations = [{
                content: '<div class="annotationMsg">No hay datos a graficar.</div>',
                x: '50%',
                y: '50%',
                coordinateUnits: 'Pixel',
                region: 'Series'
            }];
            chartSettings.annotations = annotations;
            var chart = new ej.charts.Chart(chartSettings);
            chart.appendTo('#' + panelId);
        }
        else {
            var seriesByGroup = series.reduce(function (acumulador, serieActual) {
                if (!serieActual.group) {
                    serieActual.group = (['Pie', 'Donut', 'Pyramid', 'InvertedPyramid', 'Funnel', 'Polar'].includes(serieActual.type)) ? serieActual.name : 'Resto de series';
                }
                if (!acumulador.find(e => e.groupName === serieActual.group)) {
                    acumulador.push({ groupName: serieActual.group, series: [] });
                }
                var acumulatorGroup = acumulador.find(e => e.groupName === serieActual.group);
                var existAcumulationChart = acumulatorGroup.series.filter(e => ['Pie', 'Donut', 'Pyramid', 'InvertedPyramid', 'Funnel', 'Polar'].includes(e.type));
                if (acumulatorGroup.series.length === 0 || (existAcumulationChart.length === 0 && !['Pie', 'Donut', 'Pyramid', 'InvertedPyramid', 'Funnel', 'Polar'].includes(serieActual.type))) {
                    acumulatorGroup.series.push(serieActual);
                } else {
                    let index = acumulador.filter(e => e.groupName.indexOf(serieActual.group > -1)).length;
                    acumulador.push({ groupName: serieActual.group, series: [serieActual] });
                }
                return acumulador;
            }, []);
            createSeriesGroupSelector(panelId, seriesByGroup);

            var renderSeries = [];
            seriesByGroup[0].series.forEach(e => renderSeries.push(e.serie));
            if (['Pie', 'Donut', 'Pyramid', 'InvertedPyramid', 'Funnel'].includes(renderSeries[0].type)) {
                renderPanelAccumulationChart(renderSeries[0], panelId, panel.settings, annotations);
            }
            else {
                renderPanelChart(renderSeries, panelId, panel.settings, annotations, indicatorChart);
            }
        }
    }

    function createSeriesGroupSelector(divPanelId, seriesByGroup) {
        var divPanel = document.getElementById(divPanelId);
        var div = document.createElement('div');
        div.setAttribute('id', 'seriesGroupSelectorWrapper' + divPanelId);
        div.classList = 'seriesGroupSelectorWrapper';
        divPanel.parentElement.prepend(div);
        var input = document.createElement('input');
        input.setAttribute('id', 'seriesGroupSelector_' + divPanelId);
        document.getElementById('seriesGroupSelectorWrapper' + divPanelId).append(input);
        if (seriesByGroup.length === 1) {
            document.getElementById('seriesGroupSelectorWrapper' + divPanelId).style.display = 'none';
        } else {
            divPanel.classList.add('panelWithSerieSelector');
        }
        var seriesGroupSelector = new ej.dropdowns.DropDownList({
            locale: 'es',
            dataSource: seriesByGroup,
            floatLabelType: 'Never',
            fields: { text: 'groupName', value: 'groupName' },
            value: seriesByGroup[0].groupName,
            change: function (args) {
                var panelId = args.element.id.replace('seriesGroupSelector_', '');
                document.getElementById(panelId).innerHTML = '';
                var series = [];
                args.itemData.series.forEach(e => series.push(e.serie));
                if (series.filter(e => e.type === 'Pie' || e.type === 'Donut' || e.type === 'Pyramid' || e.type === 'InvertedPyramid' || e.type === 'Funnel').length > 0) {
                    renderPanelAccumulationChart(series[0], panelId, MVD.Dashboards.panels[panelId].settings, [])
                } else {
                    renderPanelChart(series, panelId, MVD.Dashboards.panels[panelId].settings, [], (args.itemData.series[0].type === 'Indicador'));
                }
            }
        });
        seriesGroupSelector.appendTo('#seriesGroupSelector_' + panelId);
    }
    function createSerie(serieField, serieSettings, data) {
        //for (var i = 0; i < data.length; i++) {
        //    for (var keyValue in data[i]) {
        //        if (data[i][serieSettings.horizontalField] === null || data[i][serieSettings.horizontalField] === '') {
        //            data[i][serieSettings.horizontalField] = 'Nulo';
        //        }
        //        else if (data[i][serieSettings.horizontalField] === false) {
        //            data[i][serieSettings.horizontalField] = 'false';
        //        }
        //    }
        //}
        let name = serieSettings.name;
        if (serieSettings.isDynamic) {
            if (serieSettings.searchValue === name) {
                name = serieField;
            } else if (!name) {
                name = serieField.replace(serieSettings.searchValue, '');
                if (name.endsWith('-')) {
                    name = name.substring(0, name.length - 1);
                }
                else if (name.startsWith('-')) {
                    name = name.substring(1, name.length);
                }
            }
        }
        let type = serieSettings.chartType;
        if (type === 'DashedLine') type = 'Line';
        else if (type.includes('Polar')) type = 'Polar';
        let serie = {
            fill: serieSettings.color,
            type: type,
            dataSource: data,
            xName: serieSettings.horizontalField,
            width: 2,
            marker: {
                visible: true,
                width: 5,
                height: 5,
                shape: 'Pentagon',
                dataLabel: {
                    visible: serieSettings.labelVisible,
                    border: { width: 1 },
                    position: 'Top',
                    font: { fontWeight: '500', color: 'white' },
                    fill: 'rgb(128,128,128,0.6)',
                    rx: 5,
                    ry: 5,
                }
            },
            yName: serieField,
            name: name,
            group: serieSettings.group
        };

        if (serieSettings.chartType === 'DashedLine') serie.dashArray = '10,5';
        else if (serieSettings.chartType.includes('Polar')) serie.drawType = (serieSettings.chartType.includes('Line')) ? 'Line' : 'Area';
        else if (serieSettings.chartType === 'Bubble') {
            var max = Math.max.apply(Math, serie.dataSource.map(function (o) { return o[serie.yName]; }));
            serie.size = serie.yName + 'Size';
            serie.dataSource.forEach(function (e) {
                if (Number.isFinite(e[serie.yName])) {
                    e[serie.yName + 'Size'] = e[serie.yName] / max;
                }
            });
        }
        if (serieSettings.isDynamic) serie.connector = { length: 0 };

        return serie;
    }
    function transformAndMergeSeriesInDynamicSeries(dynamicSeries, series) {
        for (var i = 0; i < series.length; i++) {
            dynamicSeries.push(auxTransformSerie(series[i]));
        }

        function auxTransformSerie(serie) {
            return {
                chartType: serie.chartType,
                color: serie.color,
                group: serie.group,
                horizontalField: serie.horizontalField,
                name: serie.name,
                searchType: 'equal',
                searchValue: serie.internalName,
                visible: true,
                labelVisible: (typeof serie.labelVisible === 'undefined') ? true : serie.labelVisible,
            }
        }
    }
    function getPossibleSeries(data) {
        var series = [];
        for (var i = 0; i < data.length; i++) {
            var keySeries = Object.keys(data[i]);
            for (var j = 0; j < keySeries.length; j++) {
                if (data[i][keySeries[j]] !== null && typeof data[i][keySeries[j]] !== 'undefined') {
                    var isSerieRepeat = series.find(function (element) {
                        return element === keySeries[j];
                    });
                    if (!isSerieRepeat) {
                        series.push(keySeries[j]);
                    }
                }
            }
        }
        return series;
    }
    function getDeviationColor(value, scales, scalesValues) {
        var colorToFind, auxScale;
        for (var i = 0; i < scales.length; i++) {
            auxScale = scales[i].split(/[+-]/);
            if (auxScale.length === 3) {
                auxScale[0] = -auxScale[1];
                auxScale[1] = auxScale[2];
            }
            if (auxScale.length === 1) {
                colorToFind = auxScale[0];
                break;
            } else {
                if ((scales[i].indexOf('+') > -1 && value <= auxScale[0]) || value < auxScale[0]) {
                    colorToFind = auxScale[1];
                    break;
                }
            }
        }
        var color = scalesValues.find(e => e.Title === colorToFind);
        return color.BackColor;
    }
    function renderPanelAccumulationChart(serie, panelDivId, settings, annotations) {
        function getNumberFormat(auxText) {
            text = Number(auxText);
            switch (MVD.Dashboards.panels[panelDivId].settings.verticalLabelFormat.format) {
                case 'n0':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('0');
                    }
                    break;
                case 'n1':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('0.0');
                    }
                    break;
                case 'n2':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('0.00');
                    }
                    break;
                case 'n3':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('0.000');
                    }
                    break;
                case '%':
                    if (Number.isFinite(text)) {
                        text = text + '%';
                    }
                    break;
                case 'p0':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('0%');
                    }
                    break;
                case 'p1':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('0.0%');
                    }
                    break;
                case 'p2':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('0.00%');
                    }
                    break;
                case 'p3':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('0.000%');
                    }
                    break;
                case '$#,###':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('$0,0.0');
                    }
                    break;
                case '$#,###.#':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('$0,0.0');
                    }
                    break;
                case '$#,###.##':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('$0,0.00');
                    }
                    break;
                case '$#,###.###':
                    if (Number.isFinite(text)) {
                        text = numeral(text).format('$0,0.000');
                    }
                    break;
            };
            return text;
        };

        if (typeof serie.xNameOriginal === 'undefined') {
            //if (panel.settings.horizontalLabelFormat.format === 'text') {

            //} else {
            //    serie.dataSource = serie.dataSource.sort(function (a, b) {
            //        return (a[serie.xName] === b[serie.xName]) ? 0 : (a[serie.xName] < b[serie.xName]) ? -1 : 1;
            //    });
            //}
            serie.xNameOriginal = serie.xName;
            serie.xName = 'x';
            serie.marker.dataLabel.name = 'textLabel';

            for (let i = 0; i < serie.dataSource.length; i++) {
                if (['M', 'M/yy', 'M/yyyy', 'MMM', 'MMM/yy', 'MMM/yyyy', 'M/d/yy', 'M/d/yyyy', 'E', 'E MMM yyyy', 'd/M/yy', 'd/M/yyyy'].includes(panel.settings.horizontalLabelFormat.format)) {
                    serie.dataSource[i]['x'] = moment(serie.dataSource[i][serie.xNameOriginal]).format(MVD.Dashboards.panels[panelDivId].settings.horizontalLabelFormat.value);
                }
                else if (['$#,###', '$#,###.#', '$#,###.##', '$#,###.###', 'n0', 'n1', 'n2', 'p0', 'p1', 'p2', 'p3', '%'].includes(panel.settings.horizontalLabelFormat.format)) {
                    serie.dataSource[i]['x'] = getNumberFormat(serie.dataSource[i][serie.xNameOriginal]);
                } else {
                    serie.dataSource[i]['x'] = serie.dataSource[i][serie.xNameOriginal];
                }
                serie.dataSource[i]['textLabel'] = serie.dataSource[i]['x'] + ': ' + getNumberFormat(serie.dataSource[i][serie.yName]);
            }
        }

        var accumulationChartSettings = {
            center: { x: '50%', y: '50%' },
            enableSmartLabels: true,
            legendSettings: {
                visible: true,
                position: 'Bottom',
                width: '80%'
            },
            XtextRender: function (args) {
                //let textPointX = args.point.x;
                //if (['M', 'M/yy', 'M/yyyy', 'MMM', 'MMM/yy', 'MMM/yyyy', 'M/d/yy', 'M/d/yyyy', 'E', 'E MMM yyyy', 'd/M/yy', 'd/M/yyyy'].includes(MVD.Dashboards.panels[panelDivId].settings.horizontalLabelFormat.format)) {
                //    textPointX = moment(args.point.x).format(MVD.Dashboards.panels[panelDivId].settings.horizontalLabelFormat.value);
                //} else if (['$#,###', '$#,###.#', '$#,###.##', '$#,###.###', 'n0', 'n1', 'n2', 'p0', 'p1', 'p2', 'p3', '%'].includes(MVD.Dashboards.panels[panelDivId].settings.horizontalLabelFormat.format)) {
                //    textPointX = getNumberFormat(args.point.x);
                //}
                //args.text = textPointX + ': ' + getNumberFormat(args.text);
                args.text = args.point.x + ': ' + getNumberFormat(args.text);
            }
        };
        accumulationChartSettings.series = [{
            innerRadius: (serie.type === 'Donut') ? '40%' : '0%',
            radius: '80%',
            explode: true,
            explodeOffset: '25px',
            dataSource: serie.dataSource,
            dataLabel: {
                visible: true,
                name: 'textLabel',
                position: 'Outside',
                connectorStyle: {
                    length: '15px',
                    width: 2,
                    dashArray: '5,3',
                    color: '#f4429e',
                    type: 'Line'
                }
            },
            xName: serie.xName,
            yName: serie.yName,
            pyramidMode: 'Surface',
            neckWidth: '25%',
            neckHeight: '20%',
            emptyPointSettings: { mode: 'Zero' },
        }];
        accumulationChartSettings.tooltip = {
            enable: true,
            header: serie.name,
        };
        accumulationChartSettings.tooltipRender = function (args) {
            let textSplit = args.data.pointText.split(':');
            args.text = textSplit[0] + ': <b>' + textSplit[1] + '</b>';
        };

        if (serie.type === 'Pyramid') {
            accumulationChartSettings.series[0].type = serie.type;
        }
        else if (serie.type === 'Funnel') {
            accumulationChartSettings.series[0].type = serie.type;
        }
        else if (serie.type === 'InvertedPyramid') {
            accumulationChartSettings.series[0].type = 'Funnel';
            accumulationChartSettings.series[0].neckWidth = '0%';
            accumulationChartSettings.series[0].neckHeight = '0%';
        }
        accumulationChartSettings.annotations = annotations;
        var accumulationChart = new ej.charts.AccumulationChart(accumulationChartSettings);
        accumulationChart.appendTo('#' + panelDivId);
    }
    function renderPanelChart(series, panelDivId, settings, annotations, indicatorChart) {
        var chartSettings = {
            locale: 'es',
            legendSettings: {
                visible: true,
                toggleSeriesVisibility: true
            },
            tooltip: {
                enable: true,
                format: '${point.x} : ${point.y}'
            },
            width: '100%',
            height: '100%',
        };
        let valueType = 'Category';
        if (indicatorChart) {
            chartSettings.pointRender = function (args) {
                if (args.series.yName === 'Value') {
                    var row = args.series.dataSource.find(e => e.Date == args.point.x);
                    if (row.Scale) {
                        args.fill = row.Scale.BackColor;
                        args.point.fill = row.Scale.BackColor;
                        args.point.color = row.Scale.BackColor;
                        if (args.point.y === 0) {
                            args.point.width = 10;
                            args.point.height = 10;
                        }
                    }
                }
            };
        }
        else {
            chartSettings.pointRender = function (args) {
                var panelId = args.series.parentObj.element.id;
                if (!args.series.properties.fill && (typeof args.series.properties.connector === 'undefined' || args.series.properties.connector.length === null)) {
                    args.fill = MVD.Dashboards.colorPaletteIndexed[args.point.index];
                }
            };
            if (['M', 'M/yy', 'M/yyyy', 'MMM', 'MMM/yy', 'MMM/yyyy', 'M/d/yy', 'M/d/yyyy', 'E', 'E MMM yyyy', 'd/M/yy', 'd/M/yyyy'].includes(panel.settings.horizontalLabelFormat.format)) {
                valueType = 'DateTimeCategory';
            }
            else if (['$#,###', '$#,###.#', '$#,###.##', '$#,###.###', 'n0', 'n1', 'n2', 'p0', 'p1', 'p2', 'p3', '%'].includes(panel.settings.horizontalLabelFormat.format)) {
                valueType = 'Double';
            }
        }

        chartSettings.primaryXAxis = {
            valueType: valueType,
            labelIntersectAction: 'Rotate45',
            title: settings.horizontalName,
        };
        if (settings.horizontalLabelFormat.format === '%') {
            chartSettings.primaryXAxis.labelFormat = '{value}%';
        } else if (!settings.horizontalLabelFormat.format !== 'text') {
            chartSettings.primaryXAxis.labelFormat = settings.horizontalLabelFormat.format;
        }
        chartSettings.primaryYAxis = {
            title: settings.verticalName,
            labelFormat: (settings.verticalLabelFormat.format === '%') ? '{value}%' : settings.verticalLabelFormat.format
        }
        chartSettings.useGroupingSeparator = (settings.verticalLabelFormat.value.indexOf(',') > -1) ? true : false;
        chartSettings.annotations = annotations;
        if (!indicatorChart && settings.sortAxe.length > 0 && valueType === 'Category') {
            var sortData = series.reduce(function (accu, e) {
                e.dataSource.forEach(function (el) {
                    var aux = accu.find(ele => ele['xAxis'] == el[e.xName]);
                    if (!aux) {
                        aux = {};
                        aux['xAxis'] = el[e.xName];
                        aux[e.xName] = el[e.xName];
                        aux[e.yName] = (Number.isFinite(el[e.yName])) ? el[e.yName] : 0;
                        accu.push(aux);
                    } else {
                        aux[e.xName] = el[e.xName];
                        aux[e.yName] = (Number.isFinite(el[e.yName])) ? el[e.yName] : 0;
                    }
                });
                e.xName = 'xAxis';
                return accu;
            }, []);
            sortData = ej.charts.sort(sortData, getSortValues(series, settings), settings.sortDecending);
            series.forEach(function (e) {
                e.dataSource = sortData;
            });
        }
        chartSettings.series = series;

        var chart = new ej.charts.Chart(chartSettings);
        chart.appendTo('#' + panelDivId);

        function getSortValues(series, settings) {
            var sortValues = [];
            if (settings.sortAxe.includes('xAxis')) {
                sortValues = settings.sortAxe;
            } else {
                settings.sortAxe.forEach(function (e) {
                    if (Number(e)) {
                        var auxDynamicSerie = settings.dynamicSeries.find(aux => aux.id == e);
                        var searchType = auxDynamicSerie.searchType;
                        if (searchType === 'regEx') {
                            //TODO
                        } else if (searchType === 'equal') {
                            sortValues = sortValues.concat(series.filter(s => s.yName === auxDynamicSerie.searchValue).map(el => el.yName));
                        } else if (searchType === 'notEqual') {
                            sortValues = sortValues.concat(series.filter(s => s.yName !== auxDynamicSerie.searchValue).map(el => el.yName));
                        } else if (searchType === 'contains') {
                            sortValues = sortValues.concat(series.filter(s => s.yName.includes(auxDynamicSerie.searchValue)).map(el => el.yName));
                        } else if (searchType === 'notContains') {
                            sortValues = sortValues.concat(series.filter(s => !s.yName.includes(auxDynamicSerie.searchValue)).map(el => el.yName));
                        } else if (searchType === 'startsWith') {
                            sortValues = sortValues.concat(series.filter(s => s.yName.startsWith(auxDynamicSerie.searchValue)).map(el => el.yName));
                        } else if (searchType === 'notStartsWith') {
                            sortValues = sortValues.concat(series.filter(s => !s.yName.startsWith(auxDynamicSerie.searchValue)).map(el => el.yName));
                        } else if (searchType === 'endsWith') {
                            sortValues = sortValues.concat(series.filter(s => s.yName.endsWith(auxDynamicSerie.searchValue)).map(el => el.yName));
                        } else if (searchType === 'notEndsWith') {
                            sortValues = sortValues.concat(series.filter(s => !s.yName.endsWith(auxDynamicSerie.searchValue)).map(el => el.yName));
                        }
                    } else {
                        sortValues = sortValues.concat(series.filter(e => settings.sortAxe.includes(e.yName)).map(el => el.yName));
                    }
                });
            }
            return sortValues;
        }
    }
    function parseToMonthDate(rowData) {
        let possibleDate = false;
        let number = parseInt(rowData);
        if (Number.isFinite(number) && number > 0 && number < 13) {
            possibleDate = new Date(number + '/1/' + new Date().getFullYear());
        }
        return possibleDate;
    }
}

MVD.Dashboards.renderPanelGauge = function (argsData, panel, panelId) {
    let value = (panel.settings.fieldValue) ? argsData[0][panel.settings.fieldValue] : argsData[0].value;
    if (!Number.isInteger(value)) value = parseFloat(value.toFixed(2));
    var gaugeSettings = {
        width: '100%',
        height: '100%',
        axes: [{
            ranges: getColorRanges(panel.settings),
            minimum: panel.settings.axeStartValue,
            maximum: panel.settings.axeEndValue,
            pointers: getPointer(panel.settings, value),
            lineStyle: {
                width: 5
            },
        }],
        value: value,

    };
    if (!panel.settings.showScale) {
        gaugeSettings.axes[0].lineStyle = { width: 0 };
        gaugeSettings.axes[0].majorTicks = { width: 0 };
        gaugeSettings.axes[0].minorTicks = { width: 0 };
        gaugeSettings.axes[0].labelStyle = {
            font: { size: '0px' }
        }
    }
    else {
        gaugeSettings.axes[0].lineStyle = { color: panel.settings.scaleColor };
        gaugeSettings.axes[0].majorTicks = { color: panel.settings.scaleColor };
        gaugeSettings.axes[0].minorTicks = { color: panel.settings.scaleColor };
        gaugeSettings.axes[0].labelStyle = { font: { color: panel.settings.scaleColor } };
    }
    if (panel.settings.rangeGreyColor) {
        for (var i = 0; i < gaugeSettings.axes[0].ranges.length; i++) {
            gaugeSettings.axes[0].ranges[i].color = '#C3C3C3'
        }
    }
    if (panel.settings.value.show) {
        gaugeSettings.loaded = function (args) {
            var gaugeValue = args.gauge.value;
            var x, y;
            try {
                gaugeValue = panel.settings.value.prefix.replace('{value}', gaugeValue);
            } catch (e) {

            }
            if (panel.settings.value.position.indexOf('top') > -1) {
                x = '50%';
                y = '10%';
            }
            if (panel.settings.value.position.indexOf('middle') > -1) {
                x = '50%';
                y = '50%';
            }
            if (panel.settings.value.position.indexOf('bottom') > -1) {
                x = '50%';
                y = '90%';
            }
            if (panel.settings.value.position.indexOf('Left') > -1) {
                x = '10%';
            }
            if (panel.settings.value.position.indexOf('Right') > -1) {
                x = '90%';
            }
            let svgText = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgText.setAttribute('viewBox', '0 0 25 80');
            var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            var text = document.createTextNode(gaugeValue);
            textElement.setAttribute('x', x);
            textElement.setAttribute('y', y);
            textElement.setAttribute('fill', getColorValue(panel.settings, gaugeValue));
            textElement.setAttribute('dominant-baseline', 'middle');
            textElement.setAttribute('text-anchor', 'middle');
            textElement.appendChild(text);
            svgText.appendChild(textElement);
            document.getElementById(panelId + '_svg').appendChild(svgText);
        };
    }
    if (panel.settings.type === 'circular') {
        gaugeSettings.axes[0].startAngle = panel.settings.startAngle;
        gaugeSettings.axes[0].endAngle = panel.settings.endAngle;
        var gauge = new ej.circulargauge.CircularGauge(gaugeSettings);
        gauge.appendTo('#' + panelId);
    }
    else {
        gaugeSettings.orientation = panel.settings.orientation;
        var lineargauge = new ej.lineargauge.LinearGauge(gaugeSettings);
        lineargauge.appendTo('#' + panelId);
    }

    function getPointer(settings, value) {
        let ret = [];
        let gaugeType = settings.type;
        let pointer = settings.pointer;
        var auxPointer = {
            color: getColorValue(settings, value),
            value: value
        };
        if (pointer.type === 'Needle') {
            auxPointer.pointerWidth = 10;
            auxPointer.cap = {
                radius: 0
            };
        } else if (pointer.type === 'RangeBar') {
            auxPointer.type = (gaugeType === 'circular') ? 'RangeBar' : 'Bar';
            auxPointer.roundedCornerRadius = 1;
            auxPointer.pointerWidth = 22;
        } else if (pointer.type.indexOf('Marker') > -1) {
            auxPointer.type = 'Marker';
            auxPointer.markerShape = pointer.type.split('-')[1];
            auxPointer.markerType = auxPointer.markerShape;
            auxPointer.markerHeight = 12;
            auxPointer.markerWidth = 12;
            if (auxPointer.markerShape === 'Rectangle') {
                auxPointer.markerHeight = 25;
            } else if (auxPointer.markerShape === 'Diamond') {
                auxPointer.markerWidth = 25;
            }
        } else if (pointer.type === 'NeedleAndRangeBar') {
            auxPointer.pointerWidth = 10;
            auxPointer.cap = {
                radius: 0
            };
            auxPointer.radius = pointer.radius + '%';
            ret.push(auxPointer);
            auxPointer = {
                color: getColorValue(settings, value),
                value: value
            };
            auxPointer.type = (gaugeType === 'circular') ? 'RangeBar' : 'Bar';
            auxPointer.roundedCornerRadius = 1;
            auxPointer.pointerWidth = 22;
            auxPointer.radius = pointer.radius + '%';
            ret.push(auxPointer);
            auxPointer = {};
        }
        if (Object.keys(auxPointer).length > 0) {
            auxPointer.radius = pointer.radius + '%';
            ret.push(auxPointer);
        }
        return ret;
    }
    function getColorValue(panelSettings, value) {
        var color;
        if (panelSettings.value.colorType === 'colorpicker') {
            color = panelSettings.value.color;
        } else {
            color = panelSettings.rangesColor[panelSettings.rangesColor.length - 1].toColor;
            for (var i = 0; i < panelSettings.rangesColor.length - 1; i++) {
                if (panelSettings.rangesColor[i].operator === '>' && value > panelSettings.rangesColor[i].value) {
                    color = panelSettings.rangesColor[i].toColor;
                    break
                }
                else if (panelSettings.rangesColor[i].operator === '>=' && value >= panelSettings.rangesColor[i].value) {
                    color = panelSettings.rangesColor[i].toColor;
                    break
                }
            }
        }
        return color;
    }
    function getColorRanges(settings) {
        let ret = [];
        for (let i = 0; i < settings.rangesColor.length; i++) {
            let startValue, endValue, color;
            if (i === 0) {
                startValue = (settings.rangesColor[i].operator === '>') ? settings.rangesColor[i].value + 0.01 : settings.rangesColor[i].value;
                endValue = settings.axeEndValue;
                color = settings.rangesColor[i].toColor;
            } else if (i === settings.rangesColor.length - 1) {
                startValue = (settings.rangesColor[i].operator === '>') ? settings.rangesColor[i].value + 0.01 : settings.rangesColor[i].value;
                endValue = (settings.rangesColor[i - 1].operator === '>') ? settings.rangesColor[i - 1].value : settings.rangesColor[i - 1].value + 0.01;
                color = settings.rangesColor[i].toColor;
            } else {
                startValue = (settings.rangesColor[i].operator === '>') ? settings.rangesColor[i].value + 0.01 : settings.rangesColor[i].value;
                endValue = (settings.rangesColor[i - 1].operator === '>') ? settings.rangesColor[i - 1].value : settings.rangesColor[i - 1].value + 0.01;
                color = settings.rangesColor[i].toColor;
            }
            ret.push({
                radius: settings.rangeColorRadius + '%',
                endWidth: 22,
                startWidth: 22,
                start: startValue,
                end: endValue,
                color: color
            });
        }
        return ret;
    }
}

MVD.Dashboards.renderPanelGrid = function (argsData, panel, panelId) {
    var gridSettings = {
        allowExcelExport: true,
        locale: 'es',
        width: '100%',
        columns: [],
        dataSource: argsData[0],
        locale: 'es',
        beforeDataBound: function (args) {
            MVD.Dashboards.dataBound = false;
        },
        dataBound: function (args) {
            if (!MVD.Dashboards.dataBound) {
                this.autoFitColumns();
                MVD.Dashboards.dataBound = true;
            }
        }
    }
    for (var key in panel.settings) {
        if (key === 'columns') {
            gridSettings.columns = JSON.parse(JSON.stringify(panel.settings[key]));
        } else {
            gridSettings[key] = panel.settings[key];
            if (key === 'groupSettings') {
                gridSettings.allowGrouping = true;
                gridSettings[key].showDropArea = false;
                gridSettings[key].showUngroupButton = false;
            }
            else if (key === 'sortSettings') {
                gridSettings.allowSorting = true;
                gridSettings.allowMultiSorting = true;
            }
            else if (key === 'pageSettings') {
                gridSettings.allowPaging = true;
                gridSettings[key].pageSizes = false;
            }
            else if (key === 'filterSettings') {
                gridSettings.allowFiltering = true;
                gridSettings.allowMultiSorting = { type: 'Excel' };
            }
        }
    }
    var grid = new ej.grids.Grid(gridSettings);
    grid.appendTo('#' + panelId);
}

MVD.Dashboards.renderPanelMap = function (argsData, panel, panelId) {
    var mapSettings = {
        zoomSettings: {
            enable: true,
            zoomFactor: panel.settings.zoomInitial,
            mouseWheelZoom: false
        },
        legendSettings: {
            visible: true,
            mode: 'Default',
            height: '10',
            width: '60%',
            opacity: .8
        },
        centerPosition: {
            latitude: panel.settings.latitudeInitial,
            longitude: panel.settings.longitudeInitial
        },
        tooltipRender: function (args) {
            if (!args.options.data) {
                args.cancel = true;
            } else {
                let str = '';
                for (let i = 0; i < args.options.data.tootltipPropertiesToShow.length; i++) {
                    let prop = args.options.data.tootltipPropertiesToShow[i];
                    let value = (typeof args.options.data[prop.internalName] !== 'undefined') ? args.options.data[prop.internalName] : '';
                    if (value !== null) {
                        if (prop.type === 'Date' && value) {
                            value = moment(value).format(moment(new Date()).format('D/MM/YYYY'));
                        } else if (prop.type === 'Number' && Number.isFinite(value)) {
                            //value = numeral(value).format('0.00')
                        }
                    } else {
                        value = '';
                    }
                    str += '<div><span class="tooltipListingTitle">' + prop.name + ':  </span><span class="tooltipListingItems">' + value + '</span></div>';
                }
                args.options.data.tootltipTitle = args.options.data[args.options.data.tootltipTitle];
                args.options.data.tootltipProperties = str;
            }
        },
        layers: []
    };
    var layer = {
        shapeData: new ej.maps.MapAjax('/SiteAssets/MVD.Syncfusion/maps/' + panel.settings.map + '.txt'),
        shapePropertyPath: panel.settings.selectCountryOrContinetn,
        animationDuration: 2000,
        shapeSettings: { fill: '#E5E5E5' }
    }
    for (var key in panel.dataSourcesSettings) {
        if (key === 'locators' && panel.settings.locatorsSettings.show) {
            layer.markerSettings = [{
                dataSource: argsData[1],
                visible: true,
                animationDelay: 0,
                animationDuration: 0,
                shape: 'Balloon',
                fill: '#2188da',
                height: 20,
                width: 17,
                border: { width: 2, color: 'white' },
                tooltipSettings: {
                    template: '#templateMapTooltip',
                    visible: true,
                    valuePath: panel.settings.locatorsSettings.settings.locatorFieldTitle,
                }
            }];
            for (var i = 0; i < layer.markerSettings[0].dataSource.length; i++) {
                layer.markerSettings[0].dataSource[i].tootltipTitle = panel.settings.locatorsSettings.settings.locatorFieldTitle;
                layer.markerSettings[0].dataSource[i].tootltipPropertiesToShow = panel.settings.locatorsSettings.settings.locatorFieldsTooltip;
                if (typeof layer.markerSettings[0].dataSource[i][panel.settings.locatorsSettings.settings.locatorFieldLatitude] !== 'undefined')
                    layer.markerSettings[0].dataSource[i].latitude = layer.markerSettings[0].dataSource[i][panel.settings.locatorsSettings.settings.locatorFieldLatitude];
                if (typeof layer.markerSettings[0].dataSource[i][panel.settings.locatorsSettings.settings.locatorFieldLongitude] !== 'undefined')
                    layer.markerSettings[0].dataSource[i].longitude = layer.markerSettings[0].dataSource[i][panel.settings.locatorsSettings.settings.locatorFieldLongitude];
            }
        }
        else if (key === 'colors' && panel.settings.colorsSettings.show && panel.settings.colorsSettings.settings.colorRanges.length > 0) {
            layer.shapeDataPath = panel.settings.colorsSettings.settings.colorFieldRegion;
            layer.dataSource = argsData[0];
            layer.shapeSettings.opacity = 0.15;
            layer.shapeSettings.colorValuePath = panel.settings.colorsSettings.settings.colorFieldValue;
            layer.shapeSettings.colorMapping = getColorMapping(panel.settings.colorsSettings.settings, argsData[0]);

            layer.tooltipSettings = {
                visible: true,
                valuePath: panel.settings.selectCountryOrContinetn,
                template: '#templateMapTooltip'
            };
            layer.highlightSettings = {
                enable: true,
                border: { color: 'white', width: 1 }
            };
            for (var i = 0; i < layer.dataSource.length; i++) {
                layer.dataSource[i].tootltipTitle = panel.settings.colorsSettings.settings.colorFieldTitle;
                layer.dataSource[i].tootltipPropertiesToShow = panel.settings.colorsSettings.settings.colorFieldsTooltip;
            }
        }
    }
    if (panel.settings.showOpenStreetSettings) {
        var openStreetLayer = {
            layerType: 'OSM',
            animationDuration: 0
        }
        layer.type = 'SubLayer';
        mapSettings.layers.push(openStreetLayer, layer);
    } else {
        layer.shapeSettings.opacity = 0.9;
        mapSettings.layers.push(layer);
    }
    var map = new ej.maps.Maps(mapSettings);
    map.appendTo('#' + panelId);

    function getColorMapping(settings, dataSource) {
        var ret = [];
        var minValue = dataSource.reduce(function (min, e) {
            if (e[settings.colorFieldValue]) {
                return (e[settings.colorFieldValue] < min) ? e[settings.colorFieldValue] : min
            } else {
                return min
            }
        }, Number.MAX_VALUE);
        if (minValue > 0) minValue = 0;
        var maxValue = dataSource.reduce(function (max, e) {
            if (e[settings.colorFieldValue]) {
                return (e[settings.colorFieldValue] > max) ? e[settings.colorFieldValue] : max
            } else {
                return max
            }
        }, Number.MIN_VALUE);
        if (maxValue === Number.MIN_VALUE) maxValue = settings.colorRanges[0].value + 1;

        if (settings.colorFieldType === 'range') {
            for (var i = settings.colorRanges.length - 1; i >= 0; i--) {
                if (i === settings.colorRanges.length - 1) {
                    var toValue = (settings.colorRanges[i - 1].operator === '>') ? settings.colorRanges[i - 1].value : settings.colorRanges[i - 1].value - 0.01;
                    ret.push({
                        from: minValue,
                        to: toValue.toFixed(2),
                        color: settings.colorRanges[i].toColor,
                    })
                } else if (i === 0) {
                    var fromValue = (settings.colorRanges[i].operator === '>') ? settings.colorRanges[i].value + 0.01 : settings.colorRanges[i].value;
                    ret.push({
                        from: fromValue.toFixed(2),
                        to: maxValue.toFixed(2),
                        color: settings.colorRanges[i].toColor,
                    })
                } else {
                    var toValue = (settings.colorRanges[i - 1].operator === '>') ? settings.colorRanges[i - 1].value : settings.colorRanges[i - 1].value - 0.01;
                    var fromValue = (settings.colorRanges[i].operator === '>') ? settings.colorRanges[i].value + 0.01 : settings.colorRanges[i].value;
                    ret.push({
                        from: fromValue.toFixed(2),
                        to: toValue.toFixed(2),
                        color: settings.colorRanges[i].toColor,
                    })
                }
            }
        }
        else if (settings.colorFieldType === 'saturation') {
            for (var i = settings.colorRanges.length - 1; i >= 0; i--) {
                if (i === settings.colorRanges.length - 1) {
                    var toValue = (settings.colorRanges[i - 1].operator === '>') ? settings.colorRanges[i - 1].value : settings.colorRanges[i - 1].value - 0.01;
                    ret.push({
                        from: minValue,
                        to: toValue.toFixed(2),
                        color: [settings.colorRanges[i].fromColor, settings.colorRanges[i].toColor],
                        label: minValue + ' - ' + settings.colorRanges[i - 1].value,
                        minOpacity: settings.colorRanges[i].opacity[0] / 100,
                        maxOpacity: settings.colorRanges[i].opacity[1] / 100
                    })
                } else if (i === 0) {
                    var fromValue = (settings.colorRanges[i].operator === '>') ? settings.colorRanges[i].value + 0.01 : settings.colorRanges[i].value;
                    ret.push({
                        from: fromValue.toFixed(2),
                        to: maxValue,
                        color: [settings.colorRanges[i].fromColor, settings.colorRanges[i].toColor],
                        label: settings.colorRanges[i].value + ' - ' + maxValue,
                        minOpacity: settings.colorRanges[i].opacity[0] / 100,
                        maxOpacity: settings.colorRanges[i].opacity[1] / 100
                    })
                } else {
                    var toValue = (settings.colorRanges[i - 1].operator === '>') ? settings.colorRanges[i - 1].value : settings.colorRanges[i - 1].value - 0.01;
                    var fromValue = (settings.colorRanges[i].operator === '>') ? settings.colorRanges[i].value + 0.01 : settings.colorRanges[i].value;
                    ret.push({
                        from: fromValue.toFixed(2),
                        to: toValue.toFixed(2),
                        color: [settings.colorRanges[i].fromColor, settings.colorRanges[i].toColor],
                        label: settings.colorRanges[i - 1].value + ' - ' + settings.colorRanges[i].value,
                        minOpacity: settings.colorRanges[i].opacity[0] / 100,
                        maxOpacity: settings.colorRanges[i].opacity[1] / 100
                    })
                }
            }
        }
        else {
            for (var i = settings.colorRanges.length - 1; i >= 0; i--) {
                ret.push({
                    value: settings.colorRanges[i].value,
                    color: settings.colorRanges[i].toColor,
                })
            }
        }
        return ret;
    }
}

MVD.Dashboards.renderPanelPivot = function (argsData, panel, panelId) {
    document.getElementById(panelId).classList.add('notAlterRow');
    var pivotConfig = {
        locale: 'es',
        dataSourceSettings: {
            enableSorting: true,
            valueSortSettings: { headerDelimiter: " - " },
            expandAll: false,
            allowMemberFilter: true,
            allowValueFilter: true,
            allowLabelFilter: true,
            dataSource: argsData[0],
        },
        height: '100%',
        width: '100%',
        allowCalculatedField: true,
        allowNumberFormatting: true,
        allowConditionalFormatting: true,
        allowExcelExport: true
    };
    for (var key in panel.settings) {
        pivotConfig.dataSourceSettings[key] = panel.settings[key];
    }
    var pivotGridObj = new ej.pivotview.PivotView(pivotConfig);
    pivotGridObj.appendTo('#' + panelId);
}

MVD.Dashboards.renderParameter = function (parameter, extras) {
    var renderId = MVD.DataSources.getParameterRenderId(parameter);
    var containerHTML = (!extras) ? null : extras.position;
    if (document.getElementById(renderId) === null) {
        if (document.getElementById(containerHTML) === null) {
            var panelId = MVD.Dashboards.addPanel(0, 0, 1, 1, true);
            containerHTML = 'panelContent_' + panelId;
            MVD.Dashboards.parametersExtras[renderId] = {
                position: containerHTML,
                type: parameter.type,
                allowMultiple: parameter.allowMultiple,
            };
            if (parameter.defaultValue) {
                MVD.Dashboards.parametersExtras[renderId].defaultValue = parameter.defaultValue;
                MVD.Dashboards.parametersExtras[renderId].defaultValueType = 'value';
            }
        }
        MVD.DataSources.renderParameter(parameter, containerHTML);
    }
    else {
        if (parameter.parameterIndicatorType === 'planSelector') {
            MVD.DataSources.getParameterLookupData(renderId, parameter)
        }
    }
}

MVD.Dashboards.removeParameter = function (parameter, panelId) {
    var countParameterOcurrences = 0;
    for (var keyPanelId in MVD.Dashboards.panels) {
        var parameters = MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[keyPanelId].dataSourcesSettings);
        if (parameters.find(e => e.name === parameter.name)) {
            countParameterOcurrences++;
        }
    }
    try {
        if (countParameterOcurrences === 1) {
            var renderId = MVD.DataSources.getParameterRenderId(parameter);
            ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').removePanel(document.getElementById(renderId + 'Wrapper').closest('div.e-panel').id);
            if (MVD.Dashboards.parametersExtras[renderId]) {
                delete MVD.Dashboards.parametersExtras[renderId];
            }
        }
    } catch (e) {
        console.log('Error al eliminar parámetro', e);
    }
    if (parameter.parameterIndicatorType === 'planSelector') {
        var indicatorsIds = [];
        for (var keyPanel in MVD.Dashboards.panels) {
            if (MVD.Dashboards.panels[keyPanel].sourceType === 'indicator') {
                if (MVD.Dashboards.panels[keyPanel].type === 'indicatorsPanel') {
                    if (MVD.Dashboards.panels[keyPanel].indicatorParameter[0].parameterIndicatorType === 'planSelector' &&
                        MVD.Dashboards.panels[keyPanel].indicatorParameter[0].renderId === renderId &&
                        indicatorsIds.indexOf(MVD.Dashboards.panels[keyPanel].sourceId) === -1) {
                        for (var key in MVD.Dashboards.panels[keyPanel].settings) {
                            for (var i = 0; i < MVD.Dashboards.panels[keyPanel].settings[key].indicatorsIds.length; i++) {
                                if (indicatorsIds.indexOf(MVD.Dashboards.panels[keyPanel].settings[key].indicatorsIds[i]) === -1) {
                                    indicatorsIds.push(MVD.Dashboards.panels[keyPanel].settings[key].indicatorsIds[i]);
                                }
                            }
                        }
                    }
                } else {
                    if (MVD.Dashboards.panels[keyPanel].indicatorParameter[0].parameterIndicatorType === 'planSelector' &&
                        MVD.DataSources.getParameterRenderId(MVD.Dashboards.panels[keyPanel].indicatorParameter[0]) === renderId &&
                        indicatorsIds.indexOf(MVD.Dashboards.panels[keyPanel].sourceId) === -1) {
                        indicatorsIds.push(MVD.Dashboards.panels[keyPanel].sourceId);
                    }
                }
            }
        }
        if (indicatorsIds.length === 0) return;
        for (var l = 0; l < indicatorsIds.length; l++) {
            if (l === 0) {
                parameter.extraConfig.caml = '<View><Query><Where><In><FieldRef Name="Indicator" LookupId="True" /><Values>';
            }
            parameter.extraConfig.caml += '<Value Type="Lookup">' + indicatorsIds[l] + '</Value>';
        }
        if (parameter.extraConfig.caml) {
            parameter.extraConfig.caml += '</Values></In></Where></Query></View>';
        }
        MVD.DataSources.getParameterLookupData(renderId, parameter);
    }
}

MVD.Dashboards.renderPanelIndicatorGroup = function (data, panel, panelId, indicatorsMasks) {
    let columns = [{
        field: 'idRow',
        visible: false,
        isPrimaryKey: true
    }, {
        headerText: panel.settings.groupName,
        field: 'title',
        template: '<span data-id=${idRow} class="indicatorPanelLink e-icons e-chartIcon" style="margin-right: 5px;"></span><span>${title}</span>',
        clipMode: 'Clip',
        width: '30%'
    }];
    var treeGridData = [];
    for (var i = 0; i < data.length; i++) {
        for (var j = data[i].length - 1; j >= 0; j--) {
            if (typeof data[i][j].History !== 'undefined') {
                data[i].splice(j, 1);
            }
        }
        proccesData(data[i], indicatorsMasks[i], treeGridData);
    }
    columns = columns.sort(function (a, b) {
        function getMonthNumber(month) {
            var monthNumber = 0;
            switch (month) {
                case 'Ene':
                    monthNumber = 1;
                    break;
                case 'Feb':
                    monthNumber = 2;
                    break;
                case 'Mar':
                    monthNumber = 3;
                    break;
                case 'Abr':
                    monthNumber = 4;
                    break;
                case 'May':
                    monthNumber = 5;
                    break;
                case 'Jun':
                    monthNumber = 6;
                    break;
                case 'Jul':
                    monthNumber = 7;
                    break;
                case 'Ago':
                    monthNumber = 8;
                    break;
                case 'Sept':
                    monthNumber = 9;
                    break;
                case 'Oct':
                    monthNumber = 10;
                    break;
                case 'Nov':
                    monthNumber = 11;
                    break;
                case 'Dec':
                    monthNumber = 12;
                    break;
                case 'YTD':
                    monthNumber = 13;
                    break;
            }
            return monthNumber;
        };
        var monthA = getMonthNumber(a.headerText);
        var monthB = getMonthNumber(b.headerText);
        return (monthA === monthB) ? 0 : (monthA < monthB) ? -1 : 1;
    });
    var treeGridSettings = {
        allowExcelExport: true,
        dataSource: treeGridData,
        childMapping: 'subIndicators',
        treeColumnIndex: 1,
        columns: columns,
        height: (document.getElementById(panelId.replace('Content', '')).querySelectorAll('div.e-panel-content')[0].clientHeight - 45) + 'px',
        editSettings: { allowEditing: false, allowAdding: false, allowDeleting: true },
    };
    var treeGridObj = new ej.treegrid.TreeGrid(treeGridSettings);
    treeGridObj.appendTo('#' + panelId);
    MVD.Dashboards.UI.handlerSpinner(panelId.replace('Content', 'Spinner'), false);


    function proccesData(data, indicatorSourceMask, parentData, subIndicatorPanelShowDataTypesValue) {
        getColumnsAndData(data, indicatorSourceMask, panel.settings, columns, parentData, subIndicatorPanelShowDataTypesValue);
        var indicator = MVD.DataSources.cacheIndicators.find(e => e.id == indicatorSourceMask.id);
        if (indicator) {
            var plan = indicator.plans.find(e => e.Title == indicatorSourceMask.typeSettings.planName);
            if (plan.DataSourceType === 'Cálculo en base a otros indicadores') {
                for (var l = 0; l < parentData.length; l++) {
                    var row = parentData[l];
                    if (row.idRow.split('_')[0] != indicatorSourceMask.id) continue;
                    row.subIndicators = [];
                    for (var k = 0; k < plan.IndicatorsChilds_SPData[k].value.length; k++) {
                        var indicatorChild = MVD.DataSources.cacheIndicators.find(e => e.id == plan.IndicatorsChilds_SPData[k].value);
                        var auxPlan = indicatorChild.plans.find(e => e.Title == indicatorSourceMask.typeSettings.planName);
                        if (auxPlan) {
                            var childMask = MVD.DataSources.Indicator.getSourceMask(indicatorChild.id, auxPlan.Title);
                            var childData = plan.ControlPoints.reduce(function (accu, e) {
                                var auxData = e.Values.find(ele => ele.IndicatorID == indicatorChild.id);
                                if (auxData) {
                                    accu.push(auxData);
                                }
                                return accu;
                            }, []);
                            var rowYTD = { 'Date': 'YTD' };
                            for (var i = childData.length - 1; i >= 0; i--) {
                                if (typeof childData[i].AccumulatedValue !== 'undefined' && typeof rowYTD.YearAccumulatedValue === 'undefined') {
                                    rowYTD.YearAccumulatedValue = childData[i].AccumulatedValue;
                                }
                                if (typeof childData[i].DeviationAccumulatedValue !== 'undefined' && typeof rowYTD.YearAccumulatedDeviationValue === 'undefined') {
                                    rowYTD.YearAccumulatedDeviationValue = childData[i].DeviationAccumulatedValue;
                                }
                                if (typeof childData[i].PredictedAccumulatedValue !== 'undefined' && typeof rowYTD.YearAccumulatedPredictedValue === 'undefined') {
                                    rowYTD.YearAccumulatedPredictedValue = childData[i].PredictedAccumulatedValue;
                                }
                            }
                            childData.push(rowYTD);
                            proccesData(childData, childMask, row.subIndicators, row.idRow.split('_')[1]);
                        } else {
                            MVD.SyncfusionUtilities.showToast('El indicador hijo ' + indicatorChild.title + ' no tiene plan ' + plan.Title);
                        }

                    }
                }
            }
        }
    };
    function getColumnsAndData(data, indicatorSourceMask, settings, columns, treeGridData, subIndicatorPanelShowDataTypesValue) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].Date === 'YTD') {
                if (!settings.showYTD) continue;
                data[i].Value = data[i].YearAccumulatedValue;
                data[i].AccumulatedValue = data[i].YearAccumulatedValue;
                data[i].DeviationValue = data[i].YearAccumulatedDeviationValue;
                data[i].DeviationAccumulatedValue = data[i].YearAccumulatedDeviationValue;
                data[i].PredictedValue = data[i].YearAccumulatedPredictedValue;
                data[i].PredictedAccumulatedValue = data[i].YearAccumulatedPredictedValue;
                data[i].Scale = {};
            }
            //if (i === 0 && columns.filter(e => e.field === 'idRow').length === 0) {
            //    if (settings.showYTD) {
            //        columns.push({
            //            field: 'idRow',
            //            visible: false,
            //            isPrimaryKey: true
            //        });
            //    }
            //    columns.push({
            //        headerText: settings.groupName,
            //        field: 'title',
            //        template: '<span data-id=${idRow} class="indicatorPanelLink e-icons e-chartIcon" style="margin-right: 5px;"></span><span>${title}</span>',
            //        clipMode: 'Clip',
            //        width: '30%'
            //    });
            //}
            if (columns.filter(e => e.headerText === data[i].Date).length === 0) {
                let auxColumn = {
                    headerText: data[i].Date,
                    textAlign: 'Center',
                };
                if (data[i].Date === 'YTD') {
                    auxColumn.field = 'valueControlPoint_' + data[i].Date;
                } else {
                    auxColumn.template =
                        '<div class="flexContainer">' +
                        '<div class="indicatorPanelRow">' +
                        '${if(iconUrlControlPoint_' + data[i].Date + ')}' +
                        '<div style="margin:auto; margin-right: 2px">' +
                        '<div class="indocatorRowIcon" style="background-image: url(${iconUrlControlPoint_' + data[i].Date + '});"></div>' +
                        '</div>' +
                        '${/if}' +
                        '${if(valueControlPoint_' + data[i].Date + ')}' +
                        '<div class="indocatorRowValue" style="Xbackground:${backgroundColorControlPoint_' + data[i].Date + '};">${valueControlPoint_' + data[i].Date + '}</div>' +
                        '${/if}' +
                        '</div>' +
                        '</div>';
                }
                columns.push(auxColumn);
            }
            var indicatorPanelShowDataTypesValues = settings.showData;
            if (subIndicatorPanelShowDataTypesValue) {
                indicatorPanelShowDataTypesValues = [subIndicatorPanelShowDataTypesValue];
            }
            let titleColumn = (indicatorSourceMask.id > 0) ? '' : Object.keys(indicatorSourceMask.indicator)[2];
            for (var j = 0; j < indicatorPanelShowDataTypesValues.length; j++) {

                var indicator = (indicatorSourceMask.id > 0) ?
                    MVD.DataSources.cacheIndicators.find(e => (e.id == indicatorSourceMask.id)) :
                    {
                        id: indicatorSourceMask.indicator[titleColumn].replace(/ /g, ''),
                        title: indicatorSourceMask.indicator[titleColumn],
                        numberFormatValues: indicatorSourceMask.indicator.MeasureFormat,
                        numberFormatDeviations: indicatorSourceMask.indicator.MeasureFormat
                    };
                var idRow = indicator.id + '_' + indicatorPanelShowDataTypesValues[j];
                var row = treeGridData.find(e => (e.idRow === idRow));
                var pushRow = false;
                if (!row) {
                    pushRow = true;
                    row = {
                        idRow: idRow,
                    }
                }
                try {
                    if (indicatorPanelShowDataTypesValues[j] === 'DeviationValue') {
                        var number = (Number.isFinite(data[i].DeviationValue)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].DeviationValue / 100).format('0.12%') :
                                numeral(data[i].DeviationValue).format(indicator.numberFormatDeviations))
                            : null;

                        row['title'] = 'Desvío ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = (number === null) ? null : data[i].Scale.IconUrl;
                        row['backgroundColorControlPoint_' + data[i].Date] = (number === null) ? null : data[i].Scale.BackColor;

                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'DeviationValueIcon') {
                        var number = (Number.isFinite(data[i].DeviationValue)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].DeviationValue / 100).format('0.12%') :
                                numeral(data[i].DeviationValue).format(indicator.numberFormatDeviations))
                            : null;
                        row['title'] = 'Desvío ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = null;
                        row['iconUrlControlPoint_' + data[i].Date] = (number === null) ? null : data[i].Scale.IconUrl;
                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'DeviationValueValue') {
                        var number = (Number.isFinite(data[i].DeviationValue)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].DeviationValue / 100).format('0.12%') :
                                numeral(data[i].DeviationValue).format(indicator.numberFormatDeviations))
                            : null;
                        row['title'] = 'Desvío ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = null;
                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'DeviationAccumulatedValue') {
                        var number = (Number.isFinite(data[i].DeviationAccumulatedValue)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].DeviationAccumulatedValue / 100).format('0.12%') :
                                numeral(data[i].DeviationAccumulatedValue).format(indicator.numberFormatDeviations))
                            : null;
                        //var number = (Number.isFinite(data[i].DeviationAccumulatedValue)) ? numeral(data[i].DeviationAccumulatedValue).format(indicator.numberFormatDeviations) : null;
                        row['title'] = 'Desvío acumulado ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = (number === null) ? null : data[i].Scale.IconUrl;
                        if (indicatorSourceMask.typeSettings.plan.ValueFieldType !== 'Simple' || (indicatorSourceMask.typeSettings.plan.ValueFieldType === 'Simple' && indicatorSourceMask.typeSettings.plan.AggregateFunction !== 'Suma')) {
                            row['valueControlPoint_' + data[i].Date] = 'N/A';
                            row['iconUrlControlPoint_' + data[i].Date] = null;
                        }
                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'DeviationAccumulatedValueValue') {
                        var number = (Number.isFinite(data[i].DeviationAccumulatedValue)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].DeviationAccumulatedValue / 100).format('0.12%') :
                                numeral(data[i].DeviationAccumulatedValue).format(indicator.numberFormatDeviations))
                            : null;
                        row['title'] = 'Desvío acumulado ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = null;
                        if (indicatorSourceMask.typeSettings.plan.ValueFieldType !== 'Simple' || (indicatorSourceMask.typeSettings.plan.ValueFieldType === 'Simple' && indicatorSourceMask.typeSettings.plan.AggregateFunction !== 'Suma')) {
                            row['valueControlPoint_' + data[i].Date] = 'N/A';
                        }
                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'Value') {
                        //var number = (Number.isFinite(data[i].Value)) ? numeral(data[i].Value).format(indicator.numberFormatValues) : null;
                        var number = (Number.isFinite(data[i].Value)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].Value / 100).format('0.12%') :
                                numeral(data[i].Value).format(indicator.numberFormatDeviations))
                            : null;
                        row['title'] = 'Real ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = (number === null) ? null : data[i].Scale.IconUrl;
                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'ValueValue') {
                        //var number = (Number.isFinite(data[i].Value)) ? numeral(data[i].Value).format(indicator.numberFormatValues) : null;
                        var number = (Number.isFinite(data[i].Value)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].Value / 100).format('0.12%') :
                                numeral(data[i].Value).format(indicator.numberFormatDeviations))
                            : null;
                        row['title'] = 'Real ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = null;
                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'AccumulatedValue') {
                        // var number = (Number.isFinite(data[i].AccumulatedValue)) ? numeral(data[i].AccumulatedValue).format(indicator.numberFormatValues) : null;
                        var number = (Number.isFinite(data[i].AccumulatedValue)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].AccumulatedValue / 100).format('0.12%') :
                                numeral(data[i].AccumulatedValue).format(indicator.numberFormatDeviations))
                            : null;
                        row['title'] = 'Real acumulado ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = (number === null) ? null : data[i].Scale.IconUrl;
                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'AccumulatedValueValue') {
                        // var number = (Number.isFinite(data[i].AccumulatedValue)) ? numeral(data[i].AccumulatedValue).format(indicator.numberFormatValues) : null;
                        var number = (Number.isFinite(data[i].AccumulatedValue)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].AccumulatedValue / 100).format('0.12%') :
                                numeral(data[i].AccumulatedValue).format(indicator.numberFormatDeviations))
                            : null;
                        row['title'] = 'Real acumulado ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = null;
                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'PredictedValue') {
                        // var number = (Number.isFinite(data[i].PredictedValue)) ? numeral(data[i].PredictedValue).format(indicator.numberFormatValues) : null;
                        var number = (Number.isFinite(data[i].PredictedValue)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].PredictedValue / 100).format('0.12%') :
                                numeral(data[i].PredictedValue).format(indicator.numberFormatDeviations))
                            : null;
                        row['title'] = 'Previsto ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = null;
                    }
                    else if (indicatorPanelShowDataTypesValues[j] === 'PredictedAccumulatedValue') {
                        //var number = (Number.isFinite(data[i].PredictedAccumulatedValue)) ? numeral(data[i].PredictedAccumulatedValue).format(indicator.numberFormatValues) : null;
                        var number = (Number.isFinite(data[i].PredictedAccumulatedValue)) ? (
                            (indicator.numberFormatDeviations === '% sin multiplicar por 100') ?
                                numeral(data[i].PredictedAccumulatedValue / 100).format('0.12%') :
                                numeral(data[i].PredictedAccumulatedValue).format(indicator.numberFormatDeviations))
                            : null;
                        row['title'] = 'Previsto acumulado ' + indicator.title;
                        row['valueControlPoint_' + data[i].Date] = (number === null) ? '' : number;
                        row['iconUrlControlPoint_' + data[i].Date] = null;
                        if (indicatorSourceMask.typeSettings.plan.ValueFieldType !== 'Simple' || (indicatorSourceMask.typeSettings.plan.ValueFieldType === 'Simple' && indicatorSourceMask.typeSettings.plan.AggregateFunction !== 'Suma')) {
                            row['valueControlPoint_' + data[i].Date] = 'N/A';
                        }
                    }
                } catch (e) {
                    console.warn(e);
                }
                if (pushRow) {
                    treeGridData.push(row);
                }
            }
        }
    };
}

MVD.Dashboards.renderIndicatorPageActionsBtn = function () {
    MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.siteServerRelativeUrl, '/lists/acciones',
        '<View><Query><Where><Eq><FieldRef Name="Tipo_x0020_accion"/><Value Type="Choice">Indicadores</Value></Eq></Where></Query></View>')
        .then(function (items) {
            let style = document.createElement('style');
            style.innerHTML = '.e-dropdown-btn.e-custom { width:145px; background-color: transparent;} .e-list::before { content: "\\eb5b"; } .e-dropdown-btn.e-btn .e-caret::before {content: none;} .ms-webpart-titleText {font-size: 2em;} #pageTitle {display:none;} .ms-webpartPage-root{ border-spacing: 5px  !important; }';
            document.head.appendChild(style);
            if (items.get_count() > 0) {
                var data = [];
                var enumerator = items.getEnumerator();
                while (enumerator.moveNext()) {
                    let listItem = enumerator.get_current();
                    let action = {};
                    action.link = listItem.get_item('URL').get_url();
                    action.text = listItem.get_item('URL').get_description();
                    action.position = listItem.get_item('Posicion');
                    data.push(action);
                }
                data.sort((a, b) => {
                    if (a.position > b.position) {
                        return 1;
                    }
                    if (a.position < b.position) {
                        return -1;
                    }
                    return 0;
                });
                new ej.splitbuttons.DropDownButton({
                    content: 'Acciones',
                    cssClass: 'e-custom',
                    iconCss: 'e-icons e-list',
                    items: data,
                    select: function (args) {
                        window.open(args.item.link, '_blank');
                    }
                }, '#linkActions');
            }

        })
        .catch(function (err) { console.error(err) });
}

MVD.Dashboards.getPanelJSON = function () {
    var panel = MVD.Dashboards.UI.getPanelSettings();
    for (var key in panel.dataSourcesSettings) {
        if (panel.dataSourcesSettings[key].sourceType === 'DataSource') {
            panel.dataSourcesSettings[key].sourceId = MVD.DataSources.cacheDataSources.find(e => e.id === panel.dataSourcesSettings[key].sourceId).title;
        } else {
            panel.dataSourcesSettings[key].sourceId = MVD.DataSources.cacheIndicators.find(e => e.id == panel.dataSourcesSettings[key].sourceId).title;
        }
    }
    return panel;
}

MVD.Dashboards.getDashboardJSON = function () {
    var auxDashboard = JSON.parse(ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').getPersistData());
    for (var i = 0; i < auxDashboard.panels.length; i++) {
        for (var key in auxDashboard.panels[i]) {
            if (!['col', 'row', 'id', 'sizeX', 'sizeY'].includes(key)) {
                delete auxDashboard.panels[i][key];
            }
        }
    }
    return {
        columns: ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').columns,
        dashboard: auxDashboard.panels,
        panels: MVD.Dashboards.panels,
        parametersExtras: MVD.Dashboards.parametersExtras,
        colorPalette: MVD.Dashboards.colorPaletteIndexed
    };
}