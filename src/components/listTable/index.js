import React, { useEffect } from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import { useTheme } from '@mui/material/styles';
import Chip from 'ui-component/extended/Chip';
import Avatar from 'ui-component/extended/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';





const StickyTable = ({ data, columns , actions }) => {

    const [page, setPage] = React.useState(0);
    const [rows, setRows] = React.useState([]);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const theme = useTheme();
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    useEffect(() => {
        setRows(data)
    }, [data])
    return (
        data.length > 0 ? (
            <>
                <Paper sx={{ width: '100%', overflow: 'hidden', margin: "30px" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table" className='z-10' >
                            <TableHead>
                                <TableRow >
                                    {columns.map((column, index) => (
                                        <TableCell

                                            key={column.id + index}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={index} >
                                            {columns.map((column) => {
                                                const value = column.id === 'actions' || column.id === 'status' ? '' : row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {
                                                            column.id == 'avatar' && (
                                                                <Grid container spacing={2} alignItems="center">
                                                                <Grid item>
                                                                    <Avatar alt="User 1" src='/user-round.svg' />
                                                                </Grid>
                                                                <Grid item xs zeroMinWidth>
                                                                    <Typography align="left" variant="subtitle1" component="div">
                                                                        {row.avatarName}{' '}
                                                                        
                                                                    </Typography>
                                                                    <Typography align="left" variant="subtitle2" noWrap>
                                                                        {row.avatarEmail}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                            )
                                                        }
                                                        {column.format && typeof value === 'number'
                                                            ? column.format(value)
                                                            : value}
                                                      
                                                        {column.id === 'actions' && (
                                                            <>
                                                                <Tooltip placement="top" title="Take Action" >
                                                                    <IconButton
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            actions.acceptRequest(row.id)
                                                                        }}

                                                                        size="large"
                                                                    >
                                                                        <ChatBubbleTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                                                    </IconButton>
                                                                </Tooltip>

                                                                <Tooltip placement="top" title="Delete" >
                                                                    <IconButton
                                                                        color="primary"
                                                                        onClick={() => {
                                                                            actions.rejectRequest(row.id)
                                                                        }}
                                                                        sx={{
                                                                            color: theme.palette.orange.dark,
                                                                            borderColor: theme.palette.orange.main,
                                                                            '&:hover': {
                                                                                background: theme.palette.orange.light,
                                                                            },
                                                                        }}
                                                                        size="large"
                                                                    >
                                                                        <BlockTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                        {
                                                            column.id == 'status' && (
                                                                <>
                                                                    {row.status === 'accepted' && <Chip label="Accepted" size="small" chipcolor="success" />}
                                                                    {row.status === "pending" && <Chip label="Pending" size="small" chipcolor="orange" />}
                                                                </>


                                                            )
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </>

        ) : (
            <h1 style={{ marginTop: "25vh" }}> No Data  </h1>
        )
    );
};

export default StickyTable;
