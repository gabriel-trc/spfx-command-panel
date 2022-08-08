
let memoize
let exceptionHandler
let getUserLoginNameById

async function mvdInitializeModule() {
    const modules = await MVD.importScripts(['sp-helpers/utilities', 'sp-helpers/exeptions']);
    ({ memoize } = modules[0]);
    ({ exceptionHandler } = modules[1]);

    getUserLoginNameById = memoize(async function getUserLoginNameById(userId) {
        let response = await fetch(_spPageContextInfo.webAbsoluteUrl + '/_api/Web/GetUserById(' + userId + ')', {
            method: 'GET',
            headers: {
                'X-RequestDigest': (document.getElementById('__REQUESTDIGEST')?.value || ''),
                'content-type': 'application/json;odata=verbose',
                'accept': 'application/json;odata=verbose'
            }
        });
        if (!response.ok) {
            console.error("Error-HTTP: " + response.status);
            return '';
        }
        let json = await response.json();
        return json.d.LoginName;
    })
}

function bindValueChangedByInternalName(internalName, eventFunction) {
    let fieldInfo = getFieldInfoByInternalName(internalName)
    if (!fieldInfo) {
        console.error('No existe en el formulario el campo de nombre interno ' + internalName)
        return
    }
    if (['SPFieldLookupMulti'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('select[id$="_SelectResult"]');
        let config = {
            attributes: true,
            attributeFilter: ["data-dispatchValueChanged"],
            childList: true
        }
        let callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    eventFunction(internalName)
                }
            }
        }
        let observer = new MutationObserver(callback)
        observer.observe(element, config)
    }
    else if (['SPFieldChoice'].includes(fieldInfo.type)) {
        if (fieldInfo.td.querySelector('select')) {
            let element = fieldInfo.td.querySelector('select')
            element.addEventListener('change', function () { eventFunction(internalName) }, false)
            let elementFillInChoice = fieldInfo.td.querySelector('input[id$="_$FillInChoice"]')
            if (elementFillInChoice) {
                elementFillInChoice.addEventListener('change', function () { eventFunction(internalName) }, false)
            }
        } else {
            let elements = fieldInfo.td.querySelectorAll('input[type="radio"]')
            elements.forEach(element => {
                if (element.id.endsWith('_$RadioButtonChoiceFieldFillInRadio')) {
                    let fllInChoice = fieldInfo.td.querySelector('input[type="text"]')
                    fllInChoice.addEventListener('change', function () { eventFunction(internalName) }, false)
                } else {
                    element.addEventListener('change', function () { eventFunction(internalName) }, false)
                }
            })
        }
    }
    else if (['SPFieldLookup'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('select')
        element.addEventListener('change', function () { eventFunction(internalName) }, false)
    }
    else if (['SPFieldNote'].includes(fieldInfo.type)) {
        if (fieldInfo.internalName.startsWith('MVDRF_')) {
            MVD.importScripts(['relation-field/index'])
                .then(function (modules) {
                    let { subscribeToActionCompleteGridsPointerFunctionByInternalName } = modules[0]
                    subscribeToActionCompleteGridsPointerFunctionByInternalName(internalName, function (args) {
                        if (['add', 'edit'].includes(args.action) && args.requestType === 'save') {
                            eventFunction(internalName)
                        } else if (['delete'].includes(args.action) && args.requestType === 'delete') {
                            eventFunction(internalName)
                        }
                    })
                })
        }
        else if (fieldInfo.td.querySelector('textarea')) {
            let element = fieldInfo.td.querySelector('textarea')
            element.addEventListener('change', function () { eventFunction(internalName) }, false)
        } else {
            let element = fieldInfo.td.querySelector('div[contenteditable]')
            if (typeof element.oldTextContent === 'undefined') {
                element.oldTextContent = element.textContent
            }
            element.addEventListener('blur', function (event) {
                if (event.target.oldTextContent !== event.target.textContent) {
                    event.target.oldTextContent = event.target.textContent
                    eventFunction(event)
                }
            }, false)
        }
    }
    else if (['SPFieldMultiChoice'].includes(fieldInfo.type)) {
        let elements = fieldInfo.td.querySelectorAll('input[type="checkbox"]')
        elements.forEach(element => {
            if (element.id.endsWith('FillInRadio')) {
                let fllInChoice = fieldInfo.td.querySelector('input[type="text"]')
                fllInChoice.addEventListener('change', function () { eventFunction(internalName) }, false)
            } else {
                element.addEventListener('change', function () { eventFunction(internalName) }, false)
            }
        })
    }
    else if (['SPFieldDateTime'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('input')
        element.addEventListener('blur', function (event) {
            if ((typeof event.currentTarget.oldValue == 'undefined' && event.currentTarget.value) || event.currentTarget.oldValue != event.currentTarget.value) {
                eventFunction(internalName)
                event.currentTarget.oldValue = event.currentTarget.value
            }
        }, false)
        let selectsElements = fieldInfo.td.querySelectorAll('select')
        selectsElements.forEach(select => select.addEventListener('change', function () { eventFunction(internalName) }, false))
    }
    else if (['SPFieldUser', 'SPFieldUserMulti'].includes(fieldInfo.type)) {
        //let element = fieldInfo.td.querySelector('input[id$="_HiddenInput"]')
        //element.addEventListener('change', function(){eventFunction(internalName)}, false)
        let element = fieldInfo.td.querySelector('.sp-peoplepicker-resolveList')
        let config = { childList: true }
        let callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    eventFunction(internalName)
                }
            }
        }
        let observer = new MutationObserver(callback)
        observer.observe(element, config)
    }
    else if (['SPFieldURL'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('input[id$="_$UrlFieldUrl"]')
        element.addEventListener('change', function () { eventFunction(internalName) }, false)
    }
    else {
        let element = fieldInfo.td.querySelector('input');
        element.addEventListener('change', function () { eventFunction(internalName) }, false)
    }
}

