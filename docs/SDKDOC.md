---
title: RA3SDK内置文档部分翻译
createTime: 2025/03/06 20:10:48
permalink: /article/gs00zdqr/
---

## 编者记

RA3原版SDK中包含了一个官方的简单教程文档，但在现在流通的中文版本中翻译极差。编者希望通过提供一个经过审查的翻译版本，提供一个方便modder查阅的渠道，通过了解官方的口径了解其用意和实际使用的方式。
为了方便起见，笔者在文中将自己加入一些注释，将通过斜体标明。
重要：本文档仅提供部分翻译，且简化了图片部分。

## MOD制作

### Mod 目录结构

创建 MOD 时，建议您遵循本文档此部分列出的数据结构，结构可以更改，但为了本文档的方便，我们假设您遵循这些准则。
在安装目录中有一个 MOD 文件夹。建议您在此文件夹下直接创建一个与您正在创建的 MOD 名称相对应的文件夹，然后在该文件夹中创建一个DATA文件夹。重要提示：您的 mod 名称不能超过 15 个字符。您可以在 SampleMOD 文件夹中看到一个示例。这很重要，这样您构建的 MOD 的结构才是正确的，并且在您构建 MOD 后游戏才能正确读取。完成此操作后，在DATA文件夹下创建的目录取决于希望如何组织自己MOD的数据。您的 mod 的目录结构应与下图类似。

#### 所需文件：

MOD 构建仅需要一个文件，即 MOD.xml。此文件应Include您为 MOD 添加/编辑的任何其他文件。这是批处理文件将尝试构建的文件 _（编者注：此处所提及的批处理文件在流通版本和官方版本中均不存在，笔者的理解是官方曾经考虑过通过一个批处理文件来快速生成一个新的mod目录模板。）_ ，它直接对应于构建过程将创建的清单文件（Manifest文件）的名称。此清单也硬编码在游戏代码中，因此重命名它将导致您的 MOD 无法工作。有关 Mod.xml 文件的完整详细信息，请阅读 Mod.XML 页面。

另一个硬编码的文件是 MOD.str 文件。此文件是可选的，仅在您尝试添加或修改游戏中的文本时才需要。
MOD.str 结构
以下是 MOD.str 文件中条目的示例：

NAME：AlliedGunshipAircraft
“Harbinger Gunship”
END

要替换现有的字符串条目，只需在 Mod.str 文件中创建一个新条目，其名称与要替换的条目相同。只需将新条目添加到 Str 文件中，然后从 .XML 文件或 Worldbuilder 脚本中引用它们即可。如果您忘记向 STR 文件中添加字符串，它将在游戏中显示为 MISSING：后跟字符串条目的名称。

_（编者注：MDO.str文件的使用因其不支持中文内容已经不再流行。现在您需要采用CSF文件来管理您MOD的新增字符串条目。）_

### MOD.XML：

#### 基本说明

此文件是 BinaryAssetBuilderApplication （简称BAB，二进制资产建立应用）将编译的主要文件。此文件应包含您正在修改/编辑的所有文件。如果该文件中未包含该文件，则不会构建。

#### 必需Include的文件

创建 Mod 时，应始终包含三个文件作为参考。它们是 static.xml、global.xml 和 audio.xml，它们代表游戏加载的三个主要数据流，以下是示例 Mod 中的一个示例：

```xml
<Include type="reference" source="DATA:static.xml" />
<Include type="reference" source="DATA:global.xml" />
<Include type="reference" source="DATA:audio.xml" />
```

_（编者注：Static.xml将加载游戏中包括单位在内的绝大多数静态资源。Global.xml将初始化系统和子系统，Audio.xml将加载可能被本地化的音频文件。）_

有关 DATA：值的说明，请参阅 BinaryAssetBuilder.exe.config 部分。

#### 您的 Mod 包Include文件

要为您的 Mod 构建 XML 资源，您必须在必需包含文件之后Include它们。您自己的 XML 资产的包含遵循与所需包含类似的模式。但是，它包含文件的完整路径，从 Mods 目录开始。示例 mod 中的示例将是解释这一点的最简单方法：

```xml
<Include type="all" source="DATA:SampleMod/Data/AlliedGunshipAircraft.xml"/>
```

