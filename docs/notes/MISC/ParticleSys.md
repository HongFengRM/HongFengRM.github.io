---
title: RA3粒子系统笔记
createTime: 2025/05/08 16:04:56
permalink: /MISC/4xa0ydqr/
---

粒子系统代替了RA2中的Animation系统，直接在游戏内内置一个类似MAX中的粒子流源的系统，来实时生成所有的粒子。
包括了烟雾、爆炸、和看起来就像是粒子的粒子。dzl研究过使用这套系统导出适用于RA2的Anim的方式。实际上这套系统能做的粒子流源也可以，而且相对来说可能更加方便。

粒子系统分为具体的多个层级类型。
首先是最基本的粒子系统FXParticleSystemTemplate，一个粒子系统控制一种内容的粒子的生成效果。该系统类似于MAX中的粒子流源的发射。
该系统分为CPU粒子和GPU粒子两种。可能是对于粒子的发射和位置更新采用了不同的计算方式。按照当前的CPU、GPU算力差异和RTS的计算方式特征，可能应当尽可能的多使用GPU粒子以降低CPU压力。
粒子系统本身也是配置相对最多最复杂的一部分。

其次是粒子系统组成的FXlist，该系统用于控制一连串同时生成的粒子系统，以满足更加模块化的需求。该系统用于同时生成多种粒子。并且指定粒子的偏移。该系统类似于MAX中的粒子流源作为一个整体。

其次是DamageFX系统，该系统用于指定特定的武器的伤害效果（FXList）。可以指定这一武器在特定击中条件下的效果。
脑瘫EA在做XML的时候没有在具体的元素名中直接写明需要填哪种系统，邪恶阿
应该还有一系列别的东西，找到了我会往这里加。

参考文献：先进粒子特效教程(RP版2021)附实例.pdf RA3特效代码大字典 20240122.pdf

# 粒子系统

