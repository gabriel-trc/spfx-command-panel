var MVD = MVD || {};
MVD.Dashboards = MVD.Dashboards || {};
MVD.Dashboards.UI = {};
MVD.Dashboards.UI.controlsAuxDataConstants = {
    'chartTypes': [
        { text: 'Área', value: 'Area' }, { text: 'Área apilada', value: 'StackingArea' }, { text: 'Área apilada 100%', value: 'StackingArea100' }, { text: 'Barra', value: 'Bar' },
        { text: 'Barra apilada', value: 'StackingBar' }, { text: 'Barra apilada 100%', value: 'StackingBar100' }, { text: 'Burbuja', value: 'Bubble' },
        { text: 'Columna', value: 'Column' }, { text: 'Columna apilada', value: 'StackingColumn' }, { text: 'Columna apilada 100%', value: 'StackingColumn100' }, { text: 'Dona', value: 'Donut' },
        { text: 'Embudo', value: 'Funnel' }, { text: 'Línea', value: 'Line' }, { text: 'Línea punteada', value: 'DashedLine' }, { text: 'Polar linear', value: 'PolarLine' },
        { text: 'Polar área', value: 'PolarArea' }, { text: 'Pareto', value: 'Pareto' }, { text: 'Pirámide', value: 'Pyramid' }, { text: 'Pirámide invertida', value: 'InvertedPyramid' },
        { text: 'Spline', value: 'Spline' }, { text: 'Spline Area', value: 'SplineArea' }, { text: 'Step Line', value: 'StepLine' }, { text: 'Torta', value: 'Pie' }
    ],
    'searchTypes': [
        /*{ name: 'Expresión regular', internalName: 'regEx' },*/ { name: 'Es igual a', internalName: 'equal' }, { name: 'No es igual a', internalName: 'notEqual' },
        { name: 'Contiene', internalName: 'contains' }, { name: 'No contiene', internalName: 'notContains' }, { name: 'Empieza con', internalName: 'startsWith' },
        { name: 'No empieza con', internalName: 'notStartsWith' }, { name: 'Termina con', internalName: 'endsWith' }, { name: ' No termina con', internalName: 'notEndsWith' }
    ],
    'formatTypes': [
        { format: 'text', formatType: 'Texto', value: 'Sin formato' },
        { format: 'n0', formatType: 'Número', value: '1,234' }, { format: 'n1', formatType: 'Número', value: '1,234.5' }, { format: 'n2', formatType: 'Número', value: '1,234.56' }, { format: 'n3', formatType: 'Número', value: '1,234.567' },
        { format: 'n0', formatType: 'Número', value: '1' }, { format: 'n1', formatType: 'Número', value: '1.2' }, { format: 'n2', formatType: 'Número', value: '1.23' }, { format: 'n3', formatType: 'Número', value: '1.234' },
        { format: '%', formatType: 'Porcentaje', value: '% sin multiplicar por 100' }, { format: 'p0', formatType: 'Porcentaje', value: '0%' }, { format: 'p1', formatType: 'Porcentaje', value: '0.1%' }, { format: 'p2', formatType: 'Porcentaje', value: '0.12%' }, { format: 'p3', formatType: 'Porcentaje', value: '0.123%' },
        { format: '$#,###', formatType: 'Moneda', value: '$1,234' }, { format: '$#,###.#', formatType: 'Moneda', value: '$1,234.5' }, { format: '$#,###.##', formatType: 'Moneda', value: '$1,234.56' }, { format: '$#,###.###', formatType: 'Moneda', value: '$1,234.567' },
        { format: 'M', formatType: 'Fecha', value: 'MM' }, { format: 'M/yy', formatType: 'Fecha', value: 'MM/YY' }, { format: 'M/yyyy', formatType: 'Fecha', value: 'MM/YYYY' },
        { format: 'MMM', formatType: 'Fecha', value: 'MMM' }, { format: 'MMM/yy', formatType: 'Fecha', value: 'MMM/YY' }, { format: 'MMM/yyyy', formatType: 'Fecha', value: 'MMM/YYYY' },
        { format: 'M/d/yy', formatType: 'Fecha', value: 'MM/DD/YY' }, { format: 'M/d/yyyy', formatType: 'Fecha', value: 'MM/DD/YYYY' }, { format: 'E', formatType: 'Fecha', value: 'ddd' },
        { format: 'E MMM yyyy', formatType: 'Fecha', value: 'ddd MMM YYYY' }, { format: 'd/M/yy', formatType: 'Fecha', value: 'DD/MM/YY' }, { format: 'd/M/yyyy', formatType: 'Fecha', value: 'DD/MM/YYYY' }
    ],
    'indicatorPanelShowDataTypes': [
        { text: 'Desvío', value: 'DeviationValue' }, { text: 'Desvío solo icono', value: 'DeviationValueIcon' }, { text: 'Desvío solo valor', value: 'DeviationValueValue' },
        { text: 'Desvío acumulado', value: 'DeviationAccumulatedValue' }, { text: 'Desvío acumulado solo valor', value: 'DeviationAccumulatedValueValue' },
        { text: 'Valor real', value: 'Value' }, { text: 'Valor real solo valor', value: 'ValueValue' },
        { text: 'Valor real acumulado', value: 'AccumulatedValue' }, { text: 'Valor real acumulado solo valor', value: 'AccumulatedValueValue' },
        { text: 'Previsto', value: 'PredictedValue' }, { text: 'Previsto acumulado', value: 'PredictedAccumulatedValue' }
    ]
};

MVD.Dashboards.UI.createCheckBoxTemplate = function (internalName, readOnlyFieldCondition) {
    return {
        create: function (args) {
            return document.createElement('input');
        },
        read: function (args) {
            return ej.base.getComponent(document.getElementById(args.id), 'checkbox').checked;
        },
        destroy: function () {

        },
        write: function (args) {
            var readOnly = false;
            if (typeof readOnlyFieldCondition !== "undefined") {
                readOnly = (args.rowData[readOnlyFieldCondition]) ? true : false;
            }
            var checkbox = new ej.buttons.CheckBox({
                checked: args.rowData[internalName],
                disabled: readOnly
            });
            checkbox.appendTo('#' + args.element.id);
        }
    }
};

MVD.Dashboards.UI.createColorPickerTemplate = function (internalName) {
    return {
        create: function (args) {
            return document.createElement('input');
        },
        read: function (args) {
            return ej.base.getComponent(document.getElementById(args.id), 'colorpicker').value;
        },
        destroy: function (args) {

        },
        write: function (args) {
            var id = args.element.id;
            var colorPicker = new ej.inputs.ColorPicker({
                locale: 'es',
                mode: 'Palette',
                modeSwitcher: false,
                showButtons: false,
                value: args.rowData[internalName],
                noColor: true,
            });
            colorPicker.appendTo('#' + args.element.id);
        }
    }
};

MVD.Dashboards.UI.getColorSettings = function (type) {
    var ret = {};
    if (type === 'map') {
        let colorFieldsTooltip = [];
        let fieldsTooltip = ej.base.getComponent(document.getElementById('colorFieldsTooltip'), 'multiselect');
        fieldsTooltip.value.forEach(function (e) {
            let field = fieldsTooltip.dataSource.find(element => element.internalName === e);
            colorFieldsTooltip.push({
                internalName: field.internalName,
                name: field.name,
                type: field.type,
            });
        });
        ret.colorFieldTitle = ej.base.getComponent(document.getElementById('colorFieldTitle'), 'dropdownlist').value;
        ret.colorFieldsTooltip = colorFieldsTooltip;
        ret.colorFieldRegion = ej.base.getComponent(document.getElementById('colorFieldRegion'), 'dropdownlist').value;
        ret.colorFieldType = ej.base.getComponent(document.getElementById('colorFieldType'), 'dropdownlist').value;
        ret.colorFieldValue = ej.base.getComponent(document.getElementById('colorFieldValue'), 'dropdownlist').value;
        ret.colorRanges = MVD.Dashboards.UI.colorRangeValidateRanges(ret.colorFieldType);
    }
    else if (type === 'gauge') {
        ret = MVD.Dashboards.UI.colorRangeValidateRanges(ret.colorFieldType);
        if (!ret) return false;
    }
    return ret;
};

MVD.Dashboards.UI.getPanelDataSourceId = function (divPanelId, serieId) {
    var dataSourceId = null;
    var seriesSelectorDataSource = ej.base.getComponent(document.getElementById('seriesGroupSelector_' + divPanelId), 'dropdownlist').dataSource;
    if (seriesSelectorDataSource.length > 1) {
        var series = ej.base.getComponent(document.getElementById('seriesGroupSelector_' + divPanelId), 'dropdownlist').itemData.series;
        dataSourceId = series[0].dataSourceId;
        if (serieId && series.length > 1) {
            var index = +serieId.split('_')[1];
            dataSourceId = series[index].dataSourceId;
        }
    }
    else {
        dataSourceId = Object.keys(MVD.Dashboards.panels[divPanelId].dataSourcesSettings)[0];
        if (serieId && Object.keys(MVD.Dashboards.panels[divPanelId].dataSourcesSettings).length > 1) {
            var index = +serieId.split('_')[1];
            dataSourceId = Object.keys(MVD.Dashboards.panels[divPanelId].dataSourcesSettings)[index];
        }
    }
    return dataSourceId;
};

MVD.Dashboards.UI.getPanelSettings = function () {
    var panel = {};
    panel.type = ej.base.getComponent(document.getElementById('panelType'), 'dropdownlist').value;
    panel.title = ej.base.getComponent(document.getElementById('panelTitle'), 'textbox').value;
    panel.dataSourcesSettings = document.getElementById('dataSourcesSettings').value;
    if (panel.dataSourcesSettings) {
        panel.dataSourcesSettings = JSON.parse(panel.dataSourcesSettings);
    }
    getPanelTypeSettings(panel);
    return panel;

    function getPanelTypeSettings(panel) {
        var aux = {};
        if (panel.type === 'chart') {
            aux.verticalName = ej.base.getComponent(document.getElementById('verticalName'), 'textbox').value;
            aux.verticalLabelFormat = ej.base.getComponent(document.getElementById('verticalLabelFormat'), 'dropdownlist').itemData;
            aux.horizontalName = ej.base.getComponent(document.getElementById('horizontalName'), 'textbox').value;
            aux.horizontalLabelFormat = ej.base.getComponent(document.getElementById('horizontalLabelFormat'), 'dropdownlist').itemData;
            aux.sortAxe = ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').value;
            aux.sortDecending = ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').checked;
            aux.series = ej.base.getComponent(document.getElementById('seriesChartGrid'), 'grid').dataSource;
            aux.series.forEach(function (e) {
                for (var key in e) {
                    if (!['name', 'internalName', 'id', 'displayName', 'horizontalField', 'chartType', 'color', 'visible', 'group', 'labelVisible'].includes(key) || (key === 'name' && (typeof e['name'] === 'undefined'))) {
                        delete e[key];
                    }
                    if (key === 'group') {
                        e[key] = (e[key]) ? e[key].trim() : '';
                    }
                }
            });
            aux.dynamicSeries = ej.base.getComponent(document.getElementById('dynamicSeriesChartGrid'), 'grid').dataSource;
            aux.dynamicSeries.forEach(function (e) {
                for (var key in e) {
                    if (!['name', 'id', 'sourceId', 'searchType', 'horizontalField', 'searchValue', 'chartType', 'visible', 'color', 'isCreated', 'group', 'labelVisible'].includes(key)) {
                        delete e[key];
                    }
                    if (key === 'group') {
                        e[key] = (e[key]) ? e[key].trim() : ''
                    }
                }
                e.isDynamic = true;
            });
        }
        else if (panel.type === 'grid') {
            aux = MVD.Dashboards.UI.getGridPersistData('grid');
        }
        else if (panel.type === 'indicatorsPanel') {
            aux.groupName = ej.base.getComponent(document.getElementById('indicatorsPanelGroupName'), 'textbox').value;
            aux.showData = ej.base.getComponent(document.getElementById('indicatorPanelShowDataType'), 'multiselect').value;
            aux.showYTD = ej.base.getComponent(document.getElementById('indicatorsPanelsShowYTDColumn'), 'checkbox').checked;
            if (panel.dataSourcesSettings.indicatorsPanel && panel.dataSourcesSettings.indicatorsPanel.indicatorsPanelSelectorType === 'Responsible') {
                var panelGroups = document.getElementById('indicatorPanelGroupSettings').value;
                if (!panelGroups) {
                    panelGroups = {
                        'Level1': {
                            'groupField': 'Responsible',
                            'valueField': 'ColorValue',
                            'aggregateFunction': 'Promedio',
                            'groupScale': 1,
                            'scaleRange': MVD.DataSources.Indicator.getScaleDefaultRange(1)
                        }
                    };
                    document.getElementById('indicatorPanelGroupSettings').value = JSON.stringify(panelGroups);
                } else {
                    panelGroups = JSON.parse(panelGroups);
                }
                aux.panelGroups = panelGroups;
            }
        }
        else if (panel.type === 'pivot') {
            aux = MVD.DataSources.Pivot.getDataSourceSettings('pivot');
        }
        else if (panel.type === 'map') {
            aux.map = ej.base.getComponent(document.getElementById('selectMap'), 'dropdownlist').value;
            aux.selectCountryOrContinetn = ej.base.getComponent(document.getElementById('selectCountryOrContinetn'), 'dropdownlist').value;
            aux.locatorsSettings = JSON.parse(document.getElementById('locatorsSettings').value);
            aux.colorsSettings = JSON.parse(document.getElementById('colorsSettings').value);
            aux.showOpenStreetSettings = false;//ej.base.getComponent(document.getElementById('openStreetCheckBox'), 'checkbox').checked;
            aux.longitudeInitial = ej.base.getComponent(document.getElementById('initLongitude'), 'numerictextbox').value;
            aux.latitudeInitial = ej.base.getComponent(document.getElementById('initLatitude'), 'numerictextbox').value;
            aux.zoomInitial = ej.base.getComponent(document.getElementById('initZoom'), 'numerictextbox').value;
        }
        else if (panel.type === 'gauge') {
            aux.fieldValue = ej.base.getComponent(document.getElementById('gaugeValueField'), 'dropdownlist').value;
            aux.type = ej.base.getComponent(document.getElementById('gaugeType'), 'dropdownlist').value;
            aux.axeStartValue = ej.base.getComponent(document.getElementById('axeStartValue'), 'numerictextbox').value;
            aux.axeEndValue = ej.base.getComponent(document.getElementById('axeEndValue'), 'numerictextbox').value;
            aux.pointer = {
                type: ej.base.getComponent(document.getElementById('gaugePointerType'), 'dropdownlist').value,
                radius: ej.base.getComponent(document.getElementById('gaugePointerRadius'), 'numerictextbox').value,
                colorType: ej.base.getComponent(document.getElementById('gaugePointerColorType'), 'dropdownlist').value,
                color: ej.base.getComponent(document.getElementById('gaugePointerColorPicker'), 'colorpicker').value
            };
            aux.showScale = ej.base.getComponent(document.getElementById('gaugeShowScale'), 'checkbox').checked;
            aux.value = {
                show: ej.base.getComponent(document.getElementById('gaugeShowValue'), 'checkbox').checked,
                position: ej.base.getComponent(document.getElementById('gaugeValuePosition'), 'dropdownlist').value,
                colorType: ej.base.getComponent(document.getElementById('gaugeValueColorType'), 'dropdownlist').value,
                color: ej.base.getComponent(document.getElementById('gaugeValueColorPicker'), 'colorpicker').value,
                prefix: ej.base.getComponent(document.getElementById('gaugeValueMask'), 'textbox').value
            };
            if (aux.type === 'circular') {
                aux.startAngle = ej.base.getComponent(document.getElementById('gaugeCircularStartAngle'), 'numerictextbox').value;
                aux.endAngle = ej.base.getComponent(document.getElementById('gaugeCircularEndAngle'), 'numerictextbox').value;
            }
            else {
                aux.orientation = ej.base.getComponent(document.getElementById('gaugeLinearOrientation'), 'dropdownlist').value;
            }
            aux.scaleColor = ej.base.getComponent(document.getElementById('gaugeScaleColor'), 'colorpicker').value;
            aux.rangeGreyColor = ej.base.getComponent(document.getElementById('gaugeGreyRangeColor'), 'checkbox').checked;
            aux.rangesColor = MVD.Dashboards.UI.getColorSettings('gauge');
            aux.rangeColorRadius = ej.base.getComponent(document.getElementById('rangeColorRadius'), 'numerictextbox').value;
        }
        panel.settings = aux;
    };
};

MVD.Dashboards.UI.getSourceOfDataSourceSettings = function (sourceSettings) {
    if (!sourceSettings) {
        sourceSettings = {};
    }
    var source = {};
    if (sourceSettings.sourceType === 'Indicador') {
        var planName = null;
        try {
            MVD.DataSources.getParametersValues(sourceSettings.indicatorParameter);
            var auxParameter = sourceSettings.parameters.find(e => e.field === sourceSettings.indicatorParameter[0].field && e.name === sourceSettings.indicatorParameter[0].name);
            planName = (sourceSettings.indicatorParameter[0].value) ? sourceSettings.indicatorParameter[0].value : sourceSettings.indicatorParameter[0].defaultValue;
        } catch (e) { };
        try {
            source = MVD.DataSources.Indicator.getSourceMask(sourceSettings.sourceId, planName);
        } catch (e) {
            source = false;
        };
    }
    else {
        source = JSON.parse(JSON.stringify(MVD.DataSources.cacheDataSources.find(element => element.id == sourceSettings.sourceId)));
        let allParameters = MVD.DataSources.getAllSourceParameters(source);
        for (var i = 0; i < allParameters.length; i++) {
            let foundParameterSettings = sourceSettings.parameters
                .find(e =>
                    Object.values(e.fields).some(r => Object.values(allParameters[i].fields).includes(r)) &&
                    e.sourcesIds.some(r => allParameters[i].sourcesIds.includes(r))
                );
            if (typeof foundParameterSettings === 'undefined') {
                allParameters[i].visible = (allParameters[i].required) ? true : false;
            } else {
                allParameters[i].name = (foundParameterSettings.name) ? foundParameterSettings.name : allParameters[i].name;
            }
        }
        source.parameters = allParameters;
        if (!source || source.id === -1) {
            source = false;
        } else {
            if (source.typeSettings.indicatorType) {
                source.typeSettings.indicatorSheet = sourceSettings.indicatorSheet;
            }
            if (sourceSettings.resumeDataSettings) {
                source = {
                    title: source.title + ' resumido',
                    type: 'Pivot',
                    subType: 'ResumePivot',
                    id: -(Math.floor(Math.random() * 1000000)),
                    parameters: source.parameters,
                    typeSettings: {
                        dataSourceSettings: sourceSettings.resumeDataSettings.dataSourceSettings,
                        sourceId: sourceSettings.sourceId,
                        extraSettings: sourceSettings.resumeDataSettings.extraSettings
                    },
                    detailsFields: source.fields
                }
            }
        }
    }
    return source;
};

MVD.Dashboards.UI.getDataSourceSettings = function () {
    var sourceSettings = {};
    sourceSettings.id = document.getElementById('dataSourceId').value;

    if (sourceSettings.id === 'indicatorsPanel') {
        sourceSettings.indicatorsPanelSelectorType = ej.base.getComponent(document.getElementById('indicatorsPanelSelectorType'), 'dropdownlist').value;
        if (sourceSettings.indicatorsPanelSelectorType === 'Responsible') {
            sourceSettings.responsibles = [];
            var auxResponsibles = SPClientPeoplePicker.SPClientPeoplePickerDict.indicatorsPanelResponsibleSelector_TopSpan.GetAllUserInfo();
            auxResponsibles.forEach(function (e) {
                sourceSettings.responsibles.push({
                    text: e.DisplayText,
                    value: e.Key,
                    userId: e.EntityData.SPUserID
                });
            });
        }
        sourceSettings.sourceId = ej.base.getComponent(document.getElementById('indicatorsPanelIndicatorSelector'), 'multiselect').value;
    }
    else {
        sourceSettings.sourceId = ej.base.getComponent(document.getElementById('source'), 'dropdownlist').value;
    }

    sourceSettings.sourceType = ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value;
    if (!sourceSettings.sourceId || sourceSettings.sourceId.length === 0) {
        sourceSettings.sourceId = null;
        return sourceSettings;
    }

    let parameters = [];
    var parametersGridDataSource = JSON.parse(JSON.stringify(ej.base.getComponent(document.getElementById('parametersGrid'), 'grid').dataSource));
    for (let i = 0; i < parametersGridDataSource.length; i++) {
        if (!parametersGridDataSource[i].visible) continue;
        let parameter = {};
        if (parametersGridDataSource[i].name === parametersGridDataSource[i].createdName) {
            parameter.createdName = parametersGridDataSource[i].createdName;
        }
        else {
            parameter.name = parametersGridDataSource[i].name;
        }
        parameter.sourcesIds = parametersGridDataSource[i].sourcesIds;
        parameter.fields = parametersGridDataSource[i].fields;
        if (parametersGridDataSource[i].dateSubType) {
            parameter.dateSubType = parametersGridDataSource[i].dateSubType;
        }
        parameters.push(parameter);
    }
    sourceSettings.parameters = parameters;


    if (sourceSettings.sourceType === 'Indicador') {
        var indicatorsIds = (sourceSettings.id === 'indicatorsPanel') ? sourceSettings.sourceId : [sourceSettings.sourceId];
        sourceSettings.indicatorParameter = [MVD.Dashboards.UI.getIndicatorParameter(indicatorsIds)];
        if (sourceSettings.indicatorParameter[0].parameterIndicatorType === 'existingParameter') {
            if (sourceSettings.parameters.length > 0 && !sourceSettings.indicatorParameter[0].panelId) {
                for (var j = 0; j < sourceSettings.parameters.length; j++) {
                    if (sourceSettings.indicatorParameter[0].createdName === sourceSettings.parameters[j].createdName) {
                        sourceSettings.indicatorParameter[0].name = (sourceSettings.parameters[j].name) ? sourceSettings.parameters[j].name : sourceSettings.parameters[j].createdName;
                        sourceSettings.parameters[j].visible = true;
                        break;
                    }
                }
            } else {
                sourceSettings.parameters.push(sourceSettings.indicatorParameter[0]);
            }
        }
        else {
            var auxParam = {};
            if (sourceSettings.indicatorParameter[0].createdName === sourceSettings.indicatorParameter[0].name) {
                auxParam['createdName'] = sourceSettings.indicatorParameter[0].createdName;
            } else {
                auxParam['createdName'] = sourceSettings.indicatorParameter[0].createdName;
                auxParam['name'] = sourceSettings.indicatorParameter[0].name;
            }
            auxParam['visible'] = true;
            auxParam['sourcesIds'] = sourceSettings.indicatorParameter[0].sourcesIds;
            auxParam['indicatorsIds'] = sourceSettings.indicatorParameter[0].indicatorsIds;
            sourceSettings.parameters.push(auxParam);
        }
    }
    else {
        var source = MVD.DataSources.cacheDataSources.find(element => element.id == sourceSettings.sourceId);
        if (source.type === 'Pivot') {
            sourceSettings.extraSettings = source.typeSettings.extraSettings;
        } else if (source.typeSettings.indicatorType) {
            sourceSettings.indicatorSheet = ej.base.getComponent(document.getElementById('indicatorSheet'), 'dropdownlist').value;
        }
    }
    var resumeDataSettings = document.getElementById('resumeDataSettings').value;
    sourceSettings.resumeDataSettings = (resumeDataSettings) ? JSON.parse(resumeDataSettings) : '';
    var drillingSettings = document.getElementById('drillingSettings').value;
    sourceSettings.drillingSettings = (drillingSettings) ? JSON.parse(drillingSettings) : '';
    var detailsDataSettings = document.getElementById('detailsDataSettings').value;
    sourceSettings.detailsDataSettings = (detailsDataSettings) ? JSON.parse(detailsDataSettings) : '';
    return sourceSettings;

};

MVD.Dashboards.UI.getDashboardParameters = function () {
    var parameters = [];
    for (var keyPanel in MVD.Dashboards.panels) {
        parameters = parameters.concat(MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[keyPanel].dataSourcesSettings))
    }
    parameters = Enumerable.from(parameters).distinct(function (e) { return e.name }).toArray();
    return parameters;
};

MVD.Dashboards.UI.getDashboardParametersState = function (notShowToast) {
    var parameters = MVD.Dashboards.UI.getDashboardParameters();
    try {
        MVD.DataSources.getParametersValues(parameters);
    }
    catch (args) {
        if (!notShowToast)
            MVD.SyncfusionUtilities.showToast(args.msg);
        return [];
    }
    var map = new Map();
    var parametersStatus = [];
    for (var i = 0; i < parameters.length; i++) {
        if (!map.has(parameters[i].name) && typeof parameters[i].value !== 'undefined') {
            map.set(parameters[i].name, true);
            parametersStatus.push({ name: parameters[i].name, value: parameters[i].value });
        }
    }
    return parametersStatus;
};

MVD.Dashboards.UI.getIndicatorParameter = function (indicatorsIds) {
    var parameter = {};
    var parameterIndicatorType = ej.base.getComponent(document.getElementById('indicatorParameterType'), 'dropdownlist').value;
    if (parameterIndicatorType === 'planSelector') {
        var name = ej.base.getComponent(document.getElementById('indicatorPlanParameterName'), 'textbox').value;
        name = (name) ? name : 'Plan';
        parameter.name = name;
        parameter.createdName = name;
        parameter.field = name;
        parameter.type = 'Lookup';
        parameter.defaultValue = null;
        parameter.extraConfig = {};
        parameter.extraConfig.listId = MVD.SPHelpers.ListItems.listCache['/lists/indicatorsplans']._m_guidString$p$0;
        parameter.extraConfig.showField = 'Title';
        parameter.extraConfig.caml = '';
        for (var keyPanel in MVD.Dashboards.panels) {
            if (MVD.Dashboards.selectedPanelId === keyPanel) continue;
            if (MVD.Dashboards.panels[keyPanel].sourceType === 'indicator') {
                indicatorsIds.push(MVD.Dashboards.panels[keyPanel].sourceId);
            }
        }
        for (var l = 0; l < indicatorsIds.length; l++) {
            if (l === 0) {
                parameter.extraConfig.caml = '<View><Query><Where><In><FieldRef Name="Indicator" LookupId="True" /><Values>';
            }
            parameter.extraConfig.caml += '<Value Type="Lookup">' + indicatorsIds[l] + '</Value>';
        }
        if (parameter.extraConfig.caml) {
            parameter.extraConfig.caml += '</Values></In></Where></Query></View>';
        }
        parameter.extraConfig.uniques = true;
    }
    else {
        parameter = JSON.parse(JSON.stringify(ej.base.getComponent(document.getElementById('indicatorExistingParameterSelector'), 'dropdownlist').itemData));
        if (!parameter) {
            MVD.SyncfusionUtilities.showToast('No a seleccionado el parámetro del indicador.');
        }
    }
    parameter.defaultValue = new Date().getFullYear();
    parameter.required = false;
    parameter.visible = true;
    parameter.parameterIndicatorType = parameterIndicatorType;
    parameter.indicatorsIds = indicatorsIds;
    parameter.sourceId = -1;
    parameter.sourcesIds = [-1];
    return parameter;
};

MVD.Dashboards.UI.getDataToResume = function () {
    let source = MVD.Dashboards.UI.getSourceOfDataSourceSettings(MVD.Dashboards.UI.getDataSourceSettings());
    if (source.subType === 'ResumePivot') {
        let parameters = source.parameters;
        source = JSON.parse(JSON.stringify(MVD.DataSources.cacheDataSources.find(e => e.id === source.typeSettings.sourceId)));
        source.parameters = parameters;
    }
    if (typeof source.fieldsPromise !== 'undefined') {
        source.fieldsPromise.then(function (args) { auxGetDataToResume(args.fields) });
    } else {
        auxGetDataToResume(source.fields)
    }
    function auxGetDataToResume(fields) {
        let resumeDataSettings = document.getElementById('resumeDataSettings').value;
        if (resumeDataSettings) {
            resumeDataSettings = JSON.parse(document.getElementById('resumeDataSettings').value);
        }
        else {
            resumeDataSettings = {
                dataSourceSettings: '',
                extraSettings: {
                    rowsLevel: 1,
                    columnsLevel: 0,
                    transpose: false,
                    transposeField: null
                }
            }
        }
        MVD.Dashboards.UI.handlerSpinner('resumeDataSettingsDialogSpinner', true);
        let requiredParameters = MVD.DataSources.getAllSourceParameters(source).filter(e => e.required);
        if (requiredParameters.length > 0) {
            try {
                requiredParameters.forEach(function (e) {
                    e.name = 'Resumen ' + e.name;
                });
                MVD.DataSources.getParametersValues(requiredParameters);
            }
            catch (args) {
                MVD.SyncfusionUtilities.showToast('Para poder configurar el resumen de datos primero debe cargar los parámetros obligatorios.\n' + args.msg);
                MVD.Dashboards.UI.handlerSpinner('resumeDataSettingsDialogSpinner', false);
                return;
            }
        }
        MVD.DataSources.getSourceData(source, requiredParameters)
            .then(function (data) {
                MVD.Dashboards.UI.initSyncfusionComponent('resumeDataPivot', { dataSource: data, dataSourceSettings: resumeDataSettings.dataSourceSettings, fields: fields });
            })
            .catch(function (args) {
                console.error(args);
                MVD.SyncfusionUtilities.showToast(args.msg);
            })
            .finally(function (args) {
                MVD.Dashboards.UI.handlerSpinner('resumeDataSettingsDialogSpinner', false);
            });
    }
};

MVD.Dashboards.UI.getPanelParameters = function (dataSourcesSettings) {
    var ret = [];
    for (var key in dataSourcesSettings) {
        for (var i = 0; i < dataSourcesSettings[key].parameters.length; i++) {
            var parameter = dataSourcesSettings[key].parameters[i];
            var nameToFind = (parameter.name) ? parameter.name : parameter.createdName;
            var isRepeat = ret.find(e => e.name === nameToFind);
            if (typeof isRepeat === 'undefined') {
                var parameterToRender = null;
                if (parameter.indicatorsIds) {
                    parameterToRender = dataSourcesSettings[key].indicatorParameter[0];
                    parameterToRender.createdNames = {};
                    parameterToRender.createdNames[parameter.sourceId] = parameter.createdName;
                    ret.push(parameterToRender);
                } else {
                    var source = MVD.DataSources.cacheDataSources.find(e => parameter.sourcesIds.includes(e.id));//por ahora tomo el primero. Ordenarlos para ver que tipo prima sobre el otro
                    if (source) {
                        parameterToRender = source.parameters.find(e => e.field === parameter.fields[source.id] && e.dateSubType === parameter.dateSubType);
                        if (parameterToRender) {
                            parameterToRender = JSON.parse(JSON.stringify(parameterToRender));
                            parameterToRender.name = nameToFind;
                            parameterToRender.sourcesIds = parameter.sourcesIds;
                            parameterToRender.fields = parameter.fields;
                            ret.push(parameterToRender);
                        }
                    }
                }
            }
            else {
                for (let keyField in parameter.fields) {
                    if (typeof isRepeat.fields[keyField] === 'undefined') {
                        isRepeat.fields[keyField] = parameter.fields[keyField];
                        isRepeat.sourcesIds.push(keyField);
                    }
                }
                if (parameter.indicatorsIds) {
                    isRepeat.indicatorsIds = isRepeat.indicatorsIds.concat(parameter.indicatorsIds);
                    isRepeat.indicatorsIds = Enumerable.from(isRepeat.indicatorsIds).distinct(function (e) { return e }).orderBy(function (e) { return e }).toArray();
                }
            }
        }
    }
    return ret;
};

MVD.Dashboards.UI.handlerPanelParameters = function (panel, panelId) {
    var parameters = MVD.Dashboards.UI.getPanelParameters(panel.dataSourcesSettings);
    if (typeof MVD.Dashboards.panels[panelId] === 'undefined') {
        parameters.forEach(e => MVD.Dashboards.renderParameter(e));
    }
    else {
        var oldParameters = MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[panelId].dataSourcesSettings);
        for (var i = 0; i < parameters.length; i++) {
            var oldParameter = oldParameters.find(e => e.name === parameters[i].name);
            if (!oldParameter) {
                MVD.Dashboards.renderParameter(parameters[i]);
            }
        }
        for (var k = 0; k < oldParameters.length; k++) {
            var oldParameter = parameters.find(e => e.name === oldParameters[k].name);
            if (!oldParameter) {
                MVD.Dashboards.removeParameter(oldParameters[k]);
            }
        }
    }
};

MVD.Dashboards.UI.initColorTypeRange = function (container, type, ranges) {
    document.getElementById(container).innerHTML = '';
    if (ranges) {
        for (var i = 0; i < ranges.length; i++) {
            var idRow = MVD.Dashboards.UI.colorRangeAddRowChoice(container, type);
            ej.base.getComponent(document.getElementById('toColorRangeColor_' + idRow), 'colorpicker').value = ranges[i].toColor;
            if (ranges[i].value) {
                ej.base.getComponent(document.getElementById('toColorRangeValue_' + idRow), 'numerictextbox').value = ranges[i].value;
            }
            if (ranges[i].operator) {
                ej.base.getComponent(document.getElementById('colorRangeOperator_' + idRow), 'dropdownlist').value = ranges[i].operator;
            }
            if (ranges[i].fromColor) {
                ej.base.getComponent(document.getElementById('fromColorRangeColor_' + idRow), 'colorpicker').value = ranges[i].fromColor;
            }
            if (ranges[i].toColor) {
                ej.base.getComponent(document.getElementById('toColorRangeColor_' + idRow), 'colorpicker').value = ranges[i].toColor;
            }
            if (ranges[i].opacity) {
                ej.base.getComponent(document.getElementById('colorRangeOpacity_' + idRow), 'slider').value = ranges[i].opacity;
            }
        }
    } else {
        MVD.Dashboards.UI.colorRangeAddRowChoice(container, type);
        MVD.Dashboards.UI.colorRangeAddRowChoice(container, type, '#fdd835ff');
    }
    if (container === 'colorMapTypeRanges') {
        MVD.Dashboards.UI.resetMapPreview();
    } else if (container === 'colorGaugeTypeRanges') {
        MVD.Dashboards.UI.resetGaugePreview();
    }
};

