// Handles existing user linking by creating new document and deleting previous
export default async (app, email, id, org) => {
    if (email && id) {
        const done = await app.firestore()
            .collectionGroup('users')
            .where('email', '==', email).get()
            .then(res => {
                if (res.docs.length > 0) {
                    const oldDoc = res.docs[0].data()
                    const deleteID = res.docs[0].id
                    return app.firestore().collection(org).doc('customers').collection('users').doc(id).set({ ...oldDoc })
                        .then((res) => {
                            console.log('this is what will be deleted', deleteID, 'this is the res after creating doc', res)
                            return app.firestore().collection(org).doc('customers').collection('users').doc(deleteID).delete()

                        })
                        .then(() => true)
                }

                return false
            })

        return console.log('this is the done', done)

    }
    return false

}