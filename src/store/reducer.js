// third-party
import { combineReducers } from 'redux';


// project imports
import snackbarReducer from './slices/snackbar';
import authReducer from './slices/auth';
import drawerReducer from './slices/drawer';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    auth: authReducer,
    drawer : drawerReducer
   
});

export default reducer;
