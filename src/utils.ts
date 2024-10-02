import { App, Setting, TFile, TextComponent } from "obsidian";
import { AxisDirectionOptionType, AxisOptionType } from "embla-carousel/components/Axis";

import { AlignmentOptionType } from "embla-carousel/components/Alignment";
import { CarouselOptions } from "./types";

export function parseSource(app: App, source: string): CarouselOptions {
  const configs: string[] = source.split("\n");
  const carouseloptions: CarouselOptions = { options: {}, slides: [] };
  configs.forEach((config) => {
    if (!config) {
      return;
    }
    const [key, value] = config.split(":");
    if (config.trim() !== null && key.trim() !== null && value.trim() !== null) {
      switch (key.toLowerCase()) {
        case "folder":
          {
            const folder = app.vault.getFolderByPath(value.trim());
            if (folder !== null) {
              carouseloptions.slides.push(...folder.children.filter(child => {
                return child instanceof TFile && (['png', 'jpg', 'jpeg', 'webp'].includes(child.extension));
              }).map(image => {
                const path = app.vault.adapter.getResourcePath(image.path);
                if (path !== null && !(path in carouseloptions.slides)) {
                  return path;
                }
              }));
            }
          }
          break;
        case "folders":
          {
            const folders = value.split(",");
            folders.forEach((fp) => {
              const folder = app.vault.getFolderByPath(fp.trim());
              if (folder !== null) {
                carouseloptions.slides.push(...folder.children.filter(child => {
                  return child instanceof TFile && (['png', 'jpg', 'jpeg', 'webp'].includes(child.extension));
                }).map(image => {
                  return app.vault.adapter.getResourcePath(image.path);
                }));
              }
            });
          }
          break;
        case "images":
          carouseloptions.slides.push(...value.split(",").map((url) => {
            return app.vault.adapter.getResourcePath(url.trim());
          }));
          break;
        case "height":
          carouseloptions.height = value.trim();
          break;
        case "loop":
          carouseloptions.options.loop = value.trim() === "true";
          break;
        case "direction":
          carouseloptions.options.direction = value.trim() as AxisDirectionOptionType;
          break;
        case "slidessize":
          carouseloptions.slidessize = value.trim();
          break;
        case "slidesToScroll":
          carouseloptions.options.slidesToScroll = value.trim() === "auto" ? 'auto' : parseInt(value.trim());
          break;
        case "dragfree":
          carouseloptions.options.dragFree = value.trim() === "true";
          break;
        case "align":
          carouseloptions.options.align = value.trim() as AlignmentOptionType;
          break;
        case "axis":
          carouseloptions.options.axis = value.trim() as AxisOptionType;
          break;
        case "autoplay":
          carouseloptions.autoplay = value.trim() === "true";
          break;
        case "autoscroll":
          carouseloptions.autoscroll = value.trim() === "true";
          break;
        case "fade":
          carouseloptions.fade = value.trim() === "true";
          break;
        case "thumb":
          carouseloptions.thumb = value.trim() === "true";
      }
    }
  });
  return carouseloptions;
}

export function optionsToDisplayString(options: CarouselOptions): string {
  let result = '';
  Object.entries(options).forEach(([key, value]) => {
    if (key === 'options') {
      Object.entries(value).forEach(([key, value]) => {
        if (String(value) !== '') {
          result += `${key}: ${value}\n`;
        }
      });
    } else if (value !== '') {
      result += `${key}: ${value}\n`;
    }
  });
  return result;
}

