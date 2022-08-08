const NOT_ALLOWED_PROPERTIES_TO_SAVE_ITEM = ['Author', 'Created', 'Editor', 'Modified', 'Order', 'FileLeafRef']
const NOT_ALLOWED_PROPERTIES = ['AppAuthor', 'AppEditor', 'ContentTypeId', 'Created_x0020_Date', 'FSObjType', 'FileDirRef', 'FileRef', 'File_x0020_Type', 'FolderChildCount', 'GUID', 'InstanceID', 'ItemChildCount', 'Last_x0020_Modified', 'MetaInfo', 'ProgId', 'ScopeId', 'SortBehavior', 'SyncClientId', 'UniqueId', 'owshiddenversion', '_CopySource', '_HasCopyDestinations', '_IsCurrentVersion', '_Level', '_ModerationComments', '_ModerationStatus', '_UIVersion']
const NOT_ALLOWED_PROPERTIESS_ONLY_FOR_VERISON = ['AppAuthor', 'AppEditor', 'ContentTypeId', 'Created_x0020_Date', 'FSObjType', 'FileDirRef', 'FileRef', 'File_x0020_Type', 'FolderChildCount', 'GUID', 'InstanceID', 'ItemChildCount', 'Last_x0020_Modified', 'MetaInfo', 'ProgId', 'ScopeId', 'SortBehavior', 'SyncClientId', 'UniqueId', 'owshiddenversion', '_CopySource', '_HasCopyDestinations', '_Level']


let getAllListInfo, getFields, getListInfo

let convertXmlToObject, memoize
let exceptionHandler

