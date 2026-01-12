// @ts-nocheck
import { createSelector } from "reselect"

const selectConfig = state => state.Config
export const selectUserConfig = createSelector(
  selectConfig,
  config => config.userConfig
)
export const selectUserData = createSelector(selectUserConfig, userConfig => {
  return userConfig?.user_data
})
export const selectGlobalConfig = createSelector(
  selectConfig,
  config => config.globalConfig
)
export const selectUserMailSetting = createSelector(
  selectConfig,
  config => config.personalSetting?.mail
)
export const selectMenuConfig = createSelector(
  selectConfig,
  config => config.allConfig?.menu_list ?? []
)
