# Component
A simple front end library for demo. [Demo](https://fringe.xiaoda.pro/component/)

## Install
Directly include the script.

``` html
<script src="component.js"></script>
```

## Instance
### new Component(options)
创建组件实例

## Instance Options
### instanceName
实例名称（非必须、自动生成）

### selector
元素选择器（非必须）

### data || data()
初始实例数据

### render()
实例渲染方法

### methods{}
自定义方法集合

## Instance Functions
### instance.setData(data)
更新实例数据

### instance.update()
重新渲染

## Instance Lifecycle
### created()
实例初始化

### mounted()
实例首次执行 render 方法

### updated()
实例后续执行 render 方法

### beforeDestroy()
实例销毁
