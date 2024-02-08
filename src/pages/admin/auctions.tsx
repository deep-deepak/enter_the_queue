import React from 'react'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Layout from 'components/admin/@core/layouts/Layout'
import { AuctionsList } from 'components/admin/views/nfts'
import { getAdminServerProps } from 'utils/server/getServerProps'

function AllAuctions() {
    return (
        <div>
            <Layout>
                <Grid container spacing={6}>

                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title='Auctions Nfts' titleTypographyProps={{ variant: 'h6' }} />
                            <AuctionsList />
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

export default AllAuctions;
