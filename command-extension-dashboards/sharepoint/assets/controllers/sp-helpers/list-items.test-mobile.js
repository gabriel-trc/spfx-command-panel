var createBatch, createItem, executeBatch, getFields, getItems, getItemById, getUserPermissions, updateItem, deleteItem, recycleItem;
const siteUrl = '/';
(async function mvdInitializeModule() {
    let modules = await MVD.importScripts(['sp-helpers/list-items', 'relation-field/index']);
    ({ createBatch, createItem, executeBatch, getFields, getItems, getItemById, getUserPermissions, updateItem, deleteItem, recycleItem } = modules[0]);
    ({ whenRenderedByInternalName, getDataSourceByInternalName, updateRowByInternalName, addRowByInternalName, deleteRowByInternalName } = modules[1]);

    initializeModule()
})()

async function initializeModule() {

    //await getItemsSucces()
    //await getItemsError()
    //await getItemsBatch()
    try {
        //crudTest()
        testApiGrid()

    } catch (error) {
        console.log(error)
    }

}

function testApiGrid() {
    /*await whenRenderedByInternalName('MVDRF_TestRelationFieldChilds')
    console.log('Linea luego de await whenRenderedByInternalName')*/

    let gridSource = getDataSourceByInternalName('MVDRF_testhelperschilds')
    console.log(JSON.stringify(gridSource))

    /*if(gridSource.length > 0){
        let childId = gridSource[0].ID;
        console.log(childId)
        let updateGridResult = updateRowByInternalName({ID:childId, Note:'Item modificado con api de grilla'}, 'MVDRF_TestRelationFieldChilds')
        console.log(JSON.stringify(updateGridResult))
    } else
        console.log('No se encontraron items hijos')*/

    var newRowItemId = addRowByInternalName({ Title: 'Agregado con api', Note: 'Item agregado con api de grilla' }, 'MVDRF_testhelperschilds')
    console.log(newRowItemId)

    /*deleteRowByInternalName(34, 'MVDRF_TestRelationFieldChilds')
    console.log('Se elimino item: 34 de la grilla: MVDRF_TestRelationFieldChilds')*/
}

async function getItemsSucces() {
    const camlQuery = '<ViewFields><FieldRef Name=\"ID\" /><FieldRef Name=\"Title\" /><FieldRef Name=\"Order\" /><FieldRef Name=\"Info\" /><FieldRef Name=\"Question\" /><FieldRef Name=\"Attachments\" /></ViewFields>'
    const getAttachments = true
    const listUrl = 'Lists/TestRelationFieldChecklistPreload'
    const items = await getItems({
        camlQuery,
        getAttachments,
        listUrl,
        siteUrl
    })
    console.assert(Array.isArray(items), 'getItemsSucces')
}

async function getItemsError() {
    const camlQuery = '<ViewFields><FieldRef Name=\"ID\" /><FieldRef Name=\"Title\" /><FieldRef Name=\"Order\" /><FieldRef Name=\"Info\" /><FieldRef Name=\"Question\" /><FieldRef Name=\"Attachments\" /></ViewFields>'
    const getAttachments = true
    const listUrl = '/TestRelationFieldChecklistPreload'

    try {
        const items = await getItems({
            camlQuery,
            getAttachments,
            listUrl,
            siteUrl
        })
    } catch (error) {
        console.assert(error.message, 'getItemsError')
    }
}

async function getItemsBatch() {
    const currentBatch = createBatch()
    const camlQuery = '<ViewFields><FieldRef Name=\"ID\" /><FieldRef Name=\"Title\" /><FieldRef Name=\"Order\" /><FieldRef Name=\"Info\" /><FieldRef Name=\"Question\" /><FieldRef Name=\"Attachments\" /></ViewFields>'
    const getAttachments = true
    const listUrl = 'Lists/TestRelationFieldChecklistPreload'
    await getItems({
        camlQuery,
        getAttachments,
        listUrl,
        siteUrl,
        batch: currentBatch
    })

    executeBatch(currentBatch)
}

async function crudTestBatch() {
    console.log('CRUD operations')
    const listUrl = ''//'/Lists/TestHelpers'
    const listGUID = '1B5EEE0B-C635-4CE7-82E4-6F73EF5BBA9E'
    let item = {
        Title: 'createItem by listGUID',
        Note: 'createItem by listGUID. Create with three attachmetns, two with the same name and one with empty data /n Expected only two attachments after created, and one with the name as name plus _1',
        NoteImproved: '<h1>createItem by listGUID</h1>',
        Choice: 'Opción nº 1',
        ChoiceRadio: 'Opción nº 1',
        ChoiceCheckbox: ['Opción nº 1', 'Opción nº 2', 'Opción nº 3'],
        Number: 0,
        NumberPercentage: 0,
        Date: new Date(2021, 0, 31),
        DateTime: new Date(2021, 9, 31),
        Lookup: {
            lookupId: 5,
            lookupValue: 'updater'
        },
        LookupMulti: [{
            lookupId: 4,
            lookupValue: 'sp-helpers'
        }, {
            lookupId: 5,
            lookupValue: 'syncfusion'
        }],
        User: {
            id: 8,
            displayName: 'Lourdes Pérez'
        },
        UserMulti: [{
            id: 7,
            displayName: 'Integrantes de la MVD Quality'
        }, {
            id: 1,
            displayName: 'SERVER3\\mvd.base'
        }],
        Link: {
            url: 'https://www.elpais.com.uy/',
            description: 'El País'
        },
        Image: {
            url: 'https://picsum.photos/id/237/200/300',
            description: 'Perro'
        },
        _AttachmentsFiles: [
            {
                action: 'add',
                arrayBuffer: Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0)),
                name: 'Image.png'
            },
            {
                action: 'add',
                arrayBuffer: '',
                name: 'Image2.png'
            },
            {
                action: 'add',
                arrayBuffer: Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0)),
                name: 'Image.png'
            },
        ]
    }
    // const itemId = await createItem({ item, listGUID, listUrl, siteUrl })
    // console.assert(Number.isInteger(itemId), 'createItem')
    // item.ID = itemId
    // item.Choice = ''
    // item.ChoiceRadio = ''
    // item.ChoiceCheckbox = []
    // item['_AttachmentsFiles'] = [
    //     {
    //         action: 'delete',
    //         name: 'Image.png'
    //     },
    // ]
    // item.Note = 'updateItem by listGUID. Delete one attachmetn and empty all the choices fields'
    // const updatedItem = await updateItem({ item, listGUID, listUrl, siteUrl })
    // console.assert(typeof updatedItem === 'object', 'updateItem')
    await deleteItem({ item: { ID: 7 }, listGUID, listUrl, siteUrl })
    await recycleItem({ item: { ID: 10 }, listGUID, listUrl, siteUrl })
}

