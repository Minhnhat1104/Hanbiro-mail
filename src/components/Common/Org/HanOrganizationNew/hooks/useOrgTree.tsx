// @ts-nocheck
import React, { useEffect, useState } from "react"
import { CONFIG_TYPE, optimizeDepartments, TYPE_TREE } from "../utils"

function useOrgTree(options) {
  // State
  const [tabChoosed, setTabChoosed] = useState(options?.tabChoosed || TYPE_TREE.organization)
  const [typeTreeChoosed, setTypeTreeChoosed] = useState(
    options?.typeTreeChoosed || TYPE_TREE.department,
  )
  const [firstLoading, setFirstLoading] = useState(true)
  const [configOrg, setConfigOrg] = useState(
    CONFIG_TYPE?.[typeTreeChoosed] || CONFIG_TYPE[TYPE_TREE.department],
  )
  const [departments, setDepartments] = useState([])
  const [keyword, setKeyword] = useState("")

  useEffect(() => {
    if (options?.tabChoosed) {
      setTabChoosed(options.tabChoosed)
    }
    if (options?.typeTreeChoosed) {
      setTypeTreeChoosed(options.typeTreeChoosed)
      setConfigOrg(CONFIG_TYPE?.[options.typeTreeChoosed])
    }
  }, [])

  const getOrg = async () => {
    setFirstLoading(true)
    const params = configOrg.init.params({ ...options?.APIParams, idURL: "", keyword: keyword })
    const response = await configOrg.init.api(params)

    if (response && response.success) {
      const departmentModel = optimizeDepartments(response.rows)
      setDepartments(departmentModel)
    }
    setFirstLoading(false)
  }

  const onChangeType = (typeTree) => {
    setTypeTreeChoosed(typeTree.id)
    setConfigOrg(CONFIG_TYPE[typeTree.id])
  }

  const onChangeTab = (tab) => {
    setTabChoosed(tab)
    if (tab == TYPE_TREE.contacts) {
      setTypeTreeChoosed(TYPE_TREE.contacts)
      setConfigOrg(CONFIG_TYPE[tab])
    } else {
      // setConfigOrg(CONFIG_TYPE[typeTreeChoosed])
      setTypeTreeChoosed(TYPE_TREE.department)
      setConfigOrg(CONFIG_TYPE[TYPE_TREE.department])
    }
  }

  const renderLoading = () => {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center mg-t-20">
        <div className="spinner-border han-color-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    )
  }

  return {
    configOrg,
    firstLoading,
    departments,
    typeTreeChoosed,
    tabChoosed,
    keyword,
    setKeyword,
    getOrg,
    onChangeType,
    onChangeTab,
    renderLoading,
  }
}

export default useOrgTree
