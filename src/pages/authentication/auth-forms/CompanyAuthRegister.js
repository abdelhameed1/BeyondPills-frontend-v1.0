import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from 'store/slices/auth';

// material-ui
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
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
import axios from 'axios';
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';


import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


// ===========================|| FIREBASE - REGISTER ||=========================== //
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const CompanyRegister = ({ uploadProgress, setUploadProgress, ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [showPassword, setShowPassword] = React.useState(false);


    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState();

    const { loading } = useSelector((state) => state.auth);

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
                    userType: "company",
                    email: '',
                    password: '',
                    username: '',
                    regNumber: '',
                    phoneNumber: "",
                    contactPersonName: '',
                    contactPersonTitle: '',
                    description: '',
                    address: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    contactPersonName: Yup.string().max(255).required('Contact Name is required'),
                    username: Yup.string().max(255).required('Company Name is required'),
                    contactPersonTitle: Yup.string().max(255).required('Contact Title is required'),
                    description: Yup.string().max(255).required("Description is required"),
                    address: Yup.string().max(255).required("Address is required"),
                    phoneNumber: Yup.number().required('Phone is required'),

                })}
                onSubmit={async (values, { setFieldError }) => {
                    let refinedData = _.cloneDeep(values)
                    try {
                       const  createProgram = (data) => {
                            dispatch(register(data)).unwrap()
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
                        }

                        const uploadData = async () => {
                            let formData = new FormData()
                            formData.append('files', values.logo)
                            let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, formData, {
                                onUploadProgress: (eventProgress) => {

                                    setUploadProgress(
                                        Math.round((eventProgress.loaded * 100) / eventProgress.total)
                                    );

                                }
                            })
                            refinedData.logo = res.data[0].id
                            createProgram(refinedData)



                        }

                        refinedData.logo ? uploadData() : createProgram(values)
                    } catch (err) {
                        console.error(err);
                    }
                }}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, actions, isSubmitting, touched, values, setFieldValue }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Compnay Name"
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
                                label="Registration Number(Commercial Number) (Optional)"
                                margin="normal"
                                name="regNumber"
                                type="text"
                                value={values.regNumber}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                        </Grid>

                        <Grid container spacing={matchDownSM ? 0 : 2}>
                            <Grid item xs={6}>
                                <TextField

                                    label="Contact Position/Title"
                                    margin="normal"
                                    name="contactPersonTitle"
                                    type="text"
                                    value={values.contactPersonTitle}
                                    error={Boolean(touched.contactPersonTitle && errors.contactPersonTitle)}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                                {touched.contactPersonTitle && errors.contactPersonTitle && (
                                    <FormHelperText error id="standard-weight-helper-text-password-register">
                                        {errors.contactPersonTitle}
                                    </FormHelperText>
                                )}
                            </Grid>

                            <Grid item xs={6}>
                                <TextField

                                    label="Contact Person's Name"
                                    margin="normal"
                                    name="contactPersonName"
                                    type="text"
                                    error={Boolean(touched.contactPersonName && errors.contactPersonName)}
                                    value={values.contactPersonName}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                                {touched.contactPersonName && errors.contactPersonName && (
                                    <FormHelperText error id="standard-weight-helper-text-password-register">
                                        {errors.contactPersonName}
                                    </FormHelperText>
                                )}
                            </Grid>
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
                        <Grid container>
                            <Grid item xs={12} md={6} >
                                <TextField
                                    fullWidth
                                    label="Contact Number"
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
                            <Grid item xs={12} md={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                >
                                    Company Logo
                                    <VisuallyHiddenInput type="file"
                                        name="logo"
                                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tiff"
                                        onChange={(event) => {
                                            setFieldValue("logo", event.currentTarget.files[0]);
                                        }}
                                    />
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid item >
                            <TextField
                                fullWidth
                                label="Company Address"
                                margin="normal"
                                name="address"
                                type="text"
                                value={values.address}
                                error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                            {touched.address && errors.address && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.address}
                                </FormHelperText>
                            )}
                        </Grid>

                        <Grid item >
                            <TextField
                                fullWidth
                                label="Company's Website (Optional)"
                                margin="normal"
                                name="medicalHistory"
                                type="text"
                                multiline
                                rows={4}
                                value={values.medicalHistory}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                        </Grid>
                        <Grid item >
                            <TextField
                                fullWidth
                                label="Brief Company Description"
                                margin="normal"
                                name="description"
                                type="text"
                                multiline
                                rows={3}
                                value={values.description}
                                error={Boolean(touched.description && errors.description)}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                sx={{ ...theme.typography.customInput }}
                            />
                            {touched.description && errors.description && (
                                <FormHelperText error id="standard-weight-helper-text-password-register">
                                    {errors.description}
                                </FormHelperText>
                            )}
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

export default CompanyRegister;
