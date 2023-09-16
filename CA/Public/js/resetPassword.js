const resetPasswordForm = document.getElementById('reset');

const resetPassword = async () => {
   try {
      const urlParams = new URLSearchParams(window.location.search);
      const resetToken = urlParams.get('resetToken');
      
      const resetPasswordURL = `http://localhost:8000/api/v1/users/resetPassword/${resetToken}`;
      

      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-repeat').value;
      const resetMessage = document.getElementById('resetMessage');

      const response = await fetch(resetPasswordURL, {
         method: 'PATCH',
         headers: {
            'Content-Type' : 'application/json'
         } ,
         body:JSON.stringify({ token: resetToken , password , passwordConfirm })
      });
      
      const data = await response.json();
      if (response.ok) {
         
         console.log('Successful reset password:', data);
         resetMessage.textContent = 'Reset password complete!';
         window.location.href = 'registration-form.html';
         
     } else if (!password) {

      resetMessage.textContent = 'Filed password is require!';

    } else if (password != passwordConfirm) {

      resetMessage.textContent = 'Password and repeat password is not the same!';

    } else if (!passwordConfirm) {

      resetMessage.textContent = 'Check the fiels repeat password!';

    }  else {

        resetMessage.textContent = 'Someting went wrong , check the fields and try again'
        console.log('Reset password failed:', response.status);
    }

   } catch (error) {
      console.error('Error during reset password:', error);
   }
   reset.addEventListener('submit', resetPassword);
}
