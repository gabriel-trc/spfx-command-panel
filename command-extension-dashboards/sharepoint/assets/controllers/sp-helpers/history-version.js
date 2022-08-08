let getItemById, getFields

if (location.href.toLowerCase().includes('/documentos/forms/')) {
    let style = document.createElement('style');
    style.innerHTML = 'form{ visibility: hidden;}';
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', async (event) => {
    await MVD.awaitFor.SPClientContext()
    let modules = await MVD.importScripts(['sp-helpers/list-items']);
    ({ getItemById, getFields } = modules[0]);
    if (location.href.toLowerCase().includes('/versions.aspx')) {
        MVD.pageLoader({ show: true, keyCall: 'versionsHistory' })
        initInVersionsHistory()
    }
    else if (location.href.toLowerCase().includes('/documentos/forms/') && document.querySelector('table[class=ms-listviewtable]')) {
        showOrHideElementsByUser()
        initInListViews()
        window.addEventListener('hashchange', function () {
            initInListViews()
        }, false);

        document.addEventListener('change', function (event) {
            if (event.target.nodeName === 'INPUT' && event.target.id.startsWith('inplaceSearchDiv_')) {
                MVD.pageLoader(true)
                setTimeout(function () {
                    initInListViews()
                    MVD.pageLoader(false)
                }, 2000)

            }
        })

        document.addEventListener('click', function (event) {
            if (event.target.nodeName === 'A' && event.target.id.startsWith('inplaceSearchDiv_')) {
                MVD.pageLoader(true)
                setTimeout(function () {
                    initInListViews()
                    MVD.pageLoader(false)
                }, 2000)
            }
        })

        function observe() {
            var observer = new MutationObserver(function (mutations, observer) {
                observer.disconnect(); // stop watching changes             
                if (mutations.filter(e => e.target.nodeName === "TABLE").length === 2) {
                    initInListViews()
                }
                observe(); // start watching for changes again
            });
            observer.observe(document.querySelector('table[class=ms-listviewtable]'), { childList: true, subtree: true });
        }
        observe()

    }
    if (location.href.toLowerCase().includes('/documentos/forms/'))
        document.querySelector('form').style.visibility = 'visible'
})

const MODERATION_STATUS_ENUM = {
    0: 'Aprobado',
    1: 'Denegado',
    2: 'Borrador',
    3: 'Pendiente',
    4: 'Programado'
}

function initInListViews() {
    MVD.pageLoader({ show: true, keyCall: 'initInListViews' })

    const listViewTable = document.querySelector('table[class=ms-listviewtable]')
    const tHeadCellsArray = Array.from(listViewTable.tHead.rows[0].cells)
    const _MVDImportMissingInfoColumnPosition = tHeadCellsArray.findIndex(e => e.querySelector(`[name="_MVDImportMissingInfo"]`))
    if (_MVDImportMissingInfoColumnPosition > -1) {
        setMissingInformation(_MVDImportMissingInfoColumnPosition)
    }
    MVD.pageLoader({ show: false, keyCall: 'initInListViews' })
    document.querySelectorAll('div.ms-list-itemLink').forEach(e => {
        e.addEventListener('click', (event) => {
            const tHeadCellsArray = Array.from(listViewTable.tHead.rows[0].cells)
            const tr = event.currentTarget.closest('tr')
            setTimeout(function () {
                const modifiedColumnPosition = tHeadCellsArray.findIndex(e => e.querySelector(`[name="Modified"]`))
                const editorColumnPosition = tHeadCellsArray.findIndex(e => e.querySelector(`[name="Editor"]`))
                beforeOpenPreViewPopUp({ tr, modifiedColumnPosition, editorColumnPosition })
            }, 300)
        })
    })
}

function beforeOpenPreViewPopUp({ tr, modifiedColumnPosition, editorColumnPosition }) {
    let spanModifiedData = document.querySelectorAll(`span[id^="co${tr.id}"][id$="_calloutModified"]`)
    spanModifiedData.forEach(span => {
        let isModified = span.getAttribute('data-modified')
        if (!isModified) {
            span.setAttribute('data-modified', 1)
            if (modifiedColumnPosition !== -1) {
                if (span.children.length) {
                    let modifiedValue = tr.cells[modifiedColumnPosition].children[0].title
                    span.childNodes[2].textContent = ` el ${modifiedValue} `
                } else {
                    let modifiedValue = tr.cells[modifiedColumnPosition].children[0].title
                    let textContent = span.childNodes[0].textContent
                    let splitTextContent = textContent.split(' ').splice(0, 4)
                    span.childNodes[0].textContent = splitTextContent.join(' ') + ' ' + modifiedValue
                }
            }
            if (editorColumnPosition !== -1) {
                if (span.children.length) {
                    let editorInnerHTML = tr.cells[editorColumnPosition].firstElementChild.innerHTML
                    span.firstElementChild.innerHTML = editorInnerHTML
                } else {
                    let editorInnerHTML = tr.cells[editorColumnPosition].firstElementChild.innerHTML
                    let textContent = span.childNodes[0].textContent
                    let splitTextContent = textContent.split(' ')
                    span.innerHTML = span.childNodes[0].nodeValue.replace(splitTextContent[2], editorInnerHTML);
                }
            }
        }
    })
}

