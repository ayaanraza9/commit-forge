const { aliasMap } = require('./constants');

function parseArgs(argv) {
  const positional = [];
  const flags = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--help' || token === '-h') {
      flags.help = true;
      continue;
    }

    if (token.startsWith('--')) {
      const [rawKey, inlineValue] = token.slice(2).split('=');
      const key = aliasMap[rawKey] ?? rawKey;

      if (inlineValue !== undefined) {
        flags[key] = inlineValue;
        continue;
      }

      const next = argv[i + 1];
      if (!next || next.startsWith('-')) {
        flags[key] = true;
        continue;
      }

      flags[key] = next;
      i += 1;
      continue;
    }

    if (token.startsWith('-') && token.length > 1) {
      const rawKey = token.slice(1);
      const key = aliasMap[rawKey] ?? rawKey;
      const next = argv[i + 1];

      if (!next || next.startsWith('-')) {
        flags[key] = true;
        continue;
      }

      flags[key] = next;
      i += 1;
      continue;
    }

    positional.push(token);
  }

  return { positional, flags };
}

module.exports = {
  parseArgs,
};

