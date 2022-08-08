﻿import { enableRipple, loadCldr, setCulture, setCurrencyCode, L10n } from './ej2-base.es2015.js';
import { DialogUtility } from './ej2-popups.es2015.js';
import { Toast } from './ej2-notifications.es2015.js';

let SHOW_TOAST_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger'
}

async function mvdInitializeModule() {
    enableRipple(true);
    setComponentsCulture('es')
    await MVD.loadFiles([{ type: MVD.versionsTypes.LINK, key: 'syncfusion/19.2/fabric' }])
}


/**
 * Despliega un dialogo de confirmación en modo modal y sin botón de cierre. Si no recibe el parámetro cancelFunction, no muestra el botón de cancelar en el diálogo.
 * Las funciones pasadas como parámetros pueden ser promesas y ahi el diálogo se cierra luego de que finalize, sino.
 * @param {String} msg - Mensaje que va a contener el diálogo.
 * @param {String} title - Título del diálogo. Valor por defecto 'Atención'.
 * @param {Function} okFunction - Función que se ejecuta en el botón OK.
 * @param {Function} cancelFunction - Función que se ejecuta en el botón Cancelar.
 * @return {undefined}
 **/

function showConfirmDialog({ msg, title = 'Atención', okText = 'OK', cancelText = 'Cancelar', showCancelButton = true }) {
    return new Promise(function (resolve, reject) {
        let dialogProperties = {
            position: { X: 'center', Y: 'center' },
            title: title,
            content: msg,
            okButton: {
                text: okText,
                isPrimary: true,
                click: function () {
                    resolve(true)
                    this.hide();
                }
            },
            cancelButton: {
                text: cancelText,
                click: function () {
                    resolve(false)
                    this.hide();
                }
            },
            animationSettings: { effect: 'Zoom' },
            showCloseIcon: false,
            closeOnEscape: false,
            isModal: true,
        };
        if (!showCancelButton) delete dialogProperties.cancelButton
        DialogUtility.confirm(dialogProperties);
    })
}

/**
 * Despliega un toast con información para el usuario, tiene cuatro estilos definidos para seleccionar: info, success, warning, danger. 
 * Para que no se cierre automáticamente hay que pasarle 0 como parámetro timeOutMS.
 * @param {Object} toastSettings - 
 * @return {undefined}

 **/
function showToast({ msg = 'Lo sentimos, tuvimos un error.', timeOutMS = 6000, type = SHOW_TOAST_TYPES.DANGER, title = 'Atención' }) {
    if (document.getElementById('syncfusionUtilitiesToast') === null) {
        const toastElement = document.createElement('div');
        toastElement.setAttribute('id', 'syncfusionUtilitiesToast');
        document.body.appendChild(toastElement);
    }

    const toastSettings = {
        title: title,
        content: msg,
        position: { X: 'Left', Y: 'Top' },
        newestOnTop: true,
        timeOut: timeOutMS,
        target: document.body,
        width: 600,
        showCloseButton: true,
        animation: {
            show: {
                effect: 'SlideTopIn'
            },
            hide: {
                effect: 'SlideLeftOut'
            }
        }
    }
    let cssClass = '';
    let icon = '';
    switch (type) {
        case SHOW_TOAST_TYPES.INFO:
            cssClass = 'e-toast-info';
            icon: 'e-info toast-icons'
            break;
        case SHOW_TOAST_TYPES.SUCCESS:
            cssClass = 'e-toast-success';
            icon: 'e-success toast-icons'
            break;
        case SHOW_TOAST_TYPES.WARNING:
            cssClass = 'e-toast-warning';
            icon: 'e-warning toast-icons'
            break;
        case SHOW_TOAST_TYPES.DANGER:
            cssClass = 'e-toast-danger';
            icon: 'e-danger toast-icons'
            break;
    }
    toastSettings.cssClass = cssClass;
    toastSettings.icon = icon;

    const toast = new Toast(toastSettings);
    toast.appendTo('#syncfusionUtilitiesToast');
    toast.show();
}

/**
 * Bring in the necessary data to render te relationship field.
 * @param {Array} dataToGet - Each element of the matrix contains the instuctions of the data to get.
 * @return {void}
 **/
