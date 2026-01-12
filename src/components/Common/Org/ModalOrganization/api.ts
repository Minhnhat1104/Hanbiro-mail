// @ts-nocheck
import * as api from "../../../../helpers/api_helper"

const URL_POST_GET_ALL_CHILDREN_GROUP = "org/group/get_all_children_group"

export const onGetAllChildrenGroup = (params = {}) => {
  return api.post(URL_POST_GET_ALL_CHILDREN_GROUP, params)
}
