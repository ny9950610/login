// ----- import npm modules -----
const moment = require('moment');
const bcrypt = require('bcrypt');
// ----- import utils -----
const validateUtil = require('../utils/validateUtil');
// ----- constants -----
const SALT_ROUNDS = 10; // 鹽的迭代複雜度，也就是bcrypt中雜湊的迭代運算次數

class AccountService {
	/**
	 * 檢查帳號是否符合規範
	 * @param {string} account 使用者名稱
	 * @param {string} password 密碼
	 * @param {string} username 使用者名稱
	 * @param {string} email 電子郵件
	 * @returns {Array<string>} 錯誤提示
	 */
	static checkAccountSpecification(account, password, username, email) {
		const outputErrors = true; // 是否輸出錯誤提示
		const accountErrors = validateUtil.isAccount(account, outputErrors);
		const passwordErrors = validateUtil.isPassword(password, outputErrors);
		const usernameErrors = validateUtil.isUsername(username, outputErrors);
		const emailErrors = validateUtil.isEmail(email, outputErrors);

		const errors = [
			...accountErrors,
			...passwordErrors,
			...usernameErrors,
			...emailErrors,
		];
		return errors;
	}

	/**
	 * 為密碼加鹽
	 * @param {string} password 密碼
	 * @returns {string} 加鹽後的密碼
	 */
	static async addSalt(password) {
		const salt = bcrypt.genSaltSync(SALT_ROUNDS);
		const saltedPassword = bcrypt.hashSync(password, salt);

		return saltedPassword;
	}

	/**
	 * 檢查輸入密碼是否正確
	 * @param {string} password 輸入密碼
	 * @param {string} saltedPassword 資料庫中的加鹽密碼
	 * @returns {boolean} 輸入密碼是否正確
	 */
	static async checkPassword(password, saltedPassword) {
		const passwordMatch = await bcrypt.compareSync(password, saltedPassword);
		return passwordMatch;
	}
}

module.exports = AccountService;