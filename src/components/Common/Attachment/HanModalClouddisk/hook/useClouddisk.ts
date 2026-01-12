// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"
import * as api from "../api"
import * as Utils from "../utils"
import { DATA } from "../data"
import { FILTERS_SEARCH } from "../Search/SearchType"
import { FILTERS } from "../FilterSearch"
const TAB_ALL = {
  id: 0,
  icon: "File",
  text: "All",
}
const useClouddisk = () => {
  const [tabs, setTabs] = useState([])
  const [tabChoosed, setTabChoosed] = useState({})
  const [viewMode, setViewMode] = useState("grid") // grid, list
  const [fileChoosed, setFileChoosed] = useState({})
  const [fileChoosedArr, setFileChoosedArr] = useState([])
  const [filterChoosed, setFilterChoosed] = useState(FILTERS[0])
  const [foldersMenu, setFoldersMenu] = useState([{ id: "my", text: "My" }])
  const [data, setData] = useState(DATA["my"])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalItems: 0,
  })
  const [keyword, setKeyword] = useState("")
  const [typeSearchChoosed, setTypeSearchChoosed] = useState(FILTERS_SEARCH[0])

  const [firstLoading, setFirstLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isCreateFolder, setIsCreateFolder] = useState(false)

  const currentFolderId = useMemo(() => {
    return foldersMenu.length <= 0
      ? tabChoosed.id
      : foldersMenu[foldersMenu.length - 1].id
  }, [tabChoosed, foldersMenu])

  const isSearching = useMemo(
    () => !!keyword || filterChoosed.id !== FILTERS[0].id,
    [keyword, filterChoosed]
  )

  useEffect(() => {
    setFileChoosed({})
    setFileChoosedArr([])
    const params = {
      access: 1,
      type: "dir",
    }

    api.getMenus(params).then(res => {
      const tabsData = Utils.optimizeTabData(res)
      const tabChoosedNew = tabsData?.[0] ?? {}
      const tabsNew = tabsData.concat([TAB_ALL])
      setTabs(tabsNew)
      setTabChoosed(tabChoosedNew)
      onGetFiles({ id: tabChoosedNew.id })
    })
  }, [])

  useEffect(() => {
    if (isSearching) {
      onSearch()
    } else {
      onGetFiles()
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    onGetFiles()
  }, [tabChoosed])

  const changeViewMode = mode => {
    setViewMode(mode)
  }
  const onChangeTab = tab => {
    setKeyword("")
    setLoading(true)
    setTabChoosed(tab)
    setFoldersMenu([tab])
    setPagination({
      ...pagination,
      page: 1,
    })
  }
  const onToggleCheck = item => {
    let fileChoosedNew = { ...fileChoosed }
    let fileChoosedArrNew = [...fileChoosedArr]
    const id = item.id
    const index = fileChoosedArr.indexOf(id)

    if (fileChoosed.hasOwnProperty(id)) {
      delete fileChoosedNew[id]
      fileChoosedArrNew.splice(index, 1)
    } else {
      fileChoosedNew = {
        ...fileChoosedNew,
        [id]: item,
      }
      fileChoosedArrNew.unshift(id)
    }

    setFileChoosedArr(fileChoosedArrNew)
    setFileChoosed(fileChoosedNew)
  }
  const onRemoveAll = () => {
    setFileChoosed({})
    setFileChoosedArr([])
  }

  const onGetFiles = (payload = {}) => {
    setLoading(true)
    const paramsFile = {
      cache: true,
      id: currentFolderId,
      sort: JSON.stringify([
        { property: "type", direction: "ASC" },
        { property: "name", direction: "ASC" },
      ]),
      type: "file",
      limit2: pagination.limit,
      start: (pagination.page - 1) * pagination.limit,
      ...payload,
    }
    api.getFiles(paramsFile).then(resFiles => {
      if (resFiles) {
        if (resFiles && resFiles.files) {
          setData(resFiles)
        } else {
          setData({ ...resFiles, files: [] })
        }
        if (resFiles.total) {
          setPagination({ ...pagination, totalItems: resFiles.total })
        } else {
          setPagination({ ...pagination, totalItems: 0 })
        }
      }
      setFirstLoading(false)
      setLoading(false)
    })
  }

  const onGetFilesSearch = (payload = {}, type) => {
    setLoading(true)
    const paramsFile = {
      ...payload,
      limit2: pagination.limit,
      start: (pagination.page - 1) * pagination.limit,
    }

    let apiCall
    if (type === "search") {
      apiCall = api.searchFile(paramsFile)
    } else if (type === "filter") {
      apiCall = api.getFiles(paramsFile)
    } else {
      setLoading(false)
      return
    }

    apiCall.then(resFiles => {
      if (resFiles) {
        if (resFiles.files) {
          setData(resFiles)
        } else {
          setData({ ...resFiles, files: [] })
        }
        setPagination(prevPagination => ({
          ...prevPagination,
          totalItems: resFiles.total || 0,
        }))
      }
      setFirstLoading(false)
      setLoading(false)
    })
  }

  const onSearch = () => {
    if (!!keyword.trim()) {
      const params = {
        id: tabChoosed.id,
        keyword: keyword,
        range: typeSearchChoosed?.id ?? "all",
        sort: JSON.stringify([
          { property: "type", direction: "ASC" },
          { property: "name", direction: "ASC" },
        ]),
      }
      onGetFilesSearch(params, "search")
    } else {
      if (filterChoosed.id !== FILTERS[0].id) {
        const params = {
          cache: true,
          type: filterChoosed.id,
          sort: JSON.stringify([
            { property: "type", direction: "ASC" },
            { property: "name", direction: "ASC" },
          ]),
        }
        onGetFilesSearch(params, "search")
      } else {
        onGetFiles({ id: currentFolderId })
      }
    }
  }
  const onRefresh = () => {
    setKeyword("")
    setTypeSearchChoosed(FILTERS_SEARCH[0])
    setFilterChoosed(FILTERS[0])
    onGetFiles({ id: currentFolderId })
  }
  const onCreateFolder = folderName => {
    const parentId =
      foldersMenu.length <= 0
        ? tabChoosed.id
        : foldersMenu[foldersMenu.length - 1].id
    const formData = {
      force: 1,
      parentId,
      name: folderName,
    }
    api.createFolder(formData).then(res => {
      onRefresh()
      setIsCreateFolder(false)
    })
  }
  const onChangeFilterSearch = item => {
    setKeyword("")
    setFilterChoosed(item)
    setPagination({
      ...pagination,
      page: 1,
    })

    const params = {
      cache: true,
      type: item.id,
      sort: JSON.stringify([
        { property: "type", direction: "ASC" },
        { property: "name", direction: "ASC" },
      ]),
    }
    onGetFilesSearch(params, "search")
  }
  const toggleCreateNewFolder = isOpen => {
    if (isOpen != null) {
      setIsCreateFolder(isOpen)
      return
    }
    setIsCreateFolder(!isCreateFolder)
  }
  const onOpenFolder = folder => {
    onGetFiles({ id: folder.id })
    const foldersMenuNew = foldersMenu.concat([folder])
    setFoldersMenu(foldersMenuNew)
  }

  const onPressMenu = ({ folder, index }) => {
    onGetFiles({ id: folder.id, start: 0 })
    setFoldersMenu(foldersMenu.filter((folder, indexOld) => indexOld <= index))
  }
  const goToPage = (page = 1) => {
    setPagination({ ...pagination, page })
  }
  return {
    currentFolderId,
    data,
    fileChoosed,
    fileChoosedArr,
    filterChoosed,
    firstLoading,
    foldersMenu,
    isCreateFolder,
    keyword,
    loading,
    pagination,
    tabs,
    tabChoosed,
    viewMode,
    typeSearchChoosed,
    changeViewMode,
    goToPage,
    onChangeTab,
    onChangeFilterSearch,
    onCreateFolder,
    onToggleCheck,
    onRemoveAll,
    onGetFiles,
    onGetFilesSearch,
    onOpenFolder,
    onPressMenu,
    onRefresh,
    onSearch,
    setKeyword,
    toggleCreateNewFolder,
    setTypeSearchChoosed,
  }
}

export default useClouddisk
