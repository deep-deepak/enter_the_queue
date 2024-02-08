import * as React from 'react';
import { useState } from 'react'
import Box from '@mui/material/Box'
import {
    Grid, Tooltip, Button, Dialog, DialogTitle, DialogContent, Chip,
    DialogActions, IconButton, styled, FormControlLabel, FormControl, capitalize, CircularProgress, Typography, Divider
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import CloseIcon from '@mui/icons-material/Close';
import { CustomModal, ModalContent, ModalFooter, ModalHeader } from 'components/miscellaneous/modal';
import { removeFromAdmin } from 'services';
import { MdOutlinePersonRemoveAlt1 } from 'react-icons/md';
import { Metamask } from 'context';
import { useNftMarketplaceContract } from 'components/miscellaneous/hooks';
import { formatSolidityError, getTransactionOptions, IsJsonString } from 'helpers';
import { AiOutlineCheck } from 'react-icons/ai';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
    removeAuthorizer: {
        ...defaultStateOptions,
        callback: "removeAuthorizer",
        title: "Cancel Remove From Authorizer",
        description: "Cancel User Remove From Authorizer"
    },
    onOwnServer: {
        ...defaultStateOptions,
        callback: "removeAuthorizerApi",
        title: "Sign message",
        description: "Sign message with User preferences"
    }
}
type DefaultCancelProps = typeof defaultCancelStates;


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

