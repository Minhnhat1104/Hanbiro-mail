// @ts-nocheck
import React from "react"
import { Col, Input, Row } from "reactstrap"

const FieldItem = ({ title, component, type, filterOptions, onFilterChange }) => {
  return (
    <div className="w-100">
      <Row className="align-items-center">
        <Col xs="3">
          <div className="han-h4 han-text-secondary">{title}</div>
        </Col>
        <Col xs="9">
          {component ? (
            component
          ) : (
            <Input
              value={filterOptions?.[type] || ""}
              onChange={(e) => onFilterChange && onFilterChange({ type, value: e.target.value })}
            />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default FieldItem