function setMissingInformation(missingInfoColumnPosition) {
    const listViewTable = document.querySelector('table[class=ms-listviewtable]')
    const tHeadCellsArray = Array.from(listViewTable.tHead.rows[0].cells)
    for (let i = 1; i < listViewTable.rows.length; i++) {
        const row = listViewTable.rows[i]
        const missingInformationText = listViewTable.rows[i].cells[missingInfoColumnPosition].textContent
        if (!missingInformationText) {
            listViewTable.rows[i].cells[missingInfoColumnPosition].hidden = true
            continue
        }
        const missingInformationValue = JSON.parse(missingInformationText)
        for (let j = 0; j < missingInformationValue.Fields.length; j++) {
            let missingRowData = missingInformationValue.Fields[j]
            let columnToInternalName = missingRowData.Field
            let indexColumnTo = tHeadCellsArray.findIndex(e => e.querySelector(`[name="${columnToInternalName}"]`))
            if (indexColumnTo > -1) {
                let innerHTMLForUpdate = transformDataForListViews(missingRowData)
                const columnToCell = row.cells[indexColumnTo]
                columnToCell.innerHTML = innerHTMLForUpdate
            }
        }
        listViewTable.rows[i].cells[missingInfoColumnPosition].hidden = true
    }
    listViewTable.rows[0].cells[missingInfoColumnPosition].hidden = true
}

function transformDataForListViews(missingRowData) {
    let retInnerHTML = ''
    if (missingRowData.Url) {
        for (let i = 0; i < missingRowData.Values.length; i++) {
            let data = missingRowData.Values[i]
            let id = data.Id
            let displayName = data.Value
            let aHref = (data.Id > -1) ? `${(_spPageContextInfo.webServerRelativeUrl !== '/') ? _spPageContextInfo.webServerRelativeUrl + '/' : '/'}${missingRowData.Url}?ID=${data.Id}` : '#'
            retInnerHTML += getUserOrLookupSpanElement({ id, displayName, aHref })
        }
    } else if (missingRowData.ValueOverrideType === 'DateTime') {
        let strDate = getFormatedDateStr(missingRowData.ValueOverride)
        retInnerHTML = `<span class="ms-noWrap" title="${strDate}">${strDate}</span>`;
    }
    return retInnerHTML
}

