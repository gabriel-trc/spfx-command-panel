let convertXmlToObject
let executeQueryPromise
let createItem, getAllListInfo, getFields, getItems, getListInfo, updateItem

const TABLE_CRUD_MODES = {
  DISPLAY: 1,
  EDIT: 2,
  NEW: 3,
}

let allCustomActions = []
let serverPackages = []
let allSiteLists = []
const customActionsToExport = []
const filesToExport = []
const listDataToExport = []
const dependenciesToExport = []
const spListsToExport = []
let allCurrentSitePackages = []
let currentSitePackages = []
let consoleMsgTextArray = []


async function mvdInitializeModule() {
  if (location.href.toLowerCase().includes('pageview=shared')) return
  MVD.pageLoader({ show: true })
  let [modules, files] = await Promise.all([
    MVD.importScripts(['sp-helpers/utilities', 'sp-helpers/common', 'sp-helpers/list-items', 'libraries/file-saver', 'libraries/js-zip']),
    MVD.loadFiles([{ type: MVD.versionsTypes.LINK, key: 'updater/index' }])
  ]);
  ({ convertXmlToObject } = modules[0]);
  ({ executeQueryPromise } = modules[1]);
  ({ createItem, getAllListInfo, getFields, getItems, getListInfo, updateItem } = modules[2]);

  if (location.href.toLowerCase().includes('/index.aspx')) {
    initializeModule();
  } else {
    MVD.pageLoader({ show: false })
  }

  window.onerror = function (message, file, line, col, error) {
    console.error("Error occurred: " + error.message);
    return false;
  };
}

async function initializeModule() {
  try {
    await MVD.awaitFor.SPClientContext()
    const [httpResponse] = await Promise.all([fetch(_spPageContextInfo.siteAbsoluteUrl + '/MVDAssets/updater/index-view-template.html'), getDataToInitModule()])
    const innerHTML = await httpResponse.text()
    const deltaPlaceHolderMainElement = document.getElementById('DeltaPlaceHolderMain')
    const childrens = Array.from(deltaPlaceHolderMainElement.children)
    childrens.forEach(e => e.style.display = 'none')
    const updaterContainer = document.createElement('div')
    updaterContainer.id = 'updaterContainer'
    updaterContainer.innerHTML = innerHTML
    deltaPlaceHolderMainElement.append(updaterContainer)
    // applyComparedCurrentSiteWithServerPackages();
    refreshCurrentSitePackagesTableHTML()
    refreshCustomActionsHandlerTableHTML()
    bindingFunctions()
    MVD.pageLoader({ show: false })
  } catch (error) {
    console.error(error)
  }
}

function getDataToInitModule() {
  return new Promise(function (resolve, reject) {
    allCustomActions = []
    serverPackages = []
    allSiteLists = []
    Promise.all([getAllListInfo({ siteUrl: _spPageContextInfo.webServerRelativeUrl }), /* getServerPackages(), */ getAllCustomActions(), getCurrentSitePackages()])
      .then(function (args) {
        allSiteLists = [].concat(args[0])
        resolve()
      }).catch(function (args) {
        reject(args)
      })
  })
}

function bindingFunctions() {
  document.getElementById('packageCreator').addEventListener('click', (event) => {
    changePrincipalView(event.target.id)
  })
  document.getElementById('customActionHandler').addEventListener('click', (event) => {
    changePrincipalView(event.target.id)
  })
  document.getElementById('packageUpdater').addEventListener('click', (event) => {
    changePrincipalView(event.target.id)
  })
  document.getElementById('generatePackageBtn').addEventListener('click', () => {
    generatePackage()
  })
  document.getElementById('addListRowBtn').addEventListener('click', () => {
    addSPListRow()
  })
  document.getElementById('addCustomActionToExportRowBtn').addEventListener('click', () => {
    addCustomActionToExportRow()
  })
  document.getElementById('listsToExportTable').addEventListener('click', (event) => {
    if (event.target.id.startsWith('getRelationListsBtn_')) {
      const trElement = event.target.closest('tr')
      const rowKey = trElement.getAttribute('id')
      getRelationListsOfSPList(rowKey, true)
      event.stopPropagation()
    } else if (event.target.id.startsWith('getLookupListsBtn_')) {
      const trElement = event.target.closest('tr')
      const rowKey = trElement.getAttribute('id')
      getRelationListsOfSPList(rowKey, false)
      event.stopPropagation()
    } else if (event.target.id.startsWith('deleteListsBtn_')) {
      const trElement = event.target.closest('tr')
      const rowKey = trElement.getAttribute('id')
      deleteSPListRowHTML(rowKey)
      event.stopPropagation()
    }
  })
  document.getElementById('listsToExportTable').addEventListener('change', (event) => {
    if (event.target.id.startsWith('selectList_')) {
      onChangeSelectList(event.target)
      event.stopPropagation()
    } else if (event.target.id.startsWith('selectViews_')) {
      onChangeSelectViews(event.target)
      event.stopPropagation()
    } else if (event.target.id.startsWith('selectFields_')) {
      onChangeSelectFields(event.target)
      event.stopPropagation()
    } else if (event.target.id.startsWith('selectAllFields_')) {
      onChangeSelectAllFieldsCheckbox(event.target)
      event.stopPropagation()
    } else if (event.target.id.startsWith('belongsToPackage_')) {
      onChangeBelongsToPackageCheckbox(event.target)
      event.stopPropagation()
    }
  })
  document.getElementById('customActionsToExportTable').addEventListener('click', (event) => {
    if (event.target.id.startsWith('deleteCustomActionToExportBtn_')) {
      const trElement = event.target.closest('tr')
      const rowKey = trElement.getAttribute('id')
      deleteCustomActionToExportRowHTML(rowKey)
      event.stopPropagation()
    }
  })
  document.getElementById('customActionsToExportTable').addEventListener('change', (event) => {
    if (event.target.id.startsWith('selectCustomAction_')) {
      onChangeCustomActionToExport(event.target)
      event.stopPropagation()
    }
  })
  document.getElementById('addZipFilePackageRowBtn').addEventListener('click', () => {
    document.getElementById('zipFilePackageInput').click()
  })
  document.getElementById('zipFilePackageInput').addEventListener('change', (event) => {
    onChangeZipFilePackageInput(event.target.files[0])
    event.stopPropagation()
    event.preventDefault()
  })
  document.getElementById('filesToExportTable').addEventListener('click', (event) => {
    if (event.target.id.startsWith('deleteFileBtn_')) {
      const fileName = event.target.id.replace('deleteFileBtn_', '')
      deleteFileRowHTML(fileName)
      event.stopPropagation()
    }
  })
  document.getElementById('addListDataRowBtn').addEventListener('click', () => {
    addListDataRow()
  })
  document.getElementById('listDataToExportTable').addEventListener('change', (event) => {
    if (event.target.id.startsWith('selectListData_')) {
      onChangeSelectListData(event.target)
      event.stopPropagation()
    } else if (event.target.id.startsWith('selectListDataView_')) {
      onChangeSelectListDataView(event.target)
      event.stopPropagation()
    } else if (event.target.id.startsWith('selectListDataViewPrimaryField_')) {
      onChangeSelectListDataViewPrimaryField(event.target)
      event.stopPropagation()
    }
  })
  document.getElementById('listDataToExportTable').addEventListener('click', (event) => {
    if (event.target.id.startsWith('deleteListDataBtn_')) {
      const trElement = event.target.closest('tr')
      const rowKey = trElement.getAttribute('id')
      deleteListViewDataRowHTML(rowKey)
      event.stopPropagation()
    }
  })
  document.getElementById('addDependencyRowBtn').addEventListener('click', () => {
    addDependencyRow()
  })
  document.getElementById('dependenciesToExportTable').addEventListener('click', (event) => {
    if (event.target.id.startsWith('deleteDependencyBtn_')) {
      const trElement = event.target.closest('tr')
      const rowKey = trElement.getAttribute('id')
      deleteDependencyRowHTML(rowKey)
      event.stopPropagation()
    }
  })
  document.getElementById('dependenciesToExportTable').addEventListener('change', (event) => {
    onChangeSelectDependencyPackage(event.target)
    event.stopPropagation()
  })
  document.getElementById('addPackageToSiteBtn').addEventListener('click', () => {
    document.getElementById('addPackageFileInput').click()
  })
  document.getElementById('addPackageFileInput').addEventListener('change', (event) => {
    onChangeAddPackageFileInput(event.target.files[0])
    event.stopPropagation()
    event.preventDefault()
  })
  document.getElementById('currentSitePackagesTable').addEventListener('click', (event) => {
    /* if (event.target.id.startsWith('uninstallCurrentSitePackageBtn_')) {
       const trElement = event.target.closest('tr')
       uninstallCurrentSitePackage(trElement.rowIndex)
       event.stopPropagation()
     } else if (event.target.id.startsWith('updateCurrentSitePackageBtn_')) {
       const trElement = event.target.closest('tr')
       updateCurrentSitePackage(trElement.rowIndex)
       event.stopPropagation()
     }*/
  })
  document.getElementById('customActionHandlerTable').addEventListener('click', (event) => {
    if (event.target.id.startsWith('deleteCustomActionBtn_')) {
      onClickDeleteCustomAction(event.target)
      event.stopPropagation()
    } else if (event.target.id.startsWith('editCustomActionBtn_')) {
      onClickEditCustomAction(event.target)
      event.stopPropagation()
    } else if (event.target.id.startsWith('cancelCustomActionBtn_')) {
      onClickCancelCustomAction(event.target)
      event.stopPropagation()
    } else if (event.target.id.startsWith('saveCustomActionBtn_')) {
      onClickSaveCustomAction(event.target)
      event.stopPropagation()
    }
  })
  document.getElementById('addCustomActionRowFormBtn').addEventListener('click', () => {
    onClickAddCustomActionRowFormBtn()
  })
}

function changePrincipalView(navTabID) {
  const packageCreatorContainerElement = document.getElementById('packageCreatorContainer')
  const packageUpdaterContainerElement = document.getElementById('packageUpdaterContainer')
  const customActionHandlerContainerElement = document.getElementById('customActionHandlerContainer')

  packageCreatorContainerElement.style.display = (packageCreatorContainerElement.id.includes(navTabID)) ? 'block' : 'none'
  packageUpdaterContainerElement.style.display = (packageUpdaterContainerElement.id.includes(navTabID)) ? 'flex' : 'none'
  customActionHandlerContainerElement.style.display = (customActionHandlerContainerElement.id.includes(navTabID)) ? 'block' : 'none'

  const aElementsArray = Array.from(document.querySelectorAll('#homeNavigationBar a'))
  aElementsArray.forEach(function (aElement) {
    if (aElement.id == navTabID) {
      aElement.classList.add('selectedTab')
    } else {
      aElement.classList.remove('selectedTab')
    }
  })
}

async function processFileInput(file) {
  if (['zip', 'application/octet-stream', 'application/zip', 'application/x-zip', 'application/x-zip-compressed'].includes(file.type)) {
    const processedFile = await handleFile(file)
    return processedFile
  } else {
    alert(`El archivo ${file.name} no es admitido`)
  }

  function handleFile(file) {
    return new Promise(function (resolve, reject) {
      const fileData = {
        entries: [],
        name: file.name,
        files: []
      }
      JSZip.loadAsync(file)
        .then(async function (zip) {
          for (const fileRoot in zip.files) {
            fileData.entries.push(fileRoot)
            if (zip.files[fileRoot].dir) continue
            const arrayBuffer = await zip.files[fileRoot].async('arraybuffer')
            fileData.files.push({ fileRoot, arrayBuffer })
          }
          resolve(fileData)
        }, function (e) {
          reject(e)
        })
    })
  }
}




/*-----------------------------------------------------------   TAB CRAECIÓN DE PAQUETES   -----------------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------------------------------------*/


/*-----------------------------------------------------------   Listas   -----------------------------------------------------------*/

function addSPListRow(spListModel) {
  const listsToExportTableBodyElement = document.getElementById('listsToExportTable').querySelector('tbody')
  const newRowElement = listsToExportTableBodyElement.insertRow(listsToExportTableBodyElement.rows.length)
  const rowKey = crypto.getRandomValues(new Uint32Array(1))[0]
  newRowElement.setAttribute('id', rowKey)
  const innerHTML = getListRowInnerHTML(rowKey, spListModel)
  newRowElement.innerHTML = innerHTML
  const spList = spListFactory('', rowKey)
  if (spListModel) spList.setModel(spListModel)
  spListsToExport.push(spList)
}

function deleteSPListRowHTML(rowKey) {
  const spListIndex = spListsToExport.findIndex(e => e.getRowKey() == rowKey)
  spListsToExport.splice(spListIndex, 1)
  refreshSPListsTableHTML()
}

async function getFieldSchemaResumed(fieldSchema, useAsAPI) {
  const resumedFieldSchema = {}
  let properties = ['Customization', 'Default', 'Description', 'DisplayName', 'EnforceUniqueValues', 'Indexed', 'JSLink', 'Name', 'StaticName', 'Required', 'Type']
  if (fieldSchema.Type === 'Text') {
    properties = properties.concat(['MaxLength'])
  } else if (['Lookup', 'LookupMulti'].includes(fieldSchema.Type)) {
    properties = properties.concat(['List', 'ListUrl', 'Mult', 'RelationshipDeleteBehavior', 'ShowField', 'FieldRef', 'ReadOnly'])
    let listInfo = await getListInfo({ listGUID: fieldSchema.List, siteUrl: _spPageContextInfo.webServerRelativeUrl })
    fieldSchema.ListUrl = listInfo.listUrl
    if (_spPageContextInfo.webServerRelativeUrl !== '/') fieldSchema.ListUrl = fieldSchema.ListUrl.replace(_spPageContextInfo.webServerRelativeUrl, '')
  } else if (['User', 'UserMulti'].includes(fieldSchema.Type)) {
    properties = properties.concat(['Mult', 'ShowField', 'UserSelectionMode', 'UserSelectionScope'])
  } else if (['Choice', 'MultiChoice'].includes(fieldSchema.Type)) {
    properties = properties.concat(['CHOICES', 'FillInChoice', 'Format'])
  } else if (fieldSchema.Type === 'DateTime') {
    properties = properties.concat(['Format'])
  } else if (fieldSchema.Type === 'Note') {
    properties = properties.concat(['AppendOnly', 'IsolateStyles', 'NumLines', 'RestrictedMode', 'RichText', 'RichTextMode'])
    if (fieldSchema.Customization) {
      const saveManagerProp = fieldSchema.Customization.ArrayOfProperty.Property.find(el => el.Name == 'saveManager')
      if (saveManagerProp) {
        const saveManagerPropValue = JSON.parse(saveManagerProp.Value)
        if (saveManagerPropValue.listGUID) {
          let listInfo = await getListInfo({ listGUID: saveManagerPropValue.listGUID, siteUrl: _spPageContextInfo.webServerRelativeUrl })
          saveManagerPropValue.listUrl = listInfo.listUrl
          saveManagerProp.Value = JSON.stringify(saveManagerPropValue)
        }
      }
    }
  } else if (fieldSchema.Type === 'Calculated') {
    properties = properties.concat(['FieldRefs', 'Format', 'Formula', 'ResultType'])

  } else if (fieldSchema.Type === 'URL') {
    properties = properties.concat(['Format'])
  } else if (['Currency', 'Number'].includes(fieldSchema.Type)) {
    properties = properties.concat(['Decimals', 'Max', 'Min', 'Percentage'])
  }
  for (let i = 0; i < properties.length; i++) {
    const prop = properties[i]
    if (fieldSchema[prop]) {
      let value = fieldSchema[prop]
      if (prop === 'Description') {
        value = value.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;');
      }
      resumedFieldSchema[prop] = value
    }
  }
  resumedFieldSchema.SelectedToExport = useAsAPI ?? false
  return resumedFieldSchema
}

