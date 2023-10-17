// 统一封装 wxFunc异步转同步
function miniPromisify (wxFunc) {
	return (args) => {
	  return new Promise((resolve, reject) => {
		const funcArgs = { ...args } // {url: 'xxxx', success:function(){}, fail: function(){}}
		Object.assign(funcArgs, {
		  success: (res) => {
			resolve(res)
		  },
		  fail: (err) => {
			reject(err)
		  }
		})
		wxFunc(funcArgs)
	  })
	}
  }
  
  module.exports = {
	  miniPromisify
  }
  