function dispatchValueChangedByInternalName(internalName) {
    let fieldInfo = getFieldInfoByInternalName(internalName)
    if (!fieldInfo) throw ('No existe en el formulario el campo de nombre interno ' + internalName)
    if (['SPFieldLookupMulti'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('select[id$="_SelectResult"]');
        element.setAttribute('data-dispatchValueChanged', '1')
    }
    else if (['SPFieldChoice'].includes(fieldInfo.type)) {
        if (fieldInfo.td.querySelector('select')) {
            let element = fieldInfo.td.querySelector('select')
            element.dispatchEvent(new Event('change'))
        } else {
            let element = fieldInfo.td.querySelector('input[type="radio"]')
            element.dispatchEvent(new Event('change'))
        }
    }
    else if (['SPFieldLookup'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('select')
        element.dispatchEvent(new Event('change'))
    }
    else if (['SPFieldNote'].includes(fieldInfo.type)) {
        if (fieldInfo.td.querySelector('textarea')) {
            let element = fieldInfo.td.querySelector('textarea')
            element.dispatchEvent(new Event('change'))
        } else {
            let element = fieldInfo.td.querySelector('div[contenteditable]')
            element.oldTextContent = ''
            element.dispatchEvent(new Event('blur'))
        }
    }
    else if (['SPFieldMultiChoice'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('input[type="checkbox"]')
        element.dispatchEvent(new Event('change'))
    }
    else if (['SPFieldDateTime'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('input')
        delete element.oldValue
        element.dispatchEvent(new Event('change'))
    }
    else if (['SPFieldUser', 'SPFieldUserMulti'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('.sp-peoplepicker-resolveList')
        element.setAttribute('data-dispatchValueChanged', '1')
    }
    else if (['SPFieldURL'].includes(fieldInfo.type)) {
        let element = fieldInfo.td.querySelector('input[id$="_$UrlFieldUrl"]')
        element.dispatchEvent(new Event('change'))
    }
    else {
        let element = fieldInfo.td.querySelector('input')
        element.dispatchEvent(new Event('change'))
    }

}

/**
 * Obtener toda la informacion de los campos del formulario
 * @return Array con la indormaciÃ³n de todos los campos que contiene el forumlario.
 **/
function getAllFieldsInfo() {
    let formFieldsInfo = [];
    let nodeIterator = document.createNodeIterator(document.body, NodeFilter.SHOW_COMMENT, {
        acceptNode: function (node) {
            if (node.data.toLowerCase().indexOf('fieldinternalname=') > -1) {
                return NodeFilter.FILTER_ACCEPT
            }
        }
    }, false);

    let node = null;
    while (node = nodeIterator.nextNode()) {
        const comments = node.data.trim().replace(/\n/g, '').match(/(?:"[^"]*"|^[^"]*$)/g).map(e => e.replace(/"/g, ''));
        let info = {
            tr: node.parentElement.parentElement,
            td: node.parentElement,
            type: comments[2],
            displayName: comments[0],
            internalName: comments[1]
        };
        formFieldsInfo.push(info)
    }
    return formFieldsInfo;
}

function getFieldInfoByInternalName(internalName, nodeRoot) {
    let info = null;
    const internalNameLowerCase = internalName.toLowerCase();
    if (typeof nodeRoot === 'undefined') nodeRoot = document.body;
    let nodeIterator = document.createNodeIterator(nodeRoot, NodeFilter.SHOW_COMMENT, {
        acceptNode: function (node) {
            if (node.data.toLowerCase().indexOf(' fieldinternalname="' + internalNameLowerCase + '"') > -1) {
                return NodeFilter.FILTER_ACCEPT
            }
        }
    }, false);
    const node = nodeIterator.nextNode();
    if (node) {
        const comments = node.data.trim().replace(/\n/g, '').match(/(?:"[^"]*"|^[^"]*$)/g).map(e => e.replace(/"/g, ''));
        info = {
            tr: node.parentElement.parentElement,
            td: node.parentElement,
            type: comments[2],
            displayName: comments[0],
            internalName: comments[1]
        };
    }
    return info;
}

function getFieldInfoByTitle(title, nodeRoot) {
    let info = null;
    const titleLowerCase = title.toLowerCase();
    if (typeof nodeRoot === 'undefined') nodeRoot = document.body;
    let nodeIterator = document.createNodeIterator(nodeRoot, NodeFilter.SHOW_COMMENT, {
        acceptNode: function (node) {
            if (node.data.toLowerCase().indexOf(' fieldname="' + titleLowerCase + '"') > -1) {
                return NodeFilter.FILTER_ACCEPT
            }
        }
    }, false);
    const node = nodeIterator.nextNode();
    if (node) {
        const comments = node.data.trim().replace(/\n/g, '').match(/(?:"[^"]*"|^[^"]*$)/g).map(e => e.replace(/"/g, ''));
        info = {
            tr: node.parentElement.parentElement,
            td: node.parentElement,
            type: comments[2],
            displayName: comments[0],
            internalName: comments[1]
        };
    }
    return info;
}

function getFieldInfoByElement(nodeTr) {
    let info = null;
    let nodeIterator = document.createNodeIterator(nodeTr, NodeFilter.SHOW_COMMENT, {
        acceptNode: function (node) {
            if (node.data.toLowerCase().indexOf('fieldinternalname=') > -1) {
                return NodeFilter.FILTER_ACCEPT
            }
        }
    }, false);
    const node = nodeIterator.nextNode()
    if (node) {
        const comments = node.data.replace(/\n?\s/g, '').replace(/=/g, '').replace(/'/g, '"');
        const splitCommnets = comments.split('"');
        info = {
            tr: node.parentElement.parentElement,
            td: node.parentElement,
            type: splitCommnets[5],
            displayName: splitCommnets[1],
            internalName: splitCommnets[3]
        };
    }
    return info;
}

function openMultipleChoiceAndRemoveNotAllowedFields(fields, listUrl) {
    let fieldsToAdd = [];
    fields = fields.filter(function (field) {
        let retValue = true;
        if (field.internalName.startsWith('MVDRF_')) retValue = false;
        else if (field.type === 'MVDRelationPropertyField') retValue = false;
        else if (listUrl.includes('/lists') && field.internalName === 'FileLeafRef') retValue = false;
        else if (!listUrl.includes('/lists') && field.internalName === 'Title') retValue = false;
        return retValue;
    });
    fields.forEach(function (field) {
        if (field.type === 'MultiChoice') {
            field.schema.OpenField = true;
            const choices = field.schema.CHOICES.CHOICE;
            let fillInChoice = (field.schema.FillInChoice === 'TRUE');
            if (fillInChoice) {
                fieldsToAdd.push({
                    name: field.name + ' - Rellenar',
                    internalName: field.internalName + '__FillInChoice',
                    type: 'Boolean',
                    schema: {
                        Type: 'Boolean',
                        OpenFrom: field.internalName,
                    },
                    allowedUseInUI: false,
                });
            }
            choices.forEach(function (choice, index) {
                let auxField = {};
                auxField.name = field.name + ' - ' + choice;
                auxField.internalName = field.internalName + '__' + index;
                auxField.type = 'Boolean';
                auxField.schema = {
                    Type: 'Boolean',
                    OpenFrom: field.internalName,
                };
                auxField.allowedUseInUI = false;
                fieldsToAdd.push(auxField);
            });
        }
        else if (field.type === 'GridChoice') {
            field.schema.OpenField = true;
            const choices = (Array.isArray(field.schema.CHOICES.CHOICE)) ? field.schema.CHOICES.CHOICE : new Array(field.schema.CHOICES.CHOICE);
            choices.forEach(function (choice, index) {
                let auxField = {};
                auxField.name = field.name + ' - ' + choice;
                auxField.internalName = field.internalName + '__' + index
                auxField.type = 'Number';
                auxField.schema = {
                    Type: 'Number',
                    OpenFrom: field.internalName,
                };
                auxField.allowedUseInUI = false;
                fieldsToAdd.push(auxField);
            });
        }
        field.allowedUseInUI = true;
    })
    fields = fields.concat(fieldsToAdd).sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    return fields;
}

function getTDFieldByInternalName(internalName) {
    var info = getFieldInfoByInternalName(internalName);
    if (info) {
        return info.td;
    }
    return null;
}

function setDisabledByInternalName(internalName, disabled) {
    let info = getFieldInfoByInternalName(internalName);
    if (info !== null) {
        info.td.querySelectorAll('*')
            .forEach(element => element.setAttribute('disabled', disabled));
    }
}

function setReadonlyByInternalName(internalName, readonly) {
    var info = getFieldInfoByInternalName(internalName);
    if (info != null) {
        if (info.td.querySelectorAll('input, textarea').length)
            info.td.querySelectorAll('input, textarea').forEach(e => e.setAttribute('readonly', readonly))
        if (info.td.querySelectorAll('select').length)
            info.td.querySelectorAll('select').forEach(e => e.setAttribute('disabled', readonly))
        if (info.td.querySelectorAll('div, table').length)
            info.td.querySelectorAll('div, table')
                .forEach(e =>
                    e.querySelectorAll("input, textarea, a").forEach(el => el.setAttribute('disabled', readonly))
                )

        if (readonly) {
            info.td.querySelectorAll('.sp-peoplepicker-delImage').forEach(e => e.style.display = 'none')
            info.td.querySelectorAll('div, table')
                .forEach(e =>
                    e.querySelectorAll('a').forEach(
                        el => el.addEventListener("click", function (event) {
                            if (event.target.getAttribute('disabled')) {
                                event.preventDefault();
                            }
                        })
                    )
                )
        } else {
            info.td.querySelectorAll('.sp-peoplepicker-delImage').forEach(e => e.style.display = 'initial')
        }
    }
}

function setVisibilityByInternalName(internalName, visible) {
    const info = getFieldInfoByInternalName(internalName);
    if (info != null) {
        info.tr.style.display = (visible) ? 'table-row' : 'none';
        const prevRow = info.tr.previousElementSibling;
        if (prevRow && !getFieldInfoByElement(prevRow)) {
            prevRow.style.display = (visible) ? 'table-row' : 'none';
        }
    }
}

function getModifiedFields(originalValues) {
    var ret = [];
    for (var key in originalValues) {
        if (JSON.stringify(originalValues[key]) != JSON.stringify(getFieldValueByInternalName(key))) {
            ret.push(key);
        }
    }
    return ret;
}


//-----------------------------------------------------------   Getters del forumulario   -----------------------------------------------------------//

function getFieldValueByInternalName(internalName) {
    if (internalName.toLowerCase() === 'author') {
        return getUserFromLink('#onetidinfoblock1 a.ms-peopleux-userdisplink');
    }
    if (internalName.toLowerCase() === 'editor') {
        return getUserFromLink('#onetidinfoblock2 a.ms-peopleux-userdisplink');
    }
    let info = getFieldInfoByInternalName(internalName);
    if (info === null) {
        throw ('El campo de nombre interno ' + internalName + ' no se encuentra en el fromulario.');
    }
    if (info.type === 'SPFieldText' || info.type === 'SPFieldFile') {
        return getSPFieldTextValue(info);
    } else if (info.type === 'SPFieldNote') {
        return getSPFieldNoteValue(info);
    } else if (info.type === 'SPFieldChoice' || info.type === 'SPFieldOutcomeChoice') {
        return getSPFieldChoiceValue(info);
    } else if (info.type === 'SPFieldMultiChoice') {
        return getSPFieldMultiChoiceValue(info);
    } else if (info.type === 'SPFieldNumber' || info.type === 'SPFieldCurrency') {
        return getSPFieldNumberValue(info);
    } else if (info.type === 'SPFieldDateTime') {
        return getSPFieldDateTimeValue(info);
    } else if (info.type === 'SPFieldLookup' || info.type === 'SPFieldLookupMulti') {
        return getSPFieldLookupValue(info);
    } else if (info.type === 'SPFieldBoolean') {
        return getSPFieldBooleanValue(info);
    } else if (info.type === 'SPFieldUser' || info.type === 'SPFieldUserMulti') {
        return getSPFieldUserValue(info);
    } else if (info.type === 'SPFieldURL') {
        return getSPFieldURLValue(info);
    } else if (info.type === 'SPFieldAttachments') {
        return getSPFieldAttachmentsValues(info);
    } else if (info.type === 'SPFieldLookupFieldWithPickerMulti' || info.type === 'SPFieldLookupFieldWithPicker') {
        return getSPFieldLookupFieldWithPickerValue(info);
    } else if (info.type === 'SPFieldCascadingDropDownListFieldWithFilter') {
        return getSPFieldCascadingDropDownListFieldWithFilter(info);
    } else {
        console.error('El tipo de campo ' + info.type + ' no se encuentra en el getFieldValueByInternalName.', info);
        throw ('El tipo de campo ' + info.type + ' no se encuentra en el getFieldValueByInternalName.');
    }

    function getUserFromLink(selector) {
        let linkUser = $(selector)
        let linkUserHref = linkUser.attr('href');
        let userId = linkUserHref.substring(linkUserHref.indexOf('&ID=') + 4);
        let userName = linkUser.text();
        let ret = { values: [], valuesUnresolved: [] };
        ret.values.push({ DisplayText: userName, EntityData: { SPUserID: userId, PrincipalType: 'User' } });
        return ret;
    }
}

function getSPFieldTextValue(info) {
    let value = null;
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        value = info.td.textContent.trim();
    }
    else {
        let input = info.td.querySelector('input');
        value = input.value.trim();
    }
    return value;
}

function getSPFieldNoteValue(info) {
    let value = null;
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        if (info.td.innerText.replace(/\n?\s/g, '').length !== 0) {
            value = (info.td.querySelector('div[class^="ExternalClass"]')) ? info.td.querySelector('div[class^="ExternalClass"]').innerHTML : info.td.innerText;
        }
    }
    else {
        let textarea = info.td.querySelector('textarea');
        if (textarea) {
            if (textarea.value.replace(/\n?\s/g, '').length !== 0) {
                value = textarea.value;
            }
        } else {
            let contentEditable = info.td.querySelector('div[contenteditable]');
            if (contentEditable !== null) {//mayor a uno porque en la primera posicion esta el caracter de codigo 8203 que es invisible
                if (contentEditable.innerText.replace(/\n?\s/g, '').length > 1 || contentEditable.innerHTML.indexOf('table') > 0 || contentEditable.innerHTML.indexOf('img') > 0) {
                    value = contentEditable.innerHTML;
                }
            }
        }
    }
    return value;
}

function getSPFieldChoiceValue(info) {
    let value = null;
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        value = info.td.innerText.trim();
    }
    else {
        let radioButtons = info.td.querySelectorAll('input[type="radio"]');
        let inputFill = info.td.querySelector('input[type="text"]');
        if (info.td.querySelector('select')) {
            if (radioButtons.length > 0 && radioButtons[radioButtons.length - 1].checked) {
                value = inputFill.value.trim();
            } else {
                value = info.td.querySelector('select').value;
            }
        } else {
            let radioSelected = info.td.querySelector('input[type="radio"]:checked');
            if (inputFill && radioButtons[radioButtons.length - 1].checked) {
                value = inputFill.value.trim();
            }
            else if (radioSelected) {
                value = radioSelected.value;
            }
        }
    }
    return value;
}

function getSPFieldMultiChoiceValue(info) {
    let values = [];
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        const strChoices = info.td.innerText.trim();
        const arraySplitChoices = strChoices.split(';');
        values = arraySplitChoices.map(e => e.trim());
    }
    else {
        let inputFill = info.td.querySelector('input[type="text"]');
        let checkboxButtons = info.td.querySelectorAll('input[type="checkbox"]');
        checkboxButtons.forEach(function (element, index) {
            if (element.checked) {
                if (inputFill && index === checkboxButtons.length - 1) {
                    values.push(inputFill.value.trim());
                } else {
                    values.push(element.nextElementSibling.textContent);
                }
            }
        });
    }
    return (values.length) ? values : null;
}

function getSPFieldNumberValue(info) {
    let value = null;
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        value = info.td.innerText;
    }
    else {
        let input = info.td.querySelector('input');
        value = input.value;
    }
    if (value) {
        let numberValue = convertNumber(value, _spPageContextInfo.currentCultureName);
        value = numberValue;
        if (info.td.innerText.trim().includes('%')) {
            value = value / 100;
        }
    } else {
        value = null
    }
    return value;

    function convertNumber(num, locale) {
        const { format } = new Intl.NumberFormat(locale);
        const [, decimalSign] = /^0(.)1$/.exec(format(0.1));
        return +num
            .replace(new RegExp(`[^-${decimalSign}\\d]`, 'g'), '')
            .replace(decimalSign, '.');
    }
}

function getSPFieldDateTimeValue(info) {
    let value = null;
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let strValue = info.td.innerText.trim();
        if (strValue) {
            let splitValue = strValue.split(' ');
            let strDate = splitValue[0];
            let strTime = splitValue[1];
            let date = convertDate(strDate, _spPageContextInfo.currentCultureName)
            if (strTime && isNaN(date.getTime()) === false) {
                let strTimeSplit = strTime.split(':');
                let hour = strTimeSplit[0];
                let minutes = strTimeSplit[1];
                date.setHours(hour, minutes);
            }
            value = date;
        }
    } else {
        let input = info.td.querySelector('input');
        let strValue = input.value.trim();
        if (strValue) {
            let date = convertDate(strValue, _spPageContextInfo.currentCultureName)
            let hourAndMinutesSelectors = info.td.querySelectorAll('select');
            if (hourAndMinutesSelectors.length > 0 && isNaN(date.getTime()) === false) {
                let hour = hourAndMinutesSelectors[0].value.substring(0, 2);
                let minutes = hourAndMinutesSelectors[1].value;
                date.setHours(hour, minutes);
            }
            value = date;
        }
    }
    return value;

    function convertDate(strDate, locale) {
        let year, monthIndex, day
        if (locale === 'es-ES') {
            let splitDate = strDate.split('/');
            day = splitDate[0]
            monthIndex = splitDate[1] - 1
            year = splitDate[2]
        }
        let date = new Date(year, monthIndex, day)

        const isValidDate = Boolean(+date) && date.getDate() == day;
        return isValidDate ? date : new Date(NaN)
    }
}

