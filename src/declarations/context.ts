export interface ServerRenderContext {
  url?: string,
  dependences: { [k: string]: boolean }
  serverRending: boolean,
}