function getListRowInnerHTML(rowKey, spListModel) {
  const allFieldsAreSelected = (spListModel && spListModel.fields.length === spListModel.fields.filter(field => field.SelectedToExport).length)
  const strFields = `${(spListModel && spListModel.fields.length) ? `<label>Seleccionar todos</label><input type="checkbox" id="selectAllFields_${rowKey}" ${(allFieldsAreSelected) ? 'checked' : ''}  />` : ''} 
        <select id="selectFields_${rowKey}" size="7" style="display:block" multiple ${(allFieldsAreSelected) ? 'disabled' : ''}>${(spListModel) ? spListModel.fields.map(field => `<option value="${field.Name}"  ${(field.SelectedToExport) ? 'selected' : ''}  >${field.DisplayName}</option>`).join('') : ''}</select>`
  const strViews = `<select id="selectViews_${rowKey}" size="7" multiple>${(spListModel) ? spListModel.views.map(view => `<option value="${view.Url}"  ${(view.SelectedToExport) ? 'selected' : ''}>${view.Url}</option>`).join('') : ''}</select>`
  const innerHTML =
    `<td><select id="selectList_${rowKey}"><option value="0">Seleccione una lista</option>${allSiteLists.map(list => `<option value="${list.listGUID}" ${(spListModel && spListModel.guid === list.listGUID) ? 'selected' : ''}>${list.title}</option>`).join('')}</select></td>
        <td>${(spListModel) ? spListModel.listUrl : ''}</td>
        <td>${strFields}</td>
        <td>${strViews}</td>
        <td style="text-align:center">
        ${(spListModel && spListModel.relatedLists.length) ? `<button style="display: block; margin-bottom: 10px;" type="button" id="getRelationListsBtn_${rowKey}">Listas relacionadas</button>` : ''}
        ${(spListModel && spListModel.relatedListsLookup.length) ? `<button type="button" id="getLookupListsBtn_${rowKey}">Listas lookup</button>` : ''}
        </td>
        <td style="text-align:center"><input type="checkbox" id="belongsToPackage_${rowKey}" ${(spListModel && spListModel.belongsToPackage) ? 'checked' : ''}  /></td>
        <td style="text-align:center"><button type="button" id="deleteListsBtn_${rowKey}">Borrar</button></td>`
  return innerHTML
}

async function getRelationListsOfSPList(rowKey, isChildList) {
  const spListRelatedListsExist = []
  const spList = spListsToExport.find(e => e.getRowKey() == rowKey)
  const spListRelatedLists = (isChildList) ? spList.getModel().relatedLists : spList.getModel().relatedListsLookup
  MVD.pageLoader({ show: true })
  for (const relatedList of spListRelatedLists) {
    const relatedListForExport = spListsToExport.find(e => e.getGUID() === relatedList.listGUID)
    if (!relatedListForExport) {
      try {
        const spListModel = await loadSPListProperties(relatedList.listGUID)
        addSPListRow(spListModel)
      } catch (error) {
        alert(error)
        console.error(error)
      }
    } else {
      spListRelatedListsExist.push(relatedListForExport.getSchemaProperties().title)
    }
  }
  MVD.pageLoader({ show: false })
  if (spListRelatedListsExist.length) {
    const distinctListTitles = [...new Set(spListRelatedListsExist)]
    alert(`Las lista/s ${distinctListTitles.join(', ')} ya se encuentran seleccionada/s para exportar.`)
  }
}

async function loadSPListProperties(guid, useAsAPI) {
  const clientContext = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl)
  const web = clientContext.get_web()
  const lists = web.get_lists()
  const list = lists.getById(guid)

  clientContext.load(list, 'HasUniqueRoleAssignments', 'SchemaXml', 'Views', 'RoleAssignments', 'RoleAssignments.Include(Member,RoleDefinitionBindings)')
  try {
    await executeQueryPromise(clientContext)
  } catch (error) {
    console.error(error)
  }

  const domParser = new DOMParser()
  const schemaXML = domParser.parseFromString(list.get_schemaXml(), 'text/xml')
  const schema = convertXmlToObject(schemaXML)

  let schemaProperties = {
    description: schema.Description,
    enableVersioning: schema.EnableVersioning,
    majorVersionLimit: schema.MajorVersionLimit,
    serverTemplate: schema.ServerTemplate,
    title: schema.Title,
  }
  schemaProperties.description = schemaProperties.description.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  const belongsToPackage = false
  const fields = []
  const mvdForms = []
  let permissions = []
  const relatedLists = []
  const relatedListsLookup = []
  const listUrl = (_spPageContextInfo.webServerRelativeUrl === '/') ? schema.RootFolder : schema.RootFolder.replace(_spPageContextInfo.webServerRelativeUrl, '')
  const views = []

  // fields
  const notAllowedFields = []
  const auxFields = schema.Fields.Field.filter(e => e.Hidden !== 'TRUE' && (e.FromBaseType !== 'TRUE' || ['Title'].includes(e.Name)))
  for (let i = 0; i < auxFields.length; i++) {
    if (['LookupFieldWithPicker'].includes(auxFields[i].Type)) {
      notAllowedFields.push(auxFields[i].DisplayName)
      continue
    }
    const fieldSchemaResumed = await getFieldSchemaResumed(auxFields[i], useAsAPI)
    fields.push(fieldSchemaResumed)
  }
  if (notAllowedFields.length) {
    console.error(`Los campos ${notAllowedFields.join(', ')}, se ignoraron y no se van a exportar con la lista ${listUrl}.`)
  }

  const relatedListsAux = fields.filter(e => ['Lookup', 'LookupMulti'].includes(e.Type) || e.Name.startsWith('MVDRF_'))
  for (let index = 0; index < relatedListsAux.length; index++) {
    const element = relatedListsAux[index];
    if (element.Type.startsWith('Lookup')) {
      const listLookupGUID = element.List.substring(1, element.List.length - 1)
      if (listLookupGUID != guid) {
        let listInfo = await getListInfo({ listGUID: listLookupGUID, siteUrl: _spPageContextInfo.webServerRelativeUrl })
        relatedListsLookup.push({
          listUrl: listInfo.listUrl,
          listGUID: listLookupGUID,
          lookupInternalName: element.ShowField
        })
      }
    } else {
      const prop = JSON.parse(element.Customization.ArrayOfProperty.Property.find(el => el.Name == 'saveManager').Value)
      let listInfo = await getListInfo({ listGUID: prop.listGUID, siteUrl: _spPageContextInfo.webServerRelativeUrl })
      relatedLists.push({
        listUrl: listInfo.listUrl,
        listGUID: prop.listGUID,
        lookupInternalName: prop.lookupInternalName
      })
    }
  }

  // permissions
  const roleAssignmentsEnumerator = list.get_roleAssignments().getEnumerator()
  while (list.get_hasUniqueRoleAssignments() && roleAssignmentsEnumerator.moveNext()) {
    const currentRole = roleAssignmentsEnumerator.get_current()
    const currentUser = currentRole.get_member()
    const roleDefinitionBindings = currentRole.get_roleDefinitionBindings().get_data()
    const user = {}
    user.login = currentUser.get_loginName()
    user.type = currentUser.get_principalType()
    if (user.type != 8) continue// Solamente se soporta la exportación e importación de grupos
    let roleTypes = roleDefinitionBindings.map(e => {
      let roleType = e.get_roleTypeKind()
      return (!roleType) ? e.get_name() : roleType
    })
    user.roleType = roleTypes.filter(e => ![1].includes(e))// El permiso de nivel 1, es de acceso limitado. Es manejado intenrnamente por sharepoint.
    if (!user.roleType.length) continue
    permissions.push(user)
  }

  if (list.get_hasUniqueRoleAssignments() && permissions.length == 0) {
    permissions = false;
  }

  // views and webparts
  const viewsCollection = list.get_views()
  const viewsEnumerator = viewsCollection.getEnumerator()
  while (viewsEnumerator.moveNext()) {
    const currentView = viewsEnumerator.get_current()
    if (currentView.get_hidden()) continue
    const domParser = new DOMParser()
    const xml = domParser.parseFromString(currentView.get_htmlSchemaXml(), 'text/xml')
    let view = null
    try {
      view = convertXmlToObject(xml)
    } catch (error) {
      console.error(`Error al extraer XML de la vista ${currentView.get_title()}`, { error })
      continue
    }
    view.SelectedToExport = useAsAPI ?? false
    view.Title = currentView.get_title()
    view.Query = currentView.get_viewQuery()
    if (_spPageContextInfo.webServerRelativeUrl !== '/') view.Url = view.Url.replace(_spPageContextInfo.webServerRelativeUrl, '')
    const viewFileRelativeURL = (_spPageContextInfo.webServerRelativeUrl === '/') ? view.Url : _spPageContextInfo.webServerRelativeUrl + view.Url
    const oFile = clientContext.get_web().getFileByServerRelativeUrl(viewFileRelativeURL)
    const webPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared)
    view.WebPartCollection = webPartManager.get_webParts()
    clientContext.load(view.WebPartCollection, 'Include(Id, WebPart.Properties, WebPart.ZoneIndex, ZoneId)')
    for (const keyView in view) {
      if (!['Aggregations', 'BaseViewID', 'DefaultView', 'Query', 'RowLimit', 'SelectedToExport', 'Title', 'Type', 'Url', 'ViewData', 'ViewFields', 'WebPartCollection', 'WebPartManager'].includes(keyView)) delete view[keyView]
      else if (keyView === 'ViewFields') {
        if (!Array.isArray(view[keyView].FieldRef)) view[keyView].FieldRef = new Array(view[keyView].FieldRef)
        view[keyView] = view[keyView].FieldRef.map(e => e.Name)
      }
    }
    views.push(view)
  }

  const formUrls = ['/NewForm.aspx', '/EditForm.aspx', '/DispForm.aspx']
  for (let i = 0; i < formUrls.length; i++) {
    let formUrl = formUrls[i]
    if (schema.BaseType == '1') {
      if (formUrl == '/NewForm.aspx') continue
      else formUrl = '/Forms' + formUrl
    }
    const view = {
      Url: listUrl + formUrl,
      SelectedToExport: useAsAPI ?? false
    }
    const viewFileRelativeURL = (_spPageContextInfo.webServerRelativeUrl === '/') ? view.Url : _spPageContextInfo.webServerRelativeUrl + view.Url
    const oFile = clientContext.get_web().getFileByServerRelativeUrl(viewFileRelativeURL)
    const webPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared)
    view.WebPartCollection = webPartManager.get_webParts()
    clientContext.load(view.WebPartCollection, 'Include(Id, WebPart.Properties, WebPart.ZoneIndex, ZoneId)')
    views.push(view)
  }

  try {
    await executeQueryPromise(clientContext)
  } catch (error) {
    console.error(error)
  }
  let notAllowedWebparts = []
  for (let i = views.length - 1; i >= 0; i--) {
    const view = views[i]
    const viewFileRelativeURL = (_spPageContextInfo.webServerRelativeUrl === '/') ? view.Url : _spPageContextInfo.webServerRelativeUrl + view.Url
    const webPartsEnumerator = view.WebPartCollection.getEnumerator()
    delete view.WebPartCollection
    view.WebParts = []
    while (webPartsEnumerator.moveNext()) {
      const currentWebPartDefinition = webPartsEnumerator.get_current()
      const currentWebPart = currentWebPartDefinition.get_webPart()
      const webPartProperties = currentWebPart.get_properties().get_fieldValues()
      const oFile = clientContext.get_web().getFileByServerRelativeUrl(viewFileRelativeURL)
      const webPartId = currentWebPartDefinition.get_id().toString()
      const webPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared)
      if (webPartProperties.Content) {
        if (webPartProperties.ExportMode == 0) {
          notAllowedWebparts.push(`La vista ${view.Url} contiene un webpart que no permite ser exportado. Cambie el Modo de exportación en la configuracion del webpart.`)
          continue;
        }
        // if (webPartProperties.Content.includes('src=')) {
        //   notAllowedWebparts.push(`La vista ${view.Url} contiene un webpart con script externos. `)
        //   //continue;
        // }
        const webPart = {
          Title: webPartProperties.Title,
          ZoneIndex: currentWebPart.get_zoneIndex(),
          ZoneId: currentWebPartDefinition.get_zoneId(),
          XML: ''
        }
        if (typeof webPartManager.exportWebPart !== 'undefined') {
          const webPartXmlObj = webPartManager.exportWebPart(webPartId)
          await executeQueryPromise(clientContext)
          webPart.XML = webPartXmlObj.get_value()
        } else {
          const response = await fetch(`${_spPageContextInfo.siteAbsoluteUrl}/_vti_bin/exportwp.aspx?pageurl=${_spPageContextInfo.siteAbsoluteUrl + view.Url}&guidstring=${webPartId}`)
          const responseArrayBuffer = await response.arrayBuffer()
          webPart.XML = new TextDecoder().decode(responseArrayBuffer)
        }
        view.WebParts.push(webPart)
      }
    }
    if ((view.Url.endsWith('/DispForm.aspx') || view.Url.endsWith('/NewForm.aspx') || view.Url.endsWith('/EditForm.aspx')) && view.WebParts.length === 0) {
      views.splice(i, 1)
    }
  }

  // mvd forms
  let mvdFromsData = await getMVDFormsFromList({ guid, listUrl })
  if (mvdFromsData) mvdForms.push(mvdFromsData)

  if (notAllowedWebparts.length || notAllowedFields.length) {
    if (notAllowedWebparts.length) notAllowedWebparts.push('Utilize MVD.importScripts')
    if (notAllowedFields.length) notAllowedFields.unshift('Los campos LookupFieldWithPicker no estan permitidos')
    alert(notAllowedWebparts.concat(notAllowedFields).join('\n'))
  }

  return {
    belongsToPackage,
    fields,
    guid,
    mvdForms,
    permissions,
    relatedLists,
    relatedListsLookup,
    listUrl,
    views,
    schemaProperties
  }
}

function onChangeBelongsToPackageCheckbox(target) {
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  const spList = spListsToExport.find(e => e.getRowKey() == rowKey)
  spList.setBelongsToPackage(target.checked)
}

function onChangeSelectFields(target) {
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  const spList = spListsToExport.find(e => e.getRowKey() == rowKey)
  const selectFieldsElement = document.getElementById('selectFields_' + rowKey)
  const selectOptions = Array.from(selectFieldsElement.options)
  const selectOptionsValues = selectOptions.filter(e => e.selected).map(e => e.value)
  const spListFieldsValue = spList.getFields()
  spListFieldsValue.forEach(field => field.SelectedToExport = selectOptionsValues.includes(field.Name))
  spList.setFields(spListFieldsValue)
}

function onChangeSelectAllFieldsCheckbox(target) {
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  const spList = spListsToExport.find(e => e.getRowKey() == rowKey)
  const selectFieldsElement = document.getElementById('selectFields_' + rowKey)
  const selectOptions = Array.from(selectFieldsElement.options)
  selectOptions.forEach(e => { e.selected = target.checked })
  const spListFieldsValue = spList.getFields()
  spListFieldsValue.forEach(field => field.SelectedToExport = target.checked)
  spList.setFields(spListFieldsValue)
  if (target.checked) {
    selectFieldsElement.setAttribute('disabled', true)
  } else {
    selectFieldsElement.removeAttribute('disabled')
  }
}

async function onChangeSelectList(target) {
  const selectedListGUID = target.value
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  let spListModel = spListFactory('', rowKey).getModel()
  const spList = spListsToExport.find(e => e.getRowKey() == rowKey)
  MVD.pageLoader({ show: true })
  if (selectedListGUID != '0') {
    const isRepeat = spListsToExport.find(e => e.getGUID() == selectedListGUID)
    if (isRepeat) {
      alert(`La lista ${target.selectedOptions[0].text} ya fue agregada.`)
    } else {
      try {
        spListModel = await loadSPListProperties(selectedListGUID)
      } catch (error) {
        alert(error)
        console.error(error)
      }
    }
  }
  spList.setModel(spListModel)
  tr.innerHTML = getListRowInnerHTML(rowKey, spListModel)
  MVD.pageLoader({ show: false })
}

function onChangeSelectViews(target) {
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  const spList = spListsToExport.find(e => e.getRowKey() == rowKey)
  const selectFieldsElement = document.getElementById('selectViews_' + rowKey)
  const selectOptions = Array.from(selectFieldsElement.options)
  const selectOptionsValues = selectOptions.filter(e => e.selected).map(e => e.value)
  const spListViewsValue = spList.getViews()
  spListViewsValue.forEach(view => view.SelectedToExport = selectOptionsValues.includes(view.Url))
  spList.setViews(spListViewsValue)
}

function refreshSPListsTableHTML() {
  const listsToExportTableBodyElement = document.getElementById('listsToExportTable').querySelector('tbody')
  listsToExportTableBodyElement.innerHTML = ''
  spListsToExport.forEach((e, i) => {
    const newRowElement = listsToExportTableBodyElement.insertRow(listsToExportTableBodyElement.rows.length)
    newRowElement.setAttribute('id', e.getRowKey())
    const spListModel = e.getModel()
    const innerHTML = getListRowInnerHTML(e.getRowKey(), spListModel)
    newRowElement.innerHTML = innerHTML
  })
}

