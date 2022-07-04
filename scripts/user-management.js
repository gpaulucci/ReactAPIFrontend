
const userWinModal = new bootstrap.Modal(document.getElementById('modalUserWin'));
/* var container = document.querySelector('tbody');
var modalUserForm = new bootstrap.Modal(document.getElementById('formUsuarios'));
let resutlados = '';
const userFormModal = document.querySelector('form');
const usrFormFirstName = document.getElementById('usrFormFirstName');
const usrFormLastName = document.getElementById('usrFormLastName');
const usrFormAlias = document.getElementById('usrFormAlias');
const usrFormEmail = document.getElementById('usrFormEmail');
const usrFormPassword = document.getElementById('usrFormPassword');
const usrFormPassword2 = document.getElementById('usrFormPassword2');
const usrFormRole = document.getElementById('usrFormRole'); */

let option = '';
let pwdChanged = false;

/* 
btnNewUser.addEventListener('click', ()=> {
  usrFormFirstName.value = '';
  usrFormLastName.value = '';
  usrFormAlias.value = '';
  usrFormEmail.value = '';
  usrFormPassword.value = '';
  usrFormPassword2.value = '';
  usrFormRole.value = 0;
  userWinModal.show();
  option = 'create';
})  */

document.querySelector('.menu-item-applicant').addEventListener('click', (e) => {

  var element = document.getElementById('kt_modal_app_mng');
  element.classList.toggle("show");
});

$(document).ready(function(){
  if(!window.sessionStorage.getItem('APIToken') || window.sessionStorage.getItem('APIToken') == null || window.sessionStorage.getItem('APIToken') == "null"  ) {
    location.href = 'index.html';
  } else {
    document.getElementById("LoginName").innerHTML = window.sessionStorage.getItem('APIName');
    if(window.sessionStorage.getItem('APIUserRole')!='Administrador') {
      document.getElementById('UserMnuOption').classList.add("d-none");
      document.getElementById('ApplicantAdminMnuOption').classList.add("d-none");
    }
    //$.fn.dataTableExt.sErrMode = 'throw'; 
    usersTable = $("#usersTable").DataTable({
      processing: true,
      "ajax":{
        url: window.sessionStorage.getItem('APIServer') + "User",
        dataSrc: "data",
        dataType: "json",
        cache: false,
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
        }
      },
      "columnDefs":[{
        "targets":-1,
        "data":null,
        //"defaultContent":"<div class='text-center'><div class='btn-group'><a href='#' data-bs-toggle='modal' data-bs-target='#kt_modal_edit_user' class='menu-link px-3'>&nbsp;&nbsp;Editar</a>&nbsp;<a href='#' data-bs-toggle='modal' data-bs-target='#kt_modal_edit_user' class='menu-link px-3'>Borrar</a></div></div>"
        //"defaultContent":"<div class='btn-group'><a href='#' data-bs-toggle='modal' data-bs-target='#kt_modal_edit_user' class='menu-link px-3'>&nbsp;&nbsp;Editar</a>&nbsp;<a href='#' id='btnBorrar' data-bs-toggle='modal' data-bs-target='#kt_modal_delete_user' class='btnBorrar menu-link px-3'>Borrar</a></div>"
        "defaultContent":"<a href='#' class='btnEditar menu-link px-3'>&nbsp;&nbsp;Editar</a>&nbsp;<a href='#' id='btnBorrar' class='btnBorrar menu-link px-3'>Borrar</a>"
      }],
      "language":{
        "lengthMenu":"Mostrar _MENU_ registros",
        "zeroRecords":"No se han encontrado registros.",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros ",
        "infoFiltered": "(filtrado de un total de _MAX_ registros",
        "sSearch": "Buscar",
        "oPaginate": {
          "sFirst": "Primero",
          "sLast": "Último",
          "sNext": "Siguiente",
          "sPrevious": "Anterior"
        }
        ,"sProcessing": "<h2 class='mt-2 bg-white'>Procesando...</h2>",
      },
      "columns": [
        {"data": "id", className: "d-none d-xs-none", orderable: false},
        { data: null, render: function ( data, type, row ) {
          return data.firstName+' '+data.lastName;
        } },
        {"data": "email"},
        {"data": "role"},
        {"data": null, className: "dt-center editor-edit", orderable: false}
      ],
      responsive: true,
      autoWidth: true,
      searching: true
    });
    $(".page-loader").css("display", "none");
  }
});

$("#btnNewUser").click(function(){

  $("#formUsuarios").trigger("reset");
  $(".modal-header").css("background-color", "white");
  $(".modal-title").text("Crear un nuevo usuario.");

  option = 'create';
  //$("#modalUserForm").modal("show");
});

clickLogout = (e) => {
  window.sessionStorage.setItem('APIToken', null);
  window.sessionStorage.setItem('APIName', null);
  location.href = 'index.html';
}

const on = (element, event, selector, handler) => {
  element.addEventListener(event, e => {
    if(e.target.closest(selector)){
      handler(e);
    }
  })
}

