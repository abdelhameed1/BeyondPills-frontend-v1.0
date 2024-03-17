import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from 'store/slices/auth';
import { useNavigate } from 'react-router-dom';


// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    Select,
    MenuItem,
    useMediaQuery
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { parseNationalId } from "parse-national-id";
// third party
import * as Yup from 'yup';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';


import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


// ===========================|| FIREBASE - REGISTER ||=========================== //

const PatientRegister = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = React.useState(false);


    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState();
    const [date, setDate] = React.useState(dayjs(new Date()));
    const { loading, message } = useSelector((state) => state.auth);


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicatorNumFunc(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);


    const formik = useFormik({
        initialValues: {
            userType: "patient",
            email: '',
            nationalId: '',
            password: '',
            firstName: '',
            gender: '',
            phoneNumber: "",
            //birthdate: date.format('YYYY-MM-DD'),
            lastName: '',
            address: '',
            medicalHistory: '',
            currentMedications: '',
            allergies: '',
            insuranceProvider: '',

        },
        validationSchema: Yup.object().shape({
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            password: Yup.string().max(255).required('Password is required'),
            gender: Yup.string().max(255).required('Gender is required'),
            firstName: Yup.string().max(255).required('First Name is required'),
            lastName: Yup.string().max(255).required('Last Name is required'),
            phoneNumber: Yup.number().required('Phone is required'),
        }),
        onSubmit: (values, actions) => {
            try {
                values.username = `${values.firstName} ${values.lastName}`
                const nationalId = parseNationalId(`${values.nationalId}`);
                if (nationalId == null) actions.setFieldError('nationalId', 'Invalid National ID');
                else {
                    dispatch(register(values)).unwrap()
                        .then((originalPromiseResult) => {
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: 'Your registration has been successfully completed.',
                                    variant: 'alert',
                                    alert: {
                                        color: 'success'
                                    },
                                    close: false
                                })
                            );
                            setTimeout(() => {
                                navigate('/', { replace: true });
                            }, 1500);
                        })
                        .catch((rejectedValueOrSerializedError) => {
                            if(rejectedValueOrSerializedError.includes("email")) actions.setFieldError('email', rejectedValueOrSerializedError);
                            if(rejectedValueOrSerializedError.includes("National")) actions.setFieldError('nationalId', rejectedValueOrSerializedError);
                            
                            dispatch(
                                openSnackbar({
                                    open: true,
                                    message: rejectedValueOrSerializedError,
                                    variant: 'default',
                                    alert: {
                                        color: 'alert'
                                    },
                                    close: true
                                })
                            );
                        })
                }
            } catch (e) {
                console.log(e);
            }


        }
    })


    return (
        <>

            <form noValidate onSubmit={formik.handleSubmit} >
                <Grid container spacing={matchDownSM ? 0 : 2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="First Name"
                            margin="normal"
                            name="firstName"
                            type="text"
                            value={formik.values.firstName}
                            error={Boolean(formik.touched.firstName && formik.errors.firstName)}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            sx={{ ...theme.typography.customInput }}
                        />
                        {formik.errors.firstName && formik.touched.firstName && (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                {' '}
                                {formik.errors.firstName}{' '}
                            </FormHelperText>
                        )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            margin="normal"
                            name="lastName"
                            type="text"
                            value={formik.values.lastName}
                            error={Boolean(formik.touched.lastName && formik.errors.lastName)}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            sx={{ ...theme.typography.customInput }}
                        />
                        {formik.errors.lastName && formik.touched.lastName && (
                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                {' '}
                                {formik.errors.lastName}{' '}
                            </FormHelperText>
                        )}
                    </Grid>
                </Grid>
                <Grid container >
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date of Birth"
                                value={date}
                                name="bithdate"
                                onChange={(newValue) => { setDate(newValue) }}
                            />

                        </LocalizationProvider>


                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl sx={{ minWidth: "90%" }}>
                            <InputLabel id="age-select">Gender</InputLabel>
                            <Select
                                fullWidth
                                labelId="age-select"
                                id="gender"
                                name="gender"

                                value={formik.values.gender}
                                error={Boolean(formik.touched.gender && formik.errors.gender)}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                label="Gender"
                            >

                                <MenuItem value={"Male"}>Male</MenuItem>
                                <MenuItem value={"Female"}>Female</MenuItem>

                            </Select>
                            {formik.errors.gender && formik.touched.gender && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {' '}
                                    {formik.errors.gender}{' '}
                                </FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                </Grid>

                <FormControl fullWidth error={Boolean(formik.touched.email && formik.errors.email)} sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-email-register"
                        type="email"
                        value={formik.values.email}
                        name="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        inputProps={{}}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <FormHelperText error id="standard-weight-helper-text--register">
                            {formik.errors.email}
                        </FormHelperText>
                    )}
                </FormControl>
                <Grid item >
                    <TextField
                        fullWidth
                        label="National ID"
                        margin="normal"
                        name="nationalId"
                        type="number"
                        error={Boolean(formik.touched.nationalId && formik.errors.nationalId)}
                        value={formik.values.nationalId}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        sx={{ ...theme.typography.customInput }}
                    />
                    {formik.touched.nationalId && formik.errors.nationalId && (
                        <FormHelperText error id="standard-weight-helper-text--register">
                            {formik.errors.nationalId}
                        </FormHelperText>
                    )}
                </Grid>
                <FormControl
                    fullWidth
                    error={Boolean(formik.touched.password && formik.errors.password)}
                    sx={{ ...theme.typography.customInput }}
                >
                    <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password-register"
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.password}
                        name="password"
                        label="Password"
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                            formik.handleChange(e);
                            changePassword(e.target.value);
                        }}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    size="large"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        inputProps={{}}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <FormHelperText error id="standard-weight-helper-text-password-register">
                            {formik.errors.password}
                        </FormHelperText>
                    )}
                </FormControl>

                {strength !== 0 && formik.touched.password && (
                    <FormControl fullWidth>
                        <Box sx={{ mb: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Box
                                        style={{ backgroundColor: level?.color }}
                                        sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography variant="subtitle1" fontSize="0.75rem">
                                        {level?.label}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </FormControl>
                )}


                <Grid item >
                    <TextField
                        fullWidth
                        label="Phone Number"
                        margin="normal"
                        name="phoneNumber"
                        type="number"
                        value={formik.values.phoneNumber}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        sx={{ ...theme.typography.customInput }}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                        <FormHelperText error id="standard-weight-helper-text--register">
                            {formik.errors.phoneNumber}
                        </FormHelperText>
                    )}
                </Grid>

                <Grid item >
                    <TextField
                        fullWidth
                        label="Address (Optional)"
                        margin="normal"
                        name="address"
                        type="text"
                        value={formik.values.address}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        sx={{ ...theme.typography.customInput }}
                    />

                </Grid>

                <Grid item >
                    <TextField
                        fullWidth
                        label="Medical History Summary (Optional)"
                        margin="normal"
                        name="medicalHistory"
                        type="text"
                        multiline
                        rows={4}
                        value={formik.values.medicalHistory}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        sx={{ ...theme.typography.customInput }}
                    />
                </Grid>
                <Grid item >
                    <TextField
                        fullWidth
                        label="Current Medications (optional)"
                        margin="normal"
                        name="currentMedications"
                        type="text"
                        value={formik.values.currentMedications}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        sx={{ ...theme.typography.customInput }}
                    />
                </Grid>
                <Grid item >
                    <TextField
                        fullWidth
                        label="Allergies (optional)"
                        margin="normal"
                        name="allergies"
                        type="text"
                        value={formik.values.allergies}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        sx={{ ...theme.typography.customInput }}
                    />
                </Grid>




                {formik.errors.submit && (
                    <Box sx={{ mt: 3 }}>
                        <FormHelperText error>{formik.errors.submit}</FormHelperText>
                    </Box>
                )}

                <Box sx={{ mt: 2 }}>
                    <AnimateButton>
                        <Button
                            disableElevation
                            disabled={loading}
                            fullWidth
                            size="large"
                            type="submit"
                            variant='contained'

                            className='btn'
                        >
                            Sign up
                        </Button>
                    </AnimateButton>
                </Box>
            </form>


        </>

    );
};

export default PatientRegister;
