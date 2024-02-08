import React, { useEffect, useState } from 'react'

import { Card, CardHeader, Grid } from '@mui/material'
import Layout from 'components/admin/@core/layouts/Layout'
import { AdminList } from 'components/admin/views/users'
import { getAdminServerProps } from 'utils/server/getServerProps'
import AddAdmin from 'components/admin/views/users/AddAdmin'
import { getUsers } from 'services'

const AllAdmin = () => {
    const [updated, setUpdate] = useState<Boolean>(false);

    return (
        <Layout>
            <Grid container spacing={6}>

                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title='Admin List'
                            titleTypographyProps={{ variant: 'h6' }}
                            action={
                                <AddAdmin
                                    useUpdated={() => [updated, setUpdate]}
                                />
                            }
                        />
                        <AdminList
                            useUpdated={() => [updated, setUpdate]}
                        />
                    </Card>
                </Grid>

            </Grid>
        </Layout>
    )
}

export const getServerSideProps = (ctx: any) => {
    return getAdminServerProps(ctx);
};

export default AllAdmin;