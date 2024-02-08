
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Layout from 'components/admin/@core/layouts/Layout'
import { getAdminServerProps } from 'utils/server/getServerProps'
import Form from 'components/admin/templates/Form'
import { useEffect, useState } from 'react'
import { getTemplateById } from 'services/templates'
import { SiteLoader } from 'components/miscellaneous'

const EditTemplate = () => {
    const [isLoading, setIsloading] = useState(false);
    const [template, setTemplate] = useState<any>(false);

    useEffect(() => {
        (async () => {
            setIsloading(true);
            const result = await getTemplateById("about-us", {
                column: "slug"
            });
            setTemplate(result);
            setIsloading(false);
        })();
    }, []);
    return (
        <Layout>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title='About Us'
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        {
                            isLoading ? (
                                <SiteLoader />
                            ) : (
                                <Form template={template}/>
                            )
                        }
                    </Card>
                </Grid>

            </Grid>
        </Layout>
    )
}

export const getServerSideProps = (ctx: any) => {
    return getAdminServerProps(ctx);
};

export default EditTemplate
