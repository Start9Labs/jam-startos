import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration =
  compat.migrations.fromMapping(
    {
      "0.3.0.1": {
        up: compat.migrations.updateConfig(
          async (config, effects) => {
            // [v0.3.0~1]: As a clean means of changing IRC server preferences for order book aggregation,
            // backup any already-existing joinarmket.cfg, inducing Jam to replace the user's preferences with a copy from /root/default.cfg
            const jmConfigPath = "joinmarket.cfg";

            let count = 0;
            const range: string[] = [];
            let jmConfigContent: string[] = [];

            try {
              jmConfigContent = (
                await effects.readFile({ volumeId: "jam", path: jmConfigPath })
              ).split("\n");
            } catch (e) {
              effects.error(e);
              return { result: { configured: false } };
            }

            for (const line of jmConfigContent) {
              if (line.includes("IRC SERVER")) {
                count++;
                const startLineNumber = jmConfigContent.indexOf(line) + 1;

                if (
                  count === 1 &&
                  jmConfigContent[startLineNumber]?.includes("socks5_port = ")
                ) {
                  range[0] = `1,${startLineNumber - 1}`;
                  range[1] = `${startLineNumber},${jmConfigContent.indexOf(
                    "",
                    startLineNumber
                  )}`;
                } else if (count === 2) {
                  range[2] = `${startLineNumber},${jmConfigContent.indexOf(
                    "",
                    startLineNumber
                  )}`;
                } else if (count === 3) {
                  range[3] = `${startLineNumber},${jmConfigContent.length}`;
                }
              }
            }

            let newJMConfig = "";
            for (const r of range) {
              const [start, end] = r.split(",").map((x) => parseInt(x));

              for (let i = start - 1; i < end; i++) {
                if (count === 1 && range[0] === r) {
                  newJMConfig += `#${jmConfigContent[i].trim()}\n`; // Comment out server1: Darkscience IRC
                } else if (count === 2 && range[2] === r) {
                  newJMConfig += `${jmConfigContent[i]}\n`;
                } else if (count === 3 && range[3] === r) {
                  newJMConfig += jmConfigContent[i].startsWith("#")
                    ? jmConfigContent[i]
                        .slice(1)
                        .replace("channel = ", "# channel = ")
                    : `#${jmConfigContent[i]}`; // Uncomment server3: hackint and replace `channel = ` with `# channel = `
                } else {
                  newJMConfig += `${jmConfigContent[i]}\n`;
                }
              }
            }
            try {
              await effects.writeFile({
                volumeId: "jam",
                path: `${jmConfigPath}.pre-v0.3.0~1.cfg`,
                toWrite: newJMConfig,
              });
            } catch (e) {
              throw e;
            }
            return config;
          },
          true,
          { version: "0.3.0.1", type: "up" }
        ),
        down: () => {
          // TODO adjust if this is not true
          throw new Error("Cannot downgrade this version");
        },
      },
    },
    "0.3.0.1"
  );
