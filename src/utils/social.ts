import router from '@/router'
import qs from 'qs'

let _win: any
let _winTime: any

export function login(url: any, options: any) {
  return new Promise((resolve, reject) => {
    _win = window.open(`${url}?${qs.stringify(options)}`)
    // 以小框的形式打开第三方登录页
    // _win = window.open(
    //   `${url}?${qs.stringify(options)}`,
    //   '_blank',
    //   'location=yes,height=600,width=500,scrollbars=yes,status=yes'
    // )
    _winTime = setInterval(() => {
      if (_win && _win.closed) {
        clearInterval(_winTime)
        const data = JSON.parse(localStorage.getItem('socialData') || '{}')
        localStorage.removeItem('socialData')
        // 触发变更通知
        if (data) {
          resolve(data)
        } else {
          reject(data)
        }
      }
    }, 200)
  })
}

export function callback() {
  let data: any = router.currentRoute.value.query
  if (JSON.stringify(data) === '{}')
    data = qs.parse(document.location.search.slice(1))
  localStorage.setItem('socialData', JSON.stringify(data))
}
