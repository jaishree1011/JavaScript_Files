import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCChX7v_XmVNvy9I0Isv-eiopsoHth5KEo",
  authDomain: "pec-a4807.firebaseapp.com",
  projectId: "pec-a4807",
  storageBucket: "pec-a4807.appspot.com",
  messagingSenderId: "770861616973",
  appId: "1:770861616973:web:00987758385d15d43a7104"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  
  // SignUp Form ID's -
  const myForm = document.getElementById("main-form");
  const googleSignUp = document.querySelectorAll("#google-signUpIn");
  const githubSignUp = document.querySelectorAll("#github-signUpIn");
  const facebookSignUp = document.querySelectorAll("#facebook-signUpIn");
  
  // SignIn Form ID's -
  const signInForm = document.getElementById('signIn-form');

  // Sign Up Methods -
  class signUpMethods {
    // Basic LogIn System
    builtInSignUp(){
      const userName = myForm["sign-up-full-name"].value;
      const email = myForm["sign-up-email"].value;
      const password = myForm["sign-up-password"].value;
      const repassword = myForm["sign-up-repassword"].value;
      const phoneNumber = myForm["sign-up-number"].value;

      // CheckStuff -
      if (password != repassword || password === ''){
        Swal.fire('Re Entered password is not same as entered password or field empty')
      }
      else if (phoneNumber.length != 10){
        Swal.fire('Phone Number is not valid')
      }
      else {
        // Firebase Auth
        firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((cred) => {
          // Save Data to firebase storage -
          saveDatabase.UserfirebaseDatabase(userName, email, password, phoneNumber);
          Swal.fire({
            icon: 'success',
            title: 'Account Created Successfully. Please LogIn To order Delicious Cuisine',
          })
        })
        .catch((error) => Swal.fire("" + error));
      }
    }
  
    // Google SignUp Method -
    googleSignUpIn(){
      var provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          console.log(result.email);
          this.notifyUser();
          this.firebaseAuthRedirect();
        })
        .catch((error) => Swal.fire("" + error));
    }
  
    // FaceBook SignUp Method -
    facebookSignUpIn(){
      var provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("email, user_birthday");
  
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          this.notifyUser();
          this.firebaseAuthRedirect();
        })
        .catch((error) => Swal.fire("" + error));
    }
  
    // GitHub SignUp Method -
    githubSignUpIn(){
      var provider = new firebase.auth.GithubAuthProvider();
      provider.addScope("email, password");

      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          this.notifyUser();
          this.firebaseAuthRedirect();
        })
        .catch((error) => Swal.fire("" + error));
    }

    static authRedirecting() {
      window.setTimeout(() => {
        window.location.replace('https://PEC-canteen.netlify.app/client-side');
      }, 500)
    }

    // Notify User
    notifyUser() {
      window.setTimeout(function(){
        Swal.fire({
          icon: 'success',
          title: 'Account Signed In Successfully',
        })
      },1250)
    }

    firebaseAuthRedirect(){
      firebase.auth().onAuthStateChanged(function(user) {
        // If user is registered -
        user ?  window.location.replace('https://PEC-canteen.netlify.app/client-side') : console.log('none');
      });
    }
  }

  // Sign In Methods -
  class signInMethods {
    builtInSignIn(){
    const email =  document.getElementById('sign-in-email').value;
    const password = document.getElementById('sign-in-password').value;
    console.log('called');

    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      Swal.fire({
        icon: 'success',
        title: 'Logged In',
      })
      signUpMethods.authRedirecting()
    })
    .catch(error => {
      Swal.fire({
        icon: 'error',
        title: '' + error,
      })
    });
    }
  }

  // Save Data - To Firebase
  class saveDatabase {
    // Authentication Details -
    static UserfirebaseDatabase(userName, email, password, phoneNumber) {
      const userID = makeUserDataID(email);     
      // Create User data in firebase -
      console.log('database called');
      firebase.database().ref('User_Data/' + userID).set({
        User_Name: userName,
        Email: email,
        Password: password,
        Phone_Number: phoneNumber,
      });
    }

    // Cart Detailes
  }

  // When HTML & Other code is done -
  document.addEventListener("DOMContentLoaded", () => {
    // Sign Up Mehtods -
    const signUp = new signUpMethods();

    // Main Sign Up Form
    if (myForm) {
      myForm.addEventListener("subPEC", (e) => {
        e.preventDefault();
        signUp.builtInSignUp();
      });
    }

    // Google Sign Up Form
    if (googleSignUp) {
      googleSignUp.forEach(element => {
        element.addEventListener("click", (e) => {
          e.preventDefault();
          signUp.googleSignUpIn();
        });
      });
    }

    // GitHub Sign Up Form
    if (githubSignUp) {
      githubSignUp.forEach(element => {
        element.addEventListener("click", (e) => {
        e.preventDefault();
        signUp.githubSignUpIn();
      })
    });
    }

    // Facebook Sign Up Form
    if (facebookSignUp) {
      facebookSignUp.forEach(element => {
        element.addEventListener("click", (e) => {
          e.preventDefault();
          signUp.facebookSignUpIn();
        });
      });
    }

    // Sign In Methods -
    const signIn = new signInMethods();
    if (signInForm){
      // Main Sign In Form
      signInForm.addEventListener("subPEC", (e) => {
        e.preventDefault();
        signIn.builtInSignIn();
      });
    }

    // LogOut User -
    const logout = document.querySelectorAll('#userlogout');
    if (logout){
      logout.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          Swal.fire({
            icon: 'success',
            title: 'Logged Out Successfully',
          })
          firebase.auth().signOut().then(() => {
            window.location.replace("https://PEC-canteen.netlify.app/index.html")
          });
        });
      })
    }

  });

// Makes User ID Through EmailID Provided By User
let userDataID = '';
function makeUserDataID(userEmailID){
  // let userDataID = '';
  for (i=0; userEmailID.length; i++){
    if (userEmailID[i] != '@') { userDataID = userDataID + userEmailID[i] }
    else { break }
  }
  return userDataID
}