// components/tab-bar/index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    value: 'label_1',
    list: [
      { value: 'label_1', label: '首页', icon: 'home', path: '/pages/home/index' },
      { value: 'label_2', label: '我的', icon: 'user-circle', path: '/pages/mine/index' },
    ],
    listMap: {
      'label_1': '/pages/home/index',
      'label_2': '/pages/mine/index'
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange (e) {
      const value = e.detail.value
      this.setData({
        value
      })
      wx.switchTab({
        url: this.data.listMap[value]
      });
    },
  }
})