````xml
<!-- 原版的粒子系统XSD -->
<xs:complexType name="FXParticleSystemTemplate" xas:runtimeWrapper="::FXParticleSystem::ParticleSystemTemplate" xas:typeGroup="Xml">
		<xs:complexContent>
			<xs:extension base="BaseAssetType">
					<xs:sequence>
					<!--元素层级。指定发射出的粒子的具体情况。Sequence要求顺序固定 -->
						<xs:element name="SlavePosOffset" type="Vector3" minOccurs="0" xas:byValue="true" />
							<!-- 奴隸系統位置偏移 未使用 -->
						<xs:element name="Lifetime" type="ClientRandomVariable" minOccurs="0" xas:byValue="true" />
							<!-- 粒子存活时间 单位为帧（1/30秒） -->
						<xs:element name="Size" type="ClientRandomVariable" minOccurs="0" xas:byValue="true" />
							<!-- 粒子尺寸 单位应该是像素或MAX中的单位1 -->
						<xs:element name="StartSizeRate" type="ClientRandomVariable" minOccurs="0" xas:byValue="true" />
							<!-- 起始尺寸速率 RP说没测出来效果 可能和Update 里面的 RenderObject 模块里的 StartSize有关系。 -->
						<xs:element name="BurstDelay" type="ClientRandomVariable" minOccurs="0" xas:byValue="true" />
							<!-- 每一波次的间隔 单位为帧（1/30秒） -->
						<xs:element name="BurstCount" type="ClientRandomVariable" minOccurs="0" xas:byValue="true" />
							<!-- 每一波次的发射量 -->
						<xs:element name="InitialDelay" type="ClientRandomVariable" minOccurs="0" xas:byValue="true" />
							<!-- 初始的延迟 RP说已经代替了FXlist中的同名元素 待测试-->
						<xs:element name="Alphas" type="FXParticleAlpha" minOccurs="0" />
							<!-- 粒子透明度 1不透明 0透明 相对寿命是百分比 frame似乎只是个ID但必须连续-->
						<xs:element name="Colors" type="FXParticleColor" minOccurs="0" />
							<!-- 粒子颜色 控制例子颜色 HouseColor模块可以显示为所属色 BGR为0-1的范围 -->
						<xs:element name="Wind" type="FXParticleWind" minOccurs="0" />
							<!-- 模拟风 -->
						<xs:element name="Physics" type="FXParticlePhysicsModule" minOccurs="1" />
							<!-- 物理运动 单开一章 -->
						<xs:element name="Draw" type="FXParticleDrawModule" minOccurs="1" />
							<!-- 粒子的绘制形式 单开一章 -->
						<xs:element name="Volume" type="FXParticleVolumeModule" minOccurs="1" />
							<!-- 生成范围 指定粒子从一个什么范围内发射出来
							有Box Cylinder Line Spline Point Sphere TerrainFire Lighting几种可选
							该系统的逻辑大致是生成一个虚拟几何体，在上面按照某种方式随机采样产生生成点。
							IsHollow如果为true将禁止生成点在虚拟集合体内部采样。粒子将仅从虚拟几何体表面生成。
							Box中的三位数值是长宽高的一半
							Cylinder 中的offset是生成偏移 Radius是半径 RadiusRate是缩放率，像素每帧 Length是圆柱体总长度 但圆柱体中心在系统中心
							Line和Spline 都用起始点和结束点控制。前后左右和上下。
							Point无法控制。
							Sphere 中有半径控制 单位为像素
							TerrainFire 地形火 不知道咋用 大概是让地形上着火吧。有待去老游戏查证并实验。其中有一个粒子溢出可能性。
							Lighting配合Draws里的Lightning元素使用。
							-->
						<xs:element name="Velocity" type="FXParticleVelocityModule" minOccurs="1" />
							<!-- 运动
							Cylindrical 圆柱式 半径控制向外速度 normal控制向上（法线方向）的速度。 中心为系统中心。
							Ortho 正交式 用三个轴向的速度分量控制粒子。 中心为系统中心
							Outward 向外式 指定速度和第二速度 在以系统中心为中心赋予速度后速度中心为粒子中心。 可以搭配AngleXY使其跑曲线第二速度仅仅用于Cylinder Volume 第二速度和第一速度在垂直方向相交。
							Spherical 球形式 速度规定向外速度 RP称该模块的运动是随机的，无视粒子和系统中心
							WaveFront 波浪式 搭配WAVE_Particle 在水中兴风作浪 控制浪的运动速度 高度 波纹初始半径 形状
								形状可以是Circle 或者 Line -->
						<xs:element name="Event" type="FXParticleEventModule" minOccurs="0" xas:byValue="true" />
							<!-- 事件 额外附加效果 用于在这里为一个fxs配一个fxlist，实现复杂效果。
							其中有Life类型和Collision类型 通用配置有
								EventFX 指定一个FXList
								PerParticle指定是否每个粒子都挂一个
								KillAfterEvent可能是在事件执行结束后杀死粒子系统
							Life类型有 EventTime 指定Event延迟。该效果可能用于在只能填粒子系统的地方填FXList吧
							Collision类型在粒子碰撞到地面时生成一个Event 可以调整高度偏移和是否朝向地面。
							-->
						<xs:element name="Update" type="FXParticleUpdateModule" minOccurs="0" xas:byValue="true" />
							<!-- 粒子更新，包含旋转缩放
							Default用于贴图粒子，RenderObject用于模型粒子。个别特殊shader的GPU粒子也可以用RenderObject
							单开一章
							-->
					</xs:sequence>
					<!-- 属性层级。指定该粒子系统的属性。 -->
					<xs:attribute name="Priority" type="FXParticleSystem_Priority" default="ULTRA_HIGH_ONLY" />
						<!-- 优先级 在何种画质下显示 -->
					<xs:attribute name="IsOneShot" type="SageBool" default="false" />
						<!-- 是否只发射一次 -->
					<xs:attribute name="Shader" type="FXParticleSystem_ShaderType" default="ADDITIVE" />
						<!-- 采用何种Shader。改变粒子的叠加方式
						<xs:enumeration value="INVALID_SHADER" />无效shader
						<xs:enumeration value="ADDITIVE" />相加
						<xs:enumeration value="ADDITIVE_ALPHA_TEST" />相加且透明度二值
						<xs:enumeration value="ALPHA" />透明度混合
						<xs:enumeration value="ALPHA_TEST" />透明度二值
						<xs:enumeration value="MULTIPLY" />相乘 正片叠底
						<xs:enumeration value="ADDITIVE_NO_DEPTH_TEST" />相加 无深度测试
						<xs:enumeration value="ALPHA_NO_DEPTH_TEST" /> 透明度混合 无深度
						<xs:enumeration value="W3D_ALPHA" /> 用于模型
						-->
					<xs:attribute name="Type" type="FXParticleSystem_Type" default="PARTICLE"/>
						<!-- 类型 可以使用特定类型来实现特定效果
						<xs:enumeration value="INVALID_TYPE" />无效类型
						<xs:enumeration value="PARTICLE" />基本的CPU粒子类型 导致Alpha和Color无效
						<xs:enumeration value="DRAWABLE" />给模型的
						<xs:enumeration value="STREAK" />条纹，用于闪电和Draw里的Lighting
						<xs:enumeration value="VOLUME_PARTICLE" />不明
						<xs:enumeration value="GPU_PARTICLE" />GPU粒子类型 在Draw里有GPU代码 不能PerParticleAttachedSystem
						<xs:enumeration value="GPU_TERRAINFIRE" />地形火 不明
						<xs:enumeration value="SWARM" />蜂群 海啸F那个
						<xs:enumeration value="TRAIL" />轨迹 在Draw里有Trail段
						<xs:enumeration value="WAVE_PARTICLE" />在水里兴风作浪
						-->
					<xs:attribute name="ParticleTexture" type="TextureRef" />
						<!-- 粒子材质 引用一个贴图-->
					<xs:attribute name="Drawable" type="RenderObjectRef" />
						<!-- 渲染模型 引用一个渲染对象 和ScriptedModelDrawModel中一样可以直接填W3DContainer名字-->
					<xs:attribute name="SlaveSystem" type="FXParticleSystemWeakRef" />
						<!-- RA3未使用 ZH遗留 可以有机会了试试-->
					<xs:attribute name="PerParticleAttachedSystem" type="FXParticleSystemWeakRef" />
						<!-- 在每个粒子上挂一个系统。不支持GPU粒子。慎用阿慎用 -->
					<xs:attribute name="SystemLifetime" type="SageUnsignedInt" default="0" />
						<!-- 系统寿命  单位为帧（1/30秒）-->
					<xs:attribute name="SortLevel" type="SageUnsignedInt" default="0" />
						<!-- 排序等级 1为最高 0为最低（强制置底），在自然数范围内数字越大，优先度越低 -->
					<xs:attribute name="IsGroundAligned" type="SageBool" default="false" />
						<!-- 设定该粒子系统与地面平齐 -->
					<xs:attribute name="IsEmitAboveGroundOnly" type="SageBool" default="false" />
						<!-- 设定该粒子系统仅从地面发射 -->
					<xs:attribute name="IsParticleUpTowardsEmitter" type="SageBool" default="false" />
						<!-- 设定该粒子系统面向发射者 -->
					<xs:attribute name="UseMaximumHeight" type="SageBool" default="false" />
						<!-- 使用最大高度 不明 -->
					<xs:attribute name="EmitterSound" type="AudioEventInfoRef" use="optional" />
						<!-- 系统发射音效 -->
			</xs:extension>
		</xs:complexContent>
	</xs:complexType>
	```
## 物理元素
```xml
<!-- 物理元素 -->
	<xs:complexType name="FXParticlePhysicsModule">
		<xs:choice minOccurs="0" maxOccurs="1">
			<xs:element name="Default" type="FXParticleDefaultPhysics" />
			<!-- 正常的模块 -->
            <xs:element name="Swarm" type="FXParticleSwarmPhysics" />
			<!-- 蜂群专用 -->
        </xs:choice>
	</xs:complexType>

		<xs:complexType name="FXParticleDefaultPhysics">
		<xs:complexContent>
			<xs:extension base="FXParticlePhysicsBase">
				<xs:sequence>
					<xs:element name="VelocityDamping" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
					<!-- 速度乘数 1是速度不变 0是直接停止 -->
					<xs:element name="DriftVelocity" type="Vector3" minOccurs="0" maxOccurs="1" xas:byValue="true" />
					<!-- 漂移速度 所有粒子向特定方向漂移 -->
				</xs:sequence>
				<xs:attribute name="Gravity" type="SageReal" />
				<!-- 受重力影响 像素每帧平方 -->
				<xs:attribute name="Swirly" type="SageBool" />
				<!-- 好像是漩涡运动 需要进一步测试 -->
				<xs:attribute name="ParticlesAttachToBone" type="SageBool" />
				<!-- 让粒子吸附到骨骼上 不知道什么意思 可能是继承骨骼的速度？ -->
			</xs:extension>
		</xs:complexContent>
	</xs:complexType>

    <xs:complexType name="FXParticleSwarmPhysics">
        <xs:complexContent>
            <xs:extension base="FXParticlePhysicsBase">
                <xs:attribute name="AttractStrength" type="SageReal" default="0.0" />
				<!-- 吸引强度，可能是系统中心对蜂群的吸引力 -->
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>

