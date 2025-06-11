class ResponseHandler {
  static statusCode = {
    success: 200,
    badRequest: 400,
    unauthorized: 401,
    notFound: 404,
  }

  /**
   * 
   * @param {number} status 狀態碼
   * @param {Object} message 回傳訊息
   * @returns 
   */
  static handle(res, status, message) {
    res.message = message;
    return res.status(status).json(message);
  }
}

module.exports = ResponseHandler;