function getSPFieldLookupValue(info) {
    let values = [];
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let aTagArray = info.td.querySelectorAll('a');
        if (aTagArray.length) {
            aTagArray.forEach(function (aTag) {
                let aTagURL = new URL(aTag.href)
                let paramsString = aTagURL.search.substring(1);
                let searchParams = new URLSearchParams(paramsString.toUpperCase());
                values.push({
                    lookupId: Number(searchParams.get('ID')),
                    lookupValue: info.td.querySelector('a').innerText.trim()
                });
            });
        }
    } else {
        let selectors = info.td.querySelectorAll('select');
        if (selectors.length === 1) {
            let selectedOption = selectors[0].querySelector('option:checked');
            if (selectedOption && Number(selectedOption.value)) {
                values.push({
                    lookupId: Number(selectedOption.value),
                    lookupValue: selectedOption.text.trim()
                });
            }
        } else {
            let selectedOptions = selectors[1].querySelectorAll('option')
            selectedOptions.forEach(function (e) {
                values.push({
                    lookupId: Number(e.value),
                    lookupValue: e.text.trim()
                });
            });
        }
    }
    return (values.length) ? values : null;
}

function getSPFieldBooleanValue(info) {
    let value = null;
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        value = (info.td.innerText.trim().toLowerCase() !== 'no');
    } else {
        let input = info.td.querySelector('input');
        value = input.checked;
    }
    return value;
}

