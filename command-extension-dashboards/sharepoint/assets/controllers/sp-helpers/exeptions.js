function exceptionHandler({ exception, restException }) {
    let message, type
    let serverType = (restException) ? restException.serverType : exception.get_serverErrorTypeName()
    if (restException) {
        message = message
        type = type
    } else if (serverType === 'System.IO.FileNotFoundException') {
        message = exception.get_errorMessage()
        type = 'FileNotFoundException'
    } else if (serverType === 'Microsoft.SharePoint.SPDuplicateValuesFoundException') {
        message = exception.get_errorMessage()
        type = 'DuplicateValuesFoundException'
    } else {
        message = exception.get_errorMessage()
        type = serverType
    }
    throw { type, message }
}

export { exceptionHandler }