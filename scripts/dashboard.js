

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

$(document).ready(function(){
  if(!window.sessionStorage.getItem('APIToken') || window.sessionStorage.getItem('APIToken') == null || window.sessionStorage.getItem('APIToken') == "null"  ) 
    location.href = 'index.html';

  // document.getElementById("LoginName").innerHTML = window.sessionStorage.getItem('APIName');
  $(".page-loader").css("display", "none");

  if(window.sessionStorage.getItem('APIUserRole')!='Administrador') {
    document.getElementById('UserMnuOption').classList.add("d-none");
  }
})

document.querySelector('.menu-item-applicant').addEventListener('click', (e) => {

  var element = document.getElementById('kt_modal_app_mng');
  element.classList.toggle("show");
});

/* setInterval((x => { */
/*    fetch("https://localhost:44383/api/Token"
    , {
       method: "POST",
       headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify({
        "alias": document.getElementById('email').value.trim(),
        "password": document.getElementById('password').value.trim()
      }),
  })
    .then((response) => {
      return response.ok ? response.json() : Promise.reject(response);
    })
    .then((result) => {
      if(result.token){
        alert("You are logged in.");
        window.sessionStorage.setItem('API Token', result.token);
        window.sessionStorage.setItem('Login Name', result.first_name);
        window.sessionStorage.setItem('Login Name', result.last_name);
        location.href = 'dashboard.html';
       } else {
           if(result.status === 404)
            alert("Please check your login information.");
            else
            alert("REQUEST ERROR: Please, contact administrator.");
       }
    }).catch(error => {
        console.log(error);
        alert("REQUEST ERROR: Please, contact administrator.");
    }
    );
*/
/*alert("Es necesario actualizar el token");
location.href = 'index.html';
window.sessionStorage.setItem('APIToken', null);
window.sessionStorage.setItem('APIName', null);
}), 205000) */

clickLogout = (e) => {
  window.sessionStorage.setItem('APIToken', null);
  window.sessionStorage.setItem('APIName', null);
  window.sessionStorage.setItem('APIServer', null);
  location.href = 'index.html';
}