````

## 绘制元素

```xml
	<xs:complexType name="FXParticleDrawModule">
		<xs:choice minOccurs="0" maxOccurs="1">
		<!-- 一个粒子只能有一个绘制类型 -->
			<xs:element name="Default" type="FXParticleDrawBase" />
			<!-- 基本CPU粒子 甚至里面没其他代码 -->
			<xs:element name="Gpu" type="FXParticleDrawGpu" />
			<!-- GPU粒子  单独讲-->
            <xs:element name="LightSource" type="FXParticleDrawLightSource" />
			<!-- 光源粒子（CPU粒子） 里面指定光源亮度（最大光照密度半径） -->
			<xs:element name="Lightning" type="FXParticleDrawLightning" />
			<!-- STERAK粒子专属 单独讲 -->
			<xs:element name="RenderObject" type="FXParticleDrawRenderObject" />
			<!-- 模型粒子 无实例需要研究！ -->
			<xs:element name="Streak" type="FXParticleDrawStreak" />
			<!-- 条纹粒子 教程里都没提过 也没内容 -->
            <xs:element name="Swarm" type="FXParticleDrawSwarm" />
			<!-- 蜂群粒子 单独讲 -->
            <xs:element name="Trail" type="FXParticleDrawTrail" />
			<!-- 轨迹粒子 单独讲 -->
		</xs:choice>
	</xs:complexType>
	<!-- GPU粒子 -->
	<xs:complexType name="FXParticleDrawGpu">
		<xs:complexContent>
			<xs:extension base="FXParticleDrawBase">
				<xs:attribute name="Shader" type="AssetId" default="GPUParticle.fx" />
				<!-- 指定GPU粒子的SHADER
				"GpuParticleXY.fx"使粒子变成一个绝对的平面。
				"GpuParticle.fx" 默认的基础shader
				"GpuParticleDistort.fx"多出来一个 DetailTexture 段的代码 但是不知道怎么用
				"GPUParticleDistortion.fx" 有空间扭曲效果
				"GPUParticleLit.fx" 可以让粒子看起来发光 只用于ALPHA类型贴图
				"GPUParticleLitAccumLight.fx"同上 但是有ColorScale可以用在ADDITIVE类型上。
				"GPUParticleNormalMap.fx" 将DetailTexture读取为法线，有立体效果。
				"GPUParticleOceanDisplacement.fx" 海洋置换 让水面上起波纹，需要参考原版的弄。
				"GpuParticlePerpendicularBottom.fx"垂直类型的两个shader
				"GpuParticlePerpendicularCenter.fx"这两个 Shader 可
					以使得 Update 里的 RenderObject 类型生效，不过两个 Shader 之间的区别十分细微，只是
					面片轴心的不同，gpuparticleperpendicularbottom 生成的粒子，其轴心位于 X 值的最前
					方与 Y 值的中央，而 gpuparticleperpendicularcenter 生成的粒子，轴心位于 X 值的中央
					与 Y 值的中央。具体表现的不同可以从 Y 轴的旋转看出来。同时不同于其它 Shader 是生成
					一个永远对着摄像头的正方形，这两个 Shader 将会生成一个平面，且不随摄像头移动而移动。
				"GpuParticleUnderwater.fx"给水下粒子使用的 Shader，据测试在水面之上是正常显示的
					颜色，进入水中就会被染上一点蓝色模拟水下效果
				-->
				<xs:attribute name="FramesPerRow" type="SageInt" default="1" />
				<!-- 精灵图一行几个 -->
				<xs:attribute name="TotalFrames" type="SageInt" default="1" />
				<!-- 精灵图一共多少帧数 从左到右，由上而下 -->
				<xs:attribute name="SingleRow" type="SageInt" default="0" />
				<!--  0 时无任何作用，为-1 时会让粒子从将一整张贴图不同部分按顺序
				显示改变成只随机显示贴图里横着的一行，那一行图片依然是从左到右按顺序显示。自然数则只显示特定行数。-->
				<xs:attribute name="RandTex" type="SageInt" default="0" />
				<!-- RandTex 不为 0 时将会取消依次显示图片的能力，每个粒子只会随机显示一张图片，且不会再改变。 -->
				<xs:attribute name="DetailTexture" type="TextureRef" />
				<!-- 第二贴图，具体需要搭配特定shader -->
				<xs:attribute name="SpeedMultiplier" type="SageReal" default="1.0" />
				<!-- 控制着粒子切换贴图的速度，经测试为 SpeedMultiplier 为 1 时是大约两帧切换一次 -->
				<xs:attribute name="GeometryType" type="FXParticleSystem_GeometryType" default="SIMPLE_QUAD" />
				<!-- 控制显示粒子的虚拟集合体的类型。
					<xs:enumeration value="INVALID" /> 无显示
					<xs:enumeration value="SIMPLE_QUAD" /> 简单的平面
					<xs:enumeration value="CENTERED_QUAD" /> 居中的、有中心的平面
					<xs:enumeration value="TWO_CONCENTRIC_QUADS" />两个同轴的四边形
					<xs:enumeration value="TWO_QUADS" /> 两个平面-->
				<xs:attribute name="SortParticles" type="SageBool" default="false" />
				<!-- 排序粒子 不明 -->
				<xs:attribute name="EnableSoftParticles" type="SageBool" default="true" />
				<!-- 启动软粒子 不明 -->
				<xs:attribute name="MiscValue1" type="SageReal" default="0.0" />
				<xs:attribute name="MiscValue2" type="SageReal" default="0.0" />
				<xs:attribute name="MiscValue3" type="SageReal" default="0.0" />
				<xs:attribute name="MiscValue4" type="SageReal" default="0.0" />
				<!-- 应该是和shader配合使用的，向shader传参。 -->
			</xs:extension>
		</xs:complexContent>
	</xs:complexType>
	<!-- 闪电粒子 -->
	<!-- 这一坨比较复杂，需要去参考原版的改。 -->
	<xs:complexType name="FXParticleDrawLightning">
		<xs:complexContent>
			<xs:extension base="FXParticleDrawBase">
                <xs:sequence>
                    <xs:element name="StartPoint" type="Vector3" minOccurs="1" maxOccurs="1" />
					<!-- 起始点 -->
                    <xs:element name="EndPoint" type="Vector3" minOccurs="1" maxOccurs="1" />
					<!-- 终止点 -->
					<!-- 实际似乎这两个数值无效，这种粒子不能直接挂，而是必须作为武器的开火FX，然后用fxlist的获取目标功能 -->
                    <xs:element name="RandomSet" minOccurs="2" maxOccurs="2">
					<!-- 随机组 控制电流怎么拧的 需要有两个 -->
					<!-- 应该实际上是在两个组里做随机抽取，从而得到一个像是电的东西 -->
					<!-- 每一个随机组大概是一个参数在指定范围内波动的，前后有两种波形的正弦波变形结果。 -->
					<!-- 两个变形了的正弦波最后以更抽象的方式插值，形成一个噪波。 -->
					<!-- 理论上这里可以填常数，得到一个不插值的正弦波闪电。由此观之甚至可以做各种奇怪的波形方式，而不仅限于放电。 -->
                        <xs:complexType>
                            <xs:sequence>
                                <xs:element name="StartAmplitude" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true"/>
								<!-- 起始振幅 -->
                                <xs:element name="EndAmplitudeChange" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true"/>
								<!-- 终止振幅 -->
                                <xs:element name="StartFrequency" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true"/>
								<!-- 起始频率 -->
                                <xs:element name="EndFrequencyChange" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true"/>
								<!-- 终止频率 -->
                                <xs:element name="StartPhase" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true"/>
								<!-- 起始相 -->
                                <xs:element name="EndPhaseChange" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true"/>
								<!-- 终止相 -->
                            </xs:sequence>
                        </xs:complexType>
                    </xs:element>
                </xs:sequence>
            </xs:extension>
		</xs:complexContent>
	</xs:complexType>

	<!-- 模型渲染段 -->
	<!-- 原版压根没用过这个东西，有待测试。 -->
	<xs:complexType name="FXParticleDrawRenderObject">
		<xs:complexContent>
			<xs:extension base="FXParticleDrawBase">
				<xs:sequence>
					<xs:element name="ObjectSet" minOccurs="3" maxOccurs="3">
					<!-- 需要三个ObjectSet元素 -->
						<xs:complexType>
							<xs:attribute name="RenderGroup" type="AssetId" />
							<!-- 渲染组 类型居然是资产ID！有待继续测试。 -->
							<xs:attribute name="NumObjects" type="SageInt" default="0" />
							<!-- 数量 -->
							<xs:attribute name="Percent" type="Percentage" default="0.0" />
							<!-- 占比。可能三个set需要加和为1. -->
						</xs:complexType>
					</xs:element>

				</xs:sequence>
				<xs:attribute name="SinkRate" type="SageReal" default="0.0" />
				<!-- 下沉率 -->
				<xs:attribute name="MultiRenderObjects" type="SageBool" default="false" />
				<!-- 多个渲染对象 猜测如果为1则会导致三个object同时被渲染出来？ -->
				<xs:attribute name="SinkOnTerrainCollision" type="SageBool" default="false" />
				<!-- 在和地形碰撞后下沉 -->
			</xs:extension>
		</xs:complexContent>
	</xs:complexType>
	<!-- 蜂群粒子 -->
	<!-- 需要测试。 -->
    <xs:complexType name="FXParticleDrawSwarm">
        <xs:complexContent>
            <xs:extension base="FXParticleDrawBase" >
                <xs:attribute name="OpaqueSpeed" type="SageReal" default="0" />
				<!-- 不透明速度 -->
                <xs:attribute name="TransparentSpeed" type="SageReal" default="100.0" />
				<!-- 透明速度 -->
                <xs:attribute name="SpeedStretchAmount" type="SageReal" default="1.0" />
				<!-- 速度拉伸量 可能是在运动轨迹上拉伸粒子 -->
                <xs:attribute name="AttractStrength" type="SageReal" default="0.0" />
				<!-- 吸引强度 可能是系统中心吸引强度 -->
                <xs:attribute name="EnvironmentTexture" type="TextureRef" />
				<!-- 环境贴图 不知道 -->
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>
	<!-- 轨迹粒子 -->
    <xs:complexType name="FXParticleDrawTrail">
		<xs:complexContent>
			<xs:extension base="FXParticleDrawBase" >
				<xs:attribute name="TrailLife" type="SageInt" default="30" />
				<!-- 轨迹寿命 帧 -->
				<xs:attribute name="UTile" type="SageReal" default="1.0" />
				<xs:attribute name="VTile" type="SageReal" default="1.0" />
				<!-- UV里占用几个 -->
				<xs:attribute name="UScrollRate" type="SageReal" default="0.0" />
				<xs:attribute name="VScrollRate" type="SageReal" default="0.0" />
				<!-- UV滚动率 -->
			</xs:extension>
		</xs:complexContent>
	</xs:complexType>
```

