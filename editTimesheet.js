import React, { useEffect, useState } from "react";
import "./editTimesheet.css";
import timesheetService from "../../api/timesheet.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectField from "../../components/common/hook-form/Select";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import commonService from "../../api/common.service";
import { ThreeDots } from "react-loader-spinner";
function EditTimeSheet({ formdetails, triggerClose, savetriggerclose }) {
  const data_details = formdetails;
  //console.log("formdetails :", data_details);
  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 31);

  const activity_item = [
    {
      value: data_details.activity._id,
      label: data_details.activity.name,
    },
  ];
  const project_item = [
    {
      value: data_details.project._id,
      label: data_details.project.name,
    },
  ];

  const [projectId, setProjectId] = useState({
    value: data_details.project._id,
    label: data_details.project.name,
  });
  const [isstartTime, setStartTime] = useState(
    new Date(data_details.start_time)
  );
  const [isendTime, setEndTime] = useState(new Date(data_details.end_time));
  const [task, setTask] = useState({
    value: data_details.activity._id,
    label: data_details.activity.name,
  });
  var preSelect_ID =
    data_details.isWFH === 0
      ? {
          value: 0,
          label: "Work from Office",
        }
      : {
          value: 1,
          label: "Work from Home",
        };

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Reflink, setReflink] = useState(data_details.url);
  const [description, setDescription] = useState(data_details.description);
  const [timesheetUpdated, setTimesheetUpdated] = useState(false);
  const [worktype, setworktype] = useState(preSelect_ID);
  const [filterproject, setfilterproject] = useState([]);
  const [activityproject, setactivityproject] = useState([]);

  const id = data_details._id;
  const option_value_mode = [
    {
      value: 1,
      label: "Work from Home",
    },
    {
      value: 0,
      label: "Work from Office",
    },
  ];

  const isFormValid =
    projectId && isstartTime && isendTime && task && description;
  // console.log("projectId :", projectId);
  // console.log("task :", task);
  const handleAddTimesheet = () => {
    setTimesheetUpdated((prevValue) => !prevValue);
  };

  useEffect(() => {
    commonService.projectAssigned().then((res) => {
      setfilterproject(res.data.data);
      activityassign(projectId);
    });
  }, [projectId]);
  //console.log("filterproject :", filterproject);
  const activityassign = (projectId) => {
    if (projectId) {
      //console.log("projectId._id :", projectId.value);
      commonService.activityAssigned(projectId.value).then((res) => {
        setactivityproject(res.data.data);
        setIsLoading(false);
        //console.log("activityproject :", activityproject);
      });
    }
  };
  let optionvalue = [];
  filterproject?.forEach((dvalue, index) => {
    optionvalue.push({
      label: dvalue?.name,
      value: dvalue?._id,
    });
  });
  //console.log("optionvalue :", optionvalue);

  var ActivitiesOptions = [];
  activityproject?.forEach((item, index) => {
    ActivitiesOptions.push({
      label: item?.name,
      value: item?._id,
    });
  });

  const { control } = useForm();

  const onSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    if (
      !projectId ||
      !isstartTime ||
      !isendTime ||
      !task ||
      !description ||
      !worktype
    ) {
      alert("Please fill in all fields");
      setIsSubmitting(false);
      return;
    } else if (isendTime <= isstartTime) {
      toast.error("End time must be greater than Start time!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      // If the end time is less than the start time, reset the end time
      setEndTime(isendTime);
      setIsSubmitting(false);
      return;
    }

    try {
      const startTime = isstartTime.toISOString();
      const endTime = isendTime.toISOString();
      const data = {
        project: projectId.value,
        url: Reflink,
        start_time: commonService.RemoveSeconds(isstartTime.toString()),
        end_time: commonService.RemoveSeconds(isendTime.toString()),
        activity: task.value,
        isWFH: worktype.value,
        description: description,
      };
      // console.log("Update timesheet details:", data);
      // API call using Axios
      const response = await timesheetService.editTimesheet(data, id);
      //console.log("DataUpdateresponse : ", response.data);
      if (response.data.data.token !== "") {
        //You data has been Added!
        toast.success("Timesheet has been Updated!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      }
      setTimesheetUpdated(true);
      handleAddTimesheet();
      savetriggerclose();
    } catch (error) {
      console.error("Error adding timesheet:", error);
      toast.error("An error occurred while adding the timesheet :" + error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseEvents = (e) => {
    toast.info("Copy&Paste Not Allowed!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
    e.preventDefault();
  };

  return (
    <form className="addform">
      <div className="form-group mb-3">
        <div className="row">
          <div className="col mr-3">
            <label for="start-time" className="form-label">
              Start Time
            </label>
            <DatePicker
              selected={isstartTime}
              minDate={isstartTime}
              maxDate={currentDate}
              onChange={(date) => {
                if (isstartTime > currentDate) {
                  toast.error("Start time must be lesser than Current time!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  });
                  setStartTime(new Date());
                  return;
                } else {
                  setStartTime(date);
                }
              }}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              className="form-control ts-time"
              popperModifiers={{
                preventOverflow: {
                  enabled: true,
                  escapeWithReference: false,
                  boundariesElement: "viewport",
                },
              }}
            />
          </div>
          <div className="col">
            <label for="end-time" className="form-label">
              End Time
            </label>
            <DatePicker
              selected={isendTime}
              minDate={isstartTime}
              maxDate={currentDate}
              onChange={(date1) => {
                if (date1 > currentDate) {
                  toast.error("End time must be lesser than Current time!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  });
                  // If the end time is less than the start time, reset the end time
                  setEndTime(new Date());
                } else {
                  setEndTime(date1);
                }
              }}
              timeInputLabel="Time:"
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              className="form-control ts-time"
              popperModifiers={{
                preventOverflow: {
                  enabled: true,
                  escapeWithReference: false,
                  boundariesElement: "viewport",
                },
              }}
            />
          </div>
        </div>
      </div>
      <div className="form-group mb-3">
        <div className="row">
          <div className="col mr-3">
            <label for="project" className="form-label">
              Project
            </label>
            <SelectField
              classNameStyle="form-select form-control"
              name="project"
              isMultiSelect={false}
              options={optionvalue}
              control={control}
              defaultMessageClass="form-text small"
              rules={{ required: false }}
              presetValue={project_item}
              handleChange={(selected) =>{
                setIsLoading(true);
                setProjectId(selected)}
              }
            />
          </div>
          <div className="col ">
            <label for="project" className="form-label">
              Activities
            </label>
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <ThreeDots
                  height="30"
                  width="50"
                  radius="9"
                  color="rgb(242 101 35)"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                  classNameStyle="form-select form-control"
                />
              </div>
            ) : (
              <SelectField
                classNameStyle="form-select"
                name="task"
                isMultiSelect={false}
                options={ActivitiesOptions}
                control={control}
                defaultMessageClass=""
                rules={{ required: false }}
                presetValue={activity_item}
                handleChange={(selected) => setTask(selected)}
              />
            )}
          </div>
        </div>
      </div>
      <div className="form-group mb-3">
        <div className="row">
          <div className="col mr-3">
            <label for="Reference Link" className="form-label">
              Task Link
            </label>
            <textarea
              className="w-100 desc-block-link css-xgwaeg-control"
              value={Reflink}
              onChange={(e) => setReflink(e.target.value)}
            />
          </div>
          <div className="col">
            <label for="work_type" className="form-label">
              Work Mode
            </label>
            <SelectField
              classNameStyle="form-select form-control"
              name="work_type"
              isMultiSelect={false}
              options={option_value_mode}
              control={control}
              defaultMessageClass="form-text small"
              presetValue={[preSelect_ID]}
              rules={{ required: false }}
              handleChange={(selected) => setworktype(selected)}
            />
          </div>
        </div>
      </div>
      <div className="form-group mb-3">
        <label for="description" className="form-label">
          Description
        </label>
        <textarea
          className="w-100 desc-block css-xgwaeg-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          onCut={handleMouseEvents}
          onCopy={handleMouseEvents}
          onPaste={handleMouseEvents}
        />
      </div>

      <div className="d-flex justify-content-between">
        <div className="back-block">
          {/* <button
            type="button"
            className="addbtn-outline text-white cursor"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            Close
          </button> */}
        </div>

        <div className="cancel-block">
          <button
            type="submit"
            className=" addform-btn text-white cursor"
            disabled={!isFormValid} // Disable the button when the form is invalid
            onClick={onSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default EditTimeSheet;
