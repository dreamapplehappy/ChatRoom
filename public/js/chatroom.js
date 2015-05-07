var socket = io.connect(http://180.150.179.49);
socket.on('hello', function(data){
  console.log(data);
  alert(data.toString());
});