## 风模拟

原版多用于轨迹被风吹了， 需要大量测试！

```XML
	<xs:complexType name="FXParticleWind">
		<xs:attribute name="Motion" type="FXParticleSystem_WindMotion" default="NOT_USED" />
		<!-- 运动方式 -->
		<xs:attribute name="Strength" type="SageReal" default="2.0" />
		<!-- 风力强度 -->
		<xs:attribute name="FullStrengthDist" type="SageReal" default="75.0" />
		<!-- 全力的dist 可能是distance？ -->
		<xs:attribute name="ZeroStrengthDist" type="SageReal" default="200.0" />
		<!-- 零力的 -->
		<xs:attribute name="AngleChangeMin" type="SageReal" default=".15" />
		<xs:attribute name="AngleChangeMax" type="SageReal" default=".45" />
		<!-- 角度变化的最大最小值 -->
		<xs:attribute name="PingPongStartAngleMin" type="SageReal" default="0.0" />
		<xs:attribute name="PingPongStartAngleMax" type="SageReal" default="0.7853981633974483"/>
		<xs:attribute name="PingPongEndAngleMin" type="SageReal" default="5.4977871437821381" />
		<xs:attribute name="PingPongEndAngleMax" type="SageReal" default="6.2831853071795864" />
		<!-- Pingpong运动模式的起始结束角度 -->
		<xs:attribute name="TurbulenceAmplitude" type="SageReal" default="0" />
		<xs:attribute name="TurbulenceFrequency" type="SageReal" default="0" />
		<!-- 扰动的振幅和频率 -->
	</xs:complexType>
	<!-- 一个实例 -->
		<Wind AngleChangeMax="10" AngleChangeMin="-10" FullStrengthDist="1" Motion="PING_PONG"
		PingPongEndAngleMin="5.49779" Strength="1" TurbulenceAmplitude="0.01" TurbulenceFrequency="0.1"/>
```

