import * as React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Slide,
    Select,
    MenuItem,
    FormControl,
    FormHelperText,
    InputLabel

} from '@mui/material'

import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch } from "store";
import { openSnackbar } from 'store/slices/snackbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});





export default function Dialoug({ open, setOpen, data }) {
    const theme = useTheme();
    const { programs, program, hcps } = data;
   
    const dispatch = useDispatch();


    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            program: "",
            count: '',
            hcp: ''
        },
        validationSchema: Yup.object().shape({
            program: Yup.string().required('Program is required'),
            count: Yup.string().required('Count is required')

        }),
        onSubmit: (values, actions) => {
            let hcpId 
            let id = programs.filter(prog => prog.Name === values.program)[0].id
            if(values.hcp) hcpId = hcps.filter(hcp => hcp.name === values.hcp)[0].id
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/generateReferalCodes`, {
                params: {
                    id,
                    hcpId,
                    numberOfCodes: values.count
                }
            }).then(res => {
                setOpen(false)
                dispatch(
                    openSnackbar({
                        open: true,
                        message: res.data.message,
                        variant: 'alert',
                        alert: {
                            color: 'success'
                        },
                        close: true
                    })
                )
            }).catch(err => {
                setOpen(false)
                dispatch(
                    openSnackbar({
                        open: true,
                        message: err.response.data.message,
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                )
            })
        }
    })

    React.useEffect(() => {
        if (program.length > 0) {
            formik.setFieldValue('program', program[0])
        }

    }, [program])

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
                <DialogTitle>{"Please Fill up the requirments"}</DialogTitle>
                <DialogContent className='flex justify-center'>

                    <form noValidate onSubmit={formik.handleSubmit} >
                        <FormControl className='mt-2'>
                            <InputLabel id="program-label">Program</InputLabel>
                            <Select
                                labelId="program-label"
                                id="program"
                                value={formik.values.program}
                                label="Program"
                                name="program"
                                autoWidth
                                sx={{ minWidth: 200 }}
                                error={Boolean(formik.errors.program && formik.touched.program)}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {programs.map((prog) => (
                                    <MenuItem
                                        key={prog.Name}
                                        value={prog.Name}
                                    >
                                        {prog.Name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.errors.program && formik.touched.program && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {' '}
                                    {formik.errors.program}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>


                        <FormControl className='mt-2 ml-3'>
                            <InputLabel id="hcp-label">HCP</InputLabel>
                            <Select
                                labelId="hcp-label"
                                id="hcp"
                                value={formik.values.hcp}
                                label="HCP"
                                name="hcp"
                                autoWidth
                                sx={{ minWidth: 200 }}
                                
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {hcps.map((user) => (
                                    <MenuItem
                                        key={user.name}
                                        value={user.name}
                                    >
                                        {user.title + "," + user.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            
                        </FormControl>
                        <FormControl className='mt-2 ml-3'>
                            <InputLabel id="count-label">Count</InputLabel>
                            <Select
                                labelId="count-label"
                                id="count"
                                value={formik.values.count}
                                label="Count"
                                error={Boolean(formik.errors.count && formik.touched.count)}
                                sx={{ minWidth: 100 }}
                                name="count"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >

                                <MenuItem key={5} value={5}>5</MenuItem>
                                <MenuItem key={10} value={10}>10</MenuItem>
                                <MenuItem key={15} value={15}>15</MenuItem>
                                <MenuItem key={20} value={20}>20</MenuItem>
                            </Select>
                            {formik.errors.count && formik.touched.count && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {' '}
                                    {formik.errors.count}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>


                    </form>


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={formik.handleSubmit}>Create</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}