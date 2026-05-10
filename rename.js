/**
更新时间：2026-05-10

*** 脚本用途说明 ***
本脚本适用于 Sub-Store 单条订阅的节点名称标准化与标签处理。支持多语言、灵活标签拼接、节点筛选与排序等高级功能。

*** 参数拼接 ***
所有参数均通过 URL 查询字符串拼接到脚本链接后，格式为：

  <脚本URL>#参数1=值1&参数2=值2&...&参数N=值N[#noCache]

参数与参数之间使用 & 连接，参数名与参数值之间用 = 连接。所有参数值必须经过 URI 编码（encodeURIComponent），以确保特殊字符正确传递。
如需禁用缓存，可在参数末尾追加 #noCache。

*** 脚本参数说明 ***

  参数名                     | 参数取值                                                      | 说明
  ---------------------------|--------------------------------------------------------------|-------------------------------------------------------------
  countryLabelType <string>  | zh|en|code（国家中文名称<默认>|国家英文名称|国家两位字母代码）   | 输出节点的国家标签（countryLabel）类型
  providerLabel <string>     | 任意字符串                                                    | 添加机场/VPS等服务提供商标签
  providerLabelPos <string>  | head<默认>|tail                                              | providerLabel 拼接位置，head为头部，tail为尾部
  addFlagLabel <bool>        | true|1|on|yes（添加<默认>）                                   |
                             | false|0|off|no（不添加）                                      | 添加国旗标签（flagLabel）
  addRateLabel <bool>        | true|1|on|yes（添加）                                         |
                             | false|0|off|no（不添加<默认>）                                | 添加倍率标签（rateLabel），如 [0.5×, 3×, 6×] 等
  addLineLabel <bool>        | true|1|on|yes（添加）                                         |
                             | false|0|off|no（不添加<默认>）                                | 添加线路标签（lineLabel），如 [家宽, IPLC, IEPL] 等
  customLabel <string>       | 关键词1+关键词2...                                            |
                             | 支持“关键词>新名字”重命名                                      | 自定义标签的添加与重命名，符号"|"分隔多个关键词，区分大小写。例：[customLabel=流媒体|金融|VLESS+WS+REALITY] 添加包含关键词节点，或 [customLabel=流媒体>Streaming|VLESS+WS+REALITY>Vless] 可重命名
  filterInvalid <bool>       | true|1|on|yes（过滤<默认>）                                   |
                             | false|0|off|no（不过滤）                                      | 过滤无效节点，包含“套餐|到期|有效|剩余|版本|已用|过期|失联|官方|网址|备用|群|客服|网站|获取|订阅|流量|机场|下次|官址|联系|邮箱|工单|学术|USE|USED|TOTAL|EXPIRE|EMAIL”等关键词
  filterUnmatched <bool>     | true|1|on|yes（过滤）                                         |
                             | false|0|off|no（不过滤<默认>）                                | 过滤没有匹配到的节点
  rateRange <string>         | 区间表达式，如 !1.5|,2|5                                      | 过滤倍率区间，支持多区间与区间级别取反。多个区间用逗号分隔，!前缀表示取反区间。例如：rateRange=!1.5|,2|5 表示倍率小于1.5或在2~5之间（含2和5）的节点会被保留。区间边界为空表示无穷大/小，如"|3" 表示小于等于3，"5|"表示大于等于5。
  providerLabelSep <string>  | 1-2字符（默认"|"）                                            | providerLabel分隔符，1字符时添加到providerLabel后/前，2字符时分别为左右边界
  indexLabelSep <string>     | 1-2字符（默认"#"）                                            | 节点序号标签（indexLabel）分隔符，1字符时添加到indexLabel前，2字符时分别为左右边界
  attrLabelSep <string>      | 1-2字符（默认"[]"）                                           | 属性标签分隔符，1字符时添加到属性标签前，2字符时为左右边界（属性标签的定义见下方示例）
  attrItemSep <string>       | 1字符（默认"|"）                                              | 属性标签元素之间的分隔符
  sortNodes <bool>           | true|1|on|yes（排序）                                         |
                             | false|0|off|no（不排序<默认>）                                | 是否对新节点进行分组排序
  rmSingleIdx <bool>         | true|1|on|yes（移除）                                         |
                             | false|0|off|no（保留<默认>）                                  | 仅有一个节点时移除序号01
  blockQuic <bool>           | true|1|on|yes（阻止）                                         |
                             | false|0|off|no（不阻止<默认>）                                | 是否阻止 QUIC 协议

*** 节点名称示例 ***
示例一：<机场A> 🇭🇰 香港-12 [2×|家宽|AnyTLS]
// "机场A"：服务提供商标签（providerLabel）
// "<>"：服务提供商标签分隔符（providerLabelSep）
// "🇭🇰"：国旗标签（flagLabel）
// "香港"：国家标签（countryLabel）
// "12"：序号标签（indexLabel）
// "-"：序号标签分隔符（indexLabelSep）
// "2×|家宽|AnyTLS"：整体称为属性标签（attrLabel）
// "|"：属性标签元素分隔符（attrItemSep）
// "2×"：倍率标签（rateLabel）
// "家宽"：线路标签（lineLabel）
// "AnyTLS"：自定义标签（customLabel）
// "[]"：属性标签分隔符（attrLabelSep）

示例二：🇺🇸 United States#1 <3×|IPLC|VLESS+WS+REALITY> | SomeVPS
// "🇺🇸"：国旗标签（flagLabel）
// "United States"：国家标签（countryLabel）
// "1"：序号标签（indexLabel）
// "#"：序号标签分隔符（indexLabelSep）
// "3×|IPLC|VLESS+WS+REALITY"：整体称为属性标签（attrLabel）
// "|"：属性标签元素分隔符（attrItemSep）
// "3×"：倍率标签（rateLabel）
// "IPLC"：线路标签（lineLabel）
// "VLESS+WS+REALITY"：自定义标签（customLabel）
// "<>"：属性标签分隔符（attrLabelSep）
// "SomeVPS"：服务提供商标签（providerLabel）
// "|"：服务提供商标签分隔符（providerLabelSep）
*/

const inArg = $arguments;
function boolArg(value, defaultValue = false) {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") return defaultValue;
    if (/^(true|1|on|yes)$/i.test(trimmed)) return true;
    if (/^(false|0|off|no)$/i.test(trimmed)) return false;
    return defaultValue;
  }
  return !!value;
}

function parseEnumArg(value, validList, defaultValue) {
  if (typeof value !== 'string') return defaultValue;
  const v = value.trim().toLowerCase();
  for (const item of validList) {
    if (v === item.toLowerCase()) return item;
  }
  return defaultValue;
}

function parseSepArg(value, defaultValue) {
  if (typeof value !== 'string') return defaultValue;
  let v = value.trim();
  if (v.length > 2) v = v.slice(0, 2);
  // 只允许符号，排除中英文字符和数字
  if (!/^[^a-zA-Z0-9\u4e00-\u9fa5]+$/.test(v)) return defaultValue;
  return v || defaultValue;
}

const addFlagLabel = boolArg(inArg.addFlagLabel, true),
      addRateLabel = boolArg(inArg.addRateLabel, false),
      addLineLabel = boolArg(inArg.addLineLabel, false),
      filterInvalid = boolArg(inArg.filterInvalid, true),
      filterUnmatched = boolArg(inArg.filterUnmatched, false),
      sortNodes = boolArg(inArg.sortNodes, false),
      rmSingleIdx = boolArg(inArg.rmSingleIdx, false),
      blockQuic = boolArg(inArg.blockQuic, false);

const countryLabelType = parseEnumArg(inArg.countryLabelType, ["zh", "en", "code"], "zh"),
      providerLabel = inArg.providerLabel == undefined ? "" : decodeURI(inArg.providerLabel),
      providerLabelPos = parseEnumArg(inArg.providerLabelPos, ["head", "tail"], "head"),
      customLabel = inArg.customLabel == undefined ? "" : decodeURI(inArg.customLabel),
      rateRange = inArg.rateRange == undefined ? "" : decodeURI(inArg.rateRange),
      providerLabelSep = parseSepArg(inArg.providerLabelSep == undefined ? "|" : decodeURI(inArg.providerLabelSep), "|"),
      indexLabelSep = parseSepArg(inArg.indexLabelSep == undefined ? "#" : decodeURI(inArg.indexLabelSep), "#"),
      attrLabelSep = parseSepArg(inArg.attrLabelSep === undefined ? '[]' : decodeURI(inArg.attrLabelSep), '[]'),
      attrItemSep = parseSepArg(inArg.attrItemSep === undefined ? '|' : decodeURI(inArg.attrItemSep), '|');
      
// ==================== 数据表 ====================
const INVALID_LABELS = [
  "(?:套餐|到期|过期|已用|剩余|有效|版本|失联|官方|网址|网站|官址|备用|群|客服|获取|订阅|流量|下次|联系|邮箱|工单)",
  "(?:plan|expire|used|total|left|valid|official|website|backup|group|support|subscription|traffic|next|contact|email|ticket)"
];

