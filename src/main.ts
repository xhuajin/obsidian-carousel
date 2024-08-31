import { AxisDirectionOptionType, AxisOptionType } from "embla-carousel/components/Axis";
import { Plugin, TFile } from "obsidian";

import { AlignmentOptionType } from "embla-carousel/components/Alignment";
import EmblaCarousel from "./ui/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";
import React from "react";
import { createRoot } from 'react-dom/client';

export default class CarouselPlugin extends Plugin {

  async onload(): Promise<void> {

    this.registerMarkdownCodeBlockProcessor("carousel", (source, el, ctx) => {
      const { OPTIONS, SLIDES, AUTOPLAY, AUTOSCROLL, FADE } = this.parseSource(source, el);

      const carousel = React.createElement(EmblaCarousel, {
        slides: SLIDES,
        options: OPTIONS,
        autoplay: AUTOPLAY,
        autoscroll: AUTOSCROLL,
        fade: FADE,
      });

      // 渲染到 DOM
      createRoot(el).render(carousel);
    });
  }

  parseSource(source: string, el: HTMLElement): {
    OPTIONS: EmblaOptionsType,
    SLIDES: string[],
    AUTOPLAY: boolean,
    AUTOSCROLL: boolean,
    FADE: boolean
  } {
    const option: EmblaOptionsType = {};
    const configs = source.split("\n");
    const SLIDES: string[] = [];
    let autoplay = false;
    let autoscroll = false;
    let fade = false;
    configs.forEach((config) => {
      const [key, value] = config.split(":");
      switch (key.toLowerCase()) {
        case "folder":
          {
            const folder = this.app.vault.getFolderByPath(value.trim());
            if (folder !== null) {
              SLIDES.push(...folder.children.filter(child => {
                return child instanceof TFile && (child.extension === 'png' || child.extension === 'jpg');
              }).map(image => {
                return this.app.vault.adapter.getResourcePath(image.path);
              }));
            }
          }
          break;
        case "images":
          SLIDES.push(...value.split(",").map((url) => {
            return this.app.vault.adapter.getResourcePath(url.trim());
          }));
          break;
        case "loop":
          option.loop = value.trim() === "true";
          break;
        case "direction":
          option.direction = value.trim() as AxisDirectionOptionType;
          break;
        case "slidessize":
          el.style.setProperty("--slide-size", value.trim());
          break;
        case "slidesToScroll":
          option.slidesToScroll = value.trim() === "auto" ? 'auto' : parseInt(value.trim());
          break;
        case "dragfree":
          option.dragFree = value.trim() === "true";
          break;
        case "align":
          option.align = value.trim() as AlignmentOptionType;
          break;
        case "axis":
          option.axis = value.trim() as AxisOptionType;
          break;
        case "autoplay":
          autoplay = value.trim() === "true";
          break;
        case "autoscroll":
          autoscroll = value.trim() === "true";
          break;
        case "fade":
          fade = value.trim() === "true";
          break;
      }
    });
    return { OPTIONS: option, SLIDES, AUTOPLAY: autoplay, AUTOSCROLL: autoscroll, FADE: fade };
  }
}