export interface IResponseList {
  data: any[];
  count: number;
}

export interface IResponse {
  data: any;
}

export interface IResponseError {
  statusCode: number;
  message: string;
  error: any;
}

export interface IResponseErrorValidation {
  statusCode: number;
  message: string;
  error: any;
  validation: any;
}

export interface IResponseSuccessMessage {
  statusCode: number;
  message: string;
}
