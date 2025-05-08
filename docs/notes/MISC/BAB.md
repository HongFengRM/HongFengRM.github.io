---
title: RA3二进制文件构建器笔记
createTime: 2025/05/08 16:03:45
permalink: /MISC/rzgxxqdt/
---

BAB 是二进制资产构建器。是EALA用于将可读的XML文件转换为二进制的manifest文件和asset文件的可执行程序。 MS Visual C# / Basic.NET / MS VB 2005 [ Obfus/Crypted ]
Buildhelper 是EALA为了方便调用BAB使用的一个工具。用以便利化构建二进制数据的工作流程。
EALAModStudio 是EALA开放给社区的一个简化版本的Buildhelper。应当有很多的功能被砍掉了。

# BAB的可接受参数（由逆向得出）

| XmlAttribute       | ClassName                   | CommandLineOption        | Desc                                                                             | Type                                 |
| ------------------ | --------------------------- | ------------------------ | -------------------------------------------------------------------------------- | ------------------------------------ |
| schema             | SchemaPath                  | sp                       | 描述处理的XML文件的Schema                                                        | string                               |
| buildCacheRoot     | BuildCacheDirectory         | bcp,bcd                  | 在网络上用于缓存资产的目录                                                       | string                               |
|                    | SessionCache                | sc                       | 启用会话缓存 默认开启                                                            | bool                                 |
| buildCache         | BuildCache                  | bc                       | 启用构建缓存 默认开启                                                            | bool                                 |
|                    | SessionCacheDirectory       | scd,scp                  | 储存会话缓存的目录                                                               | string                               |
|                    | PartialSessionCache         | psc                      | 在中断的构建中，储存会话缓存 默认开启                                            | bool                                 |
|                    | TargetPlatform              | tp                       | 生成数据的目标平台                                                               | 列举。包括Win32\Xbox360\PlayStation3 |
|                    | CompressedSessionCache      | csc                      | 生成压缩的会话缓存 默认开启                                                      | bool                                 |
|                    | AlwaysTouchCache            | atc                      | Touch files in build cache even when not copied.                                 | bool                                 |
|                    | MetricsReporting            | mr                       | 启用指标报告                                                                     | bool                                 |
|                    | OldOutputFormat             | oof                      | 使用旧的输出三个独立文件的输出格式。已经废弃。                                   | bool                                 |
|                    | DataRoot                    | dr                       | 所有流XML文件的根目录                                                            | string                               |
|                    | TraceLevel                  | tl                       | 输出的追踪级别 默认3                                                             | int，0-9                             |
|                    | ErrorLevel                  | el                       | 输出的报错级别                                                                   | int，0-1                             |
|                    | BuildConfigurationName      | bcn                      | 使用的构建设置的名称                                                             | string                               |
|                    | PauseOnError                | poe                      | 如果有错误发生，在构建结束后暂停                                                 | bool                                 |
|                    | SingleFile                  | sf                       | 启用单文件模式                                                                   | bool                                 |
|                    | FreezeSessionCache          | fsc                      | 冻结会话缓存，防止会话缓存更新，用于debug                                        | bool                                 |
|                    | LinkedStreams               | ls                       | 启用Linked Streams                                                               | bool                                 |
|                    | IntermediateOutputDirectory | iod                      | 中间文件目录                                                                     | string                               |
|                    | OutputIntermediateXml       | oix                      | 为测试目的生成中间xml文件                                                        | bool                                 |
|                    | GuiMode                     | gui                      | 新建一个窗口用于文本输出                                                         | bool                                 |
|                    | ForceSlowCleanup            | slowclean                | 强制慢资产和cdata清除                                                            | bool                                 |
|                    | OutputDirectory             | od                       | 生成数据的输出目录                                                               | string                               |
|                    | InputPath                   | 强制第一个参数input_path | 需要处理的xml文件                                                                | string                               |
| -------            | -------                     | -------                  | -------                                                                          | -------                              |
|                    | DataPaths                   |                          |                                                                                  | string                               |
|                    | ArtPaths                    |                          |                                                                                  | string                               |
|                    | AudioPaths                  |                          |                                                                                  | string                               |
|                    | ProcessedMonitorPaths       |                          |                                                                                  | string                               |
|                    | Plugins                     |                          |                                                                                  | PluginDescriptor[]                   |
|                    | VerifierPlugins             |                          |                                                                                  | PluginDescriptor[]                   |
|                    | BuildConfigurations         |                          |                                                                                  | BuildConfiguration[]                 |
| -------            | -------                     | -------                  | -------                                                                          | -------                              |
| defaultArtPaths    | DefaultArtPaths             | art                      | 对于Art:别名的默认搜索路径                                                       | string                               |
| defaultAudioPaths  | DefaultAudioPaths           | audio                    | 对于audio:别名的默认搜索路径                                                     | string                               |
| defaultDataPaths   | DefaultDataPaths            | data                     | 对于adata:别名的默认搜索路径                                                     | string                               |
| monitorPaths       | MonitorPaths                | mp                       | 在Persistent模式下应该被监视变化的额外路径                                       | string                               |
| -------            | -------                     | -------                  | -------                                                                          | -------                              |
|                    | Postfix                     |                          |                                                                                  | string                               |
|                    | StreamPostfix               |                          |                                                                                  | string                               |
|                    | BigEndian                   |                          | 大端字节序                                                                       | bool                                 |
| -------            | -------                     | -------                  | -------                                                                          | -------                              |
|                    | StableSort                  | ss                       | 用更稳定的方式排序资产，但更慢                                                   | bool                                 |
|                    | BasePatchStream             | bps                      | Base stream upon which to do a patch                                             | String                               |
| usePrecompiled     | UsePrecompiled              | pc                       | 如果True，如果引用的流的 .manifest 输出可用，则不会对其进行编译                  | bool                                 |
| versionFiles       | VersionFiles                | vf                       | 如果True，每个包含流后缀的流都会生成一个.vesion文件                              | bool                                 |
|                    | CustomPostfix               | cpf                      | 如果True，如果指定，则将此后缀附加到配置定义的流后缀。对于版本控制很有用。默认空 | bool                                 |
| residentBab        | Resident                    | res,pers                 | 如果True，如果指定，BAB将以背景模式运行以极大降低启动和关闭次数                  | bool                                 |
| streamHints        | StreamHints                 | sh                       | 如果为真，则会话缓存中保存的stream hints将仅用于构建其中包含Dirty asset的流。    | bool                                 |
| -------            | -------                     | -------                  | -------                                                                          | -------                              |
|                    | AssetNamespace              |                          | 默认 "uri:ea.com:eala:asset"                                                     | string                               |
| -------            | -------                     | -------                  | -------                                                                          | -------                              |
| OutputAssetReport  | OutputAssetReport           | oar                      | 指定是否编译一个资产报告                                                         | bool                                 |
| OutputStringHashes | OutputStringHashes          | osh                      | 猜测为是否输出字符串哈希 默认开启                                                | bool                                 |
| -------            | -------                     | -------                  | -------                                                                          | -------                              |
|                    | StringHashBinDescriptors    |                          |                                                                                  | StringHashBinDescriptor[]            |

