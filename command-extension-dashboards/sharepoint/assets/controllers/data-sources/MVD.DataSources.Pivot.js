var MVD = MVD || {};
MVD.DataSources = MVD.DataSources || {};
MVD.DataSources.Pivot = MVD.DataSources.Pivot || {};


MVD.DataSources.Pivot.getDataSourceSettings = function (pivotId) {
    var dataSourceSettings = {};
    try {
        var pivotSettings = ej.base.getComponent(document.getElementById(pivotId), 'pivotview').dataSourceSettings.properties;
    } catch (e) {
        return dataSourceSettings;
    }
    for (var key in pivotSettings) {
        if (['values', 'rows', 'columns', 'calculatedFieldSettings', 'filterSettings', 'filters', 'sortSettings', 'conditionalFormatSettings', 'formatSettings'].includes(key)) {
            if (pivotSettings[key].length > 0) {
                dataSourceSettings[key] = [];
                for (var i = 0; i < pivotSettings[key].length; i++) {
                    dataSourceSettings[key].push((pivotSettings[key][i].properties) ? pivotSettings[key][i].properties : pivotSettings[key][i]);
                }
            } else {
                dataSourceSettings[key] = [];
            }
        }
        else if (['showSubTotals', 'showRowSubTotals', 'showColumnSubTotals', 'showGrandTotals', 'showRowGrandTotals', 'showColumnGrandTotals'].includes(key)) {
            dataSourceSettings[key] = pivotSettings[key];
        }
    }
    return dataSourceSettings;
};

MVD.DataSources.Pivot.getData = function (opts) {
    var data;
    var sourceData = opts.dataSource.data;
    if (opts.dataSource.values.count == 0) {
        return Enumerable.from([]);
    }
    var enumData = Enumerable.from(sourceData);
    var enumRows = Enumerable.from(opts.dataSource.rows);
    if (opts.rowsLevel !== undefined) {
        enumRows = enumRows.take(opts.rowsLevel);
    }
    var enumCols = Enumerable.from(opts.dataSource.columns);
    if (opts.columnsLevel !== undefined) {
        enumCols = enumCols.take(opts.columnsLevel);
    }
    var enumVals = Enumerable.from(opts.dataSource.values);
    var calcAcum = enumVals.any(function (e) { return e.type === 'RunningTotals' });
    var formulas = Enumerable.from(opts.dataSource.calculatedFieldSettings).toObject('$.name',
        function (e) {
            if (e.formula.toLowerCase().indexOf('"RunningTotals(') >= 0 || e.formula.toLowerCase().indexOf("'RunningTotals(") >= 0) {
                calcAcum = true;
            }
            return { formula: e.formula, expressionsArray: MVD.DataSources.Pivot.getExpressionsArray(e.formula) }
        }
    );
    enumData = MVD.DataSources.Pivot.filterData(enumData, opts.dataSource.filterSettings);
    enumData = MVD.DataSources.Pivot.filterDataMeasures(enumData, opts.dataSource.filterSettings, enumVals, formulas);
    enumData = MVD.DataSources.Pivot.orderData(enumData, enumRows, opts.dataSource.sortSettings);

    var valueFieldsNames = MVD.DataSources.Pivot.getValuesFieldsNames(enumCols, enumData);
    var emptyObject = MVD.DataSources.Pivot.getEmptyObject(enumCols, enumData, enumVals, opts.emptyValues, valueFieldsNames);
    var dataAcum = Enumerable.from([]);
    var lastKey;

    if (opts.concatRowDimensionsField) { //revisar que concatRowDimensionsField no se encuentre dentro de una columna a retornar
        var auxConcatRowDimensionsField = opts.concatRowDimensionsField;
        var i = 0;
        var emptyObj = MVD.DataSources.Pivot.getEmptyObject(enumCols, enumData, enumVals, null, valueFieldsNames);
        while (enumRows.any(function (r) { return r.name == opts.concatRowDimensionsField }) || emptyObj[opts.concatRowDimensionsField] !== undefined) {
            i += 1;
            opts.concatRowDimensionsField = auxConcatRowDimensionsField + i;
        }
    } else if (enumRows.count() > 1) {
        opts.concatRowDimensionsField = MVD.DataSources.Pivot.getConcatRowsDimensionFields(opts.dataSource.rows, opts.rowsLevel); //enumRows.toJoinedString('-', function(rowObj) { return rowObj.name });
    }

    data = enumData.groupBy(
        function (e) {
            return enumRows.toJoinedString('-', function (rowObj) { return e[rowObj.name] });
        }, "",
        function (key, col) {
            var ret = Object.assign({}, emptyObject);
            enumRows.forEach(function (rowObj) {
                ret[rowObj.name] = col.first()[rowObj.name];
            });
            if (opts.concatRowDimensionsField) {
                ret[opts.concatRowDimensionsField] = key;
            }
            if (calcAcum) {
                var actualKey = enumRows.take(enumRows.count() - 1).toJoinedString('-', function (colObj) { return col.first()[colObj.name] });
                if (lastKey !== actualKey) {
                    dataAcum = col;
                    lastKey = actualKey;
                } else {
                    dataAcum = dataAcum.concat(col);
                }
            }
            col.groupBy(
                function (e2) {
                    return enumCols.toJoinedString('-', function (colObj) { return e2[colObj.name] });
                },
                "",
                function (key2, col2) {
                    MVD.DataSources.Pivot.calculateValues(enumVals, ret, col2,
                        dataAcum.where(function (d) {
                            var ret = true;
                            enumCols.forEach(function (colObj) {
                                if (d[colObj.name] != col2.first()[colObj.name]) {
                                    ret = false;
                                    return false;
                                }
                            });
                            return ret;
                        }),
                        key2 ? key2 + '-' : '', formulas, false);
                }
            ).toArray(); //es necesario el toArray para que ejecute el calculateValues
            return ret;
        });
    data = MVD.DataSources.Pivot.calculatePostFormulas(data, enumVals, valueFieldsNames, enumRows, enumCols);
    return data.toArray();
};

