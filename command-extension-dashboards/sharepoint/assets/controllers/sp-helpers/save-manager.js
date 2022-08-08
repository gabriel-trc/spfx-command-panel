let getFields, getItems, getItemById, getUserPermissions, getListInfo, createBatch, createItem, executeBatch, updateItem, recycleItem
let getAllFieldsInfo, getFieldInfoByInternalName, getFieldValue, getSPFieldNewFormAttachmentsValues, setFieldValue, setVisibilityByInternalName
let showConfirmDialog, showToast, SHOW_TOAST_TYPES;

let isChildDialog = false
let customSaveActionFunction = null;
let initializeModulePromise = null;
let initializeChildsDataPromise = {};
let originalSaveButtonFunction = null;
let preSaveActionFunctionsArray = null;
let toSaveObject = null;


let searchParams = new URLSearchParams(location.search.toUpperCase());
let currentItemID = searchParams.get('ID') ? Number(searchParams.get('ID')) : null;

let currentItemModifiedTS = null;

let resolveRenderedPromise = null
let rendererPromise = new Promise(function (resolve, reject) {
    if (!window.frameElement || (window.frameElement && !window.frameElement.dialogArgs) ||
        (window.frameElement && window.frameElement.dialogArgs && !window.frameElement.dialogArgs.isChildDialog)) {
        resolve({
            isChildDialog: false,
            currentItemID
        })
    }
    else {
        isChildDialog = true
        resolveRenderedPromise = resolve;
    }

})
function whenIsRendered() { return rendererPromise }


async function mvdInitializeModule() {
    let modules = await MVD.importScripts(['sp-helpers/list-items', 'sp-helpers/fields', 'syncfusion/19.2/utilities']);
    ({ getFields, getItems, getItemById, getUserPermissions, getListInfo, createBatch, createItem, executeBatch, updateItem, recycleItem } = modules[0]);
    ({ getAllFieldsInfo, getFieldInfoByInternalName, getFieldValue, getSPFieldNewFormAttachmentsValues, setFieldValue, setVisibilityByInternalName } = modules[1]);
    ({ showConfirmDialog, showToast, SHOW_TOAST_TYPES } = modules[2]);
}

//---------------------------------------------------- ToSaveObject -----------------------------------------------------//

/**
 * Esta función se encarga de iniciar el toSaveObject, de enlazar funciones en la UI y también setea el valor y esconde el campo que hace de lookup hacía el padre.
 * @return  {Promise} initializeModulePromise, al resolverse devuelve el objeto toSaveObject.
 **/
async function initializeModule() {
    if (initializeModulePromise === null) {
        //await MVD.awaitFor.getCurrentUserSettings()
        MVD.pageLoader({ show: true, keyCall: 'sp-helpers/save-manager' })
        let dialogArgs = (window.frameElement && window.frameElement.dialogArgs) ? window.frameElement.dialogArgs : null;
        if (dialogArgs && dialogArgs.childFieldInternalName) {
            setFieldValue(dialogArgs.parentLookup.name, {
                lookupId: dialogArgs.parentLookup.value
            });
            setVisibilityByInternalName(dialogArgs.parentLookup.name);
        }
        addPreSaveActionFunction(100, preSaveFunction);
        bindingFunctions();
        initializeModulePromise = initializeCurrentToSaveObject();
        initializeModulePromise
            .catch(function (err) {
                console.error(err)
            })
            .finally(async function () {
                if (SP.UI.ModalDialog.get_childDialog()) {
                    SP.UI.ModalDialog.get_childDialog().autoSize()
                    await new Promise(resolve => setTimeout(resolve, 500))
                    SP.UI.ModalDialog.get_childDialog().autoSize()
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    SP.UI.ModalDialog.get_childDialog().autoSize()
                }
                if (resolveRenderedPromise) resolveRenderedPromise({
                    isChildDialog,
                    currentItemID
                })
                MVD.pageLoader({ show: false, keyCall: 'sp-helpers/save-manager' })
            });
    }
    return initializeModulePromise;
}

/**
 * Inicia el objeto toSaveObject, modifica el formulario según la accion del objeto.
 * @return  {Promise} initializeModulePromise, al resolverse devuelve el objeto toSaveObject.
 **/