# 原版EALAModStudio使用的BAB参数

## step1, Build Data

```csharp
args.Arguments = String.Format("\"{0}\" /od:\"{1}\" /iod:\"{2}\" /ls:true /gui:false /pc:true /vf:false /el:0", StaticPaths.convertModNameToBABProjPath(BuildHelper.BuildTarget), StaticPaths.BuiltModsPath, StaticPaths.BuiltModsPath);
```

命令行 输出次序为：mod目录 输出目录 中间文件目录 启用链接流 关闭GUI 启用使用预编译文件 不启用版本文件 错误级别0

## step2, Build Medium LOD

```csharp
mediumLODArgs.Arguments = String.Format("\"{0}\" /od:\"{1}\" /iod:\"{2}\" /ls:true /gui:false /pc:true /vf:false /el:0 /bcn:MediumLOD /bps:\"{3}\"", StaticPaths.convertModNameToBABProjPath(BuildHelper.BuildTarget), StaticPaths.BuiltModsPath, StaticPaths.BuiltModsPath, StaticPaths.getBuiltModManifestPath(BuildHelper.BuildTarget));

```

命令行 输出次序为：mod目录 输出目录 中间文件目录 启用链接流 关闭GUI 启用使用预编译文件 不启用版本文件 错误级别0 使用的构建配置名称：MediumLOD 对上一步的Manifest进行patch

