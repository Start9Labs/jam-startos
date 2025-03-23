import { compat, types as T } from "../deps.ts";
//import * as fs from "node:fs";
//import { readFileSync, writeFileSync } from "fs";
import { writeFile } from "node:fs/promises";

export const migration: T.ExpectedExports.migration =
  compat.migrations.fromMapping(
    {
      "0.3.0.1": {
        up: compat.migrations.updateConfig(
          (config: any) => {
            // [v0.3.0~1]: As a clean means of changing IRC server preferences for order book aggregation,
            // backup any already-existing joinarmket.cfg, inducing Jam to replace the user's preferences with a copy from /root/default.cfg
            const jmConfigPath = "/root/.joinmarket/joinmarket.cfg";
            const jmBackupConfigPath = `${jmConfigPath}.pre-v0.3.0~1.cfg`;

            // Copy the config file to backup
            //fs.copyFileSync(jmConfigPath, jmBackupConfigPath);

            let count = 0;
            let range: string[] = [];
            const jmConfigContent = fs
              .readFileSync(jmConfigPath, "utf8")
              .split("\n");

            for (let line of jmConfigContent) {
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
            for (let r of range) {
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
            //fs.writeFileSync(jmBackupConfigPath, newJMConfig);
            try {
              await writeFile(jmBackupConfigPath, newJMConfig);
            } catch (e) {
              throw e;
            }
          },
          true,
          { version: "0.3.0.1", type: "up" }
        ),
      },
    },
    "0.3.0.1"
  );
