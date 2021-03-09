<template>
  <div id="app">
    <router-view to="/"></router-view>
  </div>
</template>

<script>
export default {
  mounted(){
		// var socket = this.$socket
		this.sockets.listener.subscribe('id', (id)=>{
		if (id === 0) {
			return alert('房间已经存在！')
		}
			this.$router.push('/room/'+ id)
		})
    this.sockets.listener.subscribe('del',()=>{
      alert('该群聊已解散')
      this.$router.replace('/')
    })
		// 获取房间列表
		// this.sockets.listener.subscribe('list', (msg)=>{
		// 	this.list = msg
		// })
		// socket.emit('get',1)
  }
}
</script>

<style>

</style>