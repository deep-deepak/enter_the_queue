import React, { FC, useState } from 'react'
import Image from 'next/image'
import { BiPlus } from 'react-icons/bi';
import Avatar from '@mui/material/Avatar';
import { Metamask } from '../../context';
import { saveUserFollow, userUnfollow } from '../../services';

interface CreatorProps {
    creator: any;
    id: string
}

const Creator: FC<CreatorProps> = ({ creator, id }) => {
    const { isAuthenticated, user } = Metamask.useContext();
    const [isFollowed, setIsFollowed] = useState(creator.isFollowed);
    const [followers, setFollowers] = useState(creator.followers);

    const handleFollow = async (event: any) => {
        event.preventDefault();
        var status = false;
        if (isFollowed) {
            const result = await userUnfollow(creator.id)
            status = result.status === "success" ? true : false;
        } else {
            const result = await saveUserFollow(creator.id);
            status = result.status === "success" ? true : false;
        }
        if (status) {
            setFollowers(isFollowed ? followers - 1 : followers + 1)
            setIsFollowed(!isFollowed);
        }
    }

    if (!id) {
        return (
            <div>No Creator Found</div>
        )
    }

    return (
        <div className="broadband_section_column_box  creators_columnbox border dark:border-gray-800 dark:border-[#16151a] border-[#6b6e6f33] bg-[#fff] dark:bg-[#ffffff1a] border-2 rounded-xl	 cursor-pointer transition ease-in-out px-5 py-5 ">
            <div className="broadband_section_column_box_image">
                <div className="broadband_section_column_box_bannerimage">
                    {
                        creator.banner ? (
                            <Image
                                src={creator.banner}
                                className=" "
                                alt="my image"
                                height={400}
                                width={400}
                            />
                        ) : (
                            <div className=" profile_dummybg"></div>
                        )
                    }
                </div>

                <div className="broadband_section_column_box_smallimage">
                    {
                        creator.image ? (
                            <Image
                                src={creator.image}
                                className="rounded-full rounded-lg  w-24 h-24  border border-[#fff] border-3 border-[#fff]"
                                alt="my image"
                                height={70}
                                width={70}
                            />
                        ) : (
                            <Avatar alt={creator.name}
                                sx={{
                                    width: "100px",
                                    height: "100px"
                                }} />
                        )
                    }
                </div>

            </div>

            <div className="broadband_section_column_box_content  pt-5 px-3 flex-col flex align-center justify-center w-full	">
                {/* <h2 className="dark:text-white text-[#000] font-semibold text-lg	">{creator.name}</h2> */}


                <h5 className="mb-2 text-2xl font-bold tracking-tight text-black dark:text-white z-10 text-center mt-3">
                    <span title="Home art" className="">{creator.name}</span>
                </h5>



                <h6 className=" dark:text-[#fff] text-[#000] text-sm "> @{creator.username} </h6>
                <div className=" broadband_section_column_box_followers flex  items-center justify-between border-t-1 border-[#707a83] py-4">
                    <div className=" text-left">
                        {/* <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs "><strong>{creator.createdNftCount} </strong>Creations </h6> */}
                        <p className="dark:text-white text-[#0000009e] text-xs"><strong>{creator.createdNftCount} </strong> Creations</p>


                    </div>
                    <div className=" text-left">
                        {/* <h6 className=" dark:text-[#707a83] text-[#707a83] text-xs "><strong>{followers}</strong> Followers </h6> */}
                        <p className="dark:text-white text-[#0000009e] text-xs"><strong>{followers}</strong> Followers</p>
                    </div>
                </div>
                <div className="myprofile_onsale_column_box_end_btn mt-2 ">
                    {
                        isAuthenticated && user.id !== creator.id ? (
                            <button
                                className="bg-blue-500  rounded-full w-full text-white text-xs font-medium flex justify-center align-center	 py-3 px-6 bg-[#571a81]"
                                onClick={handleFollow}
                            > {isFollowed ? "FOLLOWED" : (<>FOLLOW <BiPlus /></>)}</button>
                        ) : ""
                    }
                </div>
            </div>
        </div>
    )
}

export default Creator