import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import {BsCollectionFill} from 'react-icons/bs'
import { FaNeos, FaUsers } from 'react-icons/fa'

import Layout from 'components/admin/@core/layouts/Layout'
import { getAllItems, getCollections, getUsers } from 'services'
import { getAdminServerProps } from 'utils/server/getServerProps'



const AdminDashBoard = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([])
  const [artists, setArtists] = useState([])
  const [nfts, setNfts] = useState([])
  const [collections, setCollectuons] = useState([])

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const allUsers = await getUsers({ from: "admin" });
      const allNfts: any = await getAllItems();
      const allCollections = await getCollections();

      // const simpleUsers = allUsers.filter((user: any) => user.role === "USER" || user.role === "ARTIST" && !user.isApproved);
      const artistUsers = allUsers.filter((user: any) => user.role === "ARTIST" && user.isApproved);
      setUsers(allUsers);
      setArtists(artistUsers);
      setNfts(allNfts);
      setCollectuons(allCollections);
      setIsLoading(false);
    })();
  }, [])

  return (
    <Layout>
      <Card>
        <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
          <Grid container spacing={[5, 0]}>
            <Grid item xs={12} sm={3}>
              <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  variant='rounded'
                  sx={{
                    mr: 3,
                    width: 44,
                    height: 44,
                    boxShadow: 3,
                    color: 'common.white',
                    backgroundColor: '#9155FD'
                  }}
                >
                  <FaUsers size="1.75rem" />
                </Avatar>
                <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='caption'>USERS</Typography>
                  <Typography variant='h6'> {users ? users.length : 0}</Typography>
                </Box>
              </Box>

            </Grid>
            <Grid item xs={12} sm={3}>
              <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  variant='rounded'
                  sx={{
                    mr: 3,
                    width: 44,
                    height: 44,
                    boxShadow: 3,
                    color: 'common.white',
                    backgroundColor: '#56CA00'
                  }}
                >
                <FaUsers size="1.75rem" />
                </Avatar>
                <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='caption'>ARTIST</Typography>
                  <Typography variant='h6'>{artists ? artists.length : 0}</Typography>
                </Box>
              </Box>

            </Grid>
            <Grid item xs={12} sm={3}>
              <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  variant='rounded'
                  sx={{
                    mr: 3,
                    width: 44,
                    height: 44,
                    boxShadow: 3,
                    color: 'common.white',
                    backgroundColor: '#FFB400'
                  }}
                >
                  <FaNeos size='1.25rem' />
                </Avatar>
                <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='caption'>NFTS</Typography>
                  <Typography variant='h6'> {nfts ? nfts.length : 0}</Typography>
                </Box>
              </Box>

            </Grid>
            <Grid item xs={12} sm={3}>
              <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  variant='rounded'
                  sx={{
                    mr: 3,
                    width: 44,
                    height: 44,
                    boxShadow: 3,
                    color: 'common.white',
                    backgroundColor: '#16B1FF'
                  }}
                >
                  <BsCollectionFill size='1.75rem' />
                </Avatar>
                <Box component="div" sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='caption'>COLLECTIONS</Typography>
                  <Typography variant='h6'> {collections ? collections.length : 0}</Typography>
                </Box>
              </Box>

            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Layout>
  )
}

export const getServerSideProps = (ctx: any) => {
    return getAdminServerProps(ctx);
};

export default AdminDashBoard

