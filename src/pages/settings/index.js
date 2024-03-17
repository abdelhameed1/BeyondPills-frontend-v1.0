import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip
} from '@mui/material'

import MuiDrawer from '@mui/material/Drawer';

import AppsIcon from '@mui/icons-material/Apps';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AodIcon from '@mui/icons-material/Aod';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import EventNoteIcon from '@mui/icons-material/EventNote';

import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {  findIndex } from 'lodash';


const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function MiniDrawer() {
    const theme = useTheme();
    const navigate = useNavigate();


    const { user } = useSelector((state) => state.auth);
    const { open } = useSelector((state) => state.drawer);


    const [items, setItems] = React.useState([])
    const [selectIndex, setSelectIndex] = React.useState();
    
    
    React.useEffect(() => {
        switch (user?.userType) {
            case "company":
                setItems([
                    { label: "Programs", icon: <AppsIcon />, to: `/panel/company/programs/${user.id}` },
                    { label: 'HCPs', icon: <HowToRegIcon />, to: "/panel/company/hcps" },
                    { label: 'Enrollment Requests', icon: <AssignmentIcon />, to: "/panel/company/enrollments" },
                    { label: 'Referal Codes', icon: <AodIcon />, to: "/panel/company/referal" },
                    { label: 'Referal Code Requests', icon: <EventNoteIcon />, to: "/panel/company/requests" },
                ])
                break;

            case 'patient':
                setItems([
                    { label: "Programs", icon: <AppsIcon />, to: `/panel/patient/programs/${user.id}` },
                ])
                break;

            case 'pharmacy':
                setItems([
                    { label: "Enrollments Check", icon: <AppsIcon />, to: `/panel/pharmacy/enrollments` },
                ])
                break;
            case 'HCP':
                setItems([
                    { label: "Patients", icon: <HowToRegIcon />, to: `/panel/hcp/patientenrollments` },
                    { label: 'Referal Codes', icon: <AodIcon />, to: "/panel/hcp/referal" },
                ])
                break;

        }

    }, [])

    React.useEffect(() => {
        let index = findIndex(items, (item) => { return window.location.pathname.startsWith(item.to) })
        index != -1 ? setSelectIndex(index) : setSelectIndex(0)
    }, [items])
    const handleListItemClick = (event, index, route = '') => {
        setSelectIndex(index);
        if (route && route !== '') {
            navigate(route);
        }
    };


    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                sx={{
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        position: 'relative',
                        height: '85vh',
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                open={open}
            >
                <List>
                    {items.map((item, index) => (
                        <ListItem key={item.label} disablePadding sx={{ display: 'block' }} >
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                selected={selectIndex === index}
                                onClick={(event) => handleListItemClick(event, index, item.to)}
                            >
                                <Tooltip placement='right' title={item.label}>
                                <ListItemIcon sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}>
                                    {item.icon}
                                   
                                </ListItemIcon>
                                </Tooltip>
                                <ListItemText
                                    sx={{ opacity: open ? 1 : 0 }}
                                    primary={
                                        item.label
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
}
