
let executeQueryPromise
let exceptionHandler
let showConfirmDialog, showToast

const ACTIVE_DIRECTORY_LIST_URL = '/Lists/MVDCheckADGroups';


async function mvdInitializeModule() {
    let modules = await MVD.importScripts(['sp-helpers/common', 'sp-helpers/exeptions', 'syncfusion/19.2/utilities']);
    ({ executeQueryPromise } = modules[0]);
    ({ exceptionHandler } = modules[1]);
    ({ showConfirmDialog, showToast } = modules[2]);
}



//No se esta usando
/*
MVD.SPHelpers.ActiveDirectory.CurrentUserMemberOfADGroup = function (ADGroupUser, OnComplete, OnFailure, recursive) {

    return new Promise(function (resolve, reject) {
        let currentContext = new SP.ClientContext.get_current();
        let groupId = ADGroupUser.EntityData.SPUserID;
        let query = "";
        query += "<View>";
        query += "<Query>";
        query += "<Where><Eq>";
        query += "<FieldRef Name='GroupId' />";
        query += "<Value Type='Number'>" + groupId + "</Value>";
        query += "</Eq>";
        query += "</Where>";
        query += "</Query>";
        query += "<ViewFields>";
        query += "<FieldRef Name='Title' />";
        query += "</ViewFields>";
        query += "</View>";

        MVD.SPHelpers.ListItems.getListItems('/', ACTIVE_DIRECTORY_LIST_URL, query,
            function (items) {
                let totalItems = items.get_count();
                if (totalItems == 0) {
                    createNewGroupRows(ADGroupUser, currentContext, function (isUserMember) {
                        if (OnComplete) {
                            OnComplete(isUserMember);
                        }
                        resolve(isUserMember);
                    }, function (args) {
                        if (OnFailure) {
                            OnFailure(args);
                        }
                        reject(args)
                    });
                } else if (totalItems == 1) {
                    let enumerator = items.getEnumerator();
                    enumerator.moveNext();
                    let item = enumerator.get_current();
                    if (item.get_item('Title') !== "Everyone") {
                        console.error('Inconsistent info in MVDCheckADGroups');
                        if (OnFailure) {
                            OnFailure('Inconsistent info in MVDCheckADGroups');
                        }
                        reject('Inconsistent info in MVDCheckADGroups');
                    } else {
                        if (OnComplete) {
                            OnComplete(false);
                        }
                        resolve(false);
                    }
                } else if (totalItems == 2) {
                    let isGroup = false;
                    let isEveryone = false;
                    let enumerator = items.getEnumerator();
                    while (enumerator.moveNext()) {
                        let spListItem = enumerator.get_current();
                        if (spListItem.get_item('Title') == "Group") {
                            isGroup = true;
                        }
                        if (spListItem.get_item('Title') == "Everyone") {
                            isEveryone = true;
                        }
                    }
                    if (isGroup == true && isEveryone == true) {
                        return OnComplete(true);
                    } else {
                        console.error('Inconsistent info in MVDCheckADGroups');
                        if (OnFailure) {
                            OnFailure('Inconsistent info in MVDCheckADGroups');
                        }
                        reject('Inconsistent info in MVDCheckADGroups');
                    }
                }
            }
        );
    });

    function createNewGroupRows(ADGroupUser, currentContext, creationOK) {
        let groupId = ADGroupUser.EntityData.SPUserID;
        let list = currentContext.get_web().get_lists().getByTitle('MVDCheckADGroups');
        let itemCreateInfo = new SP.ListItemCreationInformation();
        listItem = list.addItem(itemCreateInfo);

        listItem.set_item('GroupId', groupId);
        listItem.set_item('Title', 'Group');

        listItem.update();
        let collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(currentContext);
        listItem.breakRoleInheritance(false);
        collRoleDefinitionBinding.add(currentContext.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator));
        let SPuser = currentContext.get_web().get_siteUsers().getById(ADGroupUser.EntityData.SPUserID);
        let web = currentContext.get_web();
        let currentUser = web.get_currentUser();
        listItem.get_roleAssignments().getByPrincipal(currentUser).deleteObject();
        listItem.get_roleAssignments().add(SPuser, collRoleDefinitionBinding);

        let itemCreateInfo2 = new SP.ListItemCreationInformation();
        listItem2 = list.addItem(itemCreateInfo2);

        listItem2.set_item('GroupId', groupId);
        listItem2.set_item('Title', 'Everyone');

        listItem2.update();

        currentContext.executeQueryAsync(function () {
            MVD.SPHelpers.ActiveDirectory.SecondTime(currentContext, groupId, function (isValid) {
                return creationOK(isValid);
            });
        }, function (sender, args) {
            console.error('Error en UserHasNeverAcceded. ' + args.get_message() + '\n' + args.get_stackTrace());
            return creationOK(false);
        });
    }
}
*/