MVD.DataSources.Pivot.getDetailData = function (opts, columnName, row) {
    //if (!row || !columnName) return opts.dataSource.data;
    var enumRows = Enumerable.from(opts.dataSource.rows);
    if (opts.rowsLevel !== undefined) {
        enumRows = enumRows.take(opts.rowsLevel);
    }
    var enumCols = Enumerable.from(opts.dataSource.columns);
    if (opts.columnsLevel !== undefined) {
        enumCols = enumCols.take(opts.columnsLevel);
    }
    var enumData = Enumerable.from(opts.dataSource.data);

    var enumVals = Enumerable.from(opts.dataSource.values);
    var calcAcum = enumVals.any(function (e) { return e.type === 'RunningTotals' });
    var formulas = Enumerable.from(opts.dataSource.calculatedFieldSettings).toObject('$.name',
        function (e) {
            if (e.formula.toLowerCase().indexOf('"RunningTotals(') >= 0 || e.formula.toLowerCase().indexOf("'RunningTotals(") >= 0) {
                calcAcum = true;
            }
            return { formula: e.formula, expressionsArray: MVD.DataSources.Pivot.getExpressionsArray(e.formula) }
        }
    );
    enumData = MVD.DataSources.Pivot.filterData(enumData, opts.dataSource.filterSettings);
    enumData = MVD.DataSources.Pivot.filterDataMeasures(enumData, opts.dataSource.filterSettings, enumVals, formulas);
    enumData = MVD.DataSources.Pivot.orderData(enumData, enumRows, opts.dataSource.sortSettings);
    var retData = (row) ? enumData.where(function (r) {
        var ret = true;
        enumRows.forEach(function (rowObj) {
            if (r[rowObj.name] != row[rowObj.name]) {
                ret = false;
                return false;
            }
        });
        return ret;
    }) : enumData;
    if (columnName && opts.dataSource.columns && opts.dataSource.columns.length > 0) {
        var colValues;
        var valueFieldsNames = MVD.DataSources.Pivot.getValuesFieldsNames(enumCols, enumData);
        valueFieldsNames.forEach(function (valFieldName) {
            var fieldName = valFieldName.fields.join('-') + '-';
            if (columnName.startsWith(fieldName)) {
                colValues = valFieldName.fields;
                return false;
            }
        });
        if (colValues) {
            retData = retData.where(function (r) {
                var ret = true;
                enumCols.forEach(function (colObj, index) {
                    if (r[colObj.name] != colValues[index]) {
                        ret = false;
                        return false;
                    }
                });
                return ret;
            });
        }
    }
    return retData.toArray();
};

