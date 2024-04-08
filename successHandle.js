const headers = require("./headers");
function successHandle(res, method, todos) {
  res.writeHead(200, headers);
  res.write(
    JSON.stringify({
      status: "success",
      method: method,
      data: todos,
    })
  );
  res.end();
}

module.exports = successHandle; //要記得匯出
