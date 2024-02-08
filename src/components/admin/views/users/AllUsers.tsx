// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import Link from 'next/link'
import copy from 'copy-to-clipboard';
import { ToastContainer, toast } from 'material-react-toastify';
import {
  Card, CardHeader, Typography, TableContainer,
  TableCell, TableBody, TableHead, TableRow, Table, Paper,Chip, TablePagination, Tooltip
} from '@mui/material';
import AddLinkIcon from '@mui/icons-material/AddLink';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AddUser from './AddUser';
import { getBaseUrl } from '../../../../helpers/axios';
import { TrimAndCopyText } from '../../../miscellaneous';
import { ARTIST_REGISTRATION_SECRET } from '../../../../utils'
import { approveArtist, generateToken, getTokenData, getUsers } from '../../../../services'



const defaultStateOptions = {
  isLoader: false,
  isComplete: false,
  isError: false,
  errorMessage: "",
  callback: "",
  title: "",
  description: ""
}

const defaultCancelStates = {
  setAuthorizer: {
    ...defaultStateOptions,
    callback: "setAuthorizerAdmin",
    title: "Cancel Set Authrozer",
    description: "Cancel User from Set Authrozer"
  },
  onOwnServer: {
    ...defaultStateOptions,
    callback: "setAuthorizerApi",
    title: "Sign message",
    description: "Sign message with User preferences"
  }
}
type DefaultCancelProps = typeof defaultCancelStates;


const AllUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([])
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [updated, setUpdate] = useState<Boolean>(false);
  const [tokens, setTokens] = useState<any>([]);


  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const allUsers = await getUsers({
        from: "admin"
      });
      setUsers(allUsers);
      setIsLoading(false);
    })();
  }, [updated])




  const generateLink = async (id: any) => {
    setIsLoading(true);
    const result = await generateToken(id);
    if (result.token) {
      const currentToken = tokens.find((token: any) => token.id === id);
      const newTokens = tokens.filter((token: any) => token !== currentToken)
      newTokens.push({
        id: id,
        token: result.token
      })
      setTokens(newTokens);
      toast.success("Link Generated");
    }
    setIsLoading(false)
  }

  const handleApproved = async (id: any) => {
    const result = await approveArtist(id)
    if (result) {
      setUpdate(!updated);
      toast.success('Artist Approved')
    }
  }

  const handleDisapproved = async (id: string) => {
    const result = await approveArtist(id, false)
    if (result) {
      setUpdate(!updated);
      toast.success('User Remove From Artist!');
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  

  return <>
    <Card sx={{ position: "relative" }}>
      <CardHeader title='Users' titleTypographyProps={{ variant: 'h6' }} />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <ToastContainer position="top-right" newestOnTop={false} />

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label='sticky table'>
            <TableHead>
              <TableRow>
                <TableCell>Name </TableCell>
                <TableCell>Address </TableCell>
                <TableCell> email </TableCell>
                <TableCell> username  </TableCell>
                <TableCell> Artist  </TableCell>
                <TableCell> role  </TableCell>
                <TableCell> Status  </TableCell>
                <TableCell> action  </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                users.length ? (
                  <>
                    {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any, key: any) => {
                      const token = tokens.find((data: any) => data.id === user.id) || false;
                      let rememberToken = token?.token || "";
                      if (!rememberToken) {
                        const tokenData: any = getTokenData(user?.rememberToken || "", ARTIST_REGISTRATION_SECRET)
                        rememberToken = tokenData?.token || "";
                      }
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
                            {
                              user.address ? (
                              <span onClick={(e) => toast.success("Address Coppid")}>

                                <TrimAndCopyText text={user.address} />
                              </span>
                              ) : "N/A"
                            }
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
                          <TableCell>
                            {
                              user.role === "ARTIST" && user.isApproved ? (
                                <Chip label="Yes" color="success" size="small" />
                              ) : (
                                <Chip label="No" color="error" size="small" />
                              )
                            }
                          </TableCell>
                          <TableCell>
                            <Chip label={user.role} variant="outlined" size="small" />
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
                          <TableCell>
                            {
                              user.role === "USER" || user.role === "ARTIST" && !user.isApproved ? (
                                <Tooltip title='Generate Link For Artist Registration' >
                                  <span onClick={() => generateLink(user.id)} style={{ cursor: 'pointer' }} className='gen_token'>
                                    <AddLinkIcon
                                      fontSize='small'
                                      className='link_gen'
                                    />
                                  </span>
                                </Tooltip>
                              ) : ""
                            }
                            {
                              rememberToken ? (
                                <Tooltip title="Copy Token Link">
                                  <span
                                    onClick={() => copy(getBaseUrl(`registration/artist/${rememberToken}`))} style={{ cursor: 'pointer' }}>
                                    <span onClick={(e) => toast.success("Link Coppied")} className='copy_token'>
                                      <ContentCopyIcon fontSize='small' className='link_copy' />
                                    </span>
                                  </span>
                                </Tooltip>
                              ) : ""
                            }
                            {
                              user.canAdminApprove ? (
                                <>
                                  {
                                    user.role === "ARTIST" && user.isApproved ? (
                                      <Tooltip title='Remove from artist'>
                                        <Chip
                                          label="Disapprove"
                                          variant="outlined"
                                          color="error"
                                          onClick={() => handleDisapproved(user.id)}
                                          icon={<VerifiedUserIcon fontSize='small' />}
                                        />
                                      </Tooltip>
                                    ) : (
                                      <>
                                        <Tooltip title='Approved for the artist'>
                                          <Chip
                                            label="Approve"
                                            variant="outlined"
                                            color="success"
                                            onClick={() => handleApproved(user.id)}
                                            icon={<VerifiedUserIcon fontSize='small' />}
                                          />
                                        </Tooltip>
                                      </>
                                    )
                                  }
                                </>
                              ) : ""
                            }
                          </TableCell>

                        </TableRow>
                      );
                    })}
                  </>
                ) : (
                  <TableRow hover tabIndex={-1}>
                    <TableCell colSpan={8} sx={{ textAlign: "center" }}><Typography variant="body2">No Data Found</Typography></TableCell>
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
    </Card>
  </>;
}

export default AllUsers;
