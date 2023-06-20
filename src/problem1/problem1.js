var sum_to_n_a = function (n) {
	// your code here
	sum = 0;
	while (n > 0) {
		sum += n;
		n -= 1;
	}
	return sum;
};

var sum_to_n_b = function (n) {
	// your code here
	if (n == 0) {
		return 0;
	}
	return n + sum_to_n_b(n - 1);
};

var sum_to_n_c = function (n) {
	// your code here
	return (n / 2) * (1 + n);
};

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));
