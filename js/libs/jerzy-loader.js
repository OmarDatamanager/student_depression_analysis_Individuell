(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
	1: [function (require, module, exports) {
		window.___jerzy = require('jerzy');
	}, { "jerzy": 2 }], 2: [function (require, module, exports) {
		var vector = require('./lib/vector');
		var factor = require('./lib/factor');
		var matrix = require('./lib/matrix');
		var t = require('./lib/t');
		var misc = require('./lib/misc');
		var distributions = require('./lib/distributions');
		var regression = require('./lib/regression');
		var correlation = require('./lib/correlation');
		var numeric = require('./lib/numeric');
		var anova = require('./lib/anova');
		var normality = require('./lib/normality');
		var confidence = require('./lib/confidence');
		var power = require('./lib/power');
		var nonparametric = require('./lib/nonparametric');

		module.exports.Vector = vector.Vector;
		module.exports.Factor = factor.Factor;
		module.exports.Matrix = factor.Matrix;
		module.exports.Sequence = vector.Sequence;
		module.exports.StudentT = t.StudentT;
		module.exports.Misc = misc.Misc;
		module.exports.Numeric = numeric.Numeric;
		module.exports.Normal = distributions.Normal;
		module.exports.StandardNormal = distributions.StandardNormal;
		module.exports.T = distributions.T;
		module.exports.F = distributions.F;
		module.exports.Kolmogorov = distributions.Kolmogorov;
		module.exports.Regression = regression.Regression;
		module.exports.Correlation = correlation.Correlation;
		module.exports.Anova = anova.Anova;
		module.exports.Normality = normality.Normality;
		module.exports.Confidence = confidence.Confidence;
		module.exports.Power = power.Power;
		module.exports.Nonparametric = nonparametric.Nonparametric;

	}, { "./lib/anova": 3, "./lib/confidence": 4, "./lib/correlation": 5, "./lib/distributions": 6, "./lib/factor": 7, "./lib/matrix": 8, "./lib/misc": 9, "./lib/nonparametric": 10, "./lib/normality": 11, "./lib/numeric": 12, "./lib/power": 13, "./lib/regression": 14, "./lib/t": 15, "./lib/vector": 16 }], 3: [function (require, module, exports) {
		var vector = require('./vector');
		var distributions = require('./distributions');

		Anova = function () { };

		/*
		 * One-way ANOVA
		 */

		Anova.oneway = function (x, y) {
			var result = {};

			var vectors = [];
			for (var i = 0; i < x.groups(); i++) {
				var v = new vector.Vector([]);
				var indices = x.group(i);
				for (var j = 0; j < indices.length; j++) {
					v.push(y.elements[indices[j]]);
				}
				vectors.push(v);
			}

			var mean = new vector.Vector([]);
			var n = new vector.Vector([]);
			var v = new vector.Vector([]);
			for (var i = 0; i < vectors.length; i++) {
				mean.push(vectors[i].mean());
				n.push(vectors[i].length());
				v.push(vectors[i].variance());
			}

			result.tdf = x.groups() - 1;
			result.tss = mean.add(-y.mean()).pow(2).multiply(n).sum();
			result.tms = result.tss / result.tdf;

			result.edf = x.length() - x.groups();
			result.ess = v.multiply(n.add(-1)).sum();
			result.ems = result.ess / result.edf;

			result.f = result.tms / result.ems;

			var fdistr = new distributions.F(result.tdf, result.edf);
			result.p = 1 - fdistr.distr(Math.abs(result.f));

			return result;
		}

		module.exports.Anova = Anova;
	}, { "./distributions": 6, "./vector": 16 }], 4: [function (require, module, exports) {
		var distributions = require('./distributions');

		Confidence = function () { };

		Confidence.normal = function (x, c) {
			var alpha = 1 - c;
			var t = new distributions.T(x.length() - 1);
			var lower = x.mean() - t.inverse(1 - alpha / 2) * x.sem();
			var upper = x.mean() + t.inverse(1 - alpha / 2) * x.sem();
			return [lower, upper];
		};

		Confidence.normalUpper = function (x, c) {
			var alpha = 1 - c;
			var t = new distributions.T(x.length() - 1);
			return (x.mean() + t.inverse(1 - alpha) * x.sem());
		};

		Confidence.normalLower = function (x, c) {
			var alpha = 1 - c;
			var t = new distributions.T(x.length() - 1);
			return (x.mean() - t.inverse(1 - alpha) * x.sem());
		};

		module.exports.Confidence = Confidence;
	}, { "./distributions": 6 }], 5: [function (require, module, exports) {
		var distributions = require('./distributions');

		Correlation = function () { };

		/*
		 * Pearson correlation
		 */

		Correlation.pearson = function (x, y) {
			var result = {};
			var n = x.length();
			var mx = x.mean();
			var my = y.mean();
			result.r = x.add(-mx).multiply(y.add(-my)).sum() /
				Math.sqrt(x.add(-mx).pow(2).sum() * y.add(-my).pow(2).sum());
			result.t = result.r * Math.sqrt((n - 2) / (1 - Math.pow(result.r, 2)));
			result.df = n - 2;
			var tdistr = new distributions.T(result.df);
			result.p = 2 * (1 - tdistr.distr(Math.abs(result.t)));
			return result;
		};

		module.exports.Correlation = Correlation;
	}, { "./distributions": 6 }], 6: [function (require, module, exports) {
		var vector = require('./vector');
		var misc = require('./misc');
		var numeric = require('./numeric');

		/*
		 * Normal distribution
		 */

		Normal = function (mean, variance) {
			this.mean = mean;
			this.variance = variance;
		};

		Normal.prototype._de = function (x) {
			return (1 / (Math.sqrt(this.variance) * (Math.sqrt(2 * Math.PI))))
				* Math.exp(-(Math.pow(x - this.mean, 2)) / (2 * this.variance))
		};

		Normal.prototype._di = function (x) {
			return 0.5 * (1 + misc.Misc.erf((x - this.mean) / (Math.sqrt(this.variance) * Math.sqrt(2))));
		};

		Normal.prototype.dens = function (arg) {
			if (arg instanceof vector.Vector) {
				result = new vector.Vector([]);
				for (var i = 0; i < arg.length(); ++i) {
					result.push(this._de(arg.elements[i]));
				}
				return result;
			} else {
				return this._de(arg);
			}
		};

		Normal.prototype.distr = function (arg) {
			if (arg instanceof vector.Vector) {
				result = new vector.Vector([]);
				for (var i = 0; i < arg.length(); ++i) {
					result.push(this._di(arg.elements[i]));
				}
				return result;
			} else {
				return this._di(arg);
			}
		};

		Normal.prototype.inverse = function (x) {
			var a1 = -3.969683028665376e+1;
			var a2 = 2.209460984245205e+2;
			var a3 = -2.759285104469687e+2;
			var a4 = 1.383577518672690e+2;
			var a5 = -3.066479806614716e+1;
			var a6 = 2.506628277459239e+0;

			var b1 = -5.447609879822406e+1;
			var b2 = 1.615858368580409e+2;
			var b3 = -1.556989798598866e+2;
			var b4 = 6.680131188771972e+1;
			var b5 = -1.328068155288572e+1;

			var c1 = -7.784894002430293e-3;
			var c2 = -3.223964580411365e-1;
			var c3 = -2.400758277161838e+0;
			var c4 = -2.549732539343734e+0;
			var c5 = 4.374664141464968e+0;
			var c6 = 2.938163982698783e+0;

			var d1 = 7.784695709041462e-3;
			var d2 = 3.224671290700398e-1;
			var d3 = 2.445134137142996e+0;
			var d4 = 3.754408661907416e+0;

			var q, r, y;

			if (x < 0.02425) {
				q = Math.sqrt(-2 * Math.log(x));
				y = (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
			} else if (x < 1 - 0.02425) {
				q = x - 0.5;
				r = q * q;
				y = (((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q / (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1);
			} else {
				q = Math.sqrt(-2 * Math.log(1 - x));
				y = -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
			}

			return y * this.variance + this.mean;
		};

		/*
		 * Standard Normal distribution
		 */

		StandardNormal.prototype = new Normal();

		StandardNormal.prototype.constructor = StandardNormal;

		function StandardNormal() {
			this.mean = 0;
			this.variance = 1;
		};

		/*
		 * T distribution
		 */

		T = function (df) {
			this.df = df;
		};

		T.prototype._de = function (x) {
			return (misc.Misc.gamma((this.df + 1) / 2) / (Math.sqrt(this.df * Math.PI) * misc.Misc.gamma(this.df / 2)))
				* Math.pow((1 + Math.pow(x, 2) / this.df), -(this.df + 1) / 2);
		};

		T.prototype._di = function (x) {
			if (x < 0) {
				return 0.5 * misc.Misc.rbeta(this.df / (Math.pow(x, 2) + this.df), this.df / 2, 0.5);
			} else {
				return 1 - 0.5 * misc.Misc.rbeta(this.df / (Math.pow(x, 2) + this.df), this.df / 2, 0.5);
			}
		};

		T.prototype.dens = function (arg) {
			if (arg instanceof vector.Vector) {
				result = new vector.Vector([]);
				for (var i = 0; i < arg.length(); ++i) {
					result.push(this._de(arg.elements[i]));
				}
				return result;
			} else {
				return this._de(arg);
			}
		};

		T.prototype.distr = function (arg) {
			if (arg instanceof vector.Vector) {
				result = new vector.Vector([]);
				for (var i = 0; i < arg.length(); ++i) {
					result.push(this._di(arg.elements[i]));
				}
				return result;
			} else {
				return this._di(arg);
			}
		};

		T.prototype.inverse = function (x) {
			return (function (o, x) {
				var t = numeric.Numeric.bisection(function (y) {
					return o._di(y) - x;
				}, -10.1, 10);
				return t;
			})(this, x);
		};

		/*
		 * Kolmogorov distribution
		 */

		Kolmogorov = function () { };

		Kolmogorov.prototype._di = function (x) {
			var term;
			var sum = 0;
			var k = 1;
			do {
				term = Math.exp(-Math.pow(2 * k - 1, 2) * Math.pow(Math.PI, 2) / (8 * Math.pow(x, 2)));
				sum = sum + term;
				k++;
			} while (Math.abs(term) > 0.000000000001);
			return Math.sqrt(2 * Math.PI) * sum / x;
		};

		Kolmogorov.prototype.distr = function (arg) {
			if (arg instanceof vector.Vector) {
				result = new vector.Vector([]);
				for (var i = 0; i < arg.length(); ++i) {
					result.push(this._di(arg.elements[i]));
				}
				return result;
			} else {
				return this._di(arg);
			}
		};

		Kolmogorov.prototype.inverse = function (x) {
			return (function (o, x) {
				var t = numeric.Numeric.bisection(function (y) {
					return o._di(y) - x;
				}, 0, 1);
				return t;
			})(this, x);
		};

		/*
		 * F distribution
		 */

		F = function (df1, df2) {
			this.df1 = df1;
			this.df2 = df2;
		};

		F.prototype._di = function (x) {
			return misc.Misc.rbeta((this.df1 * x) / (this.df1 * x + this.df2), this.df1 / 2, this.df2 / 2);
		};

		F.prototype.distr = function (arg) {
			if (arg instanceof vector.Vector) {
				result = new vector.Vector([]);
				for (var i = 0; i < arg.length(); ++i) {
					result.push(this._di(arg.elements[i]));
				}
				return result;
			} else {
				return this._di(arg);
			}
		};

		module.exports.Normal = Normal;
		module.exports.StandardNormal = StandardNormal;
		module.exports.T = T;
		module.exports.F = F;
		module.exports.Kolmogorov = Kolmogorov;
	}, { "./misc": 9, "./numeric": 12, "./vector": 16 }], 7: [function (require, module, exports) {
		Factor = function (elements) {
			this.levels = [];
			this.factors = [];
			for (var i = 0; i < elements.length; i++) {
				if ((index = this.levels.indexOf(elements[i])) != -1) {
					this.factors.push(index);
				} else {
					this.factors.push(this.levels.length);
					this.levels.push(elements[i]);
				}
			}
		};

		Factor.prototype.group = function (g) {
			var indices = [];
			var i = -1;
			while ((i = this.factors.indexOf(g, i + 1)) != -1) {
				indices.push(i);
			}
			return indices;
		};

		Factor.prototype.length = function () {
			return this.factors.length;
		};

		Factor.prototype.groups = function () {
			return this.levels.length;
		};

		module.exports.Factor = Factor;
	}, {}], 8: [function (require, module, exports) {
		Matrix = function (elements) {
			this.elements = elements;
		};

		Matrix.prototype.rows = function () {
			return this.elements.length;
		};

		Matrix.prototype.cols = function () {
			return this.elements[0].length;
		};

		Matrix.prototype.dot = function (m) {
			var result = [];
			for (var i = 0; i < this.rows(); i++) {
				result[i] = [];
				for (var j = 0; j < m.cols(); j++) {
					var sum = 0;
					for (var k = 0; k < this.cols(); k++) {
						sum += this.elements[i][k] * m.elements[k][j];
					}
					result[i][j] = sum;
				}
			}
			return new Matrix(result);
		};

		module.exports.Matrix = Matrix;
	}, {}], 9: [function (require, module, exports) {
		var numeric = require('./numeric');

		Misc = function () { };

		/*
		 * error function
		 */

		Misc.erf = function (z) {
			var term;
			var sum = 0;
			var n = 0;
			do {
				term = Math.pow(-1, n) * Math.pow(z, 2 * n + 1) / this.fac(n) / (2 * n + 1);
				sum = sum + term;
				n++;
			} while (Math.abs(term) > 0.000000000001);
			return sum * 2 / Math.sqrt(Math.PI);
		};

		/*
		 * gamma function
		 */

		Misc.gamma = function (n) {
			var p = [
				0.99999999999980993,
				676.5203681218851,
				-1259.1392167224028,
				771.32342877765313,
				-176.61502916214059,
				12.507343278686905,
				-0.13857109526572012,
				9.9843695780195716e-6,
				1.5056327351493116e-7
			];
			var g = 7;
			if (n < 0.5) {
				return Math.PI / (Math.sin(Math.PI * n) * this.gamma(1 - n));
			}
			n -= 1;
			var a = p[0];
			var t = n + g + 0.5;
			for (var i = 1; i < p.length; i++) {
				a += p[i] / (n + i);
			}
			return Math.sqrt(2 * Math.PI) * Math.pow(t, n + 0.5) * Math.exp(-t) * a;
		};

		/*
		 * beta function
		 */

		Misc.beta = function (x, y) {
			return this.gamma(x) * this.gamma(y) / this.gamma(x + y);
		};

		/*
		 * incomplete beta function
		 */

		Misc.ibeta = function (x, a, b) {
			return numeric.Numeric.adaptiveSimpson(function (y) {
				return Math.pow(y, a - 1) * Math.pow(1 - y, b - 1);
			}, 0, x, 0.000000000001, 10);
		};

		/*
		 * regularized incomplete beta function
		 */


		Misc.rbeta = function (x, a, b) {
			return this.ibeta(x, a, b) / this.beta(a, b);
		};

		/*
		 * factorial
		 */

		Misc.fac = function (n) {
			var result = 1;
			for (var i = 2; i <= n; i++) {
				result = result * i;
			}
			return result;
		}

		module.exports.Misc = Misc;
	}, { "./numeric": 12 }], 10: [function (require, module, exports) {
		var vector = require('./vector');
		var distributions = require('./distributions');

		Nonparametric = function () { };

		/*
		 * Two-sample Kolmogorov-Smirnov test
		 */

		Nonparametric.kolmogorovSmirnov = function (x, y) {
			var all = new vector.Vector(x.elements.concat(y.elements)).sort();
			var ecdfx = x.ecdf(all);
			var ecdfy = y.ecdf(all);
			var d = ecdfy.subtract(ecdfx).abs().max();
			var n = (x.length() * y.length()) / (x.length() + y.length());
			var ks = Math.sqrt(n) * d;
			var p = 1 - new distributions.Kolmogorov().distr(ks);

			return {
				"d": d,
				"ks": ks,
				"p": p
			};
		}

		module.exports.Nonparametric = Nonparametric;

	}, { "./distributions": 6, "./vector": 16 }], 11: [function (require, module, exports) {
		var matrix = require('./matrix');
		var vector = require('./vector');
		var distributions = require('./distributions');

		Normality = function () { };

		Normality.shapiroWilk = function (x) {
			result = {};
			var xx = x.sort();
			var mean = x.mean();
			var n = x.length();
			var u = 1 / Math.sqrt(n);

			// m

			var sn = new distributions.StandardNormal();
			var m = new vector.Vector([]);
			for (var i = 1; i <= n; i++) {
				m.push(sn.inverse((i - 3 / 8) / (n + 1 / 4)));
			}

			// c

			var md = m.dot(m);
			var c = m.multiply(1 / Math.sqrt(md));

			// a

			var an = -2.706056 * Math.pow(u, 5) + 4.434685 * Math.pow(u, 4) - 2.071190 * Math.pow(u, 3) - 0.147981 * Math.pow(u, 2) + 0.221157 * u + c.elements[n - 1];
			var ann = -3.582633 * Math.pow(u, 5) + 5.682633 * Math.pow(u, 4) - 1.752461 * Math.pow(u, 3) - 0.293762 * Math.pow(u, 2) + 0.042981 * u + c.elements[n - 2];

			var phi;

			if (n > 5) {
				phi = (md - 2 * Math.pow(m.elements[n - 1], 2) - 2 * Math.pow(m.elements[n - 2], 2)) / (1 - 2 * Math.pow(an, 2) - 2 * Math.pow(ann, 2));
			} else {
				phi = (md - 2 * Math.pow(m.elements[n - 1], 2)) / (1 - 2 * Math.pow(an, 2));
			}

			var a = new vector.Vector([]);
			if (n > 5) {
				a.push(-an);
				a.push(-ann);
				for (var i = 2; i < n - 2; i++) {
					a.push(m.elements[i] * Math.pow(phi, -1 / 2));
				}
				a.push(ann);
				a.push(an);
			} else {
				a.push(-an);
				for (var i = 1; i < n - 1; i++) {
					a.push(m.elements[i] * Math.pow(phi, -1 / 2));
				}
				a.push(an);
			}

			// w

			result.w = Math.pow(a.multiply(xx).sum(), 2) / xx.ss();

			// p

			var g, mu, sigma;

			if (n < 12) {
				var gamma = 0.459 * n - 2.273;
				g = - Math.log(gamma - Math.log(1 - result.w));
				mu = -0.0006714 * Math.pow(n, 3) + 0.025054 * Math.pow(n, 2) - 0.39978 * n + 0.5440;
				sigma = Math.exp(-0.0020322 * Math.pow(n, 3) + 0.062767 * Math.pow(n, 2) - 0.77857 * n + 1.3822);
			} else {
				var u = Math.log(n);
				g = Math.log(1 - result.w);
				mu = 0.0038915 * Math.pow(u, 3) - 0.083751 * Math.pow(u, 2) - 0.31082 * u - 1.5851;
				sigma = Math.exp(0.0030302 * Math.pow(u, 2) - 0.082676 * u - 0.4803);
			}

			var z = (g - mu) / sigma;
			var norm = new distributions.StandardNormal();
			result.p = 1 - norm.distr(z);

			return result;
		};

		module.exports.Normality = Normality;
	}, { "./distributions": 6, "./matrix": 8, "./vector": 16 }], 12: [function (require, module, exports) {
		Numeric = function () { };

		/*
		 * adaptive Simpson
		 */

		Numeric._adaptive = function (f, a, b, eps, s, fa, fb, fc, depth) {
			var c = (a + b) / 2;
			var h = b - a;
			var d = (a + c) / 2;
			var e = (c + b) / 2;
			var fd = f(d);
			var fe = f(e);
			var left = (h / 12) * (fa + 4 * fd + fc);
			var right = (h / 12) * (fc + 4 * fe + fb);
			var s2 = left + right;
			if (depth <= 0 || Math.abs(s2 - s) <= 15 * eps) {
				return s2 + (s2 - s) / 15;
			} else {
				return this._adaptive(f, a, c, eps / 2, left, fa, fc, fd, depth - 1)
					+ this._adaptive(f, c, b, eps / 2, right, fc, fb, fe, depth - 1);
			}
		}

		Numeric.adaptiveSimpson = function (f, a, b, eps, depth) {
			var c = (a + b) / 2;
			var h = b - a;
			var fa = f(a);
			var fb = f(b);
			var fc = f(c);
			var s = (h / 6) * (fa + 4 * fc + fb);
			return this._adaptive(f, a, b, eps, s, fa, fb, fc, depth);
		}

		/*
		 * root finding: bisection
		 */

		Numeric.bisection = function (f, a, b, eps) {
			eps = typeof eps !== "undefined" ? eps : 1e-9;
			while (Math.abs(a - b) > eps) {
				if (f(a) * f((a + b) / 2) < 0) {
					b = (a + b) / 2;
				} else {
					a = (a + b) / 2;
				}
			}
			return (a + b) / 2;
		}

		/*
		 * root finding: secant
		 */

		Numeric.secant = function (f, a, b, eps) {
			eps = typeof eps !== "undefined" ? eps : 1e-9;
			var q = [a, b];
			while (Math.abs(q[0] - q[1]) > eps) {
				q.push((q[0] * f(q[1]) - q[1] * f(q[0])) / (f(q[1]) - f(q[0])));
				q.shift();
			}
			return (q[0] + q[1]) / 2;
		}

		module.exports.Numeric = Numeric;
	}, {}], 13: [function (require, module, exports) {
		var distributions = require('./distributions');

		Power = function () { };

		/*
		 * Sample size calculation
		 */

		Power.sampleSize = function (a, power, sd, effect) {
			var n = new distributions.Normal(0, 1);
			return (2 * Math.pow(n.inverse(1 - a / 2) + n.inverse(power), 2) * Math.pow(sd, 2)) / Math.pow(effect, 2);
		};

		module.exports.Power = Power;

	}, { "./distributions": 6 }], 14: [function (require, module, exports) {
		var distributions = require('./distributions');

		Regression = function () { };

		/*
		 * simple linear regression
		 */

		Regression.linear = function (x, y) {
			var result = {};
			result.n = x.length();

			// means

			var mx = x.mean();
			var my = y.mean();

			// parameters

			var rx = x.add(-mx);
			var ry = y.add(-my);

			var ssxx = rx.pow(2).sum();
			var ssyy = ry.pow(2).sum();
			var ssxy = rx.multiply(ry).sum();

			result.slope = ssxy / ssxx;
			result.intercept = my - result.slope * mx;

			// sum of squared residuals

			var ssr = y.add(x.multiply(result.slope).add(result.intercept).multiply(-1)).pow(2).sum();

			// residual standard error

			result.rse = Math.sqrt(ssr / (result.n - 2))

			// slope

			var tdistr = new distributions.T(result.n - 2);

			result.slope_se = result.rse / Math.sqrt(ssxx);
			result.slope_t = result.slope / result.slope_se;
			result.slope_p = 2 * (1 - tdistr.distr(Math.abs(result.slope_t)));

			// intercept

			result.intercept_se = result.rse / Math.sqrt(ssxx) / Math.sqrt(result.n) * Math.sqrt(x.pow(2).sum());
			result.intercept_t = result.intercept / result.intercept_se;
			result.intercept_p = 2 * (1 - tdistr.distr(Math.abs(result.intercept_t)));

			// R-squared

			result.rs = Math.pow(ssxy, 2) / (ssxx * ssyy);

			return result;
		};

		module.exports.Regression = Regression;
	}, { "./distributions": 6 }], 15: [function (require, module, exports) {
		var vector = require('./vector');
		var distributions = require('./distributions');

		StudentT = function () { };

		StudentT.test = function (first, second) {
			if (second instanceof vector.Vector) {
				return this._twosample(first, second);
			} else {
				return this._onesample(first, second);
			}
		};

		/*
		 * two-sample Student's t-test
		 */

		StudentT._twosample = function (first, second) {
			var result = {};
			result.se = Math.sqrt((first.variance() / first.length()) + (second.variance() / second.length()));
			result.t = (first.mean() - second.mean()) / result.se;
			result.df = first.length() + second.length() - 2;
			var tdistr = new distributions.T(result.df);
			result.p = 2 * (1 - tdistr.distr(Math.abs(result.t)));
			return result;
		};

		/*
		 * one-sample Student's t-test
		 */

		StudentT._onesample = function (sample, mu) {
			var result = {};
			result.sample = sample;
			result.mu = mu;
			result.se = Math.sqrt(result.sample.variance()) / Math.sqrt(result.sample.length());
			result.t = (result.sample.mean() - result.mu) / result.se;
			result.df = result.sample.length() - 1;
			var tdistr = new distributions.T(result.df);
			result.p = 2 * (1 - tdistr.distr(Math.abs(result.t)));
			return result;
		};

		module.exports.StudentT = StudentT;
	}, { "./distributions": 6, "./vector": 16 }], 16: [function (require, module, exports) {
		Vector = function (elements) {
			this.elements = elements;
		};

		Vector.prototype.push = function (value) {
			this.elements.push(value);
		};

		Vector.prototype.map = function (fun) {
			return new Vector(this.elements.map(fun));
		};

		Vector.prototype.length = function () {
			return this.elements.length;
		};

		Vector.prototype.concat = function (x) {
			return new Vector(this.elements.slice(0).concat(x.elements.slice(0)));
		};

		Vector.prototype.abs = function () {
			var values = [];
			for (var i = 0; i < this.elements.length; i++) {
				values.push(Math.abs(this.elements[i]));
			}
			return new Vector(values);
		};

		Vector.prototype.dot = function (v) {
			var result = 0;
			for (var i = 0; i < this.length(); i++) {
				result = result + this.elements[i] * v.elements[i];
			}
			return result;
		};

		Vector.prototype.sum = function () {
			var sum = 0;
			for (var i = 0, n = this.elements.length; i < n; ++i) {
				sum += this.elements[i];
			}
			return sum;
		};

		Vector.prototype.log = function () {
			var result = new Vector(this.elements.slice(0));
			for (var i = 0, n = this.elements.length; i < n; ++i) {
				result.elements[i] = Math.log(result.elements[i]);
			}
			return result;
		};

		Vector.prototype.add = function (term) {
			var result = new Vector(this.elements.slice(0));
			if (term instanceof Vector) {
				for (var i = 0, n = result.elements.length; i < n; ++i) {
					result.elements[i] += term.elements[i];
				}
			} else {
				for (var i = 0, n = result.elements.length; i < n; ++i) {
					result.elements[i] += term;
				}
			}
			return result;
		};

		Vector.prototype.subtract = function (term) {
			return this.add(term.multiply(-1));
		};

		Vector.prototype.multiply = function (factor) {
			var result = new Vector(this.elements.slice(0));
			if (factor instanceof Vector) {
				for (var i = 0, n = result.elements.length; i < n; ++i) {
					result.elements[i] = result.elements[i] * factor.elements[i];
				}
			} else {
				for (var i = 0, n = result.elements.length; i < n; ++i) {
					result.elements[i] = result.elements[i] * factor;
				}
			}
			return result;
		};

		Vector.prototype.pow = function (p) {
			var result = new Vector(this.elements.slice(0));
			if (p instanceof Vector) {
				for (var i = 0, n = result.elements.length; i < n; ++i) {
					result.elements[i] = Math.pow(result.elements[i], p.elements[i]);
				}
			} else {
				for (var i = 0, n = result.elements.length; i < n; ++i) {
					result.elements[i] = Math.pow(result.elements[i], p);
				}
			}
			return result;
		};

		Vector.prototype.mean = function () {
			var sum = 0;
			for (var i = 0, n = this.elements.length; i < n; ++i) {
				sum += this.elements[i];
			}
			return sum / this.elements.length;
		};

		Vector.prototype.geomean = function () {
			return Math.exp(this.log().sum() / this.elements.length);
		};

		Vector.prototype.sortElements = function () {
			var sorted = this.elements.slice(0);
			for (var i = 0, j, tmp; i < sorted.length; ++i) {
				tmp = sorted[i];
				for (j = i - 1; j >= 0 && sorted[j] > tmp; --j) {
					sorted[j + 1] = sorted[j];
				}
				sorted[j + 1] = tmp;
			}
			return sorted;
		};

		Vector.prototype._ecdf = function (x) {
			var sorted = this.sortElements();
			var count = 0;
			for (var i = 0; i < sorted.length && sorted[i] <= x; i++) {
				count++;
			}
			return count / sorted.length;
		};

		Vector.prototype.ecdf = function (arg) {
			if (arg instanceof Vector) {
				var result = new Vector([]);
				for (var i = 0; i < arg.length(); i++) {
					result.push(this._ecdf(arg.elements[i]));
				}
				return result;
			} else {
				return this._ecdf(arg);
			}
		};

		Vector.prototype.sort = function () {
			return new Vector(this.sortElements());
		};

		Vector.prototype.min = function () {
			return this.sortElements()[0];
		};

		Vector.prototype.max = function () {
			return this.sortElements().pop();
		};

		Vector.prototype.toString = function () {
			return "[" + this.elements.join(", ") + "]";
		};

		/*
		 * unbiased sample variance
		 */

		Vector.prototype.variance = function () {
			return this.ss() / (this.elements.length - 1);
		};

		/*
		 * biased sample variance
		 */

		Vector.prototype.biasedVariance = function () {
			return this.ss() / this.elements.length;
		};

		/*
		 * corrected sample standard deviation
		 */

		Vector.prototype.sd = function () {
			return Math.sqrt(this.variance());
		};

		/*
		 * uncorrected sample standard deviation
		 */

		Vector.prototype.uncorrectedSd = function () {
			return Math.sqrt(this.biasedVariance());
		};

		/*
		 * standard error of the mean
		 */

		Vector.prototype.sem = function () {
			return this.sd() / Math.sqrt(this.elements.length);
		};

		/*
		 * total sum of squares
		 */

		Vector.prototype.ss = function () {
			var m = this.mean();
			var sum = 0;
			for (var i = 0, n = this.elements.length; i < n; ++i) {
				sum += Math.pow(this.elements[i] - m, 2);
			}
			return sum;
		};

		/*
		 * residuals
		 */

		Vector.prototype.res = function () {
			return this.add(-this.mean());
		};

		Vector.prototype.kurtosis = function () {
			return this.res().pow(4).mean() / Math.pow(this.res().pow(2).mean(), 2);
		};

		Vector.prototype.skewness = function () {
			return this.res().pow(3).mean() / Math.pow(this.res().pow(2).mean(), 3 / 2);
		};

		Sequence.prototype = new Vector();

		Sequence.prototype.constructor = Sequence;

		function Sequence(min, max, step) {
			this.elements = [];
			for (var i = min; i <= max; i = i + step) {
				this.elements.push(i);
			}
		};

		module.exports.Vector = Vector;
		module.exports.Sequence = Sequence;

	}, {}]
}, {}, [1]);