如您所见，包含文件的路径是 **完整路径，从 Mods 文件夹开始**。您可以使用多少个子目录来组织 XML 文件没有限制。对于复杂的 mod，您可以在 Data 文件夹中为每个派系创建一个文件夹，然后为每种类型的单位创建一个文件夹。例如，如果您要向盟军派系添加一个单位，您可以创建以下目录结构来存放文件：
MyMod\Data\Allied\Unit\GDIPwnageUnit.xml
要包含您的 Pwnage 单位，您需要添加以下包含：

```xml
<Include type="all" source="DATA:MyMod/Data/Allied/Unit/GDIPwnageUnit.xml" />
```

#### Art 的 Include

可能还需要包含位于 art 文件夹中的文件。这样做是为了包含新的命令按钮。SampleMod 中有一个例子，复制如下：

```xml
<Include type="all" source="ART:Images/SampleUpdatedPackedImages.xml" />
```

在这种情况下，该文件可以在您的 Mod SDK 根目录的 Art\Images 文件夹中找到。这是您唯一需要在 Mod.XML 文件中使用 ART: 类型的包含标签的时候。修改单元时，您将使用 ART：Include 标签，但在这种情况下其行为略有不同，将在 XML 资产部分中介绍。

### XML 资产

#### 基本说明

RA3 中的几乎所有数据都作为**资产声明（AssetDeclaration）**的一部分存储在 XML 文件中。资产类型多种多样，可定义从命令按钮到单元的所有内容。此文件将提供资产类型的基本说明、如何声明一些更常用的资产，并解释如何了解有关特定类型资产中可使用的允许标签和属性的更多信息。

#### 基本结构

RA3 中的每个 XML 资产都是资产声明（AssetDeclaration）的一部分。这是 XML 树的根级别，并且是您为在 mod 中使用而创建的每个 XML 文件中都需要的内容。下面是一个空白 XML 文件的示例，该文件已准备好包含其他数据：

```xml
<?xml version="1.0" encoding="utf-8"?>
<AssetDeclaration xmlns="uri:ea.com:eala:asset" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xi="http://www.w3.org/2001/XInclude">
</AssetDeclaration>
```

AssetDeclaration 标签有多种属性是必需的，但超出了本文档的解释范围。以上内容应足以用作创建文件的模板。
_（编者注：上句提到的应该是与命名空间有关。）_

#### 创建新资产

虽然可以从头开始创建新资产，但最简单的方法是获取与您正在创建的资产类似的现有资产并复制它。例如，如果您试图创建一个基本坦克，最简单的构建方法是复制 Guardian 坦克，然后对其进行编辑以满足您的需求。任何单个对象的 XML 都非常复杂，本教程无法解释所有内容。

#### 使用ART资产

ART资产通常包含在单个单元或结构的 XML 中。它们位于单元顶部附近的“Include”部分。您可以在示例模块中看到 Harbinger Gunship 中的艺术包含示例，该示例复制如下：

```xml
<Include type="all" source="ART:AUGunship_SKN.w3x" />
```

如您所见，ART：包含未列出路径。相反，ART的Include通过查找包含您要包含的文件的前两个字母的文件夹来搜索给定文件，这些文件包含在ART文件夹中。因此，对于 AUGunship_SKN.w3x，它会在找到它的文件夹 Art\AU\ 中查找。

可以在ART资产部分中找到ART目录结构的完整详细信息以及有关各种ART资产类型的更多信息。

#### XML Schema 文档 (XSD 文件)

要了解 AssetDeclaration 或特定类型对象中可用的选项，您可以参考 Mod SDK 中包含的 XML Schema 文档。二进制资产生成器(BAB)使用这些文档来验证您的 XML 文件，并允许它了解如何处理数据。Schema 文档可以在您的 Mod SDK 安装的 Schemas\XSD 文件夹中找到。在文件夹的根目录中，带有前缀 AssetType 的所有元素都可以放置在 Asset 声明的根级别。这些是 GameObjects（游戏中所有单位和结构的类型）或 ArmorTemplates（用于定义单位对不同类型武器伤害的脆弱性）。Schema 文件列出了可以应用于特定类型对象的所有有效属性和标签。请注意，由于继承，您可能需要探索父类型以找到所有可能的有效选项。此外，要查找可以应用于游戏对象的模块，请检查 Modules 文件夹。

### 定义

#### 基本说明

RA3 Mod SDK 的一个功能是使用定义，它可以成为一项强大的资产。定义允许您创建常量，只需使用其名称即可从其他文件引用这些常量。它们还支持基本的数学运算，允许您轻松地将公式应用于值。它们是在您构建 mod 时计算的，这意味着在运行时使用它们不会产生任何开销。

