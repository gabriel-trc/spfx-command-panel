window.MVD = MVD || {};
MVD.DataSources = MVD.DataSources || {};
MVD.DataSources.UI = MVD.DataSources.UI || {};
MVD.SPHelpers.Common.getValidJavacriptIndentifier = function (string) {//crear diccionario para no repetir strings. Resolver que pasa si va a devolver vacío
    return string.replace(/[^a-z0-9\-_:\.]|^[^a-z]+/gi, '');
}
MVD.SPHelpers.Common.getValidJavaScriptIndentifier = function (string) {//crear diccionario para no repetir strings. Resolver que pasa si va a devolver vacío
    return string.replace(/[^a-z0-9\-_:\.]|^[^a-z]+/gi, '');
}

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

//MVD.SPHelpers.Common.insertCSS(' #contentBox {max-width: ' + (document.getElementById('contentBox').clientWidth - 40) + 'px !important;}');
//MVD.SPHelpers.Common.pageLoader(true);
var scriptsToLoad = [
    {
        tag: 'link',
        url: '/sites/dev/SiteAssets/MVD.Syncfusion/18.1/ej2/material.css',
        level: 1
    }, {
        tag: 'link',
        url: '/sites/dev/SiteAssets/MVD.DataSources/MVD.DataSources.css',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.Syncfusion/external/js/xlsx.full.min.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.Syncfusion/18.1/ej2/ej2.min.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.Syncfusion/external/js/linq.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.Syncfusion/external/js/moment.min.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.Syncfusion/external/js/jszip.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.DataSources/MVD.DataSources.Sharepoint.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.DataSources/MVD.DataSources.External.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.DataSources/MVD.DataSources.Pivot.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.DataSources/MVD.DataSources.Excel.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.DataSources/MVD.DataSources.Javascript.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.DataSources/MVD.DataSources.Indicator.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.DataSources/MVD.DataSources.Complex.js',
        level: 1
    }, {
        tag: 'script',
        url: '/sites/dev/SiteAssets/MVD.Syncfusion/18.1/ej2/MVD.SyncfusionUtilities.js',
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
        //MVD.SyncfusionUtilities.setCulture('es');
        MVD.SPHelpers.ListItems.getAllLists(_spPageContextInfo.siteServerRelativeUrl)
            .then(function (args) {
                MVD.DataSources.inEditMode = (window.location.href.toLowerCase().indexOf('/editform.aspx') > -1) ? true : false;
                MVD.DataSources.inNewMode = true
                Promise.all([MVD.DataSources.UI.initializePage(), MVD.DataSources.initDataSourcesCache()])
                    .then(function () {
                        MVD.DataSources.bindingFunctions();
                        Promise.all([
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
                                //document.getElementById('contentBox').style.visibility = 'visible';
                                MVD.SPHelpers.Common.pageLoader(false);
                            }, 700);
                        });
                    })
                    .catch(function (args) {
                        MVD.SyncfusionUtilities.showToast(args.msg);
                        console.error(args);
                        //document.getElementById('contentBox').style.visibility = 'visible';
                        MVD.SPHelpers.Common.pageLoader(false);
                    })
                MVD.DataSources.preSaveAction();
            });
    });
})
    .catch(function (args) {
        console.error(args);
        //document.getElementById('contentBox').style.visibility = 'visible';
        MVD.SPHelpers.Common.pageLoader(false);
    });