import { useState, useRef } from 'react'
import { BiCopy } from 'react-icons/bi';
import CopyToClipboard from 'react-copy-to-clipboard';

import { trimString } from '../../helpers';
import { Tooltip } from '@mui/material';

export const TrimAndCopyText = (props: any) => {
    const [copied, setCopied] = useState<Boolean>(false);
    const [show, setShow] = useState(false);
    const target = useRef(null);
    const { text, length = 4 } = props;

    const copyContent = (action: Boolean) => {
        setCopied(action)
        if (action) {
            setTimeout(() => {
                setCopied(false);
                setShow(false)
            }, 2000);
        }
    }

    return (
        <>
            <CopyToClipboard
                text={text}
                onCopy={() => copyContent(true)}
            >
                <Tooltip title={text}>
                    <div style={{
                        display: "inline-flex"
                    }}>
                        <span>{trimString(text, length)}</span>
                        <span title='Copy Address' style={{
                            marginLeft: "10px",
                            fontSize: "20px",
                            cursor: "pointer"
                        }} ref={target} onClick={() => setShow(true)}><BiCopy /></span>
                    </div>
                </Tooltip>
            </CopyToClipboard>
        </>
    );
}