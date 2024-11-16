// src/images.d.ts
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }
