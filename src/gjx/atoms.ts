import { atom } from "recoil";

export const imagesState = atom<{ [key: string]: string }>({
  default: {},
  key: 'images',
});
