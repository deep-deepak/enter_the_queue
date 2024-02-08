import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { getAllItems } from 'services';
import DVAsset from 'components/miscellaneous/DVAsset';
import { Skeleton } from '@mui/material';
import { NoDataFound } from 'components/miscellaneous';


interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

interface AssetProps {
    useOpen: () => [boolean, Function]
}

export default function Assets({ useOpen }: AssetProps) {
    const [open, setOpen] = useOpen();
    const [isLoading, setIsLoading] = React.useState(false);
    const [assets, setAssets] = React.useState<any[]>([]);

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        (async () => {
            setIsLoading(true);
            let result = await getAllItems();
            setAssets(result);
            setIsLoading(false);
        })();
    }, [])

    return (
        <div>
            <Dialog
                fullWidth
                maxWidth="xl"
                open={open}
                onClose={handleClose}
                scroll="body"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <BootstrapDialogTitle id="assets-title" onClose={handleClose}>
                    All Assets
                </BootstrapDialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText
                        id="asset-detail-description"
                        tabIndex={-1}
                    >
                        {
                            isLoading ? (
                                <ImageList cols={4}>
                                    {
                                        Array(1, 2, 3, 4, 5, 6, 7, 8).map((value) => (
                                            <ImageListItem key={value}>
                                                <Skeleton animation="wave" height={248} variant="rectangular" />
                                            </ImageListItem>
                                        ))
                                    }
                                </ImageList>
                            ) : (
                                <>
                                    {
                                        assets.length ? (
                                            <>
                                                <ImageList cols={4}>
                                                    {assets.map((asset: any, key: number) => (
                                                        <ImageListItem key={key}>
                                                            <DVAsset
                                                                url={asset.image}
                                                                alt={asset.title}
                                                                type={asset.asset.type}
                                                                size={{
                                                                    height: 200,
                                                                    width: 248
                                                                }}
                                                                className="asset-list-image"
                                                            />
                                                            <ImageListItemBar
                                                                title={asset.title}
                                                                subtitle={`@${asset?.ownedBy?.username || asset.createdBy?.username}`}
                                                                actionIcon={
                                                                    <IconButton
                                                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                                        aria-label={`info about ${asset.title}`}
                                                                    >
                                                                        <InfoIcon />
                                                                    </IconButton>
                                                                }
                                                            />
                                                        </ImageListItem>
                                                    ))}
                                                </ImageList>
                                            </>
                                        ) : <NoDataFound>No Assets Found</NoDataFound>
                                    }
                                </>
                            )
                        }

                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
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
                        color: (theme: any) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}