async function mvdInitializeModule() {
  const modules = await MVD.importScripts(['sp-helpers/utilities', 'sp-helpers/exeptions']);
  ({ convertXmlToObject, memoize } = modules[0]);
  ({ exceptionHandler } = modules[1]);


  getFields = memoize(async function getFields({ listGUID, listUrl, siteUrl }) {
    const clientContext = new SP.ClientContext(siteUrl)
    const list = getList({ clientContext, listGUID, listUrl, siteUrl })
    const listFields = list.get_fields()
    clientContext.load(list, 'BaseType')
    clientContext.load(listFields)
    await executeQueryPromise(clientContext)

    const isLibrary = (list.get_baseType() == 1)

    let order = 1
    let fields = []
    const enumerator = listFields.getEnumerator()
    while (enumerator.moveNext()) {
      const field = enumerator.get_current()
      const internalName = field.get_internalName()
      const baseType = field.get_fromBaseType()
      const isHidden = field.get_hidden()
      if (!isHidden && (!baseType || ['Author', 'Created', 'Editor', 'ID', 'Modified', 'Title', 'Attachments'].includes(internalName) || (isLibrary && internalName == 'FileLeafRef'))) {
        const parser = new DOMParser()
        const xmlSchema = parser.parseFromString(field.get_schemaXml(), 'text/xml')
        const schema = convertXmlToObject(xmlSchema)
        const auxField = {
          name: field.get_title(),
          internalName: field.get_internalName(),
          type: field.get_typeAsString(),
          order: order++
        }

        if (schema.Customization && Array.isArray(schema.Customization.ArrayOfProperty.Property)) {
          const saveManagerProp = schema.Customization.ArrayOfProperty.Property.find(function (e) { return e.Name === 'saveManager' })
          if (typeof saveManagerProp !== 'undefined') {
            saveManagerProp.Value = JSON.parse(saveManagerProp.Value)
          }
          const behaviorInRelationFieldProp = schema.Customization.ArrayOfProperty.Property.find(function (e) { return e.Name === 'behaviorInRelationField' })
          if (typeof behaviorInRelationFieldProp !== 'undefined') {
            behaviorInRelationFieldProp.Value = JSON.parse(behaviorInRelationFieldProp.Value)
          }
          const customSettingsProp = schema.Customization.ArrayOfProperty.Property.find(function (e) { return e.Name === 'customSettings' })
          if (typeof customSettingsProp !== 'undefined') {
            customSettingsProp.Value = JSON.parse(customSettingsProp.Value)
          }
        }

        if (schema.CHOICES && schema.CHOICES.CHOICE) {
          const dataSource = []
          let choices = schema.CHOICES.CHOICE
          if (typeof choices === 'string') {
            choices = new Array(choices)
          }
          choices.forEach(function (e) {
            dataSource.push({
              text: e,
              value: e
            })
          })
          schema.DataChoices = dataSource
        }

        auxField.schema = schema
        fields.push(auxField)
      }
    }
    fields = fields.sort(function (a, b) {
      return a.name.localeCompare(b.name)
    })
    return fields
  })

  getAllListInfo = memoize(async function getAllListInfo({ siteUrl }) {
    const urlToFetch = `${(siteUrl !== '/') ? siteUrl + '/' : siteUrl}_api/Web/Lists?$select=BaseType,Id,Title,RootFolder/ServerRelativeUrl&$expand=RootFolder&$filter=Hidden eq false`
    const response = await fetch(urlToFetch, {
      method: 'GET',
      headers: {
        'accept': 'application/json;odata=verbose'
      }
    })
    const responseJSON = await response.json()
    if (response.status === 200) {
      return responseJSON.d.results.map(e => {
        let rootFolderServerRelativeUrl = e.RootFolder.ServerRelativeUrl
        let listUrl = (siteUrl !== '/') ? rootFolderServerRelativeUrl.replace(siteUrl, '') : rootFolderServerRelativeUrl
        return {
          listGUID: e.Id,
          listUrl: listUrl,
          title: e.Title,
          isLibrary: (e.BaseType == 1)
        }

      })
    } else {
      throw responseJSON.error.message.value
    }
  })

  getListInfo = memoize(async function getListInfo({ listGUID, listUrl, siteUrl }) {
    const selectQuery = '?$select=BaseType,Id,Title,RootFolder,Description/ServerRelativeUrl&$expand=RootFolder'
    const urlToFetch = (listGUID) ? `${(siteUrl !== '/') ? siteUrl + '/' : siteUrl}_api/web/lists('${listGUID}')${selectQuery}` :
      `${(siteUrl !== '/') ? siteUrl + '/' : siteUrl}_api/web/getlist('${concatListUrlAndSiteUrl({ siteUrl, listUrl })}')${selectQuery}`

    const response = await fetch(urlToFetch, {
      method: 'GET',
      headers: {
        'accept': 'application/json;odata=verbose'
      }
    })
    const responseJSON = await response.json()
    if (response.status === 200) {
      let rootFolderServerRelativeUrl = responseJSON.d.RootFolder.ServerRelativeUrl
      let listUrl = (siteUrl !== '/') ? rootFolderServerRelativeUrl.replace(siteUrl, '') : rootFolderServerRelativeUrl
      return {
        listGUID: `${responseJSON.d.Id}`,
        listUrl: listUrl,
        title: responseJSON.d.Title,
        isLibrary: responseJSON.d.BaseType == 1,
        description: responseJSON.d.Description
      }
    } else {
      throw responseJSON.error.message.value
    }
  })

}


// -----------------------------------------------------------   API for work whit mobile too  -----------------------------------------------------------//


function createBatch() {
  return []
}

