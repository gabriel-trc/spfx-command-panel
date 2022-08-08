var MVD = MVD || {};
MVD.DataSources = MVD.DataSources || {};
MVD.DataSources.Indicator = MVD.DataSources.Indicator || {};

MVD.DataSources.Indicator.lastPlan = [];
MVD.DataSources.Indicator.lastPlanControlPoints = [];



MVD.DataSources.Indicator.getData = function (source, planName, panelParameters, controlPointPeriodToCalculate, indicatorPanel) {
    return new Promise(function (resolve, reject) {
        MVD.DataSources.Indicator.getPlansAndHistory(source.id)
            .then(function () {
                var indicator = MVD.DataSources.cacheIndicators.find(e => e.id == source.id);
                MVD.DataSources.Indicator.getPlanControlPoints(indicator, planName)
                    .then(function (args) {
                        MVD.DataSources.Indicator.getPlanControlPointsValues(args.indicator, args.plan, panelParameters, controlPointPeriodToCalculate, indicatorPanel)
                            .then(function (args) {
                                MVD.DataSources.Indicator.processControlPointsData(args.indicator, args.plan, panelParameters, args.controlPoints, indicatorPanel)
                                    .then(function (args) { resolve(args); })
                                    .catch(function (args) { reject(args); });
                            })
                            .catch(function (args) { reject(args); });
                    })
                    .catch(function (args) { reject(args); });
            })
            .catch(function (args) { reject(args); });
    });
};

MVD.DataSources.Indicator.getDetailData = function (source, row, columName, panelParameters) {
    var indicator = MVD.DataSources.cacheIndicators.find(e => e.id == source.id);
    var plan = indicator.plans.find(e => e.Title == source.typeSettings.planName);
    var data = [];
    var controlPointsToRender = plan.ControlPoints;
    if (plan.ControlPointsFilterCheckbox && plan.ControlPointsFilter) {
        var parameterValue = 'General';
        var parameter;
        if (panelParameters) {
            parameter = panelParameters.find(e => e.field === plan.ControlPointsFilter);
        }
        if (typeof parameter !== 'undefined' && typeof parameter.value !== 'undefined' && parameter.value !== null) {
            parameterValue = Array.isArray(parameter.value) ? parameter.value[0] : parameter.value;
        } else if (typeof parameter !== 'undefined' && typeof parameter.defaultValue !== 'undefined' && parameter.defaultValue !== null) {
            parameterValue = Array.isArray(parameter.defaultValue) ? parameter.defaultValue[0] : parameter.defaultValue;
        }
        controlPointsToRender = plan.ControlPoints.filter(e => e.FilterValue === parameterValue);
    }
    if (!row && !columName) {
        for (var i = 0; i < controlPointsToRender.length; i++) {
            data = data.concat(controlPointsToRender[i].Values);
        }
    } else {
        for (var j = 0; j < controlPointsToRender.length; j++) {
            if (row.Date === 'YTD') {
                for (var l = 0; l < controlPointsToRender.length; l++) {
                    data = data.concat(controlPointsToRender[l].Values);
                }
                break;
            }
            else {
                if (moment(controlPointsToRender[j].DateFrom).locale('es').format(indicator.dateFormat) !== row.Date) continue;
                if (columName === 'Value') {
                    data = data.concat(controlPointsToRender[j].Values);
                    break;
                } else if (columName === 'AccumulatedValue') {
                    for (var k = 0; k < j + 1; k++) {
                        data = data.concat(controlPointsToRender[k].Values);
                    }
                    break;
                } else {
                    data = [];
                }
            }
        }
    }
    return data;
};

MVD.DataSources.Indicator.getFields = function (source) {
    return new Promise(function (resolve, reject) {
        MVD.DataSources.Indicator.getPlansAndHistory(source.id)
            .then(function () {
                var indicator = MVD.DataSources.cacheIndicators.find(e => e.id == source.id);
                if (indicator.plans.length === 0) {
                    reject({ msg: 'El indicador no puede ser seleccionado ya que no contiene ningún plan.', });
                } else {
                    var fields = [];
                    fields.push({ internalName: 'Date', name: 'Fecha', type: 'NotNumber' });
                    fields.push({ internalName: 'Value', name: 'Valor', type: 'Number' });
                    if (indicator.isCumulative) {
                        fields.push({ internalName: 'YearAccumulatedValue', name: 'YTD', type: 'Number' });
                        fields.push({ internalName: 'AccumulatedValue', name: 'Valor acumulado', type: 'Number' });
                    }
                    fields.push({ internalName: 'PredictedValue', name: 'Valor meta', type: 'Number' });
                    if (indicator.history.length > 0) {
                        fields.push({ internalName: 'History', name: 'Valor histórico', type: 'Number' });
                    }
                    resolve({ fields: fields, dynamicFields: [] });
                }
            })
            .catch(function (args) { reject(args); });
    });
};

MVD.DataSources.Indicator.getAllScalesValues = function () {
    return new Promise(function (resolve, reject) {
        MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.webServerRelativeUrl, '/Lists/ScalesValues', '', '', true)
            .then(async function (items) {
                let scalesValuesFields = await MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, '/Lists/ScalesValues');
                MVD.DataSources.Indicator.scalesValues = MVD.SPHelpers.ListItems.getItemsFromQuery(items, scalesValuesFields);
                MVD.DataSources.Indicator.scalesValues.forEach(function (e) {
                    try {
                        e.IconUrl = e.Attachments[0].url    
                    } catch (error) {

                    }
                })
                resolve();
            })
            .catch(function (error) { reject(error) });
    });
};

MVD.DataSources.Indicator.getScaleDefaultRange = function (idScale) {
    var scaleToRender = MVD.DataSources.Indicator.scalesValues.filter(e => e.Scale_Lookups.id === idScale);
    var str = '';
    for (var i = scaleToRender.length - 1; i >= 0; i--) {
        var sig = '-';
        if (i !== 0) {
            str += scaleToRender[i - 1].ColorValue + sig + scaleToRender[i].Title + ';';
        } else {
            str += scaleToRender[i].Title + ';';
        }
    }
    str = str.substring(0, str.length - 1);
    return str;
}

