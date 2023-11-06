const app = getApp() // 全局APP

Page({
  data: {
    theme:'',
    list: [],
    tweenList: [],
    message: '',
    loading: false,
    nickname: '',
    isMessageModalShow: false,
    colors: ['#EFC447', '#EC828D', '#ACC55F', '#7DC2E9'],
  },

  onShow () {
    this.init();

    
  },
  onUnload() {
    this.clearTimer();
  },

  // del
  login(){
    console.log(wx.getStorageSync('username'));
    const username = wx.getStorageSync('username');
   
    // console.log(username)
    // if(username){
    //   this.setData({
    //     nickname: wx.getStorageSync('username')
    //   })
    //   this.setData({
    //     isMessageModalShow: true,
    //   })
    // }else{
    //   wx.getUserProfile({
    //     desc: '用于显示祝福人信息',
    //     success:(res) =>{
    //       this.setData({
    //         userInfo: res.userInfo,
    //         nickname: res.userInfo.nickName,
    //         avatarUrl: res.userInfo.avatarUrl
    //       })
    //       //保存用户登陆信息到缓存
    //         wx.setStorageSync('username', res.userInfo.nickName);
  
    //       this.setData({
    //       isMessageModalShow: true,
    //       })
    //     }
    //   })
    // }
   
  },

  async init () {
    this.clearTimer()
    const result = await app.call({ name: 'getlist' })

    this.setData({
      list: this.formatList(result || []),
      tweenList: [],
      nickname:'',
      message: '',
    })

    console.log(this.data.nickname);

    this.tween(0)
  },
  clearTimer () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },

  formatList (list) {
    return list.map(item => {
      return {
        avatarUrl: item.avatarUrl,
        nickname: item.nickname,
        time: app.formatDate(item.time),
        text: item.text,
        color: app.randomPick(this.data.colors)
      }
    })
  },

  tween (index) {
    if (index === this.data.list.length) return false

    this.setData({
      [`tweenList[${index}]`]: this.data.list[index]
    }, () => {
      this.scroll()
      this.timer = setTimeout(() => {
        this.tween(index + 1)
      }, 100)
    })
  },

  scroll () {
    wx.pageScrollTo({
      selector: '#bottom',
      duration: 100,
    })
  },

  handleBtnAddMessage () {
    this.setData({
      isMessageModalShow: true,
    })
    
  },
  handleHideMessageModal () {
    this.setData({
      isMessageModalShow: false,
    })
  },


  oninput (e) {
    this.setData({ // 更改对应路径为输入信息
      message: e.detail.value
    })
  },

  oninputname(e) {
    // const { value } = e.detail
    // console.log('输入昵称', value);
  
    const nickname = e.detail.value 
    this.setData({
      nickname:nickname,
    })
   // wx.setStorageSync('nickname', nickname)
  },
  async handleBtnSaveMessage () {
    if (!this.data.nickname) {
      app.toast('请输入姓名')
      return false
    }
    if (!this.data.message) {
      app.toast('请填写内容')
      return false
    }

    this.setData({
      loading: true,
      isMessageModalShow: false,
    })
    wx.showLoading({ // 显示加载中
      title: '留言中',
      mask: true
    })
    await app.call({ // 发起云函数，提交信息
      name: 'add',
      data: {
        text: this.data.message,
        time: Date.now(),
        nickname: this.data.nickname,
        avatarUrl: this.data.avatarUrl
      }
    })

    await this.init() // 更新信息
    wx.hideLoading() // 隐藏加载中
    this.setData({
      loading: false,
      message: '',
      nickname: ''
    })
  },

  onShareAppMessage: app.onShareAppMessage,
  onShareTimeline: app.onShareTimeline,
})
