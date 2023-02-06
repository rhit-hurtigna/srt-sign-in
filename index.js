function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    r = Math.floor(r*255);
    g = Math.floor(g*255);
    b = Math.floor(b*255);
    return `#${('00' + r.toString(16)).substr(-2)}${('00' + g.toString(16)).substr(-2)}${('00' + b.toString(16)).substr(-2)}`;
}

const savedCats = ['name', 'course', 'prof', 'srt', 'format']
let catVal;
savedCats.forEach((c) => {
    catVal = window.localStorage.getItem(c);
    if (catVal) {
        document.querySelector(`#${c}`).value = catVal;
    }
});

function submitForm() {
    answers = new Object();
    document.querySelector('form').querySelectorAll('input, select').forEach((i) => {
        if (i.type == 'submit') {
            return;
        }
        answers[i.name] = i.value;
        answers['timestamp'] = firebase.firestore.Timestamp.now();
        if (savedCats.includes(i.name)) {
            if (i.value.length > 0) {
                window.localStorage.setItem(i.name, i.value);
            }
        } else {
            i.value = '';
        }
    });
    db.collection("sign-ins").add(answers)
    .then((docRef) => {
        document.querySelector('#error').textContent = "";
        document.querySelector('#ty').innerHTML = 'Thanks for submitting!';
        document.querySelector('input[type=submit]').value = 'Thank you!'
        const now = new Date();
        const h = ((((now.getMonth()) * 31 + now.getDate()) / 5.37) % 1)*.8 + .1;
        const specialColor = HSVtoRGB(h, 0.2, 1);
    
        document.querySelector('body').style.backgroundColor = specialColor;
        document.querySelectorAll('input, select, label').forEach((e) => e.hidden = true);
        setTimeout(() => {
            document.querySelectorAll('input, select, label').forEach((e) => e.hidden = false);
            document.querySelector('body').style.backgroundColor = '#ffffff';
            document.querySelector('#ty').innerHTML = 'Hello! Sign in here.';
            document.querySelector('input[type=submit]').value = 'Submit'
        }, 3000);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
        document.querySelector('#error').textContent = `Error submitting. Please tell your SRT to get Nat to fix it. ${error}`
    });
}

// import firebase from "firebase/app";
// import "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
// const firebaseConfig = {
//     FIREBASE_CONFIGURATION
// };

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
// Your web app's Firebase configuration

const db = firebase.firestore();
