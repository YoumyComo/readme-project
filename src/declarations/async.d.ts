declare module '*.async' {
  const content: {
    // tslint:disable-next-line:no-any
    [k: string]: React.ComponentClass<any>
  }
  export default content;
}
