const formatNumber = function (number, decimals, decPoint, thousandsSep) {
	// *    example 13: number_format('1 000,50', 2, '.', ' ');
	// *    returns 13: '100 050.00'

	number = (number + '').replace(',', '').replace(' ', '')
	let n = !isFinite(+number) ? 0 : +number
	let	prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
	let	sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
	let	dec = (typeof decPoint === 'undefined') ? '.' : decPoint
	let	s = ''
	let	toFixedFix = function (n, prec) {
		var k = Math.pow(10, prec)
		return '' + Math.round(n * k) / k
	}

	// Fix for IE parseFloat(0.55).toFixed(0) = 0;
	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
	}

	if ((s[1] || '').length < prec) {
		s[1] = s[1] || ''
		s[1] += new Array(prec - s[1].length + 1).join('0')
	}

	return s.join(dec)
}

export const helpers = {
	formatQuantity: function (quantity) {
		let prefix = ''
		let	suffix = ''

		if (quantity < 0) {
			prefix = '-'
			quantity = Math.abs(quantity)
		}

		if (quantity >= 100000) {
			let m = 1000000

			if (quantity >= m) {
				suffix = 'M'
			} else {
				m = 1000
				suffix = 'K'
			}

			quantity = formatNumber(quantity / m, 1, ',', ' ')
		} else {
			quantity = formatNumber(quantity, 0, '', ' ')
		}

		return prefix + quantity + suffix
	}
}
