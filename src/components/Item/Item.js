import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Modal,
  Backdrop,
  TextField,
  Typography
} from '@material-ui/core';

import { createSubcollectionDocument, updateSubcollectionDocument } from 'data/FirestoreUpdate'

import { OptionsCheck } from 'components'
import { AuthContext, CartContext, OrgContext } from 'context'
import { capitalize } from 'helpers'

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    // height: 300,
    margin: '5%',
    borderRadius: 8,
  },
  action: {
    // height: 300
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function Item(props) {
  const classes = useStyles();
  const { data, app, category } = props

  const [open, setOpen] = useState(false);
  const [orderItem, setOrderItem] = useState()
  const [options, setOptions] = useState([])
  const [quantity, setQuantity] = useState(1)

  const user = useContext(AuthContext);
  const cart = useContext(CartContext);
  const orgCollection = useContext(OrgContext)


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // console.log('this is the cart in the item', cart)

  const createNewCart = async (id, item) => {
    if (!item || !id) return;
    console.log('these are the two items received', id, item)

    const newCart = {
      customerID: id,
      cart: [],
      total: 0
    }

    newCart.cart.push(item)

    const done = await createSubcollectionDocument(app, orgCollection, 'carts', 'activeCarts', id, newCart)

    console.log('creating new cart was done', done)
  }

  const updateCart = (id, item, addToCart) => {
    if (!cart && addToCart) {
      return createNewCart(id, item)
    }

    let mutableArr = cart.cart || []

    if (addToCart && mutableArr.length === 0) {
      const itm = {
        categoryName: category,
        ...data,
        options,
        quantity
      }
      mutableArr.push(itm)
    } else
      if (addToCart && mutableArr.length > 0) {
        const itm = {
          categoryName: category,
          ...data,
          options,
          quantity: 1
        }
        let itemPresent = false;
        for (let i = 0; i < mutableArr.length; i++) {
          if (mutableArr[i].id === item.id && JSON.stringify(item.options) === JSON.stringify(mutableArr[i].options)) {
            mutableArr[i].quantity += 1;
            itm.quantity = mutableArr[i].quantity;
            mutableArr[i] = itm;
            itemPresent = true;
          }
        }
        if (!itemPresent) {
          mutableArr.push(itm)
        }
      } else
        if (!addToCart && mutableArr.length > 0) {
          // Reversed loop to prevent bugs from reaching same one again
          for (let i = mutableArr.length - 1; i >= 0; i--) {
            if (mutableArr[i].id === item.id) {
              if (mutableArr[i].quantity && mutableArr[i].quantity > 1) {
                mutableArr[i].quantity -= 1;
              } else {
                mutableArr.splice(i, 1);
              }
            }
          }
        }

    const getTotal = () => {
      let total = 0.0
      for (let i = 0; i < mutableArr.length; i++) {
        const product = mutableArr[i];
        total += product.quantity * product.price
      }

      return total;
    }

    const updatedCart = {
      customerID: id,
      total: getTotal(),
      cart: mutableArr
    }


    updateSubcollectionDocument && updateSubcollectionDocument(app, orgCollection, 'carts', 'activeCarts', id, updatedCart)
  }

  const addToCart = () => {
    const item = {
      categoryName: category,
      ...data,
      options,
      quantity: 1,
    }
    if (!user) {
      app.auth().signInAnonymously()
        .then((usr) => {
          if (!cart || (cart && cart.cart.length === 0)) {
            createNewCart(usr.user.uid, item)
          } else {
            //update the cart
          }

        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return alert('There was an error adding this to your order, please try again!')
          console.log('There was an  error signing in the user', errorCode, errorMessage)
          // ...
        });
    } else {
      updateCart(user.uid, item, true)
    }
  }

  const handleOption = (option) => {
    let arr = [...options]
    if (option.add) {
      delete option.add
      arr.push(option)
      setOptions(arr)
    } else {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == option.name) {
          arr.splice(i, 1);
          break;
        }
      }
      setOptions(arr)
    }
  }

  return (
    <Card className={classes.root} elevation={1}>
      <CardActionArea className={classes.action} onClick={() => handleOpen()}>
        <CardMedia
          component="img"
          alt={data.name}
          height="140"
          image={data.image}// "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
          title={data.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {data.name ? capitalize(data.name) : 'The Name of item'}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {data.description || 'This plate is soo good, it is different than the picture but you get the point.'}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="large" color="secondary" onClick={() => handleOpen()}>
          Add to order ${(data && data.price) ? parseFloat(data.price).toFixed(2) : ''}
        </Button>
      </CardActions>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{data.name ? capitalize(data.name) : ''}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {data.description}
          </DialogContentText>
          <br />
          <DialogContentText>
            Do you want to add or remove anything to your order?
          </DialogContentText>
          <OptionsCheck handleOption={handleOption} currOptions={options} {...props} />
          {/* <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addToCart} color="primary">
            Add to Order
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
}