//No se esta usando
/*
MVD.SPHelpers.ActiveDirectory.GetGroupId = function (clientContext, group, Callback) {

    clientContext.load(group, 'id');

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));

    function onQuerySucceeded() {

        return Callback(group.get_id());
    }

    function onQueryFailed(sender, args) {

        return Callback(-1);
    }
}
*/

//group es de from domino\nombregrupo ej. testvm2\prugrupo
MVD.SPHelpers.ActiveDirectory.CurrentUsersOfGroup = function (group, userListCallback) {
    return new Promise(function (resolve, reject) {
        let url = '/_layouts/MVD.SPHelpers.Solution/MVD.ActiveDirectoryHandler.ashx?comando=ListMembers&group=' + escape(group);

        let req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function () {
            if (req.status == 200) {
                try {
                    let ret = JSON.parse(req.response);
                    if (userListCallback) {
                        userListCallback(ret);
                    }
                    resolve(ret);
                } catch (e) {
                    reject(e);
                }
            }
            else {
                reject(Error(req.statusText));
            }
        };

        req.onerror = function () {
            reject(Error("Network Error"));
        };

        req.send();
    });
}


//Actualiza usersCol que debe ser un array de ids numéricos de SPUser. Si ya existe el id no lo agrega.
//usersToConcat puede ser un id numérico de SPUser, un SPUser, array de SPUsers (tal cual se obtiene de un item.get_item('fieldPersonas'), array de ids numéricos de SPUsers, o un objeto devuelto por MVD.SPHelpers.Fields.getFieldValueByInternalName  
//concatSPUsers
function concatSPUsers(usersToConcat, usersCol) {
    if (Array.isArray(usersToConcat)) {
        usersToConcat.forEach(function (element) {
            processElement(element);
        });
    } else {
        processElement(usersToConcat);
    }

    function processElement(u) {
        if (u.get_lookupId) {
            if (usersCol.indexOf(u.get_lookupId()) == -1) {
                usersCol.push(u.get_lookupId());
            }
        } else if (u.values) {
            u.values.forEach(function (v) {
                let spUserId = Number(v.EntityData.SPUserID);
                if (usersCol.indexOf(spUserId) == -1) {
                    usersCol.push(spUserId);
                }
            });
        } else if (typeof u == 'number' && usersCol.indexOf(u) == -1) {
            usersCol.push(u);
        } else {
            throw 'usersToContact has an invalid value';
        }
    }
}

//Recibe usersCol que es un array o un único valor de los siguientes tipos: valor de un campo persona (MVD.SPHelpers.Fields.getFieldValueByInternalName, objecto con propiedad values), SPFieldUserValue o array de SPFieldUserValue (tal cual se obtiene de un item.get_item('fieldPersonas')) o un id numérico de usuario 
//Devuelve una promise que resuelve con un objeto con las siguientes propiedades { distinctUsers, detail  }. 
//distinctUsers es la lista de usuarios después de expandir los grupos de Sharepoint y los grupos Active Directory si se indica en expandADGroups.
//detail es una array con un elemento por objeto,número, lookup recibido en usersCol que indica los datos, el tipo y los usuarios miembros si es un grupo.
//
//Si recibe distinctUsers no repite usuarios ya existentes. Sirve para llamar varias veces y terminar con un distinct final. Si no lo recibe lo crea como []
//Si no recibe context toma el get_current
//Si expandADGroups==true expande los grupos AD en distinctUsers y carga ADGroupUsers en la info de detail
//Si se quiere usar con callbacks en vez de promise se pasa el parámetro callback que se llama al finalizar, idem callbackfailure cuando hay un problema
//Para que pueda expandir grupos AD se tiene que instalar /_layouts/MVD.SPHelpers.Solution/MVD.ActiveDirectoryHandler.ashx que es parte de MVD.SPHelpers.Solution.wsp

