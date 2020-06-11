import http from "axios";
export const getData = (params: any, url: string): Promise<any> => {
    return http.get(url, { params: params }).then((res: any) => res.data);
};

export const postDataFile = (url:string,params:any,body:any):Promise<any>=>{
    return http.post(url,body,{params:params}).then((res: any) => res.data)
}
