export function defineFunc(initialFunc) {
  let innerFunc = initialFunc

  function func(...args) {
    return innerFunc?.(...args)
  }

  return Object.assign(func, {
    define: (newFunc) => {
      innerFunc = newFunc
    },
  })
}