async function executeBatch(currentBatch) {
  if (currentBatch.length == 0) return Promise.resolve([])
  let promises = []
  let clientContext
  for (let index = 0; index < currentBatch.length; index++) {
    let exception, pendingToProcess
    const batchElement = currentBatch[index];
    if (index == 0) clientContext = new SP.ClientContext(batchElement.siteUrl)
    batchElement._clientContext = clientContext;
    switch (batchElement.action) {
      case 'getItems':
        ({ exception, pendingToProcess } = await _getItems({ ...batchElement }));
        break;
      case 'getItemById':
        ({ exception, pendingToProcess } = await _getItemById({ ...batchElement }));
        break;
      case 'createItem':
        ({ exception, pendingToProcess } = await _createItem({ ...batchElement }));
        break;
      case 'updateItem':
        ({ exception, pendingToProcess } = await _updateItem({ ...batchElement }));
        break;
      case 'deleteItem':
        ({ exception, pendingToProcess } = await _deleteItem({ ...batchElement }));
        break;
      case 'recycleItem':
        ({ exception, pendingToProcess } = await _recycleItem({ ...batchElement }));
        break;
    }
    batchElement.exception = exception
    batchElement.pendingToProcess = pendingToProcess
  }
  await executeQueryPromise(clientContext)
  for (let index = 0; index < currentBatch.length; index++) {
    const batchElement = currentBatch[index];
    promises.push(processResult({ ...batchElement }))
  }
  return Promise.allSettled(promises)
    .then(function (promisesResult) {
      for (let index = 0; index < currentBatch.length; index++) {
        const batchElement = currentBatch[index]
        const batchPromise = promisesResult[index]
        delete batchElement.pendingToProcess
        delete batchElement._clientContext
        if (batchPromise.status === 'fulfilled') {
          delete batchElement.exception
          batchElement.result = batchPromise.value
        } else {
          batchElement.exception = batchPromise.reason
        }
      }
      return currentBatch
    })
}

function getItemDataFromFieldValues({ getAttachments, getVersions, listItem }) {
  const fieldValues = listItem.get_fieldValues()
  let itemData = {}
  for (let keyProp in fieldValues) {
    if (!getVersions && NOT_ALLOWED_PROPERTIES.includes(keyProp) || getVersions && NOT_ALLOWED_PROPERTIESS_ONLY_FOR_VERISON.includes(keyProp)) {
      continue
    }
    let value = fieldValues[keyProp]
    if (value && value.constructor) {
      let constructorType = getConstructorType(value)
      if (constructorType == 'SP.FieldUserValue') {
        value = (Array.isArray(value)) ? value.map(e => ({
          id: e.get_lookupId(),
          displayName: e.get_lookupValue(),
        })) : {
          id: value.get_lookupId(),
          displayName: value.get_lookupValue(),
        }
      }
      else if (constructorType == 'SP.FieldLookupValue') {
        value = (Array.isArray(value)) ? value.map(e => ({
          lookupId: e.get_lookupId(),
          lookupValue: e.get_lookupValue()
        })) : {
          lookupId: value.get_lookupId(),
          lookupValue: value.get_lookupValue()
        }
      }
      else if (constructorType == 'SP.FieldUrlValue') {
        value = {
          url: value.get_url(),
          description: value.get_description()
        }
      }
      else if (constructorType.startsWith('SP.')) {
        console.error('PROP NOT PROCESED ' + keyProp, value)
      }
    }
    if (keyProp === 'Attachments' && getAttachments) {
      const attachmentsData = []
      if (value) {
        const attachmentFiles = listItem.get_attachmentFiles()
        for (let i = 0; i < attachmentFiles.get_count(); i++) {
          const attachment = attachmentFiles.itemAt(i)
          attachmentsData.push({
            name: attachment.get_fileName(),
            url: attachment.get_serverRelativeUrl(),
          })
        }
      }
      itemData['_AttachmentsFiles'] = attachmentsData
    }
    itemData[keyProp] = value
  }
  return itemData

  function getConstructorType(value) {
    if (Array.isArray(value)) {
      return (value.length) ? value[0].constructor.getName() : value.constructor.getName()
    } else {
      return value.constructor.getName()
    }
  }
}

async function getItems({ batch, camlQuery, getAttachments, listGUID, listUrl, siteUrl }) {
  if (batch) {
    return batch.push({ action: 'getItems', camlQuery, getAttachments, listGUID, listUrl, siteUrl })
  } else {
    return await _getItems({ camlQuery, getAttachments, listGUID, listUrl, siteUrl })
  }
}

