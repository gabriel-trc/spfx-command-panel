MVD.loadFiles = async function (filesToLoad) {
  if (typeof MVD.loadFilesPromises === 'undefined') MVD.loadFilesPromises = {}
  await MVD.awaitFor._spPageContextInfo()
  let filesGroupedByLevel = {};
  for (let i = 0; i < filesToLoad.length; i++) {
    let level = (typeof filesToLoad[i].level == 'undefined') ? 0 : filesToLoad[i].level;
    if (typeof filesGroupedByLevel[level] == 'undefined') {
      filesGroupedByLevel[level] = [];
    }
    filesGroupedByLevel[level].push(filesToLoad[i]);
  }
  let orderedLevels = Object.keys(filesGroupedByLevel).sort(function (a, b) {
    return a - b;
  })
  let filesToLoadGrouped = orderedLevels.map(level => filesGroupedByLevel[level])
  return new Promise(function (resolve, reject) {
    function processFilesToLoadGrouped(level = 0) {
      if (level == filesToLoadGrouped.length) {
        resolve()
        return
      }
      let count = 0;
      for (let i = 0; i < filesToLoadGrouped[level].length; i++) {
        let fileToLoad = filesToLoadGrouped[level][i]
        let resolvedUrl = MVD.resolveUrl(fileToLoad)
        if (!document.querySelector('[href="' + resolvedUrl + '"],[src="' + resolvedUrl + '"]')) {
          MVD.loadFilesPromises[resolvedUrl] = loadFile(fileToLoad)
        }
        MVD.loadFilesPromises[resolvedUrl].finally(function () {
          count++;
          if (count == filesToLoadGrouped[level].length) {
            processFilesToLoadGrouped(++level)
          }
        });
      }
    }
    processFilesToLoadGrouped()
  })

  function loadFile(fileToLoad) {
    return new Promise(function (resolve, reject) {
      let resolvedUrl = MVD.resolveUrl(fileToLoad)
      let tag = (MVD.versionsTypes.SCRIPT == fileToLoad.type) ? 'script' : 'link'
      let element = document.createElement(tag);
      let parent = 'body';
      let attr = 'src';
      // Important success and error for the promise
      element.onload = function () {
        resolve(resolvedUrl);
      }
      element.onerror = function (args) {
        console.error('Error al cargar ' + resolvedUrl, { args, fileToLoad });
        reject(args);
      }
      if (tag == 'script') {
        element.async = true
      } else {
        element.type = 'text/css'
        element.rel = 'stylesheet'
        element.media = 'all'
        attr = 'href'
        parent = 'head'
      }
      // Inject into document to kick off loading
      element[attr] = resolvedUrl;
      document[parent].appendChild(element);
    });
  }
}

