//const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
const port = process.env.PORT || 8080;
var serviceAccount = require("../service/key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cloud-run-req.firebaseio.com"
});
const db = admin.firestore();

app.get('/name', (req, res) => {
  return res.status(200).send('Wattana Chaiyakun!');
});
app.post('/api/create', (req, res) => {
    (async () => {
        const Profile = req.query;
        // Push the new message into Cloud Firestore using the Firebase Admin SDK.
        const writeResult = await admin.firestore().collection('project TEST Name').add({Profile});
        // Send back a message that we've succesfully written the message
        res.json(` Create Success [ Profile ID ] => ${writeResult.id} `);
        //const docSnap = await writeResult.get();
        //const writtenText = docSnap.get ('text');
        //res.send (`Message with text: ${writtenText} added.`);
      })();
  });
  app.get('/api/read/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('project TEST Name').doc(req.params.id);
            let profile = await document.get();
            let response = profile.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });

/// read all
app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('project TEST Name');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        ID: doc.id,
                        Name: doc.data().Profile.Name,
                        Lastname: doc.data().Profile.Lastname,
                        Age: doc.data().Profile.Age
                    };
                    response.push(selectedItem);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });


// update
app.put('/api/update/:id/', (req, res) => {
    (async () => {
        const Profile = req.query;
        const writeResult = await admin.firestore().collection('project TEST Name').doc(req.params.id).update({Profile});
        return res.status(200).send();
        // res.send (` <== Update Success ==> `);
      })();
/*(async () => {
    try {
        const document = db.collection('project TEST Name').doc(req.params.id);
        await document.update({
            Name: req.Profile.Name,
            LastName: req.body.Profile.Lastname,
            Age: req.body.Profile.Age,
        });
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();*/
});

// delete
app.delete('/api/delete/:id', (req, res) => {
(async () => {
    try {
        const document = db.collection('project TEST Name').doc(req.params.id);
        await document.delete();
        return res.status(200).send();
        // return res.send(` <== Delete Success ==> `);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});

//exports.app = functions.https.onRequest(app);
app.listen(port, () => console.log(`listening on port ${port}!`));


