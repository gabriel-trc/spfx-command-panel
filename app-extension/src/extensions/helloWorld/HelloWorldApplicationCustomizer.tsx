import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useId, useBoolean } from '@fluentui/react-hooks';
import { getTheme, mergeStyleSets, FontWeights, ContextualMenu, Toggle, Modal, IDragOptions, IIconProps, Stack, IStackProps, DefaultButton, IconButton, IButtonStyles, ThemeProvider, initializeIcons } from '@fluentui/react';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { SPEventArgs } from '@microsoft/sp-core-library';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'HelloWorldApplicationCustomizerStrings';

const LOG_SOURCE: string = 'HelloWorldApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IHelloWorldApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class HelloWorldApplicationCustomizer
  extends BaseApplicationCustomizer<IHelloWorldApplicationCustomizerProperties> {
  @override
  public onInit(): Promise<void> {

    console.log(`LCEVENT:onInit=${window.location.href}`);

    if (!(window as any).isNavigatedEventSubscribed) {

      this.context.application.navigatedEvent.add(this, this.logNavigatedEvent);

      (window as any).isNavigatedEventSubscribed = true;
    }

    return Promise.resolve();
  }

  @override
  public onDispose(): Promise<void> {

    console.log(`LCEVENT:onDispose=${window.location.href}`);

    this.context.application.navigatedEvent.remove(this, this.logNavigatedEvent);

    (window as any).isNavigatedEventSubscribed = false;
    (window as any).currentPage = '';

    return Promise.resolve();
  }

  public logNavigatedEvent(args: SPEventArgs): void {

    setTimeout(() => {
      if (!document.getElementById('content'))
        aux()
      if ((window as any).currentPage !== window.location.href) {
        // REGISTER PAGE VIEW HERE >>>
        console.log(`LCEVENT:navigatedEvent=${window.location.href}`);

        (window as any).currentPage = window.location.href;
      } else {
        console.log(`LCEVENT: not navigatedEvent=${window.location.href}`);
      }
    }, 500);
  }

}

function aux() {

  let my_awesome_script = document.createElement('script');
  my_awesome_script.setAttribute('src', 'https://5mkhk5.sharepoint.com/sites/dev/SiteAssets/MVD.DataSources/index.js');
  document.head.appendChild(my_awesome_script);

  let div = document.createElement('div')
  div.id = 'content'
  document.querySelector('div[class="od-ItemsScopeList-content"]').append(div)

  // Initialize icons in case this example uses them
  initializeIcons();

  const ModalBasicExample: React.FunctionComponent = () => {
    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);

    // Use useId() to ensure that the IDs are unique on the page.
    // (It's also okay to use plain strings and manually ensure uniqueness.)
    const titleId = useId('title');

    return (
      <div>
        <DefaultButton onClick={showModal} text="Open Modal" />
        <Modal
          titleAriaId={titleId}
          isOpen={isModalOpen}
          onDismiss={hideModal}
          isBlocking={false}
          containerClassName={contentStyles.container}
        >
          <div className={contentStyles.header}>
            <span id={titleId}>Lorem Ipsum</span>
            <IconButton
              styles={iconButtonStyles}
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={hideModal}
            />
          </div>
          <div className={contentStyles.body}>
            <div id='contentBoxWrapper'></div>
          </div>
        </Modal>
      </div>
    );
  };

  const cancelIcon: IIconProps = { iconName: 'Cancel' };

  const theme = getTheme();
  const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
    },
    header: [
      // eslint-disable-next-line deprecation/deprecation
      theme.fonts.xLargePlus,
      {
        flex: '1 1 auto',
        borderTop: `4px solid ${theme.palette.themePrimary}`,
        color: theme.palette.neutralPrimary,
        display: 'flex',
        alignItems: 'center',
        fontWeight: FontWeights.semibold,
        padding: '12px 12px 14px 24px',
      },
    ],
    body: {
      flex: '4 4 auto',
      padding: '0 24px 24px 24px',
      overflowY: 'hidden',
      selectors: {
        p: { margin: '14px 0' },
        'p:first-child': { marginTop: 0 },
        'p:last-child': { marginBottom: 0 },
      },
    },
  });
  const stackProps: Partial<IStackProps> = {
    horizontal: true,
    tokens: { childrenGap: 40 },
    styles: { root: { marginBottom: 20 } },
  };
  const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
  };

  const ModalBasicExampleWrapper = () => <ThemeProvider><ModalBasicExample /></ThemeProvider>;
  ReactDOM.render(<ModalBasicExampleWrapper />, document.getElementById('content'));
}

