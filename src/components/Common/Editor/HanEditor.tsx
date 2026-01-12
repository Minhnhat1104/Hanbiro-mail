// @ts-nocheck
import React, { forwardRef, useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"
import PropTypes from "prop-types"
import { debounce } from "lodash"
import useEditor from "./useEditor"
import "./style.scss"
import { getBaseUrl } from "utils"
function HanEditorComponent(
  { readonly, value, onChange, options = {}, editorAttributes = {}, parentClass = "" },
  ref,
) {
  // useEffect(() => {
  //   if (editorValue) {
  //     handleChangeEditor(editorValue)
  //   }
  // }, [])

  const editorRef = useRef(null)

  const onBlurEditor = (e) => {
    const activeEditor = tinymce.activeEditor
    if (activeEditor) {
      onChange(activeEditor.getBody().innerHTML)
    }
  }

  const {
    fontfamily,
    imageUploadUrl,
    defaultPlugins,
    defaultToolbar,
    imageUploadBasePath,
    supportImageTypes,
    filePickerHandle,
    handleSetup,
  } = useEditor()
  return (
    <div className={`${parentClass}`}>
      <Editor
        disabled={readonly}
        // onEditorChange={handleEditorChange}
        onBlur={onBlurEditor}
        onInit={(evt, editor) => {
          editorRef.current = editor
          if (ref) {
            ref.current = editor
          }
        }}
        // value={value}
        plugins={defaultPlugins}
        init={{
          skin: "tinymce-5",
          promotion: false,
          branding: false,
          elementpath: false,
          height: 500,
          statusbar: !readonly,
          menubar: !readonly,
          verify_html: true,
          toolbar: readonly ? "" : defaultToolbar,
          toolbar_mode: "sliding",
          images_upload_base_path: imageUploadBasePath,
          images_upload_url: imageUploadUrl,
          images_upload_credentials: true,
          automatic_uploads: true,
          images_file_types: supportImageTypes,
          font_family_formats: fontfamily,
          paste_data_images: true,
          a11y_advanced_options: true,
          image_advtab: true,
          file_picker_types: "file image media",
          file_picker_callback: filePickerHandle,
          extended_valid_elements: "script[src|async|defer|type|charset]",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height: 1.2; p { margin: 0; } }",
          document_base_url: getBaseUrl(),
          convert_urls: false,
          setup: handleSetup,
          ...options,
        }}
        {...editorAttributes}
      />
    </div>
  )
}
const HanEditor = forwardRef(HanEditorComponent)
export default HanEditor

HanEditorComponent.propTypes = {
  readonly: PropTypes.bool,
  init: PropTypes.string,
  onChange: PropTypes.func,
  customEditorProps: PropTypes.object,
}