async function _getItems({ camlQuery, getAttachments, listGUID, listUrl, siteUrl, _clientContext }) {
  const clientContext = (_clientContext) ? _clientContext : new SP.ClientContext(siteUrl)
  const exceptionScope = new SP.ExceptionHandlingScope(clientContext)
  const startScope = exceptionScope.startScope()
  const tryScope = exceptionScope.startTry()
  const list = getList({ clientContext, listGUID, listUrl, siteUrl })
  let query
  if (camlQuery) {
    query = new SP.CamlQuery()
    query.set_viewXml(camlQuery)
  } else {
    query = SP.CamlQuery.createAllItemsQuery()
  }
  const items = list.getItems(query)
  clientContext.load(items)
  tryScope.dispose()
  const catchScope = exceptionScope.startCatch()
  catchScope.dispose()
  startScope.dispose()

  if (_clientContext) return { exception: exceptionScope, pendingToProcess: items }

  await executeQueryPromise(clientContext)

  const itemsData = await _getItemsProcessResult({ _clientContext: clientContext, exception: exceptionScope, getAttachments, pendingToProcess: items })
  return itemsData
}

async function _getItemsProcessResult({ _clientContext, exception, getAttachments, pendingToProcess }) {
  const clientContext = _clientContext
  if (exception.get_hasException()) exceptionHandler({ exception })
  const items = pendingToProcess
  if (items.get_count() > 0) {
    if (getAttachments) {
      const enumerator = items.getEnumerator()
      while (enumerator.moveNext()) {
        const listItem = enumerator.get_current()
        if (listItem.get_item('Attachments')) {
          clientContext.load(listItem.get_attachmentFiles())
        }
      }
      await executeQueryPromise(clientContext)
    }
    return _getItemsProcessResultAux({ items, getAttachments })
  } else {
    return []
  }

  function _getItemsProcessResultAux({ items, getAttachments }) {
    const itemsData = []
    const enumerator = items.getEnumerator()
    while (enumerator.moveNext()) {
      const listItem = enumerator.get_current()
      const itemData = getItemDataFromFieldValues({ listItem, getAttachments })
      itemsData.push(itemData)
    }
    return itemsData
  }
}

function processResult(batchElement) {
  switch (batchElement.action) {
    case 'getItems':
      return _getItemsProcessResult({ ...batchElement })
    case 'getItemById':
      return _getItemByIdProcessResult({ ...batchElement })
    case 'createItem':
      return _createItemProcessResult({ ...batchElement })
    case 'updateItem':
      return _updateItemProcessResult({ ...batchElement })
    case 'deleteItem':
      return _deleteItemProcessResult({ ...batchElement })
    case 'recycleItem':
      return _recycleItemProcessResult({ ...batchElement })
  }
}

async function getItemById({ batch, getAttachments, getVersions, id, listGUID, listUrl, siteUrl }) {
  if (batch) {
    return batch.push({ action: 'getItemById', getAttachments, getVersions, id, listGUID, listUrl, siteUrl })
  } else {
    return await _getItemById({ getAttachments, getVersions, id, listGUID, listUrl, siteUrl })
  }
}

async function _getItemById({ _clientContext, getAttachments, getVersions, id, listGUID, listUrl, siteUrl }) {
  const clientContext = (_clientContext) ? _clientContext : new SP.ClientContext(siteUrl)
  const exceptionScope = new SP.ExceptionHandlingScope(clientContext)
  const startScope = exceptionScope.startScope()
  const tryScope = exceptionScope.startTry()
  const list = getList({ clientContext, listGUID, listUrl, siteUrl })
  const item = list.getItemById(id)
  if (getVersions) {
    clientContext.load(item.get_versions())
  }
  clientContext.load(item)
  tryScope.dispose()
  const catchScope = exceptionScope.startCatch()
  catchScope.dispose()
  startScope.dispose()

  if (_clientContext) return { exception: exceptionScope, pendingToProcess: item }
  await executeQueryPromise(clientContext)
  const itemData = await _getItemByIdProcessResult({ _clientContext: clientContext, exception: exceptionScope, getAttachments, getVersions, pendingToProcess: item })
  return itemData
}

