import request from '@/api'
import CryptoJS from 'crypto-js'
import JSEncrype from 'jsencrypt'

export const loginByUsername = (tenantId, username, password, key, code, preSessionId, authKey, authIv) =>
  request({
    url: "/sumile-auth/oauth/token",
    method: "post",
    headers: {
      "Tenant-Id": tenantId,
      // 'Dept-Id': website.switchMode ? deptId : '',
      // 'Role-Id': website.switchMode ? roleId : '',
      "Captcha-Key": key,
      "Captcha-Code": code
    },
    params: {
      tenantId,
      username,
      password,
      preSessionId,
      authKey,
      authIv,
      grant_type: "sliderCaptcha",
      scope: "all"
      // type
    }
  });

export const refreshToken = (refresh_token, tenantId) =>
  request({
    url: "/sumile-auth/oauth/token",
    method: "post",
    headers: {
      "Tenant-Id": tenantId
    },
    params: {
      tenantId,
      refresh_token,
      grant_type: "refresh_token",
      scope: "all"
    }
  });


export const getButtons = () =>
  request({
    url: "/sumile-system/menu/buttons",
    method: "get"
  });


export const logout = () =>
  request({
    url: "/sumile-auth/oauth/logout",
    method: "get"
  });

export const getUserInfo = () =>
  request({
    url: "/sumile-system/info",
    method: "get"
  });



export const preLogin = () =>
  request({
    url: "/sumile-auth/oauth/preLogin",
    method: "get"
  });


export const getSliderImg = () => {
  return request({
    url: "/sumile-auth/captcha/code",
    method: "get"
  });
}

function randomGenerate (length) {
  const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E',
    'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let randomString = ''
  for (let i = 0; i < length; i++) {
    randomString += chars[Math.floor(Math.random() * chars.length)]
  }
  return randomString
}

export  function loginBySlider(userInfo) {
  return new Promise((resolve, reject) => {
    preLogin().then(res => {
      let password = CryptoJS.MD5(userInfo.password).toString()
      let keyString = randomGenerate(32) // 这里使用工具类随机生成（详细实现见下文）
      let ivString = randomGenerate(16) // 这里使用工具类随机生成（详细实现见下文）
      let key = CryptoJS.enc.Utf8.parse(keyString) // AES密钥
      let iv = CryptoJS.enc.Utf8.parse(ivString) // AES向量
      // RSA公钥加密
      const pubKey = new JSEncrype()
      pubKey.setPrivateKey(res.data.publickey)
      // 这里拆分出
      let pwd =
        import.meta.env.VITE_USE_MOCK === "true"
          ? userInfo.password
          : CryptoJS.AES.encrypt(
              password, // 加密原文
              key, // AES密钥
              {
                iv,
                mode: CryptoJS.mode.CBC, // 指定CBC模式
                padding: CryptoJS.pad.NoPadding
              }
            ).toString();
      return loginByUsername(userInfo.tenantId, userInfo.username, pwd, userInfo.key, userInfo.code, res.data.preSessionId, pubKey.encrypt(keyString), pubKey.encrypt(ivString))
    }).then(res => {
      const data = res.data;
      if (data.error_description) {
        reject({status: false, data: data.error_description});
      } else {
        resolve({status: true, data: data})
      }
    }).catch(error => {
      reject({status: false, data: error.message});
    })
  })


}