const COUNTRY_LABELS = [
  { en: "Hong Kong", zh: "香港", code: "HK", flag: "🇭🇰", alias: ["(?:Hong\\s*Kong|HK|🇭🇰)", "(?:香港|(?:深|(?:沪|滬)|呼|京|(?:广|廣)|杭)港)"] },
  { en: "United States", zh: "美国", code: "US", flag: "🇺🇸", alias: ["(?:United\\s*States|USA|US|🇺🇸|Los\\s*Angeles|LA|San\\s*Jose|Silicon\\s*Valley|Seattle|San\\s*Francisco|Dallas|Chicago|New\\s*York|Ashburn|Phoenix|Atlanta)", "(?:美国|美國|(?:深|(?:沪|滬)|呼|京|(?:广|廣)|杭)美|洛杉矶|洛杉磯|圣何塞|聖荷西|硅谷|矽谷|西雅图|西雅圖|旧金山|舊金山|三藩(?:市)?|达拉斯|達拉斯|芝加哥|纽约|紐約|阿什本|凤凰城|鳳凰城|亚特兰大|亞特蘭大)"] },
  { en: "Taiwan", zh: "台湾", code: "TW", flag: "🇹🇼", alias: ["(?:Tai\\s*wan|TW|🇹🇼|(?:New\\s*)?Tai\\s*pei|Tao\\s*yuan|Hsin\\s*chu|Tai\\s*chung|Tai\\s*nan|Kao\\s*hsiung)", "(?:台湾|臺灣|台北|臺北|新北|桃园|桃園|新竹|台中|臺中|台南|臺南|高雄)"] },
  { en: "Japan", zh: "日本", code: "JP", flag: "🇯🇵", alias: ["(?:Japan|JP|🇯🇵|Tokyo|Osaka|Nagoya|Fukuoka|Sapporo)", "(?:日本|(?:深|(?:沪|滬)|呼|京|(?:广|廣)|杭|中|(?:辽|遼))日|东京|東京|大坂|名古屋|福冈|福岡|札幌)"] },
  { en: "South Korea", zh: "韩国", code: "KR", flag: "🇰🇷", alias: ["(?:South\\s*Korea|KR|🇰🇷|ROK|Seoul|Busan|Incheon|Inchon|Chuncheon|Daejeon|Gwangju|Daegu)", "(?:韩国|韓國|首尔|首爾|漢城|釜山|仁川|春川|大田|光州|大邱)"] },
  { en: "Singapore", zh: "新加坡", code: "SG", flag: "🇸🇬", alias: ["(?:Singapore|SG|🇸🇬)", "(?:新加坡|狮城|獅城|(?:深|(?:沪|滬)|呼|京|(?:广|廣)|杭)新)"] },
  { en: "India", zh: "印度", code: "IN", flag: "🇮🇳", alias: ["(?:India|IN|🇮🇳|Mumbai|Delhi|Bangalore|Kolkata|Chennai)", "(?:印度|孟买|孟買|德里|班加罗尔|班加羅爾|加尔各答|加爾各答|钦奈|清奈|欽奈)"] },
  { en: "Thailand", zh: "泰国", code: "TH", flag: "🇹🇭", alias: ["(?:Thailand|TH|🇹🇭|Bangkok|Chiang\\s*Mai|Phuket)", "(?:泰国|泰國|曼谷|清迈|清邁|普吉|布吉)"] },
  { en: "United Arab Emirates", zh: "阿联酋", code: "AE", flag: "🇦🇪", alias: ["(?:United\\s*Arab\\s*Emirates|UAE|AE|🇦🇪|Dubai|Abu\\s*Dhabi)", "(?:阿拉伯联合酋长国|阿拉伯聯合大公國|阿联酋|阿聯酋|迪拜|杜拜|阿布扎比|阿布达比|阿布達比)"] },
  { en: "Malaysia", zh: "马来西亚", code: "MY", flag: "🇲🇾", alias: ["(?:Malaysia|MY|🇲🇾|Malay|Kuala\\s*Lumpur|Penang)", "(?:马来(?:西亚)?|馬來(?:西亞)?|吉隆坡|槟城|檳城)"] },
  { en: "Indonesia", zh: "印度尼西亚", code: "ID", flag: "🇮🇩", alias: ["(?:Indonesia|ID|🇮🇩|Jakarta|Surabaya|Bali)", "(?:印度尼西亚|印度尼西亞|印尼|雅加达|雅加達|泗水|巴厘|峇里)"] },
  { en: "United Kingdom", zh: "英国", code: "GB", flag: "🇬🇧", alias: ["(?:United\\s*Kingdom|GB|🇬🇧|Great\\s*Britain|UK|London|Manchester|Birmingham|Glasgow)", "(?:英国|英國|(?:深|(?:沪|滬)|呼|京|(?:广|廣)|杭)英|伦敦|倫敦|曼彻斯特|曼徹斯特|伯明翰|格拉斯哥)"] },
  { en: "Germany", zh: "德国", code: "DE", flag: "🇩🇪", alias: ["(?:Germany|DE|🇩🇪|Deutschland|Frankfurt|Berlin|Munich|Düsseldorf)", "(?:德国|德國|德意志|(?:深|(?:沪|滬)|呼|京|(?:广|廣)|杭)德|法兰克福|法蘭克福|柏林|慕尼黑|杜塞尔多夫|杜塞爾多夫)"] },
  { en: "France", zh: "法国", code: "FR", flag: "🇫🇷", alias: ["(?:France|FR|🇫🇷|Paris|Marseille|Stras{1,2}bourg)", "(?:法国|法國|巴黎|马赛|馬賽|斯特拉斯堡|史特拉斯堡)"] },
  { en: "Switzerland", zh: "瑞士", code: "CH", flag: "🇨🇭", alias: ["(?:Switzerland|CH|🇨🇭|Zurich|Geneva)", "(?:瑞士|苏黎世|蘇黎世|日内瓦|日內瓦)"] },
  { en: "Turkey", zh: "土耳其", code: "TR", flag: "🇹🇷", alias: ["(?:Turkey|TR|🇹🇷|Türkiye|Istanbul|Ankara)", "(?:土耳其|伊斯坦布尔|伊斯坦堡|安卡拉)"] },
  { en: "Australia", zh: "澳大利亚", code: "AU", flag: "🇦🇺", alias: ["(?:Australia|AU|🇦🇺|Melbourne|Sydney|Brisbane|Perth)", "(?:澳大利亚|澳洲|土澳|(?:深|(沪|滬)|呼|京|(广|廣)|杭)澳|墨尔本|墨爾本|悉尼|雪梨|布里斯班|布里斯本|珀斯)"] },
  { en: "New Zealand", zh: "新西兰", code: "NZ", flag: "🇳🇿", alias: ["(?:New\\s*Zealand|NZ|🇳🇿|Auckland|Wellington)", "(?:新西兰|紐西蘭|奥克兰|奧克蘭|惠灵顿|威靈頓|惠靈頓)"] },
  { en: "Russia", zh: "俄罗斯", code: "RU", flag: "🇷🇺", alias: ["(?:Russia|RU|🇷🇺|Moscow|(?:Saint|St\\.?)\\s*Petersburg|Novosibirsk)", "(?:俄罗斯|俄羅斯|俄国|俄國|莫斯科|圣彼得堡|聖彼得堡|新西伯利亚|新西伯利亞)"] },
  { en: "Afghanistan", zh: "阿富汗", code: "AF", flag: "🇦🇫", alias: ["(?:Afghanistan|AF|🇦🇫)", "阿富汗"] },
  { en: "Ahvenanmaa", zh: "奥兰群岛", code: "AX", flag: "🇦🇽", alias: ["(?:Ahvenanmaa|AX|🇦🇽)", "(?:奥兰群岛|奧蘭群島)"] },
  { en: "Albania", zh: "阿尔巴尼亚", code: "AL", flag: "🇦🇱", alias: ["(?:Albania|AL|🇦🇱)", "(?:阿尔巴尼亚|阿爾巴尼亞)"] },
  { en: "Algeria", zh: "阿尔及利亚", code: "DZ", flag: "🇩🇿", alias: ["(?:Algeria|DZ|🇩🇿)", "(?:阿尔及利亚|阿爾及利亞)"] },
  { en: "Andorra", zh: "安道尔", code: "AD", flag: "🇦🇩", alias: ["(?:Andorra|AD|🇦🇩)", "(?:安道尔|安道爾)"] },
  { en: "Angola", zh: "安哥拉", code: "AO", flag: "🇦🇴", alias: ["(?:Angola|AO|🇦🇴)", "安哥拉"] },
  { en: "Argentina", zh: "阿根廷", code: "AR", flag: "🇦🇷", alias: ["(?:Argentina|AR|🇦🇷)", "阿根廷"] },
  { en: "Armenia", zh: "亚美尼亚", code: "AM", flag: "🇦🇲", alias: ["(?:Armenia|AM|🇦🇲)", "(?:亚美尼亚|亞美尼亞)"] },
  { en: "Austria", zh: "奥地利", code: "AT", flag: "🇦🇹", alias: ["(?:Austria|AT|🇦🇹)", "(?:奥地利|奧地利)"] },
  { en: "Azerbaijan", zh: "阿塞拜疆", code: "AZ", flag: "🇦🇿", alias: ["(?:Azerbaijan|AZ|🇦🇿)", "阿塞拜疆"] },
  { en: "Bahrain", zh: "巴林", code: "BH", flag: "🇧🇭", alias: ["(?:Bahrain|BH|🇧🇭)", "巴林"] },
  { en: "Bangladesh", zh: "孟加拉", code: "BD", flag: "🇧🇩", alias: ["(?:Bangladesh|BD|🇧🇩)", "孟加拉"] },
  { en: "Barbados", zh: "巴巴多斯", code: "BB", flag: "🇧🇧", alias: ["(?:Barbados|BB|🇧🇧)", "(?:巴巴多斯|巴貝多)"] },
  { en: "Belarus", zh: "白俄罗斯", code: "BY", flag: "🇧🇾", alias: ["(?:Belarus|BY|🇧🇾)", "(?:白俄罗斯|白俄羅斯)"] },
  { en: "Belgium", zh: "比利时", code: "BE", flag: "🇧🇪", alias: ["(?:Belgium|BE|🇧🇪)", "(?:比利时|比利時)"] },
  { en: "Belize", zh: "伯利兹", code: "BZ", flag: "🇧🇿", alias: ["(?:Belize|BZ|🇧🇿)", "(?:伯利兹|貝里斯|貝里茲)"] },
  { en: "Benin", zh: "贝宁", code: "BJ", flag: "🇧🇯", alias: ["(?:Benin|BJ|🇧🇯)", "(?:贝宁|貝寧)"] },
  { en: "Bermuda", zh: "百慕达", code: "BM", flag: "🇧🇲", alias: ["(?:Bermuda|BM|🇧🇲)", "(?:百慕达|百慕達)"] },
  { en: "Bhutan", zh: "不丹", code: "BT", flag: "🇧🇹", alias: ["(?:Bhutan|BT|🇧🇹)", "不丹"] },
  { en: "Bolivia", zh: "玻利维亚", code: "BO", flag: "🇧🇴", alias: ["(?:Bolivia|BO|🇧🇴)", "(?:玻利维亚|玻利維亞)"] },
  { en: "Bosnia and Herzegovina", zh: "波斯尼亚和黑塞哥维那", code: "BA", flag: "🇧🇦", alias: ["(?:Bosnia\\s*and\\s*Herzegovina|BiH|BA|🇧🇦)", "(?:波斯尼亚和黑塞哥维那|波斯尼亞和黑塞哥維那|波黑)"] },
  { en: "Botswana", zh: "博茨瓦纳", code: "BW", flag: "🇧🇼", alias: ["(?:Botswana|BW|🇧🇼)", "(?:博茨瓦纳|波札那)"] },
  { en: "Brazil", zh: "巴西", code: "BR", flag: "🇧🇷", alias: ["(?:Brazil|BR|🇧🇷)", "巴西"] },
  { en: "British Virgin Islands", zh: "英属维京群岛", code: "VG", flag: "🇻🇬", alias: ["(?:British\\s*Virgin\\s*Islands|BVI|VG|🇻🇬)", "(?:英属维(?:尔)?京(?:群岛)?|英屬維(?:爾)?京(?:群島)?)"] },
  { en: "Brunei", zh: "文莱", code: "BN", flag: "🇧🇳", alias: ["(?:Brunei|BN|🇧🇳)", "(?:文萊|汶萊)"] },
  { en: "Bulgaria", zh: "保加利亚", code: "BG", flag: "🇧🇬", alias: ["(?:Bulgaria|BG|🇧🇬)", "(?:保加利亚|保加利亞)"] },
  { en: "Burkina Faso", zh: "布基纳法索", code: "BF", flag: "🇧🇫", alias: ["(?:Burkina\\s*Faso|BF|🇧🇫)", "(?:布基纳法索|布基納法索)"] },
  { en: "Burundi", zh: "布隆迪", code: "BI", flag: "🇧🇮", alias: ["(?:Burundi|BI|🇧🇮)", "(?:布隆迪|布隆迪)"] },
  { en: "Cambodia", zh: "柬埔寨", code: "KH", flag: "🇰🇭", alias: ["(?:Cambodia|KH|🇰🇭)", "(?:柬埔寨|高棉)"] },
  { en: "Cameroon", zh: "喀麦隆", code: "CM", flag: "🇨🇲", alias: ["(?:Cameroon|CM|🇨🇲)", "(?:喀麦隆|喀麥隆)"] },
  { en: "Canada", zh: "加拿大", code: "CA", flag: "🇨🇦", alias: ["(?:Canada|CA|🇨🇦)", "加拿大"] },
  { en: "Cabo Verde", zh: "佛得角", code: "CV", flag: "🇨🇻", alias: ["(?:Cabo\\s*Verde|Cape\\s*Verde|CV|🇨🇻)", "(?:佛得角|維德角)"] },
  { en: "Cayman Islands", zh: "开曼群岛", code: "KY", flag: "🇰🇾", alias: ["(?:Cayman(?:\\s*Islands|s)|KY|🇰🇾)", "(?:开曼(?:群岛)?|開曼(?:群島)?)"] },
  { en: "Central African Republic", zh: "中非共和国", code: "CF", flag: "🇨🇫", alias: ["(?:Central\\s*African\\s*Republic|CAR|CF|🇨🇫)", "中非"] },
  { en: "Chad", zh: "乍得", code: "TD", flag: "🇹🇩", alias: ["(?:Chad|TD|🇹🇩)", "(?:乍得|查德)"] },
  { en: "Chile", zh: "智利", code: "CL", flag: "🇨🇱", alias: ["(?:Chile|CL|🇨🇱)", "智利"] },
  { en: "Colombia", zh: "哥伦比亚", code: "CO", flag: "🇨🇴", alias: ["(?:Colombia|CO|🇨🇴)", "(?:哥伦比亚|哥倫比亞)"] },
  { en: "Comoros", zh: "科摩罗", code: "KM", flag: "🇰🇲", alias: ["(?:Comoros|KM|🇰🇲)", "(?:科摩罗|葛摩)"] },
  { en: "Congo-Brazzaville", zh: "刚果(布)", code: "CG", flag: "🇨🇬", alias: ["(?:Republic\\s*of\\s*the\\s*Congo|CG|🇨🇬)", "(?:刚|剛)果(?:\(|（)?布(?:\)|）)?"] },
  { en: "Congo-Kinshasa", zh: "刚果(金)", code: "CD", flag: "🇨🇩", alias: ["(?:Democratic\\s*Republic\\s*of\\s*the\\s*Congo|DRC|CD|🇨🇩)", "(?:刚|剛)果(?:\(|（)?金(?:\)|）)?"] },
  { en: "Costa Rica", zh: "哥斯达黎加", code: "CR", flag: "🇨🇷", alias: ["(?:Costa\\s*Rica|CR|🇨🇷)", "(?:哥斯达黎加|哥斯達黎加)"] },
  { en: "Côte d'Ivoire", zh: "科特迪瓦", code: "CI", flag: "🇨🇮", alias: ["(?:Côte\\s*d'Ivoire|Ivory\\s*Coast|CI|🇨🇮)", "(?:科特迪瓦|象牙海岸)"] },
  { en: "Croatia", zh: "克罗地亚", code: "HR", flag: "🇭🇷", alias: ["(?:Croatia|HR|🇭🇷)", "(?:克罗地亚|克羅地亞)"] },
  { en: "Cuba", zh: "古巴", code: "CU", flag: "🇨🇺", alias: ["(?:Cuba|CU|🇨🇺)", "古巴"] },
  { en: "Curacao", zh: "库拉索", code: "CW", flag: "🇨🇼", alias: ["(?:Curacao|CW|🇨🇼)", "(?:库拉索|庫拉索)"] },
  { en: "Cyprus", zh: "塞浦路斯", code: "CY", flag: "🇨🇾", alias: ["(?:Cyprus|CY|🇨🇾)", "(?:塞浦路斯|賽普勒斯)"] },
  { en: "Czech Republic", zh: "捷克", code: "CZ", flag: "🇨🇿", alias: ["(?:Czech(?:\\s*Republic)?|Czechia|CZ|🇨🇿)", "捷克"] },
  { en: "Denmark", zh: "丹麦", code: "DK", flag: "🇩🇰", alias: ["(?:Denmark|DK|🇩🇰)", "(?:丹麦|丹麥)"] },
  { en: "Djibouti", zh: "吉布提", code: "DJ", flag: "🇩🇯", alias: ["(?:Djibouti|DJ|🇩🇯)", "(?:吉布提|吉布地)"] },
  { en: "Dominican Republic", zh: "多米尼加", code: "DO", flag: "🇩🇴", alias: ["(?:Dominican(?:\\s*Republic)?|DO|🇩🇴)", "多米尼加"] },
  { en: "Ecuador", zh: "厄瓜多尔", code: "EC", flag: "🇪🇨", alias: ["(?:Ecuador|EC|🇪🇨)", "(?:厄瓜多尔|厄瓜多爾)"] },
  { en: "Egypt", zh: "埃及", code: "EG", flag: "🇪🇬", alias: ["(?:Egypt|EG|🇪🇬)", "埃及"] },
  { en: "El Salvador", zh: "萨尔瓦多", code: "SV", flag: "🇸🇻", alias: ["(?:El\\s*)?Salvador|SV|🇸🇻", "(?:萨尔瓦多|薩爾瓦多)"] },
  { en: "Equatorial Guinea", zh: "赤道几内亚", code: "GQ", flag: "🇬🇶", alias: ["(?:Equatorial\\s*Guinea|GQ|🇬🇶)", "(?:赤道几内亚|赤道幾內亞)"] },
  { en: "Eritrea", zh: "厄立特里亚", code: "ER", flag: "🇪🇷", alias: ["(?:Eritrea|ER|🇪🇷)", "(?:厄立特里亚|厄利垂亞)"] },
  { en: "Estonia", zh: "爱沙尼亚", code: "EE", flag: "🇪🇪", alias: ["(?:Estonia|EE|🇪🇪)", "(?:爱沙尼亚|愛沙尼亞)"] },
  { en: "Eswatini", zh: "斯威士兰", code: "SZ", flag: "🇸🇿", alias: ["(?:Eswatini|Swaziland|SZ|🇸🇿)", "(?:斯威士兰|史瓦帝尼|斯瓦帝尼)"] },
  { en: "Ethiopia", zh: "埃塞俄比亚", code: "ET", flag: "🇪🇹", alias: ["(?:Ethiopia|ET|🇪🇹)", "(?:埃塞俄比亚|埃塞俄比亞)"] },
  { en: "Faroe Islands", zh: "法罗群岛", code: "FO", flag: "🇫🇴", alias: ["(?:Faroe(?:\\s*Islands)?|FO|🇫🇴)", "(?:法罗群岛|法羅群島)"] },
  { en: "Fiji", zh: "斐济", code: "FJ", flag: "🇫🇯", alias: ["(?:Fiji|FJ|🇫🇯)", "(?:斐济|斐濟)"] },
  { en: "Finland", zh: "芬兰", code: "FI", flag: "🇫🇮", alias: ["(?:Finland|Suomi|FI|🇫🇮)", "(?:芬兰|芬蘭)"] },
  { en: "Gabon", zh: "加蓬", code: "GA", flag: "🇬🇦", alias: ["(?:Gabon|GA|🇬🇦)", "加蓬"] },
  { en: "Gambia", zh: "冈比亚", code: "GM", flag: "🇬🇲", alias: ["(?:Gambia|GM|🇬🇲)", "(?:冈比亚|岡比亞)"] },
  { en: "Georgia", zh: "格鲁吉亚", code: "GE", flag: "🇬🇪", alias: ["(?:Georgia|GE|🇬🇪)", "(?:格鲁吉亚|格魯吉亞)"] },
  { en: "Ghana", zh: "加纳", code: "GH", flag: "🇬🇭", alias: ["(?:Ghana|GH|🇬🇭)", "(?:加纳|加納)"] },
  { en: "Gibraltar", zh: "直布罗陀", code: "GI", flag: "🇬🇮", alias: ["(?:Gibraltar|GI|🇬🇮)", "(?:直布罗陀|直布羅陀)"] },
  { en: "Greece", zh: "希腊", code: "GR", flag: "🇬🇷", alias: ["(?:Greece|Hellas|GR|🇬🇷)", "(?:希腊|希臘)"] },
  { en: "Greenland", zh: "格陵兰", code: "GL", flag: "🇬🇱", alias: ["(?:Greenland|Kalaallit\\s*Nunaat|GL|🇬🇱)", "(?:格陵兰|格陵蘭)"] },
  { en: "Guam", zh: "关岛", code: "GU", flag: "🇬🇺", alias: ["(?:Guam|Guåhån|GU|🇬🇺)", "(?:关岛|關島)"] },
  { en: "Guatemala", zh: "危地马拉", code: "GT", flag: "🇬🇹", alias: ["(?:Guatemala|GT|🇬🇹)", "(?:危地马拉|瓜地馬拉)"] },
  { en: "Guinea", zh: "几内亚", code: "GN", flag: "🇬🇳", alias: ["(?:Guinea|GN|🇬🇳)", "(?:几内亚|幾內亞)"] },
  { en: "Guyana", zh: "圭亚那", code: "GY", flag: "🇬🇾", alias: ["(?:Guyana|GY|🇬🇾)", "(?:圭亚那|圭亞那)"] },
  { en: "Haiti", zh: "海地", code: "HT", flag: "🇭🇹", alias: ["(?:Haiti|HT|🇭🇹)", "海地"] },
  { en: "Honduras", zh: "洪都拉斯", code: "HN", flag: "🇭🇳", alias: ["(?:Honduras|HN|🇭🇳)", "(?:洪都拉斯|宏都拉斯)"] },
  { en: "Hungary", zh: "匈牙利", code: "HU", flag: "🇭🇺", alias: ["(?:Hungary|HU|🇭🇺)", "(?:匈牙利)"] },
  { en: "Iceland", zh: "冰岛", code: "IS", flag: "🇮🇸", alias: ["(?:Iceland|IS|🇮🇸)", "冰島"] },
  { en: "Iran", zh: "伊朗", code: "IR", flag: "🇮🇷", alias: ["(?:Iran|Persia|IR|🇮🇷)", "(?:伊朗|波斯)"] },
  { en: "Iraq", zh: "伊拉克", code: "IQ", flag: "🇮🇶", alias: ["(?:Iraq|IQ|🇮🇶)", "伊拉克"] },
  { en: "Ireland", zh: "爱尔兰", code: "IE", flag: "🇮🇪", alias: ["(?:Ireland|IE|🇮🇪)", "(?:爱尔兰|愛爾蘭)"] },
  { en: "Isle of Man", zh: "马恩岛", code: "IM", flag: "🇮🇲", alias: ["(?:Isle\\s*of\\s*Man|Mann|IM|🇮🇲)", "(?:马恩岛|馬恩島|曼島)"] },
  { en: "Israel", zh: "以色列", code: "IL", flag: "🇮🇱", alias: ["(?:Israel|IL|🇮🇱)", "以色列"] },
  { en: "Italy", zh: "意大利", code: "IT", flag: "🇮🇹", alias: ["(?:Italy|IT|🇮🇹)", "(?:意大利|義大利)"] },
  { en: "Jamaica", zh: "牙买加", code: "JM", flag: "🇯🇲", alias: ["(?:Jamaica|JM|🇯🇲)", "(?:牙买加|牙買加)"] },
  { en: "Jordan", zh: "约旦", code: "JO", flag: "🇯🇴", alias: ["(?:Jordan|JO|🇯🇴)", "(?:约旦|約旦)"] },
  { en: "Kazakhstan", zh: "哈萨克斯坦", code: "KZ", flag: "🇰🇿", alias: ["(?:Kazakhstan|Kazakh|KZ|🇰🇿)", "(?:哈萨克斯坦|哈薩克斯坦)"] },
  { en: "Kenya", zh: "肯尼亚", code: "KE", flag: "🇰🇪", alias: ["(?:Kenya|KE|🇰🇪)", "(?:肯尼亚|肯尼亞)"] },
  { en: "Kuwait", zh: "科威特", code: "KW", flag: "🇰🇼", alias: ["(?:Kuwait|KW|🇰🇼)", "科威特"] },
  { en: "Kyrgyzstan", zh: "吉尔吉斯斯坦", code: "KG", flag: "🇰🇬", alias: ["(?:Kyrgyzstan|Kyrgyz|KG|🇰🇬)", "(?:吉尔吉斯斯坦|吉爾吉斯斯坦)"] },
  { en: "Laos", zh: "老挝", code: "LA", flag: "🇱🇦", alias: ["(?:Laos|LA|🇱🇦)", "(?:老挝|老撾|寮國)"] },
  { en: "Latvia", zh: "拉脱维亚", code: "LV", flag: "🇱🇻", alias: ["(?:Latvia|LV|🇱🇻)", "(?:拉脱维亚|拉脫維亞)"] },
  { en: "Lebanon", zh: "黎巴嫩", code: "LB", flag: "🇱🇧", alias: ["(?:Lebanon|LB|🇱🇧)", "黎巴嫩"] },
  { en: "Lesotho", zh: "莱索托", code: "LS", flag: "🇱🇸", alias: ["(?:Lesotho|LS|🇱🇸)", "(?:莱索托|賴索托)"] },
  { en: "Liberia", zh: "利比里亚", code: "LR", flag: "🇱🇷", alias: ["(?:Liberia|LR|🇱🇷)", "(?:利比里亚|賴比瑞亞)"] },
  { en: "Libya", zh: "利比亚", code: "LY", flag: "🇱🇾", alias: ["(?:Libya|LY|🇱🇾)", "(?:利比亚|利比亞)"] },
  { en: "Liechtenstein", zh: "列支敦士登", code: "LI", flag: "🇱🇮", alias: ["(?:Liechtenstein|LI|🇱🇮)", "列支敦士登"] },
  { en: "Lithuania", zh: "立陶宛", code: "LT", flag: "🇱🇹", alias: ["(?:Lithuania|LT|🇱🇹)", "立陶宛"] },
  { en: "Luxembourg", zh: "卢森堡", code: "LU", flag: "🇱🇺", alias: ["(?:Luxembourg|Lux|LU|🇱🇺)", "(?:卢森堡|盧森堡)"] },
  { en: "Macao", zh: "澳门", code: "MO", flag: "🇲🇴", alias: ["(?:Macao|MO|🇲🇴)", "(?:澳门|澳門)"] },
  { en: "North Macedonia", zh: "北马其顿", code: "MK", flag: "🇲🇰", alias: ["(?:(?:North\\s*)?Macedonia|MK|🇲🇰)", "(?:北)?(?:马其顿|馬其頓)"] },
  { en: "Madagascar", zh: "马达加斯加", code: "MG", flag: "🇲🇬", alias: ["(?:Madagascar|MG|🇲🇬)", "(?:马达加斯加|馬達加斯加)"] },
  { en: "Malawi", zh: "马拉维", code: "MW", flag: "🇲🇼", alias: ["(?:Malawi|MW|🇲🇼)", "(?:马拉维|馬拉維)"] },
  { en: "Maldives", zh: "马尔代夫", code: "MV", flag: "🇲🇻", alias: ["(?:Maldives|MV|🇲🇻)", "(?:马尔代夫|馬爾地夫)"] },
  { en: "Mali", zh: "马里", code: "ML", flag: "🇲🇱", alias: ["(?:Mali|ML|🇲🇱)", "(?:马里|馬利)"] },
  { en: "Malta", zh: "马耳他", code: "MT", flag: "🇲🇹", alias: ["(?:Malta|MT|🇲🇹)", "(?:马耳他|馬耳他)"] },
  { en: "Marshall Islands", zh: "马绍尔群岛", code: "MH", flag: "🇲🇭", alias: ["(?:Marshall\\s*Islands|MH|🇲🇭)", "(?:马绍尔群岛|馬紹爾群島)"] },
  { en: "Mauritania", zh: "毛利塔尼亚", code: "MR", flag: "🇲🇷", alias: ["(?:Mauritania|MR|🇲🇷)", "(?:毛利塔尼亚|茅利塔尼亞)"] },
  { en: "Mauritius", zh: "毛里求斯", code: "MU", flag: "🇲🇺", alias: ["(?:Mauritius|MU|🇲🇺)", "(?:毛里求斯|模里西斯|毛里裘斯)"] },
  { en: "Mexico", zh: "墨西哥", code: "MX", flag: "🇲🇽", alias: ["(?:Mexico|MX|🇲🇽)", "墨西哥"] },
  { en: "Micronesia", zh: "密克罗尼西亚", code: "FM", flag: "🇫🇲", alias: ["(?:(?:Federated\\s*States\\s*of\\s*)?Micronesia|FSM|FM|🇫🇲)", "(?:密克罗尼西亚|密克羅尼西亞)"] },
  { en: "Moldova", zh: "摩尔多瓦", code: "MD", flag: "🇲🇩", alias: ["(?:Moldova|MD|🇲🇩)", "(?:摩尔多瓦|摩爾多瓦)"] },
  { en: "Monaco", zh: "摩纳哥", code: "MC", flag: "🇲🇨", alias: ["(?:Monaco|MC|🇲🇨)", "(?:摩纳哥|摩納哥)"] },
  { en: "Mongolia", zh: "蒙古", code: "MN", flag: "🇲🇳", alias: ["(?:Mongolia|MN|🇲🇳)", "蒙古"] },
  { en: "Montenegro", zh: "黑山", code: "ME", flag: "🇲🇪", alias: ["(?:Crna\\s*Gora|ME|🇲🇪)", "(?:黑山|蒙特内格罗|蒙特內哥羅)"] },
  { en: "Morocco", zh: "摩洛哥", code: "MA", flag: "🇲🇦", alias: ["(?:Morocco|MA|🇲🇦)", "摩洛哥"] },
  { en: "Mozambique", zh: "莫桑比克", code: "MZ", flag: "🇲🇿", alias: ["(?:Mozambique|MZ|🇲🇿)", "(?:莫桑比克|莫三比克)"] },
  { en: "Myanmar", zh: "缅甸", code: "MM", flag: "🇲🇲", alias: ["(?:Myanmar|Burma|MM|🇲🇲)", "(?:缅甸|緬甸)"] },
  { en: "Namibia", zh: "纳米比亚", code: "NA", flag: "🇳🇦", alias: ["(?:Namibia|NA|🇳🇦)", "(?:纳米比亚|納米比亞)"] },
  { en: "Nepal", zh: "尼泊尔", code: "NP", flag: "🇳🇵", alias: ["(?:Nepal|NP|🇳🇵)", "(?:尼泊尔|尼泊爾)"] },
  { en: "Netherlands", zh: "荷兰", code: "NL", flag: "🇳🇱", alias: ["(?:Netherlands|Holland|NL|🇳🇱)", "(?:荷兰|荷蘭)"] },
  { en: "Nicaragua", zh: "尼加拉瓜", code: "NI", flag: "🇳🇮", alias: ["(?:Nicaragua|NI|🇳🇮)", "尼加拉瓜"] },
  { en: "Niger", zh: "尼日尔", code: "NE", flag: "🇳🇪", alias: ["(?:Niger|NE|🇳🇪)", "(?:尼日尔|尼日爾)"] },
  { en: "Nigeria", zh: "尼日利亚", code: "NG", flag: "🇳🇬", alias: ["(?:Nigeria|NG|🇳🇬)", "(?:尼日利亚|奈及利亞)"] },
  { en: "North Korea", zh: "朝鲜", code: "KP", flag: "🇰🇵", alias: ["(?:North\\s*Korea|DPRK|KP|🇰🇵)", "(?:朝鲜|北韩|北韓)"] },
  { en: "Norway", zh: "挪威", code: "NO", flag: "🇳🇴", alias: ["(?:Norway|Norge|NO|🇳🇴)", "挪威"] },
  { en: "Oman", zh: "阿曼", code: "OM", flag: "🇴🇲", alias: ["(?:Oman|OM|🇴🇲)", "阿曼"] },
  { en: "Pakistan", zh: "巴基斯坦", code: "PK", flag: "🇵🇰", alias: ["(?:Pakistan|PK|🇵🇰)", "巴基斯坦"] },
  { en: "Palau", zh: "帕劳", code: "PW", flag: "🇵🇼", alias: ["(?:Palau|PW|🇵🇼)", "(?:帕劳|帛琉)"] },
  { en: "Palestine", zh: "巴勒斯坦", code: "PS", flag: "🇵🇸", alias: ["(?:Palestine|PS|🇵🇸)", "巴勒斯坦"] },
  { en: "Panama", zh: "巴拿马", code: "PA", flag: "🇵🇦", alias: ["(?:Panama|PA|🇵🇦)", "(?:巴拿马|巴拿馬)"] },
  { en: "Papua New Guinea", zh: "巴布亚新几内亚", code: "PG", flag: "🇵🇬", alias: ["(?:Papua\\s*New\\s*Guinea|PG|🇵🇬)", "(?:巴布亚新几内亚|巴布亞新幾內亞|巴新)"] },
  { en: "Paraguay", zh: "巴拉圭", code: "PY", flag: "🇵🇾", alias: ["(?:Paraguay|PY|🇵🇾)", "巴拉圭"] },
  { en: "Peru", zh: "秘鲁", code: "PE", flag: "🇵🇪", alias: ["(?:Peru|PE|🇵🇪)", "(?:秘鲁|祕魯)"] },
  { en: "Philippines", zh: "菲律宾", code: "PH", flag: "🇵🇭", alias: ["(?:Philippines|PH|🇵🇭)", "(?:菲律宾|菲律賓)"] },
  { en: "Poland", zh: "波兰", code: "PL", flag: "🇵🇱", alias: ["(?:Poland|Polska|PL|🇵🇱)", "(?:波兰|波蘭)"] },
  { en: "Portugal", zh: "葡萄牙", code: "PT", flag: "🇵🇹", alias: ["(?:Portugal|PT|🇵🇹)", "葡萄牙"] },
  { en: "Puerto Rico", zh: "波多黎各", code: "PR", flag: "🇵🇷", alias: ["(?:Puerto\\s*Rico|PR|🇵🇷)", "(?:波多黎各|波多黎各)"] },
  { en: "Qatar", zh: "卡塔尔", code: "QA", flag: "🇶🇦", alias: ["(?:Qatar|QA|🇶🇦)", "(?:卡塔尔|卡塔爾|卡達)"] },
  { en: "Réunion", zh: "留尼汪", code: "RE", flag: "🇷🇪", alias: ["(?:R(?:é|e)union|RE|🇷🇪)", "(?:留尼汪|留尼旺)"] },
  { en: "Romania", zh: "罗马尼亚", code: "RO", flag: "🇷🇴", alias: ["(?:Romania|RO|🇷🇴)", "(?:罗马尼亚|羅馬尼亞)"] },
  { en: "Rwanda", zh: "卢旺达", code: "RW", flag: "🇷🇼", alias: ["(?:Rwanda|RW|🇷🇼)", "(?:卢旺达|盧旺達)"] },
  { en: "San Marino", zh: "圣马力诺", code: "SM", flag: "🇸🇲", alias: ["(?:San\\s*Marino|SM|🇸🇲)", "(?:圣马力诺|聖馬利諾)"] },
  { en: "St Kitts and Nevis", zh: "圣基茨和尼维斯", code: "KN", flag: "🇰🇳", alias: ["(?:(?:Saint|St\\.?)\\s*Kitts\\s*and\\s*Nevis|KN|🇰🇳)", "(?:圣基茨和尼维斯|聖基茨和尼維斯)"] },
  { en: "St Lucia", zh: "圣卢西亚", code: "LC", flag: "🇱🇨", alias: ["(?:Saint|St\\.?)\\s*Lucia|LC|🇱🇨", "(?:圣卢西亚|聖露西亞)"] },
  { en: "St Vincent and the Grenadines", zh: "圣文森特和格林纳丁斯", code: "VC", flag: "🇻🇨", alias: ["(?:Saint|St\\.?)\\s*Vincent\\s*and\\s*the\\s*Grenadines|VC|🇻🇨", "(?:圣文森特(?:和格林纳丁斯)?|聖文森(?:及格瑞那丁)?)"] },
  { en: "Saudi Arabia", zh: "沙特阿拉伯", code: "SA", flag: "🇸🇦", alias: ["(?:Saudi\\s*Arabia|KSA|STC|SA|🇸🇦)", "(?:沙特(?:阿拉伯)?|沙烏地(?:阿拉伯)?)"] },
  { en: "Senegal", zh: "塞内加尔", code: "SN", flag: "🇸🇳", alias: ["(?:Senegal|SN|🇸🇳)", "(?:塞内加尔|塞內加爾)"] },
  { en: "Serbia", zh: "塞尔维亚", code: "RS", flag: "🇷🇸", alias: ["(?:Serbia|RS|🇷🇸)", "(?:塞尔维亚|塞爾維亞)"] },
  { en: "Seychelles", zh: "塞舌尔", code: "SC", flag: "🇸🇨", alias: ["(?:Seychelles|SC|🇸🇨)", "(?:塞舌尔|塞舌爾|塞席爾)"] },
  { en: "Sierra Leone", zh: "塞拉利昂", code: "SL", flag: "🇸🇱", alias: ["(?:Sierra\\s*Leone|SL|🇸🇱)", "塞拉利昂"] },
  { en: "Slovakia", zh: "斯洛伐克", code: "SK", flag: "🇸🇰", alias: ["(?:Slovakia|SK|🇸🇰)", "斯洛伐克"] },
  { en: "Slovenia", zh: "斯洛文尼亚", code: "SI", flag: "🇸🇮", alias: ["(?:Slovenia|SI|🇸🇮)", "(?:斯洛文尼亚|斯洛維尼亞)"] },
  { en: "Solomon Islands", zh: "所罗门群岛", code: "SB", flag: "🇸🇧", alias: ["(?:Solomon\\s*Islands|SB|🇸🇧)", "(?:所罗门(?:群岛)?|所羅門(?:群島)?)"] },
  { en: "Somalia", zh: "索马里", code: "SO", flag: "🇸🇴", alias: ["(?:Somalia|SO|🇸🇴)", "(?:索马里|索馬利亞|索馬里)"] },
  { en: "South Africa", zh: "南非", code: "ZA", flag: "🇿🇦", alias: ["(?:South\\s*Africa|RSA|ZA|🇿🇦)", "南非"] },
  { en: "South Sudan", zh: "南苏丹", code: "SS", flag: "🇸🇸", alias: ["(?:South\\s*Sudan|SS|🇸🇸)", "(?:南苏丹|南蘇丹)"] },
  { en: "Spain", zh: "西班牙", code: "ES", flag: "🇪🇸", alias: ["(?:España|ES|🇪🇸)", "西班牙"] },
  { en: "Sri Lanka", zh: "斯里兰卡", code: "LK", flag: "🇱🇰", alias: ["(?:Sri\\s*Lanka|Ceylon|LK|🇱🇰)", "(?:斯里兰卡|斯里蘭卡|锡兰|錫蘭)"] },
  { en: "Sudan", zh: "苏丹", code: "SD", flag: "🇸🇩", alias: ["(?:Sudan|SD|🇸🇩)", "(?:苏丹|蘇丹)"] },
  { en: "Suriname", zh: "苏里南", code: "SR", flag: "🇸🇷", alias: ["(?:Suriname|SR|🇸🇷)", "(?:苏里南|蘇里南|蘇利南)"] },
  { en: "Sweden", zh: "瑞典", code: "SE", flag: "🇸🇪", alias: ["(?:Sweden|SE|🇸🇪)", "瑞典"] },
  { en: "Syria", zh: "叙利亚", code: "SY", flag: "🇸🇾", alias: ["(?:Syria|SY|🇸🇾)", "(?:叙利亚|敘利亞)"] },
  { en: "Tajikistan", zh: "塔吉克斯坦", code: "TJ", flag: "🇹🇯", alias: ["(?:Tajikistan|TJ|🇹🇯)", "塔吉克(?:斯坦)?"] },
  { en: "Tanzania", zh: "坦桑尼亚", code: "TZ", flag: "🇹🇿", alias: ["(?:Tanzania|TZ|🇹🇿)", "(?:坦桑尼亚|坦尚尼亞)"] },
  { en: "Timor-Leste", zh: "东帝汶", code: "TL", flag: "🇹🇱", alias: ["(?:Timor\\s*Leste|East\\s*Timor|TL|🇹🇱)", "(?:东帝汶|東帝汶)"] },
  { en: "Togo", zh: "多哥", code: "TG", flag: "🇹🇬", alias: ["(?:Togo|TG|🇹🇬)", "多哥"] },
  { en: "Tonga", zh: "汤加", code: "TO", flag: "🇹🇴", alias: ["(?:Tonga|TO|🇹🇴)", "(?:汤加|東加)"] },
  { en: "Trinidad and Tobago", zh: "特立尼达和多巴哥", code: "TT", flag: "🇹🇹", alias: ["(?:Trinidad\\s*and\\s*Tobago|TT|🇹🇹)", "(?:特立尼达和多巴哥|千里達及托巴哥|千托)"] },
  { en: "Tunisia", zh: "突尼斯", code: "TN", flag: "🇹🇳", alias: ["(?:Tunisia|TN|🇹🇳)", "(?:突尼斯|突尼西亞)"] },
  { en: "Turkmenistan", zh: "土库曼斯坦", code: "TM", flag: "🇹🇲", alias: ["(?:Turkmenistan|TM|🇹🇲)", "(?:土库曼(?:斯坦)?|土庫曼(?:斯坦)?)"] },
  { en: "U.S. Virgin Islands", zh: "美属维京群岛", code: "VI", flag: "🇻🇮", alias: ["(?:U\.?S\.?\\s*Virgin\\s*Islands|USVI|VI|🇻🇮)", "(?:美属维(?:尔)?京(?:群岛)?|美屬維京(?:群島)?)"] },
  { en: "Uganda", zh: "乌干达", code: "UG", flag: "🇺🇬", alias: ["(?:Uganda|UG|🇺🇬)", "(?:乌干达|烏干達)"] },
  { en: "Ukraine", zh: "乌克兰", code: "UA", flag: "🇺🇦", alias: ["(?:Ukraine|UA|🇺🇦)", "(?:乌克兰|烏克蘭)"] },
  { en: "Uruguay", zh: "乌拉圭", code: "UY", flag: "🇺🇾", alias: ["(?:Uruguay|UY|🇺🇾)", "(?:乌拉圭|烏拉圭)"] },
  { en: "Uzbekistan", zh: "乌兹别克斯坦", code: "UZ", flag: "🇺🇿", alias: ["(?:Uzbekistan|Uzbek|UZ|🇺🇿)", "(?:乌兹别克(?:斯坦)?|烏茲別克(?:斯坦)?)"] },
  { en: "Vanuatu", zh: "瓦努阿图", code: "VU", flag: "🇻🇺", alias: ["(?:Vanuatu|VU|🇻🇺)", "(?:瓦努阿图|萬那杜)"] },
  { en: "Vatican", zh: "梵蒂冈", code: "VA", flag: "🇻🇦", alias: ["(?:Holy\\s*See|VA|🇻🇦)", "(?:梵蒂冈|梵蒂岡)"] },
  { en: "Venezuela", zh: "委内瑞拉", code: "VE", flag: "🇻🇪", alias: ["(?:Venezuela|VE|🇻🇪)", "(?:委内瑞拉|委內瑞拉)"] },
  { en: "Vietnam", zh: "越南", code: "VN", flag: "🇻🇳", alias: ["(?:Viet\\s*Nam|VN|🇻🇳)", "越南"] },
  { en: "Western Sahara", zh: "西撒哈拉", code: "EH", flag: "🇪🇭", alias: ["(?:Western\\s*Sahara|EH|🇪🇭)", "西撒哈拉"] },
  { en: "Yemen", zh: "也门", code: "YE", flag: "🇾🇪", alias: ["(?:Yemen|YE|🇾🇪)", "(?:也门|也門|葉門)"] },
  { en: "Zambia", zh: "赞比亚", code: "ZM", flag: "🇿🇲", alias: ["(?:Zambia|ZM|🇿🇲)", "(?:赞比亚|尚比亞|贊比亞)"] },
  { en: "Zimbabwe", zh: "津巴布韦", code: "ZW", flag: "🇿🇼", alias: ["(?:Zimbabwe|ZW|🇿🇼)", "(?:津巴布韦|津巴布韋|辛巴威)"] },
];