async function initializeCurrentToSaveObject() {
    await MVD.awaitFor.SPClientContext()
    let dialogArgs = (window.frameElement && window.frameElement.dialogArgs) ? window.frameElement.dialogArgs : null;
    const siteUrl = _spPageContextInfo.siteServerRelativeUrl
    const listGUID = _spPageContextInfo.pageListId
    const listInfo = await getListInfo({ listGUID, siteUrl: _spPageContextInfo.webServerRelativeUrl })
    const fields = await getFields({ listGUID, siteUrl })
    const userPermissions = getUserPermissions({ listGUID, siteUrl })
    const fieldsWithSaveManager = fields.filter(e => e.schema.Customization && e.schema.Customization.ArrayOfProperty &&
        Array.isArray(e.schema.Customization.ArrayOfProperty.Property) && e.schema.Customization.ArrayOfProperty.Property.find(p => p.Name == 'saveManager'))

    for (let index = 0; index < fieldsWithSaveManager.length; index++) {
        const field = fieldsWithSaveManager[index];
        const saveManagerProp = field.schema.Customization.ArrayOfProperty.Property.find(function (e) { return e.Name === 'saveManager' })
        if (saveManagerProp.Value.listGUID) {
            const listGUID = saveManagerProp.Value.listGUID
            const listInfo = await getListInfo({ listGUID, siteUrl: _spPageContextInfo.webServerRelativeUrl })
            saveManagerProp.Value.listUrl = listInfo.listUrl
            saveManagerProp.Value.userPermissions = await getUserPermissions({ listGUID, siteUrl })
            saveManagerProp.Value.isLibrary = listInfo.isLibrary
            initializeChildData({
                saveManagerValue: saveManagerProp.Value,
                childFieldInternalName: field.internalName
            })
        }
    }

    toSaveObject = {
        action: 'add',
        childs: {},
        data: {},
        originalData: {},
        listGUID: _spPageContextInfo.pageListId,
        listUrl: listInfo.listUrl,
        childLookupToParent: null,
        preSaveFunctionsAsChildArray: [],
        savedFunctionsArray: [],
        fieldsWithSaveManager: fieldsWithSaveManager,
        userPermissions: userPermissions,
    }

    if (location.href.toLowerCase().indexOf('/dispform.aspx') > -1) {
        toSaveObject.action = 'disp';
        if (dialogArgs && dialogArgs.childFieldInternalName) {
            document.querySelectorAll('a[id*="DeleteItem"]').forEach(e => e.style.display = 'none')
            document.querySelectorAll('a[id*="EditItem"]').forEach(e => e.style.display = 'none')
        }
    }
    else if ((location.href.toLowerCase().indexOf('/editform.aspx') > -1 && !isChildDialog) || (isChildDialog && dialogArgs.saveMode === 'saveInDialog')) {
        toSaveObject.action = 'edit';
        let data = await getItemById({ getAttachments: !listInfo.isLibrary, id: currentItemID, listGUID: toSaveObject.listGUID, siteUrl })
        currentItemModifiedTS = data['Modified'].getTime();
        if (data['_AttachmentsFiles']) toSaveObject.data['_AttachmentsFiles'] = [].concat(data['_AttachmentsFiles'])
        toSaveObject.originalData = JSON.parse(JSON.stringify(data))
    }
    else if (isChildDialog) {
        toSaveObject.childLookupToParent = dialogArgs.parentLookup.name;
        if (dialogArgs.childItemID !== null) {
            if (dialogArgs.childItemID > 0) {
                toSaveObject.action = 'edit';
                try {
                    let data = await getItemById({ getAttachments: true, id: currentItemID, listGUID: toSaveObject.listGUID, siteUrl })
                    if (dialogArgs.toSaveObject) {
                        toSaveObject = { ...toSaveObject, ...dialogArgs.toSaveObject }
                        let memoryData = dialogArgs.toSaveObject.data
                        for (let key in memoryData) {
                            data[key] = memoryData[key]
                        }
                    } else {
                        toSaveObject.originalData = JSON.parse(JSON.stringify(data))
                    }

                    setSaveServerDataInItemForm(data);
                } catch (error) {
                    let ret = {
                        childItemDeleted: true,
                        childFieldInternalName: dialogArgs.childFieldInternalName,
                        childItemID: dialogArgs.childItemID,
                    };
                    window.frameElement.commitPopup(ret);
                }
            }
            else {
                if (dialogArgs.toSaveObject) {
                    toSaveObject = { ...toSaveObject, ...dialogArgs.toSaveObject }
                    toSaveObject.originalData = JSON.parse(JSON.stringify(dialogArgs.toSaveObject.data))
                    setSaveServerDataInItemForm(toSaveObject.data);
                } else {
                    toSaveObject.originalData = {}
                }
            }
        }
        else {
            toSaveObject.action = 'add';
        }
    }
    return toSaveObject;

    async function setSaveServerDataInItemForm(data) {
        await MVD.awaitFor.SPClientPeoplePicker()
        if (data['_AttachmentsFiles']) data['Attachments'] = data['_AttachmentsFiles']
        for (let key in data) {
            if (['_UIVersionString', 'Author', 'Created', 'Editor', 'Modified', 'Order'].includes(key)) continue
            let value = data[key]
            if (value) {
                let fieldInfo = getFieldInfoByInternalName(key)
                if (fieldInfo && fieldInfo.type === 'SPFieldNumber' && Array.from(fieldInfo.td.querySelectorAll('span')).find(e => e.textContent === '%')) {
                    value = value * 100
                }
            }
            if (key === 'Attachments') {
                value = data[key].filter(e => e.action !== 'delete')
            }
            setFieldValue(key, value);
        }
    }

}

async function initializeChildData({ saveManagerValue, childFieldInternalName }) {
    initializeChildsDataPromise[childFieldInternalName] = new Promise(function (resolve, reject) {
        const batchElementsExtraData = []
        const currentBatch = createBatch()
        if (currentItemID) {
            const getAttachments = saveManagerValue.includeFields.filter(e => e == 'Attachments').length === 1
            const viewFields = '<ViewFields>' + saveManagerValue.includeFields.map(e => `<FieldRef Name="${e}" />`).join('') + '</ViewFields>'
            const query = '<View Scope="RecursiveAll"><Query><Where><Eq><FieldRef Name="' + saveManagerValue.lookupInternalName + '" LookupId="True"/><Value Type="Lookup">' + currentItemID + '</Value></Eq></Where></Query>' + viewFields + '</View>'
            getItems({
                batch: currentBatch,
                camlQuery: query,
                getAttachments: getAttachments,
                listGUID: saveManagerValue.listGUID,
                siteUrl: _spPageContextInfo.siteServerRelativeUrl
            })
            batchElementsExtraData.push({ dataType: 'gridData', childFieldInternalName })
        }

        saveManagerValue.extraLists.forEach(extraList => {
            let viewFields = '<ViewFields>' + extraList.includeFields.map(e => `<FieldRef Name="${e}" />`).join('') + '</ViewFields>'
            let query = '<View><Query></Query>' + viewFields + '</View>'
            getItems({
                batch: currentBatch,
                camlQuery: query,
                getAttachments: extraList.getAttachments,
                listGUID: extraList.listGUID,
                siteUrl: _spPageContextInfo.siteServerRelativeUrl
            })
            batchElementsExtraData.push({ dataType: 'lookupData' })
        })
        executeBatch(currentBatch)
            .then(function (batchData) {
                for (let index = 0; index < batchData.length; index++) {
                    batchData[index].dataType = batchElementsExtraData[index].dataType
                    let childFieldInternalName = batchElementsExtraData[index].childFieldInternalName
                    if (batchData[index].dataType === 'gridData' && window.frameElement && window.frameElement.dialogArgs && window.frameElement.dialogArgs.toSaveObject && window.frameElement.dialogArgs.toSaveObject.childs[childFieldInternalName]) {
                        const toSaveObjectChildren = window.frameElement.dialogArgs.toSaveObject.childs[childFieldInternalName]
                        const items = batchData[index].result
                        batchData[index].result = mergeGridDataWhitMemoryRows({ items, toSaveObjectChildren });
                    }
                }
                resolve(batchData)
            })
    });

    function mergeGridDataWhitMemoryRows({ items, toSaveObjectChildren }) {
        for (let keyRowId in toSaveObjectChildren) {
            let rowId = Number(keyRowId);
            if (rowId >= 0) {
                let dataRowIndex = items.findIndex(e => e.ID == rowId);
                if (dataRowIndex > -1) {
                    if (toSaveObjectChildren[rowId].action === 'delete') {
                        items.splice(dataRowIndex, 1);
                    }
                    else {
                        let dataMemoryRow = toSaveObjectChildren[keyRowId].data;
                        items[dataRowIndex] = {};
                        for (let keyData in dataMemoryRow) {
                            items[dataRowIndex][keyData] = dataMemoryRow[keyData]
                        }
                    }
                } else {
                    // let rowDataID = toSaveObjectChildren[keyRowId].data.ID;
                    // showToast({ msg: 'El elemento ' + rowDataID + ' de la grilla ' + gridConfigSettings.name + ', a sido eliminado por otro usuario' });
                    delete toSaveObjectChildren[keyRowId];
                }
            }
            else {
                let dataMemoryRow = toSaveObjectChildren[keyRowId].data;
                let auxNewRow = {};
                for (let keyData in dataMemoryRow) {
                    auxNewRow[keyData] = dataMemoryRow[keyData]
                }
                items.push(auxNewRow);
            }
        }
        return items;
    }


}

