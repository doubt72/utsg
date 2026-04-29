import React from "react";
import { Link } from "react-router-dom"
import {
  ArrowRepeat, ArrowsCollapseVertical, ArrowsExpandVertical, ArrowsMove, Ban, BoxArrowInRight, BoxArrowRight,
  ChatText, Check2Square, CheckLg, CircleFill, Crosshair, Crosshair2, Dice6, EnvelopeFill, Hexagon, InfoCircle, PencilSquare, Person,
  QuestionCircle, ShieldExclamation, Trash3, XCircle,
  XSquare
} from "react-bootstrap-icons"
import { actionGreen, clearColor } from "../../utilities/graphics";

interface ButtonTypeProps {
  type?: string;
}

interface CustomSubmitButtonProps {
  children: React.ReactNode;
  text: string;
}

// Form submit putton, enclose icon and pass text as a prop
const CustomSubmitButton = ({ children, text }: CustomSubmitButtonProps) => {
  return (
    <button type="submit" className="custom-button nowrap">
      {children}{text}
    </button>
  )
}

interface CustomLinkProps {
  children: React.ReactNode;
  text: string;
  url: string;
}

// Link button, enclose icon and pass url and text as props
const CustomLink = ({ children, text, url }: CustomLinkProps) => {
  return (
    <Link to={url} className="custom-button nowrap">
      {children}{text}
    </Link>
  )
}

interface CustomCheckboxProps {
  selected: boolean;
  onClick: React.MouseEventHandler;
}

// Radio button / checkbox
export const CustomCheckbox = ({ selected, onClick}: CustomCheckboxProps) => {
  if (selected) {
    return (
      <button type="button" className="custom-checkbox custom-checkbox-selected"
              name="check" onClick={onClick}><CircleFill />
      </button>
    )
  } else {
    return (
      <button type="button" className="custom-checkbox" name="check"
              onClick={onClick}><CircleFill />
      </button>
    )
  }
}

export const AboutButton = () => {
  return <CustomLink url="/about" text="about"><InfoCircle /></CustomLink>
}

export const ContactButton = () => {
  return <CustomLink url="/contact" text="contact us"><EnvelopeFill /></CustomLink>
}

interface CancelButtonProps {
  type?: string;
  url?: string;
}

export const CancelButton = ({ type, url }: CancelButtonProps) => {
  if (type === "submit") {
    return (
      <button type="submit" className="custom-button nowrap" name="cancel">
        <XCircle />cancel
      </button>
    )
  } else {
    return <CustomLink url={url ?? "/"} text="cancel"><XCircle /></CustomLink>
  }
}

export const ChatButton = () => {
  return <CustomSubmitButton text="chat"><ChatText /></CustomSubmitButton>
}

export const ChangePasswordButton = () => {
  return <CustomSubmitButton text="change password"><ShieldExclamation /></CustomSubmitButton>
}

export const ResetPasswordButton = () => {
  return <CustomSubmitButton text="reset password"><ArrowRepeat /></CustomSubmitButton>
}

export const DeleteButton = () => {
  return <CustomSubmitButton text="delete account"><Trash3 /></CustomSubmitButton>
}

export const LoginButton = ({ type }: ButtonTypeProps) => {
  if (type === "confirm") {
    return <CustomSubmitButton text="login"><BoxArrowInRight /></CustomSubmitButton>
  } else {
    return <CustomLink url="/login" text="login"><BoxArrowInRight /></CustomLink>
  }
}

export const LogoutButton = () => {
  return <CustomLink url="/logout" text="logout"><BoxArrowRight /></CustomLink>
}

export const CreateGameButton = ({ type }: ButtonTypeProps) => {
  if (type === "confirm") {
    return <CustomSubmitButton text="create new game"><Hexagon /></CustomSubmitButton>
  } else {
    return <CustomLink url="/new_game" text="create new game"><Hexagon /></CustomLink>
  }
}

export const ScenariosButton = () => {
  return <CustomLink url="/new_game" text="scenarios"><Hexagon /></CustomLink>
}

export const ProfileButton = () => {
  return <CustomLink url={`/profile/${localStorage.getItem("username")}`} text="profile"><Person /></CustomLink>
}

export const RecoverAccountButton = ({ type }: ButtonTypeProps) => {
  if (type === "confirm") {
    return <CustomSubmitButton text="send code"><ArrowRepeat /></CustomSubmitButton>
  } else {
    return <CustomLink url="/recover_account" text="recover account"><ArrowRepeat /></CustomLink>
  }
}

export const ReturnButton = () => {
  return <CustomLink url="/" text="main page"><Hexagon /></CustomLink>
}

export const SendNewCodeButton = () => {
  return <CustomSubmitButton text="send new code"><ArrowRepeat /></CustomSubmitButton>
}

export const SignupButton = ({ type }: ButtonTypeProps) => {
  if (type === "confirm") {
    return <CustomSubmitButton text="sign up"><PencilSquare /></CustomSubmitButton>
  } else {
    return <CustomLink url="/signup" text="sign up"><PencilSquare /></CustomLink>
  }
}

export const UpdateInfoButton = () => {
  return <CustomSubmitButton text="update account"><Person /></CustomSubmitButton>
}

export const ContactSendButton = () => {
  return <CustomSubmitButton text="send feedback"><EnvelopeFill /></CustomSubmitButton>
}

export const VerifyButton = () => {
  return <CustomSubmitButton text="verify"><Check2Square /></CustomSubmitButton>
}

export const AboutHelpButton = (text?: string) => {
  return (
    <Link to={"/help"} className="custom-button custom-button-balance nowrap">
      <QuestionCircle /> {text}
    </Link>
  )
}

export const FireGlyph = () => {
  return <Crosshair />
}

export const FireIntenseGlyph = () => {
  return <Crosshair2 />
}

export const MoveGlyph = () => {
  return <ArrowsMove />
}

export const MoveRushGlyph = () => {
  return <ArrowsCollapseVertical />
}

export const RoutGlyph = () => {
  return <ArrowsExpandVertical />
}

export const FinishGlyph = () => {
  return <CheckLg />
}

export const CancelGlyph = () => {
  return <Ban />
}

export const DiceGlyph = () => {
  return <Dice6 />
}

export const EliminateGlyph = () => {
  return <XSquare />
}

export const NavUp = (fill: boolean) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
      <path d="M 1 23 L 12 9 L 23 23 Z" style={{
        strokeWidth: 2, stroke: actionGreen(),
        fill: fill ? actionGreen() : clearColor
      }} />
    </svg>
  )
}

export const NavDown = (fill: boolean) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em">
      <path d="M 1 1 L 12 15 L 23 1 Z" style={{
        strokeWidth: 2, stroke: actionGreen(),
        fill: fill ? actionGreen() : clearColor
      }} />
    </svg>
  )
}
