export type RequestContentType = 
  | 'application/json'
  | 'text/plain'
  | 'text/html'
  | 'application/xml'
  | 'application/x-www-form-urlencoded'
  | 'multipart/form-data'
  | 'application/pdf'
  | 'image/*'
  | 'audio/*'
  | 'video/*'
  | '*/*';

export type ResponseContentType =
  | 'application/json'
  | 'text/plain'
  | 'text/html'
  | 'application/xml'
  | 'application/pdf'
  | 'image/*'
  | 'audio/*'
  | 'video/*'
  | '*/*';