// procedimiento de borrado de usuario seleccionado
on(document, 'click', '.btnBorrar', e => {
  const selectedRow = e.target.parentNode.parentNode;

  const id = selectedRow.children[0].innerHTML;

  $(".page-loader").css("display", "flex");

  alertify.defaults.glossary.title = 'Confirmación borrado de usuario';
  alertify.defaults.glossary.ok = 'Confirmar';
  alertify.defaults.glossary.cancel = 'Cancelar';
  alertify.confirm("Por favor, confirme la eliminación del usuario " + selectedRow.children[1].innerHTML + '.',
  function(){
    fetch(window.sessionStorage.getItem('APIServer') + "User/" + id, {
      method: 'DELETE',
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
      }
    })
    .then( res => {
      if(!res.ok) throw Error(res.status)
      res.json()
    })
    .then(() => {
      location.reload();
      $(".page-loader").css("display", "none");
      alertify.success('El usuario ha sido eliminado.');
    })
    .catch(error => {
      alertify.defaults.glossary.title = 'Error';
      alertify.defaults.glossary.ok = 'Ok';    
      alertify.alert("La operación no pudo completarse. El servidor no pudo responder a la solicitud. (Mensaje del servidor: " + error.message + ")", function(){
        alertify.message('OK');
      });
      console.log(error)
      $(".page-loader").css("display", "none");
    });
  },
  function(){
    alertify.error('Operación cancelada');
  });
})

// procedimiento de editar el usuario seleccionado
let idForm = 0;

on(document, 'click', '.btnEditar', e => {
  const selectedRow = e.target.parentNode.parentNode;
  idForm = selectedRow.children[0].innerHTML;
  pwdChanged = false;

  $(".page-loader").css("display", "flex");

  fetch(window.sessionStorage.getItem('APIServer') + "User/" + idForm, {
    method: 'GET',
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
    }
  })
  .then( res => res.json())
  .then((retJson) => {
    usrFormFirstName.value = retJson.data.firstName;
    usrFormLastName.value = retJson.data.lastName;
    usrFormEmail.value = retJson.data.email;
    usrFormPasswordSet.value = retJson.data.password;
    usrFormAlias.value = retJson.data.alias;
    usrFormPassword.value = '********';
    usrFormPassword2.value = '********';
    switch (retJson.data.role) {
      case 'Administrador':
        usrFormRole.value = 1;
        break;
      case 'Reclutador':
        usrFormRole.value = 2;
        break;
      default:
        usrFormRole.value = 0;
    }
    $(".page-loader").css("display", "none");
    userWinModal.show();
  })
  .catch(error => {
    $(".page-loader").css("display", "none");
    alertify.defaults.glossary.title = 'Error';
    alertify.defaults.glossary.ok = 'Ok';    

    if(error.status == 404) {
        alertify.alert("El usuario no pudo encontrarse.", function(){
          alertify.message('OK');
        })
    } else {
      alertify.alert("La operación no pudo completarse. El servidor no pudo responder a la solicitud. (Mensaje del servidor: " + error.message + ")", function(){
        alertify.message('OK');
      });
    }
      
    console.log(error)
  });

  option = 'edit';
})

$("#usrFormPassword").change(function(){
  pwdChanged = true;
});

// procedimiento para crear y editar el usuario seleccionado
formUsuarios.addEventListener('submit', (e) => {
  $(".page-loader").css("display", "flex");
  e.preventDefault();
  var setRole = 'Reclutador';
  var pwdToSet = '';
  switch (usrFormRole.value) {
    case '1':
      setRole = 'Administrador';
      break;
    case '2':
      setRole = 'Reclutador';
      break;
    default:
      setRole = 'Reclutador';
  }

  if (pwdChanged == true) 
    pwdToSet = usrFormPassword.value;
  else
    pwdToSet = usrFormPasswordSet.value;

  if(option == 'create') {
    fetch(window.sessionStorage.getItem('APIServer') + "User/", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
      },
      body: JSON.stringify({
          alias: usrFormAlias.value,
          firstName: usrFormFirstName.value,
          lastName: usrFormLastName.value,
          password: pwdToSet,
          email: usrFormEmail.value,
          role: setRole
      })
    })
    .then(response => response.json())
    .then(data => {
      /*const newUser = [];
      newUser.push(data);*/
      $(".page-loader").css("display", "none");
      location.reload();
    })
    .catch(error => {
      alertify.defaults.glossary.title = 'Error';
      alertify.defaults.glossary.ok = 'Ok';    

      if(error.status == 404) {
          alertify.alert("El usuario no pudo encontrarse", function(){
            alertify.message('OK');
          })
      } else {
        alertify.alert("La operación no pudo completarse. El servidor no pudo responder a la solicitud. (Mensaje del servidor: " + error.message + ")", function(){
          alertify.message('OK');
        });
      }
        
      console.log(error)
      $(".page-loader").css("display", "none");
    });
  }
  if(option == 'edit') {
    fetch(window.sessionStorage.getItem('APIServer') + "User/?id=" + idForm + "&updPwd=" + pwdChanged.toString(), {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
      },
      body: JSON.stringify({
          alias: usrFormAlias.value,
          firstName: usrFormFirstName.value,
          lastName: usrFormLastName.value,
          password: pwdToSet,
          email: usrFormEmail.value,
          role: setRole
      })
    })
    .then(response => response.json())
    .then(data => {
      /*const newUser = [];
      newUser.push(data);*/
      location.reload();
      $(".page-loader").css("display", "none");
    })
    .catch(error => {
      alertify.defaults.glossary.title = 'Error';
      alertify.defaults.glossary.ok = 'Ok';    

      if(error.status == 404) {
          alertify.alert("El usuario y/o clave ingresados no son válidos, por favor valídelos y vuelva a intentar", function(){
            alertify.message('OK');
          })
      } else {
        alertify.alert("La operación no pudo completarse. El servidor no pudo responder a la solicitud. (Mensaje del servidor: " + error.message + ")", function(){
          alertify.message('OK');
        });
      }
        
      console.log(error)
      $(".page-loader").css("display", "none");
    });

  }
  userWinModal.hide();
})