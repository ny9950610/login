const Logger = require('../core/logger');
const ResponseHandler = require('../core/responseHandler');

class BaseController {
  /**
   * 檢查是否符合權限
   */
  isAuthorize(req) {
    return req.session?.user;
  }

  /**
   * 當呼叫http method為PUT或DELETE等會帶入指定id的API時，檢查session中紀錄的使用者為本人
   * ex: 當我要修改使用者xxx的密碼，必須檢查session中紀錄的userId是否為xxx本人的，而不是ooo的
   */
  isCorrectUser(req) {
    return req.query.id === req.session.user._id;
  }

  /**
   * 在執行API之前進行各項檢查，並用try/catch抓取可能的錯誤
   * @param {function} exec 執行的API
   * @param {boolean} opt.needAuthorize 是否需要驗證權限
   * @param {boolean} opt.needCheckUser 是否需要檢查使用者
   * @returns 
   */
  async execAPI(exec, req, res, opt = {}) {
    try {
      const account = req.session?.user?.account ?? '__system'; // 紀錄使用者帳號作為log分類依據，若無附帶session的操作則視為系統操作

      Logger.write(Logger.level.info, `===== Request start: ${req.originalUrl} =====`, account);
      Logger.write(Logger.level.info, `body: ${JSON.stringify(req.body)}`, account);

      // 若需檢查權限且使用者不符合權限，則回傳驗證失敗
      if (opt.needAuthorize && !this.isAuthorize(req)) {
        Logger.write(Logger.level.error, `===== Request end: ${req.originalUrl}, status=${ResponseHandler.statusCode.unauthorized}, ${JSON.stringify({ message: '驗證失敗' })} =====`, account);
        return ResponseHandler.handle(res, ResponseHandler.statusCode.unauthorized, { message: '驗證失敗' });
      }
      // 若需檢查使用者且session中紀錄的使用者與api中指定的使用者不同，則回傳非正確使用者
      if (opt.needCheckUser && !this.isCorrectUser(req)) {
        Logger.write(Logger.level.error, `===== Request end: ${req.originalUrl}, status=${ResponseHandler.statusCode.unauthorized}, ${JSON.stringify({ message: '非正確使用者' })} =====`, account);
        return ResponseHandler.handle(res, ResponseHandler.statusCode.unauthorized, { message: '非正確使用者' });
      }

      const result = await exec(req, res);

      Logger.write(Logger.level.info, `===== Request end: ${req.originalUrl}, status=${result.statusCode}, ${JSON.stringify(result.message)} =====`, account);
      return result;
    } catch (err) {
      const account = req.session?.user?.account ?? '__system'; // 紀錄使用者名稱作為log分類依據，若尚未登入的操作則記錄為系統操作
      Logger.write(Logger.level.error, `===== Request failed: ${req.originalUrl}, status=${ResponseHandler.statusCode.badRequest}, ${err.stack} =====`, account);
      return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, err.stack);
    }
  }
}

module.exports = BaseController;