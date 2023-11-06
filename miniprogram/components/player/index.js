const app = getApp()

Component({
  properties: {},
  data: {
    audioList: [
      'audio/gouzhiqishi.mp3',
      'audio/beautiful_girl.mp3',
      'audio/Perfect_Moment.mp3',
      // 'audio/beautiful_girl.mp3',
      // 'audio/jintianniyaojiageiwo.mp3',
      // 'audio/xiaoxiaoliange.mp3',
    ],
    playing: false,
    showPlayer: false,
  },
  lifetimes: {
    attached () {
      this.init()
    },
  },
  pageLifetimes: {
    show () {
      if (this.audio) {
        this.setData({
          playing: !this.audio.paused,
        })
      }
    },
  },
  methods: {
    async init () {
      const config = await app.getConfig()
      if (config.music) {
        this.setData({
          showPlayer: true,
        })
        this.initAudio()
      }
    },
    initAudio () {
      if (app.audio) {
        this.audio = app.audio
        this.setData({
          playing: !this.audio.paused,
        })
      } else {
        // 当点击图片预览时，触发app.onhide,音频停止播放
        // this.audio = wx.createInnerAudioContext({
        //   useWebAudioImplement: false
        // })

        this.audio = wx.createInnerAudioContext({
          useWebAudioImplement: false // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
        })


        // 背景音频
        // this.audio = wx.getBackgroundAudioManager()

        const src = app.globalData.imgPath + app.randomPick(this.data.audioList)
        this.audio.src = src;
        // this.audio.src = 'https://rd-sycdn.kuwo.cn/23870d2c10efc6e41030a0ae03dd28db/653f47a7/resource/n1/67/30/2224948822.mp3'
        app.audio = this.audio

        setTimeout(() => {
         // this.handlePlay()
        }, 1000)
      }
    },
    async handlePlay () {
      if (this.audio.paused) {
        await this.audio.play()
        this.setData({
          playing: true,
        })
      } else {
        await this.audio.pause()
        this.setData({
          playing: false,
        })
      }
    },
    handleChange () {
      const {audioList} = this.data
      let index = audioList.findIndex(item => app.globalData.imgPath + item === this.audio.src)
      if (index < audioList.length - 1) {
        index++
      } else {
        index = 0
      }
      this.audio.src = app.globalData.imgPath + audioList[index]
      setTimeout(() => {
        this.audio.play()
      }, 1000)
    },
  },
})