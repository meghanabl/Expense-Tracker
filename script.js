const firebaseConfig = {
   apiKey: "AIzaSyCMAFLGTuoaxrGIlaesnKPzX8HWrMJFizc",
    authDomain: "expense-tracker-app-79ec7.firebaseapp.com",
    projectId: "expense-tracker-app-79ec7",
    storageBucket: "expense-tracker-app-79ec7.firebasestorage.app",
    messagingSenderId: "523728051836",
    appId: "1:523728051836:web:07e2a620b57b3682b2b3f9"

};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// HTML elements
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const authDiv = document.getElementById("auth");
const appDiv = document.getElementById("app");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const list = document.getElementById("list");

// REGISTER
function register() {
  auth.createUserWithEmailAndPassword(
    emailInput.value,
    passwordInput.value
  )
  .then(() => {
    alert("Registered successfully");
  })
  .catch(error => {
    alert(error.message);
  });
}

// LOGIN
function login() {
  auth.signInWithEmailAndPassword(
    emailInput.value,
    passwordInput.value
  )
  .catch(error => {
    alert(error.message);
  });
}

// LOGOUT
function logout() {
  auth.signOut();
}

// AUTH STATE CHECK
auth.onAuthStateChanged(user => {
  if (user) {
    authDiv.style.display = "none";
    appDiv.style.display = "block";
    loadExpenses();
  } else {
    authDiv.style.display = "block";
    appDiv.style.display = "none";
  }
});

// ADD EXPENSE
function addExpense() {
  db.collection("expenses").add({
    title: titleInput.value,
    amount: amountInput.value,
    user: auth.currentUser.uid
  });
}

// LOAD EXPENSES
function loadExpenses() {
  db.collection("expenses")
    .where("user", "==", auth.currentUser.uid)
    .onSnapshot(snapshot => {
      list.innerHTML = "";
      snapshot.forEach(doc => {
        list.innerHTML += `
          <li>
            ${doc.data().title} - ₹${doc.data().amount}
            <button onclick="deleteExpense('${doc.id}')">X</button>
          </li>`;
      });
    });
}

// DELETE EXPENSE
function deleteExpense(id) {
  db.collection("expenses").doc(id).delete();
}