export default function RemoveAuthorizer({ useUpdated, userId, userAddress }: any) {
    const [open, setOpen] = React.useState(false);
    const [userType, setUserType] = React.useState("");
    const [updated, setUpdated] = useUpdated();

    const [openModal, setOpenModal] = useState<Boolean>(false)
    const [states, setStates]: [any, Function] = useState<DefaultCancelProps>(defaultCancelStates);
    const { isAuthenticated, login, user, loginUserSigner } = Metamask.useContext();
    const [markteplaceContract] = useNftMarketplaceContract();
    const [cancelTransaction, setCancelTransaction] = useState<any>({});

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: any) => {
        const value = event.target.value;
        setUserType(value)
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
                    var parseJson: any = IsJsonString(error.message);
                    if (!parseJson) {
                        parseJson = {
                            slug: "removeAuthorizer",
                            message: error.message
                        }
                    }
                    setFollowStepError(parseJson.slug, parseJson.message);
                }
            });
        } catch (error: any) {
            var parseJson: any = IsJsonString(error.message);
            if (!parseJson) {
                parseJson = {
                    slug: "removeAuthorizer",
                    message: error.message
                }
            }
            setFollowStepError(parseJson.slug, parseJson.message);
        }
    }

    const removeAuthorizer = async () => {
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }
            setStates({
                ...{
                    removeAuthorizer: {
                        isLoader: true,
                        isComplete: false,
                        isError: false,
                        errorMessage: "",
                        callback: "removeAuthorizer"
                    },
                    onOwnServer: {
                        isLoader: false,
                        isComplete: false,
                        isError: false,
                        errorMessage: "",
                        callback: "removeAuthorizerApi"
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

            marketPlaceTransaction = await markteplaceContract.deleteAuthorizerOrOwner(
                userAddress,
                "authorizer"
            );

            const cancelTx = await marketPlaceTransaction.wait();
            if (cancelTx) {
                setCancelTransaction({
                    ...cancelTx
                });
                await removeAuthorizerApi(cancelTx);
            } else {
                const message = "Something went wrong during item remove from sale!"
                throw new Error(JSON.stringify({ slug: "removeAuthorizer", message }));
            }
        } catch (error: any) {
            const err = formatSolidityError(error.message);
            const message = err ? capitalize(err.message) : error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "removeAuthorizer",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }
    }

    const removeAuthorizerApi = async (tx: any = {}) => {
        tx = Object.keys(tx).length ? tx : cancelTransaction;
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }
            setStates({
                ...{
                    removeAuthorizer: {
                        isLoader: false,
                        isComplete: true,
                        isError: false,
                        errorMessage: "",
                        callback: "removeAuthorizer"
                    },
                    onOwnServer: {
                        isLoader: true,
                        isComplete: false,
                        isError: false,
                        errorMessage: "",
                        callback: "removeAuthorizerApi"
                    }
                }
            });
            const userSign = await loginUserSigner()
            if (!userSign.status) {
                throw new Error(JSON.stringify({ slug: "completed", message: userSign.message }));
            }
            const result = await removeFromAdmin(userId);
            if (result) {
                setUpdated(!updated);
                setStates({
                    ...{
                        removeAuthorizer: {
                            isLoader: false,
                            isComplete: true,
                            isError: false,
                            errorMessage: "",
                            callback: "removeAuthorizer"
                        },
                        onOwnServer: {
                            isLoader: false,
                            isComplete: true,
                            isError: false,
                            errorMessage: "",
                            callback: "removeAuthorizerApi"
                        }
                    }
                });
            } else {
                const message = "something went wrong"
                throw new Error(JSON.stringify({ slug: "onOwnServer", message }));
            }
        } catch (error: any) {
            const message = error.message || "something went wrong";
            var parseJson: any = IsJsonString(message);
            if (!parseJson) {
                parseJson = {
                    slug: "onOwnServer",
                    message: message
                }
            }
            throw new Error(JSON.stringify(parseJson));
        }
    }

    const handleRemoveAuthorizer = async () => {
        try {
            if (!isAuthenticated) {
                await login();
                return;
            }

            setOpenModal(true);
            if (!user) throw new Error("User not Found");
            await removeAuthorizer();
        } catch (error: any) {
            var parseJson: any = IsJsonString(error.message);
            if (!parseJson) {
                parseJson = {
                    slug: "buy",
                    message: error.message
                }
            }
            setFollowStepError(parseJson.slug, parseJson.message);
        }
        return false;
    }

    const router = useRouter()

    const handleRefreshPage = () => {
        setOpen(false);
        setOpenModal(false);
        setUpdated(!updated);
        setOpenModal(false);
        router.push('/admin/authorizers')
    }

    return (
        <div>
            <Tooltip title='Remove user for Authorizer'>
                <Chip
                    size='small'
                    label="Remove"
                    variant="filled"
                    onClick={() => handleClickOpen()}
                    color='error'
                />
            </Tooltip>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Remove User From  Authorizer
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">User Type</FormLabel>
                        <RadioGroup
                            row
                            style={{ width: 500, padding: "12px 4px 17px 180px" }}
                            onChange={handleChange}
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="use-radio-group"
                        >
                            <FormControlLabel value="artist" control={<Radio />} label="Artist" />
                            <FormControlLabel value="user" control={<Radio />} label="User" />
                        </RadioGroup>
                    </FormControl>

                </DialogContent>
                <DialogActions>
                    <Grid item xs={12} className='reg_btn' sx={{
                        my: 1
                    }}>
                        <Button
                            variant='contained'
                            size='large'
                            onClick={handleRemoveAuthorizer}
                        >
                            Submit
                        </Button>
                    </Grid>
                </DialogActions>
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
                                    states.removeAuthorizer?.isLoader
                                        ? <CircularProgress size={30} color="secondary" />
                                        : <AiOutlineCheck color={states.removeAuthorizer.isComplete ? "green" : "secondary"} size={30} />
                                }
                            </Grid>
                            <Grid item xs>
                                <h1 className="font-bold text-[#000] dark:text-[#fff]">Remove Authorizer</h1>
                                <Typography>Remove From Authorizer</Typography>
                            </Grid>
                        </Grid>
                        {states.removeAuthorizer.isError
                            && <Grid item>
                                <p style={{ color: "red", marginLeft: '8%' }}>{states.removeAuthorizer.errorMessage}</p>
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
                    states.onOwnServer.isComplete || states.removeAuthorizer.isError || states.onOwnServer.isError ? (
                        <ModalFooter className="steps_popup_button">
                            {
                                states.onOwnServer.isComplete
                                    ? <Link href={window.location.pathname} passHref legacyBehavior>
                                        <Button autoFocus variant="outlined" onClick={handleRefreshPage}>Refresh Page</Button>
                                    </Link>
                                    : (
                                        states.removeAuthorizer.isError || states.onOwnServer.isError
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