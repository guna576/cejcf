import { Cell, ICellModel } from '@jupyterlab/cells';
import { NotebookPanel } from '@jupyterlab/notebook';

export function processFeature(panel: NotebookPanel): string {
  let processedFeature = '';
  let processedFeatureImport = '';
  let processedFeatureModel = '';
  let returnFeatureObject = '';
  let returnModelObject = '';
  let featureInput = '';
  let featureCode = '';
  const codeList: string[] = [];
  const importList: string[] = [];
  const modelList: string[] = [];

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
        if (containsTag('importCode', tagList)) {
          importList.push(model.value.text);
        }
        if (containsTag('modelCode', tagList)) {
          modelList.push(model.value.text);
        }

        if (containsTag('returnFeatureObject', tagList)) {
          returnFeatureObject = model.value.text;
        }
        if (containsTag('returnModelObject', tagList)) {
          returnModelObject = model.value.text;
        }
        if (containsTag('featureInput', tagList)) {
          featureInput = model.value.text;
        }
      }
    }
  }
  if (returnFeatureObject) {
    codeList.push(`return ${returnFeatureObject}`);
  }
  if (returnModelObject) {
    modelList.push(`return ${returnModelObject}`);
  }
  processedFeatureImport = importList.join('\n');
  featureCode = processedFeatureImport + '\n\n';

  processedFeature = codeList.join('\n');
  processedFeature = processedFeature.replace(/^\s+|\s+$/g, '');
  processedFeature = processedFeature.replace(/^/gm, ' '.repeat(4));
  const medSig1 = `def preprocess(${featureInput}):\n`;
  processedFeature = medSig1 + processedFeature;
  featureCode += processedFeature + '\n\n';

  processedFeatureModel = modelList.join('\n');
  processedFeatureModel = processedFeatureModel.replace(/^\s+|\s+$/g, '');
  processedFeatureModel = processedFeatureModel.replace(/^/gm, ' '.repeat(4));
  const medSig2 = `def model(${featureInput}):\n`;
  processedFeatureModel = medSig2 + processedFeatureModel;
  featureCode += processedFeatureModel;

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