function getChildDataByInternalName(childFieldInternalName) {
    return initializeChildsDataPromise[childFieldInternalName];
}

function bindingFunctions() {
    document.querySelectorAll('[id*="DeleteItem"]')
        .forEach(function (element) {
            element.href = '#';
            element.addEventListener('click', async function (event) {
                event.stopPropagation()
                event.preventDefault()
                let confirmDelete = await showConfirmDialog({
                    msg: '¿Está seguro de que desea enviar los elementos a la Papelera de reciclaje del sitio?',
                    title: 'Atención'
                });
                if (confirmDelete) {
                    toSaveObject.action = 'delete';
                    toSaveObject.data.ID = currentItemID
                    MVD.pageLoader({ show: true, keyCall: 'save-manager/deleteItem' });
                    try {
                        await saveToSaveObject(toSaveObject)
                        returnToTheBeginningAfterSaving();
                    } catch (error) {
                        debugger
                        if (error.spTypeError === 'System.ArgumentException') {
                            returnToTheBeginningAfterSaving();
                        } else {
                            MVD.pageLoader({ show: false, keyCall: 'save-manager/deleteItem' });
                            errorHandler(error);
                        }
                    }
                }
            }, true);
        });
    if (document.getElementById('idAttachmentsTable')) {
        document.getElementById('idAttachmentsTable').addEventListener('click', async function (event) {
            if (event.target.nodeName == 'A') {
                let aPosition = Array.from(event.target.parentNode.children).indexOf(event.target)
                if (aPosition == 1) {
                    let aTags = event.target.closest('tr').querySelectorAll('a')
                    if (aTags.length > 1) {
                        event.stopPropagation()
                        event.preventDefault()
                        let confirmDelete = await showConfirmDialog({
                            msg: '¿Confirma que desea enviar estos datos adjuntos a la Papelera de reciclaje del sitio?',
                            title: 'Atención'
                        });
                        if (confirmDelete) {
                            let name = aTags[0].textContent
                            deleteAttachmentByLinkName(name)
                        }
                    }
                }
            }
        }, true)
    }
}

function getCurrentToSaveObject() {
    return toSaveObject
}


//-----------------------------------------------------------   Helpers   -----------------------------------------------------------//

function deleteAttachmentByLinkName(name) {
    let attachmentsData = toSaveObject.data['_AttachmentsFiles'];
    let attachmentIndex = attachmentsData.findIndex(function (e) { return e.name === name });
    if (attachmentIndex < 0) {
        console.error(`No se encontró un adjunto de nombre ${name}`)
        return
    }
    if (attachmentsData[attachmentIndex].action !== 'add') {
        attachmentsData[attachmentIndex].action = 'delete';
    } else {
        attachmentsData.splice(attachmentIndex, 1);
    }
    let aTags = Array.from(document.getElementById('idAttachmentsTable').querySelectorAll('a'))
    let aTagForRemove = aTags.find(e => e.textContent == name)
    aTagForRemove.closest('tr').remove();
    if (document.getElementById('idAttachmentsTable').querySelectorAll('a').length === 0) {
        document.getElementById('idAttachmentsRow').style.display = 'none';
    }
}

function hideAttachmentByLinkName(name) {
    let aTags = Array.from(document.getElementById('idAttachmentsTable').querySelectorAll('a'))
    let aTagForRemove = aTags.find(e => e.textContent == name)
    if (!aTagForRemove) {
        console.error(`No se encontró un adjunto de nombre ${name}`)
        return
    }
    let aTagTR = aTagForRemove.closest('tr')
    aTagTR.setAttribute('data-state', 'hidden')
    aTagTR.style.display = 'none';
    let trTags = Array.from(document.getElementById('idAttachmentsTable').querySelectorAll('tr'))
    let trTagsVisibles = trTags.filter(function (e) {
        let state = e.getAttribute('data-state')
        return (state == 'hidden') ? false : true
    })
    if (trTagsVisibles.length === 0) {
        document.getElementById('idAttachmentsRow').style.display = 'none';
    }
}


//---------------------------------------------------- PreSave -----------------------------------------------------//

/**
 * API Insertar función de pre guardado
 * @param {Number} order - Orden de ejecución
 * @param {Object} func - Función a ejecutuar, puede retornar una promesa, un boolean o undefined. En caso de ser una promesa debe resolver un boleano.
 *                      Verdadero o undefined (cuando no es promesa) hace que la ejecución del loop continue, en caso contrario comienza a recorrer las funciones undo.
 * @param {Object} undo - Function a ejecutar en caso de falso.
 * @return promise, boolean or undefined.
 **/
