
import Grid from '@mui/material/Grid'
import Layout from 'components/admin/@core/layouts/Layout'
import { UserList } from 'components/admin/views/users'
import { getAdminServerProps } from 'utils/server/getServerProps'


const AllUsers = () => {
  return (
    <Layout>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UserList />
        </Grid>
      </Grid>
    </Layout>
  )
}

export const getServerSideProps = (ctx: any) => {
    return getAdminServerProps(ctx);
};

export default AllUsers