MVD.Dashboards.UI.colorRangeAddRowChoice = function (container, type, color) {
    var idRow = Math.floor(Math.random() * 1000000);
    var newEl = document.createElement('div');
    newEl.className = 'flexContainer colorRangeRow';
    newEl.setAttribute('data-idRow', idRow);
    var auxTxt = (document.getElementById(container).children.length === 0) ? 'cuando el campo ' : '';
    var strAux = '';
    var btnClass = ''
    if (type === 'range') {
        strAux =
            '<div class="flexItem25Width"><div class="colorPickerWrapper"><label for="toColorRangeColor_' + idRow + '">Color</label><input type="color" id="toColorRangeColor_' + idRow + '" /></div></div>' +
            '<div class="flexItem25Width" style="display:flex;"><div style="margin:auto" class="operatorTxtContainer">' + auxTxt + '</div></div>' +
            '<div class="flexItem15Width"><input type="text" id="colorRangeOperator_' + idRow + '" /></div>' +
            '<div class="flexItem15Width"><input type="text" id="toColorRangeValue_' + idRow + '" /></div>';
        btnClass = 'flexItem15Width';
    }
    else if (type === 'saturation') {
        strAux =
            '<div class="flexItem40Width">' +
            '<div class="flexContainer">' +
            '<div class="colorPickerWrapper flexItem50Width"><label for="fromColorRangeColor_' + idRow + '">Color desde</label><input type="color" id="fromColorRangeColor_' + idRow + '" /></div>' +
            '<div class="colorPickerWrapper flexItem50Width"><label for="toColorRangeColor_' + idRow + '">Color hasta</label><input type="color" id="toColorRangeColor_' + idRow + '" /></div>' +
            '</div>' +
            '<div class="flexContaier">' +
            '<label for="colorRangeOpacity_' + idRow + '">Opacidad</label>' +
            '<div class="flexItem85Width" style="margin: auto; margin-top: 7px;"><div id="colorRangeOpacity_' + idRow + '"></div></div>' +
            '</div>' +
            '</div>' +
            '<div class="flexItem20Width" style="display:flex;"><div style="margin:auto" class="operatorTxtContainer">' + auxTxt + '</div></div>' +
            '<div class="flexItem12Width" style="display:flex;"><div style="margin:auto"><input type="text" id="colorRangeOperator_' + idRow + '" /></div></div>' +
            '<div class="flexItem12Width" style="display:flex;"><div style="margin:auto"><input type="text" id="toColorRangeValue_' + idRow + '" /></div></div>';
        btnClass = 'flexItem12Width';
    }
    else {
        strAux =
            '<div class="flexItem40Width"><div class="colorPickerWrapper"><label for="toColorRangeColor_' + idRow + '">Color</label><input type="color" id="toColorRangeColor_' + idRow + '" /></div></div>' +
            '<div class="flexItem30Width"><input type="text" id="colorRangeFieldValue_' + idRow + '" /></div>';
        btnClass = 'flexItem15Width';
    }
    var dataType = '';
    if (container === 'colorMapTypeRanges') {
        dataType = 'map';
    } else if (container === 'colorGaugeTypeRanges') {
        dataType = 'gauge';
    }

    var rows = document.getElementById(container).children;
    if (rows.length === 0) {
        strAux += '<div class="' + btnClass + '" style="display:flex"><div style="margin:auto"><button type="button" id="btnAddRowScaleChoice" class="e-btn e-small e-round e-success e-icons e-add"></button></div></div>';
    } else {
        strAux += '<div class="' + btnClass + '" style="display:flex"><div style="margin:auto"><button type="button" id="btnD_' + idRow + '" class="e-btn e-small e-round e-warning e-icons e-delete" data-type="' + dataType + '" onclick="MVD.Dashboards.UI.colorRangeDeleteRowChoice(event)"></button></div></div>';
    }
    newEl.innerHTML = strAux;
    document.getElementById(container).append(newEl);

    if (rows.length > 1) {
        document.getElementById('btnD_' + rows[1].dataset.idrow).parentElement.style.visibility = 'hidden';
    }

    var toColorRangeColor = new ej.inputs.ColorPicker({
        locale: 'es',
        mode: 'Palette',
        change: function (args) {
            if (args.name === 'change') {
                if (container === 'colorMapTypeRanges') {
                    setTimeout(function () {
                        MVD.Dashboards.UI.resetMapPreview();
                    }, 300);
                } else if (container === 'colorGaugeTypeRanges') {
                    setTimeout(function () {
                        MVD.Dashboards.UI.resetGaugePreview();
                    }, 300);
                }
            }
        }
    });
    toColorRangeColor.appendTo('#toColorRangeColor_' + idRow);
    if (color) {
        ej.base.getComponent(document.getElementById('toColorRangeColor_' + idRow), 'colorpicker').value = '#fdd835ff';
    }
    if (type === 'range' || type === 'saturation') {
        var colorRangeOperator = new ej.dropdowns.DropDownList({
            dataSource: ['>', '>='],
            floatLabelType: 'Auto',
            placeholder: 'Operador',
            change: function (args) {
                if (args.isInteracted) {
                    var idRow = args.element.id.replace('colorRangeOperator_', '');
                    MVD.Dashboards.UI.colorRangeChangeOperatorTxt(idRow, args.value, ej.base.getComponent(document.getElementById('toColorRangeValue_' + idRow), 'numerictextbox').value);
                    if (container === 'colorMapTypeRanges') {
                        MVD.Dashboards.UI.resetMapPreview();
                    } else if (container === 'colorGaugeTypeRanges') {
                        setTimeout(function () {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }, 300);
                    }
                }
            },
            value: '>'
        });
        colorRangeOperator.appendTo('#colorRangeOperator_' + idRow);

        var toColorRangeValue = new ej.inputs.NumericTextBox({
            placeholder: 'Valor',
            floatLabelType: 'Auto',
            format: '###.##',
            value: 0,
            decimals: 2,
            locale: 'es',
            change: function (args) {
                if (args.isInteracted) {
                    var idRow = args.event.target.closest('div.colorRangeRow').dataset.idrow;
                    MVD.Dashboards.UI.colorRangeChangeOperatorTxt(idRow, ej.base.getComponent(document.getElementById('colorRangeOperator_' + idRow), 'dropdownlist').value, args.value);
                    if (container === 'colorMapTypeRanges') {
                        MVD.Dashboards.UI.resetMapPreview();
                    } else if (container === 'colorGaugeTypeRanges') {
                        setTimeout(function () {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }, 300);
                    }
                }
            }
        });
        toColorRangeValue.appendTo('#toColorRangeValue_' + idRow);

        if (type === 'saturation') {
            if (color) {
                ej.base.getComponent(document.getElementById('toColorRangeColor_' + idRow), 'colorpicker').value = '#fdd835ff';
            }
            var fromColorRangeColor = new ej.inputs.ColorPicker({
                locale: 'es',
                mode: 'Palette',
                change: function (args) {
                    if (args.name === 'change') {
                        if (container === 'colorMapTypeRanges') {
                            setTimeout(function () {
                                MVD.Dashboards.UI.resetMapPreview();
                            }, 300);
                        }
                    }
                }
            });
            fromColorRangeColor.appendTo('#fromColorRangeColor_' + idRow);

            var colorRangeOpacity = new ej.inputs.Slider({
                min: 0,
                max: 100,
                value: [10, 90],
                step: 1,
                type: 'Range',
                ticks: { placement: 'Before', largeStep: 20, smallStep: 5, showSmallTicks: true },
                tooltip: { placement: 'Before', isVisible: true, showOn: 'Focus' },
                changed: function (args) {
                    if (container === 'colorMapTypeRanges') {
                        MVD.Dashboards.UI.resetMapPreview();
                    }
                }
            });
            colorRangeOpacity.appendTo('#colorRangeOpacity_' + idRow);
        }

        if (document.getElementById(container).children.length > 1) {
            var previousIdRow = document.querySelector('[data-idRow="' + idRow + '"]').previousElementSibling.dataset.idrow;
            var previousOperator = ej.base.getComponent(document.getElementById('colorRangeOperator_' + previousIdRow), 'dropdownlist').value;
            var previousValue = ej.base.getComponent(document.getElementById('toColorRangeValue_' + previousIdRow), 'numerictextbox').value;
            MVD.Dashboards.UI.colorRangeChangeOperatorTxt(previousIdRow, previousOperator, previousValue);
        }

        MVD.Dashboards.UI.colorRangeHideOperatorValueInLastRow();
    } else {
        var dataSource = [];
        var keyField = ej.base.getComponent(document.getElementById('colorFieldValue'), 'dropdownlist').value;
        if (keyField && MVD.Dashboards.UI.mapColorsData.length > 0) {
            dataSource = Enumerable.from(MVD.Dashboards.UI.mapColorsData)
                .distinct(function (e) { return e[keyField] })
                .orderBy(function (e) { return e[keyField] })
                .select(function (e) {
                    var text = (e[keyField]) ? e[keyField].toString() : '';
                    return { text: text, value: text }
                }).toArray();
        }

        var colorRangeFieldValue = new ej.dropdowns.DropDownList({
            placeholder: "Valor a comparar",
            locale: 'es',
            floatLabelType: 'Auto',
            fields: { text: 'text', value: 'value' },
            dataSource: dataSource,
            change: function (args) {
                if (args.isInteracted) {
                    if (container === 'colorMapTypeRanges') {
                        MVD.Dashboards.UI.resetMapPreview();
                    }
                }
            }
        });
        colorRangeFieldValue.appendTo('#colorRangeFieldValue_' + idRow);
    }

    return idRow;
};

MVD.Dashboards.UI.colorRangeChangeOperatorTxt = function (rowId, operador, num) {
    var nextRow = document.querySelector('[data-idRow="' + rowId + '"]').nextElementSibling;
    if (nextRow) {
        var div = nextRow.querySelector('div.operatorTxtContainer');
        var str = '';
        if (operador === '>') {
            str = 'cuando el campo <= ' + num;
        } else if (operador === '>=') {
            str = 'cuando el campo < ' + num;
        }
        if (nextRow.nextElementSibling && operador !== 'noTxt')
            str += ' y';
        div.innerHTML = str;
    }
};

MVD.Dashboards.UI.colorRangeDeleteRowChoice = function (args) {
    var selectedRow = args.currentTarget.closest('div.colorRangeRow').remove();
    MVD.Dashboards.UI.colorRangeHideOperatorValueInLastRow();
    var type = args.srcElement.dataset.type;
    if (type === 'map') {
        MVD.Dashboards.UI.resetMapPreview();
    }
};

MVD.Dashboards.UI.colorRangeHideOperatorValueInLastRow = function () {
    var rows = document.querySelectorAll('.colorRangeRow');
    if (rows.length === 1) return false;
    for (var i = 0; i < rows.length; i++) {
        var rowId = rows[i].getAttribute('data-idRow');
        if (i === rows.length - 2) {
            document.getElementById('colorRangeOperator_' + rowId).closest('div').style.visibility = 'visible';
            document.getElementById('toColorRangeValue_' + rowId).closest('div').style.visibility = 'visible';
        } else if (i === rows.length - 1) {
            document.getElementById('colorRangeOperator_' + rowId).closest('div').style.visibility = 'hidden';
            document.getElementById('toColorRangeValue_' + rowId).closest('div').style.visibility = 'hidden';
        }
    }
};

MVD.Dashboards.UI.colorRangeValidateRanges = function (type) {
    var rows = document.querySelectorAll('.colorRangeRow');
    var value, oper, color, antToValue, antOper;
    var colorRanges = [];
    for (var i = 0; i < rows.length; i++) {
        var rowId = rows[i].getAttribute('data-idRow');
        var range = {};
        if (i < rows.length - 1) {
            if (type !== 'value') {
                try {
                    range.fromColor = ej.base.getComponent(document.getElementById('fromColorRangeColor_' + rowId), 'colorpicker').value;
                } catch (e) { }
                range.toColor = ej.base.getComponent(document.getElementById('toColorRangeColor_' + rowId), 'colorpicker').value;
                range.value = ej.base.getComponent(document.getElementById('toColorRangeValue_' + rowId), 'numerictextbox').value;
                range.operator = ej.base.getComponent(document.getElementById('colorRangeOperator_' + rowId), 'dropdownlist').value;
                try {
                    range.opacity = ej.base.getComponent(document.getElementById('colorRangeOpacity_' + rowId), 'slider').value;
                } catch (e) { }
            } else {
                range.toColor = ej.base.getComponent(document.getElementById('toColorRangeColor_' + rowId), 'colorpicker').value;
                range.value = ej.base.getComponent(document.getElementById('colorRangeFieldValue_' + rowId), 'dropdownlist').value;
            }
        }
        else {
            if (type !== 'value') {
                try {
                    range.fromColor = ej.base.getComponent(document.getElementById('fromColorRangeColor_' + rowId), 'colorpicker').value;
                } catch (e) { }
                range.toColor = ej.base.getComponent(document.getElementById('toColorRangeColor_' + rowId), 'colorpicker').value;
                try {
                    range.opacity = ej.base.getComponent(document.getElementById('colorRangeOpacity_' + rowId), 'slider').value;
                } catch (e) { }
            } else {
                range.toColor = ej.base.getComponent(document.getElementById('toColorRangeColor_' + rowId), 'colorpicker').value;
                range.value = ej.base.getComponent(document.getElementById('colorRangeFieldValue_' + rowId), 'dropdownlist').value;
            }
        }
        colorRanges.push(range);
    }
    var isValid = true;
    if (type !== 'value') {
        for (var j = 0; j < colorRanges.length; j++) {
            if (j < colorRanges.length - 1) {
                if (colorRanges[j].value < colorRanges[j + 1].value) {
                    isValid = false;
                }
            }
        }
    }
    if (!isValid) {
        MVD.SyncfusionUtilities.showToast('El rango de colores presenta errores.');
    }

    return (isValid) ? colorRanges : [];
};

