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

let token = JSON.parse(window.sessionStorage.getItem('APIToken'));

let url = window.sessionStorage.getItem('APIServer') + "User";

let h = new Headers();
h.append('Authorization', `Bearer ${token}`);
h.append('Content-Type', 'application/json');

let req = new Request(url, {
    method: 'GET',
    //mode: 'cors',
    headers: h
});

fetch(req)
.then(response => response.json())
.then(
    user => {
        console.log(user);
        $("#retJson").html("<strong>" + JSON.stringify(user) + "</strong>")
    }
)
.catch(error => console.log(error))
