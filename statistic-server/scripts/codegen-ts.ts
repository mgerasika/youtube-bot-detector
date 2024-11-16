import {
  StringBuilder,
  getDoc,
  swaggerToTypescript,
} from "swagger-to-typescript2";
import prettier from "prettier";
const fs = require("fs");
const path = require("path");

const INSERT_START = "// INSERT START";
const INSERT_END = "// INSERT END";

export const writeTsToFile = (outFile: string, content: string): void => {
  const sb = new StringBuilder();
  const indexContent = fs.readFileSync(outFile).toString();
  const startIndex = indexContent.indexOf(INSERT_START) + INSERT_START.length;
  const endIndex = indexContent.indexOf(INSERT_END);
  sb.append(indexContent.substring(0, startIndex));

  sb.append(content);

  sb.appendLine(indexContent.substring(endIndex));
  const fullPath = path.resolve(outFile);
  fs.writeFileSync(fullPath, sb.toString());

  try {
    formatFile(outFile, outFile);
  } catch {
    console.error("format with prettier error " , fullPath);
  }
  console.log("generate typescript code success ", fullPath);
};

const formatFile = (inputFilePath: string, outputFilePath: string): void => {
  const fileContent = fs.readFileSync(inputFilePath, "utf8");
  prettier.resolveConfig(inputFilePath).then((prettierConfig) => {
    fs.writeFileSync(
      outputFilePath,
      prettier.format(fileContent, {
        ...prettierConfig,
        filepath: inputFilePath,
      })
    );
  });
};

const res = fs.readFileSync("../spec-server.json").toString();
const doc = getDoc(JSON.parse(res));
if (!doc) {
  throw "Document cannot be null";
}
const tsCode = swaggerToTypescript(doc);
writeTsToFile(`src/api.generated.ts`, tsCode);
