import React, { useEffect, useState, forwardRef } from "react";


const AdvancedFilter = () => {
    return(
        <form action="/action_page.php">
            <div className="form-group">
                <label for="email">Status:</label>
                <input type="email" className="form-control" placeholder="Enter status" id="email" />
            </div>
            <div className="form-group">
                <label for="pwd">Projects:</label>
                <input type="password" className="form-control" placeholder="Enter projects" id="pwd" />
            </div>
           
            <div class="d-flex justify-content-between">
        <div className="back-block">
          
               <button type="button" 
               class="addform-btn text-white cursor"
                data-bs-dismiss="offcanvas" aria-label="Close">
                  Close
                </button>
            
        </div>

            <div class="cancel-block">
              <button
                type="submit"
                className=" addform-btn text-white cursor"               
              >
                Save
              </button>
            </div>

           
      </div>
            </form>
    )
}

export default AdvancedFilter;