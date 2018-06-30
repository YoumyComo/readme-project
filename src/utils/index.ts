import {
  isFunction,
} from './types';

export const bindMethod = <T>(t: T, keys: (keyof T)[]): T => {
  keys.forEach(k => {
    const value = t[k];
    if (typeof value === 'function') {
      // tslint:disable-next-line:no-any
      t[k] = (value as any).bind(t);
    }
  })
  return t;
}

// tslint:disable:no-any
/**
 * 阻塞装饰器，必须等待上次返回的 Promise 运行完成之后，才会运行下一次
 * ```js
 * class Test {
 *   @block
 *   async log(v: number) {
 *     await sleep(2000);
 *     console.log(v);
 *   }
 * }
 *
 * const test = new Test();
 * test.log(1);
 * test.log(2);
 * // 等待 2000ms
 * // 1
 * // 等待 2000ms
 * // 2
 * ```
 */
export const block = (target: any, key: string, descriptor: PropertyDescriptor) => {
  target;
  key;
  const fn = descriptor.value;
  if (!isFunction(fn)) return descriptor;
  let promise: Promise<any> | null;
  descriptor.value = function (...args: Array<any>) {
    let lastPromise = promise;
    const next = () => {
      const result = fn.apply(this, args);
      if (result && isFunction(result.then)) {
        promise = result;
      } else {
        promise = null;
      }
      return result;
    }

    if (lastPromise) {
      return lastPromise
        .then(next, next);
    } else {
      next();
    }
  }

  return descriptor;
}

// tslint:disable:no-any
/**
 * 节流函数装饰器
 * @param timeout 设置节流超时时间
 */
export const throttle = (timeout: number) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const fn = target[key];
  let handlerTimer: number;
  if (!isFunction(fn)) return descriptor;
  descriptor.value = function (...args: any[]) {
    let handler = handlerTimer;
    if (handler) clearTimeout(handler);
    const newHandler = setTimeout(() => {
      fn.apply(this, args);
    }, timeout) as any;
    handlerTimer = newHandler;
  };
  return descriptor;
}