function spListFactory(guid = '', rowKey) {
  let belongsToPackage = false
  let fields = []
  let mvdForms = []
  let permissions = []
  let relatedLists = []
  let relatedListsLookup = []
  let listUrl = ''
  let schemaProperties = {}
  let views = []

  const obj = {
    getSchemaProperties: () => schemaProperties,
    setSchemaProperties: (value) => schemaProperties = value,
    getBelongsToPackage: () => belongsToPackage,
    setBelongsToPackage: (value) => belongsToPackage = value,
    getFields: () => fields,
    setFields: (values) => fields = values,
    getGUID: () => guid,
    setGUID: (value) => guid = value,
    getJSON: function () {
      const model = JSON.parse(JSON.stringify(this.getModel()))
      model.fields = model.fields.filter(field => field.SelectedToExport).map(field => {
        delete field.SelectedToExport
        delete field.List
        return field
      })
      model.views = model.views.filter(view => view.SelectedToExport).map(view => {
        delete view.SelectedToExport
        delete view.listGUID
        return view
      })
      return model
    },
    getMVDForms: () => mvdForms,
    setMVDForms: (values) => mvdForms = values,
    getModel: () => {
      return { belongsToPackage, fields, mvdForms, guid, permissions, relatedLists, listUrl, relatedListsLookup, schemaProperties, views }
    },
    setModel: (value) => {
      ({ belongsToPackage, fields, mvdForms, guid, permissions, listUrl, relatedLists, relatedListsLookup, schemaProperties, views } = value)
    },
    getRowKey: () => rowKey,
    getViews: () => views,
    setViews: (values) => views = values,
  }
  return obj
}

async function getMVDFormsFromList({ guid, listUrl }) {
  let mvdFormsFileURL = `/SiteAssets/spef-layout-${guid}.txt`
  let responseMVDForm = await fetch(mvdFormsFileURL)
  let mvdForms = null

  if (responseMVDForm.status == 200) {//Cuando haya mas forms hay que reparar
    const fileName = listUrl.substring(listUrl.lastIndexOf('/') + 1)
    const responseText = await responseMVDForm.text()
    mvdForms = {
      text: responseText,
      name: fileName
    }
  } else { //new direction
    let mvdFormsFileURL = `/MVDAssets/mvd-forms-layouts/spef-layout-${guid}.txt`
    let responseMVDForm = await fetch(mvdFormsFileURL)

    if (responseMVDForm.status == 200) {//Cuando haya mas forms hay que reparar
      const fileName = listUrl.substring(listUrl.lastIndexOf('/'))
      const responseText = await responseMVDForm.text()
      mvdForms = {
        text: responseText,
        name: fileName
      }
    }
  }
  return mvdForms
}

/*-----------------------------------------------------------   Fin listas   -----------------------------------------------------------*/


/*-----------------------------------------------------------   Datos   -----------------------------------------------------------*/

function addListDataRow(listDataModel) {
  const listDataToExportTableBodyElement = document.getElementById('listDataToExportTable').querySelector('tbody')
  const newRowElement = listDataToExportTableBodyElement.insertRow(listDataToExportTableBodyElement.rows.length)
  const rowKey = crypto.getRandomValues(new Uint32Array(1))[0]
  newRowElement.setAttribute('id', rowKey)
  const innerHTML = getListDataRowInnerHTML(rowKey, listDataModel)
  newRowElement.innerHTML = innerHTML
  const listViewData = listDataFactory('', rowKey)
  if (listDataModel) listViewData.setModel(listDataModel)
  listDataToExport.push(listViewData)
}

function getListDataRowInnerHTML(rowKey, listDataModel) {
  const selectedListViewData = (listDataModel) ? listDataModel.views.find(view => view.SelectedToExport) : null
  const strFields = `<select id="selectListDataViewPrimaryField_${rowKey}">${(selectedListViewData) ? selectedListViewData.ViewFields.map(field => `<option value="${field.Name}"  ${(field.SelectedAsPrimary) ? 'selected' : ''}  >${field.DisplayName}</option>`).join('') : ''}</select>`
  const strViews = `<select id="selectListDataView_${rowKey}">${(listDataModel) ? listDataModel.views.map(view => `<option value="${view.Url}"  ${(view.SelectedToExport) ? 'selected' : ''}>${view.Url}</option>`).join('') : ''}</select>`
  const innerHTML =
    `<td><select id="selectListData_${rowKey}"><option value="0">Seleccione una lista</option>${allSiteLists.map(list => `<option value="${list.listGUID}" ${(listDataModel && listDataModel.guid === list.listGUID) ? 'selected' : ''}>${list.title}</option>`).join('')}</select></td>
        <td>${strViews}</td>
        <td>${strFields}</td>
        <td style="text-align:center"><button type="button" id="deleteListDataBtn_${rowKey}">Borrar</button></td>`
  return innerHTML
}

function listDataFactory(guid = '', rowKey) {
  let fields = []
  let listUrl = ''
  let views = []
  let relatedListsLookup = []
  const obj = {
    getFields: () => fields,
    setFields: (values) => fields = values,
    getGUID: () => guid,
    setGUID: (value) => guid = value,
    getJSON: async () => {
      const notAllowedFields = ['Attachments'].concat(fields.filter(e => e.ReadOnly).map(e => e.Name))
      const view = views.find(e => e.SelectedToExport)
      const camlQuery = (view.Query) ? `<View Scope="RecursiveAll"><Query>${view.Query}</Query></View>` : null
      return new Promise(async function (resolve, reject) {
        const viewFields = view.ViewFields.map(e => e.Name)
        const items = await getItems({ camlQuery, listUrl, siteUrl: _spPageContextInfo.webServerRelativeUrl })
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          for (let key in item) {
            if (!viewFields.includes(key) || notAllowedFields.includes(key)) delete item[key]
            if (item[key]) {
              if (item[key].url && item[key].description) {
                item[key].description = item[key].description.replace(_spPageContextInfo.siteAbsoluteUrl, '')
              }
            }
          }
        }
        resolve({ items, listUrl, viewFields: view.ViewFields, relatedListsLookup })
      })
    },
    getModel: () => {
      return { fields, guid, listUrl, relatedListsLookup, views }
    },
    setModel: (value) => {
      ({ fields, guid, listUrl, relatedListsLookup, views } = value)
    },
    getRowKey: () => rowKey,
    getViews: () => views,
    setViews: (values) => views = values
  }
  return obj
}

async function onChangeSelectListData(target) {
  const selectedListGUID = target.value
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  let listDataModel = listDataFactory('', rowKey).getModel()
  const listData = listDataToExport.find(e => e.getRowKey() == rowKey)
  MVD.pageLoader({ show: true })
  if (selectedListGUID !== '0') {
    const isRepeat = listDataToExport.find(e => e.getGUID() == selectedListGUID)
    if (isRepeat) {
      alert(`La lista ${target.selectedOptions[0].text} ya fue agregada.`)
    } else {
      try {
        listDataModel = await getListViewDataModelToExport(selectedListGUID)
      } catch (error) {
        alert(error)
        console.error(error)
      }
    }
  }
  listData.setModel(listDataModel)
  tr.innerHTML = getListDataRowInnerHTML(rowKey, listDataModel)
  MVD.pageLoader({ show: false })
}

function onChangeSelectListDataView(target) {
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  const listData = listDataToExport.find(e => e.getRowKey() == rowKey)
  const selectFieldsElement = document.getElementById('selectListDataView_' + rowKey)
  const selectOptions = Array.from(selectFieldsElement.options)
  const selectOptionsValues = selectOptions.find(e => e.selected).value
  const listDataViewsValue = listData.getViews()
  listDataViewsValue.forEach(view => view.SelectedToExport = (selectOptionsValues === view.Url))
  listData.setViews(listDataViewsValue)
  refreshListViewDataTableHTML()
}

function onChangeSelectListDataViewPrimaryField(target) {
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  const listData = listDataToExport.find(e => e.getRowKey() == rowKey)
  const selectFieldsElement = document.getElementById('selectListDataViewPrimaryField_' + rowKey)
  const selectOptions = Array.from(selectFieldsElement.options)
  const selectOptionsValues = selectOptions.filter(e => e.selected).map(e => e.value)
  const listDataViewsValue = listData.getViews()
  const selectedListDataView = listDataViewsValue.find(view => view.SelectedToExport)
  selectedListDataView.ViewFields.forEach(field => field.SelectedAsPrimary = selectOptionsValues.includes(field.Name))
  listData.setViews(listDataViewsValue)
}

function deleteListViewDataRowHTML(rowKey) {
  const listViewsDataIndex = listDataToExport.findIndex(e => e.getRowKey() == rowKey)
  listDataToExport.splice(listViewsDataIndex, 1)
  refreshListViewDataTableHTML()
}

function refreshListViewDataTableHTML() {
  const listDataToExportTableBodyElement = document.getElementById('listDataToExportTable').querySelector('tbody')
  listDataToExportTableBodyElement.innerHTML = ''
  listDataToExport.forEach((e, i) => {
    const newRowElement = listDataToExportTableBodyElement.insertRow(listDataToExportTableBodyElement.rows.length)
    const rowKey = e.getRowKey()
    newRowElement.setAttribute('id', rowKey)
    const listViewDataModel = e.getModel()
    const innerHTML = getListDataRowInnerHTML(rowKey, listViewDataModel)
    newRowElement.innerHTML = innerHTML
  })
}

async function getListViewDataModelToExport(guid) {
  const clientContext = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl)
  const web = clientContext.get_web()
  const lists = web.get_lists()
  const list = lists.getById(guid)

  clientContext.load(list, 'SchemaXml', 'Views')
  try {
    await executeQueryPromise(clientContext)
  } catch (error) {
    console.error(error)
  }

  const domParser = new DOMParser()
  const schemaXML = domParser.parseFromString(list.get_schemaXml(), 'text/xml')
  const schema = convertXmlToObject(schemaXML)
  const listUrl = (_spPageContextInfo.webServerRelativeUrl === '/') ? schema.RootFolder : schema.RootFolder.replace(_spPageContextInfo.webServerRelativeUrl, '')
  const fields = []
  const views = []
  let relatedListsLookup = []

  const notAllowedFields = []
  const auxFields = schema.Fields.Field.filter(e => !['_CommentFlags', '_CommentCount'].includes(e.Name) && e.FromBaseType !== 'TRUE' || [/* 'Attachments', 'Author', 'Created', 'Editor', 'ID', 'Modified', */'Title'].includes(e.Name))
  for (let i = 0; i < auxFields.length; i++) {
    if (['LookupFieldWithPicker'].includes(auxFields[i].Type)) {
      notAllowedFields.push(auxFields[i].DisplayName)
      console.warn(`El campo ${auxFields[i].DisplayName} de tipo ${auxFields[i].Type}, no es soportado para la exportación del módulo y se ignoro.`)
      continue
    }
    const fieldSchemaResumed = await getFieldSchemaResumed(auxFields[i])
    fields.push(fieldSchemaResumed)
  }

  const relatedListsAux = fields.filter(e => ['Lookup', 'LookupMulti'].includes(e.Type))
  for (let index = 0; index < relatedListsAux.length; index++) {
    const element = relatedListsAux[index];
    const listLookupGUID = element.List.substring(1, element.List.length - 1)
    if (listLookupGUID !== guid && !relatedListsLookup.includes(element.ListUrl)) {
      relatedListsLookup.push(element.ListUrl)
    }
  }

  // views and webparts
  const viewsCollection = list.get_views()
  const viewsEnumerator = viewsCollection.getEnumerator()
  while (viewsEnumerator.moveNext()) {
    const currentView = viewsEnumerator.get_current()
    const domParser = new DOMParser()
    const xml = domParser.parseFromString(currentView.get_htmlSchemaXml(), 'text/xml')
    const view = convertXmlToObject(xml)
    view.SelectedToExport = false
    view.Query = currentView.get_viewQuery()
    if (_spPageContextInfo.webServerRelativeUrl !== '/') view.Url = view.Url.replace(_spPageContextInfo.webServerRelativeUrl, '')
    for (const keyView in view) {
      if (!['Aggregations', 'BaseViewID', 'DefaultView', 'Query', 'RowLimit', 'Type', 'Url', 'ViewData', 'ViewFields'].includes(keyView)) delete view[keyView]
      else if (keyView === 'ViewFields') {
        if (!Array.isArray(view[keyView].FieldRef)) view[keyView].FieldRef = new Array(view[keyView].FieldRef)
        const viewFields = [{
          DisplayName: 'Nuevo registro',
          Name: 'newRecord',
          SelectedAsPrimary: true
        }]
        view[keyView].FieldRef.forEach(function (fieldRef) {
          if (!['Edit', 'Editor', 'URLwMenu', 'Attachments'].includes(fieldRef.Name)) {
            if (['LinkFilename', 'LinkTitle'].includes(fieldRef.Name)) {
              fieldRef.Name = 'Title'
            }
            try {
              const displayName = fields.find(e => e.Name == fieldRef.Name).DisplayName
              viewFields.push({ DisplayName: displayName, Name: fieldRef.Name, SelectedAsPrimary: false })
            } catch (err) {
              console.error(err, { fieldRef })
            }
          }
        })

        view[keyView] = viewFields
      }
    }
    views.push(view)
  }

  views[0].SelectedToExport = true
  return {
    fields,
    guid,
    listUrl,
    relatedListsLookup,
    views
  }
}

/*-----------------------------------------------------------   Fin datos   -----------------------------------------------------------*/


/*-----------------------------------------------------------   Custom actions   -----------------------------------------------------------*/

function addCustomActionToExportRow(customActionModel) {
  const customActionsToExportTableBodyElement = document.getElementById('customActionsToExportTable').querySelector('tbody')
  const newRowElement = customActionsToExportTableBodyElement.insertRow(customActionsToExportTableBodyElement.rows.length)
  const rowKey = crypto.getRandomValues(new Uint32Array(1))[0]
  newRowElement.setAttribute('id', rowKey)
  const innerHTML = getCustomActionToExportRowInnerHTML(rowKey, customActionModel)
  newRowElement.innerHTML = innerHTML
  const customAction = customActionFactory(rowKey)
  if (customActionModel) customAction.setModel(customActionModel)
  customActionsToExport.push(customAction)
}

function deleteCustomActionToExportRowHTML(rowKey) {
  const customActionIndex = customActionsToExport.findIndex(e => e.getRowKey() == rowKey)
  customActionsToExport.splice(customActionIndex, 1)
  refreshCustomActionsToExportTableHTML()
}

function getCustomActionToExportRowInnerHTML(rowKey, customActionModel) {
  const innerHTML =
    `<td><select id="selectCustomAction_${rowKey}"><option value="0">Seleccione un custom action</option>${allCustomActions.map(customAction => `<option value="${customAction.scriptSrc}"  ${(customActionModel && customAction.scriptSrc === customActionModel.scriptSrc) ? 'selected' : ''}>${customAction.name}</option>`).join('')}</select></td>
        <td>${(customActionModel && customActionModel.domain) ? ((customActionModel.domain == 'web') ? 'Sitio' : 'Colección de sitios') : ''}</td>
        <td>${(customActionModel && customActionModel.scriptSrc) ? customActionModel.scriptSrc : ''}</td>
        <td>${(customActionModel && customActionModel.location) ? customActionModel.location : ''}</td>
        <td>${(customActionModel && customActionModel.sequence) ? customActionModel.sequence : ''}</td>
    <td><div class="tdFlexContainer"><button type="button" id="deleteCustomActionToExportBtn_${rowKey}">Borrar</button></div></td>`
  return innerHTML
}

function refreshCustomActionsToExportTableHTML() {
  const customActionsToExportTableBodyElement = document.getElementById('customActionsToExportTable').querySelector('tbody')
  customActionsToExportTableBodyElement.innerHTML = ''
  customActionsToExport.forEach((e, i) => {
    const newRowElement = customActionsToExportTableBodyElement.insertRow(customActionsToExportTableBodyElement.rows.length)
    newRowElement.setAttribute('id', e.getRowKey())
    const customActionModel = e.getModel()
    const innerHTML = getCustomActionToExportRowInnerHTML(e.getRowKey(), customActionModel)
    newRowElement.innerHTML = innerHTML
  })
}

