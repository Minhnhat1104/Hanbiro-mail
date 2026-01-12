// @ts-nocheck
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import PropTypes from "prop-types"
import classNames from "classnames"
import BaseIcon from "components/Common/BaseIcon"
import "./style.scss"
import { useSelector } from "react-redux"
const propTypes = {
  total: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
  pageSize: PropTypes.number,
}

const defaultProps = {
  initialPage: 1,
}

const Pagination = props => {
  const { t } = useTranslation()
  const {
    menu,
    total,
    initialPage,
    pageSize,
    onChangePage,
    paddingLeft = "30px",
    paddingRight = "35px",
    loading,
    isSplitMode
  } = props
  const [pager, setPager] = useState(0)

  useEffect(() => {
    setPage(initialPage, false)
  }, [initialPage, total, pageSize])

  // useEffect(() => {
  //   if (menu && menu.trim() !== '') {
  //     onChangePage(1)
  //   }
  // }, [menu]);

  const setPage = (page, isChangePage = true) => {
    if (page < 1) {
      return
    }
    let newPager = getPager(total, page, pageSize)

    setPager(newPager)
    if (isChangePage) {
      onChangePage(page)
    }
  }

  const getPager = (totalItems, currentPage, pageSize) => {
    // default to first page
    currentPage = currentPage || 1

    // default page size is 10
    pageSize = pageSize || 10

    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize)

    let startPage
    let endPage
    if (totalPages <= 5) {
      // less than 10 total pages so show all
      startPage = 1
      endPage = totalPages
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 2) {
        startPage = 1
        endPage = (isSplitMode ? 4 : 5)
      } else if (currentPage + 2 >= totalPages) {
        startPage = Math.max(totalPages - (isSplitMode ? 3 : 4), 1)
        endPage = totalPages
      } else {
        startPage = currentPage - 2
        endPage = currentPage + (isSplitMode ? 1 : 2)
      }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)

    // create an array of pages to ng-repeat in the pager control
    let pages = []
    if (totalPages > 1) {
      pages = [...Array(endPage + 1 - startPage).keys()]?.map(
        i => startPage + i
      )
    } else if (totalPages == 1) {
      pages = [...Array(1).keys()]?.map(
        i => startPage + i
      )
    }

    // return object with all pager properties required by the view
    return {
      totalItems,
      currentPage,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
    }
  }

  return (
    <>
      {!isSplitMode ? (
        <nav className="common-pagination-wrap d-flex justify-content-between align-items-center">
          <div style={{ paddingLeft: paddingLeft }}>
            {t("common.resource_all")}: {total}
          </div>
          {pager && (
            <ul
              className={classNames("pagination my-2", {
                loading: loading,
              })}
              style={{ paddingRight: paddingRight }}
            >
              <li
                className={classNames("page-item first", {
                  disabled: pager?.currentPage == 1,
                })}
              >
                <a onClick={() => setPage(1)} className="page-link">
                  <BaseIcon icon={"fas fa-chevron-left "} />
                  <BaseIcon icon={"fas fa-chevron-left "} />
                </a>
              </li>
              <li
                className={classNames("page-item prev", {
                  disabled: pager?.currentPage == 1,
                })}
              >
                <a
                  onClick={() => setPage(pager?.currentPage - 1)}
                  className="page-link"
                >
                  <BaseIcon icon={"fas fa-chevron-left "} />
                </a>
              </li>
              {pager.currentPage > 4
                ? [
                  <li
                    key="page-1"
                    className={classNames("page-item page-number")}
                  >
                    <a className="page-link" onClick={() => setPage(1)}>
                      {1}
                    </a>
                  </li>,
                  <li
                    key="page-2"
                    className={classNames("page-item page-number")}
                  >
                    <a className="page-link" onClick={() => setPage(2)}>
                      {2}
                    </a>
                  </li>,
                  <li
                    key="hide-page-first"
                    className="page-item disabled page-number"
                  >
                    <span className="page-link">...</span>
                  </li>,
                ]
                : null}
              {pager?.pages.map((page, index) => (
                <li
                  key={index}
                  className={classNames("page-item page-number", {
                    active: pager?.currentPage === page,
                  })}
                >
                  <a className="page-link" onClick={() => setPage(page)}>
                    {page}
                  </a>
                </li>
              ))}
              {pager.currentPage < pager.totalPages - 3 && pager.totalPages > 6
                ? [
                  <li
                    key="hide-page-last"
                    className="page-item disabled page-number"
                  >
                    <span className="page-link">...</span>
                  </li>,
                  <li
                    key="previous-last-page"
                    className={classNames("page-item page-number")}
                  >
                    <a
                      className="page-link"
                      onClick={() => setPage(pager.totalPages - 1)}
                    >
                      {pager.totalPages - 1}
                    </a>
                  </li>,
                  <li
                    key="last-page"
                    className={classNames("page-item page-number")}
                  >
                    <a
                      className="page-link"
                      onClick={() => setPage(pager.totalPages)}
                    >
                      {pager.totalPages}
                    </a>
                  </li>,
                ]
                : null}
              <li
                className={classNames("page-item next", {
                  disabled: pager?.currentPage === pager?.totalPages,
                })}
              >
                <a
                  onClick={() => setPage(pager?.currentPage + 1)}
                  className="page-link"
                >
                  <BaseIcon icon={"fas fa-chevron-right "} />
                </a>
              </li>
              <li
                className={classNames("page-item last", {
                  disabled: pager?.currentPage === pager?.totalPages,
                })}
              >
                <a onClick={() => setPage(pager?.totalPages)} className="page-link">
                  <BaseIcon icon={"fas fa-chevron-right "} />
                  <BaseIcon icon={"fas fa-chevron-right "} />
                </a>
              </li>
            </ul>
          )}
        </nav>
      ) : (
        <nav className="common-pagination-wrap d-flex justify-content-between align-items-center flex-wrap">
          <div style={{ paddingLeft: paddingLeft }}>
            {t("common.resource_all")}: {total}
          </div>
          {pager && (
            <ul className={classNames("pagination my-2", { loading: loading })}
              style={{ paddingRight: paddingRight }}
            >
              <li className={classNames("page-item first", { disabled: pager?.currentPage == 1 })}>
                <a onClick={() => setPage(1)} className="page-link">
                  <BaseIcon icon={"fas fa-chevron-left "} />
                  <BaseIcon icon={"fas fa-chevron-left "} />
                </a>
              </li>
              <li className={classNames("page-item prev", { disabled: pager?.currentPage == 1 })}>
                <a onClick={() => setPage(pager?.currentPage - 1)} className="page-link">
                  <BaseIcon icon={"fas fa-chevron-left "} />
                </a>
              </li>
              {pager?.pages.map((page, index) => (
                <li
                  key={index}
                  className={classNames("page-item page-number", {
                    active: pager?.currentPage === page,
                  })}
                >
                  <a className="page-link" onClick={() => setPage(page)}>
                    {page}
                  </a>
                </li>
              ))}

              <li
                className={classNames("page-item next", {
                  disabled: pager?.currentPage === pager?.totalPages,
                })}
              >
                <a
                  onClick={() => setPage(pager?.currentPage + 1)}
                  className="page-link"
                >
                  <BaseIcon icon={"fas fa-chevron-right "} />
                </a>
              </li>
              <li
                className={classNames("page-item last", {
                  disabled: pager?.currentPage === pager?.totalPages,
                })}
              >
                <a onClick={() => setPage(pager?.totalPages)} className="page-link">
                  <BaseIcon icon={"fas fa-chevron-right "} />
                  <BaseIcon icon={"fas fa-chevron-right "} />
                </a>
              </li>
            </ul>
          )}
        </nav>
      )}
    </>
  )
}

Pagination.propTypes = propTypes
Pagination.defaultProps = defaultProps

export default Pagination
