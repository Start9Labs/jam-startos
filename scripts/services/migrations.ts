import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration =
  compat.migrations.fromMapping(
    {
      "0.3.0.1": {
        up: compat.migrations.updateConfig(
          (config: any) => {
            return {
              // [v0.3.0~1]: For any already-existing joinarmket config, disable Darkscience IRC and enable hackint for order book aggregation/making/taking
              compat.run({ method: "exec", args: ["sed -i '94,110 s/^\s*#*/#/;126,127 s/^\s*#\s*//;134,139 s/^\s*#//' /root/.joinmarket/joinmarket.cfg"] });
            };
          },
          true,
          { version: "0.3.0.1", type: "up" }
        ),
      },
    },
    "0.3.0.1"
  );
