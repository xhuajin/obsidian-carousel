import { App, PluginSettingTab, Setting } from "obsidian";

import Sample from "./main";

export interface SampleSettings {
  asetting: string;
}

export const DEFAULT_SETTINGS: SampleSettings = {
  asetting: "default",
}

export class SampleSettingTab extends PluginSettingTab {
  plugin: Sample;
  
  constructor(app: App, plugin: Sample) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this
    containerEl.empty()

    new Setting(containerEl)
      .setName("A Setting");
  }
}