async function onChangeCustomActionToExport(target) {
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  let customActionModel = customActionFactory(rowKey).getModel()
  const customAction = customActionsToExport.find(e => e.getRowKey() == rowKey)
  if (target.value != '0') {
    const isRepeat = customActionsToExport.find(e => e.getModel().scriptSrc == target.value)
    if (isRepeat) {
      alert(`El custom action ${isRepeat.getModel().name} ya fue agregado.`)
    } else {
      customActionModel = allCustomActions.find(e => e.scriptSrc == target.value)
    }
  }
  customAction.setModel(customActionModel)
  tr.innerHTML = getCustomActionToExportRowInnerHTML(rowKey, customActionModel)
}

function customActionFactory(rowKey, id = '') {
  let description = ''
  let domain = ''
  let location = ''
  let scriptSrc = ''
  let sequence = 0
  let name = ''

  const obj = {
    getRowKey: () => rowKey,
    setModel: (customActionModel) => {
      ({ description, domain, id, location, scriptSrc, sequence, name } = customActionModel)
    },
    getModel: () => {
      return { description, domain, id, location, scriptSrc, sequence, name }
    }
  }
  return obj
}

function getAllCustomActions() {
  return new Promise(function (resolve, reject) {
    Promise.all([
      getCustomActions('site'),
      getCustomActions('web')
    ]).then(args => {
      allCustomActions = allCustomActions.concat(args[0])
      allCustomActions = allCustomActions.concat(args[1])
      resolve(allCustomActions)
    }).catch(error => reject(error))
  })
}

/*-----------------------------------------------------------   Fin custom actions   -----------------------------------------------------------*/


/*-----------------------------------------------------------   Dependencias   -----------------------------------------------------------*/

function getServerPackages() {
  return new Promise(function (resolve, reject) {
    const listUrl = '/Lists/MVDUpdaterPackageVersions'
    Promise.all([getListItems(_spPageContextInfo.webServerRelativeUrl, listUrl, '', '', true), getFields({ listUrl, siteUrl: _spPageContextInfo.webServerRelativeUrl })])
      .then(function proccesPackageData(args) {
        const packageVersions = getItemsFromQuery(args[0], args[1])
        serverPackages = packageVersions.reduce(function (accu, value) {
          let packageModule = accu.find(e => e.id == value.MVDUpdaterPackage_SPData.value)
          if (packageModule) {
            packageModule.versions.push({
              id: value.ID,
              files: value.Attachments,
              version: value.Version
            })
          } else {
            packageModule = {
              id: value.MVDUpdaterPackage_SPData.value,
              name: value.MVDUpdaterPackage_SPData.text,
              versions: []
            }
            packageModule.versions.push({
              id: value.ID,
              files: value.Attachments,
              version: value.Version,
              SelectedToExport: true
            })
            accu.push(packageModule)
          }
          return accu
        }, [])
        serverPackages.forEach(function (e) {
          e.versions.sort((a, b) => b.version - a.version)
        })
        resolve()
      })
      .catch(function (error) {
        reject(error)
      })
  })
}

function addDependencyRow(dependencyModel) {
  const dependenciesToExportTableBodyElement = document.getElementById('dependenciesToExportTable').querySelector('tbody')
  const newRowElement = dependenciesToExportTableBodyElement.insertRow(dependenciesToExportTableBodyElement.rows.length)
  const rowKey = crypto.getRandomValues(new Uint32Array(1))[0]
  newRowElement.setAttribute('id', rowKey)
  const innerHTML = getDependencyRowInnerHTML(rowKey, dependencyModel)
  newRowElement.innerHTML = innerHTML
  const dependency = dependencyFactory(rowKey)
  if (dependencyModel) dependency.setModel(dependencyModel)
  dependenciesToExport.push(dependency)
}

function getDependencyRowInnerHTML(rowKey, dependencyModel) {
  const innerHTML =
    `<td><select id="selectDependencyPackage_${rowKey}"><option value="0">Seleccione una modulo</option>${currentSitePackages.map(packageModule => `<option value="${packageModule.ID}"  ${(dependencyModel && dependencyModel.id == packageModule.ID) ? 'selected' : ''}>${packageModule.Title}</option>`).join('')}</select></td>
        <td>${(dependencyModel) ? dependencyModel.version : ''}</td>
        <td><div class="tdFlexContainer"><button type="button" id="deleteDependencyBtn_${rowKey}">Borrar</button></div></td>`
  return innerHTML
}

function onChangeSelectDependencyPackage(target) {
  const tr = target.closest('tr')
  const rowKey = tr.getAttribute('id')
  let dependencyModel = dependencyFactory('', rowKey).getModel()
  const dependency = dependenciesToExport.find(e => e.getRowKey() == rowKey)
  if (target.value != '0') {
    const isRepeat = dependenciesToExport.find(e => e.getModel().id == target.value)
    if (isRepeat) {
      alert(`El paquete ${isRepeat.getModel().name} ya fue agregado.`)
    } else {
      const selectedOption = target.querySelector('option:checked')
      const currentSiteSelectedPackage = allCurrentSitePackages.find(e => e.ID == selectedOption.value)
      dependencyModel = { id: currentSiteSelectedPackage.ID, name: currentSiteSelectedPackage.Title, version: currentSiteSelectedPackage.Version }
    }
  }
  dependency.setModel(dependencyModel)
  tr.innerHTML = getDependencyRowInnerHTML(rowKey, dependencyModel)
}

function deleteDependencyRowHTML(rowKey) {
  const dependencyIndex = dependenciesToExport.findIndex(e => e.getRowKey() == rowKey)
  dependenciesToExport.splice(dependencyIndex, 1)
  refreshDependenciesTableHTML()
}

function refreshDependenciesTableHTML() {
  const dependenciesToExportTableBodyElement = document.getElementById('dependenciesToExportTable').querySelector('tbody')
  dependenciesToExportTableBodyElement.innerHTML = ''
  dependenciesToExport.forEach((e, i) => {
    const newRowElement = dependenciesToExportTableBodyElement.insertRow(dependenciesToExportTableBodyElement.rows.length)
    newRowElement.setAttribute('id', e.getRowKey())
    const dependencyModel = e.getModel()
    const innerHTML = getDependencyRowInnerHTML(e.getRowKey(), dependencyModel)
    newRowElement.innerHTML = innerHTML
  })
}

function dependencyFactory(rowKey) {
  let id = ''
  let name = ''
  let version = ''

  const obj = {
    getJSON: () => {
      return { id, name, version }
    },
    getRowKey: () => rowKey,
    setModel: (dependencyModel) => {
      ({ id, name, version } = dependencyModel)
    },
    getModel: () => {
      return { id, name, version }
    }
  }
  return obj
}

/*-----------------------------------------------------------   Fin dependencias   -----------------------------------------------------------*/


/*-----------------------------------------------------------   Archivos   -----------------------------------------------------------*/

async function onChangeZipFilePackageInput(file) {
  MVD.pageLoader({ show: true })
  const processedFile = await processFileInput(file)
  const existFileIndex = filesToExport.findIndex(e => e.name === processedFile.name)
  if (existFileIndex !== -1) {
    filesToExport[existFileIndex] = processedFile
  } else {
    filesToExport.push(processedFile)
  }
  refreshFilesTableHTML()
  MVD.pageLoader({ show: false })
  document.getElementById('zipFilePackageInput').value = null
}

function refreshFilesTableHTML() {
  const filesToExportTableBodyElement = document.getElementById('filesToExportTable').querySelector('tbody')
  filesToExportTableBodyElement.innerHTML = ''
  filesToExport.forEach((file, i) => {
    const newRowElement = filesToExportTableBodyElement.insertRow(filesToExportTableBodyElement.rows.length)
    const innerHTML = getFileRowInnerHTML(file)
    newRowElement.innerHTML = innerHTML
  })
}

function getFileRowInnerHTML(file) {
  const innerHTML =
    `<td>${file.name}</td>
    <td><ul>${file.entries.map(e => `<li><div class="liFileInnerWrapper" >${e}<input class="checkboxIgnoreKey" id="${e}_checkbox" type="checkbox" /></div></li>`).join('')}</ul></td>
    <td><div class="tdFlexContainer"><button type="button" id="deleteFileBtn_${file.name}">Borrar</button></div></td>`
  return innerHTML
}

function deleteFileRowHTML(fileName) {
  const filesIndex = filesToExport.findIndex(e => e.name === fileName)
  filesToExport.splice(filesIndex, 1)
  refreshFilesTableHTML()
}

/*-----------------------------------------------------------   Fin archivos   -----------------------------------------------------------*/


/*-----------------------------------------------------------   Generar paquete   -----------------------------------------------------------*/

async function generatePackage() {
  MVD.pageLoader({ show: true })
  const packageSettings = await getPackageSettings()
  if (validatePackageSetting(packageSettings)) {
    const zip = new JSZip()
    zip.folder('lists')
    zip.folder('mvdForms')
    for (const spList of packageSettings.spLists) {
      let spListToExport = JSON.parse(JSON.stringify(spList))
      if (spListToExport.mvdForms.length) {
        for (const mvdFormFile of spListToExport.mvdForms) {
          zip.folder('mvdForms').file(mvdFormFile.name + '.txt', mvdFormFile.text)
        }
      }

      for (let i = spListToExport.relatedLists.length - 1; i >= 0; i--) {
        const listInPackage = packageSettings.spLists.find(e => e.listUrl.toLowerCase() == spListToExport.relatedLists[i].listUrl.toLowerCase())
        if (listInPackage) {
          delete spListToExport.relatedLists[i].listGUID
        } else {
          spListToExport.relatedLists.splice(i, 1)
        }
      }

      for (let i = spListToExport.relatedListsLookup.length - 1; i >= 0; i--) {
        const listInPackage = packageSettings.spLists.find(e => e.listUrl.toLowerCase() == spListToExport.relatedListsLookup[i].listUrl.toLowerCase())
        if (listInPackage) {
          delete spListToExport.relatedListsLookup[i].listGUID
        } else {
          spListToExport.relatedListsLookup.splice(i, 1)
        }
      }

      delete spListToExport.mvdForms
      delete spListToExport.guid
      let listFileName = spListToExport.listUrl.substring(spListToExport.listUrl.lastIndexOf('/') + 1)
      zip.folder('lists').file(listFileName + '.json', JSON.stringify(spListToExport))
    }
    delete packageSettings.spLists
    zip.folder('files')
    zip.folder('files').folder('MVDAssets')

    for (const file of filesToExport) {
      let useLoaderKeyFolder = document.getElementById(file.entries[0] + '_checkbox').checked
      for (const fileData of file.files) {
        zip.folder('files').folder('MVDAssets').file(fileData.fileRoot, fileData.arrayBuffer, {
          createFolders: true // default value
        })
        if (useLoaderKeyFolder) {
          packageSettings.filesUseLoader[fileData.fileRoot] = true
        } else if (document.getElementById(fileData.fileRoot + '_checkbox').checked) {
          packageSettings.filesUseLoader[fileData.fileRoot] = true
        }
        if (fileData.fileRoot.endsWith('migration.js')) delete packageSettings.filesUseLoader[fileData.fileRoot]
      }
    }
    zip.folder('data')
    for (const listViewData of packageSettings.data) {
      let listViewDataToExport = JSON.parse(JSON.stringify(listViewData))
      for (let i = listViewDataToExport.relatedListsLookup.length - 1; i >= 0; i--) {
        const listDataInPackage = packageSettings.data.find(e => e.listUrl.toLowerCase() == listViewDataToExport.relatedListsLookup[i].toLowerCase())
        if (!listDataInPackage) {
          listViewDataToExport.relatedListsLookup.splice(i, 1)
        }
      }

      delete listViewDataToExport.guid
      let fileName = listViewDataToExport.listUrl.substring(listViewDataToExport.listUrl.lastIndexOf('/') + 1)
      zip.folder('data').file(fileName + '.json', JSON.stringify(listViewDataToExport))
    }
    delete packageSettings.data
    zip.file('settings.json', JSON.stringify(packageSettings))
    zip.generateAsync({ type: 'blob' }).then(function (blob) {
      saveAs(blob, `${packageSettings.name}_${packageSettings.version}.zip`)
      MVD.pageLoader({ show: false })
    }, function (error) {
      MVD.pageLoader({ show: false })
      console.error(error)
      alert(error)
    })
  } else {
    MVD.pageLoader({ show: false })
  }
}

async function getPackageSettings() {
  let version = null
  const versionValue = document.getElementById('packageVersion').value
  if (versionValue) version = Number(versionValue)
  const packageSettings = {
    customActions: [],
    data: [],
    dependencies: [],
    description: document.getElementById('packageDescription').value,
    filesUseLoader: {},
    name: document.getElementById('packageName').value.trim(),
    spLists: [],
    version: version
  }
  customActionsToExport.forEach(element => {
    const customActionModel = element.getModel()
    if (customActionModel.scriptSrc) {
      delete customActionModel.id
      packageSettings.customActions.push(customActionModel)
    }
  })
  dependenciesToExport.filter(e => e.getModel().id).forEach(element => {
    let dependencie = element.getJSON()
    delete dependencie.id
    packageSettings.dependencies.push(dependencie)
  })
  spListsToExport.filter(e => e.getGUID()).forEach(element => {
    packageSettings.spLists.push(element.getJSON())
  })
  for (const listData of listDataToExport) {
    if (!listData.getGUID()) continue
    const listDataJSON = await listData.getJSON()
    packageSettings.data.push(listDataJSON)
  }

  return packageSettings
}

function validatePackageSetting(packageSettings) {
  const packageErrors = []
  if (!packageSettings.name) packageErrors.push('No a especificado el nombre.')
  if (!packageSettings.version) packageErrors.push('No a especificado la versión.')
  for (const spList of packageSettings.spLists) {

  }
  // validar que si es el primer modulo deberia de tener campo, vistas, etc

  if (packageErrors.length) alert(packageErrors.join('\n'))
  return (packageErrors.length == 0)
}

/*-----------------------------------------------------------   Fin generar paquete   -----------------------------------------------------------*/




/*----------------------------------------------------   TAB CUSTOM ACTIONS   -----------------------------------------------------*/
/*---------------------------------------------------------------------------------------------------------------------------------*/


function getCustomActionRowFormInnerHTML(customActionModel, mode) {
  if (mode == TABLE_CRUD_MODES.DISPLAY) {
    return `
    <td>${customActionModel.name}</td>
    <td>${customActionModel.description}</td>
    <td>${customActionModel.domain == 'site' ? 'Colección de sitios' : 'Sitio'}</td>
    <td>${customActionModel.scriptSrc ? customActionModel.scriptSrc : ''}</td>
    <td>${customActionModel.location}</td>
    <td>${customActionModel.sequence}</td>
    <td><div class="tdFlexContainer">
      <button type="button" id="editCustomActionBtn_${customActionModel.id}">Editar</button>
      <button type="button" id="deleteCustomActionBtn_${customActionModel.id}">Borrar</button>
    </div></td>`
  }
  else {
    return `
    <td><input type="text" id="customActionName"  value="${customActionModel.name ? customActionModel.name : ''}" style="width:100px"/></td>
    <td><textarea type="text" id="customActionDescription" rows="4" cols="50" style="resize:none">${customActionModel.description ? customActionModel.description : ''}</textarea></td>
    <td><select id="customActionDomain">
      <option value="site" ${customActionModel.domain == 'site' ? 'selected' : ''}>Colección de sitios</option>
      <option value="web"  ${customActionModel.domain == 'web' ? 'selected' : ''}>Sitio</option>
    </select></td>
    <td><input type="text" id="customActionScriptSrc" value="${customActionModel.scriptSrc ? customActionModel.scriptSrc : ''}" /></td>
    <td><select id="customActionLocation"><option value="ScriptLink">ScriptLink</option></select></td>
    <td><input type="number" id="customActionSequence" min="1" step="1" value="${customActionModel.sequence ? customActionModel.sequence : 1}" style="width:60px" /></td>
    <td><div class="tdFlexContainer"><button type="button" id="saveCustomActionBtn_${customActionModel.id}">Guardar</button><button type="button" id="cancelCustomActionBtn_${customActionModel.id}">Cancelar</button>
    </div></td>`
  }
}

function onClickAddCustomActionRowFormBtn() {
  if (document.getElementById('saveCustomActionBtn_0') == null) {
    const customActionHandlerTableBodyElement = document.getElementById('customActionHandlerTable').querySelector('tbody')
    const newRowElement = customActionHandlerTableBodyElement.insertRow(customActionHandlerTableBodyElement.rows.length)
    const innerHTML = getCustomActionRowFormInnerHTML({ id: 0 })
    newRowElement.innerHTML = innerHTML
  } else {
    alert('Actualmente se encuentra creando un custom action.')
  }
}

