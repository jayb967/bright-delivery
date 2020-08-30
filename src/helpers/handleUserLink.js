// Handles existing user linking by creating new document and deleting previous
export default async (app, email, id, org) => {
    if (email && id) {
        const done = await app.firestore()
            .collectionGroup('users')
            .where('email', '==', email).get()
            .then(res => {
                if (res.docs && res.docs.length > 0) {
                    const oldDoc = res.docs[0].data()
                    const deleteID = res.docs[0].id
                    return app.firestore().collection(org).doc('customers').collection('users').doc(id).set({ ...oldDoc })
                        .then((res) => {
                            return app.firestore().collection(org).doc('customers').collection('users').doc(deleteID).delete()

                        })
                        .then(() => true)
                }
                // return false

                const newUserDic = {
                    email,
                    uid: id,
                    updatedOn: Date.now()
                }
                // Create new user if doesn't exist
                return app.firestore()
                .collection(org)
                .doc('customers')
                .collection('users')
                .doc(id).set({ ...newUserDic })
                .then(() => true)
            })

        return console.log('this is the done', done)

    }
    return false

}