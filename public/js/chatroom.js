var socket = io();
socket.on('hello', function(data){
  console.log(data);
  alert(data.toString());
});