async function _getItemByIdProcessResult({ _clientContext, exception, getAttachments, getVersions, pendingToProcess }) {
  const clientContext = _clientContext
  if (exception.get_hasException()) exceptionHandler({ exception })
  const item = pendingToProcess

  if (getAttachments && item.get_item('Attachments')) {
    clientContext.load(item.get_attachmentFiles())
    await executeQueryPromise(clientContext)
    return _getItemByIdProcessResultAux({ item, getAttachments })
  } else {
    return _getItemByIdProcessResultAux({ item, getAttachments, getVersions })
  }


  function _getItemByIdProcessResultAux({ item, getAttachments, getVersions }) {
    const itemData = getItemDataFromFieldValues({ listItem: item, getAttachments })
    if (getVersions) {
      itemData._Versions = []
      const versionsEnumerator = item.get_versions().getEnumerator()
      while (versionsEnumerator.moveNext()) {
        const listItem = versionsEnumerator.get_current()
        const itemVersionData = getItemDataFromFieldValues({ listItem, getVersions })
        itemData._Versions.push(itemVersionData)
      }
    }
    return itemData
  }
}

function getList({ clientContext, listGUID, listUrl, siteUrl }) {
  let list
  const web = clientContext.get_web()
  if (listGUID) {
    const lists = web.get_lists()
    list = lists.getById(listGUID)
  } else {
    let listUrlConcated = concatListUrlAndSiteUrl({ siteUrl, listUrl })
    list = web.getList(listUrlConcated)
  }
  return list
}

async function getUserPermissions({ listGUID, listUrl, siteUrl }) {
  const clientContext = new SP.ClientContext(siteUrl)
  const list = getList({ clientContext, listGUID, listUrl, siteUrl })
  clientContext.load(list, 'EffectiveBasePermissions');
  await executeQueryPromise(clientContext)
  const userPermissions = {
    add: list.get_effectiveBasePermissions().has(SP.PermissionKind.addListItems),
    edit: list.get_effectiveBasePermissions().has(SP.PermissionKind.editListItems),
    delete: list.get_effectiveBasePermissions().has(SP.PermissionKind.deleteListItems),
    view: list.get_effectiveBasePermissions().has(SP.PermissionKind.viewListItems),
  }
  return userPermissions
}

async function createItem({ batch, item, listGUID, listUrl, siteUrl }) {
  if (batch) {
    return batch.push({ action: 'createItem', item, listGUID, listUrl, siteUrl })
  } else {
    return await _createItem({ item, listGUID, listUrl, siteUrl })
  }
}

async function _createItem({ item, listGUID, listUrl, siteUrl, _clientContext }) {
  const clientContext = (_clientContext) ? _clientContext : new SP.ClientContext(siteUrl)
  const exceptionScope = new SP.ExceptionHandlingScope(clientContext)
  const startScope = exceptionScope.startScope()
  const tryScope = exceptionScope.startTry()
  const list = getList({ clientContext, listGUID, listUrl, siteUrl })
  const newItem = list.addItem(new SP.ListItemCreationInformation())
  const processedItemProperties = processItemPropertiesValuesToSave(JSON.parse(JSON.stringify(item)))
  for (let keyProp in processedItemProperties) {
    if (['ID', 'Attachments', '_AttachmentsFiles'].includes(keyProp)) continue
    newItem.set_item(keyProp, processedItemProperties[keyProp])
  }
  newItem.update()
  clientContext.load(newItem)
  tryScope.dispose()
  const catchScope = exceptionScope.startCatch()
  catchScope.dispose()
  startScope.dispose()
  if (_clientContext) return { exception: exceptionScope, pendingToProcess: newItem }
  await executeQueryPromise(clientContext)
  const newItemId = await _createItemProcessResult({ exception: exceptionScope, item, pendingToProcess: newItem, listGUID, listUrl })
  return newItemId
}

async function _createItemProcessResult({ exception, item, pendingToProcess, listGUID, listUrl }) {
  if (exception.get_hasException()) exceptionHandler({ exception })
  const newItem = pendingToProcess
  const newItemId = newItem.get_id()
  if (item['_AttachmentsFiles'] && item['_AttachmentsFiles'].length) {
    await itemAttachmentsHandler({ attachmentFiles: item['_AttachmentsFiles'], itemId: newItemId, listGUID, listUrl })
  }
  return newItemId
}

