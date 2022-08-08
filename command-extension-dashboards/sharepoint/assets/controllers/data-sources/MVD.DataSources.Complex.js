var MVD = MVD || {};
MVD.DataSources = MVD.DataSources || {};
MVD.DataSources.Complex = MVD.DataSources.Complex || {};


MVD.DataSources.Complex.getData = function (source, parameters) {
    return new Promise(function (resolve, reject) {
        var promiseData = [];
        var sourceOne = MVD.DataSources.cacheDataSources.find(element => element.id == source.typeSettings.sourceOneId);
        var sourceTwo = MVD.DataSources.cacheDataSources.find(element => element.id == source.typeSettings.sourceTwoId);
        promiseData.push(MVD.DataSources.getSourceData(sourceOne, parameters));
        promiseData.push(MVD.DataSources.getSourceData(sourceTwo, parameters));
        Promise.all(promiseData)
            .then(function (args) {
                var data = [];
                if (source.typeSettings.operator === 'join') {
                    data = Enumerable.from(args[0]).join(Enumerable.from(args[1]),
                        function (x) {
                            let aux = '';
                            for (var i = 0; i < source.typeSettings.conditions.length; i++) {
                                aux += x[source.typeSettings.conditions[i].field1] + ';#';
                            }
                            return aux;
                        },
                        function (x) {
                            let aux = '';
                            for (var i = 0; i < source.typeSettings.conditions.length; i++) {
                                aux += x[source.typeSettings.conditions[i].field2] + ';#';
                            }
                            return aux;
                        },
                        function (x, y) {
                            let aux = {};
                            for (var i = 0; i < source.typeSettings.fields.length; i++) {
                                var el = (source.typeSettings.fields[i].source === 'sourceOne') ? x : y;
                                aux[source.typeSettings.fields[i].internalName] = el[source.typeSettings.fields[i].internalName];
                            }
                            return aux;
                        }).toArray();
                }
                else if (source.typeSettings.operator === 'leftJoin') {
                    data = Enumerable.from(args[0]).groupJoin(Enumerable.from(args[1]),
                        function (x) {
                            let aux = '';
                            for (var i = 0; i < source.typeSettings.conditions.length; i++) {
                                aux += x[source.typeSettings.conditions[i].field1] + ';#';
                            }
                            return aux;
                        },
                        function (x) {
                            let aux = '';
                            for (var i = 0; i < source.typeSettings.conditions.length; i++) {
                                aux += x[source.typeSettings.conditions[i].field2] + ';#';
                            }
                            return aux;
                        },
                        function (x, y) {
                            return { sourceOne: x, colSourceTwo: y };
                        }).selectMany(function (x) {
                            return x.colSourceTwo.defaultIfEmpty('{}');
                        }, function (leftSource, rigthSource) {
                            let aux = {};
                            for (var i = 0; i < source.typeSettings.fields.length; i++) {
                                var el = (source.typeSettings.fields[i].source === 'sourceOne') ? leftSource : rigthSource;
                                if (el === leftSource) {
                                    aux[source.typeSettings.fields[i].internalName] = leftSource.sourceOne[source.typeSettings.fields[i].internalName];
                                } else {
                                    aux[source.typeSettings.fields[i].internalName] = el[source.typeSettings.fields[i].internalName];
                                }
                            }
                            return aux;
                        }).toArray()
                }
                else if (source.typeSettings.operator === 'union') {
                    data = args[0].concat(args[1]);
                }
                else {
                    let fieldsSourceOne = source.typeSettings.fields.filter(e => e.source === 'sourceOne').map(el => el.internalName);
                    let fieldsSourceTwo = source.typeSettings.fields.filter(e => e.source === 'sourceTwo').map(el => el.internalName);
                    let dataSourceOne = Enumerable.from(args[0]).select(function (value) {
                        let aux = {};
                        fieldsSourceOne.forEach(e => aux[e] = value[e]);
                        return aux;
                    }).toArray();
                    let dataSourceTwo = Enumerable.from(args[1]).select(function (value) {
                        let aux = {};
                        fieldsSourceTwo.forEach(e => aux[e] = value[e]);
                        return aux;
                    }).toArray();
                    dataSourceOne.forEach(function (e) {
                        dataSourceTwo.forEach(function (e2) {
                            let auxE = {};
                            for (let key in e) {
                                auxE[key] = e[key];
                            }
                            for (let key in e2) {
                                if (!auxE[key]) {
                                    auxE[key] = e2[key];
                                } else {
                                    let auxKey = key + '2';
                                    auxE[auxKey] = e2[key];
                                }
                            }
                            data.push(auxE);
                        });
                    });
                }
                resolve(data);
            })
            .catch(function (args) {
                reject(args);
            });
    });
};

MVD.DataSources.Complex.getDetailData = function (source, columnName, row) {
    return [];
};

MVD.DataSources.Complex.getFields = function (source) {
    return new Promise(function (resolve, reject) {
        try {
            resolve({ fields: source.typeSettings.fields, dynamicFields: [] })
        } catch (args) {
            reject(args)
        }
    });
};