MVD.DataSources.Pivot.getFields = function (dataSourceSettings, extraSettings) {
    return new Promise(function (resolve, reject) {
        var fields = [];
        var dynamicFields = [];
        if (extraSettings.transpose) {
            fields.push({
                internalName: 'x',
                name: 'x',
                type: 'NotNumber',
                allowedUseInUI: true
            });
            if (dataSourceSettings.rows.length > 0) {
                for (var i = 0; i < dataSourceSettings.rows.length; i++) {
                    var aux = {
                        internalName: dataSourceSettings.rows[i].name,
                        name: dataSourceSettings.rows[i].caption,
                        type: 'Number',
                        allowedUseInUI: true
                    }
                    dynamicFields.push(aux);
                }
            } else {
                fields.push({
                    internalName: 'y',
                    name: 'y',
                    type: 'Number',
                    allowedUseInUI: true
                });
            }
        }
        else {
            var internalName = MVD.DataSources.Pivot.getConcatRowsDimensionFields(dataSourceSettings.rows, extraSettings.rowsLevel);
            var name = MVD.DataSources.Pivot.getCaptionConcatRowsDimensionFields(dataSourceSettings.rows, extraSettings.rowsLevel);
            if (!internalName) internalName = 'x';
            if (!name) name = 'x';
            fields.push({
                internalName: internalName,
                name: name,
                type: 'NotNumber',
                allowedUseInUI: true
            });
            if (extraSettings.columnsLevel > 0 && dataSourceSettings.columns.length > 0) {
                for (var i = 0; i < dataSourceSettings.values.length; i++) {
                    var aux = {
                        internalName: dataSourceSettings.values[i].name,
                        name: dataSourceSettings.values[i].caption,
                        type: 'Number',
                        allowedUseInUI: true
                    }
                    dynamicFields.push(aux);
                }
            }
            else {
                for (var i = 0; i < dataSourceSettings.values.length; i++) {
                    var aux = {
                        internalName: dataSourceSettings.values[i].name,
                        name: dataSourceSettings.values[i].caption,
                        type: 'Number',
                        allowedUseInUI: true
                    }
                    fields.push(aux);
                    //fields.push(JSON.parse(JSON.stringify(dataSourceSettings.values[i])));
                    //fields[fields.length - 1].internalName = fields[fields.length - 1].name;
                    //fields[fields.length - 1].name = fields[fields.length - 1].caption;
                    //fields[fields.length - 1].type = 'Number';
                }
            }
        }
        resolve({ fields: fields, dynamicFields: dynamicFields });
    });
};

MVD.DataSources.Pivot.filterData = function (enumData, filterSettings) {
    if (!filterSettings) return enumData;
    filterSettings.forEach(function (filter) {
        if (filter.type === 'Include' || filter.type === 'Exclude') {
            enumData = enumData.where(function (d) {
                if (filter.type === 'Include') {
                    return (typeof d[filter.name] !== 'undefined' && ((d[filter.name] === null && filter.items.includes('null')) || (d[filter.name] !== null && filter.items.indexOf(d[filter.name].toString()) >= 0)));
                } else if (filter.type === 'Exclude') {
                    return (typeof d[filter.name] !== 'undefined' && ((d[filter.name] === null && filter.items.includes('null')) || (d[filter.name] !== null && filter.items.indexOf(d[filter.name].toString()) < 0)));
                }
            });
        } else if (filter.type === 'Label') {
            filter.value1 = filter.value1.toLowerCase();
            if (filter.value2) filter.value2 = filter.value2.toLowerCase();
            enumData = enumData.where(function (d) {
                if (filter.condition === 'Equals') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase() == filter.value1);
                } else if (filter.condition === 'DoesNotEquals') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase() != filter.value1);
                } else if (filter.condition === 'BeginWith') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase().startsWith(filter.value1));
                } else if (filter.condition === 'DoesNotBeginWith') {
                    return (d[filter.name] !== null && !(d[filter.name].toLowerCase().startsWith(filter.value1)));
                } else if (filter.condition === 'EndsWith') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase().endsWith(filter.value1));
                } else if (filter.condition === 'DoesNotEndsWith') {
                    return (d[filter.name] !== null && !(d[filter.name].toLowerCase().endsWith(filter.value1)));
                } else if (filter.condition === 'Contains') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase().indexOf(filter.value1) !== -1);
                } else if (filter.condition === 'DoesNotContains') {
                    return (d[filter.name] !== null && !(d[filter.name].toLowerCase().indexOf(filter.value1) === -1));
                } else if (filter.condition === 'GreaterThan') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase() > filter.value1);
                } else if (filter.condition === 'GreaterThanOrEqualTo') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase() >= filter.value1);
                } else if (filter.condition === 'LessThan') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase() < filter.value1);
                } else if (filter.condition === 'LessThanOrEqualTo') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase() <= filter.value1);
                } else if (filter.condition === 'Between') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase() >= filter.value1 && d[filter.name].toLowerCase() <= filter.value2);
                } else if (filter.condition === 'NotBetween') {
                    return (d[filter.name] !== null && d[filter.name].toLowerCase() < filter.value1 || d[filter.name].toLowerCase() > filter.value2);
                }
            });
        } else if (filter.type === 'Date' || filter.type === 'Number') {
            enumData = enumData.where(function (d) {
                if (filter.condition === 'Equals') {
                    return (d[filter.name] !== null && d[filter.name] == filter.value1);
                } else if (filter.condition === 'DoesNotEquals') {
                    return (d[filter.name] !== null && d[filter.name] != filter.value1);
                } else if (filter.condition === 'GreaterThan' || filter.condition === 'After') {
                    return (d[filter.name] !== null && d[filter.name] > filter.value1);
                } else if (filter.condition === 'GreaterThanOrEqualTo' || filter.condition === 'AfterOrEqualTo') {
                    return (d[filter.name] !== null && d[filter.name] >= filter.value1);
                } else if (filter.condition === 'LessThan' || filter.condition === 'Before') {
                    return (d[filter.name] !== null && d[filter.name] < filter.value1);
                } else if (filter.condition === 'LessThanOrEqualTo' || filter.condition === 'BeforeOrEqualTo') {
                    return (d[filter.name] !== null && d[filter.name] <= filter.value1);
                } else if (filter.condition === 'Between') {
                    return (d[filter.name] !== null && d[filter.name] >= filter.value1 && d[filter.name] <= filter.value2);
                } else if (filter.condition === 'NotBetween') {
                    return (d[filter.name] !== null && d[filter.name] < filter.value1 || d[filter.name] > filter.value2);
                }
            });
        }
    })
    return enumData;
};

