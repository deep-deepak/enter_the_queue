
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Layout from 'components/admin/@core/layouts/Layout'
import { getAdminServerProps } from 'utils/server/getServerProps'
import { useEffect, useRef, useState } from 'react'
import { getTemplateById, updateTemplateContent } from 'services/templates'
import { SiteLoader } from 'components/miscellaneous'
import { Editor } from '@tinymce/tinymce-react';
import { Alert, Collapse, FormControl, IconButton, capitalize } from '@mui/material'
import { AiOutlineClose } from 'react-icons/ai'
import CreatableSelect from 'react-select/creatable';

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

const EditTemplate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [template, setTemplate] = useState<any>(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isError, setIsError] = useState({
        status: false,
        message: ""
    });
    const [formData, setFormData] = useState<any>({
        content: template?.content || "",
        status: template?.status || "publish"
    });
    const copyrightRef = useRef(null);
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const section4Ref = useRef(null);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const result = await getTemplateById("footer", {
                column: "slug"
            });
            setTemplate(result);
            if (result) {
                setFormData({
                    content: result?.content || "",
                    status: result?.status || "publish"
                })
            }
            setIsLoading(false);
        })();
    }, []);



    const handleChange = (event: any) => {
        event.preventDefault();
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setIsSubmitLoading(false);
    };

    const handleSelect = (data: any, others: any) => {
        setFormData({ ...formData, [others.name]: data.value });
    }

    const handleSubmit = async () => {
        setIsSubmitLoading(true);
        try {
            let sections = [
                section1Ref.current.getContent(),
                section2Ref.current.getContent(),
                section3Ref.current.getContent(),
                section4Ref.current.getContent()
            ];
            sections = sections.filter(section => section);
            const result = await updateTemplateContent(template.id, {
                content: copyrightRef.current.getContent(),
                sections
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
        setIsSubmitLoading(false);
    }

    return (
        <Layout>
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title='Footer Section'
                            titleTypographyProps={{ variant: 'h6' }}
                        />
                        {
                            isLoading ? (
                                <SiteLoader />
                            ) : (
                                <>

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
                                                    <div className="grid grid-cols-1 mb-5">
                                                        <FormControl
                                                            className="mb-6 md:mb-0"
                                                        >
                                                            <label
                                                                className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                                                                htmlFor="content"
                                                            >Copyright Content</label>
                                                            <div style={{ minHeight: "100px" }}>
                                                                <Editor
                                                                    tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                                                    onInit={(evt, editor) => copyrightRef.current = editor}
                                                                    initialValue={template.content || ""}
                                                                    init={{
                                                                        height: 200,
                                                                        menubar: true,
                                                                        plugins: [
                                                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                                            'insertdatetime', 'preview', 'help', 'wordcount'
                                                                        ],
                                                                        toolbar: 'undo redo | blocks | ' +
                                                                            'bold italic forecolor | alignleft aligncenter ' +
                                                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                                                            'removeformat | help',
                                                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    </div>

                                                    <div className="grid grid-cols-1 mb-10">
                                                        <FormControl
                                                            id="content"
                                                        >
                                                            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="content">
                                                                Section 1
                                                            </label>
                                                            <div style={{ minHeight: "300px" }}>
                                                                <Editor
                                                                    tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                                                    onInit={(evt, editor) => section1Ref.current = editor}
                                                                    initialValue={template.sections?.[0] || ""}
                                                                    init={{
                                                                        height: 300,
                                                                        menubar: true,
                                                                        plugins: [
                                                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount', 'image'
                                                                        ],
                                                                        toolbar: 'undo redo | blocks | ' +
                                                                            'bold italic forecolor | alignleft aligncenter ' +
                                                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                                                            'removeformat | image | help',
                                                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                                        images_file_types: 'jpg,svg,webp'
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    </div>
                                                    <div className="grid grid-cols-1 mb-10">
                                                        <FormControl
                                                            id="content"
                                                        >
                                                            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="content">
                                                                Section 2
                                                            </label>
                                                            <div style={{ minHeight: "300px" }}>
                                                                <Editor
                                                                    tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                                                    onInit={(evt, editor) => section2Ref.current = editor}
                                                                    initialValue={template.sections?.[1] || ""}
                                                                    init={{
                                                                        height: 300,
                                                                        menubar: true,
                                                                        plugins: [
                                                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount', 'image'
                                                                        ],
                                                                        toolbar: 'undo redo | blocks | ' +
                                                                            'bold italic forecolor | alignleft aligncenter ' +
                                                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                                                            'removeformat | image | help',
                                                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                                        images_file_types: 'jpg,svg,webp'
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    </div>
                                                    <div className="grid grid-cols-1 mb-10">
                                                        <FormControl
                                                            id="content"
                                                        >
                                                            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="content">
                                                                Section 3
                                                            </label>
                                                            <div style={{ minHeight: "300px" }}>
                                                                <Editor
                                                                    tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                                                    onInit={(evt, editor) => section3Ref.current = editor}
                                                                    initialValue={template.sections?.[2] || ""}
                                                                    init={{
                                                                        height: 300,
                                                                        menubar: true,
                                                                        plugins: [
                                                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount', 'image'
                                                                        ],
                                                                        toolbar: 'undo redo | blocks | ' +
                                                                            'bold italic forecolor | alignleft aligncenter ' +
                                                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                                                            'removeformat | image | help',
                                                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                                        images_file_types: 'jpg,svg,webp'
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                    </div>
                                                    <div className="grid grid-cols-1 mb-10">
                                                        <FormControl
                                                            id="content"
                                                        >
                                                            <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="content">
                                                                Section 4
                                                            </label>
                                                            <div style={{ minHeight: "300px" }}>
                                                                <Editor
                                                                    tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                                                    onInit={(evt, editor) => section4Ref.current = editor}
                                                                    initialValue={template.sections?.[3] || ""}
                                                                    init={{
                                                                        height: 300,
                                                                        menubar: true,
                                                                        plugins: [
                                                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                                                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                                            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount', 'image'
                                                                        ],
                                                                        toolbar: 'undo redo | blocks | ' +
                                                                            'bold italic forecolor | alignleft aligncenter ' +
                                                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                                                            'removeformat | image | help',
                                                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                                        images_file_types: 'jpg,svg,webp'
                                                                    }}
                                                                />
                                                            </div>
                                                        </FormControl>
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
                                                        {!isSubmitLoading ? (
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
                                </>
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
