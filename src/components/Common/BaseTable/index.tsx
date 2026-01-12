// @ts-nocheck
import React from "react"
import { Table } from "reactstrap"

const BaseTable = (props) => {
  const { heads, rows, tableClass = "", loading = false, ...attrs } = props
  return (
    <Table hover bordered striped className={tableClass}>
      <thead>
        <tr>
          {heads.length > 0 &&
            heads.map((thead, index) => {
              return (
                <th
                  key={index}
                  style={thead.style}
                  className={`align-middle ${
                    thead.class ? thead.class + " " : ""
                  }han-h4 han-text-secondary`}
                >
                  {thead.content}
                </th>
              )
            })}
        </tr>
      </thead>
      <tbody>
        {rows &&
          rows.length > 0 &&
          rows.map((row, i) => {
            return (
              <tr className={row.class} key={i}>
                {row.columns.map((td, j) => {
                  return (
                    <td
                      style={td?.style}
                      colSpan={td?.colSpan ?? 1}
                      rowSpan={td?.rowSpan ?? 1}
                      className={`${td?.className} han-h5 han-fw-regular han-text-primary`}
                      key={j}
                    >
                      {td.content}
                    </td>
                  )
                })}
              </tr>
            )
          })}
      </tbody>
    </Table>
  )
}
export default BaseTable