function addPreSaveActionFunction(order, func, undo) {
    if (preSaveActionFunctionsArray === null) initPreSaveActionFunctions();
    if (preSaveActionFunctionsArray.find(e => e.order === order)) throw `El lugar ${order} de las funciones de pre save, ya se encuentra ocupado.`
    preSaveActionFunctionsArray.push({ order, func, undo });
}

/**
 * Inicializa el array de functiones de pre guardado y sobreescribe el botón de guardar de sharepoint.
 * @return undefined
 **/
function initPreSaveActionFunctions() {
    preSaveActionFunctionsArray = [];
    let saveButtons = document.querySelectorAll('[name$="SaveItem"]');
    if (saveButtons.length > 0) {
        originalSaveButtonFunction = saveButtons[0].onclick;
        saveButtons.forEach(function (element) {
            element.setAttribute('onclick', '');
            element.addEventListener('click', loopPreSaveFunctions, true);
        });
    }
}

/**
 * Loop sobre el array preSaveActionFunctionsArray si finaliza correctamente pasa guardado custom o el original.
 * @return undefined.
 **/
function loopPreSaveFunctions(event) {
    MVD.pageLoader({ show: true, keyCall: 'save-manager' });
    event.stopPropagation()
    event.preventDefault()

    preSaveActionFunctionsArray = preSaveActionFunctionsArray.sort((a, b) =>
        ((a.order <= b.order) ? -1 : 1)
    );
    loopPreSaveFunctions(0);

    function loopPreSaveFunctions(index) {
        try {
            if (index === preSaveActionFunctionsArray.length) {
                try {
                    if (customSaveActionFunction) {
                        let retSave = customSaveActionFunction();
                        if (typeof retSave.then === 'undefined') {
                            if (!retSave) {
                                executeUndo(index);
                            }
                        }
                        else {
                            retSave.then(function (result) {
                                if (!result) {
                                    executeUndo(index);
                                }
                            }).catch(function (e) {
                                if (e) console.error(e);
                                executeUndo(index);
                            });
                        }
                    }
                    else {
                        originalSaveButtonFunction();
                        executeUndo(index);
                    }
                }
                catch (e) {
                    if (e) console.error(e);
                    executeUndo(index);
                }
            }
            else {
                let ret = preSaveActionFunctionsArray[index].func();
                if (typeof ret === 'undefined' || typeof ret.then === 'undefined') {
                    if (typeof ret === 'undefined' || ret) {
                        loopPreSaveFunctions(++index)
                    } else {
                        executeUndo(++index);
                    }
                }
                else {
                    ret.then(function (result) {
                        if (result) {
                            loopPreSaveFunctions(++index)
                        } else {
                            executeUndo(index);
                        }
                    }).catch(function (e) {
                        if (e) console.error(e);
                        executeUndo(index);
                    });
                }
            }
        }
        catch (e) {
            if (e) console.error(e);
            executeUndo(index);
        }
    }
    function executeUndo(index) {
        for (let i = 0; i < index; i++) {
            if (typeof preSaveActionFunctionsArray[i].undo === 'function') {
                preSaveActionFunctionsArray[i].undo();
            }
        }
        MVD.pageLoader({ show: false, keyCall: 'save-manager' });
        let saveButtons = document.querySelectorAll('[name$="SaveItem"]');
        saveButtons.forEach(function (element) {
            element.removeAttribute('disabled');
        });
    }
}


//---------------------------------------------------- Save -----------------------------------------------------//

/**
 * Pointer to the function that execute at last, return true  if function
 * @return boolean.
 **/
function addCustomSaveActionFunction(func) {
    let addFunction = false;
    if (customSaveActionFunction === null) {
        customSaveActionFunction = func;
        addFunction = true;
    }
    return addFunction;
}

async function customSaveAction() {
    try {
        await saveToSaveObject(toSaveObject)
        returnToTheBeginningAfterSaving();
    } catch (error) {
        MVD.pageLoader({ show: false, keyCall: 'save-manager' });
        errorHandler(error);
    }
}

async function saveToSaveObject(toSaveObject) {
    const listGUID = toSaveObject.listGUID
    const item = toSaveObject.data
    const siteUrl = _spPageContextInfo.siteServerRelativeUrl
    if (toSaveObject.preSaveFunctionsAsChildArray.length) await loopPreSaveFunctionsAsChildArray(toSaveObject)
    if (!toSaveObject.saveActionCompleted) {
        if (toSaveObject.action === 'add') {
            toSaveObject.data.ID = await createItem({ item, listGUID, siteUrl })
            if (currentItemID == null) currentItemID = toSaveObject.data.ID
        }
        else if (toSaveObject.action === 'edit') {
            await updateItem({ item, listGUID, siteUrl })
        }
        else {
            toSaveObject.childs = {}
            await recycleItem({ item, listGUID, siteUrl })
            return true
        }
        toSaveObject.saveActionCompleted = true;
    }
    try {
        let childsSavePromises = []
        let childsKeys = Object.keys(toSaveObject.childs);
        if (childsKeys.length > 0) {
            for (let childInternalName in toSaveObject.childs) {
                let parentID = toSaveObject.data.ID;
                for (let childID in toSaveObject.childs[childInternalName]) {
                    let childToSaveObject = toSaveObject.childs[childInternalName][childID];
                    childToSaveObject.data[childToSaveObject.childLookupToParent] = {
                        lookupId: parentID,
                        lookupValue: parentID
                    }
                    childsSavePromises.push(saveToSaveObject(childToSaveObject))
                }
            }
        }
        await Promise.all(childsSavePromises)
        await loopSavedFunctionsArray(toSaveObject)
        return true
    } catch (error) {
        throw error;
    }

    async function loopSavedFunctionsArray(toSaveObject) {
        let savedAgain = false;

        for (let scriptKey of toSaveObject.savedFunctionsArray) {
            let modules = await MVD.importScripts([scriptKey])
            let { saveAgain } = modules[0]
            try {
                let funcResult = await saveAgain(toSaveObject);
                if (funcResult) savedAgain = true;
            } catch (error) {
                console.error(error);
            }
        }
        if (savedAgain) {
            if (toSaveObject.data._AttachmentsFiles) toSaveObject.data._AttachmentsFiles = []
            try {
                await updateItem({ item: toSaveObject.data, listGUID: toSaveObject.listGUID, siteUrl: _spPageContextInfo.siteServerRelativeUrl })
                return true;
            } catch (error) {
                throw error;
            }
        }
        return savedAgain;
    }

    async function loopPreSaveFunctionsAsChildArray(toSaveObject) {
        let passPreSave = true;
        for (let scriptKey of toSaveObject.preSaveFunctionsAsChildArray) {
            let modules = await MVD.importScripts([scriptKey])
            let { preSaveAsChild } = modules[0]
            try {
                passPreSave = await preSaveAsChild(toSaveObject);
            } catch (error) {
                console.error(error);
            }
        }
        return passPreSave;
    }
}

