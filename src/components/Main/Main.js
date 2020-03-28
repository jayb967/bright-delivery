import React, { useState, useContext } from 'react'
import {
    Avatar,
    Container,
    CssBaseline,
    AppBar,
    IconButton,
    Badge,
    Divider,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tabs,
    Tab,
    Typography,
    Box,
    Toolbar,
    useMediaQuery,
    Button
} from '@material-ui/core';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { makeStyles } from '@material-ui/styles';
import { useTheme } from '@material-ui/core/styles';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

import { withSnackbar } from 'notistack';
import 'firebase/firestore'

import { FirebaseContext } from 'data/Firebase'
import { firebaseDataMap } from 'helpers'
import { TabPanel, ItemList, CheckoutButton } from 'components'
import { AuthContext, OrgContext, CartContext } from 'context'

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3)
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    root: {
        display: 'flex',
        // padding: theme.spacing(3)
    },
    tabs: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        flexGrow: 1,
        fontWeight: 600,
        fontSize: '1.5em'
    },
}));

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const Main = (props) => {
    const { enqueueSnackbar } = props
    const classes = useStyles();
    const firebase = useContext(FirebaseContext)
    const user = useContext(AuthContext);
    const orgname = useContext(OrgContext);
    const cart = useContext(CartContext);
    const [tab, setTab] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme()
    const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

    // const orgname = 'panaderia-mexico' // This should be pulled in from the init from embed

    const categoryQuery = firebase.firestore().collection(orgname).doc('menu').collection('categories').where('active', '==', true).orderBy('position', 'asc')

    const [categories, loadingCats, errorCats] = useCollection(
        categoryQuery,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [org, loadingOrg, errorOrg] = useDocument(
        firebase.firestore().doc(`${orgname}/organization`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleOrg = () => {
        if (!loadingOrg && org) return org.data()
        return {}
    }

    const organization = handleOrg();

    const getCartQty = () => {
        let qty = 0
        if (cart && cart.cart.length) {
            cart.cart.forEach((itm) => {
                if (itm.quantity) {
                    qty += itm.quantity
                }

            })
        }
        return qty;
    }

    const bottomChkOutButton = () => {

    }

    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {cart && cart.cart.length && cart.cart.map((text, index) => (
                    <React.Fragment>
                    <ListItem button key={text.id + index}>
                        <ListItemText primary={`x${text.quantity} ${text.name}`} secondary={text.options.length > 0 && 'Options: ' + text.options.map((itm) => `\n -${itm.name} +  ${itm.price} `)} />
                    </ListItem>
                    {index !== cart.cart.length && <Divider />}
                    </React.Fragment>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem button key={'Subtotal'}>
                    <ListItemText primary={'Subtotal: '} secondary={cart && cart.total && `$${cart.total.toFixed(2)}`} />
                </ListItem>
                <ListItem button key={'Tax'}>
                    <ListItemText primary={'Tax: '} secondary={(organization && organization.taxRate) && (cart && cart.total) ? `$${(cart.total * (organization.taxRate / 100)).toFixed(2)}` : ''} />
                </ListItem>
                <ListItem button key={'Total'}>
                    <ListItemText primary={'Total: '} secondary={cart && cart.total && `$${cart.total.toFixed(2)}`} />
                </ListItem>
            </List>
        </div>
    );

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" color="default" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="organization logo">
                        <Avatar alt={organization} src={org && organization.logo} />
                    </IconButton>
                    <Typography variant="h6"
                        className={classes.title}
                    >
                        {!loadingOrg ? organization.name : 'Bright Delivery'}
                    </Typography>
                    {cart && cart.cart.length > 0 && <IconButton edge="end" className={classes.menuButton} onClick={() => handleDrawerToggle()} color="inherit" aria-label="view-cart">
                        <Badge badgeContent={getCartQty()} color="secondary">
                            <ShoppingBasketIcon />
                        </Badge>

                    </IconButton>}
                </Toolbar>
                {categories && <Tabs
                    value={tab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {firebaseDataMap(categories.docs).map((ti, i) => {
                        return <Tab key={ti.id} label={ti.name} {...a11yProps(i)} />
                    })
                    }
                </Tabs>
                }

            </AppBar>
            <Drawer
                variant="temporary"
                anchor='right'
                open={mobileOpen}
                onClose={handleDrawerToggle}
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                <div className={classes.toolbar} />
                {drawer}
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {categories && firebaseDataMap(categories.docs).map((ti, i) => {
                    return <TabPanel key={ti.id} value={tab} index={i}>
                        {loadingCats && <div>Loading...</div>}
                        {categories && <ItemList app={firebase} category={ti} style={{ backgroundColor: 'gray' }} />}
                    </TabPanel>
                })}
                <CheckoutButton/>
                
            </main>
            
            
           

        </div>
    
    )

}

export default Main;