const LINE_LABELS = [
  { en: "CN2 GIA", zh: "CN2 GIA", alias: ["(?:cn2\\s*gia|cn2|gia)", null] },
  { en: "AS9929", zh: "AS9929", alias: ["(?:as9929|9929|unicom\\s*9929|china\\s*unicom\\s*9929)", null] },
  { en: "CMI", zh: "CMI", alias: ["(?:cmi|cm-international|china\\s*mobile\\s*international|cmcc\\s*international)", null] },
  { en: "IPLC", zh: "IPLC", alias: ["(?:IPLC|I-P-L-C)", null] },
  { en: "IEPL", zh: "IEPL", alias: ["(?:IEPL|I-E-P-L)", null] },
  { en: "BGP", zh: "BGP", alias: ["BGP", null] },
  { en: "UDP", zh: "UDP", alias: ["UDP", null] },
  { en: "CORE", zh: "核心", alias: ["core", "核心" ] },
  { en: "EDGE", zh: "边缘", alias: ["edge", "(?:边缘|邊緣)" ] },
  { en: "ADV", zh: "高级", alias: ["(?:adv|advanced)", "(?:高级|高級)" ] },
  { en: "STD", zh: "标准", alias: ["(?:std|standard)", "(?:标准|標準)" ] },
  { en: "SP", zh: "特殊", alias: ["(?:sp|special)", "特殊" ] },
  { en: "EXP", zh: "实验", alias: ["(?:exp|experiment|experimental)", "(?:实验|實驗)" ] },
  { en: "IDC", zh: "商宽", alias: ["(?:idc|data\\s*center)", "(?:商宽|商寬|商业|数据中心)" ] },
  { en: "RES", zh: "家宽", alias: ["(?:res|residential)", "(?:家宽|家寬|家庭宽带|家庭寬帶|家庭|住宅)" ] },
  { en: "DL", zh: "专线", alias: ["(?:dl|dedicated(?:\\s*line)?)", "(?:专线|專線)" ] },
  { en: "GAME", zh: "游戏", alias: ["(?:game|gaming)", "(?:游戏|遊戲)" ] },
  { en: "SHOP", zh: "购物", alias: ["(?:shop|shopping|e-?com(?:merce)?)", "(?:购物|購物)" ] },
  { en: "LB", zh: "负载均衡", alias: ["(?:lb|load\\s*balance|load\\s*balancer|load\\s*balancing)", "(?:负载均衡|負載均衡|负载平衡|負載平衡|负载分担|負載分擔|负载共享|負載共享|均衡器)" ] },
];

