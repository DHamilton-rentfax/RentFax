// Patch console methods to hide noisy Firebase Studio and VSCode logs
if (process.env.NEXT_PUBLIC_DEV_CLEAN_CONSOLE === 'true') {
  const noisyPatterns = [
    /workbench\.js/,
    /Extension Host/,
    /Rpc timed out/,
    /permissions policy/,
    /Failed to load resource/,
  ];

  ['log', 'info', 'warn', 'error'].forEach((method) => {
    const original = console[method];
    console[method] = (...args) => {
      const firstArg = args[0];
      if (
        typeof firstArg === 'string' &&
        noisyPatterns.some((p) => p.test(firstArg))
      ) {
        return; // Skip noisy log
      }
      original(...args);
    };
  });
}
