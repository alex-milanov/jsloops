'use strict';

const compose = (...fList) => (...args) => fList.reduce(
	(r, f) => (r instanceof Array) && f.apply(null, r) || f(r), args
);

export default {
	compose
};