const RATE_LABELS = [
  { num: "1", alias: ["ˣ¹", "¹ˣ"] },
  { num: "2", alias: ["ˣ²", "²ˣ"] },
  { num: "3", alias: ["ˣ³", "³ˣ"] },
  { num: "4", alias: ["ˣ⁴", "⁴ˣ"] },
  { num: "5", alias: ["ˣ⁵", "⁵ˣ"] },
  { num: "6", alias: ["ˣ⁶", "⁶ˣ"] },
  { num: "7", alias: ["ˣ⁷", "⁷ˣ"] },
  { num: "8", alias: ["ˣ⁸", "⁸ˣ"] },
  { num: "9", alias: ["ˣ⁹", "⁹ˣ"] },
  { num: "10", alias: ["ˣ¹⁰", "¹⁰ˣ"] },
  { num: "20", alias: ["ˣ²⁰", "²⁰ˣ"] },
  { num: "30", alias: ["ˣ³⁰", "³⁰ˣ"] },
  { num: "40", alias: ["ˣ⁴⁰", "⁴⁰ˣ"] },
  { num: "50", alias: ["ˣ⁵⁰", "⁵⁰ˣ"] },
];

// ==================== 辅助函数 ====================
function filterInvalidNodes(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) return nodes;
  const invalidReg = INVALID_LABELS.map(pattern => new RegExp(pattern, 'i'));
  return nodes.filter(node => {
    const name = node && node.name ? node.name : '';
    return !invalidReg.some(reg => reg.test(name));
  });
}