function getSPFieldUserValue(info) {
    let values = [];
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let aTagArray = info.td.querySelectorAll('a[class*="user"]');
        aTagArray.forEach(function (aTag) {
            let aTagURL = new URL(aTag.href)
            let paramsString = aTagURL.search.substring(1);
            let searchParams = new URLSearchParams(paramsString.toUpperCase());

            let userID = Number(searchParams.get('ID'));
            let userText = aTag.text.trim();
            values.push({
                DisplayText: userText,
                ID: userID,
                EntityData: {
                    SPUserID: userID,
                },
                Key: userText
            });
        });
    } else {
        let ppobjectDivId = info.td.querySelector('div[spclientpeoplepicker="true"]').id;
        let ppobject = SPClientPeoplePicker.SPClientPeoplePickerDict[ppobjectDivId];
        let auxVals = ppobject.GetAllUserInfo();
        auxVals.forEach(function (value) {
            if (value.IsResolved) {
                values.push(value);
            }
        });
    }
    return (values.length) ? values : null;
}

function getSPFieldURLValue(info) {
    let inputURL = info.td.querySelector('input[id$="FieldUrl"]');
    let inputDescription = info.td.querySelector('input[id$="FieldDescription"]');
    if (inputURL) {
        let urlValue = (inputURL.value === 'http://') ? '' : inputURL.value;
        return { value: urlValue, text: inputDescription.value }
    } else {
        let aTag = info.td.querySelector('a');
        if (aTag) {
            return { value: aTag.href, text: aTag.text };
        } else {
            return { value: '', text: '' };
        }
    }
}

function getSPFieldAttachmentsValues(info) {
    let values = [];
    let attachments = info.td.querySelectorAll('a');
    attachments.forEach(function (aTag) {
        values.push({
            name: aTag.innerText.trim(),
            url: aTag.href,
            action: 'none'
        })
    });
    return (values.length) ? values : null;
}

function getSPFieldLookupFieldWithPickerValue(info) {
    let values = [];
    let spanResolved = info.td.querySelectorAll('span.ms-entity-resolved');
    spanResolved.forEach(function (element) {
        let key = parseInt(element.querySelector('div').getAttribute('key'));
        let displayText = element.querySelector('div').getAttribute('displaytext');
        values.push({
            lookupId: key,
            lookupValue: displayText
        });
    });
    return (values.length) ? values : null;
}

function getSPFieldCascadingDropDownListFieldWithFilter(info) {
    let value = null;
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        value = info.td.innerText.trim();
    }
    else {
        let input = info.td.querySelector('select');
        value = input.value.trim();
    }
    return value;
}

async function getSPFieldNewFormAttachmentsValues() {
    const _AttachmentsFiles = [];
    const newAttachmentsFiles = document.getElementById('attachmentsOnClient') ? document.getElementById('attachmentsOnClient').querySelectorAll('input') : [];
    if (newAttachmentsFiles.length === 0 || newAttachmentsFiles.length === 1) {
        return _AttachmentsFiles;
    }
    else {
        for (let i = 0; i < newAttachmentsFiles.length; i++) {
            const file = newAttachmentsFiles[i].files
            if (file.length === 0) continue;
            const arrayBuffer = await getArrayBuffer(file[0])
            let attachment = {
                name: file[0].name,
                arrayBuffer: arrayBuffer,
                action: 'add'
            };
            _AttachmentsFiles.push(attachment);
        }
        return _AttachmentsFiles;
    }
    function getArrayBuffer(file) {
        return new Promise(function (resolve, reject) {
            const reader = new FileReader()
            reader.onload = function (e) {
                resolve(e.target.result)
            }
            reader.onerror = function (e) {
                reject(e.target.error)
            }
            reader.readAsArrayBuffer(file)
        })
    }
}


//-----------------------------------------------------------   Setters del forumulario   -----------------------------------------------------------//

function setFieldValueByInternalName(internalName, value) {
    const info = getFieldInfoByInternalName(internalName);
    if (info == null) {
        console.error('El campo de nombre interno ' + internalName + ' no se encuentra en el fromulario.')
        return null;
    }
    if (info.type === 'SPFieldText' || info.type === 'SPFieldFile') {
        return setSPFieldTextValue(info, value);
    } else if (info.type === 'SPFieldNote') {
        return setSPFieldNoteValue(info, value);
    } else if (info.type === 'SPFieldChoice' || info.type === 'SPFieldOutcomeChoice') {
        return setSPFieldChoiceValue(info, value);
    } else if (info.type === 'SPFieldMultiChoice') {
        return setSPFieldMultiChoiceValue(info, value);
    } else if (info.type === 'SPFieldNumber' || info.type === 'SPFieldCurrency') {
        return setSPFieldNumberValue(info, value);
    } else if (info.type === 'SPFieldDateTime') {
        return setSPFieldDateTimeValue(info, value);
    } else if (info.type === 'SPFieldLookup' || info.type === 'SPFieldLookupMulti') {
        return setSPFieldLookupValue(info, value);
    } else if (info.type === 'SPFieldBoolean') {
        return setSPFieldBooleanValue(info, value);
    } else if (info.type === 'SPFieldUser' || info.type === 'SPFieldUserMulti') {
        return setSPFieldUserValue(info, value);
    } else if (info.type === 'SPFieldURL') {
        return setSPFieldURLValue(info, value);
    } else if (info.type === 'SPFieldAttachments') {
        return setSPFieldAttachments(info, value);
    } else if (info.type === 'SPFieldLookupFieldWithPickerMulti' || info.type === 'SPFieldLookupFieldWithPicker') {
        return setSPFieldLookupFieldWithPicker(info, value);
    } else if (info.type === 'SPFieldCascadingDropDownListFieldWithFilter') {
        return setSPFieldCascadingDropDownListFieldWithFilter(info, value);
    }

    else {
        console.error('El tipo de campo ' + info.type + ' no se encuentra en el setFieldValueByInternalName.', info)
        return null;
    }
}

