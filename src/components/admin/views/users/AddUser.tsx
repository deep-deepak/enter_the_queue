import * as React from 'react';

import { toast } from 'material-react-toastify';
import { 
    Grid, InputAdornment, TextField, Tooltip, Button, Dialog, DialogTitle, DialogContent, IconButton, styled
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import WalletIcon from '@mui/icons-material/Wallet';
import EmailOutline from 'mdi-material-ui/EmailOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

import { addArtist } from 'services';
import { isValidUserWalletAddress } from 'utils';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

export default function AddUser({ sx = {}, useUpdated }: any) {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState({
        name: "",
        message: ""
    });
    const [updated, setUpdated] = useUpdated();
    const [formData, setFormData] = React.useState({
        address: "",
        name: "",
        email: "",
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
        if (!formData.name) {
            setError({
                name: "name",
                message: 'Name must be required!'
            });
            return;
        }
        if (!formData.email) {
            setError({
                name: "email",
                message: 'email must be required!'
            });
            return;
        }
        if (!isValidUserWalletAddress(formData.address)) {
            setError({
                name: "address",
                message: 'Invalid wallet address!'
            });
            return;
        }

        const result = await addArtist(formData)
        if (result) {
            setUpdated(!updated);
            setOpen(false)
            toast.success("User created successfully")
        } else {
            toast.error("Something Went Wrong")
        }
    }

    return (
        <div>
            <Tooltip title='Add Artist'>
                <Button
                    variant="outlined"
                    startIcon={<PersonAddAltIcon />}
                    onClick={() => handleClickOpen()}
                    size="small"
                    sx={sx}
                >
                    Add Artist
                </Button>
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                   Add Artist
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name='name'
                                onChange={handleChange}
                                value={formData.name}
                                label='Full Name'
                                placeholder='Enter the name'
                                helperText={error.name === "name" ? error.message : ""}
                                FormHelperTextProps={{
                                    sx: { color: "red" }
                                }}
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
                                helperText={error.name === "email" ? error.message : ""}
                                FormHelperTextProps={{
                                    sx: { color: "red" }
                                }}
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
                                onChange={handleChange}
                                value={formData.address}
                                fullWidth
                                name='address'
                                type='text'
                                label='Address'
                                placeholder='Enter the Address'
                                helperText={error.name === "address" ? error.message : ""}
                                FormHelperTextProps={{
                                    sx: { color: "red" }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <WalletIcon />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className='reg_btn' sx={{
                        my: 1
                    }}>
                        <Button
                            variant='contained'
                            size='large'
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Grid>
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
}