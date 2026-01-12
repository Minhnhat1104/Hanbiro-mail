// @ts-nocheck
import React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const Authmiddleware = (props) => {
  const isLoggedIn = useSelector(state => state.Login.isLoggedIn)

  // if (!isLoggedIn) {
  //   return (
  //       <Navigate to={{ pathname: "/login", state: { from: props.location } }} />
  //   )
  // }
  return (<React.Fragment>
    {props.children}
  </React.Fragment>)
}

export default Authmiddleware
