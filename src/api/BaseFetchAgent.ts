import { isApiError } from '../types.js';

export class BaseFetchAgent {
  constructor(private _apiUrl: string) {}

  protected fetchRequest = async <ReturnDataType>(url: string, config: RequestInit = {}): Promise<ReturnDataType> => {
    const requestConfig: RequestInit = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {}),
      },
    };
    console.log(requestConfig);

    const response = await fetch(`${this._apiUrl}${url}`, requestConfig);

    let responseBody: unknown;

    try {
      responseBody = await response.json();
    } catch (error) {
      throw new Error('Ошибка при парсинге JSON'); // Вроде как невозможная ситуация, но мало ли
    }

    if (response.ok) {
      console.log(responseBody);
      return responseBody as ReturnDataType;
    }

    if (isApiError(responseBody)) {
      throw new Error(`${response.status}: ${responseBody.error}`);
    }

    throw new Error('Неизвестная ошибка');
  };
}