function setSPFieldTextValue(info, value) {
    if (typeof value === 'undefined' || value === null) {
        value = '';
    };

    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + value;
    }
    else {
        let input = info.td.querySelector('input');
        input.value = value;
    }
}

function setSPFieldNoteValue(info, value) {
    value = value ?? ''
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        //let innerHTML = info.td.innerHTML.trim();
        //let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        //info.td.innerHTML = comments + value;

        let div = info.tr.querySelector('div');
        if (div.querySelector('[class^="ExternalClass"]')) {
            div = div.querySelector('[class^="ExternalClass"]');
        }
        div.innerHTML = value;
    }
    else {
        let textarea = info.td.querySelector('textarea');
        if (textarea) {
            textarea.value = value;
        } else {
            let contentEditable = info.td.querySelector('div[contenteditable]');
            contentEditable.innerHTML = value;
        }
    }
}

function setSPFieldChoiceValue(info, value) {
    if (typeof value === 'undefined' || value === null) {
        value = '';
    };

    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + value;
    } else {
        let radioButtons = info.td.querySelectorAll('input[type="radio"]');
        let inputFill = info.td.querySelector('input[type="text"]');
        if (info.td.querySelector('select')) {
            let isValueInSelect = info.td.querySelector('select').querySelector('option[value="' + value + '"]');
            if (isValueInSelect) {
                isValueInSelect.selected = true;
            } else if (inputFill) {
                radioButtons[radioButtons.length - 1].checked = true;
                inputFill.value = value;
            } else {
                info.td.querySelector('select').value = value;
                //console.error('El valor ' + value + ' no se encuentra como opciÃ³n en el campo ' + info.displayName);
            }
        } else {
            let isValueInRadioButton = info.td.querySelector('input[type="radio"][value="' + value + '"]');
            if (isValueInRadioButton) {
                info.td.querySelector('input[type="radio"][value="' + value + '"]').checked = true;
            } else if (inputFill) {
                radioButtons[radioButtons.length - 1].checked = true;
                inputFill.value = value;
            } else {
                // console.error('El valor ' + value + ' no se encuentra como opciÃ³n en el campo de nombre interno ' + info.displayName);
            }
        }
    }
}

function setSPFieldMultiChoiceValue(info, values) {
    if (typeof values === 'string') {
        let splitValues = values.split(',');
        values = splitValues.map(function (val) { return val.trim() });
    } else if (values === null) {
        values = [];
    }

    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let strValue = values.join(', ');
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + strValue;
    } else {
        let checkboxButtons = info.td.querySelectorAll('input[type="checkbox"]');
        let inputFill = info.td.querySelector('input[type="text"]');
        checkboxButtons.forEach(function (checkbox) {
            if (values.includes(checkbox.nextElementSibling.textContent)) {
                checkbox.checked = true;
                values.splice(values.indexOf(checkbox.nextElementSibling.textContent), 1)
            } else {
                checkbox.checked = false;
            }
        });
        if (inputFill && values.length > 0) {
            inputFill.value = values.join(', ');
            checkboxButtons[checkboxButtons.length - 1].checked = true;
        } else if (values.length > 0) {
            console.warn('El valor ' + values.join(', ') + ' no se encuentra como opciÃ³n en el campo ' + info.displayName);
        }
    }
}

function setSPFieldNumberValue(info, value) {
    if (value) {
        let parseNumber = new Intl.NumberFormat(_spPageContextInfo.currentCultureName, { maximumSignificantDigits: 10 }).format(value);
        value = parseNumber;
    }
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + value;
    } else {
        let input = info.td.querySelector('input');
        input.value = value;
    }
}

function setSPFieldDateTimeValue(info, value) {

    if (typeof value === 'string') {
        value = new Date(value);
    }

    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let strValue = '';
        if (value && isNaN(value.getTime()) === false) {
            strValue = new Intl.DateTimeFormat().format(new Date());
        }
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + strValue;
    } else {
        let input = info.td.querySelector('input');
        let hourAndMinutesSelectors = info.td.querySelectorAll('select');
        if (value && isNaN(value.getTime()) === false) {
            let formatDate = new Intl.DateTimeFormat().format(value);
            input.value = formatDate;
            if (hourAndMinutesSelectors.length > 0) {
                hourAndMinutesSelectors[0].value = value.getHours()
                let minutes = value.getMinutes()
                let moduleOfFive = minutes % 5;
                if (moduleOfFive) {
                    minutes = minutes + (5 - moduleOfFive)
                }
                hourAndMinutesSelectors[1].value = (minutes < 10) ? '0' + minutes : minutes

            }
        } else {
            input.value = null;
            if (hourAndMinutesSelectors.length > 0) {
                hourAndMinutesSelectors[0].value = 0;
                hourAndMinutesSelectors[1].value = '00';
            }
        }
    }
}

function setSPFieldLookupValue(info, value) {
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + value;
    } else {
        if (info.type === 'SPFieldLookup') {
            if (value && value.constructor.getName() === 'SP.FieldLookupValue') {
                value = value.get_lookupId();
            } else if (value === null) {
                value = 0;
            }
            info.td.querySelector('select').value = value;
            let isValueInSelect = info.td.querySelector('select').querySelector('option[value="' + value + '"]');
            if (isValueInSelect === null) {
                info.td.querySelector('select').value = 0;
                //console.error('El valor ' + value + ' no se encuentra como opciÃ³n en el campo ' + info.displayName);
            }
        } else {
            let selectors = info.td.querySelectorAll('select');
            let auxValues = [];
            if (value && value[0]) {
                if (value[0].constructor.getName() === 'SP.FieldLookupValue') {
                    for (let i = 0; i < value.length; i++) {
                        auxValues.push(value[i].get_lookupId());
                    }
                    value = auxValues;
                }
            } else if (value === null) {
                value = [];
            }
            let selectedOptionsToRemove = selectors[1].querySelectorAll('option');
            selectedOptionsToRemove.forEach(function (opt) {
                opt.selected = true;
            });
            info.tr.querySelector('input[id$="_RemoveButton"]').disabled = false;
            info.tr.querySelector('input[id$="_RemoveButton"]').click();

            info.td.querySelectorAll('select')[0].selectedIndex = -1
            value.forEach(function (val) {
                let option = selectors[0].querySelector('option[value="' + val + '"]');
                if (option !== null) {
                    option.selected = true;
                }
            });
            info.tr.querySelector('input[id$="_AddButton"]').disabled = false;
            info.tr.querySelector('input[id$="_AddButton"]').click();

            if (typeof selectors[2] !== 'undefined') {
                let preventCustomOnChange = selectors[1].getAttribute('data-preventCustomOnChange');
                //if (preventCustomOnChange) {
                //    selectors[1].removeAttribute('data-preventCustomOnChange');
                //} else {
                let event = new CustomEvent('change')
                event.initEvent('change', true, true);
                event.lookupMultiMaskStop = true;
                document.getElementById(selectors[1].id).dispatchEvent(event);
                //}
            }
        }
    }
}

function setSPFieldBooleanValue(info, value) {
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + ((value) ? 'Si' : 'No');
    } else {
        let input = info.td.querySelector('input');
        input.checked = Boolean(value);
    }
}

