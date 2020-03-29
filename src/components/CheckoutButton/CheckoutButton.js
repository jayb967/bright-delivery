import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CartContext } from 'context'

const useStyles = makeStyles(theme => ({
    root: {
        position: 'fixed',
        textAlign: 'center',
        bottom: 5,
        right: 'auto',
        left: 'auto',
        width: '100vw',
        zIndex: 100
    },
    button: {

    }

}));

const CheckoutButton = (props) => {
    const { totals, openCheckout } = props
    const cart = useContext(CartContext)

    const classes = useStyles()

    return (
        <div className={classes.root}>
            {cart && cart.cart.length > 0 && <Button variant="contained" color='primary' onClick={() => openCheckout && openCheckout(true)}>Checkout now {totals && totals.total}</Button>}
        </div>
    )
}

export default CheckoutButton;