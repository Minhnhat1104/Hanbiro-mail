// @ts-nocheck
import React, { useState } from "react"
import { Row, Col, FormGroup, Label, Form } from "reactstrap"

// Import Editor
import { Editor } from "react-draft-wysiwyg"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "react-datepicker/dist/react-datepicker.css"

const BaseEditor = () => {
  //meta title
  document.title = "Create Task "

  return (
    <>
      <Row>
        <Col lg="12">
          <form className="outer-repeater">
            <div data-repeater-list="outer-group" className="outer">
              <div data-repeater-item className="outer">
                {/* <FormGroup className="mb-4" row>
                  <Col lg="12">
                    <Editor
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      placeholder="Place Your Content Here..."
                    />
                  </Col>
                </FormGroup> */}
                <Form method="post">
                  <Editor
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                  />
                </Form>
              </div>
            </div>
          </form>
        </Col>
      </Row>
    </>
  )
}

export default BaseEditor
