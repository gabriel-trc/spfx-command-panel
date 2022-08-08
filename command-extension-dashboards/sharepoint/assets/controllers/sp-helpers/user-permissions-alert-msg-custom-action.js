if (location.href.toLowerCase().indexOf('/_layouts/15/user.aspx') >= 0) {
  const listParam = location.href.toLowerCase().match(/list=([^&]*)/)
  if (!listParam || listParam[1] === '') {
    document.addEventListener('DOMContentLoaded', function () {
      SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function () {
        const permsBtn = document.getElementById('Ribbon.Permission.Modify.RemovePerms-Large');

        (function WaitUntilEventExists() {
          if (permsBtn._events && permsBtn._events.click[0]) {
            MsgPerms()
          } else {
            setTimeout(WaitUntilEventExists, 50)
          }
        })()

        function MsgPerms() {
          const oldOnClick = permsBtn._events.click[0].browserHandler
          permsBtn.removeEventListener('click', oldOnClick)
          permsBtn.onclick = permsDialog

          function permsDialog(event) {
            if (this.getAttribute('aria-disabled') === 'true') {
              return false
            } else {
              const htmltag = document.createElement('div')
              const style = document.createElement('style')
              const text = document.createElement('p')
              const img1 = document.createElement('img')
              const img2 = document.createElement('img')
              const btnOk = document.createElement('button')
              const btnCancel = document.createElement('button')
              style.innerHTML = '.ms-dlgFrameContainer {height: calc(100% - 80px)}'
              htmltag.appendChild(style)
              text.style.textAling = 'justify'
              text.innerHTML =
                'Atención!!! Está a punto de eliminar a las personas y grupos seleccionados de todas las listas y bibliotecas donde le haya asignado permisos. ' +
                'Sugerimos utilizar el botón de Editar Permisos de usuario y editar una sola persona o grupo a la vez dejando únicamente Acceso limitado para no eliminar sus permisos particulares. ' +
                '¿Está seguro de continuar con la eliminación?'
              htmltag.appendChild(text)
              img1.src = MVD.resolveURL({ key: 'images/user-permissions-1', type: MVD.versionsTypes.IMG })
              img2.src = MVD.resolveURL({ key: 'images/user-permissions-2', type: MVD.versionsTypes.IMG })
              img1.style.width = '100%'
              img2.style.width = '100%'
              img2.style.marginTop = '10px'
              htmltag.appendChild(img1)
              htmltag.appendChild(img2)
              btnOk.onclick = dialogOk
              btnOk.id = 'btnOk'
              btnOk.innerHTML = 'Continuar'
              btnOk.style.position = 'relative'
              btnOk.style.right = '-734px'
              btnCancel.onclick = dialogClose
              btnCancel.id = 'btnCancel'
              btnCancel.innerHTML = 'Cancelar'
              btnCancel.style.position = 'relative'
              btnCancel.style.right = '-734px'
              htmltag.appendChild(btnOk)
              htmltag.appendChild(btnCancel)

              const options = SP.UI.$create_DialogOptions()
              options.title = 'Atención!!!'
              options.width = 900
              options.height = 800
              options.showClose = true
              options.html = htmltag
              options.dialogReturnValueCallback = Function.createDelegate(null, function (result) {
                if (result == SP.UI.DialogResult.OK) oldOnClick(event)
              })
              SP.UI.ModalDialog.showModalDialog(options)
            }
          }
          function dialogOk() {
            SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK)
          }
          function dialogClose() {
            SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.Cancel)
          }
        }
      })
    })
  }
}