MVD.DataSources.Pivot.filterDataMeasures = function (enumData, filterSettings, enumVals, formulas) {
    if (!filterSettings) return enumData;
    filterSettings.forEach(function (filter) {
        if (filter.type === 'Value') {
            enumValsToCalc = enumVals.where(function (v) { return v.name === filter.measure });
            var membersToInclude = enumData.groupBy(
                    function (e) {
                        return e[filter.name];
                    }, "",
                    function (key, col) {
                        var d = {};
                        MVD.DataSources.Pivot.calculateValues(enumValsToCalc, d, col, col, null, formulas);
                        return { key: key, value: d[filter.measure] };
                    }).where(function (g) {
                        if (filter.condition === 'Equals') {
                            return g.value === filter.value1;
                        } else if (filter.condition === 'DoesNotEquals') {
                            return g.value !== filter.value1;
                        } else if (filter.condition === 'GreaterThan') {
                            return g.value > filter.value1;
                        } else if (filter.condition === 'GreaterThanOrEqualTo') {
                            return g.value >= filter.value1;
                        } else if (filter.condition === 'LessThan') {
                            return g.value < filter.value1;
                        } else if (filter.condition === 'LessThanOrEqualTo') {
                            return g.value <= filter.value1;
                        } else if (filter.condition === 'Between') {
                            return g.value >= filter.value1 && g.value <= filter.value2;
                        } else if (filter.condition === 'NotBetween') {
                            return g.value < filter.value1 || g.value > filter.value2;
                        }
                    }).select(function (g) { return g.key })
                .toArray();

            enumData = enumData.where(function (e) { return membersToInclude.indexOf(e[filter.name]) !== -1 });
        }
    });
    return enumData;
};

MVD.DataSources.Pivot.orderData = function (enumData, enumRows, sortSettings) {
    enumRows.forEach(function (rowObj, i) {
        var orderSetting = Enumerable.from(sortSettings).firstOrDefault(function (s) { return s.name === rowObj.name });
        if (!orderSetting || orderSetting.order !== 'Descending') {
            if (i === 0) {
                enumData = enumData.orderBy(function (e) { return e[rowObj.name] });
            } else {
                enumData = enumData.thenBy(function (e) { return e[rowObj.name] });
            }
        } else {
            if (i === 0) {
                enumData = enumData.orderByDescending(function (e) { return e[rowObj.name] });
            } else {
                enumData = enumData.thenByDescending(function (e) { return e[rowObj.name] });
            }
        }
    });
    return enumData;
};

MVD.DataSources.Pivot.calculateValues = function (enumVals, ret, col, colAcum, prefix, formulas) {
    if (!prefix) prefix = '';
    enumVals.forEach(function (colVal) {
        if (formulas[colVal.name]) {
            ret[prefix + colVal.name] = MVD.DataSources.Pivot.getEvaluateExpressions(formulas[colVal.name].formula, formulas[colVal.name].expressionsArray, col, colAcum);
        } else {
            ret[prefix + colVal.name] = MVD.DataSources.Pivot.evaluateSimpleFunction(colVal.type, colVal.name, col, colAcum);
        }
    });
};

