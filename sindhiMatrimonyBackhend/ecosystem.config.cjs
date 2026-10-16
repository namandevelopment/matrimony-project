module.exports = {
  apps: [
    {
      name: "sindhi-matrimony-api",
      script: "./index.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
    {
      name: "sindhi-matrimony-worker",
      script: "./worker/index.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "development",
        RUN_BACKGROUND: "true",
      },
      env_production: {
        NODE_ENV: "production",
        RUN_BACKGROUND: "true",
      },
    },
  ],
};