async function updateItem({ batch, item, listGUID, listUrl, siteUrl }) {
  if (batch) {
    return batch.push({ action: 'updateItem', item, listGUID, listUrl, siteUrl })
  } else {
    return await _updateItem({ item, listGUID, listUrl, siteUrl })
  }
}

async function _updateItem({ item, listGUID, listUrl, siteUrl, _clientContext }) {
  const clientContext = (_clientContext) ? _clientContext : new SP.ClientContext(siteUrl)
  const exceptionScope = new SP.ExceptionHandlingScope(clientContext)
  const startScope = exceptionScope.startScope()
  const tryScope = exceptionScope.startTry()
  const list = getList({ clientContext, listGUID, listUrl, siteUrl })
  const spItem = list.getItemById(item.ID)
  const processedItemProperties = processItemPropertiesValuesToSave(JSON.parse(JSON.stringify(item)))
  for (let keyProp in processedItemProperties) {
    if (['ID', 'Attachments', '_AttachmentsFiles'].includes(keyProp)) continue
    spItem.set_item(keyProp, processedItemProperties[keyProp])
  }
  spItem.update()
  clientContext.load(spItem)
  tryScope.dispose()
  const catchScope = exceptionScope.startCatch()
  catchScope.dispose()
  startScope.dispose()
  if (_clientContext) return { exception: exceptionScope, pendingToProcess: spItem }
  await executeQueryPromise(clientContext)
  const updatedItem = await _updateItemProcessResult({ exception: exceptionScope, item, pendingToProcess: spItem, listGUID, listUrl })
  return updatedItem
}

async function _updateItemProcessResult({ exception, item, pendingToProcess, listGUID, listUrl }) {
  if (exception.get_hasException()) exceptionHandler({ exception })
  if (item['_AttachmentsFiles'] && item['_AttachmentsFiles'].length) {
    await itemAttachmentsHandler({ attachmentFiles: item['_AttachmentsFiles'], itemId: item.ID, listGUID, listUrl })
    item['_AttachmentsFiles'] = item['_AttachmentsFiles'].filter(e => e.action != 'delete')
  }
  return item
}

function processItemPropertiesValuesToSave(item) {
  for (let keyProp in item) {
    let value = item[keyProp]
    if (['ID', 'Attachments', '_AttachmentsFiles'].includes(keyProp) || !value) continue
    if (NOT_ALLOWED_PROPERTIES_TO_SAVE_ITEM.includes(keyProp)) {
      delete item[keyProp]
      continue
    }
    let constructorType = getConstructorType(value)
    if (constructorType == 'SP.FieldUserValue') {
      value = (Array.isArray(value)) ? value.map(e => SP.FieldUserValue.fromUser(e.displayName)) : SP.FieldUserValue.fromUser(value.displayName)
    }
    else if (constructorType == 'SP.FieldLookupValue') {
      value = (Array.isArray(value)) ? value.map(e => e.lookupId + ';#' + e.lookupValue).join(';#') : value.lookupId + ';#' + value.lookupValue
    }
    else if (constructorType == 'SP.FieldUrlValue') {
      let urlValue = new SP.FieldUrlValue();
      urlValue.set_url(value.url);
      urlValue.set_description(value.description);
      value = urlValue
    }
    else if (constructorType.startsWith('SP.')) {
      console.error('PROP NOT PROCESED ' + keyProp, value)
    }
    else if (Object.prototype.toString.call(value) === '[object Date]' && isFinite(value)) {
      value = value.toISOString()
    }
    item[keyProp] = value
  }
  return item

  function getConstructorType(value) {
    if (Array.isArray(value)) {
      return (value.length) ? getConstructorTypeAux(value[0]) : getConstructorTypeAux(value)
    } else {
      return getConstructorTypeAux(value)
    }
    function getConstructorTypeAux(value) {
      if (typeof value.id !== "undefined" && typeof value.displayName !== "undefined") {
        return 'SP.FieldUserValue'
      } else if (typeof value.lookupId !== "undefined" && typeof value.lookupValue !== "undefined") {
        return 'SP.FieldLookupValue'
      } else if (typeof value.url !== "undefined" && typeof value.description !== "undefined") {
        return 'SP.FieldUrlValue'
      } else {
        return value.constructor.getName()
      }
    }
  }
}

