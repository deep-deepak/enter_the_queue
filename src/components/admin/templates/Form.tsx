import { useState, useRef } from "react";

import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import { Editor } from '@tinymce/tinymce-react';


import { AiOutlineClose } from "react-icons/ai";
import CreatableSelect from 'react-select/creatable';
import { capitalize } from "@mui/material";
import { updateTemplateContent } from "services/templates";


export interface NftInputProps {
    title: string,
    status: string;
}

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

function Form({ template }: any) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({
        status: false,
        message: ""
    });
    const editorRef = useRef(null);

    const defaultData = {
        title: template.title,
        status: template.status || "publish",
    }
    const [formData, setFormData] = useState<NftInputProps>(defaultData);


    const handleChange = (event: any) => {
        event.preventDefault();
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setIsLoading(false);
    };

    const handleSelect = (data: any, others: any) => {
        setFormData({ ...formData, [others.name]: data.value });
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const result = await updateTemplateContent(template.id, {
                title: formData.title,
                content: editorRef.current.getContent()
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
        setIsLoading(false);
    }


    return <>
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
                                    htmlFor="title"
                                >Title</label>
                                <input
                                    className="shadow appearance-none w-full dark:bg-transparent bg-[#fff] border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight  text-[#333333] dark:text-[#acacac] text-sm"
                                    onChange={handleChange}
                                    name="title"
                                    id="title"
                                    value={formData.title}
                                    type="text"
                                    placeholder="Enter Title"
                                />
                            </FormControl>
                        </div>

                        <div className="grid grid-cols-1 mb-10">
                            <FormControl
                                className="mb-10"
                                id="content"
                            >
                                <label className="block dark:text-[#fff] text-[#363434] text-md mb-2" htmlFor="content">
                                    Content
                                </label>
                                <div style={{ minHeight: "300px" }}>
                                    <Editor
                                        tinymceScriptSrc={'/tinymce/tinymce.min.js'}
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        initialValue={template.content || ""}
                                        init={{
                                            height: 500,
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

    </>;
}

export default Form;
