# interface-perform-test
[![node](https://img.shields.io/badge/node-v5.0.0-green.svg)](https://nodejs.org/dist/latest-v5.x/)
[![express](https://img.shields.io/badge/express-v4.13.4-yellowgreen.svg)](https://expressjs.com/)
[![npm](https://img.shields.io/badge/npm-v3.3.9-blue.svg)](https://www.npmjs.com/)

在线运行Jmx

# 使用指南
## 1. RUN
`npm start`运行，

## 2. 访问
`localhost:3000`进行查看操作

# 待完善
## 待完善功能
- [ ] 运行时可以配置运行参数
- [ ] Jmx和Json文件删除
- [ ] 历史日志查看，下载和删除
- [ ] 详情页面中可以单独运行请求和查看运行日志,可以查看头部详情
- [ ] 详情页面中可以配置运行参数
- [ ] 详情页面中可以修改和删除条目
- [ ] 测速页面可以多次测试求平均值
- [x] url页面子url应该和父类的url合起来显示

## 待修复Bug
- [ ] 详情页面不应该有上传
- [ ] 上传文件没有格式限制
- [ ] 改进测速页面，测试时页面不卡顿
- [x] 上传Json文件后，页面刷新加载速度过慢

# 框架搭建(这个项目是如何搭建起来的)
## 1. 安装Node环境
这里不多说，[官网](https://nodejs.org/en/)下载
## 2. 安装Express生成器
`npm install -g express-generator`
## 3. 创建项目
`express -e interface-perform-test`
## 4. 安装依赖
`cd interface-perform-test && npm install`
