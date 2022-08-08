document.addEventListener('DOMContentLoaded', function () {
  const lowerCaseLocation = location.href.toLowerCase()
  if (!lowerCaseLocation.includes('pageview=shared') && (lowerCaseLocation.includes('newform.aspx') || lowerCaseLocation.includes('editform.aspx'))) {
    initialize()
  }

  async function initialize() {
    let modules = await MVD.importScripts(['sp-helpers/fields'])
    let { getFieldInfoByInternalName,setDisabledByInternalName, setFieldValue, setVisibilityByInternalName } = modules[0]

    const queryParams = location.search.substring(1).split('&')
    const setValueParams = new Set()
    const setStateParams = new Set()
    queryParams.forEach(function (queryParam) {
      if (queryParam.startsWith('setValue_')) setValueParams.add(queryParam)
      else if (queryParam.startsWith('setState_')) setStateParams.add(queryParam)
    })

    for (const setValueParam of setValueParams) {
      try {
        const setValueParamSplited = setValueParam.split('=')
        const fieldInternalName = setValueParamSplited[0].split('_')[1]
        const fieldValueDecoded = decodeURIComponent(setValueParamSplited[1])
        const fieldInfo = getFieldInfoByInternalName(fieldInternalName)
        let fieldValue = fieldValueDecoded.trim()
        if (fieldValue.startsWith('{') || fieldValue.startsWith('[')) {
          fieldValue = JSON.parse(fieldValue)
        }
        if (fieldValue.includes && fieldValue.includes(';')) setFieldValue(fieldInternalName, fieldValue.split(';'))
        else setFieldValue(fieldInternalName, fieldValue)
      } catch (error) {
        console.error(error)
      }
    }

    for (const setStateParam of setStateParams) {
      try {
        const setStateParamSplited = setStateParam.split('=')
        const fieldInternalName = setStateParamSplited[0].split('_')[1]
        const fieldState = setStateParamSplited[1]
        if (fieldState === 'readOnly') setDisabledByInternalName(fieldInternalName, true)
        else setVisibilityByInternalName(fieldInternalName, false)
      } catch (error) {
        console.error(error)
      }
    }
  }
})