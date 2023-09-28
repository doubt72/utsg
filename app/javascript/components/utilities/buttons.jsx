import React from "react";
import { Link } from "react-router-dom"
import {
  ArrowRepeat, BoxArrowInRight, BoxArrowRight, ChatText, Check2Square, Hexagon,
  InfoCircle, PencilSquare, Person, Trash3, XCircle
} from "react-bootstrap-icons"

// Form submit putton, enclose icon and pass text as a prop
const CustomSubmitButton = (props) => {
  return <button type="submit" className="custom-button nowrap">{props.children}{props.text}</button>
}

// Link button, enclose icon and pass url and text as props
const CustomLink = (props) => {
  return <Link to={props.url} className="custom-button nowrap">{props.children}{props.text}</Link>
}

const AboutButton = () => {
  return <CustomLink url="/about" text="about"><InfoCircle /></CustomLink>
}

const CancelButton = () => {
  return <CustomLink url="/" text="cancel"><XCircle /></CustomLink>
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

const DeleteButton = (props) => {
  if (props.type === "confirm") {
    return <CustomSubmitButton text="delete account"><Trash3 /></CustomSubmitButton>
  } else {
    return <CustomLink url="/delete_account" text="delete account"><Trash3 /></CustomLink>
  }
}

const LoginButton = (props) => {
  if (props.type === "confirm") {
    return <CustomSubmitButton text="login"><BoxArrowInRight /></CustomSubmitButton>
  } else {
    return <CustomLink url="/login" text="login"><BoxArrowInRight /></CustomLink>
  }
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

const ReturnButton = () => {
  return <CustomLink url="/" text="main page"><Hexagon /></CustomLink>
}

const SendNewCodeButton = () => {
  return <CustomLink url="/new_validation_code" text="send new code"><ArrowRepeat /></CustomLink>
}

const SignupButton = (props) => {
  if (props.type === "confirm") {
    return <CustomSubmitButton text="sign up "><PencilSquare /></CustomSubmitButton>
  } else {
    return <CustomLink url="/signup" text="sign up"><PencilSquare /></CustomLink>
  }
}

const UpdateInfoButton = () => {
  return <CustomSubmitButton text="update account"><Person /></CustomSubmitButton>
}

const ValidateAccountButton = () => {
  return <CustomLink url="/validate_account" text="continue"><ArrowRepeat /></CustomLink>
}

const VerifyButton = () => {
  return <CustomSubmitButton text="verify"><Check2Square /></CustomSubmitButton>
}

// A few of these have link/submit versions (set type prop to confirm for submit)
export {
  AboutButton,
  CancelButton,
  ChangePasswordButton,
  ChatButton,
  DeleteButton,
  LoginButton,
  LogoutButton,
  ProfileButton,
  RecoverAccountButton,
  ResetPasswordButton,
  ReturnButton,
  SendNewCodeButton,
  SignupButton,
  UpdateInfoButton,
  ValidateAccountButton,
  VerifyButton,
}