MVD.DataSources.Indicator.processControlPointsData = function (indicator, plan, panelParameters, controlPoints, indicatorPanel) {
    return new Promise(function (resolve, reject) {
        if (controlPoints.length === 0) {
            reject({ msg: 'El plan ' + plan.Title + ' del indicador ' + indicator.title + ' no tiene ningún punto de control.' });
        }
        else {
            var scalesValues = MVD.DataSources.Indicator.scalesValues.filter(e => e.Scale_SPData.value === plan.Scale_SPData.value);
            var expressionsArrayValues = getExpressionsArray(plan, plan.ValueField, plan.ValueFieldType);
            expressionsArrayValues = expressionsArrayValues.filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });
            var expressionsArrayPredictedValues = getExpressionsArray(plan, 'TargetValue', 'Simple');
            expressionsArrayPredictedValues = expressionsArrayPredictedValues.filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });
            var data = [];
            if (indicatorPanel) indicator.dateFormat = 'MMM';
            if (plan.ControlPointsFilterCheckbox && plan.ControlPointsFilter) {
                var parameterValue = 'General';
                var parameter;
                if (panelParameters) parameter = panelParameters.find(e => e.field === plan.ControlPointsFilter);
                if (typeof parameter !== 'undefined' && typeof parameter.value !== 'undefined' && parameter.value !== null) {
                    parameterValue = Array.isArray(parameter.value) ? parameter.value[0] : parameter.value;
                } else if (typeof parameter !== 'undefined' && typeof parameter.defaultValue !== 'undefined' && parameter.defaultValue !== null) {
                    parameterValue = Array.isArray(parameter.defaultValue) ? parameter.defaultValue[0] : parameter.defaultValue;
                }
                controlPoints = controlPoints.filter(e => e.FilterValue === parameterValue);
                data = getHistory(indicator, plan, parameterValue);
            }
            else {
                data = getHistory(indicator, plan);
            }
            if (indicator.isCumulative) {
                data.push({
                    'Date': 'YTD'
                });
            }

            for (var i = 0; i < controlPoints.length; i++) {
                var date = (plan.ControlPointsPeriods === '1' || !plan.ControlPointsPeriods) ? controlPoints[i].DateFrom : controlPoints[i].DateTo;
                if (plan.ControlPointsPeriods === '1' && controlPoints.length !== 12) date = controlPoints[i].DateTo;
                var auxRow = { 'Date': moment(date).locale('es').format(indicator.dateFormat) };
                var controlPointValue = getEvaluateExpressions(controlPoints[i].Values, expressionsArrayValues, plan);
                var controlPointAccumulatedValue = getEvaluateExpressions(getPointsValuesToEvaluate(controlPoints, i), expressionsArrayValues, plan);
                var formulaToEvalControlPointValue = (plan.ValueFieldType === 'Simple') ? getFieldSimpleTypeFormula(plan.AggregateFunction, plan.ValueField) : plan.Formula;
                var formulaToEvalControlPointAccumulatedValue = (plan.ValueFieldType === 'Simple') ? getFieldSimpleTypeFormula(plan.AggregateFunction, plan.ValueField) : plan.Formula;
                for (var k = 0; k < expressionsArrayValues.length; k++) {
                    var escapedKeyExp = expressionsArrayValues[k].replace(/(?=[()])/g, '\\');
                    formulaToEvalControlPointValue = formulaToEvalControlPointValue.replace(new RegExp(escapedKeyExp, 'g'), controlPointValue[expressionsArrayValues[k]]);
                    formulaToEvalControlPointAccumulatedValue = formulaToEvalControlPointAccumulatedValue.replace(new RegExp(escapedKeyExp, 'g'), controlPointAccumulatedValue[expressionsArrayValues[k]]);
                }

                auxRow.Value = eval(formulaToEvalControlPointValue);
                if (!Number.isFinite(auxRow.Value)) auxRow.Value = null;
                if (indicator.isCumulative && Number.isFinite(auxRow.Value)) {
                    auxRow.AccumulatedValue = eval(formulaToEvalControlPointAccumulatedValue);
                }
                if (Number.isFinite(controlPoints[i].TargetValue)) {
                    auxRow.PredictedAccumulatedValue = Enumerable.from(getPointsPredictedValuesToEvaluate(controlPoints, i)).sum(e => e['TargetValue']);
                    auxRow.PredictedValue = controlPoints[i].TargetValue;
                    if (Number.isFinite(auxRow.Value)) {
                        getDeviationsValues(auxRow, plan, indicator.numberFormatDeviations, scalesValues);
                    }
                }
                else {
                    auxRow.PredictedValue = null;
                }
                data.push(auxRow);
            }
            if (indicator.isCumulative) {
                var row = data.find(e => e.Date === 'YTD');
                for (var i = data.length - 1; i >= 0; i--) {
                    if (typeof data[i].AccumulatedValue !== 'undefined' && typeof row.YearAccumulatedValue === 'undefined') {
                        row.YearAccumulatedValue = data[i].AccumulatedValue;
                    }
                    if (typeof data[i].DeviationAccumulatedValue !== 'undefined' && typeof row.YearAccumulatedDeviationValue === 'undefined') {
                        row.YearAccumulatedDeviationValue = data[i].DeviationAccumulatedValue;
                    }
                    if (typeof data[i].PredictedAccumulatedValue !== 'undefined' && typeof row.YearAccumulatedPredictedValue === 'undefined') {
                        row.YearAccumulatedPredictedValue = data[i].PredictedAccumulatedValue;
                    }
                }
            }
            resolve(data);
        }
    });

    function getDeviationsValues(rowData, plan, numberFormatDeviations, scalesValues) {
        rowData.DeviationAbsolute = rowData.Value - rowData.PredictedValue;
        rowData.DeviationPercentage = ((rowData.Value - rowData.PredictedValue) / rowData.PredictedValue) * 100;
        rowData.DeviationAbsoluteInverted = -(rowData.DeviationAbsolute);
        rowData.DeviationPercentageInverted = -(rowData.DeviationPercentage);

        rowData.DeviationAbsoluteAccumulatedValue = rowData.AccumulatedValue - rowData.PredictedAccumulatedValue;
        rowData.DeviationPercentageAccumulatedValue = ((rowData.AccumulatedValue - rowData.PredictedAccumulatedValue) / rowData.PredictedAccumulatedValue) * 100;
        rowData.DeviationAbsoluteAccumulatedValueInverted = -(rowData.DeviationAbsoluteAccumulatedValue);
        rowData.DeviationPercentageAccumulatedValueInverted = -(rowData.DeviationPercentageAccumulatedValue);

        if (plan.DeviationType === 'Absoluto') {
            rowData.DeviationValue = (plan.InvertDeviation) ? rowData.DeviationAbsoluteInverted : rowData.DeviationAbsolute;
            rowData.DeviationAccumulatedValue = (plan.InvertDeviation) ? rowData.DeviationAbsoluteAccumulatedValueInverted : rowData.DeviationAbsoluteAccumulatedValue;
        } else {
            rowData.DeviationValue = (plan.InvertDeviation) ? rowData.DeviationPercentageInverted : rowData.DeviationPercentage;
            rowData.DeviationAccumulatedValue = (plan.InvertDeviation) ? rowData.DeviationPercentageAccumulatedValueInverted : rowData.DeviationPercentageAccumulatedValue;
        }
        rowData.Scale = getScale(rowData.DeviationValue, plan.Scales.split(';'), scalesValues);
        if (rowData.Scale) rowData.ColorValue = rowData.Scale.ColorValue;
    };
    function getHistory(indicator, plan, parameterValue) {
        var aux = [];
        var year = plan.ControlPoints[0].DateFrom.getUTCFullYear()
        for (var i = 0; i < indicator.history.length; i++) {
            if (indicator.history[i].title > plan.Title) continue;
            if (plan.ControlPointsFilterCheckbox && plan.ControlPointsFilter) {
                if (indicator.history[i].title < year && parameterValue === indicator.history[i].filterValue) {
                    aux.push({ 'Date': indicator.history[i].title, 'History': indicator.history[i].value });
                }
            } else {
                aux.push({ 'Date': indicator.history[i].title, 'History': indicator.history[i].value });
            }
        }
        return (aux.length > 3) ? aux.slice(aux.length - 3, aux.length) : aux;
    }
    function getPointsValuesToEvaluate(controlPoints, index) {
        var points = [];
        for (var i = 0; i <= index; i++) {
            points = points.concat(controlPoints[i].Values);
        }
        return points;
    }
    function getPointsPredictedValuesToEvaluate(controlPoints, index) {
        var points = [];
        for (var i = 0; i <= index; i++) {
            points = points.concat(controlPoints[i]);
        }
        return points;
    }
    function getFieldSimpleTypeFormula(aggregateFunction, valueField) {
        let auxFormula = "'Sum(" + valueField + ")'";
        switch (aggregateFunction) {
            case 'Máximo':
                auxFormula = "'Max(" + valueField + ")'";
                break;
            case 'Mínimo':
                auxFormula = "'Min(" + valueField + ")'";
                break;
            case 'Promedio':
                auxFormula = "'Avg(" + valueField + ")'";
                break;
            case 'Primero':
                auxFormula = "'First(" + valueField + ")'";
                break;
            case 'Último':
                auxFormula = "'Last(" + valueField + ")'";
                break;
            case 'Mediana':
                auxFormula = "'Med(" + valueField + ")'";
                break;
            case 'Desviación Estándar Muestral':
                auxFormula = "'DEM(" + valueField + ")'";
                break;
            case 'Desviación Estándar Poblacional':
                auxFormula = "'DEP(" + valueField + ")'";
                break;
            case 'Varianza Muestral':
                auxFormula = "'VarM(" + valueField + ")'";
                break;
            case 'Varianza Poblacional':
                auxFormula = "'VarP(" + valueField + ")'";
                break;
        }
        return auxFormula;
    }
    function getExpressionsArray(plan, valueField, valueFieldType) {
        if (valueFieldType === 'Simple') {
            var auxFormula = getFieldSimpleTypeFormula(plan.AggregateFunction, valueField);
            return auxFormula.match(/'.*?'/g);
        } else {
            return plan.Formula.match(/'.*?'/g);
        }
    }
    function getEvaluateExpressions(values, exp, plan) {
        var evaluatedExp = {};
        var enumerable = Enumerable.from(values);
        for (var i = 0; i < exp.length; i++) {
            var keyField = exp[i].match(/\(.*?\)/g);
            if (!keyField) {
                keyField = 'Value';
                if (exp[i].includes('*')) {
                    keyField = 'DeviationAbsolute';
                }
                else if (exp[i].includes('%')) {
                    keyField = 'DeviationPercentage';
                }
            }
            else {
                keyField = keyField[0].substring(1, keyField[0].length - 1);
            }
            try {
                if (exp[i].toLowerCase().startsWith("'sum")) {
                    let nonZeroValues = enumerable.where(e => Number.isFinite(e[keyField]));
                    evaluatedExp[exp[i]] = (nonZeroValues.count() === 0) ? null : nonZeroValues.sum(e => e[keyField]);
                }
                else if (exp[i].toLowerCase().startsWith("'avg")) {
                    evaluatedExp[exp[i]] = enumerable.where(e => Number.isFinite(e[keyField])).average(e => e[keyField]);
                }
                else if (exp[i].toLowerCase().startsWith("'min")) {
                    evaluatedExp[exp[i]] = enumerable.where(e => Number.isFinite(e[keyField])).min(e => e[keyField]);
                }
                else if (exp[i].toLowerCase().startsWith("'max")) {
                    evaluatedExp[exp[i]] = enumerable.where(e => Number.isFinite(e[keyField])).max(e => e[keyField]);
                }
                else if (exp[i].toLowerCase().startsWith("'count")) {
                    evaluatedExp[exp[i]] = enumerable.where(e => Number.isFinite(e[keyField])).count();
                }
                else if (exp[i].toLowerCase().startsWith("'distinctcount")) {
                    evaluatedExp[exp[i]] = enumerable.where(e => Number.isFinite(e[keyField])).distinct(e => e[keyField]).count();
                }
                else if (exp[i].toLowerCase().startsWith("'first")) {
                    let first = enumerable.where(e => Number.isFinite(e[keyField])).firstOrDefault(e => Number.isFinite(e[keyField]), null);
                    evaluatedExp[exp[i]] = (first) ? first[keyField] : null;
                }
                else if (exp[i].toLowerCase().startsWith("'last")) {
                    let last = enumerable.where(e => Number.isFinite(e[keyField])).lastOrDefault(e => Number.isFinite(e[keyField]), null);
                    evaluatedExp[exp[i]] = evaluatedExp[exp[i]] = (last) ? last[keyField] : null;
                }
                else if (exp[i].toLowerCase().startsWith("'med")) {
                    evaluatedExp[exp[i]] = MVD.DataSources.Pivot.calcMedian(enumerable, keyField);
                }
                else if (exp[i].toLowerCase().startsWith("'dem")) {
                    evaluatedExp[exp[i]] = MVD.DataSources.Pivot.calcSampleStDev(enumerable, keyField);
                }
                else if (exp[i].toLowerCase().startsWith("'dep")) {
                    evaluatedExp[exp[i]] = MVD.DataSources.Pivot.calcPopulationStDev(enumerable, keyField);
                }
                else if (exp[i].toLowerCase().startsWith("'varm")) {
                    evaluatedExp[exp[i]] = MVD.DataSources.Pivot.calcSampleVar(enumerable, keyField);
                }
                else if (exp[i].toLowerCase().startsWith("'varp")) {
                    evaluatedExp[exp[i]] = MVD.DataSources.Pivot.calcPopulationVar(enumerable, keyField);
                }
                else {
                    var indicatorID = exp[i].replace(/[']+/g, '');
                    if (indicatorID.includes('*') || indicatorID.includes('%')) {
                        indicatorID = indicatorID.substring(0, indicatorID.length - 1);
                    }
                    var controlPointIndicatorValue = values.filter(e => e.IndicatorID == indicatorID);
                    if (controlPointIndicatorValue.length > 0) {
                        evaluatedExp[exp[i]] = controlPointIndicatorValue[controlPointIndicatorValue.length - 1][keyField];
                    }
                }
            }
            catch (e) {
                evaluatedExp[exp[i]] = null;
                console.error(e);
            }
        }
        return evaluatedExp;
    }
    function getScale(value, scales, scalesValues) {
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
        return scalesValues.find(e => e.Title === colorToFind);
    }
};

MVD.DataSources.Indicator.getPlansAndHistory = function (indicatorId) {
    return new Promise(function (resolve, reject) {
        var indicator = MVD.DataSources.cacheIndicators.find(e => e.id == indicatorId);
        if (typeof indicator['promisePlans'] !== "undefined") {
            resolve(indicator['promisePlans']);
        } else if (typeof indicator['promisePlans'] === "undefined") {
            indicator['promisePlans'] = auxPromise(indicator);
            resolve(indicator['promisePlans']);
        }
    });
    function auxPromise(indicator) {
        return new Promise(function (resolve, reject) {
            var lists = [];
            lists.push({
                listUrl: '/Lists/IndicatorsPlans',
                includes: '',
                queryText: '<View><Query><Where><Eq><FieldRef Name="Indicator" LookupId="True" /><Value Type="Lookup">' + indicatorId + '</Value></Eq></Where>' +
                    '<OrderBy><FieldRef Name="Title" Ascending="FALSE" /></OrderBy></Query></View>'
            });
            lists.push({
                listUrl: '/Lists/IndicatorsHistory',
                includes: '',
                queryText: '<View><Query><Where><Eq><FieldRef Name="Indicator" LookupId="True" /><Value Type="Lookup">' + indicatorId + '</Value></Eq></Where>' +
                    '<OrderBy><FieldRef Name="Title" Ascending="TRUE" /></OrderBy></Query></View>'
            });
            MVD.SPHelpers.ListItems.getListItemsMultiple(new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl), lists)
                .then(async function (args) {
                    let indicatorsPlansFields = await MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, '/lists/indicatorsplans');
                    indicator.plans = MVD.SPHelpers.ListItems.getItemsFromQuery(args[0].items, indicatorsPlansFields, null, true);
                    var history = args[1].items;
                    if (history && history.get_count() > 0) {
                        var enumerator = history.getEnumerator();
                        while (enumerator.moveNext()) {
                            var listItem = enumerator.get_current();
                            var aux = {};
                            aux.id = listItem.get_item('ID');
                            aux.title = listItem.get_item('Title');
                            aux.value = listItem.get_item('Value');
                            aux.filterValue = listItem.get_item('FilterValue');
                            indicator.history.push(aux);
                        }
                    }
                    var hasPlanWhitIndicatorChilds = indicator.plans.filter(e => e.DataSourceType === 'Cálculo en base a otros indicadores');
                    if (hasPlanWhitIndicatorChilds.length > 0) {
                        MVD.DataSources.Indicator.getPlansOfIndicatorChilds(indicator)
                            .then(function (args) {
                                resolve();
                            })
                            .catch(function (args) {
                                reject({ error: args, msg: 'Error al obtener los planes del indicador.' });
                            });
                    } else {
                        resolve();
                    }
                }, function (args) {
                    reject({ error: args, msg: 'Error al obtener los planes del indicador.' });
                });
        });
    }
};

