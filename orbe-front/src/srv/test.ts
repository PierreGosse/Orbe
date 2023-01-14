export function test() {
  window.fetch('/api', {
    method: 'GET',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  }).then((data) => {
    console.log(data)
  })
}