// @ts-nocheck
import React, { useState, useEffect } from "react"
import ChooseFile from "../ChooseFile"
import File from "../File"
import * as api from "../api"
import { humanFileSize, isIE, getDomain, makeid, getCookie } from "../utils"
import { HanNoData } from "components/Common/HanNoData"
// import { HanIcon, HanNoData } from "Groupware/components"

let indexUpload = 0

function index() {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState([])
  const [filesChoosed, setFilesChoosed] = useState({})
  const [progressData, setProgressData] = useState({ id: "", progress: 0 })
  const [progressFiles, setProgressFiles] = useState({})

  useEffect(() => {
    if (progressData.id) {
      setProgressFiles({
        ...progressFiles,
        [progressData.id]: progressData.progress,
      })
    }
  }, [progressData])

  const onChangeChooseFile = filesNew => {
    setFiles(filesNew.concat(files))
  }

  const onToggleCheck = item => {
    let filesChoosedNew = { ...filesChoosed }
    if (filesChoosedNew.hasOwnProperty(item.id)) {
      delete filesChoosedNew[item.id]
    } else {
      filesChoosedNew = {
        ...filesChoosedNew,
        [item.id]: item,
      }
    }
    setFilesChoosed(filesChoosedNew)
  }

  const onDeleteFilesChoosed = () => {
    let filesChoosedNew = { ...filesChoosed }

    const filesNew = files.filter(file => !filesChoosedNew[file.id])
    setFiles(filesNew)
    setFilesChoosed({})
  }

  const onDeleteFile = id => {
    let filesChoosedNew = { ...filesChoosed }
    const filesNew = files.filter(file => file.id != id)
    setFiles(filesNew)
    delete filesChoosedNew[id]
    setFilesChoosed(filesChoosedNew)
  }

  const onUpload = () => {
    setLoading(true)
    indexUpload = 0
    for (const file of files) {
      const formData = new FormData()
      formData.append("name", file.name)
      formData.append("file", file.file)
      formData.append("fkey", makeid())
      // formData.append(
      //   "cookie",
      //   "62e62c7d3a4effd8aaeeb8e248fa49072c70e5438e9c9b283c71ae4a0a50afe04d82a01d6e06d33b19f7eb277ffe1f09"
      // );
      formData.append("cookie", getCookie("HANBIRO_GW"))
      formData.append("parentId", "my")
      api.upload(formData, progress => {
        if (progress == 100) {
          indexUpload += 1
          if (indexUpload == files.length) {
            setFiles([])
            setLoading(false)
            indexUpload = 0
          }
        }
        setProgressData({
          id: file.id,
          progress: progress,
        })
      })
    }
  }

  const renderFiles = () => {
    return (
      <>
        <hr className="mg-y-20 bd-0"></hr>
        <label className="d-block tx-medium tx-10 tx-uppercase tx-sans tx-spacing-1 tx-color-03 mg-b-5">
          Files
        </label>
        <div className="row row-xs pd-b-10">
          {files
            // .filter(file => file.type == "file")
            .map((item, index) => (
              <File
                key={item.id}
                isViewDetail={false}
                isDownload={false}
                isCopyTo={false}
                isMoveTo={false}
                isRename={false}
                isDelete={true}
                isChoosed={filesChoosed.hasOwnProperty(item.id)}
                isUpload={true}
                progress={progressFiles[item.id]}
                isContextMenu={!loading}
                isAccessChoose={!loading}
                name={item.name}
                extension={item.ext}
                size={humanFileSize(item.size)}
                author={item.author}
                onToggleCheck={() => onToggleCheck(item)}
                // onDownload={() => downloadFiles(item.id)}
                onDelete={() => onDeleteFile(item.id)}
                // onRename={() =>
                //   onStartUpdateFolder({ id: item.id, name: item.name })
                // }
              />
            ))}
        </div>
      </>
    )
  }

  return (
    <div className="">
      <div className="pd-10 pd-t-20 d-flex">
        <div className="col-6">
          <div className="input-group mg-b-10">
            <input
              type="text"
              className="form-control"
              placeholder="Recipient's username"
              aria-label="Recipient's username"
              aria-describedby="hanModalClouddiskChooseFolder"
              value={"My"}
              disabled
            />
            <div className="input-group-append">
              <button
                className="btn btn-search-clouddisk btn-light"
                type="button"
                id="hanModalClouddiskChooseFolder"
                onClick={e => {}}
              >
                Choose Folder
              </button>
            </div>
          </div>
        </div>
        <div className="col-6 d-flex justify-content-end">
          {Object.keys(filesChoosed).length > 0 && (
            <div>
              <button
                className="btn btn-danger mg-l-10"
                type="button"
                onClick={onDeleteFilesChoosed}
              >
                Delete
                {/* <HanIcon name="Trash2" style={{ marginLeft: 4 }} /> */}
              </button>
            </div>
          )}
          {files.length > 0 && (
            <div>
              <button
                className="btn btn-success mg-l-10"
                type="button"
                onClick={onUpload}
                disabled={loading}
              >
                Upload
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm mg-l-4"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  // <HanIcon name="Upload" style={{ marginLeft: 4 }} />
                  "Upload icon"
                )}
              </button>
            </div>
          )}
          <div>
            <ChooseFile onChange={onChangeChooseFile} disabled={loading} />
          </div>
        </div>
      </div>
      <div className="container-clouddisk">
        {files.length > 0 ? (
          <div className="pd-t-10 pd-l-25 pd-r-25">
            <h4>All Files</h4>

            {renderFiles()}
          </div>
        ) : (
          <HanNoData />
          // "no data"
        )}
      </div>
    </div>
  )
}

export default index
