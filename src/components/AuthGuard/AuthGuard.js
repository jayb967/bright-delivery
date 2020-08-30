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
