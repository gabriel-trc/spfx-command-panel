let getListItems

async function mvdInitializeModule() {
    let modules = await MVD.importScripts(['sp-helpers/list-items']);
    ({ getListItems } = modules[0])
}

var activeDirectoryListUrl = '/Lists/MVDCheckADGroups';

function CurrentUserMemberOfADGroup(ADGroupUser, OnComplete, OnFailure, recursive) {

    return new Promise(function (resolve, reject) {
        var currentContext = new SP.ClientContext.get_current();
        var groupId = ADGroupUser.EntityData.SPUserID;
        var query = "";
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

        getListItems('/', activeDirectoryListUrl, query).then(
            function (items) {
                var totalItems = items.get_count();
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
                    var enumerator = items.getEnumerator();
                    enumerator.moveNext();
                    var item = enumerator.get_current();
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
                    var isGroup = false;
                    var isEveryone = false;
                    var enumerator = items.getEnumerator();
                    while (enumerator.moveNext()) {
                        var spListItem = enumerator.get_current();
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

            })
    });

    function createNewGroupRows(ADGroupUser, currentContext, creationOK) {
        var groupId = ADGroupUser.EntityData.SPUserID;
        var list = currentContext.get_web().get_lists().getByTitle('MVDCheckADGroups');
        var itemCreateInfo = new SP.ListItemCreationInformation();
        listItem = list.addItem(itemCreateInfo);

        listItem.set_item('GroupId', groupId);
        listItem.set_item('Title', 'Group');

        listItem.update();
        var collRoleDefinitionBinding = SP.RoleDefinitionBindingCollection.newObject(currentContext);
        listItem.breakRoleInheritance(false);
        collRoleDefinitionBinding.add(currentContext.get_web().get_roleDefinitions().getByType(SP.RoleType.administrator));
        var SPuser = currentContext.get_web().get_siteUsers().getById(ADGroupUser.EntityData.SPUserID);
        var web = currentContext.get_web();
        var currentUser = web.get_currentUser();
        listItem.get_roleAssignments().getByPrincipal(currentUser).deleteObject();
        listItem.get_roleAssignments().add(SPuser, collRoleDefinitionBinding);

        var itemCreateInfo2 = new SP.ListItemCreationInformation();
        listItem2 = list.addItem(itemCreateInfo2);

        listItem2.set_item('GroupId', groupId);
        listItem2.set_item('Title', 'Everyone');

        listItem2.update();

        currentContext.executeQueryAsync(function () {
            SecondTime(currentContext, groupId, function (isValid) {
                return creationOK(isValid);
            });
        }, function (sender, args) {
            console.error('Error en UserHasNeverAcceded. ' + args.get_message() + '\n' + args.get_stackTrace());
            return creationOK(false);
        });
    }
}

function GetGroupId(clientContext, group, Callback) {

    clientContext.load(group, 'id');

    clientContext.executeQueryAsync(Function.createDelegate(this, this.onQuerySucceeded), Function.createDelegate(this, this.onQueryFailed));

    function onQuerySucceeded() {

        return Callback(group.get_id());
    }

    function onQueryFailed(sender, args) {

        return Callback(-1);
    }
}

//group es de from domino\nombregrupo ej. testvm2\prugrupo
function CurrentUsersOfGroup(group, userListCallback) {

    return new Promise(function (resolve, reject) {
        var url = '/_layouts/MVD.SPHelpers.Solution/MVD.ActiveDirectoryHandler.ashx?comando=ListMembers&group=' + escape(group);

        var req = new XMLHttpRequest();
        req.open('GET', url);

        req.onload = function () {
            if (req.status == 200) {
                try {
                    var ret = JSON.parse(req.response);
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
function ConcatSPUsers(usersToConcat, usersCol) {
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
                var spUserId = Number(v.EntityData.SPUserID);
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

function GetExpandedUsers(usersCol, distinctUsers, expandADGroups, context, callback, callbackFailure) {
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
            ConcatSPUsers(usersCol, distinctUsers);
            usersCol = distinctUsers;
        }

        var siteUsers = context.get_web().get_siteUsers();
        var collGroup = context.get_web().get_siteGroups();
        var detail = [];
        usersCol.forEach(function (user) {
            var id;
            var auxUsers = [];
            ConcatSPUsers(user, auxUsers); //uso esto por si en usersCol llegan arrays como elementos (por ejemplo si es un array con valores de varios campo de tipo persona múltiple)
            auxUsers.forEach(function (id) {
                if (detail.filter(function (d) { return d.id === id }).length === 0) {
                    var exceptionScope = new SP.ExceptionHandlingScope(context);
                    var startScope = exceptionScope.startScope();
                    var tryScope = exceptionScope.startTry();
                    var user;
                    user = siteUsers.getById(id);
                    context.load(user);

                    tryScope.dispose();
                    var catchScope = exceptionScope.startCatch();
                    catchScope.dispose();
                    startScope.dispose();

                    var exceptionScope2 = new SP.ExceptionHandlingScope(context);
                    var startScope2 = exceptionScope2.startScope();
                    var tryScope2 = exceptionScope2.startTry();
                    var group;
                    group = collGroup.getById(id);
                    context.load(group);
                    var collUser = group.get_users();
                    context.load(collUser);
                    tryScope2.dispose();
                    var catchScope2 = exceptionScope2.startCatch();
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
            var adGroupsToExpand = [];
            detail.forEach(function (principal) {
                try {
                    try {
                        principal.title = principal.SPUser.get_title();
                        principal.login = principal.SPUser.get_loginName();
                        principal.email = principal.SPUser.get_email();
                        principal.principalType = getPrincipalTypeDesc(principal.SPUser.get_principalType());
                        if (principal.principalType === 'SecurityGroup' || principal.principalType === 'DistributionList') {
                            if (expandADGroups && !FindUserById(principal.id, adGroupsToExpand)) {
                                adGroupsToExpand.push(principal);
                            }
                        } else if (!FindUserById(principal.id, distinctUsers)) {
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
                        var userEnumerator = principal.SPGroupUsersColl.getEnumerator();
                        while (userEnumerator.moveNext()) {
                            var oUser = userEnumerator.get_current();
                            if (oUser.get_principalType() === 4 || oUser.get_principalType() === 2) {
                                if (expandADGroups) {
                                    auxUser = FindUserById(oUser.get_id(), adGroupsToExpand);
                                    if (!auxUser) {
                                        auxUser = { title: oUser.get_title(), id: oUser.get_id(), email: oUser.get_email(), login: oUser.get_loginName(), SPUser: oUser, principalType: getPrincipalTypeDesc(oUser.get_principalType()) };
                                        adGroupsToExpand.push(auxUser);
                                    }
                                }
                            } else {
                                var auxUser = FindUserById(oUser.get_id(), distinctUsers);
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
            var ret = { detail: detail, distinctUsers: distinctUsers };
            if (expandADGroups) {
                GetExpandedUsersADGroups(adGroupsToExpand, distinctUsers, context).then(function () {
                    ret.detail.forEach(function (d) { //esto es para cargar distinctUsers en los SPGroup que tienen Grupos AD dentro.
                        if (d.SPGroupUsers) {
                            d.SPGroupUsers.forEach(function (u) {
                                if (u.ADGroupUsers) {
                                    u.ADGroupUsers.forEach(function (userADGroup) {
                                        var auxUser = FindUserById(userADGroup.id, d.distinctUsers);
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

function GetExpandedUsersFields(fieldsInfo, distinctUsers, expandADGroups, context, callback, callbackFailure) {
    var usersCol = [];
    fieldsInfo.forEach(function (fieldInfo) {
        fieldInfo.listItem.get_item(fieldInfo.internalName).forEach(function (spUser) {
            if (!FindUserById(spUser.get_lookupId(), usersCol)) {
                usersCol.push(spUser);
            }
        });
    });
    return GetExpandedUsers(usersCol, distinctUsers, expandADGroups, context, callback, callbackFailure);
}

//Recibe el id de usuario a buscar y un array de SPUsers o un array de objetos de usuario MVD devuelvo por GetExpandedUsers {title,id,email,login,SPUser,principalType} o un array de Ids numéricos o un objeto del valor de un campo de tipo persona devuelto por MVD.SPHelpers.Fields.getFieldValueByInternalName
//Devuelve el objeto SPUser si lo encuentra o null en caso contrario
function FindUserById(id, users) {
    if (!users) {
        return null;
    }
    if (users.values && Array.isArray(users.values)) { // es un valor devuelto por MVD.SPHelpers.Fields.getFieldValueByInternalName
        for (var i = 0; i < users.values.length; i++) {
            if (users.values[i].EntityData.SPUserID == id) {
                return users.values[i];
            }
        }
    } else if (Array.isArray(users)) {
        for (var i = 0; i < users.length; i++) {
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
function IsCurrentUserInArray(users) {
    return FindUserById(_spPageContextInfo.userId, users) != null;
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
function GetExpandedUsersADGroups(adGroupLogins, distinctUsers, context, callback, callbackFailure) {
    return new Promise(function (resolve, reject) {
        if (!context) {
            context = new SP.ClientContext.get_current();
        }
        if (!distinctUsers) {
            distinctUsers = [];
        }
        var adGroupPromises = [];
        var usersToEnsure = [];
        adGroupLogins.forEach(function (principal) {
            var prom = new Promise(function (resolve, reject) {
                CurrentUsersOfGroup(principal.login).then(function (users) {
                    principal.ADGroupUsers = [];
                    users.forEach(function (u) {
                        //var auxUsu = findUserByLogin(u, distinctUsers);
                        //if (!auxUsu) {
                        //    auxUsu = findUserByLogin(u, usersToEnsure);
                        //}
                        var auxUsu = findUserByLogin(u, usersToEnsure);
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
            var ret = { detail: adGroupLogins, distinctUsers: distinctUsers };
            if (usersToEnsure.length > 0) {
                usersToEnsure.forEach(function (user) {
                    var exceptionScope = new SP.ExceptionHandlingScope(context);
                    var startScope = exceptionScope.startScope();
                    var tryScope = exceptionScope.startTry();
                    var spUser = context.get_web().ensureUser(user.login);
                    user.SPUser = spUser;
                    context.load(spUser);
                    tryScope.dispose();
                    var catchScope = exceptionScope.startCatch();
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
            for (var i = 0; i < users.length; i++) {
                if (users[i].login.toLowerCase() == login.toLowerCase()) {
                    return users[i];
                }
            }
            return null;
        }
    });
}

let _GetCurrentUserPromise = null
function GetCurrentUser() {
    if (!_GetCurrentUserPromise) {
        _GetCurrentUserPromise = new Promise(function (resolve, reject) {
            var currentContext = new SP.ClientContext.get_current();
            var currentWeb = currentContext.get_web();
            var currentUser = currentWeb.get_currentUser();
            currentContext.load(currentUser);
            currentContext.executeQueryAsync(OnSuccess, OnFailure);

            function OnSuccess(sender, args) {
                resolve(currentUser);
            }
            function OnFailure(sender, args) {
                console.error('Error resolving current user', args);
                reject(args);
            }
        });
    }
    return _GetCurrentUserPromise;
}
//Recibe usersToEnsure que es un array de objetos con la propiedad login y que completará con id, title, email y principalType siempre y cuando no tenga ya la propiedad id que signfica que ya se resolvió.
function EnsureUsers(usersToEnsure, context) {
    return new Promise(function (resolve, reject) {
        var unresolvedUsers = usersToEnsure.filter(function (u) { return !u.id });
        if (!usersToEnsure || usersToEnsure.length == 0 || !unresolvedUsers) {
            resolve();
        }
        if (!context) {
            context = new SP.ClientContext.get_current();
        }
        unresolvedUsers.forEach(function (user) {
            var exceptionScope = new SP.ExceptionHandlingScope(context);
            var startScope = exceptionScope.startScope();
            var tryScope = exceptionScope.startTry();
            var spUser = context.get_web().ensureUser(user.login);
            user.SPUser = spUser;
            context.load(spUser);
            tryScope.dispose();
            var catchScope = exceptionScope.startCatch();
            catchScope.dispose();
            startScope.dispose();
        });
        context.executeQueryAsync(
            function () {
                unresolvedUsers.forEach(function (user) {
                    try {
                        user.id = user.SPUser.get_id();
                        user.title = user.SPUser.get_title();
                        user.login = user.SPUser.get_loginName();
                        user.email = user.SPUser.get_email();
                        user.principalType = getPrincipalTypeDesc(user.SPUser.get_principalType());
                    } catch (e) {
                        console.warn('Could not resolve user with login ' + user.login);
                    }
                });
                resolve();
            }, function (e) {
                reject(Error('Error ensuring users'));
                console.error('Error ensuring users', args);
            });
    });
}

export { mvdInitializeModule, GetExpandedUsers, ConcatSPUsers, CurrentUsersOfGroup, GetGroupId, CurrentUserMemberOfADGroup, GetExpandedUsersFields, FindUserById, IsCurrentUserInArray, getPrincipalTypeDesc, GetExpandedUsersADGroups, EnsureUsers, GetCurrentUser }