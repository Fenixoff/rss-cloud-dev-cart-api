module.exports = (options, webpack) => {
  const lazyImports = [
    '@nestjs/microservices/microservices-module',
    '@nestjs/websockets/socket-module',
    'amqplib',
    'amqp-connection-manager',
    'ioredis',
    'nats',
    'mqtt',
    'kafkajs',
    '@grpc/proto-loader',
    '@grpc/grpc-js',
  ];

  return {
    ...options,
    externals: [],
    output: {
      ...options.output,
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
