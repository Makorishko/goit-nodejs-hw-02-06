const messageList = {
  400: 'Bad request',
  401: 'Unauthrized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
};

export default function HttpError(status, message = messageList[status]) {
  const error = new Error(message);
  error.status = status;
  return error;
}
