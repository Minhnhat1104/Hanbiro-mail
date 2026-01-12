// @ts-nocheck
import React, { Fragment, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { isArray, isEmpty } from "lodash";

const SelectHost = props => {
  const { loading, options, value, onChange, isDisabled } = props;
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const customOptions = useMemo(() => {
    return options.map(option => {
      return {
        ...option,
        label: t(option.label)
      }
    })
  }, [options])

  useEffect(() => {
    if (!isEmpty(customOptions)) {
      if (value !== undefined) {
        let option = customOptions.find(option => option.value === value);
        if (option) {
          setSelected(option);
        }
      } else {
        setSelected(customOptions[0])
      }
    }
  }, []);

  const onSelect = obj => {
    setSelected(obj);
    onChange && onChange(obj)
  };

  return (
    <Fragment>
      <Select
        {...props}
        placeholder={`${t("mail.mail_select")}`}
        options={customOptions}
        onChange={onSelect}
        value={selected ?? null}
        isLoading={loading}
        isDisabled={isDisabled}

        styles={{
          menu: base => ({
            ...base,
            backgroundColor: "white!important"
          })
        }}
      />
    </Fragment>
  );
};

SelectHost.defaultProps = {
  options: [],
  loading: false
};

export default React.memo(SelectHost);
