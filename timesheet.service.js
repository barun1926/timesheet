import axios from "axios";
import authHeader from "./auth.header";
//const API_URL = 'https://us-central1-gcpcicd-383507.cloudfunctions.net/timesheet_management/api/';

const crypto = require("crypto-js");
const password = "d6F3Efeq";

class TimesheetService {
  getAllTimesheets() {
    return axios.get(process.env.REACT_APP_API_URL + "/timesheet", {
      headers: authHeader(),
    });
  }

  getProject() {
    return axios.get(process.env.REACT_APP_API_URL + "/project/assigned", {
      headers: authHeader(),
    });
  }

  getActivites() {
    return axios.get(process.env.REACT_APP_API_URL + "/activity", {
      headers: authHeader(),
    });
  }

  getProjectByUser() {
    return axios.get(process.env.REACT_APP_API_URL + "/project/assigned", {
      headers: authHeader(),
    });
  }

  getActivitesByProject(project_ID) {
    return axios.get(
      process.env.REACT_APP_API_URL + "/activity/by_project/" + project_ID,
      { headers: authHeader() }
    );
  }

  ConvertDateFormat(data) {
    const dateObject = new Date(data);
    const year1 = dateObject.getFullYear();
    const month1 = dateObject.getMonth() + 1;
    const day1 = dateObject.getDate();

    return `${year1}-${month1.toString().padStart(2, "0")}-${day1
      .toString()
      .padStart(2, "0")}`;
  }

  getAllTimesheetsByDate(dates) {
    if (dates[0] != null) {
      var start_date = this.ConvertDateFormat(dates[0]);
    }
    if (dates[1] != null) {
      var end_date = this.ConvertDateFormat(dates[1]);
    } else {
      var end_date = this.ConvertDateFormat(dates[0]);
    }
    return axios.get(
      process.env.REACT_APP_API_URL +
        "/timesheet?type=2&from=" +
        start_date +
        "&to=" +
        end_date,
      { headers: authHeader() }
    );
  }

  getAllTimesheetsByProject(dates) {
    if (dates[0] != null) {
      var start_date = this.ConvertDateFormat(dates[0]);
    }
    if (dates[1] != null) {
      var end_date = this.ConvertDateFormat(dates[1]);
    } else {
      var end_date = this.ConvertDateFormat(dates[0]);
    }
    return axios.get(
      process.env.REACT_APP_API_URL +
        "/timesheet?type=3&from=" +
        start_date +
        "&to=" +
        end_date,
      { headers: authHeader() }
    );
  }

  addTimesheet(data) {
    var CiperText = crypto.AES.encrypt(
      JSON.stringify(data),
      password
    ).toString();
    var payLoad = {
      request_data: CiperText,
    };
    return axios.post(process.env.REACT_APP_API_URL + "/timesheet", payLoad, {
      headers: authHeader(),
    });
  }

  deleteTimesheet(id) {
    return axios.delete(process.env.REACT_APP_API_URL + "/timesheet/" + id, {
      headers: authHeader(),
    });
  }

  deleteTimesheetByDate(date) {
    return axios.delete(
      process.env.REACT_APP_API_URL + "/timesheet/delete_by_date/" + date,
      { headers: authHeader() }
    );
  }

  editTimesheet(data, id) {
    var CiperText = crypto.AES.encrypt(
      JSON.stringify(data),
      password
    ).toString();
    var payLoad = {
      request_data: CiperText,
    };
    return axios.put(
      process.env.REACT_APP_API_URL + "/timesheet/" + id,
      payLoad,
      { headers: authHeader() }
    );
  }

  getgridReportTimesheets() {
    return axios.get(process.env.REACT_APP_API_URL + "/getTSGridReportByPM", {
      headers: authHeader(),
    });
  }
  getAllentriesGrid(dates) {
    if (dates[0] != null) {
      var start_date = this.ConvertDateFormat(dates[0]);
    }

    if (dates[1] != null) {
      var end_date = this.ConvertDateFormat(dates[1]);
    } else {
      var end_date = this.ConvertDateFormat(dates[0]);
    }
console.log("start_date",start_date)
console.log(end_date)
    return axios.get(
      process.env.REACT_APP_API_URL +
        "/getTSGridReportByPM?from=" +
        start_date +
        "&to=" +
        end_date,
      { headers: authHeader() }
    );
  }
}

export default new TimesheetService();
