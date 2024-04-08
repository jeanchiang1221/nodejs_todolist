const http = require("http");
const { v4: uuidv4 } = require("uuid");

const todos = [];
const errHandle = require("./errorHandle"); //匯入
const successHandle = require("./successHandle");

const requestListener = (req, res) => {
  let body = ""; //把接到的資料轉成字串
  req.on("data", (chunk) => {
    body += chunk; //分次搬運回來
  });

  if (req.url == "/todos" && req.method == "GET") {
    successHandle(res, req.method, todos);
  } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    const id = req.url.split("/").pop(); //split變成陣列後，pop取出最後一個
    const index = todos.findIndex((element) => element.id == id); //會將陣列中的「每一個」元素帶入指定的函式內做判斷，並會回傳第一個符合判斷條件元素的位置號碼，如果沒有元素符合則會回傳 -1。
    if (index !== -1) {
      todos.splice(index, 1);
      successHandle(res, req.method, todos);
    } else {
      errHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on("end", () => {
      try {
        const revisedTitle = JSON.parse(body).title;
        const id = req.url.split("/").pop(); //split變成陣列後，pop取出最後一個
        const index = todos.findIndex((element) => element.id == id); //找到對應資料索引值

        if (revisedTitle !== undefined && index !== -1) {
          todos[index].title = revisedTitle;
          successHandle(res, req.method, todos);
        } else {
          errHandle(res);
        }
      } catch (er) {
        errHandle(res);
      }
    });
  } else if (req.url == "/todos" && req.method == "DELETE") {
    todos.length = 0; //最簡單把陣列清空的方法
    successHandle(res, req.method, todos);
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title; //取到傳回來的內容

        if (title !== undefined) {
          // Write back something interesting to the user:
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          successHandle(res, req.method, todos);
        } else {
          errHandle(res);
        }
      } catch (er) {
        errHandle(res);
      }
    });
  } else if (req.method == "OPTIONS") {
    successHandle(res, req.method, todos);
  } else {
    const id = req.url.split("/").pop();
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005); //process.env.PORT是根據雲端服務自動調整port號
