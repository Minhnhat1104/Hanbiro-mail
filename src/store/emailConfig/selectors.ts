// @ts-nocheck
import { createSelector } from "reselect"

export const selectEmailConfig = state => state.EmailConfig
export const selectBasicMenus = createSelector(
  selectEmailConfig,
  config => config.basicMenus
)

export const selectFolderMenus = createSelector(
  selectEmailConfig,
  config => config.folderMenus
)

export const selectShareMenus = createSelector(
  selectEmailConfig,
  config => config.shareMenus
)

export const selectSpecialMenus = createSelector(
  selectEmailConfig,
  config => config.specialMenus
)

export const selectExtMenus = createSelector(
  selectEmailConfig,
  config => config.extMenus
)

export const selectDisableList = createSelector(
  selectEmailConfig,
  config => config.disableList
)

export const selectAllMenus = createSelector(
  selectEmailConfig,
  config => config.allMenus
)