function onClickCancelCustomAction(target) {
  const customActionID = target.id.replace('cancelCustomActionBtn_', '')
  if (customActionID == 0) {
    target.closest('tr').remove()
    return
  }
  const customActionModel = allCustomActions.find(e => e.id == customActionID)
  const tr = target.closest('tr');
  tr.innerHTML = getCustomActionRowFormInnerHTML(customActionModel, TABLE_CRUD_MODES.DISPLAY)
}

async function onClickDeleteCustomAction(target) {
  const customActionID = target.id.replace('deleteCustomActionBtn_', '')
  const customActionToDeleteIndex = allCustomActions.findIndex(e => e.id == customActionID)
  const deleteCustomActionConfirmation = confirm(`Está seguro que desea eliminar el custom action ${allCustomActions[customActionToDeleteIndex].name}?\nPodría afectar el comportamiento del MVD Quality`)
  if (deleteCustomActionConfirmation == true) {
    MVD.pageLoader({ show: true })
    try {
      const response = await deleteCustomActionREST(allCustomActions[customActionToDeleteIndex])
      allCustomActions.splice(customActionToDeleteIndex, 1)
      refreshCustomActionsHandlerTableHTML()
      MVD.pageLoader({ show: false })
    } catch (error) {
      MVD.pageLoader({ show: false })
      console.error(error)
      alert(`Hubo en error al querer eliminar el custom action ${allCustomActions[customActionToDeleteIndex].name}.`)
    }
  }
}

function onClickEditCustomAction(target) {
  const customActionID = target.id.replace('editCustomActionBtn_', '')
  const customActionModel = allCustomActions.find(e => e.id == customActionID)
  if (customActionModel.location !== 'ScriptLink') {
    alert('Este tipo de custom action no se puede editar.')
    return;
  }
  const tr = target.closest('tr');
  tr.innerHTML = getCustomActionRowFormInnerHTML(customActionModel, TABLE_CRUD_MODES.EDIT)
}

async function onClickSaveCustomAction(target) {
  const customActionID = target.id.replace('saveCustomActionBtn_', '')
  const description = document.getElementById('customActionDescription').value.trim()
  const domain = document.getElementById('customActionDomain').value
  const location = document.getElementById('customActionLocation').value
  const sequence = document.getElementById('customActionSequence').value
  const name = document.getElementById('customActionName').value.trim()
  let scriptSrc = document.getElementById('customActionScriptSrc').value.trim()
  if (scriptSrc.startsWith('~')) scriptSrc = scriptSrc.substr(scriptSrc.indexOf('/'))
  if (scriptSrc.startsWith('/')) scriptSrc = scriptSrc.replace('/', '')

  scriptSrc = '~siteCollection/' + scriptSrc  // siempre los instalamos a nivel de la coleccion de sitios

  MVD.pageLoader({ show: true })
  const requestDigest = document.getElementById('__REQUESTDIGEST').value
  if (customActionID == 0) {
    let response = await addCustomActionREST({ description, domain, location, sequence, name, scriptSrc }, requestDigest)
    if (response.status < 400) {
      const jsonResponse = await response.json()
      const id = jsonResponse.d.Id
      allCustomActions.push({ domain, description, id, location, name, scriptSrc, sequence })
      refreshCustomActionsHandlerTableHTML()
    } else {
      alert(`Hubo un error al agregar el custom action`)
      console.error(response)
    };
  } else {
    const response = await editCustomActionREST({ description, domain, location, sequence, name, scriptSrc, id: customActionID }, requestDigest)
    if (response.status < 400) {
      let editedCustomActionIndex = allCustomActions.findIndex(e => e.id == customActionID)
      allCustomActions[editedCustomActionIndex] = { description, domain, location, sequence, name, scriptSrc, id: customActionID }
      refreshCustomActionsHandlerTableHTML()
    } else {
      alert(`Hubo un error al ${(customActionID != 0) ? 'agregar' : 'editar'} el custom action`)
      console.error(response)
    };
  }
  MVD.pageLoader({ show: false })
}

function refreshCustomActionsHandlerTableHTML() {
  const customActionHandlerTableBodyElement = document.getElementById('customActionHandlerTable').querySelector('tbody')
  customActionHandlerTableBodyElement.innerHTML = ''
  allCustomActions.forEach((e, i) => {
    const newRowElement = customActionHandlerTableBodyElement.insertRow(customActionHandlerTableBodyElement.rows.length)
    const innerHTML = getCustomActionRowFormInnerHTML(e, TABLE_CRUD_MODES.DISPLAY)
    newRowElement.innerHTML = innerHTML
  })
}

/**
 * Agrega un custom action
 * @param {Object} { description, domain, location, sequence, name, scriptSrc } - Objeto que desestructuro las propiedades domain y id
 * @param {String} requestDigest - Request digest para la llamada
 * @return {Object} response - Respuesta del REST
 **/
async function addCustomActionREST({ description, domain, location, sequence, name, scriptSrc }, requestDigest) {
  let body = {
    __metadata: {
      type: 'SP.UserCustomAction'
    },
    Location: location,
    Sequence: sequence,
    Title: name,
    Description: description,
    Url: scriptSrc,
    ScriptSrc: scriptSrc
  }

  if (scriptSrc.endsWith('.css') || scriptSrc.includes('.css?')) {
    body.Url = ''
    body.ScriptSrc = ''
    let absouluteScriptSrc = _spPageContextInfo.webAbsoluteUrl + scriptSrc.substr(scriptSrc.indexOf('/'))

    body.ScriptBlock = `let head = document.querySelector('head');
                        let linkTag = document.createElement('link');
                        linkTag.rel = 'stylesheet';
                        linkTag.href = '${absouluteScriptSrc}';
                        linkTag.type = 'text/css';
                        head.appendChild(linkTag);`
  }
  body = JSON.stringify(body)

  const fetchSettings = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'accept': 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'content-length': body.length,
      'X-RequestDigest': requestDigest
    },
    body: body
  }

  const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/${domain}/UserCustomActions`
  const response = await fetch(urlToFetch, fetchSettings)
  return response
}

/**
 * Borra un custom action
 * @param {Object} { domain, id } - Objeto que desestructuro las propiedades domain y id
 * @return {Object} response - Respuesta del REST
 **/
async function deleteCustomActionREST({ domain, id }) {
  if (!domain) throw 'El parámetro no presenta la proiedad "domain"'
  if (!id) throw 'El parámetro no presenta la proiedad "id"'

  const fetchSettings = {
    method: 'DELETE',
    credentials: 'same-origin',
    headers: {
      'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
    }
  }
  const url = `${_spPageContextInfo.siteAbsoluteUrl}/_api/${domain}/UserCustomActions(@v0)/deleteObject()?@v0=guid'${id}'`
  const response = await fetch(url, fetchSettings)
  return response
}

/**
 * Agrega un custom action
 * @param {Object} { description, domain, location, sequence, name, scriptSrc } - Objeto que desestructuro las propiedades domain y id
 * @param {String} requestDigest - Request digest para la llamada
 * @return {Object} response - Respuesta del REST
 **/
async function editCustomActionREST({ description, domain, location, sequence, name, scriptSrc, id }, requestDigest) {
  let body = {
    __metadata: {
      type: 'SP.UserCustomAction'
    },
  }
  if (typeof description !== 'undefined') body.Description = description
  if (typeof location !== 'undefined') body.Location = location
  if (typeof sequence !== 'undefined') body.Sequence = sequence
  if (typeof name !== 'undefined') body.Title = name
  if (typeof scriptSrc !== 'undefined') {
    body.Url = scriptSrc
    body.ScriptSrc = scriptSrc

    if (scriptSrc.endsWith('.css') || scriptSrc.includes('.css?')) {
      body.Url = ''
      body.ScriptSrc = ''
      let absouluteScriptSrc = _spPageContextInfo.webAbsoluteUrl + scriptSrc.substr(scriptSrc.indexOf('/'))
      body.ScriptBlock = `let head = document.querySelector('head');
                        let linkTag = document.createElement('link');
                        linkTag.rel = 'stylesheet';
                        linkTag.href = '${absouluteScriptSrc}';
                        linkTag.type = 'text/css';
                        head.appendChild(linkTag);`
    }
  }

  body = JSON.stringify(body)

  const fetchSettings = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'accept': 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'content-length': body.length,
      'X-RequestDigest': requestDigest,
      'X-HTTP-Method': 'MERGE'
    },
    body: body
  }

  const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/${domain}/UserCustomActions('${id}')`
  const response = await fetch(urlToFetch, fetchSettings)
  return response
}

function getCustomActions(siteOrWeb = 'site') {
  return new Promise(function (resolve, reject) {
    const fetchSettings = {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json; odata=verbose'
      }
    }
    const hostWebUrl = (_spPageContextInfo.webServerRelativeUrl !== '/') ? _spPageContextInfo.webServerRelativeUrl : ''
    const url = hostWebUrl + '/_api/' + siteOrWeb + '/userCustomActions?$orderby=Sequence'
    fetch(url, fetchSettings)
      .then(response => {
        response.json()
          .then(parsedResponse => {
            let customActions = [];
            for (const customAction of parsedResponse.d.results) {
              let scriptSrc = ''

              if (customAction.ScriptSrc) {
                scriptSrc = customAction.ScriptSrc
                if (scriptSrc.includes('?ts=')) {
                  scriptSrc = scriptSrc.substring(0, scriptSrc.indexOf('?ts='))
                }
                if (scriptSrc.startsWith('~')) {
                  scriptSrc = scriptSrc.substring(scriptSrc.indexOf('/'))
                }
              }

              const customActionObj = {
                domain: siteOrWeb,
                description: (customAction.Description || ''),
                id: customAction.Id,
                location: customAction.Location,
                name: (customAction.Title || customAction.Name || ''),
                scriptSrc,
                sequence: customAction.Sequence
              }
              if (customAction.ScriptBlock) {
                let indexOfWebAbsluteUrl = customAction.ScriptBlock.indexOf(_spPageContextInfo.webAbsoluteUrl)
                let indexOfCSS = customAction.ScriptBlock.indexOf('.css')
                let urlCSS = customAction.ScriptBlock.substring(indexOfWebAbsluteUrl, indexOfCSS + 4)
                let urlRelativeCSS = urlCSS.replace(_spPageContextInfo.webAbsoluteUrl, '')
                customActionObj.scriptSrc = urlRelativeCSS
              }
              customActions.push(customActionObj)
            }
            resolve(customActions)
          })
      }).catch(error => reject(error))
  })
}




/*----------------------------------------------------   TAB UPDATE PACKAGES   -----------------------------------------------------*/
/*----------------------------------------------------------------------------------------------------------------------------------*/

// si el paquete a instalar ya esta instalado, se hace otra vez
function checkDependenciesOfThepackageToImport(packageJson) {
  const { dependencies, name, version } = packageJson
  let hasNecessariesDependencies = true
  const missingDependencies = []
  for (let i = 0; i < dependencies.length; i++) {
    if (!currentSitePackages.find(e => e.Title == dependencies[i].name && e.Version >= dependencies[i].version)) {
      hasNecessariesDependencies = false
      missingDependencies.push(dependencies[i].name + ' versión ' + dependencies[i].version)
    }
  }
  if (missingDependencies.length) alert('Primero debe de instalar las dependencias: \n' + missingDependencies.join('\n'))
  return hasNecessariesDependencies
}

function consoleLogPackage(msg, useLastParagraph) {
  try {
    const pElement = (useLastParagraph) ? document.querySelector('#packageUpdaterLogConsole p:last-child') : document.createElement('p')
    pElement.innerText += (useLastParagraph) ? ('\n' + msg) : msg
    document.getElementById('packageUpdaterLogConsole').append(pElement)
    consoleMsgTextArray.push(msg)
  } catch (error) {

  }
}

async function createOrUpdateModuleRecord(moduleSettings) {
  const moduleToUpdate = currentSitePackages.find(e => e.Title == moduleSettings.name)
  if (moduleToUpdate) {
    const log = moduleToUpdate.Log + '\n---*** Actualización ***---\n' + consoleMsgTextArray.join('\n')
    await updateItem({
      item: {
        ID: moduleToUpdate.ID,
        Title: moduleSettings.name,
        Version: moduleSettings.version,
        Log: log
      },
      listGUID: _spPageContextInfo.pageListId,
      siteUrl: _spPageContextInfo.webServerRelativeUrl
    })
  } else {
    const log = consoleMsgTextArray.join('\n')
    await createItem({
      item: {
        Title: moduleSettings.name,
        Version: moduleSettings.version,
        Log: log
      },
      listGUID: _spPageContextInfo.pageListId,
      siteUrl: _spPageContextInfo.webServerRelativeUrl
    })
  }
}

async function ensureGroup(group) {
  const fetchSettings = {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json; odata=verbose'
    }
  }
  const response = await fetch(`${_spPageContextInfo.siteAbsoluteUrl}/_api/web/sitegroups/getByName('${group.login}')`, fetchSettings)
  if (response.status == 200) {
    const responseJSON = await response.json()
    group.id = responseJSON.d.Id
  } else {
    const clientContext = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl)
    // NOTE: The user who is running the code will be added as "Group Owner"
    const oGroupCollection = clientContext.get_web().get_siteGroups()
    const oGroupCreationInformation = new SP.GroupCreationInformation()
    oGroupCreationInformation.set_title(group.login)
    oGroupCreationInformation.set_description('')
    const oGroup = oGroupCollection.add(oGroupCreationInformation)
    clientContext.load(oGroup)
    try {
      await executeQueryPromise(clientContext)
      group.id = oGroup.get_id()
    } catch (error) {
      console.error(error)
      return
    }
  }
  return group
}

async function getCurrentSitePackages() {
  const listUrl = '/Lists/MVDUpdater'
  allCurrentSitePackages = await getItems({ listUrl, siteUrl: _spPageContextInfo.webServerRelativeUrl })
  const reducedPackages = allCurrentSitePackages.reduce(function (accu, value) {
    if (!accu[value.Title] || accu[value.Title].Version < value.Version) accu[value.Title] = value
    return accu
  }, {})
  currentSitePackages = Object.values(reducedPackages)
  return currentSitePackages
}

function getCurrentSitePackageInnerHTML(currentSitePackage) {
  /* 
  let innerHTML =
      `<td>${currentSitePackage.Title}</td>
      <td>${(currentSitePackage.Version) ? currentSitePackage.currentVersion : ''}</td>
      <td>${currentSitePackage.versionToBeUpdated}</td>
      <td style="text-align:center"><div class="tdFlexContainer">
      ${(currentSitePackage.versionToBeUpdated > currentSitePackage.currentVersion) ?
          `<button type="button" id="updateCurrentSitePackageBtn_${currentSitePackage.id}">${(!currentSitePackage.currentVersion) ? 'Instalar' : 'Actualizar'} </button>` : ''}
      <button type="button" id="uninstallCurrentSitePackageBtn_${currentSitePackage.id}" disabled>Desinstalar</button></div>
      </td>`;  
  */
  const innerHTML =
    `<td>${currentSitePackage.Title}</td>
    <td>${currentSitePackage.Version}</td>
    <td><div class="tdLogPackages">${(currentSitePackage.Log) ? currentSitePackage.Log : ''}</div></td>`
  return innerHTML
}

async function onChangeAddPackageFileInput(file) {
  MVD.pageLoader({ show: true })
  const confirmMsgTextArray = []
  const processedFilePackage = await processFileInput(file)
  for (const file of processedFilePackage.files) {
    if (file.fileRoot.endsWith('.json')) {
      const decoder = new TextDecoder();
      const fileText = decoder.decode(file.arrayBuffer)
      file.json = JSON.parse(fileText)
      delete file.arrayBuffer
      if (file.fileRoot == 'settings.json') {
        confirmMsgTextArray.push(`Quiere continuar con la instalación del módulo ${file.json.name} versión ${file.json.version}.`)
        if (file.json.description) {
          confirmMsgTextArray.push('Descripción: ' + file.json.description + '\n')
        }
      }
    }
  }

  MVD.pageLoader({ show: false })
  const confirmMsgText = confirmMsgTextArray.join('\n')
  const confirmPackages = confirm(confirmMsgText)
  if (confirmPackages == true) {
    document.getElementById('packageUpdaterLogConsole').innerHTML = ''
    try {
      updatePackagesToImport(processedFilePackage)
    } catch (error) {
      consoleLogPackage(`ERROR -- Actualizando módulo ${file.json.name}`, false)
      document.getElementById('packageUpdaterLogConsoleSpinner').style.display = 'none'
      console.error(error)
    }

  }
  document.getElementById('addPackageFileInput').value = null
}