async function setSPFieldUserValue(info, value) {
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + value;
    } else {
        let ppobjectDivId = info.td.querySelector('div[spclientpeoplepicker="true"]').id;
        let ppobject = SPClientPeoplePicker.SPClientPeoplePickerDict[ppobjectDivId];
        while (ppobject.TotalUserCount > 0) {
            ppobject.DeleteProcessedUser();
        }
        let auxValues = [];
        if (Array.isArray(value)) {
            if (value[0] && value[0].constructor.getName() === 'SP.FieldUserValue') {
                for (let i = 0; i < value.length; i++) {
                    let login = await getUserLoginNameById(value[i].get_lookupId());
                    let val = login ? login : value.get_lookupValue()
                    auxValues.push(val);
                }
            } else {
                auxValues = value
            }
        } else if (value) {
            if (value.constructor.getName() === 'SP.FieldUserValue') {
                let login = await getUserLoginNameById(value.get_lookupId());
                let val = login ? login : value.get_lookupValue()
                auxValues.push(val);
            } else {
                auxValues.push(value);
            }
        }

        auxValues.forEach(function (val) {
            let resolvedUsers = ppobject.GetAllUserInfo();
            let isUserResolved = resolvedUsers.find(function (e) {
                return (e.Resolved && (e.DisplayText.toLowerCase() === val.toLowerCase() || e.Key.toLowerCase() === val.toLowerCase() ||
                    e.EntityData.AccountName.toLowerCase() === val.toLowerCase() || e.EntityData.Email.toLowerCase() === val.toLowerCase()))
            });
            if (typeof isUserResolved === 'undefined') {
                ppobject.AddUnresolvedUser({ 'Key': val }, true);
            }
        });
    }
}

function setSPFieldURLValue(info, value) {
    if (location.href.toLowerCase().indexOf('dispform') > -1) {

    } else {
        let inputURL = info.td.querySelector('input[id$="FieldUrl"]');
        let inputDescription = info.td.querySelector('input[id$="FieldDescription"]');
        inputURL.value = value.value;
        inputDescription.value = value.text;
    }
}

function setSPFieldAttachments(info, value) {
    if (location.href.toLowerCase().indexOf('dispform') > -1) {

    } else {
        try {
            let attachmentsTableBody = document.getElementById('idAttachmentsTable').querySelector('tbody')
            if (!attachmentsTableBody) {
                document.getElementById('idAttachmentsTable').innerHTML = '<tbody></tbody>'
                attachmentsTableBody = document.getElementById('idAttachmentsTable').querySelector('tbody')
            }
            value.forEach(function (attValue) {
                if (attValue.arrayBuffer) {
                    const dT = new DataTransfer()
                    dT.items.add(new File([new Uint8Array(attValue.arrayBuffer)], attValue.name))
                    document.getElementById('onetidIOFile').files = dT.files
                    document.getElementById('attachOKbutton').click()
                } else {
                    let attachmentRow = attachmentsTableBody.insertRow()
                    attachmentRow.innerHTML = '<td><a href="' + attValue.url + '" target="_blank">' + attValue.name + '</a></td>' +
                        '<td>&nbsp;<img alt="Eliminar" src="/_layouts/15/images/rect.gif?rev=23">&nbsp;<a href="#" >&nbsp;Eliminar</a></td>';

                }
            })

        } catch (error) {
            console.error(error)
        }

    }
}

function setSPFieldLookupFieldWithPicker(info, value) { //El value aca ese el display text
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        info.td.querySelector('textarea:first-child').value = value
    } else {
        info.td.querySelector('div.ms-inputuserfield').innerHTML = value;
        info.td.querySelector('img:first-child').click();
    }
}

function setSPFieldCascadingDropDownListFieldWithFilter(info, value) {
    if (typeof value === 'undefined' || value === null) {
        value = '';
    };

    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + value;
    }
    else {
        let input = info.td.querySelector('select');
        input.value = value;
    }
}


//-----------------------------------------------------------   People Picker   -----------------------------------------------------------//

/**
 *
 * @param {Object} fieldSchema - {
        EnforceUniqueValues: 'TRUE' || 'FALSE',
        Required: 'TRUE' || 'FALSE',
        UserSelectionMode: 'PeopleAndGroups' || 'PeopleOnly',
        Type: 'User' || 'UserMulti',
        UserSelectionScope: Number,
        InitialHelpText: (allowMultipleValues) ? 'Escribir nombres o direcciones de correo electrÃ³nico...' : 'Especifique un nombre o una direcciÃ³n de correo electrÃ³nico...',
    }
 * @return {void}
 **/
async function createPeoplePicker(divContainerID, fieldSchema, selectedLogins) {
    if (typeof SPClientPeoplePicker === 'undefined') {
        await loadSPClientPeoplePickerScripts();
    }

    let peoplePickerSchema = {
        SearchPrincipalSource: 15,
        ResolvePrincipalSource: 15,
        ResolvePrincipalType: 1,
        MaximumEntitySuggestions: 50,
        Width: '100%',
        Height: '100%',
        AllowMultipleValues: (fieldSchema.Type === 'User') ? false : true,
        PrincipalAccountType: (fieldSchema.UserSelectionMode === 'PeopleOnly') ? 'User' : 'User,DL,SecGroup,SPGroup',
        InitialHelpText: (fieldSchema.Type === 'User') ? 'Especifique un nombre...' : 'Escribir nombres...',
    };
    SPClientPeoplePicker_InitStandaloneControlWrapper(divContainerID, null, peoplePickerSchema);
    if (selectedLogins) selectedLogins.forEach(function (login) { SPClientPeoplePicker.SPClientPeoplePickerDict[divContainerID + '_TopSpan'].AddUserKeys(login) });


    function loadSPClientPeoplePickerScripts() {
        return new Promise(async function (resolve, reject) {
            let scriptsToLoad = [
                ((_spPageContextInfo.siteServerRelativeUrl !== '/') ? _spPageContextInfo.siteServerRelativeUrl : '') + '_layouts/15/clientpeoplepicker.js',
                ((_spPageContextInfo.siteServerRelativeUrl !== '/') ? _spPageContextInfo.siteServerRelativeUrl : '') + '_layouts/15/autofill.js',
            ];
            await loadScript(scriptsToLoad[0]);
            await loadScript(scriptsToLoad[1]);
            resolve();
            function loadScript(url) {
                return new Promise(function (resolve, reject) {
                    let element = document.createElement('script');
                    element.src = url;
                    element.async = true;
                    element.onload = function () { resolve(url); };
                    element.onerror = function (error) { reject(error); };
                    document.head.appendChild(element);
                });
            }
        });

    }

    /* var users = new Array(1);
var defaultUser = new Object();
defaultUser.AutoFillDisplayText = user.get_title();
defaultUser.AutoFillKey = user.get_loginName();
defaultUser.Description = user.get_email();
defaultUser.DisplayText = user.get_title();
defaultUser.EntityType = "User";
defaultUser.IsResolved = true;
defaultUser.Key = user.get_loginName();
defaultUser.Resolved = true;
users[0] = defaultUser;
SPClientPeoplePicker_InitStandaloneControlWrapper('peoplePickerDiv', users, schema);*/
}
function getFieldsInternalNamesSpecifiedByList(fieldList) {
    //Devuelve la lista de nombres internos de campos especificada en fieldList pero aplicando los comodines * o *- e ignorando los campos especificados que no existan
    //fieldList:    Puede ser * en cuyo caso significan todos los campos. 
    //              También puede ser una lista de nombres internos separados por ;. 
    //              Otra forma puede ser *-campo1;campo2;campoN, esto significa todos los campos menos los especificados
    var allFields = getAllFieldsInfo();
    allFields = allFields.map(e => e.internalName)
    if (fieldList.startsWith("*")) {
        if (fieldList.startsWith("*-")) {
            var quitar = fieldList.substring(2).split(";");
            quitar.forEach(function (i, quitarFieldInternalName) {
                allFields = allFields.filter(e => e != quitarFieldInternalName)
            });
        }
        return allFields;
    } else {
        var ret = fieldList.split(";");
        var auxi = fieldList.split(";");
        auxi.forEach(function (i, fieldInternalName) {
            var index = allFields.indexOf(fieldInternalName);
            if (index == -1) {
                allFields = allFields.filter(e => e != quitarFieldInternalName)
            }
        });
        return ret;
    }
}
function getFieldsValuesByInternalNamesSpecifiedByList(fieldList) {
    //Ver comentarios de getFieldsInternalNamesSpecifiedByList, se exculyen los campos MVD.RelationGrid
    var ret = {};
    var internalNames = Fields.getFieldsInternalNamesSpecifiedByList(fieldList);
    internalNames.forEach(function (i, internalName) {
        if (internalName.indexOf('MVDRF_') === -1) {
            ret[internalName] = MVD.SPHelpers.Fields.getFieldValueByInternalName(internalName);
        }
    });
    return ret;
}
function ClearPeoplePicker(fieldInternalName) {
    var ppobject = MVD.SPHelpers.Fields.GetPeoplePickerObjectByFieldInternalName(fieldInternalName);
    while (ppobject.TotalUserCount > 0) {
        ppobject.DeleteProcessedUser();
    }
    document.getElementById(ppobject.InitialHelpTextElementId).style.display = 'inline';
    document.getElementById(ppobject.EditorElementId).value = '';
    document.getElementById(ppobject.HiddenInputId).value = '';
}
function GetPeoplePickerObjectByFieldInternalName(fieldInternalName) {
    let fieldInfo = getFieldInfoByInternalName(fieldInternalName)
    var ppobjectDivId = fieldInfo.td.querySelector('div[spclientpeoplepicker="true"]:first').getAt('id');
    var ppobject = SPClientPeoplePicker.SPClientPeoplePickerDict[ppobjectDivId];
    return ppobject;
}


