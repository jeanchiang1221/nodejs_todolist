const http = require('http');
const { v4: uuidv4 } = require('uuid');

const todos=[];
const errHandle = require('./errorHandle'); //匯入

const requestListener = (req, res)=>{
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body="";
    req.on('data',chunk=>{
        body+=chunk;
    })


    if(req.url=="/todos" && req.method == "GET"){
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "success(GET!)",
            "data": todos,
        }));
        res.end();
    }
    else if(req.url.startsWith("/todos/") && req.method == "DELETE"){
      const id =req.url.split('/').pop();//split變成陣列後，pop取出最後一個
      const index = todos.findIndex(element=>element.id ==id); //會將陣列中的「每一個」元素帶入指定的函式內做判斷，並會回傳第一個符合判斷條件元素的位置號碼，如果沒有元素符合則會回傳 -1。
      if(index!==-1){
        todos.splice(index,1);
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "success(Delete)",
            "data": todos,
        }));
        res.end();
      }
      else{
        errHandle(res);
      }
      
    }
    else if(req.url.startsWith("/todos/") && req.method == "PATCH"){
      req.on('end', () => {
        try {
          const revisedTitle = JSON.parse(body).title;
          const id =req.url.split('/').pop();//split變成陣列後，pop取出最後一個
          const index = todos.findIndex(element=>element.id ==id);
          

          if(revisedTitle!==undefined && index!==1){
          todos[index].title=revisedTitle;

          res.writeHead(200,headers);
          res.write(JSON.stringify({
              "status": "success(PATCh)",
              "data": todos,
          }));
          res.end();
          }
          else{
            errHandle(res);
          }

        } catch (er) {
          errHandle(res);
        }
      });
      
    }
    else if(req.url=="/todos" && req.method == "DELETE"){
      todos.length=0;
      res.writeHead(200,headers);
      res.write(JSON.stringify({
          "status": "success(Delete)",
          "data": todos,
      }));
      res.end();
    }
    else if(req.url=="/todos" && req.method == "POST"){

        req.on('end', () => {
            try {
              const title = JSON.parse(body).title;

              if(title!==undefined){
              // Write back something interesting to the user:
              const todo={
                "title":title,
                "id":uuidv4()
              };
              todos.push(todo);
              res.writeHead(200,headers);
              res.write(JSON.stringify({
                  "status": "success(POST)",
                  "data": todo,
              }));
              res.end();
              }
              else{
                errHandle(res);
              }

            } catch (er) {
              errHandle(res);
            }
          });

    }
    
    else if(req.method == "OPTIONS"){
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": "OPTIONS",
        }));
        res.end();
    }else{
      const id =req.url.split('/').pop();
        res.writeHead(404,headers);
        console.log(id,req.url,req.method,)
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
    
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);