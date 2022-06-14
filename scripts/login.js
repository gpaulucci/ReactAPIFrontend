//const cApiServer = 'http://desktop-7k0rlgg:5000/api/' // Kestrel
//const cApiServer = 'https://desktop-7k0rlgg:44349/api/' // IIS
const cApiServer = 'http://apis.fortuneware.com/api/' // Fortuneware

window.sessionStorage.setItem('APIServer', '');

clickLogin = (e) => {
  $(".page-loader").css("display", "flex");
    fetch(cApiServer + "Token" 
    , {
       method: "POST",
       headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify({
        "email": document.getElementById('email').value.trim(),
        "password": document.getElementById('password').value.trim()
      }),
  })
  .then((response) => {
      return response.ok ? response.json() : Promise.reject(response);
  })
  .then((result) => {
      if(result.token){
          //alert("You are logged in.");
          window.sessionStorage.setItem('APIToken', JSON.stringify(result.token));
          window.sessionStorage.setItem('APIName', result.first_name  + ' ' + result.last_name);
          window.sessionStorage.setItem('APIUserID', result.id_user);
          window.sessionStorage.setItem('APIUserRole', result.role);
          window.sessionStorage.setItem('APIServer', cApiServer);
          location.href = 'home.html';
      } else {
           if(result.status === 404)
            alert("Please check your login information.");
            else
            alert("REQUEST ERROR: Please, contact administrator.");
      }
  }).catch(error => {
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

$(document).ready(function(){
  
  $(".page-loader").css("display", "none");
  // var input = document.getElementById('email');
  // input.oninvalid = function(event) { event.target.setCustomValidity('Username should only contain lowercase letters. e.g. john'); }
})

