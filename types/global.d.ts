declare module "next" {
  export type Metadata = {
    title?: string | { default: string; template: string };
    description?: string;
    keywords?: string[] | string;
    icons?: any;
    openGraph?: any;
    twitter?: any;
    [key: string]: any;
  };
  export type ResolvingMetadata = Promise<any>;
  export type ResolvingViewport = Promise<any>;
}

declare module "next/font/google" {
  export const Fraunces: (options?: any) => { className: string; variable: string; style: any };
  export const Inter: (options?: any) => { className: string; variable: string; style: any };
  export const IBM_Plex_Mono: (options?: any) => { className: string; variable: string; style: any };
  export const Roboto: (options?: any) => { className: string; variable: string; style: any };
}

declare module "next/types.js" {
  export type ResolvingMetadata = Promise<any>;
  export type ResolvingViewport = Promise<any>;
}

declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  export type ResolvingMetadata = Promise<any>;
  export type ResolvingViewport = Promise<any>;
}
