import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CartContext } from 'context'


const useStyles = makeStyles(theme => ({
    root: {
        // position: 'fixed',
        textAlign: 'center',
        bottom: 5,
        right: 'auto',
        left: 'auto',
        // width: '100%',
        zIndex: 100,
        [theme.breakpoints.down('md')]: { // Breakpoint for mobile
            position: 'fixed',
            width: '100vw',
            textAlign: 'center',
            left: 0
        }
    },
    cartStyle: {
         // position: 'fixed',
         textAlign: 'center',
         bottom: 5,
         right: 'auto',
         left: 'auto',
         // width: '100%',
         zIndex: 100,
    }

}));

const CheckoutButton = (props) => {
    const { totals, openCheckout, cartButton } = props
    const cart = useContext(CartContext)
    const classes = useStyles()

    return (
        <div className={cartButton ? classes.cartStyle : classes.root}>
            {cart && cart.cart.length > 0 && <Button 
            variant="contained" 
            color='primary' 
            onClick={() => openCheckout && openCheckout(true)}
            >
                Checkout {totals && totals.total}
                </Button>}
        </div>
    )
}

export default CheckoutButton;