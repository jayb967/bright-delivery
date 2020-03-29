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

import {
    SquarePaymentForm,
    CreditCardNumberInput,
    CreditCardExpirationDateInput,
    CreditCardPostalCodeInput,
    CreditCardCVVInput,
    CreditCardSubmitButton
} from 'react-square-payment-form'

const PaymentModal = (props) => {
    const {open, handleOpen, totals} = props
    const [errors, setErrors] = useState([])
    const SANDBOX_APPLICATION_ID = 'sandbox-sq0idb-WnQBBPpnuZi4InGl8qYNbw'
    const SANDBOX_LOCATION_ID = 'XJ1AX7RSFMV1G'

    const handleClose = () => {
        handleOpen(false)
    }

    const cardNonceResponseReceived = (errors, nonce, cardData, buyerVerificationToken) => {
        if (errors) {
            setErrors(errors.map(error => error.message))
            return
        }

        setErrors([])
        alert("nonce created: " + nonce + ", buyerVerificationToken: " + buyerVerificationToken)
    }

    const createVerificationDetails = () => {
        return {
            amount: '100.00',
            currencyCode: "USD",
            intent: "CHARGE",
            billingContact: {
                familyName: "Smith",
                givenName: "John",
                email: "jsmith@example.com",
                country: "GB",
                city: "London",
                addressLines: ["1235 Emperor's Gate"],
                postalCode: "SW7 4JA",
                phone: "020 7946 0532"
            }
        }

    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <SquarePaymentForm
                    sandbox={true}
                    applicationId={SANDBOX_APPLICATION_ID}
                    locationId={SANDBOX_LOCATION_ID}
                    cardNonceResponseReceived={cardNonceResponseReceived}
                    createVerificationDetails={createVerificationDetails}
                >
                    <fieldset className="sq-fieldset">
                        <CreditCardNumberInput />
                        <div className="sq-form-third">
                            <CreditCardExpirationDateInput />
                        </div>

                        <div className="sq-form-third">
                            <CreditCardPostalCodeInput />
                        </div>

                        <div className="sq-form-third">
                            <CreditCardCVVInput />
                        </div>
                    </fieldset>

                    <CreditCardSubmitButton style={{ backgroundColor: 'red' }}>
                        Pay ${totals.total}
                    </CreditCardSubmitButton>

                </SquarePaymentForm>

                <div className="sq-error-message">
                    {errors.map(errorMessage =>
                        <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )

}

export default PaymentModal