## update段

```xml
	<xs:complexType name="FXParticleUpdateModule">
		<xs:choice minOccurs="0" maxOccurs="1">
			<xs:element name="Default" type="FXParticleUpdateDefault" />
			<!-- 给贴图类粒子用的 -->
			<xs:element name="RenderObject" type="FXParticleUpdateRenderObject" />
			<!-- 给模型粒子用的 -->
		</xs:choice>
	</xs:complexType>

	<xs:complexType name="FXParticleUpdateDefault">
        <xs:complexContent>
            <xs:extension base="FXParticleUpdateBase">
                <xs:sequence>
                    <xs:element name="SizeRate" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
					<!-- 尺寸缩放率 0不动 单位像素每帧 -->
                    <xs:element name="SizeRateDamping" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" xas:initialize="1.0f, 1.0f"/>
					<!-- 尺寸缩放率乘数 0的时候上一条直接不起作用，1的时候上一条不衰减-->
                    <xs:element name="AngleZ" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
					<!-- 生成时的Z轴偏移 单位为弧度 -->
                    <xs:element name="AngularRateZ" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
                    <xs:element name="AngularDamping" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
					<!-- Z轴的旋转速度和衰减 -->
                    <xs:element name="AngleXY" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
                    <xs:element name="AngularRateXY" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
                    <xs:element name="AngularDampingXY" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" xas:initialize="1.0f, 1.0f" />
					<!-- 同上，但是XY轴 但是ra3中粒子的XY轴并不产生实际影响，仅仅跟Outward的运动方式存在联动-->
                </xs:sequence>
                <xs:attribute name="Rotation" type="FXParticleSystem_RotationType" default="ROTATION_OFF" />
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>
	<!-- 旋转类型 -->
		<xs:simpleType name="FXParticleSystem_RotationType"
								xas:useEnumPrefix="false"
								xas:targetNamespace="FXParticleSystem">
		<xs:restriction base="xs:string">
			<xs:enumeration value="INVALID_ROTATION" />
			<!-- 无效旋转 不旋转  在RenderObject中也不旋转-->
			<xs:enumeration value="ROTATION_OFF" />
			<!-- 实际上绕着自己为中心旋转  RenderObject中不旋转-->
			<xs:enumeration value="ROTATE_AROUND_VELOCITY" />
			<!-- 似乎是以速度为准进行旋转  RenderObject中粒子平面与其运动方向平行-->
			<xs:enumeration value="ROTATE_IN_WORLD_SPACE" />
			<!-- 似乎是以世界空间参照旋转 RenderObject中正常旋转-->
		</xs:restriction>
	</xs:simpleType>

    <xs:complexType name="FXParticleUpdateRenderObject">
		<xs:complexContent>
			<xs:extension base="FXParticleUpdateBase">
				<xs:sequence>
					<xs:element name="AngleX" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
					<xs:element name="AngularRateX" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
                    <xs:element name="AngleY" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
                    <xs:element name="AngularRateY" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
					<xs:element name="AngleZ" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
                    <xs:element name="AngularRateZ" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
                    <xs:element name="AngularDamping" type="ClientRandomVariable" minOccurs="0" maxOccurs="1" xas:byValue="true" />
					<!-- 三个轴向的初始旋转和旋转率和衰减 -->
                    <xs:element name="StartSize" type="RandCoord3D" minOccurs="1" maxOccurs="1" />
					<!-- 初始尺寸 -->
					<xs:element name="SizeRate" type="RandCoord3D" minOccurs="1" maxOccurs="1" />
					<!-- 尺寸率 -->
					<xs:element name="SizeDamping" type="RandCoord3D" minOccurs="1" maxOccurs="1" />
					<!-- 尺寸变化衰减 这三个会覆盖size的设定，而且可以在三个轴向上设置变化 -->
				</xs:sequence>
                <xs:attribute name="Rotation" type="FXParticleSystem_RotationType" default="ROTATION_OFF" />
            </xs:extension>
		</xs:complexContent>
	</xs:complexType>




```

```xml
<!-- Damage FX系统中的可选项 -->
<xs:complexType name="DamageFXGroup">
		<xs:attribute name="Type" type="DamageFXType" default="DEFAULT" />
		<xs:attribute name="Amount" type="SageReal" default="0.0" />
		<xs:attribute name="ThrottleTime" type="Time" default="0s" />

		<xs:attribute name="MajorFX" type="FXListRef" />
		<xs:attribute name="MinorFX" type="FXListRef" />
		<xs:attribute name="RearFX" type="FXListRef" />
		<xs:attribute name="SideFX" type="FXListRef" />
		<xs:attribute name="TopFX" type="FXListRef" />

		<!-- Is FX when hit by veteran unit -->
		<xs:attribute name="VeteranMajorFX" type="FXListRef" />
		<xs:attribute name="VeteranMinorFX" type="FXListRef" />
		<xs:attribute name="VeteranRearFX" type="FXListRef" />
		<xs:attribute name="VeteranSideFX" type="FXListRef" />
		<xs:attribute name="VeteranTopFX" type="FXListRef" />
	</xs:complexType>
```
