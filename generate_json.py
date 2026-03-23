#!/usr/bin/env python3
import json
from pathlib import Path

# 读取已有的山海经数据
json_file = Path('/Users/jeffny/Desktop/知行录/data/shanhaijing.json.backup')
if json_file.exists():
    with open(json_file, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except:
            data = []
else:
    data = []

# 穷奇数据
qiongqi_data = {
    "id": 7,
    "title": "穷奇",
    "subtitle": "抑善扬恶之兽，四大凶兽之一",
    "tag": "凶兽",
    "date": "2026-03",
    "icon": "狼",
    "summary": "《山海经》中记载的四大凶兽之一，形如牛（或虎）而有翼，最独特之处在于其'抑善扬恶'的反道德行为逻辑。",
    "authorBackground": {
        "name": "《山海经·西山经》《海内北经》",
        "desc": "《山海经》是中国先秦时期的一部古籍，作者不详。全书共十八卷，内容涵盖地理、神话、民俗等诸多领域。",
        "motivation": ["记录上古地理知识", "保存神话传说", "反映先民想象", "道德警示"]
    },
    "keyPoints": [
        {
            "title": "外形特征：牛形虎翼，猬毛音獆
            "content": "《山海经》对穷奇有两种描述：《西山经》载其'状如牛，猬毛'；《海内北经》则载其'状如虎，有翼'。"
        },
        {
            "title": "抑善扬恶：反道德的独特设定",
            "content": "《神异经》记载：'闻人斗，辄食直者；闻人忠信，辄食其鼻；闻人恶逆不善，辄杀兽往馈之。'"
        },
        {
            "title": "文化演变：从凶兽到文化符号",
            "content": "穷奇与混沌、梼杌饕餮'四大凶兽'，在《左传》《史记》中被拟人化为'不才子'。"
        }
    ],
    "chapters": [
        {
            "title": "原典记载",
            "content": "《山海经·西山经》记载：'又西二百六十里，曰邽。其上有兽焉，其状如牛，猬毛，名曰穷奇，音如獆，是食人。'"
        },
        {
            "title": "形象描绘",
            "content": "穷奇的形象融合了多种动物的特征：牛的体型或虎的矫健、刺猬的防御硬毛、鸟的翅膀、狗的叫声。"
        },
        {
            "title": "抑善扬恶的神异之处",
            "content": "《神异经·西北荒经》详细记载了穷奇的反道德行为：'西北有兽焉，状似虎，有翼能飞，便剿食人，知人言语。'"
        },
        {
            "title": "四大凶兽之说",
            "content": "穷奇与混沌、梼杌饕餮'四大凶兽'，这一说法源自《左传·文公十八年》。"
        },
        {
            "title": "文化流变与现代意义",
            "content": "先秦时期，穷奇主要作为地理志怪和道德警示的形象出现；汉代文献进一步强化了其道德象征意义。"
        }
    ],
    "quotes": [
        {
            "text": "其状如牛，猬毛，名曰穷奇，音如獆，是食人。",
            "source": "《山海经·西山经》"
        },
        {
            "text": "穷奇状如虎，有翼，食人从首始，所食被发。",
            "source": "《山海经·海内北经》"
        },
        {
            "text": "闻人斗，辄食直者；闻人忠信，辄食其鼻；闻人恶逆不善，辄杀兽往馈之。",
            "source": "《神异经·西北荒经》"
        }
    ],
    "guide": [
        "了解《山海经》的基本内容和价值",
        "认识穷奇'抑善扬恶'的独特设定及其文化意义",
        "探索四大凶兽的神话体系",
        "思考道德相对性与绝对性的哲学问题",
        "理解神话形象在现代文化中的重构"
    ],
    "extended": [
        {
            "title": "《山海经》",
            "author": "佚名",
            "desc": "穷奇神话的最早出处，中国古代地理神话著作。"
        },
        {
            "title": "《神异经》",
            "author": "东方朔（传）",
            "desc": "详细记载穷奇'抑善扬恶'行为的文献。"
        },
        {
            "title": "《左传》",
            "author": "左丘明",
            "desc": "将穷奇拟人化为'不才子'，记载四大凶兽之说。"
        }
    ]
}

data.append(qiongqi_data)

# 写入JSON文件
output_file = Path('/Users/jeffny/Desktop/知行录/data/shanhaijing.json')
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f'✓ JSON写入成功')
print(f'✓ 包含 {len(data)} 条记录')
print(f'✓ 最后一条记录标题: {data[-1]["title"]}')
