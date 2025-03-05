import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration =
  compat.migrations.fromMapping(
    {
      "0.3.0.1": {
        up: compat.migrations.updateConfig(
          (config: any) => {
            return {
              // [v0.3.0~1]: As a clean means of changing IRC server preferences for order book aggregation,
              // backup any already-existing joinarmket.cfg, inducing Jam to replace the user's preferences with a copy from /root/default.cfg
              compat.run({ method: "exec", args: ["mv /root/.joinmarket/joinmarket.cfg /root/.joinmarket/joinmarket.old.cfg"] });
            };
          },
          true,
          { version: "0.3.0.1", type: "up" }
        ),
      },
    },
    "0.3.0.1"
  );
