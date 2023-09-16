
/*
 * Sign up user section.
*/
const userForm = document.getElementById('registration-form-sign-up');
const fetchUser = async () => {
   const respons = await fetch('http://localhost:8000/api/v1/users/signup');
   const user = await respons.json();
   return user;
};

const signUpUser = async (event) => {
   event.preventDefault()

   try {
   const name = document.getElementById('name').value;
   const email = document.getElementById('email').value;
   const password = document.getElementById('password').value;
   const passwordConfirm = document.getElementById('passwordConfirm').value;
   const message = document.getElementById('Message');

   const response = await fetch('http://localhost:8000/api/v1/users/signup' , {
      method: 'POST' ,
      headers: {
         'Content-type' : 'application/json'
      } ,
      body: JSON.stringify({name: name , email: email , password: password , passwordConfirm: passwordConfirm})
   });
   console.log(`Succesul sign up, data of user: \n${name} , \n${email} , \n${password} , \n${passwordConfirm}`);

   if (response.ok) {

      const data = await response.json();
      console.log('Successful login:', data);
      window.location.href = 'index-user.html'
      
   } else if (!name) {

      message.textContent = 'Filed name is require!';

    } else if (!email) {

      message.textContent = 'Filed email is require!';

    } else if (!password) {

      message.textContent = 'Filed password is require!';

    } else if (password != passwordConfirm) {

      message.textContent = 'Password and repeat password is not the same!';

    } else if (!passwordConfirm) {

      message.textContent = 'Check the fiels repeat password!';

    } else {
      console.log('Login failed:', response.status);
   }
  } catch (error) {
   console.error('Error during login:', error);
  }
 
  userForm.addEventListener('submit' , signUpUser);
 };

/*
 * Login user section.
*/
 const userFormLogIn = document.getElementById('login-form');
 const fetchUserLogInSection = async () => {
      const respons = await fetch('http://localhost:8000/api/v1/users/signup');
      const logIn = await respons.json();
      return logIn;
   };
         
   const logInUser = async (event) => {
   event.preventDefault();
            
   const email = document.getElementById('email-login').value;
   const password = document.getElementById('password-login').value;
   const message = document.getElementById('Message');

            
      try {
      const response = await fetch('http://localhost:8000/api/v1/users/login', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ email: email, password: password })
      });

      if (response.ok) {

         const data = await response.json();
         console.log('Successful login:', data);
         window.location.href = 'index-user.html'; 

      } else if (!email) {

         resetMessage.textContent = 'Filed email is require!';
   
       } else if (!password) {
   
         resetMessage.textContent = 'Filed password is require!';
   
       } else {
         resetMessage.textContent = 'Someting went wrong , check the fields and try again';
         console.log('Login failed:', response.status);
      }
   } catch (error) {
      console.error('Error during login:', error);
   }

   userFormLogIn.addEventListener('submit', logInUser);
};