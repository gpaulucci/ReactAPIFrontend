
const applicantWinModal = new bootstrap.Modal(document.getElementById('modalApplicantWin'));
/* var container = document.querySelector('tbody');
var modalApplicantForm = new bootstrap.Modal(document.getElementById('formCandidatos'));
let resutlados = '';
const applicantFormModal = document.querySelector('form');
const appFormFirstName = document.getElementById('appFormFirstName');
const appFormLastName = document.getElementById('appFormLastName');
const appFormAlias = document.getElementById('appFormAlias');
const appFormEmail = document.getElementById('appFormEmail');
const appFormPassword = document.getElementById('appFormPassword');
const appFormPassword2 = document.getElementById('appFormPassword2');
const appFormRole = document.getElementById('appFormRole'); */

let option = '';
let pwdChanged = false;

/* 
btnNewApplicant.addEventListener('click', ()=> {
  appFormFirstName.value = '';
  appFormLastName.value = '';
  appFormAlias.value = '';
  appFormEmail.value = '';
  appFormPassword.value = '';
  appFormPassword2.value = '';
  appFormRole.value = 0;
  applicantWinModal.show();
  option = 'create';
})  */

$(document).ready(function(){
  if(!window.sessionStorage.getItem('APIToken') || window.sessionStorage.getItem('APIToken') == null || window.sessionStorage.getItem('APIToken') == "null"  ) {
    location.href = 'index.html';
  } else {
    document.getElementById("LoginName").innerHTML = window.sessionStorage.getItem('APIName');

    applicantsTable = $("#applicantsTable").DataTable({
      processing: true,
      "ajax":{
        url: window.sessionStorage.getItem('APIServer') + "Applicant",
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
        //"defaultContent":"<div class='text-center'><div class='btn-group'><a href='#' data-bs-toggle='modal' data-bs-target='#kt_modal_edit_applicant' class='menu-link px-3'>&nbsp;&nbsp;Editar</a>&nbsp;<a href='#' data-bs-toggle='modal' data-bs-target='#kt_modal_edit_applicant' class='menu-link px-3'>Borrar</a></div></div>"
        //"defaultContent":"<div class='btn-group'><a href='#' data-bs-toggle='modal' data-bs-target='#kt_modal_edit_applicant' class='menu-link px-3'>&nbsp;&nbsp;Editar</a>&nbsp;<a href='#' id='btnBorrar' data-bs-toggle='modal' data-bs-target='#kt_modal_delete_applicant' class='btnBorrar menu-link px-3'>Borrar</a></div>"
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
        {"data": "profile"},
        {"data": "keywords"},
        {"data": null, className: "dt-center editor-edit", orderable: false}
      ],
      responsive: true,
      autoWidth: true,
      searching: true
    });
    $(".page-loader").css("display", "none");
  }
});

