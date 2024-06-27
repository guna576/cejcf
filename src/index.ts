import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
// import { Login } from './components/Login';
import { Feature } from './widgets/Feature';

/**
 * Initialization data for the mlops-assist extension.
 */

function activateExtension(app: JupyterFrontEnd): void {
  console.log('JupyterLab Extension Activated');
  app.docRegistry.addWidgetExtension('Notebook', new Feature(app));
  // const widget = new Login();
  // widget.id = 'login-widget';
  // widget.title.iconClass = 'fas fa-sign-in-alt';
  // widget.title.caption = 'Login';
  // app.shell.add(widget, 'left', { rank: 1 });
}0.

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'mlops-assist:plugin',
  autoStart: true,
  activate: activateExtension
};

export default plugin;