function refreshCurrentSitePackagesTableHTML() {
  const currentSitePackagesTableBodyElement = document.getElementById('currentSitePackagesTable').querySelector('tbody')
  currentSitePackagesTableBodyElement.innerHTML = ''
  currentSitePackages.forEach(currentSitePackage => {
    const newRowElement = currentSitePackagesTableBodyElement.insertRow(currentSitePackagesTableBodyElement.rows.length)
    const innerHTML = getCurrentSitePackageInnerHTML(currentSitePackage)
    newRowElement.innerHTML = innerHTML
  })
}

async function refreshUpdaterPage() {
  await getDataToInitModule()
  refreshCustomActionsHandlerTableHTML()
  refreshCurrentSitePackagesTableHTML()
}

async function updatePackagesToImport(packageToImport) {
  consoleMsgTextArray = []
  let updateLoaderVersions = false
  const settings = packageToImport.files.find(e => e.fileRoot == 'settings.json')
  const mvdFormsFiles = packageToImport.files.filter(e => e.fileRoot.startsWith('mvdForms/'))
  const filesFiles = packageToImport.files.filter(e => e.fileRoot.startsWith('files/'))
  const dataFiles = packageToImport.files.filter(e => e.fileRoot.startsWith('data/'))
  const listsFiles = packageToImport.files.filter(e => e.fileRoot.startsWith('lists/'))
  const migrationFile = packageToImport.files.find(e => e.fileRoot.endsWith('/migration.js'))
  const customActions = settings.json.customActions

  for (const list of listsFiles) {
    const mvdFormFileName = list.json.listUrl.substring(list.json.listUrl.lastIndexOf('/') + 1)
    list.json.mvdForms = mvdFormsFiles.filter(e => e.fileRoot.replace('mvdForms/', '') == mvdFormFileName + '.txt')
    for (let i = list.json.relatedListsLookup.length - 1; i >= 0; i--) {
      const listToImport = listsFiles.find(e => e.json.listUrl.toLowerCase() == list.json.relatedListsLookup[i].listUrl.toLowerCase())
      if (listToImport) {
        list.json.relatedListsLookup[i].listSettings = listToImport.json
      } else {
        list.json.relatedListsLookup.splice(i, 1)
      }
    }
    for (let i = list.json.relatedLists.length - 1; i >= 0; i--) {
      const listToImport = listsFiles.find(e => e.json.listUrl.toLowerCase() == list.json.relatedLists[i].listUrl.toLowerCase())
      if (listToImport) {
        list.json.relatedLists[i].listSettings = listToImport.json
      } else {
        list.json.relatedLists.splice(i, 1)
      }
    }
  }

  if (checkDependenciesOfThepackageToImport(settings.json)) {
    const requestDigest = document.getElementById('__REQUESTDIGEST').value
    consoleLogPackage(`--- Importando módulo ${settings.json.name} versión ${settings.json.version} ---`, false)
    document.getElementById('packageUpdaterLogConsoleSpinner').style.display = 'block'
    if (filesFiles.length) {
      consoleLogPackage('', false)
      consoleLogPackage(`-- Cantidad de archivos: ${filesFiles.length}`, false)
      for (const file of filesFiles) {
        let keyUseLoader = file.fileRoot.replace('files/MVDAssets/', '')
        const keyUseLoaderExtension = keyUseLoader.substr(keyUseLoader.lastIndexOf('.'))
        keyUseLoader = keyUseLoader.replace(keyUseLoaderExtension, '')
        const rootFile = file.fileRoot.replace('files', '')
        await importFile(rootFile, file.arrayBuffer)
        if (settings.json.filesUseLoader[keyUseLoader + keyUseLoaderExtension]) {
          consoleLogPackage(`Se importó ${rootFile}`, true)
          updateLoaderVersions = true
          if (keyUseLoaderExtension === '.js') {
            MVD.versionsManifest[MVD.versionsTypes.SCRIPT][keyUseLoader] = rootFile + '?ts=' + Date.now()
          } else if (keyUseLoaderExtension === '.css') {
            MVD.versionsManifest[MVD.versionsTypes.LINK][keyUseLoader] = rootFile + '?ts=' + Date.now()
          } else if (['.png', '.jpeg'].includes(keyUseLoaderExtension)) {
            MVD.versionsManifest[MVD.versionsTypes.IMG][keyUseLoader] = rootFile + '?ts=' + Date.now()
          } else {
            MVD.versionsManifest[MVD.versionsTypes.LINK][keyUseLoader] = rootFile + '?ts=' + Date.now()
          }
        }
      }
    }

    if (listsFiles.length) {
      consoleLogPackage('', false)
      consoleLogPackage(`-- Cantidad de listas: ${listsFiles.length}`, false)
      for (const list of listsFiles) {
        await importList(list.json)
      }
    }

    if (dataFiles.length) {
      const sortedDataFiles = dataFiles.sort(function (a, b) {
        return (a.json.relatedListsLookup.some(e => e.toLowerCase() === b.json.listUrl.toLowerCase())) ? 1 : -1
      })
      consoleLogPackage('', false)
      consoleLogPackage(`-- Cantidad de datos: ${sortedDataFiles.length}`, false)
      for (const dataJSON of sortedDataFiles) {
        await importData(dataJSON.json)
        consoleLogPackage(`Se creó/actualizó los registros en ${dataJSON.json.listUrl}`, true)
      }
    }

    if (customActions.length) {
      consoleLogPackage(`-- Custom actions a importar: ${customActions.length}`, false)
      for (const customActionJSON of customActions) {
        const existCustomAction = allCustomActions.find(e => e.scriptSrc.toLowerCase() === customActionJSON.scriptSrc.toLowerCase())

        let splitScriptSrc = customActionJSON.scriptSrc.split('/')
        let keyFileUseLoader = splitScriptSrc.filter((e, i) => i > 1).join('/')
        customActionJSON.scriptSrc = customActionJSON.scriptSrc + '?ts=' + Date.now()
        if (settings.json.filesUseLoader[keyFileUseLoader]) {
          let keyUseLoader = keyFileUseLoader.substring(0, keyFileUseLoader.lastIndexOf('.'))
          MVD.versionsManifest[MVD.versionsTypes.SCRIPT][keyUseLoader] = customActionJSON.scriptSrc
        }


        if (existCustomAction) {
          customActionJSON.id = existCustomAction.id;
          await editCustomActionREST(customActionJSON, requestDigest)
          consoleLogPackage(`Se actualizó ${customActionJSON.name}`, true)
        } else {
          await addCustomActionREST(customActionJSON, requestDigest)
          consoleLogPackage(`Se creó ${customActionJSON.name}`, true)
        }
      }
    }

    if (migrationFile) {
      const migrationFileUrl = migrationFile.fileRoot.replace('files', '')
      try {
        consoleLogPackage('Ejecutando migration.js', false)
        const migrationModule = await import(migrationFileUrl)
        try {
          await migrationModule.default()
        } catch (error) {
          consoleLogPackage('Error en migration.js', true)
        }
        consoleLogPackage('Eliminó archivo migration.js', true)
      } catch (error) {
        console.error(error)
        consoleLogPackage('Error en import migration.js', true)
      }
      deleteFile(migrationFileUrl)
    }

    if (updateLoaderVersions) {
      let arrayBuffer = new TextEncoder().encode(`
          var MVD = MVD  || {}
          MVD.versionsTypes = ${JSON.stringify(MVD.versionsTypes).split(',').join(',\n')}
          MVD.versionsManifest = ${JSON.stringify(MVD.versionsManifest).split(',').join(',\n')}
          `);

      await importFile('/MVDAssets/updater/loader-versions-manifest-custom-action.js', arrayBuffer)

      const loaderManifestCusomAction = allCustomActions.find(e => e.scriptSrc.includes('/loader-versions-manifest-custom-action.js'))
      loaderManifestCusomAction.scriptSrc += '?ts=' + Date.now()

      await editCustomActionREST({ ...loaderManifestCusomAction }, requestDigest)
      consoleLogPackage(`Se actualizó ${loaderManifestCusomAction.name}`, false)
    }

    consoleLogPackage(`Finalizó la importación del módulo ${settings.json.name}`, false)
    await createOrUpdateModuleRecord(settings.json)

    document.getElementById('packageUpdaterLogConsoleSpinner').style.display = 'none'
    refreshUpdaterPage()
  }
}


/*-----------------------------------------------------------   Archivos   -----------------------------------------------------------*/

async function importFile(fileRelativeURL, arrayBuffer) {
  if (!fileRelativeURL.startsWith(_spPageContextInfo.webServerRelativeUrl)) fileRelativeURL = _spPageContextInfo.webServerRelativeUrl + fileRelativeURL
  const folderRelativeURLSplitted = fileRelativeURL.split('/')
  const fileName = folderRelativeURLSplitted.splice(folderRelativeURLSplitted.length - 1, 1)[0]
  const folderRelativeURL = folderRelativeURLSplitted.join('/')
  await ensureFolderRelativeURL(folderRelativeURL)
  await addFileToFolder(folderRelativeURL, fileName, arrayBuffer)//todo manejo de errores
  return true
}

async function ensureFolderRelativeURL(folderRelativeURL) {
  const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/getfolderbyserverrelativeurl('${folderRelativeURL}')`
  const response = await fetch(urlToFetch)
  return (response.status == 200) ? true : createFolder(folderRelativeURL)
}

async function createFolder(folderRelativeURL) {
  const folderRelativeURLSplitted = folderRelativeURL.split('/')
  const folderName = folderRelativeURLSplitted.splice(folderRelativeURLSplitted.length - 1, 1)
  await ensureFolderRelativeURL(folderRelativeURLSplitted.join('/'))
  const body = JSON.stringify({
    __metadata: {
      type: 'SP.Folder'
    },
    ServerRelativeUrl: folderName[0]
  })
  const fetchSettings = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'content-length': body.length,
      'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
    },
    body: body
  }
  const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/getfolderbyserverrelativeurl('${folderRelativeURLSplitted.join('/')}')/folders`

  const response = await fetch(urlToFetch, fetchSettings)
  return (response.status == 201) ? true : response
}

async function addFileToFolder(folderRelativeURL, fileName, arrayBuffer) {
  const folderRelativeURLSplitted = folderRelativeURL.split('/')
  const folderName = folderRelativeURLSplitted.splice(folderRelativeURLSplitted.length - 1, 1)
  const body = JSON.stringify({
    __metadata: {
      type: 'SP.File'
    },
    ServerRelativeUrl: folderName[0]
  })
  const fetchSettings = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'content-length': arrayBuffer.length,
      'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
    },
    body: arrayBuffer
  }
  const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/getfolderbyserverrelativeurl('${folderRelativeURL}')/files/add(overwrite=true, url='${fileName}')`

  const response = await fetch(urlToFetch, fetchSettings)
  return (response.status < 300) ? true : response
}

async function deleteFile(fileRelativeURL) {
  const fetchSettings = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-HTTP-Method': 'DELETE',
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
    }
  }
  const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/getfilebyserverrelativeurl('${fileRelativeURL}')`
  const response = await fetch(urlToFetch, fetchSettings)
  return (response.status < 300) ? true : response
}

/*-----------------------------------------------------------   Fin archivos   -----------------------------------------------------------*/


/*-----------------------------------------------------------   Listas   -----------------------------------------------------------*/

