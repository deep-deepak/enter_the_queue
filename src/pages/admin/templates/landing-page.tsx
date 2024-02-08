
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Layout from 'components/admin/@core/layouts/Layout'
import { getAdminServerProps } from 'utils/server/getServerProps'
import { useEffect, useMemo, useState } from 'react'
import { getTemplateById, updateTemplateContent } from 'services/templates'
import { SiteLoader } from 'components/miscellaneous'
import { Alert, Collapse, FormControl, IconButton, Typography, capitalize } from '@mui/material'
import { AiOutlineClose } from 'react-icons/ai'
import CreatableSelect from 'react-select/creatable';
import Select, { StylesConfig } from 'react-select';
import { getAllItems, getCategories } from 'services'


const customStyles = {
    option: (provided: any, state: any) => ({
        ...provided,
        // borderBottom: '1px solid rgb(229, 232, 235)',
        color: state.isSelected ? '#fff' : '',
        backgroundColor: state.isSelected ? '#1729a7' : '',
        // color: state.isSelected ? '#fff' : '#fff',
        // backgroundColor: state.isSelected ? '#1729a7' : '#000',


        //dark  color: state.isSelected ? '#fff' : '#fff',
        //dark  borderBottom: '1px solid #000',
        //dark   backgroundColor: state.isSelected ? '#1729a7' : '#000',

        // background: "#023950",
        "&:hover": {
            backgroundColor: state.isFocused ? "#1729a7" : "#1729a7",
            color: state.isFocused ? "#fff" : "#1729a7",
        }


    }),
    control: (provided: any) => ({
        ...provided,
        padding: "0%",
    })
}

