import { App, PluginSettingTab, Setting } from "obsidian";

import CarouselPlugin from "./main";

export interface CarouselPluginSettings {
  showArrowButtons: boolean;
}

export const DEFAULT_SETTINGS: CarouselPluginSettings = {
  showArrowButtons: true,

}

export class CarouselPluginSettingTab extends PluginSettingTab {
  plugin: CarouselPlugin;

  constructor(app: App, plugin: CarouselPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this
    containerEl.empty()

    new Setting(containerEl)
      .setName("Show Switch Arrow")
      .setDesc("Show the switch arrow in the carousel. Don't set 'dragfree: false' at the same time.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showArrowButtons)
          .onChange(async (value) => {
            this.plugin.settings.showArrowButtons = value;
            await this.plugin.saveSettings();
          })
      );
  }
}