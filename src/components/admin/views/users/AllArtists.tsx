// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'
import Link from 'next/link'

// ** MUI Imports
import { ToastContainer, toast } from 'material-react-toastify';
import { 
    Paper, Table, TableRow, TableHead, TableBody, TableCell,
    Chip, Typography, TableContainer, TablePagination 
} from '@mui/material'

import { getUsers } from 'services'
import { TrimAndCopyText } from 'components/miscellaneous'


const GetAllArtists = ({ useUpdated }: any) => {

    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState([])
    const [page, setPage] = useState<number>(0)
    const [rowsPerPage, setRowsPerPage] = useState<number>(10)
    const [updated, setUpdated] = useUpdated();


    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const allUsers = await getUsers({ artist: true });
            setUsers(allUsers);
            setIsLoading(false);
        })();
    }, [updated])


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }


    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>

            <TableContainer sx={{ maxHeight: 440 }}>
                <ToastContainer position="top-right" newestOnTop={false} />
                <Table stickyHeader aria-label='sticky table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.length ? (
                                <>
                                    {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any, key: any) => {
                                        return (
                                            <TableRow hover role='checkbox' tabIndex={-1} key={key}>
                                                <TableCell>
                                                    <Link
                                                        href={`/creators/${user.id}`}
                                                        passHref
                                                        style={{
                                                            color: "#8d66f7"
                                                        }}
                                                        >
                                                        {user.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <span onClick={(e) => toast.success("Address Coppid")}>
                                                        <TrimAndCopyText text={user.address} />
                                                    </span>
                                                </TableCell>
                                                <TableCell>{user.email || "NA"}</TableCell>
                                                <TableCell>
                                                    <Link
                                                        href={`/creators/${user.id}`}
                                                        passHref
                                                        style={{
                                                            color: "#8d66f7"
                                                        }}
                                                        >
                                                        <span>@{user.username}</span>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{user.status}
                                                    {
                                                        user.status ? (
                                                            <Chip label="Active" color="success" size="small" />
                                                        ) : (
                                                            <Chip label="Not-Active" color="error" size="small" />
                                                        )
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </>
                            ) : (
                                <TableRow hover tabIndex={-1}>
                                    <TableCell colSpan={4} sx={{ textAlign: "center" }}><Typography variant="body2">No Data Found</Typography></TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default GetAllArtists;