function showOrHideElementsByUser() {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
        a[id*="OpenWithExplorer"] {
            display: none;
        }
        button.js-listview-qcbSyncButton {
            display: none;
        }
        a[id$="Sync-Large"] {
            display:none;
        }
        a[id*="ViewWorkflows"] {
             display:none !important;
        }
        li[aria-label="Flujos de trabajo"]{
            display:none !important;
        }
        `);
    document.adoptedStyleSheets = [sheet];
    getItemById({
        id: 1,
        listUrl: 'Lists/Configuracion',
        siteUrl: _spPageContextInfo.webServerRelativeUrl
    }).then(item => {
        let responsibleSystem = 'ResponsableSistema'
        let responsibleSecondarySystem = 'ResponsablesSistemaSecundarios'
        if (item[responsibleSystem]?.some(e => e.id === _spPageContextInfo.userId) || item[responsibleSecondarySystem]?.some(e => e.id === _spPageContextInfo.userId)) {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(`
            a[id*="OpenWithExplorer"] {
                display: inline-block;
            }
            button.js-listview-qcbSyncButton {
                display: inline-block;
            }
            a[id$="Sync-Large"] {
                display:inline-block;
            }
            a[id*="ViewWorkflows"] {
             display:none !important;
            }
            li[aria-label="Flujos de trabajo"]{
                display:none !important;
            }
            `);
            document.adoptedStyleSheets = [sheet];
        }
    })
}

async function initInVersionsHistory() {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
    .ms-propertysheet {display: block; width: 150px; word-wrap: break-word;}
    -pageTitle a {color: #999999 !important;}
    .ms-core-pageTitle {font-size: 2em !important;}
    `);
    document.adoptedStyleSheets = [sheet];

    let searchParams = new URLSearchParams(location.search.toUpperCase());
    let id = Number(searchParams.get('ID'))
    let promisesResult = await Promise.all([getItemById({
        id,
        listGUID: _spPageContextInfo.pageListId,
        siteUrl: _spPageContextInfo.webServerRelativeUrl,
        getVersions: true
    }), getFields({
        listGUID: _spPageContextInfo.pageListId,
        siteUrl: _spPageContextInfo.webServerRelativeUrl
    })])
    let item = promisesResult[0]
    let fields = promisesResult[1]
    let isLibrary = fields.some(e => e.internalName === 'FileLeafRef')//hacerlo con getListInfo, pueden tocar la funcion de los getFields
    let versionsData = getProcessedVersionsData({ item, fields })
    const itemTitle = (isLibrary) ? item.FileLeafRef : item.Title ? item.Title : 'Sin título'
    const itemHref = (isLibrary) ? item.FileRef : '#'
    const contentBoxElement = document.getElementById('contentBox')
    const h1VersionElement = document.createElement('h1')
    h1VersionElement.setAttribute('id', 'pageTitle')
    h1VersionElement.classList.add('ms-core-pageTitle')
    h1VersionElement.innerHTML =
        `<span id="DeltaPlaceHolderPageTitleInTitleArea">
            <span id="ctl00_PlaceHolderPageTitleInTitleArea_VersionsSavedFor">
            Versiones guardadas para <a id="onetidVersionsEditTitle" href="${itemHref}" ${isLibrary ? onclick = "DispDocItem(this,&quot;SharePoint.OpenDocuments&quot;)" : ''}>${itemTitle}</a>
            </span>
        </span>
        <div id="DeltaPlaceHolderPageDescription" class="ms-displayInlineBlock ms-normalWrap">
            <a href="javascript:;" id="ms-pageDescriptionDiv" style="" class=" js-callout-launchPoint">
            <span id="ms-pageDescriptionImage" title="Todas las versiones de este documento aparecen a continuación, con el nuevo valor de las propiedades cambiadas.">&nbsp;</span>
            </a>
            <span class="ms-accessible" id="ms-pageDescription" title="Todas las versiones de este documento aparecen a continuación, con el nuevo valor de las propiedades cambiadas.">
                Todas las versiones de este documento aparecen a continuación, con el nuevo valor de las propiedades cambiadas.
            </span>
            <script type="text/javascript">
            _spBodyOnLoadFunctionNames.push("setupPageDescriptionCallout");
            </script>
        </div>`
    contentBoxElement.prepend(h1VersionElement)
    for (let i = 0; i < versionsData.length; i++) {
        const versionData = versionsData[i]
        const aTag = document.querySelector(`a[versionlabel="${versionData._UIVersionString}"]`)
        const principalTR = aTag.closest('table').closest('tr')
        if (!principalTR.nextElementSibling.querySelector('table[role]')) {
            console.log('no hay datos')
        }

        let tableWithVersioningData = principalTR.nextElementSibling.querySelector('table')
        for (let prop in versionData) {
            if (['Author', '_UIVersionString'].includes(prop) || prop.startsWith('_previousValueTootltip_')) {
                continue
            }
            try {
                let tdToChange
                let field = fields.find(e => e.internalName == prop)
                if (prop === 'Editor') {
                    tdToChange = aTag.closest('table').closest('td').nextElementSibling
                }
                else if (prop === 'Modified') {
                    if (!versionData['_UIVersionString'].endsWith('.0')) continue
                    let strDate = getFormatedDateStr(versionData[prop])
                    aTag.textContent = strDate
                    continue
                } else if (prop === '_ModerationComments') {
                    principalTR.lastElementChild.textContent = versionData[prop] ?? ''
                    continue
                }
                else {
                    let existTr = tableWithVersioningData.querySelector(`tr[id$="${prop}"]`)
                    if (!existTr) {
                        let strPreviousValue = getPreviousValueStr({
                            field,
                            value: versionData[`_previousValueTootltip_${prop}`]
                        })
                        let newTr = tableWithVersioningData.insertRow()
                        newTr.id = 'vv' + versionData._UIVersion + prop
                        newTr.title = 'Valor anterior: ' + strPreviousValue;
                        let firstCell = newTr.insertCell()
                        firstCell.innerHTML = field.name
                        firstCell.classList.add('ms-propertysheet')
                        firstCell.setAttribute('nowrap', 'nowrap')
                        firstCell.setAttribute('width', 100)
                        firstCell.setAttribute('colspan', 2)
                        firstCell.setAttribute('valign', 'top')
                        firstCell.style.paddingLeft = '5px'

                        tdToChange = newTr.insertCell()
                        tdToChange.classList.add('ms-vb')
                        tdToChange.setAttribute('valign', 'top')
                    } else {
                        tdToChange = existTr.cells[1]
                    }
                }
                let innerHTMLForUpdate = transformDataAPIInInnerHTMLValue({ field, value: versionData[prop] })
                tdToChange.innerHTML = innerHTMLForUpdate
            } catch (error) {
                console.error(error)
            }
        }
    }
    contentBox.querySelectorAll('tr[id$="_MVDImportMissingInfo"]').forEach(tr => tr.hidden = true)
    setTimeout(SP.UI.ModalDialog.get_childDialog().autoSize(), 1000)
    MVD.pageLoader({ show: false, keyCall: 'versionsHistory' })
}