function parseCustomLabel(customLabel) {
  if (!customLabel) return [];
  // 返回 [{from, to}]，如 E>东 => {from: 'E', to: '东'}，E => {from: 'E', to: 'E'}
  return customLabel.split('|')
    .map(s => s.trim())
    .filter(Boolean)
    .map(item => {
      if (item.includes('>')) {
        const [from, to] = item.split('>', 2).map(x => x.trim());
        return { from, to };
      } else {
        return { from: item, to: item };
      }
    });
}

function parseSep(sep) {
  return sep.split("");
}

function matchCountryLabel(node) {
  if (!node) return null;
  const nodeName = node.name;
  for (const country of COUNTRY_LABELS) {
    // 先匹配 alias[1]（中文/变体）
    if (country.alias[1]) {
      if (new RegExp(country.alias[1], 'iu').test(nodeName)) {
        return {
          en: country.en,
          zh: country.zh,
          code: country.code,
          flag: country.flag,
        };
      }
    }
    // 再匹配 alias[0]（英文/拉丁/变体）
    if (country.alias[0]) {
      if (new RegExp("(^|([\\u4e00-\\u9fa50-9]|[\\s\\-_|/.,:;~!@#$%^&*()\\[\\]{}<>?]))" + country.alias[0] + "(([\\u4e00-\\u9fa50-9]|[\\s\\-_|/.,:;~!@#$%^&*()\\[\\]{}<>?])|$)","iu").test(nodeName)) {
        return {
          en: country.en,
          zh: country.zh,
          code: country.code,
          flag: country.flag,
        };
      }
    }
  }
  return null;
}

