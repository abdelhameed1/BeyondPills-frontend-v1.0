import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import { register } from 'store/slices/auth';
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
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';


import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


// ===========================|| FIREBASE - REGISTER ||=========================== //

const HCPRegister = ({ ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    const dispatch = useDispatch();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = React.useState(false);
    
    const { loading } = useSelector((state) => state.auth);

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState();
  

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

    return (
        <>
            <Formik
                initialValues={{
                    userType: 'HCP',
                    email: '',
                    password: '',
                    username: '',
                    title: '',
                    specialty: '',
                    licenseNumber: '',
                    phoneNumber: '',
                    address: '',
                    area: '',
                    degree: '',
                    practiceYears: '',
                    areaOfInterest: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    username: Yup.string().max(255).required('Name is required'),
                    specialty: Yup.string().max(255).required('Specialty/Area of Practice is required'),
                    title: Yup.string().max(255).required('Title is required'),
                    area: Yup.string().max(255).required("Area is required"),
                    phoneNumber: Yup.number().required('Phone is required'),

                })}
                onSubmit={async (values, { setFieldError}) => {
                    try {
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
                                )
                                setTimeout(() => {
                                    navigate('/', { replace: true });
                                }, 1500);

                            })
                            .catch((rejectedValueOrSerializedError) => {
                                setFieldError('email', rejectedValueOrSerializedError);
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
                    } catch (err) {
                        console.error(err);
                        
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    margin="normal"
                                    name="username"
                                    type="text"
                                    value={values.username}
                                    error={Boolean(touched.username && errors.username)}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                                {touched.username && errors.username && (
                                    <FormHelperText error id="standard-weight-helper-text-password-register">
                                        {errors.username}
                                    </FormHelperText>
                                )}
                            </Grid>

                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Professional Title (e.g., Dr., Nurse, Pharmacist)"
                                margin="normal"
                                name="title"
                                type="text"
                                value={values.title}
                                error={Boolean(touched.title && errors.title)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                            {touched.title && errors.title && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.title}
                                </FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Specialty/Area of Practice"
                                margin="normal"
                                name="specialty"
                                type="text"
                                value={values.specialty}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={Boolean(touched.specialty && errors.specialty)}
                                sx={{ ...theme.typography.customInput }}
                            />
                            {touched.specialty && errors.specialty && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.specialty}
                                </FormHelperText>
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Professional License Number (optional) "
                                margin="normal"
                                name="licenseNumber"
                                type="text"
                                value={values.licenseNumber}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                        </Grid>

                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-register">Email Address</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-register"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-register">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-register"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                label="Password"
                                onBlur={handleBlur}
                                onChange={(e) => {
                                    handleChange(e);
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
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {strength !== 0 && touched.password && (
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
                                value={values.phoneNumber}
                                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                            {touched.phoneNumber && errors.phoneNumber && (
                                <FormHelperText error id="standard-weight-helper-text--register">
                                    {errors.phoneNumber}
                                </FormHelperText>
                            )}
                        </Grid>
                        {touched.contactPersonTitle && errors.contactPersonTitle && (
                            <FormHelperText error id="standard-weight-helper-text-password-register">
                                {errors.contactPersonTitle}
                            </FormHelperText>
                        )}
                        <Grid item >
                            <TextField
                                fullWidth
                                label="Work Address (Institution/Clinic/Hospital)  (optional)"
                                margin="normal"
                                name="address"
                                type="text"
                                value={values.address}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />

                        </Grid>

                        <Grid item >
                            <TextField
                                fullWidth
                                label="Area"
                                margin="normal"
                                name="area"
                                type="text"
                                multiline
                                rows={4}
                                value={values.area}
                                error={Boolean(touched.area && errors.area)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                            {touched.area && errors.area && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.area}
                                </FormHelperText>
                            )}
                        </Grid>

                        <Grid item >
                            <TextField
                                fullWidth
                                label="Highest Degree or Qualification (Optional)"
                                margin="normal"
                                name="degree"
                                type="text"
                                multiline
                                rows={3}
                                value={values.degree}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                label="Years of Practice (Optional)"
                                margin="normal"
                                name="practiceYears"
                                type="number"
                                value={values.practiceYears}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                label="Areas of Interest (optional for targeted information)"
                                margin="normal"
                                name="areaOfInterest"
                                type="text"
                                multiline
                                rows={3}
                                value={values.areaOfInterest}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                        </Grid>


                       
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
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
                                    color='primary'
                                    className='btn'
                                >
                                    Sign up
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default HCPRegister;
