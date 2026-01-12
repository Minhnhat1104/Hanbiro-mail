// @ts-nocheck
import { BaseButton, BaseIcon, BaseModal } from "components/Common"
import BaseInputFree from "components/SettingAdmin/InputSelectMultiFree"
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Col, FormGroup, Input, InputGroup, Label, Row } from "reactstrap"
import InputText from "components/SettingAdmin/Inputwriting/index"
import { getApproverInfo } from "modules/mail/list/api"
import { useCustomToast } from "hooks/useCustomToast"

const components = {
  DropdownIndicator: null,
}

function ApproverInfoModal(props) {
  const { isOpen, toggle, approverId } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const [approverInfo, setApproverInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getApproverInfo(approverId)
      .then((res) => {
        if (res.success) {
          setApproverInfo(res)
        }
      })
      .catch((err) => {
        errorToast(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const headerModal = useMemo(() => {
    return <header>{t("mail.mail_approvers_information")}</header>
  }, [])
  const bodyModal = useMemo(() => {
    return (
      <>
        <div>
          <InputText
            title={t("mail.mail_admin_policy_name")}
            value={approverInfo?.secuname}
            disabled
          />
        </div>

        <FormGroup row>
          <Label htmlFor="taskname" className="col-form-label col-lg-3">
            {t("mail.mail_admin_basic_policy")}
          </Label>
          <Col lg="9" className="mt-2">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <Label check>
                  <Input
                    type="radio"
                    name="radio1"
                    checked={approverInfo?.mode === "force"}
                    onChange={() => {}}
                    disabled
                  />{" "}
                  {t("mail.mail_admin_forced_permit")}
                </Label>
              </div>
              <div className="me-3">
                <Label check>
                  <Input
                    type="radio"
                    name="radio1"
                    checked={approverInfo?.mode === "select"}
                    onChange={() => {}}
                    disabled
                  />{" "}
                  {t("mail.mail_selective_permit")}
                </Label>
              </div>
            </div>
            <div className="mt-2 text-secondary">{t("mail.mail_admin_forced_permit_sending")}</div>
          </Col>
        </FormGroup>

        <Row>
          <Col lg="12">
            <FormGroup row>
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_final_permitter")}
              </Label>
              <Col lg="9">
                <InputGroup>
                  <Input
                    className="cursor-not-allowed"
                    value={approverInfo?.managername}
                    disabled
                  />
                  <BaseButton disabled>{t("mail.mail_select")}</BaseButton>
                </InputGroup>
                <div>{t("mail.admin_mail_secure_manager_help_msg")}</div>
              </Col>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <FormGroup className="mb-4" row>
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_final_permit_policy")}
              </Label>
              <Col lg="9" className="pl-0 mt-2">
                <div className="d-flex justify-content-left">
                  <Input
                    aria-label="Checkbox for following text input"
                    type="checkbox"
                    className="me-1"
                    checked={approverInfo?.esuper === "y" || false}
                    onChange={() => {}}
                    disabled
                  />
                  <div>{t("mail.mail_forced_approval_possible")}</div>
                </div>
                <div className="mt-2 text-secondary">
                  <p>{t("mail.mail_arbitrary_permit_means")}</p>
                </div>

                {approverInfo?.mode === "select" && (
                  <div className="d-flex justify-content-left">
                    <Input
                      aria-label="Checkbox for following text input"
                      type="checkbox"
                      className="me-1"
                      checked={approverInfo?.eforce === "y" || false}
                      onChange={() => {}}
                      disabled
                    />
                    <div>{t("mail.mail_permit_all")}</div>
                  </div>
                )}
              </Col>
            </FormGroup>
          </Col>
        </Row>

        {approverInfo?.mode === "force" && (
          <>
            <div className="mb-4">
              <BaseIcon
                icon={"mdi mdi-help-circle-outline"}
                className={"color-green text-secondary mx-2"}
              />
              {t("mail.mail_specify_the_conditions")}
            </div>

            <Row>
              <Col lg="12">
                <FormGroup className="mb-4" row>
                  <Label htmlFor="taskname" className="col-form-label col-lg-3">
                    {t("mail.mail_permit_condition")}
                  </Label>
                  <Col lg="9" className="pl-0 mt-2">
                    <div>
                      <div className="d-flex justify-content-left">
                        <Input
                          aria-label="Checkbox for following text input"
                          type="checkbox"
                          className="me-1"
                          checked={approverInfo?.fall === "y" || false}
                          onChange={() => {}}
                          disabled
                        />
                        <div>{t("mail.mail_admin_include_mail")}</div>
                      </div>

                      <div className="form-name">
                        {approverInfo?.fall === "y" ? (
                          <Input
                            className="w-100 mt-3 px-4 py-2"
                            value={approverInfo?.secufilter?.istodomains}
                            disabled
                          />
                        ) : (
                          <Input
                            className="mt-3 px-4 py-2"
                            disabled={approverInfo?.fall !== "y" || false}
                            placeholder={t("mail.mail_admin_eg_domain")}
                          />
                        )}
                        <div className="mt-2 text-secondary">
                          <p>
                            {t("mail.mail_when_sending_mail_to_a_specific_domain")}
                            <br />
                            {t("mail.mail_multiple_domains_can_be_registered_separated_by_commas")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="d-flex justify-content-left">
                        <Input
                          aria-label="Checkbox for following text input"
                          type="checkbox"
                          className="me-1"
                          checked={approverInfo?.secufilter?.isfile === "y"}
                          onChange={() => {}}
                          disabled
                        />
                        <span>{t("mail.mail_only_mail_with_attachments")}</span>
                      </div>
                      <div className="form-name">
                        {approverInfo?.secufilter?.filetype !== "" ? (
                          <Input
                            className="w-100 mt-3 px-4 py-2"
                            value={approverInfo?.secufilter?.filetype}
                            disabled
                          />
                        ) : (
                          <Input
                            className="mt-3 px-4 py-2"
                            placeholder={t("mail.mail_admin_eg_extension")}
                            disabled
                          />
                        )}
                      </div>

                      <div className="mt-3 ms-3">
                        <span>{t("mail.mail_attached_name_keyword")}</span>
                      </div>

                      <div className="mt-2 form-name">
                        {approverInfo?.secufilter?.filename !== "" ? (
                          <Input
                            className="px-4 py-2"
                            value={approverInfo?.secufilter?.filename}
                            disabled
                          />
                        ) : (
                          <Input
                            className="px-4 py-2"
                            placeholder={t("mail.mail_admin_eg_description")}
                            disabled
                          />
                        )}
                        <div className="mt-2 text-secondary">
                          <span>
                            {t(
                              "mail.mail_multiple_keywords_attach_can_be_registered_separated_by_commas",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className=" mt-3 form-name">
                      <InputGroup>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          value={approverInfo?.secufilter?.msgsize}
                          disabled
                        />
                        <div className="input-group-text">MB</div>
                      </InputGroup>

                      <div className="mt-2 text-secondary">
                        <p>{t("mail.mail_only_mail_larger_than_certain_size")}</p>
                      </div>
                    </div>

                    {/* keyword */}
                    <div>
                      <div className="d-flex justify-content-left">
                        <Input
                          aria-label="Checkbox for following text input"
                          type="checkbox"
                          className="me-1"
                          checked={approverInfo?.secufilter?.keyword !== ""}
                          onChange={() => {}}
                          disabled
                        />
                        {/* <div>Use keyword</div> */}
                        <div>{t("admin.common_search_keyword")}</div>
                      </div>
                      <div className="form-name">
                        {approverInfo?.secufilter?.keyword !== "" ? (
                          <Input
                            className="mt-3 px-4 py-2"
                            value={approverInfo?.secufilter?.keyword}
                            disabled
                          />
                        ) : (
                          <Input
                            className="mt-3 px-4 py-2"
                            placeholder={t("mail.mail_admin_eg_keyword")}
                            disabled
                          />
                        )}

                        <div className="mt-2 text-secondary">
                          <p>
                            {t("mail.mail_when_keyword_is_included_in_subject_body")}
                            <br />
                            {t(
                              "mail.mail_multiple_keywords_subject_can_be_registered_separated_by_commas",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </>
        )}

        {/* Permission Recipient */}
        <div>
          <BaseInputFree
            title={t("mail.mail_secure_person")}
            components={components}
            component={
              <Button color="primary" className="px-1 rounded-none-btn-org">
                <i className="mdi mdi-file-tree"></i>
              </Button>
            }
            isMulti
            value={approverInfo?.users?.map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
            isDisabled
          />
        </div>

        {/* Mid-Approver */}
        <div>
          <BaseInputFree
            title={t("mail.mail_admin_mid_permitter")}
            components={components}
            component={
              <Button color="primary" className="px-1 rounded-none-btn-org">
                <i className="mdi mdi-file-tree"></i>
              </Button>
            }
            isMulti
            isDisabled
            placeholder=""
            value={approverInfo?.mseculist?.map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
            disabled
          />
        </div>

        {/* Setting Predecessor */}
        <div>
          <BaseInputFree
            title={t("mail.mail_secure_predecessor_setting")}
            isMulti
            isDisabled
            placeholder=""
            value={approverInfo?.mpredecessorids?.map((item) => ({
              ...item,
              value: item.id,
              label: item.name,
            }))}
          />
        </div>

        <Row>
          <Col lg="12">
            <FormGroup className="mb-4" row>
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_mid_approval_policy")}
              </Label>
              <Col lg="9" className="pl-0 mt-2">
                {approverInfo?.mode === "force" && (
                  <div>
                    <div className="d-flex justify-content-left">
                      <Input
                        aria-label="Checkbox for following text input"
                        type="checkbox"
                        className="me-1"
                        checked={approverInfo?.mselect === "y" || false}
                        onChange={() => {}}
                        disabled
                      />
                      <div>{t("mail.mail_selective_permit")}</div>
                    </div>
                    <div className="mt-2 text-secondary">
                      <p>{t("mail.mail_select_whether_to_permit_when_sending_mail")}</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="d-flex justify-content-left">
                    <Input
                      aria-label="Checkbox for following text input"
                      type="checkbox"
                      className="me-1"
                      checked={approverInfo?.mall === "y" || false}
                      onChange={() => {}}
                      disabled
                    />
                    <div>{t("mail.mail_permit_all")}</div>
                  </div>
                  <div className="mt-2 text-secondary">
                    <p>{t("mail.mail_all_mid_permit_must_approve_before_the_final_approval")}</p>
                  </div>
                </div>
              </Col>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <FormGroup className="mb-4" row>
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_admin_setting_notification")}
              </Label>
              <Col lg="9" className="pl-0 mt-2">
                <div>
                  <div className="d-flex justify-content-left">
                    <Input
                      aria-label="Checkbox for following text input"
                      type="checkbox"
                      className="me-1"
                      checked={approverInfo?.mailalarm === "y" || false}
                      onChange={() => {}}
                      disabled
                    />
                    <div>{t("mail.mail_send_approval_request_email_to_approver")}</div>
                  </div>
                  <div className="mt-2 text-secondary">
                    <p>
                      {t(
                        "mail.mail_if_you_request_approval_we_will_send_an_email_notification_to_the_approver",
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-left">
                    <Input
                      aria-label="Checkbox for following text input"
                      type="checkbox"
                      className="me-1"
                      checked={approverInfo?.mailalarm_tosender === "y" || false}
                      onChange={() => {}}
                      disabled
                    />
                    <div>{t("mail.mail_receive_approval_request_notification")}</div>
                  </div>
                  <div className="mt-2 text-secondary">
                    <p>{t("mail.mail_receive_approval_request_notification_msg")}</p>
                  </div>
                </div>
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </>
    )
  }, [approverInfo])
  const footerModal = useMemo(() => {
    return (
      <div className="w-100 d-flex justify-content-end">
        <BaseButton color={"secondary"} onClick={() => toggle(false)} type="button">
          {t("mail.project_close_msg")}
        </BaseButton>
      </div>
    )
  }, [])

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={() => toggle(false)}
      modalClass="approver-info"
      contentClass="h-100"
      bodyClass="approver-info-body overflow-y-auto hidden-scroll-box"
      renderHeader={headerModal}
      renderBody={bodyModal}
      renderFooter={footerModal}
    />
  )
}

export default ApproverInfoModal
