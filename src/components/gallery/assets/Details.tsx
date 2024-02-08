import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

interface DetailProps {
    useOpen: () => [boolean, Function];
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

export default function Details({ useOpen, ...props }: DetailProps) {
    const [open, setOpen] = useOpen();
    const { 
        description = "", 
        id,
        title,
        tokenId,
        type,
        collection,
        category,
        ownedBy,
        createdBy,
        price,
        likeCount,
        viewCount,
        marketplace,
        onMarketPlace
    }: any = props;

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className='nft__tocan-box'>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                className="nft__box"
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {title} #{tokenId}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>{description}</Typography>
                    <Typography gutterBottom>
                        <p className='owned-title'>
                            <span>Created By: </span>
                            <span>Token Id</span>
                        </p>
                        <p className='owned-id'>
                        <span><a href="#">black707</a></span>
                            <span>#12</span>
                        </p>
                    </Typography>
                    <Typography gutterBottom>
                        Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
                        magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
                        ullamcorper nulla non metus auctor fringilla.
                    </Typography>
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
}
