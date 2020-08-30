import React from 'react'
import { makeStyles } from '@material-ui/styles';
import {
    Avatar,
    Divider,
    List,
    Fab,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button
} from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { capitalize } from 'helpers'

import { CheckoutButton } from 'components'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    itemTitle: {
        flexGrow: 1,
        fontWeight: 600,
        fontSize: '1.2em'
    },
}));

const CartSideBar = (props) => {
    const classes = useStyles();
    const { cart, user, updateCart, handleDrawerToggle, totals, handleChkDia } = props
    return (
        <div className={classes.root}>
            <Divider />
        <List >
            <ListItem button key={'Button'}>
                <Button variant="outlined" color="primary" onClick={handleDrawerToggle}>Close</Button>
            </ListItem>
            {cart && cart.cart.length && cart.cart.map((text, index) => (
                <React.Fragment key={text.id + index}>
                    <ListItem button key={text.id + index} style={{display: 'flex'}}>
                        <ListItemAvatar>
                            <Avatar alt={text.name} src={text && text.image} />
                        </ListItemAvatar>
                        <ListItemText
                            classes={{ primary: classes.itemTitle }}
                            primary={`x${text.quantity} ${text.name && capitalize(text.name)}: $${text.price && (parseFloat(text.price) * (text.quantity || 1)).toFixed(2)}`}
                            secondary={text.options.length > 0
                                && 'Options: ' + text.options.map(
                                    (itm) => `\n -${itm.name} +  ${itm.price} `)} />
                        <div style={{ display: 'flex' }}>
                            <Fab style={{marginRight: 10}} size="small" color='secondary' edge="end" onClick={() => updateCart(user.uid, text, false, 1, text.category, text.options || [])}>
                                <RemoveIcon/>
                            </Fab>
                            <Fab size="small" color='secondary' edge="end" onClick={() => updateCart(user.uid, text, true, 1, text.category, text.options || [])}>
                                <AddIcon/>
                            </Fab>
                        </div>
                    </ListItem>
                </React.Fragment>
            ))}
        </List>
        <Divider />
        <List>
            <ListItem button key={'Subtotal'}>
                <ListItemText primary={'Subtotal: '} secondary={totals.subtotal} />
            </ListItem>
            <ListItem button key={'Tax'}>
                <ListItemText primary={'Tax: '} secondary={totals.tax} />
            </ListItem>
            <ListItem button key={'Total'}>
                <ListItemText primary={'Total: '} secondary={totals.total} />
            </ListItem>
        </List>
        <CheckoutButton cartButton={true} totals={totals} openCheckout={handleChkDia} />
        </div>
        

    )
}

export default CartSideBar;