export function showConfiguration(containerEl: HTMLElement): void {
  const configurationContainerEl = containerEl.createDiv({ cls: 'carousel-configuration-container' });

  new Setting(configurationContainerEl)
    .setHeading()
    .setName('Necessary configuration')
    .setDesc('You must provide at least one of the following configurations.');

  new Setting(configurationContainerEl)
    .setName('Folder/Folders')
    .setDesc(
      createFragment(el => {
        el.appendText('Folder to images. Example: ');
        el.createEl('br');
        el.appendText('Folder: path/to/folder');
        el.createEl('br');
        el.appendText('Folders: folder1, folder2 (folders split by comma)');
      }))
    .addText((text) => {
      text.setValue('Folder: path/to/folder');
    });

  new Setting(configurationContainerEl)
    .setName('Image/Images')
    .setDesc(
      createFragment(el => {
        el.appendText("Image's path. Example: ");
        el.createEl('br');
        el.appendText('Image: path/to/image.png');
        el.createEl('br');
        el.appendText('Images: image1.png, image2.png (images split by comma)');
      }))
    .addText((text) => {
      text.setValue('Image: path/to/image.png');
    });

  new Setting(configurationContainerEl)
    .setHeading()
    .setName('Optional configuration')
    .setDesc('You can provide the following configurations.');

  new Setting(configurationContainerEl)
    .setName('Height')
    .setDesc('The height of the carousel. Example: 25rem, 100%')
    .addText((text) => {
      text.setValue('Height: 100%');
    });

  const loopSetting = new Setting(configurationContainerEl)
    .setName('Loop')
    .setDesc('Loop the carousel infinitely.')
    .addDropdown((dropdown) => {
      dropdown
        .addOption('true', 'true')
        .addOption('false', 'false')
        .onChange((value) => {
          (loopSetting.components[1] as TextComponent).setValue(`Loop: ${value}`);
        });
    })
    .addText((text: TextComponent) => {
      text.setValue('Loop: true');
    });

  const dirSetting = new Setting(configurationContainerEl)
    .setName('Direction')
    .setDesc('The direction of the carousel. "ltr" for left to right and "rtl" for right to left.')
    .addDropdown((dropdown) => {
      dropdown
        .addOption('ltr', 'ltr')
        .addOption('rtl', 'rtl')
        .onChange((value) => {
          (dirSetting.components[1] as TextComponent).setValue(`Direction: ${value}`);
        });
    })
    .addText((text: TextComponent) => {
      text.setValue('Direction: ltr');
    })
  new Setting(configurationContainerEl)
    .setName('Slides Size')
    .setDesc('The size of the slides.')
    .addText((text) => {
      text.setValue('slidessize: 100%');
    });

  const dragfreeSetting = new Setting(configurationContainerEl)
    .setName('Drag Free')
    .addDropdown((dropdown) => {
      dropdown
        .addOption('true', 'true')
        .addOption('false', 'false')
        .onChange((value) => {
          (dragfreeSetting.components[1] as TextComponent).setValue(`Dragfree: ${value}`);
        });
    })
    .addText((text) => {
      text.setValue('Dragfree: true');
    })

  const alignSetting = new Setting(configurationContainerEl)
    .setName('Align')
    .setDesc('The alignment of the image.')
    .addDropdown((dropdown) => {
      dropdown
        .addOption('center', 'center')
        .addOption('start', 'start')
        .addOption('end', 'end')
        .onChange((value) => {
          (alignSetting.components[1] as TextComponent).setValue(`Align: ${value}`);
        });
    })
    .addText((text) => {
      text.setValue('Align: center');
    });

  const axisSetting = new Setting(configurationContainerEl)
    .setName('Axis')
    .addDropdown((dropdown) => {
      dropdown
        .addOption('x', 'x')
        .addOption('y', 'y')
        .onChange((value) => {
          (axisSetting.components[1] as TextComponent).setValue(`Axis: ${value}`);
        });
    })
    .addText((text) => {
      text.setValue('Axis: x');
    });

  const fadeSetting = new Setting(configurationContainerEl)
    .setName('Fade')
    .addDropdown((dropdown) => {
      dropdown
        .addOption('false', 'false')
        .addOption('true', 'true')
        .onChange((value) => {
          (fadeSetting.components[1] as TextComponent).setValue(`Fade: ${value}`);
        });
    })
    .addText((text) => {
      text.setValue('Fade: false');
    });

  new Setting(configurationContainerEl)
    .setHeading()
    .setName('Auto')
    .setDesc('You can only choose autoplay or autoscroll in your carousel.');

  const autoplaySetting = new Setting(configurationContainerEl)
    .setName('Autoplay')
    .setDesc('Autoplay the carousel. If true, the carousel will auto play every 3s.')
    .addDropdown((dropdown) => {
      dropdown
        .addOption('true', 'true')
        .addOption('false', 'false')
        .onChange((value) => {
          (autoplaySetting.components[1] as TextComponent).setValue(`Autoplay: ${value}`);
        });
    })
    .addText((text) => {
      text.setValue('Autoplay: true');
    });

  const autoscrollSetting = new Setting(configurationContainerEl)
    .setName('Autoscroll')
    .setDesc('Autoscroll the carousel. If true, the carousel will auto scroll every 3s.')
    .addDropdown((dropdown) => {
      dropdown
        .addOption('true', 'true')
        .addOption('false', 'false')
        .onChange((value) => {
          (autoscrollSetting.components[1] as TextComponent).setValue(`Autoscroll: ${value}`);
        });
    })
    .addText((text) => {
      text.setValue('Autoscroll: true');
    });
}