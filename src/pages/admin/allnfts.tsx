import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Layout from 'components/admin/@core/layouts/Layout'
import { NftsList } from 'components/admin/views/nfts'
import { SECRET } from 'utils'
import { getTokenData } from 'services'
import { getAdminServerProps } from 'utils/server/getServerProps'

const AllNfts = () => {
    return (
        <Layout>
            <Grid container spacing={6}>

                <Grid item xs={12}>
                    <Card>
                        <CardHeader title='Nfts' titleTypographyProps={{ variant: 'h6' }} />
                        <NftsList />
                    </Card>
                </Grid>

            </Grid>
        </Layout>
    )
}

export const getServerSideProps = (ctx: any) => {
    return getAdminServerProps(ctx);
};

export default AllNfts
