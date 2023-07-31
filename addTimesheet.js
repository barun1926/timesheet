import React, { useEffect, useState } from "react";
import "./addTimesheet.css";
import timesheetService from "../../api/timesheet.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectField from "../../components/common/hook-form/Select";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import commonService from "../../api/common.service";
import { ThreeDots } from "react-loader-spinner";
const AddTimeSheet = ({ onAddTimesheet }) => {
  const [projectId, setProjectId] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isstartTime, setStartTime] = useState(() => {
    const currentDate = new Date();
    const lessThanOneHourLater = new Date();
    lessThanOneHourLater.setMinutes(currentDate.getMinutes()); //
    lessThanOneHourLater.setHours(currentDate.getHours() - 1); // Set hours to less than one hour from current hours
    return lessThanOneHourLater;
  });
  const [isendTime, setEndTime] = useState(new Date());
  const [task, setTask] = useState({});
  const [description, setDescription] = useState("");
  const [worktype, setworktype] = useState({
    value: 0,
    label: "Work from Office",
  });
  const [filterproject, setfilterproject] = useState([]);
  const [activityproject, setactivityproject] = useState([]);
  const [notifyDate, setnotifyDate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [Reflink, setReflink] = useState("");
  const currentDate = new Date();
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 31);

  let isFormValid =
    projectId.value && isstartTime && isendTime && task.value && description;

  useEffect(() => {
    commonService.projectAssigned().then((res) => {
      setfilterproject(res.data.data);
      activityassign(projectId);
    });
  }, [projectId]);
  //console.log("filterproject :", filterproject);
  const activityassign = (projectId) => {
    if (projectId?.value) {
    
      //console.log("projectId._id :", projectId.value);
      commonService.activityAssigned(projectId.value).then((res) => {
        setactivityproject(res.data.data);
        setIsLoading(false);
        // console.log("activityproject :", activityproject);
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
  // console.log("ActivitiesOptions :", ActivitiesOptions);

  const { control } = useForm();
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

  const onSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    if (
      !projectId.value ||
      !isstartTime ||
      !isendTime ||
      !task.value ||
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
      // const startTime = isstartTime.toISOString();
      // const endTime = isendTime.toISOString();

      // console.log('startTime', startTime +  isstartTime.toLocaleString());
      // console.log('endTime', endTime);
     

      const requestData = {
        project: projectId.value,
        url: Reflink,
        isWFH: worktype.value,
        start_time: commonService.RemoveSeconds(isstartTime.toString()),
        end_time: commonService.RemoveSeconds(isendTime.toString()),
        activity: task.value,
        description: description,
      };

      console.log("requestData :", requestData);

      const response = await timesheetService.addTimesheet(requestData);

      if (response.data.data.token !== "") {
        toast.success("Timesheet has been added!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      }
      // Reset the form fields
      setDescription("");
      setReflink("");
      setTask({});
      onAddTimesheet();
    } catch (error) {
      //console.error("Error adding timesheet:", error.response.data.message);
      toast.error(
        "An error occurred while adding the timesheet : " +
          error.response.data.message,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const cleardata = () => {
    setDescription("");
    setReflink("");
    setTask({});
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
      <div className="form-group px-3 mb-3">
        <div className="row">
          <div className="col mr-3">
            <label for="start-time" className="form-label">
              Start Time
            </label>
            <DatePicker
              selected={isstartTime}
              minDate={pastDate}
              maxDate={currentDate}
              onChange={(date) => {
                if (date > currentDate) {
                  toast.error("Start time must be lesser than Current time!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                  });
                  // If the end time is less than the start time, reset the end time
                  setStartTime(new Date());
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
              required
            />
          </div>
          <div className="col">
            <label for="end-time" className="form-label">
              End Time
            </label>
            <DatePicker
              selected={isendTime}
              minDate={pastDate}
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
              required
            />
          </div>
        </div>
      </div>
      <div className="form-group px-3 mb-3">
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
              defaultMessageclassName="form-text small"
              rules={{ required: false }}
              handleChange={(selected) => {
                 setIsLoading(true);
                 setProjectId(selected)
              }}
              value={projectId}
              required
            />
          </div>
          <div className="col">
            <label for="activity" className="form-label">
              Activity
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
                classNameStyle="form-select form-control"
                name="task"
                isMultiSelect={false}
                options={ActivitiesOptions}
                control={control}
                value={task}
                defaultMessageclassName=""
                rules={{ required: false }}
                handleChange={(selected) => 
                   setTask(selected)
                }
                required
              />
            )}
          </div>
        </div>
      </div>
      <div className="form-group px-3 mb-3">
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
              presetValue={[worktype]}
              defaultMessageClass="form-text small"
              rules={{ required: false }}
              handleChange={(selected) => setworktype(selected)}
              required
            />
          </div>
        </div>
      </div>
      {/* <div className="form-group mb-3">
        <label for="Reference Link" className="form-label">
          Task Link
        </label>
        <textarea
          className="w-100 desc-block-link css-xgwaeg-control"
          value={Reflink}
          onChange={(e) => setReflink(e.target.value)}
        />
      </div> */}
      <div className="form-group mb-3">
        <label for="project" className="form-label">
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
          <button
            type="button"
            className=" addbtn-outline text-white cursor"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            onClick={cleardata}
          >
            Clear
          </button>
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
};
export default AddTimeSheet;