MVD.DataSources.Pivot.calculatePostFormulas = function (enumResultData, enumVals, valueFieldsNames, enumRows, enumCols) {
    var columnTots = {};
    var grandTots = {};
    enumResultData = Enumerable.from(enumResultData.toArray());
    var enumValsToCalcTots = enumVals.where(function (valField) {
        return valField.type === 'Index' ||
        (valField.type ? valField.type : 'Sum').toLowerCase().startsWith('percentage')
    });
    enumValsToCalcTots.forEach(function (colObj) {
        //console.log(colObj.name, '.type=', colObj.type);
        grandTots[colObj.name] = 0;
        if (valueFieldsNames.length > 0) {
            valueFieldsNames.forEach(function (valFieldName) {
                var fieldName = valFieldName.fields.join('-') + '-' + colObj.name;
                columnTots[fieldName] = enumResultData.sum(function (e2) { return zeroIfNull(e2[fieldName]) });
                grandTots[colObj.name] += columnTots[fieldName];
            });
        } else {
            columnTots[colObj.name] = enumResultData.sum(function (e2) { return zeroIfNull(e2[colObj.name]) });
            grandTots[colObj.name] = columnTots[colObj.name];
        }
    });

    var parentTots = {};
    var parentRowsTots = {};
    var differencesToClear = [];
    var enumValsToCalcPostFormulas = enumVals.where(function (valField) {
        return valField.type === 'DifferenceFrom' || valField.type === 'Index' ||
        (valField.type ? valField.type : 'Sum').toLowerCase().startsWith('percentage')
    });
    enumResultData.forEach(function (result) {
        enumValsToCalcPostFormulas.forEach(function (colObj) {
            if (valueFieldsNames.length > 0) {
                MVD.DataSources.Pivot.calculatePostFormulasWithColumns(result, colObj, enumResultData, enumVals, valueFieldsNames, enumRows, enumCols, parentTots, parentRowsTots, grandTots, columnTots, differencesToClear);
            } else { //no hay columnas
                MVD.DataSources.Pivot.calculatePostFormulasWithoutColumns(result, colObj, enumResultData, enumVals, valueFieldsNames, enumRows, parentTots, parentRowsTots, grandTots, columnTots, differencesToClear);
            }
        });
    });
    differencesToClear.forEach(function (d) {
        d.row[d.field] = null;
    });
    return enumResultData;

    function zeroIfNull(n) {
        return n ? n : 0;
    }
    //console.log(grandTots);
};

MVD.DataSources.Pivot.calculatePostFormulasWithColumns = function (result, colObj, enumResultData, enumVals, valueFieldsNames, enumRows, enumCols, parentTots, parentRowsTots, grandTots, columnTots, differencesToClear) {
    var parentColumnsTots = {};
    var rowTot = null;
    if (colObj.type === 'Index' || colObj.type === 'PercentageOfRowTotal') {
        rowTot = 0;
        valueFieldsNames.forEach(function (valFieldName2) {
            var fieldName2 = valFieldName2.fields.join('-') + '-' + colObj.name;
            rowTot += zeroIfNull(result[fieldName2]);
        });
    }
    valueFieldsNames.forEach(function (valFieldName) {
        var fieldName = valFieldName.fields.join('-') + '-' + colObj.name;
        if (colObj.type === 'DifferenceFrom' || colObj.type === 'PercentageOfDifferenceFrom') {
            MVD.DataSources.Pivot.calculateDifferenceWithColumns(result, valFieldName, fieldName, colObj, enumResultData, enumRows, enumCols, differencesToClear);
        } else if (colObj.type === 'Index') {
            result[fieldName] = (result[fieldName] * grandTots[colObj.name]) / (columnTots[fieldName] * rowTot);
        } else if (colObj.type === 'PercentageOfGrandTotal') {
            result[fieldName] = result[fieldName] / grandTots[colObj.name];
        } else if (colObj.type === 'PercentageOfColumnTotal') {
            result[fieldName] = result[fieldName] / columnTots[fieldName];
        } else if (colObj.type === 'PercentageOfRowTotal') {
            result[fieldName] = result[fieldName] / rowTot;
        } else if (colObj.type === 'PercentageOfParentTotal') {
            if (!parentTots[fieldName]) {
                parentTots[fieldName] = {};
                enumResultData.groupBy(
                    function (e) { return e[enumRows.first().name] },
                    '',
                    function (key, col) {
                        parentTots[fieldName][key] = col.sum(function (e2) { return zeroIfNull(e2[fieldName]) });
                        //console.log('parentTots[', fieldName, '][', key, ']', parentTots[fieldName][key]);
                    }
                ).toArray();
            }
            result[fieldName] = result[fieldName] / parentTots[fieldName][result[enumRows.first().name]];
        } else if (colObj.type === 'PercentageOfParentColumnTotal') {
            if (!parentColumnsTots[colObj.name]) {
                parentColumnsTots[colObj.name] = {};
                enumResultData.groupBy(
                    function (e) { return enumRows.toJoinedString('-', function (rowObj) { return e[rowObj.name] }); },
                    '',
                    function (key, col) {
                        parentColumnsTots[colObj.name][key] = col.sum(
                            function (e2) {
                                var sumColTot = 0;
                                valueFieldsNames.forEach(function (valFieldName) {
                                    var fieldName = valFieldName.fields.join('-') + '-' + colObj.name;
                                    sumColTot += zeroIfNull(e2[fieldName])
                                });
                                return sumColTot;
                            });
                    }
                ).toArray();
            }
            var auxKey = enumRows.toJoinedString('-', function (rowObj) { return result[rowObj.name] });
            result[fieldName] = result[fieldName] / parentColumnsTots[colObj.name][auxKey];
        } else if (colObj.type === 'PercentageOfParentRowTotal') {
            if (!parentRowsTots[fieldName]) {
                parentRowsTots[fieldName] = {};
                enumResultData.groupBy(
                    function (e) { return '-' + enumRows.take(enumRows.count() - 1).toJoinedString('-', function (rowObj) { return e[rowObj.name] }); },
                    '',
                    function (key, col) {
                        parentRowsTots[fieldName][key] = col.sum(function (e2) { return zeroIfNull(e2[fieldName]) });
                    }
                ).toArray();
                //console.log('parentRowsTots', parentRowsTots);
            }
            var auxKey = '-' + enumRows.take(enumRows.count() - 1).toJoinedString('-', function (rowObj) { return result[rowObj.name] });
            result[fieldName] = result[fieldName] / parentRowsTots[fieldName][auxKey];
        }
    });

    function zeroIfNull(n) {
        return n ? n : 0;
    }
};