## step3, Build Low LOD

```csharp
lowLODArgs.Arguments = String.Format("\"{0}\" /od:\"{1}\" /iod:\"{2}\" /ls:true /gui:false /pc:true /vf:false /el:0 /bcn:LowLOD /bps:\"{3}\"", StaticPaths.convertModNameToBABProjPath(BuildHelper.BuildTarget), StaticPaths.BuiltModsPath, StaticPaths.BuiltModsPath, StaticPaths.getBuiltModManifestPath(BuildHelper.BuildTarget));
```

命令行 输出次序为：mod目录 输出目录 中间文件目录 启用链接流 关闭GUI 启用使用预编译文件 不启用版本文件 错误级别0 使用的构建配置名称：LowLOD 对上一步的Manifest进行patch

## step4, Copy STR File

```csharp
 CopyFileArguments copyFileFilteredArgs = new CopyFileArguments(StaticPaths.convertModNameToFullDataPath(BuildHelper.BuildTarget), StaticPaths.getBuiltModDataPath(BuildHelper.BuildTarget));
                    copyFileFilteredArgs.Filter = "*.str";
                    BuildHelper.RunStep(StepType.CopyFile, copyFileFilteredArgs);
```

应该是在data目录下自动寻找str文件进行复制

## step5, Include Shaders

```csharp
CopyFileArguments copyFileShadersArgs = new CopyFileArguments(StaticPaths.convertModNameToBaseDataPath(BuildHelper.BuildTarget)+"\\Shaders", StaticPaths.getBuiltModShaderPath(BuildHelper.BuildTarget));
                    copyFileShadersArgs.Filter = "*.fx";
                    BuildHelper.RunStep(StepType.CopyFile, copyFileShadersArgs);
```

同上 寻找.fx文件进行复制。

## step6, Make Big File

```csharp
RunExecutableArguments makeBigArgs = new RunExecutableArguments(StaticPaths.MakeBigPath);
                    makeBigArgs.Arguments = String.Format("-f \"{0}\" -x:*.asset -o:\"{1}\"", StaticPaths.getBuiltModPath(BuildHelper.BuildTarget), StaticPaths.getBuiltModBigPath(BuildHelper.BuildTarget));
                    BuildHelper.RunStep(StepType.RunExecutable, makeBigArgs);
```

使用命令行将所有的.asset文件打包

## step7, Copy Big File

```csharp
CopyFileArguments copyBigFileArgs = new CopyFileArguments(StaticPaths.getBuiltModBigPath(BuildHelper.BuildTarget), StaticPaths.getModInstallBigFilePath(BuildHelper.BuildTarget));
                    BuildHelper.DisplayLine(StaticPaths.getModInstallBigFilePath(BuildHelper.BuildTarget));
                    BuildHelper.RunStep(StepType.CopyFile, copyBigFileArgs);
```

使用命令行复制生成的big文件

## step8, Create SKUDEF

```csharp
 WriteFileArguments writeSKUDEFArgs = new WriteFileArguments(StaticPaths.getModInstallSKUDefPath(BuildHelper.BuildTarget, "1.0"));
                    writeSKUDEFArgs.Content = "mod-game " + (string)currentGUIData["gameversion"] + "\r\nadd-big " + BuildHelper.BuildTarget + ".big";
                    BuildHelper.RunStep(StepType.WriteFile, writeSKUDEFArgs);
```

生成SKUDEF文件

# 社区版EALAModStudio使用的BAB参数

省略了所有的清除缓存的内容

## 3 建立APTUI