#### 基本结构

任何进行资产声明的文件都可以托管定义。`<Defines>` 部分是一个可选部分，位于文件中的 `<Includes>` 部分之后。在 Defines 部分中，您可以创建单独的常量定义。下面是一个示例：

```xml
<Define name="VEHICLE_DIE_EXPLOSION" value="110" />
```

这将创建一个名为 VEHICLE_DIE_EXPLOSION 的定义，其值为 110。定义可以是任何类型的数据，只要在使用时它们与预期的类型相匹配即可。检查特定模块或对象的架构以查看预期类型。
引用定义

在属性或属性中使用定义类似于在 Microsoft Excel 中使用公式。要指示属性的值使用定义，必须在其前面加上 = 符号。要使用的定义的名称也需要前缀。$ 用于指示使用命名定义。您还可以在定义引用中执行基本的数学计算。下面是一个包含数学表达式使用的示例定义引用：

```
Volume = "=$VEHICLE_DIE_EXPLOSION + 0"
```

此引用的完整上下文可在 SampleMod 中的 SoundEffects.xml 中找到。本质上，这是取 VEHICLE_DIE_EXPLOSION 的值（上面定义为 110）并将零添加到它。虽然这是一个明显的简单情况，但您可以对此属性进行其他非平凡的用途。

#### 高级用法

一个例子可能是使用定义值作为单位成本，并添加一个特殊常量用于调试目的，也许是为了降低成本以加快测试速度。下面是这可能看起来像的一个例子：

```xml
<!-- 调试乘数，设置为 1 以进行发布！ -->
<Define name="ALLIEDDEBUG_BUILDCOST_MULTIPLIER" value=".25" />
<Define name="ALLIED_WARFACTORY_BUILDCOST" value="=2000*$ALLIEDDEBUG_BUILDCOST_MULTIPLIER" />
```

虽然此示例仅适用于单个建筑物（并且还需要更改盟军战争工厂对象的 BuildCost 属性以引用为其定义的常量，但您可以看到数学功能的使用，甚至可以在定义中引用定义。在这种情况下，战争工厂的调试成本将为 500。真正的优势在于需要禁用调试时。通过将乘数更改为 1 并重建模块，所有构建成本都将重置为预期值。对于单个结构来说，这没有多大意义，但对于大量结构来说，它可以产生很大的不同。它还集中了您的所有成本，使平衡更改更容易实施。

### 音频资产

#### 音频资产类型

您可能会在 mod 中使用各种类型的音频资产。其中一部分包括音乐、语音和音效，例如武器射击和爆炸声。这些资产需要不同类型的音频文件，并以不同的方式添加到您的 mod 中。本文档将分别解释每种资产。

#### 目录结构

音频资产使用 `AUDIO：include`，它指向 SDK 安装目录根目录中的 Audio 文件夹。您应该将要添加到游戏中的新音频文件放在该目录中。

#### 音乐

音乐文件应该是 MP3 文件。游戏**可以直接加载 MP3 文件**，您可以使用这些文件添加新的音轨。创建新音轨有几个部分。

添加新音乐（或任何 MP3 音轨，请参阅 `audio\ModkitMP3Examples\ModkitMP3Examples.xml` 了解 MP3 文件的其他可能用途）的第一步是导入您想要使用的文件。这是使用 AudioFileMP3Passthrough 标签实现的。这会将实际的 MP3 文件导入游戏，并允许您创建 MP3MusicTracks 或其他 MP3 文件用法。AudioFileMP3Passthrough 的示例如下（取自位于` audio\ModkitMP3Examples\ModkitMP3Examples.xml` 中的 SampleMod）：

```xml
<AudioFileMP3Passthrough id="MP3ExampleFile_Music" File="MP3Example_Music.mp3" />
```

请注意，这不会创建实际的 MP3 音轨以供使用，它只是为文件创建一个 ID，然后您可以引用它。将新音轨添加到游戏的下一步是创建 MP3MusicTrack。下面提供了一个示例供参考。在 audio\ModkitMP3Examples\ModkitMP3Examples.xml 中还可以找到其他 MP3 音轨用法。

```xml
<MP3MusicTrack id="ModkitMP3Example_Music"
Volume="100"
ReverbEffectLevel ="0"
DryLevel = "100"
SubmixSlider ="MUSIC"
Control = "ALLOW_KILL_MID_FILE"
Priority = "CRITICAL">
<VolumeSliderMultiplier Slider="NONE" Multiplier="1.0" />
<Filename>MP3ExampleFile_Music</Filename>
</MP3MusicTrack>
```