function getProcessedVersionsData({ item, fields }) {
    let versionsData = []
    let fieldsInternalNames = fields.map(e => e.internalName)
    for (let index = 0; index < item._Versions.length; index++) {
        const itemProcessed = {}
        const itemVersion = item._Versions[index];
        for (let prop in itemVersion) {
            if (['_ModerationComments', '_ModerationStatus', '_UIVersionString'].includes(prop) || fieldsInternalNames.includes(prop)) {
                itemProcessed[prop] = itemVersion[prop]
                if ('_ModerationStatus' === prop) {
                    itemProcessed[prop] = MODERATION_STATUS_ENUM[itemVersion[prop]]
                }
            }
        }
        if (itemProcessed._MVDImportMissingInfo) {
            const missingInformationValue = JSON.parse(itemVersion._MVDImportMissingInfo)
            for (let j = 0; j < missingInformationValue.Fields.length; j++) {
                let missingRowData = missingInformationValue.Fields[j]
                let field = fields.find(e => e.internalName === missingRowData.Field)
                if (field) {
                    itemProcessed[field.internalName] = transformData({ missingRowData, field })
                } else {
                    console.log("Field doesn't exist", { missingRowData })
                }
            }
        }
        versionsData.push(itemProcessed)
    }
    let idsItemsToRemove = []
    for (let index = 0; index < versionsData.length; index++) {
        const currentVersionData = versionsData[index];
        const previousVersionData = versionsData[index + 1];
        const propsForReplace = currentVersionData['_MVDImportMissingInfo'] ? JSON.parse(currentVersionData['_MVDImportMissingInfo']).Fields.map(e => e.Field) : []
        if (propsForReplace.length === 0) {
            idsItemsToRemove.push(currentVersionData.ID)
            continue
        }
        for (let prop in currentVersionData) {
            if (['_MVDImportMissingInfo', '_UIVersionString'].includes(prop) || prop.startsWith('_previousValueTootltip_')) continue
            if (!propsForReplace.includes(prop)) {
                delete currentVersionData[prop]
            }
            if (typeof currentVersionData[prop] !== 'undefined' && previousVersionData) {
                let currentValue = getValueToCompare(currentVersionData[prop])
                let previousValue = getValueToCompare(previousVersionData[prop])
                if (currentValue !== previousValue) {
                    currentVersionData[`_previousValueTootltip_${prop}`] = previousVersionData[prop]
                } else if (!['Editor', 'Modified'].includes(prop)) {
                    delete currentVersionData[prop]
                }
            }
        }
        delete currentVersionData['_MVDImportMissingInfo']
    }
    versionsData = versionsData.filter(e => !idsItemsToRemove.includes(e.ID))
    return versionsData
}

function getValueToCompare(value) {
    if (typeof value === null) {
        return null
    }
    else if (value instanceof Date && !isNaN(value.getTime())) {
        return value.toISOString()
    }
    else if (typeof value === 'object') {
        return JSON.stringify(value)
    }
    return value
}

function getPreviousValueStr({ field, value }) {
    let strPreviousValue = value ?? ''
    if (strPreviousValue === '') return strPreviousValue
    if (field.type === 'DateTime' || field.type === 'Calculated' && field.schema.ResultType === 'DateTime') {
        let strDate = new Date(value).toLocaleDateString(_spPageContextInfo.currentCultureName, {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: SPTimeZoneIdToIANATimeZoneName[SPTimeZoneNameToSPTimeZoneId[_spPageContextInfo.webTimeZoneData.Description]]
        });
        if (field.schema.Format === 'DateOnly') {
            strDate = strDate.split(' ')[0]
        }
        strPreviousValue = strDate
    }
    else if (field.type === 'Boolean') {
        strPreviousValue = value ? 'Si' : 'No'
    }
    else if (['Lookup', 'User', 'LookupMulti', 'UserMulti'].includes(field.type)) {
        strPreviousValue = Array.isArray(value) ? value.map(e => e.displayName ?? e.lookupValue).join(';') : value.displayName ?? value.lookupValue
    } else {
        strPreviousValue = value
    }
    return strPreviousValue
}

function transformData({ missingRowData, field }) {
    let value = null
    if (['Lookup', 'User'].includes(field.type)) {
        if (missingRowData.Values.length) {
            let data = missingRowData.Values[0]
            let name = data.Value
            let id = data.Id
            let aHref = (data.Id > -1) ? `${(_spPageContextInfo.webServerRelativeUrl !== '/') ? _spPageContextInfo.webServerRelativeUrl + '/' : '/'}${missingRowData.Url}?ID=${data.Id}` : '#'
            if ('User' === field.type) {
                value = {
                    id,
                    displayName: name,
                    aHref
                }
            }
            else {
                value = {
                    lookupId: id,
                    lookupValue: name,
                    aHref
                }
            }
        }
    }
    else if (['LookupMulti', 'UserMulti'].includes(field.type)) {
        if (missingRowData.Values.length) {
            value = []
            for (let i = 0; i < missingRowData.Values.length; i++) {
                let data = missingRowData.Values[i]
                let name = data.Value
                let id = data.Id
                let aHref = (data.Id > -1) ? `${(_spPageContextInfo.webServerRelativeUrl !== '/') ? _spPageContextInfo.webServerRelativeUrl + '/' : '/'}${missingRowData.Url}?ID=${data.Id}` : '#'
                if ('UserMulti' === field.type) {
                    value.push({
                        id,
                        displayName: name,
                        aHref
                    })
                } else {
                    value.push({
                        lookupId: id,
                        lookupValue: name,
                        aHref
                    })
                }

            }
        }
    }
    else {
        value = missingRowData.ValueOverride
    }
    return value
}

