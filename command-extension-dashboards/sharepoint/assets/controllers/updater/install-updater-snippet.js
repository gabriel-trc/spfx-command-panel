//TODO
// - Menú rápido, sacar los recientes y setear los nuevos
// - Borrar la caracteristica de estrategia minima de descarga


// - Borrar la caracteristica de estrategia minima de descarga
// No encontré opción para obtener los nombres de las características, el GUID lo saqué del botón Desactivar dentro del HTML.
// Se me ocurre que se puede ir a buscar la página /_layouts/15/ManageFeatures.aspx y parsear el contenido a HTML para buscando el texto dar con la row de la característica.
// async function deleteFeature(featureGUID) {
//     const requestDigest = document.getElementById('__REQUESTDIGEST').value;
//     const fetchSettings = {
//         method: 'POST',
//         credentials: 'same-origin',
//         headers: {
//             accept: 'application/json; odata=verbose',
//             'X-RequestDigest': requestDigest
//         },
//     }
//     const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/features/remove('${featureGUID}')`
//     const response = await fetch(urlToFetch, fetchSettings)
// }

(async function () {
    // Caracteres no válidos apra nombres de los roles: " / \ [ ] : | < > + = ; , ? * '
    const rolePermissions = [
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
    const customActions = [{
        "description": "Script de iniciación del loader de MVD. Contiene un objeto con las claves y rutas de nuestros scripts.",
        "domain": "site",
        "location": "ScriptLink",
        "scriptSrc": "/MVDAssets/updater/loader-versions-manifest-custom-action.js?ts=1630409377749",
        "sequence": 1,
        "name": "Loader versions"
    },
    {
        "description": "Funciones necesarias para la carga de los archivos.",
        "domain": "site",
        "location": "ScriptLink",
        "scriptSrc": "/MVDAssets/updater/loader-custom-action.js?ts=1626196070211",
        "sequence": 2,
        "name": "MVD loader"
    },
    {
        "description": "Código JavaScript para insertar el css en el head",
        "domain": "site",
        "location": "ScriptLink",
        "scriptSrc": "/MVDAssets/sp-helpers/common.css",
        "sequence": 3,
        "name": "Common CSS"
    }]
    const requestDigest = document.getElementById('__REQUESTDIGEST').value;
    const mvdAssets = {
        "belongsToPackage": true,
        "fields": [
            {
                "DisplayName": "Título",
                "Name": "Title",
                "StaticName": "Title",
                "Type": "Text"
            }
        ],
        "permissions": [],
        "relatedLists": [],
        "listUrl": "/MVDAssets",
        "relatedListsLookup": [],
        "schemaProperties": {
            "description": "",
            "enableVersioning": "False",
            "majorVersionLimit": "0",
            "serverTemplate": "101",
            "title": "MVDAssets"
        },
        "views": [
            {
                "DefaultView": "TRUE",
                "Type": "HTML",
                "Url": "/MVDAssets/Forms/AllItems.aspx",
                "BaseViewID": "1",
                "RowLimit": "30",
                "ViewFields": [
                    "DocIcon",
                    "LinkFilename",
                    "Modified",
                    "Editor"
                ],
                "Query": "<OrderBy><FieldRef Name=\"FileLeafRef\" /></OrderBy>",
                "Title": "Todos los documentos",
                "WebParts": []
            }
        ]
    }
    const mvdUpdater = {
        "belongsToPackage": true,
        "fields": [
            {
                "DisplayName": "Título",
                "Name": "Title",
                "StaticName": "Title",
                "Required": "TRUE",
                "Type": "Text",
                "MaxLength": "255"
            },
            {
                "DisplayName": "Version",
                "EnforceUniqueValues": "FALSE",
                "Indexed": "FALSE",
                "Name": "Version",
                "StaticName": "Version",
                "Required": "FALSE",
                "Type": "Number",
                "Decimals": "2",
                "Min": "0"
            },
            {
                "DisplayName": "Log",
                "EnforceUniqueValues": "FALSE",
                "Indexed": "FALSE",
                "Name": "Log",
                "StaticName": "Log",
                "Required": "FALSE",
                "Type": "Note",
                "NumLines": "6",
                "RichText": "FALSE"
            }
        ],
        "permissions": [],
        "relatedLists": [],
        "listUrl": "/Lists/MVDUpdater",
        "relatedListsLookup": [],
        "schemaProperties": {
            "description": "",
            "enableVersioning": "False",
            "majorVersionLimit": "0",
            "serverTemplate": "100",
            "title": "MVDUpdater"
        },
        "views": [
            {
                "DefaultView": "TRUE",
                "Type": "HTML",
                "Url": "/Lists/MVDUpdater/AllItems.aspx",
                "BaseViewID": "1",
                "ViewFields": [
                    "LinkTitle",
                    "ID",
                    "Version",
                    "Log"
                ],
                "ViewData": {},
                "Query": "<OrderBy><FieldRef Name=\"ID\" /></OrderBy>",
                "Aggregations": {
                    "Value": "Off"
                },
                "RowLimit": "30",
                "Title": "Todos los elementos",
                "WebParts": []
            },
            {
                "Type": "HTML",
                "Url": "/Lists/MVDUpdater/Index.aspx",
                "BaseViewID": "1",
                "Query": "<Where><Eq><FieldRef Name=\"ID\" /><Value Type=\"Counter\">0</Value></Eq></Where>",
                "RowLimit": "30",
                "ViewFields": [
                    "LinkTitle"
                ],
                "Title": "Index",
                "WebParts": [
                    {
                        "Title": "Editor de secuencias de comandos",
                        "ZoneIndex": 0,
                        "ZoneId": "Main",
                        "XML": "<webParts>\r\n  <webPart xmlns=\"http://schemas.microsoft.com/WebPart/v3\">\r\n    <metaData>\r\n      <type name=\"Microsoft.SharePoint.WebPartPages.ScriptEditorWebPart, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c\" />\r\n      <importErrorMessage>No se puede importar este elemento web.</importErrorMessage>\r\n    </metaData>\r\n    <data>\r\n      <properties>\r\n        <property name=\"ExportMode\" type=\"exportmode\">All</property>\r\n        <property name=\"HelpUrl\" type=\"string\" />\r\n        <property name=\"Hidden\" type=\"bool\">False</property>\r\n        <property name=\"Description\" type=\"string\">Permite a los autores insertar fragmentos de HTML o secuencias de comandos.</property>\r\n        <property name=\"Content\" type=\"string\">&lt;script&gt;\r\nMVD.importScripts(['updater/index', 'sp-helpers/utilities'])\r\n&lt;/script&gt;</property>\r\n        <property name=\"CatalogIconImageUrl\" type=\"string\" />\r\n        <property name=\"Title\" type=\"string\">Editor de secuencias de comandos</property>\r\n        <property name=\"AllowHide\" type=\"bool\">True</property>\r\n        <property name=\"AllowMinimize\" type=\"bool\">True</property>\r\n        <property name=\"AllowZoneChange\" type=\"bool\">True</property>\r\n        <property name=\"TitleUrl\" type=\"string\" />\r\n        <property name=\"ChromeType\" type=\"chrometype\">None</property>\r\n        <property name=\"AllowConnect\" type=\"bool\">True</property>\r\n        <property name=\"Width\" type=\"unit\" />\r\n        <property name=\"Height\" type=\"unit\" />\r\n        <property name=\"HelpMode\" type=\"helpmode\">Navigate</property>\r\n        <property name=\"AllowEdit\" type=\"bool\">True</property>\r\n        <property name=\"TitleIconImageUrl\" type=\"string\" />\r\n        <property name=\"Direction\" type=\"direction\">NotSet</property>\r\n        <property name=\"AllowClose\" type=\"bool\">True</property>\r\n        <property name=\"ChromeState\" type=\"chromestate\">Normal</property>\r\n      </properties>\r\n    </data>\r\n  </webPart>\r\n</webParts>"
                    }
                ]
            }
        ],
        "mvdForms": []
    }

    await setOsloAsMasterPage()
    await createRolePermissions(rolePermissions)
    await createList(mvdAssets)
    mvdUpdater.guid = await createList(mvdUpdater)
    await updateListFromJSON(mvdUpdater)

    for (let index = 0; index < customActions.length; index++) {
        const customAction = customActions[index];
        await addCustomActionREST({ ...customAction }, requestDigest)
    }
    console.log('Finalizó la importación del módulo updater')
})()



async function setOsloAsMasterPage() {
    let clientContext = SP.ClientContext.get_current();
    let web = clientContext.get_web();
    let masterPageUrl = ((_spPageContextInfo.webServerRelativeUrl !== '/') ? _spPageContextInfo.webServerRelativeUrl : '') + '/_catalogs/masterpage/oslo.master'
    web.set_masterUrl(masterPageUrl);
    web.set_customMasterUrl(masterPageUrl);
    web.update();
    clientContext.load(web);
    await executeQueryPromise(clientContext)

    // to force in subsites
    //     foreach(Web child in web.Webs) {
    //     child.AllProperties["__InheritsCustomMasterUrl"] = true;
    //     child.AllProperties["__InheritsMasterUrl"] = true;
    //     child.Update();
    // }
}

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

    if (scriptSrc.endsWith('.css')) {
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


    const fetchSettings = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            accept: 'application/json; odata=verbose',
            'content-type': 'application/json; odata=verbose',
            'content-length': body.length,
            'X-RequestDigest': requestDigest
        },
        body: JSON.stringify(body)
    }

    const urlToFetch = `${_spPageContextInfo.siteAbsoluteUrl}/_api/${domain}/UserCustomActions`
    const response = await fetch(urlToFetch, fetchSettings)
    return response
}
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
function convertXmlToObject(xml) {
    let object = {}
    let isRoot = false
    //  Objeto "raiz"
    if (xml.nodeType == 1) { // Objeto
        // Se recuperan sus atributos
        if (xml.attributes.length > 0) {
            for (let j = 0; j < xml.attributes.length; j++) {
                const atributo = xml.attributes.item(j)
                object[atributo.nodeName] = atributo.nodeValue
            }
        }
    } else if (xml.nodeType == 3) { // Texto
        object = xml.nodeValue
    } else if (xml.nodeType == 9) { // Elemento raiz
        isRoot = true
    }
    // Atributos del object (objects hijos)
    if (xml.hasChildNodes()) {
        for (let i = 0; i < xml.childNodes.length; i++) {
            const item = xml.childNodes.item(i)
            const nombreNodo = item.nodeName

            // Si object no tiene un atributo con el nombre nombreNodo se anade, si ya lo tiene (es un array) se anade
            // a la lista del object con nombre nombreNodo
            if (typeof (object[nombreNodo]) === 'undefined') {
                // Si el elemento es un CDATA se copia el contenido en el elemento y no se crea un
                // hijo para almacenar el texto
                if (nombreNodo == '#cdata-section') {
                    object = item.nodeValue
                } else if (nombreNodo == '#text') { // Si el elemento es un texto no se crea el object #text
                    if (item.childNodes.length < 1) {
                        object = item.nodeValue
                    } else {
                        object[nombreNodo] = convertXmlToObject(item)
                    }
                } else {
                    if (isRoot) {
                        object = convertXmlToObject(item)
                    } else {
                        object[nombreNodo] = convertXmlToObject(item)
                    }
                }
            } else {
                // Si el atributo no es una lista se convierte el atributo en un array y se anade el
                // valor a dicho array
                if (typeof (object[nombreNodo].push) === 'undefined') {
                    const valorAtributo = object[nombreNodo]
                    object[nombreNodo] = new Array()
                    object[nombreNodo].push(valorAtributo)
                }

                object[nombreNodo].push(convertXmlToObject(item))
            }
        }
    }
    return object
}
async function executeQueryPromise(clientContext) {
    return new Promise((resolve, reject) => {
        clientContext.executeQueryAsync(
            function () { resolve() },
            function (sender, args) { reject(args) }
        )
    })
}
async function getFieldPlainXML(fieldSchemaResumed, currentListFields) {
    let fieldPlainXML = '<Field'
    for (const keySchema in fieldSchemaResumed) {
        if (['Default', 'Customization', 'CHOICES', 'FieldRefs', 'Formula', 'FormulaDisplayNames'].includes(keySchema)) continue
        if (['Lookup', 'LookupMulti'].includes(fieldSchemaResumed.Type) && keySchema === 'ListUrl') {
            let listInfo = await getListInfo({ listUrl: fieldSchemaResumed[keySchema], siteUrl: _spPageContextInfo.webServerRelativeUrl })
            fieldSchemaResumed[keySchema] = `{${listInfo.listGUID}}`
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
                    let listInfo = await getListInfo({ listUrl: saveManagerPropValue.listUrl, siteUrl: _spPageContextInfo.webServerRelativeUrl })
                    saveManagerPropValue.listGUID = listInfo.listGUID
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
async function getListInfo({ listGUID, listUrl, siteUrl }) {
    const selectQuery = '?$select=BaseType,Id,Title,RootFolder/ServerRelativeUrl&$expand=RootFolder'
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
            listGUID: responseJSON.d.Id,
            listUrl: listUrl,
            title: responseJSON.d.Title,
            isLibrary: (responseJSON.d.BaseType == 1)
        }
    } else {
        throw responseJSON.error.message.value
    }
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
                console.log(`ERROR -- Al cortar herencia de permisos. Mensaje: ${exceptionScope.get_errorMessage().replace(/\s/g, ' ')}`, true)
                console.error({ exceptionScope })
            } else {
                console.log('Se corta herencia de permisos', true)
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
                    console.log(`ERROR -- No se importo los permisos del grupo ${element.userPermissions.login}. Mensaje: ${element.exceptionScope.get_errorMessage().replace(/\s/g, ' ')}`, true)
                    console.error({ element })
                } else {
                    console.log(`Se importo los permisos del grupo ${element.userPermissions.login}`, true)
                }
            }
        } catch (error) {
            console.error(error)
            return
        }
    }

    // mvdForms
    for (let i = 0; i < listSettings.mvdForms.length; i++) {
        const fileUrl = `/SiteAssets/spef-layout-${listSettings.guid}.txt`
        let uploadMVDForm = true
        const responseMVDForm = await fetch(fileUrl)
        if (responseMVDForm.status == 200) {
            const responseText = await responseMVDForm.text()
            const decoder = new TextDecoder();
            const mvdFormsTxt = decoder.decode(listSettings.mvdForms[i].arrayBuffer)
            if (responseText.replaceAll(/\s/g, '') == mvdFormsTxt.replaceAll(/\s/g, '')) uploadMVDForm = false
        }
        if (uploadMVDForm) {
            await importFile(fileUrl, listSettings.mvdForms[i].arrayBuffer)
            console.log(`Se importo MVDForms ${listSettings.mvdForms[i].fileRoot}`, true)
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
            console.log(`Se creó la vista ${viewSettings.Title} (${viewSettings.Url})`, true)
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
            console.log(`Se actualizó la vista ${viewSettings.Title} (${viewSettings.Url})`, true)
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
            console.log(`ERROR -- ${viewSettings.Title} (${viewSettings.Url})`, true)
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
            console.log(`Se creó el webpart ${webPartSettigs.Title} en ${viewURL}`, true)
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
        let exceptionScope = new SP.ExceptionHandlingScope(clientContext)
        let startScope = exceptionScope.startScope()
        let tryScope = exceptionScope.startTry()
        let isNewField = true
        let isDependentLookup = (['Lookup', 'LookupMulti'].includes(fieldToImport.Type) && fieldToImport.ReadOnly)
        if (['Lookup', 'LookupMulti'].includes(fieldToImport.Type)) {
            fieldToImport.List = fieldToImport.ListUrl
            delete fieldToImport.ListUrl
        }
        const fieldToImportPlainXML = await getFieldPlainXML(fieldToImport, currentListFields)
        const fieldInList = currentListFields.find(e => e.Name == fieldToImport.Name)
        if (fieldInList) {
            let hasToUpdate = false
            for (const keyProp in fieldToImport) {
                if (fieldToImport[keyProp] != fieldInList[keyProp]) {
                    hasToUpdate = true
                    break
                }
            }
            if (hasToUpdate) {
                const fieldsCollectionEnumerator = fieldsCollection.getEnumerator()
                while (fieldsCollectionEnumerator.moveNext()) {
                    const oField = fieldsCollectionEnumerator.get_current()
                    const condition = oField.get_internalName() == fieldToImport.Name
                    if (condition) {
                        oField.set_schemaXml(fieldToImportPlainXML)
                        oField.updateAndPushChanges(true)
                        isNewField = false
                        break
                    }
                }
            }
        } else {
            if (isDependentLookup) {
                const web = clientContext.get_web()
                const lists = web.get_lists()
                const toList = lists.getById(fieldToImport.List)
                let toField = toList.get_fields().getByInternalNameOrTitle(fieldToImport.ShowField);
                let lookupPpalFieldInternalName = currentListFields.find(e => fieldToImport.Name.includes(e.Name + '_') && !e.ReadOnly).Name
                let lookupPpalField = oList.get_fields().getByInternalNameOrTitle(lookupPpalFieldInternalName);
                var dependentLookupField = oList.get_fields().addDependentLookup(fieldToImport.Name, lookupPpalField, toField);
                var dependentLookupFieldCast = clientContext.castTo(dependentLookupField, SP.FieldLookup);
                dependentLookupFieldCast.set_lookupField(fieldToImport.ShowField);
                dependentLookupFieldCast.set_title(fieldToImport.DisplayName)
                dependentLookupFieldCast.update();
                clientContext.load(dependentLookupFieldCast);
            } else {
                const addToDefaultView = false
                fieldsCollection.addFieldAsXml(fieldToImportPlainXML, addToDefaultView, SP.AddFieldOptions.addFieldInternalNameHint)
            }
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
                    console.log(`ERROR -- No se creó el campo ${element.fieldToImport.DisplayName}. Mensaje: ${element.exceptionScope.get_errorMessage().replace(/\s/g, ' ')}`, true) :
                    console.log(`ERROR -- No se actualizó el campo ${element.fieldToImport.DisplayName}. Mensaje: ${element.exceptionScope.get_errorMessage().replace(/\s/g, ' ')}`, true)
                console.error({ element })
            } else {
                (element.isNewField) ?
                    console.log(` Se creó el campo ${element.fieldToImport.DisplayName}`, true) :
                    console.log(` Se actualizó el campo ${element.fieldToImport.DisplayName}`, true)
            }
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}