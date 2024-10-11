import { EmblaOptionsType } from "embla-carousel";

export interface CarouselOptions {
  options: EmblaOptionsType;
  slides: string[];
  folder?: string;
  folders?: string[];
  images?: string[];
  height?: string;
  slidessize?: string;
  autoplay?: boolean;
  autoscroll?: boolean;
  fade?: boolean;
  thumb?: boolean;
  arrawbutton?: boolean;
}

export const DEFAULT_CAROUSEL_OPTIONS: CarouselOptions = {
  options: {},
  slides: [],
  folder: "",
  folders: [],
  images: [],
  height: "25rem",
  slidessize: "100%",
  autoplay: false,
  autoscroll: false,
  fade: false,
  thumb: true,
  arrawbutton: true,
};