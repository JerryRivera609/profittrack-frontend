const cucumberConfig = {
  format: ["progress-bar"],
  require: ["tests/bdd/**/*.ts"],
  paths: ["tests/bdd/features/**/*.feature"],
  publishQuiet: true,
};

export default cucumberConfig;