MVD.SPHelpers.ActiveDirectory.GetExpandedUsers = function (usersCol, distinctUsers, expandADGroups, context, callback, callbackFailure) {
    return new Promise(function (resolve, reject) {
        if (!distinctUsers) {
            distinctUsers = [];
        }
        if (!usersCol || usersCol.length === 0) {
            resolve({ detail: [], distinctUsers: distinctUsers });
            return;
        }
        if (!context) {
            context = new SP.ClientContext.get_current();
        }
        if (expandADGroups === undefined) {
            expandADGroups = true;
        }
        if (!Array.isArray(usersCol)) {
            concatSPUsers(usersCol, distinctUsers);
            usersCol = distinctUsers;
        }

        let siteUsers = context.get_web().get_siteUsers();
        let collGroup = context.get_web().get_siteGroups();
        let detail = [];
        usersCol.forEach(function (user) {
            let id;
            let auxUsers = [];
            concatSPUsers(user, auxUsers); //uso esto por si en usersCol llegan arrays como elementos (por ejemplo si es un array con valores de varios campo de tipo persona múltiple)
            auxUsers.forEach(function (id) {
                if (detail.filter(function (d) { return d.id === id }).length === 0) {
                    let exceptionScope = new SP.ExceptionHandlingScope(context);
                    let startScope = exceptionScope.startScope();
                    let tryScope = exceptionScope.startTry();
                    let user;
                    user = siteUsers.getById(id);
                    context.load(user);

                    tryScope.dispose();
                    let catchScope = exceptionScope.startCatch();
                    catchScope.dispose();
                    startScope.dispose();

                    let exceptionScope2 = new SP.ExceptionHandlingScope(context);
                    let startScope2 = exceptionScope2.startScope();
                    let tryScope2 = exceptionScope2.startTry();
                    let group;
                    group = collGroup.getById(id);
                    context.load(group);
                    let collUser = group.get_users();
                    context.load(collUser);
                    tryScope2.dispose();
                    let catchScope2 = exceptionScope2.startCatch();
                    catchScope2.dispose();
                    startScope2.dispose();
                    detail.push({ id: id, SPUser: user, SPGroup: group, SPGroupUsersColl: collUser, exUsu: exceptionScope, exGroup: exceptionScope2 });
                }
            });
        });
        context.executeQueryAsync(processInfo, function (args) {
            if (callbackFailure) {
                callbackFailure('Error getting principal info');
            }
            reject(Error('Error getting principal info'));
            console.error('Error getting principal info', args);
        });

        function processInfo() {
            let adGroupsToExpand = [];
            detail.forEach(function (principal) {
                try {
                    try {
                        principal.title = principal.SPUser.get_title();
                        principal.login = principal.SPUser.get_loginName();
                        principal.email = principal.SPUser.get_email();
                        principal.principalType = getPrincipalTypeDesc(principal.SPUser.get_principalType());
                        if (principal.principalType === 'SecurityGroup' || principal.principalType === 'DistributionList') {
                            if (expandADGroups && !MVD.SPHelpers.ActiveDirectory.FindUserById(principal.id, adGroupsToExpand)) {
                                adGroupsToExpand.push(principal);
                            }
                        } else if (!MVD.SPHelpers.ActiveDirectory.FindUserById(principal.id, distinctUsers)) {
                            distinctUsers.push(principal);
                        }
                        delete principal.SPGroup;
                        delete principal.SPGroupUsers;
                        delete principal.SPGroupUsersColl;
                        delete principal.exUsu;
                        delete principal.exGroup;
                    } catch (e) {
                        principal.title = principal.SPGroup.get_title();
                        principal.principalType = getPrincipalTypeDesc(principal.SPGroup.get_principalType());
                        delete principal.SPUser;
                        delete principal.exUsu;
                        delete principal.exGroup;
                        principal.SPGroupUsers = [];
                        principal.distinctUsers = [];
                        let userEnumerator = principal.SPGroupUsersColl.getEnumerator();
                        while (userEnumerator.moveNext()) {
                            let oUser = userEnumerator.get_current();
                            if (oUser.get_principalType() === 4 || oUser.get_principalType() === 2) {
                                if (expandADGroups) {
                                    auxUser = MVD.SPHelpers.ActiveDirectory.FindUserById(oUser.get_id(), adGroupsToExpand);
                                    if (!auxUser) {
                                        auxUser = { title: oUser.get_title(), id: oUser.get_id(), email: oUser.get_email(), login: oUser.get_loginName(), SPUser: oUser, principalType: getPrincipalTypeDesc(oUser.get_principalType()) };
                                        adGroupsToExpand.push(auxUser);
                                    }
                                }
                            } else {
                                let auxUser = MVD.SPHelpers.ActiveDirectory.FindUserById(oUser.get_id(), distinctUsers);
                                if (!auxUser) { //es importante solo crear el objeto si no lo había creado para que cuando cargue el spuser se actualice en todas la colecciones detail, SPGroupUsers y en distinctUsers
                                    auxUser = { title: oUser.get_title(), id: oUser.get_id(), email: oUser.get_email(), login: oUser.get_loginName(), SPUser: oUser, principalType: getPrincipalTypeDesc(oUser.get_principalType()) };
                                    distinctUsers.push(auxUser);
                                }
                                principal.distinctUsers.push(auxUser);
                            }
                            principal.SPGroupUsers.push(auxUser);
                        }
                    }
                } catch (ex) {
                    delete principal.SPUser;
                    delete principal.SPGroup;
                    principal.principalType = 'Principal not found.' + ex;
                }
            });
            let ret = { detail: detail, distinctUsers: distinctUsers };
            if (expandADGroups) {
                MVD.SPHelpers.ActiveDirectory.GetExpandedUsersADGroups(adGroupsToExpand, distinctUsers, context).then(function () {
                    ret.detail.forEach(function (d) { //esto es para cargar distinctUsers en los SPGroup que tienen Grupos AD dentro.
                        if (d.SPGroupUsers) {
                            d.SPGroupUsers.forEach(function (u) {
                                if (u.ADGroupUsers) {
                                    u.ADGroupUsers.forEach(function (userADGroup) {
                                        let auxUser = MVD.SPHelpers.ActiveDirectory.FindUserById(userADGroup.id, d.distinctUsers);
                                        if (!auxUser) {
                                            d.distinctUsers.push(userADGroup);
                                        }
                                    });
                                }
                            })
                        }
                    });
                    if (callback) {
                        callback(ret);
                    }
                    resolve(ret);
                }, function (args) {
                    console.log('Error resolving AD groups', args);
                    //Se ignora el error por si algunos clientes no tienen instalado ActiveDirectoryHandler.ashx
                    if (callback) {
                        callback(ret);
                    }
                    resolve(ret);
                });
            } else {
                if (callback) {
                    callback(ret);
                }
                resolve(ret);
            }
        }
    });
}