async function createList(listSettings) {
  const listTitle = listSettings.listUrl.substring(listSettings.listUrl.lastIndexOf('/') + 1)
  const body = JSON.stringify({
    __metadata: {
      type: 'SP.List'
    },
    AllowContentTypes: true,
    BaseTemplate: listSettings.schemaProperties.serverTemplate,
    ContentTypesEnabled: false,
    Description: listSettings.schemaProperties.description,
    Title: listTitle
  })

  const fetchSettings = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'content-length': body.length,
      'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value
    },
    body: body
  }
  const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists`
  const response = await fetch(urlToFetch, fetchSettings)
  const responseJSON = await response.json()
  return responseJSON.d.Id
}

async function ensureList(listSettings) {
  let listInfo = {}
  try {
    listInfo = await getListInfo({ listUrl: listSettings.listUrl, siteUrl: _spPageContextInfo.webServerRelativeUrl })
    listSettings.guid = listInfo.listGUID
  } catch (error) {

  }
  if (!listSettings.guid) {
    listSettings.guid = await createList(listSettings)
    consoleLogPackage(`Se creó la lista ${listSettings.schemaProperties.title} (${listSettings.listUrl})`, true)
  } else {
    listSettings.guid = await updateList(listSettings)
    consoleLogPackage(`Se actualizó la lista ${listSettings.schemaProperties.title} (${listSettings.listUrl})`, true)
  }
  return listSettings.guid
}

async function ensureLookupFieldInChildList(fieldSettings) {
  const fieldToImport = Object.assign({}, fieldSettings)
  const succesMsg = `Se aseguró el campo lookup ${fieldToImport.DisplayName} dentro de ${fieldToImport.ListChildTitle}`
  delete fieldToImport.ListChildTitle
  const clientContext = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl)
  const web = clientContext.get_web()
  const lists = web.get_lists()
  const list = lists.getById(fieldToImport.ListChildGUID)
  delete fieldToImport.ListChildGUID
  const fieldsCollection = list.get_fields()
  const exceptionScope = new SP.ExceptionHandlingScope(clientContext)
  const startScope = exceptionScope.startScope()
  const tryScope = exceptionScope.startTry()
  fieldsCollection.getByInternalNameOrTitle(fieldToImport.Name)
  tryScope.dispose()
  const catchScope = exceptionScope.startCatch()
  catchScope.dispose()
  startScope.dispose()
  clientContext.load(fieldsCollection)
  try {
    await executeQueryPromise(clientContext)
    if (exceptionScope.get_hasException()) {
      //fieldToImport.List = fieldToImport.ListParentURL
      //delete fieldToImport.ListParentURL
      //delete fieldToImport.ListUrl
      fieldToImport.List = fieldToImport.ListUrl
      delete fieldToImport.ListUrl
      const fieldToImportPlainXML = await getFieldPlainXML(fieldToImport)
      fieldsCollection.addFieldAsXml(fieldToImportPlainXML, false, SP.AddFieldOptions.addFieldInternalNameHint)
      list.update()
    }
    await executeQueryPromise(clientContext)
    consoleLogPackage(succesMsg, true)

    return
  } catch (error) {
    console.error(error)
  }
}

async function getFieldPlainXML(fieldSchemaResumed, currentListFields) {
  let fieldPlainXML = '<Field'
  for (const keySchema in fieldSchemaResumed) {
    if (['Default', 'Customization', 'CHOICES', 'FieldRefs', 'Formula', 'FormulaDisplayNames'].includes(keySchema)) continue
    if (['Lookup', 'LookupMulti'].includes(fieldSchemaResumed.Type) && keySchema === 'List') {
      let listInfo = null
      try {
        listInfo = await getListInfo({ listUrl: fieldSchemaResumed[keySchema], siteUrl: _spPageContextInfo.webServerRelativeUrl })
      } catch (error) {
        consoleLogPackage(`ERROR -- El campo ${fieldSchemaResumed.DisplayName}. Presenta errores ya que no se existe la lista a la que se relaciona ${fieldSchemaResumed[keySchema]}.`, true)
      }
      fieldSchemaResumed[keySchema] = `{${listInfo?.listGUID}}`
    }
    fieldPlainXML += ` ${keySchema}="${fieldSchemaResumed[keySchema]}"`
  }
  fieldPlainXML += ' >'
  if (typeof fieldSchemaResumed.CHOICES !== 'undefined') {
    let choicesPlainXML = '<CHOICES>'
    if (!Array.isArray(fieldSchemaResumed.CHOICES.CHOICE)) fieldSchemaResumed.CHOICES.CHOICE = [fieldSchemaResumed.CHOICES.CHOICE]
    fieldSchemaResumed.CHOICES.CHOICE.forEach(choice => { choicesPlainXML += `<CHOICE>${choice}</CHOICE>` })
    choicesPlainXML += '</CHOICES>'
    fieldPlainXML += choicesPlainXML
  } else if (typeof fieldSchemaResumed.Customization !== 'undefined') {
    let customizationPlainXML = '<Customization>'
    customizationPlainXML += '<ArrayOfProperty>'
    if (!Array.isArray(fieldSchemaResumed.Customization.ArrayOfProperty.Property)) fieldSchemaResumed.Customization.ArrayOfProperty.Property = new Array(fieldSchemaResumed.Customization.ArrayOfProperty.Property)
    for (const prop of fieldSchemaResumed.Customization.ArrayOfProperty.Property) {
      if (prop.Name == 'saveManager') {
        const saveManagerPropValue = JSON.parse(prop.Value)
        if (saveManagerPropValue.listUrl) {
          let listInfo = null
          try {
            listInfo = await getListInfo({ listUrl: saveManagerPropValue.listUrl, siteUrl: _spPageContextInfo.webServerRelativeUrl })
          } catch (error) {
            consoleLogPackage(`ERROR -- El campo ${fieldSchemaResumed.DisplayName}. Presenta errores ya que no se existe la lista a la que se relaciona ${saveManagerPropValue.listUrl}.`, true)
          }

          saveManagerPropValue.listGUID = listInfo?.listGUID
          delete saveManagerPropValue.listUrl
          prop.Value = JSON.stringify(saveManagerPropValue)
        }
      }
      customizationPlainXML += `<Property><Name>${prop.Name}</Name><Value p4:type="q1:string" xmlns:p4="http://www.w3.org/2001/XMLSchema-instance">${prop.Value}</Value></Property>`
    }
    customizationPlainXML += '</ArrayOfProperty>'
    customizationPlainXML += '</Customization>'
    fieldPlainXML += customizationPlainXML
  } else if (typeof fieldSchemaResumed.Formula !== 'undefined') {
    const formulaWithReplacedCharacters = fieldSchemaResumed.Formula.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
    let formulaAndFieldRefsPlainXML = `<Formula>${formulaWithReplacedCharacters}</Formula>`
    if (fieldSchemaResumed.FieldRefs) {
      formulaAndFieldRefsPlainXML += '<FieldRefs>'
      if (!Array.isArray(fieldSchemaResumed.FieldRefs.FieldRef)) fieldSchemaResumed.FieldRefs.FieldRef = new Array(fieldSchemaResumed.FieldRefs.FieldRef)
      let sortedFieldRefs = fieldSchemaResumed.FieldRefs.FieldRef.sort(function (a, b) {
        return (a.Name.includes(b.Name)) ? -1 : 1
      })
      sortedFieldRefs.forEach(fieldRef => {
        let field = currentListFields.find(e => e.Name === fieldRef.Name)
        if (field && field.Name !== field.DisplayName) {
          formulaAndFieldRefsPlainXML = formulaAndFieldRefsPlainXML.replaceAll(field.Name, `[${field.DisplayName}]`)
        }
        formulaAndFieldRefsPlainXML += `<FieldRef Name="${fieldRef.Name}" />`
      })
      formulaAndFieldRefsPlainXML += '</FieldRefs>'
    }
    fieldPlainXML += formulaAndFieldRefsPlainXML
  }
  if (typeof fieldSchemaResumed.Default !== 'undefined') {
    fieldPlainXML += `<Default>${fieldSchemaResumed.Default}</Default>`
  }
  fieldPlainXML += '</Field>'

  return fieldPlainXML
}

async function importList(listSettings) {
  if (listSettings.imported) return true
  for (const relatedList of listSettings.relatedListsLookup) {
    await importList(relatedList.listSettings)
  }
  consoleLogPackage(`Importando ${listSettings.schemaProperties.title}`, true)
  const listGUID = await ensureList(listSettings)
  for (const relatedList of listSettings.relatedLists) {
    const listGUIDChild = await ensureList(relatedList.listSettings)
    const lookupField = relatedList.listSettings.fields.find(e => {
      return e.Name === relatedList.lookupInternalName
      //let fieldListURL = (!e.ListUrl.startsWith(_spPageContextInfo.webServerRelativeUrl)) ? + _spPageContextInfo.webServerRelativeUrl + e.ListUrl : e.ListUrl
      //return fieldListURL == listSettings.rootFolder.toLocaleLowerCase()
    })
    if (lookupField) {
      //lookupField.ListParentURL = listSettings.listUrl
      lookupField.ListChildGUID = listGUIDChild
      lookupField.ListChildTitle = relatedList.listSettings.schemaProperties.title
      await ensureLookupFieldInChildList(lookupField)
      consoleLogPackage(`Se asegura la relación con ${relatedList.listSettings.schemaProperties.title}`, true)
    }
  }
  let isUpdatedComplete = await updateListFromJSON(listSettings)
  if (isUpdatedComplete) {
    consoleLogPackage(`Finalizó la importación de la lista ${listSettings.schemaProperties.title}`, true)
  } else {
    consoleLogPackage(`ERROR -- Finalizo con errores la importación de la lista ${listSettings.schemaProperties.title}`, true)
  }
  listSettings.imported = true
}

async function updateList(listSettings) {
  const body = JSON.stringify({
    __metadata: {
      type: 'SP.List'
    },
    AllowContentTypes: true,
    BaseTemplate: listSettings.schemaProperties.serverTemplate,
    ContentTypesEnabled: false,
    Description: listSettings.schemaProperties.description,
    Title: listSettings.schemaProperties.title
  })

  const fetchSettings = {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      accept: 'application/json; odata=verbose',
      'content-type': 'application/json; odata=verbose',
      'content-length': body.length,
      'X-RequestDigest': document.getElementById('__REQUESTDIGEST').value,
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    },
    body: body
  }
  const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists(guid'${listSettings.guid}')`
  const response = await fetch(urlToFetch, fetchSettings)
  return listSettings.guid
}

async function updateListFromJSON(listSettings) {
  const clientContext = new SP.ClientContext(_spPageContextInfo.webServerRelativeUrl)
  const web = clientContext.get_web()
  const lists = web.get_lists()
  const oList = lists.getById(listSettings.guid)
  clientContext.load(oList, 'HasUniqueRoleAssignments', 'SchemaXml', 'EnableVersioning', 'Views', 'RoleAssignments', 'RoleAssignments.Include(Member,RoleDefinitionBindings)')
  const fieldsCollection = oList.get_fields()
  clientContext.load(fieldsCollection)
  const viewsCollection = oList.get_views()
  clientContext.load(viewsCollection)

  try {
    await executeQueryPromise(clientContext)
  } catch (error) {
    console.error(error)
    return
  }

  let domParser = new DOMParser()
  let schemaXML = domParser.parseFromString(oList.get_schemaXml(), 'text/xml')
  let schema = convertXmlToObject(schemaXML)

  let updateList = false
  if (schema.Title !== listSettings.schemaProperties.title) {
    oList.set_title(listSettings.schemaProperties.title)
    updateList = true
  }
  if (schema.Description !== listSettings.schemaProperties.description) {
    oList.set_description(listSettings.schemaProperties.description)
    updateList = true
  }

  if (listSettings.schemaProperties.enableVersioning.toLowerCase() !== schema.EnableVersioning.toLowerCase()) {
    oList.set_enableVersioning(listSettings.schemaProperties.enableVersioning.toLowerCase() === 'true')
    updateList = true
  }
  if (schema.EnableVersioning.toLowerCase() === 'true' && listSettings.schemaProperties.majorVersionLimit !== '0' && schema.MajorVersionLimit != listSettings.schemaProperties.majorVersionLimit) {
    oList.set_majorVersionLimit(Number(listSettings.schemaProperties.majorVersionLimit))
    updateList = true
  }

  if (updateList) {
    oList.update()
  }




  // fields
  let currentListFields = schema.Fields.Field.filter(e => !['_CommentFlags', '_CommentCount'].includes(e.Name) && e.FromBaseType !== 'TRUE' || ['Title'].includes(e.Name))
  let fieldsToUpdate = listSettings.fields.filter(e => e.Type !== 'Calculated' && !e.ReadOnly)
  await updateListFieldsFromJSON({ clientContext, currentListFields, fieldsCollection, fieldsToUpdate, oList })
  schemaXML = domParser.parseFromString(oList.get_schemaXml(), 'text/xml')
  schema = convertXmlToObject(schemaXML)
  currentListFields = schema.Fields.Field.filter(e => !['_CommentFlags', '_CommentCount'].includes(e.Name) && e.FromBaseType !== 'TRUE' || ['Title'].includes(e.Name))
  fieldsToUpdate = listSettings.fields.filter(e => e.Type === 'Calculated' || (e.Type.includes('Lookup') && e.ReadOnly))
  if (fieldsToUpdate.length) {//si un calculdo usa otro calculado... bombastic
    await updateListFieldsFromJSON({ clientContext, currentListFields, fieldsCollection, fieldsToUpdate, oList })
  }
  schemaXML = domParser.parseFromString(oList.get_schemaXml(), 'text/xml')
  schema = convertXmlToObject(schemaXML)
  currentListFields = schema.Fields.Field.filter(e => !['_CommentFlags', '_CommentCount'].includes(e.Name) && e.FromBaseType !== 'TRUE' || ['Title'].includes(e.Name))

  // permissions
  if ((typeof listSettings.permissions == 'boolean' && listSettings.permissions) || (Array.isArray(listSettings.permissions) && listSettings.permissions.length)) {
    if (!oList.get_hasUniqueRoleAssignments()) {
      oList.breakRoleInheritance(false, true) // break role inheritance first!
      const currentUser = clientContext.get_web().get_currentUser()
      const exceptionScope = new SP.ExceptionHandlingScope(clientContext)
      const startScope = exceptionScope.startScope()
      const tryScope = exceptionScope.startTry()
      oList.get_roleAssignments().getByPrincipal(currentUser).deleteObject()
      tryScope.dispose()
      const catchScope = exceptionScope.startCatch()
      catchScope.dispose()
      startScope.dispose()
      await executeQueryPromise(clientContext)
      if (exceptionScope.get_hasException()) {
        consoleLogPackage(`ERROR -- Al cortar herencia de permisos. Mensaje: ${exceptionScope.get_errorMessage().replace(/\s/g, ' ')}`, true)
        console.error({ exceptionScope })
      } else {
        consoleLogPackage('Se corta herencia de permisos', true)
      }
    }
  }

  if (Array.isArray(listSettings.permissions) && listSettings.permissions.length) {
    let executedExeptionScopes = []
    for (const userPermissions of listSettings.permissions) {
      let exceptionScope = new SP.ExceptionHandlingScope(clientContext)
      let startScope = exceptionScope.startScope()
      let tryScope = exceptionScope.startTry()
      const roleDefBindingColl = SP.RoleDefinitionBindingCollection.newObject(clientContext)
      let user = null
      if (userPermissions.type === 1) {
        // user = clientContext.get_web().get_siteUsers().getById(userPermissions.id);
        continue
      } else {
        await ensureGroup(userPermissions)
        user = clientContext.get_web().get_siteGroups().getByName(userPermissions.login)
      }
      userPermissions.roleType.forEach(function (roleType) {
        if (isNaN(roleType)) {
          roleDefBindingColl.add(clientContext.get_web().get_roleDefinitions().getByName(roleType))
        } else {
          roleDefBindingColl.add(clientContext.get_web().get_roleDefinitions().getByType(roleType))
        }

      })
      oList.get_roleAssignments().add(user, roleDefBindingColl)
      clientContext.load(user)
      tryScope.dispose()
      let catchScope = exceptionScope.startCatch()
      catchScope.dispose()
      startScope.dispose()
      executedExeptionScopes.push({ exceptionScope, user, userPermissions })
    };

    try {
      await executeQueryPromise(clientContext)
      for (let index = 0; index < executedExeptionScopes.length; index++) {
        const element = executedExeptionScopes[index];
        if (element.exceptionScope.get_hasException()) {
          consoleLogPackage(`ERROR -- No se importo los permisos del grupo ${element.userPermissions.login}. Mensaje: ${element.exceptionScope.get_errorMessage().replace(/\s/g, ' ')}`, true)
          console.error({ element })
        } else {
          consoleLogPackage(`Se importo los permisos del grupo ${element.userPermissions.login}`, true)
        }
      }
    } catch (error) {
      console.error(error)
      return
    }
  }

  // mvdForms
  for (let i = 0; i < listSettings.mvdForms.length; i++) {
    let uploadMVDForm = true
    let oldMVDForms = await getMVDFormsFromList({ guid: listSettings.guid, listUrl: listSettings.listUrl })
    if (oldMVDForms) {
      const oldMVDFormsText = oldMVDForms.text
      const decoder = new TextDecoder();
      const mvdFormsTxt = decoder.decode(listSettings.mvdForms[i].arrayBuffer)
      uploadMVDForm = (oldMVDFormsText.replaceAll(/\s/g, '') == mvdFormsTxt.replaceAll(/\s/g, ''))
    }
    if (uploadMVDForm) {
      let fileUrl = `/MVDAssets/mvd-forms-layouts/spef-layout-${listSettings.guid}.txt`
      await importFile(fileUrl, listSettings.mvdForms[i].arrayBuffer)
      consoleLogPackage(`Se importo MVDForms ${listSettings.mvdForms[i].fileRoot}`, true)
    }
  }

  // views
  let executeQueryAfter = false
  for (let i = 0; i < listSettings.views.length; i++) {
    const viewSettings = listSettings.views[i]

    let oView = null
    const viewsEnumerator = viewsCollection.getEnumerator()
    while (viewsEnumerator.moveNext()) {
      const currentView = viewsEnumerator.get_current()
      const url = currentView.get_serverRelativeUrl()
      let viewURL = viewSettings.Url
      if (_spPageContextInfo.webServerRelativeUrl != '/') {
        viewURL = _spPageContextInfo.webServerRelativeUrl + viewURL
      }
      if (url == viewURL) {
        oView = currentView
        break
      }
    }

    if (viewSettings.Url.endsWith('Form.aspx')) {
      const viewFileRelativeURL = (_spPageContextInfo.webServerRelativeUrl === '/') ? viewSettings.Url : _spPageContextInfo.webServerRelativeUrl + viewSettings.Url
      const oFile = clientContext.get_web().getFileByServerRelativeUrl(viewFileRelativeURL)
      const webPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared)
      viewSettings.WebPartCollection = webPartManager.get_webParts()
      clientContext.load(viewSettings.WebPartCollection, 'Include(Id, WebPart.Properties, WebPart.ZoneIndex, ZoneId)')
      executeQueryAfter = true
      continue
    }// poner un regep que tome new, edit o dispc

    if (!oView) {
      oView = new SP.ViewCreationInformation()
      const splitedUrl = viewSettings.Url.split('/')
      const title = splitedUrl[splitedUrl.length - 1].replace('.aspx', '')
      oView.set_title(title)
      const camlQuery = new SP.CamlQuery()
      camlQuery.set_viewXml(viewSettings.Query)
      oView.set_query(camlQuery)
      oView.set_rowLimit(viewSettings.RowLimit)
      const typeKind = SP.ViewType[viewSettings.Type.toLowerCase()]
      oView.set_viewTypeKind(typeKind)
      viewsCollection.add(oView);
      clientContext.load(viewsCollection);
      await executeQueryPromise(clientContext)
      i--
      consoleLogPackage(`Se creó la vista ${viewSettings.Title} (${viewSettings.Url})`, true)
      continue
    }
    else {
      const oViewFields = oView.get_viewFields()
      const xml = domParser.parseFromString(oView.get_htmlSchemaXml(), 'text/xml')
      let viewSchema = {}
      try {
        viewSchema = convertXmlToObject(xml)
      } catch (error) {
        console.error(error)
        continue
      }

      let viewOldFields = (typeof viewSchema.ViewFields.FieldRef !== 'undefined') ? viewSchema.ViewFields.FieldRef : [];
      if (!Array.isArray(viewOldFields)) viewOldFields = new Array(viewOldFields)
      for (let i = 0; i < viewOldFields.length; i++) {
        const fieldInternalName = viewOldFields[i].Name
        oViewFields.remove(fieldInternalName)
      }
      oView.set_viewQuery(viewSettings.Query)
      oView.update()

      let viewURL = viewSettings.Url
      if (_spPageContextInfo.webServerRelativeUrl != '/') {
        viewURL = _spPageContextInfo.webServerRelativeUrl + viewURL
      }

      const oFile = clientContext.get_web().getFileByServerRelativeUrl(viewURL)
      const webPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared)
      viewSettings.WebPartCollection = webPartManager.get_webParts()
      clientContext.load(viewSettings.WebPartCollection, 'Include(Id, WebPart.Properties, WebPart.ZoneIndex, ZoneId)')
      consoleLogPackage(`Se actualizó la vista ${viewSettings.Title} (${viewSettings.Url})`, true)
      try {
        await executeQueryPromise(clientContext)
      } catch (error) {
        console.error(error)
        return
      }
    }

    const oViewFields = oView.get_viewFields()
    let currentListFieldsInternalNames = currentListFields.map(e => e.Name)
    let existFieldsInList = viewSettings.ViewFields.filter(e => ['Attachments', 'Edit', 'LinkTitle'].includes(e) || currentListFieldsInternalNames.includes(e))
    for (let i = 0; i < existFieldsInList.length; i++) {
      oViewFields.add(existFieldsInList[i])
    }

    oView.set_title(viewSettings.Title)
    oView.update()

    try {
      await executeQueryPromise(clientContext)
    } catch (error) {
      consoleLogPackage(`ERROR -- ${viewSettings.Title} (${viewSettings.Url})`, true)
      console.error(error)
    }
  }
  if (executeQueryAfter) await executeQueryPromise(clientContext)

  // webparts
  for (let i = 0; i < listSettings.views.length; i++) {
    const view = listSettings.views[i]
    for (let j = 0; j < view.WebParts.length; j++) {
      const webPartSettigs = view.WebParts[j]
      let currentWebPartDefinitionInList = null
      if (view.WebPartCollection) {
        const webPartsEnumerator = view.WebPartCollection.getEnumerator()
        while (webPartsEnumerator.moveNext()) {
          const webPartDefinitionInList = webPartsEnumerator.get_current()
          const webPartProperties = webPartDefinitionInList.get_webPart().get_properties().get_fieldValues()
          if (webPartProperties.Title == webPartSettigs.Title) {
            currentWebPartDefinitionInList = webPartDefinitionInList
            break
          }
        }
        if (currentWebPartDefinitionInList) {
          currentWebPartDefinitionInList.deleteWebPart()
          try {
            await executeQueryPromise(clientContext)
          } catch (error) {
            console.error(error)
            return
          }
        }
      }
      let viewURL = view.Url
      if (_spPageContextInfo.webServerRelativeUrl != '/') {
        viewURL = _spPageContextInfo.webServerRelativeUrl + viewURL
      }
      const oFile = clientContext.get_web().getFileByServerRelativeUrl(viewURL)
      const limitedWebPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared)
      const oWebPartDefinition = limitedWebPartManager.importWebPart(webPartSettigs.XML)
      const webPart = oWebPartDefinition.get_webPart()
      limitedWebPartManager.addWebPart(webPart, webPartSettigs.ZoneId, webPartSettigs.ZoneIndex)
      consoleLogPackage(`Se creó el webpart ${webPartSettigs.Title} en ${viewURL}`, true)
      try {
        await executeQueryPromise(clientContext)
      } catch (error) {
        console.error(error)
        return
      }
    }
  }

  return true
}