function matchRateLabel(node) {
  if (!node) return null;
  const nodeName = node.name;
  for (const rate of RATE_LABELS) {
    for (const alias of rate.alias) {
      if (alias && new RegExp(alias, "iu").test(nodeName)) {
        return Number(rate.num);
      }
    }
  }
  let m = nodeName.match(/([×xX])\s*(\d+(?:\.\d+)?)/);
  if (m) {
    return Number(m[2]);
  }
  m = nodeName.match(/(\d+(?:\.\d+)?)(?:\s*)([×xX倍])/);
  if (m) {
    return Number(m[1]);
  }
  return null;
}

function matchLineLabel(node) {
  if (!node) return [];
  const nodeName = node.name;
  let results = [];
  // 先匹配 alias[0]（英文/ASCII）
  for (const label of LINE_LABELS) {
    if (label.alias[0]) {
      if (new RegExp("(^|[\\s\\-_|/.,:;~!@#$%^&*()\\[\\]{}<>?])" + label.alias[0] + "([\\s\\-_|/.,:;~!@#$%^&*()\\[\\]{}<>?]|$)", "iu").test(nodeName)) {
        results.push({ en: label.en, zh: label.zh });
      }
    }
  }
  // 再匹配 alias[1]（中文/变体）
  for (const label of LINE_LABELS) {
    if (label.alias[1]) {
      if (new RegExp(label.alias[1], "iu").test(nodeName)) {
        results.push({ en: label.en, zh: label.zh });
      }
    }
  }
  // 去重（同一en/zh只保留一个）
  const unique = [];
  const seen = new Set();
  for (const item of results) {
    const key = item.en + '|' + item.zh;
    if (!seen.has(key)) {
      unique.push(item);
      seen.add(key);
    }
  }
  return unique;
}

