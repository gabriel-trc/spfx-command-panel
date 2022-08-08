
import React from 'react';
import ReactDOM from 'react-dom';
import { override } from '@microsoft/decorators';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import CommandDashboardPanel from '../../components/CommandDashboardPanel';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICommandExtensionDashboardsCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
}

export default class CommandExtensionDashboardsCommandSet extends BaseListViewCommandSet<ICommandExtensionDashboardsCommandSetProperties> {
  private panelPlaceHolder: HTMLDivElement = null;

  @override
  public onInit(): Promise<void> {
    this.panelPlaceHolder = document.body.appendChild(document.createElement('div'));
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_DASHBOARD');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length === 0;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'COMMAND_DASHBOARD':
        //let selectedItem = event.selectedRows[0];
        //const listItemId = selectedItem.getValueByName('ID') as number;
        //const title = selectedItem.getValueByName("Title");
        this._showPanel(1, 'title');
        break;

      default:
        throw new Error('Unknown command');
    }
  }

  private _showPanel(itemId: number, currentTitle: string) {
    ReactDOM.render(<CommandDashboardPanel nodeContainer={this.panelPlaceHolder}/>, this.panelPlaceHolder);
  }

}
