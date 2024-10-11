import { CAROUSEL_VIEW_TYPE, CarouselConfigurationsView } from "./configuration-view";
import { CarouselPluginSettings, DEFAULT_SETTINGS } from "./settings";
import { Plugin, WorkspaceLeaf } from "obsidian";

import CarouselModal from "./carousel-modal";
import EmblaCarousel from "./ui/EmblaCarousel";
import React from "react";
import { createRoot } from 'react-dom/client';
import { parseSource } from "./utils";

export default class CarouselPlugin extends Plugin {
  settings: CarouselPluginSettings;

  async onload() {
    this.registerMarkdownCodeBlockProcessor("carousel", (source, el, ctx) => {
      const carouseloptions = parseSource(this, source);
      const carousel = React.createElement(EmblaCarousel, carouseloptions);
      createRoot(el).render(carousel);
    });

    this.registerView(
      CAROUSEL_VIEW_TYPE,
      (leaf) => new CarouselConfigurationsView(leaf, this)
    );

    this.addCommand({
      id: 'carousel-configs-modal',
      name: 'Show Carousel Configs in Modal',
      callback: () => {
        new CarouselModal(this.app).open();
      },
    })

    this.addCommand({
      id: 'carousel-configs-view',
      name: 'Show Carousel Configs in View',
      callback: async () => {
        const { workspace } = this.app;

        let leaf: WorkspaceLeaf | null = null;
        const leaves = workspace.getLeavesOfType(CAROUSEL_VIEW_TYPE);

        if (leaves.length > 0) {
          leaf = leaves[0];
        } else {
          leaf = workspace.getRightLeaf(false);
          await leaf.setViewState({ type: CAROUSEL_VIEW_TYPE, active: true });
        }

        workspace.revealLeaf(leaf);
      },
    })
  }

  public async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  public async saveSettings() {
    await this.saveData(this.settings);
  }
}
