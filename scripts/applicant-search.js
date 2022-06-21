
const applicantWinModal = new bootstrap.Modal(document.getElementById('modalApplicantWin'));

let option = '';
let fileChanged = false;
let fileUID = '00000000-0000-0000-0000-000000000000';

document.querySelector('.menu-item-applicant').addEventListener('click', (e) => {

  var element = document.getElementById('kt_modal_app_mng');
  element.classList.toggle("show");
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
        url: window.sessionStorage.getItem('APIServer') + "Applicant?Status=active",
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
        "defaultContent":"<a href='#' class='btnEditar menu-link px-3'>&nbsp;&nbsp;Visualizar</a>"
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
          return '<p class="text-gray-800 mb-1">' + data.firstName+' '+data.lastName+'</p><p class="text-gray-400 mb-1 small">'+data.email+'</span></p><p class="text-gray-500 mb-1 small">'+data.phone+'</p>';
        } , className: "align-middle"},
        { data: null, render: function ( data, type, row ) {
          return '<div class="badge badge-light fw-bolder m-1">' + data.profile.replace(/,/g, '</div><div class="badge badge-light fw-bolder m-1">') + '</div>';
          
        } , className: "align-middle"},
        { data: null, render: function ( data, type, row ) {
          return '<div class="badge badge-light fw-bolder m-1">' + data.languages.replace(/,/g, '</div><div class="badge badge-light fw-bolder m-1">') + '</div>';
          
        } , className: "align-middle"},
        { data: null, render: function ( data, type, row ) {
          return '<div class="badge badge-light fw-bolder m-1">' + data.skills.replace(/,/g, '</div><div class="badge badge-light fw-bolder m-1">') + '</div>';
          
        } , className: "align-middle"},
        {"data": null, className: "dt-center editor-edit", orderable: false, className: "align-middle"}
      ],
      responsive: true,
      autoWidth: true,
      searching: true
    });
    $(".page-loader").css("display", "none");
  }

  // conocimientos
  var input1 = document.querySelector("#kt_tagify_1");
  new Tagify(input1, {
      whitelist: ["SAP SD","SAP MM","SAP FI","SAP CO","SAP FICO","SAP PP","SAP QM","SAP WM","SAP EWM","SAP CAR","SAP SRM","SAP CRM","ABAP","SAP PROJECT MANAGER","SAP PM","SAP MII","SAP QM","SAP REAL STATE","SAP RETAIL","SAP SUCCESS FACTORS","SAP ARIBA","SAP LETRA","SAP BW","SAP BO","SAP PI","SAP PO","SAP PI PO","SAP PS","SAP HCM","ORACLE WMS","ORACLE scm","ORACLE fi","ORACLE hrm","ORACLE sd","ORACLE bi","ORACLE ebs","ORACLE cloud","ORACLE developer","ORACLE crm","ORACLE order management","ORACLE precruitment","java","angular","sql","react","spring","core","manual","developer","oracle","program managers","IPC","asp","automation","funcional","datastage"],
      placeholder: "Escribe para buscar",
      enforceWhitelist: true
  });

  // perfil
  var input2 = document.querySelector("#kt_tagify_2");
  new Tagify(input2, {
      whitelist: ["Project Manager","Architect","Analyst","Art Designer","Consultant","DBA","Full Stack","Programmer","Tester","Leader","Senior","Semisenior","Junior"],
      placeholder: "Escribe para buscar",
      enforceWhitelist: true
  });

  // idiomas
  var input3 = document.querySelector("#kt_tagify_3");
  new Tagify(input3, {
      whitelist: ["Ingles","Español","Portugues","Chino","Frances","Aleman"],
      placeholder: "Escribe para buscar",
      enforceWhitelist: true
  });

  // nacionalidad
  var input4 = document.querySelector("#kt_tagify_4");
  new Tagify(input4, {
      whitelist: ["Mexicana","Argentina","Italiana","Española","Brasilera","Alemana"],
      placeholder: "Escribe para buscar",
      enforceWhitelist: true
  });

  // pasaportes
  var input5 = document.querySelector("#kt_tagify_5");
  new Tagify(input5, {
      whitelist: ["B1/B2","GreenCard","Europa","México","FM3"],
      placeholder: "Escribe para buscar",
      enforceWhitelist: true
  });
});

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
    appFormNotes.value = retJson.data.notes;
    appFormRating.value = retJson.data.ranking;
    appFormOwnerUserId.value = retJson.data.idOwner;
    appFormWsp.value = retJson.data.phone;
    appFormSource.value = retJson.data.source;
    appFormCreatedUserId.value = retJson.data.createdIdUser;
    appFormCreatedDateTime.value = retJson.data.createdDateTime.toString()+'Z';
    fileUID = retJson.data.uIdFileResume==''?'00000000-0000-0000-0000-000000000000':retJson.data.uIdFileResume;

    document.getElementById("kt_tagify_1").value = retJson.data.skills;
    document.getElementById("kt_tagify_2").value = retJson.data.profile;
    document.getElementById("kt_tagify_3").value = retJson.data.languages;
    document.getElementById("kt_tagify_4").value = retJson.data.nationality;
    document.getElementById("kt_tagify_5").value = retJson.data.passport;

    star1.classList.remove("unchecked", "checked");
    star2.classList.remove("unchecked", "checked");
    star3.classList.remove("unchecked", "checked");
    star4.classList.remove("unchecked", "checked");
    star5.classList.remove("unchecked", "checked");

    if (retJson.data.ranking == "1") {
      star1.classList.add("checked"); 
      star2.classList.add("unchecked");
      star3.classList.add("unchecked"); 
      star4.classList.add("unchecked");
      star5.classList.add("unchecked"); 
    } else if (retJson.data.ranking == "2") {
      star1.classList.add("checked"); 
      star2.classList.add("checked");
      star3.classList.add("unchecked"); 
      star4.classList.add("unchecked");
      star5.classList.add("unchecked"); 
    } else if (retJson.data.ranking == "3") {
      star1.classList.add("checked"); 
      star2.classList.add("checked");
      star3.classList.add("checked"); 
      star4.classList.add("unchecked");
      star5.classList.add("unchecked"); 
    } else if (retJson.data.ranking == "4") {
      star1.classList.add("checked"); 
      star2.classList.add("checked");
      star3.classList.add("checked"); 
      star4.classList.add("checked");
      star5.classList.add("unchecked"); 
    } else if (retJson.data.ranking == "5") {
      star1.classList.add("checked"); 
      star2.classList.add("checked");
      star3.classList.add("checked"); 
      star4.classList.add("checked");
      star5.classList.add("checked"); 
    }
    
    applicantWinModal.show();

/*     star5.checked = false;
    star4.checked = false;
    star3.checked = false;
    star2.checked = false;
    star1.checked = false;

    if (retJson.data.ranking == "1") star1.checked = true;
    if (retJson.data.ranking== "2") star2.checked = true;
    if (retJson.data.ranking== "3") star3.checked = true;
    if (retJson.data.ranking == "4") star4.checked = true;
    if (retJson.data.ranking == "5") star5.checked = true; */

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
