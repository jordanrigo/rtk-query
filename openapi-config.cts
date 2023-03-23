import type { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
  schemaFile: "https://petstore3.swagger.io/api/v3/openapi.json",
  apiFile: "./src/store/emptyApi.ts",
  apiImport: "emptySplitApi",
  hooks: true,
  outputFiles: {
    "./src/services/userApi.ts": {
      filterEndpoints: [/user/i],
    },
    "./src/services/orderApi.ts": {
      filterEndpoints: [/order/i],
    },
    "./src/services/petApi.ts": {
      filterEndpoints: [/pet/i],
    },
  },
};

export default config;
