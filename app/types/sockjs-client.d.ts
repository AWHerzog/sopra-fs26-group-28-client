declare module 'sockjs-client' {
  interface SockJSOptions {
    server?: string;
    transports?: string[];
    devel?: boolean;
    debug?: boolean;
    protocols?: string | string[];
    sessionId?: string;
  }

  class SockJS {
    constructor(url: string, _reserved?: string, options?: SockJSOptions);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onopen: ((ev?: Event) => any) | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onclose: ((ev?: CloseEvent) => any) | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onmessage: ((ev?: { data: any }) => any) | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onerror: ((ev?: Event) => any) | null;

    close(code?: number, reason?: string): void;
    send(data: string | ArrayBuffer | Blob): void;
    readyState: number;

    static CLOSED: number;
    static CLOSING: number;
    static CONNECTING: number;
  }

  export default SockJS;
}