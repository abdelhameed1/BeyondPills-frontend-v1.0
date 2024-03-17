import {createSlice , createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


const user = JSON.parse(localStorage.getItem('user'));

export const register = createAsyncThunk("register" , async (user , thunkApi) => {
    try{
       
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/local/register` , user);
        if(response.data){
            localStorage.setItem('user' , JSON.stringify({...response.data.user ,  jwt : response.data.jwt}));
            return {...response.data.user ,  jwt : response.data.jwt};
        }
    }catch(error){
        console.log(error)
        return thunkApi.rejectWithValue(error.response.data.error.message);
    }
})

export const login = createAsyncThunk("login" , async (user , thunkApi) => {
    try{
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/local` , user);
    if(response.data){
        localStorage.setItem('user' , JSON.stringify({...response.data.user , jwt : response.data.jwt}));
        return {...response.data.user , jwt : response.data.jwt};
    }
    }catch (error){
        return thunkApi.rejectWithValue(error.response.data.error.message);
    }

})

export const logout = createAsyncThunk("logout" , async (user , thunkApi) => {
    try{
        localStorage.removeItem('user');
        return true;
    }catch(error){
        return thunkApi.rejectWithValue(error);
    }
})
const initialState = {
    user: user ? user : null,
    loading: false,
    error: false,
    isSuccess : false,
    islogged : user ? true : false,
    message : ''
}

export const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers :{
        reset : (state) => {
            state.loading = false;
            state.error = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers : (builder) => {
        builder
        //register
            .addCase(register.pending , (state) => {
                state.loading = true;
                state.error = false;
                state.islogged = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(register.fulfilled , (state , action) => {
                state.loading = false;
                state.error = false;
                state.islogged = true;
                state.isSuccess = true;
                state.message = '';
                state.user = action.payload;
            })
            .addCase(register.rejected , (state , action) => {
                console.log(action)
                state.loading = false;
                state.error = true;
                state.isSuccess = false;
                state.message = action.payload;
                state.user = null;
            })
            //login 
            .addCase(login.pending , (state) => {
                state.loading = true;
                state.error = false;
                state.islogged = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(login.fulfilled , (state , action) => {
                state.loading = false;
                state.error = false;
                state.isSuccess = true;
                state.islogged = true;
                state.message = '';
                state.user = action.payload;
            })
            .addCase(login.rejected , (state , action) => {
                state.loading = false;
                state.error = true;
                state.isSuccess = false;
                state.islogged = false;
                state.message = action.payload;
                state.user = null;
            })
            //logout
            .addCase(logout.pending , (state) => {
                state.loading = true;
                state.error = false;
                state.isSuccess = false;
                state.islogged = true;
                state.message = '';
            })
            .addCase(logout.fulfilled , (state ) => {
                state.loading = false;
                state.error = false;
                state.isSuccess = true;
                state.message = '';
                state.islogged = false;
                state.user = null;
            })
            .addCase(logout.rejected , (state , action) => {
                state.loading = false;
                state.error = true;
                state.isSuccess = false;
                state.message = action.payload;
                state.islogged = true;
                state.user = null;
            })

    }
});


export const {reset} = authSlice.actions;
export default authSlice.reducer;