关键点是，您必须声明文件的用途，以及声明文件本身。您会注意到，所有类型的音频资产的结构都非常相似。

#### 其他音频资产

除了 MP3 资产外，SDK 还允许您使用 WAV 文件，这些文件可用于其他音频效果，例如单位开火。您的 mod 中必须包含相当数量的 XML 基础对象才能使用它们。请参阅 SampleMod 中的 SoundEffects.xml，它创建了各种基础对象来定义各种类型音效的属性。由于之前已经介绍了基于 MP3 的效果，因此这里将介绍基于 WAV 的效果。

以下是将 WAV 文件导入 SDK 以用于音频条目的条目。您需要遵循与 MP3 文件示例相同的两步方法，首先导入文件，然后引用它。参考条目将在下面进一步解释。有关更多参考，请参阅 Mod SDK 安装目录中的 Audio\AudioAssets.xml。

```xml
<AudioFile id="AUGunsh_movByLoopa" File="AUDIO:sounds\augunsh_movbyloopa.wav" GUIPreset="Default" />
```

这将从位于 SDK 安装目录的 audio\sounds 目录中的 augunsh_movbyloopa.wav 文件创建一个 ID 为 AUGunsh_movByLoopa 的音频资产。现在文件已导入，下一步是引用它，并创建一个要使用的音频事件。下面是一个示例音频事件：

```xml
<AudioEvent
id="ALL_Gunship_MoveByLoop"
inheritFrom="AudioEvent:BaseSoundEffect"
Volume="40"
VolumeShift="-10"
Limit="3"
Control="LOOP FADE_ON_KILL"
Priority="LOW"
Type="WORLD SHROUDED EVERYONE"
SubmixSlider="SOUNDFX">
<PitchShift Low="-10" High="10" />
<Delay Low="40" High="80" />
<Sound>AUGunsh_movByLoopa</Sound>
<Sound>AUGunsh_movByLoopb</Sound>
<Sound>AUGunsh_movByLoopc</Sound>
<Sound>AUGunsh_movByLoopd</Sound>
<Sound>AUGunsh_movByLoope</Sound>
</AudioEvent>
```

有几点需要注意。不同类型的音频事件使用不同的音量设置，最好通过探索 SDK 安装目录中 `sagexml\sounds\SoundEffects.xml` 文件夹中的现有音频效果来找到这些设置。另一个注意事项是，您可能在特定音频事件中设置了多个 `<Sound></Sound>`（此标签集可能出现的次数没有上限）。这意味着在播放该事件时，将随机选择列表中的一个声音。这允许您有多个单元响应，这些响应将随机播放，而不是单个重复的声音。

### ART 资产

这些页面将引导您了解 RA3 中使用的ART资产的基础知识，主要是关于其用途。

#### Art 组织

##### 目录结构

ART资产的目录结构与普通资产略有不同。它们使用单​​个共享ART位置（尽管您可以更改 BinaryAssetBuilder 配置，但这超出了本文档的范围），并使用子文件夹组织所有内容，以防止给定目录中有太多文件。每个ART资产（无论是网格还是纹理）都放置在 Art 目录的子文件夹中，该子文件夹使用名称的前两个字母命名。如果您创建一个名为 Box.w3x 的 W3X 文件，则应在 Art 文件夹中创建一个名为 Bo 的子文件夹，然后将 W3X 文件放在那里。对于示例模型，目录结构如下所示：

##### ART目录结构

如您所见，有目录 AU、FX、Terrain、Images 和 W3。Terrain 和 W3 文件夹不应该让您担心，尽管如果您感兴趣，您可以浏览它们。W3 文件夹用于 W3X 查看器，不应更改或删除这些文件。

Images 文件夹略有不同。它用于打包图像，用于单位客串。在 Images 文件夹中，您将找到用于创建 Sample mod 中使用的命令按钮的纹理和 XML 文件。如果您计划创建新的命令按钮，则在创建 mod 时，您将创建一组类似的文件并将其包含在 Mod.XML 中。

#### W3X 网格

##### 基本说明

W3X 文件包含游戏中使用的 3D art资产。您必须使用 3DSMax 创建这些资产，并使用提供的 W3X 工具将其导出。有关所包含工具的更多信息，请浏览art管道部分。

