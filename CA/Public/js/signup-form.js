
const userForm = document.getElementById('registration-form-sign-up');
const fetchUser = async () => {
   const respons = await fetch('http://localhost:8000/api/v1/users/signup');
   const user = await respons.json();
   return user;
};

const SignUpUser = async (event) => {
   event.preventDefault()

   const name = document.getElementById('name').value;
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;
   const passwordConfirm = document.getElementById('passwordConfirm').value;

   await fetch('http://localhost:8000/api/v1/users/signup' , {
      method: 'POST' ,
      headers: {
         'Content-type' : 'application/json'
      } ,
      body: JSON.stringify({name , email , password , passwordConfirm})
   });
   console.log(`Succesul sigingup, data of user: \n${name} , \n${email} , \n${password} , \n${passwordConfirm}`);

   userForm.addEventListener('submit' , SignUpUser);


};
