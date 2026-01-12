// @ts-nocheck
import React, { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useCustomToast } from "hooks/useCustomToast"

import { getLetterTemplates } from "modules/mail/compose/api"

import BaseModal from "components/Common/BaseModal"
import BaseButton from "components/Common/BaseButton"

import { ComposeContext } from "components/Common/ComposeMail/index"

const ComposeTemplateModal = ({ show, setShow }) => {
  const { t } = useTranslation()
  const { editorValue, handleChangeEditor } = useContext(ComposeContext)
  const { errorToast } = useCustomToast()

  const [templatesHTML, setTemplatesHTML] = useState()
  const [templatesValue, setTemplatesValue] = useState()

  useEffect(() => {
    const params = {
      content: getCurrentEditorValue(true),
    }

    getLetterTemplates(params).then((res) => {
      if (res) {
        setTemplatesHTML(res.html)
        setTemplatesValue(res.encoded)
      }
    })
  }, [])

  const onHideModal = () => {
    setShow(false)
  }

  function getCurrentEditorValue(removeComment) {
    let content = editorValue
    const regex = /<!--HanbiroLetterStart-->(.|\n)*?<!--HanbiroLetterEnd-->/g
    const COMMENT_PSEUDO_COMMENT_OR_LT_BANG = new RegExp(
      "<!--[\\s\\S]*?(?:-->)?" +
        "<!---+>?" + // A comment with no body
        "|<!(?![dD][oO][cC][tT][yY][pP][eE]|\\[CDATA\\[)[^>]*>?" +
        "|<[?][^>]*>?", // A pseudo-comment
      "g",
    )

    if (removeComment) {
      content = editorValue.replace(COMMENT_PSEUDO_COMMENT_OR_LT_BANG, "")
    } else if (content.match(regex)) {
      content = content.match(regex)[0]
    }

    return "<!--HanbiroLetterStart-->" + content + "<!--HanbiroLetterEnd-->"
  }

  const handleSelect = () => {
    const selectedRadio = $("#letterRow").find("input[type='radio'][name='letter']:checked")

    if (!selectedRadio.length) {
      errorToast("Please select template")
      return
    }

    if (templatesValue) {
      const selectedHTML = templatesValue[selectedRadio.attr("value")]
      handleChangeEditor(selectedHTML.replace(/{content}/gi, getCurrentEditorValue(false)))

      onHideModal()
    }
  }

  const renderHeader = () => {
    return <>{t("mail.mail_choose_template")}</>
  }

  const renderBody = () => {
    return (
      <div id="letterRow" className="row" dangerouslySetInnerHTML={{ __html: templatesHTML }} />
    )
  }

  const renderFooter = () => {
    return (
      <div className="w-100 d-flex justify-content-center gap-2">
        <BaseButton outline color="grey" onClick={() => setShow(false)}>
          {t("common.common_cancel")}
        </BaseButton>
        <BaseButton color="primary" onClick={() => handleSelect()}>
          {t("mail.mail_select")}
        </BaseButton>
      </div>
    )
  }

  return (
    <BaseModal
      open={show}
      size={"md"}
      toggle={onHideModal}
      renderHeader={renderHeader}
      renderBody={renderBody}
      renderFooter={renderFooter}
    />
  )
}

export default ComposeTemplateModal
