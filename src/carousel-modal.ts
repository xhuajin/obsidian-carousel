import { App, Modal, Setting } from 'obsidian'

import { showConfiguration } from './utils';

export default class CarouselModal extends Modal {
  modal: Modal;
  configurationContainerEl: HTMLElement;

  constructor(app: App) {
    super(app);
    new Setting(this.titleEl)
      .setHeading()
      .setName("Carousel's available configuration table")
      .setDesc("The configuration namea are all case insensitive.");
    this.modalEl.classList.add('carousel-generator-modal');
    showConfiguration(this.contentEl);
  }
}