async function itemAttachmentsHandler({ attachmentFiles, itemId, listGUID, listUrl }) {
  attachmentFiles = attachmentFiles.sort(function (a, b) {
    return (a.action === 'delete') ? -1 : 0
  })
  for (let index = 0; index < attachmentFiles.length; index++) {
    const attachmentFile = attachmentFiles[index];
    if (attachmentFile.action == 'add') await addItemAttachment({ attachmentFile, itemId, listGUID, listUrl })
    else if (attachmentFile.action == 'delete') await deleteItemAttachment({ attachmentFile, itemId, listGUID, listUrl })
  }
}

async function addItemAttachment({ attachmentFile, itemId, listGUID, listUrl, intentCount = 1 }) {
  const arrayBuffer = attachmentFile.arrayBuffer
  const urlToFetch = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/${(listGUID) ? `lists('${listGUID}')` : `getlist('${listUrl}')`}/items('${itemId}')/AttachmentFiles/add(FileName='${attachmentFile.name}')`
  const fetchSettings = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'accept': 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'content-length': arrayBuffer.length,
      'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
    },
    body: arrayBuffer
  }
  try {
    const response = await fetch(urlToFetch, fetchSettings)
    const jsonResponse = await response.json()
    if (response.status == 400) {
      let nameOnly = attachmentFile.name.substring(0, attachmentFile.name.lastIndexOf('.'))
      if (intentCount > 1)
        nameOnly = nameOnly.substring(0, nameOnly.lastIndexOf('_'))
      const fileExtension = attachmentFile.name.substring(attachmentFile.name.lastIndexOf('.'))
      attachmentFile.name = nameOnly + '_' + intentCount + fileExtension
      intentCount = intentCount + 1
      return addItemAttachment({ attachmentFile, itemId, listGUID, listUrl, intentCount })
    } else if (response.status == 500) {//error de attachments in datos
      console.error(jsonResponse)
    }
  } catch (error) {
    console.error(error)
    throw ({
      restException: {
        type: 'ServerError',
        message: 'Error en servidor'
      }
    })
  }
}

async function editItemAttachment({ attachmentFile, itemId, listGUID, listUrl, intentCount = 1 }) {
  // POST https://{site_url}/_api/web/lists/getbytitle('{list_title}')/items({item_id})/AttachmentFiles('{file_name}')/$value
  // Authorization: "Bearer " + accessToken
  // Content - Length: {length of request body as integer }
  // X - HTTP - Method: "PUT"
  // X - RequestDigest: "{form_digest_value}"
  
  const arrayBuffer = attachmentFile.arrayBuffer
  const urlToFetch = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/${(listGUID) ? `lists('${listGUID}')` : `getlist('${listUrl}')`}/items('${itemId}')/AttachmentFiles/add(FileName='${attachmentFile.name}')`
  const fetchSettings = {
    method: 'PUT',
    credentials: 'same-origin',
    headers: {
      'accept': 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'content-length': arrayBuffer.length,
      'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
    },
    body: arrayBuffer
  }
  try {
    const response = await fetch(urlToFetch, fetchSettings)
    const jsonResponse = await response.json()
    if (response.status == 400) {
      let nameOnly = attachmentFile.name.substring(0, attachmentFile.name.lastIndexOf('.'))
      if (intentCount > 1)
        nameOnly = nameOnly.substring(0, nameOnly.lastIndexOf('_'))
      const fileExtension = attachmentFile.name.substring(attachmentFile.name.lastIndexOf('.'))
      attachmentFile.name = nameOnly + '_' + intentCount + fileExtension
      intentCount = intentCount + 1
      return addItemAttachment({ attachmentFile, itemId, listGUID, listUrl, intentCount })
    } else if (response.status == 500) {//error de attachments in datos
      console.error(jsonResponse)
    }
  } catch (error) {
    console.error(error)
    throw ({
      restException: {
        type: 'ServerError',
        message: 'Error en servidor'
      }
    })
  }
}

