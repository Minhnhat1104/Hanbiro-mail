// @ts-nocheck
// React
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Card } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import Tooltip from "components/SettingAdmin/Tooltip"

import UsersList from "./UsersList"
import DomainList from "./DomainList"
import "./style.scss"
import MainHeader from "pages/SettingMain/MainHeader"
import { ALIAS_DOMAIN } from "modules/mail/admin/url"
import { useCustomToast } from "hooks/useCustomToast"
import Loading from "components/Common/Loading"
import { emailGet } from "helpers/email_api_helper"

const AliasDomain = ({ routeConfig }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [dominioPrincipal, setDeminioPrincipal] = useState({ domain: "" })
  const [aliasDomain, setAliasDomain] = useState([])
  const [allDomain, setAllDomain] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const res = await emailGet(ALIAS_DOMAIN)
      if (res?.success) {
        setDeminioPrincipal(res?.main)
        setAliasDomain(res?.alias)
        setAllDomain(res?.alldomains)
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    } finally {
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onRefresh = () => {
    fetchData()
  }

  return (
    <div className="h-100">
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      {isLoading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 z-3">
          <Loading />
        </div>
      )}
      <div className="overflow-y-auto" style={{ height: "calc(100% - 44px)" }}>
        <Tooltip
          content={
            <span
              dangerouslySetInnerHTML={{
                __html: t("mail.main_domain") + "<br>" + dominioPrincipal?.domain,
              }}
            />
          }
        />
        <DomainList routeConfig={routeConfig} aliasDomain={aliasDomain} onRefresh={onRefresh} />
        <UsersList allDomain={allDomain} isLoading={isLoading} setIsLoading={setIsLoading} />
      </div>
    </div>
  )
}

export default AliasDomain
