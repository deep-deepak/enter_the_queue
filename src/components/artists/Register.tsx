// ** React Imports
import { ReactNode, useEffect, useState } from 'react'


import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import themeConfig from '../../components/admin/configs/themeConfig'
import BlankLayout from '../../components/admin/@core/layouts/BlankLayout'
import { Alert, Grid } from '@mui/material'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import { toast, ToastContainer } from "material-react-toastify";
import { Metamask } from '../../context'
import { ARTIST_REGISTRATION_SECRET } from '../../utils'
import { artistRegister, getTokenData } from '../../services'
import Image from 'next/image'
import { TrimAndCopyText } from '../../components/miscellaneous'
import { validateArtistForm } from '../../schemas'

import { BsDiscord, BsFacebook, BsGlobe, BsInstagram, BsTwitter } from 'react-icons/bs';
import { BsWallet } from 'react-icons/bs';
import Link from 'next/link'


// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
    [theme.breakpoints.up('sm')]: {}
}))



const ArtistsRegister = () => {
    const { isAuthenticated, login, user, logout }: any = Metamask.useContext();
    const [error, setError] = useState<string>("");
    const [tokenUser, setTokenUser] = useState<any>(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        username: "",
        description: "",
        socialLinks: {
            discord: "",
            twitter: "",
            instagram: "",
            facebook: "",
            website: ""
        }
    });
    const router = useRouter();
    const token: any = router.query.token || "";

    useEffect(() => {
        const tokenData: any = getTokenData(token, ARTIST_REGISTRATION_SECRET);
        setTokenUser(tokenData ? tokenData.user : false);
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            username: user?.username || "",
            description: user?.description || "",
            socialLinks: {
                discord: user?.socialLinks?.discord || "",
                twitter: user?.socialLinks?.twitter || "",
                instagram: user?.socialLinks?.instagram || "",
                facebook: user?.socialLinks?.facebook || "",
                website: user?.socialLinks?.website || ""
            }
        });
    }, [token, user]);

    async function authWalletConnect() {
        await login();
    }

    const disconnect = async () => {
        await logout();
    }

    const connectToWallet = (event: any) => {
        event.preventDefault();
        authWalletConnect();
    };


    const handleChange = (event: any) => {
        let value = event.target.value;
        let name = event.target.name;
        setFormData((prevalue) => {
            return {
                ...prevalue,   // Spread Operator               
                [name]: value
            }
        })
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError("");
        try {
            const result: any = await validateArtistForm(formData);
            if (result.status) {
                const res = await artistRegister(user.id, result.data);
                if (res) {
                    toast.success("Thanks to send the artist registration request!");
                    router.push('/')
                } else {
                    toast.error("Something Went Wrong")
                }
            } else {
                setError(result.errors.shift() || "Something went wrong!");
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const handleRedirect = () => {
        router.push('/');
    }

    if (!tokenUser) {
        return (
            <div className='expi_re'>
                <Image alt="Session Expire Pic" src="/images/expire.png" height={100} width={100} />
                <h2>Session has expired for this URL.</h2>
                <p>Please contact with admin for the artist registration.</p>
                <Button onClick={handleRedirect}>Go To Home Page</Button>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="artist_reg_btn">
                <Button
                    variant='contained'
                    color='primary'
                    onClick={connectToWallet}
                >
                    <BsWallet />
                    CONNECT WALLET
                </Button>

            </div>
        )
    }

    if (user.address !== tokenUser.address) {
        return (
            <div className='expi_re'>
                <Image alt="Wallet Pic" src="/images/wallet.png" height={100} width={100} />
                <h2>Invalid Connected Wallet Address.</h2>
                <p>Please contact with <Typography component="span" sx={{ color: "#1729a7" }}><TrimAndCopyText text={tokenUser.address} /></Typography> wallet.</p>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={disconnect}
                >
                    DISCONNECT WALLET
                </Button>
                <Typography
                    onClick={handleRedirect}
                    component="span"
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 25,
                        color: "#1729a7",
                        cursor: "pointer"
                    }}
                >Go To Home</Typography>
            </div>
        )
    }


    return (
        <Box component="div" className='content-center arti_st' >
            <ToastContainer position="top-right" newestOnTop={false} />
            <Card sx={{ zIndex: 1 }} >
                <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }} className='card_reg'>
                    <Box component="div" sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        <Link href="/" style={{ cursor: "pointer" }} passHref legacyBehavior>
                            <Image alt='Logo' src='/images/logo.webp' height={120} width={120} className='reg_logo' />
                        </Link>
                        <Box component="div" sx={{ mb: 6 }}>
                            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                                Welcome to {themeConfig.templateName}! 👋🏻
                            </Typography>
                            <Typography variant='body2'>Please fill your account details and start the adventure</Typography>
                            <Typography
                                sx={{
                                    color: "#1729a7",
                                    mt: 2
                                }}
                                component="div"
                            >
                                <BsWallet /> <TrimAndCopyText length={10} text={tokenUser.address} />
                            </Typography>
                        </Box>
                    </Box>
                    <Grid container spacing={5}>
                        {
                            error ? (
                                <Grid item xs={12}>
                                    <Alert
                                        variant="outlined"
                                        onClose={() => setError("")}
                                        severity="error"
                                        sx={{
                                            backgroundColor: "none"
                                        }}
                                    >{error}</Alert>
                                </Grid>
                            ) : ""
                        }
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name='name'
                                onChange={handleChange}
                                value={formData.name}
                                label='Full Name'
                                placeholder='Enter the name'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <AccountOutline />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={handleChange}
                                value={formData.email}
                                fullWidth
                                name='email'
                                type='email'
                                label='Email'
                                placeholder='Enter the Email'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <EmailOutline />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                onChange={handleChange}
                                value={formData.username}
                                type='text'
                                name='username'
                                label='Username'
                                placeholder='Enter username'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <AccountOutline />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                onChange={handleChange}
                                value={formData.description}
                                type='text'
                                name='description'
                                label='Bio'
                                placeholder='Enter Bio'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <AccountOutline />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                onChange={handleChange}
                                value={formData.socialLinks.discord}
                                type='text'
                                name='socialLinks.discord'
                                label='Discord Url'
                                placeholder='Enter discord url'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <BsDiscord />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                onChange={handleChange}
                                value={formData.socialLinks.twitter}
                                type='text'
                                name='socialLinks.twitter'
                                label='Twitter Url'
                                placeholder='Enter twitter url'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <BsTwitter />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                onChange={handleChange}
                                value={formData.socialLinks.instagram}
                                type='text'
                                name='socialLinks.instagram'
                                label='Instagram Url'
                                placeholder='Enter instagram url'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <BsInstagram />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                onChange={handleChange}
                                value={formData.socialLinks.facebook}
                                type='text'
                                name='socialLinks.facebook'
                                label='Facebook Url'
                                placeholder='Enter facebook url'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <BsFacebook />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                onChange={handleChange}
                                value={formData.socialLinks.website}
                                type='text'
                                name='socialLinks.website'
                                label='Website Url'
                                placeholder='Enter website url'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <BsGlobe />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>

                        <Grid item xs={12} className='reg_btn'>
                            <Button
                                variant='contained'
                                size='large'
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
}

ArtistsRegister.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ArtistsRegister