/**
 * Parses the API response and returns the data or generates an error
 */
export const parseApiResponse = async (res: Response): Promise<any> => {
  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (res.status === 400) {
    const errorData = await res.json(); // Il backend restituisce JSON
    throw new Error(`HTTP 400 Bad Request: ${errorData?.detail?.description || 'Bad request'}`);
  }

  if (res.status === 422) {
    const errorData = await res.json();
    const formattedErrors = errorData.detail
      .map((err: { loc: any[]; msg: any }) => `${err.loc.join(' → ')}: ${err.msg}`)
      .join('\n');

    throw new Error(`HTTP 422 Validation Error: Unprocessable Entity ${formattedErrors}`);
  }

  return res.json().then((response) => ({
    data: response,
    status: res.status,
    xProcessTime: res.headers.get('X-Process-Time'),
  }));
};
