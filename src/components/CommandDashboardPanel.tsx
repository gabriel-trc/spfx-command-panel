import React from 'react';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

import { useBoolean } from '@fluentui/react-hooks';


const buttonStyles = { root: { marginRight: 8 } };
const panelType = Number(PanelType.extraLarge)

const CommandDashboardPanel: React.FunctionComponent = () => {
  
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(true);

  // This panel doesn't actually save anything; the buttons are just an example of what
  // someone might want to render in a panel footer.
  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton onClick={dismissPanel} styles={buttonStyles}>
          Save
        </PrimaryButton>
        <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
      </div>
    ),
    [dismissPanel],
  );

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={dismissPanel}
      headerText="Panel with footer at bottom"
      closeButtonAriaLabel="Close"
      onRenderFooterContent={onRenderFooterContent}
      type={panelType}
      // Stretch panel content to fill the available height so the footer is positioned
      // at the bottom of the page
      isFooterAtBottom={true}
    >
      <p>Content goes here.</p>
    </Panel>
  );
};

export default CommandDashboardPanel