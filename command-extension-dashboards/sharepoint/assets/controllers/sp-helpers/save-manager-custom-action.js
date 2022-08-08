//Importa el módulo de save-manager si es el último hijo
let isLastSaveManagerChild = window.frameElement?.dialogArgs?.isLastChild//(window.frameElement && window.frameElement.dialogArgs && window.frameElement.dialogArgs.isLastChild) ? window.frameElement.dialogArgs.isLastChild : null
if (isLastSaveManagerChild) {
    MVD.importScripts(['sp-helpers/save-manager'])
        .then(function (modules) {
            modules[0].initializeModule();
        })
}