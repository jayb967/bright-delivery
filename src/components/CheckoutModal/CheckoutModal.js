import React, { useContext, useState } from 'react'

import {
    AppBar,
    Avatar,
    Dialog,
    DialogContent,
    DialogActions,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    IconButton,
    Toolbar,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Slide,
    Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { CartContext } from 'context'
import { capitalize } from 'helpers'
import { PaymentModal } from 'components'

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const CheckoutModal = (props) => {
    const { open, handleChkDia, totals } = props;
    const classes = useStyles();
    const cart = useContext(CartContext);

    const [paymentOpen, setPaymentOpen] = useState(false)

    const [delivery, setDelivery] = useState(false)


    const handleClickOpen = () => {
        handleChkDia(true);
    };

    const handleClose = () => {
        handleChkDia(false);
    };

    const handleOpenPayment = (val) => {
        setPaymentOpen(val)
    }


    return (
        <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.appBar} color="secondary">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title} color="inherit">
                        Checkout
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <List>
                    {cart && cart.cart.length > 0 && cart.cart.map((item, i) => (
                        <React.Fragment key={item.id + i}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar alt={item.name} src={item && item.image} />
                                </ListItemAvatar>
                                <ListItemText primary={`${item.name && capitalize(item.name)} x${(item.quantity || '1')} `} secondary={((item.price || 0) * (item.quantity || 1.0)).toFixed(2)} />
                            </ListItem>
                            <Divider />

                        </React.Fragment>

                    ))}
                    <ListItem>
                        <ListItemText primary={'Subtotal: '} secondary={'$' + totals.subtotal} />
                    </ListItem>
                    <Divider />
                    {delivery && <ListItem>
                        <ListItemText primary={'Delivery: '} secondary={totals.delivery && '$' + totals.delivery.toFixed(2)} />
                    </ListItem>}
                    <ListItem>
                        <ListItemText primary={'Tax: '} secondary={'$' + totals.tax} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <ListItemText primary={'Total: '} secondary={!delivery ? '$' + totals.total : '$' + (totals.total + totals.delivery).toFixed(2)} />
                    </ListItem>
                    <Divider />
                    <ListItem>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Method</FormLabel>
                            <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                <FormControlLabel checked={delivery} onClick={() => setDelivery(true)} value="end" control={<Radio color="primary" />} label="Delivery" />
                                <FormControlLabel checked={!delivery} onClick={() => setDelivery(false)} value="end" control={<Radio color="primary" />} label="Take Out" />
                            </RadioGroup>
                        </FormControl>
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button autoFocus color="primary" variant="contained" onClick={() => handleOpenPayment(true)}>
                    Place Order {`${!delivery ? '$' + totals.total : '$' + (totals.total + totals.delivery).toFixed(2)}`}
                </Button>

            </DialogActions>

            <PaymentModal open={paymentOpen} handleOpen={handleOpenPayment} totals={totals}/>

        </Dialog>

    )
}

export default CheckoutModal;