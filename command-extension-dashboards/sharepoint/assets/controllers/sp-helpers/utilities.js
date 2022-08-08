
function convertXmlToObject(xml) {
  let object = {}
  let isRoot = false
  //  Objeto "raiz"
  if (xml.nodeType == 1) { // Objeto
    // Se recuperan sus atributos
    if (xml.attributes.length > 0) {
      for (let j = 0; j < xml.attributes.length; j++) {
        const atributo = xml.attributes.item(j)
        object[atributo.nodeName] = atributo.nodeValue
      }
    }
  } else if (xml.nodeType == 3) { // Texto
    object = xml.nodeValue
  } else if (xml.nodeType == 9) { // Elemento raiz
    isRoot = true
  }
  // Atributos del object (objects hijos)
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i)
      const nombreNodo = item.nodeName

      // Si object no tiene un atributo con el nombre nombreNodo se anade, si ya lo tiene (es un array) se anade
      // a la lista del object con nombre nombreNodo
      if (typeof (object[nombreNodo]) === 'undefined') {
        // Si el elemento es un CDATA se copia el contenido en el elemento y no se crea un
        // hijo para almacenar el texto
        if (nombreNodo == '#cdata-section') {
          object = item.nodeValue
        } else if (nombreNodo == '#text') { // Si el elemento es un texto no se crea el object #text
          if (item.childNodes.length < 1) {
            object = item.nodeValue
          } else {
            object[nombreNodo] = convertXmlToObject(item)
          }
        } else {
          if (isRoot) {
            object = convertXmlToObject(item)
          } else {
            object[nombreNodo] = convertXmlToObject(item)
          }
        }
      } else {
        // Si el atributo no es una lista se convierte el atributo en un array y se anade el
        // valor a dicho array
        if (typeof (object[nombreNodo].push) === 'undefined') {
          const valorAtributo = object[nombreNodo]
          object[nombreNodo] = new Array()
          object[nombreNodo].push(valorAtributo)
        }

        object[nombreNodo].push(convertXmlToObject(item))
      }
    }
  }
  return object
}

function getValidJavaScriptIndentifier(string) {
  return string.replace(/[^a-z0-9\-_:\.]|^[^a-z]+/gi, '')
}

const memoize = (func) => {
  const results = {};
  return async (...args) => {
    const argsKey = JSON.stringify(args);
    let functionResult = results[argsKey]
    if (!results[argsKey]) {
      functionResult = await func(...args);
      results[argsKey] = functionResult
    }
    return functionResult;
  };
}

export { convertXmlToObject, getValidJavaScriptIndentifier, memoize }