MVD.DataSources.Pivot.calculateDifferenceWithColumns = function (result, valFieldName, fieldName, colObj, enumResultData, enumRows, enumCols, differencesToClear) {
    if ((colObj.type === 'DifferenceFrom' || colObj.type === 'PercentageOfDifferenceFrom')
        && enumRows.last().name !== colObj.baseField && enumCols.last().name !== colObj.baseField) {
        result[fieldName] = null;
        return;
    }
    if (enumCols.last().name === colObj.baseField) {
        var aux = [];
        for (var i = 0; i < valFieldName.fields.length - 1; i++) {
            aux.push(valFieldName.fields[i]);
        }
        aux.push(colObj.baseItem);
        aux.push(colObj.name);
        var colDifference = aux.join('-');
        if (fieldName !== colDifference) {
            if (colObj.type === 'DifferenceFrom') {
                result[fieldName] = result[fieldName] - result[colDifference];
            } else {
                result[fieldName] = (result[fieldName] - result[colDifference]) / result[colDifference];
            }
        } else {
            differencesToClear.push({ row: result, field: colDifference });
        }
    } else {
        if (result[colObj.baseField] == colObj.baseItem) {
            differencesToClear.push({ row: result, field: fieldName });
            return;
        }
        var key = {};
        enumRows.take(enumRows.count() - 1).forEach(function (r) {
            key[r.name] = result[r.name];
        });
        key[colObj.baseField] = colObj.baseItem;
        var rowDif = enumResultData.firstOrDefault(function (r) {
            for (var prop in key) {
                if (r[prop] !== key[prop]) return false;
            }
            return true;
        });
        if (rowDif) {
            if (colObj.type === 'DifferenceFrom') {
                result[fieldName] = result[fieldName] - rowDif[fieldName];
            } else {
                result[fieldName] = (result[fieldName] - rowDif[fieldName]) / rowDif[fieldName];
            }
        } else {
            result[fieldName] = null;
        }
    }
};