async function preSaveFunction() {
    if (window.frameElement && window.frameElement.dialogArgs && window.frameElement.dialogArgs.saveMode === 'saveInDialog') {
        return true;
    } else {
        const formData = await getFormData()
        const listGUID = _spPageContextInfo.pageListId
        const fields = await getFields({ listGUID, siteUrl: _spPageContextInfo.siteServerRelativeUrl })
        const fieldsWithErrors = await validateCurrentItemFormData(formData, fields)
        if (fieldsWithErrors.length === 0) {
            if (toSaveObject.data['_AttachmentsFiles']) {
                formData['_AttachmentsFiles'] = formData['_AttachmentsFiles'].concat(toSaveObject.data['_AttachmentsFiles']);
            }
            toSaveObject.data = formData;
            // let dataChanged = null;
            // if (toSaveObject.saveActionCompleted) {
            //     dataChanged = dataChangeAfterServerError(formData, toSaveObject.data, fields);
            //     console.log(dataChanged);
            //     if (dataChanged) {
            //         toSaveObject.data = formData;
            //         toSaveObject.saveActionCompleted = false;
            //     }
            // } else {
            //     toSaveObject.data = formData;
            // }

            if (isChildDialog) {
                addCustomSaveActionFunction(returnChildDataToCurrentParent);
                return true;
            }
            else {
                addCustomSaveActionFunction(customSaveAction);
                if (currentItemID) {
                    try {
                        let data = await getItemById({ id: currentItemID, listGUID: toSaveObject.listGUID, siteUrl: _spPageContextInfo.siteServerRelativeUrl })
                        if (data['Modified'].getTime() !== currentItemModifiedTS) {
                            let confirmResponse = await showConfirmDialog({
                                msg: `El elemento que quiere actualizar fue modificado en este transcurso por  ${data['Editor'].displayName}.</br>¿Desea sobrescribir sus cambios?`,
                                title: 'Atención'
                            });
                            return confirmResponse
                        }
                        return true;
                    } catch (error) {
                        let confirmResponse = await showConfirmDialog({
                            msg: 'El elemento que quiere actualizar fue elimiado por otro usuario.</br>¿Desea volver a la lista de elementos?',
                            title: 'Atención'
                        });
                        if (confirmResponse) {
                            returnToTheBeginningAfterSaving();
                        }
                        return false
                    }
                }
                return true
            }
        }
        else {
            fieldsWithErrors.forEach(function (e) {
                try {
                    e.info.td.append(e.tooltipError);
                } catch (error) {
                    console.error(error)
                }
            });
            showToast({
                msg: `Revise el formulario, 
                                    ${(fieldsWithErrors.length === 1) ?
                        `el campo ${fieldsWithErrors[0].info.displayName} contiene un error` :
                        `hay errores en los siguientes campos: ${fieldsWithErrors.map(e => e.info.displayName).join(', ')}`}`,
                timeOutMS: 0
            });
            return false;
        }
    }

    function dataChangeAfterServerError(newData, savedData, fields) {
        let ret = false;
        for (let i = 0; i < fields.length; i++) {
            if (fields[i].type === 'Calculated' || fields[i].internalName.startsWith('MVDRF_') || fields[i].internalName === 'ID') continue;


            let newValue = newData.find(e => e.name === fields[i].internalName);
            let savedValue = savedData.find(e => e.name === fields[i].internalName);

            if (newValue && savedValue) {
                if (fields[i].type === 'Attchments') {

                } else {
                    if (Array.isArray(newValue.value) && Array.isArray(savedValue.value)) {
                        continue;
                    }
                    else if (newValue.value !== savedValue.value) {
                        ret = true;
                        break;
                    }
                }
            } else if (newValue) {
                if (typeof fields[i].schema.AppendOnly !== 'undefined' && newValue.value) {
                    ret = true;
                }
            }
        }
        return ret;
    }
}

// async function prepareRichTextPropertyToSave(property, listGUID) {
//     let listUrl = await getListUrlByGUID(listGUID)
//     let div = document.createElement('div')
//     div.style.display = 'none'
//     div.innerHTML = property.value
//     document.body.appendChild(div)
//     let blobImgs = div.querySelectorAll('img[src^="blob:"]')
//     for (let blobImg of blobImgs) {
//         let response = await fetch(blobImg.src)
//         let arrayBuffer = await response.arrayBuffer()
//         let imgFileName = removeInvalidCharactersFormAttachmentFileName(blobImg.alt)
//         if (!imgFileName) imgFileName = 'img_' + Math.round(Math.random() * 100) + '.jpeg'
//         let fileRelativeURL = '/SiteAssets' + listUrl + '/AllItems/' + imgFileName
//         console.log(fileRelativeURL)
//         await importFile(fileRelativeURL, arrayBuffer)
//         property.value = property.value.replace(blobImg.src, fileRelativeURL)
//     }
//     delete property.type
//     div.remove()

// }

