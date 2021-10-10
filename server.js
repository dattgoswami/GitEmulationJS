// You are welcome to drop express for any other server implementation
const express = require("express");
const server = express();
const cors = require("cors");
// The tests exercise the server by requiring it as a module,
// rather than running it in a separate process and listening on a port
module.exports = server;
let repositoryMap = new Map();
let objectDataMap = new Map();
let tempSet = new Set();
//initializing with some mock data as we do not have post method
tempSet.add("file1");
tempSet.add("file2");
repositoryMap.set("somerepo", tempSet);
objectDataMap.set("file1", 123);
objectDataMap.set("file2", 546);
if (require.main === module) {
  // Start server only when we run this on the command line and explicitly ignore this while testing
  const port = process.env.PORT || 3000;
  server.use(cors());
  server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
  server.get("/", function (req, res) {
    res.send(
      "endpoints availabe are /data/{repository}/:objectID [GET], /data/{repository}/:objectID [DELETE], /data/{repository} [PUT]"
    );
  });
  //we can use this if we have our routes defined separately if we have many routes
  //they can be kept inside folder routes/api/data.js
  //we can also have a routes/index.js which contains a routes endpoint which could be a collection of all the endpoints
  //server.use("/data",data);
  server.get("/data/:repository/:objectID", function (req, res) {
    const id = req.params.objectID;
    const repository = req.params.repository;
    if (repositoryMap.has(repository)) {
      let dataSize = objectDataMap.get(id);
      let resultResponse = JSON.stringify({ oid: id, size: dataSize });
      res.send(resultResponse);
    } else {
      res.send(`repository ${repository} is not available`);
    }
  });
  server.put("/data/:repository", function (req, res) {
    const repository = req.params.repository;
    const object = req.body.object;
    const sizeValue = req.body.size;

    let objectSet = new Set();
    if (repositoryMap.has(repository)) {
      objectSet = repositoryMap.get(repository);
      if (objectSet.has(object)) {
        res.json({ error: "object already exists in the repository" });
      } else {
        objectSet.add(object);
        objectDataMap.put(object, size);
        let resultResponse = JSON.stringify({ oid: object, size: sizeValue });
        res.json(resultResponse);
      }
    } else {
      objectSet.add(object);
      objectDataMap.put(object, size);
      repositoryMap.put(repository, objectSet);
      let resultResponse = JSON.stringify({ oid: object, size: sizeValue });
      res.json(resultResponse);
    }
  });
  server.delete("/data/:repository/:objectID", function (req, res) {
    const id = req.params.objectID;
    const repository = req.params.repository;
    if (repositoryMap.has(repository)) {
      repositoryMap.get(repository).delete(id);
      objectDataMap.delete(id);
    } else {
      res.json({ error: "no such repository exists" });
    }
  });
}
