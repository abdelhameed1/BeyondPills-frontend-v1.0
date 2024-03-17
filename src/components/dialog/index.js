import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    ToggleButton,
    ToggleButtonGroup,
    TextField,
    FormHelperText,
    Typography
} from '@mui/material'

import axios from 'axios';

import { useSelector, useDispatch } from "store";
import { openSnackbar } from 'store/slices/snackbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Dialoug({ open, setOpen, data }) {

    const { userID, programID } = data;
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [choice, setChoice] = React.useState("request");
    const [error, setError] = React.useState('');
    const [ref, setRef] = React.useState("");
    const enroll = (programID, userID, referal) => {
        try {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/enroll`, {
                programID,
                userID,
                referal
            }, {
                headers: {
                    'Authorization': `Bearer ${user.jwt}`
                }
            }
            )
                .then((response) => {
                    setOpen(false)
                    dispatch(
                        openSnackbar({
                            open: true,
                            message: response.data.message,
                            variant: 'default',
                            alert: {
                                color: 'success'
                            },
                            close: true
                        })
                    )
                })
                .catch((error) => {
                    if (referal != '') setError(error.response.data.error.message)
                    else dispatch(
                        openSnackbar({
                            open: true,
                            message: error.response.data.error.message,
                            variant: 'alert',
                            alert: {
                                severity: "error",
                                variant: "filled",
                                color: 'secondary'
                            },
                            close: true
                        })
                    )
                })
        } catch (error) {
            console.log(error)

        }
    }
    const handleChange = (event, value,) => {
        setChoice(value);

    };
    const handleEnroll = () => {
        if (ref === "" && choice === "referal") {
            setError("Please enter referal code")
            return
        }
        if (choice === "referal" && ref !== "") {
            enroll(programID, userID, ref)
        } else
            if (choice === "request") {
                enroll(programID, userID, "")
            }

    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                style={{ height: "75vh" }}
                fullWidth={true}
                maxWidth="sm"
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"What type of enrollment do you prefer"}</DialogTitle>
                <DialogContent className='justify-center' >
                    <>
                    <ToggleButtonGroup
                            color="primary"
                            value={choice}
                            exclusive
                            className='mb-3 justify-center w-full'
                            defaultValue={"referal"}
                            onChange={handleChange}
                        >
                            <ToggleButton value="referal">Referal Code</ToggleButton>
                            <ToggleButton value="request">Request</ToggleButton>
                        </ToggleButtonGroup>
                        <DialogContentText id="alert-dialog-slide-description" className='flex items-center flex-col'>
                        {
                            choice === "referal" ? (
                                <>
                                    <TextField
                                        id="referal"
                                        label="Referal code"
                                        variant="outlined"
                                        className='w-75'
                                        value={ref}
                                        error={error }
                                        onChange={(e) => setRef(e.target.value)}
                                    />
                                    {
                                        error  && (
                                            <FormHelperText error>
                                                {error}
                                            </FormHelperText>
                                        )
                                    }
                                </>
                            ) : (
                                <Typography
                                    variant="caption"
                                    fontSize="16px"
                                    textAlign={'center'}
                                >
                                    Your enrollment request will be sent to the program contracts for acceptance ,
                                    and you will be notified once it is accepted
                                </Typography>
                            )
                        }


                    </DialogContentText>
                    </>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleEnroll}>Enroll</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}