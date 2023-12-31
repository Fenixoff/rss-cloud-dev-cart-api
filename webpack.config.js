module.exports = (options, webpack) => {
  const TerserPlugin = require('terser-webpack-plugin');

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
    mode: 'production',
    target: 'node',
    entry: 'src/main.lambda.ts',
    externals: [],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
          },
        }),
      ],
    },
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
