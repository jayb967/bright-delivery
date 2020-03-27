import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox
} from '@material-ui/core';
import { useCollection } from 'react-firebase-hooks/firestore';
import 'firebase/firestore'

import { firebaseDataMap } from 'helpers'

const useStyles = makeStyles(theme => ({
    root: {
        // display: 'flex',
    },
    formControl: {
        margin: theme.spacing(3),
    },
}));

const OptionsCheck = (props) => {
    const { data, app, handleOption, currOptions } = props;

    const classes = useStyles();
    const optionsQuery = app.firestore()
        .collectionGroup('options')
        .where('active', '==', true)
        .where('items', 'array-contains', data.id)

    const [options, loading, errorOp] = useCollection(
        optionsQuery,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const checked = (name) => {
        let value = false
        if (currOptions.some(e => e.name == name)) {
            value = true
        }

        return value;
    }


    const handleChange = event => {
        // console.log('this is the event', event.target.checked, '-',event.target.value, '-',event.target.name)

        handleOption && handleOption({ name: event.target.name, price: parseFloat(event.target.value), add: event.target.checked })
        // setState({ ...state, [event.target.name]: event.target.checked });
    };

    const removeItems = () => {
        let arr = []
        if (options && !options.empty) {
            arr = firebaseDataMap(options.docs).filter((item) => {
                return item.price <= 0
            })
        }

        return arr;
    }

    const addItems = () => {
        let arr = []
        if (options && !options.empty) {
            arr = firebaseDataMap(options.docs).filter((item) => {
                return item.price > 0
            })
        }

        return arr;
    }

    return (
        <div className={classes.root}>
            {addItems().length > 0 && <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Options</FormLabel>
                <FormGroup>
                    {addItems().map((option, i) => {
                        return <FormControlLabel
                            key={option.name + i}
                            control={<Checkbox
                                checked={checked(option.name)}
                                onChange={handleChange}
                                name={option.name}
                                value={option.price}
                            />
                            }
                            label={option.name + ' ' + (option.price && `+ ${option.price.toFixed(2)}`)}
                        />
                    })}
                </FormGroup>
                <FormHelperText>Check on options you want applied</FormHelperText>
            </FormControl>}
            {removeItems().length > 0 && <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Remove</FormLabel>
                <FormGroup>
                    {removeItems().map((option, i) => {
                        return <FormControlLabel
                            key={option.name + i}
                            control={<Checkbox
                                checked={checked(option.name)}
                                onChange={handleChange}
                                name={option.name}
                                value={option.price} />
                            }
                            label={option.name}
                        />
                    })}
                </FormGroup>
                <FormHelperText>Remove any ingredients</FormHelperText>
            </FormControl>}

        </div>
    );
}

export default OptionsCheck;