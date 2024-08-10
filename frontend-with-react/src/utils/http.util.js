import cloneDeep from "lodash/cloneDeep"
import qs from 'qs'

const API_URL = import.meta.env.VITE_API_URL

export const post = async (url, data) => {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    method: "POST",
    body: data && JSON.stringify(data)
  })
  return await handleResponse(response)
}

export const put = async (url, data) => {
  const response = await fetch(`${API_URL}${url}`, {
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    method: "PUT",
    body: data && JSON.stringify(data)
  })
  return await handleResponse(response)
}

export const get = async (url, data) => {
  const formatUrl = data
    ? `${API_URL}${url}?${getStringParams(data)}`
    : url
  const response = await fetch(formatUrl, {
    headers: {},
    method: "GET"
  })
  return await handleResponse(response)
}

export const remove = async (url, data) => {
  const formatUrl = data
    ? `${API_URL}${url}?${getStringParams(data)}`
    : url
  const response = await fetch(formatUrl, {
    headers: {},
    method: "DELETE"
  })
  return await handleResponse(response)
}

export const upload = async (url, file) => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await fetch(`${API_URL}${url}`, {
    headers: {},
    method: "POST",
    body: formData
  })
  return await handleResponse(response)
}

const getStringParams = (params) => {
  const paramsCopy = cloneDeep(params)
  for (let key in paramsCopy) {
    if (paramsCopy[key] === "" || paramsCopy[key] === undefined) {
      paramsCopy[key] = null
    }
  }
  return qs.stringify(paramsCopy, { skipNulls: true })
}

export async function handleResponse(response) {
  const resData = await response.json()
  return resData
}
