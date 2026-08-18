(function () {
  "use strict";

  const rawDays = [
    ["学习习惯与能力", `
acquire|v.|获得；习得|acquire new skills
adapt|v.|适应；调整|adapt to a new environment
assess|v.|评估；评价|assess academic progress
concentrate|v.|集中注意力|concentrate on a task
consistent|adj.|持续稳定的；一致的|consistent study habits
discipline|n.|自律；纪律|develop self-discipline
efficient|adj.|高效的|an efficient learning method
independent|adj.|独立的；自主的|an independent learner
motivate|v.|激励；促使|motivate students to learn
participate|v.|参加；参与|participate in class discussions
potential|n.|潜力；可能性|reach one's full potential
prioritise|v.|优先处理|prioritise important tasks
retain|v.|记住；保留|retain new information
strategy|n.|策略；方法|a practical learning strategy
review|v.|复习；回顾|review vocabulary regularly`],
    ["学校与教育", `
academic|adj.|学术的；学习方面的|academic performance
curriculum|n.|课程设置|the school curriculum
compulsory|adj.|必修的；强制的|compulsory education
evaluate|v.|评价；评估|evaluate student performance
literacy|n.|读写能力；素养|improve digital literacy
qualification|n.|资格；学历|gain a professional qualification
tuition|n.|学费；教学|pay university tuition
scholarship|n.|奖学金|apply for a scholarship
assignment|n.|作业；任务|complete an assignment
vocational|adj.|职业的；职业教育的|vocational training
theoretical|adj.|理论的|theoretical knowledge
practical|adj.|实际的；实用的|practical experience
educator|n.|教育工作者|an experienced educator
achievement|n.|成就；成绩|academic achievement
enrol|v.|注册；入学|enrol in a course`],
    ["校园与成长", `
adolescent|n.|青少年|adolescent development
peer|n.|同龄人；同伴|peer pressure
collaborate|v.|合作；协作|collaborate on a project
confidence|n.|信心|build self-confidence
curiosity|n.|好奇心|encourage intellectual curiosity
extracurricular|adj.|课外的|extracurricular activities
feedback|n.|反馈；意见|receive constructive feedback
guidance|n.|指导；引导|career guidance
initiative|n.|主动性；倡议|show personal initiative
leadership|n.|领导能力|develop leadership skills
mentor|n.|导师；指导者|an academic mentor
responsibility|n.|责任|take responsibility for learning
socialise|v.|社交；交往|socialise with classmates
wellbeing|n.|身心健康；福祉|student wellbeing
resilient|adj.|有韧性的；适应力强的|become more resilient`],
    ["数字科技", `
access|n.|使用权；获取途径|access to information
automate|v.|使自动化|automate routine tasks
device|n.|设备|a mobile device
digital|adj.|数字化的|digital technology
innovation|n.|创新；革新|technological innovation
privacy|n.|隐私|protect personal privacy
reliable|adj.|可靠的|a reliable source
virtual|adj.|虚拟的|a virtual classroom
artificial|adj.|人工的；人造的|artificial intelligence
algorithm|n.|算法|a recommendation algorithm
cybersecurity|n.|网络安全|improve cybersecurity
database|n.|数据库|an online database
software|n.|软件|educational software
transform|v.|彻底改变；转化|transform the way we work
convenient|adj.|方便的|a convenient online service`],
    ["媒体与信息", `
advertise|v.|做广告；宣传|advertise a new product
audience|n.|观众；受众|reach a wider audience
bias|n.|偏见；偏向|media bias
credible|adj.|可信的|a credible news source
influence|v.|影响|influence public opinion
journalist|n.|新闻记者|an investigative journalist
misleading|adj.|误导性的|misleading information
publish|v.|出版；发布|publish an article
regulate|v.|监管；控制|regulate online content
source|n.|来源；出处|check the original source
subscribe|v.|订阅|subscribe to a newspaper
exposure|n.|接触；曝光|exposure to violent content
headline|n.|标题；头条|a newspaper headline
consume|v.|消费；使用|consume online media
verify|v.|核实；验证|verify a claim`],
    ["环境基础", `
conserve|v.|保护；节约|conserve natural resources
contaminate|v.|污染|contaminate drinking water
ecosystem|n.|生态系统|a fragile ecosystem
emission|n.|排放物|reduce carbon emissions
endangered|adj.|濒危的|endangered species
habitat|n.|栖息地|protect natural habitats
pollution|n.|污染|air pollution
recycle|v.|回收利用|recycle household waste
renewable|adj.|可再生的|renewable energy
sustainable|adj.|可持续的|sustainable development
biodiversity|n.|生物多样性|preserve biodiversity
deforestation|n.|森林砍伐|prevent deforestation
ecological|adj.|生态的|ecological balance
landfill|n.|垃圾填埋场|send waste to landfill
preserve|v.|保护；保存|preserve the natural environment`],
    ["气候与能源", `
climate|n.|气候|climate change
fossil|adj.|化石形成的|fossil fuels
generate|v.|产生；发电|generate electricity
solar|adj.|太阳能的|solar power
wind|n.|风；风能|wind energy
temperature|n.|温度|rising global temperatures
drought|n.|干旱|a severe drought
flood|n.|洪水|the risk of flooding
extreme|adj.|极端的|extreme weather events
power|v.|为……提供动力|power homes with clean energy
deplete|v.|耗尽；大量消耗|deplete natural resources
alternative|n.|替代品；选择|an alternative to coal
low-carbon|adj.|低碳的|a low-carbon economy
transition|n.|转变；过渡|the transition to clean energy
carbon|n.|碳|reduce the carbon footprint`],
    ["城市生活", `
urban|adj.|城市的|urban development
rural|adj.|农村的|rural communities
infrastructure|n.|基础设施|public infrastructure
facility|n.|设施；场所|community facilities
overcrowded|adj.|过度拥挤的|overcrowded cities
pedestrian|n.|行人|pedestrian safety
residential|adj.|住宅区的|a residential area
commercial|adj.|商业的|a commercial district
suburb|n.|郊区|live in the suburbs
construction|n.|建造；建筑工程|a construction project
amenity|n.|生活便利设施|local amenities
population|n.|人口|a growing urban population
sanitation|n.|公共卫生设施|improve basic sanitation
renovate|v.|翻新；修缮|renovate old buildings
accessible|adj.|容易到达或使用的|accessible public spaces`],
    ["交通出行", `
commute|v.|通勤|commute to work
congestion|n.|拥堵|traffic congestion
transport|n.|交通运输|public transport
vehicle|n.|交通工具；车辆|electric vehicles
route|n.|路线|a bus route
fare|n.|车费|affordable fares
capacity|n.|容量；运载能力|increase passenger capacity
maintain|v.|维护；保养|maintain the railway network
delay|n.|延误|a long flight delay
destination|n.|目的地|reach a destination
cycle|v.|骑自行车|cycle to school
traffic|n.|交通；车流|heavy traffic
network|n.|网络；系统|a transport network
integrated|adj.|综合的；一体化的|an integrated transport system
reduce|v.|减少|reduce journey times`],
    ["健康与医疗", `
diagnose|v.|诊断|diagnose a disease
treatment|n.|治疗；疗法|receive medical treatment
prevent|v.|预防；阻止|prevent serious illness
symptom|n.|症状|common symptoms
chronic|adj.|慢性的|a chronic condition
recover|v.|康复；恢复|recover from an illness
healthcare|n.|医疗保健|access to healthcare
immune|adj.|免疫的|the immune system
mental|adj.|精神的；心理的|mental health
physical|adj.|身体的|physical activity
therapy|n.|治疗；疗法|receive physical therapy
patient|n.|病人|treat a patient
medicine|n.|药物；医学|take prescribed medicine
risk|n.|风险|reduce the risk of disease
screening|n.|筛查；检查|health screening`],
    ["饮食与生活方式", `
balanced|adj.|均衡的|a balanced diet
intake|n.|摄入量|daily calorie intake
nutrition|n.|营养|adequate nutrition
obesity|n.|肥胖|childhood obesity
portion|n.|一份；部分|a small portion
processed|adj.|加工过的|processed food
protein|n.|蛋白质|a source of protein
vitamin|n.|维生素|vitamin deficiency
habit|n.|习惯|healthy eating habits
sedentary|adj.|久坐的|a sedentary lifestyle
moderate|adj.|适度的|moderate exercise
sleep|n.|睡眠|get enough sleep
stress|n.|压力|manage daily stress
routine|n.|日常规律|a healthy daily routine
addiction|n.|成瘾|smartphone addiction`],
    ["工作与职业", `
career|n.|职业；事业|choose a career path
colleague|n.|同事|work with colleagues
employer|n.|雇主|a responsible employer
employee|n.|雇员|train new employees
flexible|adj.|灵活的|flexible working hours
occupation|n.|职业|a skilled occupation
professional|adj.|专业的；职业的|professional development
recruit|v.|招聘|recruit qualified staff
remote|adj.|远程的|remote working
salary|n.|工资|earn a competitive salary
skill|n.|技能|develop communication skills
workforce|n.|劳动力|a highly trained workforce
productivity|n.|生产效率|increase workplace productivity
promotion|n.|晋升；推广|receive a promotion
unemployment|n.|失业|youth unemployment`],
    ["经济与消费", `
afford|v.|买得起；承担得起|afford basic necessities
budget|n.|预算|a limited household budget
consumer|n.|消费者|protect consumer rights
demand|n.|需求|meet growing demand
economy|n.|经济|support the local economy
expense|n.|费用；开支|cover living expenses
income|n.|收入|a stable income
inflation|n.|通货膨胀|a rise in inflation
invest|v.|投资；投入|invest in education
poverty|n.|贫困|reduce extreme poverty
purchase|v.|购买|purchase goods online
resource|n.|资源|allocate public resources
wealth|n.|财富|the distribution of wealth
financial|adj.|金融的；财务的|financial support
economic|adj.|经济的|economic growth`],
    ["社会与公平", `
equality|n.|平等|promote gender equality
inequality|n.|不平等|reduce income inequality
discrimination|n.|歧视|prevent racial discrimination
community|n.|社区；群体|support the local community
volunteer|n.|志愿者|work as a volunteer
charity|n.|慈善机构；慈善|donate to charity
vulnerable|adj.|脆弱的；易受伤害的|vulnerable groups
minority|n.|少数群体|an ethnic minority
social|adj.|社会的|social responsibility
welfare|n.|福利；福祉|social welfare programmes
inclusion|n.|包容；融合|encourage social inclusion
opportunity|n.|机会|equal opportunities
barrier|n.|障碍|remove social barriers
status|n.|地位；身份|social status
support|n.|支持；援助|provide practical support`],
    ["文化与传统", `
heritage|n.|遗产；传统|protect cultural heritage
tradition|n.|传统|maintain a local tradition
custom|n.|风俗；习惯|a traditional custom
identity|n.|身份；特征|cultural identity
diverse|adj.|多样的|a culturally diverse society
festival|n.|节日|celebrate a traditional festival
generation|n.|一代人|pass knowledge to the next generation
historic|adj.|有历史意义的|a historic building
language|n.|语言|preserve a minority language
museum|n.|博物馆|visit a national museum
perform|v.|表演；履行|perform traditional music
religious|adj.|宗教的|religious beliefs
value|n.|价值观；价值|shared cultural values
artistic|adj.|艺术的|artistic expression
contemporary|adj.|当代的；现代的|contemporary culture`],
    ["全球化与交流", `
global|adj.|全球的|a global challenge
international|adj.|国际的|international cooperation
exchange|n.|交流；交换|a cultural exchange
migration|n.|迁移；移民|international migration
multicultural|adj.|多元文化的|a multicultural society
overseas|adv.|在海外|study overseas
cooperate|v.|合作|cooperate with other countries
interact|v.|互动；相互影响|interact with local people
border|n.|边界；国界|cross an international border
import|v.|进口|import agricultural products
export|v.|出口|export goods abroad
foreign|adj.|外国的|foreign investment
communication|n.|交流；通信|cross-cultural communication
connection|n.|联系；连接|strengthen global connections
perspective|n.|视角；观点|gain an international perspective`],
    ["政府与公共政策", `
authority|n.|当局；权力|local authorities
campaign|n.|运动；宣传活动|a public health campaign
citizen|n.|公民|protect citizens' rights
government|n.|政府|government expenditure
policy|n.|政策|introduce a new policy
public|adj.|公共的；公众的|public services
reform|n.|改革|education reform
tax|n.|税|raise income tax
allocate|v.|分配|allocate funds to schools
ban|v.|禁止|ban harmful products
implement|v.|实施；执行|implement an effective policy
legislation|n.|法律；立法|introduce new legislation
official|n.|官员|a government official
priority|n.|优先事项|a national priority
subsidy|n.|补贴|provide a public subsidy`],
    ["法律与安全", `
crime|n.|犯罪|reduce violent crime
criminal|n.|罪犯|convict a criminal
legal|adj.|法律的；合法的|seek legal advice
illegal|adj.|非法的|illegal online activity
law|n.|法律|enforce the law
penalty|n.|处罚|impose a financial penalty
prison|n.|监狱|serve a prison sentence
protect|v.|保护|protect the public
security|n.|安全|improve public security
victim|n.|受害者|support crime victims
deter|v.|威慑；阻止|deter people from committing crime
punishment|n.|惩罚|an appropriate punishment
evidence|n.|证据|collect reliable evidence
justice|n.|正义；司法|the criminal justice system
offence|n.|违法行为；罪行|commit a serious offence`],
    ["科学与发现", `
analyse|v.|分析|analyse scientific data
experiment|n.|实验|conduct an experiment
discover|v.|发现|discover a new species
laboratory|n.|实验室|work in a laboratory
observe|v.|观察|observe changes over time
scientific|adj.|科学的|scientific evidence
theory|n.|理论|test a scientific theory
method|n.|方法|a reliable research method
measure|v.|测量；衡量|measure air quality
accurate|adj.|准确的|accurate measurements
biology|n.|生物学|study human biology
chemistry|n.|化学|a basic knowledge of chemistry
physics|n.|物理学|the laws of physics
technology|n.|技术|medical technology
breakthrough|n.|重大突破|a scientific breakthrough`],
    ["研究与数据", `
data|n.|数据|collect reliable data
research|n.|研究|carry out academic research
survey|n.|调查|conduct an online survey
sample|n.|样本|a representative sample
statistics|n.|统计数据|official statistics
factor|n.|因素|a significant factor
indicate|v.|表明；显示|the results indicate that
demonstrate|v.|证明；展示|demonstrate a clear link
compare|v.|比较|compare two approaches
contrast|v.|对比|contrast urban and rural areas
estimate|v.|估计|estimate the total cost
finding|n.|研究发现|a key research finding
variable|n.|变量|control other variables
valid|adj.|有效的；合理的|a valid conclusion
objective|adj.|客观的|an objective assessment`],
    ["心理与行为", `
attitude|n.|态度|a positive attitude
behaviour|n.|行为|change consumer behaviour
emotion|n.|情绪；情感|express strong emotions
anxiety|n.|焦虑|reduce test anxiety
depression|n.|抑郁|symptoms of depression
personality|n.|性格；人格|personality development
motivation|n.|动力；动机|lack of motivation
perception|n.|看法；感知|public perception
psychological|adj.|心理的|psychological wellbeing
response|n.|反应；回应|an emotional response
self-esteem|n.|自尊|improve self-esteem
consequence|n.|后果|a negative consequence
decision|n.|决定|make an informed decision
impulsive|adj.|冲动的|impulsive behaviour
cope|v.|应对|cope with pressure`],
    ["沟通与语言", `
communicate|v.|交流；传达|communicate ideas clearly
conversation|n.|谈话|have a meaningful conversation
express|v.|表达|express an opinion
gesture|n.|手势；姿态|use hand gestures
interpret|v.|理解；口译|interpret a speaker's meaning
message|n.|信息；要点|deliver a clear message
persuade|v.|说服|persuade people to act
respond|v.|回应|respond to a question
clarify|v.|澄清；说明|clarify a difficult point
debate|n.|辩论；讨论|take part in a debate
fluent|adj.|流利的|become fluent in English
misunderstand|v.|误解|misunderstand the main point
negotiate|v.|协商|negotiate an agreement
pronunciation|n.|发音|improve English pronunciation
verbal|adj.|口头的；言语的|verbal communication`],
    ["家庭与人口", `
household|n.|家庭；住户|household income
relative|n.|亲属|a close relative
childcare|n.|儿童照护|affordable childcare
elderly|adj.|年长的|care for elderly people
birth|n.|出生|the birth rate
lifespan|n.|寿命|an increasing average lifespan
demographic|adj.|人口结构的|demographic change
dependent|adj.|依赖的|financially dependent children
marriage|n.|婚姻|the average age of marriage
parental|adj.|父母的|parental responsibility
sibling|n.|兄弟姐妹|relationships between siblings
relationship|n.|关系|maintain a close relationship
upbringing|n.|养育；成长环境|a supportive upbringing
adult|n.|成年人|young adults
family|n.|家庭|family structure`],
    ["住房与社区", `
accommodation|n.|住宿；住房|affordable accommodation
apartment|n.|公寓|rent a small apartment
property|n.|房产；财产|property prices
rent|n.|租金|pay monthly rent
shelter|n.|住所；庇护|provide temporary shelter
homeless|adj.|无家可归的|support homeless people
neighbourhood|n.|社区；街区|a safe neighbourhood
resident|n.|居民|local residents
housing|n.|住房|the housing shortage
ownership|n.|所有权|home ownership
developer|n.|开发商；开发者|a property developer
density|n.|密度|high population density
affordable|adj.|负担得起的|affordable housing
relocate|v.|搬迁；重新安置|relocate to another city
neighbour|n.|邻居|maintain good relations with neighbours`],
    ["旅游与旅行", `
tourism|n.|旅游业|international tourism
tourist|n.|游客|attract foreign tourists
attraction|n.|景点；吸引力|a popular tourist attraction
journey|n.|旅程|a long train journey
local|adj.|当地的|support local businesses
resort|n.|度假胜地|a coastal holiday resort
hospitality|n.|款待；酒店餐饮业|the hospitality industry
itinerary|n.|旅行计划|plan a travel itinerary
landmark|n.|地标|a historic landmark
seasonal|adj.|季节性的|seasonal employment
souvenir|n.|纪念品|buy a local souvenir
visitor|n.|访客；游客|visitor numbers
cultural|adj.|文化的|cultural tourism
impact|n.|影响|the impact of mass tourism
responsible|adj.|负责任的|responsible travel`],
    ["农业与粮食", `
agriculture|n.|农业|sustainable agriculture
crop|n.|农作物|grow food crops
farm|n.|农场|a family-run farm
farmer|n.|农民|support local farmers
fertiliser|n.|肥料|chemical fertilisers
harvest|n.|收成；收获|a successful harvest
irrigation|n.|灌溉|an irrigation system
livestock|n.|牲畜|raise livestock
organic|adj.|有机的|organic food
pesticide|n.|农药|reduce pesticide use
soil|n.|土壤|improve soil quality
supply|n.|供应|the global food supply
yield|n.|产量|increase crop yields
scarce|adj.|稀缺的|scarce water resources
food security|n.|粮食安全|improve food security`],
    ["自然资源", `
mineral|n.|矿物|valuable mineral resources
raw|adj.|未经加工的|raw materials
extract|v.|提取；开采|extract oil from the ground
reserve|n.|储备；保护区|natural gas reserves
shortage|n.|短缺|a severe water shortage
waste|n.|废弃物；浪费|reduce industrial waste
reusable|adj.|可重复使用的|reusable shopping bags
finite|adj.|有限的|finite natural resources
abundant|adj.|丰富的|an abundant supply
distribution|n.|分配；分布|water distribution
management|n.|管理|resource management
overuse|n.|过度使用|the overuse of groundwater
restore|v.|恢复；修复|restore damaged land
replenish|v.|补充；重新装满|replenish water supplies
availability|n.|可获得性|the availability of clean water`],
    ["写作核心动词", `
argue|v.|主张；争论|argue that change is necessary
claim|v.|声称；主张|claim that the policy works
consider|v.|考虑；认为|consider the long-term effects
contribute|v.|促成；贡献|contribute to economic growth
decline|v.|下降；减少|decline gradually
enhance|v.|提高；增强|enhance quality of life
establish|v.|建立；证实|establish a clear relationship
examine|v.|研究；检查|examine the main causes
illustrate|v.|说明；阐明|illustrate a general trend
increase|v.|增加|increase significantly
justify|v.|证明合理|justify public spending
occur|v.|发生|occur over a long period
require|v.|需要；要求|require immediate action
resolve|v.|解决|resolve a social problem
suggest|v.|表明；建议|the evidence suggests that`],
    ["学术核心形容词", `
appropriate|adj.|适当的|an appropriate solution
beneficial|adj.|有益的|beneficial to society
considerable|adj.|相当大的|a considerable increase
crucial|adj.|至关重要的|play a crucial role
detrimental|adj.|有害的|detrimental to health
effective|adj.|有效的|an effective measure
essential|adj.|必不可少的|an essential public service
feasible|adj.|可行的|a feasible solution
fundamental|adj.|根本的；基础的|a fundamental change
significant|adj.|显著的；重要的|a significant difference
limited|adj.|有限的|limited financial resources
negative|adj.|负面的|a negative impact
positive|adj.|积极的；正面的|a positive outcome
relevant|adj.|相关的|relevant information
complex|adj.|复杂的|a complex social issue`],
    ["逻辑连接与趋势", `
consequently|adv.|因此；所以|consequently leading to change
therefore|adv.|因此|therefore require action
however|adv.|然而|however remain limited
whereas|conj.|然而；反之|whereas the second group declined
furthermore|adv.|此外|furthermore provide support
nevertheless|adv.|尽管如此|nevertheless remain important
overall|adv.|总体而言|overall show an upward trend
gradually|adv.|逐渐地|increase gradually
dramatically|adv.|显著地；剧烈地|fall dramatically
approximately|adv.|大约|approximately 40 percent
proportion|n.|比例|a large proportion of students
trend|n.|趋势|a downward trend
fluctuate|v.|波动|fluctuate throughout the period
remain|v.|保持|remain relatively stable
account|v.|占据；解释|account for half of the total`],
  ];

  window.VOCAB_DAYS_RAW = rawDays;
})();