MVD.DataSources.Indicator.getPlansOfIndicatorChilds = function (indicator) {
    return new Promise(function (resolve, reject) {
        var indicatorChildsPlanPromises = [];
        for (var i = 0; i < indicator.plans.length; i++) {
            if (indicator.plans[i].DataSourceType === 'Cálculo en base a otros indicadores') {
                indicator.plans[i].IndicatorsChilds_Lookups.forEach(e => indicatorChildsPlanPromises.push(MVD.DataSources.Indicator.getPlansAndHistory(e.id)));
            }
        }
        Promise.all(indicatorChildsPlanPromises)
            .then(function () {
                resolve(indicator);
                //var indicatorPlanControlPointPromises = [];
                //for (var i = 0; i < indicator.plans.length; i++) {
                //    if (indicator.plans[i].DataSourceType === 'Cálculo en base a otros indicadores') {
                //        indicatorPlanControlPointPromises.push(MVD.DataSources.Indicator.getPlanControlPoints(indicator, indicator.plans[i].Title));
                //    }
                //}
                //Promise.all(indicatorPlanControlPointPromises)
                //    .then(function () {
                //        var auxPromises = [];
                //        for (var i = 0; i < indicator.plans.length; i++) {
                //            if (indicator.plans[i].DataSourceType === 'Cálculo en base a otros indicadores') {
                //                auxPromises.push(auxGetPlansOfIndicatorChilds(indicator.plans[i]));
                //            }
                //        }
                //        Promise.all(auxPromises)
                //           .then(function () {
                //               resolve(indicator);
                //           })
                //           .catch(function (args) {
                //               reject(args);
                //           });
                //    })
                //    .catch(function (args) {
                //        reject(args);
                //    });
            })
            .catch(function (args) {
                reject(args);
            });
    });

    function auxGetPlansOfIndicatorChilds(plan) {
        return new Promise(function (resolve, reject) {
            var indicatorsChilds = [];
            plan.IndicatorsChilds_Lookups.forEach(e => indicatorsChilds.push(MVD.DataSources.cacheIndicators.find(i => i.id == e.id)));
            var dateFrom = moment(plan.ControlPoints[0].DateFrom).toISOString(true);
            var dateTo = moment(plan.ControlPoints[plan.ControlPoints.length - 1].DateTo).toISOString(true);
            /*var query = indicatorsChilds.reduce(function (accu, ind) {
                var plansQuery = ind.plans.reduce(function (accumuladorQuery, plan) {
                    var auxPlanQuery =
                        '<Or>' +
                            '<And>' +
                                '<And>' +
                                    '<Or>' +
                                        '<Eq><FieldRef Name="FilterValue" /><Value Type="Text">General</Value></Eq>' +
                                        '<IsNull><FieldRef Name="FilterValue"></FieldRef></IsNull>' +
                                    '</Or>' +
                                    '<Eq><FieldRef Name="IndicatorPlan" LookupId="True" /><Value Type="Lookup">' + plan.ID + '</Value></Eq>' +
                                '</And>' +
                                '<Geq><FieldRef Name="DateFrom" /><Value Type="DateTime" >' + dateFrom + '</Value></Geq>' +
                            '</And>' +
                            '<Leq><FieldRef Name="DateTo" /><Value Type="DateTime" >' + dateTo + '</Value></Leq>' +
                        '</Or>';
                    if (accumuladorQuery !== '') {
                        accumuladorQuery = '<Or>' + accumuladorQuery + auxPlanQuery + '</Or>';
                    } else {
                        accumuladorQuery = auxPlanQuery;
                    }
                    return accumuladorQuery;
                }, '');
                if (accu !== '') {
                    accu = '<Or>' + accu + plansQuery + '</Or>';
                } else {
                    accu = plansQuery;
                }
                return accu;
            }, '');*/
            var query = indicatorsChilds.reduce(function (accu, ind) {
                var plansQuery = ind.plans.reduce(function (accumuladorQuery, plan) {
                    var auxPlanQuery =
                        '<Or>' +
                        '<And>' +
                        '<And>' +
                        '<Or>' +
                        '<Eq><FieldRef Name="FilterValue" /><Value Type="Text">General</Value></Eq>' +
                        '<IsNull><FieldRef Name="FilterValue"></FieldRef></IsNull>' +
                        '</Or>' +
                        '<Eq><FieldRef Name="IndicatorPlan" LookupId="True" /><Value Type="Lookup">' + plan.ID + '</Value></Eq>' +
                        '</And>' +
                        '<Geq><FieldRef Name="DateFrom" /><Value Type="DateTime" >' + dateFrom + '</Value></Geq>' +
                        '</And>' +
                        '<Leq><FieldRef Name="DateTo" /><Value Type="DateTime" >' + dateTo + '</Value></Leq>' +
                        '</Or>';
                    if (accumuladorQuery !== '') {
                        accumuladorQuery = '<Or>' + accumuladorQuery + auxPlanQuery + '</Or>';
                    } else {
                        accumuladorQuery = auxPlanQuery;
                    }
                    return accumuladorQuery;
                }, '');
                if (accu !== '') {
                    accu = '<Or>' + accu + plansQuery + '</Or>';
                } else {
                    accu = plansQuery;
                }
                return accu;
            }, '');
            if (query !== '') {
                query = '<View><Query><Where>' + query + '</Where></Query></View>';
            }
            MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.webServerRelativeUrl, '/Lists/IndicatorsValues', query, async function (items) {
                let indicatorsValuesFields = await MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, '/lists/indicatorsvalues');
                var aux = MVD.SPHelpers.ListItems.getItemsFromQuery(items, indicatorsValuesFields, null, true);
                plan.IndicatorChildPlans = Enumerable.from(aux).distinct(function (e) { return e.IndicatorPlan_Lookups.id }).select(function (e) { return e.IndicatorPlan_Lookups.id }).toArray();
                resolve();
            }, function (args) {
                reject({ error: args, msg: 'Error al obtener los puntos de control del indicador.' });
            }, null, null);
        });
    }
};

MVD.DataSources.Indicator.getPlanControlPoints = function (indicator, planName) {
    return new Promise(function (resolve, reject) {
        var plan = indicator.plans.find(e => e.Title == planName);
        if (typeof plan === 'undefined') {
            reject({ msg: 'No hay plan ' + planName + ' en el indicador ' + indicator.title });
        }
        if (typeof plan.ControlPoints !== 'undefined') {
            resolve({ indicator: indicator, plan: plan });
        } else {
            var query = '<View><Query><Where><Eq><FieldRef Name="IndicatorPlan" LookupId="True" /><Value Type="Lookup">' + plan.ID + '</Value></Eq></Where>' +
                '<OrderBy><FieldRef Name="DateFrom" /></OrderBy></Query></View>';
            MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.webServerRelativeUrl, '/lists/indicatorsvalues', query)
                .then(async function (items) {
                    let indicatorsValuesFields = await MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, '/lists/indicatorsvalues');
                    plan.ControlPoints = MVD.SPHelpers.ListItems.getItemsFromQuery(items, indicatorsValuesFields);
                    resolve({ indicator: indicator, plan: plan });
                })
                .catch(function (error) {
                    reject({ error: args, msg: 'Error al obtener los puntos de control del indicador.' });
                });
        }
    });
};

