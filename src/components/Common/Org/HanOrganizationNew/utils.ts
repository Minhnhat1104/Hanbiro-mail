// @ts-nocheck
import { isArray, isEmpty, isNumber } from "lodash"
import * as api from "./api"

export const TYPE_TREE = {
  organization: "organization",
  department: "department",
  position: "position",
  alias: "alias",
  contacts: "contacts",
}

const contactMapKey = {
  comp: "h",
  my: "p",
  share: "o",
}

export const optimizeDepartments = (departments = [], parentData = {}) => {
  const departmentModel = departments.map((item) => {
    let itemNew = {
      ...item,
      isFolder: item.isFolder || item.type == "folder",
      key:
        item?.root === "addrbook" && item?.section
          ? `${contactMapKey[item?.section]}_${item?.id}`
          : item?.key
          ? item.key
          : item?.id
          ? item.id
          : !item?.isFolder
          ? `${item?.cn}_${item?.addrseq}`
          : "", // addrbook to get key for tab contacts when init org
      isLazy: item.isLazy || item.leaf == false,
      title: item.title || item.text || item.name,
    }

    if (parentData?.is_favorite_root) {
      itemNew.isFavorite = true
    }
    if (itemNew.isFavorite) {
      itemNew.key = (parentData?.key ?? "") + "_" + itemNew.key
    }

    if (itemNew.children) {
      itemNew.children = optimizeDepartments(itemNew.children, itemNew)
    }
    return itemNew
  })
  return departmentModel
}

export const CONFIG_TYPE = {
  [TYPE_TREE.department]: {
    init: {
      params: ({ keyword = "", ...other }) => ({
        checkmenu: "",
        contact: 1,
        favorite_default: 1,
        is_favorite: 1,
        ...(keyword && { keyword: keyword }),
        loadUserModePosition: false,
        notcheckmail: 0,
        selectGroupbExpanded: false,
        is_title_mail: true,
        not_title_html_entity: true,
        smsfax: 0,
        tree: "dynatree",
        ...other,
      }),
      api: api.onGetOrg,
    },
    expand: {
      params: ({ idURL = "", keyword = "" }) => {
        return {
          contact: 1,
          ...(keyword && { keyword: keyword }),
          notcheckmail: 0,
          selectGroupbExpanded: false,
          is_title_mail: true,
          not_title_html_entity: true,
          smsfax: 0,
          tree: "dynatree",
          idURL: idURL,
        }
      },
      api: api.onGetOrg,
    },
    user: {
      params: ({ idURL = "", keyword = "" }) => ({
        contact: 1,
        notcheckmail: 0,
        selectGroupbExpanded: false,
        is_title_mail: true,
        not_title_html_entity: true,
        smsfax: 0,
        sub: true,
        tree: "dynatree",
        idURL: idURL,
      }),
      api: api.onGetOrgUser,
    },
  },
  [TYPE_TREE.position]: {
    init: {
      params: ({ keyword = "" }) => ({
        checkmenu: "",
        contact: 1,
        favorite_default: 1,
        // id: "",
        is_favorite: 1,
        is_title_mail: true,
        not_title_html_entity: true,
        ...(keyword && { keyword: keyword }),
        notcheckmail: 0,
        selectGroupbExpanded: false,
        smsfax: 0,
        tree: "dynatree",
      }),
      api: api.onGetOrgPosition,
    },
    expand: {
      params: ({ idURL = "", keyword = "" }) => {
        const [cn] = idURL.split("_")
        return {
          contact: 1,
          id: idURL,
          ...(keyword && { keyword: keyword }),
          notcheckmail: 0,
          selectGroupbExpanded: false,
          is_title_mail: true,
          not_title_html_entity: true,
          smsfax: 0,
          tree: "dynatree",
          idURL: cn,
        }
      },
      api: api.onGetOrgPositionExpend,
    },
    user: {
      params: ({ idURL = "" }) => {
        const [cn] = idURL.split("_")
        return {
          contact: 1,
          id: idURL,
          notcheckmail: 0,
          selectGroupbExpanded: false,
          is_title_mail: true,
          not_title_html_entity: true,
          // smsfax: 0,
          sub: "",
          tree: "dynatree",
          idURL: cn,
        }
      },
      api: api.onGetOrgPositionExpend,
    },
  },
  [TYPE_TREE.alias]: {
    init: {
      params: ({ keyword = "" }) => ({
        checkmenu: "",
        contact: 1,
        favorite_default: 1,
        // id: "",
        is_favorite: 1,
        notcheckmail: 0,
        selectGroupbExpanded: false,
        is_title_mail: true,
        not_title_html_entity: true,
        smsfax: 0,
        tree: "dynatree",
        ...(keyword && { keyword: keyword }),
      }),
      api: api.onGetOrgAlias,
    },
    expand: {
      params: ({ idURL = "", keyword = "" }) => {
        return {
          contact: 1,
          // id: "",
          notcheckmail: 0,
          selectGroupbExpanded: false,
          is_title_mail: true,
          not_title_html_entity: true,
          smsfax: 0,
          tree: "dynatree",
          ...(keyword && { keyword: keyword }),
          idURL: idURL,
        }
      },
      api: api.onGetOrg,
    },
    user: {
      params: ({ idURL = "", keyword = "" }) => ({
        contact: 1,
        // id: "",
        notcheckmail: 0,
        selectGroupbExpanded: false,
        is_title_mail: true,
        not_title_html_entity: true,
        smsfax: 0,
        sub: "",
        tree: "dynatree",
        idURL: idURL,
      }),
      api: api.onGetOrgUser,
    },
  },
  [TYPE_TREE.contacts]: {
    init: {
      params: ({ keyword = "" }) => ({
        checkmenu: "",
        contact: 1,
        loadUserModePosition: false,
        is_title_mail: true,
        not_title_html_entity: true,
        multi_mail: true,
        notcheckmail: 0,
        selectGroupbExpanded: false,
        smsfax: 0,
        tree: "dynatree",
        ...(keyword && { keyword: keyword }),
      }),
      api: api.onGetContact,
    },
    expand: {
      params: ({ idURL = "", keyword = "" }) => {
        return {
          contact: 1,
          notcheckmail: 0,
          loadUserModePosition: false,
          selectGroupbExpanded: false,
          is_title_mail: true,
          not_title_html_entity: true,
          smsfax: 0,
          tree: "dynatree",
          keyword: keyword,
          idURL: idURL,
        }
      },
      api: api.onGetContactExpand,
    },
    user: {
      params: null,
      api: null,
    },
  },
}

