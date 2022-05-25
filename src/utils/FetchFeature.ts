// import { Cell, ICellModel } from '@jupyterlab/cells';
import { NotebookActions, NotebookPanel } from '@jupyterlab/notebook';
import Swal from 'sweetalert2';
import {
  access_token,
  BASE_URL,
  branch,
  repo_slug,
  VERSION,
  workspace
} from '../utils/ExportEnvVars';

interface FetchProps {
  featureName: string;
  panel: NotebookPanel;
}

export function fetchFeature({ featureName, panel }: FetchProps): any {
  // Fetch FeatureCode from Repo Using the Commit ID
  const url = `${BASE_URL}/${VERSION}/repositories/${workspace}/${repo_slug}/src/${branch}/${featureName}`;
  const headers = {
    Authorization: `Bearer ${access_token}`
  };

  fetch(url, {
    method: 'GET',
    headers: headers
  })
    .then(response => response.text())
    .then(data => {
      Swal.fire({
        title: 'Success!',
        text: 'Feature Code Fetched Successfully!',
        icon: 'success'
      });
      // Display Code in a New Notebook Cell
      panel.content.activeCellIndex = panel.content.widgets.length - 1;
      NotebookActions.insertBelow(panel.content);
      NotebookActions.replaceSelection(panel.content, data);
      // NotebookActions.run(panel.content, panel.context.sessionContext);
      // const cell: Cell =
      //   panel.content.widgets[panel.content.widgets.length - 1];
      // const model: ICellModel = cell.model;
      // const newList: string[] = [];
      // newList.push('existingFeature');
      // model.metadata.set('tags', newList);

      // let className = '';
      // for (let i = 6; i < data.length; i++) {
      //   if (data[i] === ':') {
      //     break;
      //   }
      //   className += data[i];
      // }

      // const obj = 'obj = ' + className + '()';
      // NotebookActions.insertBelow(panel.content);
      // NotebookActions.replaceSelection(panel.content, obj);
      // NotebookActions.run(panel.content, panel.context.sessionContext);
    })
    .catch(err => {
      console.log(err);
    });
}
