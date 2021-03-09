var express = require('express');
var app = express();
app.listen(8000)
var io = require('socket.io')(8888,{cors:true});
var room = [];
var time = new Date().getTime();
var uuid = require('uuid')
const multer = require('multer');
const { diskStorage } = require('multer');
var file = '';
app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
      res.send(200);
    }
    else {
      next();
    }
  });
app.use('/img',express.static(__dirname + '/img'))
app.use(multer({dest: __dirname + '/img'}).single('file'));
app.post('/list',(req,res)=>{
    file = req.file;
    file.url = `http://192.168.43.247:8000/img/${file.filename}`
    res.send('1')
})
io.on('connection',function(socket){
    function list(){
        // 发送房间列表
        io.emit('list',room);
    }

    if(room.length == 0){
        room.push({id:'room',name:'综合频道',num:0,msg:[]})
    } else{

    }
    list();

    // 离开房间
    socket.on('get',()=>{
        socket.leave(socket.myRoom)
        let index = 0;
        for(let i of room){
                if(i.id == socket.myRoom){
                    // 房间没人了，除了综合频道全部摧毁
                    if(!io.sockets.adapter.rooms[socket.myRoom]){
                        // console.log(i)
                        if(i.id == 'room'){
                            i.num = 0;
                        } else{
                            i.num = 0
                            let _index = index
                                setTimeout(function(){
                                    if(!io.sockets.adapter.rooms[socket.myRoom]){
                                        room.splice(_index,1)
                                        list();
                                    }
                                },120000)
                        }
                    } else{
                        i.num = io.sockets.adapter.rooms[socket.myRoom].length
                        io.to(socket.myRoom).emit('room',i,0)
                    }
                }
                index++;
        }
        list();
    })
    // 断开连接离开房间
    socket.on('disconnect',()=>{
        let index = 0;
        for(let i of room){
                if(i.id == socket.myRoom){
                    // 房间没人了，除了综合频道全部摧毁
                    if(!io.sockets.adapter.rooms[socket.myRoom]){
                        // console.log(i)
                        if(i.id == 'room'){
                            i.num = 0;
                        } else{
                            i.num = 0
                            let _index = index;
                            setTimeout(function(){
                                if(!io.sockets.adapter.rooms[socket.myRoom]){
                                    room.splice(_index,1)
                                    list();
                                }
                            },10000)
                        }
                    } else{
                        i.num = io.sockets.adapter.rooms[socket.myRoom].length
                        io.to(socket.myRoom).emit('room',i,'name')
                    }
                }
                index++;
        }
        list();
    })
    



    // 创建房间
    socket.on('addRoom',(_room)=>{
        if(socket.addRoom){
            return socket.emit('id',0)
        }
        let id = uuid.v1();
        socket.emit('id',id)
        socket.addRoom = id
        let obj = {id:id, name:_room.name, password:_room.password, maxNum:_room.maxNum, roomHost: _room.roomHost, num:1, msg:[]}
        room.push(obj);
    })


    // 加入房间
    socket.on('room',(_room,name)=>{
        socket.join(_room)
        socket.myRoom = _room
        socket.myName = name
        for(i of room){
            if(i.id == _room){
                // console.log(i)
                // console.log(io.sockets.adapter.rooms)
                // console.log(_room)
                i.num = io.sockets.adapter.rooms[_room].length
                io.to(socket.myRoom).emit('room',i,name)
            }
        }
        list(); 
    })   

    // 解散房间
    socket.on('delRoom',(id)=>{
        let index = 0;
        for(let i of room){
            if(i.id == id){
                room.splice(index,1)
                socket.broadcast.to(socket.myRoom).emit('del',0)
            }
            index++;
        }
    })

    // 发送消息
    socket.on('msg',(msg,login,key)=>{
        let _time = new Date().getTime();
        for(let i of room){
            if(i.id ==socket.myRoom){
                if((_time - time) > 60000){
                    time = new Date().getTime();
                    i.msg.push({time:new Date().toLocaleTimeString()})
                }
                // 进入
                if(msg == 1){
                    i.msg.push({userName:socket.myName})
                    return io.to(socket.myRoom).emit('msg',i.msg)
                }
                // 离开
                if(msg == 2){
                    i.msg.push({userName1:socket.myName})
                    return io.to(socket.myRoom).emit('msg',i.msg)
                }
                // 图片
                if(key == 1){
                    i.msg.push({msg:file,qq:login.qq,name:login.name})
                    return io.to(socket.myRoom).emit('msg',i.msg)
                }
                i.msg.push({msg:msg,qq:login.qq,name:login.name})
                io.to(socket.myRoom).emit('msg',i.msg)
            }
        }
    })



    
})