##### 位置

所有 W3X 文件都应按照art组织部分中指定的方式进行组织。具体来说，它们应该位于art文件夹内以文件名前两个字母命名的子文件夹中。

##### 一般 W3X 资产创建规则

**尽量减少网格数量。\***
**对所有不相对于其父级移动的对象禁用“导出变换”。**
C&C Generals 中的某些对象最终有 100-200 个单独的网格，只要可能，这个数字应该至少为 10 个。相对于彼此动画的事物必须是单独的网格。
PC 性能的主要目的是让艺术作品成为漂亮的大“块”。如果您有大量多边形/顶点，并且它们都使用相同的材​​质和变换（如果是刚性的 - 皮肤可以使用多个变换，并且仍然是相同的“块”），那么它将被渲染为一个“块”或绘制调用。在许多情况下，“块”的数量是性能的限制因素。
W3X 查看器报告绘制调用的数量 - 艺术家应该对他们创建的每个对象的该数量有一个严格（且低）的预算。
将蒙皮顶点的数量保持在最低限度。除了渲染对象的所有其他成本之外，皮肤还会产生大量的 CPU 成本。
将顶点数量保持在最低限度。模型的复杂性将决定顶点的数量。
在今天的硬件上，渲染少于 200 个顶点的任何网格几乎不值得，因此**不要使用大量低细节网格；使用更少的更详细的网格**。
使用**硬边可以增加顶点数**。除了最必要的硬边外，其余部分均应平滑。
使用**不连续的 UV 映射可以增加顶点数**。这通常是不可避免的，但请注意，这是模型顶点数增加的另一种方式。
始终检查 W3XView 显示的顶点数或 W3X 导出器的导出日志中的顶点数；这是真实的顶点数，不要依赖 Max 中报告的顶点数。

### UI 修改

#### UI 修改的限制

由于 SDK 中包含的工具的限制，除了纹理替换之外，无法修改 UI。

#### 目录组织

在 mod 的数据目录中，您需要创建一个 AptUI 文件夹。此文件夹将包含修改后的 UI 屏幕。您只需将要修改的 UI 屏幕的目录复制到 mod 的 AptUI 文件夹中即可。在 RA3 Mod SDK 中，UI 修改过程已简化。只要 UI 屏幕的文件夹位于 AptUI 文件夹中，SDK 构建工具就会处理 C&C 3 Mod SDK 中手动完成的所有其他操作。

### 构建模组

#### 基本说明

完成模组的最后一步是构建游戏数据。在使用模组之前，您需要构建数据。执行此操作的工具是 Red Alert 3 Mod BuildStudio _(编者注：这个工具在中文社区简称SDK，然而实际上是一个误称，因为SDK是指整套工具。)_，位于您的 Mod SDK 安装目录中，文件名为 EALAModStudio.exe。Red Alert 3 Mod BuildStudio 是一个应用程序，它将**收集所有正确的文件、运行二进制资产生成器、创建模组的 .big 文件并将其安装在正确的位置**。

#### SKUDef 文件

Red Alert 3 Mod BuildStudio 工具可自动生成 SKUDef 文件。以下说明适用于选择不使用该工具的任何人。

SKUDef 文件告诉游戏如何启动您构建的 mod。要设置 SKUDef 文件，请导航到“我的文档”文件夹，选择“红色警戒 3”文件夹，然后选择“mods”文件夹，然后选择您刚刚构建的 mod 文件夹。创建一个新文件，并将其命名为：YourMod_1.0.skudef 在 Skudef 文件中，您将输入以下文本：

```
mod-game 1.9
add-big YourMod.big
```

这会告诉游戏启动游戏的补丁 1.09 版本，并将您的 Mod 中的数据添加到游戏中。

#### 启动 Mod

有两种方法可以启动游戏。最简单的方法是使用补丁 1.09 中包含的 Mod Launcher。启动“红色警戒 3”控制中心，然后选择“游戏浏览器”按钮。导航到“Mods”选项卡，选择您的 mod，然后点击“启动游戏”。

##### 高级方法

第二个选项对于创建快捷方式很有用，即使用命令行选项。为此，请创建 RA3.exe 的快捷方式，并将以下内容添加到目标中：

```
-modConfig "C:\Documents and Settings\Username\My Documents\Red Alert 3\mods\YourMod\YourMod_1.0.skudef"
```

modConfig 命令行选项会获取 mod 的 skudef 文件的完整路径。
