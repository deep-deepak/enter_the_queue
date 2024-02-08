// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'
import Link from 'next/link'

// ** MUI Imports
import { ToastContainer, toast } from 'material-react-toastify';
import {
    Paper, Table, TableRow, TableHead, TableBody, TableCell,
    Chip, Typography, TableContainer, TablePagination, capitalize
} from '@mui/material'

import { getTemplates } from 'services/templates';
import moment from 'moment';


const Templates = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [templates, setTemplates] = useState([])
    const [page, setPage] = useState<number>(0)
    const [rowsPerPage, setRowsPerPage] = useState<number>(10)


    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const allTemplates = await getTemplates();
            setTemplates(allTemplates);
            setIsLoading(false);
        })();
    }, [])


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
                            <TableCell>Type</TableCell>
                            <TableCell>Created On</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            templates.length ? (
                                <>
                                    {templates.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((template: any, key: any) => {
                                        return (
                                            <TableRow hover role='checkbox' tabIndex={-1} key={key}>
                                                <TableCell>
                                                    <Link
                                                        href={template.url}
                                                        passHref
                                                        style={{
                                                            color: "#8d66f7"
                                                        }}
                                                        target='_blank'
                                                    >
                                                        {template.title}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{capitalize(template.type)}</TableCell>
                                                <TableCell>
                                                    {moment(template.createdAt).format("LL")}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        template.status ? (
                                                            <Chip label="Active" color="success" size="small" />
                                                        ) : (
                                                            <Chip label="Not-Active" color="error" size="small" />
                                                        )
                                                    }
                                                    <Link href={`/admin/templates/${template.id}/edit`}>
                                                        <Chip label="Edit" color="warning" size="small" sx={{ ml: 2, cursor: "pointer" }} />
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </>
                            ) : (
                                <TableRow hover tabIndex={-1}>
                                    <TableCell colSpan={3} sx={{ textAlign: "center" }}><Typography variant="body2">No Data Found</Typography></TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={templates.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default Templates;
