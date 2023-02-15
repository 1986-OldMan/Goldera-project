
console.log(window);

const request = new XMLHttpRequest();

request.open("GET" , "https://jsonplaceholder.typicode.com/users");

request.send();

request.onload = () => {

    //The HTTP 200 OK success status response code indicates that the request has succeeded.

    //The 404 errors indicate that a requested API service cannot be found, or that a requested entity cannot be found

    if(request.status === 200) {

        console.log(JSON.parse(request.response));

    } else {

        console.log(`error ${request.status}`);

    }
}