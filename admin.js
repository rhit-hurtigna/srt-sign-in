function submitForm() {
    answers = new Object();
    document.querySelector('form').querySelectorAll('input, select').forEach((i) => {
        if (i.type == 'submit') {
            return;
        }
        answers[i.name] = i.value;
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
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}

const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
    //   var uid = user.uid;
    //   console.log(uid);
      // ...
    } else {
        // console.log("nope, you not sign in...")
        firebase.auth().signInWithRedirect(provider);
    }
  });

function downloadAsFile(filename, text) {
var element = document.createElement('a');
element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
element.setAttribute('download', filename);

element.style.display = 'none';
document.body.appendChild(element);

element.click();

document.body.removeChild(element);
}


function downloadStuff() {
    days = document.querySelector('#numDays').value
    console.log('days :>> ', days);
    startTime = new Date();
    startTime.setDate(startTime.getDate() - days);
    text = "Name,Course,Professor,SRT,Format,Hours\n"
    categories = ['name', 'course', 'prof', 'srt', 'format', 'hours']
    console.log('startTime :>> ', startTime);
    db.collection("sign-ins").where('timestamp', '>', startTime)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            dat = doc.data()
            categories.forEach((cat) => {
                text = text + `${dat[cat]},`
            });
            text = text.substring(0, text.length-1) + '\n';
        });
        downloadAsFile(`SRTsignins_${(new Date().toLocaleDateString('en-US'))}.csv`, text);
        document.querySelector('#error').textContent = ''
    })
    .catch((error) => {
        document.querySelector('#error').textContent = `Error getting documents: ${error}`
        console.log("Error getting documents: ", error);
    });
}
