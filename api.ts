import fetch from 'isomorphic-fetch'

export function api<T>(url: string, options: RequestInit): Promise<T> {
  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        console.error(response)
        throw new Error(response.statusText)
      }
      return response.json().then(data => data as T);
    })
}