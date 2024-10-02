import { IconName, ItemView, WorkspaceLeaf } from "obsidian"

import CarouselPlugin from "./main";
import { showConfiguration } from "./utils";

export const CAROUSEL_VIEW_TYPE = "carousel-configurations-view";

export class CarouselConfigurationsView extends ItemView {
  plugin: CarouselPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: CarouselPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return CAROUSEL_VIEW_TYPE;
  }

  getDisplayText() {
    return "Carousel Configurations";
  }

  getIcon(): IconName {
    return "gallery-thumbnails";
  }

  async onOpen() {
    const { contentEl } = this;
    showConfiguration(contentEl);
  }
}
