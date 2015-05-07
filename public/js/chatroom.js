var socket = io.connect();
socket.on('hello', function(data){
  console.log(data);
});