
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Layout from 'components/admin/@core/layouts/Layout'
import { getAdminServerProps } from 'utils/server/getServerProps'
import { useEffect, useState } from 'react'
import { getTemplateById, updateTemplateContent } from 'services/templates'
import { SiteLoader } from 'components/miscellaneous'
import { Alert, Collapse, Divider, FormControl, IconButton, List, ListItem, ListItemText, Typography, capitalize } from '@mui/material'
import { AiOutlineClose } from 'react-icons/ai'
import CreatableSelect from 'react-select/creatable';
import Link from 'next/link'


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


const defaultData: any = [
    {
        name: "Home",
        url: "/",
        position: "1"
    },
    {
        name: "Marketplace",
        url: "/discover",
        position: "2"
    },
    {
        name: "Artists",
        url: "/creators",
        position: "3"
    },
    {
        name: "About",
        url: "/about",
        position: "4"
    },
    {
        name: "Gallery",
        url: "/gallery",
        position: "5"
    },
    {
        name: "Admin Login",
        url: "/admin/login",
        position: "6"
    }
]

const EditTemplate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [template, setTemplate] = useState<any>(false);
    const [status, setStatus] = useState("publish");
    const [isError, setIsError] = useState({
        status: false,
        message: ""
    });

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const result = await getTemplateById("header", {
                column: "slug"
            });
            setTemplate(result);
            const itemData = result?.menus || defaultData;
            setItems(itemData);
            setIsLoading(false);
        })();
    }, []);


    const [items, setItems] = useState<any[]>(defaultData);
    const orderedItems = items.sort((a, b) => {
        return a.position - b.position;
    });

    const handleSelect = (data: any) => {
        setStatus(data.value);
    }

    const handleChangePosition = (item: any, position: string, column: string = "position") => {
        let newItems = items;
        newItems = newItems.map(newItem => {
            if (newItem.url == item.url) {
                newItem[column] = position
            }
            return newItem;
        })
        setItems(newItems);
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const result = await updateTemplateContent(template.id, {
                menus: items,
                status: status
            })
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
        setIsEditable(false);
        setIsLoading(false);
    }

    const menuPositions = [
        {
            label: "First",
            value: "1"
        },
        {
            label: "Second",
            value: "2"
        },
        {
            label: "Third",
            value: "3"
        },
        {
            label: "Fourth",
            value: "4"
        },
        {
            label: "Fifth",
            value: "5"
        },
        {
            label: "Sixth",
            value: "6"
        },
        {
            label: "Seventh",
            value: "7"
        },
        {
            label: "Eight",
            value: "8"
        },
        {
            label: "Ninth",
            value: "9"
        }
    ];

    return (
        <Layout>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title='Header'
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

                                                <div className="grid grid-cols-1 mb-10">
                                                    <Typography>Menu Items</Typography>
                                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.primary' }}>
                                                        {
                                                            orderedItems.map((item: any, key: number) => {
                                                                const positionValue = item.position > 0 ? item.position : (key + 1).toString();
                                                                const value = menuPositions.find(position => position.value == positionValue)
                                                                return (
                                                                    <>
                                                                        <ListItem key={key} alignItems="flex-start">
                                                                            <ListItemText
                                                                                primary={isEditable ? (
                                                                                    <input
                                                                                        style={{
                                                                                            width: "200px",
                                                                                            padding: "5px 10px"
                                                                                        }}
                                                                                        className="shadow appearance-none dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm"
                                                                                        onChange={(e) => handleChangePosition(item, e.target.value, "name")}
                                                                                        value={item.name}
                                                                                        type="text"
                                                                                        placeholder="Enter Menu Name"
                                                                                    />
                                                                                ) : <Typography onClick={() => setIsEditable(true)}>{item.name}</Typography>}
                                                                                secondary={
                                                                                    <Link href={item.url} passHref target='_blank' style={{
                                                                                        color: "#9155FD",
                                                                                        marginTop: "10px"
                                                                                    }}>
                                                                                        {item.url}
                                                                                    </Link>
                                                                                }
                                                                            />
                                                                            <CreatableSelect className="py-1 rounded leading-tight dark:text-white text-[#7d7d7d] text-sm flex-inline"
                                                                                options={menuPositions}
                                                                                value={value}
                                                                                onChange={(data) => handleChangePosition(item, data.value)}
                                                                                styles={customStyles}
                                                                                placeholder="Select Position"
                                                                                name={`position|${key}`}

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
                                                                        </ListItem>
                                                                        <Divider variant="inset" component="li" />
                                                                    </>
                                                                )

                                                            })
                                                        }
                                                    </List>
                                                </div>

                                                <div className="grid grid-cols-1 mb-5">
                                                    <FormControl
                                                        className="mb-6 md:mb-0"
                                                        id="status"
                                                    >
                                                        <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="status">
                                                            Status
                                                        </label>
                                                        <CreatableSelect className="collection_select block  appearance-none w-full py-1 rounded leading-tight dark:text-white text-[#7d7d7d] text-sm"
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
                                                                label: capitalize(status),
                                                                value: status
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

export default EditTemplate
