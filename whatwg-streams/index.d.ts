export interface ReadableByteStreamController {
  // constructor(stream, underlyingSource, size, highWaterMark)
  readonly desiredSize: number;
  close(): any;
  enqueue(chunk: any): any;
  error(error: any): any;
}

export interface ReadableStreamDefaultController {
  // constructor(stream, underlyingByteSource, highWaterMark)
  readonly byobRequest: any;
  readonly desiredSize: number;
  close(): any;
  enqueue(chunk: any): any;
  error(error: any): any;
}

export type ReadableStreamController =
  ReadableStreamDefaultController | ReadableByteStreamController;

export interface ReadableStreamDefaultReader {
  // constructor(stream)
  readonly closed: Promise<any>;
  cancel(reason: any): Promise<any>;
  read(): Promise<any>;
  releaseLock(): void;
}

export interface ReadableStreamBYOBReader {
  readonly closed: Promise<any>;
  cancel(reason: any): Promise<any>;
  read(view: any): Promise<any>; // ArrayBuffer.isView(view) === true && view.byteLength > 0
  releaseLock(): void;
}

export type ReadableStreamReader =
  ReadableStreamDefaultReader | ReadableStreamBYOBReader;

export interface Source {
  type?: 'bytes' | undefined;
  start?(controller: ReadableStreamController): Promise<any> | any | void;
  pull?(controller: ReadableStreamController): Promise<any> | any | void;
  cancel?(reason: any): Promise<any> | any | void;
}

export interface QueuingStrategy {
  size?: (chunk: any) => number;
  readonly highWaterMark?: number;
}

export declare class ByteLengthQueuingStrategy
  implements QueuingStrategy {
  constructor({ highWaterMark }: { highWaterMark: number; });
  size: (chunk: { byteLength: number; }) => number;
  readonly highWaterMark: number;
}

export declare class CountQueuingStrategy
  implements QueuingStrategy {
  constructor({ highWaterMark }: { highWaterMark: number; });
  size: (chunk: any) => number;
  readonly highWaterMark: number;
}

export declare class ReadableStream {
  constructor(
    underlyingSource?: Source,
    options?: QueuingStrategy
  );
  readonly locked: boolean;
  cancel(reason: any): Promise<any>;
  getReader(options?: { mode?: string; }): ReadableStreamReader;
  pipeThrough(
    transform: { writable: WritableStream; readable: ReadableStream; },
    options?: {
      preventClose?: boolean;
      preventAbort?: boolean;
      preventCancel?: boolean;
    }
  ): ReadableStream;
  pipeTo(
    dest: WritableStream,
    options?: {
      preventClose?: boolean;
      preventAbort?: boolean;
      preventCancel?: boolean;
    }
  ): Promise<any>;
  tee(): [ReadableStream, ReadableStream];
}

export interface Writer {
  // constructor(stream)
  readonly closed: boolean;
  readonly desiredSize: number;
  readonly ready: boolean;

  abort(reason: any): any;
  close(): any;
  releaseLock(): any;
  write(chunk: any): any;
}

export class TransformStream {
  constructor(transformer: {
    start?(
      enqueue: Function, close: Function, error: Function
    ): any,
    transform?(
      chunk: any,
      done: Function,
      enqueue: Function,
      close: Function,
      error: Function
    ): any,
    flush?(
      enqueue: Function, close: Function, error: Function
    ): any
  });
  readable: ReadableStream;
  writable: WritableStream;
}

export interface WritableStreamDefaultController {
  // constructor(stream, underlyingSink, size, highWaterMark)
  error(error: any): any;
}

export type WritableStreamController =
  WritableStreamDefaultController;

export interface Sink {
  start?(controller: WritableStreamController): Promise<any> | any | void;
  write?(chunk: any): Promise<any> | any | void;
  close?(): Promise<any> | any | void;
  abort?(reason: any): Promise<any> | any | void;
}

export declare class WritableStream {
  constructor(underlyingSink?: Sink);
  // constructor(underlyingSink = {}, { size, highWaterMark = 1 } = {})
  readonly locked: boolean;
  abort(reason: any): Promise<any>;
  getWriter(): Writer;
}
