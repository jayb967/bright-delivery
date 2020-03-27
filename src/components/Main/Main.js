import React, { useState, useContext } from 'react'
import {
    Avatar,
    Container,
    AppBar,
    IconButton,
    Tabs,
    Tab,
    Typography,
    Box,
    Toolbar
} from '@material-ui/core';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { makeStyles } from '@material-ui/styles';

import { withSnackbar } from 'notistack';
import 'firebase/firestore'

import { FirebaseContext } from 'data/Firebase'
import { firebaseDataMap } from 'helpers'
import { TabPanel, ItemList } from 'components'

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
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
    const [tab, setTab] = useState(0);
    const orgname = 'panaderia-mexico' // This should be pulled in from the init from embed

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

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };



    const handleOrg = () => {
        if (!loadingOrg && org) return org.data()
        return {}
    }

    const organization = handleOrg();

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="organization logo">
                        <Avatar alt={organization} src={org && organization.logo} />
                    </IconButton>
                    <Typography variant="h6"
                        className={classes.title}
                    >
                        {!loadingOrg ? organization.name : 'Bright Delivery'}
                    </Typography>
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
            {categories && firebaseDataMap(categories.docs).map((ti, i) => {
                return <TabPanel key={ti.id} value={tab} index={i}>
                    {/* <Container maxWidth='lg'> */}
                    {loadingCats && <div>Loading...</div>}
                    {categories && <ItemList app={firebase} category={ti} style={{ backgroundColor: 'gray' }} />}
                    {/* </Container> */}
                </TabPanel>
            })}
        </div>
    )

}

export default Main;