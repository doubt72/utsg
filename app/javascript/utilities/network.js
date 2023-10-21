const fetchAPI = (url, verb, body, responseOptions) => {
  const token = document.querySelector('meta[name="csrf-token"]').content

  const options = {
    method: verb,
    headers: {
      "X-CSRF-Token": token,
      "Content-Type": "application/json",
    },
  }

  if (!["GET", "HEAD"].includes(verb)) {
    options.body = JSON.stringify(body)
  }

  fetch(url, options).then(response => {
    if (response.ok) {
      responseOptions.ok(response)
      return
    } else if (response.status === 401) {
      if (responseOptions.unauthorized !== undefined) {
        responseOptions.unauthorized(response)
        return
      }
    } else if (response.status === 403) {
      if (responseOptions.forbidden !== undefined) {
        responseOptions.forbidden(response)
        return
      }
    }
    if (responseOptions.other) {
      responseOptions.other(response)
      return
    }
    console.log(response.json()) // Something was probably called incorrectly
  }).catch(error => console.log(error.message))
}

const getAPI = (url, responseOptions) => {
  fetchAPI(url, "GET", {}, responseOptions)
}
  
const postAPI = (url, body, responseOptions) => {
  fetchAPI(url, "POST", body, responseOptions)
}

const putAPI = (url, body, responseOptions) => {
  fetchAPI(url, "PUT", body, responseOptions)
}

const deleteAPI = (url, responseOptions) => {
  fetchAPI(url, "DELETE", {}, responseOptions)
}

export { getAPI, postAPI, putAPI, deleteAPI }