import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,

    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,

    Paper,
    Popper,
    Stack,
    Typography
} from '@mui/material';

// third-party
import _ from 'lodash';

import AppsIcon from '@mui/icons-material/Apps';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';


//import User1 from '/user-round.svg';

// assets
import { IconLogout, IconSettings, IconUser } from '@tabler/icons';
import useConfig from 'hooks/useConfig';

import { logout } from 'store/slices/auth';
// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const theme = useTheme();
    const { borderRadius } = useConfig();
    const navigate = useNavigate();

    const dispatch = useDispatch();


    const [selectedIndex, setSelectedIndex] = useState(-1);
    const { user } = useSelector((state) => state.auth);
    const [open, setOpen] = useState(false);
    const [ settingsUrl , setSettingsUrl ] = useState('/panel');
    /**
     * anchorRef is used on different ui-component and specifying one type leads to other ui-component throwing an error
     * */
    const anchorRef = useRef(null);
    const handleLogout = async () => {
        try {
            await dispatch(logout());
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    const handleListItemClick = (event, index, route = '') => {
        setSelectedIndex(index);
        handleClose(event);

        if (route && route !== '') {
            navigate(route);

        }
    };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    useEffect(() => {
        switch (user?.userType) {
            case "company":
                setSettingsUrl(`/panel/${user.userType}/programs/${user.id}`);
                break;
            case "HCP":
                setSettingsUrl('/panel/hcp/patientenrollments');
                break;
            case "patient":
                setSettingsUrl(`/panel/patient/programs/${user.id}`);
                break;
            case "pharmacy":
                setSettingsUrl('/panel/pharmacy/enrollments');
                break;
        }
    },[])
    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    // <Avatar
                    //     src={!_.isEmpty(user.logo) ? `${process.env.REACT_APP_APP_BACKEND}${user.logo.url}`:'/user-round.svg'}
                    //     sx={{
                    //         ...theme.typography.mediumAvatar,
                    //         margin: '8px 0 8px 8px !important',
                    //         cursor: 'pointer'
                    //     }}
                    //     ref={anchorRef}
                    //     aria-controls={open ? 'menu-list-grow' : undefined}
                    //     aria-haspopup="true"
                    //     color="inherit"
                    //     alt="user-account"
                    // />
                    <img src={!_.isEmpty(user.logo) ? `${process.env.REACT_APP_APP_BACKEND}${user.logo.url}`:'/user-round.svg'} 
                    style={{
                        
                                margin: '8px 0 8px 8px !important',
                                cursor: 'pointer'
                            }}
                    className="h-11 w-15" />
                }
                label={<IconSettings stroke={1.5} size="24px" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />

            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                className='z-20'
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 14]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Box sx={{ p: 2, pb: 0 }}>
                                            <Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="h4">Hello,</Typography>
                                                    <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                        {user?.username}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="subtitle2">
                                                    {user?.userType}
                                                </Typography>
                                            </Stack>

                                        </Box>


                                        <Box sx={{ p: 2, pt: 0 }}>
                                            <List
                                                component="nav"
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 350,
                                                    minWidth: 300,
                                                    backgroundColor: theme.palette.background.paper,
                                                    borderRadius: '10px',
                                                    [theme.breakpoints.down('md')]: {
                                                        minWidth: '100%'
                                                    },
                                                    '& .MuiListItemButton-root': {
                                                        mt: 0.5
                                                    }
                                                }}
                                            >
                                                <ListItemButton
                                                    sx={{ borderRadius: `${borderRadius}px` }}
                                                    selected={selectedIndex === 0}
                                                    onClick={(event) => handleListItemClick(event, 0, settingsUrl)}
                                                >
                                                    <ListItemIcon>
                                                        <IconSettings stroke={1.5} size="20px" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2">
                                                                Settings Panel
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                                {
                                                    user?.userType == 'company' && (
                                                        <ListItemButton
                                                            sx={{ borderRadius: `${borderRadius}px` }}
                                                            selected={selectedIndex === 1}
                                                            onClick={(event) => handleListItemClick(event, 1, `/listPrograms/${user.id}`)}
                                                        >
                                                            <ListItemIcon>
                                                                <AppsIcon stroke={1.5} size="20px" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography variant="body2">
                                                                        your programs
                                                                    </Typography>


                                                                }
                                                            />
                                                        </ListItemButton>
                                                    )
                                                }
                                               
                                                <ListItemButton
                                                    sx={{ borderRadius: `${borderRadius}px` }}
                                                    selected={selectedIndex === 4}
                                                    onClick={handleLogout}
                                                >
                                                    <ListItemIcon>
                                                        <IconLogout stroke={1.5} size="20px" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2">
                                                                logout
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItemButton>
                                            </List>
                                        </Box>

                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
