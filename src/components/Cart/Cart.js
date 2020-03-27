import React, { useEffect, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PropTypes from 'prop-types';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import 'firebase/auth'

import { AuthContext, CartContext, OrgContext } from 'context'
import { FirebaseContext } from 'data/Firebase'






const Cart = props => {
  const { children } = props;
  const firebase = useContext(FirebaseContext)
  const org = useContext(OrgContext);
  const [user, loading, error] = useAuthState(firebase.auth());

  const [cart, loadingCart, errorCart] = useDocument(
    firebase.firestore().doc(`${org}/carts/activeCarts/${user && user.uid}`),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const cartState = cart && cart.exists ? cart.data() : null

  return (
    <CartContext.Provider value={cartState}>
      {children}
    </CartContext.Provider>
  );
};

Cart.propTypes = {
  children: PropTypes.node,
};

export default Cart;
