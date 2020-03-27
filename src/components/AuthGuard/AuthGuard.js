import React, { useEffect, useContext } from 'react';
// import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { AuthContext } from 'context'

// import useRouter from 'utils/useRouter';
import { FirebaseContext } from '../../data/Firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import 'firebase/auth'



const AuthGuard = props => {
  const { children } = props;
  const firebase = useContext(FirebaseContext)
  const [user, loading, error] = useAuthState(firebase.auth());
  
  // useEffect(() => {
  //   return () =>{
  //     firebase.auth().onAuthStateChanged(user => {
        
  //       if(!user){
  //         // User is signed out sign in Anonymous 
  //       }
  //     })
  //   }
    
  // }, [user])
  // const router = useRouter();


  // useEffect(() => {

  //   if (!user && router.location.pathname !== '/login') {
  //     // console.log('router history', router.history, 'location', router.location)

  //     router.history.push('/login');
  //     return;
  //   }

  //   // if (user && user.email != 'admin@kushfly.com') {
  //   //   router.history.push('/errors/error-401');
  //   //   return
  //   // }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [router]);
  return (
  <AuthContext.Provider value={user}>
    {children}
  </AuthContext.Provider>
  );
};

AuthGuard.propTypes = {
  children: PropTypes.node,
  roles: PropTypes.array.isRequired
};

AuthGuard.defaultProps = {
  roles: []
};

export default AuthGuard;