function setComponentsCulture(culture) {
    if (culture.includes('es')) {
        L10n.load({
            "es": {
                "tab": {
                    "closeButtonTitle": "Cerrar"
                },
                "pivotview": {
                    "grandTotal": "Gran total",
                    "total": "Total",
                    "value": "Valor",
                    "noValue": "Sin valor",
                    "row": "Fila",
                    "column": "Columna",
                    "collapse": "Colapso",
                    "expand": "Expandir",
                    "rowAxisPrompt": "Drop row aquí",
                    "columnAxisPrompt": "Coloca la columna aquí",
                    "valueAxisPrompt": "Soltar valor aquí",
                    "filterAxisPrompt": "Suelta el filtro aquí",
                    "filter": "Filtrar",
                    "filtered": "Filtrado",
                    "sort": "Ordenar",
                    "filters": "Filtros",
                    "rows": "Filas",
                    "columns": "Columnas",
                    "values": "Valores",
                    "close": "Cerrar",
                    "cancel": "Cancelar",
                    "delete": "Eliminar",
                    "CalculatedField": "Campo calculado",
                    "createCalculatedField": "Crear campo calculado",
                    "fieldName": "Ingrese el nombre del campo",
                    "error": "Error",
                    "invalidFormula": "Fórmula no válida",
                    "dropText": "Ejemplo: ('Sum (Order_Count)' + 'Sum (In_Stock)') * 250",
                    "dropTextMobile": "Agregue campos y edite la fórmula aquí.",
                    "dropAction": "El campo calculado no se puede colocar en ninguna otra región, excepto el eje de valores.",
                    "alert": "Alerta",
                    "warning": "Advertencia",
                    "ok": "Ok",
                    "search": "Buscar",
                    "drag": "Arrastrar",
                    "remove": "Eliminar",
                    "allFields": "Todos los campos",
                    "formula": "Fórmula",
                    "addToRow": "Agregar a la fila",
                    "addToColumn": "Agregar a la columna",
                    "addToValue": "Agregar al valor",
                    "addToFilter": "Agregar al filtro",
                    "emptyData": "No hay registros que mostrar",
                    "fieldExist": "Ya existe un campo en este nombre. Por favor, introduzca un nombre diferente.",
                    "confirmText": "Ya existe un campo de cálculo en este nombre. ¿Quieres cambiarlo?",
                    "noMatches": "No hay coincidencias",
                    "format": "Resume los valores por",
                    "edit": "Editar",
                    "clear": "Limpiar",
                    "formulaField": "Arrastra y suelta campos a la fórmula",
                    "dragField": "Arrastre el campo a la fórmula",
                    "clearFilter": "Limpiar",
                    "by": "por",
                    "all": "Todos",
                    "multipleItems": "Artículos múltiples",
                    "member": "Miembro",
                    "label": "Etiqueta",
                    "date": "Fecha",
                    "enterValue": "Ingrese valor",
                    "chooseDate": "Ingrese fecha",
                    "Before": "antes de",
                    "BeforeOrEqualTo": "Antes o igual a",
                    "After": "Después",
                    "AfterOrEqualTo": "Después o igual a",
                    "labelTextContent": "Mostrar los elementos para los que la etiqueta",
                    "dateTextContent": "Mostrar los elementos para los que la fecha",
                    "valueTextContent": "Mostrar los artículos para los cuales",
                    "Equals": "Igual a",
                    "DoesNotEquals": "No es igual",
                    "BeginWith": "Empieza con",
                    "DoesNotBeginWith": "No comienza con",
                    "EndsWith": "Termina con",
                    "DoesNotEndsWith": "No termina con",
                    "Contains": "Contiene",
                    "DoesNotContains": "No contiene",
                    "GreaterThan": "Mas grande que",
                    "GreaterThanOrEqualTo": "Mayor qué o igual a",
                    "LessThan": "Menos que",
                    "LessThanOrEqualTo": "Menos que o igual a",
                    "Between": "Entre",
                    "NotBetween": "No entre",
                    "And": "y",
                    "Sum": "Suma",
                    "Count": "Contar",
                    "DistinctCount": "Cuenta distinta",
                    "Product": "Producto",
                    "Avg": "Promedio",
                    "Min": "Min",
                    "SampleVar": "Var de muestra",
                    "PopulationVar": "Población Var",
                    "RunningTotals": "Totales acumulados",
                    "Max": "Max",
                    "Index": "Índice",
                    "SampleStDev": "StDev de muestra",
                    "PopulationStDev": "Población StDev",
                    "PercentageOfRowTotal": "% del total de filas",
                    "PercentageOfParentTotal": "% del total de padres",
                    "PercentageOfParentColumnTotal": "% del total de la columna principal",
                    "PercentageOfParentRowTotal": "% del total de la fila principal",
                    "DifferenceFrom": "Diferencia de",
                    "PercentageOfDifferenceFrom": "% de diferencia de",
                    "PercentageOfGrandTotal": "% del total general",
                    "PercentageOfColumnTotal": "% del total de la columna",
                    "NotEquals": "No es igual",
                    "AllValues": "Todos los valores",
                    "conditionalFormating": "Formato condicional",
                    "apply": "APLICAR",
                    "condition": "Agregar condición",
                    "formatLabel": "Formato",
                    "valueFieldSettings": "Configuración del campo de valor",
                    "baseField": "Campo base:",
                    "baseItem": "Artículo base:",
                    "summarizeValuesBy": "Resumir valores por:",
                    "sourceName": "Nombre del campo :",
                    "sourceCaption": "Título de campo:",
                    "example": "p.ej:",
                    "editorDataLimitMsg": " mas cosas. Buscar para refinar aún más.",
                    "details": "Detalles",
                    "manageRecords": "Administrar registros",
                    "Years": "Años",
                    "Quarters": "Cuarteles",
                    "Months": "Meses",
                    "Days": "Dias",
                    "Hours": "Horas",
                    "Minutes": "Minutos",
                    "Seconds": "Segundos",
                    "save": "Guardar un informe",
                    "new": "Crea un nuevo informe",
                    "load": "Carga",
                    "saveAs": "Guardar como informe actual",
                    "rename": "Cambiar el nombre de un informe actual",
                    "deleteReport": "Eliminar un informe actual",
                    "export": "Exportar",
                    "subTotals": "Subtotales",
                    "grandTotals": "Grandes totales",
                    "reportName": "Reportar nombre :",
                    "pdf": "PDF",
                    "excel": "Sobresalir",
                    "csv": "CSV",
                    "png": "PNG",
                    "jpeg": "JPEG",
                    "svg": "SVG",
                    "mdxQuery": "Consulta MDX",
                    "showSubTotals": "Mostrar subtotales",
                    "doNotShowSubTotals": "No mostrar subtotales",
                    "showSubTotalsRowsOnly": "Mostrar solo subtotales filas",
                    "showSubTotalsColumnsOnly": "Mostrar solo columnas de subtotales",
                    "showGrandTotals": "Mostrar totales generales",
                    "doNotShowGrandTotals": "No mostrar totales generales",
                    "showGrandTotalsRowsOnly": "Mostrar solo totales generales",
                    "showGrandTotalsColumnsOnly": "Mostrar solo columnas de totales generales",
                    "fieldList": "Mostrar lista de campos",
                    "grid": "Mostrar tabla",
                    "toolbarFormatting": "Formato condicional",
                    "chart": "Gráfico",
                    "reportMsg": "Por favor ingrese el nombre del informe vaild !!!",
                    "reportList": "Lista de informes",
                    "removeConfirm": "¿Seguro que quieres eliminar este informe?",
                    "emptyReport": "No se encontraron informes !!",
                    "bar": "Bar",
                    "line": "Línea",
                    "area": "Zona",
                    "scatter": "Dispersión",
                    "polar": "Polar",
                    "of": "de",
                    "emptyFormat": "¡No se ha encontrado el formato!",
                    "emptyInput": "Ingrese un valor",
                    "newReportConfirm": "¿Desea guardar los cambios para informar?",
                    "emptyReportName": "Ingrese un nombre de informe",
                    "qtr": "Qtr",
                    "null": "nulo",
                    "undefined": "indefinido",
                    "groupOutOfRange": "Fuera de rango",
                    "fieldDropErrorAction": "El campo que está moviendo no se puede colocar en esa área del informe",
                    "MoreOption": "Más...",
                    "aggregate": "Agregar",
                    "drillThrough": "Perforar a través",
                    "ascending": "Ascendente",
                    "descending": "Descendente",
                    "number": "Número",
                    "currency": "Moneda",
                    "percentage": "Porcentaje",
                    "formatType": "Tipo de formato",
                    "customText": "Símbolo de moneda",
                    "symbolPosition": "Posición del símbolo",
                    "left": "Izquierda",
                    "right": "Derecho",
                    "grouping": "Agrupamiento",
                    "true": "Verdadero",
                    "false": "Falso",
                    "decimalPlaces": "Lugares decimales",
                    "numberFormat": "Formato de número",
                    "memberType": "Tipo de campo",
                    "formatString": "Cadena de formato",
                    "expressionField": "Expresión",
                    "customFormat": "Ingrese una cadena de formato personalizado",
                    "selectedHierarchy": "Jerarquía de padres",
                    "olapDropText": "Ejemplo: [Medidas]. [Cantidad de pedido] + ([Medidas]. [Cantidad de pedido] * 0.10)",
                    "Percent": "Por ciento",
                    "Custom": "Personalizado",
                    "Measure": "Medida",
                    "Dimension": "Dimensión",
                    "Standard": "Estándar",
                    "blank": "(Blanco)",
                    "fieldTooltip": "Arrastre y suelte campos para crear una expresión. Y, si desea editar los campos calculados existentes! Entonces puede lograrlo simplemente seleccionando el campo en 'Miembros calculados'.",
                    "QuarterYear": "Cuarto año",
                    "fieldTitle": "Nombre del campo",
                    "drillError": "No se pueden mostrar los elementos sin procesar de los campos calculados.",
                    "caption": "Título de campo",
                    "copy": "Copiar",
                    "defaultReport": "Informe predeterminado",
                    "customFormatString": "Formato personalizado",
                    "invalidFormat": "Formato inválido.",
                    "group": "Grupo",
                    "unGroup": "Desagrupar",
                    "invalidSelection": "No se puede agrupar esa selección.",
                    "groupName": "Ingrese el título para mostrar en el encabezado",
                    "captionName": "Ingrese el título para el campo de grupo",
                    "selectedItems": "Artículos seleccionados",
                    "groupFieldCaption": "Título de campo",
                    "groupTitle": "Nombre del grupo",
                    "startAt": "A partir de",
                    "endAt": "Terminando a las",
                    "groupBy": "Intervalo por",
                    "selectGroup": "Seleccionar grupos",
                    "numberFormatString": "Ejemplo: C, P, 0000%, ### 0. ## 0 #, etc.",
                    "stackingcolumn": "Columna apilada",
                    "stackingbar": "Barra apilada",
                    "stackingarea": "Área apilada",
                    "stepline": "Línea de paso",
                    "steparea": "Área de paso",
                    "splinearea": "Área de spline",
                    "spline": "Ranura",
                    "stackingcolumn100": "Columna 100% apilada",
                    "stackingbar100": "Barra 100% apilada",
                    "stackingarea100": "Área 100% apilada",
                    "bubble": "burbuja",
                    "pareto": "Pareto",
                    "radar": "Radar",
                    "chartTypeSettings": "Configuración de tipo de gráfico",
                    "multipleAxes": "Ejes múltiples",
                    "sortAscending": "Ordenar orden ascendente",
                    "sortDescending": "Ordenar orden descendente",
                    "sortNone": "Ordenar orden de datos",
                    "clearCalculatedField": "Borrar información de campo editado",
                    "editCalculatedField": "Editar campo calculado",
                    "ChartType": "Tipo de carta",
                    "yes": "Si",
                    "no": "No",
                    "numberFormatMenu": "Formato de número ...",
                    "conditionalFormatingMenu": "Formato condicional...",
                    "removeCalculatedField": "¿Está seguro de que desea eliminar este campo calculado?",
                    "replaceConfirmBefore": "Un informe llamado",
                    "replaceConfirmAfter": " ya existe. ¿Quieres cambiarlo?"
                },
                "pivotfieldlist": {
                    "staticFieldList": "Lista de campos dinámicos",
                    "fieldList": "Lista de campo",
                    "dropFilterPrompt": "Suelta el filtro aquí",
                    "dropColPrompt": "Coloca la columna aquí",
                    "dropRowPrompt": "Drop row aquí",
                    "dropValPrompt": "Soltar valor aquí",
                    "addPrompt": "Agregar campo aquí",
                    "adaptiveFieldHeader": "Elegir campo",
                    "centerHeader": "Arrastre los campos entre los ejes a continuación:",
                    "add": "añadir",
                    "drag": "Arrastrar",
                    "filter": "Filtrar",
                    "filtered": "Filtrado",
                    "sort": "Ordenar",
                    "remove": "Eliminar",
                    "filters": "Filtros",
                    "rows": "Filas",
                    "columns": "Columnas",
                    "values": "Valores",
                    "CalculatedField": "Campo calculado",
                    "createCalculatedField": "Crear campo calculado",
                    "fieldName": "Ingrese el nombre del campo",
                    "error": "Error",
                    "invalidFormula": "Fórmula no válida",
                    "dropText": "Ejemplo: ('Sum (Order_Count)' + 'Sum (In_Stock)' ') * 250",
                    "dropTextMobile": "Agregue campos y edite la fórmula aquí.",
                    "dropAction": "El campo calculado no se puede colocar en ninguna otra región, excepto el eje de valores.",
                    "search": "Buscar",
                    "close": "Cerrar",
                    "cancel": "Cancelar",
                    "delete": "Eliminar",
                    "alert": "Alerta",
                    "warning": "Advertencia",
                    "ok": "Ok",
                    "allFields": "Todos los campos",
                    "formula": "Fórmula",
                    "fieldExist": "Ya existe un campo en este nombre. Por favor, introduzca un nombre diferente.",
                    "confirmText": "Ya existe un campo de cálculo en este nombre. ¿Quieres cambiarlo?",
                    "noMatches": "No hay coincidencias",
                    "format": "Resume los valores por",
                    "edit": "Editar",
                    "clear": "Limpiar",
                    "formulaField": "Arrastra y suelta campos a la fórmula",
                    "dragField": "Arrastre el campo a la fórmula",
                    "clearFilter": "Limpiar",
                    "by": "por",
                    "enterValue": "Ingrese valor",
                    "chooseDate": "Ingrese fecha",
                    "all": "Todos",
                    "multipleItems": "Artículos múltiples",
                    "Equals": "Igual a",
                    "DoesNotEquals": "No es igual",
                    "BeginWith": "Empieza con",
                    "DoesNotBeginWith": "No comienza con",
                    "EndsWith": "Termina con",
                    "DoesNotEndsWith": "No termina con",
                    "Contains": "Contiene",
                    "DoesNotContains": "No contiene",
                    "GreaterThan": "Mas grande que",
                    "GreaterThanOrEqualTo": "Mayor qué o igual a",
                    "LessThan": "Menos que",
                    "LessThanOrEqualTo": "Menos que o igual a",
                    "Between": "Entre",
                    "NotBetween": "No entre",
                    "Before": "antes de",
                    "BeforeOrEqualTo": "Antes o igual a",
                    "After": "Después",
                    "AfterOrEqualTo": "Después o igual a",
                    "member": "Miembro",
                    "label": "Etiqueta",
                    "date": "Fecha",
                    "value": "Valor",
                    "labelTextContent": "Mostrar los elementos para los que la etiqueta",
                    "dateTextContent": "Mostrar los elementos para los que la fecha",
                    "valueTextContent": "Mostrar los artículos para los cuales",
                    "And": "y",
                    "Sum": "Suma",
                    "Count": "Contar",
                    "DistinctCount": "Cuenta distinta",
                    "Product": "Producto",
                    "Avg": "Promedio",
                    "Min": "Min",
                    "Max": "Max",
                    "Index": "Índice",
                    "SampleStDev": "StDev de muestra",
                    "PopulationStDev": "Población StDev",
                    "SampleVar": "Var de muestra",
                    "PopulationVar": "Población Var",
                    "RunningTotals": "Totales acumulados",
                    "DifferenceFrom": "Diferencia de",
                    "PercentageOfDifferenceFrom": "% de diferencia de",
                    "PercentageOfGrandTotal": "% del total general",
                    "PercentageOfColumnTotal": "% del total de la columna",
                    "PercentageOfRowTotal": "% del total de filas",
                    "PercentageOfParentTotal": "% del total de padres",
                    "PercentageOfParentColumnTotal": "% del total de la columna principal",
                    "PercentageOfParentRowTotal": "% del total de la fila principal",
                    "Years": "Años",
                    "Quarters": "Cuarteles",
                    "Months": "Meses",
                    "Days": "Dias",
                    "Hours": "Horas",
                    "Minutes": "Minutos",
                    "Seconds": "Segundos",
                    "apply": "APLICAR",
                    "valueFieldSettings": "Configuración del campo de valor",
                    "sourceName": "Nombre del campo :",
                    "sourceCaption": "Título de campo:",
                    "summarizeValuesBy": "Resumir valores por:",
                    "baseField": "Campo base:",
                    "baseItem": "Artículo base:",
                    "example": "p.ej:",
                    "editorDataLimitMsg": " mas cosas. Buscar para refinar aún más.",
                    "deferLayoutUpdate": "Aplazar actualización de diseño",
                    "null": "nulo",
                    "undefined": "indefinido",
                    "groupOutOfRange": "Fuera de rango",
                    "fieldDropErrorAction": "El campo que está moviendo no se puede colocar en esa área del informe",
                    "MoreOption": "Más...",
                    "memberType": "Tipo de campo",
                    "selectedHierarchy": "Jerarquía de padres",
                    "formatString": "Cadena de formato",
                    "expressionField": "Expresión",
                    "olapDropText": "Ejemplo: [Medidas]. [Cantidad de pedido] + ([Medidas]. [Cantidad de pedido] * 0.10)",
                    "customFormat": "Ingrese una cadena de formato personalizado",
                    "Measure": "Medida",
                    "Dimension": "Dimensión",
                    "Standard": "Estándar",
                    "Currency": "Moneda",
                    "Percent": "Por ciento",
                    "Custom": "Personalizado",
                    "blank": "(Blanco)",
                    "fieldTooltip": "Arrastre y suelte campos para crear una expresión. Y, si desea editar los campos calculados existentes! Puede lograrlo simplemente seleccionando el campo en 'Miembros calculados'.",
                    "fieldTitle": "Nombre del campo",
                    "QuarterYear": "Cuarto año",
                    "caption": "Título de campo",
                    "copy": "Copiar",
                    "group": "Grupo",
                    "numberFormatString": "Ejemplo: C, P, 0000%, ### 0. ## 0 #, etc.",
                    "sortAscending": "Ordenar orden ascendente",
                    "sortDescending": "Ordenar orden descendente",
                    "sortNone": "Ordenar orden de datos",
                    "clearCalculatedField": "Borrar información de campo editado",
                    "editCalculatedField": "Editar campo calculado",
                    "selectGroup": "Seleccionar grupos",
                    "of": "de",
                    "removeCalculatedField": "¿Está seguro de que desea eliminar este campo calculado?"
                },
                "filemanager": {
                    "NewFolder": "Nueva carpeta",
                    "Upload": "Subir",
                    "Delete": "Eliminar",
                    "Rename": "Rebautizar",
                    "Download": "Descargar",
                    "Cut": "Cortar",
                    "Copy": "Copiar",
                    "Paste": "Pegar",
                    "SortBy": "Ordenar por",
                    "Refresh": "Actualizar",
                    "Item-Selection": "elemento seleccionado",
                    "Items-Selection": "artículos seleccionados",
                    "View": "Ver",
                    "Details": "Detalles",
                    "SelectAll": "Seleccionar todo",
                    "Open": "Abierto",
                    "Tooltip-NewFolder": "Nueva carpeta",
                    "Tooltip-Upload": "Subir",
                    "Tooltip-Delete": "Eliminar",
                    "Tooltip-Rename": "Rebautizar",
                    "Tooltip-Download": "Descargar",
                    "Tooltip-Cut": "Cortar",
                    "Tooltip-Copy": "Copiar",
                    "Tooltip-Paste": "Pegar",
                    "Tooltip-SortBy": "Ordenar por",
                    "Tooltip-Refresh": "Actualizar",
                    "Tooltip-Selection": "Selección clara",
                    "Tooltip-View": "Ver",
                    "Tooltip-Details": "Detalles",
                    "Tooltip-SelectAll": "Seleccionar todo",
                    "Name": "Nombre",
                    "Size": "Talla",
                    "DateModified": "Modificado",
                    "DateCreated": "Fecha de creacion",
                    "Path": "Camino",
                    "Modified": "Modificado",
                    "Created": "Creado",
                    "Location": "Ubicación",
                    "Type": "Tipo",
                    "Permission": "Permiso",
                    "Ascending": "Ascendente",
                    "Descending": "Descendente",
                    "View-LargeIcons": "Iconos grandes",
                    "View-Details": "Detalles",
                    "Search": "Buscar",
                    "Button-Ok": "Ok",
                    "Button-Cancel": "Cancelar",
                    "Button-Yes": "Si",
                    "Button-No": "No",
                    "Button-Create": "Crear",
                    "Button-Save": "Guardar",
                    "Header-NewFolder": "Carpeta",
                    "Content-NewFolder": "Ingrese el nombre de su carpeta",
                    "Header-Rename": "Rebautizar",
                    "Content-Rename": "Ingrese su nuevo nombre",
                    "Header-Rename-Confirmation": "Cambiar nombre de confirmación",
                    "Content-Rename-Confirmation": "Si cambia una extensión de nombre de archivo, el archivo podría volverse inestable. ¿Estás seguro de que quieres cambiarlo?",
                    "Header-Delete": "Borrar archivo",
                    "Content-Delete": "¿Seguro que quieres eliminar este archivo?",
                    "Header-Multiple-Delete": "Eliminar múltiples archivos",
                    "Content-Multiple-Delete": "¿Está seguro de que desea eliminar estos {0} archivos?",
                    "Header-Duplicate": "Archivo / Carpeta existe",
                    "Content-Duplicate": "{0} ya existe. ¿Quieres renombrar y pegar?",
                    "Header-Upload": "Subir archivos",
                    "Error": "Error",
                    "Validation-Empty": "El nombre del archivo o carpeta no puede estar vacío.",
                    "Validation-Invalid": "El nombre del archivo o carpeta {0} contiene caracteres no válidos. Por favor use un nombre diferente. Los nombres válidos de archivos o carpetas no pueden terminar con un punto o espacio, y no pueden contener ninguno de los siguientes caracteres: \\ /: *? \"<> |",
                    "Validation-NewFolder-Exists": "Ya existe un archivo o carpeta con el nombre {0}.",
                    "Validation-Rename-Exists": "No se puede cambiar el nombre de {0} a {1}: el destino ya existe.",
                    "Folder-Empty": "Esta carpeta está vacía",
                    "File-Upload": "Arrastra los archivos aquí para subir",
                    "Search-Empty": "No se han encontrado resultados",
                    "Search-Key": "Pruebe con diferentes palabras clave",
                    "Filter-Empty": "No se han encontrado resultados",
                    "Filter-Key": "Probar con un filtro diferente",
                    "Sub-Folder-Error": "La carpeta de destino es la subcarpeta de la carpeta de origen.",
                    "Access-Denied": "Acceso denegado",
                    "Access-Details": "No tienes permiso para acceder a esta carpeta.",
                    "Header-Retry": "El archivo ya existe",
                    "Content-Retry": "Ya existe un archivo con este nombre en esta carpeta. Que te gustaría hacer?",
                    "Button-Keep-Both": "Mantén ambos",
                    "Button-Replace": "Reemplazar",
                    "Button-Skip": "Omitir",
                    "ApplyAll-Label": "Haz esto para todos los artículos actuales",
                    "KB": "KB",
                    "Access-Message": "{0} no es accesible. Necesita permiso para realizar la acción {1}.",
                    "Network-Error": "NetworkError: error al enviar en XMLHTTPRequest: error al cargar",
                    "Server-Error": "ServerError: respuesta no válida de"
                },
                "inplaceeditor": {
                    "save": "Guardar",
                    "cancel": "Cancelar",
                    "loadingText": "Cargando...",
                    "editIcon": "Haz click para editar",
                    "editAreaClick": "Haz click para editar",
                    "editAreaDoubleClick": "Doble click para editar"
                },
                "treegrid": {
                    "Above": "Encima",
                    "Below": "Abajo",
                    "AddRow": "Añadir fila",
                    "ExpandAll": "Expandir todo",
                    "CollapseAll": "Desplegar todo"
                },
                "colorpicker": {
                    "Apply": "Aplicar",
                    "Cancel": "Cancelar",
                    "ModeSwitcher": "Modo interruptor"
                },
                "uploader": {
                    "Browse": "Seleccionar",
                    "Clear": "Limpiar",
                    "Upload": "Subir",
                    "dropFilesHint": "O suelta archivos aquí",
                    "invalidMaxFileSize": "El tamaño del archivo es demasiado grande.",
                    "invalidMinFileSize": "El tamaño del archivo es demasiado pequeño.",
                    "invalidFileType": "El tipo de archivo no está permitido",
                    "uploadFailedMessage": "El archivo no se pudo cargar",
                    "uploadSuccessMessage": "documento cargado exitosamente",
                    "removedSuccessMessage": "Archivo eliminado con éxito",
                    "removedFailedMessage": "No se puede eliminar el archivo",
                    "inProgress": "Cargando",
                    "readyToUploadMessage": "Listo para subir",
                    "abort": "Abortar",
                    "remove": "Eliminar",
                    "cancel": "Cancelar",
                    "delete": "Borrar archivo",
                    "pauseUpload": "Carga de archivo en pausa",
                    "pause": "Pausa",
                    "resume": "Resumir",
                    "retry": "Procesar de nuevo",
                    "fileUploadCancel": "Carga de archivo cancelada"
                },
                "numerictextbox": {
                    "incrementTitle": "Valor de incremento",
                    "decrementTitle": "Valor de disminución"
                },
                "slider": {
                    "incrementTitle": "Incrementar",
                    "decrementTitle": "Disminución"
                },
                "formValidator": {
                    "required": "Este campo es requerido.",
                    "email": "Por favor, introduce una dirección de correo electrónico válida.",
                    "url": "Por favor introduzca un URL válido.",
                    "date": "Por favor introduzca una fecha valida.",
                    "dateIso": "Por favor, introduzca una fecha válida (ISO).",
                    "creditcard": "Por favor ingrese un número de tarjeta válido",
                    "number": "Por favor ingrese un número valido.",
                    "digits": "Por favor ingrese solo dígitos.",
                    "maxLength": "Ingrese no más de {0} caracteres.",
                    "minLength": "Ingrese al menos {0} caracteres.",
                    "rangeLength": "Ingrese un valor entre {0} y {1} caracteres de longitud.",
                    "range": "Ingrese un valor entre {0} y {1}.",
                    "max": "Ingrese un valor menor o igual a {0}.",
                    "min": "Ingrese un valor mayor o igual a {0}.",
                    "regex": "Por favor, introduzca un valor correcto.",
                    "tel": "Por favor ingrese un número de teléfono válido.",
                    "pattern": "Por favor, introduzca un valor de patrón correcto.",
                    "equalTo": "Por favor ingrese el texto válido del partido"
                },
                "richtexteditor": {
                    "alignments": "Alineaciones",
                    "justifyLeft": "Alinear a la izquierda",
                    "justifyCenter": "Alinear al centro",
                    "justifyRight": "Alinear a la derecha",
                    "justifyFull": "Alinear Justificar",
                    "fontName": "Nombre de la fuente",
                    "fontSize": "Tamaño de fuente",
                    "fontColor": "Color de fuente",
                    "backgroundColor": "Color de fondo",
                    "bold": "Negrita",
                    "italic": "Itálico",
                    "underline": "Subrayar",
                    "strikethrough": "Tachado",
                    "clearFormat": "Formato claro",
                    "clearAll": "Limpiar todo",
                    "cut": "Cortar",
                    "copy": "Copiar",
                    "paste": "Pegar",
                    "unorderedList": "Lista con viñetas",
                    "orderedList": "Lista numerada",
                    "indent": "Aumentar sangría",
                    "outdent": "Disminuir sangría",
                    "undo": "Deshacer",
                    "redo": "Rehacer",
                    "superscript": "Sobrescrito",
                    "subscript": "Subíndice",
                    "createLink": "Insertar hipervínculo",
                    "openLink": "Enlace abierto",
                    "editLink": "Editar enlace",
                    "removeLink": "Remover enlace",
                    "image": "Insertar imagen",
                    "replace": "Reemplazar",
                    "align": "Alinear",
                    "caption": "Captura de imagen",
                    "remove": "Eliminar",
                    "insertLink": "Insertar el link",
                    "display": "Monitor",
                    "altText": "Texto alternativo",
                    "dimension": "Cambiar tamaño",
                    "fullscreen": "Maximizar",
                    "maximize": "Maximizar",
                    "minimize": "Minimizar",
                    "lowerCase": "Minúscula",
                    "upperCase": "Mayúscula",
                    "print": "Impresión",
                    "formats": "Formatos",
                    "sourcecode": "Vista de código",
                    "preview": "Avance",
                    "viewside": "ViewSide",
                    "insertCode": "Insertar codigo",
                    "linkText": "Mostrar texto",
                    "linkTooltipLabel": "Título",
                    "linkWebUrl": "Dirección web",
                    "linkTitle": "Ingrese un título",
                    "linkurl": "http://ejemplo.com",
                    "linkOpenInNewWindow": "Abrir enlace en una nueva ventana",
                    "linkHeader": "Insertar el link",
                    "dialogInsert": "Insertar",
                    "dialogCancel": "Cancelar",
                    "dialogUpdate": "Actualizar",
                    "imageHeader": "Insertar imagen",
                    "imageLinkHeader": "También puede proporcionar un enlace desde la web",
                    "mdimageLink": "Proporcione una URL para su imagen",
                    "imageUploadMessage": "Suelta la imagen aquí o navega para subir",
                    "imageDeviceUploadMessage": "Haga clic aquí para subir",
                    "imageAlternateText": "Texto alternativo",
                    "alternateHeader": "Texto alternativo",
                    "browse": "Seleccionar",
                    "imageUrl": "http://example.com/image.png",
                    "imageCaption": "Subtítulo",
                    "imageSizeHeader": "Tamaño de la imagen",
                    "imageHeight": "Altura",
                    "imageWidth": "Anchura",
                    "textPlaceholder": "Ingrese texto",
                    "inserttablebtn": "Insertar tabla",
                    "tabledialogHeader": "Insertar tabla",
                    "tableWidth": "Anchura",
                    "cellpadding": "Relleno Celular",
                    "cellspacing": "Espaciamiento celular",
                    "columns": "Número de columnas",
                    "rows": "Número de filas",
                    "tableRows": "Filas de mesa",
                    "tableColumns": "Columnas de mesa",
                    "tableCellHorizontalAlign": "Alineación horizontal de celda de tabla",
                    "tableCellVerticalAlign": "Alineación vertical de celda de tabla",
                    "createTable": "Crear mesa",
                    "removeTable": "Eliminar tabla",
                    "tableHeader": "Encabezado de tabla",
                    "tableRemove": "Eliminar tabla",
                    "tableCellBackground": "Fondo de celda de tabla",
                    "tableEditProperties": "Propiedades de edición de tabla",
                    "styles": "Estilos",
                    "insertColumnLeft": "Insertar columna a la izquierda",
                    "insertColumnRight": "Insertar columna a la derecha",
                    "deleteColumn": "Eliminar columna",
                    "insertRowBefore": "Insertar fila antes",
                    "insertRowAfter": "Insertar fila después",
                    "deleteRow": "Borrar fila",
                    "tableEditHeader": "Editar tabla",
                    "TableHeadingText": "Bóveda",
                    "TableColText": "Columna",
                    "imageInsertLinkHeader": "Insertar el link",
                    "editImageHeader": "Editar imagen",
                    "alignmentsDropDownLeft": "Alinear a la izquierda",
                    "alignmentsDropDownCenter": "Alinear al centro",
                    "alignmentsDropDownRight": "Alinear a la derecha",
                    "alignmentsDropDownJustify": "Alinear Justificar",
                    "imageDisplayDropDownInline": "En línea",
                    "imageDisplayDropDownBreak": "Descanso",
                    "tableInsertRowDropDownBefore": "Insertar fila antes",
                    "tableInsertRowDropDownAfter": "Insertar fila después",
                    "tableInsertRowDropDownDelete": "Borrar fila",
                    "tableInsertColumnDropDownLeft": "Insertar columna a la izquierda",
                    "tableInsertColumnDropDownRight": "Insertar columna a la derecha",
                    "tableInsertColumnDropDownDelete": "Eliminar columna",
                    "tableVerticalAlignDropDownTop": "Alinear la parte superior",
                    "tableVerticalAlignDropDownMiddle": "Alinear Medio",
                    "tableVerticalAlignDropDownBottom": "Alinear la parte inferior",
                    "tableStylesDropDownDashedBorder": "Fronteras discontinuas",
                    "tableStylesDropDownAlternateRows": "Filas Alternas",
                    "pasteFormat": "Pegar formato",
                    "pasteFormatContent": "Elija la acción de formateo",
                    "plainText": "Texto sin formato",
                    "cleanFormat": "Limpiar",
                    "keepFormat": "Mantener",
                    "pasteDialogOk": "Ok",
                    "pasteDialogCancel": "Cancelar"
                },
                "diagram": {
                    "Copy": "Copiar",
                    "Cut": "Cortar",
                    "Paste": "Pegar",
                    "Undo": "Deshacer",
                    "Redo": "Rehacer",
                    "SelectAll": "Seleccionar todo",
                    "Grouping": "Agrupamiento",
                    "Group": "Grupo",
                    "UnGroup": "Desagrupar",
                    "Order": "Orden",
                    "BringToFront": "Traer al frente",
                    "MoveForward": "Avanzar",
                    "SendToBack": "Enviar al fondo",
                    "SendBackward": "Enviar atrás"
                },
                "DocumentEditor": {
                    "Table": "Mesa",
                    "Row": "Fila",
                    "Cell": "Célula",
                    "Ok": "Ok",
                    "Cancel": "Cancelar",
                    "Size": "Talla",
                    "Preferred Width": "Ancho preferido",
                    "Points": "Puntos",
                    "Percent": "Por ciento",
                    "Measure in": "Medir en",
                    "Alignment": "Alineación",
                    "Left": "Izquierda",
                    "Center": "Centrar",
                    "Right": "Derecho",
                    "Justify": "Justificar",
                    "Indent from left": "Sangría desde la izquierda",
                    "Borders and Shading": "Bordes y sombreado",
                    "Options": "Opciones",
                    "Specify height": "Especificar altura",
                    "At least": "Al menos",
                    "Exactly": "Exactamente",
                    "Row height is": "La altura de la fila es",
                    "Allow row to break across pages": "Permitir que la fila se rompa entre páginas",
                    "Repeat as header row at the top of each page": "Repita como fila de encabezado en la parte superior de cada página",
                    "Vertical alignment": "Alineamiento vertical",
                    "Top": "Parte superior",
                    "Bottom": "Fondo",
                    "Default cell margins": "Márgenes de celda predeterminados",
                    "Default cell spacing": "Espaciado de celda predeterminado",
                    "Allow spacing between cells": "Permitir espacio entre celdas",
                    "Cell margins": "Márgenes celulares",
                    "Same as the whole table": "Igual que toda la mesa",
                    "Borders": "Fronteras",
                    "None": "Ninguna",
                    "Style": "Estilo",
                    "Width": "Anchura",
                    "Height": "Altura",
                    "Letter": "Letra",
                    "Tabloid": "Tabloide",
                    "Legal": "Legal",
                    "Statement": "Declaración",
                    "Executive": "Ejecutivo",
                    "A3": "A3",
                    "A4": "A4",
                    "A5": "A5",
                    "B4": "B4",
                    "B5": "B5",
                    "Custom Size": "Tamaño personalizado",
                    "Different odd and even": "Diferentes pares e impares",
                    "Different first page": "Primera página diferente",
                    "From edge": "Desde el borde",
                    "Header": "Encabezamiento",
                    "Footer": "Pie de página",
                    "Margin": "Márgenes",
                    "Paper": "Papel",
                    "Layout": "Diseño",
                    "Orientation": "Orientación",
                    "Landscape": "Paisaje",
                    "Portrait": "Retrato",
                    "Table Of Contents": "Tabla de contenido",
                    "Show page numbers": "Mostrar números de página",
                    "Right align page numbers": "Alinear a la derecha los números de página",
                    "Nothing": "Nada",
                    "Tab leader": "Tabulador",
                    "Show levels": "Mostrar niveles",
                    "Use hyperlinks instead of page numbers": "Use hipervínculos en lugar de números de página",
                    "Build table of contents from": "Crear tabla de contenido a partir de",
                    "Styles": "Estilos",
                    "Available styles": "Estilos disponibles",
                    "TOC level": "Nivel de TOC",
                    "Heading": "Bóveda",
                    "List Paragraph": "Párrafo de lista",
                    "Normal": "Normal",
                    "Outline levels": "Niveles de esquema",
                    "Table entry fields": "Campos de entrada de tabla",
                    "Modify": "Modificar",
                    "Color": "Color",
                    "Setting": "Ajuste",
                    "Box": "Caja",
                    "All": "Todos",
                    "Custom": "Personalizado",
                    "Preview": "Avance",
                    "Shading": "Sombreado",
                    "Fill": "Llenar",
                    "Apply To": "Aplicar para",
                    "Table Properties": "Propiedades de tabla",
                    "Cell Options": "Opciones de celda",
                    "Table Options": "Opciones de tabla",
                    "Insert Table": "Insertar tabla",
                    "Number of columns": "Número de columnas",
                    "Number of rows": "Número de filas",
                    "Text to display": "Texto a mostrar",
                    "Address": "Habla a",
                    "Insert Hyperlink": "Insertar hipervínculo",
                    "Edit Hyperlink": "Editar hipervínculo",
                    "Insert": "Insertar",
                    "General": "General",
                    "Indentation": "Sangría",
                    "Before text": "Antes del texto",
                    "Special": "Especial",
                    "First line": "Primera linea",
                    "Hanging": "Colgando",
                    "After text": "Después del texto",
                    "By": "Por",
                    "Before": "antes de",
                    "Line Spacing": "Espaciado entre líneas",
                    "After": "Después",
                    "At": "A",
                    "Multiple": "Múltiple",
                    "Spacing": "Espaciado",
                    "Define new Multilevel list": "Definir nueva lista multinivel",
                    "List level": "Nivel de lista",
                    "Choose level to modify": "Elija el nivel para modificar",
                    "Level": "Nivel",
                    "Number format": "Formato numérico",
                    "Number style for this level": "Estilo numérico para este nivel",
                    "Enter formatting for number": "Ingrese el formato para el número",
                    "Start at": "Empieza en",
                    "Restart list after": "Reiniciar lista después",
                    "Position": "Posición",
                    "Text indent at": "Sangría de texto en",
                    "Aligned at": "Alineado a las",
                    "Follow number with": "Seguir número con",
                    "Tab character": "Carácter de tabulación",
                    "Space": "Espacio",
                    "Arabic": "Arábica",
                    "UpRoman": "UpRoman",
                    "LowRoman": "LowRoman",
                    "UpLetter": "UpLetter",
                    "LowLetter": "Letra baja",
                    "Number": "Número",
                    "Leading zero": "Cero a la izquierda",
                    "Bullet": "Bala",
                    "Ordinal": "Ordinal",
                    "Ordinal Text": "Texto ordinal",
                    "For East": "Para el este",
                    "No Restart": "No reiniciar",
                    "Font": "Fuente",
                    "Font style": "Estilo de fuente",
                    "Underline style": "Estilo subrayado",
                    "Font color": "Color de fuente",
                    "Effects": "Efectos",
                    "Strikethrough": "Tachado",
                    "Superscript": "Sobrescrito",
                    "Subscript": "Subíndice",
                    "Double strikethrough": "Tachado doble",
                    "Regular": "Regular",
                    "Bold": "Negrita",
                    "Italic": "Itálico",
                    "Cut": "Cortar",
                    "Copy": "Copiar",
                    "Paste": "Pegar",
                    "Hyperlink": "Hipervínculo",
                    "Open Hyperlink": "Abrir hipervínculo",
                    "Copy Hyperlink": "Copiar hipervínculo",
                    "Remove Hyperlink": "Eliminar hipervínculo",
                    "Paragraph": "Párrafo",
                    "Merge Cells": "Combinar células",
                    "Insert Above": "Insertar arriba",
                    "Insert Below": "Insertar a continuación",
                    "Insert Left": "Insertar a la izquierda",
                    "Insert Right": "Insertar a la derecha",
                    "Delete": "Eliminar",
                    "Delete Table": "Eliminar tabla",
                    "Delete Row": "Borrar fila",
                    "Delete Column": "Eliminar columna",
                    "File Name": "Nombre del archivo",
                    "Format Type": "Tipo de formato",
                    "Save": "Guardar",
                    "Navigation": "Navegación",
                    "Results": "Resultados",
                    "Replace": "Reemplazar",
                    "Replace All": "Reemplaza todo",
                    "We replaced all": "Reemplazamos todo",
                    "Find": "Encontrar",
                    "No matches": "No hay coincidencias",
                    "All Done": "Todo listo",
                    "Result": "Resultado",
                    "of": "de",
                    "instances": "instancias",
                    "with": "con",
                    "Click to follow link": "Haga clic para seguir el enlace",
                    "Continue Numbering": "Continuar numerando",
                    "Bookmark name": "Nombre del marcador",
                    "Close": "Cerrar",
                    "Restart At": "Reiniciar en",
                    "Properties": "Propiedades",
                    "Name": "Nombre",
                    "Style type": "Tipo de estilo",
                    "Style based on": "Estilo basado en",
                    "Style for following paragraph": "Estilo para el siguiente párrafo",
                    "Formatting": "Formateo",
                    "Numbering and Bullets": "Numeración y viñetas",
                    "Numbering": "Numeración",
                    "Update Field": "Campo de actualización",
                    "Edit Field": "Editar campo",
                    "Bookmark": "Marcador",
                    "Page Setup": "Configurar página",
                    "No bookmarks found": "No se encontraron marcadores",
                    "Number format tooltip information": "Formato de número de nivel único: </br> [PREFIJO]% [NIVEL DE NIVEL] [SUFIJO] </br> Por ejemplo, Capítulo% 1. mostrará numeración como </br> Capítulo 1. Elemento </br> Capítulo 2. Elemento </br> ... </br> Capítulo N. Elemento </br> </br> Formato de número multinivel: </ br > [PREFIJO]% [NIVEL DE NIVEL] [SUFIJO] + [PREFIJO]% [NIVEL DE NIVEL] [SUFIJO] </br> Por ejemplo,% 1.% 2. mostrará numeración como </br> 1.1. Artículo </br> 1.2. Artículo </br> ... </br> 1.N. Articulo",
                    "Format": "Formato",
                    "Create New Style": "Crear nuevo estilo",
                    "Modify Style": "Modificar estilo",
                    "New": "Nuevo",
                    "Bullets": "Balas",
                    "Use bookmarks": "Usar marcadores",
                    "Table of Contents": "Tabla de contenido"
                },
                "barcode": {},
                "datamatrix": {},
                "qrcode": {},
                "drawing": {},
                "schedule": {
                    "day": "Día",
                    "week": "Semana",
                    "workWeek": "Semana de trabajo",
                    "month": "Mes",
                    "agenda": "Agenda",
                    "weekAgenda": "Agenda de la semana",
                    "workWeekAgenda": "Agenda de la semana laboral",
                    "monthAgenda": "Agenda del mes",
                    "today": "Hoy",
                    "noEvents": "No hay eventos",
                    "emptyContainer": "No hay eventos programados para este día.",
                    "allDay": "Todo el dia",
                    "start": "comienzo",
                    "end": "Final",
                    "more": "más",
                    "close": "Cerrar",
                    "cancel": "Cancelar",
                    "noTitle": "(Sin título)",
                    "delete": "Eliminar",
                    "deleteEvent": "Este evento",
                    "deleteMultipleEvent": "Eliminar múltiples eventos",
                    "selectedItems": "Artículos seleccionados",
                    "deleteSeries": "Serie completa",
                    "edit": "Editar",
                    "editSeries": "Serie completa",
                    "editEvent": "Este evento",
                    "createEvent": "Crear",
                    "subject": "Tema",
                    "addTitle": "Añadir título",
                    "moreDetails": "Más detalles",
                    "save": "Guardar",
                    "editContent": "¿Cómo le gustaría cambiar la cita en la serie?",
                    "deleteContent": "¿Seguro que quieres eliminar este evento?",
                    "deleteMultipleContent": "¿Estás seguro de que deseas eliminar los eventos seleccionados?",
                    "newEvent": "Nuevo evento",
                    "title": "Título",
                    "location": "Ubicación",
                    "description": "Descripción",
                    "timezone": "Zona horaria",
                    "startTimezone": "Zona horaria de inicio",
                    "endTimezone": "Zona horaria final",
                    "repeat": "Repetir",
                    "saveButton": "Guardar",
                    "cancelButton": "Cancelar",
                    "deleteButton": "Eliminar",
                    "recurrence": "Reaparición",
                    "wrongPattern": "El patrón de recurrencia no es válido.",
                    "seriesChangeAlert": "¿Desea cancelar los cambios realizados en instancias específicas de esta serie y volver a vincularlos con toda la serie?",
                    "createError": "La duración del evento debe ser más corta que la frecuencia con la que ocurre. Acorte la duración o cambie el patrón de recurrencia en el editor de eventos de recurrencia.",
                    "sameDayAlert": "Dos ocurrencias del mismo evento no pueden ocurrir en el mismo día.",
                    "editRecurrence": "Editar recurrencia",
                    "repeats": "Repite",
                    "alert": "Alerta",
                    "startEndError": "La fecha de finalización seleccionada ocurre antes de la fecha de inicio.",
                    "invalidDateError": "El valor de la fecha ingresada no es válido.",
                    "blockAlert": "Los eventos no se pueden programar dentro del rango de tiempo bloqueado.",
                    "ok": "Ok",
                    "yes": "Si",
                    "no": "No",
                    "occurrence": "Ocurrencia",
                    "series": "Serie",
                    "previous": "Anterior",
                    "next": "próximo",
                    "timelineDay": "Día de la línea de tiempo",
                    "timelineWeek": "Semana de la línea de tiempo",
                    "timelineWorkWeek": "Semana laboral cronológica",
                    "timelineMonth": "Mes de la línea de tiempo",
                    "timelineYear": "Cronología Año",
                    "editFollowingEvent": "Eventos siguientes",
                    "deleteTitle": "Eliminar evento",
                    "editTitle": "Editar evento",
                    "beginFrom": "Comience desde",
                    "endAt": "Termina en"
                },
                "recurrenceeditor": {
                    "none": "Ninguna",
                    "daily": "Diario",
                    "weekly": "Semanal",
                    "monthly": "Mensual",
                    "month": "Mes",
                    "yearly": "Anual",
                    "never": "Nunca",
                    "until": "Hasta",
                    "count": "Contar",
                    "first": "primero",
                    "second": "Segundo",
                    "third": "Tercero",
                    "fourth": "Cuarto",
                    "last": "Último",
                    "repeat": "Repetir",
                    "repeatEvery": "Repite cada",
                    "on": "Repetir en",
                    "end": "Final",
                    "onDay": "Día",
                    "days": "Dias)",
                    "weeks": "Semanas)",
                    "months": "Meses)",
                    "years": "Años)",
                    "every": "cada",
                    "summaryTimes": "veces)",
                    "summaryOn": "en",
                    "summaryUntil": "hasta",
                    "summaryRepeat": "Repite",
                    "summaryDay": "dias)",
                    "summaryWeek": "semanas)",
                    "summaryMonth": "meses)",
                    "summaryYear": "años)",
                    "monthWeek": "Mes Semana",
                    "monthPosition": "Posición del mes",
                    "monthExpander": "Expansor de mes",
                    "yearExpander": "Expansor de año",
                    "repeatInterval": "Intervalo de repetición"
                },
                "spreadsheet": {
                    "InsertingEmptyValue": "El valor de referencia no es válido.",
                    "FindValue": "Encuentra valor",
                    "ReplaceValue": "Reemplazar valor",
                    "FindReplaceTooltip": "Buscar y reemplazar",
                    "ByRow": " Por filas",
                    "ByColumn": "Por columnas",
                    "MatchExactCellElements": "Coincide con el contenido exacto de la celda",
                    "EntercellAddress": "Ingrese la dirección de la celda",
                    "FindAndReplace": "Encontrar y reemplazar",
                    "ReplaceAllEnd": " partidos reemplazados por",
                    "FindNextBtn": "Encontrar siguiente",
                    "FindPreviousBtn": "Encontrar anterior",
                    "ReplaceBtn": "Reemplazar",
                    "ReplaceAllBtn": "Reemplaza todo",
                    "GotoHeader": "Ir",
                    "GotoSpecialHeader": "Ir a especial",
                    "Sheet": "Sábana",
                    "SearchWithin": "Buscar dentro",
                    "SearchBy": "Búsqueda por",
                    "Reference": "Referencia",
                    "Workbook": "Libro de trabajo",
                    "NoElements": "No pudimos encontrar lo que estabas buscando. Haga clic en las opciones para obtener más formas de búsqueda",
                    "FindWhat": "Encontrar que",
                    "ReplaceWith": "Reemplazar con",
                    "EnterValue": "Ingrese valor",
                    "Cut": "Cortar",
                    "Copy": "Copiar",
                    "Paste": "Pegar",
                    "PasteSpecial": "Pegado especial",
                    "All": "Todos",
                    "Values": "Valores",
                    "Formats": "Formatos",
                    "Font": "Fuente",
                    "FontSize": "Tamaño de fuente",
                    "Bold": "Negrita",
                    "Italic": "Itálico",
                    "Underline": "Subrayar",
                    "Strikethrough": "Tachado",
                    "TextColor": "Color de texto",
                    "FillColor": "Color de relleno",
                    "HorizontalAlignment": "Alineación horizontal",
                    "AlignLeft": "Alinear a la izquierda",
                    "AlignCenter": "Centrar",
                    "AlignRight": "Alinear a la derecha",
                    "VerticalAlignment": "Alineamiento vertical",
                    "AlignTop": "Alinear la parte superior",
                    "AlignMiddle": "Alinear Medio",
                    "AlignBottom": "Alinear la parte inferior",
                    "MergeCells": "Combinar células",
                    "MergeAll": "Fusionar todo",
                    "MergeHorizontally": "Fusionar horizontalmente",
                    "MergeVertically": "Fusionar verticalmente",
                    "Unmerge": "Desunir",
                    "UnmergeCells": "Unmerge Cells",
                    "SelectMergeType": "Seleccionar tipo de fusión",
                    "MergeCellsAlert": "La combinación de celdas solo conservará el valor superior izquierdo (superior). Fusionar de todos modos?",
                    "PasteMergeAlert": "No podemos hacer eso en una celda de fusión.",
                    "Borders": "Fronteras",
                    "SelectBorderOption": "Seleccionar opción de borde",
                    "TopBorders": "Fronteras superiores",
                    "LeftBorders": "Fronteras izquierdas",
                    "RightBorders": "Fronteras derechas",
                    "BottomBorders": "Fronteras inferiores",
                    "AllBorders": "Todas las fronteras",
                    "HorizontalBorders": "Fronteras horizontales",
                    "VerticalBorders": "Fronteras verticales",
                    "OutsideBorders": "Fronteras exteriores",
                    "InsideBorders": "Fronteras interiores",
                    "NoBorders": "Sin Fronteras",
                    "BorderColor": "Color del borde",
                    "BorderStyle": "Estilo de borde",
                    "InsertFunction": "Función de inserción",
                    "Insert": "Insertar",
                    "Delete": "Eliminar",
                    "Rename": "Rebautizar",
                    "Hide": "Esconder",
                    "Unhide": "Mostrar",
                    "NameBox": "Nombre de Caja",
                    "ShowHeaders": "Mostrar encabezados",
                    "HideHeaders": "Ocultar encabezados",
                    "ShowGridLines": "Mostrar cuadrículas",
                    "HideGridLines": "Ocultar cuadrículas",
                    "AddSheet": "Agregar hoja",
                    "ListAllSheets": "Listar todas las hojas",
                    "FullScreen": "Pantalla completa",
                    "CollapseToolbar": "Contraer barra de herramientas",
                    "ExpandToolbar": "Expandir barra de herramientas",
                    "CollapseFormulaBar": "Contraer barra de fórmulas",
                    "ExpandFormulaBar": "Expandir barra de fórmulas",
                    "File": "Archivo",
                    "Home": "Hogar",
                    "Formulas": "Fórmulas",
                    "View": "Ver",
                    "New": "Nuevo",
                    "Open": "Abierto",
                    "SaveAs": "Guardar como",
                    "ExcelXlsx": "Microsoft Excel",
                    "ExcelXls": "Microsoft Excel 97-2003",
                    "CSV": "Valores Separados por Comas",
                    "FormulaBar": "Barra de formulas",
                    "Sort": "Ordenar",
                    "SortAscending": "Ascendente",
                    "SortDescending": "Descendente",
                    "CustomSort": "Ordenación personalizada",
                    "AddColumn": "Añadir columna",
                    "ContainsHeader": "Los datos contienen encabezado",
                    "CaseSensitive": "Distingue mayúsculas y minúsculas",
                    "SortBy": "Ordenar por",
                    "ThenBy": "Entonces por",
                    "SelectAColumn": "Selecciona una columna",
                    "SortEmptyFieldError": "Todos los criterios de clasificación deben tener una columna especificada. Verifique los criterios de clasificación seleccionados e intente nuevamente.",
                    "SortDuplicateFieldError": " se ordena por valores más de una vez. Elimine los criterios de ordenación duplicados e intente nuevamente.",
                    "SortOutOfRangeError": "Seleccione una celda o rango dentro del rango utilizado e intente nuevamente.",
                    "HideRow": "Ocultar fila",
                    "HideRows": "Ocultar filas",
                    "UnHideRows": "UnHide Filas",
                    "HideColumn": "Ocultar columna",
                    "HideColumns": "Ocultar columnas",
                    "UnHideColumns": "UnHide Columnas",
                    "InsertRow": "Insertar fila",
                    "InsertRows": "Insertar filas",
                    "Above": "Encima",
                    "Below": "Abajo",
                    "InsertColumn": "Insertar columna",
                    "InsertColumns": "Insertar columnas",
                    "Before": "antes de",
                    "After": "Después",
                    "DeleteRow": "Borrar fila",
                    "DeleteRows": "Eliminar filas",
                    "DeleteColumn": "Eliminar columna",
                    "DeleteColumns": "Eliminar columnas",
                    "Ok": "Ok",
                    "Close": "Cerrar",
                    "Cancel": "Cancelar",
                    "Apply": "Aplicar",
                    "MoreColors": "Mas colores",
                    "StandardColors": "Colores estándar",
                    "General": "General",
                    "Number": "Número",
                    "Currency": "Moneda",
                    "Accounting": "Contabilidad",
                    "ShortDate": "Cita corta",
                    "LongDate": "Fecha larga",
                    "Time": "Hora",
                    "Percentage": "Porcentaje",
                    "Fraction": "Fracción",
                    "Scientific": "Científico",
                    "Text": "Texto",
                    "NumberFormat": "Formato numérico",
                    "MobileFormulaBarPlaceHolder": "Ingrese el valor o la fórmula",
                    "PasteAlert": "No puede pegar esto aquí, porque el área de copia y el área de pegado no tienen el mismo tamaño. Intenta pegar en un rango diferente.",
                    "DestroyAlert": "¿Está seguro de que desea destruir el libro de trabajo actual sin guardar y crear un nuevo libro de trabajo?",
                    "SheetRenameInvalidAlert": "El nombre de la hoja contiene caracteres no válidos.",
                    "SheetRenameEmptyAlert": "El nombre de la hoja no puede estar vacío.",
                    "SheetRenameAlreadyExistsAlert": "El nombre de la hoja ya existe. Por favor ingrese otro nombre.",
                    "DeleteSheetAlert": "¿Seguro que quieres eliminar esta hoja?",
                    "DeleteSingleLastSheetAlert": "Un libro de trabajo debe contener al menos una hoja de trabajo visible.",
                    "PickACategory": "Elige una categoría",
                    "Description": "Descripción",
                    "UnsupportedFile": "Archivo no soportado",
                    "InvalidUrl": "URL invalida",
                    "SUM": "Agrega una serie de números y / o celdas.",
                    "SUMIF": "Agrega las celdas según la condición especificada.",
                    "SUMIFS": "Agrega las celdas según las condiciones especificadas.",
                    "ABS": "Devuelve el valor de un número sin su signo.",
                    "RAND": "Devuelve un número aleatorio entre 0 y 1.",
                    "RANDBETWEEN": "Devuelve un entero aleatorio basado en valores especificados.",
                    "FLOOR": "Redondea un número hacia abajo al múltiplo más cercano de un factor dado.",
                    "CEILING": "Redondea un número al múltiplo más cercano de un factor dado.",
                    "PRODUCT": "Multiplica una serie de números y / o celdas.",
                    "AVERAGE": "Calcula el promedio de la serie de números y / o celdas excluyendo el texto.",
                    "AVERAGEIF": "Calcula el promedio de las celdas según el criterio especificado.",
                    "AVERAGEIFS": "Calcula el promedio de las celdas según las condiciones especificadas.",
                    "AVERAGEA": "Calcula el promedio de las celdas que evalúan VERDADERO como 1, texto y FALSO como 0.",
                    "COUNT": "Cuenta las celdas que contienen valores numéricos en un rango.",
                    "COUNTIF": "Cuenta las celdas según la condición especificada.",
                    "COUNTIFS": "Cuenta las celdas según las condiciones especificadas.",
                    "COUNTA": "Cuenta las celdas que contienen valores en un rango.",
                    "MIN": "Devuelve el número más pequeño de los argumentos dados.",
                    "MAX": "Devuelve el mayor número de argumentos dados.",
                    "DATE": "Devuelve la fecha según el año, mes y día dados.",
                    "DAY": "Devuelve el día desde la fecha dada.",
                    "DAYS": "Devuelve el número de días entre dos fechas.",
                    "IF": "Devuelve el valor basado en la expresión dada.",
                    "IFS": "Devuelve el valor basado en las múltiples expresiones dadas.",
                    "CalculateAND": "Devuelve VERDADERO si todos los argumentos son VERDADEROS; de lo contrario, devuelve FALSO.",
                    "CalculateOR": "Devuelve VERDADERO si alguno de los argumentos es VERDADERO; de lo contrario, devuelve FALSO.",
                    "IFERROR": "Devuelve el valor si no se encuentra ningún error; de lo contrario, devolverá el valor especificado.",
                    "CHOOSE": "Devuelve un valor de la lista de valores, según el número de índice.",
                    "INDEX": "Devuelve un valor de la celda en un rango determinado según el número de fila y columna.",
                    "FIND": "Devuelve la posición de una cadena dentro de otra cadena, que distingue entre mayúsculas y minúsculas",
                    "CONCATENATE": "Combina dos o más cadenas juntas.",
                    "CONCAT": "Concatena una lista o un rango de cadenas de texto.",
                    "SUBTOTAL": "Devuelve el subtotal de un rango usando el número de función dado.",
                    "RADIANS": "Convierte grados en radianes.",
                    "MATCH": "Devuelve la posición relativa de un valor especificado en un rango dado.",
                    "SLOPE": "Devuelve la pendiente de la línea desde la regresión lineal de los puntos de datos.",
                    "INTERCEPT": "Calcula el punto de la línea de intersección en Y mediante regresión lineal.",
                    "DefineNameExists": "Este nombre ya existe, intente con un nombre diferente.",
                    "CircularReference": "Cuando una fórmula se refiere a una o más referencias circulares, esto puede resultar en un cálculo incorrecto.",
                    "ShowRowsWhere": "Mostrar filas donde:",
                    "OR": "O",
                    "AND": "Y",
                    "CustomFilterDatePlaceHolder": "Elige una fecha",
                    "CustomFilterPlaceHolder": "Ingrese el valor",
                    "CustomFilter": "Filtro personalizado",
                    "Between": "Entre",
                    "MatchCase": "Match Case",
                    "DateTimeFilter": "Filtros de fecha y hora",
                    "Undo": "Deshacer",
                    "Redo": "Rehacer",
                    "DateFilter": "Filtros de fecha",
                    "TextFilter": "Filtros de texto",
                    "NumberFilter": "Filtros de número",
                    "ClearFilter": "Filtro claro",
                    "NoResult": "No se encontraron coincidencias",
                    "FilterFalse": "Falso",
                    "FilterTrue": "Verdadero",
                    "Blanks": "Espacios en blanco",
                    "SelectAll": "Seleccionar todo",
                    "GreaterThanOrEqual": "Mayor que o igual",
                    "GreaterThan": "Mas grande que",
                    "LessThanOrEqual": "Menor o igual",
                    "LessThan": "Menos que",
                    "NotEqual": "No es igual",
                    "Equal": "Igual",
                    "Contains": "Contiene",
                    "EndsWith": "Termina con",
                    "StartsWith": "Comienza con",
                    "ClearButton": "Limpiar",
                    "FilterButton": "Filtrar",
                    "CancelButton": "Cancelar",
                    "OKButton": "Ok",
                    "Search": "Buscar",
                    "DataValidation": "Validación de datos",
                    "CLEARALL": "LIMPIAR TODO",
                    "APPLY": "APLICAR",
                    "CellRange": "Rango de celdas",
                    "Allow": "Permitir",
                    "Data": "Datos",
                    "Minimum": "Mínimo",
                    "Maximum": "Máximo",
                    "IgnoreBlank": "Ignorar en blanco",
                    "WholeNumber": "Número entero",
                    "Decimal": "Decimal",
                    "Date": "Fecha",
                    "TextLength": "Longitud del texto",
                    "List": "Lista",
                    "NotBetween": "No entre",
                    "EqualTo": "Igual a",
                    "NotEqualTo": "No igual a",
                    "Greaterthan": "Mas grande que",
                    "Lessthan": "Menos que",
                    "GreaterThanOrEqualTo": "Mayor qué o igual a",
                    "LessThanOrEqualTo": "Menos que o igual a",
                    "InCellDropDown": "Desplegable en la celda",
                    "Sources": "Fuentes",
                    "Value": "Valor",
                    "Retry": "Procesar de nuevo",
                    "DialogError": "El origen de la lista debe ser una referencia a una sola fila o columna.",
                    "ValidationError": "Este valor no coincide con las restricciones de validación de datos definidas para la celda.",
                    "ProtectSheet": "Hoja de protección",
                    "UnprotectSheet": "Desproteger hoja",
                    "SelectCells": "Seleccionar celdas",
                    "FormatCells": "Formato de celdas",
                    "FormatRows": "Formatear filas",
                    "Format Columns": "Formatear columnas",
                    "InsertLinks": "Insertar enlaces",
                    "ProtectContent": "Protege el contenido de las celdas bloqueadas",
                    "ProtectAllowUser": "Permita que todos los usuarios de esta hoja de trabajo:",
                    "EditAlert": "La celda que intenta cambiar está protegida. Para hacer el cambio, desproteja la hoja.",
                    "ClearValidation": "Validación clara"
                },
                "pdfviewer": {
                    "PdfViewer": "Visor de PDF",
                    "Cancel": "Cancelar",
                    "Download file": "Descargar archivo",
                    "Download": "Descargar",
                    "Enter Password": "Este documento está protegido por contraseña. Porfavor ingrese una contraseña.",
                    "File Corrupted": "Archivo corrupto",
                    "File Corrupted Content": "El archivo está dañado y no se puede abrir.",
                    "Fit Page": "La página de ajuste",
                    "Fit Width": "Ajuste ancho",
                    "Automatic": "Automático",
                    "Go To First Page": "Mostrar primera página",
                    "Invalid Password": "Contraseña incorrecta. Inténtalo de nuevo.",
                    "Next Page": "Mostrar página siguiente",
                    "OK": "Ok",
                    "Open": "Abrir documento",
                    "Page Number": "Número de página actual",
                    "Previous Page": "Mostrar página anterior",
                    "Go To Last Page": "Mostrar la última página",
                    "Zoom": "Enfocar",
                    "Zoom In": "Acercarse",
                    "Zoom Out": "Disminuir el zoom",
                    "Page Thumbnails": "Miniaturas de página",
                    "Bookmarks": "Marcadores",
                    "Print": "Imprimir archivo",
                    "Password Protected": "Se requiere contraseña",
                    "Copy": "Copiar",
                    "Text Selection": "Herramienta de selección de texto",
                    "Panning": "Modo panorámico",
                    "Text Search": "Buscar texto",
                    "Find in document": "Encuentra en el documento",
                    "Match case": "Caso de partido",
                    "Apply": "Aplicar",
                    "GoToPage": "Ir a la página",
                    "No matches": "El visor ha terminado de buscar el documento. No se encontraron más coincidencias.",
                    "No Text Found": "No se encontró texto",
                    "Undo": "Deshacer",
                    "Redo": "Rehacer",
                    "Annotation": "Agregar o editar anotaciones",
                    "Highlight": "Subrayar el texto",
                    "Underline": "Subrayar texto",
                    "Strikethrough": "Texto tachado",
                    "Delete": "Eliminar anotación",
                    "Opacity": "Opacidad",
                    "Color edit": "Cambiar el color",
                    "Opacity edit": "Cambiar opacidad",
                    "Highlight context": "Realce",
                    "Underline context": "Subrayar",
                    "Strikethrough context": "Penetrar",
                    "Server error": "El servicio web no está escuchando. PDF Viewer depende del servicio web para todas sus funciones. Inicie el servicio web para continuar.",
                    "Open text": "Abierto",
                    "First text": "Primera página",
                    "Previous text": "Pagina anterior",
                    "Next text": "Siguiente página",
                    "Last text": "Última página",
                    "Zoom in text": "Acercarse",
                    "Zoom out text": "Disminuir el zoom",
                    "Selection text": "Selección",
                    "Pan text": "Pan",
                    "Print text": "Impresión",
                    "Search text": "Buscar",
                    "Annotation Edit text": "Editar anotación",
                    "Line Thickness": "Grosor de la línea",
                    "Line Properties": "Propiedades de linea",
                    "Start Arrow": "Flecha de inicio",
                    "End Arrow": "Flecha final",
                    "Line Style": "Estilo de línea",
                    "Fill Color": "Color de relleno",
                    "Line Color": "Color de linea",
                    "None": "Ninguna",
                    "Open Arrow": "Abierto",
                    "Closed Arrow": "Cerrado",
                    "Round Arrow": "Redondo",
                    "Square Arrow": "Cuadrado",
                    "Diamond Arrow": "Diamante",
                    "Cut": "Cortar",
                    "Paste": "Pegar",
                    "Delete Context": "Eliminar",
                    "Properties": "Propiedades",
                    "Add Stamp": "Agregar sello",
                    "Add Shapes": "Agregar formas",
                    "Stroke edit": "Cambiar color de trazo",
                    "Change thickness": "Cambiar grosor del borde",
                    "Add line": "Añadir línea",
                    "Add arrow": "Agregar flecha",
                    "Add rectangle": "Añadir rectángulo",
                    "Add circle": "Agregar círculo",
                    "Add polygon": "Agregar polígono",
                    "Add Comments": "Añadir comentarios",
                    "Comments": "Comentarios",
                    "No Comments Yet": "Sin comentarios aún",
                    "Accepted": "Aceptado",
                    "Completed": "Terminado",
                    "Cancelled": "Cancelado",
                    "Rejected": "Rechazado",
                    "Leader Length": "Longitud del líder",
                    "Scale Ratio": "Ratio de escala",
                    "Calibrate": "Calibrar",
                    "Calibrate Distance": "Calibrar distancia",
                    "Calibrate Perimeter": "Calibrar perímetro",
                    "Calibrate Area": "Área de calibración",
                    "Calibrate Radius": "Calibrar radio",
                    "Calibrate Volume": "Calibrar volumen"
                },
                "querybuilder": {
                    "StartsWith": "Comienza con",
                    "EndsWith": "Termina con",
                    "Contains": "Contiene",
                    "Equal": "Igual",
                    "NotEqual": "No es igual",
                    "LessThan": "Menos que",
                    "LessThanOrEqual": "Menor o igual",
                    "GreaterThan": "Mas grande que",
                    "GreaterThanOrEqual": "Mayor que o igual",
                    "Between": "Entre",
                    "NotBetween": "No entre",
                    "Empty": "Vacío",
                    "NotEmpty": "No vacío",
                    "In": "En",
                    "NotIn": "No en",
                    "NotContains": "No contiene",
                    "Remove": "ELIMINAR",
                    "SelectField": "Selecciona un campo",
                    "SelectOperator": "Seleccionar operador",
                    "DeleteRule": "Eliminar esta condición",
                    "DeleteGroup": "Eliminar grupo",
                    "AddGroup": "Añadir grupo",
                    "AddCondition": "Agregar condición",
                    "Edit": "EDITAR",
                    "ValidationMessage": "este campo es requerido",
                    "SummaryViewTitle": "Vista de resumen",
                    "OtherFields": "Otros campos",
                    "AND": "Y",
                    "OR": "O",
                    "SelectValue": "Ingrese valor"
                },
                "grid": {
                    "EmptyRecord": "No hay registros que mostrar",
                    "True": "Verdadero",
                    "False": "Falso",
                    "InvalidFilterMessage": "Datos de filtro no válidos",
                    "GroupDropArea": "Arrastre el encabezado de una columna aquí para agrupar su columna",
                    "UnGroup": "Haga clic aquí para desagrupar",
                    "GroupDisable": "La agrupación está deshabilitada para esta columna",
                    "FilterbarTitle": "celda de barra de filtro",
                    "EmptyDataSourceError": "DataSource no debe estar vacío en la carga inicial ya que las columnas se generan a partir de dataSource en AutoGenerate Column Grid",
                    "Add": "Añadir",
                    "Edit": "Editar",
                    "Cancel": "Cancelar",
                    "Update": "Actualizar",
                    "Delete": "Eliminar",
                    "Print": "Impresión",
                    "Pdfexport": "Exportar PDF",
                    "Excelexport": "Exportación Excel",
                    "Wordexport": "Exportación de palabras",
                    "Csvexport": "Exportación CSV",
                    "Search": "Buscar",
                    "Columnchooser": "Columnas",
                    "Save": "Guardar",
                    "Item": "articulo",
                    "Items": "artículos",
                    "EditOperationAlert": "No hay registros seleccionados para la operación de edición",
                    "DeleteOperationAlert": "No hay registros seleccionados para la operación de eliminación",
                    "SaveButton": "Guardar",
                    "OKButton": "Ok",
                    "CancelButton": "Cancelar",
                    "EditFormTitle": "Detalles de",
                    "AddFormTitle": "Añadir nuevo récord",
                    "BatchSaveConfirm": "¿Seguro que quieres guardar los cambios?",
                    "BatchSaveLostChanges": "Los cambios no guardados se perderán. Estás seguro de que quieres continuar?",
                    "ConfirmDelete": "¿Estás seguro de que deseas eliminar el registro?",
                    "CancelEdit": "¿Estás seguro de que deseas cancelar los cambios?",
                    "ChooseColumns": "Elegir columna",
                    "SearchColumns": "columnas de búsqueda",
                    "Matchs": "No se encontraron coincidencias",
                    "FilterButton": "Filtrar",
                    "ClearButton": "Limpiar",
                    "StartsWith": "Comienza con",
                    "EndsWith": "Termina con",
                    "Contains": "Contiene",
                    "Equal": "Igual",
                    "NotEqual": "No es igual",
                    "LessThan": "Menos que",
                    "LessThanOrEqual": "Menor o igual",
                    "GreaterThan": "Mas grande que",
                    "GreaterThanOrEqual": "Mayor que o igual",
                    "ChooseDate": "Elige una fecha",
                    "EnterValue": "Ingrese el valor",
                    "Copy": "Copiar",
                    "Group": "Agrupar por esta columna",
                    "Ungroup": "Desagrupar por esta columna",
                    "autoFitAll": "Ajuste automático de todas las columnas",
                    "autoFit": "Ajustar automáticamente esta columna",
                    "Export": "Exportar",
                    "FirstPage": "Primera página",
                    "LastPage": "Última página",
                    "PreviousPage": "Pagina anterior",
                    "NextPage": "Siguiente página",
                    "SortAscending": "Orden ascendente",
                    "SortDescending": "Orden descendiente",
                    "EditRecord": "Editar registro",
                    "DeleteRecord": "Eliminar el registro",
                    "FilterMenu": "Filtrar",
                    "SelectAll": "Seleccionar todo",
                    "Blanks": "Espacios en blanco",
                    "FilterTrue": "Verdadero",
                    "FilterFalse": "Falso",
                    "NoResult": "No se encontraron coincidencias",
                    "ClearFilter": "Filtro claro",
                    "NumberFilter": "Filtros de número",
                    "TextFilter": "Filtros de texto",
                    "DateFilter": "Filtros de fecha",
                    "DateTimeFilter": "Filtros de fecha y hora",
                    "MatchCase": "Match Case",
                    "Between": "Entre",
                    "CustomFilter": "Filtro personalizado",
                    "CustomFilterPlaceHolder": "Ingrese el valor",
                    "CustomFilterDatePlaceHolder": "Elige una fecha",
                    "AND": "Y",
                    "OR": "O",
                    "ShowRowsWhere": "Mostrar filas donde:"
                },
                "pager": {
                    "currentPageInfo": "{0} de {1} páginas",
                    "totalItemsInfo": "({0} artículos)",
                    "firstPageTooltip": "Ir a la primera página",
                    "lastPageTooltip": "Ir a la última página",
                    "nextPageTooltip": "Ir a la página siguiente",
                    "previousPageTooltip": "Regresar a la pagina anterior",
                    "nextPagerTooltip": "Ir al siguiente localizador",
                    "previousPagerTooltip": "Ir al localizador anterior",
                    "pagerDropDown": "Artículos por página",
                    "pagerAllDropDown": "Artículos",
                    "All": "Todos"
                },
                "calendar": {
                    "today": "Hoy"
                },
                "datepicker": {
                    "today": "Hoy",
                    "placeholder": "Elige una fecha"
                },
                "daterangepicker": {
                    "placeholder": "Elige un rango de fechas",
                    "startLabel": "Fecha de inicio",
                    "endLabel": "Fecha final",
                    "applyText": "Aplicar",
                    "cancelText": "Cancelar",
                    "selectedDays": "Días seleccionados",
                    "days": "Días",
                    "customRange": "Rango personalizado"
                },
                "timepicker": {
                    "placeholder": "Elige un momento"
                },
                "datetimepicker": {
                    "today": "Hoy",
                    "placeholder": "Elige una fecha y hora"
                },
                "gantt": {
                    "emptyRecord": "No hay registros que mostrar",
                    "id": "CARNÉ DE IDENTIDAD",
                    "name": "Nombre",
                    "startDate": "Fecha de inicio",
                    "endDate": "Fecha final",
                    "duration": "Duración",
                    "progress": "Progreso",
                    "dependency": "Dependencia",
                    "notes": "Notas",
                    "baselineStartDate": "Fecha de inicio de línea de base",
                    "baselineEndDate": "Fecha de finalización de línea de base",
                    "taskMode": "Modo de Tarea",
                    "changeScheduleMode": "Cambiar modo de programación",
                    "subTasksStartDate": "Fecha de inicio de subtareas",
                    "subTasksEndDate": "Fecha de finalización de subtareas",
                    "scheduleStartDate": "Fecha de inicio del horario",
                    "scheduleEndDate": "Fecha de finalización del horario",
                    "auto": "Auto",
                    "manual": "Manual",
                    "type": "Tipo",
                    "offset": "Compensar",
                    "resourceName": "Recursos",
                    "resourceID": "ID de recurso",
                    "day": "día",
                    "hour": "hora",
                    "minute": "minuto",
                    "days": "dias",
                    "hours": "horas",
                    "minutes": "minutos",
                    "generalTab": "General",
                    "customTab": "Columnas personalizadas",
                    "writeNotes": "Escribe notas",
                    "addDialogTitle": "Nueva tarea",
                    "editDialogTitle": "Información de tarea",
                    "saveButton": "Guardar",
                    "add": "Añadir",
                    "edit": "Editar",
                    "update": "Actualizar",
                    "delete": "Eliminar",
                    "cancel": "Cancelar",
                    "search": "Buscar",
                    "task": " tarea",
                    "tasks": " Tareas",
                    "zoomIn": "Acercarse",
                    "zoomOut": "Disminuir el zoom",
                    "zoomToFit": "Zoom para ajustar",
                    "excelExport": "Exportación Excel",
                    "csvExport": "Exportación CSV",
                    "expandAll": "Expandir todo",
                    "collapseAll": "Desplegar todo",
                    "nextTimeSpan": "Próximo intervalo de tiempo",
                    "prevTimeSpan": "Periodo de tiempo anterior",
                    "okText": "Ok",
                    "confirmDelete": "¿Estás seguro de que deseas eliminar el registro?",
                    "from": "Desde",
                    "to": "A",
                    "taskLink": "Enlace de tareas",
                    "lag": "Retraso",
                    "start": "comienzo",
                    "finish": "Terminar",
                    "enterValue": "Ingrese el valor",
                    "taskBeforePredecessor_FS": "Movió '{0}' para comenzar antes de que '{1}' finalice y las dos tareas estén vinculadas. Como resultado, los enlaces no pueden ser respetados. Seleccione una acción a continuación para realizar",
                    "taskAfterPredecessor_FS": "Se movió '{0}' lejos de '{1}' y las dos tareas están vinculadas. Como resultado, los enlaces no pueden ser respetados. Seleccione una acción a continuación para realizar",
                    "taskBeforePredecessor_SS": "Movió '{0}' para comenzar antes de que comience '{1}' y las dos tareas estén vinculadas. Como resultado, los enlaces no pueden ser respetados. Seleccione una acción a continuación para realizar",
                    "taskAfterPredecessor_SS": "Movió '{0}' para comenzar después de que '{1}' comience y las dos tareas estén vinculadas. Como resultado, los enlaces no pueden ser respetados. Seleccione una acción a continuación para realizar",
                    "taskBeforePredecessor_FF": "Movió '{0}' para finalizar antes de que '{1}' finalice y las dos tareas estén vinculadas. Como resultado, los enlaces no pueden ser respetados. Seleccione una acción a continuación para realizar",
                    "taskAfterPredecessor_FF": "Movió '{0}' para finalizar después de que '{1}' finalice y las dos tareas estén vinculadas. Como resultado, los enlaces no pueden ser respetados. Seleccione una acción a continuación para realizar",
                    "taskBeforePredecessor_SF": "Se movió '{0}' lejos de '{1}' para comenzar y las dos tareas están vinculadas. Como resultado, los enlaces no pueden ser respetados. Seleccione una acción a continuación para realizar",
                    "taskAfterPredecessor_SF": "Movió '{0}' para finalizar después de que '{1}' comience y las dos tareas estén vinculadas. Como resultado, los enlaces no pueden ser respetados. Seleccione una acción a continuación para realizar",
                    "taskInformation": "Información de tarea",
                    "deleteTask": "Eliminar tarea",
                    "deleteDependency": "Eliminar dependencia",
                    "convert": "Convertir",
                    "save": "Guardar",
                    "above": "Encima",
                    "below": "Abajo",
                    "child": "Hijo",
                    "milestone": "Hito",
                    "toTask": "A la tarea",
                    "toMilestone": "Al hito",
                    "eventMarkers": "Marcadores de eventos",
                    "leftTaskLabel": "Etiqueta de tarea izquierda",
                    "rightTaskLabel": "Etiqueta de tarea correcta",
                    "timelineCell": "Celda de línea de tiempo",
                    "confirmPredecessorDelete": "¿Seguro que quieres eliminar el enlace de dependencia?",
                    "unit": "Unidad",
                    "work": "Trabajo",
                    "taskType": "Tipo de tarea",
                    "unassignedTask": "Tarea no asignada",
                    "group": "Grupo"
                },
                "dropdowns": {
                    "noRecordsTemplate": "No se encontraron registros",
                    "actionFailureTemplate": "La solicitud falló",
                    "overflowCountTemplate": "+${count} más ..",
                    "selectAllText": "Seleccionar todo",
                    "unSelectAllText": "Deselecciona todo",
                    "totalCountTemplate": "${count} seleccionado"
                },
                "drop-down-list": {
                    "noRecordsTemplate": "No se encontraron registros",
                    "actionFailureTemplate": "La solicitud falló"
                },
                "combo-box": {
                    "noRecordsTemplate": "No se encontraron registros",
                    "actionFailureTemplate": "La solicitud falló"
                },
                "auto-complete": {
                    "noRecordsTemplate": "No se encontraron registros",
                    "actionFailureTemplate": "La solicitud falló"
                },
                "multi-select": {
                    "noRecordsTemplate": "No se encontraron registros",
                    "actionFailureTemplate": "La solicitud falló",
                    "overflowCountTemplate": "+${count} más ..",
                    "selectAllText": "Seleccionar todo",
                    "unSelectAllText": "Deselecciona todo",
                    "totalCountTemplate": "${count} seleccionado"
                },
                "listbox": {
                    "noRecordsTemplate": "No se encontraron registros",
                    "actionFailureTemplate": "La solicitud falló",
                    "selectAllText": "Seleccionar todo",
                    "unSelectAllText": "Deselecciona todo",
                    "moveUp": "Ascender",
                    "moveDown": "Mover hacia abajo",
                    "moveTo": "Mover a",
                    "moveFrom": "Mover de",
                    "moveAllTo": "Mover todo a",
                    "moveAllFrom": "Mover todo de"
                },
                "dialog": {
                    "close": "Cerrar"
                },
                "rich-text-editor": {
                    "alignments": "alineaciones",
                    "justifyleft": "justifyLeft",
                    "justifycenter": "justifyCenter",
                    "justifyright": "justifyRight",
                    "justifyfull": "justifyFull",
                    "fontname": "nombre de la fuente",
                    "fontsize": "tamaño de fuente",
                    "fontcolor": "color de fuente",
                    "backgroundcolor": "color de fondo",
                    "clearformat": "clearFormat",
                    "clearall": "limpiar todo",
                    "unorderedlist": "lista desordenada",
                    "orderedlist": "lista ordenada",
                    "createlink": "crear vínculo",
                    "openlink": "enlace abierto",
                    "editlink": "editLink",
                    "removelink": "remover enlace",
                    "openimagelink": "enlace abierto",
                    "editimagelink": "editLink",
                    "removeimagelink": "remover enlace",
                    "image": "imagen",
                    "replace": "reemplazar",
                    "align": "alinear",
                    "caption": "subtítulo",
                    "remove": "eliminar",
                    "insertlink": "Insertar el link",
                    "display": "monitor",
                    "alttext": "texto alternativo",
                    "dimension": "dimensión",
                    "fullscreen": "pantalla completa",
                    "maximize": "maximizar",
                    "minimize": "minimizar",
                    "lowercase": "lowerCase",
                    "uppercase": "upperCase",
                    "print": "impresión",
                    "formats": "formatos",
                    "sourcecode": "código fuente",
                    "preview": "avance",
                    "viewside": "lado de vista",
                    "insertcode": "insertar codigo",
                    "justifyLeft": "Alinear a la izquierda",
                    "justifyCenter": "Alinear al centro",
                    "justifyRight": "Alinear a la derecha",
                    "justifyFull": "Alinear Justificar",
                    "fontName": "Nombre de la fuente",
                    "fontSize": "Tamaño de fuente",
                    "fontColor": "Color de fuente",
                    "backgroundColor": "Color de fondo",
                    "bold": "negrita",
                    "italic": "itálico",
                    "underline": "subrayar",
                    "strikethrough": "tachado",
                    "cut": "cortar",
                    "copy": "Copiar",
                    "paste": "pegar",
                    "indent": "sangrar",
                    "outdent": "outdent",
                    "undo": "deshacer",
                    "redo": "rehacer",
                    "superscript": "sobrescrito",
                    "subscript": "subíndice",
                    "createLink": "Insertar hipervínculo",
                    "openLink": "Enlace abierto",
                    "editLink": "Editar enlace",
                    "removeLink": "Remover enlace",
                    "insertLink": "Insertar el link",
                    "altText": "Texto alternativo",
                    "lowerCase": "Minúscula",
                    "upperCase": "Mayúscula",
                    "insertCode": "Insertar codigo",
                    "linkText": "Mostrar texto",
                    "linkTooltipLabel": "Información sobre herramientas",
                    "linkWebUrl": "Dirección web",
                    "linkurl": "http://ejemplo.com",
                    "linkOpenInNewWindow": "Abrir enlace en una nueva ventana",
                    "linkHeader": "Insertar el link",
                    "dialogInsert": "Insertar",
                    "dialogCancel": "Cancelar",
                    "dialogUpdate": "Actualizar",
                    "imageHeader": "Insertar imagen",
                    "imageLinkHeader": "También puede proporcionar un enlace desde la web",
                    "mdimageLink": "Proporcione una URL para su imagen",
                    "imageUploadMessage": "Suelta la imagen aquí o navega para subir",
                    "imageDeviceUploadMessage": "Haga clic aquí para subir",
                    "imageAlternateText": "Texto alternativo",
                    "alternateHeader": "Texto alternativo",
                    "browse": "Seleccionar",
                    "imageUrl": "http://example.com/image.png",
                    "imageCaption": "Subtítulo",
                    "imageSizeHeader": "Tamaño de la imagen",
                    "imageHeight": "Altura",
                    "imageWidth": "Anchura",
                    "textPlaceholder": "Ingrese texto"
                },
                "inplace-editor": {
                    "editIcon": "Haz click para editar",
                    "save": "Guardar",
                    "cancel": "Cancelar"
                },
                "chart": {
                    "Zoom": "Enfocar",
                    "ZoomIn": "Acercarse",
                    "ZoomOut": "Disminuir el zoom",
                    "Reset": "Reiniciar",
                    "Pan": "Pan",
                    "ResetZoom": "Restablecer zoom"
                },
                "drop-down-base": {
                    "noRecordsTemplate": "No se encontraron registros",
                    "actionFailureTemplate": "La solicitud falló"
                },
                "maps": {
                    "Zoom": "Enfocar",
                    "ZoomIn": "Acercarse",
                    "ZoomOut": "Disminuir el zoom",
                    "Reset": "Reiniciar",
                    "Pan": "Pan",
                    "ResetZoom": "Restablecer zoom"
                },
                "PdfViewer": {
                    "PdfViewer": "Visor de PDF",
                    "Cancel": "Cancelar",
                    "Download file": "Descargar archivo",
                    "Download": "Descargar",
                    "Enter Password": "Este documento está protegido por contraseña. Porfavor ingrese una contraseña.",
                    "File Corrupted": "Archivo corrupto",
                    "File Corrupted Content": "El archivo está dañado y no se puede abrir.",
                    "Fit Page": "La página de ajuste",
                    "Fit Width": "Ajuste ancho",
                    "Automatic": "Automático",
                    "Go To First Page": "Mostrar primera página",
                    "Invalid Password": "Contraseña incorrecta. Inténtalo de nuevo.",
                    "Next Page": "Mostrar página siguiente",
                    "OK": "Ok",
                    "Open": "Abrir documento",
                    "Page Number": "Número de página actual",
                    "Previous Page": "Mostrar página anterior",
                    "Go To Last Page": "Mostrar la última página",
                    "Zoom": "Enfocar",
                    "Zoom In": "Acercarse",
                    "Zoom Out": "Disminuir el zoom",
                    "Page Thumbnails": "Miniaturas de página",
                    "Bookmarks": "Marcadores",
                    "Print": "Imprimir archivo",
                    "Password Protected": "Se requiere contraseña",
                    "Copy": "Copiar",
                    "Text Selection": "Herramienta de selección de texto",
                    "Panning": "Modo panorámico",
                    "Text Search": "Buscar texto",
                    "Find in document": "Encuentra en el documento",
                    "Match case": "Caso de partido",
                    "Apply": "Aplicar",
                    "GoToPage": "Ir a la página",
                    "No matches": "El visor ha terminado de buscar el documento. No se encontraron más coincidencias.",
                    "No Text Found": "No se encontró texto",
                    "Undo": "Deshacer",
                    "Redo": "Rehacer",
                    "Annotation": "Agregar o editar anotaciones",
                    "Highlight": "Subrayar el texto",
                    "Underline": "Subrayar texto",
                    "Strikethrough": "Texto tachado",
                    "Delete": "Eliminar anotación",
                    "Opacity": "Opacidad",
                    "Color edit": "Cambiar el color",
                    "Opacity edit": "Cambiar opacidad",
                    "Highlight context": "Realce",
                    "Underline context": "Subrayar",
                    "Strikethrough context": "Penetrar",
                    "Server error": "El servicio web no está escuchando. PDF Viewer depende del servicio web para todas sus funciones. Inicie el servicio web para continuar.",
                    "Open text": "Abierto",
                    "First text": "Primera página",
                    "Previous text": "Pagina anterior",
                    "Next text": "Siguiente página",
                    "Last text": "Última página",
                    "Zoom in text": "Acercarse",
                    "Zoom out text": "Disminuir el zoom",
                    "Selection text": "Selección",
                    "Pan text": "Pan",
                    "Print text": "Impresión",
                    "Search text": "Buscar",
                    "Annotation Edit text": "Editar anotación",
                    "Line Thickness": "Grosor de la línea",
                    "Line Properties": "Propiedades de linea",
                    "Start Arrow": "Flecha de inicio",
                    "End Arrow": "Flecha final",
                    "Line Style": "Estilo de línea",
                    "Fill Color": "Color de relleno",
                    "Line Color": "Color de linea",
                    "None": "Ninguna",
                    "Open Arrow": "Abierto",
                    "Closed Arrow": "Cerrado",
                    "Round Arrow": "Redondo",
                    "Square Arrow": "Cuadrado",
                    "Diamond Arrow": "Diamante",
                    "Cut": "Cortar",
                    "Paste": "Pegar",
                    "Delete Context": "Eliminar",
                    "Properties": "Propiedades",
                    "Add Stamp": "Agregar sello",
                    "Add Shapes": "Agregar formas",
                    "Stroke edit": "Cambiar color de trazo",
                    "Change thickness": "Cambiar grosor del borde",
                    "Add line": "Añadir línea",
                    "Add arrow": "Agregar flecha",
                    "Add rectangle": "Añadir rectángulo",
                    "Add circle": "Agregar círculo",
                    "Add polygon": "Agregar polígono",
                    "Add Comments": "Añadir comentarios",
                    "Comments": "Comentarios",
                    "No Comments Yet": "Sin comentarios aún",
                    "Accepted": "Aceptado",
                    "Completed": "Terminado",
                    "Cancelled": "Cancelado",
                    "Rejected": "Rechazado",
                    "Leader Length": "Longitud del líder",
                    "Scale Ratio": "Ratio de escala",
                    "Calibrate": "Calibrar",
                    "Calibrate Distance": "Calibrar distancia",
                    "Calibrate Perimeter": "Calibrar perímetro",
                    "Calibrate Area": "Área de calibración",
                    "Calibrate Radius": "Calibrar radio",
                    "Calibrate Volume": "Calibrar volumen"
                },
                "documenteditor": {
                    "Table": "Mesa",
                    "Row": "Fila",
                    "Cell": "Célula",
                    "Ok": "Ok",
                    "Cancel": "Cancelar",
                    "Size": "Talla",
                    "Preferred Width": "Ancho preferido",
                    "Points": "Puntos",
                    "Percent": "Por ciento",
                    "Measure in": "Medir en",
                    "Alignment": "Alineación",
                    "Left": "Izquierda",
                    "Center": "Centrar",
                    "Right": "Derecho",
                    "Justify": "Justificar",
                    "Indent from left": "Sangría desde la izquierda",
                    "Borders and Shading": "Bordes y sombreado",
                    "Options": "Opciones",
                    "Specify height": "Especificar altura",
                    "At least": "Al menos",
                    "Exactly": "Exactamente",
                    "Row height is": "La altura de la fila es",
                    "Allow row to break across pages": "Permitir que la fila se rompa entre páginas",
                    "Repeat as header row at the top of each page": "Repita como fila de encabezado en la parte superior de cada página",
                    "Vertical alignment": "Alineamiento vertical",
                    "Top": "Parte superior",
                    "Bottom": "Fondo",
                    "Default cell margins": "Márgenes de celda predeterminados",
                    "Default cell spacing": "Espaciado de celda predeterminado",
                    "Allow spacing between cells": "Permitir espacio entre celdas",
                    "Cell margins": "Márgenes celulares",
                    "Same as the whole table": "Igual que toda la mesa",
                    "Borders": "Fronteras",
                    "None": "Ninguna",
                    "Style": "Estilo",
                    "Width": "Anchura",
                    "Height": "Altura",
                    "Letter": "Letra",
                    "Tabloid": "Tabloide",
                    "Legal": "Legal",
                    "Statement": "Declaración",
                    "Executive": "Ejecutivo",
                    "A3": "A3",
                    "A4": "A4",
                    "A5": "A5",
                    "B4": "B4",
                    "B5": "B5",
                    "Custom Size": "Tamaño personalizado",
                    "Different odd and even": "Diferentes pares e impares",
                    "Different first page": "Primera página diferente",
                    "From edge": "Desde el borde",
                    "Header": "Encabezamiento",
                    "Footer": "Pie de página",
                    "Margin": "Márgenes",
                    "Paper": "Papel",
                    "Layout": "Diseño",
                    "Orientation": "Orientación",
                    "Landscape": "Paisaje",
                    "Portrait": "Retrato",
                    "Show page numbers": "Mostrar números de página",
                    "Right align page numbers": "Alinear a la derecha los números de página",
                    "Nothing": "Nada",
                    "Tab leader": "Tabulador",
                    "Show levels": "Mostrar niveles",
                    "Use hyperlinks instead of page numbers": "Use hipervínculos en lugar de números de página",
                    "Build table of contents from": "Crear tabla de contenido a partir de",
                    "Styles": "Estilos",
                    "Available styles": "Estilos disponibles",
                    "TOC level": "Nivel de TOC",
                    "Heading": "Bóveda",
                    "Heading 1": "Título 1",
                    "Heading 2": "Título 2",
                    "Heading 3": "Título 3",
                    "Heading 4": "Título 4",
                    "Heading 5": "Título 5",
                    "Heading 6": "Título 6",
                    "List Paragraph": "Párrafo de lista",
                    "Normal": "Normal",
                    "Outline levels": "Niveles de esquema",
                    "Table entry fields": "Campos de entrada de tabla",
                    "Modify": "Modificar",
                    "Color": "Color",
                    "Setting": "Ajuste",
                    "Box": "Caja",
                    "All": "Todos",
                    "Custom": "Personalizado",
                    "Preview": "Avance",
                    "Shading": "Sombreado",
                    "Fill": "Llenar",
                    "Apply To": "Aplicar para",
                    "Table Properties": "Propiedades de tabla",
                    "Cell Options": "Opciones de celda",
                    "Table Options": "Opciones de tabla",
                    "Insert Table": "Insertar tabla",
                    "Number of columns": "Número de columnas",
                    "Number of rows": "Número de filas",
                    "Text to display": "Texto a mostrar",
                    "Address": "Habla a",
                    "Insert Hyperlink": "Insertar hipervínculo",
                    "Edit Hyperlink": "Editar hipervínculo",
                    "Insert": "Insertar",
                    "General": "General",
                    "Indentation": "Sangría",
                    "Before text": "Antes del texto",
                    "Special": "Especial",
                    "First line": "Primera linea",
                    "Hanging": "Colgando",
                    "After text": "Después del texto",
                    "By": "Por",
                    "Before": "antes de",
                    "Line Spacing": "Espaciado entre líneas",
                    "After": "Después",
                    "At": "A",
                    "Multiple": "Múltiple",
                    "Spacing": "Espaciado",
                    "Define new Multilevel list": "Definir nueva lista multinivel",
                    "List level": "Nivel de lista",
                    "Choose level to modify": "Elija el nivel para modificar",
                    "Level": "Nivel",
                    "Number format": "Formato numérico",
                    "Number style for this level": "Estilo numérico para este nivel",
                    "Enter formatting for number": "Ingrese el formato para el número",
                    "Start at": "Empieza en",
                    "Restart list after": "Reiniciar lista después",
                    "Position": "Posición",
                    "Text indent at": "Sangría de texto en",
                    "Aligned at": "Alineado a las",
                    "Follow number with": "Seguir número con",
                    "Tab character": "Carácter de tabulación",
                    "Space": "Espacio",
                    "Arabic": "Arábica",
                    "UpRoman": "UpRoman",
                    "LowRoman": "LowRoman",
                    "UpLetter": "UpLetter",
                    "LowLetter": "Letra baja",
                    "Number": "Número",
                    "Leading zero": "Cero a la izquierda",
                    "Bullet": "Bala",
                    "Ordinal": "Ordinal",
                    "Ordinal Text": "Texto ordinal",
                    "For East": "Para el este",
                    "No Restart": "No reiniciar",
                    "Font": "Fuente",
                    "Font style": "Estilo de fuente",
                    "Underline style": "Estilo subrayado",
                    "Font color": "Color de fuente",
                    "Effects": "Efectos",
                    "Strikethrough": "Tachado",
                    "Superscript": "Sobrescrito",
                    "Subscript": "Subíndice",
                    "Double strikethrough": "Tachado doble",
                    "Regular": "Regular",
                    "Bold": "Negrita",
                    "Italic": "Itálico",
                    "Cut": "Cortar",
                    "Copy": "Copiar",
                    "Paste": "Pegar",
                    "Hyperlink": "Hipervínculo",
                    "Open Hyperlink": "Abrir hipervínculo",
                    "Copy Hyperlink": "Copiar hipervínculo",
                    "Remove Hyperlink": "Eliminar hipervínculo",
                    "Paragraph": "Párrafo",
                    "Linked Style": "Vinculado (párrafo y personaje)",
                    "Character": "Personaje",
                    "Merge Cells": "Combinar células",
                    "Insert Above": "Insertar arriba",
                    "Insert Below": "Insertar a continuación",
                    "Insert Left": "Insertar a la izquierda",
                    "Insert Right": "Insertar a la derecha",
                    "Delete": "Eliminar",
                    "Delete Table": "Eliminar tabla",
                    "Delete Row": "Borrar fila",
                    "Delete Column": "Eliminar columna",
                    "File Name": "Nombre del archivo",
                    "Format Type": "Tipo de formato",
                    "Save": "Guardar",
                    "Navigation": "Navegación",
                    "Results": "Resultados",
                    "Replace": "Reemplazar",
                    "Replace All": "Reemplaza todo",
                    "We replaced all": "Reemplazamos todo",
                    "Find": "Encontrar",
                    "No matches": "No hay coincidencias",
                    "All Done": "Todo listo",
                    "Result": "Resultado",
                    "of": "de",
                    "instances": "instancias",
                    "with": "con",
                    "Click to follow link": "Haga clic para seguir el enlace",
                    "Continue Numbering": "Continuar numerando",
                    "Bookmark name": "Nombre del marcador",
                    "Close": "Cerrar",
                    "Restart At": "Reiniciar en",
                    "Properties": "Propiedades",
                    "Name": "Nombre",
                    "Style type": "Tipo de estilo",
                    "Style based on": "Estilo basado en",
                    "Style for following paragraph": "Estilo para el siguiente párrafo",
                    "Formatting": "Formateo",
                    "Numbering and Bullets": "Numeración y viñetas",
                    "Numbering": "Numeración",
                    "Update Field": "Campo de actualización",
                    "Edit Field": "Editar campo",
                    "Bookmark": "Marcador",
                    "Page Setup": "Configurar página",
                    "No bookmarks found": "No se encontraron marcadores",
                    "Number format tooltip information": "Formato de número de nivel único: </br> [PREFIX]% [LEVELNUMBER] [SUFFIX] </br> Por ejemplo, 'Capítulo% 1'. mostrará numeración como </br> Capítulo 1. Elemento </br> Capítulo 2. Elemento </br>… </br> Capítulo N. Elemento </br> </br> Formato de número multinivel: </br> [ PREFIX]% [LEVELNUMBER] [SUFFIX] + [PREFIX]% [LEVELNUMBER] [SUFFIX] </br> Por ejemplo, '% 1.% 2.' mostrará numeración como </br> 1.1. Artículo </br> 1.2. Artículo </br> ... </br> 1.N. Articulo",
                    "Format": "Formato",
                    "Create New Style": "Crear nuevo estilo",
                    "Modify Style": "Modificar estilo",
                    "New": "Nuevo",
                    "Bullets": "Balas",
                    "Use bookmarks": "Usar marcadores",
                    "Table of Contents": "Tabla de contenido",
                    "AutoFit": "Autoajuste",
                    "AutoFit to Contents": "Autoajuste al contenido",
                    "AutoFit to Window": "Autoajustar a la ventana",
                    "Fixed Column Width": "Ancho de columna fijo",
                    "Reset": "Reiniciar",
                    "Match case": "Caso de partido",
                    "Whole words": "Palabras completas",
                    "Add": "Añadir",
                    "Go To": "Ir",
                    "Search for": "Buscar",
                    "Replace with": "Reemplazar con",
                    "TOC 1": "TOC 1",
                    "TOC 2": "TOC 2",
                    "TOC 3": "TOC 3",
                    "TOC 4": "TOC 4",
                    "TOC 5": "TOC 5",
                    "TOC 6": "TOC 6",
                    "TOC 7": "TOC 7",
                    "TOC 8": "TOC 8",
                    "TOC 9": "TOC 9",
                    "Right-to-left": "De derecha a izquierda",
                    "Left-to-right": "De izquierda a derecha",
                    "Direction": "Dirección",
                    "Table direction": "Dirección de la mesa",
                    "Indent from right": "Sangría desde la derecha",
                    "Contextual Spacing": "No agregue espacio entre los párrafos de los mismos estilos.",
                    "Password Mismatch": "La contraseña no coincide",
                    "Restrict Editing": "Restringir edición",
                    "Formatting restrictions": "Restricciones de formato",
                    "Allow formatting": "Permitir formateo",
                    "Editing restrictions": "Edición de restricciones",
                    "Read only": "Solo lectura",
                    "Exceptions Optional": "Excepciones (opcional)",
                    "Select Part Of Document And User": "Seleccione partes del documento y elija los usuarios que pueden editarlos libremente.",
                    "Everyone": "Todo el mundo",
                    "More users": "Más usuarios",
                    "Add Users": "Agregar usuarios",
                    "Enforcing Protection": "Sí, comience a aplicar la protección",
                    "Start Enforcing Protection": "Comience a hacer cumplir la protección",
                    "Enter User": "Ingresar usuario",
                    "Users": "Los usuarios",
                    "Enter new password": "Ingrese nueva clave",
                    "Reenter new password to confirm": "Vuelva a ingresar la nueva contraseña para confirmar",
                    "Your permissions": "Sus permisos",
                    "Protected Document": "Este documento está protegido contra la edición no intencional. Puede editar en esta región.",
                    "You may format text only with certain styles": "Puede formatear texto solo con ciertos estilos.",
                    "Stop Protection": "Detener la protección",
                    "Password": "Contraseña",
                    "Spelling Editor": "Editor de ortografía",
                    "Spelling": "Ortografía",
                    "Spell Check": "Corrector ortográfico",
                    "Underline errors": "Subrayar errores",
                    "Ignore": "Ignorar",
                    "Ignore all": "Ignora todo",
                    "Add to Dictionary": "Añadir al diccionario",
                    "Change": "Cambio",
                    "Change All": "Cambia todo",
                    "Suggestions": "Sugerencias",
                    "The password is incorrect": "La contraseña es incorrecta",
                    "Error in establishing connection with web server": "Error al establecer conexión con el servidor web",
                    "Highlight the regions I can edit": "Destacar las regiones que puedo editar",
                    "Show All Regions I Can Edit": "Mostrar todas las regiones que puedo editar",
                    "Find Next Region I Can Edit": "Buscar la siguiente región que puedo editar",
                    "Keep source formatting": "Mantener el formato de origen",
                    "Match destination formatting": "Hacer coincidir el formato de destino",
                    "Text only": "Solo texto",
                    "Comments": "Comentarios",
                    "Type your comment": "Escribe tu comentario",
                    "Post": "Enviar",
                    "Reply": "Respuesta",
                    "New Comment": "Nuevo comentario",
                    "Edit": "Editar",
                    "Resolve": "Resolver",
                    "Reopen": "Reabrir",
                    "No comments in this document": "No hay comentarios en este documento.",
                    "more": "más",
                    "Type your comment here": "escribe tu comentario aquí",
                    "Next Comment": "Siguiente comentario",
                    "Previous Comment": "Comentario anterior",
                    "Un-posted comments": "Comentarios no publicados",
                    "Discard Comment": "Comentarios agregados no publicados. Si continúa, ese comentario será descartado.",
                    "No Headings": "¡No se encontró rumbo!",
                    "Add Headings": "Este documento no tiene encabezados. Agregue encabezados e intente nuevamente.",
                    "More Options": "Mas opciones",
                    "Click to see this comment": "Haga clic para ver este comentario",
                    "Drop Down Form Field": "Campo de formulario desplegable",
                    "Drop-down items": "Artículos desplegables",
                    "Items in drop-down list": "Artículos en la lista desplegable",
                    "ADD": "AÑADIR",
                    "REMOVE": "ELIMINAR",
                    "Field settings": "Configuraciones de campo",
                    "Tooltip": "Información sobre herramientas",
                    "Drop-down enabled": "Desplegable habilitado",
                    "Check Box Form Field": "Campo de formulario de casilla de verificación",
                    "Check box size": "Casilla de verificación",
                    "Auto": "Auto",
                    "Default value": "Valor por defecto",
                    "Not checked": "Sin revisar",
                    "Checked": "Comprobado",
                    "Check box enabled": "Casilla de verificación habilitada",
                    "Text Form Field": "Campo de formulario de texto",
                    "Type": "Tipo",
                    "Default text": "Texto predeterminado",
                    "Maximum length": "Longitud máxima",
                    "Text format": "Formato de texto",
                    "Fill-in enabled": "Relleno habilitado",
                    "Default number": "Número predeterminado",
                    "Default date": "Fecha predeterminada",
                    "Date format": "Formato de fecha"
                },
                "documenteditorcontainer": {
                    "New": "Nuevo",
                    "Open": "Abierto",
                    "Undo": "Deshacer",
                    "Redo": "Rehacer",
                    "Image": "Imagen",
                    "Table": "Mesa",
                    "Link": "Enlace",
                    "Bookmark": "Marcador",
                    "Table of Contents": "Tabla de contenido",
                    "HEADING - - - - 1": "TÍTULO - - - - 1",
                    "HEADING - - - - 2": "TÍTULO - - - - 2",
                    "HEADING - - - - 3": "TÍTULO - - - - 3",
                    "Header": "Encabezamiento",
                    "Footer": "Pie de página",
                    "Page Setup": "Configurar página",
                    "Page Number": "Número de página",
                    "Break": "Descanso",
                    "Find": "Encontrar",
                    "Local Clipboard": "Portapapeles local",
                    "Restrict Editing": "Restringir edición",
                    "Upload from computer": "Subir desde la computadora",
                    "By URL": "Por URL",
                    "Page Break": "Salto de página",
                    "Section Break": "Salto de sección",
                    "Header And Footer": "Encabezado y pie de página",
                    "Options": "Opciones",
                    "Levels": "Niveles",
                    "Different First Page": "Primera página diferente",
                    "Different header and footer for odd and even pages": "Encabezado y pie de página diferentes para páginas pares e impares.",
                    "Different Odd And Even Pages": "Diferentes páginas pares e impares",
                    "Different header and footer for first page": "Encabezado y pie de página diferentes para la primera página.",
                    "Position": "Posición",
                    "Header from Top": "Encabezado desde arriba",
                    "Footer from Bottom": "Pie de página desde abajo",
                    "Distance from top of the page to top of the header": "Distancia desde la parte superior de la página hasta la parte superior del encabezado.",
                    "Distance from bottom of the page to bottom of the footer": "Distancia desde la parte inferior de la página hasta la parte inferior del pie de página.",
                    "Aspect ratio": "Relación de aspecto",
                    "W": "W",
                    "H": "H",
                    "Width": "Anchura",
                    "Height": "Altura",
                    "Text": "Texto",
                    "Paragraph": "Párrafo",
                    "Fill": "Llenar",
                    "Fill color": "Color de relleno",
                    "Border Style": "Estilo de borde",
                    "Outside borders": "Fronteras exteriores",
                    "All borders": "Todas las fronteras",
                    "Inside borders": "Bordes interiores",
                    "Left border": "Borde izquierdo",
                    "Inside vertical border": "Borde vertical interior",
                    "Right border": "Borde derecho",
                    "Top border": "Borde superior",
                    "Inside horizontal border": "Borde horizontal interior",
                    "Bottom border": "Borde inferior",
                    "Border color": "Color del borde",
                    "Border width": "Ancho del borde",
                    "Cell": "Célula",
                    "Merge cells": "Combinar células",
                    "Insert Or Delete": "Insertar / Eliminar",
                    "Insert columns to the left": "Insertar columnas a la izquierda",
                    "Insert columns to the right": "Insertar columnas a la derecha",
                    "Insert rows above": "Insertar filas arriba",
                    "Insert rows below": "Insertar filas debajo",
                    "Delete rows": "Eliminar filas",
                    "Delete columns": "Eliminar columnas",
                    "Cell Margin": "Margen de celda",
                    "Top": "Parte superior",
                    "Bottom": "Fondo",
                    "Left": "Izquierda",
                    "Right": "Derecho",
                    "Align Text": "Texto alineado",
                    "Align top": "Alinear la parte superior",
                    "Align bottom": "Alinear el fondo",
                    "Align center": "Alinear al centro",
                    "Number of heading or outline levels to be shown in table of contents": "Número de niveles de encabezado o esquema que se mostrarán en la tabla de contenido.",
                    "Show page numbers": "Mostrar números de página",
                    "Show page numbers in table of contents": "Mostrar números de página en la tabla de contenido.",
                    "Right align page numbers": "Alinear a la derecha los números de página",
                    "Right align page numbers in table of contents": "Alinee a la derecha los números de página en la tabla de contenido.",
                    "Use hyperlinks": "Usar hipervínculos",
                    "Use hyperlinks instead of page numbers": "Use hipervínculos en lugar de números de página.",
                    "Font": "Fuente",
                    "Font Size": "Tamaño de fuente",
                    "Font color": "Color de fuente",
                    "Text highlight color": "Color de resaltado de texto",
                    "Clear all formatting": "Borrar todo el formato",
                    "Bold Tooltip": "Negrita (Ctrl + B)",
                    "Italic Tooltip": "Cursiva (Ctrl + I)",
                    "Underline Tooltip": "Subrayado (Ctrl + U)",
                    "Strikethrough": "Tachado",
                    "Superscript Tooltip": "Superíndice (Ctrl + Shift ++)",
                    "Subscript Tooltip": "Subíndice (Ctrl + =)",
                    "Align left Tooltip": "Alinear a la izquierda (Ctrl + L)",
                    "Center Tooltip": "Centro (Ctrl + E)",
                    "Align right Tooltip": "Alinear a la derecha (Ctrl + R)",
                    "Justify Tooltip": "Justificar (Ctrl + J)",
                    "Decrease indent": "Disminuir sangría",
                    "Increase indent": "Aumentar sangría",
                    "Line spacing": "Espaciado entre líneas",
                    "Bullets": "Balas",
                    "Numbering": "Numeración",
                    "Styles": "Estilos",
                    "Manage Styles": "Administrar estilos",
                    "Page": "Página",
                    "of": "de",
                    "Fit one page": "Ajustar una página",
                    "Spell Check": "Corrector ortográfico",
                    "Underline errors": "Subrayar errores",
                    "Fit page width": "Ajustar ancho de página",
                    "Update": "Actualizar",
                    "Cancel": "Cancelar",
                    "Insert": "Insertar",
                    "No Border": "Sin bordes",
                    "Create a new document": "Crea un nuevo documento.",
                    "Open a document": "Abrir un documento",
                    "Undo Tooltip": "Deshacer la última operación (Ctrl + Z).",
                    "Redo Tooltip": "Rehaga la última operación (Ctrl + Y).",
                    "Insert inline picture from a file": "Insertar imagen en línea de un archivo.",
                    "Insert a table into the document": "Insertar una tabla en el documento",
                    "Create Hyperlink": "Cree un enlace en su documento para acceder rápidamente a páginas web y archivos (Ctrl + K).",
                    "Insert a bookmark in a specific place in this document": "Inserte un marcador en un lugar específico en este documento.",
                    "Provide an overview of your document by adding a table of contents": "Proporcione una descripción general de su documento agregando una tabla de contenido.",
                    "Add or edit the header": "Agregar o editar el encabezado.",
                    "Add or edit the footer": "Agregar o editar el pie de página.",
                    "Open the page setup dialog": "Abra el cuadro de diálogo de configuración de página.",
                    "Add page numbers": "Agregar números de página.",
                    "Find Text": "Buscar texto en el documento (Ctrl + F).",
                    "Toggle between the internal clipboard and system clipboard": "Alterne entre el portapapeles interno y el portapapeles del sistema. </br> El acceso al portapapeles del sistema a través del script está denegado debido a la política de seguridad de los navegadores. En su lugar, </br> 1. Puede habilitar el portapapeles interno para cortar, copiar y pegar dentro del componente. </br> 2. Puede usar los atajos de teclado (Ctrl + X, Ctrl + C y Ctrl + V) para cortar , copie y pegue con el portapapeles del sistema.",
                    "Current Page Number": "El número de página actual en el documento. Haga clic o toque para navegar por una página específica.",
                    "Read only": "Solo lectura",
                    "Protections": "Protecciones",
                    "Error in establishing connection with web server": "Error al establecer conexión con el servidor web",
                    "Single": "Soltero",
                    "Double": "Doble",
                    "New comment": "Nuevo comentario",
                    "Comments": "Comentarios",
                    "Print layout": "Diseño de impresión",
                    "Web layout": "diseño web",
                    "Text Form": "Formulario de texto",
                    "Check Box": "Casilla de verificación",
                    "DropDown": "Desplegable",
                    "Update Fields": "Actualizar campos",
                    "Update cross reference fields": "Actualizar campos de referencia cruzada"
                },
                "toast": {
                    "close": "Cerrar"
                },
                "kanban": {
                    "items": "artículos",
                    "min": "Min",
                    "max": "Max",
                    "cardsSelected": "Tarjetas Seleccionadas",
                    "addTitle": "Agregar nueva tarjeta",
                    "editTitle": "Editar detalles de la tarjeta",
                    "deleteTitle": "Eliminar tarjeta",
                    "deleteContent": "¿Estás seguro de que deseas eliminar esta tarjeta?",
                    "save": "Guardar",
                    "delete": "Eliminar",
                    "cancel": "Cancelar",
                    "yes": "Si",
                    "no": "No"
                }
            }
        });
        loadCldr({
            "main": {
                "es": {
                    "identity": {
                        "version": {
                            "_cldrVersion": "36"
                        },
                        "language": "es"
                    },
                    "dates": {
                        "timeZoneNames": {
                            "hourFormat": "+HH:mm;-HH:mm",
                            "gmtFormat": "GMT{0}",
                            "gmtZeroFormat": "GMT",
                            "regionFormat": "hora de {0}",
                            "regionFormat-type-daylight": "horario de verano de {0}",
                            "regionFormat-type-standard": "horario estándar de {0}",
                            "fallbackFormat": "{1} ({0})",
                            "zone": {
                                "America": {
                                    "Adak": {
                                        "exemplarCity": "Adak"
                                    },
                                    "Anchorage": {
                                        "exemplarCity": "Anchorage"
                                    },
                                    "Anguilla": {
                                        "exemplarCity": "Anguila"
                                    },
                                    "Antigua": {
                                        "exemplarCity": "Antigua"
                                    },
                                    "Araguaina": {
                                        "exemplarCity": "Araguaína"
                                    },
                                    "Argentina": {
                                        "Rio_Gallegos": {
                                            "exemplarCity": "Río Gallegos"
                                        },
                                        "San_Juan": {
                                            "exemplarCity": "San Juan"
                                        },
                                        "Ushuaia": {
                                            "exemplarCity": "Ushuaia"
                                        },
                                        "La_Rioja": {
                                            "exemplarCity": "La Rioja"
                                        },
                                        "San_Luis": {
                                            "exemplarCity": "San Luis"
                                        },
                                        "Salta": {
                                            "exemplarCity": "Salta"
                                        },
                                        "Tucuman": {
                                            "exemplarCity": "Tucumán"
                                        }
                                    },
                                    "Aruba": {
                                        "exemplarCity": "Aruba"
                                    },
                                    "Asuncion": {
                                        "exemplarCity": "Asunción"
                                    },
                                    "Bahia": {
                                        "exemplarCity": "Bahía"
                                    },
                                    "Bahia_Banderas": {
                                        "exemplarCity": "Bahía de Banderas"
                                    },
                                    "Barbados": {
                                        "exemplarCity": "Barbados"
                                    },
                                    "Belem": {
                                        "exemplarCity": "Belén"
                                    },
                                    "Belize": {
                                        "exemplarCity": "Belice"
                                    },
                                    "Blanc-Sablon": {
                                        "exemplarCity": "Blanc-Sablon"
                                    },
                                    "Boa_Vista": {
                                        "exemplarCity": "Boa Vista"
                                    },
                                    "Bogota": {
                                        "exemplarCity": "Bogotá"
                                    },
                                    "Boise": {
                                        "exemplarCity": "Boise"
                                    },
                                    "Buenos_Aires": {
                                        "exemplarCity": "Buenos Aires"
                                    },
                                    "Cambridge_Bay": {
                                        "exemplarCity": "Cambridge Bay"
                                    },
                                    "Campo_Grande": {
                                        "exemplarCity": "Campo Grande"
                                    },
                                    "Cancun": {
                                        "exemplarCity": "Cancún"
                                    },
                                    "Caracas": {
                                        "exemplarCity": "Caracas"
                                    },
                                    "Catamarca": {
                                        "exemplarCity": "Catamarca"
                                    },
                                    "Cayenne": {
                                        "exemplarCity": "Cayena"
                                    },
                                    "Cayman": {
                                        "exemplarCity": "Caimán"
                                    },
                                    "Chicago": {
                                        "exemplarCity": "Chicago"
                                    },
                                    "Chihuahua": {
                                        "exemplarCity": "Chihuahua"
                                    },
                                    "Coral_Harbour": {
                                        "exemplarCity": "Atikokan"
                                    },
                                    "Cordoba": {
                                        "exemplarCity": "Córdoba"
                                    },
                                    "Costa_Rica": {
                                        "exemplarCity": "Costa Rica"
                                    },
                                    "Creston": {
                                        "exemplarCity": "Creston"
                                    },
                                    "Cuiaba": {
                                        "exemplarCity": "Cuiabá"
                                    },
                                    "Curacao": {
                                        "exemplarCity": "Curazao"
                                    },
                                    "Danmarkshavn": {
                                        "exemplarCity": "Danmarkshavn"
                                    },
                                    "Dawson": {
                                        "exemplarCity": "Dawson"
                                    },
                                    "Dawson_Creek": {
                                        "exemplarCity": "Dawson Creek"
                                    },
                                    "Denver": {
                                        "exemplarCity": "Denver"
                                    },
                                    "Detroit": {
                                        "exemplarCity": "Detroit"
                                    },
                                    "Dominica": {
                                        "exemplarCity": "Dominica"
                                    },
                                    "Edmonton": {
                                        "exemplarCity": "Edmonton"
                                    },
                                    "Eirunepe": {
                                        "exemplarCity": "Eirunepé"
                                    },
                                    "El_Salvador": {
                                        "exemplarCity": "El Salvador"
                                    },
                                    "Fort_Nelson": {
                                        "exemplarCity": "Fort Nelson"
                                    },
                                    "Fortaleza": {
                                        "exemplarCity": "Fortaleza"
                                    },
                                    "Glace_Bay": {
                                        "exemplarCity": "Glace Bay"
                                    },
                                    "Godthab": {
                                        "exemplarCity": "Nuuk"
                                    },
                                    "Goose_Bay": {
                                        "exemplarCity": "Goose Bay"
                                    },
                                    "Grand_Turk": {
                                        "exemplarCity": "Gran Turca"
                                    },
                                    "Grenada": {
                                        "exemplarCity": "Granada"
                                    },
                                    "Guadeloupe": {
                                        "exemplarCity": "Guadalupe"
                                    },
                                    "Guatemala": {
                                        "exemplarCity": "Guatemala"
                                    },
                                    "Guayaquil": {
                                        "exemplarCity": "Guayaquil"
                                    },
                                    "Guyana": {
                                        "exemplarCity": "Guyana"
                                    },
                                    "Halifax": {
                                        "exemplarCity": "Halifax"
                                    },
                                    "Havana": {
                                        "exemplarCity": "La Habana"
                                    },
                                    "Hermosillo": {
                                        "exemplarCity": "Hermosillo"
                                    },
                                    "Indiana": {
                                        "Vincennes": {
                                            "exemplarCity": "Vincennes, Indiana"
                                        },
                                        "Petersburg": {
                                            "exemplarCity": "Petersburg, Indiana"
                                        },
                                        "Tell_City": {
                                            "exemplarCity": "Tell City, Indiana"
                                        },
                                        "Knox": {
                                            "exemplarCity": "Knox, Indiana"
                                        },
                                        "Winamac": {
                                            "exemplarCity": "Winamac, Indiana"
                                        },
                                        "Marengo": {
                                            "exemplarCity": "Marengo, Indiana"
                                        },
                                        "Vevay": {
                                            "exemplarCity": "Vevay, Indiana"
                                        }
                                    },
                                    "Indianapolis": {
                                        "exemplarCity": "Indianápolis"
                                    },
                                    "Inuvik": {
                                        "exemplarCity": "Inuvik"
                                    },
                                    "Iqaluit": {
                                        "exemplarCity": "Iqaluit"
                                    },
                                    "Jamaica": {
                                        "exemplarCity": "Jamaica"
                                    },
                                    "Jujuy": {
                                        "exemplarCity": "Jujuy"
                                    },
                                    "Juneau": {
                                        "exemplarCity": "Juneau"
                                    },
                                    "Kentucky": {
                                        "Monticello": {
                                            "exemplarCity": "Monticello, Kentucky"
                                        }
                                    },
                                    "Kralendijk": {
                                        "exemplarCity": "Kralendijk"
                                    },
                                    "La_Paz": {
                                        "exemplarCity": "La Paz"
                                    },
                                    "Lima": {
                                        "exemplarCity": "Lima"
                                    },
                                    "Los_Angeles": {
                                        "exemplarCity": "Los Ángeles"
                                    },
                                    "Louisville": {
                                        "exemplarCity": "Louisville"
                                    },
                                    "Lower_Princes": {
                                        "exemplarCity": "Lower Prince’s Quarter"
                                    },
                                    "Maceio": {
                                        "exemplarCity": "Maceió"
                                    },
                                    "Managua": {
                                        "exemplarCity": "Managua"
                                    },
                                    "Manaus": {
                                        "exemplarCity": "Manaos"
                                    },
                                    "Marigot": {
                                        "exemplarCity": "Marigot"
                                    },
                                    "Martinique": {
                                        "exemplarCity": "Martinica"
                                    },
                                    "Matamoros": {
                                        "exemplarCity": "Matamoros"
                                    },
                                    "Mazatlan": {
                                        "exemplarCity": "Mazatlán"
                                    },
                                    "Mendoza": {
                                        "exemplarCity": "Mendoza"
                                    },
                                    "Menominee": {
                                        "exemplarCity": "Menominee"
                                    },
                                    "Merida": {
                                        "exemplarCity": "Mérida"
                                    },
                                    "Metlakatla": {
                                        "exemplarCity": "Metlakatla"
                                    },
                                    "Mexico_City": {
                                        "exemplarCity": "Ciudad de México"
                                    },
                                    "Miquelon": {
                                        "exemplarCity": "Miquelón"
                                    },
                                    "Moncton": {
                                        "exemplarCity": "Moncton"
                                    },
                                    "Monterrey": {
                                        "exemplarCity": "Monterrey"
                                    },
                                    "Montevideo": {
                                        "exemplarCity": "Montevideo"
                                    },
                                    "Montserrat": {
                                        "exemplarCity": "Montserrat"
                                    },
                                    "Nassau": {
                                        "exemplarCity": "Nassau"
                                    },
                                    "New_York": {
                                        "exemplarCity": "Nueva York"
                                    },
                                    "Nipigon": {
                                        "exemplarCity": "Nipigon"
                                    },
                                    "Nome": {
                                        "exemplarCity": "Nome"
                                    },
                                    "Noronha": {
                                        "exemplarCity": "Noronha"
                                    },
                                    "North_Dakota": {
                                        "Beulah": {
                                            "exemplarCity": "Beulah, Dakota del Norte"
                                        },
                                        "New_Salem": {
                                            "exemplarCity": "New Salem, Dakota del Norte"
                                        },
                                        "Center": {
                                            "exemplarCity": "Center, Dakota del Norte"
                                        }
                                    },
                                    "Ojinaga": {
                                        "exemplarCity": "Ojinaga"
                                    },
                                    "Panama": {
                                        "exemplarCity": "Panamá"
                                    },
                                    "Pangnirtung": {
                                        "exemplarCity": "Pangnirtung"
                                    },
                                    "Paramaribo": {
                                        "exemplarCity": "Paramaribo"
                                    },
                                    "Phoenix": {
                                        "exemplarCity": "Phoenix"
                                    },
                                    "Port-au-Prince": {
                                        "exemplarCity": "Puerto Príncipe"
                                    },
                                    "Port_of_Spain": {
                                        "exemplarCity": "Puerto España"
                                    },
                                    "Porto_Velho": {
                                        "exemplarCity": "Porto Velho"
                                    },
                                    "Puerto_Rico": {
                                        "exemplarCity": "Puerto Rico"
                                    },
                                    "Punta_Arenas": {
                                        "exemplarCity": "Punta Arenas"
                                    },
                                    "Rainy_River": {
                                        "exemplarCity": "Rainy River"
                                    },
                                    "Rankin_Inlet": {
                                        "exemplarCity": "Rankin Inlet"
                                    },
                                    "Recife": {
                                        "exemplarCity": "Recife"
                                    },
                                    "Regina": {
                                        "exemplarCity": "Regina"
                                    },
                                    "Resolute": {
                                        "exemplarCity": "Resolute"
                                    },
                                    "Rio_Branco": {
                                        "exemplarCity": "Río Branco"
                                    },
                                    "Santa_Isabel": {
                                        "exemplarCity": "Santa Isabel"
                                    },
                                    "Santarem": {
                                        "exemplarCity": "Santarém"
                                    },
                                    "Santiago": {
                                        "exemplarCity": "Santiago de Chile"
                                    },
                                    "Santo_Domingo": {
                                        "exemplarCity": "Santo Domingo"
                                    },
                                    "Sao_Paulo": {
                                        "exemplarCity": "São Paulo"
                                    },
                                    "Scoresbysund": {
                                        "exemplarCity": "Ittoqqortoormiit"
                                    },
                                    "Sitka": {
                                        "exemplarCity": "Sitka"
                                    },
                                    "St_Barthelemy": {
                                        "exemplarCity": "San Bartolomé"
                                    },
                                    "St_Johns": {
                                        "exemplarCity": "San Juan de Terranova"
                                    },
                                    "St_Kitts": {
                                        "exemplarCity": "San Cristóbal"
                                    },
                                    "St_Lucia": {
                                        "exemplarCity": "Santa Lucía"
                                    },
                                    "St_Thomas": {
                                        "exemplarCity": "St. Thomas"
                                    },
                                    "St_Vincent": {
                                        "exemplarCity": "San Vicente"
                                    },
                                    "Swift_Current": {
                                        "exemplarCity": "Swift Current"
                                    },
                                    "Tegucigalpa": {
                                        "exemplarCity": "Tegucigalpa"
                                    },
                                    "Thule": {
                                        "exemplarCity": "Thule"
                                    },
                                    "Thunder_Bay": {
                                        "exemplarCity": "Thunder Bay"
                                    },
                                    "Tijuana": {
                                        "exemplarCity": "Tijuana"
                                    },
                                    "Toronto": {
                                        "exemplarCity": "Toronto"
                                    },
                                    "Tortola": {
                                        "exemplarCity": "Tórtola"
                                    },
                                    "Vancouver": {
                                        "exemplarCity": "Vancouver"
                                    },
                                    "Whitehorse": {
                                        "exemplarCity": "Whitehorse"
                                    },
                                    "Winnipeg": {
                                        "exemplarCity": "Winnipeg"
                                    },
                                    "Yakutat": {
                                        "exemplarCity": "Yakutat"
                                    },
                                    "Yellowknife": {
                                        "exemplarCity": "Yellowknife"
                                    }
                                },
                                "Atlantic": {
                                    "Azores": {
                                        "exemplarCity": "Azores"
                                    },
                                    "Bermuda": {
                                        "exemplarCity": "Bermudas"
                                    },
                                    "Canary": {
                                        "exemplarCity": "Canarias"
                                    },
                                    "Cape_Verde": {
                                        "exemplarCity": "Cabo Verde"
                                    },
                                    "Faeroe": {
                                        "exemplarCity": "Islas Feroe"
                                    },
                                    "Madeira": {
                                        "exemplarCity": "Madeira"
                                    },
                                    "Reykjavik": {
                                        "exemplarCity": "Reikiavik"
                                    },
                                    "South_Georgia": {
                                        "exemplarCity": "Georgia del Sur"
                                    },
                                    "St_Helena": {
                                        "exemplarCity": "Santa Elena"
                                    },
                                    "Stanley": {
                                        "exemplarCity": "Stanley"
                                    }
                                },
                                "Europe": {
                                    "Amsterdam": {
                                        "exemplarCity": "Ámsterdam"
                                    },
                                    "Andorra": {
                                        "exemplarCity": "Andorra"
                                    },
                                    "Astrakhan": {
                                        "exemplarCity": "Astracán"
                                    },
                                    "Athens": {
                                        "exemplarCity": "Atenas"
                                    },
                                    "Belgrade": {
                                        "exemplarCity": "Belgrado"
                                    },
                                    "Berlin": {
                                        "exemplarCity": "Berlín"
                                    },
                                    "Bratislava": {
                                        "exemplarCity": "Bratislava"
                                    },
                                    "Brussels": {
                                        "exemplarCity": "Bruselas"
                                    },
                                    "Bucharest": {
                                        "exemplarCity": "Bucarest"
                                    },
                                    "Budapest": {
                                        "exemplarCity": "Budapest"
                                    },
                                    "Busingen": {
                                        "exemplarCity": "Busingen"
                                    },
                                    "Chisinau": {
                                        "exemplarCity": "Chisináu"
                                    },
                                    "Copenhagen": {
                                        "exemplarCity": "Copenhague"
                                    },
                                    "Dublin": {
                                        "long": {
                                            "daylight": "hora de verano de Irlanda"
                                        },
                                        "exemplarCity": "Dublín"
                                    },
                                    "Gibraltar": {
                                        "exemplarCity": "Gibraltar"
                                    },
                                    "Guernsey": {
                                        "exemplarCity": "Guernsey"
                                    },
                                    "Helsinki": {
                                        "exemplarCity": "Helsinki"
                                    },
                                    "Isle_of_Man": {
                                        "exemplarCity": "Isla de Man"
                                    },
                                    "Istanbul": {
                                        "exemplarCity": "Estambul"
                                    },
                                    "Jersey": {
                                        "exemplarCity": "Jersey"
                                    },
                                    "Kaliningrad": {
                                        "exemplarCity": "Kaliningrado"
                                    },
                                    "Kiev": {
                                        "exemplarCity": "Kiev"
                                    },
                                    "Kirov": {
                                        "exemplarCity": "Kírov"
                                    },
                                    "Lisbon": {
                                        "exemplarCity": "Lisboa"
                                    },
                                    "Ljubljana": {
                                        "exemplarCity": "Liubliana"
                                    },
                                    "London": {
                                        "long": {
                                            "daylight": "hora de verano británica"
                                        },
                                        "exemplarCity": "Londres"
                                    },
                                    "Luxembourg": {
                                        "exemplarCity": "Luxemburgo"
                                    },
                                    "Madrid": {
                                        "exemplarCity": "Madrid"
                                    },
                                    "Malta": {
                                        "exemplarCity": "Malta"
                                    },
                                    "Mariehamn": {
                                        "exemplarCity": "Mariehamn"
                                    },
                                    "Minsk": {
                                        "exemplarCity": "Minsk"
                                    },
                                    "Monaco": {
                                        "exemplarCity": "Mónaco"
                                    },
                                    "Moscow": {
                                        "exemplarCity": "Moscú"
                                    },
                                    "Oslo": {
                                        "exemplarCity": "Oslo"
                                    },
                                    "Paris": {
                                        "exemplarCity": "París"
                                    },
                                    "Podgorica": {
                                        "exemplarCity": "Podgorica"
                                    },
                                    "Prague": {
                                        "exemplarCity": "Praga"
                                    },
                                    "Riga": {
                                        "exemplarCity": "Riga"
                                    },
                                    "Rome": {
                                        "exemplarCity": "Roma"
                                    },
                                    "Samara": {
                                        "exemplarCity": "Samara"
                                    },
                                    "San_Marino": {
                                        "exemplarCity": "San Marino"
                                    },
                                    "Sarajevo": {
                                        "exemplarCity": "Sarajevo"
                                    },
                                    "Saratov": {
                                        "exemplarCity": "Sarátov"
                                    },
                                    "Simferopol": {
                                        "exemplarCity": "Simferópol"
                                    },
                                    "Skopje": {
                                        "exemplarCity": "Skopie"
                                    },
                                    "Sofia": {
                                        "exemplarCity": "Sofía"
                                    },
                                    "Stockholm": {
                                        "exemplarCity": "Estocolmo"
                                    },
                                    "Tallinn": {
                                        "exemplarCity": "Tallin"
                                    },
                                    "Tirane": {
                                        "exemplarCity": "Tirana"
                                    },
                                    "Ulyanovsk": {
                                        "exemplarCity": "Uliánovsk"
                                    },
                                    "Uzhgorod": {
                                        "exemplarCity": "Úzhgorod"
                                    },
                                    "Vaduz": {
                                        "exemplarCity": "Vaduz"
                                    },
                                    "Vatican": {
                                        "exemplarCity": "El Vaticano"
                                    },
                                    "Vienna": {
                                        "exemplarCity": "Viena"
                                    },
                                    "Vilnius": {
                                        "exemplarCity": "Vilna"
                                    },
                                    "Volgograd": {
                                        "exemplarCity": "Volgogrado"
                                    },
                                    "Warsaw": {
                                        "exemplarCity": "Varsovia"
                                    },
                                    "Zagreb": {
                                        "exemplarCity": "Zagreb"
                                    },
                                    "Zaporozhye": {
                                        "exemplarCity": "Zaporiyia"
                                    },
                                    "Zurich": {
                                        "exemplarCity": "Zúrich"
                                    }
                                },
                                "Africa": {
                                    "Abidjan": {
                                        "exemplarCity": "Abiyán"
                                    },
                                    "Accra": {
                                        "exemplarCity": "Acra"
                                    },
                                    "Addis_Ababa": {
                                        "exemplarCity": "Addis Abeba"
                                    },
                                    "Algiers": {
                                        "exemplarCity": "Argel"
                                    },
                                    "Asmera": {
                                        "exemplarCity": "Asmara"
                                    },
                                    "Bamako": {
                                        "exemplarCity": "Bamako"
                                    },
                                    "Bangui": {
                                        "exemplarCity": "Bangui"
                                    },
                                    "Banjul": {
                                        "exemplarCity": "Banjul"
                                    },
                                    "Bissau": {
                                        "exemplarCity": "Bisáu"
                                    },
                                    "Blantyre": {
                                        "exemplarCity": "Blantyre"
                                    },
                                    "Brazzaville": {
                                        "exemplarCity": "Brazzaville"
                                    },
                                    "Bujumbura": {
                                        "exemplarCity": "Bujumbura"
                                    },
                                    "Cairo": {
                                        "exemplarCity": "El Cairo"
                                    },
                                    "Casablanca": {
                                        "exemplarCity": "Casablanca"
                                    },
                                    "Ceuta": {
                                        "exemplarCity": "Ceuta"
                                    },
                                    "Conakry": {
                                        "exemplarCity": "Conakry"
                                    },
                                    "Dakar": {
                                        "exemplarCity": "Dakar"
                                    },
                                    "Dar_es_Salaam": {
                                        "exemplarCity": "Dar es Salaam"
                                    },
                                    "Djibouti": {
                                        "exemplarCity": "Yibuti"
                                    },
                                    "Douala": {
                                        "exemplarCity": "Duala"
                                    },
                                    "El_Aaiun": {
                                        "exemplarCity": "El Aaiún"
                                    },
                                    "Freetown": {
                                        "exemplarCity": "Freetown"
                                    },
                                    "Gaborone": {
                                        "exemplarCity": "Gaborone"
                                    },
                                    "Harare": {
                                        "exemplarCity": "Harare"
                                    },
                                    "Johannesburg": {
                                        "exemplarCity": "Johannesburgo"
                                    },
                                    "Juba": {
                                        "exemplarCity": "Juba"
                                    },
                                    "Kampala": {
                                        "exemplarCity": "Kampala"
                                    },
                                    "Khartoum": {
                                        "exemplarCity": "Jartún"
                                    },
                                    "Kigali": {
                                        "exemplarCity": "Kigali"
                                    },
                                    "Kinshasa": {
                                        "exemplarCity": "Kinshasa"
                                    },
                                    "Lagos": {
                                        "exemplarCity": "Lagos"
                                    },
                                    "Libreville": {
                                        "exemplarCity": "Libreville"
                                    },
                                    "Lome": {
                                        "exemplarCity": "Lomé"
                                    },
                                    "Luanda": {
                                        "exemplarCity": "Luanda"
                                    },
                                    "Lubumbashi": {
                                        "exemplarCity": "Lubumbashi"
                                    },
                                    "Lusaka": {
                                        "exemplarCity": "Lusaka"
                                    },
                                    "Malabo": {
                                        "exemplarCity": "Malabo"
                                    },
                                    "Maputo": {
                                        "exemplarCity": "Maputo"
                                    },
                                    "Maseru": {
                                        "exemplarCity": "Maseru"
                                    },
                                    "Mbabane": {
                                        "exemplarCity": "Mbabane"
                                    },
                                    "Mogadishu": {
                                        "exemplarCity": "Mogadiscio"
                                    },
                                    "Monrovia": {
                                        "exemplarCity": "Monrovia"
                                    },
                                    "Nairobi": {
                                        "exemplarCity": "Nairobi"
                                    },
                                    "Ndjamena": {
                                        "exemplarCity": "Yamena"
                                    },
                                    "Niamey": {
                                        "exemplarCity": "Niamey"
                                    },
                                    "Nouakchott": {
                                        "exemplarCity": "Nuakchot"
                                    },
                                    "Ouagadougou": {
                                        "exemplarCity": "Uagadugú"
                                    },
                                    "Porto-Novo": {
                                        "exemplarCity": "Portonovo"
                                    },
                                    "Sao_Tome": {
                                        "exemplarCity": "Santo Tomé"
                                    },
                                    "Tripoli": {
                                        "exemplarCity": "Trípoli"
                                    },
                                    "Tunis": {
                                        "exemplarCity": "Túnez"
                                    },
                                    "Windhoek": {
                                        "exemplarCity": "Windhoek"
                                    }
                                },
                                "Asia": {
                                    "Aden": {
                                        "exemplarCity": "Adén"
                                    },
                                    "Almaty": {
                                        "exemplarCity": "Almaty"
                                    },
                                    "Amman": {
                                        "exemplarCity": "Ammán"
                                    },
                                    "Anadyr": {
                                        "exemplarCity": "Anádyr"
                                    },
                                    "Aqtau": {
                                        "exemplarCity": "Aktau"
                                    },
                                    "Aqtobe": {
                                        "exemplarCity": "Aktobe"
                                    },
                                    "Ashgabat": {
                                        "exemplarCity": "Asjabad"
                                    },
                                    "Atyrau": {
                                        "exemplarCity": "Atyrau"
                                    },
                                    "Baghdad": {
                                        "exemplarCity": "Bagdad"
                                    },
                                    "Bahrain": {
                                        "exemplarCity": "Baréin"
                                    },
                                    "Baku": {
                                        "exemplarCity": "Bakú"
                                    },
                                    "Bangkok": {
                                        "exemplarCity": "Bangkok"
                                    },
                                    "Barnaul": {
                                        "exemplarCity": "Barnaúl"
                                    },
                                    "Beirut": {
                                        "exemplarCity": "Beirut"
                                    },
                                    "Bishkek": {
                                        "exemplarCity": "Bishkek"
                                    },
                                    "Brunei": {
                                        "exemplarCity": "Brunéi"
                                    },
                                    "Calcutta": {
                                        "exemplarCity": "Calcuta"
                                    },
                                    "Chita": {
                                        "exemplarCity": "Chitá"
                                    },
                                    "Choibalsan": {
                                        "exemplarCity": "Choibalsan"
                                    },
                                    "Colombo": {
                                        "exemplarCity": "Colombo"
                                    },
                                    "Damascus": {
                                        "exemplarCity": "Damasco"
                                    },
                                    "Dhaka": {
                                        "exemplarCity": "Daca"
                                    },
                                    "Dili": {
                                        "exemplarCity": "Dili"
                                    },
                                    "Dubai": {
                                        "exemplarCity": "Dubái"
                                    },
                                    "Dushanbe": {
                                        "exemplarCity": "Dusambé"
                                    },
                                    "Famagusta": {
                                        "exemplarCity": "Famagusta"
                                    },
                                    "Gaza": {
                                        "exemplarCity": "Gaza"
                                    },
                                    "Hebron": {
                                        "exemplarCity": "Hebrón"
                                    },
                                    "Hong_Kong": {
                                        "exemplarCity": "Hong Kong"
                                    },
                                    "Hovd": {
                                        "exemplarCity": "Hovd"
                                    },
                                    "Irkutsk": {
                                        "exemplarCity": "Irkutsk"
                                    },
                                    "Jakarta": {
                                        "exemplarCity": "Yakarta"
                                    },
                                    "Jayapura": {
                                        "exemplarCity": "Jayapura"
                                    },
                                    "Jerusalem": {
                                        "exemplarCity": "Jerusalén"
                                    },
                                    "Kabul": {
                                        "exemplarCity": "Kabul"
                                    },
                                    "Kamchatka": {
                                        "exemplarCity": "Kamchatka"
                                    },
                                    "Karachi": {
                                        "exemplarCity": "Karachi"
                                    },
                                    "Katmandu": {
                                        "exemplarCity": "Katmandú"
                                    },
                                    "Khandyga": {
                                        "exemplarCity": "Khandyga"
                                    },
                                    "Krasnoyarsk": {
                                        "exemplarCity": "Krasnoyarsk"
                                    },
                                    "Kuala_Lumpur": {
                                        "exemplarCity": "Kuala Lumpur"
                                    },
                                    "Kuching": {
                                        "exemplarCity": "Kuching"
                                    },
                                    "Kuwait": {
                                        "exemplarCity": "Kuwait"
                                    },
                                    "Macau": {
                                        "exemplarCity": "Macao"
                                    },
                                    "Magadan": {
                                        "exemplarCity": "Magadán"
                                    },
                                    "Makassar": {
                                        "exemplarCity": "Makasar"
                                    },
                                    "Manila": {
                                        "exemplarCity": "Manila"
                                    },
                                    "Muscat": {
                                        "exemplarCity": "Mascate"
                                    },
                                    "Nicosia": {
                                        "exemplarCity": "Nicosia"
                                    },
                                    "Novokuznetsk": {
                                        "exemplarCity": "Novokuznetsk"
                                    },
                                    "Novosibirsk": {
                                        "exemplarCity": "Novosibirsk"
                                    },
                                    "Omsk": {
                                        "exemplarCity": "Omsk"
                                    },
                                    "Oral": {
                                        "exemplarCity": "Oral"
                                    },
                                    "Phnom_Penh": {
                                        "exemplarCity": "Phnom Penh"
                                    },
                                    "Pontianak": {
                                        "exemplarCity": "Pontianak"
                                    },
                                    "Pyongyang": {
                                        "exemplarCity": "Pyongyang"
                                    },
                                    "Qatar": {
                                        "exemplarCity": "Catar"
                                    },
                                    "Qostanay": {
                                        "exemplarCity": "Kostanái"
                                    },
                                    "Qyzylorda": {
                                        "exemplarCity": "Kyzylorda"
                                    },
                                    "Rangoon": {
                                        "exemplarCity": "Yangón (Rangún)"
                                    },
                                    "Riyadh": {
                                        "exemplarCity": "Riad"
                                    },
                                    "Saigon": {
                                        "exemplarCity": "Ciudad Ho Chi Minh"
                                    },
                                    "Sakhalin": {
                                        "exemplarCity": "Sajalín"
                                    },
                                    "Samarkand": {
                                        "exemplarCity": "Samarcanda"
                                    },
                                    "Seoul": {
                                        "exemplarCity": "Seúl"
                                    },
                                    "Shanghai": {
                                        "exemplarCity": "Shanghái"
                                    },
                                    "Singapore": {
                                        "exemplarCity": "Singapur"
                                    },
                                    "Srednekolymsk": {
                                        "exemplarCity": "Srednekolimsk"
                                    },
                                    "Taipei": {
                                        "exemplarCity": "Taipéi"
                                    },
                                    "Tashkent": {
                                        "exemplarCity": "Taskent"
                                    },
                                    "Tbilisi": {
                                        "exemplarCity": "Tiflis"
                                    },
                                    "Tehran": {
                                        "exemplarCity": "Teherán"
                                    },
                                    "Thimphu": {
                                        "exemplarCity": "Timbu"
                                    },
                                    "Tokyo": {
                                        "exemplarCity": "Tokio"
                                    },
                                    "Tomsk": {
                                        "exemplarCity": "Tomsk"
                                    },
                                    "Ulaanbaatar": {
                                        "exemplarCity": "Ulán Bator"
                                    },
                                    "Urumqi": {
                                        "exemplarCity": "Ürümqi"
                                    },
                                    "Ust-Nera": {
                                        "exemplarCity": "Ust-Nera"
                                    },
                                    "Vientiane": {
                                        "exemplarCity": "Vientián"
                                    },
                                    "Vladivostok": {
                                        "exemplarCity": "Vladivostok"
                                    },
                                    "Yakutsk": {
                                        "exemplarCity": "Yakutsk"
                                    },
                                    "Yekaterinburg": {
                                        "exemplarCity": "Ekaterimburgo"
                                    },
                                    "Yerevan": {
                                        "exemplarCity": "Ereván"
                                    }
                                },
                                "Indian": {
                                    "Antananarivo": {
                                        "exemplarCity": "Antananarivo"
                                    },
                                    "Chagos": {
                                        "exemplarCity": "Chagos"
                                    },
                                    "Christmas": {
                                        "exemplarCity": "Navidad"
                                    },
                                    "Cocos": {
                                        "exemplarCity": "Cocos"
                                    },
                                    "Comoro": {
                                        "exemplarCity": "Comoras"
                                    },
                                    "Kerguelen": {
                                        "exemplarCity": "Kerguelen"
                                    },
                                    "Mahe": {
                                        "exemplarCity": "Mahé"
                                    },
                                    "Maldives": {
                                        "exemplarCity": "Maldivas"
                                    },
                                    "Mauritius": {
                                        "exemplarCity": "Mauricio"
                                    },
                                    "Mayotte": {
                                        "exemplarCity": "Mayotte"
                                    },
                                    "Reunion": {
                                        "exemplarCity": "Reunión"
                                    }
                                },
                                "Australia": {
                                    "Adelaide": {
                                        "exemplarCity": "Adelaida"
                                    },
                                    "Brisbane": {
                                        "exemplarCity": "Brisbane"
                                    },
                                    "Broken_Hill": {
                                        "exemplarCity": "Broken Hill"
                                    },
                                    "Currie": {
                                        "exemplarCity": "Currie"
                                    },
                                    "Darwin": {
                                        "exemplarCity": "Darwin"
                                    },
                                    "Eucla": {
                                        "exemplarCity": "Eucla"
                                    },
                                    "Hobart": {
                                        "exemplarCity": "Hobart"
                                    },
                                    "Lindeman": {
                                        "exemplarCity": "Lindeman"
                                    },
                                    "Lord_Howe": {
                                        "exemplarCity": "Lord Howe"
                                    },
                                    "Melbourne": {
                                        "exemplarCity": "Melbourne"
                                    },
                                    "Perth": {
                                        "exemplarCity": "Perth"
                                    },
                                    "Sydney": {
                                        "exemplarCity": "Sídney"
                                    }
                                },
                                "Pacific": {
                                    "Apia": {
                                        "exemplarCity": "Apia"
                                    },
                                    "Auckland": {
                                        "exemplarCity": "Auckland"
                                    },
                                    "Bougainville": {
                                        "exemplarCity": "Bougainville"
                                    },
                                    "Chatham": {
                                        "exemplarCity": "Chatham"
                                    },
                                    "Easter": {
                                        "exemplarCity": "Isla de Pascua"
                                    },
                                    "Efate": {
                                        "exemplarCity": "Efate"
                                    },
                                    "Enderbury": {
                                        "exemplarCity": "Enderbury"
                                    },
                                    "Fakaofo": {
                                        "exemplarCity": "Fakaofo"
                                    },
                                    "Fiji": {
                                        "exemplarCity": "Fiyi"
                                    },
                                    "Funafuti": {
                                        "exemplarCity": "Funafuti"
                                    },
                                    "Galapagos": {
                                        "exemplarCity": "Galápagos"
                                    },
                                    "Gambier": {
                                        "exemplarCity": "Gambier"
                                    },
                                    "Guadalcanal": {
                                        "exemplarCity": "Guadalcanal"
                                    },
                                    "Guam": {
                                        "exemplarCity": "Guam"
                                    },
                                    "Honolulu": {
                                        "exemplarCity": "Honolulú"
                                    },
                                    "Johnston": {
                                        "exemplarCity": "Johnston"
                                    },
                                    "Kiritimati": {
                                        "exemplarCity": "Kiritimati"
                                    },
                                    "Kosrae": {
                                        "exemplarCity": "Kosrae"
                                    },
                                    "Kwajalein": {
                                        "exemplarCity": "Kwajalein"
                                    },
                                    "Majuro": {
                                        "exemplarCity": "Majuro"
                                    },
                                    "Marquesas": {
                                        "exemplarCity": "Marquesas"
                                    },
                                    "Midway": {
                                        "exemplarCity": "Midway"
                                    },
                                    "Nauru": {
                                        "exemplarCity": "Nauru"
                                    },
                                    "Niue": {
                                        "exemplarCity": "Niue"
                                    },
                                    "Norfolk": {
                                        "exemplarCity": "Norfolk"
                                    },
                                    "Noumea": {
                                        "exemplarCity": "Numea"
                                    },
                                    "Pago_Pago": {
                                        "exemplarCity": "Pago Pago"
                                    },
                                    "Palau": {
                                        "exemplarCity": "Palaos"
                                    },
                                    "Pitcairn": {
                                        "exemplarCity": "Pitcairn"
                                    },
                                    "Ponape": {
                                        "exemplarCity": "Pohnpei"
                                    },
                                    "Port_Moresby": {
                                        "exemplarCity": "Port Moresby"
                                    },
                                    "Rarotonga": {
                                        "exemplarCity": "Rarotonga"
                                    },
                                    "Saipan": {
                                        "exemplarCity": "Saipán"
                                    },
                                    "Tahiti": {
                                        "exemplarCity": "Tahití"
                                    },
                                    "Tarawa": {
                                        "exemplarCity": "Tarawa"
                                    },
                                    "Tongatapu": {
                                        "exemplarCity": "Tongatapu"
                                    },
                                    "Truk": {
                                        "exemplarCity": "Chuuk"
                                    },
                                    "Wake": {
                                        "exemplarCity": "Wake"
                                    },
                                    "Wallis": {
                                        "exemplarCity": "Wallis"
                                    }
                                },
                                "Arctic": {
                                    "Longyearbyen": {
                                        "exemplarCity": "Longyearbyen"
                                    }
                                },
                                "Antarctica": {
                                    "Casey": {
                                        "exemplarCity": "Casey"
                                    },
                                    "Davis": {
                                        "exemplarCity": "Davis"
                                    },
                                    "DumontDUrville": {
                                        "exemplarCity": "Dumont d’Urville"
                                    },
                                    "Macquarie": {
                                        "exemplarCity": "Macquarie"
                                    },
                                    "Mawson": {
                                        "exemplarCity": "Mawson"
                                    },
                                    "McMurdo": {
                                        "exemplarCity": "McMurdo"
                                    },
                                    "Palmer": {
                                        "exemplarCity": "Palmer"
                                    },
                                    "Rothera": {
                                        "exemplarCity": "Rothera"
                                    },
                                    "Syowa": {
                                        "exemplarCity": "Syowa"
                                    },
                                    "Troll": {
                                        "exemplarCity": "Troll"
                                    },
                                    "Vostok": {
                                        "exemplarCity": "Vostok"
                                    }
                                },
                                "Etc": {
                                    "UTC": {
                                        "long": {
                                            "standard": "tiempo universal coordinado"
                                        },
                                        "short": {
                                            "standard": "UTC"
                                        }
                                    },
                                    "Unknown": {
                                        "exemplarCity": "ciudad desconocida"
                                    }
                                }
                            },
                            "metazone": {
                                "Acre": {
                                    "long": {
                                        "generic": "Hora de Acre",
                                        "standard": "Hora estándar de Acre",
                                        "daylight": "Hora de verano de Acre"
                                    }
                                },
                                "Afghanistan": {
                                    "long": {
                                        "standard": "hora de Afganistán"
                                    }
                                },
                                "Africa_Central": {
                                    "long": {
                                        "standard": "hora de África central"
                                    }
                                },
                                "Africa_Eastern": {
                                    "long": {
                                        "standard": "hora de África oriental"
                                    }
                                },
                                "Africa_Southern": {
                                    "long": {
                                        "standard": "hora de Sudáfrica"
                                    }
                                },
                                "Africa_Western": {
                                    "long": {
                                        "generic": "hora de África occidental",
                                        "standard": "hora estándar de África occidental",
                                        "daylight": "hora de verano de África occidental"
                                    }
                                },
                                "Alaska": {
                                    "long": {
                                        "generic": "hora de Alaska",
                                        "standard": "hora estándar de Alaska",
                                        "daylight": "hora de verano de Alaska"
                                    }
                                },
                                "Amazon": {
                                    "long": {
                                        "generic": "hora del Amazonas",
                                        "standard": "hora estándar del Amazonas",
                                        "daylight": "hora de verano del Amazonas"
                                    }
                                },
                                "America_Central": {
                                    "long": {
                                        "generic": "hora central",
                                        "standard": "hora estándar central",
                                        "daylight": "hora de verano central"
                                    }
                                },
                                "America_Eastern": {
                                    "long": {
                                        "generic": "hora oriental",
                                        "standard": "hora estándar oriental",
                                        "daylight": "hora de verano oriental"
                                    }
                                },
                                "America_Mountain": {
                                    "long": {
                                        "generic": "hora de las Montañas Rocosas",
                                        "standard": "hora estándar de las Montañas Rocosas",
                                        "daylight": "hora de verano de las Montañas Rocosas"
                                    }
                                },
                                "America_Pacific": {
                                    "long": {
                                        "generic": "hora del Pacífico",
                                        "standard": "hora estándar del Pacífico",
                                        "daylight": "hora de verano del Pacífico"
                                    }
                                },
                                "Anadyr": {
                                    "long": {
                                        "generic": "hora de Anadyr",
                                        "standard": "hora estándar de Anadyr",
                                        "daylight": "hora de verano de Anadyr"
                                    }
                                },
                                "Apia": {
                                    "long": {
                                        "generic": "hora de Apia",
                                        "standard": "hora estándar de Apia",
                                        "daylight": "horario de verano de Apia"
                                    }
                                },
                                "Aqtau": {
                                    "long": {
                                        "generic": "Hora de Aktau",
                                        "standard": "Hora estándar de Aktau",
                                        "daylight": "Hora de verano de Aktau"
                                    }
                                },
                                "Aqtobe": {
                                    "long": {
                                        "generic": "Hora de Aktobe",
                                        "standard": "Hora estándar de Aktobe",
                                        "daylight": "Hora de verano de Aktobe"
                                    }
                                },
                                "Arabian": {
                                    "long": {
                                        "generic": "hora de Arabia",
                                        "standard": "hora estándar de Arabia",
                                        "daylight": "hora de verano de Arabia"
                                    }
                                },
                                "Argentina": {
                                    "long": {
                                        "generic": "hora de Argentina",
                                        "standard": "hora estándar de Argentina",
                                        "daylight": "hora de verano de Argentina"
                                    }
                                },
                                "Argentina_Western": {
                                    "long": {
                                        "generic": "hora de Argentina occidental",
                                        "standard": "hora estándar de Argentina occidental",
                                        "daylight": "hora de verano de Argentina occidental"
                                    }
                                },
                                "Armenia": {
                                    "long": {
                                        "generic": "hora de Armenia",
                                        "standard": "hora estándar de Armenia",
                                        "daylight": "hora de verano de Armenia"
                                    }
                                },
                                "Atlantic": {
                                    "long": {
                                        "generic": "hora del Atlántico",
                                        "standard": "hora estándar del Atlántico",
                                        "daylight": "hora de verano del Atlántico"
                                    }
                                },
                                "Australia_Central": {
                                    "long": {
                                        "generic": "hora de Australia central",
                                        "standard": "hora estándar de Australia central",
                                        "daylight": "hora de verano de Australia central"
                                    }
                                },
                                "Australia_CentralWestern": {
                                    "long": {
                                        "generic": "hora de Australia centroccidental",
                                        "standard": "hora estándar de Australia centroccidental",
                                        "daylight": "hora de verano de Australia centroccidental"
                                    }
                                },
                                "Australia_Eastern": {
                                    "long": {
                                        "generic": "hora de Australia oriental",
                                        "standard": "hora estándar de Australia oriental",
                                        "daylight": "hora de verano de Australia oriental"
                                    }
                                },
                                "Australia_Western": {
                                    "long": {
                                        "generic": "hora de Australia occidental",
                                        "standard": "hora estándar de Australia occidental",
                                        "daylight": "hora de verano de Australia occidental"
                                    }
                                },
                                "Azerbaijan": {
                                    "long": {
                                        "generic": "hora de Azerbaiyán",
                                        "standard": "hora estándar de Azerbaiyán",
                                        "daylight": "hora de verano de Azerbaiyán"
                                    }
                                },
                                "Azores": {
                                    "long": {
                                        "generic": "hora de las Azores",
                                        "standard": "hora estándar de las Azores",
                                        "daylight": "hora de verano de las Azores"
                                    }
                                },
                                "Bangladesh": {
                                    "long": {
                                        "generic": "hora de Bangladés",
                                        "standard": "hora estándar de Bangladés",
                                        "daylight": "hora de verano de Bangladés"
                                    }
                                },
                                "Bhutan": {
                                    "long": {
                                        "standard": "hora de Bután"
                                    }
                                },
                                "Bolivia": {
                                    "long": {
                                        "standard": "hora de Bolivia"
                                    }
                                },
                                "Brasilia": {
                                    "long": {
                                        "generic": "hora de Brasilia",
                                        "standard": "hora estándar de Brasilia",
                                        "daylight": "hora de verano de Brasilia"
                                    }
                                },
                                "Brunei": {
                                    "long": {
                                        "standard": "hora de Brunéi"
                                    }
                                },
                                "Cape_Verde": {
                                    "long": {
                                        "generic": "hora de Cabo Verde",
                                        "standard": "hora estándar de Cabo Verde",
                                        "daylight": "hora de verano de Cabo Verde"
                                    }
                                },
                                "Chamorro": {
                                    "long": {
                                        "standard": "hora estándar de Chamorro"
                                    }
                                },
                                "Chatham": {
                                    "long": {
                                        "generic": "hora de Chatham",
                                        "standard": "hora estándar de Chatham",
                                        "daylight": "hora de verano de Chatham"
                                    }
                                },
                                "Chile": {
                                    "long": {
                                        "generic": "hora de Chile",
                                        "standard": "hora estándar de Chile",
                                        "daylight": "hora de verano de Chile"
                                    }
                                },
                                "China": {
                                    "long": {
                                        "generic": "hora de China",
                                        "standard": "hora estándar de China",
                                        "daylight": "hora de verano de China"
                                    }
                                },
                                "Choibalsan": {
                                    "long": {
                                        "generic": "hora de Choibalsan",
                                        "standard": "hora estándar de Choibalsan",
                                        "daylight": "hora de verano de Choibalsan"
                                    }
                                },
                                "Christmas": {
                                    "long": {
                                        "standard": "hora de la Isla de Navidad"
                                    }
                                },
                                "Cocos": {
                                    "long": {
                                        "standard": "hora de las Islas Cocos"
                                    }
                                },
                                "Colombia": {
                                    "long": {
                                        "generic": "hora de Colombia",
                                        "standard": "hora estándar de Colombia",
                                        "daylight": "hora de verano de Colombia"
                                    }
                                },
                                "Cook": {
                                    "long": {
                                        "generic": "hora de las Islas Cook",
                                        "standard": "hora estándar de las Islas Cook",
                                        "daylight": "hora de verano media de las Islas Cook"
                                    }
                                },
                                "Cuba": {
                                    "long": {
                                        "generic": "hora de Cuba",
                                        "standard": "hora estándar de Cuba",
                                        "daylight": "hora de verano de Cuba"
                                    }
                                },
                                "Davis": {
                                    "long": {
                                        "standard": "hora de Davis"
                                    }
                                },
                                "DumontDUrville": {
                                    "long": {
                                        "standard": "hora de Dumont-d’Urville"
                                    }
                                },
                                "East_Timor": {
                                    "long": {
                                        "standard": "hora de Timor Oriental"
                                    }
                                },
                                "Easter": {
                                    "long": {
                                        "generic": "hora de la isla de Pascua",
                                        "standard": "hora estándar de la isla de Pascua",
                                        "daylight": "hora de verano de la isla de Pascua"
                                    }
                                },
                                "Ecuador": {
                                    "long": {
                                        "standard": "hora de Ecuador"
                                    }
                                },
                                "Europe_Central": {
                                    "long": {
                                        "generic": "hora de Europa central",
                                        "standard": "hora estándar de Europa central",
                                        "daylight": "hora de verano de Europa central"
                                    },
                                    "short": {
                                        "generic": "CET",
                                        "standard": "CET",
                                        "daylight": "CEST"
                                    }
                                },
                                "Europe_Eastern": {
                                    "long": {
                                        "generic": "hora de Europa oriental",
                                        "standard": "hora estándar de Europa oriental",
                                        "daylight": "hora de verano de Europa oriental"
                                    },
                                    "short": {
                                        "generic": "EET",
                                        "standard": "EET",
                                        "daylight": "EEST"
                                    }
                                },
                                "Europe_Further_Eastern": {
                                    "long": {
                                        "standard": "hora del extremo oriental de Europa"
                                    }
                                },
                                "Europe_Western": {
                                    "long": {
                                        "generic": "hora de Europa occidental",
                                        "standard": "hora estándar de Europa occidental",
                                        "daylight": "hora de verano de Europa occidental"
                                    },
                                    "short": {
                                        "generic": "WET",
                                        "standard": "WET",
                                        "daylight": "WEST"
                                    }
                                },
                                "Falkland": {
                                    "long": {
                                        "generic": "hora de las islas Malvinas",
                                        "standard": "hora estándar de las islas Malvinas",
                                        "daylight": "hora de verano de las islas Malvinas"
                                    }
                                },
                                "Fiji": {
                                    "long": {
                                        "generic": "hora de Fiyi",
                                        "standard": "hora estándar de Fiyi",
                                        "daylight": "hora de verano de Fiyi"
                                    }
                                },
                                "French_Guiana": {
                                    "long": {
                                        "standard": "hora de la Guayana Francesa"
                                    }
                                },
                                "French_Southern": {
                                    "long": {
                                        "standard": "hora de Antártida y Territorios Australes Franceses"
                                    }
                                },
                                "Galapagos": {
                                    "long": {
                                        "standard": "hora de Galápagos"
                                    }
                                },
                                "Gambier": {
                                    "long": {
                                        "standard": "hora de Gambier"
                                    }
                                },
                                "Georgia": {
                                    "long": {
                                        "generic": "hora de Georgia",
                                        "standard": "hora estándar de Georgia",
                                        "daylight": "hora de verano de Georgia"
                                    }
                                },
                                "Gilbert_Islands": {
                                    "long": {
                                        "standard": "hora de las islas Gilbert"
                                    }
                                },
                                "GMT": {
                                    "long": {
                                        "standard": "hora del meridiano de Greenwich"
                                    },
                                    "short": {
                                        "standard": "GMT"
                                    }
                                },
                                "Greenland_Eastern": {
                                    "long": {
                                        "generic": "hora de Groenlandia oriental",
                                        "standard": "hora estándar de Groenlandia oriental",
                                        "daylight": "hora de verano de Groenlandia oriental"
                                    }
                                },
                                "Greenland_Western": {
                                    "long": {
                                        "generic": "hora de Groenlandia occidental",
                                        "standard": "hora estándar de Groenlandia occidental",
                                        "daylight": "hora de verano de Groenlandia occidental"
                                    }
                                },
                                "Guam": {
                                    "long": {
                                        "standard": "Hora estándar de Guam"
                                    }
                                },
                                "Gulf": {
                                    "long": {
                                        "standard": "hora estándar del Golfo"
                                    }
                                },
                                "Guyana": {
                                    "long": {
                                        "standard": "hora de Guyana"
                                    }
                                },
                                "Hawaii_Aleutian": {
                                    "long": {
                                        "generic": "hora de Hawái-Aleutianas",
                                        "standard": "hora estándar de Hawái-Aleutianas",
                                        "daylight": "hora de verano de Hawái-Aleutianas"
                                    }
                                },
                                "Hong_Kong": {
                                    "long": {
                                        "generic": "hora de Hong Kong",
                                        "standard": "hora estándar de Hong Kong",
                                        "daylight": "hora de verano de Hong Kong"
                                    }
                                },
                                "Hovd": {
                                    "long": {
                                        "generic": "hora de Hovd",
                                        "standard": "hora estándar de Hovd",
                                        "daylight": "hora de verano de Hovd"
                                    }
                                },
                                "India": {
                                    "long": {
                                        "standard": "hora estándar de la India"
                                    }
                                },
                                "Indian_Ocean": {
                                    "long": {
                                        "standard": "hora del océano Índico"
                                    }
                                },
                                "Indochina": {
                                    "long": {
                                        "standard": "hora de Indochina"
                                    }
                                },
                                "Indonesia_Central": {
                                    "long": {
                                        "standard": "hora de Indonesia central"
                                    }
                                },
                                "Indonesia_Eastern": {
                                    "long": {
                                        "standard": "hora de Indonesia oriental"
                                    }
                                },
                                "Indonesia_Western": {
                                    "long": {
                                        "standard": "hora de Indonesia occidental"
                                    }
                                },
                                "Iran": {
                                    "long": {
                                        "generic": "hora de Irán",
                                        "standard": "hora estándar de Irán",
                                        "daylight": "hora de verano de Irán"
                                    }
                                },
                                "Irkutsk": {
                                    "long": {
                                        "generic": "hora de Irkutsk",
                                        "standard": "hora estándar de Irkutsk",
                                        "daylight": "hora de verano de Irkutsk"
                                    }
                                },
                                "Israel": {
                                    "long": {
                                        "generic": "hora de Israel",
                                        "standard": "hora estándar de Israel",
                                        "daylight": "hora de verano de Israel"
                                    }
                                },
                                "Japan": {
                                    "long": {
                                        "generic": "hora de Japón",
                                        "standard": "hora estándar de Japón",
                                        "daylight": "hora de verano de Japón"
                                    }
                                },
                                "Kamchatka": {
                                    "long": {
                                        "generic": "hora de Kamchatka",
                                        "standard": "hora estándar de Kamchatka",
                                        "daylight": "hora de verano de Kamchatka"
                                    }
                                },
                                "Kazakhstan_Eastern": {
                                    "long": {
                                        "standard": "hora de Kazajistán oriental"
                                    }
                                },
                                "Kazakhstan_Western": {
                                    "long": {
                                        "standard": "hora de Kazajistán occidental"
                                    }
                                },
                                "Korea": {
                                    "long": {
                                        "generic": "hora de Corea",
                                        "standard": "hora estándar de Corea",
                                        "daylight": "hora de verano de Corea"
                                    }
                                },
                                "Kosrae": {
                                    "long": {
                                        "standard": "hora de Kosrae"
                                    }
                                },
                                "Krasnoyarsk": {
                                    "long": {
                                        "generic": "hora de Krasnoyarsk",
                                        "standard": "hora estándar de Krasnoyarsk",
                                        "daylight": "hora de verano de Krasnoyarsk"
                                    }
                                },
                                "Kyrgystan": {
                                    "long": {
                                        "standard": "hora de Kirguistán"
                                    }
                                },
                                "Lanka": {
                                    "long": {
                                        "standard": "Hora de Sri Lanka"
                                    }
                                },
                                "Line_Islands": {
                                    "long": {
                                        "standard": "hora de las Espóradas Ecuatoriales"
                                    }
                                },
                                "Lord_Howe": {
                                    "long": {
                                        "generic": "hora de Lord Howe",
                                        "standard": "hora estándar de Lord Howe",
                                        "daylight": "hora de verano de Lord Howe"
                                    }
                                },
                                "Macau": {
                                    "long": {
                                        "generic": "Hora de Macao",
                                        "standard": "Hora estándar de Macao",
                                        "daylight": "Hora de verano de Macao"
                                    }
                                },
                                "Macquarie": {
                                    "long": {
                                        "standard": "hora de la isla Macquarie"
                                    }
                                },
                                "Magadan": {
                                    "long": {
                                        "generic": "hora de Magadán",
                                        "standard": "hora estándar de Magadán",
                                        "daylight": "hora de verano de Magadán"
                                    }
                                },
                                "Malaysia": {
                                    "long": {
                                        "standard": "hora de Malasia"
                                    }
                                },
                                "Maldives": {
                                    "long": {
                                        "standard": "hora de Maldivas"
                                    }
                                },
                                "Marquesas": {
                                    "long": {
                                        "standard": "hora de Marquesas"
                                    }
                                },
                                "Marshall_Islands": {
                                    "long": {
                                        "standard": "hora de las Islas Marshall"
                                    }
                                },
                                "Mauritius": {
                                    "long": {
                                        "generic": "hora de Mauricio",
                                        "standard": "hora estándar de Mauricio",
                                        "daylight": "hora de verano de Mauricio"
                                    }
                                },
                                "Mawson": {
                                    "long": {
                                        "standard": "hora de Mawson"
                                    }
                                },
                                "Mexico_Northwest": {
                                    "long": {
                                        "generic": "hora del noroeste de México",
                                        "standard": "hora estándar del noroeste de México",
                                        "daylight": "hora de verano del noroeste de México"
                                    }
                                },
                                "Mexico_Pacific": {
                                    "long": {
                                        "generic": "hora del Pacífico de México",
                                        "standard": "hora estándar del Pacífico de México",
                                        "daylight": "hora de verano del Pacífico de México"
                                    }
                                },
                                "Mongolia": {
                                    "long": {
                                        "generic": "hora de Ulán Bator",
                                        "standard": "hora estándar de Ulán Bator",
                                        "daylight": "hora de verano de Ulán Bator"
                                    }
                                },
                                "Moscow": {
                                    "long": {
                                        "generic": "hora de Moscú",
                                        "standard": "hora estándar de Moscú",
                                        "daylight": "hora de verano de Moscú"
                                    }
                                },
                                "Myanmar": {
                                    "long": {
                                        "standard": "hora de Myanmar"
                                    }
                                },
                                "Nauru": {
                                    "long": {
                                        "standard": "hora de Nauru"
                                    }
                                },
                                "Nepal": {
                                    "long": {
                                        "standard": "hora de Nepal"
                                    }
                                },
                                "New_Caledonia": {
                                    "long": {
                                        "generic": "hora de Nueva Caledonia",
                                        "standard": "hora estándar de Nueva Caledonia",
                                        "daylight": "hora de verano de Nueva Caledonia"
                                    }
                                },
                                "New_Zealand": {
                                    "long": {
                                        "generic": "hora de Nueva Zelanda",
                                        "standard": "hora estándar de Nueva Zelanda",
                                        "daylight": "hora de verano de Nueva Zelanda"
                                    }
                                },
                                "Newfoundland": {
                                    "long": {
                                        "generic": "hora de Terranova",
                                        "standard": "hora estándar de Terranova",
                                        "daylight": "hora de verano de Terranova"
                                    }
                                },
                                "Niue": {
                                    "long": {
                                        "standard": "hora de Niue"
                                    }
                                },
                                "Norfolk": {
                                    "long": {
                                        "standard": "hora de la isla Norfolk"
                                    }
                                },
                                "Noronha": {
                                    "long": {
                                        "generic": "hora de Fernando de Noronha",
                                        "standard": "hora estándar de Fernando de Noronha",
                                        "daylight": "hora de verano de Fernando de Noronha"
                                    }
                                },
                                "North_Mariana": {
                                    "long": {
                                        "standard": "Hora de las Islas Marianas del Norte"
                                    }
                                },
                                "Novosibirsk": {
                                    "long": {
                                        "generic": "hora de Novosibirsk",
                                        "standard": "hora estándar de Novosibirsk",
                                        "daylight": "hora de verano de Novosibirsk"
                                    }
                                },
                                "Omsk": {
                                    "long": {
                                        "generic": "hora de Omsk",
                                        "standard": "hora estándar de Omsk",
                                        "daylight": "hora de verano de Omsk"
                                    }
                                },
                                "Pakistan": {
                                    "long": {
                                        "generic": "hora de Pakistán",
                                        "standard": "hora estándar de Pakistán",
                                        "daylight": "hora de verano de Pakistán"
                                    }
                                },
                                "Palau": {
                                    "long": {
                                        "standard": "hora de Palaos"
                                    }
                                },
                                "Papua_New_Guinea": {
                                    "long": {
                                        "standard": "hora de Papúa Nueva Guinea"
                                    }
                                },
                                "Paraguay": {
                                    "long": {
                                        "generic": "hora de Paraguay",
                                        "standard": "hora estándar de Paraguay",
                                        "daylight": "hora de verano de Paraguay"
                                    }
                                },
                                "Peru": {
                                    "long": {
                                        "generic": "hora de Perú",
                                        "standard": "hora estándar de Perú",
                                        "daylight": "hora de verano de Perú"
                                    }
                                },
                                "Philippines": {
                                    "long": {
                                        "generic": "hora de Filipinas",
                                        "standard": "hora estándar de Filipinas",
                                        "daylight": "hora de verano de Filipinas"
                                    }
                                },
                                "Phoenix_Islands": {
                                    "long": {
                                        "standard": "hora de las Islas Fénix"
                                    }
                                },
                                "Pierre_Miquelon": {
                                    "long": {
                                        "generic": "hora de San Pedro y Miquelón",
                                        "standard": "hora estándar de San Pedro y Miquelón",
                                        "daylight": "hora de verano de San Pedro y Miquelón"
                                    }
                                },
                                "Pitcairn": {
                                    "long": {
                                        "standard": "hora de Pitcairn"
                                    }
                                },
                                "Ponape": {
                                    "long": {
                                        "standard": "hora de Pohnpei"
                                    }
                                },
                                "Pyongyang": {
                                    "long": {
                                        "standard": "hora de Pyongyang"
                                    }
                                },
                                "Qyzylorda": {
                                    "long": {
                                        "generic": "Hora de Qyzylorda",
                                        "standard": "Hora estándar de Qyzylorda",
                                        "daylight": "Hora de verano de Qyzylorda"
                                    }
                                },
                                "Reunion": {
                                    "long": {
                                        "standard": "hora de Reunión"
                                    }
                                },
                                "Rothera": {
                                    "long": {
                                        "standard": "hora de Rothera"
                                    }
                                },
                                "Sakhalin": {
                                    "long": {
                                        "generic": "hora de Sajalín",
                                        "standard": "hora estándar de Sajalín",
                                        "daylight": "hora de verano de Sajalín"
                                    }
                                },
                                "Samara": {
                                    "long": {
                                        "generic": "hora de Samara",
                                        "standard": "hora estándar de Samara",
                                        "daylight": "hora de verano de Samara"
                                    }
                                },
                                "Samoa": {
                                    "long": {
                                        "generic": "hora de Samoa",
                                        "standard": "hora estándar de Samoa",
                                        "daylight": "hora de verano de Samoa"
                                    }
                                },
                                "Seychelles": {
                                    "long": {
                                        "standard": "hora de Seychelles"
                                    }
                                },
                                "Singapore": {
                                    "long": {
                                        "standard": "hora de Singapur"
                                    }
                                },
                                "Solomon": {
                                    "long": {
                                        "standard": "hora de las Islas Salomón"
                                    }
                                },
                                "South_Georgia": {
                                    "long": {
                                        "standard": "hora de Georgia del Sur"
                                    }
                                },
                                "Suriname": {
                                    "long": {
                                        "standard": "hora de Surinam"
                                    }
                                },
                                "Syowa": {
                                    "long": {
                                        "standard": "hora de Syowa"
                                    }
                                },
                                "Tahiti": {
                                    "long": {
                                        "standard": "hora de Tahití"
                                    }
                                },
                                "Taipei": {
                                    "long": {
                                        "generic": "hora de Taipéi",
                                        "standard": "hora estándar de Taipéi",
                                        "daylight": "hora de verano de Taipéi"
                                    }
                                },
                                "Tajikistan": {
                                    "long": {
                                        "standard": "hora de Tayikistán"
                                    }
                                },
                                "Tokelau": {
                                    "long": {
                                        "standard": "hora de Tokelau"
                                    }
                                },
                                "Tonga": {
                                    "long": {
                                        "generic": "hora de Tonga",
                                        "standard": "hora estándar de Tonga",
                                        "daylight": "hora de verano de Tonga"
                                    }
                                },
                                "Truk": {
                                    "long": {
                                        "standard": "hora de Chuuk"
                                    }
                                },
                                "Turkmenistan": {
                                    "long": {
                                        "generic": "hora de Turkmenistán",
                                        "standard": "hora estándar de Turkmenistán",
                                        "daylight": "hora de verano de Turkmenistán"
                                    }
                                },
                                "Tuvalu": {
                                    "long": {
                                        "standard": "hora de Tuvalu"
                                    }
                                },
                                "Uruguay": {
                                    "long": {
                                        "generic": "hora de Uruguay",
                                        "standard": "hora estándar de Uruguay",
                                        "daylight": "hora de verano de Uruguay"
                                    }
                                },
                                "Uzbekistan": {
                                    "long": {
                                        "generic": "hora de Uzbekistán",
                                        "standard": "hora estándar de Uzbekistán",
                                        "daylight": "hora de verano de Uzbekistán"
                                    }
                                },
                                "Vanuatu": {
                                    "long": {
                                        "generic": "hora de Vanuatu",
                                        "standard": "hora estándar de Vanuatu",
                                        "daylight": "hora de verano de Vanuatu"
                                    }
                                },
                                "Venezuela": {
                                    "long": {
                                        "standard": "hora de Venezuela"
                                    }
                                },
                                "Vladivostok": {
                                    "long": {
                                        "generic": "hora de Vladivostok",
                                        "standard": "hora estándar de Vladivostok",
                                        "daylight": "hora de verano de Vladivostok"
                                    }
                                },
                                "Volgograd": {
                                    "long": {
                                        "generic": "hora de Volgogrado",
                                        "standard": "hora estándar de Volgogrado",
                                        "daylight": "hora de verano de Volgogrado"
                                    }
                                },
                                "Vostok": {
                                    "long": {
                                        "standard": "hora de Vostok"
                                    }
                                },
                                "Wake": {
                                    "long": {
                                        "standard": "hora de la isla Wake"
                                    }
                                },
                                "Wallis": {
                                    "long": {
                                        "standard": "hora de Wallis y Futuna"
                                    }
                                },
                                "Yakutsk": {
                                    "long": {
                                        "generic": "hora de Yakutsk",
                                        "standard": "hora estándar de Yakutsk",
                                        "daylight": "hora de verano de Yakutsk"
                                    }
                                },
                                "Yekaterinburg": {
                                    "long": {
                                        "generic": "hora de Ekaterimburgo",
                                        "standard": "hora estándar de Ekaterimburgo",
                                        "daylight": "hora de verano de Ekaterimburgo"
                                    }
                                }
                            }
                        },
                        "calendars": {
                            "gregorian": {
                                "months": {
                                    "format": {
                                        "abbreviated": {
                                            "1": "ene.",
                                            "2": "feb.",
                                            "3": "mar.",
                                            "4": "abr.",
                                            "5": "may.",
                                            "6": "jun.",
                                            "7": "jul.",
                                            "8": "ago.",
                                            "9": "sept.",
                                            "10": "oct.",
                                            "11": "nov.",
                                            "12": "dic."
                                        },
                                        "narrow": {
                                            "1": "E",
                                            "2": "F",
                                            "3": "M",
                                            "4": "A",
                                            "5": "M",
                                            "6": "J",
                                            "7": "J",
                                            "8": "A",
                                            "9": "S",
                                            "10": "O",
                                            "11": "N",
                                            "12": "D"
                                        },
                                        "wide": {
                                            "1": "enero",
                                            "2": "febrero",
                                            "3": "marzo",
                                            "4": "abril",
                                            "5": "mayo",
                                            "6": "junio",
                                            "7": "julio",
                                            "8": "agosto",
                                            "9": "septiembre",
                                            "10": "octubre",
                                            "11": "noviembre",
                                            "12": "diciembre"
                                        }
                                    },
                                    "stand-alone": {
                                        "abbreviated": {
                                            "1": "ene.",
                                            "2": "feb.",
                                            "3": "mar.",
                                            "4": "abr.",
                                            "5": "may.",
                                            "6": "jun.",
                                            "7": "jul.",
                                            "8": "ago.",
                                            "9": "sept.",
                                            "10": "oct.",
                                            "11": "nov.",
                                            "12": "dic."
                                        },
                                        "narrow": {
                                            "1": "E",
                                            "2": "F",
                                            "3": "M",
                                            "4": "A",
                                            "5": "M",
                                            "6": "J",
                                            "7": "J",
                                            "8": "A",
                                            "9": "S",
                                            "10": "O",
                                            "11": "N",
                                            "12": "D"
                                        },
                                        "wide": {
                                            "1": "enero",
                                            "2": "febrero",
                                            "3": "marzo",
                                            "4": "abril",
                                            "5": "mayo",
                                            "6": "junio",
                                            "7": "julio",
                                            "8": "agosto",
                                            "9": "septiembre",
                                            "10": "octubre",
                                            "11": "noviembre",
                                            "12": "diciembre"
                                        }
                                    }
                                },
                                "days": {
                                    "format": {
                                        "abbreviated": {
                                            "sun": "dom.",
                                            "mon": "lun.",
                                            "tue": "mar.",
                                            "wed": "mié.",
                                            "thu": "jue.",
                                            "fri": "vie.",
                                            "sat": "sáb."
                                        },
                                        "narrow": {
                                            "sun": "D",
                                            "mon": "L",
                                            "tue": "M",
                                            "wed": "X",
                                            "thu": "J",
                                            "fri": "V",
                                            "sat": "S"
                                        },
                                        "short": {
                                            "sun": "DO",
                                            "mon": "LU",
                                            "tue": "MA",
                                            "wed": "MI",
                                            "thu": "JU",
                                            "fri": "VI",
                                            "sat": "SA"
                                        },
                                        "wide": {
                                            "sun": "domingo",
                                            "mon": "lunes",
                                            "tue": "martes",
                                            "wed": "miércoles",
                                            "thu": "jueves",
                                            "fri": "viernes",
                                            "sat": "sábado"
                                        }
                                    },
                                    "stand-alone": {
                                        "abbreviated": {
                                            "sun": "dom.",
                                            "mon": "lun.",
                                            "tue": "mar.",
                                            "wed": "mié.",
                                            "thu": "jue.",
                                            "fri": "vie.",
                                            "sat": "sáb."
                                        },
                                        "narrow": {
                                            "sun": "D",
                                            "mon": "L",
                                            "tue": "M",
                                            "wed": "X",
                                            "thu": "J",
                                            "fri": "V",
                                            "sat": "S"
                                        },
                                        "short": {
                                            "sun": "DO",
                                            "mon": "LU",
                                            "tue": "MA",
                                            "wed": "MI",
                                            "thu": "JU",
                                            "fri": "VI",
                                            "sat": "SA"
                                        },
                                        "wide": {
                                            "sun": "domingo",
                                            "mon": "lunes",
                                            "tue": "martes",
                                            "wed": "miércoles",
                                            "thu": "jueves",
                                            "fri": "viernes",
                                            "sat": "sábado"
                                        }
                                    }
                                },
                                "quarters": {
                                    "format": {
                                        "abbreviated": {
                                            "1": "T1",
                                            "2": "T2",
                                            "3": "T3",
                                            "4": "T4"
                                        },
                                        "narrow": {
                                            "1": "1",
                                            "2": "2",
                                            "3": "3",
                                            "4": "4"
                                        },
                                        "wide": {
                                            "1": "1.er trimestre",
                                            "2": "2.º trimestre",
                                            "3": "3.er trimestre",
                                            "4": "4.º trimestre"
                                        }
                                    },
                                    "stand-alone": {
                                        "abbreviated": {
                                            "1": "T1",
                                            "2": "T2",
                                            "3": "T3",
                                            "4": "T4"
                                        },
                                        "narrow": {
                                            "1": "1",
                                            "2": "2",
                                            "3": "3",
                                            "4": "4"
                                        },
                                        "wide": {
                                            "1": "1.er trimestre",
                                            "2": "2.º trimestre",
                                            "3": "3.er trimestre",
                                            "4": "4.º trimestre"
                                        }
                                    }
                                },
                                "dayPeriods": {
                                    "format": {
                                        "abbreviated": {
                                            "am": "a. m.",
                                            "noon": "del mediodía",
                                            "pm": "p. m.",
                                            "morning1": "de la madrugada",
                                            "morning2": "de la mañana",
                                            "evening1": "de la tarde",
                                            "night1": "de la noche"
                                        },
                                        "narrow": {
                                            "am": "a. m.",
                                            "noon": "del mediodía",
                                            "pm": "p. m.",
                                            "morning1": "de la madrugada",
                                            "morning2": "de la mañana",
                                            "evening1": "de la tarde",
                                            "night1": "de la noche"
                                        },
                                        "wide": {
                                            "am": "a. m.",
                                            "noon": "del mediodía",
                                            "pm": "p. m.",
                                            "morning1": "de la madrugada",
                                            "morning2": "de la mañana",
                                            "evening1": "de la tarde",
                                            "night1": "de la noche"
                                        }
                                    },
                                    "stand-alone": {
                                        "abbreviated": {
                                            "am": "a. m.",
                                            "noon": "mediodía",
                                            "pm": "p. m.",
                                            "morning1": "madrugada",
                                            "morning2": "mañana",
                                            "evening1": "tarde",
                                            "night1": "noche"
                                        },
                                        "narrow": {
                                            "am": "a. m.",
                                            "noon": "mediodía",
                                            "pm": "p. m.",
                                            "morning1": "madrugada",
                                            "morning2": "mañana",
                                            "evening1": "tarde",
                                            "night1": "noche"
                                        },
                                        "wide": {
                                            "am": "a. m.",
                                            "noon": "mediodía",
                                            "pm": "p. m.",
                                            "morning1": "madrugada",
                                            "morning2": "mañana",
                                            "evening1": "tarde",
                                            "night1": "noche"
                                        }
                                    }
                                },
                                "eras": {
                                    "eraNames": {
                                        "0": "antes de Cristo",
                                        "0-alt-variant": "antes de la era común",
                                        "1": "después de Cristo",
                                        "1-alt-variant": "era común"
                                    },
                                    "eraAbbr": {
                                        "0": "a. C.",
                                        "0-alt-variant": "a. e. c.",
                                        "1": "d. C.",
                                        "1-alt-variant": "e. c."
                                    },
                                    "eraNarrow": {
                                        "0": "a. C.",
                                        "0-alt-variant": "a. e. c.",
                                        "1": "d. C.",
                                        "1-alt-variant": "e. c."
                                    }
                                },
                                "dateFormats": {
                                    "full": "EEEE, d 'de' MMMM 'de' y",
                                    "long": "d 'de' MMMM 'de' y",
                                    "medium": "d MMM y",
                                    "short": "d/M/yy"
                                },
                                "timeFormats": {
                                    "full": "H:mm:ss (zzzz)",
                                    "long": "H:mm:ss z",
                                    "medium": "H:mm:ss",
                                    "short": "H:mm"
                                },
                                "dateTimeFormats": {
                                    "full": "{1}, {0}",
                                    "long": "{1}, {0}",
                                    "medium": "{1} {0}",
                                    "short": "{1} {0}",
                                    "availableFormats": {
                                        "Bh": "h B",
                                        "Bhm": "h:mm B",
                                        "Bhms": "h:mm:ss B",
                                        "d": "d",
                                        "E": "ccc",
                                        "EBhm": "E h:mm B",
                                        "EBhms": "E h:mm:ss B",
                                        "Ed": "E d",
                                        "Ehm": "E, h:mm a",
                                        "EHm": "E, H:mm",
                                        "Ehms": "E, h:mm:ss a",
                                        "EHms": "E, H:mm:ss",
                                        "Gy": "y G",
                                        "GyMMM": "MMM y G",
                                        "GyMMMd": "d MMM y G",
                                        "GyMMMEd": "E, d MMM y G",
                                        "GyMMMM": "MMMM 'de' y G",
                                        "GyMMMMd": "d 'de' MMMM 'de' y G",
                                        "GyMMMMEd": "E, d 'de' MMMM 'de' y G",
                                        "h": "h a",
                                        "H": "H",
                                        "hm": "h:mm a",
                                        "Hm": "H:mm",
                                        "hms": "h:mm:ss a",
                                        "Hms": "H:mm:ss",
                                        "hmsv": "h:mm:ss a v",
                                        "Hmsv": "H:mm:ss v",
                                        "hmsvvvv": "h:mm:ss a (vvvv)",
                                        "Hmsvvvv": "H:mm:ss (vvvv)",
                                        "hmv": "h:mm a v",
                                        "Hmv": "H:mm v",
                                        "M": "L",
                                        "Md": "d/M",
                                        "MEd": "E, d/M",
                                        "MMd": "d/M",
                                        "MMdd": "d/M",
                                        "MMM": "LLL",
                                        "MMMd": "d MMM",
                                        "MMMEd": "E, d MMM",
                                        "MMMMd": "d 'de' MMMM",
                                        "MMMMEd": "E, d 'de' MMMM",
                                        "MMMMW-count-one": "'semana' W 'de' MMMM",
                                        "MMMMW-count-other": "'semana' W 'de' MMMM",
                                        "ms": "mm:ss",
                                        "y": "y",
                                        "yM": "M/y",
                                        "yMd": "d/M/y",
                                        "yMEd": "EEE, d/M/y",
                                        "yMM": "M/y",
                                        "yMMM": "MMM y",
                                        "yMMMd": "d MMM y",
                                        "yMMMEd": "EEE, d MMM y",
                                        "yMMMM": "MMMM 'de' y",
                                        "yMMMMd": "d 'de' MMMM 'de' y",
                                        "yMMMMEd": "EEE, d 'de' MMMM 'de' y",
                                        "yQQQ": "QQQ y",
                                        "yQQQQ": "QQQQ 'de' y",
                                        "yw-count-one": "'semana' w 'de' Y",
                                        "yw-count-other": "'semana' w 'de' Y"
                                    },
                                    "appendItems": {
                                        "Day": "{0} ({2}: {1})",
                                        "Day-Of-Week": "{0} {1}",
                                        "Era": "{1} {0}",
                                        "Hour": "{0} ({2}: {1})",
                                        "Minute": "{0} ({2}: {1})",
                                        "Month": "{0} ({2}: {1})",
                                        "Quarter": "{0} ({2}: {1})",
                                        "Second": "{0} ({2}: {1})",
                                        "Timezone": "{0} {1}",
                                        "Week": "{0} ({2}: {1})",
                                        "Year": "{1} {0}"
                                    },
                                    "intervalFormats": {
                                        "intervalFormatFallback": "{0}–{1}",
                                        "Bh": {
                                            "B": "h B – h B",
                                            "h": "h–h B"
                                        },
                                        "Bhm": {
                                            "B": "h:mm B – h:mm B",
                                            "h": "h:mm–h:mm B",
                                            "m": "h:mm–h:mm B"
                                        },
                                        "d": {
                                            "d": "d–d"
                                        },
                                        "Gy": {
                                            "G": "y G – y G",
                                            "y": "y–y G"
                                        },
                                        "GyM": {
                                            "G": "y-MM GGGGG – y-MM GGGGG",
                                            "M": "y-MM – y-MM GGGGG",
                                            "y": "y-MM – y-MM GGGGG"
                                        },
                                        "GyMd": {
                                            "d": "y-MM-dd – y-MM-dd GGGGG",
                                            "G": "y-MM-dd GGGGG – y-MM-dd GGGGG",
                                            "M": "y-MM-dd – y-MM-dd GGGGG",
                                            "y": "y-MM-dd – y-MM-dd GGGGG"
                                        },
                                        "GyMEd": {
                                            "d": "E y-MM-dd – E y-MM-dd GGGGG",
                                            "G": "E y-MM-dd GGGGG – E y-MM-dd GGGGG",
                                            "M": "E y-MM-dd – E y-MM-dd GGGGG",
                                            "y": "E y-MM-dd – E y-MM-dd GGGGG"
                                        },
                                        "GyMMM": {
                                            "G": "MMM y G – MMM y G",
                                            "M": "MMM–MMM y G",
                                            "y": "MMM y – MMM y G"
                                        },
                                        "GyMMMd": {
                                            "d": "MMM d–d y G",
                                            "G": "MMM d y G – MMM d y G",
                                            "M": "MMM d – MMM d y G",
                                            "y": "MMM d y – MMM d y G"
                                        },
                                        "GyMMMEd": {
                                            "d": "E d MMM – E d MMM, y G",
                                            "G": "E, MMM d, y G – E, MMM d, y G",
                                            "M": "E d MMM – E d MMM, y G",
                                            "y": "E d MMM, y – E d MMM, y G"
                                        },
                                        "h": {
                                            "a": "h a – h a",
                                            "h": "h–h a"
                                        },
                                        "H": {
                                            "H": "H–H"
                                        },
                                        "hm": {
                                            "a": "h:mm a – h:mm a",
                                            "h": "h:mm – h:mm a",
                                            "m": "h:mm – h:mm a"
                                        },
                                        "Hm": {
                                            "H": "H:mm–H:mm",
                                            "m": "H:mm–H:mm"
                                        },
                                        "hmv": {
                                            "a": "h:mm a – h:mm a v",
                                            "h": "h:mm–h:mm a v",
                                            "m": "h:mm–h:mm a v"
                                        },
                                        "Hmv": {
                                            "H": "H:mm–H:mm v",
                                            "m": "H:mm–H:mm v"
                                        },
                                        "hv": {
                                            "a": "h a – h a v",
                                            "h": "h–h a v"
                                        },
                                        "Hv": {
                                            "H": "H–H v"
                                        },
                                        "M": {
                                            "M": "M–M"
                                        },
                                        "Md": {
                                            "d": "d/M–d/M",
                                            "M": "d/M–d/M"
                                        },
                                        "MEd": {
                                            "d": "E, d/M – E, d/M",
                                            "M": "E, d/M – E, d/M"
                                        },
                                        "MMM": {
                                            "M": "MMM–MMM"
                                        },
                                        "MMMd": {
                                            "d": "d–d MMM",
                                            "M": "d MMM – d MMM"
                                        },
                                        "MMMEd": {
                                            "d": "E, d MMM – E, d MMM",
                                            "M": "E, d MMM – E, d MMM"
                                        },
                                        "MMMMd": {
                                            "d": "d–d 'de' MMMM",
                                            "M": "d 'de' MMMM–d 'de' MMMM"
                                        },
                                        "MMMMEd": {
                                            "d": "E, d 'de' MMMM–E, d 'de' MMMM",
                                            "M": "E, d 'de' MMMM–E, d 'de' MMMM"
                                        },
                                        "y": {
                                            "y": "y–y"
                                        },
                                        "yM": {
                                            "M": "M/y–M/y",
                                            "y": "M/y–M/y"
                                        },
                                        "yMd": {
                                            "d": "d/M/y–d/M/y",
                                            "M": "d/M/y–d/M/y",
                                            "y": "d/M/y–d/M/y"
                                        },
                                        "yMEd": {
                                            "d": "E, d/M/y – E, d/M/y",
                                            "M": "E, d/M/y – E, d/M/y",
                                            "y": "E, d/M/y – E, d/M/y"
                                        },
                                        "yMMM": {
                                            "M": "MMM–MMM y",
                                            "y": "MMM y – MMM y"
                                        },
                                        "yMMMd": {
                                            "d": "d–d MMM y",
                                            "M": "d MMM – d MMM y",
                                            "y": "d MMM y – d MMM y"
                                        },
                                        "yMMMEd": {
                                            "d": "E, d MMM – E, d MMM y",
                                            "M": "E, d MMM – E, d MMM y",
                                            "y": "E, d MMM y – E, d MMM y"
                                        },
                                        "yMMMM": {
                                            "M": "MMMM–MMMM 'de' y",
                                            "y": "MMMM 'de' y – MMMM 'de' y"
                                        },
                                        "yMMMMd": {
                                            "d": "d–d 'de' MMMM 'de' y",
                                            "M": "d 'de' MMMM–d 'de' MMMM 'de' y",
                                            "y": "d 'de' MMMM 'de' y–d 'de' MMMM 'de' y"
                                        },
                                        "yMMMMEd": {
                                            "d": "E, d 'de' MMMM–E, d 'de' MMMM 'de' y",
                                            "M": "E, d 'de' MMMM–E, d 'de' MMMM 'de' y",
                                            "y": "E, d 'de' MMMM 'de' y–E, d 'de' MMMM 'de' y"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "numbers": {
                        "defaultNumberingSystem": "latn",
                        "otherNumberingSystems": {
                            "native": "latn"
                        },
                        "minimumGroupingDigits": "2",
                        "symbols-numberSystem-latn": {
                            "decimal": ",",
                            "group": ".",
                            "list": ";",
                            "percentSign": "%",
                            "plusSign": "+",
                            "minusSign": "-",
                            "exponential": "E",
                            "superscriptingExponent": "×",
                            "perMille": "‰",
                            "infinity": "∞",
                            "nan": "NaN",
                            "timeSeparator": ":"
                        },
                        "decimalFormats-numberSystem-latn": {
                            "standard": "#,##0.###",
                            "long": {
                                "decimalFormat": {
                                    "1000-count-one": "0 mil",
                                    "1000-count-other": "0 mil",
                                    "10000-count-one": "00 mil",
                                    "10000-count-other": "00 mil",
                                    "100000-count-one": "000 mil",
                                    "100000-count-other": "000 mil",
                                    "1000000-count-one": "0 millón",
                                    "1000000-count-other": "0 millones",
                                    "10000000-count-one": "00 millones",
                                    "10000000-count-other": "00 millones",
                                    "100000000-count-one": "000 millones",
                                    "100000000-count-other": "000 millones",
                                    "1000000000-count-one": "0 mil millones",
                                    "1000000000-count-other": "0 mil millones",
                                    "10000000000-count-one": "00 mil millones",
                                    "10000000000-count-other": "00 mil millones",
                                    "100000000000-count-one": "000 mil millones",
                                    "100000000000-count-other": "000 mil millones",
                                    "1000000000000-count-one": "0 billón",
                                    "1000000000000-count-other": "0 billones",
                                    "10000000000000-count-one": "00 billones",
                                    "10000000000000-count-other": "00 billones",
                                    "100000000000000-count-one": "000 billones",
                                    "100000000000000-count-other": "000 billones"
                                }
                            },
                            "short": {
                                "decimalFormat": {
                                    "1000-count-one": "0 mil",
                                    "1000-count-other": "0 mil",
                                    "10000-count-one": "00 mil",
                                    "10000-count-other": "00 mil",
                                    "100000-count-one": "000 mil",
                                    "100000-count-other": "000 mil",
                                    "1000000-count-one": "0 M",
                                    "1000000-count-other": "0 M",
                                    "10000000-count-one": "00 M",
                                    "10000000-count-other": "00 M",
                                    "100000000-count-one": "000 M",
                                    "100000000-count-other": "000 M",
                                    "1000000000-count-one": "0000 M",
                                    "1000000000-count-other": "0000 M",
                                    "10000000000-count-one": "00 mil M",
                                    "10000000000-count-other": "00 mil M",
                                    "100000000000-count-one": "000 mil M",
                                    "100000000000-count-other": "000 mil M",
                                    "1000000000000-count-one": "0 B",
                                    "1000000000000-count-other": "0 B",
                                    "10000000000000-count-one": "00 B",
                                    "10000000000000-count-other": "00 B",
                                    "100000000000000-count-one": "000 B",
                                    "100000000000000-count-other": "000 B"
                                }
                            }
                        },
                        "scientificFormats-numberSystem-latn": {
                            "standard": "#E0"
                        },
                        "percentFormats-numberSystem-latn": {
                            "standard": "#,##0 %"
                        },
                        "currencies": {
                            "ADP": {
                                "displayName": "peseta andorrana",
                                "displayName-count-one": "peseta andorrana",
                                "displayName-count-other": "pesetas andorranas",
                                "symbol": "ADP"
                            },
                            "AED": {
                                "displayName": "dírham de los Emiratos Árabes Unidos",
                                "displayName-count-one": "dírham de los Emiratos Árabes Unidos",
                                "displayName-count-other": "dírhams de los Emiratos Árabes Unidos",
                                "symbol": "AED"
                            },
                            "AFA": {
                                "displayName": "afgani (1927–2002)",
                                "symbol": "AFA"
                            },
                            "AFN": {
                                "displayName": "afgani",
                                "displayName-count-one": "afgani",
                                "displayName-count-other": "afganis",
                                "symbol": "AFN"
                            },
                            "ALK": {
                                "displayName": "ALK",
                                "symbol": "ALK"
                            },
                            "ALL": {
                                "displayName": "lek",
                                "displayName-count-one": "lek",
                                "displayName-count-other": "lekes",
                                "symbol": "ALL"
                            },
                            "AMD": {
                                "displayName": "dram",
                                "displayName-count-one": "dram",
                                "displayName-count-other": "drams",
                                "symbol": "AMD"
                            },
                            "ANG": {
                                "displayName": "florín de las Antillas Neerlandesas",
                                "displayName-count-one": "florín de las Antillas Neerlandesas",
                                "displayName-count-other": "florines de las Antillas Neerlandesas",
                                "symbol": "ANG"
                            },
                            "AOA": {
                                "displayName": "kuanza",
                                "displayName-count-one": "kuanza",
                                "displayName-count-other": "kuanzas",
                                "symbol": "AOA",
                                "symbol-alt-narrow": "Kz"
                            },
                            "AOK": {
                                "displayName": "kwanza angoleño (1977–1990)",
                                "symbol": "AOK"
                            },
                            "AON": {
                                "displayName": "nuevo kwanza angoleño (1990–2000)",
                                "symbol": "AON"
                            },
                            "AOR": {
                                "displayName": "kwanza reajustado angoleño (1995–1999)",
                                "symbol": "AOR"
                            },
                            "ARA": {
                                "displayName": "austral argentino",
                                "displayName-count-one": "austral argentino",
                                "displayName-count-other": "australes argentinos",
                                "symbol": "ARA"
                            },
                            "ARL": {
                                "displayName": "ARL",
                                "symbol": "ARL"
                            },
                            "ARM": {
                                "displayName": "ARM",
                                "symbol": "ARM"
                            },
                            "ARP": {
                                "displayName": "peso argentino (1983–1985)",
                                "displayName-count-one": "peso argentino (ARP)",
                                "displayName-count-other": "pesos argentinos (ARP)",
                                "symbol": "ARP"
                            },
                            "ARS": {
                                "displayName": "peso argentino",
                                "displayName-count-one": "peso argentino",
                                "displayName-count-other": "pesos argentinos",
                                "symbol": "ARS",
                                "symbol-alt-narrow": "$"
                            },
                            "ATS": {
                                "displayName": "chelín austriaco",
                                "displayName-count-one": "chelín austriaco",
                                "displayName-count-other": "chelines austriacos",
                                "symbol": "ATS"
                            },
                            "AUD": {
                                "displayName": "dólar australiano",
                                "displayName-count-one": "dólar australiano",
                                "displayName-count-other": "dólares australianos",
                                "symbol": "AUD",
                                "symbol-alt-narrow": "$"
                            },
                            "AWG": {
                                "displayName": "florín arubeño",
                                "displayName-count-one": "florín arubeño",
                                "displayName-count-other": "florines arubeños",
                                "symbol": "AWG"
                            },
                            "AZM": {
                                "displayName": "manat azerí (1993–2006)",
                                "symbol": "AZM"
                            },
                            "AZN": {
                                "displayName": "manat azerbaiyano",
                                "displayName-count-one": "manat azerbaiyano",
                                "displayName-count-other": "manat azerbaiyanos",
                                "symbol": "AZN"
                            },
                            "BAD": {
                                "displayName": "dinar bosnio",
                                "displayName-count-one": "dinar bosnio",
                                "displayName-count-other": "dinares bosnios",
                                "symbol": "BAD"
                            },
                            "BAM": {
                                "displayName": "marco convertible de Bosnia y Herzegovina",
                                "displayName-count-one": "marco convertible de Bosnia y Herzegovina",
                                "displayName-count-other": "marcos convertibles de Bosnia y Herzegovina",
                                "symbol": "BAM",
                                "symbol-alt-narrow": "KM"
                            },
                            "BAN": {
                                "displayName": "BAN",
                                "symbol": "BAN"
                            },
                            "BBD": {
                                "displayName": "dólar barbadense",
                                "displayName-count-one": "dólar barbadense",
                                "displayName-count-other": "dólares barbadenses",
                                "symbol": "BBD",
                                "symbol-alt-narrow": "$"
                            },
                            "BDT": {
                                "displayName": "taka",
                                "displayName-count-one": "taka",
                                "displayName-count-other": "takas",
                                "symbol": "BDT",
                                "symbol-alt-narrow": "৳"
                            },
                            "BEC": {
                                "displayName": "franco belga (convertible)",
                                "displayName-count-one": "franco belga (convertible)",
                                "displayName-count-other": "francos belgas (convertibles)",
                                "symbol": "BEC"
                            },
                            "BEF": {
                                "displayName": "franco belga",
                                "displayName-count-one": "franco belga",
                                "displayName-count-other": "francos belgas",
                                "symbol": "BEF"
                            },
                            "BEL": {
                                "displayName": "franco belga (financiero)",
                                "displayName-count-one": "franco belga (financiero)",
                                "displayName-count-other": "francos belgas (financieros)",
                                "symbol": "BEL"
                            },
                            "BGL": {
                                "displayName": "lev fuerte búlgaro",
                                "displayName-count-one": "lev fuerte búlgaro",
                                "displayName-count-other": "leva fuertes búlgaros",
                                "symbol": "BGL"
                            },
                            "BGM": {
                                "displayName": "BGM",
                                "symbol": "BGM"
                            },
                            "BGN": {
                                "displayName": "lev búlgaro",
                                "displayName-count-one": "lev búlgaro",
                                "displayName-count-other": "levas búlgaras",
                                "symbol": "BGN"
                            },
                            "BGO": {
                                "displayName": "BGO",
                                "symbol": "BGO"
                            },
                            "BHD": {
                                "displayName": "dinar bahreiní",
                                "displayName-count-one": "dinar bahreiní",
                                "displayName-count-other": "dinares bahreiníes",
                                "symbol": "BHD"
                            },
                            "BIF": {
                                "displayName": "franco burundés",
                                "displayName-count-one": "franco burundés",
                                "displayName-count-other": "francos burundeses",
                                "symbol": "BIF"
                            },
                            "BMD": {
                                "displayName": "dólar de Bermudas",
                                "displayName-count-one": "dólar de Bermudas",
                                "displayName-count-other": "dólares de Bermudas",
                                "symbol": "BMD",
                                "symbol-alt-narrow": "$"
                            },
                            "BND": {
                                "displayName": "dólar bruneano",
                                "displayName-count-one": "dólar bruneano",
                                "displayName-count-other": "dólares bruneanos",
                                "symbol": "BND",
                                "symbol-alt-narrow": "$"
                            },
                            "BOB": {
                                "displayName": "boliviano",
                                "displayName-count-one": "boliviano",
                                "displayName-count-other": "bolivianos",
                                "symbol": "BOB",
                                "symbol-alt-narrow": "Bs"
                            },
                            "BOL": {
                                "displayName": "BOL",
                                "symbol": "BOL"
                            },
                            "BOP": {
                                "displayName": "peso boliviano",
                                "displayName-count-one": "peso boliviano",
                                "displayName-count-other": "pesos bolivianos",
                                "symbol": "BOP"
                            },
                            "BOV": {
                                "displayName": "MVDOL boliviano",
                                "displayName-count-one": "MVDOL boliviano",
                                "displayName-count-other": "MVDOL bolivianos",
                                "symbol": "BOV"
                            },
                            "BRB": {
                                "displayName": "nuevo cruceiro brasileño (1967–1986)",
                                "displayName-count-one": "nuevo cruzado brasileño (BRB)",
                                "displayName-count-other": "nuevos cruzados brasileños (BRB)",
                                "symbol": "BRB"
                            },
                            "BRC": {
                                "displayName": "cruzado brasileño",
                                "displayName-count-one": "cruzado brasileño",
                                "displayName-count-other": "cruzados brasileños",
                                "symbol": "BRC"
                            },
                            "BRE": {
                                "displayName": "cruceiro brasileño (1990–1993)",
                                "displayName-count-one": "cruceiro brasileño (BRE)",
                                "displayName-count-other": "cruceiros brasileños (BRE)",
                                "symbol": "BRE"
                            },
                            "BRL": {
                                "displayName": "real brasileño",
                                "displayName-count-one": "real brasileño",
                                "displayName-count-other": "reales brasileños",
                                "symbol": "BRL",
                                "symbol-alt-narrow": "R$"
                            },
                            "BRN": {
                                "displayName": "nuevo cruzado brasileño",
                                "displayName-count-one": "nuevo cruzado brasileño",
                                "displayName-count-other": "nuevos cruzados brasileños",
                                "symbol": "BRN"
                            },
                            "BRR": {
                                "displayName": "cruceiro brasileño",
                                "displayName-count-one": "cruceiro brasileño",
                                "displayName-count-other": "cruceiros brasileños",
                                "symbol": "BRR"
                            },
                            "BRZ": {
                                "displayName": "BRZ",
                                "symbol": "BRZ"
                            },
                            "BSD": {
                                "displayName": "dólar bahameño",
                                "displayName-count-one": "dólar bahameño",
                                "displayName-count-other": "dólares bahameños",
                                "symbol": "BSD",
                                "symbol-alt-narrow": "$"
                            },
                            "BTN": {
                                "displayName": "gultrum",
                                "displayName-count-one": "gultrum",
                                "displayName-count-other": "gultrums",
                                "symbol": "BTN"
                            },
                            "BUK": {
                                "displayName": "kyat birmano",
                                "displayName-count-one": "kyat birmano",
                                "displayName-count-other": "kyat birmanos",
                                "symbol": "BUK"
                            },
                            "BWP": {
                                "displayName": "pula",
                                "displayName-count-one": "pula",
                                "displayName-count-other": "pulas",
                                "symbol": "BWP",
                                "symbol-alt-narrow": "P"
                            },
                            "BYB": {
                                "displayName": "nuevo rublo bielorruso (1994–1999)",
                                "displayName-count-one": "nuevo rublo bielorruso",
                                "displayName-count-other": "nuevos rublos bielorrusos",
                                "symbol": "BYB"
                            },
                            "BYN": {
                                "displayName": "rublo bielorruso",
                                "displayName-count-one": "rublo bielorruso",
                                "displayName-count-other": "rublos bielorrusos",
                                "symbol": "BYN",
                                "symbol-alt-narrow": "р."
                            },
                            "BYR": {
                                "displayName": "rublo bielorruso (2000–2016)",
                                "displayName-count-one": "rublo bielorruso (2000–2016)",
                                "displayName-count-other": "rublos bielorrusos (2000–2016)",
                                "symbol": "BYR"
                            },
                            "BZD": {
                                "displayName": "dólar beliceño",
                                "displayName-count-one": "dólar beliceño",
                                "displayName-count-other": "dólares beliceños",
                                "symbol": "BZD",
                                "symbol-alt-narrow": "$"
                            },
                            "CAD": {
                                "displayName": "dólar canadiense",
                                "displayName-count-one": "dólar canadiense",
                                "displayName-count-other": "dólares canadienses",
                                "symbol": "CA$",
                                "symbol-alt-narrow": "$"
                            },
                            "CDF": {
                                "displayName": "franco congoleño",
                                "displayName-count-one": "franco congoleño",
                                "displayName-count-other": "francos congoleños",
                                "symbol": "CDF"
                            },
                            "CHE": {
                                "displayName": "euro WIR",
                                "displayName-count-one": "euro WIR",
                                "displayName-count-other": "euros WIR",
                                "symbol": "CHE"
                            },
                            "CHF": {
                                "displayName": "franco suizo",
                                "displayName-count-one": "franco suizo",
                                "displayName-count-other": "francos suizos",
                                "symbol": "CHF"
                            },
                            "CHW": {
                                "displayName": "franco WIR",
                                "displayName-count-one": "franco WIR",
                                "displayName-count-other": "francos WIR",
                                "symbol": "CHW"
                            },
                            "CLE": {
                                "displayName": "CLE",
                                "symbol": "CLE"
                            },
                            "CLF": {
                                "displayName": "unidad de fomento chilena",
                                "displayName-count-one": "unidad de fomento chilena",
                                "displayName-count-other": "unidades de fomento chilenas",
                                "symbol": "CLF"
                            },
                            "CLP": {
                                "displayName": "peso chileno",
                                "displayName-count-one": "peso chileno",
                                "displayName-count-other": "pesos chilenos",
                                "symbol": "CLP",
                                "symbol-alt-narrow": "$"
                            },
                            "CNH": {
                                "displayName": "yuan chino (extracontinental)",
                                "displayName-count-one": "yuan chino (extracontinental)",
                                "displayName-count-other": "yuan chino (extracontinental)",
                                "symbol": "CNH"
                            },
                            "CNX": {
                                "displayName": "CNX",
                                "symbol": "CNX"
                            },
                            "CNY": {
                                "displayName": "yuan",
                                "displayName-count-one": "yuan",
                                "displayName-count-other": "yuanes",
                                "symbol": "CNY",
                                "symbol-alt-narrow": "¥"
                            },
                            "COP": {
                                "displayName": "peso colombiano",
                                "displayName-count-one": "peso colombiano",
                                "displayName-count-other": "pesos colombianos",
                                "symbol": "COP",
                                "symbol-alt-narrow": "$"
                            },
                            "COU": {
                                "displayName": "unidad de valor real colombiana",
                                "displayName-count-one": "unidad de valor real",
                                "displayName-count-other": "unidades de valor reales",
                                "symbol": "COU"
                            },
                            "CRC": {
                                "displayName": "colón costarricense",
                                "displayName-count-one": "colón costarricense",
                                "displayName-count-other": "colones costarricenses",
                                "symbol": "CRC",
                                "symbol-alt-narrow": "₡"
                            },
                            "CSD": {
                                "displayName": "antiguo dinar serbio",
                                "displayName-count-one": "antiguo dinar serbio",
                                "displayName-count-other": "antiguos dinares serbios",
                                "symbol": "CSD"
                            },
                            "CSK": {
                                "displayName": "corona fuerte checoslovaca",
                                "displayName-count-one": "corona fuerte checoslovaca",
                                "displayName-count-other": "coronas fuertes checoslovacas",
                                "symbol": "CSK"
                            },
                            "CUC": {
                                "displayName": "peso cubano convertible",
                                "displayName-count-one": "peso cubano convertible",
                                "displayName-count-other": "pesos cubanos convertibles",
                                "symbol": "CUC",
                                "symbol-alt-narrow": "$"
                            },
                            "CUP": {
                                "displayName": "peso cubano",
                                "displayName-count-one": "peso cubano",
                                "displayName-count-other": "pesos cubanos",
                                "symbol": "CUP",
                                "symbol-alt-narrow": "$"
                            },
                            "CVE": {
                                "displayName": "escudo de Cabo Verde",
                                "displayName-count-one": "escudo de Cabo Verde",
                                "displayName-count-other": "escudos de Cabo Verde",
                                "symbol": "CVE"
                            },
                            "CYP": {
                                "displayName": "libra chipriota",
                                "displayName-count-one": "libra chipriota",
                                "displayName-count-other": "libras chipriotas",
                                "symbol": "CYP"
                            },
                            "CZK": {
                                "displayName": "corona checa",
                                "displayName-count-one": "corona checa",
                                "displayName-count-other": "coronas checas",
                                "symbol": "CZK",
                                "symbol-alt-narrow": "Kč"
                            },
                            "DDM": {
                                "displayName": "ostmark de Alemania del Este",
                                "displayName-count-one": "marco de la República Democrática Alemana",
                                "displayName-count-other": "marcos de la República Democrática Alemana",
                                "symbol": "DDM"
                            },
                            "DEM": {
                                "displayName": "marco alemán",
                                "displayName-count-one": "marco alemán",
                                "displayName-count-other": "marcos alemanes",
                                "symbol": "DEM"
                            },
                            "DJF": {
                                "displayName": "franco yibutiano",
                                "displayName-count-one": "franco yibutiano",
                                "displayName-count-other": "francos yibutianos",
                                "symbol": "DJF"
                            },
                            "DKK": {
                                "displayName": "corona danesa",
                                "displayName-count-one": "corona danesa",
                                "displayName-count-other": "coronas danesas",
                                "symbol": "DKK",
                                "symbol-alt-narrow": "kr"
                            },
                            "DOP": {
                                "displayName": "peso dominicano",
                                "displayName-count-one": "peso dominicano",
                                "displayName-count-other": "pesos dominicanos",
                                "symbol": "DOP",
                                "symbol-alt-narrow": "$"
                            },
                            "DZD": {
                                "displayName": "dinar argelino",
                                "displayName-count-one": "dinar argelino",
                                "displayName-count-other": "dinares argelinos",
                                "symbol": "DZD"
                            },
                            "ECS": {
                                "displayName": "sucre ecuatoriano",
                                "displayName-count-one": "sucre ecuatoriano",
                                "displayName-count-other": "sucres ecuatorianos",
                                "symbol": "ECS"
                            },
                            "ECV": {
                                "displayName": "unidad de valor constante (UVC) ecuatoriana",
                                "displayName-count-one": "unidad de valor constante (UVC) ecuatoriana",
                                "displayName-count-other": "unidades de valor constante (UVC) ecuatorianas",
                                "symbol": "ECV"
                            },
                            "EEK": {
                                "displayName": "corona estonia",
                                "displayName-count-one": "corona estonia",
                                "displayName-count-other": "coronas estonias",
                                "symbol": "EEK"
                            },
                            "EGP": {
                                "displayName": "libra egipcia",
                                "displayName-count-one": "libra egipcia",
                                "displayName-count-other": "libras egipcias",
                                "symbol": "EGP",
                                "symbol-alt-narrow": "EGP"
                            },
                            "ERN": {
                                "displayName": "nakfa",
                                "displayName-count-one": "nakfa",
                                "displayName-count-other": "nakfas",
                                "symbol": "ERN"
                            },
                            "ESA": {
                                "displayName": "peseta española (cuenta A)",
                                "displayName-count-one": "peseta española (cuenta A)",
                                "displayName-count-other": "pesetas españolas (cuenta A)",
                                "symbol": "ESA"
                            },
                            "ESB": {
                                "displayName": "peseta española (cuenta convertible)",
                                "displayName-count-one": "peseta española (cuenta convertible)",
                                "displayName-count-other": "pesetas españolas (cuenta convertible)",
                                "symbol": "ESB"
                            },
                            "ESP": {
                                "displayName": "peseta española",
                                "displayName-count-one": "peseta española",
                                "displayName-count-other": "pesetas españolas",
                                "symbol": "₧",
                                "symbol-alt-narrow": "₧"
                            },
                            "ETB": {
                                "displayName": "bir",
                                "displayName-count-one": "bir",
                                "displayName-count-other": "bires",
                                "symbol": "ETB"
                            },
                            "EUR": {
                                "displayName": "euro",
                                "displayName-count-one": "euro",
                                "displayName-count-other": "euros",
                                "symbol": "€",
                                "symbol-alt-narrow": "€"
                            },
                            "FIM": {
                                "displayName": "marco finlandés",
                                "displayName-count-one": "marco finlandés",
                                "displayName-count-other": "marcos finlandeses",
                                "symbol": "FIM"
                            },
                            "FJD": {
                                "displayName": "dólar fiyiano",
                                "displayName-count-one": "dólar fiyiano",
                                "displayName-count-other": "dólares fiyianos",
                                "symbol": "FJD",
                                "symbol-alt-narrow": "$"
                            },
                            "FKP": {
                                "displayName": "libra malvinense",
                                "displayName-count-one": "libra malvinense",
                                "displayName-count-other": "libras malvinenses",
                                "symbol": "FKP",
                                "symbol-alt-narrow": "£"
                            },
                            "FRF": {
                                "displayName": "franco francés",
                                "displayName-count-one": "franco francés",
                                "displayName-count-other": "francos franceses",
                                "symbol": "FRF"
                            },
                            "GBP": {
                                "displayName": "libra esterlina",
                                "displayName-count-one": "libra esterlina",
                                "displayName-count-other": "libras esterlinas",
                                "symbol": "GBP",
                                "symbol-alt-narrow": "£"
                            },
                            "GEK": {
                                "displayName": "kupon larit georgiano",
                                "symbol": "GEK"
                            },
                            "GEL": {
                                "displayName": "lari",
                                "displayName-count-one": "lari",
                                "displayName-count-other": "laris",
                                "symbol": "GEL",
                                "symbol-alt-narrow": "₾",
                                "symbol-alt-variant": "₾"
                            },
                            "GHC": {
                                "displayName": "cedi ghanés (1979–2007)",
                                "symbol": "GHC"
                            },
                            "GHS": {
                                "displayName": "cedi",
                                "displayName-count-one": "cedi",
                                "displayName-count-other": "cedis",
                                "symbol": "GHS"
                            },
                            "GIP": {
                                "displayName": "libra gibraltareña",
                                "displayName-count-one": "libra gibraltareña",
                                "displayName-count-other": "libras gibraltareñas",
                                "symbol": "GIP",
                                "symbol-alt-narrow": "£"
                            },
                            "GMD": {
                                "displayName": "dalasi",
                                "displayName-count-one": "dalasi",
                                "displayName-count-other": "dalasis",
                                "symbol": "GMD"
                            },
                            "GNF": {
                                "displayName": "franco guineano",
                                "displayName-count-one": "franco guineano",
                                "displayName-count-other": "francos guineanos",
                                "symbol": "GNF",
                                "symbol-alt-narrow": "FG"
                            },
                            "GNS": {
                                "displayName": "syli guineano",
                                "symbol": "GNS"
                            },
                            "GQE": {
                                "displayName": "ekuele de Guinea Ecuatorial",
                                "displayName-count-one": "ekuele de Guinea Ecuatorial",
                                "displayName-count-other": "ekueles de Guinea Ecuatorial",
                                "symbol": "GQE"
                            },
                            "GRD": {
                                "displayName": "dracma griego",
                                "displayName-count-one": "dracma griego",
                                "displayName-count-other": "dracmas griegos",
                                "symbol": "GRD"
                            },
                            "GTQ": {
                                "displayName": "quetzal guatemalteco",
                                "displayName-count-one": "quetzal guatemalteco",
                                "displayName-count-other": "quetzales guatemaltecos",
                                "symbol": "GTQ",
                                "symbol-alt-narrow": "Q"
                            },
                            "GWE": {
                                "displayName": "escudo de Guinea Portuguesa",
                                "symbol": "GWE"
                            },
                            "GWP": {
                                "displayName": "peso de Guinea-Bissáu",
                                "symbol": "GWP"
                            },
                            "GYD": {
                                "displayName": "dólar guyanés",
                                "displayName-count-one": "dólar guyanés",
                                "displayName-count-other": "dólares guyaneses",
                                "symbol": "GYD",
                                "symbol-alt-narrow": "$"
                            },
                            "HKD": {
                                "displayName": "dólar hongkonés",
                                "displayName-count-one": "dólar hongkonés",
                                "displayName-count-other": "dólares hongkoneses",
                                "symbol": "HKD",
                                "symbol-alt-narrow": "$"
                            },
                            "HNL": {
                                "displayName": "lempira hondureño",
                                "displayName-count-one": "lempira hondureño",
                                "displayName-count-other": "lempiras hondureños",
                                "symbol": "HNL",
                                "symbol-alt-narrow": "L"
                            },
                            "HRD": {
                                "displayName": "dinar croata",
                                "displayName-count-one": "dinar croata",
                                "displayName-count-other": "dinares croatas",
                                "symbol": "HRD"
                            },
                            "HRK": {
                                "displayName": "kuna",
                                "displayName-count-one": "kuna",
                                "displayName-count-other": "kunas",
                                "symbol": "HRK",
                                "symbol-alt-narrow": "kn"
                            },
                            "HTG": {
                                "displayName": "gourde haitiano",
                                "displayName-count-one": "gourde haitiano",
                                "displayName-count-other": "gourdes haitianos",
                                "symbol": "HTG"
                            },
                            "HUF": {
                                "displayName": "forinto húngaro",
                                "displayName-count-one": "forinto húngaro",
                                "displayName-count-other": "forintos húngaros",
                                "symbol": "HUF",
                                "symbol-alt-narrow": "Ft"
                            },
                            "IDR": {
                                "displayName": "rupia indonesia",
                                "displayName-count-one": "rupia indonesia",
                                "displayName-count-other": "rupias indonesias",
                                "symbol": "IDR",
                                "symbol-alt-narrow": "Rp"
                            },
                            "IEP": {
                                "displayName": "libra irlandesa",
                                "displayName-count-one": "libra irlandesa",
                                "displayName-count-other": "libras irlandesas",
                                "symbol": "IEP"
                            },
                            "ILP": {
                                "displayName": "libra israelí",
                                "displayName-count-one": "libra israelí",
                                "displayName-count-other": "libras israelíes",
                                "symbol": "ILP"
                            },
                            "ILR": {
                                "displayName": "ILR",
                                "symbol": "ILR"
                            },
                            "ILS": {
                                "displayName": "nuevo séquel israelí",
                                "displayName-count-one": "nuevo séquel israelí",
                                "displayName-count-other": "nuevos séqueles israelíes",
                                "symbol": "ILS",
                                "symbol-alt-narrow": "₪"
                            },
                            "INR": {
                                "displayName": "rupia india",
                                "displayName-count-one": "rupia india",
                                "displayName-count-other": "rupias indias",
                                "symbol": "INR",
                                "symbol-alt-narrow": "₹"
                            },
                            "IQD": {
                                "displayName": "dinar iraquí",
                                "displayName-count-one": "dinar iraquí",
                                "displayName-count-other": "dinares iraquíes",
                                "symbol": "IQD"
                            },
                            "IRR": {
                                "displayName": "rial iraní",
                                "displayName-count-one": "rial iraní",
                                "displayName-count-other": "riales iraníes",
                                "symbol": "IRR"
                            },
                            "ISJ": {
                                "displayName": "ISJ",
                                "symbol": "ISJ"
                            },
                            "ISK": {
                                "displayName": "corona islandesa",
                                "displayName-count-one": "corona islandesa",
                                "displayName-count-other": "coronas islandesas",
                                "symbol": "ISK",
                                "symbol-alt-narrow": "kr"
                            },
                            "ITL": {
                                "displayName": "lira italiana",
                                "displayName-count-one": "lira italiana",
                                "displayName-count-other": "liras italianas",
                                "symbol": "ITL"
                            },
                            "JMD": {
                                "displayName": "dólar jamaicano",
                                "displayName-count-one": "dólar jamaicano",
                                "displayName-count-other": "dólares jamaicanos",
                                "symbol": "JMD",
                                "symbol-alt-narrow": "$"
                            },
                            "JOD": {
                                "displayName": "dinar jordano",
                                "displayName-count-one": "dinar jordano",
                                "displayName-count-other": "dinares jordanos",
                                "symbol": "JOD"
                            },
                            "JPY": {
                                "displayName": "yen",
                                "displayName-count-one": "yen",
                                "displayName-count-other": "yenes",
                                "symbol": "JPY",
                                "symbol-alt-narrow": "¥"
                            },
                            "KES": {
                                "displayName": "chelín keniano",
                                "displayName-count-one": "chelín keniano",
                                "displayName-count-other": "chelines kenianos",
                                "symbol": "KES"
                            },
                            "KGS": {
                                "displayName": "som",
                                "displayName-count-one": "som",
                                "displayName-count-other": "soms",
                                "symbol": "KGS"
                            },
                            "KHR": {
                                "displayName": "riel",
                                "displayName-count-one": "riel",
                                "displayName-count-other": "rieles",
                                "symbol": "KHR",
                                "symbol-alt-narrow": "៛"
                            },
                            "KMF": {
                                "displayName": "franco comorense",
                                "displayName-count-one": "franco comorense",
                                "displayName-count-other": "francos comorenses",
                                "symbol": "KMF",
                                "symbol-alt-narrow": "CF"
                            },
                            "KPW": {
                                "displayName": "won norcoreano",
                                "displayName-count-one": "won norcoreano",
                                "displayName-count-other": "wons norcoreanos",
                                "symbol": "KPW",
                                "symbol-alt-narrow": "₩"
                            },
                            "KRH": {
                                "displayName": "KRH",
                                "symbol": "KRH"
                            },
                            "KRO": {
                                "displayName": "KRO",
                                "symbol": "KRO"
                            },
                            "KRW": {
                                "displayName": "won surcoreano",
                                "displayName-count-one": "won surcoreano",
                                "displayName-count-other": "wons surcoreanos",
                                "symbol": "KRW",
                                "symbol-alt-narrow": "₩"
                            },
                            "KWD": {
                                "displayName": "dinar kuwaití",
                                "displayName-count-one": "dinar kuwaití",
                                "displayName-count-other": "dinares kuwaitíes",
                                "symbol": "KWD"
                            },
                            "KYD": {
                                "displayName": "dólar de las Islas Caimán",
                                "displayName-count-one": "dólar de las Islas Caimán",
                                "displayName-count-other": "dólares de las Islas Caimán",
                                "symbol": "KYD",
                                "symbol-alt-narrow": "$"
                            },
                            "KZT": {
                                "displayName": "tenge kazako",
                                "displayName-count-one": "tenge kazako",
                                "displayName-count-other": "tenges kazakos",
                                "symbol": "KZT",
                                "symbol-alt-narrow": "₸"
                            },
                            "LAK": {
                                "displayName": "kip",
                                "displayName-count-one": "kip",
                                "displayName-count-other": "kips",
                                "symbol": "LAK",
                                "symbol-alt-narrow": "₭"
                            },
                            "LBP": {
                                "displayName": "libra libanesa",
                                "displayName-count-one": "libra libanesa",
                                "displayName-count-other": "libras libanesas",
                                "symbol": "LBP",
                                "symbol-alt-narrow": "L£"
                            },
                            "LKR": {
                                "displayName": "rupia esrilanquesa",
                                "displayName-count-one": "rupia esrilanquesa",
                                "displayName-count-other": "rupias esrilanquesas",
                                "symbol": "LKR",
                                "symbol-alt-narrow": "Rs"
                            },
                            "LRD": {
                                "displayName": "dólar liberiano",
                                "displayName-count-one": "dólar liberiano",
                                "displayName-count-other": "dólares liberianos",
                                "symbol": "LRD",
                                "symbol-alt-narrow": "$"
                            },
                            "LSL": {
                                "displayName": "loti lesothense",
                                "symbol": "LSL"
                            },
                            "LTL": {
                                "displayName": "litas lituano",
                                "displayName-count-one": "litas lituana",
                                "displayName-count-other": "litas lituanas",
                                "symbol": "LTL",
                                "symbol-alt-narrow": "Lt"
                            },
                            "LTT": {
                                "displayName": "talonas lituano",
                                "displayName-count-one": "talonas lituana",
                                "displayName-count-other": "talonas lituanas",
                                "symbol": "LTT"
                            },
                            "LUC": {
                                "displayName": "franco convertible luxemburgués",
                                "displayName-count-one": "franco convertible luxemburgués",
                                "displayName-count-other": "francos convertibles luxemburgueses",
                                "symbol": "LUC"
                            },
                            "LUF": {
                                "displayName": "franco luxemburgués",
                                "displayName-count-one": "franco luxemburgués",
                                "displayName-count-other": "francos luxemburgueses",
                                "symbol": "LUF"
                            },
                            "LUL": {
                                "displayName": "franco financiero luxemburgués",
                                "displayName-count-one": "franco financiero luxemburgués",
                                "displayName-count-other": "francos financieros luxemburgueses",
                                "symbol": "LUL"
                            },
                            "LVL": {
                                "displayName": "lats letón",
                                "displayName-count-one": "lats letón",
                                "displayName-count-other": "lats letónes",
                                "symbol": "LVL",
                                "symbol-alt-narrow": "Ls"
                            },
                            "LVR": {
                                "displayName": "rublo letón",
                                "displayName-count-one": "rublo letón",
                                "displayName-count-other": "rublos letones",
                                "symbol": "LVR"
                            },
                            "LYD": {
                                "displayName": "dinar libio",
                                "displayName-count-one": "dinar libio",
                                "displayName-count-other": "dinares libios",
                                "symbol": "LYD"
                            },
                            "MAD": {
                                "displayName": "dírham marroquí",
                                "displayName-count-one": "dírham marroquí",
                                "displayName-count-other": "dírhams marroquíes",
                                "symbol": "MAD"
                            },
                            "MAF": {
                                "displayName": "franco marroquí",
                                "displayName-count-one": "franco marroquí",
                                "displayName-count-other": "francos marroquíes",
                                "symbol": "MAF"
                            },
                            "MCF": {
                                "displayName": "MCF",
                                "symbol": "MCF"
                            },
                            "MDC": {
                                "displayName": "MDC",
                                "symbol": "MDC"
                            },
                            "MDL": {
                                "displayName": "leu moldavo",
                                "displayName-count-one": "leu moldavo",
                                "displayName-count-other": "lei moldavos",
                                "symbol": "MDL"
                            },
                            "MGA": {
                                "displayName": "ariari",
                                "displayName-count-one": "ariari",
                                "displayName-count-other": "ariaris",
                                "symbol": "MGA",
                                "symbol-alt-narrow": "Ar"
                            },
                            "MGF": {
                                "displayName": "franco malgache",
                                "symbol": "MGF"
                            },
                            "MKD": {
                                "displayName": "dinar macedonio",
                                "displayName-count-one": "dinar macedonio",
                                "displayName-count-other": "dinares macedonios",
                                "symbol": "MKD"
                            },
                            "MKN": {
                                "displayName": "MKN",
                                "symbol": "MKN"
                            },
                            "MLF": {
                                "displayName": "franco malí",
                                "symbol": "MLF"
                            },
                            "MMK": {
                                "displayName": "kiat",
                                "displayName-count-one": "kiat",
                                "displayName-count-other": "kiats",
                                "symbol": "MMK",
                                "symbol-alt-narrow": "K"
                            },
                            "MNT": {
                                "displayName": "tugrik",
                                "displayName-count-one": "tugrik",
                                "displayName-count-other": "tugriks",
                                "symbol": "MNT",
                                "symbol-alt-narrow": "₮"
                            },
                            "MOP": {
                                "displayName": "pataca de Macao",
                                "displayName-count-one": "pataca de Macao",
                                "displayName-count-other": "patacas de Macao",
                                "symbol": "MOP"
                            },
                            "MRO": {
                                "displayName": "uguiya (1973–2017)",
                                "displayName-count-one": "uguiya (1973–2017)",
                                "displayName-count-other": "uguiyas (1973–2017)",
                                "symbol": "MRO"
                            },
                            "MRU": {
                                "displayName": "uguiya",
                                "displayName-count-one": "uguiya",
                                "displayName-count-other": "uguiyas",
                                "symbol": "MRU"
                            },
                            "MTL": {
                                "displayName": "lira maltesa",
                                "displayName-count-one": "lira maltesa",
                                "displayName-count-other": "liras maltesas",
                                "symbol": "MTL"
                            },
                            "MTP": {
                                "displayName": "libra maltesa",
                                "displayName-count-one": "libra maltesa",
                                "displayName-count-other": "libras maltesas",
                                "symbol": "MTP"
                            },
                            "MUR": {
                                "displayName": "rupia mauriciana",
                                "displayName-count-one": "rupia mauriciana",
                                "displayName-count-other": "rupias mauricianas",
                                "symbol": "MUR",
                                "symbol-alt-narrow": "Rs"
                            },
                            "MVP": {
                                "displayName": "MVP",
                                "symbol": "MVP"
                            },
                            "MVR": {
                                "displayName": "rufiya",
                                "displayName-count-one": "rufiya",
                                "displayName-count-other": "rufiyas",
                                "symbol": "MVR"
                            },
                            "MWK": {
                                "displayName": "kuacha malauí",
                                "displayName-count-one": "kuacha malauí",
                                "displayName-count-other": "kuachas malauís",
                                "symbol": "MWK"
                            },
                            "MXN": {
                                "displayName": "peso mexicano",
                                "displayName-count-one": "peso mexicano",
                                "displayName-count-other": "pesos mexicanos",
                                "symbol": "MXN",
                                "symbol-alt-narrow": "$"
                            },
                            "MXP": {
                                "displayName": "peso de plata mexicano (1861–1992)",
                                "displayName-count-one": "peso de plata mexicano (MXP)",
                                "displayName-count-other": "pesos de plata mexicanos (MXP)",
                                "symbol": "MXP"
                            },
                            "MXV": {
                                "displayName": "unidad de inversión (UDI) mexicana",
                                "displayName-count-one": "unidad de inversión (UDI) mexicana",
                                "displayName-count-other": "unidades de inversión (UDI) mexicanas",
                                "symbol": "MXV"
                            },
                            "MYR": {
                                "displayName": "ringit",
                                "displayName-count-one": "ringit",
                                "displayName-count-other": "ringits",
                                "symbol": "MYR",
                                "symbol-alt-narrow": "RM"
                            },
                            "MZE": {
                                "displayName": "escudo mozambiqueño",
                                "displayName-count-one": "escudo mozambiqueño",
                                "displayName-count-other": "escudos mozambiqueños",
                                "symbol": "MZE"
                            },
                            "MZM": {
                                "displayName": "antiguo metical mozambiqueño",
                                "symbol": "MZM"
                            },
                            "MZN": {
                                "displayName": "metical",
                                "displayName-count-one": "metical",
                                "displayName-count-other": "meticales",
                                "symbol": "MZN"
                            },
                            "NAD": {
                                "displayName": "dólar namibio",
                                "displayName-count-one": "dólar namibio",
                                "displayName-count-other": "dólares namibios",
                                "symbol": "NAD",
                                "symbol-alt-narrow": "$"
                            },
                            "NGN": {
                                "displayName": "naira",
                                "displayName-count-one": "naira",
                                "displayName-count-other": "nairas",
                                "symbol": "NGN",
                                "symbol-alt-narrow": "₦"
                            },
                            "NIC": {
                                "displayName": "córdoba nicaragüense (1988–1991)",
                                "displayName-count-one": "córdoba nicaragüense (1988–1991)",
                                "displayName-count-other": "córdobas nicaragüenses (1988–1991)",
                                "symbol": "NIC"
                            },
                            "NIO": {
                                "displayName": "córdoba nicaragüense",
                                "displayName-count-one": "córdoba nicaragüense",
                                "displayName-count-other": "córdobas nicaragüenses",
                                "symbol": "NIO",
                                "symbol-alt-narrow": "C$"
                            },
                            "NLG": {
                                "displayName": "florín neerlandés",
                                "displayName-count-one": "florín neerlandés",
                                "displayName-count-other": "florines neerlandeses",
                                "symbol": "NLG"
                            },
                            "NOK": {
                                "displayName": "corona noruega",
                                "displayName-count-one": "corona noruega",
                                "displayName-count-other": "coronas noruegas",
                                "symbol": "NOK",
                                "symbol-alt-narrow": "kr"
                            },
                            "NPR": {
                                "displayName": "rupia nepalí",
                                "displayName-count-one": "rupia nepalí",
                                "displayName-count-other": "rupias nepalíes",
                                "symbol": "NPR",
                                "symbol-alt-narrow": "Rs"
                            },
                            "NZD": {
                                "displayName": "dólar neozelandés",
                                "displayName-count-one": "dólar neozelandés",
                                "displayName-count-other": "dólares neozelandeses",
                                "symbol": "NZD",
                                "symbol-alt-narrow": "$"
                            },
                            "OMR": {
                                "displayName": "rial omaní",
                                "displayName-count-one": "rial omaní",
                                "displayName-count-other": "riales omaníes",
                                "symbol": "OMR"
                            },
                            "PAB": {
                                "displayName": "balboa panameño",
                                "displayName-count-one": "balboa panameño",
                                "displayName-count-other": "balboas panameños",
                                "symbol": "PAB"
                            },
                            "PEI": {
                                "displayName": "inti peruano",
                                "displayName-count-one": "inti peruano",
                                "displayName-count-other": "intis peruanos",
                                "symbol": "PEI"
                            },
                            "PEN": {
                                "displayName": "sol peruano",
                                "displayName-count-one": "sol peruano",
                                "displayName-count-other": "soles peruanos",
                                "symbol": "PEN"
                            },
                            "PES": {
                                "displayName": "sol peruano (1863–1965)",
                                "displayName-count-one": "sol peruano (1863–1965)",
                                "displayName-count-other": "soles peruanos (1863–1965)",
                                "symbol": "PES"
                            },
                            "PGK": {
                                "displayName": "kina",
                                "displayName-count-one": "kina",
                                "displayName-count-other": "kinas",
                                "symbol": "PGK"
                            },
                            "PHP": {
                                "displayName": "peso filipino",
                                "displayName-count-one": "peso filipino",
                                "displayName-count-other": "pesos filipinos",
                                "symbol": "PHP",
                                "symbol-alt-narrow": "₱"
                            },
                            "PKR": {
                                "displayName": "rupia pakistaní",
                                "displayName-count-one": "rupia pakistaní",
                                "displayName-count-other": "rupias pakistaníes",
                                "symbol": "PKR",
                                "symbol-alt-narrow": "Rs"
                            },
                            "PLN": {
                                "displayName": "esloti",
                                "displayName-count-one": "esloti",
                                "displayName-count-other": "eslotis",
                                "symbol": "PLN",
                                "symbol-alt-narrow": "zł"
                            },
                            "PLZ": {
                                "displayName": "zloty polaco (1950–1995)",
                                "displayName-count-one": "zloty polaco (PLZ)",
                                "displayName-count-other": "zlotys polacos (PLZ)",
                                "symbol": "PLZ"
                            },
                            "PTE": {
                                "displayName": "escudo portugués",
                                "displayName-count-one": "escudo portugués",
                                "displayName-count-other": "escudos portugueses",
                                "symbol": "PTE"
                            },
                            "PYG": {
                                "displayName": "guaraní paraguayo",
                                "displayName-count-one": "guaraní paraguayo",
                                "displayName-count-other": "guaraníes paraguayos",
                                "symbol": "PYG",
                                "symbol-alt-narrow": "₲"
                            },
                            "QAR": {
                                "displayName": "rial catarí",
                                "displayName-count-one": "rial catarí",
                                "displayName-count-other": "riales cataríes",
                                "symbol": "QAR"
                            },
                            "RHD": {
                                "displayName": "dólar rodesiano",
                                "symbol": "RHD"
                            },
                            "ROL": {
                                "displayName": "antiguo leu rumano",
                                "displayName-count-one": "antiguo leu rumano",
                                "displayName-count-other": "antiguos lei rumanos",
                                "symbol": "ROL"
                            },
                            "RON": {
                                "displayName": "leu rumano",
                                "displayName-count-one": "leu rumano",
                                "displayName-count-other": "lei rumanos",
                                "symbol": "RON",
                                "symbol-alt-narrow": "L"
                            },
                            "RSD": {
                                "displayName": "dinar serbio",
                                "displayName-count-one": "dinar serbio",
                                "displayName-count-other": "dinares serbios",
                                "symbol": "RSD"
                            },
                            "RUB": {
                                "displayName": "rublo ruso",
                                "displayName-count-one": "rublo ruso",
                                "displayName-count-other": "rublos rusos",
                                "symbol": "RUB",
                                "symbol-alt-narrow": "₽"
                            },
                            "RUR": {
                                "displayName": "rublo ruso (1991–1998)",
                                "displayName-count-one": "rublo ruso (RUR)",
                                "displayName-count-other": "rublos rusos (RUR)",
                                "symbol": "RUR",
                                "symbol-alt-narrow": "р."
                            },
                            "RWF": {
                                "displayName": "franco ruandés",
                                "displayName-count-one": "franco ruandés",
                                "displayName-count-other": "francos ruandeses",
                                "symbol": "RWF",
                                "symbol-alt-narrow": "RF"
                            },
                            "SAR": {
                                "displayName": "rial saudí",
                                "displayName-count-one": "rial saudí",
                                "displayName-count-other": "riales saudíes",
                                "symbol": "SAR"
                            },
                            "SBD": {
                                "displayName": "dólar salomonense",
                                "displayName-count-one": "dólar salomonense",
                                "displayName-count-other": "dólares salomonenses",
                                "symbol": "SBD",
                                "symbol-alt-narrow": "$"
                            },
                            "SCR": {
                                "displayName": "rupia seychellense",
                                "displayName-count-one": "rupia seychellense",
                                "displayName-count-other": "rupias seychellenses",
                                "symbol": "SCR"
                            },
                            "SDD": {
                                "displayName": "dinar sudanés",
                                "displayName-count-one": "dinar sudanés",
                                "displayName-count-other": "dinares sudaneses",
                                "symbol": "SDD"
                            },
                            "SDG": {
                                "displayName": "libra sudanesa",
                                "displayName-count-one": "libra sudanesa",
                                "displayName-count-other": "libras sudanesas",
                                "symbol": "SDG"
                            },
                            "SDP": {
                                "displayName": "libra sudanesa antigua",
                                "displayName-count-one": "libra sudanesa antigua",
                                "displayName-count-other": "libras sudanesas antiguas",
                                "symbol": "SDP"
                            },
                            "SEK": {
                                "displayName": "corona sueca",
                                "displayName-count-one": "corona sueca",
                                "displayName-count-other": "coronas suecas",
                                "symbol": "SEK",
                                "symbol-alt-narrow": "kr"
                            },
                            "SGD": {
                                "displayName": "dólar singapurense",
                                "displayName-count-one": "dólar singapurense",
                                "displayName-count-other": "dólares singapurenses",
                                "symbol": "SGD",
                                "symbol-alt-narrow": "$"
                            },
                            "SHP": {
                                "displayName": "libra de Santa Elena",
                                "displayName-count-one": "libra de Santa Elena",
                                "displayName-count-other": "libras de Santa Elena",
                                "symbol": "SHP",
                                "symbol-alt-narrow": "£"
                            },
                            "SIT": {
                                "displayName": "tólar esloveno",
                                "displayName-count-one": "tólar esloveno",
                                "displayName-count-other": "tólares eslovenos",
                                "symbol": "SIT"
                            },
                            "SKK": {
                                "displayName": "corona eslovaca",
                                "displayName-count-one": "corona eslovaca",
                                "displayName-count-other": "coronas eslovacas",
                                "symbol": "SKK"
                            },
                            "SLL": {
                                "displayName": "leona",
                                "displayName-count-one": "leona",
                                "displayName-count-other": "leonas",
                                "symbol": "SLL"
                            },
                            "SOS": {
                                "displayName": "chelín somalí",
                                "displayName-count-one": "chelín somalí",
                                "displayName-count-other": "chelines somalíes",
                                "symbol": "SOS"
                            },
                            "SRD": {
                                "displayName": "dólar surinamés",
                                "displayName-count-one": "dólar surinamés",
                                "displayName-count-other": "dólares surinameses",
                                "symbol": "SRD",
                                "symbol-alt-narrow": "$"
                            },
                            "SRG": {
                                "displayName": "florín surinamés",
                                "symbol": "SRG"
                            },
                            "SSP": {
                                "displayName": "libra sursudanesa",
                                "displayName-count-one": "libra sursudanesa",
                                "displayName-count-other": "libras sursudanesas",
                                "symbol": "SSP",
                                "symbol-alt-narrow": "£"
                            },
                            "STD": {
                                "displayName": "dobra (1977–2017)",
                                "displayName-count-one": "dobra (1977–2017)",
                                "displayName-count-other": "dobras (1977–2017)",
                                "symbol": "STD"
                            },
                            "STN": {
                                "displayName": "dobra",
                                "displayName-count-one": "dobra",
                                "displayName-count-other": "dobras",
                                "symbol": "STN",
                                "symbol-alt-narrow": "Db"
                            },
                            "SUR": {
                                "displayName": "rublo soviético",
                                "displayName-count-one": "rublo soviético",
                                "displayName-count-other": "rublos soviéticos",
                                "symbol": "SUR"
                            },
                            "SVC": {
                                "displayName": "colón salvadoreño",
                                "displayName-count-one": "colón salvadoreño",
                                "displayName-count-other": "colones salvadoreños",
                                "symbol": "SVC"
                            },
                            "SYP": {
                                "displayName": "libra siria",
                                "displayName-count-one": "libra siria",
                                "displayName-count-other": "libras sirias",
                                "symbol": "SYP",
                                "symbol-alt-narrow": "£"
                            },
                            "SZL": {
                                "displayName": "lilangeni",
                                "displayName-count-one": "lilangeni",
                                "displayName-count-other": "lilangenis",
                                "symbol": "SZL"
                            },
                            "THB": {
                                "displayName": "bat",
                                "displayName-count-one": "bat",
                                "displayName-count-other": "bats",
                                "symbol": "฿",
                                "symbol-alt-narrow": "฿"
                            },
                            "TJR": {
                                "displayName": "rublo tayiko",
                                "symbol": "TJR"
                            },
                            "TJS": {
                                "displayName": "somoni tayiko",
                                "displayName-count-one": "somoni tayiko",
                                "displayName-count-other": "somonis tayikos",
                                "symbol": "TJS"
                            },
                            "TMM": {
                                "displayName": "manat turcomano (1993–2009)",
                                "displayName-count-one": "manat turcomano (1993–2009)",
                                "displayName-count-other": "manats turcomanos (1993–2009)",
                                "symbol": "TMM"
                            },
                            "TMT": {
                                "displayName": "manat turcomano",
                                "displayName-count-one": "manat turcomano",
                                "displayName-count-other": "manat turcomanos",
                                "symbol": "TMT"
                            },
                            "TND": {
                                "displayName": "dinar tunecino",
                                "displayName-count-one": "dinar tunecino",
                                "displayName-count-other": "dinares tunecinos",
                                "symbol": "TND"
                            },
                            "TOP": {
                                "displayName": "paanga",
                                "displayName-count-one": "paanga",
                                "displayName-count-other": "paangas",
                                "symbol": "TOP",
                                "symbol-alt-narrow": "T$"
                            },
                            "TPE": {
                                "displayName": "escudo timorense",
                                "symbol": "TPE"
                            },
                            "TRL": {
                                "displayName": "lira turca (1922–2005)",
                                "displayName-count-one": "lira turca (1922–2005)",
                                "displayName-count-other": "liras turcas (1922–2005)",
                                "symbol": "TRL"
                            },
                            "TRY": {
                                "displayName": "lira turca",
                                "displayName-count-one": "lira turca",
                                "displayName-count-other": "liras turcas",
                                "symbol": "TRY",
                                "symbol-alt-narrow": "₺",
                                "symbol-alt-variant": "TL"
                            },
                            "TTD": {
                                "displayName": "dólar de Trinidad y Tobago",
                                "displayName-count-one": "dólar de Trinidad y Tobago",
                                "displayName-count-other": "dólares de Trinidad y Tobago",
                                "symbol": "TTD",
                                "symbol-alt-narrow": "$"
                            },
                            "TWD": {
                                "displayName": "nuevo dólar taiwanés",
                                "displayName-count-one": "nuevo dólar taiwanés",
                                "displayName-count-other": "nuevos dólares taiwaneses",
                                "symbol": "TWD",
                                "symbol-alt-narrow": "NT$"
                            },
                            "TZS": {
                                "displayName": "chelín tanzano",
                                "displayName-count-one": "chelín tanzano",
                                "displayName-count-other": "chelines tanzanos",
                                "symbol": "TZS"
                            },
                            "UAH": {
                                "displayName": "grivna",
                                "displayName-count-one": "grivna",
                                "displayName-count-other": "grivnas",
                                "symbol": "UAH",
                                "symbol-alt-narrow": "₴"
                            },
                            "UAK": {
                                "displayName": "karbovanet ucraniano",
                                "displayName-count-one": "karbovanet ucraniano",
                                "displayName-count-other": "karbovanets ucranianos",
                                "symbol": "UAK"
                            },
                            "UGS": {
                                "displayName": "chelín ugandés (1966–1987)",
                                "symbol": "UGS"
                            },
                            "UGX": {
                                "displayName": "chelín ugandés",
                                "displayName-count-one": "chelín ugandés",
                                "displayName-count-other": "chelines ugandeses",
                                "symbol": "UGX"
                            },
                            "USD": {
                                "displayName": "dólar estadounidense",
                                "displayName-count-one": "dólar estadounidense",
                                "displayName-count-other": "dólares estadounidenses",
                                "symbol": "US$",
                                "symbol-alt-narrow": "$"
                            },
                            "USN": {
                                "displayName": "dólar estadounidense (día siguiente)",
                                "displayName-count-one": "dólar estadounidense (día siguiente)",
                                "displayName-count-other": "dólares estadounidenses (día siguiente)",
                                "symbol": "USN"
                            },
                            "USS": {
                                "displayName": "dólar estadounidense (mismo día)",
                                "displayName-count-one": "dólar estadounidense (mismo día)",
                                "displayName-count-other": "dólares estadounidenses (mismo día)",
                                "symbol": "USS"
                            },
                            "UYI": {
                                "displayName": "peso uruguayo en unidades indexadas",
                                "displayName-count-one": "peso uruguayo en unidades indexadas",
                                "displayName-count-other": "pesos uruguayos en unidades indexadas",
                                "symbol": "UYI"
                            },
                            "UYP": {
                                "displayName": "peso uruguayo (1975–1993)",
                                "displayName-count-one": "peso uruguayo (UYP)",
                                "displayName-count-other": "pesos uruguayos (UYP)",
                                "symbol": "UYP"
                            },
                            "UYU": {
                                "displayName": "peso uruguayo",
                                "displayName-count-one": "peso uruguayo",
                                "displayName-count-other": "pesos uruguayos",
                                "symbol": "UYU",
                                "symbol-alt-narrow": "$"
                            },
                            "UYW": {
                                "displayName": "unidad previsional uruguayo",
                                "displayName-count-one": "unidad previsional uruguayo",
                                "displayName-count-other": "unidades previsionales uruguayos",
                                "symbol": "UYW"
                            },
                            "UZS": {
                                "displayName": "sum",
                                "displayName-count-one": "sum",
                                "displayName-count-other": "sums",
                                "symbol": "UZS"
                            },
                            "VEB": {
                                "displayName": "bolívar venezolano (1871–2008)",
                                "displayName-count-one": "bolívar venezolano (1871–2008)",
                                "displayName-count-other": "bolívares venezolanos (1871–2008)",
                                "symbol": "VEB"
                            },
                            "VEF": {
                                "displayName": "bolívar venezolano (2008–2018)",
                                "displayName-count-one": "bolívar venezolano (2008–2018)",
                                "displayName-count-other": "bolívares venezolanos (2008–2018)",
                                "symbol": "VEF",
                                "symbol-alt-narrow": "Bs"
                            },
                            "VES": {
                                "displayName": "bolívar venezolano",
                                "displayName-count-one": "bolívar venezolano",
                                "displayName-count-other": "bolívares venezolanos",
                                "symbol": "VES"
                            },
                            "VND": {
                                "displayName": "dong",
                                "displayName-count-one": "dong",
                                "displayName-count-other": "dongs",
                                "symbol": "₫",
                                "symbol-alt-narrow": "₫"
                            },
                            "VNN": {
                                "displayName": "VNN",
                                "symbol": "VNN"
                            },
                            "VUV": {
                                "displayName": "vatu",
                                "displayName-count-one": "vatu",
                                "displayName-count-other": "vatus",
                                "symbol": "VUV"
                            },
                            "WST": {
                                "displayName": "tala",
                                "displayName-count-one": "tala",
                                "displayName-count-other": "talas",
                                "symbol": "WST"
                            },
                            "XAF": {
                                "displayName": "franco CFA de África Central",
                                "displayName-count-one": "franco CFA de África Central",
                                "displayName-count-other": "francos CFA de África Central",
                                "symbol": "XAF"
                            },
                            "XAG": {
                                "displayName": "plata",
                                "displayName-count-one": "plata",
                                "displayName-count-other": "plata",
                                "symbol": "XAG"
                            },
                            "XAU": {
                                "displayName": "oro",
                                "displayName-count-one": "oro",
                                "displayName-count-other": "oro",
                                "symbol": "XAU"
                            },
                            "XBA": {
                                "displayName": "unidad compuesta europea",
                                "displayName-count-one": "unidad compuesta europea",
                                "displayName-count-other": "unidades compuestas europeas",
                                "symbol": "XBA"
                            },
                            "XBB": {
                                "displayName": "unidad monetaria europea",
                                "displayName-count-one": "unidad monetaria europea",
                                "displayName-count-other": "unidades monetarias europeas",
                                "symbol": "XBB"
                            },
                            "XBC": {
                                "displayName": "unidad de cuenta europea (XBC)",
                                "displayName-count-one": "unidad de cuenta europea (XBC)",
                                "displayName-count-other": "unidades de cuenta europeas (XBC)",
                                "symbol": "XBC"
                            },
                            "XBD": {
                                "displayName": "unidad de cuenta europea (XBD)",
                                "displayName-count-one": "unidad de cuenta europea (XBD)",
                                "displayName-count-other": "unidades de cuenta europeas (XBD)",
                                "symbol": "XBD"
                            },
                            "XCD": {
                                "displayName": "dólar del Caribe Oriental",
                                "displayName-count-one": "dólar del Caribe Oriental",
                                "displayName-count-other": "dólares del Caribe Oriental",
                                "symbol": "XCD",
                                "symbol-alt-narrow": "$"
                            },
                            "XDR": {
                                "displayName": "derechos especiales de giro",
                                "symbol": "XDR"
                            },
                            "XEU": {
                                "displayName": "unidad de moneda europea",
                                "displayName-count-one": "unidad de moneda europea",
                                "displayName-count-other": "unidades de moneda europeas",
                                "symbol": "XEU"
                            },
                            "XFO": {
                                "displayName": "franco oro francés",
                                "displayName-count-one": "franco oro francés",
                                "displayName-count-other": "francos oro franceses",
                                "symbol": "XFO"
                            },
                            "XFU": {
                                "displayName": "franco UIC francés",
                                "displayName-count-one": "franco UIC francés",
                                "displayName-count-other": "francos UIC franceses",
                                "symbol": "XFU"
                            },
                            "XOF": {
                                "displayName": "franco CFA de África Occidental",
                                "displayName-count-one": "franco CFA de África Occidental",
                                "displayName-count-other": "francos CFA de África Occidental",
                                "symbol": "XOF"
                            },
                            "XPD": {
                                "displayName": "paladio",
                                "displayName-count-one": "paladio",
                                "displayName-count-other": "paladio",
                                "symbol": "XPD"
                            },
                            "XPF": {
                                "displayName": "franco CFP",
                                "displayName-count-one": "franco CFP",
                                "displayName-count-other": "francos CFP",
                                "symbol": "CFPF"
                            },
                            "XPT": {
                                "displayName": "platino",
                                "displayName-count-one": "platino",
                                "displayName-count-other": "platino",
                                "symbol": "XPT"
                            },
                            "XRE": {
                                "displayName": "fondos RINET",
                                "symbol": "XRE"
                            },
                            "XSU": {
                                "displayName": "XSU",
                                "symbol": "XSU"
                            },
                            "XTS": {
                                "displayName": "código reservado para pruebas",
                                "symbol": "XTS"
                            },
                            "XUA": {
                                "displayName": "XUA",
                                "symbol": "XUA"
                            },
                            "XXX": {
                                "displayName": "moneda desconocida",
                                "displayName-count-one": "(moneda desconocida)",
                                "displayName-count-other": "(moneda desconocida)",
                                "symbol": "¤"
                            },
                            "YDD": {
                                "displayName": "dinar yemení",
                                "symbol": "YDD"
                            },
                            "YER": {
                                "displayName": "rial yemení",
                                "displayName-count-one": "rial yemení",
                                "displayName-count-other": "riales yemeníes",
                                "symbol": "YER"
                            },
                            "YUD": {
                                "displayName": "dinar fuerte yugoslavo",
                                "symbol": "YUD"
                            },
                            "YUM": {
                                "displayName": "super dinar yugoslavo",
                                "symbol": "YUM"
                            },
                            "YUN": {
                                "displayName": "dinar convertible yugoslavo",
                                "displayName-count-one": "dinar convertible yugoslavo",
                                "displayName-count-other": "dinares convertibles yugoslavos",
                                "symbol": "YUN"
                            },
                            "YUR": {
                                "displayName": "YUR",
                                "symbol": "YUR"
                            },
                            "ZAL": {
                                "displayName": "rand sudafricano (financiero)",
                                "symbol": "ZAL"
                            },
                            "ZAR": {
                                "displayName": "rand",
                                "displayName-count-one": "rand",
                                "displayName-count-other": "rands",
                                "symbol": "ZAR",
                                "symbol-alt-narrow": "R"
                            },
                            "ZMK": {
                                "displayName": "kwacha zambiano (1968–2012)",
                                "displayName-count-one": "kwacha zambiano (1968–2012)",
                                "displayName-count-other": "kwachas zambianos (1968–2012)",
                                "symbol": "ZMK"
                            },
                            "ZMW": {
                                "displayName": "kuacha zambiano",
                                "displayName-count-one": "kuacha zambiano",
                                "displayName-count-other": "kuachas zambianos",
                                "symbol": "ZMW",
                                "symbol-alt-narrow": "ZK"
                            },
                            "ZRN": {
                                "displayName": "nuevo zaire zaireño",
                                "symbol": "ZRN"
                            },
                            "ZRZ": {
                                "displayName": "zaire zaireño",
                                "symbol": "ZRZ"
                            },
                            "ZWD": {
                                "displayName": "dólar de Zimbabue",
                                "symbol": "ZWD"
                            },
                            "ZWL": {
                                "displayName": "dólar zimbabuense",
                                "symbol": "ZWL"
                            },
                            "ZWR": {
                                "displayName": "ZWR",
                                "symbol": "ZWR"
                            }
                        },
                        "currencyFormats-numberSystem-latn": {
                            "currencySpacing": {
                                "beforeCurrency": {
                                    "currencyMatch": "[:^S:]",
                                    "surroundingMatch": "[:digit:]",
                                    "insertBetween": " "
                                },
                                "afterCurrency": {
                                    "currencyMatch": "[:^S:]",
                                    "surroundingMatch": "[:digit:]",
                                    "insertBetween": " "
                                }
                            },
                            "standard": "#,##0.00 ¤",
                            "accounting": "#,##0.00 ¤",
                            "short": {
                                "standard": {
                                    "1000-count-one": "0 mil ¤",
                                    "1000-count-other": "0 mil ¤",
                                    "10000-count-one": "00 mil ¤",
                                    "10000-count-other": "00 mil ¤",
                                    "100000-count-one": "000 mil ¤",
                                    "100000-count-other": "000 mil ¤",
                                    "1000000-count-one": "0 M¤",
                                    "1000000-count-other": "0 M¤",
                                    "10000000-count-one": "00 M¤",
                                    "10000000-count-other": "00 M¤",
                                    "100000000-count-one": "000 M¤",
                                    "100000000-count-other": "000 M¤",
                                    "1000000000-count-one": "0000 M¤",
                                    "1000000000-count-other": "0000 M¤",
                                    "10000000000-count-one": "00 mil M¤",
                                    "10000000000-count-other": "00 mil M¤",
                                    "100000000000-count-one": "000 mil M¤",
                                    "100000000000-count-other": "000 mil M¤",
                                    "1000000000000-count-one": "0 B¤",
                                    "1000000000000-count-other": "0 B¤",
                                    "10000000000000-count-one": "00 B¤",
                                    "10000000000000-count-other": "00 B¤",
                                    "100000000000000-count-one": "000 B¤",
                                    "100000000000000-count-other": "000 B¤"
                                }
                            },
                            "unitPattern-count-one": "{0} {1}",
                            "unitPattern-count-other": "{0} {1}"
                        },
                        "miscPatterns-numberSystem-latn": {
                            "approximately": "~{0}",
                            "atLeast": "Más de {0}",
                            "atMost": "≤{0}",
                            "range": "{0}-{1}"
                        },
                        "minimalPairs": {
                            "pluralMinimalPairs-count-one": "{0} día",
                            "pluralMinimalPairs-count-other": "{0} días",
                            "other": "Toma la {0}.ª a la derecha."
                        }
                    }
                },
            }
        });
        setCulture('es');
        setCurrencyCode('UYU');
    }
}

export { mvdInitializeModule, setComponentsCulture, showConfirmDialog, showToast, SHOW_TOAST_TYPES }