// ----- import npm modules -----
const mongoose = require('mongoose');
// ---- import utils -----
const StringUtil = require('./stringUtil');
// ----- cosntants -----
const USERNAME_MIN_LENGTH = 1; // 使用者名稱最少字數限制
const USERNAME_MAX_LENGTH = 16; // 使用者名稱最多字數限制
const ACCOUNT_MIN_LENGTH = 4; // 帳號最少字數限制
const ACCOUNT_MAX_LENGTH = 16; // 帳號最多字數限制
const PASSWORD_MIN_LENGTH = 8; // 密碼最少字數限制
const PASSWORD_MAX_LENGTH = 16; // 密碼最多字數限制
const PASSWORD_CHAR_LIMIT = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/; // 密碼字元規範: 至少一大寫、小寫字母和一數字

class ValidateUtil {
	/**
	 * 檢查傳入參數是否為ObjectId
	 * @param {*} targetId 
	 * @returns 
	 */
	static isObjectId(targetId) {
		return mongoose.Types.ObjectId.isValid(targetId);
	}

	/**
	 * 檢查字串使否為帳號
	 * @param {string} str 檢查字串
	 * @param {boolean} outputErrors 是否輸出錯誤提示
	 * @returns {boolean, Array<string>} 字串是否為帳號, 錯誤訊息
	 */
	static isAccount(str, outputErrors = false) {
		const errors = [];
		// 使用者名稱至少4個字 最多16個字
		if (str.length < ACCOUNT_MIN_LENGTH || str.length > ACCOUNT_MAX_LENGTH) {
			errors.push(`帳號需要在${USERNAME_MIN_LENGTH}~${USERNAME_MAX_LENGTH}個字元之間`);
		}

		// 若要輸出錯誤提示，則回傳錯誤提示陣列，反之則只回傳布林變數
		if (outputErrors) {
			return errors;
		}
		return errors.length !== 0;
	}

	/**
	 * 檢查字串使否為密碼
	 * @param {string} str 檢查字串
	 * @param {boolean} outputErrors 是否輸出錯誤提示
	 * @returns {boolean, Array<string>} 字串是否為密碼, 錯誤訊息
	 */
	static isPassword(str, outputErrors = false) {
		const errors = [];
		// 密碼至少8個字 最多16個字
		if (str.length < PASSWORD_MIN_LENGTH || str.length > PASSWORD_MAX_LENGTH) {
			errors.push(`密碼需要在${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}個字元之間`);
		}
		// 密碼包括字母大小寫與數字
		if (!PASSWORD_CHAR_LIMIT.test(str)) {
			errors.push('密碼需要包括字母大小寫與數字');
		}

		// 若要輸出錯誤提示，則回傳錯誤提示陣列，反之則只回傳布林變數
		if (outputErrors) {
			return errors;
		}
		return errors.length !== 0;
	}

	/**
	 * 檢查字串使否為帳號
	 * @param {string} str 檢查字串
	 * @param {boolean} outputErrors 是否輸出錯誤提示
	 * @returns {boolean, Array<string>} 字串是否為使用者名稱, 錯誤訊息
	 */
	static isUsername(str, outputErrors = false) {
		const errors = [];
		// 使用者名稱至少4個字 最多16個字
		if (str.length < USERNAME_MIN_LENGTH || str.length > PASSWORD_MAX_LENGTH) {
			errors.push(`使用者名稱需要在${USERNAME_MIN_LENGTH}~${USERNAME_MAX_LENGTH}個字元之間`);
		}

		// 若要輸出錯誤提示，則回傳錯誤提示陣列，反之則只回傳布林變數
		if (outputErrors) {
			return errors;
		}
		return errors.length !== 0;
	}
	
	/**
	 * 檢查字串使否為電子郵件
	 * @param {string} str 檢查字串
	 * @param {boolean} outputErrors 是否輸出錯誤提示
	 * @returns {boolean, Array<string>} 字串是否為電子郵件, 錯誤訊息
	 */
	static isEmail(str, outputErrors = false) {
		const errors = [];
		// 電子郵件中需含有剛好1個'@'，且不能為整個字串的開頭或結尾
		const countOfAt = StringUtil.countAppearTime(str, '@');
		const idxOfAt = str.indexOf('@');
		if (countOfAt !== 1 || idxOfAt === 0 || idxOfAt === str.length - 1) {
			errors.push('電子郵件格式錯誤');
		}

		// 若要輸出錯誤提示，則回傳錯誤提示陣列，反之則只回傳布林變數
		if (outputErrors) {
			return errors;
		}
		return errors.length !== 0;
	}
}

module.exports = ValidateUtil;