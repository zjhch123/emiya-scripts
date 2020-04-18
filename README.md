# Emiya-Scripts

用于Emiya脚手架 spa 页面开发

单独使用此包没有任何意义，请结合项目脚手架[Emiya](https://github.com/zjhch123/Emiya)使用!

可以添加配置文件 覆盖/新增 webpack配置

```typescript
// emiya.config.js
module.exports = {
  prodConfigChain: (webpackConfig: object): object|void => {
    // Do something custom for webpack config - prod
    // return webpackConfig or not
  },
  devConfigChain: (webpackConfig: object): object|void => {
    // Do something custom for webpack config - dev
    // return webpackConfig or not
  }
}
```

```shell
npm i emiya -g

emiya -w project1
cd project1
npm i
```