MVD.DataSources.Pivot.calculatePostFormulasWithoutColumns = function (result, colObj, enumResultData, enumVals, valueFieldsNames, enumRows, parentTots, parentRowsTots, grandTots, columnTots, differencesToClear) {
    if (colObj.type === 'DifferenceFrom' || colObj.type === 'PercentageOfDifferenceFrom') {
        if ((colObj.type === 'DifferenceFrom' || colObj.type === 'PercentageOfDifferenceFrom')
            && enumRows.last().name !== colObj.baseField) {
            result[colObj.name] = null;
            return;
        }
        if (result[colObj.baseField] == colObj.baseItem) {
            differencesToClear.push({ row: result, field: colObj.name });
            return;
        }
        var key = {};
        enumRows.take(enumRows.count() - 1).forEach(function (r) {
            key[r.name] = result[r.name];
        });
        key[colObj.baseField] = colObj.baseItem;
        var rowDif = enumResultData.firstOrDefault(function (r) {
            for (var prop in key) {
                if (r[prop] !== key[prop]) return false;
            }
            return true;
        });
        if (rowDif) {
            if (colObj.type === 'DifferenceFrom') {
                result[colObj.name] = result[colObj.name] - rowDif[colObj.name];
            } else {
                result[colObj.name] = (result[colObj.name] - rowDif[colObj.name]) / rowDif[colObj.name];
            }
        } else {
            result[colObj.name] = null;
        }
    } else if (colObj.type === 'Index') {
        //result[colObj.name] = (result[colObj.name] * grandTots[colObj.name]) / (columnTots[colObj.name] * result[colObj.name]);
        result[colObj.name] = 1 //Siempre da 1 sin columnas
    } else if (colObj.type === 'PercentageOfParentTotal') {
        if (!parentTots[colObj.name]) {
            parentTots[colObj.name] = {};
            enumResultData.groupBy(
                function (e) { return e[enumRows.first().name] },
                '',
                function (key, col) {
                    parentTots[colObj.name][key] = col.sum(function (e2) { return e2[colObj.name] });
                    //console.log('parentTots[', colObj.name, '][', key, ']', parentTots[colObj.name][key]);
                }
            ).toArray();
        }
        result[colObj.name] = result[colObj.name] / parentTots[colObj.name][result[enumRows.first().name]];
    } else if (colObj.type === 'PercentageOfParentColumnTotal') {
        result[colObj.name] = null;
    } else if (colObj.type === 'PercentageOfParentRowTotal') {
        if (!parentRowsTots[colObj.name]) {
            parentRowsTots[colObj.name] = {};
            enumResultData.groupBy(
                function (e) {
                    return '-' + enumRows.take(enumRows.count() - 1).toJoinedString('-', function (rowObj) { return e[rowObj.name] });
                },
                '',
                function (key, col) {
                    parentRowsTots[colObj.name][key] = col.sum(function (e2) { return zeroIfNull(e2[colObj.name]) });
                    //console.log('parentRowsTots[', colObj.name, '][', key, ']', parentRowsTots[colObj.name][key]);
                }
            ).toArray();
            console.log('parentRowsTots', parentRowsTots);
        }
        var auxKey = '-' + enumRows.take(enumRows.count() - 1).toJoinedString('-', function (rowObj) { return result[rowObj.name] });
        result[colObj.name] = result[colObj.name] / parentRowsTots[colObj.name][auxKey];
    } else if (colObj.type === 'PercentageOfRowTotal') {
        result[colObj.name] = 1;
    } else {
        result[colObj.name] = result[colObj.name] / grandTots[colObj.name];
    }

    function zeroIfNull(n) {
        return n ? n : 0;
    }
};

