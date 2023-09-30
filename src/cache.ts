class LocalCache {
    // 添加
    setCath(key:string, value: any) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
    // 查找
    getCache(key: string) {
      // obj=>sting=>obj
      const value = window.localStorage.getItem(key)
      if (value) {
        return JSON.parse(value)
      }
    }
    // 删除
    deleteCatch(key:string) {
      window.localStorage.removeItem(key)
    }
    // 清理
    clearCache() {
      window.localStorage.clear()
    }
  }
  
export default new LocalCache()
  
  