import * as URL from 'url';
import {
  isString,
  isUndefined,
  isNumber,
} from '@src/utils/types';
import 'whatwg-fetch';

export interface RequestError extends Error {
  code: number,
  status: number,
};

interface FetchHeaders {
  append(name: string, value: string): void;

  delete(name: string): void;

  forEach(callback: ForEachCallback): void;

  get(name: string): string | null;

  has(name: string): boolean;

  set(name: string, value: string): void;
}

interface FetchResponse extends Object, Body {
  readonly body: ReadableStream | null;
  readonly headers: FetchHeaders;
  readonly ok: boolean;
  readonly status: number;
  readonly statusText: string;
  readonly type: ResponseType;
  readonly url: string;

  clone(): FetchResponse;
}

type Headers = {
  [k: string]: string,
}

type BaseOptions = {
  json?: true,
  headers?: Headers,
  url: URL.UrlObject,
}

export type Request<T> = ({
  method: 'POST' | 'PUT',
  body: T,
} & BaseOptions) | ({
  method?: 'GET'
} & BaseOptions);

export type Response<T1, T2> = {
  // tslint:disable-next-line:no-any
  body: any,
  data: T1,
  request: Request<T2>,
  status: number,
  response: FetchResponse,
};

export type Intercepter = {
  beforeRequest?<T1>(req: Request<T1>): Promise<Request<T1>> | Request<T1>,
  afterResponse?<T1, T2>(resp: Response<T1, T2> | NetError): Promise<Response<T1, T2>> | Response<T1, T2>,
}

export class NetError extends Error {
  // tslint:disable-next-line:no-any
  request?: Request<any>;
  response?: FetchResponse;
  status?: number;

  constructor(message: string,
              public code?: number,
              public type?: number,
              public show: boolean = false, ) {
    super(message);
  }
}

// tslint:disable-next-line:no-any
export function getData(body: any): any {
  if (!body) return null;
  if (body.error) {
    let msg: string;
    if (isString(body.error)) {
      msg = body.error;
    } else {
      msg = body.error.message || body.error.msg;
    }

    const error = new NetError(
      msg,
      body.code || body.error.code,
      body.type || body.error.type,
      body.show,
    );
    throw error;
  } else {
    const status = body.status;
    const code = body.code;
    if (isNumber(status) && status >= 400) {
      const error = new NetError(`request faild, status: ${status}`);
      error.status = status;
      throw error;
    }
    if (isNumber(code) && code >= 400) {
      throw new NetError(`request faild, code: ${code}`, code);
    }
  }

  return body.data || body;
}

export function checkResp(resp: FetchResponse) {
  if (resp.status >= 400) {
    const error = new NetError(`request faild, status: ${resp.status}`);
    error.status = resp.status;
    error.response = resp;
    throw error;
  }
}

export function makeHeaders(headers?: Headers): FetchHeaders {
  const h = new Headers();
  if (headers) {
    Object.keys(headers).forEach(k => {
      h.append(k, headers[k]);
    });
  }

  return h;
}

export default class Net {
  constructor(public intercepters: Intercepter[]) {
  }

  async beforeRequest<T>(request: Request<T>): Promise<Request<T>> {
    if (this.intercepters) {
      await this.intercepters.reduce((p, i) =>
          // tslint:disable-next-line:no-any
          p.then((): any => {
            if (i.beforeRequest) {
              return i.beforeRequest(request);
            }
            return null;
          })
          // tslint:disable-next-line:no-any
            .then((r: any) => {
              if (r) request = r;
            })
        , Promise.resolve());
    }
    return request;
  }

  // tslint:disable-next-line:no-any
  async afterResponse(response: Response<any, any> | NetError) {
    if (this.intercepters) {
      await this.intercepters.reduce((p, i) => {
        // tslint:disable-next-line:no-any
        return p.then((): any => {
          if (i.afterResponse) {
            return i.afterResponse(response);
          }
        })
      }, Promise.resolve());
    }
  }


  // tslint:disable-next-line:no-any
  async request<T1>(request: Request<any>): Promise<Response<T1, any>> {
    let body: string | null = null;
    const headers = request.headers || {};

    if (isUndefined(request.json)) {
      request.json = true;
      headers['Accept'] = 'application/json';
    }

    if (request.method === 'POST' || request.method === 'PUT') {
      if (isString(request.body)) {
        body = request.body;
      } else {
        try {
          body = JSON.stringify(request.body);
        } catch (e) {
          e.request = request;
          throw e;
        }
        headers['Content-Type'] = 'application/json';
      }
    }

    request = await this.beforeRequest(request);

    try {
      const resp = await fetch(URL.format(request.url), {
        method: request.method || 'GET',
        // tslint:disable-next-line:no-any
        headers: makeHeaders(headers) as any,
        credentials: 'same-origin',
        body,
      })
      checkResp(resp);
      // tslint:disable-next-line:no-any
      let respBody: any;
      try {
        // tslint:disable-next-line:no-any
        let data: any = null;
        if (request.json) {
          respBody = await resp.json();
          data = getData(respBody) as T1;
        } else {
          respBody = await resp.arrayBuffer();
        }

        const response = {
          body: respBody,
          data,
          request,
          response: resp,
          status: resp.status,
        }
        this.afterResponse(response);
        return response;
      } catch (e) {
        if (!(e instanceof NetError)) {
          e = new NetError(e.message);
        }
        e.response = resp;
        e.status = e.status || resp.status;
        this.afterResponse(e);
        throw e;
      }
    } catch (e) {
      console.log(e);
      if (!(e instanceof NetError)) {
        e = new NetError(e.message);
      }
      e.requet = request;
      this.afterResponse(e);
      throw e;
    }
  }
}
