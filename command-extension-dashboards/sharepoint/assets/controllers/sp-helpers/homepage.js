let getItems

async function mvdInitializeModule() {
    let modules = await MVD.importScripts(['sp-helpers/list-items']);
    ({ getItems } = modules[0])
    await MVD.awaitFor.SPClientContext()
    await initializeModule()
    MVD.pageLoader({ show: false, keyCall: 'homepage' });
}

async function initializeModule() {
    const homeIconsWrapperElement = document.querySelector('div.home-icons-wrapper')
    const principalWebPart = homeIconsWrapperElement.closest('div[id^="MSOZoneCell_"]').parentElement
    principalWebPart.classList.add('web-parts-wrapper')
    Array.from(principalWebPart.children).forEach(function (e) {
        let styleClass = e.querySelector('div.home-icons-wrapper') ? 'web-part-home' : 'web-part-tasks'
        e.classList.add(styleClass)
    })
    const siteUrl = _spPageContextInfo.webServerRelativeUrl
    const listUrl = '/Lists/HomePageIcons'
    const homePageIconsData = await getItems({ listUrl, siteUrl })
    const homePageIconsDataSorted = homePageIconsData.filter(e => e.IsActive)
        .sort(function (a, b) {
            try {
                if (a.Level > b.Level) {
                    return -1
                } else if (a.Level < b.Level) {
                    return 1
                } else {
                    return a.Position > b.Position ? -1 : 1
                }
            } catch (error) {
                return 1
            }
        })


    for (let index = 0; index < homePageIconsDataSorted.length; index++) {
        const tileData = homePageIconsDataSorted[index];
        const level = tileData.Level ?? 10000
        let tileRowWrapperElement = homeIconsWrapperElement.querySelector(`div.tile-row-wrapper[data-level="${level}"]`)
        if (!tileRowWrapperElement) {
            tileRowWrapperElement = appendNewTileRowWrapper(level)
        }
        appendNewTile({ tileRowWrapperElement, tileData })
    }
}

function appendNewTileRowWrapper(level) {
    const homeIconsWrapperElement = document.querySelector('div.home-icons-wrapper')
    let newTileRowWrapperElement = document.createElement('div')
    newTileRowWrapperElement.setAttribute('data-level', level)
    newTileRowWrapperElement.classList.add('tile-row-wrapper')
    newTileRowWrapperElement.style.order = level
    homeIconsWrapperElement.append(newTileRowWrapperElement)
    return newTileRowWrapperElement
}

function appendNewTile({ tileRowWrapperElement, tileData }) {
    let newTileElement = document.createElement('div')
    newTileElement.classList.add('tile-container')
    newTileElement.onclick = function (event) {
        event.stopPropagation()
        redirectToModulePage(event.target)
    }
    newTileElement.setAttribute('data-url', tileData?.LinkUrl?.url)
    newTileElement.style.order = tileData.Position ?? 10000
    let newTileImage = document.createElement('img')
    newTileImage.setAttribute('src', tileData?.LinkIcon?.url)
    newTileImage.setAttribute('alt', tileData?.LinkIcon?.description)
    newTileElement.append(newTileImage)
    let newTileContentElement = document.createElement('div')
    newTileContentElement.classList.add('tile-content')
    newTileContentElement.innerHTML = `<div class="tile-content-title-wrapper"><span>${tileData.Title}</span></div>
                                    <div class="tile-content-description-wrapper"><span>${tileData.ShortDescription}<span></div>`
    newTileElement.append(newTileContentElement)
    tileRowWrapperElement.append(newTileElement)
    return newTileElement
}


function redirectToModulePage(target) {
    let url = target.classList.contains('tile-container') ? target.getAttribute('data-url') : target.closest('div.tile-container').getAttribute('data-url')
    window.location.href = url
}

export { mvdInitializeModule }