import setupStore from "../store"

export const reduxStateOutsideComponent = () => {
  const { store } = setupStore()
  const state = store?.getState()

  const getState = (key) => {
    return !!key && state?.[key]
  }

  const dispatchAction = (action) => {
    action && store?.dispatch(action)
  }

  return { getState, dispatchAction }
}
