const ELEMENTS = [
  {n:1,  symbol:"H",  name:"水素",         period:1, group:1,  category:"nonmetal"},
  {n:2,  symbol:"He", name:"ヘリウム",     period:1, group:18, category:"noble"},
  {n:3,  symbol:"Li", name:"リチウム",     period:2, group:1,  category:"alkali"},
  {n:4,  symbol:"Be", name:"ベリリウム",   period:2, group:2,  category:"alkaline"},
  {n:5,  symbol:"B",  name:"ホウ素",       period:2, group:13, category:"metalloid"},
  {n:6,  symbol:"C",  name:"炭素",         period:2, group:14, category:"nonmetal"},
  {n:7,  symbol:"N",  name:"窒素",         period:2, group:15, category:"nonmetal"},
  {n:8,  symbol:"O",  name:"酸素",         period:2, group:16, category:"nonmetal"},
  {n:9,  symbol:"F",  name:"フッ素",       period:2, group:17, category:"nonmetal"},
  {n:10, symbol:"Ne", name:"ネオン",       period:2, group:18, category:"noble"},
  {n:11, symbol:"Na", name:"ナトリウム",   period:3, group:1,  category:"alkali"},
  {n:12, symbol:"Mg", name:"マグネシウム", period:3, group:2,  category:"alkaline"},
  {n:13, symbol:"Al", name:"アルミニウム", period:3, group:13, category:"post"},
  {n:14, symbol:"Si", name:"ケイ素",       period:3, group:14, category:"metalloid"},
  {n:15, symbol:"P",  name:"リン",         period:3, group:15, category:"nonmetal"},
  {n:16, symbol:"S",  name:"硫黄",         period:3, group:16, category:"nonmetal"},
  {n:17, symbol:"Cl", name:"塩素",         period:3, group:17, category:"nonmetal"},
  {n:18, symbol:"Ar", name:"アルゴン",     period:3, group:18, category:"noble"},
  {n:19, symbol:"K",  name:"カリウム",     period:4, group:1,  category:"alkali"},
  {n:20, symbol:"Ca", name:"カルシウム",   period:4, group:2,  category:"alkaline"},
  {n:21, symbol:"Sc", name:"スカンジウム", period:4, group:3,  category:"transition"},
  {n:22, symbol:"Ti", name:"チタン",       period:4, group:4,  category:"transition"},
  {n:23, symbol:"V",  name:"バナジウム",   period:4, group:5,  category:"transition"},
  {n:24, symbol:"Cr", name:"クロム",       period:4, group:6,  category:"transition"},
  {n:25, symbol:"Mn", name:"マンガン",     period:4, group:7,  category:"transition"},
  {n:26, symbol:"Fe", name:"鉄",           period:4, group:8,  category:"transition"},
  {n:27, symbol:"Co", name:"コバルト",     period:4, group:9,  category:"transition"},
  {n:28, symbol:"Ni", name:"ニッケル",     period:4, group:10, category:"transition"},
  {n:29, symbol:"Cu", name:"銅",           period:4, group:11, category:"transition"},
  {n:30, symbol:"Zn", name:"亜鉛",         period:4, group:12, category:"transition"},
  {n:31, symbol:"Ga", name:"ガリウム",     period:4, group:13, category:"post"},
  {n:32, symbol:"Ge", name:"ゲルマニウム", period:4, group:14, category:"metalloid"},
  {n:33, symbol:"As", name:"ヒ素",         period:4, group:15, category:"metalloid"},
  {n:34, symbol:"Se", name:"セレン",       period:4, group:16, category:"nonmetal"},
  {n:35, symbol:"Br", name:"臭素",         period:4, group:17, category:"nonmetal"},
  {n:36, symbol:"Kr", name:"クリプトン",   period:4, group:18, category:"noble"},
  {n:37, symbol:"Rb", name:"ルビジウム",   period:5, group:1,  category:"alkali"},
  {n:38, symbol:"Sr", name:"ストロンチウム",period:5,group:2,  category:"alkaline"},
  {n:39, symbol:"Y",  name:"イットリウム", period:5, group:3,  category:"transition"},
  {n:40, symbol:"Zr", name:"ジルコニウム", period:5, group:4,  category:"transition"},
  {n:41, symbol:"Nb", name:"ニオブ",       period:5, group:5,  category:"transition"},
  {n:42, symbol:"Mo", name:"モリブデン",   period:5, group:6,  category:"transition"},
  {n:43, symbol:"Tc", name:"テクネチウム", period:5, group:7,  category:"transition"},
  {n:44, symbol:"Ru", name:"ルテニウム",   period:5, group:8,  category:"transition"},
  {n:45, symbol:"Rh", name:"ロジウム",     period:5, group:9,  category:"transition"},
  {n:46, symbol:"Pd", name:"パラジウム",   period:5, group:10, category:"transition"},
  {n:47, symbol:"Ag", name:"銀",           period:5, group:11, category:"transition"},
  {n:48, symbol:"Cd", name:"カドミウム",   period:5, group:12, category:"transition"},
  {n:49, symbol:"In", name:"インジウム",   period:5, group:13, category:"post"},
  {n:50, symbol:"Sn", name:"スズ",         period:5, group:14, category:"post"},
  {n:51, symbol:"Sb", name:"アンチモン",   period:5, group:15, category:"metalloid"},
  {n:52, symbol:"Te", name:"テルル",       period:5, group:16, category:"metalloid"},
  {n:53, symbol:"I",  name:"ヨウ素",       period:5, group:17, category:"nonmetal"},
  {n:54, symbol:"Xe", name:"キセノン",     period:5, group:18, category:"noble"},
  {n:55, symbol:"Cs", name:"セシウム",     period:6, group:1,  category:"alkali"},
  {n:56, symbol:"Ba", name:"バリウム",     period:6, group:2,  category:"alkaline"},
  {n:57, symbol:"La", name:"ランタン",     period:6, group:3,  category:"lanthanide"},
  {n:58, symbol:"Ce", name:"セリウム",     period:6, group:3,  category:"lanthanide"},
  {n:59, symbol:"Pr", name:"プラセオジム", period:6, group:3,  category:"lanthanide"},
  {n:60, symbol:"Nd", name:"ネオジム",     period:6, group:3,  category:"lanthanide"},
  {n:61, symbol:"Pm", name:"プロメチウム", period:6, group:3,  category:"lanthanide"},
  {n:62, symbol:"Sm", name:"サマリウム",   period:6, group:3,  category:"lanthanide"},
  {n:63, symbol:"Eu", name:"ユウロピウム", period:6, group:3,  category:"lanthanide"},
  {n:64, symbol:"Gd", name:"ガドリニウム", period:6, group:3,  category:"lanthanide"},
  {n:65, symbol:"Tb", name:"テルビウム",   period:6, group:3,  category:"lanthanide"},
  {n:66, symbol:"Dy", name:"ジスプロシウム",period:6,group:3,  category:"lanthanide"},
  {n:67, symbol:"Ho", name:"ホルミウム",   period:6, group:3,  category:"lanthanide"},
  {n:68, symbol:"Er", name:"エルビウム",   period:6, group:3,  category:"lanthanide"},
  {n:69, symbol:"Tm", name:"ツリウム",     period:6, group:3,  category:"lanthanide"},
  {n:70, symbol:"Yb", name:"イッテルビウム",period:6,group:3,  category:"lanthanide"},
  {n:71, symbol:"Lu", name:"ルテチウム",   period:6, group:3,  category:"lanthanide"},
  {n:72, symbol:"Hf", name:"ハフニウム",   period:6, group:4,  category:"transition"},
  {n:73, symbol:"Ta", name:"タンタル",     period:6, group:5,  category:"transition"},
  {n:74, symbol:"W",  name:"タングステン", period:6, group:6,  category:"transition"},
  {n:75, symbol:"Re", name:"レニウム",     period:6, group:7,  category:"transition"},
  {n:76, symbol:"Os", name:"オスミウム",   period:6, group:8,  category:"transition"},
  {n:77, symbol:"Ir", name:"イリジウム",   period:6, group:9,  category:"transition"},
  {n:78, symbol:"Pt", name:"白金",         period:6, group:10, category:"transition"},
  {n:79, symbol:"Au", name:"金",           period:6, group:11, category:"transition"},
  {n:80, symbol:"Hg", name:"水銀",         period:6, group:12, category:"transition"},
  {n:81, symbol:"Tl", name:"タリウム",     period:6, group:13, category:"post"},
  {n:82, symbol:"Pb", name:"鉛",           period:6, group:14, category:"post"},
  {n:83, symbol:"Bi", name:"ビスマス",     period:6, group:15, category:"post"},
  {n:84, symbol:"Po", name:"ポロニウム",   period:6, group:16, category:"post"},
  {n:85, symbol:"At", name:"アスタチン",   period:6, group:17, category:"metalloid"},
  {n:86, symbol:"Rn", name:"ラドン",       period:6, group:18, category:"noble"},
  {n:87, symbol:"Fr", name:"フランシウム", period:7, group:1,  category:"alkali"},
  {n:88, symbol:"Ra", name:"ラジウム",     period:7, group:2,  category:"alkaline"},
  {n:89, symbol:"Ac", name:"アクチニウム", period:7, group:3,  category:"actinide"},
  {n:90, symbol:"Th", name:"トリウム",     period:7, group:3,  category:"actinide"},
  {n:91, symbol:"Pa", name:"プロトアクチニウム",period:7,group:3,category:"actinide"},
  {n:92, symbol:"U",  name:"ウラン",       period:7, group:3,  category:"actinide"},
  {n:93, symbol:"Np", name:"ネプツニウム", period:7, group:3,  category:"actinide"},
  {n:94, symbol:"Pu", name:"プルトニウム", period:7, group:3,  category:"actinide"},
  {n:95, symbol:"Am", name:"アメリシウム", period:7, group:3,  category:"actinide"},
  {n:96, symbol:"Cm", name:"キュリウム",   period:7, group:3,  category:"actinide"},
  {n:97, symbol:"Bk", name:"バークリウム", period:7, group:3,  category:"actinide"},
  {n:98, symbol:"Cf", name:"カリホルニウム",period:7,group:3,  category:"actinide"},
  {n:99, symbol:"Es", name:"アインスタイニウム",period:7,group:3,category:"actinide"},
  {n:100,symbol:"Fm", name:"フェルミウム", period:7, group:3,  category:"actinide"},
  {n:101,symbol:"Md", name:"メンデレビウム",period:7,group:3,  category:"actinide"},
  {n:102,symbol:"No", name:"ノーベリウム", period:7, group:3,  category:"actinide"},
  {n:103,symbol:"Lr", name:"ローレンシウム",period:7,group:3,  category:"actinide"},
  {n:104,symbol:"Rf", name:"ラザホージウム",period:7,group:4,  category:"transition"},
  {n:105,symbol:"Db", name:"ドブニウム",   period:7, group:5,  category:"transition"},
  {n:106,symbol:"Sg", name:"シーボーギウム",period:7,group:6,  category:"transition"},
  {n:107,symbol:"Bh", name:"ボーリウム",   period:7, group:7,  category:"transition"},
  {n:108,symbol:"Hs", name:"ハッシウム",   period:7, group:8,  category:"transition"},
  {n:109,symbol:"Mt", name:"マイトネリウム",period:7,group:9,  category:"transition"},
  {n:110,symbol:"Ds", name:"ダームスタチウム",period:7,group:10,category:"transition"},
  {n:111,symbol:"Rg", name:"レントゲニウム",period:7,group:11, category:"transition"},
  {n:112,symbol:"Cn", name:"コペルニシウム",period:7,group:12, category:"transition"},
  {n:113,symbol:"Nh", name:"ニホニウム",   period:7, group:13, category:"post"},
  {n:114,symbol:"Fl", name:"フレロビウム", period:7, group:14, category:"post"},
  {n:115,symbol:"Mc", name:"モスコビウム", period:7, group:15, category:"post"},
  {n:116,symbol:"Lv", name:"リバモリウム", period:7, group:16, category:"post"},
  {n:117,symbol:"Ts", name:"テネシン",     period:7, group:17, category:"nonmetal"},
  {n:118,symbol:"Og", name:"オガネソン",   period:7, group:18, category:"noble"},
];

