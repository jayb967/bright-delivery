import React, { createContext } from 'react'
import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/functions'

const client = {
    apiKey: "AIzaSyCvvmX6g10DoCeHLCYOlRRIQ_5e6ZL8viQ",
    authDomain: "restaurant-delivery-visual.firebaseapp.com",
    databaseURL: "https://restaurant-delivery-visual.firebaseio.com",
    projectId: "restaurant-delivery-visual",
    storageBucket: "restaurant-delivery-visual.appspot.com",
    messagingSenderId: "35941903728",
    appId: "1:35941903728:web:01a9698c9c2737eaff73b5",
    measurementId: "G-7VL6D68TQW"
  };

const FirebaseContext = createContext(null)
export { FirebaseContext }


export default ({ children }) => {
  if (!app.apps.length) {
    app.initializeApp({...client})
  }
  return (
    <FirebaseContext.Provider value={app}>
      { children }
    </FirebaseContext.Provider>
  )
}