MVD.DataSources.Pivot.getExpressionsArray = function (formula) {
    var expressionsArray = formula.match(/['"].*?['"]/g);
    expressionsArray = expressionsArray.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
    return expressionsArray;
};

MVD.DataSources.Pivot.getEvaluateExpressions = function (formula, exp, enumerable, enumerableAcum) {
    var evaluatedExp = {};
    for (var i = 0; i < exp.length; i++) {
        var keyField = exp[i].match(/\(+.*?\)+/g);
        keyField = keyField[0].substring(1, keyField[0].length - 1); //quitar parentesis y "
        var func = exp[i].substr(1, exp[i].indexOf('(') - 1);
        evaluatedExp[exp[i]] = MVD.DataSources.Pivot.evaluateSimpleFunction(func, keyField, enumerable, enumerableAcum);
    }
    for (var keyExp in evaluatedExp) {
        var escapedKeyExp = keyExp.replace(/(?=[()])/g, '\\');
        formula = formula.replace(new RegExp(escapedKeyExp, 'g'), evaluatedExp[keyExp]);
    }
    return eval(formula);
};

MVD.DataSources.Pivot.evaluateSimpleFunction = function (func, field, enumerable, enumerableAcum) {
    if (!func) {
        func = 'Sum';
    }
    func = func.toLowerCase();
    if (func === 'sum' || func.startsWith('percentage') || func === 'runningtotals' || func === 'differencefrom' || func === 'index') {
        return enumerable.sum(function (e) { return zeroIfNull(e[field]) });
    } else if (func === 'runningtotals') {
        return enumerableAcum.sum(function (e) { return zeroIfNull(e[field]) });
    } else if (func === 'avg') {
        return enumerable.average(function (e) { return zeroIfNull(e[field]) });
    } else if (func === 'min') {
        return enumerable.min(function (e) { return zeroIfNull(e[field]) });
    } else if (func === 'max') {
        return enumerable.max(function (e) { return zeroIfNull(e[field]) });
    } else if (func === 'count') {
        return enumerable.count(function (e) { return zeroIfNull(e[field]) });
    } else if (func === 'distinctcount') {
        return enumerable.distinct(function (e) { return zeroIfNull(e[field]) }).count();
    } else if (func === 'populationstdev') {
        return MVD.DataSources.Pivot.calcPopulationStDev(enumerable, field);
    } else if (func === 'samplestdev') {
        return MVD.DataSources.Pivot.calcSampleStDev(enumerable, field);
    } else if (func === 'populationvar') {
        return MVD.DataSources.Pivot.calcPopulationVar(enumerable, field);
    } else if (func === 'samplevar') {
        return MVD.DataSources.Pivot.calcSampleVar(enumerable, field);
    } else if (func === 'product') {
        return MVD.DataSources.Pivot.calcProduct(enumerable, field);
    } else if (func === 'median') {
        return MVD.DataSources.Pivot.calcMedian(enumerable, field);
    } else {
        return null;
    }

    function zeroIfNull(n) {
        return n ? n : 0;
    }
};

MVD.DataSources.Pivot.calcVarianceAux = function (enumerable, field) {
    enumerable = enumerable.where(function (e) { return e[field] !== undefined && e[field] !== null });
    var count = enumerable.count();
    var avg = enumerable.average(function (e) { return e[field] });
    var ret = { count: count, varianceAux: enumerable.sum(function (e) { return Math.pow(e[field] - avg, 2) }) };
    //console.log(field, ret);
    return ret;
};

MVD.DataSources.Pivot.calcPopulationVar = function (enumerable, field) {
    var aux = MVD.DataSources.Pivot.calcVarianceAux(enumerable, field);
    return aux.varianceAux / (aux.count)
};

MVD.DataSources.Pivot.calcSampleVar = function (enumerable, field) {
    var aux = MVD.DataSources.Pivot.calcVarianceAux(enumerable, field);
    return aux.varianceAux / (aux.count - 1)
};

MVD.DataSources.Pivot.calcPopulationStDev = function (enumerable, field) {
    return Math.sqrt(MVD.DataSources.Pivot.calcPopulationVar(enumerable, field));
};

MVD.DataSources.Pivot.calcSampleStDev = function (enumerable, field) {
    return Math.sqrt(MVD.DataSources.Pivot.calcSampleVar(enumerable, field));
};

MVD.DataSources.Pivot.calcProduct = function (enumerable, field) {
    var data = enumerable.where(function (e) { return e[field] !== undefined && e[field] !== null }).select(function (e) { return e[field] }).toArray();
    var ret = data[0];
    for (var i = 1; i < data.length; i++) {
        ret *= data[i];
    }
    return ret;
};

MVD.DataSources.Pivot.calcMedian = function (enumerable, field) {
    var values = enumerable.where(function (e) { return e[field] !== undefined && e[field] !== null }).select(function (e) { return e[field] }).toArray();
    if (values.length === 0) return 0;

    values.sort(function (a, b) {
        return a - b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];

    return (values[half - 1] + values[half]) / 2.0;
};

MVD.DataSources.Pivot.getValuesFieldsNames = function (enumCols, enumData) {
    var ret = null;
    enumCols.forEach(function (colObj) {
        var dist = enumData.distinct(function (e) { return e[colObj.name] })
            .select(function (e) { return e[colObj.name] });
        if (!ret) {
            ret = dist.select(function (e2) { return { fields: [e2] } });
        } else {
            ret = ret.selectMany(function (e) {
                return dist.select(
                    function (e2) {
                        var aux = e.fields.slice(0);
                        aux.push(e2);
                        return { fields: aux }
                    })
            });
        }
    })
    return (!ret) ? [] : ret.toArray();
};

MVD.DataSources.Pivot.getEmptyObject = function (enumCols, enumData, enumVals, emptyValues, valueFieldsNames) {
    var ret = {};
    if (emptyValues === undefined) {
        return ret;
    }
    enumVals.forEach(function (colVal) {
        if (valueFieldsNames.length === 0) {
            ret[colVal.name] = 0;
        } else {
            valueFieldsNames.forEach(function (e) {
                if (emptyValues !== null && typeof emptyValues === 'object') {
                    if (emptyValues[colVal.name] !== undefined) {
                        ret[e.fields.join('-') + '-' + colVal.name] = emptyValues[colVal.name];
                    }
                } else {
                    ret[e.fields.join('-') + '-' + colVal.name] = emptyValues;
                }
            });
        }
    });
    return ret;
};

MVD.DataSources.Pivot.getConcatRowsDimensionFields = function (rows, level) {
    return Enumerable.from(rows).take(level).toJoinedString('-', function (rowObj) { return rowObj.name });
};

MVD.DataSources.Pivot.getCaptionConcatRowsDimensionFields = function (rows, level) {
    try {
        return Enumerable.from(rows).take(level).toJoinedString('-', function (rowObj) { return rowObj.caption });
    } catch (e) {
        return Enumerable.from(rows).take(level).toJoinedString('-', function (rowObj) { return rowObj.name });
    }
};