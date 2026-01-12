// @ts-nocheck
import React from "react"

import { Row, Col, Card, CardBody, CardTitle, CardSubtitle } from "reactstrap"
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const ResponsiveTables = () => {
  //meta title
  document.title = "Responsive Table "
  return (
    <Row>
      <Col>
        <Card>
          <div className="table-rep-plugin">
            <div
              className="table-responsive mb-0"
              data-pattern="priority-columns"
            >
              <Table
                id="tech-companies-1"
                className="table table-striped table-bordered"
              >
                <Thead>
                  <Tr>
                    <Th>Company</Th>
                    <Th data-priority="1">Last Trade</Th>
                    <Th data-priority="3">Trade Time</Th>
                    <Th data-priority="1">Change</Th>
                    <Th data-priority="3">Prev Close</Th>
                    <Th data-priority="3">Open</Th>
                    <Th data-priority="6">Bid</Th>
                    <Th data-priority="6">Ask</Th>
                    <Th data-priority="6">1y Target Est</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Th>
                      GOOG <span className="co-name">Google Inc.</span>
                    </Th>
                    <Td>597.74</Td>
                    <Td>12:12PM</Td>
                    <Td>14.81 (2.54%)</Td>
                    <Td>582.93</Td>
                    <Td>597.95</Td>
                    <Td>597.73 x 100</Td>
                    <Td>597.91 x 300</Td>
                    <Td>731.10</Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

export default ResponsiveTables
