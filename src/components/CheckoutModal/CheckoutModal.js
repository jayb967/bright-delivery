import React, { useContext, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import {
    AppBar,
    Avatar,
    Dialog,
    DialogContent,
    DialogActions,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    IconButton,
    Toolbar,
    Typography,
    TextField,
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
import { CartContext, AuthContext, OrgContext } from 'context'
import { capitalize, handleUserLink } from 'helpers'
import { PaymentModal, ContactInfo } from 'components'
import { FirebaseContext } from 'data/Firebase'


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
    const user = useContext(AuthContext);
    const app = useContext(FirebaseContext);
    const org = useContext(OrgContext);

    const orderOptions = ['take-out', 'delivery', 'dine-in']

    const [paymentOpen, setPaymentOpen] = useState(false)
    const [type, setType] = useState(orderOptions[0])
    const [signInopen, setSignInopen] = useState(false)
    const [anonUser, setAnonUser] = useState(null)
    const [step, setStep] = useState(0)
    const [cashPickup, setCashPickup] = useState(false)
    const [contact, setContact] = useState({})

    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        autoUpgradeAnonymousUsers: true,
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        // signInSuccessUrl: '/signedIn',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            app.auth.GoogleAuthProvider.PROVIDER_ID,
            app.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // signInFailure callback must be provided to handle merge conflicts which
            // occur when an existing credential is linked to an anonymous user.
            signInFailure: (error) => {
                // For merge conflicts, the error.code will be
                // 'firebaseui/anonymous-upgrade-merge-conflict'.
                if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                    return Promise.resolve();
                }
                // The credential the user tried to sign in with.
                var cred = error.credential;
                var cart = null; // temp data for current anon user

                return app.firestore()
                    .collection(org)
                    .doc('carts')
                    .collection('activeCarts')
                    .doc(anonUser.uid).get()
                    .then((snap) => {
                        // Copy cart from current anonymous user
                        cart = snap.data()
                        return app.auth().signInWithCredential(cred)
                    })
                    .then((usr) => {
                        if (cart && cart.customerID) {
                            cart.customerID = usr.user.uid
                        }

                        handleUserLink(app, usr.user.email, usr.user.uid, org)
                        
                        return app.firestore()
                        .collection(org)
                        .doc('carts')
                        .collection('activeCarts')
                        .doc(usr.user.uid)
                        .set(
                            cart, { merge: true })
                        
                    })
                    .then(() => {
                        return app
                        .firestore()
                        .collection(org)
                        .doc('carts')
                        .collection('activeCarts')
                        .doc(anonUser.uid).delete()
                    })
                    .then(() => {
                        if (anonUser) {
                            anonUser.delete()
                        }
                        // Clean up
                        cart = null
                        setAnonUser(null)
                        handleSignInClose()
                        setStep(1)
                    })


                // Finish sign-in after data is copied.
                // return app.auth().signInWithCredential(cred);
            },
            signInSuccessWithAuthResult: (currentUser, credential,) => {
                // Creating new user Doc and deleting previous
                handleUserLink(app, currentUser.user.email, currentUser.user.uid, org)
                handleSignInClose()
                setStep(1)
                return false;
            },
            uiShown: () => {
                // The widget is rendered.
                // Hide the loader.
                // document.getElementById('loader').style.display = 'none';
            }
        }
    };

    const returnDisabled = () => {

        if (type === orderOptions[1] && step === 1) {
            if (!contact) return true
            if (!contact.address) return true
            if (!contact.city) return true
            if (!contact.lastname) return true
            if (!contact.name) return true
            if (!contact.zip) return true
            if (!contact.state) return true
        } else
            if (type !== orderOptions[1] && step === 1) {
                if (!contact) return true
                if (!contact.lastname) return true
                if (!contact.name) return true
            }

        return false
    }

    const updateContact = (dic) => {
        const newDic = { ...contact, ...dic }
        setContact(newDic)
    }

    const handleClickOpen = () => {
        handleChkDia(true);
    };

    const handleClose = () => {
        handleChkDia(false);
    };

    const handleSignInClose = () => {
        setSignInopen(false)
    }

    const handleOpenPayment = (val) => {
        if (!user || (user && user.isAnonymous)) {
            setAnonUser(user) // setting reference to anon user
            setSignInopen(true)
        } else {
            setStep(1)
        }
        // setPaymentOpen(val)
    }


    return (
        <Dialog fullWidth maxWidth='md' open={open} onClose={handleClose} TransitionComponent={Transition}>
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
                <Grid container>
                    <Grid item xs={12} sm={12} md={6} className={classes.textCarouselContainer}>
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
                        </List>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} className={classes.textCarouselContainer}>
                        <List>
                            {((step === 0) || (type !== orderOptions[1] && step == 1)) && <React.Fragment>
                                <ListItem>
                                    <ListItemText primary={'Subtotal: '} secondary={'$' + totals.subtotal} />
                                </ListItem>
                                <Divider />
                                {type === orderOptions[1] && <ListItem>
                                    <ListItemText primary={'Delivery: '} secondary={totals.delivery && '$' + totals.delivery.toFixed(2)} />
                                </ListItem>}
                                <ListItem>
                                    <ListItemText primary={'Tax: '} secondary={'$' + totals.tax} />
                                </ListItem>
                                <Divider />
                                <ListItem>
                                    <ListItemText primary={'Total: '}
                                        secondary={type !== orderOptions[1]
                                            ? '$' + totals.total
                                            : '$' + (totals.total + totals.delivery).toFixed(2)} />
                                </ListItem>
                                <Divider />



                            </React.Fragment>}
                            {step == 0 && <ListItem>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Method</FormLabel>
                                    <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                        <FormControlLabel
                                            checked={type === orderOptions[1]}
                                            onClick={() => setType(orderOptions[1])}
                                            value="end"
                                            control={<Radio color="primary" />}
                                            label="Delivery" />

                                        <FormControlLabel
                                            checked={type === orderOptions[0]}
                                            onClick={() => setType(orderOptions[0])}
                                            value="end"
                                            control={<Radio color="primary" />}
                                            label="Take Out" />
                                    </RadioGroup>
                                </FormControl>
                            </ListItem>}
                            {console.log('this is the delivery', type)}

                            {step === 1 && <ListItem>
                                <div>
                                    <h2>{type !== orderOptions[1] ? 'What is your name?' : 'Where should we deliver?'}</h2>
                                    <ContactInfo data={contact} updateDic={updateContact} type={type} />
                                </div>

                            </ListItem>}
                        </List>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
                {step == 1 && <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => setStep(0)}
                >
                    Back
                </Button>}
                <Button
                    autoFocus
                    color="primary"
                    disabled={returnDisabled()}
                    variant="contained"
                    onClick={() => handleOpenPayment(true)}>
                    {step == 0 ? 'Continue' : 'Place Order'} {`${type !== orderOptions[1] ? '$' + totals.total : '$' + (totals.total + totals.delivery).toFixed(2)}`}
                </Button>

            </DialogActions>

            <PaymentModal open={paymentOpen} handleOpen={handleOpenPayment} totals={totals} />
            <Dialog open={signInopen} onClose={handleSignInClose} >
                <DialogContent style={{ minWidth: 300 }}>
                    <StyledFirebaseAuth uiCallback={ui => ui.disableAutoSignIn()} uiConfig={uiConfig} firebaseAuth={app.auth()} />
                </DialogContent>
            </Dialog>

        </Dialog>

    )
}

export default CheckoutModal;