// 知识图谱唯一数据源，由知识图谱.md 同步生成。
export const skillGraphData = {
  "categories": {
    "math": {
      "label": "数学",
      "color": "#5a9ed6",
      "center": [
        -0.28,
        -0.14
      ]
    },
    "code": {
      "label": "编程工具",
      "color": "#4db7b5",
      "center": [
        -0.22,
        0.2
      ]
    },
    "data": {
      "label": "数据分析与呈现",
      "color": "#a18acb",
      "center": [
        0.02,
        -0.2
      ]
    },
    "ai": {
      "label": "算法与AI",
      "color": "#69b98a",
      "center": [
        0.27,
        -0.02
      ]
    },
    "expression": {
      "label": "研究与表达",
      "color": "#d18aa9",
      "center": [
        -0.01,
        0.29
      ]
    }
  },
  "nodes": [
    {
      "id": "数学",
      "name": "数学",
      "category": "math",
      "description": "数学研究数量、结构、空间与变化，并通过严格推理建立可复用的抽象规律。它为建模、算法和科学计算提供共同语言。",
      "uses": [
        "抽象推理",
        "问题表达",
        "理论基础"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "数学分析",
      "name": "数学分析",
      "category": "math",
      "description": "数学分析以极限理论为基础，系统研究函数、连续性、微分与积分。它强调证明过程和对变化规律的精确刻画。",
      "uses": [
        "极限理论",
        "函数研究",
        "严谨证明"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "高等代数",
      "name": "高等代数",
      "category": "math",
      "description": "高等代数研究线性空间、线性变换以及更一般的代数结构。它把具体计算提升为结构化的统一表达。",
      "uses": [
        "空间结构",
        "线性变换",
        "代数推理"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "概率论与数理统计",
      "name": "概率论与数理统计",
      "category": "math",
      "description": "概率论用数学方式刻画随机事件及其规律；数理统计从样本推断总体特征并衡量结论的可靠程度。两者共同支撑不确定性建模与数据驱动推断。",
      "uses": [
        "不确定性分析",
        "参数估计",
        "假设检验"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "离散数学",
      "name": "离散数学",
      "category": "math",
      "description": "离散数学研究图、集合、逻辑和组合结构，与计算机科学中的算法、网络和数据结构紧密相连。",
      "uses": [
        "图结构",
        "组合计数",
        "逻辑推理"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "数学建模",
      "name": "数学建模",
      "category": "math",
      "description": "数学建模把现实问题抽象为变量、关系和约束，再通过分析、计算与验证形成可以解释和使用的模型。",
      "uses": [
        "问题抽象",
        "模型求解",
        "结果验证"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "常微分方程",
      "name": "常微分方程",
      "category": "math",
      "description": "常微分方程研究含有一个自变量的函数与其导数之间的关系，是物理、工程和动力系统建模的基础工具。",
      "uses": [
        "动力系统",
        "物理建模",
        "解析求解"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "复变函数与可视化",
      "name": "复变函数与可视化",
      "category": "math",
      "description": "复变函数研究复数域上的解析函数及其性质，结合可视化手段直观展示复平面上的映射与奇异行为。",
      "uses": [
        "复分析",
        "共形映射",
        "几何直观"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "实变函数",
      "name": "实变函数",
      "category": "math",
      "description": "实变函数以测度论和勒贝格积分为核心，为现代分析、概率论和泛函分析提供严格的测度理论基础。",
      "uses": [
        "测度论",
        "勒贝格积分",
        "分析基础"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "泛函分析",
      "name": "泛函分析",
      "category": "math",
      "description": "泛函分析把函数视为无穷维空间中的点，用线性算子、范数和谱理论研究微分方程、优化和量子力学等问题。",
      "uses": [
        "无穷维空间",
        "算子理论",
        "变分方法"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "初等数论",
      "name": "初等数论",
      "category": "math",
      "description": "初等数论研究整数及其基本性质，包括素数、同余、不定方程等，是密码学和离散算法的数学根基。",
      "uses": [
        "素数理论",
        "同余运算",
        "密码基础"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "近世代数",
      "name": "近世代数",
      "category": "math",
      "description": "近世代数研究群、环、域等抽象代数结构，为编码理论、密码学和对称性分析提供数学框架。",
      "uses": [
        "群环域",
        "抽象结构",
        "对称分析"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "拓扑学",
      "name": "拓扑学",
      "category": "math",
      "description": "拓扑学研究在连续变形下保持不变的几何性质，关注连通性、紧致性和维数等定性结构。",
      "uses": [
        "连续变形",
        "空间分类",
        "定性几何"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "数值分析",
      "name": "数值分析",
      "category": "math",
      "description": "数值分析设计并分析求解数学问题的数值算法，关注误差估计、收敛性和稳定性，是科学计算的数学基础。",
      "uses": [
        "误差分析",
        "迭代求解",
        "算法稳定性"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "数字图像处理",
      "name": "数字图像处理",
      "category": "math",
      "description": "数字图像处理使用滤波、变换和复原等数学方法对图像进行增强、压缩和分析，连接数学与计算机视觉。",
      "uses": [
        "图像滤波",
        "频域变换",
        "特征提取"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "偏微分方程及数值解",
      "name": "偏微分方程及数值解",
      "category": "math",
      "description": "偏微分方程及数值解覆盖偏微分方程的理论建模与有限差分、有限元和谱方法等数值求解手段，在物理场仿真和工程计算中应用广泛。",
      "uses": [
        "方程建模",
        "有限差分",
        "有限元仿真"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "有限元分析",
      "name": "有限元分析",
      "category": "math",
      "description": "有限元分析把连续域划分为离散单元进行近似求解，广泛应用于结构力学、热传导和电磁场等工程领域。",
      "uses": [
        "离散划分",
        "结构仿真",
        "工程求解"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "运筹学",
      "name": "运筹学",
      "category": "math",
      "description": "运筹学在有限资源下通过数学建模寻找最优或近似最优的决策方案，覆盖线性规划、网络流、排队论等方向。",
      "uses": [
        "资源优化",
        "决策建模",
        "网络分析"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "数学体系的发展",
      "name": "数学体系的发展",
      "category": "math",
      "description": "数学体系的发展梳理从古典算术到现代抽象数学的演进脉络，帮助理解各分支之间的内在联系和演化逻辑。",
      "uses": [
        "历史脉络",
        "体系演变",
        "分支关联"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "数学史上经典问题",
      "name": "数学史上经典问题",
      "category": "math",
      "description": "研究数学史上著名问题（如费马大定理、哥德巴赫猜想、七桥问题等）的提出背景、解决历程和对后世的影响。",
      "uses": [
        "问题溯源",
        "思想启发",
        "方法借鉴"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "多项式理论",
      "name": "多项式理论",
      "category": "math",
      "description": "多项式理论研究多项式的根、因式分解、对称性和代数结构，连接高等代数、数论和计算代数。",
      "uses": [
        "根与因式",
        "对称多项式",
        "代数方程"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "凸分析",
      "name": "凸分析",
      "category": "math",
      "description": "凸分析研究凸集与凸函数的几何和分析性质，是凸优化、变分分析和经济学中分离定理等理论的基础。",
      "uses": [
        "凸集理论",
        "分离定理",
        "变分基础"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "变分理论",
      "name": "变分理论",
      "category": "math",
      "description": "变分理论通过变分原理寻找泛函的极值函数，连接数学分析、力学最小作用量原理和偏微分方程的弱解框架。",
      "uses": [
        "泛函极值",
        "最小作用量",
        "弱解理论"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "Python",
      "name": "Python",
      "category": "code",
      "description": "Python 是一门强调可读性与开发效率的通用编程语言，广泛用于数据处理、科学计算、自动化和人工智能。",
      "uses": [
        "数据处理",
        "科学计算",
        "自动化"
      ],
      "status": "基础使用",
      "preview": true
    },
    {
      "id": "Numpy",
      "name": "Numpy",
      "category": "code",
      "description": "Numpy 提供高效的多维数组和数值运算能力，是 Python 科学计算与数据分析生态的基础组件。",
      "uses": [
        "数组运算",
        "线性代数",
        "数值计算"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "Pandas",
      "name": "Pandas",
      "category": "code",
      "description": "Pandas 使用表格化数据结构组织、清洗和分析数据，适合处理常见的结构化数据任务。",
      "uses": [
        "数据清洗",
        "表格分析",
        "数据汇总"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "SciPy",
      "name": "SciPy",
      "category": "code",
      "description": "SciPy 在 Numpy 之上提供优化、积分、插值、信号处理和统计等科学计算工具。",
      "uses": [
        "数值求解",
        "科学计算",
        "优化分析"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "SymPy",
      "name": "SymPy",
      "category": "code",
      "description": "SymPy 是 Python 的符号计算工具，可以处理代数化简、方程求解、微积分和公式推导。",
      "uses": [
        "符号运算",
        "公式推导",
        "方程求解"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "Jupyter",
      "name": "Jupyter",
      "category": "code",
      "description": "Jupyter 把代码、文字、公式和图表组织在可执行笔记中，适合探索分析、教学演示和实验记录。",
      "uses": [
        "交互计算",
        "实验记录",
        "分析展示"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "JavaScript",
      "name": "JavaScript",
      "category": "code",
      "description": "JavaScript 是浏览器中的核心编程语言，可用于构建网页交互、数据可视化和轻量应用逻辑。",
      "uses": [
        "网页交互",
        "前端逻辑",
        "动态可视化"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "HTML",
      "name": "HTML",
      "category": "code",
      "description": "HTML 使用语义化标记描述网页内容结构，为文字、媒体、表单和可访问性提供基础。",
      "uses": [
        "内容结构",
        "语义标记",
        "网页基础"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "CSS、SCSS",
      "name": "CSS、SCSS",
      "category": "code",
      "description": "CSS 控制网页的排版与视觉表现，SCSS 在其基础上提供变量、嵌套和混入等增强能力，共同支撑响应式界面设计。",
      "uses": [
        "视觉样式",
        "响应式布局",
        "样式工程化"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "Git",
      "name": "Git",
      "category": "code",
      "description": "Git 是分布式版本控制系统，用于记录代码变化、管理分支并支持可追溯的协作过程。",
      "uses": [
        "版本管理",
        "分支协作",
        "变更追踪"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "Pytorch",
      "name": "Pytorch",
      "category": "code",
      "description": "PyTorch 是面向研究和生产的深度学习框架，以动态计算图和 Python 优先的设计理念受到广泛采用。",
      "uses": [
        "动态计算图",
        "模型训练",
        "自动微分"
      ],
      "status": "基础使用",
      "preview": true
    },
    {
      "id": "GitHub",
      "name": "GitHub",
      "category": "code",
      "description": "GitHub 围绕 Git 提供代码托管、协作评审和自动化能力，也是展示与维护开源项目的重要平台。",
      "uses": [
        "代码托管",
        "协作评审",
        "自动化流程"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "数据分析",
      "name": "数据分析",
      "category": "data",
      "description": "数据分析通过整理、探索和解释数据寻找规律，为判断问题、验证假设和支持决策提供依据。",
      "uses": [
        "探索分析",
        "规律发现",
        "决策支持"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "数据清洗",
      "name": "数据清洗",
      "category": "data",
      "description": "数据清洗识别并处理缺失、重复、异常和格式不一致的数据，为后续分析建立可靠基础。",
      "uses": [
        "缺失处理",
        "异常检查",
        "格式统一"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "数据可视化",
      "name": "数据可视化",
      "category": "data",
      "description": "数据可视化把数据关系编码为图形，帮助人们快速理解分布、趋势、差异和关联。",
      "uses": [
        "趋势表达",
        "模式发现",
        "结果沟通"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "Matplotlib",
      "name": "Matplotlib",
      "category": "data",
      "description": "Matplotlib 是 Python 的基础绘图库，可以精细控制统计图、科学图表和出版级图形。",
      "uses": [
        "科学绘图",
        "统计图表",
        "版式控制"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "Plotly",
      "name": "Plotly",
      "category": "data",
      "description": "Plotly 用于创建可交互的网页图表，适合探索数据、构建仪表盘和分享分析结果。",
      "uses": [
        "交互图表",
        "网页展示",
        "数据探索"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "Manim",
      "name": "Manim",
      "category": "data",
      "description": "Manim 是面向数学与技术内容的动画引擎，可以通过代码精确描述公式、图形和推导过程。",
      "uses": [
        "数学动画",
        "概念演示",
        "过程可视化"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "LaTeX",
      "name": "LaTeX",
      "category": "data",
      "description": "LaTeX 是高质量科技排版系统，擅长处理公式、参考文献和结构复杂的学术文档。",
      "uses": [
        "公式排版",
        "论文写作",
        "文献管理"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "Markdown",
      "name": "Markdown",
      "category": "data",
      "description": "Markdown 用轻量标记组织标题、列表、链接和代码，适合快速记录并转换为多种文档格式。",
      "uses": [
        "轻量写作",
        "知识记录",
        "技术文档"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "爬虫与数据清洗",
      "name": "爬虫与数据清洗",
      "category": "data",
      "description": "爬虫与数据清洗覆盖从网页抓取原始数据到结构化整理的全流程，为后续分析提供干净、可用的数据源。",
      "uses": [
        "网页抓取",
        "数据整理",
        "清洗流水线"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "回归聚类拟合",
      "name": "回归聚类拟合",
      "category": "data",
      "description": "回归、聚类和拟合是数据分析中常用的建模手段，用于发现变量关系、识别样本分组和逼近数据趋势。",
      "uses": [
        "趋势建模",
        "样本分组",
        "数据逼近"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "SQL",
      "name": "SQL",
      "category": "data",
      "description": "SQL 是关系数据库的标准查询语言，用于数据检索、聚合、连接和管理，是数据分析师的基础技能之一。",
      "uses": [
        "数据查询",
        "表连接",
        "聚合统计"
      ],
      "status": "学习中",
      "preview": false
    },
    {
      "id": "Power BI",
      "name": "Power BI",
      "category": "data",
      "description": "Power BI 是微软的商业智能工具，支持数据接入、可视化仪表盘构建和交互式报表分享。",
      "uses": [
        "仪表盘",
        "商业报表",
        "数据接入"
      ],
      "status": "学习中",
      "preview": false
    },
    {
      "id": "Seaborn",
      "name": "Seaborn",
      "category": "data",
      "description": "Seaborn 在 Matplotlib 之上提供更简洁的统计可视化接口和协调的默认视觉风格。",
      "uses": [
        "统计绘图",
        "分布比较",
        "关系探索"
      ],
      "status": "学习中",
      "preview": false
    },
    {
      "id": "AI",
      "name": "AI",
      "category": "ai",
      "description": "人工智能研究如何让计算系统完成感知、推理、生成和决策等任务，覆盖多种模型与方法。",
      "uses": [
        "智能推理",
        "内容生成",
        "任务自动化"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "机器学习",
      "name": "机器学习",
      "category": "ai",
      "description": "机器学习从数据中学习可泛化的规律，用于预测、分类、聚类和复杂决策问题。",
      "uses": [
        "预测建模",
        "模式识别",
        "数据驱动决策"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "深度学习",
      "name": "深度学习",
      "category": "ai",
      "description": "深度学习使用多层神经网络学习复杂表示，在图像、语音、文本和生成任务中应用广泛。",
      "uses": [
        "表示学习",
        "感知任务",
        "生成模型"
      ],
      "status": "基础使用",
      "preview": true
    },
    {
      "id": "神经网络",
      "name": "神经网络",
      "category": "ai",
      "description": "神经网络由相互连接的计算单元组成，通过优化参数逼近复杂函数和数据关系。",
      "uses": [
        "函数逼近",
        "特征学习",
        "非线性建模"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "回归与聚类",
      "name": "回归与聚类",
      "category": "ai",
      "description": "回归分析描述变量间关系并预测连续数值；聚类分析根据相似性将样本分组。两者是机器学习中最基础的两类建模方法。",
      "uses": [
        "关系解释",
        "数值预测",
        "样本分组"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "特征工程",
      "name": "特征工程",
      "category": "ai",
      "description": "特征工程把原始数据转换为更适合模型学习的表达，包括选择、构造、缩放和编码。",
      "uses": [
        "特征构造",
        "数据编码",
        "模型改进"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "模型评估",
      "name": "模型评估",
      "category": "ai",
      "description": "模型评估使用合适的指标和验证策略判断模型的有效性、稳定性与泛化能力。",
      "uses": [
        "指标选择",
        "交叉验证",
        "误差分析"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "自然语言处理",
      "name": "自然语言处理",
      "category": "ai",
      "description": "自然语言处理让计算机分析、理解和生成人类语言，连接语言学、统计学习与深度学习。",
      "uses": [
        "文本分析",
        "语言理解",
        "内容生成"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "算法",
      "name": "算法",
      "category": "ai",
      "description": "算法是解决问题的明确步骤与计算过程，关注正确性、效率以及对数据规模的适应能力。",
      "uses": [
        "问题求解",
        "效率优化",
        "流程设计"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "数据结构",
      "name": "数据结构",
      "category": "ai",
      "description": "数据结构规定数据的组织与访问方式，直接影响算法的表达、效率和可维护性。",
      "uses": [
        "数据组织",
        "高效访问",
        "算法实现"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "API",
      "name": "API",
      "category": "ai",
      "description": "API 通过明确接口让不同程序交换数据和调用能力，是系统集成与服务协作的基础。",
      "uses": [
        "系统集成",
        "数据交换",
        "能力调用"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "优化与搜索",
      "name": "优化与搜索",
      "category": "ai",
      "description": "优化与搜索研究在解空间中高效寻找最优或满意解的策略，涵盖梯度优化、启发式搜索和约束求解等方法。",
      "uses": [
        "梯度优化",
        "启发式搜索",
        "约束求解"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "图论",
      "name": "图论",
      "category": "ai",
      "description": "图论研究由顶点和边构成的网络结构，在路径规划、社交网络分析、推荐系统和知识图谱中应用广泛。",
      "uses": [
        "网络建模",
        "路径分析",
        "关系推理"
      ],
      "status": "基础使用",
      "preview": false
    },
    {
      "id": "AI工具使用",
      "name": "AI工具使用",
      "category": "ai",
      "description": "AI 工具使用涵盖主流大语言模型、代码助手和智能开发环境的实践应用，提升日常开发和研究效率。",
      "uses": [
        "LLM应用",
        "代码辅助",
        "效率提升"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "信息检索",
      "name": "信息检索",
      "category": "expression",
      "description": "信息检索通过检索式、来源筛选和证据核验，从大量资料中定位可靠且相关的信息。",
      "uses": [
        "资料搜索",
        "来源判断",
        "证据整理"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "知识管理",
      "name": "知识管理",
      "category": "expression",
      "description": "知识管理把零散信息整理为可查找、可关联和可持续更新的结构，支持长期学习与复用。",
      "uses": [
        "内容组织",
        "知识关联",
        "长期复用"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "可视化",
      "name": "可视化",
      "category": "expression",
      "description": "可视化使用空间、形状、颜色和运动表达信息关系，兼顾理解效率与叙事清晰度。",
      "uses": [
        "信息表达",
        "关系呈现",
        "视觉叙事"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "科学计算",
      "name": "科学计算",
      "category": "expression",
      "description": "科学计算利用数值方法和计算机模拟解决难以直接求解的数学与科学问题。",
      "uses": [
        "数值模拟",
        "方程求解",
        "计算实验"
      ],
      "status": "熟练掌握",
      "preview": true
    },
    {
      "id": "LaTeX/Word写作排版",
      "name": "LaTeX/Word写作排版",
      "category": "expression",
      "description": "LaTeX 与 Word 是学术写作和排版的两大工具，分别代表程序化精确排版与所见即所得的灵活编辑路线。",
      "uses": [
        "学术写作",
        "格式排版",
        "文档协作"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "Matlab/Python",
      "name": "Matlab/Python",
      "category": "expression",
      "description": "Matlab 和 Python 是科学计算与工程仿真的两大语言环境，覆盖数值计算、算法原型和数据分析全流程。",
      "uses": [
        "工程仿真",
        "算法原型",
        "数据处理"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "Drawio/Visio流程图",
      "name": "Drawio/Visio流程图",
      "category": "expression",
      "description": "Drawio 与 Visio 用于绘制架构图、流程图和UML图，将复杂逻辑和系统结构转化为可视化表达。",
      "uses": [
        "架构设计",
        "流程表达",
        "系统可视化"
      ],
      "status": "熟练掌握",
      "preview": false
    },
    {
      "id": "PPT设计演示",
      "name": "PPT设计演示",
      "category": "expression",
      "description": "PPT 设计与演示将研究成果和技术方案转化为清晰、有说服力的演讲稿与幻灯片，强调叙事结构和视觉呈现。",
      "uses": [
        "演讲叙事",
        "视觉呈现",
        "成果展示"
      ],
      "status": "熟练掌握",
      "preview": false
    }
  ],
  "links": [
    [
      "数学",
      "数学分析"
    ],
    [
      "数学",
      "高等代数"
    ],
    [
      "数学",
      "概率论与数理统计"
    ],
    [
      "数学",
      "离散数学"
    ],
    [
      "数学",
      "数学建模"
    ],
    [
      "数学",
      "数学体系的发展"
    ],
    [
      "数学",
      "数学史上经典问题"
    ],
    [
      "数学",
      "拓扑学"
    ],
    [
      "数学分析",
      "常微分方程"
    ],
    [
      "数学分析",
      "实变函数"
    ],
    [
      "数学分析",
      "复变函数与可视化"
    ],
    [
      "数学分析",
      "偏微分方程及数值解"
    ],
    [
      "数学分析",
      "泛函分析"
    ],
    [
      "高等代数",
      "初等数论"
    ],
    [
      "高等代数",
      "近世代数"
    ],
    [
      "高等代数",
      "多项式理论"
    ],
    [
      "实变函数",
      "泛函分析"
    ],
    [
      "泛函分析",
      "拓扑学"
    ],
    [
      "泛函分析",
      "变分理论"
    ],
    [
      "变分理论",
      "偏微分方程及数值解"
    ],
    [
      "拓扑学",
      "离散数学"
    ],
    [
      "离散数学",
      "运筹学"
    ],
    [
      "离散数学",
      "图论"
    ],
    [
      "数值分析",
      "偏微分方程及数值解"
    ],
    [
      "数值分析",
      "有限元分析"
    ],
    [
      "偏微分方程及数值解",
      "有限元分析"
    ],
    [
      "数学建模",
      "运筹学"
    ],
    [
      "数学建模",
      "数值分析"
    ],
    [
      "数学建模",
      "有限元分析"
    ],
    [
      "概率论与数理统计",
      "机器学习"
    ],
    [
      "概率论与数理统计",
      "数据分析"
    ],
    [
      "数字图像处理",
      "Matlab/Python"
    ],
    [
      "数学建模",
      "Python"
    ],
    [
      "数学建模",
      "算法"
    ],
    [
      "数值分析",
      "Numpy"
    ],
    [
      "数值分析",
      "SciPy"
    ],
    [
      "数学",
      "LaTeX"
    ],
    [
      "Python",
      "Numpy"
    ],
    [
      "Python",
      "Pandas"
    ],
    [
      "Python",
      "SciPy"
    ],
    [
      "Python",
      "SymPy"
    ],
    [
      "Python",
      "Jupyter"
    ],
    [
      "Python",
      "Pytorch"
    ],
    [
      "Python",
      "数据分析"
    ],
    [
      "Python",
      "Matplotlib"
    ],
    [
      "Python",
      "Manim"
    ],
    [
      "Python",
      "AI"
    ],
    [
      "Python",
      "机器学习"
    ],
    [
      "Python",
      "科学计算"
    ],
    [
      "Python",
      "爬虫与数据清洗"
    ],
    [
      "Numpy",
      "SciPy"
    ],
    [
      "Numpy",
      "Matplotlib"
    ],
    [
      "Numpy",
      "Seaborn"
    ],
    [
      "SciPy",
      "SymPy"
    ],
    [
      "Pandas",
      "数据分析"
    ],
    [
      "Pandas",
      "数据清洗"
    ],
    [
      "Matplotlib",
      "Seaborn"
    ],
    [
      "Matplotlib",
      "Manim"
    ],
    [
      "Seaborn",
      "数据可视化"
    ],
    [
      "JavaScript",
      "HTML"
    ],
    [
      "JavaScript",
      "CSS、SCSS"
    ],
    [
      "JavaScript",
      "Plotly"
    ],
    [
      "JavaScript",
      "数据可视化"
    ],
    [
      "JavaScript",
      "API"
    ],
    [
      "Git",
      "GitHub"
    ],
    [
      "Git",
      "Markdown"
    ],
    [
      "Pytorch",
      "深度学习"
    ],
    [
      "Pytorch",
      "神经网络"
    ],
    [
      "数据分析",
      "数据清洗"
    ],
    [
      "数据分析",
      "数据可视化"
    ],
    [
      "数据分析",
      "回归聚类拟合"
    ],
    [
      "数据分析",
      "机器学习"
    ],
    [
      "数据分析",
      "回归与聚类"
    ],
    [
      "数据分析",
      "模型评估"
    ],
    [
      "回归聚类拟合",
      "回归与聚类"
    ],
    [
      "数据可视化",
      "Matplotlib"
    ],
    [
      "数据可视化",
      "Seaborn"
    ],
    [
      "数据可视化",
      "Plotly"
    ],
    [
      "数据可视化",
      "可视化"
    ],
    [
      "爬虫与数据清洗",
      "数据清洗"
    ],
    [
      "数据清洗",
      "特征工程"
    ],
    [
      "Markdown",
      "LaTeX"
    ],
    [
      "Markdown",
      "知识管理"
    ],
    [
      "LaTeX",
      "LaTeX/Word写作排版"
    ],
    [
      "Manim",
      "可视化"
    ],
    [
      "Plotly",
      "可视化"
    ],
    [
      "AI",
      "机器学习"
    ],
    [
      "AI",
      "深度学习"
    ],
    [
      "AI",
      "自然语言处理"
    ],
    [
      "AI",
      "AI工具使用"
    ],
    [
      "AI",
      "算法"
    ],
    [
      "机器学习",
      "回归与聚类"
    ],
    [
      "机器学习",
      "神经网络"
    ],
    [
      "机器学习",
      "特征工程"
    ],
    [
      "机器学习",
      "模型评估"
    ],
    [
      "深度学习",
      "神经网络"
    ],
    [
      "深度学习",
      "自然语言处理"
    ],
    [
      "算法",
      "数据结构"
    ],
    [
      "算法",
      "优化与搜索"
    ],
    [
      "算法",
      "图论"
    ],
    [
      "算法",
      "离散数学"
    ],
    [
      "数据结构",
      "图论"
    ],
    [
      "优化与搜索",
      "图论"
    ],
    [
      "图论",
      "离散数学"
    ],
    [
      "信息检索",
      "知识管理"
    ],
    [
      "知识管理",
      "Markdown"
    ],
    [
      "可视化",
      "数据可视化"
    ],
    [
      "可视化",
      "Drawio/Visio流程图"
    ],
    [
      "可视化",
      "PPT设计演示"
    ],
    [
      "LaTeX/Word写作排版",
      "PPT设计演示"
    ],
    [
      "Matlab/Python",
      "Python"
    ],
    [
      "Matlab/Python",
      "科学计算"
    ],
    [
      "科学计算",
      "Numpy"
    ],
    [
      "科学计算",
      "SciPy"
    ],
    [
      "科学计算",
      "数学建模"
    ],
    [
      "数学建模",
      "凸分析"
    ],
    [
      "变分理论",
      "凸分析"
    ],
    [
      "优化与搜索",
      "凸分析"
    ],
    [
      "SQL",
      "数据分析"
    ],
    [
      "SQL",
      "Pandas"
    ],
    [
      "Power BI",
      "数据可视化"
    ],
    [
      "Power BI",
      "数据分析"
    ]
  ]
};
