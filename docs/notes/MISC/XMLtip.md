---
title: RA3XML学习笔记
createTime: 2024/12/12 13:21:02
permalink: /MISC/3opyogrl/
---

类似于个人学习笔记

## 术语翻译表

Nuggets - 块

RA3的xml文件总体来说呈现出非常清晰的树状结构。

下图展现了一个简单的XML文件树状结构。

```markmap
- 零级元素 AssetDeclaration
    - Include
    - GameObject

        - Draw
        - Behavior
        - 其他二级元素
    - Texture
    - 其他二级元素
```

XML文件主要包括了 **_具有层级结构的元素_** 和 **_元素的属性_**。
XML文件遵循严格的嵌套层级结构。您必须按顺序嵌套元素。

所有XML文件均以AssetDeclaration作为根元素，这一根元素以Include元素的方式引用或包含其他xml的内容。
在XML文件中如果需要引用其他一级元素则需要进行引用。这也是需要在单位的XML中Include其模型文件的原因。
一个根元素下可以包含任意数量的一级元素。因此理论上可以将所有XML集合在一个单个文件中。

游戏中的配置文件、模型文件、均以XML方式储存。

游戏中的很多东西继承自基本可继承资产类型，因此必须具备 **_唯一的_** ID属性。

mod.xml是mod重要的索引文件。猜测游戏会试图include all这个文件进入游戏的配置文件系统。因此这个文件是MOD的一切修改的入口，类似程序设计中的主函数。

猜测！在游戏中存在一个根目录./,在根目录下有DATA、ART等一些文件，游戏路径中使用DATA:等方式引用！

GameObject一级元素的属性KindOf可以认为是一系列的类似ra2的iscow=yes的定义。这里的一部分是单纯的标签分类，一部分是有神秘的硬编码作用。

武器的使用中，一个Slot只能同时使用一个武器。Ordering是一个标签，不影响武器的实际激发。

原版将同类型的一级元素做了整合。比如武器模板WeaponTemplate等。但实际上您可以把他单独拿出来，或者放在单位xml的下面。

武器模板使用了Nugget来确定实际的弹头和抛射体！有些类似于RA2的。但是这里似乎也有不用Nugget的写法！
**武器模板** 发射 **抛射体** 在引爆时用 **弹头** 产生伤害

单位的经验等级被单独指定在ExperienceLevels.xml下。新单位需要在这里指定。
和ra2不一样，不会自动通过造价比例制定。


IgnoresContactPoints 忽略几何体攻击目标单位的几何中心  还能让scatter相关的设置失效 必定追踪 
就比如机场占地4×6格 忽略接触点就是固定打它的中心 不忽略就打它外围离开火单位近的地方
可以给建筑设定单独的接触点

武器中只有第一个damagenugget会稳定生效。原版的日本决胜中队升级爆炸之后伤害偏低出于这一原因。

```xml
		schema="..\Schemas\xsd\CnC3Types.xsd"
		dataRoot=".."
		defaultArtPaths=".\Art"
		defaultAudioPaths=".\Audio"
		defaultDataPaths=".;.\Mods;.\SAGEXML"
		monitorPaths="..\"
```
上述为原版BAB的默认路径。
DATA: 看起来似乎回同时在本级目录，mods文件夹和SAGEXML文件夹
DATA:audio.xml 如此观之同时等效于 .\audio.xml 以及.\Mods\audio.xml 和 .\SAGEXML\audio.xml
不妨大胆估计，他会使用第一个有效的数据。

Art: 则仅仅在打包器目录中的ART文件中进行检索。
在实践中也可以在mods\mod目录\Art目录中正常使用 (因为修改后的打包脚本)
然而schema的目录则似乎是从sdk根目录的一个二级目录返回了一级之后进行的检索。


```
 /art:\".;.\\Mods\\{5}\\Art;.\\Mods;.\\Art\" /audio:\".;.\\Mods\\{5}\\Audio;.\\Mods;.\\Audio\" /data:\".;.\\Mods\\{5}\\Data;.\\Mods;.\\SageXml\"",
 ```
 在打包cs脚本中可以看到这一句
 大致判断在打包阶段对BAB的参数进行了覆盖，
 根目录、\mods\你mod\art\、\mods、\art\ 4个目录完全等效于ART：。
 根目录、\mods\你mod\audio\、\mods\、\audio\ 4个目录完全等效于AUDIO：。
 根目录、\mods\你mod\DATA\ 、\mods\、\SageXml\ 4个目录完全等效于DATA：。

现在感觉不对劲，真不对劲，这个事情可能是反过来的！
打包器恐怕是直接连读四次，以最后的为准！

如DATA:Static.xml一句，
首先试图读取SDK目录下的Static，然后读取到bibber弄的空文件。
然后试图读取\mods\你mod\DATA\下的Static，大多数人的mod不应该有这样的一个文件！
然后试图读取\mods\下的Static，同上。
然后试图读取\SageXml\下的Static，读取到原版的文件，作为最后被读取的内容被视作有效内容。

然后对于同一ID的Asset，姑且猜测会以最后读取到的为准。
因此如果你直接以DATA：的方式引入任何的XML，只要他在原版是存在的那么就会以原版为准，因为原版的XML是最后一次读取的。
这也是为什么MOD如果要改原版已经有了的东西，必须需要重新以新的路径去重新Include一次！

因此优先级问题实际上分为文件读取优先级和同ID资产读取优先级两个，总的来讲以最后一个为准。

这一改动相较于原版SDK能够使得微观调整ART、AUDIO等成为可能！
为了更好地保护MOD打包时依赖的原版数据（避免出现各种神秘的BUG）似乎应当避免修改SDK根目录下的ART、SageXml、Audio三个目录下的东西，转而在\mods\你mod\下新建这样三个文件夹。


在animationstate的读取中，自上而下，读取第一个符合要求的。
比如你同时写了user1和user2 和user1+user2 并按照前面的顺序放
那么当你这个物体同时拥有user1和2模型条件时 那就会只触发user1 因为它在最上面

因此强限定应该往前放。