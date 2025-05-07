/**
 * Parses the API response and returns the data or generates an error
 */
export const parseApiResponse = async (res: Response): Promise<any> => {
  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (res.status === 503) {
    const errorData = await res.json();
    throw new Error(`HTTP 503 Service Unavailable: Unprocessable Entity ${errorData?.detail?.description || 'Bad request'}`);
  }

  if (res.status === 400) {
    const errorData = await res.json();
    throw new Error(`HTTP 400 Bad Request: ${errorData?.detail?.description || 'Bad request'}`);
  }

  if (res.status === 422) {
    const errorData = await res.json();
    const formattedErrors = errorData.detail
      .map((err: { loc: any[]; msg: any }) => `${err.loc.join(' → ')}: ${err.msg}`)
      .join('\n');

    throw new Error(`HTTP 422 Validation Error: Unprocessable Entity ${formattedErrors}`);
  }

  if (res.status === 404) {
    throw new Error('HTTP 404');
  }

  return res.json().then((response) => ({
    data: response,
    status: res.status,
    xProcessTime: res.headers.get('X-Process-Time'),
    xFetchedTime: res.headers.get('X-Fetched-Time'),
  }));
};
