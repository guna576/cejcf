import { JupyterFrontEnd } from '@jupyterlab/application';
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { INotebookModel, NotebookPanel } from '@jupyterlab/notebook';
import { reactIcon } from '@jupyterlab/ui-components';
import { DisposableDelegate, IDisposable } from '@lumino/disposable';
import { fetchFeatureList } from '../utils/FetchFeatureList';
import { processFeature } from '../utils/ProcessFeature';
import { FeatureModal } from '../components/FeatureModal';
import { FetchModal } from '../components/FetchModal';
import { Progress } from '../components/Progress';
// import { TagModal } from '../components/TagModal';
// import { Cell, ICellModel } from '@jupyterlab/cells';
// import { PushModal } from '../components/PushModal';

// function containsTag(tag: string, tagList: string[]) {
//   for (let j = 0; j < tagList.length; j++) {
//     if (tagList[j] === tag) {
//       return true;
//     }
//   }
//   return false;
// }

export class Feature
  implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
  app: JupyterFrontEnd;

  constructor(app: JupyterFrontEnd) {
    this.app = app;
  }

  createNew(
    panel: NotebookPanel,
    context: DocumentRegistry.IContext<INotebookModel>
  ): void | IDisposable {
    const featureHandler = () => {
      // Grabbing code from code cells and Make Feature Class
      const featureCode = processFeature(panel);
      // add modal widget to app header
      const widget = new FeatureModal(featureCode, panel);
      widget.title.label = 'React Widget';
      widget.title.icon = reactIcon;
      widget.id = 'modal-widget';
      this.app.shell.add(widget, 'header');
    };

    const fetchHandler = () => {
      const progressWidget = new Progress();
      progressWidget.title.label = 'React Widget';
      progressWidget.title.icon = reactIcon;
      progressWidget.id = 'modal-widget';
      this.app.shell.add(progressWidget, 'header');
      // Fetch all features from latest commit
      fetchFeatureList()
        .then((featureList: string[]) => {
          progressWidget.close();
          console.log(featureList);
          // Add fetch feature Modal to header
          const widget = new FetchModal(featureList, panel);
          widget.title.label = 'React Widget';
          widget.title.icon = reactIcon;
          widget.id = 'modal-widget';
          this.app.shell.add(widget, 'header');
        })
        .catch(err => {
          progressWidget.close();
          console.log(err);
        });
    };

    // const pushHandler = () => {
    //   let featureCode = '';
    //   for (let i = 0; i < panel.content.widgets.length; i++) {
    //     const cell: Cell = panel.content.widgets[i];
    //     const model: ICellModel = cell.model;

    //     if (model.type === 'code') {
    //       let tagList = model.metadata.get('tags') as string[];
    //       if (tagList === undefined) {
    //         tagList = [];
    //       } else {
    //         if (containsTag('existingFeature', tagList)) {
    //           featureCode = model.value.text;
    //         }
    //       }
    //     }
    //   }
    //   const inter = featureCode.split('\n')[0];
    //   const fileName =
    //     inter.substring(6, inter.length - 1).toLowerCase() + '.py';

    //   const widget = new PushModal(featureCode, fileName);
    //   widget.title.label = 'React Widget';
    //   widget.title.icon = reactIcon;
    //   widget.id = 'modal-widget';
    //   this.app.shell.add(widget, 'header');
    // };

    // const tagHandler = () => {
    //   const tagWidget = new TagModal(panel);
    //   tagWidget.title.label = 'React Widget';
    //   tagWidget.title.icon = reactIcon;
    //   tagWidget.id = 'modal-widget';
    //   this.app.shell.add(tagWidget, 'header');
    // };

    // Creating Toolbar Button
    const FeatureBtn = new ToolbarButton({
      className: 'feature-btn',
      label: 'Push',
      onClick: featureHandler,
      tooltip: 'Extract Feature'
    });

    // Creating Toolbar Button
    const FetchBtn = new ToolbarButton({
      className: 'feature-btn',
      label: 'Fetch',
      onClick: fetchHandler,
      tooltip: 'Fetch Feature'
    });

    // const PushBtn = new ToolbarButton({
    //   className: 'feature-btn',
    //   label: 'Push',
    //   onClick: pushHandler,
    //   tooltip: 'Push Feature'
    // });

    // const TagCellBtn = new ToolbarButton({
    //   className: 'tagcell-btn',
    //   label: 'Tag Cells',
    //   onClick: tagHandler,
    //   tooltip: 'Tag Cells in the specified range'
    // });

    // Adding FeatureBtn Button to Notebook Panel
    panel.toolbar.insertItem(11, 'Extract Feature', FeatureBtn);
    panel.toolbar.insertItem(12, 'Fetch Feature', FetchBtn);
    //panel.toolbar.insertItem(13, 'Push Feature', PushBtn);
    // panel.toolbar.insertItem(3, 'Tag Cells', TagCellBtn);

    return new DisposableDelegate(() => {
      FeatureBtn.dispose();
      FetchBtn.dispose();
    });
  }
}
