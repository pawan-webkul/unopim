'use strict';

/**
 * Drop-in replacements for request-wrapper verbs that wait and retry when the
 * API answers 429 (rate limit). Long or repeated runs against a single token
 * would otherwise fail with "Too Many Attempts" rather than on real defects.
 */
const rw = require('./request-wrapper');

const MAX_ATTEMPTS = 6;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function withRetry(fn) {
  return async (...args) => {
    let result;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      result = await fn(...args);

      if (result.status !== 429) return result;

      const wait = Number(result.headers['retry-after']) || 10;
      await sleep(Math.min(wait, 65) * 1000);
    }

    return result;
  };
}

module.exports = {
  get: withRetry(rw.get),
  post: withRetry(rw.post),
  put: withRetry(rw.put),
  patch: withRetry(rw.patch),
  delete: withRetry(rw.delete),
  /** Same contract as request-wrapper.deleteIfExists, but waits out 429s so cleanup actually runs. */
  deleteIfExists: async (request, token, path) => {
    try {
      await withRetry(rw.delete)(request, path, { token });
    } catch (_) {
      /* ignore */
    }
  },
};
