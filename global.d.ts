// global.d.ts

// Tell TypeScript that it is completely fine to import this specific CSS file
declare module 'react-quill/dist/quill.snow.css' {
  const content: any;
  export default content;
}

// You can also add a catch-all for any future CSS module imports just in case!
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}