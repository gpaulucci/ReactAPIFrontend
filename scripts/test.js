/* $(document).ready(function(){

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const user = JSON.parse(xhr.responseText);
            console.log(user);
        }
    }

    xhr.open('GET', 'data/usr.json', true);
    xhr.send();

}); */

/*
const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        const user = JSON.parse(xhr.responseText);
        console.log(user);
        $("#retJson").html("<strong>" + JSON.stringify(user) + "</strong>")
    }
}

xhr.open('GET', 'data/usr.json', true);
xhr.send();
*/

/*
$.ajax(
    {
        url: 'data/usr.json',
        success: function(user){
            $("#retJson").html("<strong>" + JSON.stringify(user) + "</strong>")
        }
    }
)
*/

let fileUID = '';

let token = JSON.parse(window.sessionStorage.getItem('APIToken'));

let urlApplicant = window.sessionStorage.getItem('APIServer') + "Applicant/?id=1";
let urlFile = window.sessionStorage.getItem('APIServer') + "UplFiles/?idUser=" + window.sessionStorage.getItem('APIUserID');


let h = new Headers();
h.append('Authorization', `Bearer ${token}`);
//h.append('Content-Type', 'application/json');

let ha = new Headers();
ha.append('Authorization', `Bearer ${token}`);
ha.append('Content-Type', 'application/json');

inputFileObj = document.getElementById("inpFile");
inputFileNameObj = document.getElementById("inpFileName");

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

        //var promiseRet = await fetch(reqFle);
        //var promiseRetJson = await promiseRet.json();

        
        fetch(reqFle)
        .then(promiseRet => {
            return promiseRet.json()
        })
        .then(promiseRetJson => {
            console.log('Se subió el archivo ok');
            console.log(promiseRetJson);
            fileUID = promiseRetJson['data'].uId;

        })
        .catch(error => {
            console.error(error)
        })
        

    } catch(err) {
        console.error(err);
    }
    alert('changed' + inputFileObj.value);
    inputFileNameObj.value = inputFileObj.value;
    $(".page-loader").css("display", "none");
});

formCandidatos.addEventListener('submit', (e) => { 
    e.preventDefault();
    let reqApp = new Request(urlApplicant, {
        method: 'PUT',
        //mode: 'cors',
        headers: ha,
        body: JSON.stringify({
            firstName: 'Pedro',
            lastName: 'Berra',
            email: 'pberra@hotmail.com',
            profile: 'Perfil de Pedro',
            keywords: 'ORACLE,HTML,CSS',
            resumeDesc: 'Descripción del perfil de Pedro',
            ranking: 2,
            idOwner: window.sessionStorage.getItem('APIUserID'),
            status: "active",
            UIdFileResume: fileUID
          })
    });

    fetch(reqApp)
    .then(promiseAppRet => {
        return promiseAppRet.json()
    })
    .then(promiseAppRetJson => {
        console.log('Se actualizó el candidato ok');
        console.log(promiseAppRetJson);
            
    })
    .catch(errorApp => {
        console.error(errorApp)
    })
})

/**********************
 * OPCION 1 FUNCIONANDO OK: SUBE EL ARCHIVO Y LUEGO ACTUALIZA AL CANDIDATO
 **********************/
/*
formCandidatos.addEventListener('submit', (e) => { 
    e.preventDefault();
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

        //var promiseRet = await fetch(reqFle);
        //var promiseRetJson = await promiseRet.json();

        
        fetch(reqFle)
        .then(promiseRet => {
            return promiseRet.json()
        })
        .then(promiseRetJson => {
            console.log('Se subió el archivo ok');
            console.log(promiseRetJson);

            let reqApp = new Request(urlApplicant, {
                method: 'PUT',
                //mode: 'cors',
                headers: ha,
                body: JSON.stringify({
                    firstName: 'Pedro',
                    lastName: 'Berra',
                    email: 'pberra@hotmail.com',
                    profile: 'Perfil de Pedro',
                    keywords: 'ORACLE,HTML,CSS',
                    resumeDesc: 'Descripción del perfil de Pedro',
                    ranking: 2,
                    idOwner: window.sessionStorage.getItem('APIUserID'),
                    status: "active",
                    UIdFileResume: '00000000-0000-0000-0000-000000000002'
                  })
            });

            fetch(reqApp)
            .then(promiseAppRet => {
                return promiseAppRet.json()
            })
            .then(promiseAppRetJson => {
                console.log('Se actualizó el candidato ok');
                console.log(promiseAppRetJson);
                    
            })
            .catch(errorApp => {
                console.error(errorApp)
            })
        })
        .catch(error => {
            console.error(error)
        })
        

    } catch(err) {
        console.error(err);
    }
})
*/
