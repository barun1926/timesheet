// src/components/bootstrap-carousel.component.js
import React, { Component } from "react";

import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditTimeSheet from "./editTimesheet";
import Offcanvas from 'react-bootstrap/Offcanvas';


class MyModalComponent extends Component {

    render() {

      console.log('this.props',this.props);

        return (
            <div>
                <Modal show={this.props.show} onHide={() => this.props.onHide({ msg: 'Cross Icon Clicked!' })}>

                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>

                      <EditTimeSheet onEditTimesheet={this.props.data} />

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.onClick({ msg: 'Modal Closed!' })} >Close</Button>
                        <Button variant="primary" onClick={() => this.props.onClick({ msg: 'Modal Submitted!' })}  >Submit</Button>
                    </Modal.Footer>

                </Modal>
            </div>
        )
    };
}

export default MyModalComponent;