const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("todo.proto", {})
const grpcObject = grpc.loadPackageDefinition(packageDef)
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("localhost:40000", grpc.ServerCredentials.createInsecure());
server.addService(todoPackage.Todo.service, {

    "createTodo" : createTodo,
    "readTodos" : readTodos,
    "readTodosStream" : readTodosStream

})

server.start();

const todos = [];

function readTodosStream(call, callback) {
    todos.forEach(t => call.write(t));
    call.end();
}


function createTodo(call, callback) {
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem)
    callback(null, todoItem);
}


function readTodos(call, callback) {
    callback(null, {"items": todos})
}