async function deleteItemAttachment({ attachmentFile, itemId, listGUID, listUrl }) {
  const urlToFetch = `${_spPageContextInfo.webAbsoluteUrl}/_api/web/${(listGUID) ? `lists('${listGUID}')` : `getlist('${listUrl}')`}/items('${itemId}')/AttachmentFiles('${attachmentFile.name}')`
  const fetchSettings = {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
    },
  }
  try {
    const response = await fetch(urlToFetch, fetchSettings)
    if (response.status !== 200) {
      console.error(response)
    }
  } catch (error) {
    console.error(error)
    throw ({
      restException: {
        type: 'ServerError',
        message: 'Error en servidor'
      }
    })
  }
}

async function recycleItem({ batch, item, listGUID, listUrl, siteUrl }) {
  if (batch) {
    return batch.push({ action: 'recycleItem', item, listGUID, listUrl, siteUrl })
  } else {
    return await _recycleItem({ item, listGUID, listUrl, siteUrl })
  }
}

async function _recycleItem({ item, listGUID, listUrl, siteUrl, _clientContext }) {
  const clientContext = (_clientContext) ? _clientContext : new SP.ClientContext(siteUrl)
  const exceptionScope = new SP.ExceptionHandlingScope(clientContext)
  const startScope = exceptionScope.startScope()
  const tryScope = exceptionScope.startTry()
  const list = getList({ clientContext, listGUID, listUrl, siteUrl })
  const spItem = list.getItemById(item.ID)
  spItem.recycle()
  tryScope.dispose()
  const catchScope = exceptionScope.startCatch()
  catchScope.dispose()
  startScope.dispose()
  if (_clientContext) return { exception: exceptionScope, pendingToProcess: spItem }
  await executeQueryPromise(clientContext)
  return await _recycleItemProcessResult({ exception: exceptionScope })
}

async function _recycleItemProcessResult({ exception }) {
  if (exception.get_hasException()) exceptionHandler({ exception })
  return null
}

async function deleteItem({ batch, item, listGUID, listUrl, siteUrl }) {
  if (batch) {
    return batch.push({ action: 'deleteItem', item, listGUID, listUrl, siteUrl })
  } else {
    return await _deleteItem({ item, listGUID, listUrl, siteUrl })
  }
}

async function _deleteItem({ item, listGUID, listUrl, siteUrl, _clientContext }) {
  const clientContext = (_clientContext) ? _clientContext : new SP.ClientContext(siteUrl)
  const exceptionScope = new SP.ExceptionHandlingScope(clientContext)
  const startScope = exceptionScope.startScope()
  const tryScope = exceptionScope.startTry()
  const list = getList({ clientContext, listGUID, listUrl, siteUrl })
  const spItem = list.getItemById(item.ID)
  spItem.deleteObject()
  tryScope.dispose()
  const catchScope = exceptionScope.startCatch()
  catchScope.dispose()
  startScope.dispose()
  if (_clientContext) return { exception: exceptionScope, pendingToProcess: spItem }
  await executeQueryPromise(clientContext)
  return await _deleteItemProcessResult({ exception: exceptionScope })
}

async function _deleteItemProcessResult({ exception }) {
  if (exception.get_hasException()) exceptionHandler({ exception })
  return null
}


// -----------------------------------------------------------   utils  -----------------------------------------------------------//

function executeQueryPromise(clientContext) {
  return new Promise((resolve, reject) => {
    clientContext.executeQueryAsync(
      function () { resolve() },
      function (sender, args) { reject(args) }
    )
  })
}

function concatListUrlAndSiteUrl({ siteUrl = '/', listUrl }) {
  if (siteUrl === '/') {
    return (listUrl.startsWith('/')) ? listUrl : siteUrl + listUrl
  } else {
    return (listUrl.startsWith('/')) ? siteUrl + listUrl : siteUrl + '/' + listUrl
  }
}


export { mvdInitializeModule, concatListUrlAndSiteUrl, createBatch, createItem, executeBatch, getFields, getItems, getItemById, getUserPermissions, getAllListInfo, getListInfo, updateItem, deleteItem, recycleItem }