MVD.importScripts = async function (scriptsToImport) {
  if (typeof scriptsToImport == 'string') scriptsToImport = [scriptsToImport]
  if (typeof MVD.mvdInitializeModulePromises === 'undefined') MVD.mvdInitializeModulePromises = {}
  await MVD.awaitFor._spPageContextInfo()

  return new Promise(function (resolve, reject) {
    const scriptsToImportPromise = scriptsToImport.map(scriptKey => {
      try {
        let resolvedUrl = MVD.resolveUrl(scriptKey);
        return import(resolvedUrl)
      } catch (error) {
        console.error(error)
        return true
      }

    })
    Promise.all(scriptsToImportPromise)
      .then(importedModules => {
        let promises = importedModules.map((importedModule, index) => {
          if (importedModule.mvdInitializeModule && typeof MVD.mvdInitializeModulePromises[scriptsToImport[index]] === 'undefined') {
            MVD.mvdInitializeModulePromises[scriptsToImport[index]] = importedModule.mvdInitializeModule()
          }
          return (importedModule.mvdInitializeModule) ? MVD.mvdInitializeModulePromises[scriptsToImport[index]] : true
        });
        Promise.all(promises)
          .then(() =>
            resolve(importedModules)
          )
      })
      .catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

MVD.resolveUrl = function (urlSettings) {
  let key, resolvedUrl
  let type = MVD.versionsTypes.SCRIPT
  let siteAbsolute = _spPageContextInfo.siteAbsoluteUrl
  if (typeof urlSettings == 'string') {
    key = urlSettings
  } else {
    ({ type, key, siteAbsolute = _spPageContextInfo.siteAbsoluteUrl } = urlSettings)
  }
  try {
    resolvedUrl = ['.js', '.css'].some(ext => key.toLowerCase().endsWith(ext)) ? key : MVD.versionsManifest[type][key]
    if (typeof resolvedUrl == 'undefined') throw `Doesn't exist the key ${key} with type ${type}`
    return siteAbsolute + resolvedUrl
  } catch (error) {
    throw `Doesn't exist the key ${key} with type ${type}`
  }
}

MVD.awaitFor = {
  _spPageContextInfo: async function () {
    while (typeof _spPageContextInfo == 'undefined') {
      await new Promise((resolve, reject) => setTimeout(() => resolve(), 100))
    }
    MVD.isSharePointOnline = Boolean(_spPageContextInfo.webTimeZoneData)
  },
  SPClientContext: function () {
    return new Promise(function (resolve, reject) {
      SP.SOD.executeFunc('sp.js', 'SP.ClientContext', () => { resolve() })
    })
  },
  SPClientPeoplePicker: function () {
    return new Promise(function (resolve, reject) {
      SP.SOD.registerSod('clientpeoplepicker.js', '/_layouts/15/clientpeoplepicker.js');
      SP.SOD.executeFunc('clientpeoplepicker.js', 'SPClientPeoplePicker', () => {
        let element = document.createElement('script');
        let parent = 'body';
        element.async = true
        element['src'] = '/_layouts/15/autofill.js';
        element.onload = function () {
          resolve()
        }
        document[parent].appendChild(element);
      })
    })
  },
  UserProfiles: function () {
    return new Promise(function (resolve, reject) {
      SP.SOD.registerSod('SP.UserProfile.js', '/_layouts/15/SP.UserProfiles.js');
      SP.SOD.executeFunc('SP.UserProfile.js', '/_layouts/15/SP.UserProfiles.js', () => {
        resolve()
      })
    })
  },
  getCurrentUserSettings: async function () {
    if (typeof _spPageContextInfo.webTimeZoneData === 'undefined') {
      if (typeof MVD.getCurrentUserSettingsPromise === 'undefined') {
        await MVD.awaitFor.SPClientContext()
        await MVD.awaitFor.UserProfiles()
        MVD.getCurrentUserSettingsPromise = new Promise(function (resolve, reject) {
          let storageCurrentUserSettings = localStorage.getItem('currentUserSettings')
          if (storageCurrentUserSettings) {
            storageCurrentUserSettings = JSON.parse(storageCurrentUserSettings)
            _spPageContextInfo = { ..._spPageContextInfo, ...storageCurrentUserSettings }
            resolve()
          } else {
            const clientContext = SP.ClientContext.get_current()
            const web = clientContext.get_web()
            const timeZone = web.get_regionalSettings().get_timeZone()
            const timeZones = web.get_regionalSettings().get_timeZones()
            const peopleManager = new SP.UserProfiles.PeopleManager(clientContext)
            const personProperties = peopleManager.getMyProperties()
            clientContext.load(timeZone)
            clientContext.load(timeZones)
            clientContext.load(personProperties)
            clientContext.executeQueryAsync(
              function () {
                const info = timeZone.get_information();
                const offset = (info.get_bias() + info.get_daylightBias()) / 60.0;
                _spPageContextInfo.webTimeZoneData = {
                  Bias: info.get_bias(),
                  DaylightBias: info.get_daylightBias(),
                  Description: timeZone.get_description(),
                  Id: timeZone.get_id(),
                  StandardBias: info.get_standardBias(),
                }
                _spPageContextInfo.userTimeZoneData = null
                const userProfileProperties = personProperties.get_userProfileProperties()
                _spPageContextInfo.preferUserTimeZone = Boolean(userProfileProperties['SPS-TimeZone'])
                if (!_spPageContextInfo.preferUserTimeZone) {
                  const userTimeZone = timeZones.getById(userProfileProperties['SPS-TimeZone'])
                  clientContext.load(timeZones);
                  clientContext.executeQueryAsync(
                    function () {
                      const userTimeZoneInfo = userTimeZone.get_information();
                      _spPageContextInfo.userTimeZoneData = {
                        Bias: userTimeZoneInfo.get_bias(),
                        DaylightBias: userTimeZoneInfo.get_daylightBias(),
                        Description: userTimeZone.get_description(),
                        Id: userTimeZone.get_id(),
                        StandardBias: userTimeZoneInfo.get_standardBias(),
                      }
                      localStorage.setItem('currentUserSettings', {
                        webTimeZoneData: _spPageContextInfo.webTimeZoneData,
                        preferUserTimeZone: _spPageContextInfo.preferUserTimeZone,
                        userTimeZoneData: _spPageContextInfo.userTimeZoneData
                      })
                      resolve()
                    },
                    function (sender, args) {
                      reject(args)
                    }
                  )
                } else {
                  localStorage.setItem('currentUserSettings', {
                    webTimeZoneData: _spPageContextInfo.webTimeZoneData,
                    preferUserTimeZone: _spPageContextInfo.preferUserTimeZone,
                    userTimeZoneData: _spPageContextInfo.userTimeZoneData
                  })
                  resolve()
                }
              },
              function (sender, args) {
                reject(args)
              }
            )
          }
        })
      }
      return MVD.getCurrentUserSettingsPromise
    }
    //var userTimeZoneValue = personProperties.get_userProfileProperties()['SPS-TimeZone'];
    //console.log("User Time Zone :" + userTimeZoneValue);

    // if (userTimeZoneValue) {
    // use the time zone setting from user proifle 
    //spTimeZoneId = SPTimeZoneNameToSPTimeZoneId[userTimeZoneValue];

    // } else {
    // Use site time zone setting 
    //spTimeZoneId = SPTimeZoneNameToSPTimeZoneId[siteTimeZone.get_description()];
    //}

    function executeQueryPromise(clientContext) {
      return new Promise((resolve, reject) => {
        clientContext.executeQueryAsync(
          function () { resolve() },
          function (sender, args) { reject(args) }
        )
      })
    }
  }
}

MVD.pageLoader = function (pageLoaderSettings) {
  if (typeof MVD.pageLoaderKeyCalls === 'undefined') MVD.pageLoaderKeyCalls = {}
  let { msg = 'Aguarde por favor.', show = true, type = 'Spinner', keyCall = 'GLOBAL' } = pageLoaderSettings;
  if (typeof pageLoaderSettings == 'boolean') {
    show = pageLoaderSettings;
  }
  try {
    if (!document.getElementById('mvdPageLoaderWrapper')) {
      const div = document.createElement('div')
      div.id = 'mvdPageLoaderWrapper'
      div.innerHTML =
        '<div id="mvdPageLoaderInnerWrapper">' +
        '<div style="position: relative; min-height: 85px;">' +
        '<div id="mvdPageLoader" style="margin:auto"></div>' +
        '</div>' +
        '<div id="mvdPageLoaderMsg"></div>' +
        '</div>'
      document.body.appendChild(div)
    }

    if (type == 'Spinner') {
      document.getElementById('mvdPageLoader').innerHTML = '<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'
    } else if (type == 'Ring') {
      document.getElementById('mvdPageLoader').innerHTML = '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>'
    }

    document.getElementById('mvdPageLoaderMsg').innerHTML = msg
    if (show) {
      MVD.pageLoaderKeyCalls[keyCall] = true;
      document.getElementById('mvdPageLoaderWrapper').style.display = 'block'
      try {
        document.getElementById('aspnetForm').style.filter = 'blur(5px)'
      } catch (error) {

      }
    } else {
      delete MVD.pageLoaderKeyCalls[keyCall];
      if (Object.keys(MVD.pageLoaderKeyCalls).length === 0 || keyCall == 'FORCED_HIDDING') {
        document.getElementById('mvdPageLoaderWrapper').style.display = 'none'
        try {
          document.getElementById('aspnetForm').style.filter = 'none'
        } catch (error) {

        }
      }
    }
  } catch (error) {
    document.getElementById('mvdPageLoaderWrapper').remove()
  }
}