// @ts-nocheck
import React, { useState } from "react"
import classnames from "classnames";
import './style.css';


import {
  CardText,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

const Tabs = props => {
  const { name } = props
  const [activeTab, setactiveTab] = useState("1");
  const toggle = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };
  return (
    <>
      < Nav tabs style={{ background: '#EFF2F7', border: 'hidden' }}>
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            className={classnames({
              active2: activeTab === "1",
              border: false
            })}
            onClick={() => {
              toggle("1");
            }}
          >
            Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            style={{ cursor: "pointer" }}
            className={classnames({
              active2: activeTab === "2",
              border: false
            })}
            onClick={() => {
              toggle("2");
            }}
          >
            Profile
          </NavLink>
        </NavItem>
      </Nav >
      <TabContent activeTab={activeTab} className="p-3 text-muted">
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <CardText className="mb-0">
                Raw denim you probably haven&apos;t heard of them jean
                shorts Austin. Nesciunt tofu stumptown aliqua, retro
                synth master cleanse. Mustache cliche tempor,
                williamsburg carles vegan helvetica. Reprehenderit
                butcher retro keffiyeh dreamcatcher synth. Cosby
                sweater eu banh mi, qui irure terry richardson ex
                squid. Aliquip placeat salvia cillum iphone. Seitan
                aliquip quis cardigan american apparel, butcher
                voluptate nisi qui.
              </CardText>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <CardText className="mb-0">
                Food truck fixie locavore, accusamus mcsweeney&apos;s
                marfa nulla single-origin coffee squid. Exercitation
                +1 labore velit, blog sartorial PBR leggings next
                level wes anderson artisan four loko farm-to-table
                craft beer twee. Qui photo booth letterpress,
                commodo enim craft beer mlkshk aliquip jean shorts
                ullamco ad vinyl cillum PBR. Homo nostrud organic,
                assumenda labore aesthetic magna delectus mollit.
                Keytar helvetica VHS salvia yr, vero magna velit
                sapiente labore stumptown. Vegan fanny pack odio
                cillum wes anderson 8-bit.
              </CardText>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </>
  )

}
export default Tabs
