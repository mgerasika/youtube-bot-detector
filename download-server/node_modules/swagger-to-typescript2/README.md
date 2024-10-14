## Generate typescript code from swagger spec.
![image](https://user-images.githubusercontent.com/10614750/230363977-89f3c28b-d8b8-4628-be68-f006762b1ebc.png)


### Example
```
const res = fs.readFileSync("../spec.json").toString();
const doc = getDoc(JSON.parse(res));
if (!doc) {
  throw "Document cannot be null";
}
const tsCode = swaggerToTypescript(doc);
writeTsToFile(`src/api.generated.ts`, tsCode);
```
