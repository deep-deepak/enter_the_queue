import React from 'react'

import {Grid, Card, CardHeader} from '@mui/material'
import Layout from 'components/admin/@core/layouts/Layout'
import { OffersList } from 'components/admin/views/nfts'
import { getAdminServerProps } from 'utils/server/getServerProps'

const AllOffers = () => {
    return (
        <div>
            <Layout>
                <Grid container spacing={6}>

                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title='Offers Nfts' titleTypographyProps={{ variant: 'h6' }} />
                            <OffersList />
                        </Card>
                    </Grid>

                </Grid>
            </Layout>
        </div>
    )
}

export const getServerSideProps = (ctx: any) => {
    return getAdminServerProps(ctx);
};

export default AllOffers;
