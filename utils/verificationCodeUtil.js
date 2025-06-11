class VerificationCodeUtil {
  /**
   * 產生驗證碼(6位數)
   * @returns 
   */
  static generate() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

module.exports = VerificationCodeUtil;