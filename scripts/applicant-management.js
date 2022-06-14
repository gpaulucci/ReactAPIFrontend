
//let download = require('/scripts/download.js');

const applicantWinModal = new bootstrap.Modal(document.getElementById('modalApplicantWin'));

let option = '';
let fileChanged = false;
let fileUID = '00000000-0000-0000-0000-000000000000';

document.querySelector('.menu-item-applicant').addEventListener('click', (e) => {

  var element = document.getElementById('kt_modal_app_mng');
  element.classList.toggle("show");
});

document.querySelector('.lnk-upload').addEventListener('click', (e) => {

  inpFile.click();
});

document.querySelector('.lnk-download').addEventListener('click', (e) => {
  try {
  fetch(window.sessionStorage.getItem('APIServer') + "UplFiles/" + fileUID, {
    method: 'GET',
    headers: {
      //Accept: "application/json",
      Authorization: "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
    }
  }).then( 
    fres => fres.blob()
  ).then((retBlob) => {
    download(retBlob, inpFileName.value);
  })
  .catch(error => {
    alertify.defaults.glossary.title = 'Error';
    alertify.defaults.glossary.ok = 'Ok';    

    if(error.status == 404) {
        alertify.alert("El archivo no pudo encontrarse.", function(){
          alertify.message('OK');
        })
    } else {
      alertify.alert("La operación no pudo completarse. El servidor no pudo responder a la solicitud. (Mensaje del servidor: " + error.message + ")", function(){
        alertify.message('OK');
      });
    }
      
    console.log(error)
  });
  } catch (e) {
    console.log(e.message);
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

// ******************************************************************
// procedimiento que se ejecuta al tarminar de cargar la página
// ******************************************************************

$(document).ready(function(){
  if(!window.sessionStorage.getItem('APIToken') || window.sessionStorage.getItem('APIToken') == null || window.sessionStorage.getItem('APIToken') == "null"  ) {
    location.href = 'index.html';
  } else {
    
    document.getElementById("LoginName").innerHTML = window.sessionStorage.getItem('APIName');
    if(window.sessionStorage.getItem('APIUserRole')!='Administrador') {
      document.getElementById('UserMnuOption').classList.add("d-none");
    }
    applicantsTable = $("#applicantsTable").DataTable({
      processing: true,
      "ajax":{
        url: window.sessionStorage.getItem('APIServer') + "Applicant?idOwner=" + window.sessionStorage.getItem('APIUserID') + "&Status=active",
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
        { data: null, render: function ( data, type, row ) {
          return new Date(data.updatedDateTime.toString()+'Z').toLocaleDateString();
        } },
        {"data": null, className: "dt-center editor-edit", orderable: false}
      ],
      responsive: true,
      autoWidth: true,
      searching: true
    });
    $(".page-loader").css("display", "none");
  }

  var input1 = document.getElementById("kt_tagify_1");
  new Tagify(input1, {
      whitelist: ["SAP SD","SAP MM","SAP FI","SAP CO","SAP FICO","SAP PP","SAP QM","SAP WM","SAP EWM","SAP CAR","SAP SRM","SAP CRM","ABAP","SAP PROJECT MANAGER","SAP PM","SAP MII","SAP QM","SAP REAL STATE","SAP RETAIL","SAP SUCCESS FACTORS","SAP ARIBA","SAP LETRA","SAP BW","SAP BO","SAP PI","SAP PO","SAP PI PO","SAP PS","SAP HCM","ORACLE WMS","ORACLE scm","ORACLE fi","ORACLE hrm","ORACLE sd","ORACLE bi","ORACLE ebs","ORACLE cloud","ORACLE developer","ORACLE crm","ORACLE order management","ORACLE precruitment","java","angular","sql","react","spring","core","manual","developer","oracle","program managers","IPC","asp","automation","funcional","datastage", "JAVASCRIPT"],
      placeholder: "Escribe para buscar",
      enforceWhitelist: true
  });
});

// ******************************************************************
// procedimiento de borrado del candidato seleccionado 
// ******************************************************************
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

// ******************************************************************
// procedimiento para recuperar y mostrar el candidato seleccionado en una ventana modal
// ******************************************************************
let rowApplicantID = 0;

on(document, 'click', '.btnEditar', e => {
  const selectedRow = e.target.parentNode.parentNode;
  rowApplicantID = selectedRow.children[0].innerHTML;
  fileChanged = false;
  inpFileName.value = '';

  $(".page-loader").css("display", "flex");

  fetch(window.sessionStorage.getItem('APIServer') + "Applicant/" + rowApplicantID, {
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
    appFormEnglishLvl.value = retJson.data.englishLevel,
    appFormCVDescription.value = retJson.data.resumeDesc;
    appFormRating.value = retJson.data.ranking;
    appFormOwnerUserId.value = retJson.data.idOwner;
    fileUID = retJson.data.uIdFileResume==''?'00000000-0000-0000-0000-000000000000':retJson.data.uIdFileResume;

    document.getElementById("kt_tagify_1").value = retJson.data.keywords;

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

    if (fileUID != '00000000-0000-0000-0000-000000000000' && typeof fileUID !== 'undefined') {
      fetch(window.sessionStorage.getItem('APIServer') + "UplFiles/?uid=" + fileUID, {
        method: 'GET',
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + JSON.parse(window.sessionStorage.getItem('APIToken'))
        }
      })
      .then( fres => fres.json())
      .then((fretJson) => {
        inpFileName.value = fretJson.data[0].name;
      })
      .catch(error => {
        alertify.defaults.glossary.title = 'Error';
        alertify.defaults.glossary.ok = 'Ok';    
    
        if(error.status == 404) {
            alertify.alert("El archivo no pudo encontrarse.", function(){
              alertify.message('OK');
            })
        } else {
          alertify.alert("La operación no pudo completarse. El servidor no pudo responder a la solicitud. (Mensaje del servidor: " + error.message + ")", function(){
            alertify.message('OK');
          });
        }
          
        console.log(error)
      });
    }
  })
  .catch(error => {
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

  $(".page-loader").css("display", "none");
  option = 'edit';
})


// ******************************************************************
// procedimiento para crear/editar y grabar el candidato seleccionado
// ******************************************************************

formCandidatos.addEventListener('submit', (e) => {

  if (star1.checked) appFormRating.value = "1";
  if (star2.checked) appFormRating.value = "2";
  if (star3.checked) appFormRating.value = "3";
  if (star4.checked) appFormRating.value = "4";
  if (star5.checked) appFormRating.value = "5";

  var keyWordsTags = '';
  var obj = JSON.parse(document.getElementById("kt_tagify_1").value);
  for(var i in obj)
    keyWordsTags += obj[i].value + ',';

  keyWordsTags = keyWordsTags.substr(0, keyWordsTags.length-1);

  $(".page-loader").css("display", "flex");
  e.preventDefault();

  if(option == 'create') {
    try {
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
          englishLevel: appFormEnglishLvl.value,
          keywords: keyWordsTags,
          resumeDesc: appFormCVDescription.value,
          ranking: appFormRating.value,
          idOwner: window.sessionStorage.getItem('APIUserID'),
          status: "active",
          UIdFileResume: fileUID==''?'00000000-0000-0000-0000-000000000000':fileUID,
          updatedIdUser: window.sessionStorage.getItem('APIUserID'),
          updatedDateTime: new Date().toISOString()
        })
      })
      .then(response => response.json())
      .then(data => {
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
      });
    } catch(err) {
      console.error(err);
      alert('SE PRODUJO UN ERROR EN LA APLICACIÓN: ' + err.message);
    }

  }
  if(option == 'edit') {
    
    fetch(window.sessionStorage.getItem('APIServer') + "Applicant/?id=" + rowApplicantID, {
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
        englishLevel: appFormEnglishLvl.value,
        keywords: keyWordsTags,
        resumeDesc: appFormCVDescription.value,
        ranking: appFormRating.value,
        idOwner: appFormOwnerUserId.value,
        status: "active",
        uIdFileResume: fileUID==''?'00000000-0000-0000-0000-000000000000':fileUID,
        updatedIdUser: window.sessionStorage.getItem('APIUserID'),
        updatedDateTime: new Date().toISOString()
      })
    })
    .then(response => response.json())
    .then(data => {
      location.reload();
      //$(".page-loader").css("display", "none");
    })
    .catch(error => {
      alertify.defaults.glossary.title = 'Error';
      alertify.defaults.glossary.ok = 'Ok';    

      alertify.alert("La operación no pudo completarse. El servidor no pudo responder a la solicitud. (Mensaje del servidor: " + error.message + ")", function(){
        alertify.message('OK');
      });
        
      console.log(error)
      
    });

  }
  $(".page-loader").css("display", "none");
  applicantWinModal.hide();

});

inputFileObj = document.getElementById("inpFile");
inputFileNameObj = document.getElementById("inpFileName");
let urlFile = window.sessionStorage.getItem('APIServer') + "UplFiles/?idUser=" + window.sessionStorage.getItem('APIUserID');
let h = new Headers();
h.append('Authorization', `Bearer ${JSON.parse(window.sessionStorage.getItem('APIToken'))}`);

inputFileObj.addEventListener('change', e => {
  
  $(".page-loader").css("display", "flex");
  const myFile = document.getElementById("inpFile");
  const formData = new FormData();
  formData.append("file", myFile.files[0]);

  try {
      let reqFle = new Request(urlFile, {
          method: 'POST',
          //mode: 'cors',
          headers: h,
          body: formData
      });
      
      fetch(reqFle)
      .then(promiseRet => {
          return promiseRet.json()
      })
      .then(promiseRetJson => {
          console.log('Se subió el archivo ok');
          console.log(promiseRetJson);
          fileUID = promiseRetJson.data.uId;
          inputFileNameObj.value = promiseRetJson.data.name; // inputFileObj.value;
      })
      .catch(error => {
          console.error(error)
      })
      

  } catch(err) {
      console.error(err);
  }

  $(".page-loader").css("display", "none");
});