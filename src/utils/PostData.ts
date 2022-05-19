interface PostProps {
  url: string;
  headers: Headers;
  data: FormData;
}

export async function postData(props: PostProps): Promise<any> {
  const response = await fetch(props.url, {
    method: 'POST',
    headers: props.headers,
    body: props.data
  });
  return response;
}
