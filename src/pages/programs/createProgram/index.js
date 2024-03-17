import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { openSnackbar } from 'store/slices/snackbar';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import {
    Button,
    Typography,
    TextField,
    Grid,
    Autocomplete,
    Box,
    Container,
    CircularProgress,
    Backdrop
} from '@mui/material';


// third party
import * as Yup from 'yup';
import { useFormik } from 'formik';



const ProgramForm = ({ }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    let user = useSelector((state) => state.auth.user);
    const [programTypes, setProgramTypes] = useState([]);
    const [countries, setCountries] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0)
    const formik = useFormik({
        initialValues: {
            Name: '',
            Description: '',
            Eligibility_criteria: '',
            Countries: [],
            Disease: '',
            Drug: '',
            Benefits: '',
            Referal: '',
            programType: []
        },
        validationSchema: Yup.object().shape({

        }),
        onSubmit: (values, actions) => {
            let refinedData = _.cloneDeep(values)
            refinedData.program_types = refinedData.programType.map((type) => type.id)
            refinedData.Countries = refinedData.Countries.join('\n')
            refinedData.user = user.id;
            const createProgram = async (data) => {
                if (params.id) {
                    axios.put(`${process.env.REACT_APP_BACKEND_URL}/programs/${params.id}`, { data }, {
                        headers: {
                            'Authorization': `Bearer ${user.jwt}`
                        }
                    })
                } else {
                    axios.post(`${process.env.REACT_APP_BACKEND_URL}/programs`, { data }, {
                        headers: {
                            'Authorization': `Bearer ${user.jwt}`
                        }
                    }).then((res) => {
                        dispatch(
                            openSnackbar({
                                open: true,
                                message: "Program Created",
                                variant: 'default',
                                alert: {
                                    color: 'success'
                                },
                                close: true
                            })
                        )
                        navigate('/')
                    })
                }
            }
            const uploadData = async () => {
                let formData = new FormData()
                formData.append('files', refinedData.DrugLogo)
                let res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/upload`, formData, {
                    onUploadProgress: (eventProgress) => {

                        setUploadProgress(
                            Math.round((eventProgress.loaded * 100) / eventProgress.total)
                        );

                    }
                })

                refinedData.drugLogo = res.data[0].id
                createProgram(refinedData)



            }

            refinedData.DrugLogo ? uploadData() : createProgram(refinedData)




        }
    })


    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/program-types`).then((res) => {
            setProgramTypes(res.data.data)
        })
        axios.get('https://countriesnow.space/api/v0.1/countries/info?returns=name').then((res) => {
            setCountries(res.data.data.map((country) => country.name).sort())
        })
        if (params.id) {
            axios
                .get(`${process.env.REACT_APP_BACKEND_URL}/programs/${params.id}`, {
                    params: {
                        populate: {
                            program_types: true
                        }
                    }
                })
                .then((response) => {
                    //let progTypes = response.data.data.attributes.program_types.data.map(type => type.attributes.name)
                    response.data.data.attributes.programType = response.data.data.attributes.program_types.data.map(type => type)
                    response.data.data.attributes.Countries = [response.data.data.attributes.Countries]

                    formik.setValues(response.data.data.attributes)

                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    return (
        <>

            <form noValidate onSubmit={formik.handleSubmit}>
                <Container disableGutters maxWidth="md" sx={{ pt: 3, pb: 3, width: '100%' }}>
                    <Box
                        sx={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: 5,
                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '70vh',
                            minWidth: 300,
                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h2" align="center">
                                    Program Form
                                </Typography>
                            </Grid>
                            <Grid item xs={12} >
                                <Autocomplete
                                    multiple
                                    options={programTypes}
                                    getOptionLabel={(option) => option.attributes.name}
                                    id='programType'
                                    value={formik.values.programType}
                                    onChange={(e, value) => formik.setFieldValue('programType', value)}
                                    renderInput={(params) => <TextField label="Program Type" value={formik.values.programType}  {...params} />}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    id="Name"
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formik.values.Name}
                                    onChange={formik.handleChange}
                                    error={formik.touched.Name && formik.errors.Name}
                                    helperText={formik.touched.Name && formik.errors.Name}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="Description"
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    value={formik.values.Description}
                                    onChange={formik.handleChange}
                                    error={formik.touched.Description && formik.errors.Description}
                                    helperText={formik.touched.Description && formik.errors.Description}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    id="Eligibility_criteria"
                                    label="Eligibility Criteria"
                                    variant="outlined"
                                    fullWidth
                                    value={formik.values.Eligibility_criteria}
                                    onChange={formik.handleChange}
                                    error={formik.touched.Eligibility_criteria && formik.errors.Eligibility_criteria}
                                    helperText={formik.touched.Eligibility_criteria && formik.errors.Eligibility_criteria}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <Autocomplete
                                    multiple
                                    options={countries}
                                    getOptionLabel={(option) => option}
                                    id='Countries'
                                    value={formik.values.Countries}
                                    onChange={(e, value) => formik.setFieldValue('Countries', value)}
                                    renderInput={(params) => <TextField value={formik.values.Countries} label="Countries" {...params} />}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="Disease"
                                    label="Disease"
                                    variant="outlined"
                                    fullWidth
                                    value={formik.values.Disease}
                                    onChange={formik.handleChange}
                                    error={formik.touched.Disease && formik.errors.Disease}
                                    helperText={formik.touched.Disease && formik.errors.Disease}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="Benefits"
                                    label="Benefits"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    row={3}
                                    value={formik.values.Benefits}
                                    onChange={formik.handleChange}
                                    error={formik.touched.Benefits && formik.errors.Benefits}
                                    helperText={formik.touched.Benefits && formik.errors.Benefits}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="Drug"
                                    label="Drug"
                                    variant="outlined"
                                    fullWidth
                                    value={formik.values.Drug}
                                    onChange={formik.handleChange}
                                    error={formik.touched.Drug && formik.errors.Drug}
                                    helperText={formik.touched.Drug && formik.errors.Drug}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} style={{ justifyContent: 'flex-start', display: 'flex' }} >
                                <input
                                    id="DrugLogo"
                                    label="DrugLogo"
                                    variant="contained"
                                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tiff"
                                    type='file'
                                    className='mt-4 w-100'

                                    onChange={(event) => {
                                        formik.setFieldValue("DrugLogo", event.currentTarget.files[0]);
                                    }}


                                />


                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    id="Referal"
                                    label="Referal Code"
                                    variant="outlined"
                                    fullWidth
                                    value={formik.values.Referal}
                                    onChange={formik.handleChange}
                                    error={formik.touched.Referal && formik.errors.Referal}
                                    helperText={formik.touched.Referal && formik.errors.Referal}
                                />
                            </Grid>
                            <Grid item xs={8} sx={{ margin: "auto" }}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    className='btn '
                                    variant='contained'

                                >
                                    Submit

                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </form>
            <Backdrop
                sx={{ color: '#fff', zIndex: 10 }}
                open={uploadProgress > 0 && uploadProgress < 100}

            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>


    )

}

export default ProgramForm;