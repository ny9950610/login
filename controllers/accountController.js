// ----- import npm modules -----
const moment = require('moment');
// ----- import controllers -----
const BaseController  = require('./baseController');
// ----- import models -----
const AccountModel = require('../models/accountModel');
// ----- import services -----
const AccountService = require('../services/accountService');
// ----- import utils & cores -----
const ValidateUtil = require('../utils/validateUtil');
const VerificationCodeUtil = require('../utils/verificationCodeUtil');
const MailUtil = require('../utils/mailUtil');
const ResponseHandler = require('../core/responseHandler');

class AccountController extends BaseController {
	/**
	 * 註冊
	 * @param {string} req.body.account 帳號
	 * @param {string} req.body.password 密碼
	 * @param {string} req.body.confirmPassword 確認密碼
	 * @param {string} req.body.username 使用者名稱
	 * @param {string} req.body.email 電子郵件
	 */
	async signup(req, res) {
		const {
			account,
			password,
			confirmPassword,
			username,
			email,
		} = req.body;

		// 檢查帳號是否重複
		const duplicatedAccount = await AccountModel
			.find({ account })
			.lean()
			.exec();
		if (duplicatedAccount.length > 0) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '此帳號已被註冊' });
		}

		// 檢查密碼與確認密碼是否相同
		if (password !== confirmPassword) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '密碼與確認密碼不一致' });
		}

		// 檢查帳號、密碼、使用者名稱、電子郵件格式是否符合規範
		const errors = AccountService.checkAccountSpecification(account, password, username, email);
		if (errors.length > 0) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: errors });
		}

		// 加密密碼並在資料庫新增帳號
		const saltedPassword = await AccountService.addSalt(password);
		const result = await AccountModel
			.create({
				account,
				password: saltedPassword,
				username,
				email,
			});
		if (!result) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '新增帳號失敗' });
		}

		return ResponseHandler.handle(res, ResponseHandler.statusCode.success, { message: '新增帳號成功' });
	}

	/**
	 * 登入
	 * @param {string} req.body.account 帳號
	 * @param {string} req.body.password 密碼
	 */
	async login(req, res) {
		const {
			account,
			password,
		} = req.body;

		// 根據輸入帳號取得對應帳號資料
		const accountInfo = await AccountModel
			.findOne({ account })
			.select({ password: 1, username: 1 })
			.lean()
			.exec();
		if (!accountInfo) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '找不到帳號' });
		}

		// 檢查輸入密碼是否與帳號資料相同
		const isCorrectPassword = await AccountService.checkPassword(password, accountInfo.password);
		if (!isCorrectPassword) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '密碼錯誤' });
		}

		// 更新帳號狀態
		await AccountModel
			.findOneAndUpdate({ _id: accountInfo._id }, { $set: { lastLoginTime: new Date() } })
			.lean()
			.exec();

		// 設定使用者session
		req.session.user = {
			_id: accountInfo._id,
			account,
			username: accountInfo.username,
		};

		return ResponseHandler.handle(res, ResponseHandler.statusCode.success, { message: '登入成功' });
	}

	/**
	 * 登出
	 */
	logout(req, res) {
		req.session.destroy();
		return ResponseHandler.handle(res, ResponseHandler.statusCode.success, { message: '登出成功' });
	}

	/**
	 * 更新密碼
	 * @param {string} req.body.originalPassword 舊密碼
	 * @param {string} req.body.newPassword 新密碼
	 * @param {string} req.body.confirmPassword 確認密碼
	 */
	async update(req, res) {
		const {
			originalPassword,
			newPassword,
			confirmPassword,
		} = req.body;
		const accountId = req.query.id;

		if (!ValidateUtil.isObjectId(accountId)) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '無效的帳號ID' });
		}

		const accountInfo = await AccountModel
			.findOne({ _id: accountId })
			.select({ password: 1 })
			.lean()
			.exec();
		
		// 檢查舊密碼是否正確
		if (!await AccountService.checkPassword(originalPassword, accountInfo.password)) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '舊密碼錯誤' });
		}

		// 檢查密碼與確認密碼是否相同
		if (newPassword !== confirmPassword) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '密碼與確認密碼不一致' });
		}

		// 檢查新密碼格式是否符合規範
		const errors = ValidateUtil.isPassword(newPassword, true);
		if (errors.length !== 0) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: errors });
		}

		// 加密新密碼並更新資料庫
		const saltedPassword = await AccountService.addSalt(newPassword);
		await AccountModel.findOneAndUpdate({ account: req.session.user.account }, { $set: { password: saltedPassword } });

		return ResponseHandler.handle(res, ResponseHandler.statusCode.success, { message: '更新密碼成功' });
	}
	
	/**
	 * 刪除帳號(將其valid設為false)
	 * @param {string} req.params.id 帳號ID
	 */
	async delete(req, res) {
		const accountId = req.query.id;
		const result = await AccountModel
			.findOneAndUpdate({ _id: accountId }, { $set: { valid: false } })
			.lean()
			.exec();

		if (!result) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '刪除帳號失敗' });
		}

		return ResponseHandler.handle(res, ResponseHandler.statusCode.success, { message: '刪除帳號成功' });
	}

	/**
	 * 透過mail寄送驗證碼
	 * @param {string} req.body.account 帳號
	 */
	async sendVerificationCode(req, res) {
		const { account } = req.body;
		const accountInfo = await AccountModel
			.findOne({ account })
			.select({ email: 1 })
			.lean()
			.exec();

		if (!accountInfo) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '找不到帳號' });
		}

		// 產生驗證碼，並在設定有效時間後存入資料庫
		const verificationCode = VerificationCodeUtil.generate();
		const expireTime = moment().add(5, 'minute').toDate();
		const valificationCodeInfo = {
			code: verificationCode,
			expireTime: expireTime,
		}
		await AccountModel.findOneAndUpdate({ account }, { $set: { verificationCode: valificationCodeInfo } });

		// 寄送驗證碼至使用者信箱
		const subject = '登入系統實作 - 重設密碼驗證碼';
		const text = `您的驗證碼為： ${verificationCode}`;
		MailUtil.send(accountInfo.email, subject, text);

		// TODO 需要將帳號ID傳回前端，以便重設密碼時使用 但還需要考慮回傳多個參數到前端的格式
		return ResponseHandler.handle(res, ResponseHandler.statusCode.success, { message: '驗證碼已寄送至您的信箱' });
	}

	/**
	 * 重設密碼
	 * @param {string} req.params.id 帳號ID
	 * @param {string} req.body.verificationCode 驗證碼
	 * @param {string} req.body.password 密碼
	 * @param {string} req.body.confirmPassword 確認密碼
	 */
	async reset(req, res) {
		const {
			verificationCode,
			password,
			confirmPassword,
		} = req.body;
		const accountId = req.params.id;

		// 檢查新密碼格式是否符合規範
		const errors = ValidateUtil.isPassword(password, true);
		if (errors.length !== 0) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: errors });
		}

		// 檢查密碼與確認密碼是否相同
		if (password !== confirmPassword) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '密碼與確認密碼不一致' });
		}
		
		// 取得帳號對應的驗證碼資料
		const accountInfo = await AccountModel
			.findOne({ _id: accountId })
			.select({ verificationCode: 1 })
			.lean()
			.exec();

		const verificationCodeInfo = accountInfo?.verificationCode;
		if (!verificationCodeInfo) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '找不到與帳號對應之驗證碼' });
		}

		// 檢查驗證碼是否正確
		if (verificationCodeInfo.code != verificationCode) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '輸入驗證碼錯誤' });
		}
		// 檢查驗證碼是否過期
		if (moment().isAfter(moment(verificationCodeInfo.expiredTime))) {
			return ResponseHandler.handle(res, ResponseHandler.statusCode.badRequest, { message: '驗證碼已過期' });
		}

		// 加密新密碼並更新資料庫
		const saltedPassword = await AccountService.addSalt(password);
		const updatedDoc = {
			$set: {
				password: saltedPassword,
				verificationCode: {
					code: null,
					expireTime: new Date(), // 更新驗證碼過期時間使其失效
				}
			}
		};
		await AccountModel
			.findOneAndUpdate({ _id: accountId }, updatedDoc)
			.lean()
			.exec();

		return ResponseHandler.handle(res, ResponseHandler.statusCode.success, { message: '重設密碼成功' });
	}

	
}

module.exports = AccountController;