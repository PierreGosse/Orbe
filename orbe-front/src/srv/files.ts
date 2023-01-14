import { IStructure } from 'orbe-common'

const URL = '/api'

export function getStruct(): IStructure {
  window.fetch(URL + "/getstruct", {
    method: 'GET',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
}