//-----------------------------------------------------------   Getters del forumulario mobile to   -----------------------------------------------------------//

window.getFieldValue = getFieldValue
function getFieldValue(internalName) {
    if (internalName.toLowerCase() === 'author') {
        return getUserFromLink('#onetidinfoblock1 a.ms-peopleux-userdisplink');
    }
    if (internalName.toLowerCase() === 'editor') {
        return getUserFromLink('#onetidinfoblock2 a.ms-peopleux-userdisplink');
    }
    let info = getFieldInfoByInternalName(internalName);
    if (info === null) {
        throw ('El campo de nombre interno ' + internalName + ' no se encuentra en el fromulario.');
    }
    if (info.type === 'SPFieldText' || info.type === 'SPFieldFile') {
        return getSPFieldTextValue(info);
    } else if (info.type === 'SPFieldNote') {
        return getSPFieldNoteValue(info);
    } else if (info.type === 'SPFieldChoice' || info.type === 'SPFieldOutcomeChoice') {
        return getSPFieldChoiceValue(info);
    } else if (info.type === 'SPFieldMultiChoice') {
        return getSPFieldMultiChoiceValue(info);
    } else if (info.type === 'SPFieldNumber' || info.type === 'SPFieldCurrency') {
        return getSPFieldNumberValue(info);
    } else if (info.type === 'SPFieldDateTime') {
        return getSPFieldDateTimeValue(info);
    } else if (info.type === 'SPFieldLookup' || info.type === 'SPFieldLookupMulti') {
        return getFieldLookupValue(info);
    } else if (info.type === 'SPFieldBoolean') {
        return getSPFieldBooleanValue(info);
    } else if (info.type === 'SPFieldUser' || info.type === 'SPFieldUserMulti') {
        return getFieldUserValue(info);
    } else if (info.type === 'SPFieldURL') {
        return getFieldURLValue(info);
    } else if (info.type === 'SPFieldAttachments') {
        return getSPFieldAttachmentsValues(info);
    } else if (info.type === 'SPFieldLookupFieldWithPickerMulti' || info.type === 'SPFieldLookupFieldWithPicker') {
        return getSPFieldLookupFieldWithPickerValue(info);
    } else if (info.type === 'SPFieldCascadingDropDownListFieldWithFilter') {
        return getSPFieldCascadingDropDownListFieldWithFilter(info);
    } else {
        console.error('El tipo de campo ' + info.type + ' no se encuentra en el getFieldValueByInternalName.', info);
        throw ('El tipo de campo ' + info.type + ' no se encuentra en el getFieldValueByInternalName.');
    }

    function getUserFromLink(selector) {
        let linkUser = $(selector)
        let linkUserHref = linkUser.attr('href');
        let userId = linkUserHref.substring(linkUserHref.indexOf('&ID=') + 4);
        let userName = linkUser.text();
        let ret = { values: [], valuesUnresolved: [] };
        ret.values.push({ DisplayText: userName, EntityData: { SPUserID: userId, PrincipalType: 'User' } });
        return ret;
    }
}

function getFieldLookupValue(info) {
    let value = null;
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let aTagArray = info.td.querySelectorAll('a');
        if (aTagArray.length) {
            let values = []
            aTagArray.forEach(function (aTag) {
                let aTagURL = new URL(aTag.href)
                let paramsString = aTagURL.search.substring(1);
                let searchParams = new URLSearchParams(paramsString.toUpperCase());
                values.push({
                    lookupId: Number(searchParams.get('ID')),
                    lookupValue: info.td.querySelector('a').innerText.trim()
                });
            });
            value = values
        }
    } else {
        let selectors = info.td.querySelectorAll('select');
        if (selectors.length === 1) {
            let selectedOption = selectors[0].querySelector('option:checked');
            if (selectedOption && Number(selectedOption.value)) {
                value = {
                    lookupId: Number(selectedOption.value),
                    lookupValue: selectedOption.text.trim()
                };
            }
        } else {
            let values = []
            let selectedOptions = selectors[1].querySelectorAll('option')
            selectedOptions.forEach(function (e) {
                values.push({
                    lookupId: Number(e.value),
                    lookupValue: e.text.trim()
                });
            });
            value = values
        }
    }
    return value;
}

function getFieldUserValue(info) {
    let value = null;
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let aTagArray = info.td.querySelectorAll('a[class*="user"]');
        if (aTagArray.length) {
            let values = []
            aTagArray.forEach(function (aTag) {
                let aTagURL = new URL(aTag.href)
                let paramsString = aTagURL.search.substring(1);
                let searchParams = new URLSearchParams(paramsString.toUpperCase());

                let userID = Number(searchParams.get('ID'));
                let userText = aTag.text.trim();
                values.push({
                    displayName: userText,
                    id: userID
                });
            });
        }

    } else {
        let ppobjectDivId = info.td.querySelector('div[spclientpeoplepicker="true"]').id;
        let ppobject = SPClientPeoplePicker.SPClientPeoplePickerDict[ppobjectDivId];
        let auxVals = ppobject.GetAllUserInfo();
        if (auxVals.length) {
            let values = []
            auxVals.forEach(function (value) {
                if (value.IsResolved) {
                    let displayName = value.DisplayText
                    let id = (value.EntityData.SPGroupID) ? value.EntityData.SPGroupID : value.EntityData.SPUserID
                    id = Number(id)
                    values.push({ displayName, id });
                }
            });
            value = (ppobject.AllowMultipleUsers) ? values : values[0]
        }
    }
    return value;
}

function getFieldURLValue(info) {
    let inputURL = info.td.querySelector('input[id$="FieldUrl"]');
    let inputDescription = info.td.querySelector('input[id$="FieldDescription"]');
    if (inputURL) {
        let urlValue = (inputURL.value === 'http://') ? '' : inputURL.value;
        return { url: urlValue, description: inputDescription.value }
    } else {
        let aTag = info.td.querySelector('a');
        return (aTag) ? { url: aTag.href, description: aTag.text } : null
    }
}


//-----------------------------------------------------------   Setters del forumulario mobile to   -----------------------------------------------------------//

