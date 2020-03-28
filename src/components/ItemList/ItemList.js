import React, {  useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import { makeStyles } from '@material-ui/styles';

import { withSnackbar } from 'notistack';
import 'firebase/firestore'
import { GridList, GridListTile, useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles';

// import { FirebaseContext } from 'data/Firebase'
import { firebaseDataMap } from 'helpers'
import { Item } from 'components'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    gridContainer: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        flexGrow: 1,
    },
    gridList: {
        width: '100%',
        padding: 20,
        // backgroundColor: 'black'
    },
    gridItem: {
        justifyContent: 'space-around',
        alignItems: 'center',
        textAlign: 'center', 
    }
}));

const ItemList = (props) => {
    const { enqueueSnackbar, addToCart, category, app, updateCart, createNewCart } = props
    const classes = useStyles();
    const theme = useTheme();
    const viewportLg = useMediaQuery(theme.breakpoints.up('sm'));

    const { id } = category

    const itemQuery = app.firestore()
        .collectionGroup('items')
        .where('active', '==', true)
        .where('category', 'array-contains', id)

    const [items, loading, error] = useCollection(
        itemQuery,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const getGridListCols = () => {
    
        if (viewportLg) {
          return 3;
        }
    
        // if (isWidthUp('md', props.width)) {
        //   return 2;
        // }
    
        return 1;
      }

    if (!category.id) return <div>No Items in this section!</div>

    if (items && !items.empty) return (
        <div className={classes.root}>
            <GridList cellHeight='auto' className={classes.gridList}  cols={getGridListCols()}>
                {firebaseDataMap(items.docs).map((item, i) => {
                    return <GridListTile  key={item.id} cols={1}>
                        <Item data={item} category={category.name} app={app} updateCart={updateCart} createNewCart={createNewCart}/>
                    </GridListTile>
                })}
              
            </GridList>
        </div>

    )
    return (<div>No Items in this section... yet!</div>)
}

export default ItemList;