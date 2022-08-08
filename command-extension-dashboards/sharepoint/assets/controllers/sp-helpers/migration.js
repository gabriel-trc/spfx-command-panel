import { consoleLogPackage } from '../MVD.Updater/updater.js'

export default async function createRolePermissions() {
  let rolePermissions = [/*{
    "name": "Cambiar páginas",
    "description": "",
    "order": 2147483647,
    "basePermissions": ["emptyMask", "viewListItems", "open", "viewPages", "addAndCustomizePages", "browseDirectories"],
    "roleTypeKind": 0
  },*/
    {
      "name": "Crear subsitios",
      "description": "",
      "order": 2147483647,
      "basePermissions": ["emptyMask", "open", "viewPages", "manageSubwebs", "browseUserInfo"],
      "roleTypeKind": 0
    },
    {
      "name": "Leer - agregar - editar",
      "description": "No puede eliminar",
      "order": 2147483647,
      "basePermissions": ["emptyMask", "viewListItems", "addListItems", "editListItems", "openItems", "viewVersions", "viewFormPages", "open", "viewPages", "browseDirectories", "browseUserInfo", "useClientIntegration", "useRemoteAPIs", "createAlerts", "editMyUserInfo"],
      "roleTypeKind": 0
    },
    {
      "name": "Leer y agregar",
      "description": "",
      "order": 2147483647,
      "basePermissions": ["emptyMask", "viewListItems", "addListItems", "openItems", "viewVersions", "viewFormPages", "open", "viewPages", "browseUserInfo", "useClientIntegration", "useRemoteAPIs", "createAlerts"],
      "roleTypeKind": 0
    },
    {
      "name": "Aprobar",
      "description": "Puede ver, agregar, actualizar, eliminar, y aprobar.",
      "order": 2147483647,
      "basePermissions": ["emptyMask", "viewListItems", "addListItems", "editListItems", "deleteListItems", "approveItems", "openItems", "viewVersions", "deleteVersions", "managePersonalViews", "viewFormPages", "open", "viewPages", "createSSCSite", "browseDirectories", "browseUserInfo", "addDelPrivateWebParts", "updatePersonalWebParts", "useClientIntegration", "useRemoteAPIs", "createAlerts", "editMyUserInfo"],
      "roleTypeKind": 0
    },
    {
      "name": "Asignar Permisos",
      "description": "",
      "order": 2147483647,
      "basePermissions": ["emptyMask", "viewListItems", "openItems", "viewVersions", "open", "viewPages", "managePermissions", "browseDirectories", "browseUserInfo", "enumeratePermissions"],
      "roleTypeKind": 0
    }
  ]

  const context = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl)
  for (let i = 0; i < rolePermissions.length; i++) {
    let rolePermissionSettings = rolePermissions[i]
    let roleDefinitionCreationInfo = new SP.RoleDefinitionCreationInformation()
    roleDefinitionCreationInfo.set_name(rolePermissionSettings.name)
    roleDefinitionCreationInfo.set_description(rolePermissionSettings.description)
    roleDefinitionCreationInfo.set_order(rolePermissionSettings.order)
    var permissions = new SP.BasePermissions();
    rolePermissionSettings.basePermissions.forEach(e => permissions.set(SP.PermissionKind[e]))
    roleDefinitionCreationInfo.set_basePermissions(permissions)
    context.get_site().get_rootWeb().get_roleDefinitions().add(roleDefinitionCreationInfo);
    consoleLogPackage('Se creó el rol ' + rolePermissionSettings.name, true)
  }

  try {
    await executeQueryPromise(context)
    console.log('roles permission creados')
  } catch (error) {
    console.error(error)
  }

  return true
}

async function executeQueryPromise(clientContext) {
  return new Promise((resolve, reject) => {
    clientContext.executeQueryAsync(
      function () { resolve() },
      function (sender, args) { reject(args) }
    )
  })
}