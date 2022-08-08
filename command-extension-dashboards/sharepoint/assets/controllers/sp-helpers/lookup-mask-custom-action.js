let lookupMultiMaskLocation = location.href.toLowerCase();
let locationForLookupsMaskParams = (new URL(location)).searchParams
let lookupsMaskParam = locationForLookupsMaskParams.get('LookupMask')
if (!lookupMultiMaskLocation.includes('pageview=shared') && lookupsMaskParam != 'Disabled' && (lookupMultiMaskLocation.includes('newform.aspx') || lookupMultiMaskLocation.includes('editform.aspx'))) {
    document.addEventListener('DOMContentLoaded', function () {
        if (document.querySelectorAll('input[id$="_MultiLookup"]').length === 0) return
        let importPromise = [MVD.importScripts(['sp-helpers/fields']), MVD.importScripts(['syncfusion/19.2/utilities']), import('../syncfusion/19.2/ej2-base.es2015.js'), import('../syncfusion/19.2/ej2-dropdowns.es2015.js'), import('../syncfusion/19.2/ej2-data.es2015.js')];
        Promise.all(importPromise)
            .then(function (modules) {
                let { getAllFieldsInfo, getFieldInfoByInternalName, setFieldValueByInternalName } = modules[0][0]
                let { getComponent } = modules[2]
                let { DropDownList, MultiSelect, CheckBoxSelection } = modules[3]
                let { Query } = modules[4]
                MultiSelect.Inject(CheckBoxSelection)

                let style = document.createElement('style');
                document.head.appendChild(style);
                style.sheet.insertRule('.lookupMultiMask {border-color: #99B0C1 !important; width:400px !important;}');
                style.sheet.insertRule('.lookupMultiMask span {font-size:inherit !important; color:#1C4269 !important; line-height: inherit !important;}');
                style.sheet.insertRule('.lookupMultiMask span.e-ddl-icon {font-size:inherit !important; font-weight: 600 !important; color: black !important; }');
                style.sheet.insertRule('.lookupMultiMask .e-close-hooker{display:none !important; }');

        

                let fieldsFormInfo = getAllFieldsInfo();
                let lookupMultiFieldsInfo = fieldsFormInfo.filter(e => e.type === 'SPFieldLookupMulti');
                lookupMultiFieldsInfo.forEach(function (element) {
                    try {
                        let dataSource = [];
                        let selectedValues = [];
                        let lookupMultiSelects = element.td.querySelectorAll('select');
                        lookupMultiSelects.forEach(function (select, selectIndex) {
                            for (let index = 0; index < select.options.length; index++) {
                                const option = select.options[index];
                                dataSource.push({
                                    value: Number(option.value),
                                    text: option.text
                                });
                                if (selectIndex) selectedValues.push(Number(option.value));
                            }
                        });
                        let originalSelectors = element.td.querySelectorAll('select');

                        document.getElementById(originalSelectors[1].id).addEventListener('change', function (event) {
                            let multiSelectObjID = event.target.id.substring(0, event.target.id.lastIndexOf('_'));
                            multiSelectObjID = multiSelectObjID.substring(0, multiSelectObjID.lastIndexOf('_'));
                            multiSelectObjID = multiSelectObjID + '_MVDLookupMulti';
                            let values = Array.from(event.target.options).map(e => Number(e.value));
                            let multiSelectObj = getComponent(document.getElementById(multiSelectObjID), 'multiselect');
                            multiSelectObj.value = values;
                        });

                        let inputMask = document.createElement('input');
                        inputMask.id = element.internalName + '_MVDLookupMulti';
                        element.td.append(inputMask);
                        element.td.children[0].style.display = 'none';

                        let multiSelectObj = new MultiSelect({
                            value: selectedValues,
                            fields: { text: 'text', value: 'value' },
                            dataSource: dataSource,
                            ignoreAccent: true,
                            allowFiltering: true,
                            filtering: function (args) {


                                let query = new Query();
                                // frame the query based on search string with filter type.
                                query = (args.text !== '') ? query.where('text', 'contains', args.text, true) : query;
                                // pass the filter data source, filter query to updateData method.
                                args.updateData(this.dataSource, query);

                            },
                            width: '60%',
                            mode: 'Box',
                            showDropDownIcon: true,
                            popupHeight: '350px',
                            cssClass: 'lookupMultiMask',
                            change: function (args) {
                                let internalName = args.element.id.replace('_MVDLookupMulti', '');
                                let fieldInfo = getFieldInfoByInternalName(internalName);
                                let fieldSelectResult = fieldInfo.td.querySelector('select[id$="_SelectResult"]');
                                fieldSelectResult.setAttribute('data-preventCustomOnChange', true);
                                setFieldValueByInternalName(internalName, args.value);
                            }
                        });
                        multiSelectObj.appendTo('#' + element.internalName + '_MVDLookupMulti');
                    } catch (error) {
                        console.error(error)
                    }
                });

                let lookupFieldsInfo = fieldsFormInfo.filter(e => e.type === 'XSPFieldLookup');
                lookupFieldsInfo.forEach(function (element) {
                    try {
                        let dataSource = [];
                        let selectedValue = [];
                        let lookupSelect = element.td.querySelector('select');

                        for (let index = 0; index < lookupSelect.options.length; index++) {
                            const option = lookupSelect.options[index];
                            dataSource.push({
                                value: Number(option.value),
                                text: option.text
                            });
                            if (option.selected) selectedValue = Number(option.value)
                        }


                        element.td.querySelector('select').addEventListener('change', function (event) {
                            let dropDownListObjID = event.target.id.substring(0, event.target.id.lastIndexOf('_'));
                            dropDownListObjID = dropDownListObjID.substring(0, dropDownListObjID.lastIndexOf('_'));
                            dropDownListObjID = dropDownListObjID + '_MVDLookup';
                            let dropDownSelectObj = getComponent(document.getElementById(dropDownListObjID), 'dropdownlist');
                            dropDownSelectObj.value = Number(event.target.value);
                        });

                        let inputMask = document.createElement('input');
                        inputMask.id = element.internalName + '_MVDLookup';
                        element.td.append(inputMask);
                        element.td.children[0].style.display = 'none';

                        let dropDownListObj = new DropDownList({
                            value: selectedValue,
                            fields: { text: 'text', value: 'value' },
                            dataSource: dataSource,
                            ignoreAccent: true,
                            allowFiltering: true,
                            filtering: function (args) {
                                let query = new Query();
                                // frame the query based on search string with filter type.
                                query = (args.text !== '') ? query.where('text', 'contains', args.text, true) : query;
                                // pass the filter data source, filter query to updateData method.
                                args.updateData(this.dataSource, query);

                            },
                            //width: '60%',
                            showDropDownIcon: true,
                            popupHeight: '350px',
                            cssClass: 'lookupMultiMask',
                            change: function (args) {
                                let internalName = args.element.id.replace('_MVDLookup', '');
                                let fieldInfo = getFieldInfoByInternalName(internalName);
                                let fieldSelectResult = fieldInfo.td.querySelector('select');
                                fieldSelectResult.setAttribute('data-preventCustomOnChange', true);
                                setFieldValueByInternalName(internalName, args.value);
                            }
                        });
                        dropDownListObj.appendTo('#' + element.internalName + '_MVDLookup');
                    } catch (error) {
                        console.error(error)
                    }
                });

            })
    });
}