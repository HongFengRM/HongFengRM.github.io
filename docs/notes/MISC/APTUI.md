---
title: APTUI学习笔记
createTime: 2025/05/10 15:25:13
permalink: /MISC/hmtj6og2/
---

## 图形部分

大部分资料来源于utunnels的视频和专栏。
U佬的工具将APTUI中的APT、RU、DAT、Const文件等整合为一个XML呈现出来，从而方便编辑。
Ctrl + . 可以将所有元素折叠以方便观察结构。
这样的整合文件（下称APT文件）中包含若干元素。

根元素movieclip声明该影片本身，是整个Flash影片，其余所有元素称之为Character。
Image图片，Shape图形（包含图片或矢量图形）
Button鼠标点击区域，不包含视觉内容。
有id，和左 顶 右 底 四个参数指定边界预览的范围，无实际意义。
vertexes和triangles指定按钮的实际作用范围。
vertexes下有一组vertex，为二维平面上的点。编号以上下顺序为0，1，2，3等
triangles下有一组triangle，使用vertexes中的顶点指定三角形。
buttonrecords用于定义按钮状态，按下弹起鼠标滑过等。
flag代表状态，其他属性和placeobject类似。可以使用多个值，|分割。
character可以填写shape，sprite，edittext等显示内容的id。depth是相对深度，唯一正整数。matrix为变换矩阵。
buttonactions子元素规定按钮脚本。flages代表事件类型，可以使用多个值，|分割。
overup代表鼠标在上面，overdown是按下。
idle是鼠标不在上面。
outdown是鼠标在外面仍然按下。
因此有
IdleToOverUp:鼠标划入
OverUpToldle:鼠标划出
OverUpToOverDown:按下
OverDownToOverUp:弹起
OverDownToOutDown:保持按下鼠标划出
OutDownToOverDown:保持按下鼠标划入
IdleToOverDown:空闲到按下
OverDownToldle:按下到空闲
最简单的按钮功能写在弹起里就ok。

font字体名称、edittext文本框（无法编辑无法响应鼠标）。这两个必须一起用。
先用front定义一个字体，然后在edittext里引用。
edittext里也有有id，和左 顶 右 底 四个参数指定边界预览的范围，在外面的会被裁掉。
font里填写font的id。alignment代表对齐方式，0左1右2中间。
height为字体高度（大小）
readonly为只读，但是01都无法编辑。
multline多行，单行不能换行。
wordwrap代表自动换行。
rgba为文本颜色。
ettext 为显示文本（仅英文）。也可以用 $APT:xxxxxxx 显示中文的csf字段。
etvar显示变量。优先级更高。是任何当前脚本可以访问的变量。
两个都可在最后加&outline来给字体描边。

sprite是动画元素，和movieclip相似，是一个影片。（如动画按钮角色动画特效动画）
empty是空的，用来装载导入的资源（其他apt文件中的character）

movieclip下包含三个部分：
Import导入资源列表，每一个关联一个empty标签
exports导出资源列表，对应当前apt的一个character
frames动画帧。每个character都需要放在动画帧中才能使用。
在frames下有placeobject元素，指定character的放置方式。
选中的在边界预览下为红色。
frame的ID代表帧序号。从0开始，默认从0开始到最后，并定格在最后一帧。
需要详细解说一下placeobject元素。
flags决定哪些属性起作用，在新版编辑器里除了Move外其他flags省略。
depth代表显示层次。在同一帧下必须是唯一的正整数。越大越高。
character填写需要显示的character的ID
matrix属性：为下文中的00 01 10 11四个属性和tx，ty。负责变换。
rotm开头的为二维旋转矩阵，有00 01 10 11四个 以及tx和ty。
00 10 tx
01 11 ty
0 0 1
00 和 11 负责拉伸
01 和 10 负责旋转
没有任何变换的时候为1 0 0 1
tx和ty负责xy方向的位移。
ratio属性未知
clipdepth为剪裁深度，在非-1时以该图形作为剪裁区域使用。
会剪裁所有深度在该元素的depth到clipdepth中的其他图形。
只有shape可以被剪裁，sprite不能。
rgbamul和rgbaadd为相乘和相加颜色修正。
poname 脚本需要的名字
clipactions 对象的事件脚本。可以包含多个clipaction
动画帧也可以包含脚本，运行到该步时执行。
removeobject 移除指定depth下的对象
该系统在某一帧中用placeobject创建一个对象，然后该对象在后续帧中得到保留。用对应depth的带有MOVE的flag的placeobject来移动该对象。用removeobject来移除他。
RU文件为几何图形定义文件。

```xml
	<shape id="2" top="0" left="0" bottom="101" right="832" geometry="feg_m_saveLoadMenu_geometry\2.ru">
		<ru><![CDATA[
			c
			s tc:255:255:255:255:art\Textures\apt_feg_m_saveLoadMenu_1.tga:0.997595:0:0:1:1:771
			t 0:101:0:0:832:0
			t 832:0:832:101:0:101
		]]></ru>
	</shape>
```

C代表一个图形开始
S是定义颜色材质贴图信息。一个S到下一个S之间的，由该S控制。
第一项目为材质类型：tc为贴图 S为无贴图 l为线段模式（线宽，RGBA）
后四项为材质颜色 RGBA 相乘关系。
后一项为贴图编号，编辑器中为贴图文件路径。（S模式无）
最后六项为贴图的二维变换矩阵。最后两项为贴图的偏移坐标。（S模式无）
T开头为三角形定义。六个数字为三个顶点的坐标。
l为线段，其参数为两端点坐标。