async function updateListFieldsFromJSON({ clientContext, currentListFields, fieldsCollection, fieldsToUpdate, oList }) {
  let executedExeptionScopes = []
  for (let i = 0; i < fieldsToUpdate.length; i++) {
    const fieldToImport = fieldsToUpdate[i]
    let isDependentLookup = (['Lookup', 'LookupMulti'].includes(fieldToImport.Type) && fieldToImport.ReadOnly)
    if (['Lookup', 'LookupMulti'].includes(fieldToImport.Type)) {
      fieldToImport.List = fieldToImport.ListUrl
      delete fieldToImport.ListUrl
    }
    const fieldToImportPlainXML = await getFieldPlainXML(fieldToImport, currentListFields)
    const fieldInList = currentListFields.find(e => e.Name == fieldToImport.Name)
    let isNewField = typeof fieldInList === 'undefined'
    let hasToUpdate = fieldInList && hasToUpdateField({ fieldToImport, fieldInList })
    if (!hasToUpdate && !isNewField) {
      continue
    }
    let exceptionScope = new SP.ExceptionHandlingScope(clientContext)
    let startScope = exceptionScope.startScope()
    let tryScope = exceptionScope.startTry()
    if (hasToUpdate) {
      const fieldsCollectionEnumerator = fieldsCollection.getEnumerator()
      while (fieldsCollectionEnumerator.moveNext()) {
        const oField = fieldsCollectionEnumerator.get_current()
        const condition = oField.get_internalName() == fieldToImport.Name
        if (condition) {
          oField.set_schemaXml(fieldToImportPlainXML)
          oField.updateAndPushChanges(true)
          break
        }
      }
    } else if (isDependentLookup) {
      const web = clientContext.get_web()
      const lists = web.get_lists()
      const toList = lists.getById(fieldToImport.List)
      let toField = toList.get_fields().getByInternalNameOrTitle(fieldToImport.ShowField);
      let lookupPpalFieldInternalName = currentListFields.find(e => fieldToImport.Name.includes(e.Name + '_') && !e.ReadOnly).Name
      let lookupPpalField = oList.get_fields().getByInternalNameOrTitle(lookupPpalFieldInternalName);
      let dependentLookupField = oList.get_fields().addDependentLookup(fieldToImport.Name, lookupPpalField, toField);
      let dependentLookupFieldCast = clientContext.castTo(dependentLookupField, SP.FieldLookup);
      dependentLookupFieldCast.set_lookupField(fieldToImport.ShowField);
      dependentLookupFieldCast.set_title(fieldToImport.DisplayName)
      dependentLookupFieldCast.update();
      clientContext.load(dependentLookupFieldCast);
    } else {
      const addToDefaultView = false
      fieldsCollection.addFieldAsXml(fieldToImportPlainXML, addToDefaultView, SP.AddFieldOptions.addFieldInternalNameHint)
    }
    tryScope.dispose()
    let catchScope = exceptionScope.startCatch()
    catchScope.dispose()
    startScope.dispose()
    executedExeptionScopes.push({ exceptionScope, fieldToImport, fieldToImportPlainXML, isNewField })
  }
  clientContext.load(oList, 'SchemaXml')
  try {
    await executeQueryPromise(clientContext)
    for (let index = 0; index < executedExeptionScopes.length; index++) {
      const element = executedExeptionScopes[index];
      if (element.exceptionScope.get_hasException()) {
        (element.isNewField) ?
          consoleLogPackage(`ERROR -- No se creó el campo ${element.fieldToImport.DisplayName}. Mensaje: ${element.exceptionScope.get_errorMessage().replace(/\s/g, ' ')}`, true) :
          consoleLogPackage(`ERROR -- No se actualizó el campo ${element.fieldToImport.DisplayName}. Mensaje: ${element.exceptionScope.get_errorMessage().replace(/\s/g, ' ')}`, true)
        console.error({ element })
      } else {
        (element.isNewField) ?
          consoleLogPackage(` Se creó el campo ${element.fieldToImport.DisplayName}`, true) :
          consoleLogPackage(` Se actualizó el campo ${element.fieldToImport.DisplayName}`, true)
      }
    }
  } catch (error) {
    console.error(error)
    throw error
  }

  function hasToUpdateField({ fieldToImport, fieldInList }) {
    let hasToUpdate = false
    for (const keyProp in fieldToImport) {
      if (fieldToImport[keyProp] != fieldInList[keyProp]) {
        hasToUpdate = true
        break
      }
    }
    return hasToUpdate
  }
}

/*-----------------------------------------------------------   Fin listas   -----------------------------------------------------------*/


/*-----------------------------------------------------------   Datos   -----------------------------------------------------------*/

async function prepareItemData({ item, fields }) {
  for (const key in item) {
    const field = fields.find(e => e.internalName == key)
    if (field && field.type.includes('Lookup')) {
      let value = item[key]
      if (value == null || (Array.isArray(value) && !value.length)) continue
      if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
          const element = value[index];
          element.lookupId = await getLookupValueID({ listGUID: field.schema.List, showField: field.schema.ShowField, value: element.lookupValue })
        }
      } else {
        value.lookupId = await getLookupValueID({ listGUID: field.schema.List, showField: field.schema.ShowField, value: value.lookupValue })
      }
    }
    else if (field && field.type === 'Calculated') {
      delete item[key]
    }
  }
}

async function getDataToUpdate({ dataSettings, fields, listGUID, primaryKey }) {
  if (primaryKey === 'newRecord') return []
  const siteUrl = _spPageContextInfo.webServerRelativeUrl
  const primaryKeyField = fields.find(e => e.internalName == primaryKey)
  const viewFields = '<ViewFields>' + dataSettings.viewFields.map(e => `<FieldRef Name="${e.Name}" />`).join('') + '</ViewFields>'
  const camlQuery =
    `<View Scope='Recursive'><Query><Where>
    <In>
    <FieldRef Name="${primaryKeyField.internalName}" />
    <Values>${dataSettings.items.map(e => `<Value Type='${primaryKeyField.type}'>${e[primaryKeyField.internalName]}</Value>`).join('')}</Values>
    </In>
    </Where></Query>${viewFields}</View>`
  const items = await getItems({ camlQuery, listGUID, siteUrl })
  return items
}

async function getLookupValueID({ listGUID, showField, value }) {
  listGUID = listGUID.replace(/[{}]/g, '')
  const fetchUrl = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists(guid'${listGUID}')/items?$filter=${showField}%20eq%20%27${encodeURIComponent(value)}%27&$select=Id`
  const fetchSettings = {
    method: 'GET',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json; odata=verbose'
    }
  }
  const response = await fetch(fetchUrl, fetchSettings)
  const responseJSON = await response.json()

  return (responseJSON?.d.results.length) ? responseJSON.d.results[0].ID : null
}

async function importData(dataSettings) {
  const siteUrl = _spPageContextInfo.webServerRelativeUrl
  const listInfo = await getListInfo({ listUrl: dataSettings.listUrl, siteUrl })
  const listGUID = listInfo.listGUID
  const primaryKey = dataSettings.viewFields.find(e => e.SelectedAsPrimary).Name
  const fields = await getFields({ listGUID, siteUrl })
  let dataToUpdate = await getDataToUpdate({ dataSettings, fields, listGUID, primaryKey })

  for (const item of dataSettings.items) {
    await prepareItemData({ item, fields })
    const existData = dataToUpdate.find(e => e[primaryKey] == item[primaryKey])
    if (existData) {
      try {
        item.ID = existData.ID
        await updateItem({ item, listGUID, siteUrl })
      } catch (error) {
        console.error({ item, listGUID, error })
      }
    } else {
      try {
        await createItem({ item, listGUID, siteUrl })
      } catch (error) {
        console.error({ item, listGUID, error })
      }
    }
  }
}


/*-----------------------------------------------------------   Fin datos   -----------------------------------------------------------*/


/*-----------------------------------------------------------   Permisos   -----------------------------------------------------------*/


const customRolePermissions = [
  {
    "name": "Aprobar",
    "description": "Puede ver, agregar, actualizar, eliminar, y aprobar.",
    "order": 2147483647,
    "basePermissions": ["emptyMask", "viewListItems", "addListItems", "editListItems", "deleteListItems", "approveItems", "openItems", "viewVersions", "deleteVersions", "managePersonalViews", "viewFormPages", "open", "viewPages", "createSSCSite", "browseDirectories", "browseUserInfo", "addDelPrivateWebParts", "updatePersonalWebParts", "useClientIntegration", "useRemoteAPIs", "createAlerts", "editMyUserInfo"],
    "roleTypeKind": 0
  },
  {
    "name": "Asignar permisos",
    "description": "Puede asignar permisos a otros usuario o grupos",
    "order": 2147483647,
    "basePermissions": ["emptyMask", "viewListItems", "openItems", "viewVersions", "open", "viewPages", "managePermissions", "browseDirectories", "browseUserInfo", "enumeratePermissions"],
    "roleTypeKind": 0
  },
  {
    "name": "Crear subsitios",
    "description": "Puede crear substios",
    "order": 2147483647,
    "basePermissions": ["emptyMask", "open", "viewPages", "manageSubwebs", "browseUserInfo"],
    "roleTypeKind": 0
  },
  {
    "name": "Leer y agregar",
    "description": "Puede ver y agregar",
    "order": 2147483647,
    "basePermissions": ["emptyMask", "viewListItems", "addListItems", "openItems", "viewVersions", "viewFormPages", "open", "viewPages", "browseUserInfo", "useClientIntegration", "useRemoteAPIs", "createAlerts"],
    "roleTypeKind": 0
  },
  {
    "name": "Leer - agregar - editar",
    "description": "Puede ver, agregar y editar pero no eliminar",
    "order": 2147483647,
    "basePermissions": ["emptyMask", "viewListItems", "addListItems", "editListItems", "openItems", "viewVersions", "viewFormPages", "open", "viewPages", "browseDirectories", "browseUserInfo", "useClientIntegration", "useRemoteAPIs", "createAlerts", "editMyUserInfo"],
    "roleTypeKind": 0
  }
]

async function createRolePermissions(rolePermissions) {
  const context = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl)
  let exceptionScopes = []
  for (let i = 0; i < rolePermissions.length; i++) {
    let exceptionScope = new SP.ExceptionHandlingScope(context)
    let startScope = exceptionScope.startScope()
    let tryScope = exceptionScope.startTry()
    let rolePermissionSettings = rolePermissions[i]
    let roleDefinitionCreationInfo = new SP.RoleDefinitionCreationInformation()
    roleDefinitionCreationInfo.set_name(rolePermissionSettings.name)
    roleDefinitionCreationInfo.set_description(rolePermissionSettings.description)
    roleDefinitionCreationInfo.set_order(rolePermissionSettings.order)
    var permissions = new SP.BasePermissions();
    rolePermissionSettings.basePermissions.forEach(e => permissions.set(SP.PermissionKind[e]))
    roleDefinitionCreationInfo.set_basePermissions(permissions)
    context.get_site().get_rootWeb().get_roleDefinitions().add(roleDefinitionCreationInfo);
    tryScope.dispose()
    let catchScope = exceptionScope.startCatch()
    catchScope.dispose()
    startScope.dispose()
    exceptionScopes.push({ exceptionScope, rolePermissionSettings })
  }
  try {
    await executeQueryPromise(context)
    console.log('roles permission creados')
    exceptionScopes.forEach(({ exceptionScope, rolePermissionSettings }) => {
      if (exceptionScope.get_hasException()) {
        console.log(`ERROR --${rolePermissionSettings.name} - ${exceptionScope.get_errorMessage().replace(/\s/g, ' ')}`, { exceptionScope })
      }
    })
  } catch (error) {
    console.error(error)
  }

}

/*-----------------------------------------------------------   Fin permisos   -----------------------------------------------------------*/


/*-----------------------------------------------------------   API   -----------------------------------------------------------*/

async function getListSettings(guid) {
  const spListModel = await loadSPListProperties(guid, true)
  spListModel.relatedLists = []
  spListModel.relatedListsLookup = []
  const spList = spListFactory(guid, -1)
  spList.setModel(spListModel)
  const listJSON = spList.getJSON()
  return listJSON
}

async function importListFromSettings(listSettings) {
  listSettings.mvdForms.forEach(function (mvdFormsData) {
    const byteArray = new TextEncoder().encode(mvdFormsData.text);
    mvdFormsData.arrayBuffer = byteArray.buffer;
  })
  await importList(listSettings)
}

/*-----------------------------------------------------------   Fin API   -----------------------------------------------------------*/


function applyComparedCurrentSiteWithServerPackages() {
  currentSitePackages.forEach(function (sitePackage) {
    const serverPackage = serverPackages.find(e => e.name == sitePackage.name)
    if (serverPackage) {
      sitePackage.versionToBeUpdated = serverPackage.versions[0].version
    } else {
      sitePackage.notFoundInServer = true
    }
  })
  const currentSitePackageNames = currentSitePackages.map(e => e.name)

  const serverPackagesToInstallInCurrentSite = serverPackages.filter(e => !currentSitePackageNames.includes(e.name))
  serverPackagesToInstallInCurrentSite.forEach(function (serverPackage) {
    currentSitePackages.push({
      currentVersion: null,
      name: serverPackage.name,
      serverPackageId: serverPackage.id,
      versions: serverPackage.versions,
      versionToBeUpdated: serverPackage.versions[0].version
    })
  })
  refreshCurrentSitePackagesTableHTML()
}


export { consoleLogPackage, getListSettings, importListFromSettings, mvdInitializeModule }