import * as React from 'react';
import { useState } from 'react';
import {
    Grid, TextField, Tooltip, Button, Dialog, DialogTitle, DialogContent, IconButton, styled, Stack, Autocomplete, Checkbox, capitalize, CircularProgress, Typography, InputAdornment, FormControlLabel, Collapse, Alert
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { setAdmin } from 'services';
import Box from '@mui/material/Box'
import { CustomModal, ModalContent, ModalFooter, ModalHeader } from 'components/miscellaneous/modal';
import { useNftMarketplaceContract } from 'components/miscellaneous/hooks'
import { Metamask } from 'context';
import { formatSolidityError, getTransactionOptions, IsJsonString } from 'helpers';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/router';

import CloseIcon from '@mui/icons-material/Close';
import WalletIcon from '@mui/icons-material/Wallet';
import EmailOutline from 'mdi-material-ui/EmailOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Lock } from '@mui/icons-material';
import { validateAdminData } from '../../../../../backend/schema/admin';

const defaultStateOptions = {
    isLoader: false,
    isComplete: false,
    isError: false,
    errorMessage: "",
    callback: "",
    title: "",
    description: ""
}

const defaultCancelStates = {
    setAuthorizer: {
        ...defaultStateOptions,
        callback: "setAuthorizerAdmin",
        title: "Cancel Set Authrozer",
        description: "Cancel User from Set Authrozer"
    },
    onOwnServer: {
        ...defaultStateOptions,
        callback: "setAuthorizerApi",
        title: "Sign message",
        description: "Sign message with User preferences"
    }
}
type DefaultCancelProps = typeof defaultCancelStates;


const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

export default function AddAdmin({ sx = {}, useUpdated }: any) {
    const [open, setOpen] = React.useState(false);
    const [updated, setUpdated] = useUpdated();
    const [openModal, setOpenModal] = useState<Boolean>(false)
    const [states, setStates]: [any, Function] = useState<DefaultCancelProps>(defaultCancelStates);
    const { isAuthenticated, login, user, loginUserSigner } = Metamask.useContext();
    const [markteplaceContract] = useNftMarketplaceContract();
    const [cancelTransaction, setCancelTransaction] = useState<any>({});
    const [formData, setFormData] = React.useState({
        address: "",
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        blockchain: false
    });
    const [error, setError] = React.useState({
        status: true,
        message: ""
    });
    const router = useRouter();
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: any) => {
        let { value, name, checked, type } = event.target;
        setFormData((prevalue) => {
            return {
                ...prevalue,   // Spread Operator               
                [name]: type == "checkbox" ? checked : value
            }
        })
    }

    const setFollowStepError = (slug: string, message: string) => {
        var checkPrev = true;
        const newStates: any = states;
        Object.keys(states).forEach((value: string) => {
            const modalValue = newStates[value];
            const object = {
                ...defaultStateOptions,
                callback: modalValue.callback,
                isError: true,
                errorMessage: message || "Something went wrong!"
            }
            if (slug === value) {
                checkPrev = false;
                newStates[value] = object
            }
            if (checkPrev) {
                newStates[value] = {
                    ...defaultStateOptions,
                    callback: modalValue.callback,
                    isComplete: true
                }
            }
        })

        setStates({
            ...newStates
        });
    }

    const tryAgainModal = async () => {
        try {
            const newStates: any = states;
            Object.keys(newStates).forEach(async (element) => {
                try {
                    const modalAsset = newStates[element];
                    if (modalAsset.isError) {
                        if (eval(`typeof ${modalAsset.callback}`) === "function") {
                            await eval(`${modalAsset.callback}()`);
                        }
                    }
                } catch (error: any) {
                    let errorData = formatSolidityError(error.message);
                    if (!errorData.slug) {
                        errorData.slug = "setAuthorizer";
                    }
                    setFollowStepError(errorData.slug, errorData.message)

                }

            });
        } catch (error: any) {
            let errorData = formatSolidityError(error.message);
            if (!errorData.slug) {
                errorData.slug = "setAuthorizer";
            }
            setFollowStepError(errorData.slug, errorData.message)
        }
    }


    const setAuthorizerAdmin = async () => {
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }
            setStates({
                ...{
                    setAuthorizer: {
                        isLoader: true,
                        isComplete: false,
                        isError: false,
                        errorMessage: "",
                        callback: "setAuthorizerAdmin"
                    },
                    onOwnServer: {
                        isLoader: false,
                        isComplete: false,
                        isError: false,
                        errorMessage: "",
                        callback: "setAuthorizerApi"
                    }
                }
            });
            const options: any = {
                from: user.address
            }
            const transactionOptions = await getTransactionOptions();
            if (transactionOptions) {
                options.gasPrice = transactionOptions.gasPrice;
                options.nonce = transactionOptions.nonce;
            }
            var marketPlaceTransaction: any;
            marketPlaceTransaction = await markteplaceContract.addAuthorizerOrOwner(
                [formData.address],
                "authorizer"
            );
            const cancelTx = await marketPlaceTransaction.wait();
            if (cancelTx) {
                setCancelTransaction({
                    ...cancelTx
                });
                await setAuthorizerApi(cancelTx);
            } else {
                const message = "Something went wrong during item remove from sale!"
                throw new Error(JSON.stringify({ slug: "setAuthorizer", message }));
            }
        } catch (error: any) {
            let errorData = formatSolidityError(error.message);
            if (!errorData.slug) {
                errorData.slug = "setAuthorizer";
            }
            throw new Error(JSON.stringify(errorData));
        }
    }


    const setAuthorizerApi = async (tx: any = {}) => {
        try {
            let inputData: any = formData;
            if(formData.blockchain) {
                if (!isAuthenticated) {
                    await login();
                    return;
                }
                setStates({
                    ...{
                        setAuthorizer: {
                            isLoader: false,
                            isComplete: true,
                            isError: false,
                            errorMessage: "",
                            callback: "setAuthorizerAdmin"
                        },
                        onOwnServer: {
                            isLoader: true,
                            isComplete: false,
                            isError: false,
                            errorMessage: "",
                            callback: "setAuthorizerApi"
                        }
                    }
                });
                const userSign = await loginUserSigner()
                if (!userSign.status) {
                    throw new Error(JSON.stringify({ slug: "completed", message: userSign.message }));
                }
                inputData.tx = Object.keys(tx).length ? tx : cancelTransaction;
            }
            const result = await setAdmin(inputData);
            if(formData.blockchain) {
                if (result.status) {
                    setUpdated(!updated);
                    setStates({
                        ...{
                            setAuthorizer: {
                                isLoader: false,
                                isComplete: true,
                                isError: false,
                                errorMessage: "",
                                callback: "setAuthorizerAdmin"
                            },
                            onOwnServer: {
                                isLoader: false,
                                isComplete: true,
                                isError: false,
                                errorMessage: "",
                                callback: "setAuthorizerApi"
                            }
                        }
                    });
                } else {
                    const message = result.message || "something went wrong"
                    throw new Error(JSON.stringify({ slug: "onOwnServer", message }));
                }
            } else {
                if(result.status) {
                    setUpdated(!updated);
                    setOpen(false);
                }
                setError({
                    status: !result.status,
                    message: result.message
                });
                return;
            }
        } catch (error: any) {
            let errorData = formatSolidityError(error.message);
            if (!errorData.slug) {
                errorData.slug = "onOwnServer";
            }
            throw new Error(JSON.stringify(errorData));
        }
    }

   
    const handleSubmit = async () => {
        try {
            const validated = await validateAdminData(formData);
            if(!validated.status) {
                setError({ status: true, message: validated.errors.shift()});
                return;
            }
            setError({ status: true, message: ""});
            if(formData.blockchain) {
                if (!isAuthenticated) {
                    await login();
                    return;
                }
                setOpenModal(true);
                await setAuthorizerAdmin();
            } else {
                setAuthorizerApi();
            }
        } catch (error: any) {
            let errorData = formatSolidityError(error.message);
            if (!errorData.slug) {
                errorData.slug = "buy";
            }
            setFollowStepError(errorData.slug, errorData.message)
        }
    }


    const handleRefreshPage = () => {
        setOpen(false);
        setOpenModal(false);
        setUpdated(!updated);
        setOpenModal(false);
        router.push('/admin')
    }


    return (
        <div>
            <Tooltip title='Add user for Authorizer'>
                <Button
                    variant="outlined"
                    startIcon={<PersonAddAltIcon />}
                    onClick={() => handleClickOpen()}
                    size="small"
                    sx={sx}
                >
                    Add Admin
                </Button>
            </Tooltip>

            {/* <DialogContent dividers>
                    <Stack spacing={3} sx={{ width: 500 }}>
                        <label className='select-user'>Select User</label>
                        <Autocomplete
                            multiple
                            // onChange={(event: any, value: any) => (event, value)}

                            options={users}
                            disableCloseOnSelect
                            getOptionLabel={(option: any) => option.name}
                            renderOption={(props, option, { selected }) => (
                                <li {...props}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    {option.name}
                                </li>
                            )}
                            style={{ width: 500 }}
                            renderInput={(params) => (
                                <>
                                    <TextField {...params} placeholder="..." variant="outlined" />
                                </>
                            )}

                        />

                    </Stack>
                </DialogContent> */}
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Add Admin
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Collapse in={error.message ? true : false}>
                        <Alert
                            {
                            ...{
                                severity: error.status ? "error" : "success"
                            }
                            }
                            action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={() => {
                                        setError({
                                            ...error,
                                            message: ""
                                        });
                                    }}
                                >
                                    <AiOutlineClose />
                                </IconButton>
                            }
                            sx={{ mb: 2 }}
                        >
                            {error.message}
                        </Alert>
                    </Collapse>
                    <Grid container spacing={5}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name='name'
                                onChange={handleChange}
                                value={formData.name}
                                label='Full Name'
                                placeholder='Enter the name'
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
                                value={formData.password}
                                fullWidth
                                name='password'
                                type='password'
                                label='Password'
                                placeholder='Enter the Password'
                                FormHelperTextProps={{
                                    sx: { color: "red" }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Lock />
                                        </InputAdornment>
                                    )
                                }}
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                onChange={handleChange}
                                value={formData.passwordConfirmation}
                                fullWidth
                                name='passwordConfirmation'
                                type='password'
                                label='Confirm Password'
                                placeholder='Enter the Same Password'
                                FormHelperTextProps={{
                                    sx: { color: "red" }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Lock />
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
                        <Grid item xs={12}>
                            <FormControlLabel control={<Checkbox name='blockchain' onChange={handleChange} checked={formData.blockchain} />} label="Do you want set as a smart contract admin?" />
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

            <CustomModal
                aria-labelledby="collection-dialog"
                open={openModal}
                onClose={(_: any, reason: any) => {
                    if (reason !== "backdropClick") {
                        setOpenModal(false);
                    }
                }}
                className="nft-card-buy-section"
            >
                <ModalHeader onClose={() => setOpenModal(false)}>
                    <span className="font-bold">Follow steps</span>
                </ModalHeader>
                <ModalContent className='popup_form_title'>
                    <Box
                        component="div"
                        sx={{
                            pb: 2,
                            mx: 'auto'
                        }}>
                        <Grid container wrap="nowrap" spacing={2}>
                            <Grid item>
                                {
                                    states.setAuthorizer?.isLoader
                                        ? <CircularProgress size={30} color="secondary" />
                                        : <AiOutlineCheck color={states.setAuthorizer.isComplete ? "green" : "secondary"} size={30} />
                                }
                            </Grid>
                            <Grid item xs>
                                <h1 className="font-bold text-[#000] dark:text-[#fff]">Set Authorizer</h1>
                                <Typography>Set Authorizer from users</Typography>
                            </Grid>
                        </Grid>
                        {states.setAuthorizer.isError
                            && <Grid item>
                                <p style={{ color: "red", marginLeft: '8%' }}>{states.setAuthorizer.errorMessage}</p>
                            </Grid>
                        }
                        <Grid container wrap="nowrap" spacing={2} sx={{
                            'mt': 1
                        }}>
                            <Grid item>
                                {
                                    states.onOwnServer.isLoader
                                        ? <CircularProgress size={30} color="secondary" />
                                        : <AiOutlineCheck color={states.onOwnServer.isComplete ? "green" : "secondary"} size={30} />
                                }
                            </Grid>
                            <Grid item xs>
                                <h1 className="font-bold text-[#000] dark:text-[#fff]">Sign Message</h1>
                                <Typography>Sign message with nft item preferences</Typography>
                            </Grid>
                        </Grid>
                        {states.onOwnServer.isError
                            && <Grid item>
                                <p style={{ color: "red", marginLeft: '8%' }}>{states.onOwnServer.errorMessage}</p>
                            </Grid>
                        }
                    </Box>
                </ModalContent>
                {
                    states.onOwnServer.isComplete || states.setAuthorizer.isError || states.onOwnServer.isError ? (
                        <ModalFooter className="steps_popup_button">
                            {
                                states.onOwnServer.isComplete
                                    ? <Link href={window.location.pathname} passHref legacyBehavior>
                                        <Button autoFocus variant="outlined" onClick={handleRefreshPage}>Refresh Page</Button>
                                    </Link>
                                    : (
                                        states.setAuthorizer.isError || states.onOwnServer.isError
                                            ? <Button autoFocus variant="outlined" sx={{ marginRight: '37%' }} onClick={tryAgainModal}>Try again</Button>
                                            : ""
                                    )
                            }
                        </ModalFooter>
                    ) : ""
                }
            </CustomModal>
        </div>
    );
}
