import React, { FC, useEffect, useState } from "react";
import Drawer from '@mui/material/Drawer';
import Select from 'react-select'
import { BsFillGrid3X3GapFill, BsFillGridFill } from 'react-icons/bs';
import { FaEthereum } from "react-icons/fa";
import { getCategories, getCollections } from "services";
import { useRouter } from "next/router";

interface FilterProps {
  onToggle: Function;
  data?: any;
  setData?: any;
  useFilter?: any;
}

const Filter: FC<FilterProps> = ({ onToggle, useFilter }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isDrawer, setIsDrawer] = useState(false);
  const [toggleViewMode, setToggleViewMode] = useState<Boolean>(true);
  const [filterData, setFilterData] = useFilter();
  const [formData, setFormData] = useState<any>({
    category: filterData?.category || "",
    collection: filterData?.collection || "",
    status: filterData?.status || "",
    minimum: filterData?.minimum || "",
    maximum: filterData?.maximum || "",
  });
  const router = useRouter();


  useEffect(() => {
    (async () => {
      // Get collection data
      const collectionResult = await getCollections();
      setCollections(collectionResult.map((collection: any) => {
        return {
          label: collection.name,
          value: collection.id,
          name: "collection"
        }
      }));
      // Get category data
      const categoryResult = await getCategories();
      setCategories(categoryResult.map((category: any) => {
        return {
          label: category.name,
          value: category.id,
          name: 'category'
        }
      }));
    })();
    return () => {
      setCollections([]);
      setCategories([]);
    };
  }, [])


  const handleToggle = (bool: Boolean) => {
    setToggleViewMode(bool);
    if (typeof onToggle === "function") {
      onToggle(bool)
    }
  }

  const status: any = [
    { value: 'buy_now', label: 'Buy Now', name: 'status' },
    { value: 'on_auction', label: 'On Auction', name: 'status' },
    { value: 'new', label: 'New', name: 'status' },
    { value: 'has_offers', label: 'Has Offers', name: 'status' },
  ]


  const handleSelectChange = (event: any) => {
    const value = event.value;
    const name = event.name;
    setFormData((prevalue: any) => {
      return {
        ...prevalue,
        [name]: value
      }
    })
  };


  const handleInputChange = (event: any) => {
    const value = event.target.value;
    const name = event.target.name;
    setFormData((prevalue: any) => {
      return {
        ...prevalue,
        [name]: value
      }
    })
  }
  const url = router.pathname;

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    Object.keys(formData).forEach((item: any) => !formData[item] && delete formData[item]);
    setFilterData(formData)
    const keywordData = new URLSearchParams(formData).toString();

    router.push(`${url}?${keywordData}`)
  }

  const handleReset = () => {
    setFilterData({
      category: "",
      collection: "",
      status: "",
      minimum: "",
      maximum: "",
    });
    setFormData(formData);
    router.push(`${url}`)
  }

  const customStyles = {
    option: (provided: any, state: any) => ({
      ...provided,
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


  return (
    <div className="lg:flex md-flex flex flex-row space-x-2 lg:pb-0 md:pb-0 pb-4 justify-between mb-10  ">
      <div className="explore_filterbutton">
        <button onClick={() => setIsDrawer(true)} className="dark:text-[#fff]"> Filter & Sort</button>
        <Drawer
          anchor="left"
          open={isDrawer}
          onClose={() => setIsDrawer(false)}
        >
          <div>
            <form
              className="w-full mb-10 mt-10 filter_form"
              onSubmit={handleSearchSubmit}
              data-aos-duration="3000"
            >

              <div className="grid lg:grid-cols-1 md:grid-cols-1 grid-cols-1">

                <div className="  px-3 mb-8 md:mb-5">
                  <label
                    className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                    htmlFor="grid-state"
                  >
                    Categories
                  </label>
                  <div className="">
                    <Select options={categories} styles={customStyles}
                      defaultValue={categories.filter(function (ele: any) {
                        return ele.value === filterData?.category;
                      })}
                      name='category'
                      onChange={handleSelectChange}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#1729a7',
                          primary: '#1729a7',
                        },
                      })}
                      className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-0 px-0 leading-tight dark:text-white text-[#969696] text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="  px-3 mb-8 md:mb-5">
                  <label
                    className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                    htmlFor="grid-state"
                  >
                    Collection
                  </label>
                  <div className="">
                    <Select options={collections} styles={customStyles}
                      defaultValue={collections.filter(function (ele: any) {
                        return ele.value === filterData?.collection;
                      })}
                      name='collection'
                      onChange={handleSelectChange}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary25: '#1729a7',
                          primary: '#1729a7',
                        },
                      })}
                      className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-0 px-0 leading-tight dark:text-white text-[#969696] text-sm"
                    />
                  </div>
                </div>
                {
                  router.pathname === "/discover" ? (
                    <>

                      <div className="  px-3 mb-8 md:mb-5">
                        <label
                          className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                          htmlFor="grid-state"
                        >
                          Status
                        </label>
                        <div className="">
                          <Select options={status} styles={customStyles}
                            defaultValue={status.filter(function (ele: any) {
                              return ele.value === filterData?.status;
                            })}
                            name='status'
                            onChange={handleSelectChange}
                            theme={(theme) => ({
                              ...theme,
                              colors: {
                                ...theme.colors,
                                primary25: '#1729a7',
                                primary: '#1729a7',
                              },
                            })}
                            className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-0 px-0 leading-tight dark:text-white text-[#969696] text-sm"
                          />
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                              className="fill-current h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="  px-3 mb-8 md:mb-5">
                        <label
                          className="block dark:text-[#fff] text-[#363434] text-md mb-2"
                          htmlFor="grid-state"
                        >
                          Price Range
                        </label>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="filter_minimum">
                            <input
                              className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-[#969696] text-sm"
                              placeholder="Minimum "
                              name="minimum"
                              onChange={handleInputChange}
                              defaultValue={filterData?.minimum}
                            />

                            <FaEthereum className="" />
                          </div>
                          <div className="filter_minimum">
                            <input
                              className="shadow appearance-none w-full dark:bg-transparent border-2 border-[#ffffff14] rounded py-3 px-4 leading-tight dark:text-white text-[#969696] text-sm"
                              placeholder="Maximum "
                              name="maximum"
                              onChange={handleInputChange}
                              defaultValue={filterData?.maximum}
                            />
                            <FaEthereum className="" />
                          </div>
                        </div>
                      </div>
                    </>
                  ) :
                    ""
                }
                <div className=" px-2 mb-5 md:mb-5 mt-3">
                  <button
                    type="submit"
                    className="discover_filter_buton border-2 rounded-full mr-1 dark:text-white hover:text-[#fff] hover:bg-[#1729a7] hover:border-[#1729a7] font-bold py-2 px-6 border-[#000]"
                  >
                    Search
                  </button>{" "}

                </div>
              </div>
            </form>
            <button
              className="reset_filter_buton border-2 rounded-full mr-1 dark:text-white hover:text-[#fff] hover:bg-[#1729a7] hover:border-[#1729a7] font-bold py-2 px-6 border-[#000]"
              onClick={handleReset}>
              Reset Filter
            </button>
          </div>
        </Drawer>
      </div>
      <div className=" flex ">
        <div className="mr-4 explore_lsistgrid">
          <button
            onClick={() => handleToggle(true)}
            className={`${toggleViewMode ? "active" : ""}`}
          ><BsFillGrid3X3GapFill /></button>
          <button
            onClick={() => handleToggle(false)}
            className={`${!toggleViewMode ? "active" : ""}`}
          ><BsFillGridFill /></button>
        </div>

      </div>
    </div>
  );
}

export default Filter;
