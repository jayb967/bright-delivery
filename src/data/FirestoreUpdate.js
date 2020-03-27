import React, { useContext } from "react";

async function delSubcollectionDocument(
    firebase,
    collection,
    docId,
    doc2Id,
) {
    const firestore = firebase.firestore();
    return await firestore
        .collection(collection)
        .doc(docId)
        .collection("values")
        .doc(doc2Id)
        .delete()
        .then(() => {
            console.log("Successfully removed");
            return true;
        })
        .catch(err => {
            console.log("there was an error deleting:", err);
            return false;
        });
}

function updateSubcollectionDocument(firebase, collection, doc, collection2,  doc2, data) {
    const firestore = firebase.firestore();

    return firestore
        .collection(collection)
        .doc(doc)
        .collection(collection2)
        .doc(doc2)
        .update(data)
        .then(() => {
            console.log("Successfully updated");
            return true;
        })
        .catch(err => {
            console.log("there was an error updating", err);
            return false;
        });
}

async function createSubcollectionDocument(firebase, collection, doc, collection2, doc2, data) {
    const firestore = firebase.firestore();

    const subCollectionID = await firestore
        .collection(collection)
        .doc(doc)
        .collection(collection2)
        .doc(doc2)
        .set(data)
        .then(ref => true)
        .catch(err => {
            console.log("there was an error updating", err);
            return false;
        });

    return subCollectionID;
}

export {
    updateSubcollectionDocument,
    delSubcollectionDocument,
    createSubcollectionDocument
};