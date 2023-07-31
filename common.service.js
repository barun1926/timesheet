import axios from "axios";
import authHeader from "./auth.header";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

const crypto = require("crypto-js");
const password = "d6F3Efeq";

class CommonService {


  projectAssigned() {
    return axios.get(process.env.REACT_APP_API_URL + "/project/assigned", { headers: authHeader() });
  }

  activityAssigned(id) {
    return axios.get(process.env.REACT_APP_API_URL + "/activity/by_project/" + id , { headers: authHeader() });
  }

  getfeedback() {
    return axios.get(process.env.REACT_APP_API_URL + "/feedback", {
      headers: authHeader(),
    });
  }

  ETAQHrToMin = (minutes) => {
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes));
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);

    var hr = min > 0 ? sign + (min < 10 ? "" : "") + min + "h," : "";
    var _min = (sec < 10 ? "0" : "") + sec + "m";

    return hr + _min;
  }

   RemoveSeconds = (timestamp) => {
    const dateObj = new Date(timestamp);
    // Set the seconds to 0
    dateObj.setSeconds(0);
    // Format the modified timestamp in the same format as the original
    const modifiedTimestamp = dateObj.toISOString();
    return modifiedTimestamp;
  };

  DisplayDateMonthYear(data){
    const dateObject = new Date(data);
    const year1 = dateObject.getFullYear();
    const month1 = dateObject.getMonth() + 1;
    const day1 = dateObject.getDate();

    return `${day1
      .toString()
      .padStart(2, "0")}/${month1.toString().padStart(2, "0")}/${year1}`;
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

  rplyNotification(data , id) {
    var CiperText = crypto.AES.encrypt(JSON.stringify(data), password).toString();  
    var payLoad = {
        "request_data":CiperText
    }
    return axios.put(process.env.REACT_APP_API_URL + '/feedback/reply/'+ id, payLoad, { headers: authHeader() } , );
  }

  WeeksorDaysFilter(baseDate, weeks, day){
    const totalDays = weeks * 7 + day;
    const newDate = new Date(baseDate); 
    newDate.setDate(newDate.getDate() + totalDays); 
    return newDate;
  }

  CheckUserRoleAndNavigate = (pagename) => {
    // const location = useLocation();
    const navigate = useNavigate();
    // const { pathname } = location;
    let userRoles;
    const user = JSON.parse(sessionStorage.getItem('authUser'));
    if (user && user.modules) {
      userRoles = user.modules;
    } else {
      userRoles = ['dashboard'];
    }
    // const splitLocation = pathname.split('/');
    // console.log("user.userRoles",userRoles);
    if (!userRoles.includes(pagename)) {
      navigate('/*');
    }
  };

}
export default new CommonService();
