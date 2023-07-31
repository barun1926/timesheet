import React, { useState, useEffect, useContext, createContext } from "react";
import "./timesheet.css";
import timesheetService from "../../api/timesheet.service";
import AddTimeSheet from "./addTimesheet";
import EditTimeSheet from "./editTimesheet";
import AdvancedFilter from "./filter";
import { LineWave } from "react-loader-spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectField from "../../components/common/hook-form/Select";
import SideCanvas from "./drawer";

import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { AiOutlineOrderedList } from "react-icons/ai";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import Moment from "react-moment";
import Swal from "sweetalert2";
import CommonService from '../../api/common.service';
// import  SampleData  from "./sampleData";

const TimesheetManagement = () => {
  const today = new Date();
  var curr = new Date(); // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6
  var weekStartday = new Date(curr.setDate(first));
  var weekEndday = new Date(curr.setDate(last));
  const [sampleData1, setSampleData1] = useState([]);
  const [allDatas, setallDatas] = useState([]);
  const [itemDatas, setitemDatas] = useState([]);
  const [lastDeletedItem, setLastDeletedItem] = useState("");
  const [lastFilterItem, setlastFilterItem] = useState("");
  const [workingHours, setWorkingHours] = useState({
    expected: 40,
    entered: 0,
    wfo: 0,
    wfh: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timesheetUpdated, setTimesheetUpdated] = useState(false);
  const { control } = useForm();
  const [itemsPerPage, setitemsPerPage] = useState(7);
  const [iLimit, settodayLimit] = useState(7);
  const [todaypageCount, settodayPageCount] = useState(0);
  // const [itemsPerPage, setitemsPerPage] = useState(1);
  // const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({});
  const [showlist, setShowList] = useState();
  const [groupBy, setgroupBy] = useState({
    value: "2",
    label: "Group By Date",
  });
  const [isOpen,setIsOpen]=useState(false)
  const [dateRange, setDateRange] = useState([weekStartday, weekEndday]);
  const [startDate, endDate] = dateRange;
  console.log('sampleData', sampleData1);
  const defaultRender = (date) => {
    setIsLoading(true);
    timesheetService
      .getAllTimesheetsByDate(date)
      .then((res) => {
        //console.log(res.data.data);
        setallDatas(res.data.data);
        setWorkingHours(res.data.counts);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching timesheets:", error);
        setIsLoading(false);
      });
  };

  const sampleData=()=>{
    timesheetService.getAllentriesGrid(dateRange).then((res)=>{
      console.log("Response: "+ res)
      setSampleData1(res)
      console.log("sampleData1",sampleData1)
      console.log('msg',res.message);
      const sdata=JSON.stringify(res)
    })
  }
   const SampleData= [
    {
        id: 1,
        email: 'Task',
        firstName: '3:00 hrs ',
        lastName: '3:00',
        tenant: '3:00',
        role: '3:00',
    },
    {
        id: 2,
        email: 'Break',
        firstName: '1:00 ',
        lastName: '1:00',
        tenant: '1:00',
        role:'1:00',
    },
    {
        id: 3,
        email: 'Fun Activities',
        firstName: '0:30 ',
        lastName: '0:30',
        tenant: '0:30',
        role: '0:30',
    },
    {
        id: 4,
        email: 'Task',
        firstName: '5:00 hrs ',
        lastName: '5:00 hrs',
        tenant: '5:00 hrs',
        role: '5:00 hrs',
    },
    {
      id: 1,
      email: 'Task',
      firstName: '3:00 hrs ',
      lastName: '3:00',
      tenant: '3:00',
      role: '3:00',
    },
    {
      id: 2,
      email: 'Break',
      firstName: '1:00 ',
      lastName: '1:00',
      tenant: '1:00',
      role:'1:00',
    },
    {
      id: 4,
        email: 'Fun activities',
        firstName: '0:30 hrs ',
        lastName: '0:30 hrs',
        tenant: '0:30 hrs',
        role: '0:30 hrs',
    },
    {
      id: 1,
      email: 'Task',
      firstName: '3:00 hrs ',
      lastName: '3:00',
      tenant: '3:00',
      role: '3:00',
    },
    {
      id: 2,
      email: 'Break',
      firstName: '1:00 ',
      lastName: '1:00',
      tenant: '1:00',
      role:'1:00',
    },
    {
      id: 4,
      email: 'Task',
      firstName: '5:00 hrs ',
      lastName: '5:00 hrs',
      tenant: '5:00 hrs',
      role: '5:00 hrs',
    },
]
  console.log("allDatas----", allDatas);

const handleClick=()=>{
  setIsOpen(true)
}
  const defaultRenderByProject = (date) => {
    setIsLoading(true);
    timesheetService
      .getAllTimesheetsByProject(date)
      .then((res) => {
        setallDatas(res.data.data);
        setWorkingHours(res.data.counts);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching timesheets:", error);
        setIsLoading(false);
      });
  };

  const handleWeeks = (params) => {
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(endDate);
    previousStartDate.setDate(startDate.getDate() + params + 7);
    previousEndDate.setDate(endDate.getDate() + params + 7);
    setDateRange([previousStartDate, previousEndDate]);
  };

  const onChangeGroup = (type) => {
    console.log("onChangeGroup = ", type);
    type.value === "2"
      ? defaultRender(dateRange)
      : defaultRenderByProject(dateRange);
    // defaultRenderByProject(dateRange);
  };

  const onChangedate = (dateRange) => {
    // console.log("onChangedate = ", groupBy);
    groupBy.value === "2"
      ? defaultRender(dateRange)
      : defaultRenderByProject(dateRange);
    // defaultRender(dateRange);
  };

  const handleAddButtonClick = () => {
    setShowForm(!showForm);
    setTimesheetUpdated(false);
  };

  useEffect(() => {
    //defaultRender(dateRange)
    // setSampleData1(SampleData)
    groupBy.value === "2"
      ? defaultRender(dateRange)
      : defaultRenderByProject(dateRange);
      sampleData()
  }, [timesheetUpdated]);

  function handleRemoveByID(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        timesheetService
          .deleteTimesheet(id)
          .then((res) => {
            console.log("dele", res);
            setLastDeletedItem(id);
            // Swal.fire(
            //   'Deleted!',
            //   'Your Timelog has been deleted.',
            //   'success'
            // );
          })
          .catch((error) => {
            console.error("Error deleting timesheet:", error);
            setIsLoading(false);
            Swal.fire(
              "Error!",
              "An error occurred while deleting the timesheet.",
              "error"
            );
          });
      }
    });
  }

  function handleRemoveByDate(date) {
    timesheetService
      .deleteTimesheetByDate(date)
      .then((res) => {
        setLastDeletedItem(date);
      })
      .catch((error) => {
        console.error("Error fetching timesheets:", error);
      });
  }

  useEffect(() => {
    if (lastDeletedItem !== "") {
      toast.error(`TimeSheet has been deleted!`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 500,
      });
      groupBy.value === "2"
        ? defaultRender(dateRange)
        : defaultRenderByProject(dateRange);
    }
  }, [lastDeletedItem]);

  const handleAddTimesheet = () => {
    setTimesheetUpdated((prevValue) => !prevValue);
  };

  const handleCloseSideCanvas = () => {
    setIsLoading(false); // Set isLoading to false to stop the
  };

  const isApprove = () => {
    toast.info("Under Progress", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 500,
    });
  };

  {
    /* Status : 1 => pending 2 => approved by PM 3 => approved by client 4 => rejected by PM 5 => rejected by client */
  }

  const renderStatus = (data) => {
    const status = data.status;

    //console.log('comment', update_comment);
    switch (status) {
      case 1:
        return <span className="m-0 text-c-orange"> Submitted</span>;
      case 2:
        return <span className="m-0 text-c-green"> PM Approved</span>;
      case 3:
        return <span className="m-0 text-c-green"> Client Approved</span>;
      case 4:
        const comment = data.approvalFlowDetails[0];
        const update_comment = comment?.comments;
        return (
          <>
            <span
              // onClick={isApprove}
              className="m-0 text-c-red"
            >
              {" "}
              PM Rejected
            </span>
            {update_comment ? (
              <span className="icon-wrapper">
                <span className="icon ms-1">
                  <AiOutlineOrderedList />
                </span>
                <span className="comment">{update_comment}</span>
              </span>
            ) : (
              ""
            )}
          </>
        );
      case 5:
        return (
          <span
            // onClick={isApprove}
            className="m-0 text-c-red"
          >
            {" "}
            Client Rejected
          </span>
        );
      default:
        return null;
    }
  };
  const renderStatusOLD = (status) => {
    switch (status) {
      case 1:
        return <span className="m-0 text-c-orange"> Submitted</span>;
      case 2:
        return <span className="m-0 text-c-green"> PM Approved</span>;
      case 3:
        return <span className="m-0 text-c-green"> Client Approved</span>;
      case 4:
        return (
          <span
            // onClick={isApprove}
            className="m-0 text-c-red"
          >
            {" "}
            PM Rejected
          </span>
        );
      case 5:
        return (
          <span
            // onClick={isApprove}
            className="m-0 text-c-red"
          >
            {" "}
            Client Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const HrToMin = (minutes) => {
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes));
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);

    var hr = min > 0 ? sign + (min < 10 ? "" : "") + min + "h," : "";
    var _min = (sec < 10 ? "0" : "") + sec + "m";

    return hr + _min;
  };

  const handlePageChange = (item, selected) => {
    const selectedNumber = selected;
    const updatedPaginationData = { ...paginationData }; // Create a copy of the pagination data object

    // Update the currentPage, startIndex, and endIndex for the selected item
    updatedPaginationData[item] = {
      ...updatedPaginationData[item],
      currentPage: selectedNumber,
      startIndex: (selectedNumber - 1) * itemsPerPage,
      endIndex: selectedNumber * itemsPerPage,
    };

    setPaginationData(updatedPaginationData); // Update the pagination data state
    //console.log("currentPagedata :", updatedPaginationData);
  };
  const handlePreviousWeek = () => {
    if (startDate && endDate) {
      const newStartDate = CommonService.WeeksorDaysFilter(startDate, 0, -7);
      const newEndDate = CommonService.WeeksorDaysFilter(endDate, 0, -7);
      setDateRange([newStartDate, newEndDate]);
    } else {
      const newStartDate = CommonService.WeeksorDaysFilter(startDate, 0, -1);
      setDateRange([newStartDate]);
    }
  };
  const handleShowList = () => {
    setShowList(true);
  };
  const handleShowGrid = () => {
    setShowList(false);
  };
  const handleNextWeek = () => {
    if (startDate && endDate) {
      const newStartDate = CommonService.WeeksorDaysFilter(startDate, 0, 7);
      const newEndDate = CommonService.WeeksorDaysFilter(endDate, 0, 7);
      setDateRange([newStartDate, newEndDate]);
    } else {
      const newStartDate = CommonService.WeeksorDaysFilter(startDate, 0, 1);
      setDateRange([newStartDate]);
    }
  };
  function formatDate(date) {
    const options = { day: '2-digit', month: 'short' };
    const formattedDate = new Date(date).toLocaleDateString('en-US', options);

    // Split the formatted date into day, month, and year parts
    const [month, day] = formattedDate.split(' ');

    // Convert the month abbreviation to uppercase
    const capitalizedMonth = month.toUpperCase();

    // Return the formatted date with uppercase month abbreviation and desired format
    return ` ${capitalizedMonth} ${day}`;
}
  return (
    <div id="timesheet-container" className="main-panel ">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="justify-content-between align-items-center px-4 mb-2">
              <div className="row">
                <div className="col-md-4 groupbydate">
                  <div className="dropdown flex-md-grow-1 flex-xl-grow-0">
                    <SelectField
                      classNameStyle="form-select groupby-block"
                      name="groupBy"
                      isMultiSelect={false}
                      options={[
                        {
                          value: "2",
                          label: "Group By Date",
                        },
                        {
                          value: "3",
                          label: "Group By Project",
                        },
                      ]}
                      control={control}
                      presetValue={[
                        {
                          value: "2",
                          label: "Group By Date",
                        },
                      ]}
                      defaultMessageClass="form-text small"
                      rules={{ required: false }}
                      handleChange={(selected) => {
                        setgroupBy(selected);
                        onChangeGroup(selected);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-4 date-filter">
                  <div className="middle-block d-flex flex-nowrap align-items-center">
                    <div className="previous-button-page" onClick={handlePreviousWeek}>
                      <span className="feather icon-chevron-left"></span>
                    </div>
                    <div className="cal-block px-1 d-flex flex-nowrap align-items-center">
                      <div className="feather icon-calendar filter-calendar pr-1"></div>
                      <DatePicker
                        dateFormat="yyyy/MM/dd"
                        selected={startDate}
                        onChange={(update) => {
                          setDateRange(update);
                          onChangedate(update);
                        }}
                        isClearable={false}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange={true}
                        popperPlacement="top-start"
                        popperModifiers={{
                          preventOverflow: {
                            enabled: true,
                            escapeWithReference: false,
                            boundariesElement: "viewport",
                          },
                        }}
                        customInput={<ExampleCustomInput />}
                      />
                    </div>
                    <div className="next-button-page" onClick={handleNextWeek}>
                      <span className="feather icon-chevron-right"></span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 addtimelog">
                  <div className="time-block d-flex flex-nowrap align-items-center">
                    <div className="list-grid me-2">
                      <button onClick={handleShowList}>
                        <AiOutlineOrderedList />
                      </button>
                      <button onClick={handleShowGrid}>
                        <BsFillGrid3X3GapFill />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn-addlink theme-bg2 text-white "
                      // onClick={handleAddButtonClick}
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      {showForm ? (
                        <i className="feather icon-x"></i>
                      ) : (
                        <i className="feather icon-plus"></i>
                      )}
                      {showForm ? "Close Time Log" : "Add Time Log"}
                    </button>
                    {/* 
                <button
                  type="button"
                  className="btn btn-filterlink bg-none "
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasFilterRight"
                  aria-controls="offcanvasRight"
                >
                  <span className="filter-icon i-color material-symbols-outlined">
                    filter_alt
                  </span>
                </button> */}
                  </div>

                  <div
                    className="offcanvas offcanvas-end"
                    tabindex="-1"
                    id="offcanvasRight"
                    aria-labelledby="offcanvasRightLabel"
                  >
                    <div className="offcanvas-header py-2">
                      <div id="offcanvasRightLabel">Add TimeSheet</div>
                      <button
                        type="button"
                        className="btn text-white text-reset"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                      >
                        <span className="material-icons back-icon">close</span>
                      </button>
                    </div>
                    <div className="offcanvas-body">
                      <AddTimeSheet onAddTimesheet={handleAddTimesheet} />
                    </div>
                  </div>
                </div>
              </div>
              {/* <div
                className="offcanvas offcanvas-end"
                tabindex="-1" 
                id="offcanvasFilterRight"
                aria-labelledby="offcanvasFilterRightLabel"
              >
                <div className="offcanvas-header py-2">
                  <div id="offcanvasFilterRightLabel">Advanced Filter</div>
                  <button
                    type="button"
                    className="btn text-white text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  >
                    <span className="material-icons back-icon">arrow_forward</span>
                  </button>
                </div>
                <div className="offcanvas-body">
                  <AdvancedFilter />
                </div>
              </div> */}
            </div>

            <div className="card Recent-Users User-Lists">
              {/* <div className="card-header">
                <h5>Timesheet Entries</h5>
              </div> */}
              {showlist ? (
                <div className="card-body card-block px-4 mb-4 ">
                  <div className="table-responsive">
                    <table className="approval-table">
                      <thead className="table-mainheader border-0">
                        <tr>
                          <th scope="col">Activites Details</th>
                          <th scope="col">Account</th>
                          <th scope="col">Duration</th>
                          {/* <th scope="col">Billing Type</th> */}
                          <th scope="col">Status</th>
                          <th scope="col" className="text-center">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <div className="loader-wrapper">
                            <LineWave
                              height={200}
                              width={150}
                              color="#4fa94d"
                              ariaLabel="line-wave"
                              wrapperStyle={{}}
                              wrapperClass=""
                              visible={true}
                              firstLineColor="#3a57a2"
                              middleLineColor="#f26a26"
                              lastLineColor="#3a57a2"
                            />
                          </div>
                        ) : Object.keys(allDatas).length === 0 ? (
                          <tr>
                            <td colSpan={5}>
                              <div class="d-flex justify-content-center info-block f-14">
                                No Timesheets available for the selected date.
                              </div>
                            </td>
                          </tr>
                        ) : (
                          // Object.keys(allDatas).map((item, i) => (
                          Object.keys(allDatas)?.map((item, i) => (
                            <>
                              <tr className="header-bg" key={i}>
                                <td colSpan={6}>
                                  <div className="d-flex justify-content-start">
                                    <div className="d-flex  align-self-start">
                                      <div className="material-symbols-outlined">
                                        work_history
                                      </div>
                                      <div className="project-title mx-2">
                                        {item}
                                        {/* <Moment format="D MMM YYYY">{item}</Moment>                                      */}
                                      </div>
                                    </div>
                                    {/* <div className='billable-hours mx-2'>1:00</div>
                                  <div className='divider'></div>
                                  <div className='non-billable-hours mx-2'>2:00</div> */}
                                    {/* <div className='divider'></div>
                                  <div className='billing-amount mx-2'>$5:00</div> */}
                                  </div>
                                </td>
                              </tr>

                              {allDatas[item]
                                ?.slice(
                                  paginationData[item]?.startIndex,
                                  paginationData[item]?.endIndex
                                )
                                ?.slice(0, itemsPerPage)
                                .map((data, index) => (
                                  <tr key={index}>
                                    <td>
                                      <div className="d-flex justify-content-start">
                                        <div className="d-flex flex-column">
                                          <div className="i-color material-symbols-outlined mb-1">
                                            {data.activity !== null
                                              ? renderIcons(
                                                  (data.activity?.name).toLowerCase()
                                                )
                                              : ""}
                                          </div>

                                          {data.isWFH ? (
                                            <hr className="solid"></hr>
                                          ) : (
                                            ""
                                          )}
                                        </div>

                                        <div className="align-self-start px-2 bd-highlight">
                                          <h6 className="mb-1">
                                            {data.activity?.name}
                                          </h6>
                                          <p className="m-0 detail-block info-block col-12 p-0 text-truncate">
                                            {data.description}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <h6 className="mb-1">
                                        {data?.project?.name}
                                      </h6>
                                      <p className="m-0 info-block">Sensiple</p>
                                    </td>

                                    <td>
                                      <h6 className="mb-1">
                                        {HrToMin(data?.hours?.$numberDecimal)}
                                      </h6>
                                      <p className="m-0 info-block">
                                        {/* ( {gettime(data?.start_time)} -{" "}
                                      {gettime(data?.end_time)} ) */}
                                        ( {data?.sTime} - {data?.eTime} )
                                      </p>
                                    </td>
                                    {/* <td>
                              {
                                   (data.activity?.name === 'Break') ? '' : (  (index % 2 == 0 ? (<div className='billable-hours'>Billable</div>) : (<div className='billable-hours'>Billable</div>) ) )
                               }                                  
                            </td> */}
                                    <td className="status-block">
                                      {data.activity?.name === "Break"
                                        ? ""
                                        : renderStatus(data)}
                                    </td>
                                    <td>
                                      {data.status !== (2 & 3) ? (
                                        // { ( data.status !== (2 & 3) && data.activity?.name !== 'Break') ? (
                                        // { ( data.status === 1 && data.activity?.name !== 'Break') ? (

                                        <div className="d-flex justify-content-center action-block">
                                          {/* <SideCanvas
                                      data={data}
                                      ondraweredittimesheet={handleAddTimesheet}
                                      layout="Edit Timesheet"
                                    /> */}
                                          <SideCanvas
                                            data={data}
                                            // ondraweredittimesheet={handleAddTimesheet}
                                            layout="Edit Timesheet"
                                            onClose={handleCloseSideCanvas}
                                            triggerLoader={handleAddTimesheet}
                                          />
                                          <div
                                            onClick={() =>
                                              handleRemoveByID(data._id)
                                            }
                                            className="mx-2"
                                          >
                                            <span className="text-c-red cursor i-color material-symbols-outlined">
                                              delete
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              {/* {allDatas[item].length} */}
                              {allDatas[item].length > 7 ? (
                                <tr className="paginate-box">
                                  <td colSpan={1}></td>
                                  <td className="text-center pr-0">
                                    <div className="d-flex justify-content-start px-0 mb-0 ">
                                      <ReactPaginate
                                        currentPage={
                                          paginationData[item]?.currentPage
                                        }
                                        previousLabel={
                                          <span aria-hidden="true">«</span>
                                        }
                                        nextLabel={
                                          <span aria-hidden="true">»</span>
                                        }
                                        breakLabel={"..."}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        pageCount={Math.ceil(
                                          allDatas[item]?.length / itemsPerPage
                                        )}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={2}
                                        onPageChange={(selectedPage) =>
                                          handlePageChange(
                                            item,
                                            selectedPage.selected + 1
                                          )
                                        }
                                        containerClassName={
                                          "pagination  mb-0 justify-content-center"
                                        }
                                        activeClassName={"active"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        item={item}
                                      />
                                    </div>
                                  </td>
                                  <td colSpan={2}></td>
                                </tr>
                              ) : (
                                ""
                              )}
                            </>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="card-body card-block px-4 mb-4">
                  <div className="table-responsive">
                    <table className="approval-table">
                      <thead className="table-mainheader border-0">
                        <tr>
                          <th scope="col">This Week</th>
                          {Array.from({ length: 7 }).map((_, index) => {
                            const date = new Date(startDate);
                            date.setDate(startDate.getDate() + index);
                            const dayName = date.toLocaleString("en-US", {
                              weekday: "short",
                            });
                            // const formattedDate = date.toLocaleDateString(
                            //   "en-US",
                            //   {
                            //     day: "2-digit",
                            //     month: "2-digit",
                            //     year: "numeric",
                            //   }
                            // );
                          
                        
                            return (
                              <th key={index} scope="col">
                                <div className="day">{dayName}</div>
                                <div className="date">{formatDate(date)}</div>
                              </th>
                            );
                          })}
                          <th scope="col">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(allDatas).map(([date, data]) => {
                          <tr key={date}>
                            <td>{date.project}</td>
                          </tr>;
                        })}
                        {/* {Object.keys(allDatas).map((keyName, i) => (
    <li className="travelcompany-input" key={i}>
        <span className="input-label">key: {i} Name: {allDatas[keyName]}</span>
                       </li>))} 
                                     */}
                        {SampleData.map((item)=><tr >
                          <td >{item.email}</td>
                          <td className="email">{item.firstName}</td>
                          <td className="day">{item.lastName}</td>
                          <td>{item.tenant}</td>
                          <td>{item.role}</td>
                          <td>{item.firstName}</td>
                          <td>{item.firstName}</td>
                          <td>{item.firstName}</td>
                          <td>{item.firstName}</td>
                        </tr>)}
  {/* {isOpen&&SampleData.map((item)=>
  item.description.map((item2)=>
 <tr>   
<td>{item2.task1}</td>
</tr>
))} */}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row sense-bottom ">
          <div className="d-flex justify-content-center">
            <div className="p-2">
              <span className="hours-info">Expected Hours:</span>
              <span className="hours-result">
                {HrToMin(workingHours.expected)}
              </span>
            </div>
            <div className="divider"></div>
            <div className=" p-2">
              <span className="hours-info">Entered Hours:</span>
              <span className="hours-result">
                {HrToMin(workingHours.entered)}
              </span>
            </div>
            <div className="divider"></div>
            <div className=" p-2">
              <span className="hours-info">WFO Hours:</span>
              <span className="hours-result">{HrToMin(workingHours.wfo)}</span>
            </div>
            <div className="divider"></div>
            <div className=" p-2">
              <span className="hours-info">WFH Hours:</span>
              <span className="hours-result">{HrToMin(workingHours.wfh)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const handleSubscription = () => {};

const ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
  <button className="calendar-link btn" onClick={onClick} ref={ref}>
    {value}
    {/* <i className="feather icon-calendar"></i> */}
  </button>
));

const renderIcons = (task) => {
  //console.log('task',task)
  switch (task) {
    case "leave":
      return "domain_verification_off";
    case "transport mgmt":
      return "local_shipping";
    case "vendor mgmt":
      return "storefront";
    case "facility mgmt":
      return "support";
    case "meeting":
      return "date_range";
    case "break":
      return "timer";
    case "task":
      return "task";
    case "training":
      return "model_training";
    case "fun activities":
      return "mindfulness";
    case "procurement":
      return "shopping_bag";
    case "System Issues":
      return "mimo_disconnect";
    case "testing":
      return "bug_report";
    default:
      return "task";
  }
};

export default TimesheetManagement;
