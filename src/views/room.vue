<template>
  <div>
    <div class="head">
      <ion-icon @click="$router.replace('/')" class="i" name="chevron-back-outline"></ion-icon>
      <div>{{room.name}}（{{room.num}}）</div>
      <div class="del" @click="del" v-if="key == room.roomHost">解散群聊</div>
    </div>
    <div class="_head"></div>
    <div class="bg" id="bg" :style="{height:height}">

      <div :class="i.name === me.name && i.qq === me.qq?'_item':'item'" v-for="(i,j) in list" :key="j">
        <img :src="i.qq" v-if="i.qq" alt />
        <p class="name">{{i.name}}</p>
        <div class="message" v-if="i.name">
          <p class="msg" v-if="!i.msg.url">{{i.msg}}</p>
          <img :src="i.msg.url" v-if="i.msg.url" alt="">
        </div>
        <div class="add" v-if="i.userName">{{i.userName}}加入了房间</div>
        <div class="add" v-if="i.userName1">{{i.userName1}}离开了房间</div>
        <div class="add1" v-if="i.time">{{i.time}}</div>
      </div>

    </div>
    <div class="_bg" :style="{height:height}"></div>
    <div class="foot">
      <div class="bgFile">
        <input @change="img" type="file" ref="file" class="file" accept="image/*" name="" id="">
      </div>
      <input type="text" v-model="msg" />
      <button @click="go">发送</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: "",
      list: [],
      key: JSON.parse(localStorage.login).name,
      msg: '',
      userName: '',
      url: '',
      room: {
        name: '房间名字',
        num: 0
      },
      me: JSON.parse(localStorage.login)
    };
  },
  methods: {
    go() {
      if (this.msg) {
        var socket = this.$socket;
          socket.emit("msg", this.msg, this.$store.state.login);
          this.msg = ''
      }
    },
    img(){
      let file = this.$refs.file.files
      var formData = new FormData();
            formData.append('file',file[0])
            this.axios.post('http://192.168.0.104:8000/list',formData)
              .then(()=>{
                this.$socket.emit('msg','',this.$store.state.login,1);
              })
    },
    del(){
      this.$socket.emit('delRoom',this.room.id)
      this.$router.replace('/')
    }
  },
  destroyed  (){
    this.$socket.emit('msg',2)
  },
  mounted() {
    window.addEventListener("beforeunload",()=>{
      this.$socket.emit('msg',2)
    })

    this.$store.commit('add',JSON.parse(localStorage.login))
    var socket = this.$socket;
    this.sockets.listener.subscribe("room", (msg) => {
      this.room = {...msg[0]}
      this.userName = msg[1]
    });
    socket.emit("room", this.$route.params.id,JSON.parse(localStorage.login).name);
    socket.emit('msg',1)
    // 接收到消息
    this.sockets.listener.subscribe("msg", (msg) => {
      this.list= msg
      
      this.$nextTick(()=>{
        var div = document.getElementById('bg');
        div.scrollTop = div.scrollHeight;
      })
      // 获取背景高度
      this.height = window.screen.height + "px";
    });
  },
};
</script>

<style lang="less">
.add{
  text-align: center;
  color:#fff;
  width: 100%;
  clear:both;
}
.add1{
  text-align: center;
  color:#fff;
  width: 100%;
  clear:both;
}
._head {
  width: 100%;
  height: 2.5rem;
}
.head {
  width: 100%;
  z-index: 5;
  height: 2.5rem;
  line-height: 2.5rem;
  background: #fff;
  position: fixed;
  top: 0;
  .i {
    font-size: 2rem;
    float: left;
    // line-height: 5rem;
  }
  div {
    float: left;
  }
  .del{
  float:right;
  margin-right:2rem;
	position: relative;
	top:50%;
	transform: translateY(-50%);
  background: rgb(61, 167, 216);
  height: 2rem;
	width: 5rem;
  text-align: center;
  line-height: 2rem;
  border-radius:12px;
}
}
.bg {
  height: 500px;
  z-index: 2;
  overflow:scroll;
  clear: both;
  width: 100%;
  position: absolute;
  padding-bottom: 5rem;
  top: 2.5rem;
  left: 0;
  .item {
    width: 100%;
    height: auto;
    clear: both;
    img {
      display: block;
      float: left;
      width: 50px;
      padding: 1rem 0.5rem;
    }.name {
        color: #fff;
        padding-top: 0.2rem;
        font-size: 14px;
        float:left;
        text-align: left;
        width: 80%;
        display: block;
        // margin-left: 5rem;
      }
    .message {
      float: left;
      width: auto;
      max-width: 70%;
      min-width: 8%;
      img{
        width:70%;
        margin:-10% 0 0 -3%;
      }
      .msg {
        // max-width: 70%;
        background: #fff;
        clear: both;
        color: #000;
        display: block;
        padding: 0.5rem;
        border-radius: 12px;
        position:relative;
        bottom:1.5rem;
      }
    }
  }
  ._item {
    width: 100%;
    height: auto;
    clear: both;
    img {
      display: block;
      float: right;
      width: 50px;
      padding: 1rem 0.5rem;
    }.name {
        color: #fff;
        padding-top: 0.2rem;
        font-size: 14px;
        float:right;
        text-align: right;
        width: 80%;
        display: block;
        // margin-left: 5rem;
      }
    .message {
      float: right;
      width: auto;
      max-width: 70%;
      min-width: 8%;
      img{
        width:70%;
        margin:-10% -3% 0 0;
      }
      .msg {
        // max-width: 70%;
        background: #fff;
        clear: both;
        color: #000;
        display: block;
        padding: 0.5rem;
        border-radius: 12px;
        position:relative;
        bottom:1.5rem;
      }
    }
  }
}
._bg {
  clear: both;
  background: url("../assets/bg.jpg");
  width: 100%;
  z-index: 1;
  position: fixed;
  background-size: cover;
  // height: 100%;
  overflow: hidden;
}
.foot {
  width: 100%;
  clear: both;
  height: 3rem;
  background: rgb(236, 233, 233);
  position: fixed;
  z-index: 5;
  bottom: 0;
	box-sizing: border-box;
  input {
    height: 100%;
    width: 70%;
    border: 0;
		box-sizing: border-box;
  }
  .file{
    width:10%;
    height: 100%;
    opacity: 0;
  }
  .bgFile{
    width:10%;
    float:left;
    height: 100%;
    background-image:url(../assets/img.jpg);
    background-size: cover;
  }
  button {
    width: 20%;
		box-sizing: border-box;
    border: 0;
    background: rgb(80, 141, 255);
    height: 100%;
  }
}
</style>