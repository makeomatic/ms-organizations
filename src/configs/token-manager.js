module.exports = {
  tokenManager: {
    backend: {
      name: 'redis',
      prefix: 'tmanager!1.0.0',
    },
    encrypt: {
      algorithm: 'aes256',
      sharedSecret: 'replace-shared-secret-at-least-24-chars-long',
    },
  },
};
