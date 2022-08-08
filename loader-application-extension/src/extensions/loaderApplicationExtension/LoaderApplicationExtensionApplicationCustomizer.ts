import { override } from '@microsoft/decorators'
import { a } from '../../../sharepoint/assets/files/test'
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'LoaderApplicationExtensionApplicationCustomizerStrings';

const LOG_SOURCE: string = 'LoaderApplicationExtensionApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ILoaderApplicationExtensionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class LoaderApplicationExtensionApplicationCustomizer
  extends BaseApplicationCustomizer<ILoaderApplicationExtensionApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {

    console.log(`LCEVENT:onInit=${window.location.href}`);
    let loaderManifestScript = document.createElement('script');
    loaderManifestScript.setAttribute('src', '/sites/dev/MVDAssets/updater/loader-versions-manifest-custom-action.js');
    loaderManifestScript.onload = () => {
      let loaderCustomActionScript = document.createElement('script');
      loaderCustomActionScript.setAttribute('src', '/sites/dev/MVDAssets/updater/loader-custom-action.js');
      document.head.appendChild(loaderCustomActionScript);
    };
    document.head.appendChild(loaderManifestScript);
    // if (!(window as any).isNavigatedEventSubscribed) {
    //   this.context.application.navigatedEvent.add(this, this.logNavigatedEvent);
    //   (window as any).isNavigatedEventSubscribed = true;
    // }
    a()
    return Promise.resolve();
  }

  // @override
  // public onDispose(): Promise<void> {

  //   console.log(`LCEVENT:onDispose=${window.location.href}`);

  //   this.context.application.navigatedEvent.remove(this, this.logNavigatedEvent);

  //   (window as any).isNavigatedEventSubscribed = false;
  //   (window as any).currentPage = '';

  //   return Promise.resolve();
  // }

  // public logNavigatedEvent(args: SPEventArgs): void {
  //   setTimeout(() => {
  //     if ((window as any).currentPage !== window.location.href) {
  //       // REGISTER PAGE VIEW HERE >>>
  //       console.log(`LCEVENT:navigatedEvent=${window.location.href}`);

  //       (window as any).currentPage = window.location.href;
  //     } else {
  //       console.log(`LCEVENT: not navigatedEvent=${window.location.href}`);
  //     }
  //   }, 500);
  // }
}