MVD.DataSources.Indicator.getPlanControlPointsValues = function (indicator, plan, panelParameters, controlPointPeriodToCalculate, indicatorPanel) {
    return new Promise(function (resolve, reject) {
        if (plan.DataSourceType === 'Fuente de datos') {
            var auxSource = MVD.DataSources.cacheDataSources.find(e => e.title == plan.MVDDataSource);
            MVD.DataSources.getSourceData(auxSource, panelParameters)
                .then(function (data) {
                    var controlPoints = getControlPointValuesFromData(plan, data, controlPointPeriodToCalculate);
                    resolve({ indicator: indicator, plan: plan, controlPoints: controlPoints });
                })
                .catch(function (args) {
                    reject(args);
                });
        }
        else if (plan.DataSourceType === 'Cálculo en base a otros indicadores') {
            if (plan.ControlPoints.length === 0) {
                reject({ msg: 'El plan ' + plan.Title + ' del indicador ' + indicator.title + ' no tiene ningún punto de control.' });
                return;
            }
            var indicatorsChilds = [];
            var indicatorSourceMasks = [];
            plan.IndicatorsChilds_SPData.value.forEach(e => indicatorsChilds.push(MVD.DataSources.cacheIndicators.find(i => i.id == e.id)));
            var indicatorChildsPlanDataPromises = [];
            indicatorsChilds.forEach(function (ind) {
                //var auxPlan = ind.plans.find(e => plan.IndicatorChildPlans.includes(e.ID));
                var auxPlan = ind.plans.find(e => e.Title == plan.Title);
                if (auxPlan) {
                    var auxSource = MVD.DataSources.Indicator.getSourceMask(ind.id, auxPlan.Title);
                    indicatorChildsPlanDataPromises.push(MVD.DataSources.Indicator.getData(auxSource, auxPlan.Title, panelParameters, plan.ControlPointsPeriods, indicatorPanel));
                    indicatorSourceMasks.push(auxSource);
                } else {
                    MVD.SyncfusionUtilities.showToast('El indicador hijo ' + ind.title + ' no tiene plan ' + plan.Title);
                }
            });
            Promise.all(indicatorChildsPlanDataPromises)
                .then(function (args) {
                    for (var j = 0; j < args.length; j++) {
                        args[j].forEach(e => e.IndicatorID = indicatorSourceMasks[j].id);
                        // MVD.DataSources.Indicator.calculateOtherValuesTypes(args[j], indicatorSourceMasks[j], true);
                    }
                    var aux = 1;
                    var controlPoints = plan.ControlPoints;
                    if (controlPointPeriodToCalculate && controlPointPeriodToCalculate != plan.ControlPointsPeriods) {
                        controlPoints = MVD.DataSources.Indicator.transformChildPeriodInParentPeriod(controlPoints, controlPointPeriodToCalculate);
                    }
                    for (var i = controlPoints.length - 1; i >= 0; i--) {
                        var values = args.reduce(function (accumulator, data) {
                            accumulator.push(data[data.length - aux]);
                            return accumulator;
                        }, []);
                        aux++;
                        controlPoints[i].Values = (values) ? values : [];
                    }
                    resolve({ indicator: indicator, plan: plan, controlPoints: controlPoints });
                })
                .catch(function (args) {
                    reject(args);
                });
        }
        else if (plan.DataSourceType === 'Datos manuales') {
            var controlPoints = plan.ControlPoints;
            controlPoints.forEach(e => e.Values = [{ Value: e.RealValue }]);
            if (controlPointPeriodToCalculate && controlPointPeriodToCalculate != plan.ControlPointsPeriods) {
                controlPoints = MVD.DataSources.Indicator.transformChildPeriodInParentPeriod(controlPoints, controlPointPeriodToCalculate, true);
            }
            //for (var i = 0; i < controlPoints.length; i++) {
            //    controlPoints[i].Values = [{ Value: controlPoints[i].RealValue }];
            //}
            resolve({ indicator: indicator, plan: plan, controlPoints: controlPoints });
        }
        else {
            console.error('Record is not working');
            reject();
            return false;
            var query = '<View><Query><Where><Eq><FieldRef Name="Title" /><Value Type="Text">' + plan.Record + '</Value></Eq></Where></Query></View>';
            MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.webServerRelativeUrl, '/Lists/Records', query, function (items) {
                var aux = MVD.SPHelpers.ListItems.getItemsFromQueryForDataSource(items, MVD.SPHelpers.Fields.listFieldsCache["/lists/records"]);
                var listUrl;
                for (var keyList in MVD.SPHelpers.ListItems.listCache) {
                    if (aux[0].MVDQuickSurveyListID.toLowerCase() === MVD.SPHelpers.ListItems.listCache[keyList]._m_guidString$p$0) {
                        listUrl = keyList;
                        MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, keyList)
                            .then(function () {
                                var lists = [];
                                for (var i = 0; i < plan.ControlPoints.length; i++) {
                                    var query = '<View><Query><Where><And>';
                                    query += '<Geq><FieldRef Name="' + plan.DateField + '" /><Value Type="DateTime">' + plan.ControlPoints[i].DateFrom.toISOString() + '</Value></Geq>';
                                    query += '<Leq><FieldRef Name="' + plan.DateField + '" /><Value Type="DateTime">' + plan.ControlPoints[i].DateTo.toISOString() + '</Value></Leq>';
                                    query += '</And></Where></Query></View>';
                                    lists.push({ listUrl: listUrl, queryText: query, includes: '' });
                                }
                                MVD.SPHelpers.ListItems.getListItemsMultiple(new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl), lists)
                                    .then(function (ret) {
                                        for (var j = 0; j < ret.length; j++) {
                                            plan.ControlPoints[j].Values = MVD.SPHelpers.ListItems.getItemsFromQueryForDataSource(ret[j].items, MVD.SPHelpers.Fields.listFieldsCache[keyList], true);
                                        }
                                        var controlPoints = plan.ControlPoints;
                                        if (controlPointPeriodToCalculate && controlPointPeriodToCalculate != plan.ControlPointsPeriods) {
                                            controlPoints = MVD.DataSources.Indicator.transformChildPeriodInParentPeriod(controlPoints, controlPointPeriodToCalculate);
                                        }
                                        resolve({ indicator: indicator, plan: plan, controlPoints: controlPoints });
                                    },
                                        function (args) { reject({ error: args, msg: 'Error al traer los valores de los puntos de control, lista: ' + listUrl }) });

                            })
                            .catch(function () { });
                        break;
                    }
                }
            }, function (args) {
                reject({ error: args, msg: 'Error al obtener los puntos de control del indicador.' });
            }, null, null);
        }
    });

    function getDeviationValue(controlPoint, plan) {
        let deviationValue = null;
        if (plan.DeviationType === 'Absoluto') {
            deviationValue = controlPoint.RealValue - controlPoint.TargetValue;
        } else {
            deviationValue = ((controlPoint.RealValue - controlPoint.TargetValue) / controlPoint.TargetValue) * 100;
        }
        if (plan.InvertDeviation) {
            deviationValue = -(deviationValue);
        }
        return deviationValue;
    };
    function getControlPointValuesFromData(plan, data, controlPointPeriodToCalculate) {
        var controlPoints = plan.ControlPoints;
        if (controlPointPeriodToCalculate && controlPointPeriodToCalculate != plan.ControlPointsPeriods) {
            controlPoints = MVD.DataSources.Indicator.transformChildPeriodInParentPeriod(controlPoints, controlPointPeriodToCalculate);
        }
        for (var i = 0; i < controlPoints.length; i++) {
            var controlPoint = controlPoints[i];
            var enumerable = Enumerable.from(data)
                .where(function (e) {
                    var auxDate;
                    if (plan.DateFieldType === 'Date') {
                        auxDate = e[plan.DateField];
                    }
                    else {
                        var auxYear = plan.Title;
                        if (plan.YearDateField) {
                            auxYear = e[plan.YearDateField];
                        }
                        var auxMonth = 0;
                        if (plan.MonthDateField) {
                            auxMonth = e[plan.MonthDateField] - 1;
                        }
                        var auxDay = 1;
                        if (plan.DayDateField) {
                            auxDay = e[plan.DayDateField];
                        }
                        auxDate = new Date(auxYear, auxMonth, auxDay);
                    }
                    return (auxDate >= controlPoint.DateFrom && auxDate <= controlPoint.DateTo);
                });
            controlPoint.Values = enumerable.toArray();
        }
        return controlPoints;
    };
};

