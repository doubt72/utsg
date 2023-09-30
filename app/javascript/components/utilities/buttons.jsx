import React from "react";
import { Link } from "react-router-dom"
import {
  ArrowRepeat, BoxArrowInRight, BoxArrowRight, ChatText, Check2Square, Hexagon,
  InfoCircle, PencilSquare, Person, ShieldExclamation, Trash3, XCircle
} from "react-bootstrap-icons"
import PropTypes from "prop-types"

// Form submit putton, enclose icon and pass text as a prop
const CustomSubmitButton = (props) => {
  return <button type="submit" className="custom-button nowrap">{props.children}{props.text}</button>
}

CustomSubmitButton.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
}

// Link button, enclose icon and pass url and text as props
const CustomLink = (props) => {
  return <Link to={props.url} className="custom-button nowrap">{props.children}{props.text}</Link>
}

CustomLink.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  url: PropTypes.string,
}

const AboutButton = () => {
  return <CustomLink url="/about" text="about"><InfoCircle /></CustomLink>
}

const CancelButton = (props) => {
  if (props.type === "submit") {
    return (
      <button type="submit" className="custom-button nowrap" name="cancel">
        <XCircle />cancel
      </button>
    )
  } else {
    const url = props.url !== undefined ? props.url : "/"
    return <CustomLink url={url} text="cancel"><XCircle /></CustomLink>
  }
}

CancelButton.propTypes = {
  type: PropTypes.string,
  url: PropTypes.string,
}

const ChatButton = () => {
  return <CustomSubmitButton text="chat"><ChatText /></CustomSubmitButton>
}

const ChangePasswordButton = () => {
  return <CustomSubmitButton text="change password"><ShieldExclamation /></CustomSubmitButton>
}

const ResetPasswordButton = () => {
  return <CustomSubmitButton text="reset password"><ArrowRepeat /></CustomSubmitButton>
}

const DeleteButton = () => {
  return <CustomSubmitButton text="delete account"><Trash3 /></CustomSubmitButton>
}

const LoginButton = (props) => {
  if (props.type === "confirm") {
    return <CustomSubmitButton text="login"><BoxArrowInRight /></CustomSubmitButton>
  } else {
    return <CustomLink url="/login" text="login"><BoxArrowInRight /></CustomLink>
  }
}

LoginButton.propTypes = {
  type: PropTypes.string,
}

const LogoutButton = () => {
  return <CustomLink url="/logout" text="logout"><BoxArrowRight /></CustomLink>
}

const ProfileButton = () => {
  return <CustomLink url="/profile" text="profile"><Person /></CustomLink>
}

const RecoverAccountButton = (props) => {
  if (props.type === "confirm") {
    return <CustomSubmitButton text="send code"><ArrowRepeat /></CustomSubmitButton>
  } else {
    return <CustomLink url="/recover_account" text="recover account"><ArrowRepeat /></CustomLink>
  }
}

RecoverAccountButton.propTypes = {
  type: PropTypes.string,
}

const ReturnButton = () => {
  return <CustomLink url="/" text="main page"><Hexagon /></CustomLink>
}

const SendNewCodeButton = () => {
  return <CustomSubmitButton text="send new code"><ArrowRepeat /></CustomSubmitButton>
}

const SignupButton = (props) => {
  if (props.type === "confirm") {
    return <CustomSubmitButton text="sign up"><PencilSquare /></CustomSubmitButton>
  } else {
    return <CustomLink url="/signup" text="sign up"><PencilSquare /></CustomLink>
  }
}

SignupButton.propTypes = {
  type: PropTypes.string,
}

const UpdateInfoButton = () => {
  return <CustomSubmitButton text="update account"><Person /></CustomSubmitButton>
}

const VerifyButton = () => {
  return <CustomSubmitButton text="verify"><Check2Square /></CustomSubmitButton>
}

export {
  AboutButton,
  CancelButton,             // type=submit prop = submit button version, name = cancel; url prop available
  ChangePasswordButton,
  ChatButton,
  DeleteButton,
  LoginButton,              // type=confirm prop = submit button version
  LogoutButton,
  ProfileButton,
  RecoverAccountButton,     // type=confirm prop = submit button version
  ResetPasswordButton,
  ReturnButton,
  SendNewCodeButton,
  SignupButton,             // type=confirm prop = submit button version
  UpdateInfoButton,
  VerifyButton,
}