//Devuelve una promise que resuelve con un objeto con las siguientes propiedades { distinctUsers, detail  }. 
//distinctUsers es la lista de usuarios después de expandir los grupos de Sharepoint y los grupos Active Directory si se indica en expandADGroups.
//detail devuelve es una array con un elemento por lookupvalue recibido en usersCol que indica los datos, el tipo y los usuarios miembros si es un grupo.
//
//fieldsInfo es un array de objetos {listItem,internalName} de donde obtener los usuarios a expandir
//Si recibe distinctUsers no repite usuarios ya existentes. Sirve para llamar varias veces y terminar con un distinct final. Si no lo recibe lo crea como []
//Si no recibe context toma el get_current
//Si expandADGroups==true expande los grupos AD en distinctUsers y carga ADGroupUsers en la info de detail
//Si se quiere usar con callbacks en vez de promise se pasa el parámetro callback que se llama al finalizar, idem callbackfailure cuando hay un problema

MVD.SPHelpers.ActiveDirectory.GetExpandedUsersFields = function (fieldsInfo, distinctUsers, expandADGroups, context, callback, callbackFailure) {
    let usersCol = [];
    fieldsInfo.forEach(function (fieldInfo) {
        fieldInfo.listItem.get_item(fieldInfo.internalName).forEach(function (spUser) {
            if (!MVD.SPHelpers.ActiveDirectory.FindUserById(spUser.get_lookupId(), usersCol)) {
                usersCol.push(spUser);
            }
        });
    });
    return MVD.SPHelpers.ActiveDirectory.GetExpandedUsers(usersCol, distinctUsers, expandADGroups, context, callback, callbackFailure);
}