MVD.Dashboards.UI.initPanelSettingsDialog = function () {
    return new Promise(function (resolve, reject) {
        getPanelSettingsTemplate()
            .then(function () {
                var panelSettingsDialog = new ej.popups.Dialog({
                    buttons: [{
                        'click': () => {
                            MVD.SyncfusionUtilities.importTxt(successFunction);
                            function successFunction(panel) {
                                for (var key in panel.dataSourcesSettings) {
                                    if (panel.dataSourcesSettings[key].sourceType === 'DataSource') {
                                        var source = MVD.DataSources.cacheDataSources.find(e => e.title === panel.dataSourcesSettings[key].sourceId);
                                        if (source) {
                                            panel.dataSourcesSettings[key].sourceId = source.id;
                                        } else {
                                            delete panel.dataSourcesSettings[key];
                                        }
                                    } else {
                                        var source = MVD.DataSources.cacheIndicators.find(e => e.title === panel.dataSourcesSettings[key].sourceId);
                                        if (source) {
                                            panel.dataSourcesSettings[key].sourceId = source.id;
                                        } else {
                                            delete panel.dataSourcesSettings[key];
                                        }
                                    }
                                }

                                if (Object.keys(panel.dataSourcesSettings).length > 0) {
                                    MVD.Dashboards.UI.setPanelSettings(panel);
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        },
                        buttonModel: {
                            content: 'Importar',
                            cssClass: 'e-warning',
                            iconCss: 'e-import e-icons'
                        },
                        type: 'Button'
                    }, {
                        'click': () => {
                            var fileName = ej.base.getComponent(document.getElementById('panelTitle'), 'textbox').value;
                            fileName = (fileName) ? fileName : 'PanelSettings';
                            var panelSettings = MVD.Dashboards.UI.getPanelSettings();
                            if (panelSettings.type === 'indicatorsPanel' && panelSettings.dataSourcesSettings.indicatorsPanel.indicatorsPanelSelectorType === 'Responsible') {
                                MVD.SyncfusionUtilities.showToast('Este tipo de panel no soporta ser exportado.');
                                return false;
                            }
                            MVD.SyncfusionUtilities.exportToTxt(fileName, MVD.Dashboards.getPanelJSON());
                        },
                        buttonModel: {
                            content: 'Exportar',
                            cssClass: 'e-warning',
                            iconCss: 'e-export e-icons'
                        },
                        type: 'Button'
                    }, {
                        'click': () => {
                            MVD.Dashboards.UI.savePanelSettingsDialog();
                        },
                        buttonModel: {
                            content: 'Guardar',
                            cssClass: 'e-success',
                            iconCss: 'e-save e-icons'
                        },
                        type: 'Button'
                    }],
                    locale: 'es',
                    position: { X: 'center', Y: 'center' },
                    closeOnEscape: true,
                    showCloseIcon: true,
                    header: 'Editor del panel',
                    content: document.getElementById('panelSettingsContentDialog'),
                    width: '95%',
                    height: window.screen.availHeight,
                    isModal: true,
                    close: function () {
                        document.getElementById('panelSettingsDialog').remove();
                        delete MVD.Dashboards.UI.gaugeData;
                        delete MVD.Dashboards.UI.mapColorsData;
                        delete MVD.Dashboards.UI.mapLocatorsData;
                    },
                    animationSettings: { effect: 'Zoom' },
                    visible: false,
                });
                panelSettingsDialog.appendTo('#panelSettingsDialog');

                var panelTitle = new ej.inputs.TextBox({
                    placeholder: 'Título',
                    floatLabelType: 'Auto',
                    type: 'text',
                    locale: 'es',
                    showClearButton: true
                });
                panelTitle.appendTo('#panelTitle');

                var panelTypeDataSource = [{ value: 'chart', text: 'Gráfica' }, { value: 'grid', text: 'Grilla' }, /*{ value: 'card', text: 'Tarjeta' },*/ { value: 'map', text: 'Mapa' }, { value: 'pivot', text: 'Pivot' }, { value: 'gauge', text: 'Gauge' }, { value: 'indicatorsPanel', text: 'Panel de indicadores' }];
                var panelType = new ej.dropdowns.DropDownList({
                    placeholder: 'Tipo',
                    locale: 'es',
                    floatLabelType: 'Auto',
                    fields: { text: 'text', value: 'value' },
                    dataSource: panelTypeDataSource,
                    change: function (args) {
                        var divsToHide = document.getElementById('panelTypeSettingsContainer').children;
                        for (var i = 0; i < divsToHide.length; i++) {
                            divsToHide[i].style.display = (divsToHide[i].classList.contains(args.value + 'TypeSettings')) ? 'flex' : 'none';
                        }
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetPanelSettingsDialog(args.previousItemData.value);
                            if (args.value === 'map') {
                                ej.base.getComponent(document.getElementById('colorFieldType'), 'dropdownlist').value = 'range';
                                MVD.Dashboards.UI.initColorTypeRange('colorMapTypeRanges', 'range');
                            } else if (args.value === 'gauge') {
                                MVD.Dashboards.UI.initColorTypeRange('colorGaugeTypeRanges', 'range');
                            }
                            else if (args.value === 'indicatorsPanel') {
                                MVD.Dashboards.UI.initSyncfusionComponent('dashboardIndicatorPanelPreview');
                            }
                        }
                    }
                });
                panelType.appendTo('#panelType');

                MVD.Dashboards.UI.initSyncfusionComponent('gridChartDataSources');

                MVD.Dashboards.UI.initSyncfusionComponent('seriesChartGrid');

                MVD.Dashboards.UI.initSyncfusionComponent('dynamicSeriesChartGrid');

                var horizontalName = new ej.inputs.TextBox({
                    locale: 'es',
                    placeholder: 'Nombre del eje horizontal',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true
                });
                horizontalName.appendTo('#horizontalName');

                var horizontalLabelFormat = new ej.dropdowns.DropDownList({
                    placeholder: 'Formato de etiqueta del eje horizontal',
                    floatLabelType: 'Auto',
                    type: 'text',
                    locale: 'es',
                    fields: { groupBy: 'formatType', value: 'value' },
                    dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes'],
                    change: function (args) {
                        if (args.isInteracted) {
                            if (args.itemData.format === 'text') {
                                ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').value = [];
                                ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').enable(true);
                                ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').disabled = false;
                            } else {
                                ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').value = ['xAxis'];
                                ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').enable(false);
                                ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').checked = false;
                                ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').disabled = true;
                            }
                        }
                    }
                });
                horizontalLabelFormat.appendTo('#horizontalLabelFormat');

                var verticalName = new ej.inputs.TextBox({
                    placeholder: 'Nombre del eje vertical',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true,
                    locale: 'es',
                });
                verticalName.appendTo('#verticalName');

                var verticalLabelFormat = new ej.dropdowns.DropDownList({
                    placeholder: 'Formato de etiqueta del eje vertical',
                    floatLabelType: 'Auto',
                    type: 'text',
                    locale: 'es',
                    fields: { groupBy: 'formatType', value: 'value' },
                    dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes'].filter(e => e.format !== 'text')
                });
                verticalLabelFormat.appendTo('#verticalLabelFormat');

                var sortAxe = new ej.dropdowns.MultiSelect({
                    placeholder: 'Ordenar por',
                    locale: 'es',
                    floatLabelType: 'Auto',
                    fields: { text: 'text', value: 'value' },
                    dataSource: [{ text: 'Eje X', value: 'xAxis' }],
                    value: [],
                    mode: 'CheckBox',
                    showSelectAll: true,
                    showDropDownIcon: false,
                    popupHeight: '350px',
                    showSelectAll: false,
                    unSelectAllText: 'Deseleccionar todos',
                    change: function (args) {
                        if (args.value.length > 1 && args.value.includes('xAxis')) {
                            MVD.SyncfusionUtilities.showToast('Si se escoje el Eje X, no se puede ordenar por series.');
                            ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').value = ['xAxis'];
                        }
                    }
                });
                sortAxe.appendTo('#sortAxe');

                var sortDecending = new ej.buttons.CheckBox({
                    label: 'Descendente',
                    labelPosition: 'Before',
                    checked: false,
                });
                sortDecending.appendTo('#sortDecending');

                var indicatorsPanelGroupName = new ej.inputs.TextBox({
                    placeholder: 'Nombre del grupo de indicadores',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true,
                    locale: 'es'
                });
                indicatorsPanelGroupName.appendTo('#indicatorsPanelGroupName');

                var indicatorPanelShowDataType = new ej.dropdowns.MultiSelect({
                    placeholder: 'Datos a mostrar',
                    locale: 'es',
                    floatLabelType: 'Auto',
                    fields: { text: 'text', value: 'value' },
                    value: [],
                    dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['indicatorPanelShowDataTypes'],
                    mode: 'CheckBox',
                    showSelectAll: true,
                    showDropDownIcon: false,
                    popupHeight: '350px',
                    selectAllText: 'Seleccionar todos',
                    unSelectAllText: 'Deseleccionar todos',
                    change: function (args) {
                        if (args.isInteracted) {
                            var panel = MVD.Dashboards.UI.getPanelSettings();
                            if (panel.dataSourcesSettings.indicatorsPanel && panel.dataSourcesSettings.indicatorsPanel.sourceId.length > 0) {
                                MVD.Dashboards.renderPanel(MVD.Dashboards.UI.getPanelSettings(), 'panelContent_indicatorsPanelPreView');
                            }
                        }
                    }
                });
                indicatorPanelShowDataType.appendTo('#indicatorPanelShowDataType');

                var indicatorsPanelsShowYTDColumn = new ej.buttons.CheckBox({
                    label: 'Mostrar columna YTD',
                    labelPosition: 'Before',
                    checked: false
                });
                indicatorsPanelsShowYTDColumn.appendTo('#indicatorsPanelsShowYTDColumn');

                var maps = [{ category: 'Mundo', map: 'Mundo' }, { category: 'Continente', map: 'Africa' }, { category: 'Continente', map: 'Antartica' }, { category: 'Continente', map: 'Asia' }, { category: 'Continente', map: 'Europe' }, { category: 'Continente', map: 'North America' }, { category: 'Continente', map: 'Oceania' }, { category: 'Continente', map: 'South America' }, { category: 'País', map: 'Afghanistan' }, { category: 'País', map: 'Albania' }, { category: 'País', map: 'Algeria' }, { category: 'País', map: 'Andorra' }, { category: 'País', map: 'Angola' }, { category: 'País', map: 'Anguilla' }, { category: 'País', map: 'Antigua and Barbuda' }, { category: 'País', map: 'Argentina' }, { category: 'País', map: 'Armenia' }, { category: 'País', map: 'Aruba' }, { category: 'País', map: 'Australia' }, { category: 'País', map: 'Austria' }, { category: 'País', map: 'Azerbaijan' },
                { category: 'País', map: 'Bahrain' }, { category: 'País', map: 'Bangladesh' }, { category: 'País', map: 'Barbados' }, { category: 'País', map: 'Belarus' }, { category: 'País', map: 'Belgium' }, { category: 'País', map: 'Belize' }, { category: 'País', map: 'Benin' }, { category: 'País', map: 'Bermuda' }, { category: 'País', map: 'Bhutan' }, { category: 'País', map: 'Bolivia' }, { category: 'País', map: 'Bosnia and Herzegovina' }, { category: 'País', map: 'Botswana' }, { category: 'País', map: 'Brazil' }, { category: 'País', map: 'Brunei' }, { category: 'País', map: 'Bulgaria' }, { category: 'País', map: 'Burkina Faso' }, { category: 'País', map: 'Burundi' }, { category: 'País', map: 'Cambodia' }, { category: 'País', map: 'Cameroon' }, { category: 'País', map: 'Canada' }, { category: 'País', map: 'Cape Verde' }, { category: 'País', map: 'Cayman Islands' },
                { category: 'País', map: 'Central African Republic' }, { category: 'País', map: 'Chad' }, { category: 'País', map: 'Chile' }, { category: 'País', map: 'China' }, { category: 'País', map: 'Colombia' }, { category: 'País', map: 'Comoros' }, { category: 'País', map: 'Costa Rica' }, { category: 'País', map: 'Croatia' }, { category: 'País', map: 'Cuba' }, { category: 'País', map: 'Cyprus' }, { category: 'País', map: 'Czech Republic' }, { category: 'País', map: 'Democratic Republic of the Congo' }, { category: 'País', map: 'Denmark' }, { category: 'País', map: 'Djibouti' }, { category: 'País', map: 'Dominica' }, { category: 'País', map: 'Dominican Republic' }, { category: 'País', map: 'East Timor' }, { category: 'País', map: 'Ecuador' }, { category: 'País', map: 'Egypt' }, { category: 'País', map: 'El Salvador' }, { category: 'País', map: 'Equatorial Guinea' },
                { category: 'País', map: 'Eritrea' }, { category: 'País', map: 'Estonia' }, { category: 'País', map: 'Ethiopia' }, { category: 'País', map: 'Falkland Islands' }, { category: 'País', map: 'Faroe Islands' }, { category: 'País', map: 'Fiji' }, { category: 'País', map: 'Finland' }, { category: 'País', map: 'France' }, { category: 'País', map: 'Gabon' }, { category: 'País', map: 'Gambia' }, { category: 'País', map: 'Georgia' }, { category: 'País', map: 'Germany' }, { category: 'País', map: 'Ghana' }, { category: 'País', map: 'Gibraltar' }, { category: 'País', map: 'Greece' }, { category: 'País', map: 'Greenland' }, { category: 'País', map: 'Grenada' }, { category: 'País', map: 'Guam' }, { category: 'País', map: 'Guatemala' }, { category: 'País', map: 'Guernsey' }, { category: 'País', map: 'Guinea Bissau' }, { category: 'País', map: 'Guinea' }, { category: 'País', map: 'Guyana' },
                { category: 'País', map: 'Haiti' }, { category: 'País', map: 'Honduras' }, { category: 'País', map: 'Hong Kong S.A.R' }, { category: 'País', map: 'Hungary' }, { category: 'País', map: 'Iceland' }, { category: 'País', map: 'India' }, { category: 'País', map: 'Indonesia' }, { category: 'País', map: 'Iran' }, { category: 'País', map: 'Iraq' }, { category: 'País', map: 'Ireland' }, { category: 'País', map: 'Isle of Man' }, { category: 'País', map: 'Israel' }, { category: 'País', map: 'Italy' }, { category: 'País', map: 'Ivory Coast' }, { category: 'País', map: 'Jamaica' }, { category: 'País', map: 'Japan' }, { category: 'País', map: 'Jersey' }, { category: 'País', map: 'Jordan' }, { category: 'País', map: 'Kazakhstan' }, { category: 'País', map: 'Kenya' }, { category: 'País', map: 'Kiribati' }, { category: 'País', map: 'Kosovo' }, { category: 'País', map: 'Kuwait' },
                { category: 'País', map: 'Kyrgyzstan' }, { category: 'País', map: 'Laos' }, { category: 'País', map: 'Latvia' }, { category: 'País', map: 'Lebanon' }, { category: 'País', map: 'Lesotho' }, { category: 'País', map: 'Liberia' }, { category: 'País', map: 'Libya' }, { category: 'País', map: 'Liechtenstein' }, { category: 'País', map: 'Lithuania' }, { category: 'País', map: 'Luxembourg' }, { category: 'País', map: 'Macau S.A.R' }, { category: 'País', map: 'Macedonia' }, { category: 'País', map: 'Madagascar' }, { category: 'País', map: 'Malawi' }, { category: 'País', map: 'Malaysia' }, { category: 'País', map: 'Maldives' }, { category: 'País', map: 'Mali' }, { category: 'País', map: 'Malta' }, { category: 'País', map: 'Mauritania' }, { category: 'País', map: 'Mauritius' }, { category: 'País', map: 'Mexico' }, { category: 'País', map: 'Moldova' }, { category: 'País', map: 'Monaco' },
                { category: 'País', map: 'Mongolia' }, { category: 'País', map: 'Montenegro' }, { category: 'País', map: 'Montserrat' }, { category: 'País', map: 'Morocco' }, { category: 'País', map: 'Mozambique' }, { category: 'País', map: 'Myanmar' }, { category: 'País', map: 'Namibia' }, { category: 'País', map: 'Nauru' }, { category: 'País', map: 'Nepal' }, { category: 'País', map: 'Netherlands' }, { category: 'País', map: 'New Caledonia' }, { category: 'País', map: 'New Zealand' }, { category: 'País', map: 'Nicaragua' }, { category: 'País', map: 'Niger' }, { category: 'País', map: 'Nigeria' }, { category: 'País', map: 'Niue' }, { category: 'País', map: 'Norfolk Island' }, { category: 'País', map: 'North Korea' }, { category: 'País', map: 'Norway' }, { category: 'País', map: 'Oman' }, { category: 'País', map: 'Pakistan' }, { category: 'País', map: 'Palau' }, { category: 'País', map: 'Panama' },
                { category: 'País', map: 'Papua New Guinea' }, { category: 'País', map: 'Paraguay' }, { category: 'País', map: 'Peru' }, { category: 'País', map: 'Philippines' }, { category: 'País', map: 'Poland' }, { category: 'País', map: 'Portugal' }, { category: 'País', map: 'Puerto Rico' }, { category: 'País', map: 'Qatar' }, { category: 'País', map: 'Republic of Serbia' }, { category: 'País', map: 'Republic of the Congo' }, { category: 'País', map: 'Romania' }, { category: 'País', map: 'Russia' }, { category: 'País', map: 'Rwanda' }, { category: 'País', map: 'S. Sudan' }, { category: 'País', map: 'Saint Vincent and the Grenadines' }, { category: 'País', map: 'Samoa' }, { category: 'País', map: 'San Marino' }, { category: 'País', map: 'Sao Tome and Principe' }, { category: 'País', map: 'Saudi Arabia' }, { category: 'País', map: 'Senegal' }, { category: 'País', map: 'Sierra Leone' },
                { category: 'País', map: 'Singapore' }, { category: 'País', map: 'Slovakia' }, { category: 'País', map: 'Slovenia' }, { category: 'País', map: 'Solomon Islands' }, { category: 'País', map: 'Somalia' }, { category: 'País', map: 'Somaliland' }, { category: 'País', map: 'South Africa' }, { category: 'País', map: 'South Korea' }, { category: 'País', map: 'Spain' }, { category: 'País', map: 'Sri Lanka' }, { category: 'País', map: 'Sudan' }, { category: 'País', map: 'Suriname' }, { category: 'País', map: 'Swaziland' }, { category: 'País', map: 'Sweden' }, { category: 'País', map: 'Switzerland' }, { category: 'País', map: 'Syria' }, { category: 'País', map: 'Taiwan' }, { category: 'País', map: 'Tajikistan' }, { category: 'País', map: 'Thailand' }, { category: 'País', map: 'The Bahamas' }, { category: 'País', map: 'Togo' }, { category: 'País', map: 'Tonga' },
                { category: 'País', map: 'Trinidad and Tobago' }, { category: 'País', map: 'Tunisia' }, { category: 'País', map: 'Turkey' }, { category: 'País', map: 'Turkmenistan' }, { category: 'País', map: 'Turks and Caicos Islands' }, { category: 'País', map: 'Uganda' }, { category: 'País', map: 'Ukraine' }, { category: 'País', map: 'United Arab Emirates' }, { category: 'País', map: 'United Kingdom' }, { category: 'País', map: 'United Republic of Tanzania' }, { category: 'País', map: 'United States of America' }, { category: 'País', map: 'Uruguay' }, { category: 'País', map: 'Uzbekistan' }, { category: 'País', map: 'Vanuatu' }, { category: 'País', map: 'Vatican' }, { category: 'País', map: 'Venezuela' }, { category: 'País', map: 'Vietnam' }, { category: 'País', map: 'Yemen' }, { category: 'País', map: 'Zambia' }, { category: 'País', map: 'Zimbabwe' }];
                var selectMap = new ej.dropdowns.DropDownList({
                    dataSource: maps,
                    fields: { groupBy: 'category', text: 'map', value: 'map' },
                    placeholder: 'Seleccione un mapa',
                    floatLabelType: 'Auto',
                    popupHeight: '300px',
                    value: 'Mundo',
                    change: function (args) {
                        document.getElementById('selectCountryOrContinetnWrapper').style.visibility = (args.value === 'Mundo') ? 'visible' : 'hidden';
                        ej.base.getComponent(document.getElementById('selectCountryOrContinetn'), 'dropdownlist').value = (args.value === 'Mundo') ? 'continent' : 'name';
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview()
                        }
                    }
                });
                selectMap.appendTo('#selectMap');

                var selectCountryOrContinetn = new ej.dropdowns.DropDownList({
                    dataSource: [{ text: 'Continente', value: 'continent' }, { text: 'País', value: 'name' }],
                    fields: { text: 'text', value: 'value' },
                    placeholder: 'Pintar por',
                    floatLabelType: 'Auto',
                    width: '300px',
                    value: 'continent',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview()
                        }
                    }
                });
                selectCountryOrContinetn.appendTo('#selectCountryOrContinetn');

                var openStreetCheckBox = new ej.buttons.CheckBox({
                    label: 'Cargar datos Open Street',
                    labelPosition: 'Before',
                    checked: false,
                    change: function (args) {
                        if (Object.keys(args).length > 1)
                            MVD.Dashboards.UI.resetMapPreview();
                    }
                });
                openStreetCheckBox.appendTo('#openStreetCheckBox');

                var initLatitude = new ej.inputs.NumericTextBox({
                    placeholder: 'Latitud inicial',
                    floatLabelType: 'Auto',
                    decimals: 6,
                    format: '###.######',
                    showClearButton: true,
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                initLatitude.appendTo('#initLatitude');

                var initLongitude = new ej.inputs.NumericTextBox({
                    placeholder: 'Longitud inicial',
                    floatLabelType: 'Auto',
                    decimals: 6,
                    format: '###.######',
                    showClearButton: true,
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                initLongitude.appendTo('#initLongitude');

                var initZoom = new ej.inputs.NumericTextBox({
                    placeholder: 'Zoom inicial',
                    floatLabelType: 'Auto',
                    decimals: 0,
                    min: 1,
                    format: '###.##',
                    value: 1,
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                initZoom.appendTo('#initZoom');

                var addLocatorsCheckBox = new ej.buttons.CheckBox({
                    label: 'Agregar localizadores',
                    labelPosition: 'Before',
                    checked: false,
                    cssClass: 'flexItem25Width',
                    change: function (args) {
                        document.getElementById('btnLocatorsDataSourceSettingsWrapper').style.visibility = (args.checked) ? 'visible' : 'hidden';
                        document.getElementById('locatorsSettingsWrapper').style.display = (args.checked) ? 'flex' : 'none';
                        if (Object.keys(args).length > 1)
                            MVD.Dashboards.UI.resetMapPreview();
                    }
                });
                addLocatorsCheckBox.appendTo('#addLocatorsCheckBox');

                var locatorFieldTitle = new ej.dropdowns.DropDownList({
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Título del cuadro emergente',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                locatorFieldTitle.appendTo('#locatorFieldTitle');

                var locatorFieldsTooltip = new ej.dropdowns.MultiSelect({
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    floatLabelType: 'Auto',
                    placeholder: 'Descripción del cuadro emergente',
                    mode: 'CheckBox',
                    showSelectAll: true,
                    showDropDownIcon: true,
                    filterBarPlaceholder: 'Búsqueda campo',
                    popupHeight: '350px',
                    value: [],
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                locatorFieldsTooltip.appendTo('#locatorFieldsTooltip');

                var locatorFieldLatitude = new ej.dropdowns.DropDownList({
                    placeholder: 'Campo latitud',
                    floatLabelType: 'Auto',
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                locatorFieldLatitude.appendTo('#locatorFieldLatitude');

                var locatorFieldLongitude = new ej.dropdowns.DropDownList({
                    placeholder: 'Campo longitud',
                    floatLabelType: 'Auto',
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                locatorFieldLongitude.appendTo('#locatorFieldLongitude');

                var addColorsCheckBox = new ej.buttons.CheckBox({
                    label: 'Colorear mapa',
                    labelPosition: 'Before',
                    checked: false,
                    cssClass: 'flexItem25Width',
                    change: function (args) {
                        document.getElementById('btnColorsDataSourceSettingsWrapper').style.visibility = (args.checked) ? 'visible' : 'hidden';
                        document.getElementById('colorsSettingsWrapper').style.display = (args.checked) ? 'flex' : 'none';
                        if (Object.keys(args).length > 1) {
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                addColorsCheckBox.appendTo('#addColorsCheckBox');

                var colorFieldTitle = new ej.dropdowns.DropDownList({
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Título del cuadro emergente',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                colorFieldTitle.appendTo('#colorFieldTitle');

                var colorFieldsTooltip = new ej.dropdowns.MultiSelect({
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    floatLabelType: 'Auto',
                    placeholder: 'Descripción del cuadro emergente',
                    mode: 'CheckBox',
                    showSelectAll: true,
                    showDropDownIcon: true,
                    filterBarPlaceholder: 'Búsqueda campo',
                    popupHeight: '350px',
                    value: [],
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview()
                        }
                    }
                });
                colorFieldsTooltip.appendTo('#colorFieldsTooltip');

                var colorFieldRegion = new ej.dropdowns.DropDownList({
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Campo región',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetMapPreview()
                        }
                    }
                });
                colorFieldRegion.appendTo('#colorFieldRegion');

                var colorFieldType = new ej.dropdowns.DropDownList({
                    dataSource: [{ name: 'Por rango', value: 'range' }, { name: 'Por saturación', value: 'saturation' }, { name: 'Por valor', value: 'value' }],
                    fields: { text: 'name', value: 'value' },
                    placeholder: 'Tipo de coloreado',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.initColorTypeRange('colorMapTypeRanges', args.value);
                        }
                    }
                });
                colorFieldType.appendTo('#colorFieldType');

                var colorFieldValue = new ej.dropdowns.DropDownList({
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Campo valor',
                    floatLabelType: 'Auto',
                    showClearButton: true,
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            var dataSource = Enumerable.from(MVD.Dashboards.UI.mapColorsData)
                                .distinct(function (e) { return e[args.value] })
                                .orderBy(function (e) { return e[args.value] })
                                .select(function (e) {
                                    var text = (e[args.value]) ? e[args.value].toString() : '';
                                    return { text: text, value: text }
                                }).toArray();
                            if (dataSource.length > 0) {
                                var elements = document.querySelectorAll('input[id*="colorRangeFieldValue_"]');
                                for (var i = 0; i < elements.length; i++) {
                                    ej.base.getComponent(document.getElementById(elements[i].id), 'dropdownlist').dataSource = dataSource;
                                    ej.base.getComponent(document.getElementById(elements[i].id), 'dropdownlist').value = dataSource[0];
                                }

                            }
                            MVD.Dashboards.UI.resetMapPreview();
                        }
                    }
                });
                colorFieldValue.appendTo('#colorFieldValue');

                var maps = new ej.maps.Maps({
                    layers: [{
                        shapeData: new ej.maps.MapAjax('/SiteAssets/MVD.Syncfusion/maps/Mundo.txt'),
                    }]
                });
                maps.appendTo('#map');

                var gridDataSourceName = new ej.inputs.TextBox({
                    placeholder: 'Nombre del origen de datos',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true,
                    locale: 'es',
                    readonly: true
                });
                gridDataSourceName.appendTo('#gridDataSourceName');

                MVD.Dashboards.UI.initSyncfusionComponent('grid');

                var pivotDataSourceName = new ej.inputs.TextBox({
                    placeholder: 'Nombre del origen de datos',
                    floatLabelType: 'Auto',
                    type: 'text',
                    locale: 'es',
                    readonly: true,
                    showClearButton: true
                });
                pivotDataSourceName.appendTo('#pivotDataSourceName');

                MVD.Dashboards.UI.initSyncfusionComponent('pivot')

                var gaugeDataSourceName = new ej.inputs.TextBox({
                    placeholder: 'Nombre del origen de datos',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true,
                    locale: 'es',
                    readonly: true
                });
                gaugeDataSourceName.appendTo('#gaugeDataSourceName');

                var gaugeValueField = new ej.dropdowns.DropDownList({
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Campo valor',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeValueField.appendTo('#gaugeValueField');

                var gaugeType = new ej.dropdowns.DropDownList({
                    dataSource: [{ name: 'Circular', value: 'circular' }, { name: 'Lineal', value: 'linear' }],
                    fields: { text: 'name', value: 'value' },
                    placeholder: 'Tipo de gauge',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    value: 'circular',
                    change: function (args) {
                        var elements = document.querySelectorAll('[data-gaugeType]');
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].style.display = (elements[i].dataset.gaugetype.indexOf(args.value) > -1) ? 'block' : 'none';
                        }
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeType.appendTo('#gaugeType');

                var pointersCircle = [{ name: 'Aguja', value: 'Needle' }, { name: 'Aguja y barra de rango', value: 'NeedleAndRangeBar' }, { name: 'Barra de rango', value: 'RangeBar' }, { name: 'Marcador tipo círculo', value: 'Marker-Circle' }, { name: 'Marcador tipo rectángulo', value: 'Marker-Rectangle' },
                { name: 'Marcador tipo triángulo', value: 'Marker-Triangle' }, { name: 'Marcador tipo triángulo invertido', value: 'Marker-InvertedTriangle' }, { name: 'Marcador tipo diamante', value: 'Marker-Diamond' }, { name: 'Ninguno', value: 'None' },];
                var gaugePointerType = new ej.dropdowns.DropDownList({
                    dataSource: pointersCircle,
                    fields: { text: 'name', value: 'value', type: 'type' },
                    placeholder: 'Tipo de puntero',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    value: 'Needle',
                    change: function (args) {
                        var elements = document.getElementsByClassName('gaugePointerSettings');
                        for (var i = 0; i < elements.length; i++) {
                            if (elements[i].classList.contains('gaugePointerColorPickerWrapper')) {
                                if (elements[i].style.visibility !== 'hidden') {
                                    elements[i].style.visibility = (args.value !== 'None') ? 'visible' : 'hidden';
                                }
                            } else {
                                elements[i].style.visibility = (args.value !== 'None') ? 'visible' : 'hidden';
                            }
                        }
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugePointerType.appendTo('#gaugePointerType');

                var gaugePointerRadius = new ej.inputs.NumericTextBox({
                    placeholder: 'Radio del puntero',
                    floatLabelType: 'Auto',
                    min: 0,
                    max: 100,
                    value: 80,
                    format: 'n',
                    change: function (args) {
                        MVD.Dashboards.UI.resetGaugePreview();
                    }
                });
                gaugePointerRadius.appendTo('#gaugePointerRadius');

                var gaugeLinearOrientation = new ej.dropdowns.DropDownList({
                    dataSource: [{ name: 'Vertical', internalName: 'Vertical' }, { name: 'Horizontal', internalName: 'Horizontal' }],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Orientación',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    value: 'Vertical',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeLinearOrientation.appendTo('#gaugeLinearOrientation');

                var gaugePointerColorType = new ej.dropdowns.DropDownList({
                    dataSource: [{ name: 'Según valor', internalName: 'rangeValue' }, { name: 'Color', internalName: 'colorpicker' }],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Color del puntero',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    value: 'rangeValue',
                    change: function (args) {
                        document.getElementsByClassName('gaugePointerColorPickerWrapper')[0].style.visibility = (args.value === 'colorpicker') ? 'visible' : 'hidden';
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugePointerColorType.appendTo('#gaugePointerColorType');

                var gaugePointerColorPicker = new ej.inputs.ColorPicker({
                    locale: 'es',
                    mode: 'Palette',
                    change: function (args) {
                        if (args.name === 'change') {
                            setTimeout(function () {
                                MVD.Dashboards.UI.resetGaugePreview();
                            }, 300);
                        }
                    }
                });
                gaugePointerColorPicker.appendTo('#gaugePointerColorPicker');

                var gaugeShowValue = new ej.buttons.CheckBox({
                    label: 'Mostrar valor',
                    labelPosition: 'Before',
                    checked: true,
                    change: function (args) {
                        var elements = document.getElementsByClassName('gaugeShowValueSettings');
                        for (var i = 0; i < elements.length; i++) {
                            if (elements[i].classList.contains('gaugeValueColorPickerWrapper')) {
                                if (elements[i].style.visibility !== 'hidden') {
                                    elements[i].style.visibility = (args.checked) ? 'visible' : 'hidden';
                                }
                            } else {
                                elements[i].style.visibility = (args.checked) ? 'visible' : 'hidden';
                            }
                        }
                        if (args.event) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeShowValue.appendTo('#gaugeShowValue');

                var gaugeValueMask = new ej.inputs.TextBox({
                    placeholder: 'Prefijo/subfijo',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true,
                    locale: 'es',
                    value: '{value}',
                    change: function () {
                        MVD.Dashboards.UI.resetGaugePreview();
                    }
                });
                gaugeValueMask.appendTo('#gaugeValueMask');

                var gaugeValuePosition = new ej.dropdowns.DropDownList({
                    dataSource: [{ name: 'Superior izquierda', internalName: 'topLeft' }, { name: 'Superior', internalName: 'top' }, { name: 'Superior derecha', internalName: 'topRight' },
                    { name: 'Centro izquierda', internalName: 'middleLeft' }, { name: 'Centro', internalName: 'middle' }, { name: 'Centro derecha', internalName: 'middleRight' },
                    { name: 'Inferior izquierda', internalName: 'bottomLeft' }, { name: 'Inferior', internalName: 'bottom' }, { name: 'Inferior derecha', internalName: 'bottomRight' }],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Posición del valor',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    value: 'middle',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeValuePosition.appendTo('#gaugeValuePosition');

                var gaugeValueColorType = new ej.dropdowns.DropDownList({
                    dataSource: [{ name: 'Según valor', internalName: 'rangeValue' }, { name: 'Color', internalName: 'colorpicker' }],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Color del valor',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    value: 'rangeValue',
                    change: function (args) {
                        document.getElementsByClassName('gaugeValueColorPickerWrapper')[0].style.visibility = (args.value === 'colorpicker') ? 'visible' : 'hidden';
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeValueColorType.appendTo('#gaugeValueColorType');

                var gaugeValueColorPicker = new ej.inputs.ColorPicker({
                    locale: 'es',
                    mode: 'Palette',
                    change: function (args) {
                        if (args.name === 'change') {
                            setTimeout(function () {
                                MVD.Dashboards.UI.resetGaugePreview();
                            }, 300);
                        }
                    }
                });
                gaugeValueColorPicker.appendTo('#gaugeValueColorPicker');

                var gaugeShowScale = new ej.buttons.CheckBox({
                    label: 'Mostrar escala',
                    labelPosition: 'Before',
                    checked: true,
                    change: function (args) {
                        var elements = document.getElementsByClassName('gaugeShowScaleSettings');
                        for (var i = 0; i < elements.length; i++) {
                            elements[i].style.display = (args.checked) ? 'block' : 'none';
                        }
                        if (args.event) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeShowScale.appendTo('#gaugeShowScale');

                var gaugeGreyRangeColor = new ej.buttons.CheckBox({
                    label: 'Dejar escala en gris',
                    labelPosition: 'Before',
                    checked: false,
                    change: function (args) {
                        if (args.event) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeGreyRangeColor.appendTo('#gaugeGreyRangeColor');

                var gaugeCircularStartAngle = new ej.inputs.NumericTextBox({
                    placeholder: 'Ángulo inicial',
                    floatLabelType: 'Auto',
                    decimals: 0,
                    min: 0,
                    max: 360,
                    value: 270,
                    format: 'n',
                    showClearButton: true,
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeCircularStartAngle.appendTo('#gaugeCircularStartAngle');

                var gaugeCircularEndAngle = new ej.inputs.NumericTextBox({
                    placeholder: 'Ángulo final',
                    floatLabelType: 'Auto',
                    decimals: 0,
                    min: 0,
                    max: 360,
                    value: 90,
                    format: 'n',
                    showClearButton: true,
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                gaugeCircularEndAngle.appendTo('#gaugeCircularEndAngle');

                var gaugeScaleColor = new ej.inputs.ColorPicker({
                    locale: 'es',
                    mode: 'Palette',
                    value: '#C3C3C3',
                    change: function (args) {
                        if (args.name === 'change') {
                            setTimeout(function () {
                                MVD.Dashboards.UI.resetGaugePreview();
                            }, 300);
                        }
                    }
                });
                gaugeScaleColor.appendTo('#gaugeScaleColor');

                var axeStartValue = new ej.inputs.NumericTextBox({
                    placeholder: 'Valor escala inicial',
                    floatLabelType: 'Auto',
                    decimals: 2,
                    value: 0,
                    format: '###.##',
                    showClearButton: true,
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                axeStartValue.appendTo('#axeStartValue');

                var axeEndValue = new ej.inputs.NumericTextBox({
                    placeholder: 'Valor escala final',
                    floatLabelType: 'Auto',
                    decimals: 2,
                    value: 100,
                    format: '###.##',
                    showClearButton: true,
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                axeEndValue.appendTo('#axeEndValue');

                var rangeColorRadius = new ej.inputs.NumericTextBox({
                    placeholder: 'Radio del rango de colores',
                    floatLabelType: 'Auto',
                    min: 0,
                    max: 100,
                    value: 90,
                    format: 'n',
                    change: function (args) {
                        MVD.Dashboards.UI.resetGaugePreview();
                    }
                });
                rangeColorRadius.appendTo('#rangeColorRadius');

                var gauge = new ej.circulargauge.CircularGauge({
                    axes: [{
                        pointers: [{
                            value: 60
                        }]
                    }]
                });
                gauge.appendTo('#gauge');
                /**
                  <div class="flexItem60Width">
           
            <div class="flexContainer">
                <div class="flexItem40Width"><input type="text" id="cardValueField" /></div>
                <div class="flexItem60Width"><input type="text" id="cardTypeTemplate" /></div>
            </div>
            <div class="flexContainer">
                <div class="flexItem20Width"><input type="text" id="cardValueMask" /></div>
                <div class="flexItem20Width"><input type="text" id="cardValueXPosition" /></div>
                <div class="flexItem20Width"><input type="text" id="cardValueYPosition" /></div>
                <div class="flexItem20Width"><input type="text" id="cardValueColorType" /></div>
                <div class="flexItem20Width cardValueColorPickerWrapper" style="visibility: hidden; display: flex;">
                    <div style="margin: auto"><input type="text" id="cardValueColorPicker"/></div>
                </div>
            </div>
            <div class="flexContainer" id="colorCardTypeRanges"></div>
        </div>
        <div class="flexItem40Width">
            <div id="cardWrapper">
                <div id="card"></div>
            </div>
        </div>
                 */
                var cardDataSourceName = new ej.inputs.TextBox({
                    placeholder: 'Nombre del origen de datos',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true,
                    locale: 'es',
                    readonly: true
                });
                cardDataSourceName.appendTo('#cardDataSourceName');

                var cardValueField = new ej.dropdowns.DropDownList({
                    dataSource: [],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Campo valor',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            //MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                cardValueField.appendTo('#cardValueField');

                var cardTypeTemplate = new ej.dropdowns.DropDownList({
                    dataSource: [{ name: 'Circular', value: 'circular' }, { name: 'Lineal', value: 'linear' }],
                    fields: { text: 'name', value: 'value' },
                    placeholder: 'Tipo de gauge',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    value: 'circular',
                    change: function (args) {
                        //var elements = document.querySelectorAll('[data-gaugeType]');
                        //for (var i = 0; i < elements.length; i++) {
                        //    elements[i].style.display = (elements[i].dataset.gaugetype.indexOf(args.value) > -1) ? 'block' : 'none';
                        //}
                        //if (args.isInteracted) {
                        //   // MVD.Dashboards.UI.resetGaugePreview();
                        //}
                    }
                });
                cardTypeTemplate.appendTo('#cardTypeTemplate');

                var cardValueMask = new ej.inputs.TextBox({
                    placeholder: 'Prefijo/subfijo',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true,
                    locale: 'es',
                    value: '{value}',
                    change: function () {
                        //MVD.Dashboards.UI.resetGaugePreview();
                    }
                });
                cardValueMask.appendTo('#cardValueMask');

                //var cardValueXPosition = new ej.inputs.Slider({
                //    tooltip: { placement: 'Before', isVisible: true, showOn: 'Always' },
                //    value: 30,
                //    ticks: { placement: 'After', largeStep: 20, smallStep: 10, showSmallTicks: true }
                //});
                //cardValueXPosition.appendTo('#cardValueXPosition');

                //var cardValueYPosition = new ej.inputs.Slider({
                //    tooltip: { placement: 'Before', isVisible: true, showOn: 'Always' },
                //    value: 30,
                //    ticks: { placement: 'After', largeStep: 20, smallStep: 10, showSmallTicks: true }
                //});
                //cardValueYPosition.appendTo('#cardValueYPosition');

                var cardValueColorType = new ej.dropdowns.DropDownList({
                    dataSource: [{ name: 'Según valor', internalName: 'rangeValue' }, { name: 'Color', internalName: 'colorpicker' }],
                    fields: { text: 'name', value: 'internalName' },
                    placeholder: 'Color del valor',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    value: 'rangeValue',
                    change: function (args) {
                        document.getElementsByClassName('cardValueColorPickerWrapper')[0].style.visibility = (args.value === 'colorpicker') ? 'visible' : 'hidden';
                        if (args.isInteracted) {
                            //MVD.Dashboards.UI.resetGaugePreview();
                        }
                    }
                });
                cardValueColorType.appendTo('#cardValueColorType');

                var cardValueColorPicker = new ej.inputs.ColorPicker({
                    locale: 'es',
                    mode: 'Palette',
                    change: function (args) {
                        if (args.name === 'change') {
                            setTimeout(function () {
                                // MVD.Dashboards.UI.resetGaugePreview();
                            }, 300);
                        }
                    }
                });
                cardValueColorPicker.appendTo('#cardValueColorPicker');

                //var gauge = new ej.circulargauge.CircularGauge({
                //    axes: [{
                //        pointers: [{
                //            value: 60
                //        }]
                //    }]
                //});
                //gauge.appendTo('#gauge');


                resolve();
            })
            .catch(function (args) { reject(args); })
    });

    function getPanelSettingsTemplate() {
        return new Promise(function (resolve, reject) {
            var newEl = document.createElement('div');
            newEl.setAttribute('id', 'panelSettingsDialog');
            document.getElementById('parentMainContainer').append(newEl);
            newEl = document.createElement('div');
            newEl.setAttribute('id', 'panelSettingsContentDialog');
            document.getElementById('parentMainContainer').append(newEl);
            var req = new XMLHttpRequest();
            req.open('GET', _spPageContextInfo.webAbsoluteUrl + '/SiteAssets/MVD.Dashboards/MVD.DashboardPanelFormSettings.html', true);
            req.onload = function (e) {
                document.getElementById('panelSettingsContentDialog').innerHTML = req.response;
                document.getElementById('btnGridDataSourceSettings').addEventListener('click', function () {
                    MVD.Dashboards.UI.openDataSourceSettingsDialog({ type: 'grid' });
                });
                document.getElementById('btnGaugeDataSourceSettings').addEventListener('click', function () {
                    MVD.Dashboards.UI.openDataSourceSettingsDialog({ type: 'gauge' });
                });
                document.getElementById('btnPivotDataSourceSettings').addEventListener('click', function () {
                    MVD.Dashboards.UI.openDataSourceSettingsDialog({ type: 'pivot' });
                });
                document.getElementById('btnLocatorsDataSourceSettings').addEventListener('click', function () {
                    MVD.Dashboards.UI.openDataSourceSettingsDialog({ type: 'map', subType: 'locators' });
                });
                document.getElementById('btnColorsDataSourceSettings').addEventListener('click', function () {
                    MVD.Dashboards.UI.openDataSourceSettingsDialog({ type: 'map', subType: 'colors' });
                });
                document.getElementById('btnIndicatorsPanelDataSourceSettings').addEventListener('click', function () {
                    MVD.Dashboards.UI.openDataSourceSettingsDialog({ type: 'indicatorsPanel' });
                });
                document.getElementById('btnAddIndicatorsPanelGroup').addEventListener('click', function () {
                    MVD.Dashboards.UI.btnAddIndicatorsPanelGroup();
                });
                document.getElementById('btnIndicatorPanelGroupLevel1').addEventListener('click', function () {
                    MVD.Dashboards.UI.openIndicatorsPanelGroupDialog(event);
                });
                resolve()
            }
            req.onerror = function (e) { reject(e); }
            req.send();
        });
    }
};

MVD.Dashboards.UI.openIndicatorsPanelsSheetDialog = function () {
    if (!document.getElementById('indicatorsPanelsSheetDialog')) {
        var newEl = document.createElement('div');
        newEl.setAttribute('id', 'indicatorsPanelsSheetDialog');
        document.getElementById('parentMainContainer').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'indicatorsPanelsContentDialog');
        newEl.innerHTML =
            '<div class="flexContainer">' +
            '<input id="indicatorsPanelsSource"/>' +
            '</div>' +
            '<div class="flexContainer">' +
            '<div class="flexItem30Width">' +
            '<input id="indicatorsPanelsImportType"/>' +
            '</div>' +
            '<div class="flexItem70Width">' +
            '<input id="indicatorsPanelsSelectedDashboards"/>' +
            '</div>' +
            '</div>' +
            '<div class="flexContainer">' +
            '<div class="flexItem30Width" style="display:flex">' +
            '<div style="margin:auto">' +
            '<input id="indicatorsPanelsRefreshDashboard"/>' +
            '</div>' +
            '</div>' +
            '<div class="flexItem70Width" id="indicatorsPanelsShowDataWrapper" style="display:flex">' +
            '<div class="flexItem60Width">' +
            '<input id="indicatorsPanelsShowData"/>' +
            '</div>' +
            '<div class="flexItem40Width" style="display:flex">' +
            '<div style="margin:auto">' +
            '<input id="indicatorsPanelsShowYTD"/>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        document.getElementById('indicatorsPanelsSheetDialog').append(newEl);

        var indicatorsPanelsSource = new ej.dropdowns.DropDownList({
            locale: 'es',
            floatLabelType: 'Auto',
            placeholder: 'Fuente de tipo planilla',
            dataSource: MVD.DataSources.cacheDataSources.filter(e => e.typeSettings.indicatorType),
            fields: { text: 'title', value: 'id' },
            showClearButton: true,
            change: function (args) {
                ej.base.getComponent(document.getElementById('indicatorsPanelsSelectedDashboards'), 'multiselect').dataSource = [];
                ej.base.getComponent(document.getElementById('indicatorsPanelsSelectedDashboards'), 'multiselect').value = [];
                if (args.isInteracted) {
                    if (args.value) {
                        var source = MVD.DataSources.cacheDataSources.find(source => source.id == args.value);
                        var parameters = MVD.DataSources.getAllSourceParameters(source);
                        MVD.DataSources.getSourceData(source, parameters)
                            .then(function (argsData) {
                                MVD.DataSources.Indicator.getIndicatorsFromExcelSheet(source.id, argsData);
                                let planKeys = Object.keys(MVD.DataSources.cacheIndicatorsSheet[source.id].plans);
                                let planKey = (planKeys.length > 0) ? planKeys[0] : null;
                                if (planKey) {
                                    let dashboardColumn = Object.keys(MVD.DataSources.cacheIndicatorsSheet[source.id].plans[planKey][0].indicator)[0];
                                    let selectedDashboards = Enumerable.from(MVD.DataSources.cacheIndicatorsSheet[source.id].plans[planKey].map(e => e.indicator[dashboardColumn])).distinct().orderBy().toArray();
                                    ej.base.getComponent(document.getElementById('indicatorsPanelsSelectedDashboards'), 'multiselect').dataSource = selectedDashboards;
                                } else {
                                    MVD.SyncfusionUtilities.showToast('No se encontraron indicadores.');
                                }
                            })
                            .catch(function (args) { console.error(args); });
                    }
                }
            },
        });
        indicatorsPanelsSource.appendTo('#indicatorsPanelsSource');

        var indicatorsPanelsImportType = new ej.dropdowns.DropDownList({
            locale: 'es',
            floatLabelType: 'Auto',
            placeholder: 'Tipo de visualización',
            dataSource: [{ text: 'Paneles de indicadores', value: 'indicatorsPanels' }, { text: 'Gráficos', value: 'charts' }],
            fields: { text: 'text', value: 'value' },
            value: 'indicatorsPanels',
            change: function (args) {
                document.getElementById('indicatorsPanelsShowDataWrapper').style.visibility = (args.value === 'indicatorsPanels') ? 'visible' : 'hidden';
            },
        });
        indicatorsPanelsImportType.appendTo('#indicatorsPanelsImportType');

        var indicatorsPanelsSelectedDashboards = new ej.dropdowns.MultiSelect({
            placeholder: 'Tableros',
            locale: 'es',
            floatLabelType: 'Auto',
            value: [],
            dataSource: [],
            mode: 'CheckBox',
            showSelectAll: true,
            showDropDownIcon: false,
            popupHeight: '350px',
            selectAllText: 'Seleccionar todos',
            unSelectAllText: 'Deseleccionar todos',
        });
        indicatorsPanelsSelectedDashboards.appendTo('#indicatorsPanelsSelectedDashboards');

        var indicatorsPanelsShowData = new ej.dropdowns.MultiSelect({
            placeholder: 'Datos a mostrar',
            locale: 'es',
            floatLabelType: 'Auto',
            fields: { text: 'text', value: 'value' },
            value: ['Value', 'DeviationValue'],
            dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['indicatorPanelShowDataTypes'],
            mode: 'CheckBox',
            showSelectAll: true,
            showDropDownIcon: false,
            popupHeight: '350px',
            selectAllText: 'Seleccionar todos',
            unSelectAllText: 'Deseleccionar todos'
        });
        indicatorsPanelsShowData.appendTo('#indicatorsPanelsShowData');

        var indicatorsPanelsShowYTD = new ej.buttons.CheckBox({
            label: 'Mostrar columna YTD',
            labelPosition: 'Before',
            checked: false
        });
        indicatorsPanelsShowYTD.appendTo('#indicatorsPanelsShowYTD');

        var indicatorsPanelsRefreshDashboard = new ej.buttons.CheckBox({
            label: 'Reiniciar tablero',
            labelPosition: 'Before',
            checked: true,
        });
        indicatorsPanelsRefreshDashboard.appendTo('#indicatorsPanelsRefreshDashboard');

        var indicatorsPanelsSheetDialog = new ej.popups.Dialog({
            buttons: [{
                'click': () => {
                    MVD.Dashboards.UI.saveIndicatorsPanelsSheetDialog();
                },
                buttonModel: {
                    content: 'Guardar',
                    cssClass: 'e-success',
                    iconCss: 'e-save e-icons'
                },
                type: 'Button'
            }],
            locale: 'es',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            showCloseIcon: true,
            header: 'Editor del tablero de indicadores',
            width: '40%',
            height: 350,
            isModal: true,
            animationSettings: { effect: 'Zoom' },
            visible: false,
            close: function () {
                ej.base.getComponent(document.getElementById('indicatorsPanelsImportType'), 'dropdownlist').value = 'indicatorsPanels';
                ej.base.getComponent(document.getElementById('indicatorsPanelsRefreshDashboard'), 'checkbox').checked = true;
                ej.base.getComponent(document.getElementById('indicatorsPanelsShowYTD'), 'checkbox').checked = false;
                ej.base.getComponent(document.getElementById('indicatorsPanelsSource'), 'dropdownlist').value = null;
            }
        });
        indicatorsPanelsSheetDialog.appendTo('#indicatorsPanelsSheetDialog');
    }
    ej.base.getComponent(document.getElementById('indicatorsPanelsSheetDialog'), 'dialog').show();
};

MVD.Dashboards.UI.openDetailsDataSettingsDialog = function () {
    if (!document.getElementById('detailsDataSettingsDialog')) {
        var newEl = document.createElement('div');
        newEl.setAttribute('id', 'detailsDataSettingsDialog');
        document.getElementById('parentMainContainer').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'detailsDataSettingsContentDialog');
        newEl.innerHTML = '<div id="gridDetailsDataSettingsWrapper" style="height:100%"><div id="gridDetailsDataSettings"></div></div>';
        document.getElementById('detailsDataSettingsDialog').append(newEl);
        var detailsDataSettingsDialog = new ej.popups.Dialog({
            buttons: [{
                'click': () => {
                    MVD.Dashboards.UI.saveDataDetailsSettingsDialog();
                },
                buttonModel: {
                    content: 'Guardar',
                    cssClass: 'e-success',
                    iconCss: 'e-save e-icons'
                },
                type: 'Button'
            }],
            locale: 'es',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            showCloseIcon: true,
            header: 'Editor del detalle de datos',
            width: '80%',
            height: '775px',
            isModal: true,
            animationSettings: { effect: 'Zoom' },
            visible: false,
            close: function () {
                ej.base.getComponent(document.getElementById('gridDetailsDataSettings'), 'grid').destroy();
            },
            open: function () {
                if (typeof MVD.Dashboards.noRealDataMsg !== 'undefined') {
                    MVD.SyncfusionUtilities.showToast('Debido a que el origen de datos presenta parámetros obligatorios sin valores ingresados, los datos que se muestran no son los reales.\n' + MVD.Dashboards.noRealDataMsg);
                    delete MVD.Dashboards.noRealDataMsg;
                }
            }
        });
        detailsDataSettingsDialog.appendTo('#detailsDataSettingsDialog');
    }
    let auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(MVD.Dashboards.UI.getDataSourceSettings());
    if (auxSource.type === 'Indicador' && auxSource.typeSettings.plan.DataSourceType !== 'Fuente de datos') {
        MVD.SyncfusionUtilities.showToast('Este indicador no cuenta con detalle de datos.');
        return false;
    }
    if (typeof auxSource.fieldsPromise !== 'undefined') {
        auxSource.fieldsPromise.then(function (args) { auxOpenDetailsDataSettingsDialog(args.fields) });
    } else {
        auxOpenDetailsDataSettingsDialog(auxSource.fields)
    }

    function auxOpenDetailsDataSettingsDialog(fields) {
        let requiredParameters = auxSource.parameters.filter(e => e.required);
        let promise = [];
        if (requiredParameters.length > 0) {
            try {
                MVD.DataSources.getParametersValues(requiredParameters);
                promise.push(MVD.DataSources.getSourceDataDetails(auxSource, requiredParameters));
            } catch (args) {
                promise.push(new Promise(function (resolve, reject) { resolve('noRealData') }));
                MVD.Dashboards.noRealDataMsg = args.msg;
            }
        } else {
            promise.push(MVD.DataSources.getSourceDataDetails(auxSource, []));
        }
        if (auxSource.id < 0 || auxSource.type === 'Pivot') {
            fields = MVD.DataSources.cacheDataSources.find(e => e.id === auxSource.typeSettings.sourceId).fields;
        }
        else if (auxSource.type === 'Indicador') {
            if (auxSource.typeSettings.plan.DataSourceType === 'Fuente de datos') {
                fields = MVD.DataSources.cacheDataSources.find(e => e.title === auxSource.typeSettings.plan.MVDDataSource).fields;
            }
        }
        Promise.all(promise)
            .then(function (retData) {
                let data = retData[0];
                let detailsDataSettings = document.getElementById('detailsDataSettings').value;
                detailsDataSettings = (detailsDataSettings) ? JSON.parse(detailsDataSettings) : {};
                let columns = [];
                let rowNoRealData = {};
                for (var i = 0; i < fields.length; i++) {
                    let value = 'Dato no real.'
                    let auxColumn = { field: fields[i].internalName, headerText: fields[i].name, minWidth: 100, visible: true };
                    if (fields[i].type === 'DateTime') {
                        value = new Date();
                        auxColumn['type'] = 'date';
                        auxColumn['format'] = { type: 'date', format: 'dd/MM/yyyy' };
                    } else if (fields[i].type === 'Number') {
                        value = 1.23;
                        auxColumn['format'] = 'n2';
                    } else if (fields[i].type === 'Boolean') {
                        value = 1;
                        auxColumn['editType'] = 'booleanedit';
                        auxColumn['displayAsCheckBox'] = true;
                    }
                    rowNoRealData[auxColumn.field] = value;
                    if (detailsDataSettings.columns) {
                        let oldColumn = detailsDataSettings.columns.find(e => e.field === auxColumn.field);
                        if (oldColumn) {
                            if (auxColumn.type === oldColumn.type && oldColumn.format) {
                                auxColumn.format = oldColumn.format;
                            }
                            auxColumn.headerText = oldColumn.headerText;
                            auxColumn.visible = oldColumn.visible;
                            auxColumn.MVDPosition = oldColumn.MVDPosition;
                        }
                    }
                    columns.push(auxColumn);
                }
                columns.sort(function (a, b) {
                    return (a.MVDPosition === b.MVDPosition) ? 0 : (a.MVDPosition < b.MVDPosition) ? -1 : 1;
                });
                detailsDataSettings.columns = columns;
                if (typeof data === 'string') {
                    data = [rowNoRealData];
                }
                MVD.Dashboards.UI.initSyncfusionComponent('gridDetailsDataSettings', { dataSource: data, gridSettings: detailsDataSettings });
                ej.base.getComponent(document.getElementById('detailsDataSettingsDialog'), 'dialog').show();
            })
            .catch(function (args) {
                console.error(args);
                MVD.SyncfusionUtilities.showToast(args.msg);
            });
    }
};

MVD.Dashboards.UI.openDataSourceSettingsDialog = function (args) {
    var dataSourceId = null;
    if (args.type === 'chart') {
        dataSourceId = Math.floor(Math.random() * 1000000);
    }
    else if (args.type === 'click') {
        dataSourceId = args.target.closest('.e-row').children[0].innerHTML;
    }
    else if (args.type === 'map') {
        dataSourceId = args.subType;
    }
    else {
        dataSourceId = args.type;
    }
    if (!document.getElementById('dataSourceSettingsDialog')) {
        getDataSourceSettingsTemplate()
            .then(function () {
                auxOpenDataSourceSettingsDialog(dataSourceId)
            })
            .catch(function (args) {
                console.error(args);
                MVD.SyncfusionUtilities.showToast(args.msg);
            })
    }
    else {
        auxOpenDataSourceSettingsDialog(dataSourceId)
    }

    function auxOpenDataSourceSettingsDialog(dataSourceId) {
        if (dataSourceId === 'indicatorsPanel') {
            document.getElementById('indicatorsPanelSelectorWrapper').style.display = 'flex';
            document.getElementById('sourceSelectorWrapper').style.display = 'none';
            document.getElementById('indicatorPlanParameterWrapper').style.display = 'flex';
            ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value = 'Indicador';
        } else {
            document.getElementById('indicatorsPanelSelectorWrapper').style.display = 'none';
            document.getElementById('sourceSelectorWrapper').style.display = 'flex';
            ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value = 'DataSource';
        }
        var dataSourceSettings = document.getElementById('dataSourcesSettings').value;
        if (dataSourceSettings) {
            dataSourceSettings = JSON.parse(dataSourceSettings);
        }
        if (dataSourceSettings[dataSourceId]) {
            MVD.Dashboards.UI.setDataSourceSettingsDialog(dataSourceSettings[dataSourceId]);
        } else {
            ej.base.getComponent(document.getElementById('source'), 'dropdownlist').value = null;
            ej.base.getComponent(document.getElementById('indicatorParameterType'), 'dropdownlist').value = 'planSelector';
            document.getElementById('dataSourceId').value = dataSourceId;
        }
        ej.base.getComponent(document.getElementById('dataSourceSettingsDialog'), 'dialog').show();
    }

    function getDataSourceSettingsTemplate() {
        return new Promise(function (resolve, reject) {
            var newEl = document.createElement('div');
            newEl.setAttribute('id', 'dataSourceSettingsDialog');
            document.getElementById('parentMainContainer').append(newEl);
            newEl = document.createElement('div');
            newEl.setAttribute('id', 'dataSourceSettingsContentDialog');
            document.getElementById('parentMainContainer').append(newEl);
            var req = new XMLHttpRequest();
            req.open('GET', _spPageContextInfo.webAbsoluteUrl + '/SiteAssets/MVD.Dashboards/MVD.DashboardDataSourceFormSettings.html', true);
            req.onload = function (e) {
                var dataSourceSettingsDialog = new ej.popups.Dialog({
                    buttons: [
                        {
                            'click': () => {
                                MVD.Dashboards.UI.saveDataSourceSettingsDialog();
                            },
                            buttonModel: {
                                content: 'Guardar',
                                cssClass: 'e-success',
                                iconCss: 'e-save e-icons'
                            },
                            type: 'Button'
                        }
                    ],
                    locale: 'es',
                    position: { X: 'center', Y: 'center' },
                    closeOnEscape: true,
                    showCloseIcon: true,
                    header: 'Editor del origen de datos',
                    content: document.getElementById('dataSourceSettingsContentDialog'),
                    width: '65%',
                    height: 620,
                    isModal: true,
                    animationSettings: { effect: 'Zoom' },
                    close: function (args) {
                        ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value = 'DataSource';
                        ej.base.getComponent(document.getElementById('source'), 'dropdownlist').value = null;
                        ej.base.getComponent(document.getElementById('indicatorsPanelIndicatorSelector'), 'multiselect').value = [];
                        ej.base.getComponent(document.getElementById('indicatorSheet'), 'dropdownlist').dataSource = [];
                        MVD.Dashboards.UI.resetDataSourceSettingsDialog();
                    },
                    visible: false,
                });
                dataSourceSettingsDialog.appendTo('#dataSourceSettingsDialog');

                document.getElementById('dataSourceSettingsContentDialog').innerHTML = req.response;
                var sourceType = new ej.dropdowns.DropDownList({
                    placeholder: 'Tipo',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    fields: { text: 'text', value: 'value' },
                    dataSource: [{ text: 'Fuente de datos', value: 'DataSource' }, { text: 'Indicador', value: 'Indicador' }],
                    change: function (args) {
                        ej.base.getComponent(document.getElementById('source'), 'dropdownlist').dataSource = (args.value === 'DataSource') ? MVD.DataSources.cacheDataSources.filter(e => !e.internalUse) : MVD.DataSources.cacheIndicators.filter(e => !e.responsiblePersonsKey);
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetDataSourceSettingsDialog();
                            ej.base.getComponent(document.getElementById('source'), 'dropdownlist').value = null;
                        }
                    },
                });
                sourceType.appendTo('#sourceType');

                var source = new ej.dropdowns.DropDownList({
                    locale: 'es',
                    floatLabelType: 'Auto',
                    placeholder: 'Fuente',
                    filterBarPlaceholder: 'Buscar',
                    allowFiltering: true,
                    dataSource: MVD.DataSources.cacheDataSources.filter(source => !source.internalUse),
                    fields: { text: 'title', value: 'id' },
                    showClearButton: true,
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.resetDataSourceSettingsDialog();
                            if (args.value) {
                                var sourceType = ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value;
                                var panelType = ej.base.getComponent(document.getElementById('panelType'), 'dropdownlist').value;
                                var source = null;
                                if (sourceType === 'Indicador') {
                                    ej.base.getComponent(document.getElementById('indicatorParameterType'), 'dropdownlist').value = 'planSelector';
                                    MVD.Dashboards.UI.onChangeIndicatorParameterType('planSelector');
                                    MVD.DataSources.Indicator.getPlansAndHistory(args.value)
                                        .then(function () {
                                            source = MVD.DataSources.Indicator.getSourceMask(args.value, null);
                                            let parameters = MVD.DataSources.getAllSourceParameters(source);
                                            MVD.Dashboards.UI.initSyncfusionComponent('parametersGrid', { dataSource: parameters });
                                            if (source.typeSettings.plan.DataSourceType === 'Fuente de datos') {
                                                let fieldsSource = MVD.DataSources.cacheDataSources.find(e => e.title === source.typeSettings.plan.MVDDataSource);
                                                auxSetFields(fieldsSource);
                                            }
                                        })
                                        .catch(function (args) {
                                            console.error(args);
                                        });
                                }
                                else {
                                    source = args.itemData;
                                    sourceType = source.type;
                                    let parameters = MVD.DataSources.getAllSourceParameters(source);
                                    MVD.Dashboards.UI.initSyncfusionComponent('parametersGrid', { dataSource: parameters });
                                    auxSetFields(source);
                                    if (source.typeSettings.indicatorType) {
                                        MVD.DataSources.getSourceData(source, parameters)
                                            .then(function (args) {
                                                ej.base.getComponent(document.getElementById('indicatorSheet'), 'dropdownlist').dataSource = MVD.DataSources.Indicator.getIndicatorsFromExcelSheet(source.id, args);
                                            })
                                            .catch(function (args) { console.error(args); });
                                    }
                                }
                                document.getElementById('indicatorPlanParameterWrapper').style.display = (sourceType === 'Indicador') ? 'flex' : 'none';
                                document.getElementById('buttonsResumeDataWrapper').style.display = (sourceType === 'Indicador' || source.typeSettings.indicatorType /*|| (source.type === 'Pivot' && source.subType !== 'ResumePivot')*/) ? 'none' : 'flex';
                                document.getElementById('detailsDataSettingsWrapper').style.visibility = (panelType !== 'grid') ? 'visible' : 'hidden';
                                document.getElementById('drillingSettingsWrapper').style.visibility = (sourceType !== 'Indicador' && source.type === 'Pivot' && source.typeSettings.dataSourceSettings.rows.length > 1) ? 'visible' : 'hidden';
                                document.getElementById('indicatorSheetTypeWrapper').style.display = (sourceType !== 'Indicador' && source.typeSettings.indicatorType) ? 'flex' : 'none';
                            }
                        }
                    },
                    filtering: function (args) {
                        var dropdownQuery = new ej.data.Query();
                        dropdownQuery = (args.text !== '') ? dropdownQuery.where('title', 'contains', args.text, true) : dropdownQuery;
                        var sourceType = ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value;
                        var data = (sourceType === 'DataSource') ? MVD.DataSources.cacheDataSources.filter(source => !source.internalUse) : MVD.DataSources.cacheIndicators;
                        args.updateData(data, dropdownQuery);
                    },
                });
                source.appendTo('#source');

                var indicatorSheet = new ej.dropdowns.DropDownList({
                    placeholder: 'Indicador',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    dataSource: [],
                    change: function (args) {
                        console.log(args);
                    },
                });
                indicatorSheet.appendTo('#indicatorSheet');

                var indicatorsPanelSelectorType = new ej.dropdowns.DropDownList({
                    placeholder: 'Forma de visualizar',
                    floatLabelType: 'Auto',
                    locale: 'es',
                    fields: { text: 'text', value: 'value' },
                    value: 'Indicador',
                    dataSource: [{ text: 'Indicadores', value: 'Indicador' }, { text: 'Responsable', value: 'Responsible' }],
                    change: function (args) {
                        document.getElementById('indicatorsPanelIndicatorSelectorWrapper').style.display = (args.value === 'Indicador') ? 'block' : 'none';
                        document.getElementById('indicatorsPanelResponsibleSelectorWrapper').style.display = (args.value === 'Responsible') ? 'flex' : 'none';
                    },
                });
                indicatorsPanelSelectorType.appendTo('#indicatorsPanelSelectorType');

                var indicatorsPanelIndicatorSelector = new ej.dropdowns.MultiSelect({
                    dataSource: MVD.DataSources.cacheIndicators,
                    fields: { text: 'title', value: 'id' },
                    floatLabelType: 'Auto',
                    placeholder: 'Seleccion de los indicadores',
                    mode: 'CheckBox',
                    showSelectAll: true,
                    showDropDownIcon: true,
                    filterBarPlaceholder: 'Búsqueda indicador',
                    popupHeight: '350px',
                    value: [],
                    locale: 'es',
                    change: function (args) {
                        if (args.isInteracted) {
                            var dataPromises = [];
                            ej.base.getComponent(document.getElementById('indicatorParameterType'), 'dropdownlist').value = 'planSelector';
                            MVD.Dashboards.UI.onChangeIndicatorParameterType('planSelector');
                            args.value.forEach(e => dataPromises.push(MVD.DataSources.Indicator.getPlansAndHistory(e)));
                            Promise.all(dataPromises)
                                .then(function () {
                                    var allParameters = [];
                                    for (var i = 0; i < args.value.length; i++) {
                                        var source = MVD.DataSources.Indicator.getSourceMask(args.value[i], null);
                                        allParameters = allParameters.concat(MVD.DataSources.getAllSourceParameters(source));
                                    }
                                    allParameters = allParameters.reduce(function (accu, e) {
                                        var isRepeat = accu.find(el => el.createdName === e.createdName);
                                        if (typeof isRepeat !== 'undefined') {
                                            if (!isRepeat.sourcesIds.includes(e.sourceId)) {
                                                isRepeat.sourcesIds.push(e.sourceId);
                                            }
                                        } else {
                                            if (typeof e.sourcesIds === 'undefined') { //por los resumenes de datos
                                                e.sourcesIds = [e.sourceId];
                                            }
                                            accu.push(e);
                                        }
                                        return accu;
                                    }, []);
                                    MVD.Dashboards.UI.initSyncfusionComponent('parametersGrid', { dataSource: allParameters });
                                })
                                .catch(function (error) {
                                    console.error(error);
                                });
                        }
                    },
                    filtering: function (args) {
                        var dropdownQuery = new ej.data.Query();
                        dropdownQuery = (args.text !== '') ? dropdownQuery.where('title', 'contains', args.text, true) : dropdownQuery;
                        args.updateData(MVD.DataSources.cacheIndicators, dropdownQuery);
                    },
                });
                indicatorsPanelIndicatorSelector.appendTo('#indicatorsPanelIndicatorSelector');

                MVD.SPHelpers.Fields.createPeoplePicker('indicatorsPanelResponsibleSelector', { Type: 'User', UserSelectionMode: 'UserMulti' });
                SPClientPeoplePicker.SPClientPeoplePickerDict.indicatorsPanelResponsibleSelector_TopSpan.OnValueChangedClientScript = function (peoplePickerId, selectedUsersInfo) {
                    if (selectedUsersInfo.length === 0) {
                        ej.base.getComponent(document.getElementById('indicatorsPanelIndicatorSelector'), 'multiselect').value = [];
                        return;
                    }
                    if (typeof indicatorsPanelSelectorFirstSet !== 'undefined' && indicatorsPanelSelectorFirstSet) {
                        indicatorsPanelSelectorFirstSet = false;
                        return;
                    }
                    var responsiblePersonsToFind = [];
                    selectedUsersInfo.forEach(function (e) {
                        if (!responsiblePersonsToFind.includes(e.DisplayText)) {
                            responsiblePersonsToFind.push(e.DisplayText);
                        }
                    });
                    var indicatorsIdsToFind = [];
                    responsiblePersonsToFind.forEach(function (e) {
                        var auxIndicators = MVD.DataSources.cacheIndicators.filter(element => element.responsiblePersons.includes(e));
                        auxIndicators.forEach(function (i) {
                            if (!indicatorsIdsToFind.find(element => element == i.id)) {
                                indicatorsIdsToFind.push(i.id);
                            }
                        });
                    });
                    ej.base.getComponent(document.getElementById('indicatorsPanelIndicatorSelector'), 'multiselect').value = indicatorsIdsToFind;
                    ej.base.getComponent(document.getElementById('indicatorsPanelIndicatorSelector'), 'multiselect').change({ value: indicatorsIdsToFind, isInteracted: true });
                };

                MVD.Dashboards.UI.initSyncfusionComponent('parametersGrid');

                var indicatorParameterType = new ej.dropdowns.DropDownList({
                    placeholder: 'Parámetro del indicador',
                    floatLabelType: 'Auto',
                    fields: { text: 'text', value: 'value' },
                    dataSource: [{ text: 'Selector con los planes', value: 'planSelector' }, { text: 'Parámetro existente del dashboard', value: 'existingParameter' }],
                    change: function (args) {
                        if (args.isInteracted) {
                            MVD.Dashboards.UI.onChangeIndicatorParameterType(args.value);
                        }
                    },
                    value: 'planSelector',
                    locale: 'es',
                });
                indicatorParameterType.appendTo("#indicatorParameterType");

                var indicatorExistingParameterSelector = new ej.dropdowns.DropDownList({
                    placeholder: "Parámetros en el dashboard",
                    floatLabelType: 'Auto',
                    fields: { text: 'name', value: 'name' },
                    locale: 'es',
                });
                indicatorExistingParameterSelector.appendTo('#indicatorExistingParameterSelector');

                var indicatorPlanParameterName = new ej.inputs.TextBox({
                    placeholder: 'Nombre',
                    floatLabelType: 'Auto',
                    type: 'text',
                    showClearButton: true,
                    locale: 'es',
                });
                indicatorPlanParameterName.appendTo('#indicatorPlanParameterName');

                resolve()
            }
            req.onerror = function (e) { reject(e); }
            req.send();
        });

        function auxSetFields(source) {
            if (typeof source.fieldsPromise === 'undefined' && typeof source.fields === 'undefined') {
                source.fieldsPromise = MVD.DataSources.getFields(source)
                    .then(function (args) {
                        if (source.type === 'External') {
                            args.fields = args.fields.filter(e => source.typeSettings.fields.includes(e.internalName));
                        }
                        args.fields.forEach(e => delete e.schemaXml);
                        source.fields = args.fields;
                        source.dynamicFields = args.dynamicFields;
                        delete source.fieldsPromise;
                        setFirstDetailsDataSettings(source.fields);
                    })
                    .catch(function (args) { console.error(args); });
            }
            else {
                setFirstDetailsDataSettings(source.fields);
            }
        }

        function setFirstDetailsDataSettings(fields) {
            var detailsDataSettings = document.getElementById('detailsDataSettings').value;
            detailsDataSettings = (detailsDataSettings) ? JSON.parse(detailsDataSettings) : {};
            if (Object.keys(detailsDataSettings).length === 0) {
                var columns = [];
                for (var i = 0; i < fields.length; i++) {
                    var column = { field: fields[i].internalName, headerText: fields[i].name };
                    if (fields[i].type === 'DateTime') {
                        column['type'] = 'date';
                        column['format'] = { type: 'date', format: 'dd/MM/yyyy' };
                    } else if (fields[i].type === 'Boolean') {
                        column['editType'] = 'booleanedit';
                        column['displayAsCheckBox'] = true;
                    }
                    columns.push(column);
                }
                detailsDataSettings.columns = columns;
                document.getElementById('detailsDataSettings').value = JSON.stringify(detailsDataSettings);
            }
        }
    }
};

MVD.Dashboards.UI.onChangeIndicatorParameterType = function (type) {
    if (type === 'existingParameter') {
        var dataSourceId = document.getElementById('dataSourceId').value;
        var parameters = JSON.parse(JSON.stringify(ej.base.getComponent(document.getElementById('parametersGrid'), 'grid').dataSource));
        for (var keyPanel in MVD.Dashboards.panels) {
            var auxParameters = [];
            if (keyPanel === MVD.Dashboards.selectedPanelId) {
                continue;
                //for (var keySource in MVD.Dashboards.panels[keyPanel].dataSourcesSettings) {
                //    if (keySource === dataSourceId) {
                //        auxParameters = auxParameters.concat(MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keySource].parameters);
                //    } else {
                //        auxParameters = auxParameters.concat(MVD.Dashboards.panels[keyPanel].dataSourcesSettings[keySource].parameters.find(e=> e.visible));
                //    }
                //}
            } else {
                var aux = MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[keyPanel].dataSourcesSettings);
                aux.forEach(e => e.panelId = keyPanel);
                auxParameters = auxParameters.concat(aux);
            }
            for (var i = 0; i < auxParameters.length; i++) {
                if (typeof auxParameters[i].parameterIndicatorType !== 'undefined' && auxParameters[i].parameterIndicatorType !== 'planSelector') {
                    continue;
                }
                var isRepeat = parameters.find(e => e.name === auxParameters[i].name);
                if (!isRepeat) {
                    parameters.push(JSON.parse(JSON.stringify(auxParameters[i])));
                }
            }
        }
        ej.base.getComponent(document.getElementById('indicatorExistingParameterSelector'), 'dropdownlist').dataSource = parameters;
        if (parameters.length > 0) {
            ej.base.getComponent(document.getElementById('indicatorExistingParameterSelector'), 'dropdownlist').value = parameters[0].name;
        }
    }
    document.querySelector('div[data-parameter-type="existParameter"]').style.display = (type === 'existingParameter') ? 'block' : 'none';
    document.querySelector('div[data-parameter-type="indicatorPlanParameter"]').style.display = (type === 'existingParameter') ? 'none' : 'block';
};

MVD.Dashboards.UI.openPanelSettingsDialog = function () {
    if (!document.getElementById('panelSettingsDialog')) {
        MVD.Dashboards.UI.initPanelSettingsDialog()
            .then(function () { auxOpenPanelSettingsDialog(); })
            .catch(function (args) {
                console.error(args);
                MVD.SyncfusionUtilities.showToast(args.msg);
            });
    }
    else {
        auxOpenPanelSettingsDialog();
    }
    function auxOpenPanelSettingsDialog() {
        if (typeof MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId] !== 'undefined') {
            if (MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId].type === 'indicatorsPanel' && typeof MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId].settings.groupDashboard !== 'undefined') {
                MVD.SyncfusionUtilities.showToast('Este tipo de panel no puede ser editado.');
                return;
            }
            MVD.Dashboards.UI.setPanelSettings(MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId]);
        }
        else {
            ej.base.getComponent(document.getElementById('panelTitle'), 'textbox').value = '';
            ej.base.getComponent(document.getElementById('panelType'), 'dropdownlist').value = 'chart';
        }
        ej.base.getComponent(document.getElementById('panelSettingsDialog'), 'dialog').show();
    }
};

MVD.Dashboards.UI.openParameterSettingsDialog = function (parameterId) {
    if (!document.getElementById('parameterSettingsDialog')) {
        var newEl = document.createElement('div');
        newEl.setAttribute('id', 'parameterSettingsDialog');
        document.getElementById('parentMainContainer').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'parameterSettingsContentDialog');
        document.getElementById('parentMainContainer').append(newEl);
        document.getElementById('parameterSettingsContentDialog').innerHTML =
            '<div class="flexContainer">' +
            '<div class="flexItem25Width"><input id="parameterDefaultValueType"/></div>' +
            '<div class="flexItem75Width">' +
            '<div id="parameterDefaultValueWrapper"><input id="parameterValue"/></div>' +
            '<div id="parameterDateWrapper" style="display:none"><input id="parameterDate"/></div>' +
            '</div>' +
            '</div><input type="hidden" id="hiddenParameterId" />';

        var parameterSettingsDialog = new ej.popups.Dialog({
            buttons: [{
                'click': () => {
                    MVD.Dashboards.UI.saveParameterSettingsDialog();
                },
                buttonModel: {
                    content: 'Guardar',
                    cssClass: 'e-success',
                    iconCss: 'e-save e-icons'
                },
                type: 'Button'
            }],
            locale: 'es',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            showCloseIcon: true,
            content: document.getElementById("parameterSettingsContentDialog"),
            width: 450,
            height: 200,
            isModal: true,
            visible: false,
            close: function (args) {
                ej.base.getComponent(document.getElementById('parameterDefaultValueType'), 'dropdownlist').value = 'value';
                ej.base.getComponent(document.getElementById('parameterValue'), 'textbox').value = '';
            }
        });
        parameterSettingsDialog.appendTo('#parameterSettingsDialog');

        var parameterDefaultValueType = new ej.dropdowns.DropDownList({
            placeholder: "Tipo de dato",
            floatLabelType: "Auto",
            locale: 'es',
            fields: { text: 'text', value: 'value' },
            dataSource: [{ text: 'Valor', value: 'value' }, { text: 'Año actual', value: 'year' }, { text: 'Fecha', value: 'date' }],
            value: 'value',
            change: function (args) {
                document.getElementById('parameterDateWrapper').style.display = 'none';
                document.getElementById('parameterDefaultValueWrapper').style.display = 'none';
                if (args.value === 'value') {
                    document.getElementById('parameterDefaultValueWrapper').style.display = 'block';
                } else if (args.value === 'date') {
                    document.getElementById('parameterDateWrapper').style.display = 'block';
                }
            }
        });
        parameterDefaultValueType.appendTo("#parameterDefaultValueType");

        var parameterValue = new ej.inputs.TextBox({
            locale: 'es',
            placeholder: 'Valor por defecto',
            floatLabelType: 'Auto',
            type: 'text',
            showClearButton: true
        });
        parameterValue.appendTo('#parameterValue');

        var parameterDate = new ej.calendars.DatePicker({
            placeholder: 'Fecha',
            floatLabelType: "Auto",
        });
        parameterDate.appendTo('#parameterDate');

    }

    if (typeof MVD.Dashboards.parametersExtras[parameterId] !== 'undefined') {
        var defaultValue = MVD.Dashboards.parametersExtras[parameterId].defaultValue;
        var defaultValueType = MVD.Dashboards.parametersExtras[parameterId].defaultValueType;
        ej.base.getComponent(document.getElementById('parameterDefaultValueType'), 'dropdownlist').value = defaultValueType;
        if (defaultValueType === 'value') {
            ej.base.getComponent(document.getElementById('parameterValue'), 'textbox').value = defaultValue;
        } else if (defaultValueType === 'date') {
            ej.base.getComponent(document.getElementById('parameterDate'), 'datepicker').value = defaultValue;
        }
    }
    document.getElementById('hiddenParameterId').value = parameterId;

    ej.base.getComponent(document.getElementById('parameterSettingsDialog'), 'dialog').show();
};

MVD.Dashboards.UI.openResumeDataSettingsDialog = function () {
    if (!document.getElementById('resumeDataSettingsDialog')) {
        var newEl = document.createElement('div');
        newEl.setAttribute('id', 'resumeDataSettingsDialog');
        document.getElementById('parentMainContainer').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'resumeDataSettingsContentDialog');
        newEl.innerHTML =
            '<div class="flexContainer">' +
            '<div id="resumeDataParameters" class="flexItem85Width" style="display: flex;"></div>' +
            '<div class="flexItem15Width" style="display: flex;"><div style="margin:auto;"><button type="button" class="e-btn e-success e-small" id="btnGetDataToResume" onclick="MVD.Dashboards.UI.getDataToResume()">Traer datos</button></div></div>' +
            '</div>' +
            '<div id="resumeDataPivotWrapper" style="min-height:350px">' +
            '<div><div id="resumeDataPivot"></div></div>' +
            '</div>' +
            '<div class="flexContainer">' +
            '<div class="flexItem20Width"><input id="rowsLevelResumeData" /></div>' +
            '<div class="flexItem20Width"><input id="columnsLevelResumeData" /></div>' +
            '<div class="flexItem20Width" style="display:flex"><div style="margin:auto 0"><input id="transpose" /></div></div>' +
            '</div>';
        document.getElementById('resumeDataSettingsDialog').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'resumeDataSettingsDialogSpinner');
        newEl.classList = 'panelSpinner';
        document.getElementById('resumeDataSettingsDialog').append(newEl);

        var resumeDataSettingsDialog = new ej.popups.Dialog({
            buttons: [{
                'click': () => {
                    MVD.Dashboards.UI.saveResumeDataSettingsDialog();
                },
                buttonModel: {
                    content: 'Guardar',
                    cssClass: 'e-success',
                    iconCss: 'e-save e-icons'
                },
                type: 'Button'
            }],
            locale: 'es',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            showCloseIcon: true,
            header: 'Editor del resumen de datos',
            content: document.getElementById('resumeDataSettingsContentDialog'),
            width: '65%',
            height: 620,
            isModal: true,
            animationSettings: { effect: 'Zoom' },
            visible: false,
        });
        resumeDataSettingsDialog.appendTo('#resumeDataSettingsDialog');

        var columnsLevelResumeData = new ej.inputs.NumericTextBox({
            locale: 'es',
            placeholder: 'Nivel de apertura de las columnas',
            floatLabelType: 'Auto',
            decimals: 0,
            min: 0,
            format: '###.##',
            value: 0
        });
        columnsLevelResumeData.appendTo('#columnsLevelResumeData');

        var rowsLevelResumeData = new ej.inputs.NumericTextBox({
            locale: 'es',
            placeholder: 'Nivel de apertura de las filas',
            floatLabelType: 'Auto',
            decimals: 0,
            min: 0,
            format: '###.##',
            value: 1
        });
        rowsLevelResumeData.appendTo('#rowsLevelResumeData');

        var transpose = new ej.buttons.CheckBox({
            label: 'Transponer datos',
            labelPosition: 'Before',
            change: function (args) {

            }
        });
        transpose.appendTo('#transpose');
    }
    let source = MVD.Dashboards.UI.getSourceOfDataSourceSettings(MVD.Dashboards.UI.getDataSourceSettings());
    MVD.Dashboards.UI.initSyncfusionComponent('resumeDataPivot');
    document.getElementById('resumeDataParameters').innerHTML = '';
    let requiredParameters = source.parameters.filter(e => e.required);
    for (var i = 0; i < requiredParameters.length; i++) {
        requiredParameters[i].name = 'Resumen ' + requiredParameters[i].name;
        var div = document.createElement('div');
        var renderId = MVD.DataSources.getParameterRenderId(requiredParameters[i]);
        div.setAttribute('id', renderId + 'PanelWrapper');
        div.classList = 'parameterResumeDataWrapper';
        document.getElementById('resumeDataParameters').append(div);
        MVD.DataSources.renderParameter(requiredParameters[i], renderId + 'PanelWrapper');
    }
    var resumeDataSettings = document.getElementById('resumeDataSettings').value;
    if (resumeDataSettings) {
        resumeDataSettings = JSON.parse(resumeDataSettings);
        ej.base.getComponent(document.getElementById('rowsLevelResumeData'), 'numerictextbox').value = resumeDataSettings.extraSettings.rowsLevel;
        ej.base.getComponent(document.getElementById('columnsLevelResumeData'), 'numerictextbox').value = resumeDataSettings.extraSettings.columnsLevel;
        ej.base.getComponent(document.getElementById('transpose'), 'checkbox').checked = resumeDataSettings.extraSettings.transpose;
    }
    else {
        ej.base.getComponent(document.getElementById('rowsLevelResumeData'), 'numerictextbox').value = 0;
        ej.base.getComponent(document.getElementById('columnsLevelResumeData'), 'numerictextbox').value = 0;
        ej.base.getComponent(document.getElementById('transpose'), 'checkbox').checked = false;
    }
    ej.base.getComponent(document.getElementById('resumeDataSettingsDialog'), 'dialog').show();
};

MVD.Dashboards.UI.openIndicatorsPanelGroupDialog = async function (event) {
    if (!document.getElementById('indicatorsPanelGroupSettingsDialog')) {
        var newEl = document.createElement('div');
        newEl.setAttribute('id', 'indicatorsPanelGroupSettingsDialog');
        document.getElementById('parentMainContainer').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'indicatorsPanelGroupSettingsContentDialog');
        document.getElementById('parentMainContainer').append(newEl);
        document.getElementById('indicatorsPanelGroupSettingsContentDialog').innerHTML =
            '<div class="flexContainer">' +
            '<div class="flexContainer">' +
            '<div class="flexItem50Width"><input id="groupField"/></div>' +
            '<div class="flexItem50Width"><input id="groupScale"/></div>' +
            '</div>' +
            '<div class="flexContainer">' +
            '<div class="flexItem50Width"><input id="valueField"/></div>' +
            '<div class="flexItem50Width"><input id="aggregateFunction"/></div>' +
            '</div>' +
            '<div class="lblSimulate">Escalas</div>' +
            '<div class="flexContainer" id="scalesRows"></div>' +
            '</div>' +
            '<input type="hidden" id="hiddenIndicatorsPanelGroupLevel" />';

        var indicatorsPanelGroupSettingsDialog = new ej.popups.Dialog({
            buttons: [
                {
                    'click': () => {
                        MVD.Dashboards.UI.saveIndicatorsPanelGroupSettingsDialog(true);
                    },
                    buttonModel: {
                        content: 'Borrar',
                        cssClass: 'e-warning',
                        iconCss: 'e-delete e-icons'
                    },
                    type: 'Button'
                },
                {
                    'click': () => {
                        MVD.Dashboards.UI.saveIndicatorsPanelGroupSettingsDialog();
                    },
                    buttonModel: {
                        content: 'Guardar',
                        cssClass: 'e-success',
                        iconCss: 'e-save e-icons'
                    },
                    type: 'Button'
                }
            ],
            header: 'Editor del grupo del árbol de indicadores',
            locale: 'es',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            showCloseIcon: true,
            content: document.getElementById('indicatorsPanelGroupSettingsContentDialog'),
            width: '65%',
            height: 600,
            isModal: true,
            visible: false,
        });
        indicatorsPanelGroupSettingsDialog.appendTo('#indicatorsPanelGroupSettingsDialog');

        if (MVD.DataSources.listPersonsPermissions) {
            let personsFields = await MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, '/lists/personas');
            var groupFieldDataSource = personsFields.filter(e => e.internalName !== 'Usuario' && (e.type.indexOf('Lookup') > -1 || e.type.indexOf('Choice') > -1 || e.type.indexOf('User') > -1));
            groupFieldDataSource.unshift({ name: 'Responsable', internalName: 'Responsible' });
            var groupField = new ej.dropdowns.DropDownList({
                placeholder: 'Agrupar por',
                floatLabelType: 'Auto',
                locale: 'es',
                fields: { text: 'name', value: 'internalName' },
                dataSource: groupFieldDataSource,
                value: groupFieldDataSource[2].internalName,
            });
            groupField.appendTo("#groupField");
        }


        var valueField = new ej.dropdowns.DropDownList({
            placeholder: 'Valor a resumir',
            floatLabelType: 'Auto',
            locale: 'es',
            fields: { text: 'text', value: 'value' },
            dataSource: [{ value: 'ColorValue', text: 'Valor color' }, { value: 'DeviationAbsolute', text: 'Desvío absoluto' }, { value: 'DeviationPercentage', text: 'Desvío porcentual' }, { value: 'DeviationAbsoluteInverted', text: 'Desvío absoluto invertido' }, { value: 'DeviationPercentageInverted', text: ' Desvío porcentual invertido' }],
            value: 'ColorValue',
        });
        valueField.appendTo('#valueField');

        var aggregateFunction = new ej.dropdowns.DropDownList({
            placeholder: 'Forma de resumen',
            floatLabelType: 'Auto',
            locale: 'es',
            dataSource: ['Suma', 'Máximo', 'Mínimo', 'Promedio', 'Primero', 'Último', 'Mediana', 'Desviación Estándar Muestral', 'Desviación Estándar Poblacional', 'Varianza Muestral', 'Varianza Poblacional'],
            value: 'Promedio',
        });
        aggregateFunction.appendTo('#aggregateFunction');

        var groupScaleDataSource = MVD.DataSources.Indicator.scalesValues.reduce(function (accu, e) {
            var isRepeat = accu.find(el => el.value === e.Scale_SPData.value);
            if (!isRepeat) { accu.push({ value: e.Scale_SPData.value, text: e.Scale }) }
            return accu;
        }, []);
        var groupScale = new ej.dropdowns.DropDownList({
            placeholder: 'Tipo de escala',
            floatLabelType: 'Auto',
            locale: 'es',
            dataSource: groupScaleDataSource,
            fields: { text: 'text', value: 'value' },
            value: 1,
            change: function (args) {
                if (args.isInteracted) {
                    document.getElementById('scalesRows').innerHTML = '';
                    MVD.DataSources.Indicator.renderScalesCount = 1;
                    MVD.DataSources.Indicator.UI.renderScalesChoice(args.value, MVD.DataSources.Indicator.getScaleDefaultRange(args.value));
                }
            }
        });
        groupScale.appendTo('#groupScale');
    }
    document.getElementById('scalesRows').innerHTML = '';
    MVD.DataSources.Indicator.renderScalesCount = 1;
    var groupLevel = event.srcElement.dataset.level;
    document.getElementById('hiddenIndicatorsPanelGroupLevel').value = groupLevel;
    var groupLevelSettings = JSON.parse(document.getElementById('indicatorPanelGroupSettings').value)[groupLevel];
    if (groupLevelSettings) {
        ej.base.getComponent(document.getElementById('groupField'), 'dropdownlist').value = groupLevelSettings.groupField;
        ej.base.getComponent(document.getElementById('groupField'), 'dropdownlist').enabled = (groupLevel === 'Level1') ? false : true;
        ej.base.getComponent(document.getElementById('valueField'), 'dropdownlist').value = groupLevelSettings.valueField;
        ej.base.getComponent(document.getElementById('aggregateFunction'), 'dropdownlist').value = groupLevelSettings.aggregateFunction;
        MVD.DataSources.Indicator.UI.renderScalesChoice(groupLevelSettings.groupScale, groupLevelSettings.scaleRange);
    } else {
        var groupField = ej.base.getComponent(document.getElementById('groupField'), 'dropdownlist');
        groupField.value = groupField.dataSource[2].internalName;
        groupField.enabled = true;
        ej.base.getComponent(document.getElementById('valueField'), 'dropdownlist').value = 'ColorValue';
        ej.base.getComponent(document.getElementById('aggregateFunction'), 'dropdownlist').value = 'Promedio';
        MVD.DataSources.Indicator.UI.renderScalesChoice(1, MVD.DataSources.Indicator.getScaleDefaultRange(1));
    }
    ej.base.getComponent(document.getElementById('indicatorsPanelGroupSettingsDialog'), 'dialog').show();
};

MVD.Dashboards.UI.btnAddIndicatorsPanelGroup = function (isInteracted) {
    if (document.getElementById('indicatorsPanelGroupWrapper').querySelectorAll('Button[data-level]').length === 3) {
        MVD.SyncfusionUtilities.showToast('Ya ha alcanzado el número maximo de agrupaciones.');
        return false;
    }
    var level = 'Level' + (document.getElementById('indicatorsPanelGroupWrapper').querySelectorAll('Button[data-level]').length + 1);
    var referenceNode = document.getElementById('btnAddIndicatorsPanelGroup').parentNode;
    var newNode = document.createElement('div');
    newNode.style = 'margin: auto 0';
    newNode.innerHTML = '<button type="button" data-level="' + level + '" class="e-btn e-small e-info" onclick="MVD.Dashboards.UI.openIndicatorsPanelGroupDialog(event)">Configurar</button>'
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    if (event.type === 'click') {
        document.querySelector('button[data-level="' + level + '"]').click();
    }
};

MVD.Dashboards.UI.saveIndicatorsPanelGroupSettingsDialog = function (deleteLevel) {
    var groupLevel = document.getElementById('hiddenIndicatorsPanelGroupLevel').value;
    var panelGroups = JSON.parse(document.getElementById('indicatorPanelGroupSettings').value);
    if (deleteLevel) {
        if (groupLevel === 'Level1') {
            MVD.SyncfusionUtilities.showToast('La agrupación por responsable no puede ser eliminada.');
            return;
        } else if (groupLevel === 'Level2') {
            document.querySelector('button[data-level="Level2"]').innerText = panelGroups['Level3'].groupText;
            panelGroups['Level2'] = panelGroups['Level3'];
        }
        delete panelGroups['Level3'];
        document.querySelector('button[data-level="Level3"]').remove();
    } else {
        var groupField = ej.base.getComponent(document.getElementById('groupField'), 'dropdownlist').value;
        if (groupLevel !== 'Level1' && groupField === 'Responsible') {
            MVD.SyncfusionUtilities.showToast('La agrupación por responsable es utlizada solamente en el primer nivel.');
            return;
        }
        var strScales = MVD.DataSources.Indicator.validateScaleRanges();
        if (!strScales) {
            return;
        }
        panelGroups[groupLevel] = {
            'groupField': ej.base.getComponent(document.getElementById('groupField'), 'dropdownlist').value,
            'groupText': ej.base.getComponent(document.getElementById('groupField'), 'dropdownlist').text,
            'valueField': ej.base.getComponent(document.getElementById('valueField'), 'dropdownlist').value,
            'aggregateFunction': ej.base.getComponent(document.getElementById('aggregateFunction'), 'dropdownlist').value,
            'groupScale': ej.base.getComponent(document.getElementById('groupScale'), 'dropdownlist').value,
            'scaleRange': strScales
        }
        document.querySelector('button[data-level="' + groupLevel + '"]').innerText = panelGroups[groupLevel].groupText;
    }
    document.getElementById('indicatorPanelGroupSettings').value = JSON.stringify(panelGroups);
    MVD.Dashboards.UI.initSyncfusionComponent('dashboardIndicatorPanelPreview');
    var panelSettings = MVD.Dashboards.UI.getPanelSettings();
    MVD.Dashboards.renderPanel(panelSettings, 'panelContent_indicatorsPanelPreView');
    ej.base.getComponent(document.getElementById('indicatorsPanelGroupSettingsDialog'), 'dialog').hide();
};

MVD.Dashboards.UI.saveDataSourceSettingsDialog = function () {
    ej.base.getComponent(document.getElementById('parametersGrid'), 'grid').endEdit();
    var settings = MVD.Dashboards.UI.getDataSourceSettings();
    var panelType = ej.base.getComponent(document.getElementById('panelType'), 'dropdownlist').value;
    var dataSourcesSettings = document.getElementById('dataSourcesSettings').value;
    dataSourcesSettings = (dataSourcesSettings) ? JSON.parse(dataSourcesSettings) : {};
    if (typeof dataSourcesSettings === 'string') dataSourcesSettings = {};
    var distinctSourceType = false;
    let hasIndicatorType = false;
    let hasDataSourceType = false;
    for (var key in dataSourcesSettings) {
        if (settings.sourceType === 'Indicador' || dataSourcesSettings[key].sourceType === 'DataSource' && dataSourcesSettings[key].indicatorSheet) {
            hasIndicatorType = true;
        }
        if (settings.sourceType === 'DataSource' && !dataSourcesSettings[key].indicatorSheet) {
            hasDataSourceType = true;
        }
    }
    if (hasIndicatorType && hasDataSourceType && panelType === 'chart') {
        MVD.SyncfusionUtilities.showToast('Para el panel de tipo gráfico no es posible mezclar ambos tipos de fuentes de datos.');
    }
    else {
        if (!dataSourcesSettings[settings.id]) {
            dataSourcesSettings[settings.id] = {};
        }
        dataSourcesSettings[settings.id] = settings;
        if (!settings.sourceId) {
            delete dataSourcesSettings[settings.id];
        }
        document.getElementById('dataSourcesSettings').value = JSON.stringify(dataSourcesSettings);
        MVD.Dashboards.UI.setPanelSettings(MVD.Dashboards.UI.getPanelSettings(), true);
        ej.base.getComponent(document.getElementById('dataSourceSettingsDialog'), 'dialog').hide();
    }
};

MVD.Dashboards.UI.saveDataDetailsSettingsDialog = function () {
    document.getElementById('detailsDataSettings').value = JSON.stringify(MVD.Dashboards.UI.getGridPersistData('gridDetailsDataSettings'));
    ej.base.getComponent(document.getElementById('detailsDataSettingsDialog'), 'dialog').hide();
};

MVD.Dashboards.UI.saveIndicatorsPanelsSheetDialog = function () {
    function getScale(operador) {
        var scale = '0.00000+Rojo;Verde';
        if (operador === null) {
            return scale;
        }
        if (operador === '≥') {
            scale = '0.00000-Rojo;Verde';
        } else if (operador === '>') {
            scale = '0.00000+Rojo;Verde';
        } else if (operador === '≤') {
            scale = '0.00000-Verde;Rojo';
        } else if (operador === '<') {
            scale = '0.00000+Verde;Rojo';
        } else {
            scale = '0.00000-Rojo;0.00000+Verde;Rojo';
        }
        return scale;
    };
    const sourceId = ej.base.getComponent(document.getElementById('indicatorsPanelsSource'), 'dropdownlist').value;
    const selectedDashboards = ej.base.getComponent(document.getElementById('indicatorsPanelsSelectedDashboards'), 'multiselect').value;
    const showData = ej.base.getComponent(document.getElementById('indicatorsPanelsShowData'), 'multiselect').value;
    if (!sourceId || selectedDashboards.length === 0 || showData.length === 0) {
        MVD.SyncfusionUtilities.showToast('Falta completar algún de los campos.');
        return;
    }
    if (Object.keys(MVD.DataSources.cacheIndicatorsSheet[sourceId].plans).length === 0) {
        MVD.SyncfusionUtilities.showToast('La fuente seleccionada no contiene datos.');
        return;
    }
    const plan = Object.keys(MVD.DataSources.cacheIndicatorsSheet[sourceId].plans).sort(function (a, b) {
        return (a === b) ? 0 : (a > b) ? -1 : 1;
    })[0];
    const sourceName = MVD.DataSources.cacheDataSources.find(e => e.id === sourceId).title;
    const indicatorsColumnsKeys = Object.keys(MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[plan][0].indicator);
    const dashboardColumn = indicatorsColumnsKeys[0];
    const groupColumn = indicatorsColumnsKeys[1];
    const titleColumn = indicatorsColumnsKeys[2];
    const measureFormatColumn = indicatorsColumnsKeys[indicatorsColumnsKeys.length - 2];
    const importType = ej.base.getComponent(document.getElementById('indicatorsPanelsImportType'), 'dropdownlist').value;
    if (ej.base.getComponent(document.getElementById('indicatorsPanelsRefreshDashboard'), 'checkbox').checked) {
        ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').removeAll();
        MVD.Dashboards.panels = {};
    }
    const auxDashboard = [];

    let sizeX = ej.base.getComponent(document.getElementById('dashboardLayout'), 'DashboardLayout').columns;
    let row = 0;

    let sourceParameters = [];
    MVD.DataSources.cacheDataSources.find(e => e.id === sourceId).parameters.forEach(function (e) {
        let aux = {
            'sourcesIds': [sourceId],
            'createdName': e.createdName
        };
        aux['fields'] = {};
        aux['fields'][sourceId] = e.field;
        sourceParameters.push(aux);
    });

    if (importType === 'indicatorsPanels') {
        let showYTD = ej.base.getComponent(document.getElementById('indicatorsPanelsShowYTD'), 'checkbox').checked;
        for (let i = 0; i < selectedDashboards.length; i++) {
            let selected = selectedDashboards[i];
            let groups = MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[plan].filter(e => e.indicator[dashboardColumn] === selected)
                .reduce(function (accu, e) {
                    if (typeof accu[e.indicator[groupColumn]] === 'undefined') {
                        accu[e.indicator[groupColumn]] = [e.indicator[titleColumn]];
                    } else {
                        accu[e.indicator[groupColumn]].push(e.indicator[titleColumn]);
                    }
                    return accu;
                }, {});
            for (var groupName in groups) {
                var sizeY = groups[groupName].length * showData.length;
                if (groups[groupName].length > 1 && showData.length > 1) {
                    sizeY = sizeY - groups[groupName].length;
                }
                if (sizeY === 1) sizeY = 2;
                if (auxDashboard.length > 0) {
                    var keys = Object.keys(MVD.Dashboards.panels);
                    row = auxDashboard[auxDashboard.length - 1].sizeY + auxDashboard[auxDashboard.length - 1].row;
                }
                var panelId = MVD.Dashboards.addPanel(row, 0, sizeX, sizeY, false);
                auxDashboard.push({
                    'id': panelId,
                    'sizeX': sizeX,
                    'sizeY': sizeY,
                    'row': row,
                    'col': 0
                });
                let panel = {
                    type: 'indicatorsPanel',
                    title: selected,
                    dataSourcesSettings: {
                        'indicatorsPanel': {
                            'id': 'indicatorsPanel',
                            'indicatorSheet': groups[groupName],
                            'sourceId': sourceId,
                            'sourceType': 'Indicador',
                            'parameters': sourceParameters,
                            'indicatorParameter': [{ 'createdName': 'Plan', 'required': false, 'sourceId': sourceId, 'visible': true, 'sourcesIds': [sourceId], 'name': 'Plan' }],
                            'resumeDataSettings': '',
                            'drillingSettings': '',
                            'detailsDataSettings': ''
                        }
                    },
                    settings: {
                        'groupName': groupName,
                        'showData': showData,
                        'groupDashboard': selected,
                        'showYTD': showYTD
                    }
                };
                MVD.Dashboards.UI.handlerPanelParameters(panel, 'panelContent_' + panelId);
                MVD.Dashboards.renderPanel(panel, 'panelContent_' + panelId);
                MVD.Dashboards.panels['panelContent_' + panelId] = panel;
            }
        }
    }
    else {
        sizeX = Math.floor(sizeX / 3);
        let sizeY = sizeX * 2;
        let col = 0;
        let auxSourceId = -Math.floor(Math.random() * 1000000);
        for (let i = 0; i < selectedDashboards.length; i++) {
            let indicators = MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[plan].filter(e => e.indicator[dashboardColumn] === selectedDashboards[i]);
            for (let j = indicators.length - 1; j >= 0; j--) {
                if (j > 0) {
                    col = 2;
                    if (j % 2 === 0) col = 4;
                    if (j % 3 === 0) col = 0;
                }
                let panelId = MVD.Dashboards.addPanel(row, col, sizeX, sizeY, false);
                auxDashboard.push({
                    'id': panelId,
                    'sizeX': sizeX,
                    'sizeY': sizeY,
                    'row': row,
                    'col': col
                });
                var verticalLabelFormat = MVD.Dashboards.UI.controlsAuxDataConstants.formatTypes.find(function (e) { return e.value === indicators[j].indicator[measureFormatColumn] });
                if (typeof verticalLabelFormat === 'undefined') verticalLabelFormat = { 'format': 'n2', 'formatType': 'Número', 'value': '1.23' };
                let panel = {
                    type: 'chart',
                    title: indicators[j].indicator[titleColumn],
                    settings: {
                        'verticalName': '',
                        'verticalLabelFormat': verticalLabelFormat,
                        'horizontalName': '',
                        'horizontalLabelFormat': { 'format': 'MMM', 'formatType': 'Fecha', 'value': 'MMM' },
                        'sortAxe': [],
                        'sortDecending': false,
                        'series': [
                            { 'internalName': 'AccumulatedValue', 'name': 'Valor acumulado', 'id': auxSourceId + '_AccumulatedValue', 'sourceName': sourceName, 'labelVisible': false, 'chartType': 'Line', 'color': '#145BD8', 'horizontalField': 'Date', 'group': indicators[j].indicator[titleColumn], 'visible': true },
                            { 'internalName': 'History', 'name': 'Valor histórico', 'id': auxSourceId + 'History', 'sourceName': sourceName, 'labelVisible': true, 'chartType': 'StackingColumn', 'color': '#C3C3C3', 'horizontalField': 'Date', 'group': indicators[j].indicator[titleColumn], 'visible': true },
                            { 'internalName': 'PredictedValue', 'name': 'Valor meta', 'id': auxSourceId + '_PredictedValue', 'sourceName': sourceName, 'labelVisible': false, 'chartType': 'DashedLine', 'color': '#d91114ff', 'horizontalField': 'Date', 'group': indicators[j].indicator[titleColumn], 'visible': true },
                            { 'internalName': 'Value', 'name': 'Valor', 'id': auxSourceId + '_Value', 'sourceName': sourceName, 'labelVisible': true, 'chartType': 'StackingColumn', 'color': '#666666ff', 'horizontalField': 'Date', 'group': indicators[j].indicator[titleColumn], 'visible': true },
                            { 'internalName': 'YearAccumulatedValue', 'name': 'YTD', 'id': auxSourceId + '_YearAccumulatedValue', 'sourceName': sourceName, 'labelVisible': true, 'chartType': 'StackingColumn', 'color': '#145BD8', 'horizontalField': 'Date', 'group': indicators[j].indicator[titleColumn], 'visible': true }
                        ],
                        'dynamicSeries': []
                    }
                };
                panel.dataSourcesSettings = {};
                panel.dataSourcesSettings[auxSourceId] = {
                    'id': auxSourceId,
                    'sourceId': sourceId,
                    'sourceType': 'DataSource',
                    'parameters': sourceParameters,
                    'indicatorSheet': indicators[j].indicator[titleColumn],
                    'resumeDataSettings': '',
                    'drillingSettings': '',
                    'detailsDataSettings': {
                        'columns': [
                            { 'field': 'Date', 'headerText': 'Fecha' },
                            { 'field': 'Value', 'headerText': 'Valor' }, { 'field': 'YearAccumulatedValue', 'headerText': 'YTD' },
                            { 'field': 'AccumulatedValue', 'headerText': 'Valor acumulado' },
                            { 'field': 'PredictedValue', 'headerText': 'Valor meta' },
                            { 'field': 'History', 'headerText': 'Valor histórico' }
                        ]
                    }
                };
                MVD.Dashboards.UI.handlerPanelParameters(panel, 'panelContent_' + panelId);
                MVD.Dashboards.renderPanel(panel, 'panelContent_' + panelId);
                MVD.Dashboards.panels['panelContent_' + panelId] = panel;
            }
        }
    }
    ej.base.getComponent(document.getElementById('indicatorsPanelsSheetDialog'), 'dialog').hide();
};

MVD.Dashboards.UI.savePanelSettingsDialog = function () {
    ej.base.getComponent(document.getElementById('seriesChartGrid'), 'grid').endEdit();
    ej.base.getComponent(document.getElementById('dynamicSeriesChartGrid'), 'grid').endEdit();
    var panel = MVD.Dashboards.UI.getPanelSettings();
    MVD.Dashboards.UI.handlerPanelParameters(panel, MVD.Dashboards.selectedPanelId);
    if (Object.keys(panel.dataSourcesSettings).length > 0) {
        MVD.Dashboards.renderPanel(panel, MVD.Dashboards.selectedPanelId);
        MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId] = panel;
    } else {
        var panelNumber = MVD.Dashboards.selectedPanelId.replace('panelContent_', '');
        document.getElementById('panelTitle_' + panelNumber).innerText = 'Título del panel ' + panelNumber;
        document.getElementById('panel_' + panelNumber + '_body').innerHTML = '<div id="panelContent_' + panelNumber + '" style="overflow:hidden"></div><div id="panelSpinner_' + panelNumber + '" class="panelSpinner"></div>',
            delete MVD.Dashboards.panels[MVD.Dashboards.selectedPanelId];
    }

    ej.base.getComponent(document.getElementById('panelSettingsDialog'), 'dialog').hide();
};

MVD.Dashboards.UI.savePanelDrillingSettingsDialog = function () {
    ej.base.getComponent(document.getElementById('seriesChartGridDrilling'), 'grid').endEdit();
    ej.base.getComponent(document.getElementById('dynamicSeriesChartGridDrilling'), 'grid').endEdit();
    var drillingSettings = {};
    drillingSettings.type = ej.base.getComponent(document.getElementById('panelDrillingType'), 'dropdownlist').value;
    drillingSettings.title = ej.base.getComponent(document.getElementById('panelTitleDrilling'), 'textbox').value;
    drillingSettings.settings = {};
    if (drillingSettings.type === 'chart') {
        drillingSettings.settings.verticalName = ej.base.getComponent(document.getElementById('verticalNameDrilling'), 'textbox').value;
        drillingSettings.settings.verticalLabelFormat = ej.base.getComponent(document.getElementById('verticalLabelFormatDrilling'), 'dropdownlist').itemData;
        drillingSettings.settings.horizontalName = ej.base.getComponent(document.getElementById('horizontalNameDrilling'), 'textbox').value;
        drillingSettings.settings.horizontalLabelFormat = ej.base.getComponent(document.getElementById('horizontalLabelFormatDrilling'), 'dropdownlist').itemData;
        drillingSettings.settings.sortAxe = ej.base.getComponent(document.getElementById('sortAxeDrilling'), 'multiselect').value;
        drillingSettings.settings.sortDecending = ej.base.getComponent(document.getElementById('sortDecendingDrilling'), 'checkbox').checked;
        drillingSettings.settings.series = ej.base.getComponent(document.getElementById('seriesChartGridDrilling'), 'grid').dataSource;
        drillingSettings.settings.series.forEach(function (e) {
            for (var key in e) {
                if (!['name', 'internalName', 'id', 'displayName', 'sourceName', 'horizontalField', 'chartType', 'color', 'visible', 'group'].includes(key) || (key === 'name' && (e['name'] === e['displayName']))) {
                    delete e[key];
                }
                if (key === 'group' && e[key]) {
                    e[key] = e[key].trim();
                }
            }
        });
        drillingSettings.settings.dynamicSeries = ej.base.getComponent(document.getElementById('dynamicSeriesChartGridDrilling'), 'grid').dataSource;
        drillingSettings.settings.dynamicSeries.forEach(function (e) {
            for (var key in e) {
                if (!['name', 'id', 'sourceId', 'searchType', 'horizontalField', 'searchValue', 'chartType', 'visible', 'color'].includes(key)) {
                    delete e[key];
                }
                if (key === 'group' && e[key]) {
                    e[key] = e[key].trim();
                }
            }
        });
    }
    document.getElementById('drillingSettings').value = JSON.stringify(drillingSettings);
    ej.base.getComponent(document.getElementById('panelDrillingSettingsDialog'), 'dialog').hide();
};

MVD.Dashboards.UI.saveParameterSettingsDialog = function () {
    var parameterId = document.getElementById('hiddenParameterId').value;
    var defaultValue = null;
    var defaultValueType = ej.base.getComponent(document.getElementById('parameterDefaultValueType'), 'dropdownlist').value;
    if (defaultValueType === 'value') {
        defaultValue = ej.base.getComponent(document.getElementById('parameterValue'), 'textbox').value;
    }
    else if (defaultValueType === 'date') {
        defaultValue = ej.base.getComponent(document.getElementById('parameterDate'), 'datepicker').value;
    }
    else {
        defaultValue = new Date().getFullYear();
    }

    MVD.Dashboards.parametersExtras[parameterId].defaultValue = defaultValue
    MVD.Dashboards.parametersExtras[parameterId].defaultValueType = defaultValueType;
    try {
        if (MVD.Dashboards.parametersExtras[parameterId].allowMultiple) {
            document.getElementById(parameterId).ej2_instances[0].value = [defaultValue.toString()];
        } else {
            document.getElementById(parameterId).ej2_instances[0].value = defaultValue;
        }
        if (defaultValue && !document.getElementById(parameterId).ej2_instances[0].value) {
            MVD.SyncfusionUtilities.showToast('El valor ' + defaultValue + ' no puede ser utilizado en este tipo de parámetro.');
        }
    } catch (e) {
        console.log(e);
    }
    ej.base.getComponent(document.getElementById('parameterSettingsDialog'), 'dialog').hide();
};

MVD.Dashboards.UI.saveResumeDataSettingsDialog = function () {
    let resumeDataSettings = {
        dataSourceSettings: MVD.DataSources.Pivot.getDataSourceSettings('resumeDataPivot')
    };
    let columnsLevel = ej.base.getComponent(document.getElementById('columnsLevelResumeData'), 'numerictextbox').value;
    let rowsLevel = ej.base.getComponent(document.getElementById('rowsLevelResumeData'), 'numerictextbox').value;
    if (Object.keys(resumeDataSettings.dataSourceSettings).length !== 0) {
        var transposeField = null;
        resumeDataSettings.extraSettings = {
            rowsLevel: (rowsLevel <= resumeDataSettings.dataSourceSettings.rows.length) ? rowsLevel : resumeDataSettings.dataSourceSettings.rows.length,
            columnsLevel: (columnsLevel <= resumeDataSettings.dataSourceSettings.columns.length) ? columnsLevel : resumeDataSettings.dataSourceSettings.columns.length,
            transpose: ej.base.getComponent(document.getElementById('transpose'), 'checkbox').checked,
            transposeField: null
        };
        try {
            resumeDataSettings.extraSettings.transposeField = (resumeDataSettings.dataSourceSettings.rows.length !== 0) ?
                resumeDataSettings.dataSourceSettings.rows[resumeDataSettings.extraSettings.rowsLevel - 1].name : null;
        } catch (e) {

        }
        document.getElementById('resumeDataSettings').value = JSON.stringify({
            'dataSourceSettings': resumeDataSettings.dataSourceSettings,
            'extraSettings': resumeDataSettings.extraSettings
        });
        document.getElementById('btnResumeData').innerHTML = 'Modificar resumen';
        document.getElementById('btnRemoveResumeData').style.visibility = 'visible';
        let panelType = ej.base.getComponent(document.getElementById('panelType'), 'dropdownlist').value;
        document.getElementById('drillingSettingsWrapper').style.visibility = (panelType === 'chart' && rowsLevel < resumeDataSettings.dataSourceSettings.rows.length) ? 'visible' : 'hidden';
    } else {
        MVD.Dashboards.UI.removeResumeDataSettings();
    }

    ej.base.getComponent(document.getElementById('resumeDataSettingsDialog'), 'dialog').hide();
};

MVD.Dashboards.UI.setDataSourceSettingsDialog = function (dataSourceSettings) {
    let auxSource = null;
    let parameters = [];
    if (dataSourceSettings.id === 'indicatorsPanel') {
        ej.base.getComponent(document.getElementById('indicatorsPanelSelectorType'), 'dropdownlist').value = dataSourceSettings.indicatorsPanelSelectorType;
        if (dataSourceSettings.indicatorsPanelSelectorType === 'Responsible') {
            document.getElementById('indicatorsPanelGroupWrapper').style.display = 'flex';
            ej.base.getComponent(document.getElementById('indicatorsPanelSelectorType'), 'dropdownlist').value = dataSourceSettings.indicatorsPanelSelectorType;
            dataSourceSettings.responsibles.forEach(function (e) {
                SPClientPeoplePicker.SPClientPeoplePickerDict.indicatorsPanelResponsibleSelector_TopSpan.AddUserKeys(e.value);
            });
        } else {
            document.getElementById('indicatorsPanelGroupWrapper').style.display = 'none';
            ej.base.getComponent(document.getElementById('indicatorsPanelIndicatorSelector'), 'multiselect').value = dataSourceSettings.sourceId;
        }
        indicatorsPanelSelectorFirstSet = true;
        let planName = null;
        try {
            MVD.DataSources.getParametersValues(dataSourceSettings.indicatorParameter);
            planName = (dataSourceSettings.indicatorParameter[0].value) ? sourceSettings.indicatorParameter[0].value : sourceSettings.indicatorParameter[0].defaultValue;
        } catch (e) {

        }
        for (var i = 0; i < dataSourceSettings.sourceId.length; i++) {
            auxSource = MVD.DataSources.Indicator.getSourceMask(dataSourceSettings.sourceId[i], planName);
            parameters = parameters.concat(MVD.DataSources.getAllSourceParameters(auxSource));
        }
        parameters = parameters.reduce(function (accu, e) {
            var isRepeat = accu.find(el => el.createdName === e.createdName);
            if (typeof isRepeat !== 'undefined') {
                if (!isRepeat.sourcesIds.includes(e.sourceId)) {
                    isRepeat.sourcesIds.push(e.sourceId);
                }
            } else {
                if (typeof e.sourcesIds === 'undefined') {//por los resumenes de datos
                    e.sourcesIds = [e.sourceId];
                }
                accu.push(e);
            }
            return accu;
        }, []);
    }
    else {
        auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(dataSourceSettings);
        parameters = auxSource.parameters;
        document.getElementById('indicatorPlanParameterWrapper').style.display = (dataSourceSettings.sourceType === 'Indicador') ? 'flex' : 'none';
        document.getElementById('buttonsResumeDataWrapper').style.display = (dataSourceSettings.sourceType === 'Indicador' || dataSourceSettings.indicatorSheet /*|| (auxSource.type === 'Pivot' && auxSource.subType !== 'ResumePivot')*/) ? 'none' : 'flex';
        ej.base.getComponent(document.getElementById('sourceType'), 'dropdownlist').value = dataSourceSettings.sourceType;
        ej.base.getComponent(document.getElementById('source'), 'dropdownlist').value = dataSourceSettings.sourceId;
    }

    MVD.Dashboards.UI.initSyncfusionComponent('parametersGrid', { dataSource: parameters });
    if (dataSourceSettings.id === 'indicatorsPanel' || auxSource.type === 'Indicador') {
        ej.base.getComponent(document.getElementById('indicatorParameterType'), 'dropdownlist').value = dataSourceSettings.indicatorParameter[0].parameterIndicatorType;
        if (dataSourceSettings.indicatorParameter[0].parameterIndicatorType === 'existingParameter') {
            MVD.Dashboards.UI.onChangeIndicatorParameterType('existingParameter');
            var parameterSelector = ej.base.getComponent(document.getElementById('indicatorExistingParameterSelector'), 'dropdownlist');
            parameterSelector.value = dataSourceSettings.indicatorParameter[0].name;
            if (!ej.base.getComponent(document.getElementById('indicatorExistingParameterSelector'), 'dropdownlist').value) {
                MVD.SyncfusionUtilities.showToast('El páramtero que se había seleccionado para los planes del indicador fue removido. Por favor seleccione otro.', null, 6000);
                parameterSelector.value = parameterSelector.dataSource[0].name;
            }
        } else {
            ej.base.getComponent(document.getElementById('indicatorPlanParameterName'), 'textbox').value = dataSourceSettings.indicatorParameter[0].createdName;
        }
    }
    if (dataSourceSettings.resumeDataSettings) {
        document.getElementById('btnResumeData').innerHTML = 'Modificar resumen';
        document.getElementById('btnRemoveResumeData').style.visibility = 'visible';
        document.getElementById('resumeDataSettings').value = JSON.stringify(dataSourceSettings.resumeDataSettings);
    }
    var panelType = ej.base.getComponent(document.getElementById('panelType'), 'dropdownlist').value;
    document.getElementById('drillingSettingsWrapper').style.visibility = (panelType === 'chart' && auxSource.type === 'Pivot' && auxSource.typeSettings.extraSettings.rowsLevel < auxSource.typeSettings.dataSourceSettings.rows.length) ? 'visible' : 'hidden';
    if (dataSourceSettings.drillingSettings) {
        document.getElementById('drillingSettings').value = JSON.stringify(dataSourceSettings.drillingSettings);
    }
    document.getElementById('detailsDataSettingsWrapper').style.visibility = (panelType !== 'grid' && panelType !== 'indicatorsPanel') ? 'visible' : 'hidden';
    if (dataSourceSettings.detailsDataSettings) {
        document.getElementById('detailsDataSettings').value = JSON.stringify(dataSourceSettings.detailsDataSettings);
    }
    document.getElementById('indicatorSheetTypeWrapper').style.display = (dataSourceSettings.indicatorSheet) ? 'flex' : 'none';
    ej.base.getComponent(document.getElementById('indicatorSheet'), 'dropdownlist').dataSource = (dataSourceSettings.indicatorSheet) ? MVD.DataSources.Indicator.getIndicatorsFromExcelSheet(dataSourceSettings.sourceId) : [];
    ej.base.getComponent(document.getElementById('indicatorSheet'), 'dropdownlist').value = (dataSourceSettings.indicatorSheet) ? dataSourceSettings.indicatorSheet : null;
    document.getElementById('dataSourceId').value = dataSourceSettings.id;
};

MVD.Dashboards.UI.setPanelSettings = function (panelSettings, onlyChangeDataSource, drillingPanel) {
    if (drillingPanel) {
        ej.base.getComponent(document.getElementById('panelTitleDrilling'), 'textbox').value = panelSettings.title;
    } else {
        document.getElementById('dataSourcesSettings').value = JSON.stringify(panelSettings.dataSourcesSettings);
        ej.base.getComponent(document.getElementById('panelType'), 'dropdownlist').value = panelSettings.type;
        ej.base.getComponent(document.getElementById('panelTitle'), 'textbox').value = panelSettings.title;
    }
    if (panelSettings.type === 'chart') {
        MVD.Dashboards.UI.setPanelTypeChartSettings(panelSettings, drillingPanel);
    }
    else if (panelSettings.type === 'grid') {
        MVD.Dashboards.UI.setPanelTypeGridSettings(panelSettings);
    }
    else if (panelSettings.type === 'map') {
        MVD.Dashboards.UI.setPanelTypeMapSettings(panelSettings);
    }
    else if (panelSettings.type === 'pivot') {
        MVD.Dashboards.UI.setPanelTypePivotSettings(panelSettings);
    }
    else if (panelSettings.type === 'gauge') {
        MVD.Dashboards.UI.setPanelTypeGaugeSettings(panelSettings, onlyChangeDataSource);
    }
    else if (panelSettings.type === 'indicatorsPanel') {
        MVD.Dashboards.UI.initSyncfusionComponent('dashboardIndicatorPanelPreview');
        document.getElementById('indicatorsPanelGroupWrapper').style.display = (panelSettings.dataSourcesSettings.indicatorsPanel && panelSettings.dataSourcesSettings.indicatorsPanel.indicatorsPanelSelectorType === 'Responsible') ? 'flex' : 'none';
        if (panelSettings.settings.showData.length === 0) {
            MVD.SyncfusionUtilities.showToast('Falta seleccionar los datos a mostrar.')
        } else {
            MVD.Dashboards.UI.setPanelTypeIndicatorsPanelsSettings(panelSettings);
        }
    }
};

MVD.Dashboards.UI.setPanelTypeChartSettings = function (panelSettings, drillingPanel) {
    let fieldsPromises = []
    for (var key in panelSettings.dataSourcesSettings) {
        let auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(panelSettings.dataSourcesSettings[key]);
        if (drillingPanel) {
            auxSource.typeSettings.extraSettings.rowsLevel++;
        }
        fieldsPromises.push(MVD.DataSources.getFields(auxSource));
    }
    Promise.all(fieldsPromises)
        .then(function (args) {
            var hasIndicatorDataSource = false;
            var series = [];
            var dynamicSeries = [];
            var gridChartDataSources = [];
            var horizontalFieldDataSource = [];
            var auxGridChartDataSources = [];
            var horizontalNameId = (drillingPanel) ? 'horizontalNameDrilling' : 'horizontalName';
            var horizontalLabelFormatId = (drillingPanel) ? 'horizontalLabelFormatDrilling' : 'horizontalLabelFormat';
            var verticalNameId = (drillingPanel) ? 'verticalNameDrilling' : 'verticalName';
            var verticalLabelFormatId = (drillingPanel) ? 'verticalLabelFormatDrilling' : 'verticalLabelFormat';
            var sortAxeId = (drillingPanel) ? 'sortAxeDrilling' : 'sortAxe';
            var sortDecendingId = (drillingPanel) ? 'sortDecendingDrilling' : 'sortDecending';
            var seriesChartGridId = (drillingPanel) ? 'seriesChartGridDrilling' : 'seriesChartGrid';
            var dynamicSeriesChartGridId = (drillingPanel) ? 'dynamicSeriesChartGridDrilling' : 'dynamicSeriesChartGrid';

            ej.base.getComponent(document.getElementById(horizontalNameId), 'textbox').value = (panelSettings.settings.horizontalName) ? panelSettings.settings.horizontalName : '';
            ej.base.getComponent(document.getElementById(horizontalLabelFormatId), 'dropdownlist').value = (panelSettings.settings.horizontalLabelFormat) ? panelSettings.settings.horizontalLabelFormat.value : 'Sin formato';
            ej.base.getComponent(document.getElementById(verticalNameId), 'textbox').value = (panelSettings.settings.verticalName) ? panelSettings.settings.verticalName : '';
            ej.base.getComponent(document.getElementById(verticalLabelFormatId), 'dropdownlist').value = (panelSettings.settings.verticalLabelFormat) ? panelSettings.settings.verticalLabelFormat.value : '1.23';
            ej.base.getComponent(document.getElementById(sortDecendingId), 'checkbox').checked = (panelSettings.settings.sortDecending) ? panelSettings.settings.sortDecending : false;

            for (var i = 0; i < args.length; i++) {
                var fields = args[i].fields.sort(function (a, b) {
                    return (a.name === b.name) ? 0 : (a.name < b.name) ? -1 : 1;
                });

                for (var j = 0; j < fields.length; j++) {
                    if (horizontalFieldDataSource.filter(e => e.internalName === fields[j].internalName).length === 0) {
                        horizontalFieldDataSource.push(fields[j]);
                    }
                }
                var dynamicFields = args[i].dynamicFields;
                var keys = Object.keys(panelSettings.dataSourcesSettings);
                var auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(panelSettings.dataSourcesSettings[keys[i]]);
                gridChartDataSources.push({ dataSourceId: keys[i], title: auxSource.title, type: auxSource.type });
                if (auxSource.type === 'Indicador' || auxSource.typeSettings.indicatorSheet) {
                    hasIndicatorDataSource = true;
                }
                var numberTypeFieldsCount = fields.filter(e => e.type === 'Number').length;

                for (var k = 0; k < fields.length; k++) {
                    fields[k].id = keys[i] + '_' + fields[k].internalName;
                    fields[k].displayName = fields[k].name;
                    fields[k].sourceName = auxSource.title;
                    fields[k].labelVisible = true;
                    fields[k].group = '';
                    if (fields[k].type === 'Number') {
                        if (auxSource.type === 'Indicador' || auxSource.typeSettings.indicatorType) {
                            if (!fields[k].chartType) {
                                if (fields[k].internalName === 'Value' || fields[k].internalName === 'History' || fields[k].internalName === 'YearAccumulatedValue') {
                                    fields[k].chartType = 'StackingColumn';
                                }
                                else if (fields[k].internalName === 'PredictedValue') {
                                    fields[k].chartType = 'DashedLine';
                                    fields[k].labelVisible = false;
                                }
                                else {
                                    fields[k].chartType = 'Line';
                                    fields[k].labelVisible = false;
                                }
                            }
                            if (!fields[k].color) {
                                if (fields[k].internalName === 'History') {
                                    fields[k].color = '#C3C3C3';
                                }
                                else if (fields[k].internalName === 'Value') {
                                    fields[k].color = '#666666ff';
                                }
                                else if (fields[k].internalName === 'AccumulatedValue' || fields[k].internalName === 'YearAccumulatedValue') {
                                    fields[k].color = '#145BD8';
                                }
                                else if (fields[k].internalName === 'PredictedValue') {
                                    fields[k].color = '#d91114ff';
                                }
                            }
                            fields[k].horizontalField = 'Date';
                            fields[k].group = (auxSource.typeSettings.indicatorSheet) ? auxSource.typeSettings.indicatorSheet : auxSource.title;
                        }
                        else {
                            if (auxSource.type === 'Pivot') {
                                var rowLevel = (drillingPanel) ? auxSource.typeSettings.extraSettings.rowsLevel + 1 : auxSource.typeSettings.extraSettings.rowsLevel;
                                var auxHorizontalField = MVD.DataSources.Pivot.getConcatRowsDimensionFields(auxSource.typeSettings.dataSourceSettings.rows, rowLevel);
                                fields[k].horizontalField = (auxHorizontalField) ? auxHorizontalField : 'x';
                            }
                            else {
                                fields[k].horizontalField = fields[0].internalName;
                            }
                            fields[k].chartType = 'Column';
                            fields[k].color = MVD.Dashboards.colorPaletteIndexed[series.length];
                        }
                        if (typeof fields[k].visible === 'undefined') {
                            fields[k].visible = (numberTypeFieldsCount < 6) ? true : false;
                        }
                        series.push(fields[k]);
                    }
                    var auxSerie = panelSettings.settings.series.find(e => e.id === fields[k].id);
                    if (auxSerie) {
                        fields[k].labelVisible = (typeof auxSerie.labelVisible === 'undefined') ? true : auxSerie.labelVisible;
                        fields[k].chartType = auxSerie.chartType;
                        fields[k].name = auxSerie.name;
                        fields[k].visible = auxSerie.visible;
                        fields[k].color = auxSerie.color;
                        fields[k].group = auxSerie.group;
                        fields[k].horizontalField = auxSerie.horizontalField
                    }
                }

                for (var j = 0; j < dynamicFields.length; j++) {
                    dynamicFields[j].id = Math.floor(Math.random() * 1000000);
                    auxGridChartDataSources.push({ dataSourceId: keys[i] + '_' + dynamicFields[j].internalName, title: auxSource.title });
                    dynamicFields[j].sourceId = auxGridChartDataSources[auxGridChartDataSources.length - 1].dataSourceId;
                    if (typeof dynamicFields[j].searchType === 'undefined') {
                        dynamicFields[j].searchType = (auxSource.type === 'Pivot') ? 'endsWith' : 'equal';
                    }
                    var rowLevel = (drillingPanel) ? auxSource.typeSettings.extraSettings.rowsLevel + 1 : auxSource.typeSettings.extraSettings.rowsLevel;
                    var auxHorizontalField = MVD.DataSources.Pivot.getConcatRowsDimensionFields(auxSource.typeSettings.dataSourceSettings.rows, rowLevel);
                    dynamicFields[j].horizontalField = (auxHorizontalField && !auxSource.typeSettings.extraSettings.transpose) ? auxHorizontalField : 'x';
                    MVD.DataSources.Pivot.getConcatRowsDimensionFields(auxSource.typeSettings.dataSourceSettings.rows, auxSource.typeSettings.extraSettings.rowsLevel)
                    dynamicFields[j].searchValue = (dynamicFields[j].searchValue) ? dynamicFields[j].searchValue : dynamicFields[j].internalName;
                    dynamicFields[j].chartType = (dynamicFields[j].chartType) ? dynamicFields[j].chartType : 'Column';
                    if (typeof dynamicFields[j].visible === 'undefined') {
                        dynamicFields[j].visible = (dynamicFields.length < 6) ? true : false;
                    }
                    dynamicFields[j].color = '';
                    dynamicFields[j].isCreated = false;
                    dynamicFields[j].labelVisible = true;
                    dynamicFields[j].group = '';
                    delete dynamicFields[j].caption;
                    delete dynamicFields[j].internalName;
                    delete dynamicFields[j].name;
                    delete dynamicFields[j].type;
                    dynamicSeries.push(dynamicFields[j]);
                    var auxDynamicSerie = panelSettings.settings.dynamicSeries.find(e => e.sourceId === dynamicFields[j].sourceId && !e.isCreated);
                    if (auxDynamicSerie) {
                        dynamicFields[j].labelVisible = (typeof auxDynamicSerie.labelVisible === 'undefined') ? true : auxDynamicSerie.labelVisible;;
                        dynamicFields[j].id = auxDynamicSerie.id;
                        dynamicFields[j].group = auxDynamicSerie.group;
                        dynamicFields[j].name = auxDynamicSerie.name;
                        dynamicFields[j].searchType = auxDynamicSerie.searchType;
                        dynamicFields[j].searchValue = auxDynamicSerie.searchValue;
                        dynamicFields[j].chartType = auxDynamicSerie.chartType;
                        dynamicFields[j].visible = auxDynamicSerie.visible;
                        dynamicFields[j].color = auxDynamicSerie.color;
                        dynamicFields[j].horizontalField = auxDynamicSerie.horizontalField
                    }
                }
            }

            var dynamicCreatedSeries = panelSettings.settings.dynamicSeries.filter(e => e.isCreated);
            dynamicCreatedSeries = dynamicCreatedSeries.filter(function (e) {
                return auxGridChartDataSources.filter(el => el.dataSourceId === e.sourceId).length > 0;
            });
            dynamicSeries = dynamicCreatedSeries.concat(dynamicSeries);

            ej.base.getComponent(document.getElementById(verticalLabelFormatId), 'dropdownlist').enabled = (hasIndicatorDataSource) ? false : true;
            ej.base.getComponent(document.getElementById(horizontalLabelFormatId), 'dropdownlist').enabled = (hasIndicatorDataSource) ? false : true;
            ej.base.getComponent(document.getElementById(sortAxeId), 'multiselect').enabled = (hasIndicatorDataSource) ? false : true;
            ej.base.getComponent(document.getElementById(sortDecendingId), 'checkbox').disabled = (hasIndicatorDataSource) ? true : false;
            if (hasIndicatorDataSource) {
                panelSettings.settings.sortAxe = ['xAxis'];
                if (auxSource.typeSettings.indicatorSheet) {
                    let keysPlans = Object.keys(MVD.DataSources.cacheIndicatorsSheet[auxSource.id].plans);
                    let lastPlan = keysPlans[keysPlans.length - 1];
                    let titleColumn = Object.keys(MVD.DataSources.cacheIndicatorsSheet[auxSource.id].plans[lastPlan][0].indicator)[2];
                    let indicator = MVD.DataSources.cacheIndicatorsSheet[auxSource.id].plans[lastPlan].find(e => e.indicator[titleColumn] === auxSource.typeSettings.indicatorSheet).indicator;
                    ej.base.getComponent(document.getElementById(verticalLabelFormatId), 'dropdownlist').value = indicator.MeasureFormat;
                    ej.base.getComponent(document.getElementById(horizontalLabelFormatId), 'dropdownlist').value = 'MMM';
                } else {
                    let indicator = MVD.DataSources.cacheIndicators.find(e => e.id === auxSource.id);
                    ej.base.getComponent(document.getElementById(verticalLabelFormatId), 'dropdownlist').value = indicator.numberFormatValues;
                    ej.base.getComponent(document.getElementById(horizontalLabelFormatId), 'dropdownlist').value = indicator.dateFormat;
                }
            }
            horizontalFieldDataSource = horizontalFieldDataSource.sort(function (a, b) {
                return (a.name === b.name) ? 0 : (a.name < b.name) ? -1 : 1;
            });
            MVD.Dashboards.UI.initSyncfusionComponent(seriesChartGridId, { dataSource: series, horizontalFieldDataSource: horizontalFieldDataSource, hasIndicatorDataSource: hasIndicatorDataSource, drillingPanel: drillingPanel });
            MVD.Dashboards.UI.initSyncfusionComponent(dynamicSeriesChartGridId, { dataSource: dynamicSeries, horizontalFieldDataSource: horizontalFieldDataSource, gridChartDataSources: auxGridChartDataSources, drillingPanel: drillingPanel });

            let sortAxeValue = (panelSettings.settings.sortAxe && !hasIndicatorDataSource) ? panelSettings.settings.sortAxe : []
            MVD.Dashboards.UI.refreshSortSeries(dynamicSeriesChartGridId, sortAxeValue);

            var elements = document.getElementsByClassName(dynamicSeriesChartGridId);
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.visibility = (dynamicSeries.length === 0) ? 'hidden' : 'visible';
            }

            if (!drillingPanel) {
                MVD.Dashboards.UI.initSyncfusionComponent('gridChartDataSources', { dataSource: gridChartDataSources });
            }

        })
        .catch(function (args) {
            console.error(args);
            MVD.SyncfusionUtilities.showToast(args.msg);
        });
};

MVD.Dashboards.UI.setPanelTypeGridSettings = function (panelSettings) {
    MVD.Dashboards.UI.initSyncfusionComponent('grid');
    let auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(panelSettings.dataSourcesSettings['grid']);
    ej.base.getComponent(document.getElementById('gridDataSourceName'), 'textbox').value = (auxSource) ? auxSource.title : '';
    if (auxSource) {
        let promises = [MVD.DataSources.getFields(auxSource)];
        ej.base.getComponent(document.getElementById('gridDataSourceName'), 'textbox').value = (auxSource) ? auxSource.title : '';
        var requiredParameters = auxSource.parameters.filter(e => e.required);
        if (requiredParameters.length > 0) {
            try {
                MVD.DataSources.getParametersValues(requiredParameters);
                promises.unshift(MVD.DataSources.getSourceData(auxSource, requiredParameters));
            } catch (args) {
                promises.unshift(new Promise(function (resolve, reject) { resolve(args.msg) }));
            }
        } else {
            promises.unshift(MVD.DataSources.getSourceData(auxSource, []));
        }
        Promise.all(promises)
            .then(function (args) {
                let data = [];
                let rowNoRealData = {};
                let columns = [];
                let auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(panelSettings.dataSourcesSettings['grid']);

                for (var i = 0; i < args[1].fields.length; i++) {
                    let value = 'Dato no real.'
                    let auxColumn = {
                        field: args[1].fields[i].internalName,
                        headerText: args[1].fields[i].name,
                        minWidth: 100,
                        visible: true
                    };
                    /*string
number
boolean
date
datetime*/
                    if (args[1].fields[i].type === 'DateTime') {
                        value = new Date();
                        auxColumn.type = 'date';
                        auxColumn.format = { type: 'date', format: 'dd/MM/yyyy' };
                    }
                    else if (args[1].fields[i].type === 'Number') {
                        value = 1.23;
                        auxColumn.type = 'number';
                    } else if (args[1].fields[i].type === 'Boolean') {
                        value = 1;
                        auxColumn.type = 'boolean';
                        auxColumn.editType = 'booleanedit';
                        auxColumn.displayAsCheckBox = true;
                    }
                    rowNoRealData[auxColumn.field] = value;
                    if (panelSettings.settings.columns) {
                        let oldColumn = panelSettings.settings.columns.find(e => e.field === auxColumn.field);
                        if (oldColumn) {
                            if (auxColumn.type === oldColumn.type && oldColumn.format) {
                                auxColumn.format = oldColumn.format;
                            }
                            auxColumn.headerText = oldColumn.headerText;
                            auxColumn.visible = oldColumn.visible;
                            auxColumn.MVDPosition = oldColumn.MVDPosition;
                        }
                    }
                    columns.push(auxColumn);
                }
                if (args[1].dynamicFields.length > 0) {
                    if (typeof args[0] !== 'string' && args[0].length > 0) {
                        var possiblesColumns = Object.keys(args[0][0]).filter(e => !columns.map(c => c.field).includes(e));
                        possiblesColumns.forEach(function (e) {
                            let auxColumn = { field: e, headerText: e, type: 'Number', minWidth: 100, visible: true };
                            let oldColumn = panelSettings.settings.columns.find(e => e.field === auxColumn.field);
                            if (oldColumn) {
                                if (auxColumn.type === oldColumn.type && oldColumn.format) {
                                    auxColumn.format = oldColumn.format;
                                }
                                auxColumn.headerText = oldColumn.headerText;
                                auxColumn.visible = oldColumn.visible;
                                auxColumn.MVDPosition = oldColumn.MVDPosition;
                            }
                            rowNoRealData[auxColumn.field] = 1.23;
                            columns.push(auxColumn);
                        });
                    }
                }
                columns.sort(function (a, b) {
                    return (a.MVDPosition === b.MVDPosition) ? 0 : (a.MVDPosition < b.MVDPosition) ? -1 : 1;
                });
                panelSettings.settings.columns = columns;
                if (typeof args[0] === 'string') {
                    data = [rowNoRealData];
                    MVD.SyncfusionUtilities.showToast('Debido a que el origen de datos presenta parámetros obligatorios sin valores ingresados, los datos que se muestran no son los reales.\n' + args[0]);
                } else {
                    data = args[0];
                }
                MVD.Dashboards.UI.initSyncfusionComponent('grid', { dataSource: data, gridSettings: panelSettings.settings });
            })
            .catch(function (args) {
                MVD.SyncfusionUtilities.showToast(args.msg);
            });
    }
    else {
        MVD.SyncfusionUtilities.showToast('La fuente seleccionada a sido eliminada.');
    }
};

MVD.Dashboards.UI.setPanelTypeGaugeSettings = function (panelSettings, onlyChangeDataSource) {
    var auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(panelSettings.dataSourcesSettings['gauge']);
    ej.base.getComponent(document.getElementById('gaugeDataSourceName'), 'textbox').value = (auxSource) ? auxSource.title : '';
    MVD.Dashboards.UI.initColorTypeRange('colorGaugeTypeRanges', 'range');
    if (auxSource) {
        let promises = [MVD.DataSources.getFields(auxSource)];
        let requiredParameters = auxSource.parameters.filter(e => e.required);
        if (requiredParameters.length > 0) {
            try {
                MVD.DataSources.getParametersValues(requiredParameters);
                promises.unshift(MVD.DataSources.getSourceData(auxSource, requiredParameters));
            }
            catch (args) {
                promises.unshift(new Promise(function (resolve, reject) { resolve(args.msg) }));
            }
        } else {
            promises.unshift(MVD.DataSources.getSourceData(auxSource, []));
        }
        Promise.all(promises)
            .then(function (args) {
                let data = [];
                let rowNoRealData = {};
                let columns = [];
                for (let i = 0; i < args[1].fields.length; i++) {
                    if (args[1].fields[i].type !== 'Number') continue;
                    rowNoRealData[args[1].fields[i].internalName] = 75;
                }
                for (let i = 0; i < args[1].dynamicFields.length; i++) {
                    rowNoRealData[args[1].dynamicFields[i].internalName] = 75;
                }
                if (typeof args[0] === 'string') {
                    data = [rowNoRealData];
                    MVD.SyncfusionUtilities.showToast('Debido a que el origen de datos presenta parámetros obligatorios sin valores ingresados, los datos que se muestran no son los reales.\n' + args[0]);
                } else {
                    data = args[0];
                }
                MVD.Dashboards.UI.gaugeData = data;
                let fields = [].concat(args[1].fields.filter(e => e.type === 'Number')).concat(args[1].dynamicFields);
                let gaugeValueField = ej.base.getComponent(document.getElementById('gaugeValueField'), 'dropdownlist');
                gaugeValueField.dataSource = fields;
                gaugeValueField.value = (panelSettings.settings.fieldValue) ? panelSettings.settings.fieldValue : fields[0].internalName;
                if (!onlyChangeDataSource) {
                    ej.base.getComponent(document.getElementById('gaugeType'), 'dropdownlist').value = panelSettings.settings.type;
                    ej.base.getComponent(document.getElementById('axeStartValue'), 'numerictextbox').value = panelSettings.settings.axeStartValue;
                    ej.base.getComponent(document.getElementById('axeEndValue'), 'numerictextbox').value = panelSettings.settings.axeEndValue;
                    ej.base.getComponent(document.getElementById('gaugePointerType'), 'dropdownlist').value = panelSettings.settings.pointer.type;
                    ej.base.getComponent(document.getElementById('gaugePointerRadius'), 'numerictextbox').value = panelSettings.settings.pointer.radius;
                    ej.base.getComponent(document.getElementById('gaugePointerColorType'), 'dropdownlist').value = panelSettings.settings.pointer.colorType;
                    ej.base.getComponent(document.getElementById('gaugePointerColorPicker'), 'colorpicker').value = panelSettings.settings.pointer.color;
                    ej.base.getComponent(document.getElementById('gaugeShowScale'), 'checkbox').checked = panelSettings.settings.showScale;
                    ej.base.getComponent(document.getElementById('gaugeShowValue'), 'checkbox').checked = panelSettings.settings.value.show;
                    ej.base.getComponent(document.getElementById('gaugeValuePosition'), 'dropdownlist').value = panelSettings.settings.value.position;
                    ej.base.getComponent(document.getElementById('gaugeValueColorType'), 'dropdownlist').value = panelSettings.settings.value.colorType;
                    ej.base.getComponent(document.getElementById('gaugeValueColorPicker'), 'colorpicker').value = panelSettings.settings.value.color;
                    ej.base.getComponent(document.getElementById('gaugeValueMask'), 'textbox').value = panelSettings.settings.value.prefix;
                    ej.base.getComponent(document.getElementById('gaugeScaleColor'), 'colorpicker').value = panelSettings.settings.scaleColor
                    ej.base.getComponent(document.getElementById('gaugeGreyRangeColor'), 'checkbox').checked = panelSettings.settings.rangeGreyColor;
                    ej.base.getComponent(document.getElementById('rangeColorRadius'), 'numerictextbox').value = panelSettings.settings.rangeColorRadius;
                    if (panelSettings.settings.type === 'circular') {
                        ej.base.getComponent(document.getElementById('gaugeCircularStartAngle'), 'numerictextbox').value = panelSettings.settings.startAngle;
                        ej.base.getComponent(document.getElementById('gaugeCircularEndAngle'), 'numerictextbox').value = panelSettings.settings.endAngle;
                    }
                    else {
                        ej.base.getComponent(document.getElementById('gaugeLinearOrientation'), 'dropdownlist').value = panelSettings.settings.orientation;
                    }
                    MVD.Dashboards.UI.initColorTypeRange('colorGaugeTypeRanges', 'range', panelSettings.settings.rangesColor);
                }
            })
            .catch(function (args) {
                console.error(args);
                MVD.SyncfusionUtilities.showToast(args.msg);
            })
    }
    else {
        MVD.SyncfusionUtilities.showToast('La fuente seleccionada a sido eliminada.');
    }
};

MVD.Dashboards.UI.setPanelTypeIndicatorsPanelsSettings = function (panelSettings) {
    ej.base.getComponent(document.getElementById('indicatorsPanelGroupName'), 'textbox').value = panelSettings.settings.groupName;
    ej.base.getComponent(document.getElementById('indicatorPanelShowDataType'), 'multiselect').value = panelSettings.settings.showData;
    ej.base.getComponent(document.getElementById('indicatorsPanelsShowYTDColumn'), 'checkbox').checked = panelSettings.settings.showYTD;
    if (panelSettings.settings.panelGroups) {
        document.getElementById('indicatorPanelGroupSettings').value = JSON.stringify(panelSettings.settings.panelGroups);
        for (var keyGroup in panelSettings.settings.panelGroups) {
            if (keyGroup !== 'Level1' && !document.querySelector('button[data-level="' + keyGroup + '"]')) {
                MVD.Dashboards.UI.btnAddIndicatorsPanelGroup();
                document.querySelector('button[data-level="' + keyGroup + '"]').innerText = panelSettings.settings.panelGroups[keyGroup].groupText;
            }
        }
    }
    MVD.Dashboards.UI.initSyncfusionComponent('dashboardIndicatorPanelPreview');
    MVD.Dashboards.renderPanel(panelSettings, 'panelContent_indicatorsPanelPreView');
};

MVD.Dashboards.UI.setPanelTypeMapSettings = function (panelSettings) {
    MVD.Dashboards.UI.mapColorsData = [];
    MVD.Dashboards.UI.mapLocatorsData = [];
    var fieldsPromises = [];
    var dataPromises = [];
    ej.base.getComponent(document.getElementById('selectMap'), 'dropdownlist').value = panelSettings.settings.map;
    ej.base.getComponent(document.getElementById('selectCountryOrContinetn'), 'dropdownlist').value = panelSettings.settings.selectCountryOrContinetn;
    for (var key in panelSettings.dataSourcesSettings) {
        var auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(panelSettings.dataSourcesSettings[key]);
        fieldsPromises.push(MVD.DataSources.getFields(auxSource));
        var requiredParameters = auxSource.parameters.filter(e => e.required);
        if (requiredParameters.length > 0) {
            try {
                MVD.DataSources.getParametersValues(requiredParameters);
                dataPromises.push(MVD.DataSources.getSourceData(auxSource, requiredParameters));
            }
            catch (args) {
                dataPromises.unshift(new Promise(function (resolve, reject) { resolve(args.msg) }));
            }
        } else {
            dataPromises.unshift(MVD.DataSources.getSourceData(auxSource, []));
        }
    }
    Promise.all(fieldsPromises)
        .then(function (args) {
            //ej.base.getComponent(document.getElementById('openStreetCheckBox'), 'checkbox').checked = panelSettings.settings.showOpenStreetSettings;
            ej.base.getComponent(document.getElementById('initLongitude'), 'numerictextbox').value = panelSettings.settings.latitudeInitial;
            ej.base.getComponent(document.getElementById('initLatitude'), 'numerictextbox').value = panelSettings.settings.longitudeInitial;
            ej.base.getComponent(document.getElementById('initZoom'), 'numerictextbox').value = panelSettings.settings.zoomInitial;
            for (var key in panelSettings.dataSourcesSettings) {
                if (key === 'locators') {
                    ej.base.getComponent(document.getElementById('locatorFieldTitle'), 'dropdownlist').dataSource = (args.length === 1) ? args[0].fields : args[1].fields;
                    ej.base.getComponent(document.getElementById('locatorFieldsTooltip'), 'multiselect').dataSource = (args.length === 1) ? args[0].fields : args[1].fields;
                    ej.base.getComponent(document.getElementById('locatorFieldLongitude'), 'dropdownlist').dataSource = (args.length === 1) ? args[0].fields : args[1].fields;
                    ej.base.getComponent(document.getElementById('locatorFieldLatitude'), 'dropdownlist').dataSource = (args.length === 1) ? args[0].fields : args[1].fields;
                    var locatorsSettings = panelSettings.settings.locatorsSettings;
                    ej.base.getComponent(document.getElementById('addLocatorsCheckBox'), 'checkbox').checked = locatorsSettings.show;
                    ej.base.getComponent(document.getElementById('addLocatorsCheckBox'), 'checkbox').change({ checked: locatorsSettings.show });
                    if (Object.keys(locatorsSettings.settings).length > 0) {
                        ej.base.getComponent(document.getElementById('locatorFieldTitle'), 'dropdownlist').value = locatorsSettings.settings.locatorFieldTitle;
                        ej.base.getComponent(document.getElementById('locatorFieldsTooltip'), 'multiselect').value = locatorsSettings.settings.locatorFieldsTooltip.map(e => e.internalName);
                        ej.base.getComponent(document.getElementById('locatorFieldLongitude'), 'dropdownlist').value = locatorsSettings.settings.locatorFieldLongitude;
                        ej.base.getComponent(document.getElementById('locatorFieldLatitude'), 'dropdownlist').value = locatorsSettings.settings.locatorFieldLatitude;
                    } else {
                        ej.base.getComponent(document.getElementById('locatorFieldTitle'), 'dropdownlist').value = (args.length === 1) ? args[0].fields[0].internalName : args[1].fields[0].internalName;
                        ej.base.getComponent(document.getElementById('locatorFieldsTooltip'), 'multiselect').value = (args.length === 1) ? [args[0].fields[0].internalName] : [args[1].fields[0].internalName];
                        ej.base.getComponent(document.getElementById('locatorFieldLongitude'), 'dropdownlist').value = (args.length === 1) ? args[0].fields[0].internalName : args[1].fields[0].internalName;
                        ej.base.getComponent(document.getElementById('locatorFieldLatitude'), 'dropdownlist').value = (args.length === 1) ? args[0].fields[0].internalName : args[1].fields[0].internalName;
                    }
                }
                else {
                    ej.base.getComponent(document.getElementById('colorFieldTitle'), 'dropdownlist').dataSource = args[0].fields;
                    ej.base.getComponent(document.getElementById('colorFieldsTooltip'), 'multiselect').dataSource = args[0].fields;
                    ej.base.getComponent(document.getElementById('colorFieldRegion'), 'dropdownlist').dataSource = args[0].fields;
                    ej.base.getComponent(document.getElementById('colorFieldValue'), 'dropdownlist').dataSource = args[0].fields;
                    var colorsSettings = panelSettings.settings.colorsSettings;
                    ej.base.getComponent(document.getElementById('addColorsCheckBox'), 'checkbox').checked = colorsSettings.show;
                    ej.base.getComponent(document.getElementById('addColorsCheckBox'), 'checkbox').change({ checked: colorsSettings.show });
                    if (Object.keys(colorsSettings.settings).length > 0) {
                        ej.base.getComponent(document.getElementById('colorFieldTitle'), 'dropdownlist').value = colorsSettings.settings.colorFieldTitle;
                        ej.base.getComponent(document.getElementById('colorFieldsTooltip'), 'multiselect').value = colorsSettings.settings.colorFieldsTooltip.map(e => e.internalName);
                        ej.base.getComponent(document.getElementById('colorFieldRegion'), 'dropdownlist').value = colorsSettings.settings.colorFieldRegion;
                        ej.base.getComponent(document.getElementById('colorFieldValue'), 'dropdownlist').value = colorsSettings.settings.colorFieldValue;
                        ej.base.getComponent(document.getElementById('colorFieldType'), 'dropdownlist').value = colorsSettings.settings.colorFieldType;
                        MVD.Dashboards.UI.initColorTypeRange('colorMapTypeRanges', colorsSettings.settings.colorFieldType, colorsSettings.settings.colorRanges);
                    } else {
                        ej.base.getComponent(document.getElementById('colorFieldTitle'), 'dropdownlist').value = args[0].fields[0].internalName;
                        ej.base.getComponent(document.getElementById('colorFieldsTooltip'), 'multiselect').value = [args[0].fields[0].internalName];
                        ej.base.getComponent(document.getElementById('colorFieldRegion'), 'dropdownlist').value = args[0].fields[0].internalName;
                        ej.base.getComponent(document.getElementById('colorFieldValue'), 'dropdownlist').value = args[0].fields[0].internalName;
                        ej.base.getComponent(document.getElementById('colorFieldType'), 'dropdownlist').value = 'range';
                        MVD.Dashboards.UI.initColorTypeRange('colorMapTypeRanges', 'range');
                    }
                }
            }
            if (!panelSettings.dataSourcesSettings.colors) {
                ej.base.getComponent(document.getElementById('colorFieldTitle'), 'dropdownlist').dataSource = [];
                ej.base.getComponent(document.getElementById('colorFieldsTooltip'), 'multiselect').dataSource = [];
                ej.base.getComponent(document.getElementById('colorFieldsTooltip'), 'multiselect').value = [];
                ej.base.getComponent(document.getElementById('colorFieldRegion'), 'dropdownlist').dataSource = [];
                ej.base.getComponent(document.getElementById('colorFieldValue'), 'dropdownlist').dataSource = [];
                ej.base.getComponent(document.getElementById('colorFieldType'), 'dropdownlist').value = 'range';
                MVD.Dashboards.UI.initColorTypeRange('colorMapTypeRanges', 'range');
            }
            if (!panelSettings.dataSourcesSettings.locators) {
                ej.base.getComponent(document.getElementById('locatorFieldTitle'), 'dropdownlist').dataSource = [];
                ej.base.getComponent(document.getElementById('locatorFieldsTooltip'), 'multiselect').dataSource = [];
                ej.base.getComponent(document.getElementById('locatorFieldsTooltip'), 'multiselect').value = [];
                ej.base.getComponent(document.getElementById('locatorFieldLongitude'), 'dropdownlist').dataSource = [];
                ej.base.getComponent(document.getElementById('locatorFieldLatitude'), 'dropdownlist').dataSource = [];
            }

            Promise.all(dataPromises.concat(fieldsPromises))
                .then(function (args) {
                    MVD.Dashboards.UI.resetMapPreview();
                });
        })
        .catch(function (args) {
            console.error(args);
            MVD.SyncfusionUtilities.showToast(args.msg);
        });

    Promise.all(dataPromises)
        .then(function (args) {
            let i = 0;
            for (var key in panelSettings.dataSourcesSettings) {
                if (key === 'locators') {
                    MVD.Dashboards.UI.mapLocatorsData = args[i];
                } else {
                    MVD.Dashboards.UI.mapColorsData = args[i];
                }
                i++;
            }
        })
        .catch(function (args) { console.error(args); });
};

MVD.Dashboards.UI.setPanelTypePivotSettings = function (panelSettings) {
    MVD.Dashboards.UI.initSyncfusionComponent('pivot');
    var auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(panelSettings.dataSourcesSettings['pivot']);
    ej.base.getComponent(document.getElementById('pivotDataSourceName'), 'textbox').value = (auxSource) ? auxSource.title : '';
    if (auxSource) {
        let promises = [];
        var requiredParameters = auxSource.parameters.filter(e => e.required);
        if (requiredParameters.length > 0) {
            try {
                MVD.DataSources.getParametersValues(requiredParameters);
                promises.unshift(MVD.DataSources.getSourceData(auxSource, requiredParameters));
            } catch (args) {
                promises.unshift(new Promise(function (resolve, reject) { resolve(args.msg) }));
            }
        } else {
            promises.unshift(MVD.DataSources.getSourceData(auxSource, []));
        }
        Promise.all(promises)
            .then(function (retData) {
                let data = retData[0];
                if (typeof data === 'string') {
                    MVD.SyncfusionUtilities.showToast('Debido a que el origen de datos presenta parámetros obligatorios sin valores ingresados, no estan los datos para poder trabajar en la pivot.\n' + data);
                    data = [];
                }
                MVD.Dashboards.UI.initSyncfusionComponent('pivot', { dataSource: data, dataSourceSettings: panelSettings.settings, fields: auxSource.fields });
            })
            .catch(function (args) {
                MVD.SyncfusionUtilities.showToast(args.msg);
            });
    }
    else {
        MVD.SyncfusionUtilities.showToast('La fuente seleccionada a sido eliminada.');
    }
};

MVD.Dashboards.UI.showDrilling = function (divPanelId, dataSourceId, options) {
    if (!document.getElementById('drillingPanelDialog')) {
        var newEl = document.createElement('div');
        newEl.setAttribute('id', 'drillingPanelDialog');
        document.getElementById('parentMainContainer').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'drillingPanelSpinner');
        newEl.classList = 'panelSpinner';
        document.getElementById('drillingPanelDialog').append(newEl);
        var drillingPanelDialog = new ej.popups.Dialog({
            locale: 'es',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            showCloseIcon: true,
            content: '<div id="drillingPanelContentDialog"><div id="drillingPanelContent"></div></div>',
            width: '600px',
            height: '550px',
            isModal: true,
            close: function (args) {
                document.getElementById('drillingPanelContentDialog').innerHTML = '<div id="drillingPanelContent"></div>';
            },
            visible: false
        });
        drillingPanelDialog.appendTo('#drillingPanelDialog');
    }
    var source = MVD.Dashboards.UI.getSourcePanel(MVD.Dashboards.panels[divPanelId].dataSourcesSettings[dataSourceId]);
    var columName = null;
    var row = null;
    if (options) {
        var chart = ej.base.getComponent(document.getElementById(divPanelId), 'chart');
        if (!chart) {
            chart = ej.base.getComponent(document.getElementById(divPanelId), 'accumulationchart');
        }
        columName = chart.series[options.serie].yName;
        row = chart.series[options.serie].dataSource[options.point];
    }
    var parameters = MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[divPanelId].dataSourcesSettings);
    if (parameters.length > 0) {
        try {
            MVD.DataSources.getParametersValues(parameters);
        }
        catch (args) {
            MVD.SyncfusionUtilities.showToast('Para mostrar el drilling primero debe cargar los parámetros obligatorios de la fuente.\n' + args.msg);
            return;
        }
    }
    MVD.DataSources.getSourceDataDetails(source, parameters, row, columName)
        .then(function (data) {
            var settings = {
                dataSource: source.typeSettings.dataSourceSettings,
                columnsLevel: (source.typeSettings.extraSettings) ? source.typeSettings.extraSettings.columnsLevel : 0,
                rowsLevel: (source.typeSettings.extraSettings) ? source.typeSettings.extraSettings.rowsLevel : 1
            };
            settings.dataSource.data = data;
            settings.rowsLevel++;
            data = MVD.DataSources.Pivot.getData(settings)
            if (data.length === 0) {
                MVD.SyncfusionUtilities.showToast('No hay datos para mostrar');
            } else {
                var panel = JSON.parse(JSON.stringify(MVD.Dashboards.panels[divPanelId].dataSourcesSettings[dataSourceId].drillingSettings));
                panel.dataSourcesSettings = {};
                panel.dataSourcesSettings[dataSourceId] = JSON.parse(JSON.stringify(MVD.Dashboards.panels[divPanelId].dataSourcesSettings[dataSourceId]));
                ej.base.getComponent(document.getElementById('drillingPanelDialog'), 'dialog').header = panel.title;
                ej.base.getComponent(document.getElementById('drillingPanelDialog'), 'dialog').show();
                MVD.Dashboards.UI.handlerSpinner('drillingPanelSpinner', true);
                MVD.Dashboards.renderPanelChart([data], panel, 'drillingPanelContent');
                MVD.Dashboards.UI.handlerSpinner('drillingPanelSpinner', false);
                setTimeout(function () {
                    MVD.Dashboards.UI.refreshPanelSize(panel, 'drillingPanelContent');
                }, 300);
            }
        })
        .catch(function (args) {
            console.error(args);
            MVD.SyncfusionUtilities.showToast(args.msg);
        });
};

MVD.Dashboards.UI.showDataDetails = function (divPanelId, dataSourceId, options) {
    if (!document.getElementById('gridDataDetailsDialog')) {
        var newEl = document.createElement('div');
        newEl.setAttribute('id', 'gridDataDetailsDialog');
        document.getElementById('parentMainContainer').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'gridDataDetailsPanelSpinner');
        newEl.classList = 'panelSpinner';
        document.getElementById('gridDataDetailsDialog').append(newEl);
        var gridDataDetailsDialog = new ej.popups.Dialog({
            locale: 'es',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            showCloseIcon: true,
            header: 'Detalle de datos',
            content: '<div id="gridDataDetailsWrapper"><div id="gridDataDetails"></div></div>',
            width: '80%',
            height: '775px',
            isModal: true,
            animationSettings: { effect: 'Zoom' },
            close: function (args) {
                ej.base.getComponent(document.getElementById('gridDataDetails'), 'grid').destroy();
            },
            visible: false
        });
        gridDataDetailsDialog.appendTo('#gridDataDetailsDialog');
    }
    var columName = null;
    var row = null;
    if (options) {
        var chart = ej.base.getComponent(document.getElementById(divPanelId), 'chart');
        if (!chart) {
            chart = ej.base.getComponent(document.getElementById(divPanelId), 'accumulationchart');
        }
        columName = chart.series[options.serie].yName;
        row = chart.series[options.serie].dataSource[options.point];
        for (var keyRow in row) { //esto se hace porque las series nulas no se grafican; por eso se le setea Nulo de valor. Al buscar el detalle si va con Nulo no encuentra el detalle ya que espera comparar con null
            if (row[keyRow] === 'Nulo') {
                row[keyRow] = null;
            }
        }
    }
    let source = MVD.Dashboards.UI.getSourceOfDataSourceSettings(MVD.Dashboards.panels[divPanelId].dataSourcesSettings[dataSourceId]);
    if (source.parameters.length > 0) {
        try {
            MVD.DataSources.getParametersValues(source.parameters);
        }
        catch (args) {
            MVD.SyncfusionUtilities.showToast('Para mostrar el detalle de datos primero debe cargar los parámetros obligatorios de la fuente.\n' + args.msg);
            return;
        }
    }
    if (source.typeSettings.plan && source.typeSettings.plan.DataSourceType === 'Datos manuales') {
        MVD.SyncfusionUtilities.showToast('No hay datos para mostrar');
        return false;
    }
    MVD.DataSources.getSourceDataDetails(source, source.parameters, row, columName)
        .then(function (data) {
            if (data.length === 0) {
                MVD.SyncfusionUtilities.showToast('No hay datos para mostrar');
            }
            else {
                let columns = MVD.Dashboards.panels[divPanelId].dataSourcesSettings[dataSourceId].detailsDataSettings.columns;
                let fields = (source.fields) ? source.fields : source.detailsFields;
                for (var i = 0; i < columns.length; i++) {
                    let fieldColumn = fields.find(e => e.internalName === columns[i].field);
                    if (fieldColumn) {
                        columns[i].headerText = fieldColumn.name;
                    }
                }
                MVD.Dashboards.UI.initSyncfusionComponent('gridDataDetails', { dataSource: data, gridSettings: MVD.Dashboards.panels[divPanelId].dataSourcesSettings[dataSourceId].detailsDataSettings });
                ej.base.getComponent(document.getElementById('gridDataDetailsDialog'), 'dialog').show();
            }
        })
        .catch(function (args) {
            console.error(args);
            MVD.SyncfusionUtilities.showToast(args.msg);
        });
};

MVD.Dashboards.UI.resetPanelDrillingSettings = function () {
    MVD.Dashboards.UI.initSyncfusionComponent('seriesChartGridDrilling');
    MVD.Dashboards.UI.initSyncfusionComponent('dynamicSeriesChartGridDrilling');
    document.getElementById('dynamicSeriesDrillingWrapper').style.display = 'none';
    ej.base.getComponent(document.getElementById('horizontalNameDrilling'), 'textbox').value = '';
    ej.base.getComponent(document.getElementById('verticalNameDrilling'), 'textbox').value = '';
    ej.base.getComponent(document.getElementById('horizontalLabelFormatDrilling'), 'dropdownlist').value = horizontalLabelFormat ? horizontalLabelFormat : 'MMM';
    ej.base.getComponent(document.getElementById('verticalLabelFormatDrilling'), 'dropdownlist').value = verticalLabelFormat ? verticalLabelFormat : '1.23';
};

MVD.Dashboards.UI.initPanelDrillingSettingsDialog = function () {
    var newEl = document.createElement('div');
    newEl.setAttribute('id', 'panelDrillingSettingsDialog');
    document.getElementById('parentMainContainer').append(newEl);
    newEl = document.createElement('div');
    newEl.setAttribute('id', 'panelDrillingSettingsContentDialog');
    document.getElementById('parentMainContainer').append(newEl);
    document.getElementById('panelDrillingSettingsContentDialog').innerHTML =
        '<div class="flexContainer">' +
        '<div class="flexItem30Width"><input id="panelTitleDrilling"/></div>' +
        '<div class="flexItem20Width" style="visibility:hidden"><input id="panelDrillingType" /></div>' +
        '</div>' +
        '<div id="panelDrillingTypeSettingsContainer" class="flexContainer">' +
        '<div class="chartTypeSettings flexContainer">' +
        '<div class="flexContainer">' +
        '<div class="flexItem18Width"><input id="horizontalNameDrilling" /></div>' +
        '<div class="flexItem18Width"><input id="horizontalLabelFormatDrilling" /></div>' +
        '<div class="flexItem18Width"><input id="verticalNameDrilling" /></div>' +
        '<div class="flexItem18Width"><input id="verticalLabelFormatDrilling" /></div>' +
        '<div class="flexItem18Width"><input id="sortAxeDrilling" /></div>' +
        '<div style="display:flex"><div style="margin:auto"><input id="sortDecendingDrilling" /></div></div>' +
        '</div>' +
        '<div class="lblSimulate seriesChartGridDrilling">Series</div>' +
        '<div id="seriesChartGridDrillingWrapper"  class="seriesChartGridDrilling">' +
        '<div id="seriesChartGridDrilling"></div>' +
        '</div>' +
        '<div class="lblSimulate dynamicSeriesChartGridDrilling" >Series dinamicas</div>' +
        '<div id="dynamicSeriesChartGridDrillingWrapper" class="dynamicSeriesChartGridDrilling">' +
        '<div id="dynamicSeriesChartGridDrilling"></div>' +
        '</div>' +
        '</div>' +
        '<div class="pivotTypeSettings flexContainer"></div>' +
        '<div class="mapTypeSettings flexContainer"></div>' +
        '</div>';

    var panelDrillingSettingsDialog = new ej.popups.Dialog({
        buttons: [{
            'click': () => {
                MVD.Dashboards.UI.savePanelDrillingSettingsDialog();
            },
            buttonModel: {
                content: 'Guardar',
                cssClass: 'e-success',
                iconCss: 'e-save e-icons'
            },
            type: 'Button'
        }],
        locale: 'es',
        position: { X: 'center', Y: 'center' },
        closeOnEscape: true,
        showCloseIcon: true,
        header: 'Editor del drilling',
        content: document.getElementById('panelDrillingSettingsContentDialog'),
        width: '65%',
        height: 680,
        isModal: true,
        animationSettings: { effect: 'Zoom' },
        visible: false,
        close: function () {
            MVD.Dashboards.UI.resetPanelDrillingSettings();
        }
    });
    panelDrillingSettingsDialog.appendTo('#panelDrillingSettingsDialog');

    var panelDrillingTypeDataSource = [{ value: 'chart', text: 'Gráfica' }, { value: 'map', text: 'Mapa' }, { value: 'pivot', text: 'Pivot' }];
    var panelDrillingType = new ej.dropdowns.DropDownList({
        placeholder: 'Tipo',
        locale: 'es',
        floatLabelType: 'Auto',
        fields: { text: 'text', value: 'value' },
        dataSource: panelDrillingTypeDataSource,
        change: function (args) {
            var divsToHide = document.getElementById('panelDrillingTypeSettingsContainer').children;
            for (var i = 0; i < divsToHide.length; i++) {
                divsToHide[i].style.display = (divsToHide[i].classList.contains(args.value + 'TypeSettings')) ? 'inline-flex' : 'none';
            }
            if (args.isInteracted) {
                MVD.Dashboards.UI.setPanelSettings({ type: args.value, settings: null, title: '' }, false, true)
            }
        }
    });
    panelDrillingType.appendTo("#panelDrillingType");

    var panelTitleDrilling = new ej.inputs.TextBox({
        placeholder: 'Título',
        floatLabelType: 'Auto',
        type: 'text',
        locale: 'es',
        showClearButton: true
    });
    panelTitleDrilling.appendTo('#panelTitleDrilling');

    MVD.Dashboards.UI.initSyncfusionComponent('seriesChartGridDrilling');

    MVD.Dashboards.UI.initSyncfusionComponent('dynamicSeriesChartGridDrilling');

    var horizontalNameDrilling = new ej.inputs.TextBox({
        locale: 'es',
        placeholder: 'Nombre del eje horizontal',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true
    });
    horizontalNameDrilling.appendTo('#horizontalNameDrilling');

    var horizontalLabelFormatDrilling = new ej.dropdowns.DropDownList({
        placeholder: 'Formato de etiqueta del eje horizontal',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true,
        locale: 'es',
        fields: { groupBy: 'formatType', value: 'value' },
        dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes']
    });
    horizontalLabelFormatDrilling.appendTo('#horizontalLabelFormatDrilling');

    var verticalNameDrilling = new ej.inputs.TextBox({
        placeholder: 'Nombre del eje vertical',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true,
        locale: 'es',
    });
    verticalNameDrilling.appendTo('#verticalNameDrilling');

    var verticalLabelFormatDrilling = new ej.dropdowns.DropDownList({
        placeholder: 'Formato de etiqueta del eje vertical',
        floatLabelType: 'Auto',
        type: 'text',
        showClearButton: true,
        locale: 'es',
        fields: { groupBy: 'formatType', value: 'value' },
        dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes']
    });
    verticalLabelFormatDrilling.appendTo('#verticalLabelFormatDrilling');

    var sortAxeDrilling = new ej.dropdowns.MultiSelect({
        placeholder: 'Ordenar por',
        locale: 'es',
        floatLabelType: 'Auto',
        fields: { text: 'text', value: 'value' },
        dataSource: [{ text: 'Eje X', value: 'x' }],
        value: [],
        mode: 'CheckBox',
        showSelectAll: false,
        showDropDownIcon: false,
        popupHeight: '350px',
        unSelectAllText: 'Deseleccionar todos',
    });
    sortAxeDrilling.appendTo('#sortAxeDrilling');

    var sortDecendingDrilling = new ej.buttons.CheckBox({
        label: 'Descendente',
        labelPosition: 'Before',
        checked: false,
    });
    sortDecendingDrilling.appendTo('#sortDecendingDrilling');
};

MVD.Dashboards.UI.openIndicatorChartDetails = function (indicatorId, panelId) {
    if (panelId === 'panelContent_indicatorsPanelPreView') {
        return false;
    }
    if (!document.getElementById('chartDetailDialog')) {
        var newEl = document.createElement('div');
        newEl.setAttribute('id', 'chartDetailDialog');
        document.getElementById('parentMainContainer').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'panelSpinner_chartDetail');
        newEl.classList = 'panelSpinner';
        document.getElementById('chartDetailDialog').append(newEl);
        newEl = document.createElement('div');
        newEl.setAttribute('id', 'chartDetailContentDialog');
        document.getElementById('chartDetailDialog').append(newEl);
        document.getElementById('chartDetailContentDialog').innerHTML = '<div id="panelContent_indicatorChartDetail"></div>';


        newEl = document.createElement('div');
        var chartDetailDialog = new ej.popups.Dialog({
            locale: 'es',
            position: { X: 'center', Y: 'center' },
            closeOnEscape: true,
            showCloseIcon: true,
            content: document.getElementById('chartDetailContentDialog'),
            width: '600px',
            height: '550px',
            isModal: true,
            visible: false,
            close: function () {
                document.getElementById('chartDetailContentDialog').innerHTML = '<div id="panelContent_indicatorChartDetail"></div>';
                delete MVD.Dashboards.panels['panelContent_indicatorChartDetail'];
            }
        });
        chartDetailDialog.appendTo('#chartDetailDialog');
    }
    let panelParameters = MVD.Dashboards.UI.getPanelParameters(MVD.Dashboards.panels[panelId].dataSourcesSettings);
    let auxPanel = {};
    let planName = '';
    let indicator = null;
    try {
        let indicatorParameter = panelParameters.filter(e => MVD.DataSources.getParameterRenderId(e) === MVD.DataSources.getParameterRenderId(MVD.Dashboards.panels[panelId].dataSourcesSettings.indicatorsPanel.indicatorParameter[0]));
        MVD.DataSources.getParametersValues(indicatorParameter);
        planName = indicatorParameter[0].value;
    } catch (e) { }
    if (indicatorId > 0) {
        indicator = MVD.DataSources.cacheIndicators.find(e => e.id == indicatorId);
    }
    else {
        var sourceId = MVD.Dashboards.panels[panelId].dataSourcesSettings.indicatorsPanel.sourceId;
        var indicatorSheetTitle = MVD.Dashboards.panels[panelId].dataSourcesSettings.indicatorsPanel.indicatorSheet.find(e => e.replace(/ /g, '') == indicatorId);
        var titleColumn = Object.keys(MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[planName][0].indicator)[2];
        var indicatorSheet = MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[planName].find(e => e.indicator[titleColumn] === indicatorSheetTitle);
        indicator = {
            title: indicatorSheetTitle,
            dateFormat: 'MMM',
            numberFormatValues: indicatorSheet.indicator.MeasureFormat,
        };
    }
    auxPanel.settings = {
        horizontalName: '',
        horizontalLabelFormat: MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes'].filter(e => e.value === indicator.dateFormat)[0],
        verticalName: '',
        verticalLabelFormat: MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes'].filter(e => e.value === indicator.numberFormatValues)[0],
        series: [{
            internalName: 'AccumulatedValue',
            id: '1_AccumulatedValue',
            chartType: 'Line',
            color: '#145BD8',
            horizontalField: 'Date',
            group: indicator.title,
            visible: true,
            labelVisible: false
        }, {
            internalName: 'History',
            id: '1_History',
            chartType: 'StackingColumn',
            color: '#C3C3C3',
            horizontalField: 'Date',
            group: indicator.title,
            visible: true,
            labelVisible: true
        }, {
            internalName: 'PredictedValue',
            id: '1_PredictedValue',
            chartType: 'DashedLine',
            color: '#d91114ff',
            horizontalField: 'Date',
            group: indicator.title,
            visible: true,
            labelVisible: false
        }, {
            internalName: 'Value',
            id: '1_Value',
            chartType: 'StackingColumn',
            color: '#666666ff',
            horizontalField: 'Date',
            group: indicator.title,
            visible: true,
            labelVisible: true
        }, {
            internalName: 'YearAccumulatedValue',
            id: '1_YearAccumulatedValue',
            chartType: 'StackingColumn',
            color: '#145BD8',
            horizontalField: 'Date',
            group: indicator.title,
            visible: true,
            labelVisible: true
        }],
        dynamicSeries: [],
        sortAxe: []
    };
    auxPanel.type = 'chart';
    auxPanel.dataSourcesSettings = {
        1: {
            detailsDataSettings: '',
            drillingSettings: '',
            id: '1',
            indicatorParameter: MVD.Dashboards.panels[panelId].dataSourcesSettings.indicatorsPanel.indicatorParameter,
            parameters: panelParameters,
            resumeDataSettings: '',
            sourceId: +indicatorId,
            sourceType: 'Indicador',
        }
    };
    MVD.Dashboards.panels['panelContent_indicatorChartDetail'] = auxPanel;
    if (indicatorId > 0) {
        MVD.Dashboards.renderPanel(auxPanel, 'panelContent_indicatorChartDetail');
    }
    else {
        var data = JSON.parse(JSON.stringify(indicatorSheet.data));
        if (data[0].FilterKey) {
            let filterKey = data[0].FilterKey;
            let parameter = panelParameters.find(e => e.field === filterKey);
            let value = (parameter.value) ? parameter.value : parameter.defaultValue;
            data = data.filter(e => e.FilterValue === value);
        }
        let originalTitle = (indicatorSheet.indicator.DimensioningTitle) ? indicatorSheet.indicator.DimensioningTitle : indicatorSheet.indicator[titleColumn];
        var history = MVD.DataSources.cacheIndicatorsSheet[sourceId].history.find(e => e[titleColumn] === originalTitle);
        if (history) {
            let plans = Object.keys(history).filter(e => parseInt(e) < planName).map(e => parseInt(e)).sort(function (a, b) { return b - a });
            let endIndex = (plans.length > 3) ? 3 : plans.length;
            for (var k = 0; k < endIndex; k++) {
                data.unshift({
                    Date: plans[k],
                    History: history[plans[k]],
                });
            }
        }

        MVD.Dashboards.renderPanelChart([data], auxPanel, 'panelContent_indicatorChartDetail');
        setTimeout(function () {
            MVD.Dashboards.UI.refreshPanelSize(auxPanel, 'panelContent_indicatorChartDetail');
        }, 300);
    }
    ej.base.getComponent(document.getElementById('chartDetailDialog'), 'dialog').header = '<div>Indicador ' + indicator.title + ' ' + planName + '</div><span class="e-icons e-exportPng"></span>';
    ej.base.getComponent(document.getElementById('chartDetailDialog'), 'dialog').show();
};

MVD.Dashboards.UI.openPanelDrillingSettingsDialog = function () {
    if (!document.getElementById('panelDrillingSettingsDialog')) {
        MVD.Dashboards.UI.initPanelDrillingSettingsDialog();
    }
    var drillingSettings = (document.getElementById('drillingSettings').value) ? JSON.parse(document.getElementById('drillingSettings').value) : { type: 'chart', settings: null, title: '' };
    drillingSettings.dataSourcesSettings = {};
    var aux = MVD.Dashboards.UI.getDataSourceSettings();
    drillingSettings.dataSourcesSettings[aux.id] = aux;
    ej.base.getComponent(document.getElementById('panelDrillingType'), 'dropdownlist').value = drillingSettings.type;
    if (!drillingSettings.settings) {
        drillingSettings.settings = {
            verticalName: null,
            verticalLabelFormat: null,
            horizontalName: null,
            horizontalLabelFormat: null,
            sortAxe: [],
            sortDecending: false,
            series: [],
            dynamicSeries: [],
        }
    }
    MVD.Dashboards.UI.setPanelSettings(drillingSettings, false, true);
    ej.base.getComponent(document.getElementById('panelDrillingSettingsDialog'), 'dialog').show();
};

MVD.Dashboards.UI.getSourcePanel = function (panel) {
    var source = {};
    var panelParameters = MVD.Dashboards.UI.getPanelParameters(panel.dataSourcesSettings);
    if (panel.sourceType === 'Indicador') {
        var planName = null;
        panel.extraSettings = {
            scales: null,
        };
        try {
            MVD.DataSources.getParametersValues(panelParameters);
            var auxParameter = panelParameters.find(e => MVD.DataSources.getParameterRenderId(e) === MVD.DataSources.getParameterRenderId(panel.indicatorParameter[0]));
            planName = (auxParameter.value) ? auxParameter.value : auxParameter.defaultValue;
            var indicator = MVD.DataSources.cacheIndicators.find(e => e.id == panel.sourceId);
            var plan = indicator.plans.find(e => e.Title == planName);
            panel.extraSettings = {
                deviationType: plan.DeviationType,
                invertDeviation: plan.InvertDeviation,
                scales: plan.Scales,
                scale: plan.Scale
            };
        } catch (e) {
            console.log(e);
        }
        source = MVD.DataSources.Indicator.getSourceMask(panel.sourceId, planName);
    }
    else {
        source = MVD.DataSources.cacheDataSources.find(element => element.id == panel.sourceId);
        if (panel.resumeDataSettings) {
            source = {
                type: 'Pivot',
                id: -(Math.floor(Math.random() * 1000000)),
                parameters: panelParameters,
                typeSettings: {
                    dataSourceSettings: panel.resumeDataSettings.dataSourceSettings,
                    sourceId: panel.sourceId,
                    extraSettings: panel.resumeDataSettings.extraSettings
                }
            }
        }
    }
    return source;
};

MVD.Dashboards.UI.removeDataSource = function (dataSourceId) {
    var dataSourcesSettings = JSON.parse(document.getElementById('dataSourcesSettings').value);
    delete dataSourcesSettings[dataSourceId];
    document.getElementById('dataSourcesSettings').value = JSON.stringify(dataSourcesSettings);
    MVD.Dashboards.UI.setPanelSettings(MVD.Dashboards.UI.getPanelSettings());
};

MVD.Dashboards.UI.removeResumeDataSettings = function () {
    document.getElementById('btnResumeData').innerHTML = 'Resumir datos';
    document.getElementById('btnRemoveResumeData').style.visibility = 'hidden';
    document.getElementById('resumeDataSettings').value = '';
    document.getElementById('drillingSettings').value = '';
    let panelType = ej.base.getComponent(document.getElementById('panelType'), 'dropdownlist').value;
    let source = ej.base.getComponent(document.getElementById('source'), 'dropdownlist').itemData;
    document.getElementById('drillingSettingsWrapper').style.visibility = (panelType === 'chart' && source.type === 'Pivot' && source.typeSettings.extraSettings.rowsLevel < source.typeSettings.dataSourceSettings.rows.length) ? 'visible' : 'hidden';
};

MVD.Dashboards.UI.resetDataSourceSettingsDialog = function () {
    MVD.Dashboards.UI.initSyncfusionComponent('parametersGrid');
    document.getElementById('drillingSettings').value = '';
    document.getElementById('resumeDataSettings').value = '';
    document.getElementById('detailsDataSettings').value = '';
    document.getElementById('drillingSettingsWrapper').style.visibility = 'hidden';
    document.getElementById('detailsDataSettingsWrapper').style.visibility = 'hidden';
    document.getElementById('btnRemoveResumeData').style.visibility = 'hidden';
    document.getElementById('btnResumeData').innerHTML = 'Resumir datos';
    document.getElementById('buttonsResumeDataWrapper').style.display = 'none';
    document.getElementById('indicatorPlanParameterWrapper').style.display = 'none';
    document.getElementById('indicatorsPanelSelectorWrapper').style.display = 'none';
    document.getElementById('indicatorSheetTypeWrapper').style.display = 'none';
    ej.base.getComponent(document.getElementById('indicatorsPanelSelectorType'), 'dropdownlist').value = 'Indicador';
    var ppobject = SPClientPeoplePicker.SPClientPeoplePickerDict.indicatorsPanelResponsibleSelector_TopSpan;
    if (ppobject) {
        var usersobject = ppobject.GetAllUserInfo();
        usersobject.forEach(function (index) {
            ppobject.DeleteProcessedUser(usersobject[index]);
        });
    }
};

MVD.Dashboards.UI.resetGaugePreview = function () {
    var panelSettings = MVD.Dashboards.UI.getPanelSettings();
    document.getElementById('gaugeWrapper').innerHTML = '<div id="gauge"></div>';
    var data = [{ 'value': panelSettings.settings.axeEndValue * .75 }];
    if (MVD.Dashboards.UI.gaugeData) {
        data = MVD.Dashboards.UI.gaugeData;
    }
    MVD.Dashboards.renderPanelGauge(data, panelSettings, 'gauge');
};

MVD.Dashboards.UI.resetMapPreview = function () {
    var colorsSettings = JSON.parse(document.getElementById('colorsSettings').value);
    colorsSettings.show = ej.base.getComponent(document.getElementById('addColorsCheckBox'), 'checkbox').checked;
    colorsSettings.settings = MVD.Dashboards.UI.getColorSettings('map');
    document.getElementById('colorsSettings').value = JSON.stringify(colorsSettings);
    var locatorsSettings = JSON.parse(document.getElementById('locatorsSettings').value);
    locatorsSettings.show = ej.base.getComponent(document.getElementById('addLocatorsCheckBox'), 'checkbox').checked;
    locatorsSettings.settings = getMapLocatorsSettings();
    document.getElementById('locatorsSettings').value = JSON.stringify(locatorsSettings);
    var panelSettings = MVD.Dashboards.UI.getPanelSettings();
    document.getElementById('mapWrapper').innerHTML = '<div id="mapPreView"></div>';
    let strMsg = '';
    let data = [];
    if (typeof MVD.Dashboards.UI.mapColorsData === 'string') {
        MVD.SyncfusionUtilities.showToast('Debido a que el origen de datos presenta parámetros obligatorios sin valores ingresados, no estan los datos para poder trabajar en el coloreado del mapa.\n' + MVD.Dashboards.UI.mapColorsData);
        MVD.Dashboards.UI.mapColorsData = [];
    }
    if (typeof MVD.Dashboards.UI.mapLocatorsData === 'string') {
        MVD.SyncfusionUtilities.showToast('Debido a que el origen de datos presenta parámetros obligatorios sin valores ingresados, no estan los datos para poder trabajar en los localizadores del mapa.\n' + MVD.Dashboards.UI.mapLocatorsData);
        MVD.Dashboards.UI.mapLocatorsData = [];
    }
    MVD.Dashboards.renderPanelMap([MVD.Dashboards.UI.mapColorsData, MVD.Dashboards.UI.mapLocatorsData], panelSettings, 'mapPreView');

    function getMapLocatorsSettings() {
        let locatorFieldsTooltip = [];
        let fieldsTooltip = ej.base.getComponent(document.getElementById('locatorFieldsTooltip'), 'multiselect');
        fieldsTooltip.value.forEach(function (e) {
            let field = fieldsTooltip.dataSource.find(element => element.internalName === e);
            locatorFieldsTooltip.push({
                internalName: field.internalName,
                name: field.name,
                type: field.type,
            });
        });
        return {
            locatorFieldTitle: ej.base.getComponent(document.getElementById('locatorFieldTitle'), 'dropdownlist').value,
            locatorFieldsTooltip: locatorFieldsTooltip,
            locatorFieldLatitude: ej.base.getComponent(document.getElementById('locatorFieldLatitude'), 'dropdownlist').value,
            locatorFieldLongitude: ej.base.getComponent(document.getElementById('locatorFieldLongitude'), 'dropdownlist').value,
        };
    }
};

MVD.Dashboards.UI.resetPanelSettingsDialog = function (type) {
    document.getElementById('dataSourcesSettings').value = '';
    delete MVD.Dashboards.UI.gaugeData;
    delete MVD.Dashboards.UI.mapColorsData;
    delete MVD.Dashboards.UI.mapLocatorsData;
    if (type === 'chart') {
        MVD.Dashboards.UI.initSyncfusionComponent('gridChartDataSources');
        MVD.Dashboards.UI.initSyncfusionComponent('seriesChartGrid');
        MVD.Dashboards.UI.initSyncfusionComponent('dynamicSeriesChartGrid');
        ej.base.getComponent(document.getElementById('verticalName'), 'textbox').value = '';
        ej.base.getComponent(document.getElementById('verticalLabelFormat'), 'dropdownlist').value = '1.23';
        ej.base.getComponent(document.getElementById('horizontalName'), 'textbox').value = '';
        ej.base.getComponent(document.getElementById('horizontalLabelFormat'), 'dropdownlist').value = 'MMM';
    }
    else if (type === 'grid') {
        MVD.Dashboards.UI.initSyncfusionComponent('grid');
        ej.base.getComponent(document.getElementById('gridDataSourceName'), 'textbox').value = '';
    }
    else if (type === 'pivot') {
        MVD.Dashboards.UI.initSyncfusionComponent('pivot');
        ej.base.getComponent(document.getElementById('pivotDataSourceName'), 'textbox').value = '';
    }
    else if (type === 'map') {
        ej.base.getComponent(document.getElementById('selectMap'), 'dropdownlist').value = 'Mundo';
        ej.base.getComponent(document.getElementById('initLatitude'), 'numerictextbox').value = '';
        ej.base.getComponent(document.getElementById('initLongitude'), 'numerictextbox').value = '';
        ej.base.getComponent(document.getElementById('initZoom'), 'numerictextbox').value = 0;
        ej.base.getComponent(document.getElementById('addLocatorsCheckBox'), 'checkbox').checked = false;
        ej.base.getComponent(document.getElementById('addLocatorsCheckBox'), 'checkbox').change({ checked: false, name: 'change' });
        ej.base.getComponent(document.getElementById('locatorFieldTitle'), 'dropdownlist').dataSource = [];
        ej.base.getComponent(document.getElementById('locatorFieldsTooltip'), 'multiselect').dataSource = [];
        ej.base.getComponent(document.getElementById('locatorFieldLongitude'), 'dropdownlist').dataSource = [];
        ej.base.getComponent(document.getElementById('locatorFieldLatitude'), 'dropdownlist').dataSource = [];
        ej.base.getComponent(document.getElementById('addColorsCheckBox'), 'checkbox').checked = false;
        ej.base.getComponent(document.getElementById('addColorsCheckBox'), 'checkbox').change({ checked: false, name: 'change' });
        ej.base.getComponent(document.getElementById('colorFieldTitle'), 'dropdownlist').dataSource = [];
        ej.base.getComponent(document.getElementById('colorFieldsTooltip'), 'multiselect').dataSource = [];
        ej.base.getComponent(document.getElementById('colorFieldRegion'), 'dropdownlist').dataSource = [];
        ej.base.getComponent(document.getElementById('colorFieldValue'), 'dropdownlist').dataSource = [];
        ej.base.getComponent(document.getElementById('colorFieldType'), 'dropdownlist').value = 'range';
    }
    else if (type === 'gauge') {
        ej.base.getComponent(document.getElementById('gaugeDataSourceName'), 'textbox').value = '';
        ej.base.getComponent(document.getElementById('gaugeValueField'), 'dropdownlist').dataSource = [];
        ej.base.getComponent(document.getElementById('gaugeType'), 'dropdownlist').value = 'circular';
        ej.base.getComponent(document.getElementById('gaugePointerType'), 'dropdownlist').value = 'Needle';
        ej.base.getComponent(document.getElementById('gaugePointerRadius'), 'numerictextbox').value = 80;
        ej.base.getComponent(document.getElementById('gaugeLinearOrientation'), 'dropdownlist').value = 'Vertical';
        ej.base.getComponent(document.getElementById('gaugePointerColorType'), 'dropdownlist').value = 'rangeValue';
        ej.base.getComponent(document.getElementById('gaugeValuePosition'), 'dropdownlist').value = 'middle';
        ej.base.getComponent(document.getElementById('gaugeValueColorType'), 'dropdownlist').value = 'rangeValue';
        ej.base.getComponent(document.getElementById('gaugeLinearOrientation'), 'dropdownlist').value = 'Vertical';
        ej.base.getComponent(document.getElementById('gaugeShowValue'), 'checkbox').checked = true;
        ej.base.getComponent(document.getElementById('gaugeShowValue'), 'checkbox').change({ checked: true, name: 'change' });
        ej.base.getComponent(document.getElementById('gaugeValueMask'), 'textbox').value = '{value}';
        ej.base.getComponent(document.getElementById('gaugeShowScale'), 'checkbox').checked = true;
        ej.base.getComponent(document.getElementById('gaugeShowScale'), 'checkbox').change({ checked: true, name: 'change' });
        ej.base.getComponent(document.getElementById('gaugeGreyRangeColor'), 'checkbox').checked = true;
        ej.base.getComponent(document.getElementById('gaugeGreyRangeColor'), 'checkbox').change({ checked: true, name: 'change' });
        ej.base.getComponent(document.getElementById('gaugeCircularStartAngle'), 'numerictextbox').value = 270;
        ej.base.getComponent(document.getElementById('gaugeCircularEndAngle'), 'numerictextbox').value = 90;
        ej.base.getComponent(document.getElementById('axeStartValue'), 'numerictextbox').value = 0;
        ej.base.getComponent(document.getElementById('axeEndValue'), 'numerictextbox').value = 100;
        ej.base.getComponent(document.getElementById('rangeColorRadius'), 'numerictextbox').value = 90;
        /*

 { name: 'gaugePointerColorPicker', type: 'colorpicker', settings: '' },{ name: 'gaugeValueColorPicker', type: 'colorpicker', settings: '' }, { name: 'gaugeScaleColor', type: 'colorpicker', settings: '' },
          

        */

    }
    else if (type === 'indicatorsPanel') {
        ej.base.getComponent(document.getElementById('indicatorsPanelGroupName'), 'textbox').value = '';
        ej.base.getComponent(document.getElementById('indicatorPanelShowDataType'), 'multiselect').value = [];
        ej.base.getComponent(document.getElementById('indicatorsPanelsShowYTDColumn'), 'checkbox').checked = false;
        MVD.Dashboards.UI.initSyncfusionComponent('dashboardIndicatorPanelPreview');
    }
};

MVD.Dashboards.UI.getGridPersistData = function (gridId) {
    var gridObj = ej.base.getComponent(document.getElementById(gridId), 'grid');
    var ejGridPersist = JSON.parse(ej.base.getComponent(document.getElementById(gridId), 'grid').getPersistData());
    var retSettings = {};
    if (ejGridPersist.sortSettings.columns.length > 0) {
        retSettings.sortSettings = ejGridPersist.sortSettings;
    }
    if (ejGridPersist.groupSettings.columns.length > 0) {
        retSettings.groupSettings = ejGridPersist.groupSettings;
    }
    if (ejGridPersist.filterSettings.columns.length > 0) {
        retSettings.filterSettings = ejGridPersist.filterSettings;
    }
    if (Object.keys(ejGridPersist.filterSettings).length > 0) {
        retSettings.pageSettings = ejGridPersist.pageSettings;
        delete retSettings.pageSettings.totalRecordsCount;
    }
    var columns = [];
    for (let i = 0; i < gridObj.columns.length; i++) {
        let column = {
            'field': gridObj.columns[i].field,
            'headerText': gridObj.columns[i].headerText,//se debería sacar, el tema es que no estoy considerando los campos de los resumenes de datos
            'visible': gridObj.columns[i].visible,
            'MVDPosition': i
        };
        if (gridObj.columns[i].format) {
            column['format'] = gridObj.columns[i].format;
        }
        if (gridObj.columns[i].type) {
            column['type'] = gridObj.columns[i].type;
        }
        columns.push(column);
    }
    retSettings.columns = columns;
    return retSettings;
};

MVD.Dashboards.UI.handlerSpinner = function (spinnerId, visible) {
    if (visible) {
        ej.popups.createSpinner({ target: document.getElementById(spinnerId) });
        ej.popups.showSpinner(document.getElementById(spinnerId));
        document.getElementById(spinnerId).style.display = 'block';
    } else {
        document.getElementById(spinnerId).style.display = 'none';
        ej.popups.hideSpinner(document.getElementById(spinnerId));
    }
};

MVD.Dashboards.UI.refreshPanelSize = function (panel, panelId) {
    try {
        if (panel.type === 'chart') {
            var chart = ej.base.getComponent(document.getElementById(panelId), 'chart');
            if (!chart) {
                chart = ej.base.getComponent(document.getElementById(panelId), 'accumulationchart');
            } else {
                chart.primaryXAxis.zoomFactor = 1;
                chart.primaryYAxis.zoomFactor = 1;
            }
            chart.element.style.height = '100%';
            chart.refresh();
        }
        else if (panel.type === 'grid') {
            var gird = ej.base.getComponent(document.getElementById(panelId), 'grid');
            gird.element.style.height = '100%';
            gird.element.style.width = '100%';
            gird.refresh();
        }
        else if (panel.type === 'pivot') {
            var pivot = ej.base.getComponent(document.getElementById(panelId), 'pivotview');
            pivot.element.style.height = '100%';
            pivot.element.style.width = '100%';
            pivot.refresh();
        }
        else if (panel.type === 'map') {
            var map = ej.base.getComponent(document.getElementById(panelId), 'maps');
            map.element.style.height = '100%';
            map.element.style.width = '100%';
            map.refresh();
        }
        else if (panel.type === 'gauge') {
            var gauge;
            if (panel.settings.type === 'circular') {
                gauge = ej.base.getComponent(document.getElementById(panelId), 'circulargauge');
            } else {
                gauge = ej.base.getComponent(document.getElementById(panelId), 'lineargauge');
            }
            gauge.element.style.height = '100%';
            gauge.element.style.width = '100%';
            gauge.refresh();
        }
        else if (panel.type === 'indicatorsPanel') {
            var treegrid = ej.base.getComponent(document.getElementById(panelId), 'treegrid');
            treegrid.height = (document.getElementById(panelId.replace('Content', '')).querySelectorAll('div.e-panel-content')[0].clientHeight - 45) + 'px';
            treegrid.width = '100%';
            treegrid.refresh();
        }
    } catch (e) {
        console.warn(e);
    }
};

MVD.Dashboards.UI.refreshAllPanelsSize = function () {
    for (var keyPanel in MVD.Dashboards.panels) {
        MVD.Dashboards.UI.refreshPanelSize(MVD.Dashboards.panels[keyPanel], keyPanel);
    }
};

MVD.Dashboards.UI.refreshSortSeries = function (elementId, value) {
    var seriesId = (elementId === 'dynamicSeriesChartGrid') ? 'seriesChartGrid' : 'seriesChartGridDrilling';
    var sortAxeId = (elementId === 'dynamicSeriesChartGrid') ? 'sortAxe' : 'sortAxeDrilling';
    var series = ej.base.getComponent(document.getElementById(seriesId), 'grid').dataSource;
    var dynamicSeries = ej.base.getComponent(document.getElementById(elementId), 'grid').dataSource;
    var oldValues = (value) ? value : ej.base.getComponent(document.getElementById(sortAxeId), 'multiselect').value;
    var sortAxeDataSource = [{ text: 'Eje X', value: 'xAxis' }]
        .concat(series.reduce(function (accu, e) {
            var text = (e.name) ? e.name : e.internalName;
            if (!accu.find(aux => aux.text === text)) {
                accu.push({ text: text, value: e.internalName });
            }
            return accu;
        }, [])
            .concat(dynamicSeries.map(function (e) {
                var auxName = '';
                if (e.searchType !== 'equal') {
                    auxName = MVD.Dashboards.UI.controlsAuxDataConstants.searchTypes.find(s => s.internalName === e.searchType).name + ' ';
                }
                auxName += ((e.name) ? e.name : e.searchValue);
                return { text: auxName, value: e.id }
            })));
    ej.base.getComponent(document.getElementById(sortAxeId), 'multiselect').dataSource = sortAxeDataSource;
    var sortAxeDataSourceValues = sortAxeDataSource.map(e => e.value);
    for (var i = oldValues.length - 1; i >= 0; i--) {
        if (!sortAxeDataSourceValues.find(e => e == oldValues[i])) {
            oldValues.splice(i, 1);
        }
    }
    ej.base.getComponent(document.getElementById(sortAxeId), 'multiselect').value = oldValues;
};

MVD.Dashboards.UI.initSyncfusionComponent = function (elementId, extraSettings) {
    if (elementId === 'gridChartDataSources') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div id="' + elementId + '"></div>';
        var settings = {
            width: '50%',
            dataSource: [],
            toolbar: [{ text: 'Agregar', tooltipText: 'Agregar origen de datos', prefixIcon: 'e-add', id: 'addDataSource' }, 'Delete'],
            toolbarClick: function (args) {
                if (args.item.id === 'addDataSource') {
                    MVD.Dashboards.UI.openDataSourceSettingsDialog({ type: 'chart' });
                }
                else if (args.item.id === 'gridChartDataSources_delete') {
                    var grid = ej.base.getComponent(document.getElementById('gridChartDataSources'), 'grid');
                    if (grid.selectedRowIndex > -1) {
                        MVD.Dashboards.UI.removeDataSource(grid.getRowByIndex(grid.selectedRowIndex).children[0].innerHTML);
                    }
                }
            },
            editSettings: { allowEditing: false, allowAdding: true, allowDeleting: true },
            locale: 'es',
            columns: [
                { field: 'dataSourceId', allowEditing: false, isPrimaryKey: true, visible: false },
                { field: 'title', headerText: 'Nombre', allowEditing: false, width: '40%' },
                { field: 'type', headerText: 'Tipo', allowEditing: false, width: '20%' },
                { headerText: 'Configuración', width: '20%', commands: [{ buttonOption: { content: 'Configurar', cssClass: 'btnConfigDataSource e-flat e-info', click: MVD.Dashboards.UI.openDataSourceSettingsDialog } }] },
            ],
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSource = extraSettings.dataSource;
        }
        var grid = new ej.grids.Grid(settings);
        grid.appendTo('#' + elementId);
    }
    else if (elementId === 'seriesChartGrid' || elementId === 'seriesChartGridDrilling') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div id="' + elementId + '"></div>';
        var columns = [
            { field: 'id', allowEditing: false, isPrimaryKey: true, visible: false },
            { field: 'sourceName', headerText: 'Fuente', allowEditing: false, visible: (elementId === 'seriesChartGrid') },
            { field: 'internalName', visible: false },
            { field: 'displayName', headerText: 'Nombre interno', allowEditing: false },
            { field: 'name', headerText: 'Nombre', allowEditing: true },
            { field: 'chartType', headerText: 'Tipo de gráfico', foreignKeyField: 'value', foreignKeyValue: 'text', dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['chartTypes'], allowEditing: true, width: 220 },
        ];
        if (extraSettings && extraSettings.drillingPanel) {
            columns.push({ field: 'horizontalField', allowEditing: false, visible: false });
        }
        else {
            columns.push({
                field: 'horizontalField',
                headerText: 'Campo eje X',
                allowEditing: true,
                foreignKeyField: 'internalName',
                foreignKeyValue: 'name',
                dataSource: (extraSettings) ? extraSettings.horizontalFieldDataSource : [],
                edit: {
                    create: function () {
                        return document.createElement('input');
                    },
                    read: function (args) {
                        return ej.base.getComponent(document.getElementById(args.id), 'dropdownlist').value;
                    },
                    destroy: function (args) {

                    },
                    write: function (args) {
                        let dataSourcesSettings = JSON.parse(document.getElementById('dataSourcesSettings').value);
                        let auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(dataSourcesSettings[args.rowData.id.split('_')[0]]);
                        MVD.DataSources.getFields(auxSource)
                            .then(function (ret) {
                                var fields = JSON.parse(JSON.stringify(ret.fields));
                                var value = fields[0].internalName;
                                if (args.rowData.horizontalField) {
                                    var auxField = fields.find(e => e.internalName === args.rowData.horizontalField);
                                    value = (auxField) ? auxField.internalName : value;
                                }
                                var dropDown = new ej.dropdowns.DropDownList({
                                    dataSource: fields,
                                    fields: { value: 'internalName', text: 'name' },
                                    value: value,
                                    floatLabelType: 'Never'
                                });
                                dropDown.appendTo('#' + args.element.id);
                                var fieldColumn = ej.base.getComponent(document.getElementById('seriesChartGrid'), 'grid').columns.find(e => e.field === 'horizontalField');
                                var oldData = fieldColumn.dataSource.dataSource.json;
                                for (var i = 0; i < fields.length; i++) {
                                    if (oldData.filter(e => e.internalName === fields[i].internalName).length === 0) {
                                        oldData.push(fields[i]);
                                    }
                                }
                                fieldColumn.dataSource.dataSource.json = oldData;
                            });

                    }
                },
                width: '200px'
            });
        }
        columns = columns.concat([
            { field: 'group', headerText: 'Grupo', allowEditing: true, visible: ((extraSettings && extraSettings.hasIndicatorDataSource) || elementId === 'seriesChartGridDrilling') ? false : true },
            { field: 'labelVisible', headerText: 'Etiquetas', editType: 'booleanedit', displayAsCheckBox: true, allowEditing: true, textAlign: 'Center' },
            { field: 'visible', headerText: 'Visible', editType: 'booleanedit', displayAsCheckBox: true, allowEditing: true, textAlign: 'Center' },
            { field: 'color', headerText: 'Color', edit: MVD.Dashboards.UI.createColorPickerTemplate('color'), allowEditing: true, textAlign: 'Center' }
        ]);
        var settings = {
            toolbar: ['Edit', 'Update', 'Cancel'],
            locale: 'es',
            width: '100%',
            allowPaging: (extraSettings && extraSettings.dataSource && extraSettings.dataSource.length > 5) ? true : false,
            pageSettings: { pageSize: 5 },
            dataSource: [],
            allowSorting: true,
            allowMultiSorting: true,
            allowFiltering: false,
            editSettings: { allowEditing: true, allowAdding: false, allowDeleting: false },
            columns: columns,
            rowDataBound: function (args) {
                var colorColumnIndex = ej.base.getComponent(document.getElementById(elementId), 'grid').columns.find(e => e.field === 'color').index;
                if (args.data.color) {
                    args.row.cells[colorColumnIndex].innerHTML = '';
                    var cell = document.createElement('input');
                    cell.id = 'check';
                    cell.type = 'color';
                    args.row.cells[colorColumnIndex].appendChild(cell);
                    var colorObj = new ej.inputs.ColorPicker({
                        noColor: true,
                        value: args.data.color,
                        disabled: true,
                        cssClass: 'hideOpenColorPickerButton'
                    });
                    colorObj.appendTo(cell);
                } else {
                    args.row.cells[colorColumnIndex].innerHTML = 'Aleatorio';
                }
            },
            beforeDataBound: function (args) {
                MVD.Dashboards.dataBound = false;
            },
            dataBound: function (args) {
                if (!MVD.Dashboards.dataBound) {
                    this.autoFitColumns(['sourceName', 'displayName', 'name', 'group', 'labelVisible', 'visible', 'color']);
                    MVD.Dashboards.dataBound = true;
                }
            },
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSource = extraSettings.dataSource;
        }
        var grid = new ej.grids.Grid(settings);
        grid.appendTo('#' + elementId);
    }
    else if (elementId === 'dynamicSeriesChartGrid' || elementId === 'dynamicSeriesChartGridDrilling') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div id="' + elementId + '"></div>';
        var columns = [
            { field: 'id', allowEditing: false, isPrimaryKey: true, visible: false },
            { field: 'isCreated', allowEditing: false, visible: false }
        ];
        if (elementId === 'dynamicSeriesChartGrid') {
            columns.push({
                field: 'sourceId',
                headerText: 'Fuente',
                foreignKeyField: 'dataSourceId',
                foreignKeyValue: 'title',
                dataSource: (extraSettings && extraSettings.gridChartDataSources) ? extraSettings.gridChartDataSources : [],
                edit: {
                    create: function () {
                        return document.createElement('input');
                    },
                    read: function (args) {
                        return ej.base.getComponent(document.getElementById(args.id), 'dropdownlist').value;
                    },
                    destroy: function (args) {

                    },
                    write: function (args) {
                        var dynamicSeriesChartGridColumns = ej.base.getComponent(document.getElementById(elementId), 'grid').columns;
                        var dataSourcesSettings = JSON.parse(document.getElementById('dataSourcesSettings').value);
                        if (typeof args.rowData.sourceId === 'undefined') {
                            args.rowData.sourceId = dynamicSeriesChartGridColumns.find(e => e.field === 'sourceId').dataSource.dataSource.json[0].dataSourceId;
                        }
                        var dropDown = new ej.dropdowns.DropDownList({
                            dataSource: dynamicSeriesChartGridColumns.find(e => e.field === 'sourceId').dataSource.dataSource.json,
                            fields: { value: 'dataSourceId', text: 'title' },
                            value: args.rowData.sourceId,
                            floatLabelType: 'Never',
                            change: function (args) {
                                let auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(dataSourcesSettings[args.rowData.sourceId.split('_')[0]]);
                                MVD.DataSources.getFields(auxSource)
                                    .then(function (ret) {
                                        var fields = JSON.parse(JSON.stringify(ret.fields));
                                        var value = fields[0].internalName;
                                        if (args.rowData.horizontalField) {
                                            var auxField = fields.find(e => e.internalName === args.rowData.horizontalField);
                                            value = (auxField) ? auxField.internalName : value;
                                        }
                                        var dropDown = new ej.dropdowns.DropDownList({
                                            dataSource: fields,
                                            fields: { value: 'internalName', text: 'name' },
                                            value: value,
                                            floatLabelType: 'Never'
                                        });
                                        dropDown.appendTo('#' + args.element.id);
                                        var oldData = dynamicSeriesChartGridColumns.find(e => e.field === 'horizontalField').dataSource.dataSource.json;
                                        for (var i = 0; i < fields.length; i++) {
                                            if (oldData.filter(e => e.internalName === fields[i].internalName).length === 0) {
                                                oldData.push(fields[i]);
                                            }
                                        }
                                        dynamicSeriesChartGridColumns.find(e => e.field === 'horizontalField').dataSource.dataSource.json = oldData;
                                    })
                                    .catch(function (args) { console.log(args); });
                            }
                        });
                        dropDown.appendTo('#' + args.element.id);
                    }
                }
            });
        }
        else {
            columns.push({
                visible: false,
                field: 'sourceId',
                headerText: 'Fuente',
                foreignKeyField: 'dataSourceId',
                foreignKeyValue: 'title',
                dataSource: (extraSettings && extraSettings.gridChartDataSources) ? extraSettings.gridChartDataSources : [],
                edit: {
                    create: function () {
                        return document.createElement('input');
                    },
                    read: function (args) {
                        return ej.base.getComponent(document.getElementById(args.id), 'dropdownlist').value;
                    },
                    destroy: function (args) {

                    },
                    write: function (args) {
                        var dynamicSeriesChartGridColumns = ej.base.getComponent(document.getElementById(elementId), 'grid').columns;
                        var dataSourcesSettings = JSON.parse(document.getElementById('dataSourcesSettings').value);
                        if (typeof args.rowData.sourceId === 'undefined') {
                            args.rowData.sourceId = dynamicSeriesChartGridColumns.find(e => e.field === 'sourceId').dataSource.dataSource.json[0].dataSourceId;
                        }
                        var dropDown = new ej.dropdowns.DropDownList({
                            dataSource: dynamicSeriesChartGridColumns.find(e => e.field === 'sourceId').dataSource.dataSource.json,
                            fields: { value: 'dataSourceId', text: 'title' },
                            value: args.rowData.sourceId,
                            floatLabelType: 'Never',
                            change: function (args) {
                                let auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(dataSourcesSettings[args.rowData.sourceId.split('_')[0]]);
                                MVD.DataSources.getFields(auxSource)
                                    .then(function (ret) {
                                        var fields = JSON.parse(JSON.stringify(ret.fields));
                                        var value = fields[0].internalName;
                                        if (args.rowData.horizontalField) {
                                            var auxField = fields.find(e => e.internalName === args.rowData.horizontalField);
                                            value = (auxField) ? auxField.internalName : value;
                                        }
                                        var dropDown = new ej.dropdowns.DropDownList({
                                            dataSource: fields,
                                            fields: { value: 'internalName', text: 'name' },
                                            value: value,
                                            floatLabelType: 'Never'
                                        });
                                        dropDown.appendTo('#' + args.element.id);
                                        var oldData = dynamicSeriesChartGridColumns.find(e => e.field === 'horizontalField').dataSource.dataSource.json;
                                        for (var i = 0; i < fields.length; i++) {
                                            if (oldData.filter(e => e.internalName === fields[i].internalName).length === 0) {
                                                oldData.push(fields[i]);
                                            }
                                        }
                                        dynamicSeriesChartGridColumns.find(e => e.field === 'horizontalField').dataSource.dataSource.json = oldData;
                                    })
                                    .catch(function (args) { console.log(args); });
                            }
                        });
                        dropDown.appendTo('#' + args.element.id);
                    }
                }
            });
        }
        columns = columns.concat([
            { field: 'searchType', headerText: 'Tipo de búsqueda', foreignKeyField: 'internalName', foreignKeyValue: 'name', dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['searchTypes'], allowEditing: true, defaultValue: 'contains' },
            { field: 'searchValue', headerText: 'Valor a buscar', allowEditing: true },
            { field: 'name', headerText: 'Nombre', allowEditing: true },
            { field: 'chartType', headerText: 'Tipo de gráfico', foreignKeyField: 'value', foreignKeyValue: 'text', dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['chartTypes'], allowEditing: true, defaultValue: 'Column', width: 220 },
            {
                field: 'horizontalField',
                headerText: 'Campo eje X',
                allowEditing: true,
                foreignKeyField: 'internalName',
                foreignKeyValue: 'name',
                dataSource: (extraSettings) ? extraSettings.horizontalFieldDataSource : [],
                edit: {
                    create: function () {
                        return document.createElement('input');
                    },
                    read: function (args) {
                        return ej.base.getComponent(document.getElementById(args.id), 'dropdownlist').value;
                    },
                    destroy: function (args) {

                    },
                    write: function (args) {
                        var dynamicSeriesChartGridColumns = ej.base.getComponent(document.getElementById(elementId), 'grid').columns;
                        var panelSettings = MVD.Dashboards.UI.getPanelSettings();
                        var auxSource = null;
                        if (elementId === 'dynamicSeriesChartGridDrilling') {
                            auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(MVD.Dashboards.UI.getDataSourceSettings());
                            auxSource.typeSettings.extraSettings.rowsLevel++;
                        } else {
                            auxSource = MVD.Dashboards.UI.getSourceOfDataSourceSettings(panelSettings.dataSourcesSettings[args.rowData.sourceId.split('_')[0]]);
                        }
                        MVD.DataSources.getFields(auxSource)
                            .then(function (ret) {
                                var fields = JSON.parse(JSON.stringify(ret.fields));
                                var value = fields[0].internalName;
                                if (args.rowData.horizontalField) {
                                    var auxField = fields.find(e => e.internalName === args.rowData.horizontalField);
                                    value = (auxField) ? auxField.internalName : value;
                                }
                                var dropDown = new ej.dropdowns.DropDownList({
                                    dataSource: fields,
                                    fields: { value: 'internalName', text: 'name' },
                                    value: value,
                                    floatLabelType: 'Never'
                                });
                                dropDown.appendTo('#' + args.element.id);
                                var oldData = dynamicSeriesChartGridColumns.find(e => e.field === 'horizontalField').dataSource.dataSource.json;
                                for (var i = 0; i < fields.length; i++) {
                                    if (oldData.filter(e => e.internalName === fields[i].internalName).length === 0) {
                                        oldData.push(fields[i]);
                                    }
                                }
                                dynamicSeriesChartGridColumns.find(e => e.field === 'horizontalField').dataSource.dataSource.json = oldData;
                            })
                            .catch(function (args) { console.log(args); });
                    }
                }
            },
            { field: 'group', headerText: 'Grupo', visible: true, allowEditing: true },
            { field: 'labelVisible', headerText: 'Etiquetas', editType: 'booleanedit', displayAsCheckBox: true, allowEditing: true, textAlign: 'Center' },
            { field: 'visible', headerText: 'Visible', editType: 'booleanedit', displayAsCheckBox: true, allowEditing: true, textAlign: 'Center', defaultValue: true },
            { field: 'color', headerText: 'Color', edit: MVD.Dashboards.UI.createColorPickerTemplate('color'), allowEditing: true, textAlign: 'Center', defaultValue: '' }
        ]);
        var settings = {
            toolbar: ['Add', 'Edit', 'Update', 'Cancel', 'Delete'],
            locale: 'es',
            width: '100%',
            allowSorting: true,
            allowMultiSorting: true,
            allowFiltering: false,
            allowPaging: (extraSettings && extraSettings.dataSource && extraSettings.dataSource.length > 5) ? true : false,
            pageSettings: { pageSize: 5 },
            editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true },
            columns: columns,
            dataSource: [],
            rowDataBound: function (args) {
                var colorColumnIndex = ej.base.getComponent(document.getElementById(elementId), 'grid').columns.find(e => e.field === 'color').index;
                if (args.data.color) {
                    args.row.cells[colorColumnIndex].innerHTML = '';
                    var colorColumnIndex = ej.base.getComponent(document.getElementById(elementId), 'grid').columns.find(e => e.field === 'color').index;
                    args.row.cells[colorColumnIndex].innerHTML = "";
                    var cell = document.createElement('input');
                    cell.id = 'check';
                    cell.type = 'color';
                    args.row.cells[colorColumnIndex].appendChild(cell);
                    var colorObj = new ej.inputs.ColorPicker({
                        noColor: true,
                        value: args.data.color,
                        disabled: true,
                        cssClass: 'hideOpenColorPickerButton'
                    });
                    colorObj.appendTo(cell);
                } else {
                    args.row.cells[colorColumnIndex].innerHTML = 'Aleatorio';
                }
            },
            actionComplete: function (args) {
                if (args.requestType === 'add') {
                    args.rowData.id = Math.floor(Math.random() * 1000000);
                    args.rowData.isCreated = true;
                }
                else if (args.requestType === 'save' || args.requestType === 'delete') {
                    MVD.Dashboards.UI.refreshSortSeries(elementId);
                }
            },
            beforeDataBound: function (args) {
                MVD.Dashboards.dataBound = false;
            },
            dataBound: function (args) {
                if (!MVD.Dashboards.dataBound) {
                    this.autoFitColumns();
                    MVD.Dashboards.dataBound = true;
                }
            },
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSource = extraSettings.dataSource;
        }
        var grid = new ej.grids.Grid(settings);
        grid.appendTo('#' + elementId);
    }
    else if (elementId === 'resumeDataPivot') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div><div id="' + elementId + '"></div></div>';
        var settings = {
            dataSourceSettings: {
                enableSorting: true,
                valueSortSettings: { headerDelimiter: " - " },
                expandAll: false,
                allowMemberFilter: true,
                allowValueFilter: true,
                allowLabelFilter: true,
                dataSource: [],
            },
            height: 350,
            width: '100%',
            showFieldList: true,
            allowCalculatedField: true,
            locale: 'es',
            enginePopulated: function (args) {
                if (extraSettings && extraSettings.fields) {
                    var obj = this.engineModule.fieldList;
                    for (var key in obj) {
                        if (obj[key].aggregateType === 'CalculatedField') continue;
                        if (obj.hasOwnProperty(key)) {
                            let auxField = extraSettings.fields.find(e => e.internalName === obj[key].id);
                            if (auxField) obj[key].caption = auxField.name;
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
                settings.dataSourceSettings[key] = extraSettings.dataSourceSettings[key];
            }
        }
        var pivot = new ej.pivotview.PivotView(settings);
        pivot.appendTo('#' + elementId);
    }
    else if (elementId === 'parametersGrid') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div id="' + elementId + '"></div>';
        var settings = {
            toolbar: ['Edit', 'Update', 'Cancel'],
            locale: 'es',
            allowPaging: (extraSettings && extraSettings.dataSource && extraSettings.dataSource.length > 5) ? true : false,
            pageSettings: { pageSize: 5 },
            allowSorting: true,
            dataSource: [],
            sortSettings: { columns: [{ field: 'name', direction: 'Ascending' }] },
            columns: [
                { field: 'createdName', headerText: 'Nombre interno', allowEditing: false, isPrimaryKey: true, width: '30%' },
                { field: 'name', headerText: 'Nombre', allowEditing: true, width: '30%' },
                { field: 'required', headerText: 'Obligatorio', editType: 'booleanedit', allowEditing: false, displayAsCheckBox: true, width: '15%' },
                { field: 'visible', headerText: 'Visible', editType: 'booleanedit', allowEditing: true, displayAsCheckBox: true, width: '15%' },
            ],
            editSettings: { allowEditing: true, allowAdding: false, allowDeleting: false },
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSource = extraSettings.dataSource;
        }
        var grid = new ej.grids.Grid(settings);
        grid.appendTo('#' + elementId);
    }
    else if (elementId === 'grid') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div id="' + elementId + '"></div>';
        var settings = {
            locale: 'es',
            allowReordering: true,
            allowPaging: true,
            allowSorting: true,
            allowMultiSorting: true,
            allowGrouping: true,
            allowFiltering: true,
            filterSettings: { type: 'Excel' },
            pageSettings: { pageSizes: true, pageSize: 12 },
            showColumnChooser: true,
            height: '85%',
            width: '100%',
            toolbar: ['ColumnChooser'],
            columns: [],
            dataSource: [],
            showColumnMenu: false,
            columnMenuItems: ['Filter', { text: 'Formato', id: 'columnFormat' }],
            columnMenuClick: function (args) {
                if (args.item.id === 'columnFormat' && document.getElementById('columnFormatDialog') === null) {
                    let div = document.createElement('div');
                    div.id = 'columnFormatDialog';
                    document.body.appendChild(div);
                    let columnFormatDialogObj = new ej.popups.Dialog({
                        header: 'Formato de columna',
                        locale: 'es',
                        position: { X: 'center', Y: 'center' },
                        isModal: true,
                        visible: true,
                        showCloseIcon: true,
                        closeOnEscape: true,
                        buttons: [
                            {
                                'click': (args) => {
                                    debugger;
                                },
                                buttonModel: {
                                    content: 'Guardar',
                                    cssClass: 'e-success',
                                    iconCss: 'e-save e-icons',
                                    isPrimary: true
                                },
                                type: 'Button'
                            },
                            {
                                'click': (args) => {
                                    ej.base.getComponent(document.getElementById('columnFormatDialog'), 'dialog').hide();
                                },
                                buttonModel: {
                                    content: 'Cancelar',
                                    cssClass: 'e-warning',
                                    iconCss: 'e-cancel e-icons',
                                },
                                type: 'Button'
                            }
                        ],
                        content: '<input id="columnFormatSelect" />',
                        width: '330px',
                        target: document.getElementById('Grid'),
                        animationSettings: { effect: 'None' },
                        // open: dialogOpen,
                        close: function (dialogArgs) {
                            debugger;
                            document.getElementById('columnFormatDialog').remove();
                        },
                        beforeOpen: function (dialogArgs) {
                            debugger

                            let formatTypes = [
                                { format: 'n0', formatType: 'Número', value: '1,234' }, { format: 'n1', formatType: 'Número', value: '1,234.5' }, { format: 'n2', formatType: 'Número', value: '1,234.56' }, { format: 'n3', formatType: 'Número', value: '1,234.567' },
                                { format: 'n0', formatType: 'Número', value: '1' }, { format: 'n1', formatType: 'Número', value: '1.2' }, { format: 'n2', formatType: 'Número', value: '1.23' }, { format: 'n3', formatType: 'Número', value: '1.234' },
                                { format: '%', formatType: 'Porcentaje', value: '% sin multiplicar por 100' }, { format: 'p0', formatType: 'Porcentaje', value: '0%' }, { format: 'p1', formatType: 'Porcentaje', value: '0.1%' }, { format: 'p2', formatType: 'Porcentaje', value: '0.12%' }, { format: 'p3', formatType: 'Porcentaje', value: '0.123%' },
                                { format: '$#,###', formatType: 'Moneda', value: '$1,234' }, { format: '$#,###.#', formatType: 'Moneda', value: '$1,234.5' }, { format: '$#,###.##', formatType: 'Moneda', value: '$1,234.56' }, { format: '$#,###.###', formatType: 'Moneda', value: '$1,234.567' },
                                { format: 'M', formatType: 'Fecha', value: 'MM' }, { format: 'M/yy', formatType: 'Fecha', value: 'MM/YY' }, { format: 'M/yyyy', formatType: 'Fecha', value: 'MM/YYYY' },
                                { format: 'MMM', formatType: 'Fecha', value: 'MMM' }, { format: 'MMM/yy', formatType: 'Fecha', value: 'MMM/YY' }, { format: 'MMM/yyyy', formatType: 'Fecha', value: 'MMM/YYYY' },
                                { format: 'M/d/yy', formatType: 'Fecha', value: 'MM/DD/YY' }, { format: 'M/d/yyyy', formatType: 'Fecha', value: 'MM/DD/YYYY' }, { format: 'E', formatType: 'Fecha', value: 'ddd' },
                                { format: 'E MMM yyyy', formatType: 'Fecha', value: 'ddd MMM YYYY' }, { format: 'd/M/yy', formatType: 'Fecha', value: 'DD/MM/YY' }, { format: 'd/M/yyyy', formatType: 'Fecha', value: 'DD/MM/YYYY' }
                            ]
                            let columnFormatSelect = new ej.dropdowns.DropDownList({
                                placeholder: 'Formato de etiqueta del eje horizontal',
                                floatLabelType: 'Auto',
                                type: 'text',
                                locale: 'es',
                                fields: { groupBy: 'formatType', value: 'value' },
                                //dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes'].filter(e=> e.formatType !== 'Texto' &&  e.formatType !== (h)) ),
                                change: function (args) {
                                    if (args.isInteracted) {
                                        if (args.itemData.format === 'text') {
                                            ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').value = [];
                                            ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').enable(true);
                                            ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').disabled = false;
                                        } else {
                                            ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').value = ['xAxis'];
                                            ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').enable(false);
                                            ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').checked = false;
                                            ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').disabled = true;
                                        }
                                    }
                                }
                            });
                            horizontalLabelFormat.appendTo('#horizontalLabelFormat');


                        }
                    });
                    columnFormatDialogObj.appendTo('#columnFormatDialog');
                }
            },
            columnMenuOpen: function (args) {
                if (!['number', 'date'].includes(args.column.type)) {
                    let itemFormat = (args.items.find(
                        e => e.id === 'columnFormat'
                    ).hide = true);
                }
            },
            beforeDataBound: function (args) {
                MVD.Dashboards.dataBound = false;
            },
            dataBound: function (args) {
                if (!MVD.Dashboards.dataBound) {
                    this.autoFitColumns();
                    MVD.Dashboards.dataBound = true;
                }
            },
            actionComplete: function (args) {
                if (args.requestType === 'columnstate') {
                    this.autoFitColumns();
                }
            },
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSource = extraSettings.dataSource;
        }
        if (extraSettings && extraSettings.gridSettings) {
            for (var key in extraSettings.gridSettings) {
                if (key === 'columns') {
                    settings[key] = JSON.parse(JSON.stringify(extraSettings.gridSettings[key]));
                } else {
                    settings[key] = extraSettings.gridSettings[key];
                }
                if (elementId === 'gridDataDetails' && key === 'groupSettings') {
                    settings.allowGrouping = true;
                    settings[key].showDropArea = false;
                    settings[key].showUngroupButton = false;
                }
                else if (elementId === 'grid' && key === 'pageSettings') {
                    settings[key].pageSizes = true;
                }
            }
        }
        if (elementId === 'gridDataDetails') {
            delete settings.toolbar;
            delete settings.showColumnChooser;
            settings.height = '595px';
            settings.allowFiltering = true;
            settings.pageSettings.pageSizes = false;
            if (!settings.groupSettings) {
                settings.allowGrouping = false;
            }
        }

        var grid = new ej.grids.Grid(settings);
        grid.appendTo('#' + elementId);
    }
    else if (elementId === 'gridDetailsDataSettings') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div id="' + elementId + '"></div>';
        var height = (elementId === 'grid') ? '85%' : '460px';
        var settings = {
            locale: 'es',
            allowReordering: true,
            allowPaging: true,
            allowSorting: true,
            allowMultiSorting: true,
            allowGrouping: true,
            allowFiltering: true,
            filterSettings: { type: 'Excel' },
            pageSettings: { pageSizes: true, pageSize: 12 },
            showColumnChooser: true,
            height: height,
            width: '100%',
            toolbar: ['ColumnChooser'],
            columns: [],
            dataSource: [],
            showColumnMenu: true,
            columnMenuItems: ['Filter', { text: 'Formato', id: 'columnFormat' }],
            columnMenuClick: function (args) {
                if (args.item.id === 'columnFormat' && document.getElementById('columnFormatDialog') === null) {
                    let div = document.createElement('div');
                    div.id = 'columnFormatDialog';
                    document.body.appendChild(div);
                    let columnFormatDialogObj = new ej.popups.Dialog({
                        header: 'Formato de columna',
                        locale: 'es',
                        position: { X: 'center', Y: 'center' },
                        isModal: true,
                        visible: true,
                        showCloseIcon: true,
                        closeOnEscape: true,
                        buttons: [
                            {
                                'click': (args) => {
                                    debugger;
                                },
                                buttonModel: {
                                    content: 'Guardar',
                                    cssClass: 'e-success',
                                    iconCss: 'e-save e-icons',
                                    isPrimary: true
                                },
                                type: 'Button'
                            },
                            {
                                'click': (args) => {
                                    ej.base.getComponent(document.getElementById('columnFormatDialog'), 'dialog').hide();
                                },
                                buttonModel: {
                                    content: 'Cancelar',
                                    cssClass: 'e-warning',
                                    iconCss: 'e-cancel e-icons',
                                },
                                type: 'Button'
                            }
                        ],
                        content: '<input id="columnFormatSelect" />',
                        width: '330px',
                        target: document.getElementById('Grid'),
                        animationSettings: { effect: 'None' },
                        // open: dialogOpen,
                        close: function (dialogArgs) {
                            debugger;
                            document.getElementById('columnFormatDialog').remove();
                        },
                        beforeOpen: function (dialogArgs) {
                            debugger

                            let formatTypes = [
                                { format: 'n0', formatType: 'Número', value: '1,234' }, { format: 'n1', formatType: 'Número', value: '1,234.5' }, { format: 'n2', formatType: 'Número', value: '1,234.56' }, { format: 'n3', formatType: 'Número', value: '1,234.567' },
                                { format: 'n0', formatType: 'Número', value: '1' }, { format: 'n1', formatType: 'Número', value: '1.2' }, { format: 'n2', formatType: 'Número', value: '1.23' }, { format: 'n3', formatType: 'Número', value: '1.234' },
                                { format: '%', formatType: 'Porcentaje', value: '% sin multiplicar por 100' }, { format: 'p0', formatType: 'Porcentaje', value: '0%' }, { format: 'p1', formatType: 'Porcentaje', value: '0.1%' }, { format: 'p2', formatType: 'Porcentaje', value: '0.12%' }, { format: 'p3', formatType: 'Porcentaje', value: '0.123%' },
                                { format: '$#,###', formatType: 'Moneda', value: '$1,234' }, { format: '$#,###.#', formatType: 'Moneda', value: '$1,234.5' }, { format: '$#,###.##', formatType: 'Moneda', value: '$1,234.56' }, { format: '$#,###.###', formatType: 'Moneda', value: '$1,234.567' },
                                { format: 'M', formatType: 'Fecha', value: 'MM' }, { format: 'M/yy', formatType: 'Fecha', value: 'MM/YY' }, { format: 'M/yyyy', formatType: 'Fecha', value: 'MM/YYYY' },
                                { format: 'MMM', formatType: 'Fecha', value: 'MMM' }, { format: 'MMM/yy', formatType: 'Fecha', value: 'MMM/YY' }, { format: 'MMM/yyyy', formatType: 'Fecha', value: 'MMM/YYYY' },
                                { format: 'M/d/yy', formatType: 'Fecha', value: 'MM/DD/YY' }, { format: 'M/d/yyyy', formatType: 'Fecha', value: 'MM/DD/YYYY' }, { format: 'E', formatType: 'Fecha', value: 'ddd' },
                                { format: 'E MMM yyyy', formatType: 'Fecha', value: 'ddd MMM YYYY' }, { format: 'd/M/yy', formatType: 'Fecha', value: 'DD/MM/YY' }, { format: 'd/M/yyyy', formatType: 'Fecha', value: 'DD/MM/YYYY' }
                            ]
                            let columnFormatSelect = new ej.dropdowns.DropDownList({
                                placeholder: 'Formato de etiqueta del eje horizontal',
                                floatLabelType: 'Auto',
                                type: 'text',
                                locale: 'es',
                                fields: { groupBy: 'formatType', value: 'value' },
                                //dataSource: MVD.Dashboards.UI.controlsAuxDataConstants['formatTypes'].filter(e=> e.formatType !== 'Texto' &&  e.formatType !== (h)) ),
                                change: function (args) {
                                    if (args.isInteracted) {
                                        if (args.itemData.format === 'text') {
                                            ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').value = [];
                                            ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').enable(true);
                                            ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').disabled = false;
                                        } else {
                                            ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').value = ['xAxis'];
                                            ej.base.getComponent(document.getElementById('sortAxe'), 'multiselect').enable(false);
                                            ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').checked = false;
                                            ej.base.getComponent(document.getElementById('sortDecending'), 'checkbox').disabled = true;
                                        }
                                    }
                                }
                            });
                            horizontalLabelFormat.appendTo('#horizontalLabelFormat');


                        }
                    });
                    columnFormatDialogObj.appendTo('#columnFormatDialog');
                }
            },
            columnMenuOpen: function (args) {
                if (!['number', 'date'].includes(args.column.type)) {
                    let itemFormat = (args.items.find(
                        e => e.id === 'columnFormat'
                    ).hide = true);
                }
            },
            beforeDataBound: function (args) {
                MVD.Dashboards.dataBound = false;
            },
            dataBound: function (args) {
                if (!MVD.Dashboards.dataBound) {
                    this.autoFitColumns();
                    MVD.Dashboards.dataBound = true;
                }
            },
            actionComplete: function (args) {
                if (args.requestType === 'columnstate') {
                    this.autoFitColumns();
                }
            },
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSource = extraSettings.dataSource;
        }
        if (extraSettings && extraSettings.gridSettings) {
            for (var key in extraSettings.gridSettings) {
                if (key === 'columns') {
                    settings[key] = JSON.parse(JSON.stringify(extraSettings.gridSettings[key]));
                } else {
                    settings[key] = extraSettings.gridSettings[key];
                }
                if (elementId === 'gridDataDetails' && key === 'groupSettings') {
                    settings.allowGrouping = true;
                    settings[key].showDropArea = false;
                    settings[key].showUngroupButton = false;
                }
                else if (elementId === 'grid' && key === 'pageSettings') {
                    settings[key].pageSizes = true;
                }
            }
        }
        if (elementId === 'gridDataDetails') {
            delete settings.toolbar;
            delete settings.showColumnChooser;
            settings.height = '595px';
            settings.allowFiltering = true;
            settings.pageSettings.pageSizes = false;
            if (!settings.groupSettings) {
                settings.allowGrouping = false;
            }
        }

        var grid = new ej.grids.Grid(settings);
        grid.appendTo('#' + elementId);
    }
    else if (elementId === 'gridDataDetails') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div id="' + elementId + '"></div>';
        var settings = {
            locale: 'es',
            allowReordering: true,
            allowPaging: true,
            allowSorting: true,
            allowMultiSorting: true,
            allowGrouping: true,
            allowFiltering: true,
            filterSettings: { type: 'Excel' },
            pageSettings: { pageSizes: false, pageSize: 12 },

            height: '595px',
            width: '100%',

            columns: [],
            dataSource: [],
            groupSettings: {
                showDropArea: false,
                showUngroupButton: false,
            },
            beforeDataBound: function (args) {
                MVD.Dashboards.dataBound = false;
            },
            dataBound: function (args) {
                if (!MVD.Dashboards.dataBound) {
                    this.autoFitColumns();
                    MVD.Dashboards.dataBound = true;
                }
            },
            actionComplete: function (args) {
                if (args.requestType === 'columnstate') {
                    this.autoFitColumns();
                }
            },
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSource = extraSettings.dataSource;
        }
        if (extraSettings && extraSettings.gridSettings) {
            for (var key in extraSettings.gridSettings) {
                if (key === 'columns') {
                    settings[key] = JSON.parse(JSON.stringify(extraSettings.gridSettings[key]));
                } else {
                    settings[key] = extraSettings.gridSettings[key];
                }
            }
        }
        if (!settings.groupSettings) {
            settings.allowGrouping = false;
        }
        var grid = new ej.grids.Grid(settings);
        grid.appendTo('#' + elementId);
    }
    else if (elementId === 'pivot') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div><div id="' + elementId + '" class="notAlterRow"></div></div>';
        var settings = {
            showToolbar: true,
            toolbar: ['SubTotal', 'GrandTotal', 'ConditionalFormatting', 'NumberFormatting', 'FieldList'],
            allowExcelExport: true,
            allowPdfExport: true,
            allowCalculatedField: true,
            showFieldList: true,
            allowNumberFormatting: true,
            allowConditionalFormatting: true,
            allowDrillThrough: true,
            width: '100%',
            gridSettings: {
                columnWidth: 100,
                //allowReordering: true,
                allowResizing: true,
                //allowSelection: true,
                //selectionSettings: { type: 'Multiple' }
            },
            dataSourceSettings: {
                enableSorting: true,
                allowMemberFilter: true,
                allowValueFilter: true,
                allowLabelFilter: true,
                dataSource: [],
                expandAll: false
            },
            height: 450,
            locale: 'es',
            enginePopulated: function (args) {
                if (extraSettings && extraSettings.fields) {
                    var obj = this.engineModule.fieldList;
                    for (var key in obj) {
                        if (obj[key].aggregateType === 'CalculatedField') continue;
                        if (obj.hasOwnProperty(key)) {
                            let auxField = extraSettings.fields.find(e => e.internalName === obj[key].id);
                            if (auxField) obj[key].caption = auxField.name;
                        }
                    }
                }
            },
            numberFormatting: function (args) {
                console.log(args);
            },
            conditionalFormatting: function (args) {
                console.log(args);
            },
        };
        if (extraSettings && extraSettings.dataSource) {
            settings.dataSourceSettings.dataSource = extraSettings.dataSource;
        }
        if (extraSettings && extraSettings.dataSourceSettings) {
            for (var key in extraSettings.dataSourceSettings) {
                settings.dataSourceSettings[key] = extraSettings.dataSourceSettings[key];
            }
        }
        var pivot = new ej.pivotview.PivotView(settings);
        pivot.appendTo('#' + elementId);
    }
    else if (elementId === 'dashboardIndicatorPanelPreview') {
        document.getElementById(elementId + 'Wrapper').innerHTML = '<div style="margin-top: 1em; width: 100%" id="' + elementId + '"></div>';
        var settings = new ej.layouts.DashboardLayout({
            cellSpacing: [10, 10],
            columns: 6,
            cellAspectRatio: 100 / 30,
            allowResizing: false,
            allowDragging: false,
            allowFloating: false,
            resizeStop: function (args) {
                var grid = args.element.querySelector('div[id^="indicatorsPanelGrid"]');
                if (grid) {
                    var girdObj = ej.base.getComponent(grid, 'grid');
                    girdObj.element.style.height = '100%';
                    girdObj.element.style.width = '100%';
                    girdObj.refresh();
                }
            },
            panels: [{
                'id': 'panel_indicatorsPanelPreView',
                'sizeX': 6,
                'sizeY': 6,
                'row': 0,
                'col': 0,
                'content': '<div id="panelContent_indicatorsPanelPreView" style="overflow:hidden"></div><div id="panelSpinner_indicatorsPanelPreView" class="panelSpinner"></div>',
                'header': '<div id="panelTitle_indicatorsPanelPreView" class="panelTitleBorder">Título del panel de vista previa</div>'
            }]
        });
        var dashboardIndicatorPanelPreview = new ej.layouts.DashboardLayout(settings);
        dashboardIndicatorPanelPreview.appendTo('#' + elementId);
    }
};