async function errorHandler(error) {
    console.error(error);
    let errorTitle;
    let errorTime;
    let errorMessage = error.message;

    if (error.spTypeError) {
        errorTime = 0; _spPageContextInfo
        let listGUID = (error.parentOfToSaveObject) ? error.parentOfToSaveObject.listGUID : _spPageContextInfo.pageListId;
        let parentFields = await getFields({ listGUID, siteUrl: _spPageContextInfo.siteServerRelativeUrl })
        switch (error.spTypeError) {
            case 'Microsoft.SharePoint.SPDuplicateValuesFoundException':
                errorTitle = 'Valor duplicado';
                let fieldsWithErrors = error.message.match(/\[(.*?)\]/)[1];
                if (error.parentOfToSaveObject) {
                    errorMessage += `\nEl elemento se encuentra en la grilla ${getGridName(parentFields)}`;
                }
                break;
            case 'Microsoft.SharePoint.SPException':
                errorTitle = 'Valor no válido';
                if (error.parentOfToSaveObject) {
                    errorMessage += `\nEl elemento se encuentra en la grilla ${getGridName(parentFields)}`;

                }
                break;
            default:

                break;
        }
    }
    showToast({ msg: errorMessage, timeOutMS: errorTime, type: SHOW_TOAST_TYPES.DANGER, title: errorTitle });

    function getGridName(parentFields) {
        let internalName = null;
        for (let keyGrid in error.parentOfToSaveObject.childs) {
            let firstRowID = Object.keys(error.parentOfToSaveObject.childs[keyGrid])[0]
            if (error.parentOfToSaveObject.childs[keyGrid][firstRowID].listGUID === error.toSaveObject.listGUID) {
                internalName = keyGrid;
                break;
            }
        }
        let gridField = parentFields.find(e => e.internalName === internalName);
        return gridField.name;
    }
}

function returnToTheBeginningAfterSaving() {
    let searchParams = new URLSearchParams(location.search);
    let sourceParameter = searchParams.get('Source');
    if (!sourceParameter) sourceParameter = location.pathname.substring(0, location.pathname.lastIndexOf('\/'));
    if (window.frameElement !== null) {
        if (typeof window.frameElement.dialogArgs === 'undefied' && window.frameElement.dialogArgs.saveMode === 'saveInDialog') {
            returnChildDataToCurrentParent();
        }
        else {
            window.frameElement.commitPopup();
        }
    } else {
        window.location.assign(sourceParameter)
    }
}


//---------------------------------------------------- Child API -----------------------------------------------------//

