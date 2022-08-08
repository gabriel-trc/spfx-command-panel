var MVD = MVD || {};
MVD.DataSources = MVD.DataSources || {};
MVD.DataSources.Javascript = MVD.DataSources.Javascript || {};
MVD.DataSources.Javascript.proxySources = [];
MVD.DataSources.Javascript.parametersProxy = [];


MVD.DataSources.Javascript.getData = function(source, parameters) {
    return new Promise(function(resolve, reject) {
        var dataSourcesPromises = [];
        for (var i = 0; i < source.typeSettings.sourcesIds.length; i++) {
            var aux = MVD.DataSources.cacheDataSources.find(element => element.id === source.typeSettings.sourcesIds[i]);
            dataSourcesPromises.push(MVD.DataSources.getSourceData(aux, parameters));
        }
        Promise.all(dataSourcesPromises)
            .then(function(args) {
                MVD.DataSources.Javascript.proxySources = args;
                MVD.DataSources.Javascript.proxyParameters = parameters;
                try {
                    (eval('(function(){ return  new Promise(function(resolve, reject){' + source.typeSettings.function + '})})()'))
                    .then(function (args) {resolve(args);})
                    .catch(function (args) { reject(args); });
                } catch (error) {
                    console.error(error);
                    reject(error);
                }
              
            })
            .catch(function(args) { reject(args); });
    });
};

MVD.DataSources.Javascript.getDetailData = function (source, columnName, row) {
    return [];
};

MVD.DataSources.Javascript.getFields = function(source) {
    return new Promise(function(resolve, reject) {
        try {
            (eval('(function(){ return  new Promise(function(resolve, reject){' + source.typeSettings.functionFields + '})})()'))
                .then(function (args) { resolve({ fields: args, dynamicFields: [] }); })
                .catch(function (args) { reject(args); });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};