window.setFieldValue = setFieldValue
async function setFieldValue(internalName, value) {
    const info = getFieldInfoByInternalName(internalName);
    if (info == null) {
        console.warn('El campo de nombre interno ' + internalName + ' no se encuentra en el fromulario.')
        return null;
    }
    if (info.type === 'SPFieldText' || info.type === 'SPFieldFile') {
        return setSPFieldTextValue(info, value);
    } else if (info.type === 'SPFieldNote') {
        return setSPFieldNoteValue(info, value);
    } else if (info.type === 'SPFieldChoice' || info.type === 'SPFieldOutcomeChoice') {
        return setSPFieldChoiceValue(info, value);
    } else if (info.type === 'SPFieldMultiChoice') {
        return setSPFieldMultiChoiceValue(info, value);
    } else if (info.type === 'SPFieldNumber' || info.type === 'SPFieldCurrency') {
        return setSPFieldNumberValue(info, value);
    } else if (info.type === 'SPFieldDateTime') {
        return setSPFieldDateTimeValue(info, value);
    } else if (info.type === 'SPFieldLookup' || info.type === 'SPFieldLookupMulti') {
        return setFieldLookupValue(info, value);
    } else if (info.type === 'SPFieldBoolean') {
        return setSPFieldBooleanValue(info, value);
    } else if (info.type === 'SPFieldUser' || info.type === 'SPFieldUserMulti') {
        return setFieldUserValue(info, value);
    } else if (info.type === 'SPFieldURL') {
        return setFieldURLValue(info, value);
    } else if (info.type === 'SPFieldAttachments') {
        return setFieldAttachments(info, value);
    } else if (info.type === 'SPFieldLookupFieldWithPickerMulti' || info.type === 'SPFieldLookupFieldWithPicker') {
        return setSPFieldLookupFieldWithPicker(info, value);
    } else if (info.type === 'SPFieldCascadingDropDownListFieldWithFilter') {
        return setSPFieldCascadingDropDownListFieldWithFilter(info, value);
    } else {
        console.error('El tipo de campo ' + info.type + ' no se encuentra en el setFieldValueByInternalName.', info)
        return null;
    }
}

function setFieldAttachments(info, value = []) {
    if (location.href.toLowerCase().indexOf('dispform') > -1) {

    } else {
        try {
            let attachmentsTableBody = document.getElementById('idAttachmentsTable').querySelector('tbody')
            if (!attachmentsTableBody && value.length) {
                document.getElementById('idAttachmentsRow').style.display = 'table-row'
                document.getElementById('idAttachmentsTable').innerHTML = '<tbody></tbody>'
                attachmentsTableBody = document.getElementById('idAttachmentsTable').querySelector('tbody')
            } else if (attachmentsTableBody && value.length === 0) {
                attachmentsTableBody.innerHTML = ''
            }
            value.forEach(function (attValue) {
                if (attValue.arrayBuffer) {
                    const dT = new DataTransfer()
                    dT.items.add(new File([new Uint8Array(attValue.arrayBuffer)], attValue.name))
                    document.getElementById('onetidIOFile').files = dT.files
                    document.getElementById('attachOKbutton').click()
                } else {
                    let attachmentRow = attachmentsTableBody.insertRow()
                    attachmentRow.innerHTML =
                        '<td><a href="' + attValue.url + '" target="_blank">' + attValue.name + '</a></td>' +
                        '<td>&nbsp;<img alt="Eliminar" src="/_layouts/15/images/rect.gif?rev=23">&nbsp;<a href="#" >&nbsp;Eliminar</a></td>';
                }
            })
        } catch (error) {
            console.error(error)
        }

    }
}

function setFieldLookupValue(info, value) {
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + value;
    } else {
        if (info.type === 'SPFieldLookup') {
            let auxValue = (value) ? value.lookupId : 0
            info.td.querySelector('select').value = auxValue
            let isValueInSelect = info.td.querySelector('select').querySelector('option[value="' + auxValue + '"]');
            if (isValueInSelect === null) info.td.querySelector('select').value = 0;
        } else {
            let selectors = info.td.querySelectorAll('select');
            let selectedOptionsToRemove = selectors[1].querySelectorAll('option');
            selectedOptionsToRemove.forEach(function (opt) {
                opt.selected = true;
            });
            info.tr.querySelector('input[id$="_RemoveButton"]').disabled = false;
            info.tr.querySelector('input[id$="_RemoveButton"]').click();

            info.td.querySelectorAll('select')[0].selectedIndex = -1
            if (value) {
                value.forEach(function (val) {
                    let option = selectors[0].querySelector('option[value="' + val.lookupId + '"]');
                    if (option !== null) {
                        option.selected = true;
                    }
                });
                info.tr.querySelector('input[id$="_AddButton"]').disabled = false;
                info.tr.querySelector('input[id$="_AddButton"]').click();
            }


            if (typeof selectors[2] !== 'undefined') {
                let preventCustomOnChange = selectors[1].getAttribute('data-preventCustomOnChange');
                //if (preventCustomOnChange) {
                //    selectors[1].removeAttribute('data-preventCustomOnChange');
                //} else {
                let event = new CustomEvent('change')
                event.initEvent('change', true, true);
                event.lookupMultiMaskStop = true;
                document.getElementById(selectors[1].id).dispatchEvent(event);
                //}
            }
        }
    }
}

async function setFieldUserValue(info, value) {
    if (location.href.toLowerCase().indexOf('dispform') > -1) {
        let innerHTML = info.td.innerHTML.trim();
        let comments = innerHTML.substring(0, innerHTML.indexOf('>') + 1);
        info.td.innerHTML = comments + value;
    } else {
        let ppobjectDivId = info.td.querySelector('div[spclientpeoplepicker="true"]').id;
        let ppobject = SPClientPeoplePicker.SPClientPeoplePickerDict[ppobjectDivId];
        while (ppobject.TotalUserCount > 0) {
            ppobject.DeleteProcessedUser();
        }
        if (value) {
            if (!Array.isArray(value)) value = [value]
            for (let index = 0; index < value.length; index++) {
                const user = value[index];
                let loginName = await getUserLoginNameById(user.id)
                let keyForResolve = loginName ? loginName : user.displayName
                let resolvedUsers = ppobject.GetAllUserInfo()
                let isUserResolved = resolvedUsers.find(function (e) {
                    return (e.Resolved && (e.DisplayText.toLowerCase() === keyForResolve.toLowerCase() || e.Key.toLowerCase() === keyForResolve.toLowerCase() ||
                        e.EntityData.AccountName.toLowerCase() === keyForResolve.toLowerCase() || e.EntityData.Email.toLowerCase() === keyForResolve.toLowerCase()))
                });
                if (typeof isUserResolved === 'undefined') {
                    ppobject.AddUnresolvedUser({
                        'Key': keyForResolve
                    }, true)
                }
            }
        }
    }
}

function setFieldURLValue(info, value) {
    if (location.href.toLowerCase().indexOf('dispform') > -1) {

    } else {
        let inputURL = info.td.querySelector('input[id$="FieldUrl"]');
        let inputDescription = info.td.querySelector('input[id$="FieldDescription"]');
        inputURL.value = (value) ? value.url : '';
        inputDescription.value = (value) ? value.description : '';
    }
}


export { bindValueChangedByInternalName, createPeoplePicker, dispatchValueChangedByInternalName, getAllFieldsInfo, getFieldInfoByInternalName, getFieldInfoByTitle, getFieldValue, getFieldValueByInternalName, getSPFieldNewFormAttachmentsValues, mvdInitializeModule, openMultipleChoiceAndRemoveNotAllowedFields, getTDFieldByInternalName, setDisabledByInternalName, setFieldValueByInternalName, setVisibilityByInternalName, getSPFieldTextValue, setReadonlyByInternalName, getModifiedFields, getFieldsInternalNamesSpecifiedByList, GetPeoplePickerObjectByFieldInternalName, ClearPeoplePicker, getFieldsValuesByInternalNamesSpecifiedByList, setFieldValue }