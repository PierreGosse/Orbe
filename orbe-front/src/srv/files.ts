import type { IStructure, IPage, IIndexRule } from 'orbe-common'

const URL = '/api'

export const Struct = {
  getStruct: async (): Promise<IStructure> => {
    const resp = await window.fetch(URL + "/struct", {
      method: 'GET',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
    const tps = await resp.json()
    return tps
  },

  addStruct: async (name: string): Promise<IStructure> => {
    const resp = await window.fetch(URL + "/struct/add", {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ name })
    })
    const tps = await resp.json()
    return tps
  },

  delStruct: async (name: string): Promise<IStructure> => {
    const resp = await window.fetch(URL + "/struct/del", {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ name })
    })
    const tps = await resp.json()
    return tps
  },

  listPages: async (name: string): Promise<string[]> => {
    const resp = await window.fetch(URL + "/struct/list", {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ name })
    })
    const tps = await resp.json()
    return tps
  }
}
export const Page = {
  get: async (struct: string, page: string): Promise<IPage> => {
    const resp = await window.fetch(URL + "/page/", {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ struct, page })
    })
    const pg = await resp.json()
    return pg
  },

  save: async (page: IPage) => {
    const resp = await window.fetch(URL + "/page/save", {
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(page)
    })
    const pg = await resp.json()
    return pg
  }
}
export const Index = {
  getRules: async () => {
    const resp = await window.fetch(URL + "/index/", {
      method: 'GET',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
    const pg = await resp.json()
    return pg as IIndexRule[]
  }
}