该系统首先将中心和图片左上角中心对齐，然后根据变换矩阵的逆矩阵变换图片（或者说用三角形顶点坐标乘以变换矩阵以得到顶点UV坐标），
图片和两个三角形的范围重叠部分即被拿出来。

## 脚本部分

APT是魔改flash，因此支持Actionscript。但是只有APT和tac文件
tac相当于反编译的脚本，和cation script相差甚远但是可以阅读。
编辑器将会把脚本的关键字换成tac里的方便阅读。

Frame里的action标签中的脚本在这一帧执行。
movieclip的frame里有initaction，只在首帧里出现。
sprite对应某个sprite的id。不需要其实例化，总会执行。用来定义一个类。
载体sprite甚至可以是空的。
placeobject可以包含clipaction脚本。其flag可以有很多种。
最常用的是construct和load。
construct在实例化的时候执行。
load在加载完后执行。
KeyUp:0x800000
KeyDown:0x400000
MouseUp:0x200000 鼠标弹起
MouseDown 0x100000 鼠标按下 这两个只要鼠标点击可以接受鼠标事件的对象时候都会执行
MouseMove:0x080000.鼠标移动的时候执行。
Unload:0x040000.
EnterFrame:0x020000.每一帧都运行，无论是否有动画。
Load:0x010000
DragOver:0x008000.
RollOut:0x004000
RollOver:0x002000
ReleaseOutside:0x001000
Release:0x000800,
Press:0x000400
DragOut:0x000200,
Data:0x000100
Construct:0x000004.
KeyPress:0x000002
Initialize:0x000001
在一帧中，initaction最先执行，然后是clipaction，最后是action。

脚本是反编译得到的，和汇编类似，语法简单，行数多，不好阅读。
1+2的算数

```
pushbyte 1
pushbyte 2
add
```

栈的概念。
push在最上层，pop也在最上层
pushbyte将1和2塞进栈里。
add将最近的两个数字拿出来相加然后塞回去，完事了1和2都不见了，栈里只有3。

a=1 变量赋值

```
pusha "a"
pushbyte 1
setVariable
```

setVariable不会把结果入栈。

### 二元算数指令

add subtract multiply divide modulo
加减乘除取模 其中add可以连接字符串。

### 一元算数指令

increment decrement
自己+1 或者-1
是对栈顶数值的操作！
假定栈顶的值可以转化为数字，非数字会当成0处理。

### 二元位运算

bitwiseAnd 按位于
bitwiseOr 按位或
bitwiseXor 按位异或

### 一元位运算

shiftLeft 左移
shiftRight 右移
shiftRight2 无符号右移

### 二元逻辑运算

and or 逻辑与或
equals 输出两个数值是否等于
strictEquals 严格全等 包括类型。
lessThan greaterThan 小于大于

### 一元逻辑运算

not 逻辑非

### push指令 入栈

push 将一个或者多个寄存器变量入栈 相当于一个从0开始的整数为名的变量
pushregister 在ra3中代替push，只接受一个参数。
pushbyte 将一个字节的数据入栈 是有符号的，255和-1等价
pushshort和pushlong 2字节和4字节整数
pushfloat 四字节单精度浮点数。
pushs 字符串入栈 标准ascii字符 引号包裹
pushsdb EAPushConstant 将字符串塞进常数表里 和pushs用法一样
pushsdw 同上

dup指令一次出栈两次入栈 相当于栈顶复制一次。

#### 简化指令

pushone
pushzero
pushtrue
pushfalse
pushnull
pushundef
将后面的东西入栈。

### 变量操作

普通变量用字符串命名，寄存器变量用数字索引
setVariable 变量赋值 变量值出栈，变量名出栈，用变量值给变量赋值。
getVariable 变量取值 变量名出栈 获取变量值 变量值入栈
setMember 对象成员变量赋值指令 变量值出栈 变量名出栈 目标对象出栈 用变量值给对象的成员变量赋值。
getMember 对象成员变量取值指令 成员变量名出栈 目标对象出栈 获取变量值 变量值入栈

setRegister 寄存器变量赋值 变量值出栈 设置参数指定编号的寄存器数值 该寄存器的值入栈

```
pushbyte 5
setRegister 1
```

给1号寄存器赋值为5，而栈顶仍然是5

pop指令 进行一次出栈操作

#### 复合指令

pushsgv 等于push和getVariable 参数和pushs相同。
gv getVariable
sv setVariable
gm getMember
sm setMember

### 逻辑指令

jnz 如果非零则跳转 条件出栈，如果为真，则跳转到指定行，否则继续下一条。
一般是true或者false。0，空字符串，null，undef都是false，其他都是true
jmp 直接跳转到指定行
XXXX: 跳转标签XXXX

### 函数

function q()
内容
end
相当于一个变量
pushs "q"
functon ()
内容
end
setVariable
给q赋值

return 返回，终止函数运行。必须在这之前将返回值入栈。

调用用call
callFunction 从栈顶开始依次是 函数名 参数数量 参数1 参数2 。。。
会把返回结果入栈，没有返回值就是undef
callMethod 依次是 函数名 对象值 参数数量 参数1 参数2.。。

callfp callfunctionpop
callfsv callfunction setvariable
dcallfp 是pushsdb和callfp