function transformDataAPIInInnerHTMLValue({ field, value }) {
    let retInnerHTML = ''
    if (value === null || value === '') return retInnerHTML
    if (field.type === 'DateTime' || field.type === 'Calculated' && field.schema.ResultType === 'DateTime') {
        let strDate = getFormatedDateStr(value)
        if (field.schema.Format === 'DateOnly') {
            strDate = strDate.split(' ')[0]
        }
        retInnerHTML = `<span class="ms-noWrap" title="${strDate}">${strDate}</span>`
    }
    else if (field.type === 'Boolean') {
        let strBoolean = value ? 'Si' : 'No'
        retInnerHTML = `<span class="ms-noWrap" title="${strBoolean}">${strBoolean}</span>`
    }
    else if (['Lookup', 'User', 'LookupMulti', 'UserMulti'].includes(field.type)) {
        retInnerHTML = Array.isArray(value) ? value.map(e => getUserOrLookupSpanElement({ ...e })).join('') : getUserOrLookupSpanElement({ ...value })
    } else {
        retInnerHTML = `<span class="ms-noWrap" title="${value}">${value}</span>`
    }
    return retInnerHTML
}

function getUserOrLookupSpanElement({ id, displayName, lookupValue, lookupId, aHref }) {
    let name = displayName ?? lookupValue
    let _id = id ?? lookupId
    let href = aHref
    let linkFunction = _id < 0 ?
        (displayName ?
            "alert('Usuario no existe en el sitio actual'); return false;" :
            "alert('El elemento no existe en el sitio actual'); return false;") :
        'GoToLinkOrDialogNewWindow(this); return false;'
    let titleTootltip = ''
    if (_id < 0) {
        titleTootltip = displayName ?
            'title="Usuario no existe en el sitio actual"' :
            'title="El elemento no existe en el sitio actual"'
    }
    let strHTML =
        `<span style="display:flex" ${_id < 0 ? titleTootltip : ''}>
            <span class="ms-imnSpan">
                <a href="#" class="ms-imnlink ms-spimn-presenceLink" tabindex="-1">
                    <span class="ms-spimn-presenceWrapper ms-imnImg ms-spimn-imgSize-10x10">
                        <img name="imnmark" title="" showofflinepawn="1" class="ms-spimn-img ms-spimn-presence-disconnected-10x10x32" src="/_layouts/15/images/spimn.png?rev=47" alt="Sin información de presencia" >
                    </span>
                </a>
            </span>
            <span class="ms-noWrap ms-imnSpan">
                <a href="#" onclick="" class="ms-imnlink" tabindex="-1">
                    <img name="imnmark" title="" showofflinepawn="1" class=" ms-hide" src="/_layouts/15/images/spimn.png?rev=47" alt="Sin información de presencia">
                </a>
                <a class="ms-subtleLink" onclick="${linkFunction}" href="${href}">${name}</a>
            </span>
        </span>`
    return strHTML
}

function getFormatedDateStr(value) {
    let strDate = new Date(value).toLocaleDateString(_spPageContextInfo.currentCultureName, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: SPTimeZoneIdToIANATimeZoneName[SPTimeZoneNameToSPTimeZoneId[_spPageContextInfo.webTimeZoneData.Description]]
    });
    return strDate
}