function childToSaveObjectManager({ action, data, originalData, childListGUID, childFieldInternalName, childLookupToParent, childToSaveObject }) {
    try {
        let toSaveObjectChild = null;
        if (typeof childToSaveObject !== 'undefined') {
            subscribeToPreSaveAsChildIfIsNecessary(childToSaveObject)
            if (typeof toSaveObject.childs[childFieldInternalName] === 'undefined') toSaveObject.childs[childFieldInternalName] = {}
            toSaveObject.childs[childFieldInternalName][childToSaveObject.data.ID] = childToSaveObject;
            toSaveObjectChild = childToSaveObject;
        }
        else {
            toSaveObjectChild = getToSaveObjectChildByInternalNameAndID(childFieldInternalName, data.ID);
            if (toSaveObjectChild === null) toSaveObjectChild = addToSaveObjectChild({ action, data, originalData, childListGUID, childFieldInternalName, childLookupToParent })
            else toSaveObjectChild = updateToSaveObjectChild({ action, data, childFieldInternalName });
        }
        return toSaveObjectChild;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function addToSaveObjectChild({ action, data, originalData, childListGUID, childFieldInternalName, childLookupToParent }) {
    if (typeof toSaveObject.childs[childFieldInternalName] === 'undefined') {
        toSaveObject.childs[childFieldInternalName] = {}
    }
    data[childLookupToParent] = {
        lookupId: currentItemID,
        lookupValue: currentItemID
    }
    let toSaveChildObject = {
        action,
        childs: {},
        data,
        originalData,
        listGUID: childListGUID,
        childLookupToParent,
        preSaveFunctionsAsChildArray: [],
        savedFunctionsArray: [],
    };
    toSaveObject.childs[childFieldInternalName][data.ID] = toSaveChildObject;
    subscribeToPreSaveAsChildIfIsNecessary(toSaveChildObject)
    return toSaveObject.childs[childFieldInternalName][data.ID];
}

function updateToSaveObjectChild({ data, action, childFieldInternalName }) {
    let toSaveObjectChild = getToSaveObjectChildByInternalNameAndID(childFieldInternalName, data.ID);
    if (action === 'delete') {
        if (data.ID <= 0) delete toSaveObject.childs[childFieldInternalName][data.ID];
        else toSaveObjectChild.action = action;
    } else {
        toSaveObjectChild.action = (toSaveObjectChild.action.includes('add')) ? 'add' : 'edit';
        for (let key in data) {
            toSaveObjectChild.data[key] = data[key];
        }
    }
    return toSaveObjectChild;
}

function getToSaveObjectChildByInternalNameAndID(childFieldInternalName, childID) {
    let childToSaveObject = null;
    if (typeof toSaveObject.childs[childFieldInternalName] !== 'undefined') {
        if (typeof toSaveObject.childs[childFieldInternalName][childID] !== 'undefined') {
            childToSaveObject = toSaveObject.childs[childFieldInternalName][childID];
        }
    }
    return childToSaveObject;
}

async function openChildDialog({ child, dialog }) {
    if (currentItemID === null && dialog.saveMode === 'saveInDialog') {
        showToast({ msg: 'No es posible crear un nuevo registro en la grilla seleccionada, primero debe guardar el registro actual.' });
        return false;
    }
    let childField = toSaveObject.fieldsWithSaveManager.find(e => e.internalName == child.fieldInternalName)
    let childFieldSaveManagerProp = childField.schema.Customization.ArrayOfProperty.Property.find(e => e.Name == 'saveManager').Value
    let fields = await getFields({ listGUID: childFieldSaveManagerProp.listGUID, siteUrl: _spPageContextInfo.siteServerRelativeUrl })
    let isLastChild = fields.filter(e => e.internalName.startsWith('MVDRF_')).length === 0;//o MVDDF ver de hacerlo con alguna propiedad interna

    let listUrl = childFieldSaveManagerProp.listUrl;
    if (childFieldSaveManagerProp.isLibrary) listUrl = listUrl + '/Forms'
    if (_spPageContextInfo.siteServerRelativeUrl !== '/') listUrl = _spPageContextInfo.siteServerRelativeUrl + listUrl
    let parentTitle = '';
    try {
        parentTitle = getFieldValue('Title');
    } catch (error) {

    }
    const dialogSettings = {
        url: listUrl + '/NewForm.aspx',
        args: {
            isChildDialog: true,
            saveMode: dialog.saveMode,
            childFieldInternalName: child.fieldInternalName,
            childItemID: child.ID,
            parentLookup: { name: childFieldSaveManagerProp.lookupInternalName, value: currentItemID, text: parentTitle },
            isLastChild: isLastChild,
            toSaveObject: getToSaveObjectChildByInternalNameAndID(child.fieldInternalName, child.ID)
        },
        autoSize: false,
        allowMaximize: true
    };

    if (dialog.isReadOnly) {
        dialogSettings.url = listUrl + '/DispForm.aspx?ID=' + child.ID
    } else if (childFieldSaveManagerProp.isLibrary || child.ID > 0) {
        dialogSettings.url = listUrl + '/EditForm.aspx?ID=' + child.ID
    }

    if (dialogSettings.args.saveMode === 'saveInDialog') {
        dialogSettings.args.isChildDialog = false
        if (['/lists/noconformidades', '/lists/accionescorrectivas'].includes(listUrl.toLowerCase())) {
            sessionStorage.setItem('relationFieldChildCommitPopupDialog', 1);
            if (child.ID === null) {
                dialogSettings.url = listUrl + '/NewForm.aspx?MVDRelationPropertyChildList=' + child.listGUID +
                    '&MVDRelationPropertyParentField=' + child.childLookupToParent + '&MVDRelationPropertyParentId=' + currentItemID;
            } else {
                dialogSettings.url = listUrl + '/EditForm.aspx?ID=' + child.ID + '&MVDRelationPropertyChildList=' + child.listGUID +
                    '&MVDRelationPropertyParentField=' + child.childLookupToParent + '&MVDRelationPropertyParentId=' + currentItemID;
            }
        } else if (child.ID > 0) {
            dialogSettings.url = listUrl + '/EditForm.aspx?ID=' + child.ID
        }
    }

    if (dialog.queryStringValues) dialogSettings.url = getUrlWithApplyedQueryStringValues(dialog.queryStringValues, dialogSettings.url);
    dialogSettings.dialogReturnValueCallback = dialog.callbackFunction;
    SP.UI.ModalDialog.showModalDialog(dialogSettings);
}

async function returnChildDataToCurrentParent() {
    let ret = {
        childFieldInternalName: window.frameElement.dialogArgs.childFieldInternalName,
        childItemID: window.frameElement.dialogArgs.childItemID,
        childToSaveObject: toSaveObject,
        saveMode: window.frameElement.dialogArgs.saveMode,
        urlInDeleteCase: window.frameElement.dialogArgs.urlInDeleteCase,
    };
    window.frameElement.commitPopup(ret);

}

async function subscribeToPreSaveAsChildIfIsNecessary(toSaveChildObject) {
    const fields = await getFields({ listGUID: toSaveChildObject.listGUID, siteUrl: _spPageContextInfo.siteServerRelativeUrl })
    const fieldsWithSaveManager = fields.filter(e => e.schema.Customization && e.schema.Customization.ArrayOfProperty &&
        Array.isArray(e.schema.Customization.ArrayOfProperty.Property) && e.schema.Customization.ArrayOfProperty.Property.find(p => p.Name == 'saveManager'))
    for (let index = 0; index < fieldsWithSaveManager.length; index++) {
        const field = fieldsWithSaveManager[index];
        const saveManagerProp = field.schema.Customization.ArrayOfProperty.Property.find(function (e) { return e.Name === 'saveManager' })
        if (saveManagerProp.Value.subscribeToPreSaveAsChild) {
            subscribeToPreSaveAsChild(toSaveChildObject, saveManagerProp.Value.scriptKey)
        }
    }
}

function subscribeToSaveAgain(toSaveObject, scriptKey) {
    let existSavedFunction = toSaveObject.savedFunctionsArray.find(currentScriptKey => currentScriptKey == scriptKey);
    if (typeof existSavedFunction === 'undefined') {
        toSaveObject.savedFunctionsArray.push(scriptKey);
    }
}

function subscribeToPreSaveAsChild(toSaveObject, scriptKey) {
    let existPreSaveAsChildFunction = toSaveObject.preSaveFunctionsAsChildArray.find(currentScriptKey => currentScriptKey == scriptKey);
    if (typeof existPreSaveAsChildFunction === 'undefined') {
        toSaveObject.preSaveFunctionsAsChildArray.push(scriptKey);
    }
}

function getUrlWithApplyedQueryStringValues(queryStringValuesSettings = [], url) {
    const queryStringValuesToApply = []
    if (!url) throw ('Missing parameter URL')
    for (let i = 0; i < queryStringValuesSettings.length; i++) {
        try {
            const queryStringValue = queryStringValuesSettings[i]
            const info = getFieldInfoByInternalName(queryStringValue.internalName)

            if (info == null) {
                console.warn('El campo de nombre interno ' + queryStringValue.internalName + ' no se encuentra en el fromulario.')
                continue
            }

            if (queryStringValue.state) queryStringValuesToApply.push(`setState_${queryStringValue.internalName}=${queryStringValue.state}`)

            let value = getFieldValue(queryStringValue.internalName)
            if (value == null || (Array.isArray(value) && value.length == 0)) continue
            if (value instanceof Date && !isNaN(value.valueOf())) value = value.toISOString()
            queryStringValuesToApply.push(`setValue_${queryStringValue.internalName}=${JSON.stringify(value)}`)

            // if (['SPFieldText', 'SPFieldFile', 'SPFieldNote', 'SPFieldNumber', 'SPFieldCurrency', 'SPFieldBoolean', 'SPFieldChoice', 'SPFieldOutcomeChoice'].includes(info.type)) {
            //     queryStringValuesToApply.push(`setValue_${queryStringValue.internalName}=${value}`)
            // } else if (info.type === 'SPFieldMultiChoice') {
            //     queryStringValuesToApply.push(`setValue_${queryStringValue.internalName}=${value.join(';')}`)
            // } else if (info.type === 'SPFieldDateTime') {
            //     queryStringValuesToApply.push(`setValue_${queryStringValue.internalName}=${value.toISOString()}`)
            // } else if (['SPFieldLookup', 'SPFieldLookupFieldWithPicker'].includes(info.type)) {
            //     queryStringValuesToApply.push(`setValue_${queryStringValue.internalName}=${value.lookupId}`)
            // } else if (['SPFieldLookupMulti', 'SPFieldLookupFieldWithPickerMulti',].includes(info.type)) {
            //     queryStringValuesToApply.push(`setValue_${queryStringValue.internalName}=${value.map(function (e) { return e.lookupId }).join(';')}`)
            // } else if ('SPFieldUser' === info.type) {
            //     queryStringValuesToApply.push(`setValue_${queryStringValue.internalName}=${value.Key}`)
            // } else if ('SPFieldUserMulti' === info.type) {
            //     queryStringValuesToApply.push(`setValue_${queryStringValue.internalName}=${value.map(function (e) { return e.displayName }).join(';')}`)
            // } else {
            //     console.warn('El tipo de campo ' + info.type + ' no se puede pasar por párametero de query.', info)
            // }
        } catch (error) {
            console.error(error)
        }
    }
    if (url.includes('?')) url += `&${queryStringValuesToApply.join('&')}`
    else url += `?${queryStringValuesToApply.join('&')}`
    return url
}


//---------------------------------------------------- Proccess Data -----------------------------------------------------//

async function getFormData() {
    const formFields = getAllFieldsInfo()
    const formData = {
        ID: currentItemID
    };
    for (let i = 0; i < formFields.length; i++) {
        let formField = formFields[i]
        if (['ID'].includes(formField.internalName)) continue
        try {
            if (formField.internalName === 'Attachments') {
                formData['_AttachmentsFiles'] = await getSPFieldNewFormAttachmentsValues()
            } else {
                let value = getFieldValue(formField.internalName)
                formData[formField.internalName] = value
            }
        } catch (error) {
            console.error(error);
        }
    }
    return formData
}

async function validateCurrentItemFormData(data, fields) {
    // Averiguar si esto no lo esta haciendo MVDForms
    document.querySelectorAll('span.custom-form-error').forEach(function (e) { e.remove() });
    let fieldsWithErrors = [];
    for (let keyField in data) {
        if (['Attachments', '_AttachmentsFiles'].includes(keyField)) continue;
        let field = fields.find(function (e) { return e.internalName === keyField });
        if (['Boolean'].includes(field.schema.Type)) continue;
        const value = data[keyField];
        let info = getFieldInfoByInternalName(keyField, document.body);
        if ((value === null || value === '') && field.schema.Required === 'TRUE') {
            fieldsWithErrors.push({ info, tooltipError: getErrorTooltip('No se puede dejar esto en blanco.') });
        }
        else {
            if (field.schema.Type === 'Text' && typeof field.schema.MaxLength !== 'undefined') {
                if (value && Number(field.schema.MaxLength) < value.length) {
                    fieldsWithErrors.push({ info, tooltipError: getErrorTooltip('No introduzca más de ' + field.schema.MaxLength + ' caracteres.') });
                }
            }
            else if (field.schema.Type === 'Number') {
                if (isNaN(value)) {
                    fieldsWithErrors.push({ info, tooltipError: getErrorTooltip('El valor de este campo no es un número válido.') });
                }
                else if (typeof field.schema.Min !== 'undefined' && typeof field.schema.Max !== 'undefined') {
                    if (!(value >= Number(field.schema.Min) && value <= Number(field.schema.Max))) {
                        fieldsWithErrors.push({ info, tooltipError: getErrorTooltip('El valor de este campo debe estar comprendido entre ' + field.schema.Min + ' y ' + field.schema.Max + '.') });
                    }
                }
                else if (typeof field.schema.Min !== 'undefined' && Number(field.schema.Min) > value) {
                    fieldsWithErrors.push({ info, tooltipError: getErrorTooltip('El valor de este campo debe ser mayor o igual a  ' + field.schema.Min + '.') });
                }
                else if (typeof field.schema.Max !== 'undefined' && Number(field.schema.Max) < value) {
                    fieldsWithErrors.push({ info, tooltipError: getErrorTooltip('El valor de este campo debe ser menor o igual a  ' + field.schema.Max + '.') });
                }
            }
            else if (field.schema.Type === 'DateTime') {
                if (value instanceof Date && isNaN(value.getTime()))
                    fieldsWithErrors.push({ info, tooltipError: getErrorTooltip('El valor de este campo no es una fecha válida.') });
            }
            else if (field.schema.EnforceUniqueValues === 'TRUE') {
                let errorMsg = await checkDuplicatedValue({ value, fieldType: field.schema.Type, itemId: data.ID })
                if (errorMsg) fieldsWithErrors.push({ info, tooltipError: getErrorTooltip(errorMsg) });
            }
        }
    }

    return fieldsWithErrors;

    function getErrorTooltip(errorMsg) {
        let span = document.createElement('span');
        span.classList = 'custom-form-error';
        span.innerHTML = '<span>' + errorMsg + '</span>';
        return span;
    }
    async function checkDuplicatedValue({ value, fieldType, itemId }) {
        let urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists('${_spPageContextInfo.pageListId}')/items?$select=Title&$filter=${fieldType} eq '${value}' ${(itemId > 0) ? `and (ID ne ${itemId})` : ''}`;
        let response = await fetch(urlToFetch, {
            method: 'GET',
            headers: {
                'accept': 'application/json;odata=verbose'
            }
        })
        let responseJSON = await response.json()
        return (response.status == 200 && responseJSON.d.results.length > 0) ? 'El valor de este campo esta duplicado en el servidor' : ''
    }
}


export { addPreSaveActionFunction, childToSaveObjectManager, deleteAttachmentByLinkName, getChildDataByInternalName, getCurrentToSaveObject, getToSaveObjectChildByInternalNameAndID, hideAttachmentByLinkName, initializeModule, mvdInitializeModule, openChildDialog, subscribeToSaveAgain, subscribeToPreSaveAsChild, whenIsRendered }