MVD.DataSources.Indicator.transformResponsibleDataSourceSettingsInIndicators = async function (sourceSettings, panelGroups, panelId) {
    let personsFields = await MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, '/lists/personas');
    for (var level in panelGroups) {
        var auxIds = []
        if (level === 'Level1') {
            sourceSettings.responsibles.forEach(function (resp) {
                resp.indicators = MVD.DataSources.cacheIndicators.filter(e => e.responsiblePersons.includes(resp.text)).map(e => e.id);
                if (resp.indicators.length !== 0) {
                    var retId = addGroupIndicator(panelGroups[level], resp);
                    auxIds.push(retId);
                }
            });
        } else if (level === 'Level2') {
            var parentGroup = personsFields.find(e => e.internalName === panelGroups[level].groupField).data;
            parentGroup.forEach(function (e) {
                var usersToFind = MVD.Dashboards.indicatorsResponsibles.filter(user => user[panelGroups[level].groupField] === e.text).map(el => el.Usuario + '_' + panelId);
                if (usersToFind.length > 0) {
                    e.indicators = MVD.DataSources.cacheIndicators.filter(i => usersToFind.includes(i.responsiblePersonsKey)).map(el => el.id);
                    if (e.indicators.length !== 0) {
                        var retId = addGroupIndicator(panelGroups[level], e);
                        auxIds.push(retId);
                    }

                }
            });
        }
        else {
            var parentGroup = personsFields.find(e => e.internalName === panelGroups[level].groupField).data;
            var subParent = personsFields.find(e => e.internalName === panelGroups['Level2'].groupField).data;
            parentGroup.forEach(function (e) {
                var auxLevel2Keys = [];
                var level2ToFind = MVD.Dashboards.indicatorsResponsibles.filter(user => user[panelGroups[level].groupField] === e.text).map(e => e[panelGroups['Level2'].groupField])
                    .reduce(function (accu, element) {
                        if (!accu.includes(element)) {
                            accu.push(element);
                        }
                        return accu;
                    }, []);
                level2ToFind.forEach(function (e) {
                    var aux = subParent.find(el => el.text === e);
                    auxLevel2Keys.push(aux.value + '_' + aux.text + '_' + panelId);
                });
                if (auxLevel2Keys.length > 0) {
                    e.indicators = MVD.DataSources.cacheIndicators.filter(i => auxLevel2Keys.includes(i.responsiblePersonsKey)).map(el => el.id);
                    if (e.indicators.length !== 0) {
                        var retId = addGroupIndicator(panelGroups[level], e);
                        auxIds.push(retId);
                    }
                }
            });
        }
    }
    return auxIds;

    function addGroupIndicator(groupSettings, responsible) {
        var responsiblePersonsKey = (groupSettings.groupField === 'Responsible') ?
            responsible.value + '_' + panelId :
            responsible.value + '_' + responsible.text + '_' + panelId;
        var index = MVD.DataSources.cacheIndicators.findIndex(e => e.responsiblePersonsKey === (responsiblePersonsKey));
        if (index >= 0) {
            MVD.DataSources.cacheIndicators.splice(index, 1);
        }
        var auxPlans = MVD.DataSources.cacheIndicators
            .filter(e => responsible.indicators.includes(e.id))
            .reduce(function (accu, indicador) {
                indicador.plans.forEach(function (plan) {
                    var isPlanRepeat = accu.find(p => p.Title === plan.Title);
                    if (typeof isPlanRepeat === 'undefined') {
                        accu.push({
                            Title: plan.Title,
                            Indicator: responsible.text,
                            Scale: MVD.DataSources.Indicator.scalesValues.find(e => e.Scale_Lookups.id == groupSettings.groupScale).Scale,
                            Scale_Lookups: MVD.DataSources.Indicator.scalesValues.find(e => e.Scale_Lookups.id == groupSettings.groupScale).Scale_Lookups,
                            Scales: groupSettings.scaleRange,
                            DeviationType: 'Absoluto',
                            DataSourceType: 'Cálculo en base a otros indicadores',
                            IndicatorsChilds_Lookups: [{ id: indicador.id, value: indicador.title }],
                            IndicatorsChilds: indicador.title + '; ',
                            ValueFieldType: 'Simple',
                            ValueField: groupSettings.valueField,
                            AggregateFunction: groupSettings.aggregateFunction,
                            Formula: '',
                            DateFieldType: 'Fecha',
                            DateField: null,
                            DayDateField: null,
                            MonthDateField: null,
                            YearDateField: null,
                            ControlPointsFilterCheckbox: false,
                            ControlPointsFilter: null,
                            ControlPointsPeriods: plan.ControlPointsPeriods,
                            ControlPoints: getControlPoints(plan.ControlPointsPeriods, plan.Title),
                            MVDRF_Mediciones: null,
                            InvertDeviation: false,
                            ID: (Math.floor(Math.random() * 1000000)),
                            IndicatorChildPlans: indicador.plans.filter(p => p.Title == plan.Title).map(p2 => p2.ID),
                        });
                    }
                    else {
                        isPlanRepeat.IndicatorChildPlans = isPlanRepeat.IndicatorChildPlans.concat(indicador.plans.filter(p => p.Title == plan.Title).map(p2 => p2.ID));
                        isPlanRepeat.IndicatorsChilds_Lookups.push({ id: indicador.id, value: indicador.title });
                        isPlanRepeat.IndicatorsChilds += indicador.title + '; ';
                        if (isPlanRepeat.ControlPointsPeriods < plan.ControlPointsPeriods) {
                            isPlanRepeat.ControlPointsPeriods = plan.ControlPointsPeriods;
                            isPlanRepeat.ControlPoints = getControlPoints(plan.ControlPointsPeriods, plan.Title);
                        }
                    }
                });
                return accu;
            }, []);
        auxPlans.forEach(function (plan) { plan.IndicatorsChilds = plan.IndicatorsChilds.substring(0, plan.IndicatorsChilds.length - 2); });

        var id = Enumerable.from(MVD.DataSources.cacheIndicators).max(function (e) { return e.id }) + 1;
        var indicator = {
            id: id,
            title: responsible.text,
            responsiblePersonsKey: responsiblePersonsKey,
            type: 'Indicador',
            history: [],
            dateFormat: 'MMM',
            numberFormatValues: '1.23',
            numberFormatDeviations: '1.23',
            isCumulative: true,
            responsiblePersons: [],
            plans: auxPlans,
            promisePlans: new Promise(function (resolve, reject) { resolve() })
        };
        MVD.DataSources.cacheIndicators.push(indicator);
        return id;
    };
    function getControlPoints(period, year) {
        var controlPoints = [];
        var monthRanges = [];
        switch (period) {
            case '1':
                monthRanges = [{ from: 1, to: 1 }, { from: 2, to: 2 }, { from: 3, to: 3 }, { from: 4, to: 4 }, { from: 5, to: 5 }, { from: 6, to: 6 }, { from: 7, to: 7 }, { from: 8, to: 8 }, { from: 9, to: 9 }, { from: 10, to: 10 }, { from: 11, to: 11 }, { from: 12, to: 12 }];
                break;
            case '2':
                monthRanges = [{ from: 1, to: 2 }, { from: 3, to: 4 }, { from: 5, to: 6 }, { from: 7, to: 8 }, { from: 9, to: 10 }, { from: 11, to: 12 }];
                break;
            case '3':
                monthRanges = [{ from: 1, to: 3 }, { from: 4, to: 6 }, { from: 7, to: 9 }, { from: 10, to: 12 }];
                break;
            case '4':
                monthRanges = [{ from: 1, to: 4 }, { from: 5, to: 8 }, { from: 9, to: 12 }];
                break;
            case '6':
                monthRanges = [{ from: 1, to: 6 }, { from: 7, to: 12 }];
                break;
            case '12':
                monthRanges = [{ from: 1, to: 12 }];
                break;
        };

        for (var i = 0; i < monthRanges.length; i++) {
            controlPoints.push({
                'FilterValue': 'General',
                'DateFrom': new Date(year, monthRanges[i].from - 1, 1),
                'DateTo': new Date(year, monthRanges[i].to, 0),
                'TargetValue': 0,
                'RealValue': null
            });
        }
        return controlPoints;
    }
};

MVD.DataSources.Indicator.transformChildPeriodInParentPeriod = function (controlPoints, controlPointPeriodToCalculate, processValues) {
    var auxControlPoints = [].concat(controlPoints.filter(e => e.FilterValue === 'General' || !e.FilterValue));
    var ret = [];
    switch (controlPointPeriodToCalculate) {
        case '1':
            monthRanges = [{ from: 1, to: 1 }, { from: 2, to: 2 }, { from: 3, to: 3 }, { from: 4, to: 4 }, { from: 5, to: 5 }, { from: 6, to: 6 }, { from: 7, to: 7 }, { from: 8, to: 8 }, { from: 9, to: 9 }, { from: 10, to: 10 }, { from: 11, to: 11 }, { from: 12, to: 12 }];
            break;
        case '2':
            monthRanges = [{ from: 1, to: 2 }, { from: 3, to: 4 }, { from: 5, to: 6 }, { from: 7, to: 8 }, { from: 9, to: 10 }, { from: 11, to: 12 }];
            break;
        case '3':
            monthRanges = [{ from: 1, to: 3 }, { from: 4, to: 6 }, { from: 7, to: 9 }, { from: 10, to: 12 }];
            break;
        case '4':
            monthRanges = [{ from: 1, to: 4 }, { from: 5, to: 8 }, { from: 9, to: 12 }];
            break;
        case '6':
            monthRanges = [{ from: 1, to: 6 }, { from: 7, to: 12 }];
            break;
        case '12':
            monthRanges = [{ from: 1, to: 12 }];
            break;
    };


    let year = controlPoints[0].DateFrom.getFullYear();
    for (var i = 0; i < monthRanges.length; i++) {
        let dateFrom = new Date(year, monthRanges[i].from - 1, 1);
        let dateTo = new Date(year, monthRanges[i].to, 0);
        let values = [];
        if (processValues) {
            if (auxControlPoints.length > monthRanges.length) {
                values = auxControlPoints.filter(e => e.DateFrom >= dateFrom && e.DateTo <= dateTo).reduce(function (accu, e) {
                    accu = accu.concat(e.Values);
                    return accu;
                }, []);
            }
            else {

            }
        }

        let targetValue = auxControlPoints.filter(e => e.DateFrom >= dateFrom && e.DateTo <= dateTo).reduce(function (accu, e) {
            if (accu === null) {
                accu = e.TargetValue;
            } else {
                accu = (accu > e.TargetValue) ? e.TargetValue : accu;
            }
            return accu;
        }, null);


        let auxControlPoint = {
            IndicatorPlan: controlPoints[0].IndicatorPlan,
            DateFrom: dateFrom,
            DateTo: dateTo,
            FilterValue: 'General',
            TargetValue: targetValue,
            Values: values,
        };
        ret.push(auxControlPoint);
    }
    return ret;
};

MVD.DataSources.Indicator.getResponsibles = function () {
    return new Promise(function (resolve, reject) {
        var responsibles = [];
        MVD.Dashboards.indicatorsResponsibles = [];
        MVD.DataSources.cacheIndicators.forEach(function (e) {
            e.responsiblePersons.forEach(function (r) {
                if (!responsibles.includes(r)) {
                    responsibles.push(r);
                    SPClientPeoplePicker.SPClientPeoplePickerDict.hiddenPeoplePicker_TopSpan.AddUserKeys(r);
                }
            });
        });
        isResolved(SPClientPeoplePicker.SPClientPeoplePickerDict.hiddenPeoplePicker_TopSpan.GetAllUserInfo(), resolve, reject);
    });

    function isResolved(aux, resolve, reject) {
        if (aux.filter(e => !e.IsResolved).length > 0) {
            setTimeout(function () {
                isResolved(SPClientPeoplePicker.SPClientPeoplePickerDict.hiddenPeoplePicker_TopSpan.GetAllUserInfo(), resolve, reject);
            }, 500);
        } else {
            getUserKey();
        }

        async function getUserKey() {
            var query = '';
            for (var i = 0; i < aux.length; i++) {
                if (i === 0) {
                    query += '<Eq><FieldRef Name="Usuario" LookupId="True"/><Value Type="User">' + aux[i].EntityData.SPUserID + '</Value></Eq>';
                } else {
                    query = '<Or>' + query + '<Eq><FieldRef Name="Usuario" LookupId="True"/><Value Type="User">' + aux[i].EntityData.SPUserID + '</Value></Eq></Or>';
                }
            }
            query = '<View><Query><Where>' + query + '</Where></Query></View>';
            if (aux.length === 0) {
                resolve();
            } else {
                MVD.SPHelpers.ListItems.getListItems('/', '/lists/personas', query)
                    .then(async function (items) {
                        let listPersonsFields = await MVD.SPHelpers.Fields.getListFields('/', '/lists/personas');
                        MVD.Dashboards.indicatorsResponsibles = MVD.SPHelpers.ListItems.getItemsFromQuery(items, listPersonsFields);
                        resolve();
                    })
                    .catch(function (err) { reject(err) });

            }
        }
    }
};