export const getEmail = (item, isFolder, options = {}, isComposeMail) => {
  const { folderKeyField = "", userKeyField = "" } = options
  const name = isFolder ? item.groupname : item.username || item.title
  const email = item.email
  const key = item.key
  return isFolder
    ? isComposeMail
      ? `${key} ${name} <${email}>`
      : item?.[folderKeyField] ?? `${key}`
    : item?.[userKeyField] ?? `${key} ${name} <${email}>`
}

export const unCheckedParentFolder = (item, dept) => {
  if (isEmpty(item) || isEmpty(dept)) return null
  const isContactItem = !isNumber(parseInt(item?.key))
  const isParent = item?.up !== "0" || (item?.up !== "0" && isContactItem)

  if (isParent) {
    const deptKeyArr = Object.keys(dept)
    const parentDeptIndex = deptKeyArr.findIndex((_key) => {
      const nKey = _key.split("_")
      if (item?.isFolder) {
        return nKey[nKey.length - 1] === (item?.up || item?.serial)
      } else {
        return nKey[nKey.length - 1] === (item?.groupno || item?.serial)
      }
    })
    if (parentDeptIndex !== -1) {
      return deptKeyArr[parentDeptIndex]
    } else {
      return null
    }
  }
}

const getUserFavorite = async (dept, userList, configOrg) => {
  if (isEmpty(dept)) return {}
  if (dept?.isFolder) {
    if (!isEmpty(dept?.children)) {
      for (const child of dept?.children) {
        if (child?.isFolder) {
          await getUserFavorite(child, userList, configOrg)
        } else {
          const uKey = getEmail(child)
          userList[uKey] = child
        }
      }
    } else {
      if (configOrg.user.api) {
        const _key = dept?.key
        const params = configOrg.user.params({ idURL: _key })
        const res = await configOrg.user.api(params)
        if (res?.success) {
          res?.rows?.forEach((_item) => {
            const uKey = getEmail(_item)
            userList[uKey] = _item
          })
        }
      }
    }
  } else {
    const uKey = getEmail(dept)
    userList[uKey] = dept
  }
}

export const mapChildrenToDept = async (
  users,
  depts,
  configOrg,
  isCheckGroupmail,
  isGetChildren = false,
) => {
  if (isEmpty(users) && isEmpty(depts)) return null

  // Initialize the mapping: add a children property to each department
  if (isEmpty(depts)) return users
  let deptMapping = {}
  for (const dKey in depts) {
    const _item = depts[dKey]

    if (_item?.is_favorite_root || _item?.type === "folder") {
      let userFavorites = {}
      await getUserFavorite(_item, userFavorites, configOrg)
      if (!isEmpty(userFavorites)) {
        deptMapping = { ...deptMapping, ...userFavorites }
      }
      delete deptMapping[dKey]
    } else {
      deptMapping[dKey] = { ...depts[dKey], children: {} }
    }
  }

  // Iterate over each user to map them to the correct department
  Object.keys(users).forEach((uKey) => {
    const user = users[uKey]
    const userUp = user?.isFolder
      ? `${user?.cn}_${user?.up || user?.serial}`
      : `${user?.cn}_${user?.groupno}`
    if (deptMapping.hasOwnProperty(userUp)) {
      deptMapping[userUp].children[uKey] = user
    } else {
      deptMapping[uKey] = user
    }
  })

  // Check dept => call api get user or not
  let usersApi = []
  for (const _key in deptMapping) {
    const item = deptMapping[_key]
    if (
      (item?.isFolder && isEmpty(item?.children) && isCheckGroupmail && !!!item?.groupmail) ||
      (item?.isFolder && item?.isLazy && isGetChildren)
    ) {
      delete deptMapping[_key]
      if (configOrg.user.api) {
        const params = configOrg.user.params({ idURL: _key })
        const res = await configOrg.user.api(params)
        if (res?.success) {
          usersApi = [...usersApi, ...res?.rows]
        }
      }
    }
  }
  if (!isEmpty(usersApi)) {
    usersApi.forEach((_user) => {
      const nKey = getEmail(_user)
      deptMapping[nKey] = _user
    })
  }

  return deptMapping
}
