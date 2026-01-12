// @ts-nocheck
import PropTypes from "prop-types"
import React, { useState } from "react"

import { useTranslation } from "react-i18next"

//redux
import { useDispatch, useSelector } from "react-redux"

// Components
import BaseButton from "components/Common/BaseButton"
import withRouter from "components/Common/withRouter"
import { Link } from "react-router-dom"
import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap"

// Formik validation
import { useFormik } from "formik"
import * as Yup from "yup"

//Social Media Imports
// import TwitterLogin from "react-twitter-auth"
// actions
import { loginUser, socialLogin } from "../../store/actions"

// import images
import logo from "assets/images/logo.svg"
import profile from "assets/images/profile-img.png"

//Import config

import { HAN_API_ERROR_MESSAGE } from "constants/api"
import useLocalStorage from "hooks/useLocalStorage"
import { setBaseHost } from "utils"

const publicKey =
  "-----BEGIN PUBLIC KEY-----\r\n" +
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN\r\n" +
  "FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76\r\n" +
  "xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4\r\n" +
  "gwQco1KRMDSmXSMkDwIDAQAB\r\n" +
  "-----END PUBLIC KEY-----"

const crypt = new JSEncrypt()
crypt.setPublicKey(publicKey)

const Login = (props) => {
  //meta title
  document.title = "Login"

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const [apiErrorMessage] = useLocalStorage(HAN_API_ERROR_MESSAGE, null)

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      host: "global3.hanbiro.com/phuc/qa" || "",
      id: "",
      password: "",
      otp: "",
    },
    validationSchema: Yup.object({
      id: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        setBaseHost(values.host)
      } else {
        setBaseHost(location.host)
      }

      let encrypted_user = {
        id: crypt.encrypt(values.id),
        password: crypt.encrypt(values.password),
      }
      if (values.otp != "") {
        encrypted_user.code = values.otp
      }
      if (window.location.host == "localhost:3000") {
        encrypted_user.host = values.host == "" ? "global3.hanbiro.com/phuc/qa" : values.host
      } else {
        encrypted_user.host = window.location.host
      }
      dispatch(loginUser(encrypted_user, props.router.navigate))
    },
  })

  const { error, loading, requireOTP } = useSelector((state) => ({
    error: state.Login.error,
    loading: state.Login.loading,
    requireOTP: state.Login.requireOTP,
  }))

  const [showPassword, setShowPassword] = useState(false)

  const signIn = (res, type) => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      }
      dispatch(socialLogin(postData, props.router.navigate, type))
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        email: res.email,
        token: res.accessToken,
        idToken: res.tokenId,
      }
      dispatch(socialLogin(postData, props.router.navigate, type))
    }
  }

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>Sign in to Hanbiro Mail.</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end">
                      <img src={profile} alt="" className="img-fluid" />
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="logo-light-element">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                          <img src={logo} alt="" className="rounded-circle" height="34" />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault()
                        validation.handleSubmit()
                        return false
                      }}
                    >
                      {error || apiErrorMessage ? (
                        <Alert color="danger">{error || apiErrorMessage}</Alert>
                      ) : null}
                      {/* {window.location.host == "localhost:3000" && (
                            <div className="mb-3">
                              <Label className="form-label">Host</Label>
                              <Input
                                  name="host"
                                  className="form-control"
                                  placeholder="Host"
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.host || ""}
                                  invalid={
                                    validation.touched.host && validation.errors.host
                                        ? true
                                        : false
                                  }
                                  autoComplete={"off"}
                              />

                              {validation.touched.host && validation.errors.host ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.host}
                                  </FormFeedback>
                              ) : null}
                              <Alert color="primary mt-2">
                                List host support: gw.hanbiro.vn/demo2
                              </Alert>
                            </div>
                        )} */}

                      <div className="mb-3">
                        <Label className="form-label">{t("common.profile_login_history_id")}</Label>
                        <Input
                          name="id"
                          className="form-control"
                          placeholder="Your ID"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.id || ""}
                          invalid={validation.touched.id && validation.errors.id ? true : false}
                          autoComplete={"off"}
                        />
                        {validation.touched.id && validation.errors.id ? (
                          <FormFeedback type="invalid">{validation.errors.id}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="mb-3">
                        <Label className="form-label">Password</Label>

                        <InputGroup>
                          <Input
                            name="password"
                            value={validation.values.password || ""}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched.password && validation.errors.password
                                ? true
                                : false
                            }
                            autoComplete={"off"}
                          />
                          <InputGroupText
                            className="cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <i className="mdi mdi-eye-off-outline" />
                            ) : (
                              <i className="mdi mdi-eye-outline" />
                            )}
                          </InputGroupText>
                        </InputGroup>
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>

                      {requireOTP && (
                        <div className="mb-3">
                          <Label className="form-label">OTP</Label>
                          <Input
                            name="otp"
                            className="form-control"
                            placeholder="OTP"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.otp || ""}
                            invalid={
                              validation.touched.host && validation.errors.otp ? true : false
                            }
                          />
                          {validation.touched.otp && validation.errors.host ? (
                            <FormFeedback type="invalid">{validation.errors.otp}</FormFeedback>
                          ) : null}
                        </div>
                      )}

                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="customControlInline"
                        />
                        <label className="form-check-label" htmlFor="customControlInline">
                          Remember me
                        </label>
                      </div>

                      <div className="mt-3 d-grid">
                        <BaseButton
                          color={"primary"}
                          className="btn-block"
                          loading={loading}
                          type="submit"
                        >
                          Log in
                        </BaseButton>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="d-flex justify-content-center">
                <span>Version {process.env.REACT_APP_VERSION}</span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(Login)

Login.propTypes = {
  history: PropTypes.object,
}