const CATEGORY_COLORS = {
  alkali:     "#FFD6D6",
  alkaline:   "#FFE8C4",
  transition: "#FFF5C0",
  post:       "#D6F5D6",
  metalloid:  "#C4EEE8",
  nonmetal:   "#C4DCFF",
  noble:      "#E8C4FF",
  lanthanide: "#FFCCE8",
  actinide:   "#D6C4FF",
};

const CATEGORY_LABELS = {
  alkali:     "第一族",
  alkaline:   "第二族",
  transition: "遷移元素",
  post:       "貧金属",
  metalloid:  "半金属",
  nonmetal:   "非金属元素",
  noble:      "18族（希ガス）",
  lanthanide: "ランタノイド",
  actinide:   "アクチノイド",
};

function getElementsForMemory(setting) {
  switch (setting) {
    case '1-3':      return ELEMENTS.filter(el => el.period <= 3);
    case '4':        return ELEMENTS.filter(el => el.period === 4 && el.category !== 'lanthanide' && el.category !== 'actinide');
    case '5':        return ELEMENTS.filter(el => el.period === 5 && el.category !== 'lanthanide' && el.category !== 'actinide');
    case '6':        return ELEMENTS.filter(el => el.period === 6 && el.category !== 'lanthanide' && el.category !== 'actinide');
    case '7':        return ELEMENTS.filter(el => el.period === 7 && el.category !== 'lanthanide' && el.category !== 'actinide');
    case 'lanthanide': return ELEMENTS.filter(el => el.category === 'lanthanide');
    case 'actinide':   return ELEMENTS.filter(el => el.category === 'actinide');
    default:         return ELEMENTS.filter(el => el.period <= 3);
  }
}

function getElementsByPeriod(maxPeriod, includeLanthanide, includeActinide) {
  return ELEMENTS.filter(el => {
    if (el.period > maxPeriod) return false;
    if (el.category === "lanthanide" && !includeLanthanide) return false;
    if (el.category === "actinide" && !includeActinide) return false;
    return true;
  });
}

function parsePeriodSetting(setting) {
  switch(setting) {
    case "3": return {max:3, ln:false, ac:false};
    case "4": return {max:4, ln:false, ac:false};
    case "5": return {max:5, ln:false, ac:false};
    case "6": return {max:6, ln:false, ac:false};
    case "7": return {max:7, ln:false, ac:false};
    case "6+Ac": return {max:6, ln:false, ac:true};
    case "7+La+Ac": return {max:7, ln:true, ac:true};
    default: return {max:4, ln:false, ac:false};
  }
}
