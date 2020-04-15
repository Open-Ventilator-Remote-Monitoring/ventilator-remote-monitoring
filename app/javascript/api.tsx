// based on:  https://www.carlrippon.com/fetch-with-async-await-and-typescript/

interface ApiResponse<T> {
  // if true, there should be parsedBody. If false, there should be an errMsg
  ok: boolean
  response?: Response
  parsedBody?: T
  errMsg?: string
}

const getMsg = (ex): string => {
  ex = ex || "Unknown Exception"
  return ex.message ? ex.message : ex.toString()
}

export async function http<T>(request: RequestInfo): Promise<ApiResponse<T>> {
  let apiResponse: ApiResponse<T> = {
    ok: false
  }

  try {
    apiResponse.response = await fetch(request)
  } catch(ex) {
    apiResponse.errMsg = getMsg(ex)
    return apiResponse
  }

  if (!apiResponse.response.ok) {
    apiResponse.errMsg = apiResponse.response.statusText
    return apiResponse
  }

  try {
    // may error if there is no body
    apiResponse.parsedBody = await apiResponse.response.json()
  } catch(ex) {
    apiResponse.errMsg = getMsg(ex)
  }

  apiResponse.ok = true
  return apiResponse;
}

export async function get<T>(
  uri: string,
  args: RequestInit = {
    method: "get",
    headers: {
      "Accept": "application/json; charset=UTF-8"
    }
  }
): Promise<ApiResponse<T>> {
  let result = await http<T>(new Request(uri, args))
  return result
}

export async function post<T>(
  uri: string,
  body: any,
  args: RequestInit = { method: "post", body: JSON.stringify(body) }
): Promise<ApiResponse<T>>  {
  return await http<T>(new Request(uri, args));
}

export async function put<T>(
  uri: string,
  body: any,
  args: RequestInit = { method: "put", body: JSON.stringify(body) }
): Promise<ApiResponse<T>> {
  return await http<T>(new Request(uri, args));
}