```
argsAptUI.Arguments = String.Format("/C (@echo off) & (cd /D \"{0}\")"
						+ " & (for %I in (\"{1}\\aptui\\*\") do (del \"%I\" /F /Q))"
						+ " & (for %I in (\"{3}\\aptui\\*.xml\") do ("
							+ "(\"{2}\" \"%I\" /od:\"{4}\" /iod:\"{4}\" /csc:false /ls:true /osh:false /pc:true /res:true /slowclean:true /ss:true /art:\".;.\\Mods\\{5}\\Art;.\\Mods;.\\Art\" /audio:\".;.\\Mods\\{5}\\Audio;.\\Mods;.\\Audio\" /data:\".;.\\Mods\\{5}\\Data;.\\Mods;.\\SageXml\")"
							+ " & (if exist \"{1}\\aptui\\%~nI.manifest\" (echo. >\"{1}\\aptui\\%~nI.version\"))"
						+ "))",
						SDKDirectory, BuiltModDataPath, BinaryAssetBuilder, ModDataPath, BuiltModsPath, Mod);
```

对于每一个APTUI目录下的XML文件进行
不压缩的对话缓存 链接流 不启用字符串哈希 启用预编译 持久模式启动 慢清理启动 稳定排序 引用了新的别名目录

## 4 建立全局数据Building global data

```
argsGlobal.Arguments = String.Format("/C (@echo off) & (cd /D \"{0}\")"
						+ " & (for %I in (\"{1}\\additionalmaps\\mapmetadata_*\") do (del \"%I\" /F /Q))"
						+ " & (for %I in (\"{3}\\additionalmaps\\mapmetadata_*.xml\") do ("
							+ "(\"{2}\" \"%I\" /od:\"{4}\" /iod:\"{4}\" /csc:false /ls:true /osh:false /pc:true /res:true /slowclean:true /ss:true /art:\".;.\\Mods\\{5}\\Art;.\\Mods;.\\Art\" /audio:\".;.\\Mods\\{5}\\Audio;.\\Mods;.\\Audio\" /data:\".;.\\Mods\\{5}\\Data;.\\Mods;.\\SageXml\")"
						+ "))",
```

对于additionalmaps下的所有mapmetadata\_\*.xml做处理
不压缩的对话缓存 链接流 不启用字符串哈希 启用预编译 持久模式启动 慢清理启动 稳定排序 引用了新的别名目录

## 5 [建立基础数据](Building static data)

```
args.Arguments = String.Format("/C (@echo off) & (cd /D \"{0}\")"
						+ " & (if exist \"{1}\\mod.bin\" (del \"{1}\\mod.bin\" /F /Q))"
						+ " & (if exist \"{1}\\mod.imp\" (del \"{1}\\mod.imp\" /F /Q))"
						+ " & (if exist \"{1}\\mod.manifest\" (del \"{1}\\mod.manifest\" /F /Q))"
						+ " & (if exist \"{1}\\mod.relo\" (del \"{1}\\mod.relo\" /F /Q))"
						+ " & (if exist \"{1}\\mod.version\" (del \"{1}\\mod.version\" /F /Q))"
						+ " & (for %I in (\"{1}\\mod_*\") do (del \"%I\" /F /Q))"

						+ " & (\"{2}\" \"{3}\" /od:\"{4}\" /iod:\"{4}\" /csc:false /ls:true /osh:false /pc:true /res:true /slowclean:true /ss:true /art:\".;.\\Mods\\{5}\\Art;.\\Mods;.\\Art\" /audio:\".;.\\Mods\\{5}\\Audio;.\\Mods;.\\Audio\" /data:\".;.\\Mods\\{5}\\Data;.\\Mods;.\\SageXml\")",
						SDKDirectory, BuiltModDataPath, BinaryAssetBuilder, ModXml, BuiltModsPath, Mod);
```

构建静态数据
操作同上

## 6 [合并Assets资产](Merging assets)

```
argsMerge.Arguments = String.Format("/V:ON /C (@echo off) & (cd /D \"{0}\")"
						+ " & (for /R \"{1}\" %I in (\"\") do ("
							+ "(set assets=%~dpI)"
							+ " & (if exist \"!assets!*.asset\" (\"{2}\" \"{3}\\mod\" \"!assets:~0,-1!\"))"
						+ "))",
						SDKDirectory, ModAssetsPath, AssetMerger, BuiltModDataPath);
```

复制所有的asset文件
