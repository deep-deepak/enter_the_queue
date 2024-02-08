
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Layout from 'components/admin/@core/layouts/Layout'
import { AddUser, ArtistList } from 'components/admin/views/users'
import { getAdminServerProps } from 'utils/server/getServerProps'
import { useState } from 'react'

const Artists = () => {
  const [updated, setUpdate] = useState<Boolean>(false);

  return (
    <Layout>
      <Grid container spacing={6}>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='Artists'
              titleTypographyProps={{ variant: 'h6' }}
              action={
                <AddUser
                  useUpdated={() => [updated, setUpdate]}
                />}
            />
            <ArtistList useUpdated={() => [updated, setUpdate]} />
          </Card>
        </Grid>

      </Grid>
    </Layout>
  )
}

export const getServerSideProps = (ctx: any) => {
  return getAdminServerProps(ctx);
};

export default Artists