const LandingPageTemplate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdateLoading, setIsUpdateLoading] = useState(false);
    const [template, setTemplate] = useState<any>(false);
    const [isError, setIsError] = useState({
        status: false,
        message: ""
    });

    const defaultData = useMemo(() => {
        return {
            banner: {
                title: "",
                logo: "",
                video: ""
            },
            sections: [
                {
                    "title": "New Releases",
                    "nfts": []
                },
                {
                    "title": "Digital Nft's",
                    "nfts": []
                },
                {
                    "title": "Categories",
                    "categories": []
                },
                {
                    "title": "Video Arts",
                    "nfts": []
                }
            ],
            join_us: {
                title: "JOIN OUR COMMUNITY",
                description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                button_text: "CONTACT US"
            },
            status: "publish"
        };
    }, [])
    const [formData, setFormData] = useState<any>(defaultData);
    const [categories, setCategories] = useState<any[]>([]);
    const [nfts, setNfts] = useState<any[]>([]);
    const [videoNfts, setVideoNfts] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const result = await getTemplateById("landing-page", {
                column: "slug"
            });
            setTemplate(result);
            if (result) {
                setFormData({
                    banner: {
                        title: result?.banner?.title || "",
                        logo: "",
                        video: ""
                    },
                    sections: result?.sections || defaultData.sections,
                    join_us: result?.join_us || defaultData.join_us,
                    status: result?.status || "publish"
                })
            }
            setIsLoading(false);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const allCategories = await getCategories();
            setCategories(allCategories.map(category => ({
                label: category.name,
                value: category.id
            })));

            const allNfts = await getAllItems();
            const items = [];
            const videoItems = [];
            for (let i = 0; i < allNfts.length; i++) {
                const element = allNfts[i];
                if(element.asset.type === "video") {
                    videoItems.push({
                        label: element.title,
                        value: element.id
                    });
                }
                items.push({
                    label: element.title,
                    value: element.id
                })
            }
            setNfts(items);
            setVideoNfts(videoItems);
        })();
    }, []);


    const handleChange = (event: any) => {
        event.preventDefault();
        const { name, value } = event.target;
        let newFormData: any = formData;
        const [param1, param2] = name.split("|");
        newFormData = {
            ...newFormData,
            [param1]: {
                ...newFormData[param1],
                [param2]: {
                    title: value,
                    nfts: newFormData[param1][param2].nfts || []
                }
            }
        }
        setFormData(newFormData);
        setIsUpdateLoading(false);
    };

    const handleSelect = (data: any, others: any) => {
        let value = data.value;
        if(typeof data.length !== "undefined")  {
            value = data.map(v => v.value);
        }
        const [param1, param2, param3] = others.name.split("|");
        if(typeof param2 === "undefined") {
            setFormData({ ...formData, [others.name]: value });
        } else {
            let newFormData = formData;
            newFormData = {
                ...newFormData,
                [param1]: {
                    ...newFormData[param1],
                    [param2]: {
                        title: newFormData[param1][param2].title || "",
                        [param3]: value
                    }
                }
            }
            setFormData(newFormData);
        }
    }

    const handleSubmit = async () => {
        setIsUpdateLoading(true);
        try {
            const result = await updateTemplateContent(template.id, formData)
            if (result.status == "success") {
                setIsError({
                    status: false,
                    message: "Content save successfully!"
                })
            } else {
                setIsError({
                    status: true,
                    message: "Content not save successfully!"
                })
            }
        } catch (error: any) {
        }
        setIsUpdateLoading(false);
    }

    const newRealesedNfts = nfts.filter(nft => {
        const defaultNfts = formData.sections?.[0].nfts || [];
        return defaultNfts.includes(nft.value);
    })

    const artistNfts = nfts.filter(nft => {
        const defaultNfts = formData.sections?.[1].nfts || [];
        return defaultNfts.includes(nft.value);
    })

    const categoryValues = categories.filter(category => {
        const defaultCategories = formData.sections?.[2].categories || [];
        return defaultCategories.includes(category.value);
    })

    const videoNftValues = videoNfts.filter(nft => {
        const defaultVideoNfts = formData.sections?.[3].nfts || [];
        return defaultVideoNfts.includes(nft.value);
    })

    return (
        <Layout>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title='Landing Page'
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        {
                            isLoading ? (
                                <SiteLoader />
                            ) : (

                                <section className="createpage_section">
                                    <div className="container-fluid mx-auto " data-aos="fade-left" data-aos-duration="3000">
                                        <div className="create_form dark:bg-[#09080d] lg:p-5 md:p-5 p-0 rounded-lg ">
                                            <form className="w-full">
                                                <Collapse in={isError.message ? true : false}>
                                                    <Alert
                                                        {
                                                        ...{
                                                            severity: isError.status ? "error" : "success"
                                                        }
                                                        }
                                                        action={
                                                            <IconButton
                                                                aria-label="close"
                                                                color="inherit"
                                                                size="small"
                                                                onClick={() => {
                                                                    setIsError({
                                                                        ...isError,
                                                                        message: ""
                                                                    });
                                                                }}
                                                            >
                                                                <AiOutlineClose />
                                                            </IconButton>
                                                        }
                                                        sx={{ mb: 2 }}
                                                    >
                                                        {isError.message}
                                                    </Alert>
                                                </Collapse>
                                                <Typography variant='h6' sx={{ mb: 2 }}>Banner Content</Typography>
                                                <div className='mx-4'>
                                                    <div className="grid grid-cols-1 mb-5">
                                                        <FormControl
                                                            className="mb-6 md:mb-0"
                                                        >
                                                            <label
                                                                className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                                htmlFor="title"
                                                            >Title</label>
                                                            <input
                                                                className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm"
                                                                onChange={handleChange}
                                                                name="banner|title"
                                                                id="title"
                                                                value={formData.banner.title}
                                                                type="text"
                                                                placeholder="Enter Title"
                                                            />
                                                        </FormControl>
                                                    </div>

                                                </div>
                                                <Typography variant='h6' sx={{ mb: 2 }}>Section Content</Typography>
                                                <div className='mx-4'>
                                                    <div className="grid grid-cols-1 mb-5">
                                                        <FormControl
                                                            className="mb-6 md:mb-0"
                                                        >
                                                            <label
                                                                className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                                htmlFor="section-1"
                                                            >New Release Section</label>
                                                            <input
                                                                className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm mb-4"
                                                                onChange={handleChange}
                                                                name="sections|0"
                                                                id="section-1"
                                                                value={formData.sections?.[0].title || ""}
                                                                type="text"
                                                                placeholder="Enter Here"
                                                            />

                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                value={newRealesedNfts}
                                                                isMulti
                                                                options={nfts}
                                                                onChange={handleSelect}
                                                                name="sections|0|nfts"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <div className="grid grid-cols-1 mb-5">
                                                        <FormControl
                                                            className="mb-6 md:mb-0"
                                                        >
                                                            <label
                                                                className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                                htmlFor="section-2"
                                                            >Artists Section</label>
                                                            <input
                                                                className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm mb-4"
                                                                onChange={handleChange}
                                                                name="sections|1"
                                                                id="section-2"
                                                                value={formData.sections?.[1].title || ""}
                                                                type="text"
                                                                placeholder="Enter Here"
                                                            />

                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                value={artistNfts}
                                                                isMulti
                                                                options={nfts}
                                                                onChange={handleSelect}
                                                                name="sections|1|nfts"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <div className="grid grid-cols-1 mb-5">
                                                        <FormControl
                                                            className="mb-6 md:mb-0"
                                                        >
                                                            <label
                                                                className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                                htmlFor="section-3"
                                                            >Categories Section</label>
                                                            <input
                                                                className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm mb-4"
                                                                onChange={handleChange}
                                                                name="sections|2"
                                                                id="section-3"
                                                                value={formData.sections?.[2].title || ""}
                                                                type="text"
                                                                placeholder="Enter Here"
                                                            />

                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                value={categoryValues}
                                                                isMulti
                                                                options={categories}
                                                                onChange={handleSelect}
                                                                name="sections|2|categories"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <div className="grid grid-cols-1 mb-5">
                                                        <FormControl
                                                            className="mb-6 md:mb-0"
                                                        >
                                                            <label
                                                                className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                                htmlFor="section-4"
                                                            >Video Arts Section</label>
                                                            <input
                                                                className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm mb-4"
                                                                onChange={handleChange}
                                                                name="sections|3"
                                                                id="section-4"
                                                                value={formData.sections?.[3].title || ""}
                                                                type="text"
                                                                placeholder="Enter Here"
                                                            />

                                                            <Select
                                                                closeMenuOnSelect={false}
                                                                value={videoNftValues}
                                                                isMulti
                                                                options={videoNfts}
                                                                onChange={handleSelect}
                                                                name="sections|3|nfts"
                                                            />
                                                        </FormControl>
                                                    </div>

                                                </div>
                                                <Typography variant='h6' sx={{ mb: 2 }}>Join Us Content</Typography>
                                                <div className='mx-4'>
                                                    <div className="grid grid-cols-1 mb-5">
                                                        <FormControl
                                                            className="mb-6 md:mb-0"
                                                        >
                                                            <label
                                                                className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                                htmlFor="join_us-title"
                                                            >Title</label>
                                                            <input
                                                                className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm"
                                                                onChange={handleChange}
                                                                name="join_us|title"
                                                                id="join_us-title"
                                                                value={formData.join_us.title}
                                                                type="text"
                                                                placeholder="Enter Title"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <div className="grid grid-cols-1 mb-5">
                                                        <FormControl
                                                            className="mb-6 md:mb-0"
                                                        >
                                                            <label
                                                                className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                                htmlFor="join_us-description"
                                                            >Description</label>
                                                            <input
                                                                className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm"
                                                                onChange={handleChange}
                                                                name="join_us|description"
                                                                id="join_us-description"
                                                                value={formData.join_us.description}
                                                                type="text"
                                                                placeholder="Enter Description"
                                                            />
                                                        </FormControl>
                                                    </div>
                                                    <div className="grid grid-cols-1 mb-5">
                                                        <FormControl
                                                            className="mb-6 md:mb-0"
                                                        >
                                                            <label
                                                                className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                                htmlFor="button_text"
                                                            >Button Text</label>
                                                            <input
                                                                className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm"
                                                                onChange={handleChange}
                                                                name="join_us|button_text"
                                                                id="button_text"
                                                                value={formData.join_us.button_text}
                                                                type="text"
                                                                placeholder="Enter Button Text"
                                                            />
                                                        </FormControl>
                                                    </div>

                                                </div>

                                                <div className="grid grid-cols-1 mb-5">
                                                    <FormControl
                                                        className="mb-6 md:mb-0"
                                                        id="status"
                                                    >
                                                        <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="status">
                                                            Status
                                                        </label>
                                                        <Select className="collection_select block  appearance-none w-full py-1 rounded leading-tight dark:text-white text-[#7d7d7d] text-sm"
                                                            isClearable
                                                            onChange={handleSelect}
                                                            options={[
                                                                {
                                                                    label: "Publish",
                                                                    value: "publish"
                                                                },
                                                                {
                                                                    label: "Draft",
                                                                    value: "draft"
                                                                }
                                                            ]}
                                                            value={{
                                                                label: capitalize(formData.status),
                                                                value: formData.status
                                                            }}
                                                            styles={customStyles}
                                                            placeholder="Select Status"
                                                            name="status"

                                                            theme={(theme) => ({
                                                                ...theme,
                                                                borderRadius: 0,
                                                                colors: {
                                                                    ...theme.colors,
                                                                    // primary25: 'hotpink',
                                                                    primary: '#1729a7',
                                                                },
                                                            })}

                                                        />
                                                    </FormControl>
                                                </div>
                                                <div className="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1 editprofile_submit_btn" style={{ marginTop: 60 }}>
                                                    {!isLoading ? (
                                                        <button
                                                            type="button"
                                                            className="bg-blue-500 hover:bg-blue-700 rounded-full text-white font-bold py-3 px-6"
                                                            onClick={handleSubmit}
                                                        >
                                                            Submit
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="bg-blue-500 rounded-full text-white font-bold py-3 px-6 cursor-not-allowed"
                                                        >
                                                            Loading...
                                                        </button>
                                                    )}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </section>
                            )
                        }
                    </Card>
                </Grid>

            </Grid>
        </Layout>
    )
}

export const getServerSideProps = (ctx: any) => {
    return getAdminServerProps(ctx);
};

export default LandingPageTemplate
