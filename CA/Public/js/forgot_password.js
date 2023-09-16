const forgotPasswordForm = document.getElementById('forgot-password');
const fetchForgotPassword = async () => {
    const respons = await fetch('http://localhost:8000/api/v1/users/forgotPassword');
    const userData = await respons.json();
    return userData
};

const forgotPassword = async () => {
    try {
        const email = document.getElementById('email').value;
        const message = document.getElementById('Message');

        const response = await fetch('http://localhost:8000/api/v1/users/forgotPassword' , {
            method: 'POST' ,
            headers: {
                'Content-type' : 'application/json'
            } ,
            body: JSON.stringify({ email: email })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Successful reset password:' , data);
            resetMessage.textContent = 'Password reset instructions sent to your email.';
            window.location.href = 'reset-password.html';

        } else if (!email) {

            resetMessage.textContent = 'Filed email is require!';
         }
          else {

            resetMessage.textContent = 'Someting went wrong , check the fields and try again';
        }

    } catch (error) {
        console.error('Error:', error);
    }
    forgotPasswordForm.addEventListener('submit' , forgotPassword);
};