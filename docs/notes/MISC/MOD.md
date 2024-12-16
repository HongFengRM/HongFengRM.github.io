---
title: MOD开发杂谈
createTime: 2024/12/13 09:45:53
permalink: /MISC/1j1hoswn/
---

## mod开发环境初始化

1. 安装SDK-X
2. 安装VSC，配置xml扩展并绑定xsd。
3. 安装max、ps或替代品。

## 猜测的mod编译流程

1. 进入mod.xml
2. 依次进入各个xml，并且根据外部文件引用去引用外部文件。
   **猜测！** 可能后加载的文件会覆盖前面的。这也是mod文件能覆盖原版的原理。

## MISC

- 可能存在ra3中使用类似将军的ini进行编写的方式。具体不明