function matchCustomLabel(node, customLabelArr) {
  if (!node || !node.name || !Array.isArray(customLabelArr) || customLabelArr.length === 0) return [];
  const nodeName = node.name;
  const matchedLabels = [];
  for (const {from, to} of customLabelArr) {
    if (!from) continue;
    // 允许标签中有特殊符号，需转义
    const safeLabel = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // 两侧加边界，防止误匹配
    const reg = new RegExp("(^|[\\s\\-_|/.,:;~!@#$%^&*()\\[\\]{}<>?])" + safeLabel + "([\\s\\-_|/.,:;~!@#$%^&*()\\[\\]{}<>?]|$)", 'iu');
    if (reg.test(nodeName)) {
      matchedLabels.push(to);
    }
  }
  return matchedLabels;
}

function filterByRate(nodes, rateRange) {
  if (!rateRange || typeof rateRange !== 'string') return nodes;
  // 支持多区间和区间级别的取反
  const ranges = rateRange.split(',').map(r => {
    const neg = r.trim().startsWith('!');
    const raw = neg ? r.trim().slice(1) : r.trim();
    const [min, max] = raw.split('|').map(s => s.trim());
    if ((min && isNaN(min)) || (max && isNaN(max))) return null;
    return {
      negation: neg,
      min: min === '' ? -Infinity : parseFloat(min),
      max: max === '' ? Infinity : parseFloat(max)
    };
  });
  if (ranges.some(r => !r || r.min > r.max)) {
    return nodes;
  }

  return nodes.filter(node => {
    // 只保留 _matched==true 的节点，未匹配国家标签的节点直接过滤掉
    if (!node._matched) return false;
    const rate = matchRateLabel(node);
    if (rate === null || rate === undefined) {
      return true;
    }
    // 匹配任意区间（正区间为 in，反区间为 not in）
    return ranges.some(({negation, min, max}) => {
      const inRange = rate >= min && rate <= max;
      return negation ? !inRange : inRange;
    });
  });
}

