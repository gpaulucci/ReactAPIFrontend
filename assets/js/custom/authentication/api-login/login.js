clickLogin = (e) => {
    fetch("http://desktop-7k0rlgg:5000/api/Token" // Kestrel
    // fetch("https://desktop-7k0rlgg:44349/api/Token" // IIS
    // fetch("http://apis.fortuneware.com/api/Token" // Fortuneware
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
        window.sessionStorage.setItem('APIToken', result.token);
        window.sessionStorage.setItem('APIName', result.first_name  + ' ' + result.last_name);
        location.href = 'dashboard.html';
       } else {
           if(result.status === 404)
            alert("Please check your login information.");
            else
            alert("REQUEST ERROR: Please, contact administrator.");
       }
    }).catch(error => {
        console.log(error);
        alert("Login inválido. Por favor, valide usuario y clave.");
    }
    );
  }
