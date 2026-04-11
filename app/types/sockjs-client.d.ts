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

    onopen: ((ev?: Event) => void) | null;
    onclose: ((ev?: CloseEvent) => void) | null;
    onmessage: ((ev?: { data: unknown }) => void) | null;
    onerror: ((ev?: Event) => void) | null;

    close(code?: number, reason?: string): void;
    send(data: string | ArrayBuffer | Blob): void;
    readyState: number;

    static CLOSED: number;
    static CLOSING: number;
    static CONNECTING: number;
  }

  export default SockJS;
}