import { Cell, ICellModel } from '@jupyterlab/cells';
import { NotebookPanel } from '@jupyterlab/notebook';

export function processFeature(panel: NotebookPanel): string {
  let processedFeature = '';
  let returnObject = '';
  let featureInput = '';
  const codeList: string[] = [];

  for (let i = 0; i < panel.content.widgets.length; i++) {
    const cell: Cell = panel.content.widgets[i];
    const model: ICellModel = cell.model;

    if (model.type === 'code') {
      let tagList = model.metadata.get('tags') as string[];
      if (tagList === undefined) {
        tagList = [];
      } else {
        if (containsTag('featureCode', tagList)) {
          codeList.push(model.value.text);
        }
        if (containsTag('returnObject', tagList)) {
          returnObject = model.value.text;
        }
        if (containsTag('featureInput', tagList)) {
          featureInput = model.value.text;
        }
      }
    }
  }
  if (returnObject) {
    codeList.push(`return ${returnObject}`);
  }
  processedFeature = codeList.join('\n\n');
  processedFeature = processedFeature.replace(/^\s+|\s+$/g, '');
  processedFeature = processedFeature.replace(/^/gm, ' '.repeat(8));

  let featureCode = 'class FeatureClass:\n';
  featureCode += ' '.repeat(4) + 'def __init__(self, featureName="feature"):\n';
  featureCode += ' '.repeat(8) + 'self.name = featureName\n\n';
  const medSig = `def processFeature(self, ${featureInput}):\n`;
  featureCode += ' '.repeat(4) + medSig;

  featureCode += processedFeature;

  return featureCode;
}

function containsTag(tag: string, tagList: string[]) {
  for (let j = 0; j < tagList.length; j++) {
    if (tagList[j] === tag) {
      return true;
    }
  }
  return false;
}
