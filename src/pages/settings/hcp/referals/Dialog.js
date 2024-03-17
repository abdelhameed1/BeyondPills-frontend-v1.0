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
import { useSelector, useDispatch } from "store";
import { openSnackbar } from 'store/slices/snackbar';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});





export default function Dialoug({ open, setOpen }) {
    const theme = useTheme();

    const { user } = useSelector((state) => state.auth);
    const [companies, setCompanies] = React.useState([]);
    const [programs, setPrograms] = React.useState([]);
    const dispatch = useDispatch();


    const handleClose = () => {
        setOpen(false);
    };

    const formik = useFormik({
        initialValues: {
            company: "",
            program: "",
            count: '',

        },
        validationSchema: Yup.object().shape({
            program: Yup.string().required('Program is required'),
            count: Yup.string().required('Count is required')

        }),
        onSubmit: (values, actions) => {
            let program = programs.filter(p => p.Name === values.program)[0]

            axios.post(`${process.env.REACT_APP_BACKEND_URL}/referal-requests` , {
                data :{
                    number_of_codes: values.count,
                    program,
                    hcp: user,
                    status: 'pending'
                }

            }).then(res => {
                setOpen(false)
                dispatch(
                    openSnackbar({
                        open: true,
                        message: "Request has been sent",
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
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
            params: {
                filters: {
                    userType: 'company'
                }

            }
        }).then(res => {
            setCompanies(res.data)
        })

    }, [])

    React.useEffect(() => {
        if (formik.values.company.length > 0) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/programs`, {
                params: {
                    filters: {
                        user: {
                            username: formik.values.company
                        }
                    },
                    populate: ['user']
                }
            }).then(res => {
                if (res.data.data.length > 0) {
                    let r = []
                    res.data.data.map(program => {
                        r.push({
                            id: program.id, Name: program.attributes.Name
                        })

                    })
                    setPrograms(r)
                } else setPrograms('No Programs Found')

            })
        }
    }, [formik.values.company])
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
                            <InputLabel id="program-label">Compnay</InputLabel>
                            <Select
                                labelId="program-label"
                                id="company"
                                value={formik.values.company}
                                label="Company"
                                name="company"
                                autoWidth
                                sx={{ minWidth: 200, marginRight: 2 }}
                                error={Boolean(formik.errors.company && formik.touched.company)}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {companies.map((company) => (
                                    <MenuItem
                                        key={company.username}
                                        value={company.username}
                                    >
                                        {company.username}
                                    </MenuItem>
                                ))}
                            </Select>
                            {formik.errors.company && formik.touched.company && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {' '}
                                    {formik.errors.company}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>
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
                                disabled={formik.values.company.length === 0}
                                error={Boolean(formik.errors.program && formik.touched.program)}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                {Array.isArray(programs) ? programs.map((program) => (
                                    <MenuItem
                                        key={program.Name}
                                        value={program.Name}
                                    >
                                        {program.Name}
                                    </MenuItem>
                                )) :
                                    <MenuItem
                                        key={"none"}
                                        value={'none'}
                                    >
                                        No Programs Found
                                    </MenuItem>}
                            </Select>
                            {formik.errors.program && formik.touched.program && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {' '}
                                    {formik.errors.program}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>



                        <FormControl className='mt-2 ml-3'>
                            <InputLabel id="count-label">Count</InputLabel>
                            <Select
                                labelId="count-label"
                                id="count"
                                value={formik.values.count}
                                label="Count"
                                error={Boolean(formik.errors.count && formik.touched.count)}
                                disabled={Boolean(formik.values.program.length === 0 || formik.values.company.length === 0 || formik.values.program === 'none')}
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
                    <Button
                        onClick={formik.handleSubmit}
                        disabled={Boolean(formik.values.program.length === 0 || formik.values.company.length === 0 || formik.values.program === 'none')}
                    >Create</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}