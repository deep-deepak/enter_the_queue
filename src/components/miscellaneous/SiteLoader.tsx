import { Backdrop, CircularProgress } from '@mui/material';

const SiteLoader = ({ isLoading = true }: any) => {

    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default SiteLoader;