//Recibe el id de usuario a buscar y un array de SPUsers o un array de objetos de usuario MVD devuelvo por GetExpandedUsers {title,id,email,login,SPUser,principalType} o un array de Ids numéricos o un objeto del valor de un campo de tipo persona devuelto por MVD.SPHelpers.Fields.getFieldValue
//Devuelve el objeto SPUser si lo encuentra o null en caso contrario
//MVD.SPHelpers.ActiveDirectory.FindUserById
function findUserById({ id, users }) {
    if (!users) {
        return null;
    }
    if (Array.isArray(users)) {
        for (let i = 0; i < users.length; i++) {
            if (typeof users[i] !== 'number' && !users[i].id && !users[i].get_lookupId) {
                throw 'Invalid value received in parameter users';
            }
            if (typeof users[i] == 'number' && users[i] === id || users[i].id && users[i].id === id || users[i].get_lookupId && users[i].get_lookupId() === id) {
                return users[i];
            }
        }
    } else {
        throw 'Invalid value received in parameter users';
    }
    return null;
}

//Recibe un array de SPUsers a inspeccionar
//Devuelve true si encuentra el usuario en el array o false en caso contrario
//MVD.SPHelpers.ActiveDirectory.IsCurrentUserInArray
function isCurrentUserInArray({ users }) {
    return findUserById({ id: _spPageContextInfo.userId, users }) != null;
}

function getPrincipalTypeDesc(principalType) {
    switch (principalType) {
        case 0:
            return 'None';
        case 1:
            return 'User';
        case 2:
            return 'DistributionList';
        case 4:
            return 'SecurityGroup';
        case 8:
            return 'SharePointGroup';
        default:
    }
    return 'Unknown';
}

//adGroupLogins es un array de objetos que tiene una propiedad login. Cada uno de estos objetos se les va a cargar la propiedad colección adGroupUsers con todos los usuario y su info
//distinctUser es opcional y es un array de objetos representando un usuario con propiedades id,login,title,email,principalType y spUser
//retorna un objecto con propiedades detail que es el adGroupLogins con la info completada y distinctUsers que son los usuario ya resueltos no repetidos con su info 
MVD.SPHelpers.ActiveDirectory.GetExpandedUsersADGroups = function (adGroupLogins, distinctUsers, context, callback, callbackFailure) {
    return new Promise(function (resolve, reject) {
        if (!context) {
            context = new SP.ClientContext.get_current();
        }
        if (!distinctUsers) {
            distinctUsers = [];
        }
        let adGroupPromises = [];
        let usersToEnsure = [];
        adGroupLogins.forEach(function (principal) {
            let prom = new Promise(function (resolve, reject) {
                if (location.href.toLowerCase().includes('.sharepoint.com')) resolve()
                else
                    MVD.SPHelpers.ActiveDirectory.CurrentUsersOfGroup(principal.login).then(function (users) {
                        principal.ADGroupUsers = [];
                        users.forEach(function (u) {
                            //let auxUsu = findUserByLogin(u, distinctUsers);
                            //if (!auxUsu) {
                            //    auxUsu = findUserByLogin(u, usersToEnsure);
                            //}
                            let auxUsu = findUserByLogin(u, usersToEnsure);
                            if (!auxUsu) {
                                auxUsu = { login: u }; //es importante solo crear el objeto si no lo había creado para que cuando cargue el spuser se actualice en todas la colecciones ADGroupUsers y en distinctUsers 
                                usersToEnsure.push(auxUsu);
                            }
                            principal.ADGroupUsers.push(auxUsu);
                        });
                        resolve();
                    }, function (ex) {
                        principal.exception = ex;
                        resolve();
                    });
            });
            adGroupPromises.push(prom);
        });

        Promise.all(adGroupPromises).then(function () {
            let ret = { detail: adGroupLogins, distinctUsers: distinctUsers };
            if (usersToEnsure.length > 0) {
                usersToEnsure.forEach(function (user) {
                    let exceptionScope = new SP.ExceptionHandlingScope(context);
                    let startScope = exceptionScope.startScope();
                    let tryScope = exceptionScope.startTry();
                    let spUser = context.get_web().ensureUser(user.login);
                    user.SPUser = spUser;
                    context.load(spUser);
                    tryScope.dispose();
                    let catchScope = exceptionScope.startCatch();
                    catchScope.dispose();
                    startScope.dispose();
                });
                context.executeQueryAsync(
                    function () {
                        usersToEnsure.forEach(function (user) {
                            try {
                                user.id = user.SPUser.get_id();
                                user.title = user.SPUser.get_title();
                                user.login = user.SPUser.get_loginName();
                                user.email = user.SPUser.get_email();
                                user.principalType = getPrincipalTypeDesc(user.SPUser.get_principalType());
                                distinctUsers.push(user);
                            } catch (e) {
                            }
                        });
                        resolve(ret);
                        if (callback) {
                            callback(ret);
                        }
                    }, function (e) {
                        if (callbackFailure) {
                            callbackFailure('Error ensuring users');
                        }
                        reject(Error('Error ensuring users'));
                        console.error('Error ensuring users', args);
                    });
            } else {
                if (callback) {
                    callback(ret);
                }
                resolve(ret);
            }
        }, function (args) {
            if (callbackFailure) {
                callbackFailure('Error calling ActiveDirectoryHandler.ashx');
            }
            reject(Error('Error calling ActiveDirectoryHandler.ashx'));
            console.error('Error calling ActiveDirectoryHandler.ashx', args);
        });

        function findUserByLogin(login, users) {
            for (let i = 0; i < users.length; i++) {
                if (users[i].login.toLowerCase() == login.toLowerCase()) {
                    return users[i];
                }
            }
            return null;
        }
    });
}

