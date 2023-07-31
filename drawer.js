// Example.jsx
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import EditTimeSheet from "./editTimesheet";

const SideCanvas = ({ layout, data, onClose, triggerLoader }) => {
  const [show, setShow] = useState(false);
  const description = data.description;
  const handleClose = () => {
    onClose();
    triggerLoader();
    setShow(false);
  };
  const handleShow = () => setShow(true);
  //console.log("dataform :", data);

  return (
    <>
      <Button variant="btn btn-outline p-0" onClick={handleShow}>
        <span className="i-color material-symbols-outlined text-c-green">edit</span>
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        backdrop="static"
      >
        <Offcanvas.Header closeButton closeVariant={'white'}>
          <Offcanvas.Title className="title">{layout}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <EditTimeSheet formdetails={data} savetriggerclose={handleClose}></EditTimeSheet>
        </Offcanvas.Body >
      </Offcanvas>
    </>
  );
};

export default SideCanvas;
