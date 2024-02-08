import { useState, FC } from 'react';

import { Filter, NFTCard } from './nft'
import NoDataFound from './miscellaneous/NoDataFound';
import { Metamask } from '../context';
import Link from 'next/link';

interface ExploreProps {
    explores: any[];
    isLoading: Boolean;
    useUpdated?: Function;
    useFilter?: any;
}

const Explore: FC<ExploreProps> = ({ explores, isLoading, useFilter, useUpdated }) => {
    const [viewMode, setViewMode] = useState<Boolean>(true);
    const { isAuthenticated, user }: any = Metamask.useContext();

    const handleOnToggle = (bool: Boolean) => {
        setViewMode(bool);
    }

    return (
        <div className="dark:bg-[#05092b] bg-[#fff]">
            <section className="explore_section  pb-20 pt-10 px-14" >
                <div className="container-fluid mx-auto ">
                    <div className="lg:flex md-flex block flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-between mb-10">
                        <h2 className="dark:text-white text-[#000] text-4xl font-semibold text-center" data-aos="zoom-in" data-aos-duration="3000">Explores</h2>
                        {isAuthenticated && ((user.role === "ARTIST" && user.isApproved) || user.role === "ADMIN") ? (
                            <div className="editprofile_submit_btn ">
                                <Link href="/nft/create" className="editprofile_submit_btn bg-blue-500 hover:bg-blue-700 font-normal py-2 px-4 rounded-full" >
                                    New Create
                                </Link>
                            </div>
                        ) : ""}
                    </div>
                    <Filter onToggle={handleOnToggle} useFilter={useFilter} />
                    <div className="explorepagegridlist_section ">
                        {isLoading ? (
                            <NoDataFound>Loading...</NoDataFound>
                        ) : (
                            <>
                                {
                                    explores.length ? (
                                        <>
                                            <div className={`grid grid-cols-${viewMode ? '2' : '3'} `}>
                                                {
                                                    explores.map((nft, key) => {
                                                        return (
                                                            <div key={key}>
                                                                <NFTCard {...nft} useUpdate={useUpdated} />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </>
                                    ) : (
                                        <NoDataFound>No Item Found</NoDataFound>
                                    )
                                }
                            </>
                        )}
                    </div>
                </div>


            </section>

        </div>
    )
}

export default Explore;