$("#btnNewApplicant").click(function(){

  $("#formCandidatos").trigger("reset");
  $(".modal-header").css("background-color", "white");
  $(".modal-title").text("Crear un nuevo candidato.");

  option = 'create';
  //$("#modalApplicantForm").modal("show");
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

// procedimiento de borrado de candidato seleccionado
on(document, 'click', '.btnBorrar', e => {
  const selectedRow = e.target.parentNode.parentNode;

  const id = selectedRow.children[0].innerHTML;

  $(".page-loader").css("display", "flex");

  alertify.defaults.glossary.title = 'Confirmación borrado de candidato';
  alertify.defaults.glossary.ok = 'Confirmar';
  alertify.defaults.glossary.cancel = 'Cancelar';
  alertify.confirm("Por favor, confirme la eliminación del candidato " + selectedRow.children[1].innerHTML + '.',
  function(){
    fetch(window.sessionStorage.getItem('APIServer') + "Applicant/" + id, {
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
      alertify.success('El candidato ha sido eliminado.');
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

// procedimiento de editar el candidato seleccionado
let idForm = 0;

on(document, 'click', '.btnEditar', e => {
  const selectedRow = e.target.parentNode.parentNode;
  idForm = selectedRow.children[0].innerHTML;
  pwdChanged = false;

  $(".page-loader").css("display", "flex");

  fetch(window.sessionStorage.getItem('APIServer') + "Applicant/" + idForm, {
    method: 'GET',
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
    }
  })
  .then( res => res.json())
  .then((retJson) => {
    appFormFirstName.value = retJson.data.firstName;
    appFormLastName.value = retJson.data.lastName;
    appFormEmail.value = retJson.data.email;
    appFormProfile.value = retJson.data.profile;
    appFormKeywords.value = retJson.data.keywords;
    appFormCVDescription.value = retJson.data.cv_Description;
    appFormRating.value = retJson.data.ranking;



    $(".page-loader").css("display", "none");
    applicantWinModal.show();

    star5.checked = false;
    star4.checked = false;
    star3.checked = false;
    star2.checked = false;
    star1.checked = false;

    if (appFormRating.value == "1") star1.checked = true;
    if (appFormRating.value == "2") star2.checked = true;
    if (appFormRating.value == "3") star3.checked = true;
    if (appFormRating.value == "4") star4.checked = true;
    if (appFormRating.value == "5") star5.checked = true;

  })
  .catch(error => {
    $(".page-loader").css("display", "none");
    alertify.defaults.glossary.title = 'Error';
    alertify.defaults.glossary.ok = 'Ok';    

    if(error.status == 404) {
        alertify.alert("El candidato no pudo encontrarse.", function(){
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

$("#appFormPassword").change(function(){
  pwdChanged = true;
});

// procedimiento para crear y editar el candidato seleccionado
formCandidatos.addEventListener('submit', (e) => {

  if (star1.checked) appFormRating.value = "1";
  if (star2.checked) appFormRating.value = "2";
  if (star3.checked) appFormRating.value = "3";
  if (star4.checked) appFormRating.value = "4";
  if (star5.checked) appFormRating.value = "5";

  $(".page-loader").css("display", "flex");
  e.preventDefault();

  if(option == 'create') {
    fetch(window.sessionStorage.getItem('APIServer') + "Applicant/", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
      },
      body: JSON.stringify({
        firstName: appFormFirstName.value,
        lastName: appFormLastName.value,
        email: appFormEmail.value,
        profile: appFormProfile.value,
        keywords: appFormKeywords.value,
        cv_Description: appFormCVDescription.value,
        ranking: appFormRating.value
      })
    })
    .then(response => response.json())
    .then(data => {
      /*const newApplicant = [];
      newApplicant.push(data);*/
      $(".page-loader").css("display", "none");
      location.reload();
    })
    .catch(error => {
      alertify.defaults.glossary.title = 'Error';
      alertify.defaults.glossary.ok = 'Ok';    

      if(error.status == 404) {
          alertify.alert("El candidato no pudo encontrarse", function(){
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
    fetch(window.sessionStorage.getItem('APIServer') + "Applicant/?id=" + idForm + "&updPwd=" + pwdChanged.toString(), {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
      },
      body: JSON.stringify({
        firstName: appFormFirstName.value,
        lastName: appFormLastName.value,
        email: appFormEmail.value,
        profile: appFormProfile.value,
        keywords: appFormKeywords.value,
        cv_Description: appFormCVDescription.value,
        ranking: appFormRating.value
      })
    })
    .then(response => response.json())
    .then(data => {
      /*const newApplicant = [];
      newApplicant.push(data);*/
      location.reload();
      $(".page-loader").css("display", "none");
    })
    .catch(error => {
      alertify.defaults.glossary.title = 'Error';
      alertify.defaults.glossary.ok = 'Ok';    

      if(error.status == 404) {
          alertify.alert("El candidato y/o clave ingresados no son válidos, por favor valídelos y vuelva a intentar", function(){
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
  applicantWinModal.hide();
})