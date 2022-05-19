import {
  access_token,
  BASE_URL,
  branch,
  repo_slug,
  VERSION,
  workspace
} from './ExportEnvVars';

export async function fetchFeatureList(): Promise<string[]> {
  const url = `${BASE_URL}/${VERSION}/repositories/${workspace}/${repo_slug}/src/${branch}/`;
  const featureList: string[] = [];
  await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  })
    .then(response => response.json())
    .then(data => {
      data.values.map((value: Record<string, string>) => {
        if (value.path.search('.py') !== -1) {
          featureList.push(value.path);
        }
      });
    })
    .catch(err => console.log(err));
  return featureList;
}
