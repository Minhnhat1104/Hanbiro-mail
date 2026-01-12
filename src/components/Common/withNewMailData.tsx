// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSocketCount } from "store/actions";
import { selectUserData } from "store/auth/config/selectors";
import { SET_SOCKET_COUNT } from "store/socketCount/actionTypes";
import { ServiceSocket } from "utils"

function withNewMailData(WrappedComponent) {
  function ComponentWithNewMailData(props) {
    const userData = useSelector(selectUserData)
    const dispatch = useDispatch()
    const [newMailData, setNewMailData] = useState(null)

    useEffect(() => {
      if (userData?.id) {
        const socket = ServiceSocket({ userData: userData })
        socket.off("newAlarm", onConnect).on("newAlarm", onConnect)
      }
    }, [userData])

    const onConnect = res => {
      setNewMailData(res)
    }

    return (
      <WrappedComponent
        {...props}
        newMailData={newMailData}
      />
    );
  }

  return ComponentWithNewMailData;
}

export default withNewMailData;