MVD.DataSources.Indicator.getSourceMask = function (id, planName) {
    try {
        var indicator = MVD.DataSources.cacheIndicators.find(function (e) { return e.id == id });
        if (typeof indicator === 'undefined') throw 'El indicador de identificador ' + id + ' fue eliminado.';
        var plan = null;
        if (planName) {
            plan = indicator.plans.find(e => e.Title == planName);
        } else {
            planName = indicator.plans[0].Title;
            plan = indicator.plans[0];
        }
        var parameters = [];
        var planDataSource = null;
        if (!plan) {

            throw 'No existe plan ' + planName + ' para el indicador ' + indicator.title;

        }
        if (plan.DataSourceType === 'Fuente de datos') {
            planDataSource = MVD.DataSources.cacheDataSources.find(e => e.title == plan.MVDDataSource);
            if (!planDataSource) throw { msg: 'La fuente de datos del plan ' + plan.Title + ' del indicador ' + indicator.title + ' fue elimiada.' };
            planDataSource = JSON.parse(JSON.stringify(planDataSource));
            parameters = MVD.DataSources.getAllSourceParameters(planDataSource);
        } else if (plan.DataSourceType === 'Cálculo en base a otros indicadores') {
            var indicatorsChilds = [];
            plan.IndicatorsChilds_Lookups.forEach(e => indicatorsChilds.push(MVD.DataSources.cacheIndicators.find(i => i.id == e.id)));
            indicatorsChilds.forEach(function (ind) {
                //var auxPlan = ind.plans.find(e => plan.IndicatorChildPlans.includes(e.ID));
                var auxPlan = ind.plans.find(e => e.Title == planName);
                if (auxPlan) {
                    var auxSource = MVD.DataSources.Indicator.getSourceMask(ind.id, planName);
                    parameters = parameters.concat(auxSource.parameters);
                }
            });
        }
        let indicatorSource = {
            id: id,
            parameters: parameters,
            title: indicator.title,
            type: 'Indicador',
            typeSettings: {
                planName: planName,
                plan: plan,
                sourceId: (planDataSource) ? planDataSource.id : null
            },
        };
        if (planDataSource && planDataSource.fields) {
            indicatorSource.detailsFields = planDataSource.fields;
        }
        return indicatorSource;
    } catch (e) {
        MVD.SyncfusionUtilities.showToast(e);
        return false;
    }
};

MVD.DataSources.Indicator.getIndicatorsFromExcelSheet = function (sourceId, argsData) {
    //argsData[key] = argsData[key].filter(e => e[titleColumn]);
    var indicatorsTitles = []
    let dimensioningParameters = {};
    var parameters = [{
        'field': 'Plan',
        'createdName': 'Plan',
        'name': 'Plan',
        'allowMultiple': false,
        'required': true,
        'allowNull': false,
        'sourceId': sourceId,
        'visible': true,
        'defaultValue': new Date().getFullYear().toString(),
        'referenceInQuery': null,
        'operator': 'Eq',
        'type': 'DistinctList',
        'sourcesIds': [sourceId],
        'fields': { sourceId: 'Plan' }
    }];
    if (!MVD.DataSources.cacheIndicatorsSheet) MVD.DataSources.cacheIndicatorsSheet = {};
    if (!MVD.DataSources.cacheIndicatorsSheet[sourceId]) {
        MVD.DataSources.cacheIndicatorsSheet[sourceId] = { plans: {}, history: [] };
        let historyColumn = Object.keys(argsData).find(e => ['Históricos', 'History'].includes(e));
        if (argsData[historyColumn].length > 0) {
            let titleColumn = Object.keys(argsData[historyColumn][0]).find(e => !Number(e));
            MVD.DataSources.cacheIndicatorsSheet[sourceId].history = Enumerable.from(argsData[historyColumn]).distinct(e => e[titleColumn]).toArray();
        }
        for (let key in argsData) {
            if (Number.isFinite(parseInt(key)) && argsData[key].length > 0) {
                let dashboardColumn = Object.keys(argsData[key][0])[0];
                let groupColumn = Object.keys(argsData[key][0])[1];
                let titleColumn = Object.keys(argsData[key][0])[2];
                MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[key] = [];
                let indicatorsRowsUniques = Enumerable.from(argsData[key]).distinct(e => e[titleColumn]).toArray();
                let commonIndicators = indicatorsRowsUniques.filter(e => !e[titleColumn].includes('|'));
                let dimensioningIndicators = indicatorsRowsUniques.filter(e => e[titleColumn].includes('|'));

                let commonIndicatorsPrincipalRow = commonIndicators.filter(e => !e[titleColumn].endsWith('Metas') && !e[titleColumn].endsWith('YTD'));
                for (let i = 0; i < commonIndicatorsPrincipalRow.length; i++) {
                    if (!indicatorsTitles.includes(commonIndicatorsPrincipalRow[i][titleColumn])) indicatorsTitles.push(commonIndicatorsPrincipalRow[i][titleColumn]);
                    let indicatorData = commonIndicators.filter(function (e) {
                        let strTitleColumn = e[titleColumn].replace(commonIndicatorsPrincipalRow[i][titleColumn], '').trim();
                        return ['Metas', 'YTD'].includes(strTitleColumn) || !strTitleColumn;
                    });
                    MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[key].push({
                        indicator: commonIndicatorsPrincipalRow[i],
                        data: MVD.DataSources.Indicator.transformExcelToIndicatorData(indicatorData)
                    });
                }

                let dimensioningIndicatorsAux = []
                let dimensioningIndicatorsPrincipalRow = dimensioningIndicators.filter(e => !e[titleColumn].endsWith('Metas') && !e[titleColumn].endsWith('YTD'));
                for (let i = 0; i < dimensioningIndicatorsPrincipalRow.length; i++) {
                    let indicatorData = dimensioningIndicators.filter(function (e) {
                        let strTitleColumn = e[titleColumn].replace(dimensioningIndicatorsPrincipalRow[i][titleColumn], '').trim();
                        return ['Metas', 'YTD'].includes(strTitleColumn) || !strTitleColumn;
                    });
                    let dimensioningTitle = dimensioningIndicatorsPrincipalRow[i][titleColumn];
                    //dimensioningIndicatorsPrincipalRow[i].DimensioningTitles = dimensioningIndicatorsPrincipalRow[i][titleColumn];
                    let splitTitle = dimensioningIndicatorsPrincipalRow[i][titleColumn].split('|');
                    let title = splitTitle[1].trim();

                    let dimensioningFilter = splitTitle[0].trim();
                    let dimensioningFilterValue = (dimensioningFilter.match(/\(.*?\)/g));
                    if (dimensioningFilterValue) {
                        dimensioningFilter = dimensioningFilter.replace(dimensioningFilterValue[0], '').trim();
                        dimensioningFilterValue = dimensioningFilterValue[0].substring(1, dimensioningFilterValue[0].length - 1);
                    } else {
                        dimensioningFilter = 'Filtro_';
                        dimensioningFilterValue = title + ' - ' + i;
                    }
                    if (typeof dimensioningParameters[dimensioningFilter] === 'undefined') {
                        dimensioningParameters[dimensioningFilter] = [dimensioningFilterValue];
                    } else if (!dimensioningParameters[dimensioningFilter].includes(dimensioningFilterValue)) {
                        dimensioningParameters[dimensioningFilter].push(dimensioningFilterValue);
                    }

                    let indicatorProcessData = MVD.DataSources.Indicator.transformExcelToIndicatorData(indicatorData, dimensioningFilter, dimensioningFilterValue);
                    dimensioningIndicatorsPrincipalRow[i][titleColumn] = title;
                    let existIndicator = MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[key].find(e => e.indicator[titleColumn] === title);
                    if (existIndicator) {
                        existIndicator.indicator.DimensioningTitles.push(dimensioningTitle);
                        existIndicator.data = existIndicator.data.concat(indicatorProcessData);
                    } else {
                        dimensioningIndicatorsPrincipalRow[i].DimensioningTitles = [dimensioningTitle];
                        MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[key].push({
                            indicator: dimensioningIndicatorsPrincipalRow[i],
                            data: indicatorProcessData
                        });
                    }
                    if (!indicatorsTitles.includes(title)) indicatorsTitles.push(title);
                }
            }
        }
        for (let keyParam in dimensioningParameters) {
            let auxParam = {
                'field': keyParam,
                'createdName': keyParam,
                'name': keyParam,
                'allowMultiple': false,
                'required': false,
                'allowNull': false,
                'sourceId': sourceId,
                'visible': true,
                'defaultValue': 'General',
                'referenceInQuery': null,
                'operator': 'Eq',
                'type': 'DistinctList',
                'entryValue': 'userAndDefault',
                'fields': {},
                'values': dimensioningParameters[keyParam].reduce(function (accu, e) {
                    accu.push({ text: e, value: e });
                    return accu;
                }, [])
            };
            auxParam['fields'][sourceId] = keyParam;
            parameters.push(auxParam);
        }
        parameters[0].values = Object.keys(MVD.DataSources.cacheIndicatorsSheet[sourceId].plans).reduce(function (accu, e) {
            accu.push({ text: e, value: e });
            return accu;
        }, []);
        MVD.DataSources.cacheDataSources.find(e => e.id === sourceId).parameters = parameters;
    } else {
        var keyPlans = Object.keys(MVD.DataSources.cacheIndicatorsSheet[sourceId].plans);
        var titleColumn = Object.keys(MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[keyPlans[0]][0].indicator)[2];
        for (var keyPlan in MVD.DataSources.cacheIndicatorsSheet[sourceId].plans) {
            indicatorsTitles = indicatorsTitles.concat(MVD.DataSources.cacheIndicatorsSheet[sourceId].plans[keyPlan].map(e => e.indicator[titleColumn]));
        }
        indicatorsTitles = Enumerable.from(indicatorsTitles).distinct().orderBy().toArray();
    }
    return indicatorsTitles;
};

