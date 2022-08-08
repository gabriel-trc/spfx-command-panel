const fieldsToDisabledInGridEditMode = []


function disabledFieldInGridEditModeByInternalName(fieldInternalName) {
  if (fieldsToDisabledInGridEditMode.length == 0) {
    const overrideContext = {
      Templates: {}
    }
    overrideContext.Templates.OnPreRender = function (context) {
      context.ListSchema.Field.forEach(field => {
        if (fieldsToDisabledInGridEditMode.includes(field.Name)) {
          field.AllowGridEditing = false
        }
      })
    }
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext)
  }
  fieldsToDisabledInGridEditMode.push(fieldInternalName)
}
/**
 * Encapsula el executeQueryAsync en una promesa.
 * @param {SP.ClientContext} clientContext 
 * @returns 
 */
function executeQueryPromise(clientContext) {
  return new Promise((resolve, reject) => {
    clientContext.executeQueryAsync(
      function () { resolve() },
      function (sender, args) { reject(args) }
    )
  })
}

function removeInvalidCharactersFormAttachmentFileName(fileName) {
  const fileNameTrim = fileName.trim()
  const maxFileNameLength = 128
  const patterToMatch = new RegExp('[~#%\&{}+\|]|\\.\\.|^\\.|\\.$', 'g')
  const match = patterToMatch.test(fileNameTrim)
  let validFileName = fileNameTrim.replace(patterToMatch, '')
  /*
    Cant be longer than 128 characters
    Cant use: ~ # % & * { } \ : < > ? / + | "; RegExp: [~#%\&{}+\|] – do not include characters that are not allowed in the file system
    Cant use the period character consecutively in the middle of a file name (blahblah.docx); RegExp: \\.\\.
    Cant use the period character at the end of a file name; RegExp:  ^\\.
    Cant use the period character at the start of a file name; RegExp:  \\.$
    */
  if (match) alert('El nombre del ajunto ' + fileName + ' contiene caracteres invalidos.\nSe remplazo el nombre por: ' + validFileName, 0, 'warning')

  else if (fileNameTrim.length > maxFileNameLength) {
    validFileName = validFileName.substring(0, maxFileNameLength)
    alert('El nombre del ajunto ' + fileName + ' es muy largo.\nSe remplazo el nombre por: ' + validFileName, 0, 'warning')
  }
  return validFileName
}

function isMobile() { return false; }



export { disabledFieldInGridEditModeByInternalName, executeQueryPromise, removeInvalidCharactersFormAttachmentFileName, isMobile }
