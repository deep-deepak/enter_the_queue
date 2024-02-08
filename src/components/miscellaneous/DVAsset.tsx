import Image from 'next/image';


interface DVProps {
    url: string;
    alt: string;
    type: string;
    size?: {
        height: number;
        width: number;
    }
    className?: string;
}

const DVAsset = ({
    url = "",
    alt = "NFT Asset ",
    type = "",
    size = {
        height: 300,
        width: 300
    },
    className = ""
}: DVProps) => {

    return (
        <>
            {
                type === "image" ? (
                    <Image
                        className={className ? className : "object-cover w-full rounded-lg	hover:rounded-3xl"}
                        src={url}
                        alt={alt}
                        width={`${size.width || 300}`}
                        height={`${size.height || 300}`}
                    />
                ) : type === "video" ? (
                    <video
                        loop
                        style={{ height: "290px", width: "300px" }}
                        controls
                        controlsList='nodownload'
                        preload="auto"
                    >
                        <source src={url} />
                    </video>
                ) : (
                    <video
                        poster="/music-placeholder.png"
                        style={{ height: "290px", width: "300px" }}
                        controls
                        preload="auto"
                        controlsList="nodownload"
                    >
                        <source src={url} />
                    </video>
                )
            }
        </>
    )
}

export default DVAsset