MVD.DataSources.Indicator.transformExcelToIndicatorData = function (data, filterKey, filterValue) {
    let titleColumn = Object.keys(data[0])[2];
    let formulaColumn = Object.keys(data[0])[4];
    let operatorColumn = Object.keys(data[0])[6];
    let objectiveColumn = Object.keys(data[0])[7];
    let deviationColumn = Object.keys(data[0])[5];
    let retData = [];
    let indicatorData = data.find(e => !e[titleColumn].includes('Metas') && !e[titleColumn].includes('YTD'));
    let predictedAccumulatedValue = 0;

    for (let keyData in indicatorData) {
        if (!moment(keyData).isValid()) continue;
        var aux = {
            Date: moment(keyData).format('MMM'),
            Value: indicatorData[keyData],
        }
        if (filterValue) {
            aux.FilterValue = filterValue;
            aux.FilterKey = filterKey;
        }
        var goalData = data.find(e => e[titleColumn].startsWith(indicatorData[titleColumn]) && e[titleColumn].endsWith('Metas'));
        if (goalData) {
            aux.PredictedValue = goalData[keyData];
        } else {
            aux.PredictedValue = indicatorData[objectiveColumn];
        }
        retData.push(aux);
        var YTDData = data.find(e => e[titleColumn].startsWith(indicatorData[titleColumn]) && e[titleColumn].endsWith('YTD'));
        if (YTDData) {
            if (Number.isFinite(YTDData[keyData]))
                aux.AccumulatedValue = YTDData[keyData];
        } else if (Number.isFinite(aux.Value)) {
            try {
                if (!indicatorData[formulaColumn]) indicatorData[formulaColumn] = 'Promedio';
                aux.AccumulatedValue = getEvaluateExpression(retData, indicatorData[formulaColumn]);
            } catch (e) {

            }
        }

        try {
            if (Number.isFinite(aux.Value) && Number.isFinite(aux.PredictedValue)) {
                aux.DeviationAbsolute = aux.Value - aux.PredictedValue;
                aux.DeviationPercentage = ((aux.Value - aux.PredictedValue) / aux.PredictedValue) * 100;
                aux.DeviationAbsoluteInverted = -(aux.DeviationAbsolute);
                aux.DeviationPercentageInverted = -(aux.DeviationPercentage);
                predictedAccumulatedValue += aux.PredictedValue;
                aux.DeviationAbsoluteAccumulatedValue = aux.AccumulatedValue - predictedAccumulatedValue;
                aux.DeviationPercentageAccumulatedValue = ((aux.AccumulatedValue - predictedAccumulatedValue) / predictedAccumulatedValue) * 100;
                aux.DeviationAbsoluteAccumulatedValueInverted = -(aux.DeviationAbsoluteAccumulatedValue);
                aux.DeviationPercentageAccumulatedValueInverted = -(aux.DeviationPercentageAccumulatedValue);
                if (!indicatorData[deviationColumn]) indicatorData[deviationColumn] = 'Absoluto';
                if (indicatorData[deviationColumn].includes('Absoluto')) {
                    aux.DeviationValue = (indicatorData[deviationColumn].includes('invertido')) ? aux.DeviationAbsoluteInverted : aux.DeviationAbsolute;
                    aux.DeviationAccumulatedValue = (indicatorData[deviationColumn].includes('invertido')) ? aux.DeviationAbsoluteAccumulatedValueInverted : aux.DeviationAbsoluteAccumulatedValue;
                } else {
                    aux.DeviationValue = (indicatorData[deviationColumn].includes('invertido')) ? aux.DeviationPercentageInverted : aux.DeviationPercentage;
                    aux.DeviationAccumulatedValue = (indicatorData[deviationColumn].includes('invertido')) ? aux.DeviationPercentageAccumulatedValueInverted : aux.DeviationPercentageAccumulatedValue;
                }
                var strScale = getStrScale(indicatorData, goalData);
                aux.Scale = getScale(aux.DeviationValue, strScale.split(';'), MVD.DataSources.Indicator.scalesValues.filter(e => e.Scale === 'Semáforo'));
                if (aux.Scale) aux.ColorValue = aux.Scale.ColorValue;
            }
        }
        catch (e) {

        }
    }
    let YearAccumulatedValue = null;
    if (data.find(e => e[titleColumn].startsWith(indicatorData[titleColumn]) && e[titleColumn].endsWith('YTD'))) {
        YearAccumulatedValue = getEvaluateExpression(retData, 'Último', 'AccumulatedValue');
    } else {
        YearAccumulatedValue = getEvaluateExpression(retData, indicatorData[formulaColumn], 'Value');
    }
    let row = {
        Date: 'YTD',
        YearAccumulatedValue: YearAccumulatedValue,
    }

    if (filterValue) {
        row.FilterValue = filterValue;
        row.FilterKey = filterKey;
    }
    retData.unshift(row);
    return retData;

    function getEvaluateExpression(values, aggregateFunction, keyField = 'Value') {
        var retValue = null;
        var enumerable = Enumerable.from(values);
        if (aggregateFunction === 'Suma') {
            retValue = enumerable.sum(function (e) { return e[keyField] });
        }
        else if (aggregateFunction === 'Promedio') {
            retValue = enumerable.where(e => Number.isFinite(e[keyField])).average(function (e) { return e[keyField]; })
        }
        else if (aggregateFunction === 'Mínimo') {
            retValue = enumerable.min(function (e) { return e[keyField] });
        }
        else if (aggregateFunction === 'Máximo') {
            retValue = enumerable.max(function (e) { return e[keyField] });
        }
        else if (aggregateFunction === 'Primero') {
            retValue = enumerable.first(function (e) { return e[keyField] });
        }
        else if (aggregateFunction === 'Último') {
            if (enumerable.where(function (e) { return (Number.isFinite(e[keyField])) }).count()) {
                let auxArray = enumerable.where(function (e) { return (Number.isFinite(e[keyField])) }).toArray();
                retValue = auxArray[auxArray.length - 1][keyField];
            }
        }
        else if (aggregateFunction === 'Mediana') {
            retValue = MVD.DataSources.Pivot.calcMedian(enumerable, keyField);
        }
        else if (aggregateFunction === 'Desviación Estándar Muestral') {
            retValue = MVD.DataSources.Pivot.calcSampleStDev(enumerable, keyField);
        }
        else if (aggregateFunction === 'Desviación Estándar Poblacional') {
            retValue = MVD.DataSources.Pivot.calcPopulationStDev(enumerable, keyField);
        }
        else if (aggregateFunction === 'Varianza Muestral') {
            retValue = MVD.DataSources.Pivot.calcSampleVar(enumerable, keyField);
        }
        else if (aggregateFunction === 'Varianza Poblacional') {
            retValue = MVD.DataSources.Pivot.calcPopulationVar(enumerable, keyField);
        }
        return retValue;
    }
    function getScale(value, scales, scalesValues) {
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
        return scalesValues.find(e => e.Title === colorToFind);
    }
    function getStrScale(indicatorData, goalValue) {
        let operatorColumn = Object.keys(indicatorData)[6];
        let objectiveColumn = Object.keys(indicatorData)[7];
        let measureFormat = '';
        let toleranceFormat = ''
        try {
            measureFormat = indicatorData[Object.keys(indicatorData)[Object.keys(indicatorData).length - 2]];
            toleranceFormat = indicatorData[Object.keys(indicatorData)[Object.keys(indicatorData).length - 1]];
        } catch (e) {

        }

        var operator = indicatorData[operatorColumn];
        var scale = '0-Rojo;Verde';

        if (operator === null) {
            return scale;
        }
        if (typeof goalValue === 'undefined') {
            if (operator === '≥') {
                scale = '0-Rojo;Verde';
            } else if (operator === '>') {
                scale = '0+Rojo;Verde';
            } else if (operator === '≤') {
                scale = '0+Verde;Rojo';
            } else if (operator === '<') {
                scale = '0-Verde;Rojo';
            } else {
                scale = '0-Rojo;0+Verde;Rojo';
            }
        }
        else {
            var tolerance = (!Number.isFinite(indicatorData[objectiveColumn])) ? 0 : indicatorData[objectiveColumn];
            if (toleranceFormat.indexOf('%') > -1 && measureFormat.indexOf('%') === -1) {
                tolerance = (tolerance * goalValue);
            }
            //if (!Number.isFinite(tolerance)) tolerance = 0;
            if (goalValue >= 0) {
                if (operator === '≥') {
                    scale = -tolerance + '-Rojo;' + ((tolerance === 0) ? '' : '0-Amarillo;') + 'Verde';
                }
                else if (operator === '>') {
                    scale = -tolerance + '-Rojo;' + ((tolerance === 0) ? '' : '0+Amarillo;') + 'Verde';
                }
                else if (operator === '≤') {
                    scale = '0+Verde;' + ((tolerance === 0) ? '' : tolerance + '+Amarillo;') + 'Rojo';
                }
                else if (operator === '<') {
                    scale = '0-Verde;' + ((tolerance === 0) ? '' : tolerance + '+Amarillo;') + 'Rojo';
                }
                else {
                    scale = -tolerance + '-Rojo;0-Amarillo;0+Verde;' + tolerance + '+Amarillo;Rojo';
                }
            }
            else /*if (goalValue < 0)*/ {
                //tolerance = (tolerance !== 0) ? (goalValue + tolerance) : 0;
                if (operator === '≥') {
                    scale = tolerance + '-Rojo;' + ((tolerance === 0) ? '' : '0-Amarillo;') + 'Verde';
                }
                else if (operator === '>') {
                    scale = tolerance + '-Rojo;' + ((tolerance === 0) ? '' : '0+Amarillo;') + 'Verde';
                }
                else if (operator === '≤') {
                    scale = '0+Verde;' + ((tolerance === 0) ? '' : -tolerance + '+Amarillo;') + 'Rojo';
                }
                else if (operator === '<') {
                    scale = '0-Verde;' + ((tolerance === 0) ? '' : -tolerance + '+Amarillo;') + 'Rojo';
                }
                else {
                    scale = tolerance + '-Rojo;0-Amarillo;0+Verde;' + (-tolerance) + '+Amarillo;Rojo';
                    //scale = (tolerance - 0.000001) + '+Rojo;' + (-0.000001) + '+Amarillo;0+Verde;' + (-tolerance) + '+Amarillo;Rojo';
                }
            }
            //else {
            //    if (operator === '≥') {
            //        scale = '0-Rojo;Verde';
            //    } else if (operator === '>') {
            //        scale = '0+Rojo;Verde';
            //    } else if (operator === '≤') {
            //        scale = '0+Verde;Rojo';
            //    } else if (operator === '<') {
            //        scale = '0-Verde;Rojo';
            //    } else {
            //        scale = '0-Rojo;0+Verde;Rojo';
            //    }
            //}
        }
        return scale;
    };

};

//--------------------------------------------------------------------------------------------------------------------------
// Código que se ejecuta en List/Indicators
//--------------------------------------------------------------------------------------------------------------------------

