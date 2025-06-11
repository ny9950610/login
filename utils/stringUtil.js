class StringUtil {
	/**
	 * 計算特定字串/字元在目標字串中出現幾次
	 * @param {string} str 目標字串
	 * @param {string} subStr 特定字串
	 * @returns {number} 特定字串/字元出現次數
	 */
	static countAppearTime(str, subStr) {
		const arr = str.split(subStr);
		return arr.length - 1;
	}
}

module.exports = StringUtil;