function sortByGroup(nodes, customLabelArr) {
  if (!Array.isArray(nodes) || nodes.length === 0) return nodes;
  // 1. _matched==false的节点按原顺序移到最后
  const matched = [], unmatched = [];
  nodes.forEach(node => (node._matched === false ? unmatched : matched).push(node));

  // 2. 国家标签分组排序
  function getCountryIdx(node) {
    if (!node._country) return COUNTRY_LABELS.length;
    let idx = COUNTRY_LABELS.findIndex(c => c.en === node._country.en);
    return idx === -1 ? COUNTRY_LABELS.length : idx;
  }

  // 3. 倍率标签分组排序
  function getRateIdx(node) {
    if (!node._rate) return Number.POSITIVE_INFINITY;
    const n = Number(node._rate);
    return isNaN(n) ? Number.POSITIVE_INFINITY : n;
  }

  // 4. 线路标签分组排序（多标签多级）
  function getLineIdxArr(node) {
    if (!Array.isArray(node._line) || node._line.length === 0) return [LINE_LABELS.length];
    return node._line.map(lab => {
      let idx = LINE_LABELS.findIndex(l => l.en === lab.en);
      return idx === -1 ? LINE_LABELS.length : idx;
    });
  }

  // 5. 自定义标签分组排序
  function getCustomIdx(node) {
    if (!customLabelArr || customLabelArr.length === 0) return [0];
    if (!Array.isArray(node._custom) || node._custom.length === 0) {
      // 全部未命中，返回全为 customLabelArr.length 的数组
      return Array(customLabelArr.length).fill(customLabelArr.length);
    }
    // customLabelArr 为 [{from,to}], node._custom 为 [to]
    return customLabelArr.map(({to}, idx) => node._custom.includes(to) ? idx : customLabelArr.length);
  }

  // 排序主逻辑
  matched.sort((a, b) => {
    // 1. 国家
    const c1 = getCountryIdx(a), c2 = getCountryIdx(b);
    if (c1 !== c2) return c1 - c2;
    // 2. 倍率
    const r1 = getRateIdx(a), r2 = getRateIdx(b);
    if (r1 !== r2) return r1 - r2;
    // 3. 线路标签（多级排序）
    const l1 = getLineIdxArr(a), l2 = getLineIdxArr(b);
    for (let i = 0; i < Math.max(l1.length, l2.length); ++i) {
      const li1 = l1[i] ?? LINE_LABELS.length, li2 = l2[i] ?? LINE_LABELS.length;
      if (li1 !== li2) return li1 - li2;
    }
    // 4. 自定义标签（多级排序）
    const cl1 = getCustomIdx(a), cl2 = getCustomIdx(b);
    for (let i = 0; i < Math.max(cl1.length, cl2.length); ++i) {
      const cli1 = cl1[i] ?? customLabelArr.length, cli2 = cl2[i] ?? customLabelArr.length;
      if (cli1 !== cli2) return cli1 - cli2;
    }
    return 0; // 保持稳定性
  });

  return matched.concat(unmatched);
}

function addIndex(nodes, rmSingleIdx = false) {
  if (!Array.isArray(nodes) || nodes.length === 0) return nodes;
  // 处理分隔符
  const sepArr = indexLabelSep ? parseSep(indexLabelSep) : ["#"];
  const sepLeft = sepArr[0] || "#";
  const sepRight = sepArr[1] || "";

  // 按国家标签分组，只处理 _matched==true 的节点
  const countryMap = new Map();
  const matchedNodes = [];
  const unmatchedNodes = [];
  for (const node of nodes) {
    if (node._matched) {
      const countryKey = node._country[countryLabelType];
      if (!countryMap.has(countryKey)) countryMap.set(countryKey, []);
      countryMap.get(countryKey).push(node);
    } else {
      // 未匹配节点单独收集
      unmatchedNodes.push(node);
    }
  }
  // 对每个国家分组添加序号，序号插入在国家标签后
  function insertIndex(name, countryLabel, sepLeft, index, sepRight) {
    const idx = name.lastIndexOf(countryLabel);
    const insertPos = idx + countryLabel.length;
    return name.slice(0, insertPos) + sepLeft + index + sepRight + name.slice(insertPos);
  }
  for (const [countryKey, group] of countryMap.entries()) {
    if (rmSingleIdx && group.length === 1) {
      // 单序号节点，不添加序号标签
      matchedNodes.push({ ...group[0] });
    } else {
      for (let i = 0; i < group.length; i++) {
        const newName = insertIndex(group[i].name, countryKey, sepLeft, i + 1, sepRight);
        const node = { ...group[i], name: newName };
        matchedNodes.push(node);
      }
    }
  }
  // 先已加序号节点，后未匹配节点
  nodes.splice(0, nodes.length, ...matchedNodes, ...unmatchedNodes);
  return nodes;
}

// ==================== 主函数 ====================
function operator(nodes) {
  let filteredNodes = nodes;
  if (filterInvalid) {
    filteredNodes = filterInvalidNodes(nodes);
  }

  const CUSTOM_LABELS = parseCustomLabel(customLabel);

  const plSepArr = providerLabelSep ? parseSep(providerLabelSep) : ["|"];
  const ilSepArr = indexLabelSep ? parseSep(indexLabelSep) : ["#"];
  const tSepArr = attrLabelSep ? parseSep(attrLabelSep) : ["[", "]"];

  const resultNodes = [];
  const concatNodes = [];
  for (const node of filteredNodes) {
    // 匹配国家标签
    const country = matchCountryLabel(node);
    node._country = country;
    node._matched = !!country;
    if (filterUnmatched && !node._matched) continue; // 过滤未匹配国家标签节点
    if (!node._matched) {
      resultNodes.push(node);
      continue;
    }
    // 只有 _matched==true 时才执行后续匹配
    // 匹配倍率
    node._rate = matchRateLabel(node);
    // 匹配线路标签
    node._line = matchLineLabel(node);
    // 匹配自定义标签（用于排序）
    node._custom = matchCustomLabel(node, CUSTOM_LABELS);
    // 拼接节点名称
    // a. 拼接 attrLabel
    let attrItems = [];
    // 倍率标签
    if (addRateLabel && node._rate) attrItems.push(node._rate + "×");
    // 线路标签
    if (addLineLabel && node._line && node._line.length) {
      const lineLabelType = countryLabelType === "en" || countryLabelType === "code" ? "en" : "zh";
      attrItems = attrItems.concat(node._line.map(l => l[lineLabelType] || l.zh));
    }
    // 自定义标签
    if (node._custom && node._custom.length) attrItems = attrItems.concat(node._custom);
    let attrLabel = attrItems.join(attrItemSep);
    if (attrLabel) {
      if (tSepArr.length === 1) {
        attrLabel = tSepArr[0] + ' ' + attrLabel;
      } else if (tSepArr.length === 2) {
        attrLabel = tSepArr[0] + attrLabel + tSepArr[1];
      }
    }

    // b. 国家标签、国旗标签、线路标签
    let countryLabel = "", flagLabel = "";
    if (node._country) {
      if (countryLabelType === "en") {
        countryLabel = node._country.en || "";
        flagLabel = node._country.flag || "";
      } else if (countryLabelType === "code") {
        countryLabel = node._country.code || "";
        flagLabel = node._country.flag || "";
      } else { // zh 或未指定
        countryLabel = node._country.zh || "";
        flagLabel = node._country.flag || "";
      }
    }
    if (addFlagLabel && flagLabel) flagLabel += ' ';
    else flagLabel = '';
    if (countryLabel && attrLabel) countryLabel += ' ';

    // c. providerLabel 拼接
    let name = "";
    if (providerLabel) {
      if (providerLabelPos === "head") {
        if (plSepArr.length === 1) {
          name = providerLabel + ' ' + plSepArr[0] + ' ' + flagLabel + countryLabel + attrLabel;
        } else if (plSepArr.length === 2) {
          name = plSepArr[0] + providerLabel + plSepArr[1] + ' ' + flagLabel + countryLabel + attrLabel;
        }
      } else { // tail
        if (plSepArr.length === 1) {
          name = flagLabel + countryLabel + attrLabel + ' ' + plSepArr[0] + ' ' + providerLabel;
        } else if (plSepArr.length === 2) {
          name = flagLabel + countryLabel + attrLabel + ' ' + plSepArr[0] + providerLabel + plSepArr[1];
        }
      }
    } else {
      name = flagLabel + countryLabel + attrLabel;
    }
    node.name = name;
    concatNodes.push(node);
  }

  // 过滤指定倍率区间的节点
  let rateFilteredNodes = rateRange ? filterByRate(concatNodes, rateRange) : concatNodes;
  // 节点分组排序
  let sortedNodes = sortNodes ? sortByGroup(rateFilteredNodes, CUSTOM_LABELS) : rateFilteredNodes;
  // 节点添加序号标签
  addIndex(sortedNodes, rmSingleIdx);
  
  // 删除所有临时字段并处理 blockQuic
  sortedNodes.forEach(node => {
    delete node._matched;
    delete node._country;
    delete node._rate;
    delete node._line;
    delete node._custom;
    // blockQuic
    if (blockQuic) node["block-quic"] = "on";
    else delete node["block-quic"];
  });

  return sortedNodes;
}