const SPTimeZoneIdToIANATimeZoneName = {
    "2": "Europe/London",
    "3": "Europe/Paris",
    "4": "Europe/Berlin",
    "5": "Europe/Bucharest",
    "6": "Europe/Budapest",
    "7": "Europe/Kaliningrad",
    "8": "America/Sao_Paulo",
    "9": "America/Halifax",
    "10": "America/New_York",
    "11": "America/Chicago",
    "12": "America/Denver",
    "13": "America/Los_Angeles",
    "14": "America/Anchorage",
    "15": "Pacific/Honolulu",
    "16": "Pacific/Apia",
    "17": "Pacific/Auckland",
    "18": "Australia/Brisbane",
    "19": "Australia/Adelaide",
    "20": "Asia/Tokyo",
    "21": "Asia/Singapore",
    "22": "Asia/Bangkok",
    "23": "Asia/Kolkata",
    "24": "Asia/Dubai",
    "25": "Asia/Tehran",
    "26": "Asia/Baghdad",
    "27": "Asia/Jerusalem",
    "28": "America/St_Johns",
    "29": "Atlantic/Azores",
    "30": "Etc/GMT+2",
    "31": "Atlantic/Reykjavik",
    "32": "America/Cayenne",
    "33": "America/La_Paz",
    "34": "America/Indianapolis",
    "35": "America/Bogota",
    "36": "America/Regina",
    "37": "America/Mexico_City",
    "38": "America/Phoenix",
    "39": "Etc/GMT+12",
    "40": "Pacific/Fiji",
    "41": "Asia/Magadan",
    "42": "Australia/Hobart",
    "43": "Pacific/Port_Moresby",
    "44": "Australia/Darwin",
    "45": "Asia/Shanghai",
    "46": "Asia/Novosibirsk",
    "47": "Asia/Tashkent",
    "48": "Asia/Kabul",
    "49": "Africa/Cairo",
    "50": "Africa/Johannesburg",
    "51": "Europe/Moscow",
    "53": "Atlantic/Cape_Verde",
    "54": "Asia/Baku",
    "55": "America/Guatemala",
    "56": "Africa/Nairobi",
    "57": "Europe/Warsaw",
    "58": "Asia/Yekaterinburg",
    "59": "Europe/Kiev",
    "60": "America/Godthab",
    "61": "Asia/Rangoon",
    "62": "Asia/Katmandu",
    "63": "Asia/Irkutsk",
    "64": "Asia/Krasnoyarsk",
    "65": "America/Santiago",
    "66": "Asia/Colombo",
    "67": "Pacific/Tongatapu",
    "68": "Asia/Vladivostok",
    "69": "Africa/Lagos",
    "70": "Asia/Yakutsk",
    "71": "Asia/Almaty",
    "72": "Asia/Seoul",
    "73": "Australia/Perth",
    "74": "Asia/Riyadh",
    "75": "Asia/Taipei",
    "76": "Australia/Sydney",
    "77": "America/Chihuahua",
    "78": "America/Santa_Isabel",
    "79": "Asia/Amman",
    "80": "Asia/Beirut",
    "81": "America/Manaus",
    "82": "Asia/Tbilisi",
    "83": "Africa/Windhoek",
    "84": "Asia/Yerevan",
    "85": "America/Buenos_Aires",
    "86": "Africa/Casablanca",
    "87": "Asia/Karachi",
    "88": "America/Caracas",
    "89": "Indian/Mauritius",
    "90": "America/Montevideo",
    "91": "America/Asuncion",
    "92": "Asia/Kamchatka",
    "93": "UTC",
    "94": "Asia/Ulaanbaatar",
    "95": "Etc/GMT+11",
    "96": "Etc/GMT+2",
    "97": "Etc/GMT-12",
    "98": "Asia/Damascus",
    "99": "Asia/Magadan",
    "100": "Europe/Kaliningrad",
    "101": "Europe/Istanbul",
    "102": "Asia/Dhaka",
    "103": "America/Bahia"

}
const SPTimeZoneIdToSPTimeZoneName = {
    "39": "(UTC-12:00) International Date Line West",
    "95": "(UTC-11:00) Coordinated Universal Time-11",
    "15": "(UTC-10:00) Hawaii",
    "14": "(UTC-09:00) Alaska",
    "78": "(UTC-08:00) Baja California",
    "13": "(UTC-08:00) Pacific Time (US and Canada)",
    "38": "(UTC-07:00) Arizona",
    "77": "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
    "12": "(UTC-07:00) Mountain Time (US and Canada)",
    "55": "(UTC-06:00) Central America",
    "11": "(UTC-06:00) Central Time (US and Canada)",
    "37": "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
    "36": "(UTC-06:00) Saskatchewan",
    "35": "(UTC-05:00) Bogota, Lima, Quito",
    "10": "(UTC-05:00) Eastern Time (US and Canada)",
    "34": "(UTC-05:00) Indiana (East)",
    "88": "(UTC-04:30) Caracas",
    "91": "(UTC-04:00) Asuncion",
    "9": "(UTC-04:00) Atlantic Time (Canada)",
    "81": "(UTC-04:00) Cuiaba",
    "33": "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
    "28": "(UTC-03:30) Newfoundland",
    "8": "(UTC-03:00) Brasilia",
    "85": "(UTC-03:00) Buenos Aires",
    "32": "(UTC-03:00) Cayenne, Fortaleza",
    "60": "(UTC-03:00) Greenland",
    "90": "(UTC-03:00) Montevideo",
    "103": "(UTC-03:00) Salvador",
    "65": "(UTC-03:00) Santiago",
    "96": "(UTC-02:00) Coordinated Universal Time-02",
    "30": "(UTC-02:00) Mid-Atlantic",
    "29": "(UTC-01:00) Azores",
    "53": "(UTC-01:00) Cabo Verde",
    "86": "(UTC) Casablanca",
    "93": "(UTC) Coordinated Universal Time",
    "2": "(UTC) Dublin, Edinburgh, Lisbon, London",
    "31": "(UTC) Monrovia, Reykjavik",
    "4": "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
    "6": "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
    "3": "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
    "57": "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
    "69": "(UTC+01:00) West Central Africa",
    "83": "(UTC+01:00) Windhoek",
    "79": "(UTC+02:00) Amman",
    "5": "(UTC+02:00) Athens, Bucharest, Istanbul",
    "80": "(UTC+02:00) Beirut",
    "49": "(UTC+02:00) Cairo",
    "98": "(UTC+02:00) Damascus",
    "50": "(UTC+02:00) Harare, Pretoria",
    "59": "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
    "101": "(UTC+02:00) Istanbul",
    "27": "(UTC+02:00) Jerusalem",
    "7": "(UTC+02:00) Minsk (old)",
    "104": "(UTC+02:00) E. Europe",
    "100": "(UTC+02:00) Kaliningrad (RTZ 1)",
    "26": "(UTC+03:00) Baghdad",
    "74": "(UTC+03:00) Kuwait, Riyadh",
    "109": "(UTC+03:00) Minsk",
    "51": "(UTC+03:00) Moscow, St. Petersburg, Volgograd (RTZ 2)",
    "56": "(UTC+03:00) Nairobi",
    "25": "(UTC+03:30) Tehran",
    "24": "(UTC+04:00) Abu Dhabi, Muscat",
    "54": "(UTC+04:00) Baku",
    "106": "(UTC+04:00) Izhevsk, Samara (RTZ 3)",
    "89": "(UTC+04:00) Port Louis",
    "82": "(UTC+04:00) Tbilisi",
    "84": "(UTC+04:00) Yerevan",
    "48": "(UTC+04:30) Kabul",
    "58": "(UTC+05:00) Ekaterinburg (RTZ 4)",
    "87": "(UTC+05:00) Islamabad, Karachi",
    "47": "(UTC+05:00) Tashkent",
    "23": "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
    "66": "(UTC+05:30) Sri Jayawardenepura",
    "62": "(UTC+05:45) Kathmandu",
    "71": "(UTC+06:00) Astana",
    "102": "(UTC+06:00) Dhaka",
    "46": "(UTC+06:00) Novosibirsk (RTZ 5)",
    "61": "(UTC+06:30) Yangon (Rangoon)",
    "22": "(UTC+07:00) Bangkok, Hanoi, Jakarta",
    "64": "(UTC+07:00) Krasnoyarsk (RTZ 6)",
    "45": "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
    "63": "(UTC+08:00) Irkutsk (RTZ 7)",
    "21": "(UTC+08:00) Kuala Lumpur, Singapore",
    "73": "(UTC+08:00) Perth",
    "75": "(UTC+08:00) Taipei",
    "94": "(UTC+08:00) Ulaanbaatar",
    "20": "(UTC+09:00) Osaka, Sapporo, Tokyo",
    "72": "(UTC+09:00) Seoul",
    "70": "(UTC+09:00) Yakutsk (RTZ 8)",
    "19": "(UTC+09:30) Adelaide",
    "44": "(UTC+09:30) Darwin",
    "18": "(UTC+10:00) Brisbane",
    "76": "(UTC+10:00) Canberra, Melbourne, Sydney",
    "43": "(UTC+10:00) Guam, Port Moresby",
    "42": "(UTC+10:00) Hobart",
    "99": "(UTC+10:00) Magadan",
    "68": "(UTC+10:00) Vladivostok, Magadan (RTZ 9)",
    "107": "(UTC+11:00) Chokurdakh (RTZ 10)",
    "41": "(UTC+11:00) Solomon Is., New Caledonia",
    "108": "(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky (RTZ 11)",
    "17": "(UTC+12:00) Auckland, Wellington",
    "97": "(UTC+12:00) Coordinated Universal Time+12",
    "40": "(UTC+12:00) Fiji",
    "92": "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
    "67": "(UTC+13:00) Nuku'alofa",
    "16": "(UTC+13:00) Samoa"
}
const SPTimeZoneNameToSPTimeZoneId = {
    "(UTC-12:00) International Date Line West": "39",
    "(UTC-11:00) Coordinated Universal Time-11": "95",
    "(UTC-10:00) Hawaii": "15",
    "(UTC-09:00) Alaska": "14",
    "(UTC-08:00) Baja California": "78",
    "(UTC-08:00) Pacific Time (US and Canada)": "13",
    "(UTC-07:00) Arizona": "38",
    "(UTC-07:00) Chihuahua, La Paz, Mazatlan": "77",
    "(UTC-07:00) Mountain Time (US and Canada)": "12",
    "(UTC-06:00) Central America": "55",
    "(UTC-06:00) Central Time (US and Canada)": "11",
    "(UTC-06:00) Guadalajara, Mexico City, Monterrey": "37",
    "(UTC-06:00) Saskatchewan": "36",
    "(UTC-05:00) Bogota, Lima, Quito": "35",
    "(UTC-05:00) Eastern Time (US and Canada)": "10",
    "(UTC-05:00) Indiana (East)": "34",
    "(UTC-04:30) Caracas": "88",
    "(UTC-04:00) Asuncion": "91",
    "(UTC-04:00) Atlantic Time (Canada)": "9",
    "(UTC-04:00) Cuiaba": "81",
    "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan": "33",
    "(UTC-03:30) Newfoundland": "28",
    "(UTC-03:00) Brasilia": "8",
    "(UTC-03:00) Buenos Aires": "85",
    "(UTC-03:00) Cayenne, Fortaleza": "32",
    "(UTC-03:00) Greenland": "60",
    "(UTC-03:00) Montevideo": "90",
    "(UTC-03:00) Salvador": "103",
    "(UTC-03:00) Santiago": "65",
    "(UTC-02:00) Coordinated Universal Time-02": "96",
    "(UTC-02:00) Mid-Atlantic": "30",
    "(UTC-01:00) Azores": "29",
    "(UTC-01:00) Cabo Verde": "53",
    "(UTC) Casablanca": "86",
    "(UTC) Coordinated Universal Time": "93",
    "(UTC) Dublin, Edinburgh, Lisbon, London": "2",
    "(UTC) Monrovia, Reykjavik": "31",
    "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna": "4",
    "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague": "6",
    "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris": "3",
    "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb": "57",
    "(UTC+01:00) West Central Africa": "69",
    "(UTC+01:00) Windhoek": "83",
    "(UTC+02:00) Amman": "79",
    "(UTC+02:00) Athens, Bucharest, Istanbul": "5",
    "(UTC+02:00) Beirut": "80",
    "(UTC+02:00) Cairo": "49",
    "(UTC+02:00) Damascus": "98",
    "(UTC+02:00) Harare, Pretoria": "50",
    "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius": "59",
    "(UTC+02:00) Istanbul": "101",
    "(UTC+02:00) Jerusalem": "27",
    "(UTC+02:00) Minsk (old)": "7",
    "(UTC+02:00) E. Europe": "104",
    "(UTC+02:00) Kaliningrad (RTZ 1)": "100",
    "(UTC+03:00) Baghdad": "26",
    "(UTC+03:00) Kuwait, Riyadh": "74",
    "(UTC+03:00) Minsk": "109",
    "(UTC+03:00) Moscow, St. Petersburg, Volgograd (RTZ 2)": "51",
    "(UTC+03:00) Nairobi": "56",
    "(UTC+03:30) Tehran": "25",
    "(UTC+04:00) Abu Dhabi, Muscat": "24",
    "(UTC+04:00) Baku": "54",
    "(UTC+04:00) Izhevsk, Samara (RTZ 3)": "106",
    "(UTC+04:00) Port Louis": "89",
    "(UTC+04:00) Tbilisi": "82",
    "(UTC+04:00) Yerevan": "84",
    "(UTC+04:30) Kabul": "48",
    "(UTC+05:00) Ekaterinburg (RTZ 4)": "58",
    "(UTC+05:00) Islamabad, Karachi": "87",
    "(UTC+05:00) Tashkent": "47",
    "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi": "23",
    "(UTC+05:30) Sri Jayawardenepura": "66",
    "(UTC+05:45) Kathmandu": "62",
    "(UTC+06:00) Astana": "71",
    "(UTC+06:00) Dhaka": "102",
    "(UTC+06:00) Novosibirsk (RTZ 5)": "46",
    "(UTC+06:30) Yangon (Rangoon)": "61",
    "(UTC+07:00) Bangkok, Hanoi, Jakarta": "22",
    "(UTC+07:00) Krasnoyarsk (RTZ 6)": "64",
    "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi": "45",
    "(UTC+08:00) Irkutsk (RTZ 7)": "63",
    "(UTC+08:00) Kuala Lumpur, Singapore": "21",
    "(UTC+08:00) Perth": "73",
    "(UTC+08:00) Taipei": "75",
    "(UTC+08:00) Ulaanbaatar": "94",
    "(UTC+09:00) Osaka, Sapporo, Tokyo": "20",
    "(UTC+09:00) Seoul": "72",
    "(UTC+09:00) Yakutsk (RTZ 8)": "70",
    "(UTC+09:30) Adelaide": "19",
    "(UTC+09:30) Darwin": "44",
    "(UTC+10:00) Brisbane": "18",
    "(UTC+10:00) Canberra, Melbourne, Sydney": "76",
    "(UTC+10:00) Guam, Port Moresby": "43",
    "(UTC+10:00) Hobart": "42",
    "(UTC+10:00) Magadan": "99",
    "(UTC+10:00) Vladivostok, Magadan (RTZ 9)": "68",
    "(UTC+11:00) Chokurdakh (RTZ 10)": "107",
    "(UTC+11:00) Solomon Is., New Caledonia": "41",
    "(UTC+12:00) Anadyr, Petropavlovsk-Kamchatsky (RTZ 11)": "108",
    "(UTC+12:00) Auckland, Wellington": "17",
    "(UTC+12:00) Coordinated Universal Time+12": "97",
    "(UTC+12:00) Fiji": "40",
    "(UTC+12:00) Petropavlovsk-Kamchatsky - Old": "92",
    "(UTC+13:00) Nuku'alofa": "67",
    "(UTC+13:00) Samoa": "16"
}
