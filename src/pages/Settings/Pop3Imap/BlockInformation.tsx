// @ts-nocheck
import { isArray } from "lodash"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import UnblockModal from "./UnblockModal"

export const renderLanguage = (language_key, replaceData, t) => {
  let text = t(language_key) ? t(language_key) : ""
  Object.keys(replaceData).forEach((key, index) => {
    text = text.replace(key, replaceData[key])
  })
  return text
}

const BlockInformation = ({ type, issue, data, countryCode }) => {
  const { t } = useTranslation()

  const [openModalUnblock, setOpenModalUnblock] = useState(false)

  // const info = {
  //   enabled: {
  //     enabled: 3,
  //     disableserviceinfo: [
  //       {
  //         name: "smtp",
  //         date: "10/19/2023 18:29:56",
  //         blocked: true,
  //         blockreason: 1,
  //         blocklist: [
  //           {
  //             createat: "10/19/2023 18:04:58",
  //             ip: "112.223.124.139",
  //             ccode: "kr",
  //             passwd: "aTPKe5chzBJ%47@fYyU1o6s*d(gxH9&4",
  //           },
  //           {
  //             createat: "10/19/2023 18:05:22",
  //             ip: "112.223.124.139",
  //             ccode: "kr",
  //             passwd: "aTPKe5chzBJ%47@fYyU1o6s*d(gxH9&6",
  //           },
  //           {
  //             createat: "10/19/2023 18:04:50",
  //             ip: "112.223.124.139",
  //             ccode: "kr",
  //             passwd: "aTPKe5chzBJ%47@fYyU1o6s*d(gxH9&3",
  //           },
  //           {
  //             createat: "10/19/2023 18:04:41",
  //             ip: "112.223.124.139",
  //             ccode: "kr",
  //             passwd: "aTPKe5chzBJ%47@fYyU1o6s*d(gxH9&2",
  //           },
  //           {
  //             createat: "10/19/2023 18:02:40",
  //             ip: "112.223.124.139",
  //             ccode: "kr",
  //             passwd: "aTPKe5chzBJ%47@fYyU1o6s*d(gxH9&",
  //           },
  //           {
  //             createat: "10/19/2023 18:03:52",
  //             ip: "112.223.124.139",
  //             ccode: "kr",
  //             passwd: "aTPKe5chzBJ%47@fYyU1o6s*d(gxH9&1",
  //           },
  //           {
  //             createat: "10/19/2023 18:03:17",
  //             ip: "112.223.124.139",
  //             ccode: "kr",
  //             passwd: "aTPKe5chzBJ%47@fYyU1o6s*d(gxH9&",
  //           },
  //         ],
  //       },
  //     ],
  //     managerblockdate: "",
  //   },
  //   msg: "",
  //   service_info: [
  //     {
  //       name: "pop3",
  //       host: "global3.hanbiro.com",
  //       port: 995,
  //       id: "linuxdev3@global.hanbiro.com",
  //       apppasswd: true,
  //       ssl: true,
  //       popenableboxs: { Maildir: "받은메일함" },
  //       poprangenow: false,
  //       poppdeletesync: true,
  //       autotrashdelete: false,
  //       imapdisableboxs: {},
  //       imapboxsize: 0,
  //     },
  //     {
  //       name: "imap",
  //       host: "global3.hanbiro.com",
  //       port: 993,
  //       id: "linuxdev3@global.hanbiro.com",
  //       apppasswd: true,
  //       ssl: true,
  //       popenableboxs: { Maildir: "받은메일함" },
  //       poprangenow: false,
  //       poppdeletesync: true,
  //       autotrashdelete: false,
  //       imapdisableboxs: {},
  //       imapboxsize: 0,
  //     },
  //   ],
  //   success: true,
  // }
  // const data = info.enabled.disableserviceinfo
  // const issue = info.enabled.enabled

  return (
    <>
      <div className="block-information d-flex flex-column gap-2">
        <div className="form-group align-items-center">
          <label className="col-md-3 col-lg-2 col-form-label">
            {renderLanguage(
              "mail.mail_smtp_replace_block",
              { xxx: "SMTP/" + type.toUpperCase() },
              t,
            )}
          </label>
          <div className="col-md-9 col-lg-10">
            <div className="d-flex gap-3 flex-wrap align-items-center">
              <span className="">
                {renderLanguage(
                  "mail.mail_we_are_currently_blocking_your_xxx_authentication",
                  {
                    xxx: "SMTP/" + type.toUpperCase(),
                  },
                  t,
                )}
              </span>
              <button
                className="btn btn-primary btn-sm btn-round"
                disabled={issue === 4}
                type="button"
                onClick={() => setOpenModalUnblock(true)}
              >
                {t("mail.unblock")}
              </button>
            </div>
          </div>
        </div>

        {/* issue === 3 */}
        {issue === 3 && (
          <div className="form-group">
            <label className="col-md-3 col-lg-2 col-form-label">
              {t("mail.mail_blocking_service")}
            </label>

            <div className="col-md-9 col-lg-10">
              {isArray(data) &&
                data.length > 0 &&
                data.map((item) => (
                  <div key={item?.name} className="d-flex flex-column gap-2">
                    <div className="row">
                      <div className="col-xs-3 col-md-2">{t("mail.mail_service_name")}</div>
                      <div className="col-xs-9 col-md-10">{item.name.toUpperCase()}</div>
                    </div>
                    <div className="row">
                      <div className="col-xs-3 col-md-2">{t("mail.mail_reason_for_blocking")}</div>
                      <div className="col-xs-9 col-md-10">{item.blockreason}</div>
                    </div>
                    <div className="row">
                      <div className="col-xs-3 col-md-2">{t("mail.mail_block_date_and_time")}</div>
                      <div className="col-xs-9 col-md-10">{item.date}</div>
                    </div>

                    {/* item?.blocklist?.length > 0 */}
                    {item?.blocklist?.length > 0 && (
                      <div className="row">
                        <div className="col-xs-3 col-md-2">{t("mail.mail_failure_log")}</div>
                        <div className="col-xs-9 col-md-10">
                          <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                              <thead>
                                <tr>
                                  <td>{t("common.calendar_calendar_date_msg")}</td>
                                  <td>IP</td>
                                  <td>{t("mail.country")}</td>
                                  <td>{t("mail.mail_password")}</td>
                                </tr>
                              </thead>
                              <tbody>
                                {item?.blocklist?.map((log) => (
                                  <tr ng-repeat="(keyLog, log) in item.blocklist">
                                    <td>{log.createat}</td>
                                    <td>{log.ip}</td>
                                    <td>{countryCode?.[log.ccode] || ""}</td>
                                    <td>{log.passwd}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* issue === 4 */}
        {issue === 4 && (
          <div className="form-group align-items-center">
            <label className="col-md-3 col-lg-2 col-form-label">
              {t("mail.mail_reason_for_blocking")}
            </label>
            <span
              className="col-md-9 col-lg-10"
              dangerouslySetInnerHTML={{ __html: t("mail.mail_reason_for_blocking_msg") }}
            ></span>
          </div>
        )}

        {/* issue === 4 */}
        {issue === 4 && (
          <div className="form-group align-items-center">
            <label className="col-md-3 col-lg-2 col-form-label">
              {t("mail.mail_block_date_and_time")}
            </label>
            <div className="col-md-9 col-lg-10" style={{ marginTop: 4 }}>
              {data?.managerblockdate}
            </div>
          </div>
        )}
      </div>

      {openModalUnblock && (
        <UnblockModal
          type={type?.toLowerCase()}
          isOpen={openModalUnblock}
          onClose={() => setOpenModalUnblock(false)}
        />
      )}
    </>
  )
}

export default BlockInformation