async function crudTest() {
    console.log('CRUD operations')
    const getAttachments = true
    const currentBatch = createBatch()
    const listUrl = ''//'/Lists/TestHelpers'
    const listGUID = '1B5EEE0B-C635-4CE7-82E4-6F73EF5BBA9E'
    let item = {
        Title: 'createItem by listGUID',
        Note: 'createItem by listGUID. Create with three attachmetns, two with the same name and one with empty data /n Expected only two attachments after created, and one with the name as name plus _1',
        NoteImproved: '<h1>createItem by listGUID</h1>',
        Choice: 'Opción nº 1',
        ChoiceRadio: 'Opción nº 1',
        ChoiceCheckbox: ['Opción nº 1', 'Opción nº 2', 'Opción nº 3'],
        Number: 0,
        NumberPercentage: 0,
        Date: new Date(2021, 0, 31),
        DateTime: new Date(2021, 9, 31),
        Lookup: {
            lookupId: 5,
            lookupValue: 'updater'
        },
        LookupMulti: [{
            lookupId: 4,
            lookupValue: 'sp-helpers'
        }, {
            lookupId: 5,
            lookupValue: 'syncfusion'
        }],
        User: {
            id: 8,
            displayName: 'Lourdes Pérez'
        },
        UserMulti: [{
            id: 7,
            displayName: 'Integrantes de la MVD Quality'
        }, {
            id: 1,
            displayName: 'SERVER3\\mvd.base'
        }],
        Link: {
            url: 'https://www.elpais.com.uy/',
            description: 'El País'
        },
        Image: {
            url: 'https://picsum.photos/id/237/200/300',
            description: 'Perro'
        },
        _AttachmentsFiles: [
            {
                action: 'add',
                arrayBuffer: Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0)),
                name: 'Image.png'
            },
            {
                action: 'add',
                arrayBuffer: '',
                name: 'Image2.png'
            },
            {
                action: 'add',
                arrayBuffer: Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0)),
                name: 'Image.png'
            },
            {
                action: 'add',
                arrayBuffer: Uint8Array.from(atob(imageBase64), c => c.charCodeAt(0)),
                name: 'Image.png'
            },
        ]
    }
    const itemId = await createItem({ item, listGUID, listUrl, siteUrl })
    console.assert(Number.isInteger(itemId), 'createItem')
    item.ID = itemId
    item.Choice = ''
    item.ChoiceRadio = ''
    item.ChoiceCheckbox = []
    item['_AttachmentsFiles'] = [
        {
            action: 'delete',
            name: 'Image.png'
        },
    ]
    item.Note = 'updateItem by listGUID. Delete one attachmetn and empty all the choices fields'
    const updatedItem = await updateItem({ item, listGUID, listUrl, siteUrl })
    console.assert(typeof updatedItem === 'object', 'updateItem')

    createItem({ item, listGUID, listUrl, siteUrl, batch: currentBatch })
    createItem({ item, listGUID, listUrl, siteUrl, batch: currentBatch })
    createItem({ item, listGUID, listUrl, siteUrl, batch: currentBatch })
    getItemById({ getAttachments, id: 89, listGUID, listUrl, siteUrl, batch: currentBatch })
    getItemById({ getAttachments, id: 88, listGUID, listUrl, siteUrl, batch: currentBatch })
    deleteItem({ item: { ID: 92 }, listGUID, listUrl, siteUrl, batch: currentBatch })
    recycleItem({ item: { ID: 94 }, listGUID, listUrl, siteUrl, batch: currentBatch })
    const camlQuery = '<ViewFields><FieldRef Name=\"ID\" /><FieldRef Name=\"Title\" /><FieldRef Name=\"Order\" /><FieldRef Name=\"Info\" /><FieldRef Name=\"Question\" /><FieldRef Name=\"Attachments\" /></ViewFields>'
    await getItems({ getAttachments: true, listUrl: 'Lists/TestRelationFieldChecklistPreload', siteUrl, batch: currentBatch })
    const execute = await executeBatch(currentBatch)
    executeBatch(currentBatch).then(function (args) {
        console.log(args)
    })

}

const imageBase64 = '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'