let _getCurrentUser = null
//MVD.SPHelpers.ActiveDirectory.GetCurrentUser
function getCurrentUser() {
    if (!_getCurrentUser) {
        _getCurrentUser = (async () => {
            const clientContext = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl)
            const exceptionScope = new SP.ExceptionHandlingScope(clientContext)
            const startScope = exceptionScope.startScope()
            const tryScope = exceptionScope.startTry()
            const currentWeb = clientContext.get_web();
            const currentUser = currentWeb.get_currentUser();
            clientContext.load(currentUser);
            tryScope.dispose()
            const catchScope = exceptionScope.startCatch()
            catchScope.dispose()
            startScope.dispose()
            if (exceptionScope.get_hasException()) exceptionHandler({ exception: exceptionScope })
            await executeQueryPromise(clientContext)
            const user = {
                id: currentUser.get_id(),
                displayName: currentUser.get_title(),
                login: currentUser.get_loginName()
            }
            return user
        })()
    }
    return _getCurrentUser
}

//Recibe usersToEnsure que es un array de objetos con la propiedad login y que completará con id, displayName, email y principalType siempre y cuando no tenga ya la propiedad id que signfica que ya se resolvió.
//MVD.SPHelpers.ActiveDirectory.EnsureUsers
async function ensureUsers(usersToEnsure) {
    let unresolvedUsers = usersToEnsure.filter(function (u) { return !u.id });
    if (!usersToEnsure || usersToEnsure.length == 0 || !unresolvedUsers) {
        return usersToEnsure;
    }
    const clientContext = new SP.ClientContext(_spPageContextInfo.siteServerRelativeUrl)
    unresolvedUsers.forEach(function (user) {
        let exceptionScope = new SP.ExceptionHandlingScope(clientContext);
        let startScope = exceptionScope.startScope();
        let tryScope = exceptionScope.startTry();
        let spUser = clientContext.get_web().ensureUser(user.login);
        user.SPUser = spUser;
        clientContext.load(spUser);
        tryScope.dispose();
        let catchScope = exceptionScope.startCatch();
        catchScope.dispose();
        startScope.dispose();
    });
    await executeQueryPromise(clientContext)
    unresolvedUsers.forEach(function (user) {
        try {
            user.id = user.SPUser.get_id();
            user.displayName = user.SPUser.get_title();
            user.login = user.SPUser.get_loginName();
            user.email = user.SPUser.get_email();
            user.principalType = getPrincipalTypeDesc(user.SPUser.get_principalType());
            delete user.SPUser
        } catch (e) {
            console.warn('Could not resolve user with login ' + user.login);
        }
    });
    return usersToEnsure;
}


export { mvdInitializeModule, ensureUsers, getCurrentUser }