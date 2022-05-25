export enum REQUEST_TYPE {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
}

const resolveResponse = (res: Response) => {
    if (res.status >= 200 && res.status < 300) {
        return res.json()
    } else {
        let err = new Error(res.statusText)
        //   err.response = res
        throw err
    }
}
export const request = <ResultType>(url: string, type: REQUEST_TYPE = REQUEST_TYPE.GET): Promise<ResultType> => {
    return fetch(url,
        {
            method: type,
        // body: new FormData(form), // post body
        // body: JSON.stringify(...),
        // headers: {
        //   'Accept': 'application/json'
        // },
        //     credentials: 'same-origin', // send cookies
        //     credentials: 'include',     // send cookies, even in CORS
        }
    ).then(resolveResponse)
}

export const toFirstUpperCase = (string: string) => `${string[0].toUpperCase()}${string.slice(1)}`;
