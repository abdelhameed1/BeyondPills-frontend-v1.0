import { Link } from 'react-router-dom';
import React, { useState } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery, ToggleButtonGroup, ToggleButton ,CircularProgress,
    Backdrop} from '@mui/material';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import PatientRegister from './auth-forms/PatientAuthRegister';
import HCPRegister from './auth-forms/HcpAuthRegister'; 
import PharmacyRegister from './auth-forms/PharmacyAuthRegister';
import CompanyRegister from './auth-forms/CompanyAuthRegister';




// assets

// ===============================|| AUTH3 - REGISTER ||=============================== //


const Register = () => {
    const theme = useTheme();
    
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [userType, setUserType] = useState("patient");
    const [uploadProgress, setUploadProgress] = useState(0)
    const handleChange = (event, value,) => {
        setUserType(value);
    };

    const componentMap = {
        patient: <PatientRegister />,
        company: <CompanyRegister uploadProgress={uploadProgress} setUploadProgress={setUploadProgress} />,
        HCP: <HCPRegister />,
        pharmacy: <PharmacyRegister uploadProgress={uploadProgress} setUploadProgress={setUploadProgress}/>,
        
    };
    return (
        <AuthWrapper1>
            <Grid container direction="column"  >
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item sx={{ mb: 3 }}>
                                        <Link to="/" aria-label="theme-logo">
                                            <img src='/BPNLogo2.png' alt='beyondPills' width="150" height="32" />
                                        </Link>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid
                                            container
                                            direction={matchDownSM ? 'column-reverse' : 'row'}
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={theme.palette.secondary.main}
                                                        gutterBottom
                                                        variant={matchDownSM ? 'h3' : 'h2'}
                                                    >
                                                        Sign up
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownSM ? 'center' : 'inherit'}
                                                    >
                                                        Please select your specialty
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <ToggleButtonGroup
                                        color="primary"
                                        value={userType}
                                        exclusive
                                        defaultValue={"patient"}
                                        onChange={handleChange}
                                       
                                    >
                                        <ToggleButton value="patient">Patient</ToggleButton>
                                        <ToggleButton value="company">Company</ToggleButton>
                                        <ToggleButton value="HCP">HCP</ToggleButton>
                                        <ToggleButton value="pharmacy">Pharmacy</ToggleButton>
                                    </ToggleButtonGroup>

                                    <Grid item xs={12}>
                                        {componentMap[userType] || <PatientRegister />}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Divider />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid item container direction="column" alignItems="center" xs={12}>
                                            <Typography
                                                component={Link}
                                                to={ '/login'}
                                                variant="subtitle1"
                                                sx={{ textDecoration: 'none' , 
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                                }}
                                            >
                                                Already have an account?
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>
            <Backdrop
                sx={{ color: '#fff', zIndex: 10 }}
                open={uploadProgress > 0 && uploadProgress < 100}

            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </AuthWrapper1>
    );
};

export default Register;
