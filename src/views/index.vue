<template>
  <div id="index">
    <div id="_room" v-if="!qq">
        <div class="room" v-for="(i,j) in list" @click="to(i)" :key="j">
          {{i.name}}
          <p>{{i.num}}人</p>
        </div>
    </div>
    <div id="add" @click="ad" v-if="!qq">自定义房间</div>
    <div class="mtk1" v-if="qq">
      Q   Q：<input type="text" v-model="login.qq"><br>
      <br>
      昵称：<input type="text" v-model="login.name"><br><br>
      <button @click="user">确定</button>
    </div>

    <div class="mtk" v-if="key">
      房间名：<input type="text" v-model="room.name"><br>
      <br>

      密 码：<input type="password" maxlength="6" v-model="room.password" placeholder="默认无密码"><br><br>
      最多人数：<input type="range" max="100" min="2" v-model="room.maxNum">
      <input class="range" v-model="room.maxNum" type="text">
      <br><br>
      <button @click="add">确定</button>
      <button @click="key = false">取消</button>
    </div>
    <!-- 房间密码 -->
    <div class="roomPass" v-if="key1">
      密码：<input type="password" v-model="pass"><br>
    </div>
    <!-- 黑屏 -->
    <div id="mtk_bg" v-if="key"></div>
    <div id="mtk_bg" @click="key1 = false" v-if="key1"></div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      list:[],
      qq:false,
      key: false,
      key1: false,
      pass: '',
      login:{
        name: '',
        qq: ''
      },
      room:{
        name: '',
        password: '',
        maxNum: '50',
        roomHost: ''
      }
    }
  },
  watch:{
    pass(i){
      if(i === this.key1){
        this.key1 = false
        this.$router.push('/room/'+ this.passRoom)
      }
    }
  },
  methods: {
    init(){
      var socket = this.$socket
        // 获取房间列表
        this.sockets.listener.subscribe('list', (msg)=>{
          this.list = msg
        })
        socket.emit('get',1)
    },
    // 确定qq号码
    user(){
      if(this.login.name && this.login.qq){
        // console.log(`https://q2.qlogo.cn/headimg_dl?dst_uin=${this.login.qq}&spec=100`)
        this.login.qq = `https://q2.qlogo.cn/headimg_dl?dst_uin=${this.login.qq}&spec=100`
        this.$store.commit('add',this.login)
        this.qq = false
        localStorage.login = JSON.stringify(this.login)
      }
      
    },
    // 进入指定房间
    to(i){
      if(i.roomHost == JSON.parse(localStorage.login).name){
        return this.$router.push('/room/'+i.id)
      }
      // 判断房间是否需要密码
      console.log(i)
      if(i.maxNum <= i.num){
        return alert('房间人数已满！')
      } else if(i.password){
        this.key1 = i.password
        this.passRoom = i.id
      } else{
        this.$router.push('/room/'+i.id)
      }
      
    },
    // 自定义房间
    ad(){
      this.key = true;
      this.room.name = JSON.parse(localStorage.login).name + '的房间'
    },
    add(){
      this.key = false;
      this.room.roomHost = JSON.parse(localStorage.login).name
      this.$socket.emit('addRoom',this.room)
    }
  },
  created(){
    if(!localStorage.login){
        this.qq = true
    }
		this.$store.commit('add',JSON.parse(localStorage.login))
		//  localStorage.removeItem('login')
		this.init()
  }
}
</script>
<style lang="less">
html, body, #app, #index{
  width: 100%;
  padding: 0;
  margin: 0;
  background: rgb(248, 245, 245);
}
.roomPass{
  margin:0 auto;
  width: 70%;
  z-index: 9999;
  height: 10rem;
  line-height: 10rem;
  position: fixed;
  transform: translate(-50%,-5rem);
  left:50%;
  border-radius: 12px;
  top:50%;
  text-align: center;
  background:rgb(109, 130, 252);
}
#mtk_bg{
  width:100%;
  height:1000px;
  position:fixed;
  top:0;
  opacity: 0.2;
  background:#000;
  z-index: 0;
}
#_room{
  max-height: 33rem;
  overflow-y: auto;
}
.room{
  user-select: none;
  width:90%;
  position: relative;
  text-align: center;
  line-height: 10rem;
  margin: 1rem auto;
  height:10rem;
  border-radius: 12px;
  background:#fff;
  p{
    line-height: 0;
    position:absolute;
    bottom:0;
    right: 1rem;
  }
}
.mtk{
  width:70%;
  position: fixed;
  top:40%;
  left:50%;
  z-index: 9999;
  padding: 10% 10% 20% 0;
  border-radius: 12px;
  transform: translate(-50%,-5rem);
  text-align: right;
  height: 7rem;
  background: rgb(109, 130, 252);
  .range{
    width: 1rem;
  }
  button{
    // border-radius: 12px;
    border: 0px;
    width: 5rem;
    height: 2rem;
    margin-right:5%;
  }
}
.mtk1{
  width:70%;
  position: fixed;
  top:40%;
  left:50%;
  padding: 10% 0 10% 0;
  border-radius: 12px;
  transform: translate(-50%,-5rem);
  text-align: center;
  z-index: 999;
  height: 7rem;
  background: rgb(109, 130, 252);
  button{
    // border-radius: 12px;
    border: 0px;
    width: 5rem;
    height: 2rem;
  }
}
#add{
  user-select: none;
  width:50%;
  height:5rem;
  background: rgb(74, 180, 122);
  margin: 1rem auto;
  line-height: 5rem;
  text-align: center;
  border-radius: 12px;
}
#add:active{
  background: cornflowerblue;
}
</style>
