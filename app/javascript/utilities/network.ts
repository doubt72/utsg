type HTTPVerb = "GET" | "POST" | "PUT" | "DELETE"

type HTTPResponses = {
  ok: (response: Response) => void;
  unauthorized?: (response: Response) => void;
  forbidden?: (response?: Response) => void;
  other?: (response: Response) => void;
}

type FetchOptions = {
  method: string;
  headers: {
    "X-CSRF-Token"?: string,
    "Content-Type": string
  };
  body?: string;
}

function fetchAPI(url: string, verb: HTTPVerb, body: object, responseOptions: HTTPResponses): void {
  // This is janky AF, but the typing doesn't match the behavior:
  const token = (document.querySelector('meta[name="csrf-token"]') as unknown as {content: string}).content

  const options: FetchOptions = {
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
      if (responseOptions.unauthorized) {
        responseOptions.unauthorized(response)
        return
      }
    } else if (response.status === 403) {
      if (responseOptions.forbidden) {
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

export function getAPI(url: string, responseOptions: HTTPResponses): void {
  fetchAPI(url, "GET", {}, responseOptions)
}
  
export function postAPI(url: string, body: object, responseOptions: HTTPResponses): void {
  fetchAPI(url, "POST", body, responseOptions)
}

export function putAPI(url: string, body: object, responseOptions: HTTPResponses): void {
  fetchAPI(url, "PUT", body, responseOptions)
}

export function deleteAPI(url: string, responseOptions: HTTPResponses): void {
  fetchAPI(url, "DELETE", {}, responseOptions)
}

// TODO: maybe move this to DB?
export const adminUsers = [
  "doubt72",
]