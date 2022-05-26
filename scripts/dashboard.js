

$(document).ready(function(){
  if(!window.sessionStorage.getItem('APIToken') || window.sessionStorage.getItem('APIToken') == null || window.sessionStorage.getItem('APIToken') == "null"  ) 
    location.href = 'index.html';

  document.getElementById("LoginName").innerHTML = window.sessionStorage.getItem('APIName');
  $(".page-loader").css("display", "none");
})

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