MVD.DataSources.Indicator.btnDuplicateLastPlan = function () {
    MVD.SPHelpers.Common.pageLoader(true);
    prepareLastPlan();
    MVD.SPHelpers.ListItems.updateListItem(_spPageContextInfo.webServerRelativeUrl, '/Lists/IndicatorsPlans', null, MVD.DataSources.Indicator.lastPlan,
        function (planId) {
            preparePuntosDeControl(planId);
            var parcheParaReload = 0;
            for (var i = 0; i < MVD.DataSources.Indicator.lastPlanControlPoints.length; i++) {
                MVD.SPHelpers.ListItems.updateListItem(_spPageContextInfo.webServerRelativeUrl, '/Lists/IndicatorsValues', null, MVD.DataSources.Indicator.lastPlanControlPoints[i], function (itemID) {
                    parcheParaReload++;
                    if (MVD.DataSources.Indicator.lastPlanControlPoints.length === parcheParaReload) {
                        window.location.href = window.location.href;
                    }
                }, function (args) {
                    MVD.SPHelpers.Common.pageLoader(false);
                    console.log("Error: " + args);
                });
            }
            if (MVD.DataSources.Indicator.lastPlanControlPoints.length === 0) {
                window.location.href = window.location.href;
            }
        },
        function (args) {
            MVD.SPHelpers.Common.pageLoader(false);
            console.log("Error: " + args);
        });

    function prepareLastPlan() {
        for (var i = MVD.DataSources.Indicator.lastPlan.length - 1; i >= 0; i--) {
            if (MVD.DataSources.Indicator.lastPlan[i].name === 'Title') {
                MVD.DataSources.Indicator.lastPlan[i].value = (yearValidation(MVD.DataSources.Indicator.lastPlan[i].value)) ? parseInt(MVD.DataSources.Indicator.lastPlan[i].value) + 1 : (new Date()).getFullYear() + 1;
            } else if (MVD.DataSources.Indicator.lastPlan[i].name === 'ID' || MVD.DataSources.Indicator.lastPlan[i].name === 'ControlPointsFilterCheckbox' || MVD.DataSources.Indicator.lastPlan[i].name === 'ControlPointsFilter') {
                MVD.DataSources.Indicator.lastPlan.splice(i, 1);
            }
        }

        function yearValidation(year) {
            try {
                var parseYear = parseInt(year);
                var text = /^[0-9]+$/;
                if (parseYear != 0) {
                    if ((parseYear != "") && (!text.test(parseYear))) {
                        return false;
                    }
                    if (parseYear.length < 4) {
                        return false;
                    }
                    var current_year = new Date().getFullYear();
                    if ((parseYear < 2000)) {
                        return false;
                    }
                    return true;
                }
            } catch (e) {
                return false;
            }
        }
    }

    function preparePuntosDeControl(planId) {
        for (var i = MVD.DataSources.Indicator.lastPlanControlPoints.length - 1; i >= 0; i--) {
            for (var j = MVD.DataSources.Indicator.lastPlanControlPoints[i].length - 1; j >= 0; j--) {
                if (MVD.DataSources.Indicator.lastPlanControlPoints[i][j].name === 'ID') {
                    MVD.DataSources.Indicator.lastPlanControlPoints[i].splice(j, 1);
                } else if (MVD.DataSources.Indicator.lastPlanControlPoints[i][j].value instanceof Date) {
                    MVD.DataSources.Indicator.lastPlanControlPoints[i][j].value = MVD.DataSources.Indicator.lastPlanControlPoints[i][j].value.addYears(1);
                } else if (MVD.DataSources.Indicator.lastPlanControlPoints[i][j].name === 'IndicatorPlan') {
                    var aux = MVD.DataSources.Indicator.lastPlan.find(e => e.name === 'Title');
                    var planTitle = (aux) ? aux.value : '';
                    MVD.DataSources.Indicator.lastPlanControlPoints[i][j].value = planId + ';#' + planTitle;
                }
            }
        }
    }
};

MVD.DataSources.Indicator.initializeListIndicator = function () {
    if (window.location.href.toLowerCase().includes('editform')) {
        var formatValue = MVD.SPHelpers.Fields.getFieldValueByInternalName('NumberFormatValues');
        localStorage['indicatorNumberFormatValues'] = formatValue;
        MVD.RelationGrid.whenRenderedByInternalName('MVDRF_PlanesWrapper')
            .then(function () {
                MVD.SPHelpers.ListItems.getListCache(new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl));
                MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, '/Lists/IndicatorsPlans');
            });

        //MVD.RelationGrid.whenRenderedByInternalName('MVDRF_HistoryWrapper')
        //   .then(function () {
        //       function getFormatValue(value) {
        //           var format = '';
        //           switch (value) {
        //               case '1,234':
        //                   format = '{0:N0}';
        //                   break;
        //               case '1,234.5':
        //                   format = '{0:N1}';
        //                   break;
        //               case '1,234.56':
        //                   format = '{0:N2}';
        //                   break;
        //               case '1':
        //                   format = '{0:N0}';
        //                   break;
        //               case '1.2':
        //                   format = '{0:N1}';
        //                   break;
        //               case '1.23':
        //                   format = '{0:N2}';
        //                   break;
        //               case '0%':
        //                   format = '{0:P0}';
        //                   break;
        //               case '0.1%':
        //                   format = '{0:P1}';
        //                   break;
        //               case '0.12%':
        //                   format = '{0:P2}';
        //                   break;
        //               case '0.123%':
        //                   format = '{0:P3}';
        //                   break;
        //               case '$1,234':
        //                   format = '{0:C0}';
        //                   break;
        //               case '$1,234.5':
        //                   format = '{0:C1}';
        //                   break;
        //               case '$1,234.56':
        //                   format = '{0:C2}';
        //                   break;
        //               case 'US$1,234':
        //                   format = '{0:C0}';
        //                   break;
        //               case 'US$1,234.5':
        //                   format = '{0:C1}';
        //                   break;
        //               case 'US$1,234.56':
        //                   format = '{0:C2}';
        //               default:
        //                   break;
        //           }
        //           return format;
        //       }
        //       var formatValue = MVD.SPHelpers.Fields.getFieldValueByInternalName('NumberFormatValues');
        //       //var grid = $("#MVDRF_HistoryWrapper").data("ejGrid");
        //       //var column = grid.getColumnByField('Value');
        //       //column.format = getFormatValue(formatValue);
        //       //grid.refreshContent(true);
        //       //localStorage['indicatorNumberFormatValues'] = formatValue;
        //       //document.querySelector('select[id*="NumberFormatValues"]').onchange = function (args) {
        //       //    var grid = $("#MVDRF_HistoryWrapper").data("ejGrid");
        //       //    var column = grid.getColumnByField('Value');
        //       //    column.format = getFormatValue(args.target.value);
        //       //    grid.refreshContent(true);
        //       //    localStorage['indicatorNumberFormatValues'] = args.target.value;
        //       //};
        //   });
    }
};

MVD.DataSources.Indicator.getIndicatorLastPlan = function () {
    var ctx = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl);
    MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, '/Lists/IndicatorsPlans')
        .then(function (fields) {
            var ID = MVD.SPHelpers.ListItems.getParameterByName('ID');
            var queryText = '<View><Query><Where><Eq><FieldRef Name="Indicator" LookupId="True" /><Value Type="Lookup">' + ID + '</Value></Eq></Where><OrderBy><FieldRef Name="ID" Ascending="FALSE" /></OrderBy></Query></View>';
            MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.webServerRelativeUrl, '/Lists/IndicatorsPlans', queryText,
                function (items) {
                    if (items && items.get_count() > 0) {
                        var enumerator = items.getEnumerator();
                        if (enumerator.moveNext()) {
                            var listItem = enumerator.get_current();
                            for (var i = 0; i < fields.length; i++) {
                                try {
                                    var value = listItem.get_item(fields[i].internalName);
                                    if (value) {
                                        var prop = {
                                            name: "",
                                            value: null
                                        };
                                        switch (fields[i].type) {
                                            case 'User':
                                            case 'Lookup':
                                                prop.name = fields[i].internalName
                                                prop.value = value.get_lookupId() + ';#' + value.get_lookupValue();
                                                break;
                                            default:
                                                prop.name = fields[i].internalName
                                                prop.value = value;
                                                break;
                                        }
                                        MVD.DataSources.Indicator.lastPlan.push(prop);
                                    }
                                } catch (e) {
                                    console.log('Error en campo ' + fields[i].internalName + ' --- ' + e.message);
                                }
                            }
                        }
                        getListIndicatorsValues();
                    }
                }, function (args) {
                    console.warn("Error ejecutando query en /Lists/IndicatorsPlans. Error: ", args);
                }, null);

        })
        .catch(function (args) { console.warn(args); })

    function getListIndicatorsValues() {
        MVD.SPHelpers.Fields.getListFields(_spPageContextInfo.webServerRelativeUrl, '/Lists/IndicatorsValues')
            .then(function (fields) {
                var queryText = '<View><Query><Where><Eq><FieldRef Name="IndicatorPlan" LookupId="True" /><Value Type="Lookup">' + MVD.DataSources.Indicator.lastPlan[MVD.DataSources.Indicator.lastPlan.length - 1].value + '</Value></Eq></Where><OrderBy><FieldRef Name="ID" Ascending="FALSE" /></OrderBy></Query></View>';
                MVD.SPHelpers.ListItems.getListItems(_spPageContextInfo.webServerRelativeUrl, '/Lists/IndicatorsValues', queryText, function (items) {
                    if (items && items.get_count() > 0) {
                        var enumerator = items.getEnumerator();
                        while (enumerator.moveNext()) {
                            var puntoDeControl = [];
                            var listItem = enumerator.get_current();
                            for (var i = 0; i < fields.length; i++) {
                                try {
                                    var value = listItem.get_item(fields[i].internalName);
                                    if (value) {
                                        var prop = {
                                            name: "",
                                            value: null
                                        };
                                        switch (fields[i].type) {
                                            case 'User':
                                            case 'Lookup':
                                                prop.name = fields[i].internalName
                                                prop.value = value.get_lookupId() + ';#' + value.get_lookupValue();
                                                break;
                                            default:
                                                prop.name = fields[i].internalName
                                                prop.value = value;
                                                break;
                                        }
                                        puntoDeControl.push(prop);
                                    }
                                } catch (e) {
                                    console.log('Error en campo ' + fields[i].internalName + ' --- ' + e.message);
                                }
                            }
                            MVD.DataSources.Indicator.lastPlanControlPoints.push(puntoDeControl);
                        }
                    }
                }, function (args) {
                    console.warn("Error ejecutando query en /Lists/IndicatorsValues. Error: ", args);
                }, null);
            })
            .catch(function (args) { console.warn(args); })
    }
};