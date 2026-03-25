import React, { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../utilities/network";
import { ContactSendButton } from "./utilities/buttons";

export default function About() {
  const navigate = useNavigate()
  const [formInput, setFormInput] = useState({ subject: "", body: "" })
  const [formErrors, setFormError] = useState({ subject: "", body: "" })

  const anyEmpty = () => {
    if (formInput.subject === "") {
      validateForm("subject", "")
      return true
    } else if (formInput.body === "") {
      validateForm("body", "")
      return true
    }
    return false
  }

  const validateForm = (name: string, value: string) => {
    let subjectError = formErrors.subject
    let bodyError = formErrors.body

    if (name === "subject") {
      if (value === "") {
        subjectError = "subject must not be blank"
      } else {
        subjectError = ""
      }
    } else if (name === "body") {
      if (value === "") {
        bodyError = "body must not be blank"
      } else {
        bodyError = ""
      }
    }
    setFormError({
      subject: subjectError,
      body: bodyError,
    })
    return subjectError === "" && bodyError === ""
  }

  const onChange = (name: string, value: string) => {
    setFormInput({ ...formInput, [name]: value })
    validateForm(name, value)
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm("", "") || anyEmpty()) {
      return false
    } else {
      const body = {
        email: {
          subject: formInput.subject,
          body: formInput.body,
        }
      }

      postAPI("/api/v1/contact", body, {
        ok: () => {
          navigate("/about", { replace: true })
        },
        unauthorized: () => {
          setFormError({ subject: "", body: "something went wrong: unauthorized" })
        },
        forbidden: () => {
          setFormError({ subject: "", body: "something went wrong: forbidden" })
        },
        other: () => {
          setFormError({ subject: "", body: "something went wrong" })
        }
      })
    }
  }

  return (
    <div>
      <Header />
      <div className="standard-body">
        <div className="profile-form-wide mr05em">
          <div className="mb1em">
            If you&apos;d like to send any feedback to the management about anything (the site, scenarios,
            violations of the code of conduct, or any other topic relevant to the server), please use
            this form:
          </div>
          <form onSubmit={onSubmit}>
            <label className="form-label">subject</label>
            <input
              type="text"
              name="subject"
              value={formInput.subject}
              className="form-input"
              onChange={({ target }) => onChange(target.name, target.value)}
            />
            <div className="form-error-message">{formErrors.subject}</div>
            <label className="form-label">body</label>
            <textarea
              name="body"
              value={formInput.body}
              className="form-input-text"
              onChange={({ target }) => onChange(target.name, target.value)}
            />
            <div className="form-error-message">{formErrors.body}</div>
            <div className="align-end">
              <ContactSendButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
