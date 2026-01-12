// @ts-nocheck
import React, { Fragment } from "react"
import { Table } from "reactstrap"

const MailProgramSetupGuide = ({ type, t, information }) => {
  return (
    <div className="mail-setup-guide d-flex flex-column gap-3">
      <div className="d-flex align-items-center gap-5">
        <div className="smtp-setup-guide">{t("mail.mail_program_setup_guide")}</div>
        <span>{t("mail.mail_use_smtp_pop3_msg2")}</span>
      </div>

      <div className="w-100 overflow-x-auto">
        <Table bordered className="table-setup-guide">
          {type === "smtp" ? (
            <tbody>
              {Array.isArray(information) &&
                information.length > 0 &&
                information.map((_info) => (
                  <Fragment key={_info?.name}>
                    {_info?.name === "smtp" && (
                      <>
                        {/* smtp host */}
                        <tr>
                          <td className="text-center align-middle">
                            {t("mail.mail_smtp_server_name")}
                          </td>
                          <td className="">
                            <div className="d-flex flex-column gap-2">
                              <span className="">{_info?.host}</span>
                              <span className="han-text-secondary">
                                {t("mail.mail_this_is_the_connection_host_name")}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {/* smtp port */}
                        <tr>
                          <td className="text-center align-middle">{t("mail.mail_smtp_port")}</td>
                          <td className="">
                            <div className="d-flex flex-column gap-2">
                              <span className="">{`${_info?.port} ${
                                _info?.ssl
                                  ? `, ${t("mail.mail_ssl_secure_connection_required")}`
                                  : ""
                              }`}</span>
                              <span className="han-text-secondary">
                                {t("mail.mail_ssl_secure_connection_required_msg")}
                              </span>
                              {!_info?.ssl && (
                                <span className="text-danger han-fw-semibold">
                                  ※ {t("mail.mail_no_ssl_secure_connection_msg")}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                        {/* smtp id */}
                        <tr>
                          <td className="text-center align-middle">
                            {t("common.profile_login_history_id")}
                          </td>
                          <td className="">
                            <div className="d-flex flex-column gap-2">
                              <span className="">{_info?.id}</span>
                              <span className="han-text-secondary">
                                {t("mail.mail_this_is_the_access_authentication_id")}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {/* smtp pass */}
                        <tr>
                          <td className="text-center align-middle">{t("mail.mail_password")}</td>
                          <td className="">
                            <div className="d-flex flex-column gap-2">
                              <span className="">{t("mail.mail_login_password")}</span>
                              <span className="han-text-secondary">
                                {t("mail.mail_this_is_the_authentication_password_when_connecting")}
                              </span>
                              <span className="han-text-secondary">
                                {t("mail.mail_please_use_your_web_login_password")}
                              </span>
                            </div>
                          </td>
                        </tr>
                      </>
                    )}
                  </Fragment>
                ))}
            </tbody>
          ) : (
            <tbody>
              {Array.isArray(information) &&
                information.length > 0 &&
                information.map((_info) => (
                  <Fragment key={_info?.name}>
                    <tr>
                      <td className="text-center align-middle">
                        {_info?.name === "smtp"
                          ? t("mail.mail_smtp_connection_information")
                          : t("mail.mail_smtp_connection_information")?.replace(
                              "SMTP",
                              _info?.name?.toUpperCase(),
                            )}
                      </td>
                      <td className="">
                        <div className="d-flex gap-3">
                          <span className="">{t("mail.mail_host_name")}</span>
                          <div className="d-flex flex-column gap-2">
                            <span className="han-fw-semibold">{_info?.host}</span>
                            <span className="han-text-secondary">
                              {t("mail.mail_this_is_the_connection_host_name")}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="">
                        <div className="d-flex gap-3">
                          <span className="">{t("mail.mail_connection_port")}</span>
                          <div className="d-flex flex-column gap-2">
                            <span className="">{`${_info?.port} ${
                              _info?.ssl ? `, ${t("mail.mail_ssl_secure_connection_required")}` : ""
                            }`}</span>
                            <span className="han-text-secondary">
                              {t("mail.mail_ssl_secure_connection_required_msg")}
                            </span>
                            {!_info?.ssl && (
                              <span className="text-danger han-fw-semibold">
                                ※ {t("mail.mail_no_ssl_secure_connection_msg")}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {(_info?.name === "pop3" || _info?.name === "imap") && (
                      <tr>
                        <td className="text-center align-middle">
                          {t("mail.mail_connection_port")}
                        </td>
                        <td className="">
                          <div className="d-flex gap-3">
                            <span className="">{t("common.profile_login_history_id")}</span>
                            <div className="d-flex flex-column gap-2">
                              <span className="han-fw-semibold">{_info?.id}</span>
                              <span className="han-text-secondary">
                                {t("mail.mail_this_is_the_access_authentication_id")}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="">
                          <div className="d-flex gap-3">
                            <span className="">{t("mail.mail_cipher_password")}</span>
                            <div className="d-flex flex-column gap-2">
                              {_info?.apppasswd ? (
                                <span>{t("mail.mail_app_password")}</span>
                              ) : (
                                <span className="han-fw-semibold">
                                  {t("mail.mail_groupware_webmail_login_password")}
                                </span>
                              )}
                              <span className="han-text-secondary">
                                {t("mail.mail_this_is_the_authentication_password_when_connecting")}
                              </span>
                              <span className="han-text-secondary">
                                {_info?.apppasswd ? (
                                  <span>{t("mail.mail_please_use_the_issued_app_password")}</span>
                                ) : (
                                  <span>{t("mail.mail_please_use_your_web_login_password")}</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
            </tbody>
          )}
        </Table>
      </div>
    </div>
  )
}

export default MailProgramSetupGuide
