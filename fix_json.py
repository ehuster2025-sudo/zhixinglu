import json

# 读取现有JSON
with open('/Users/jeffny/Desktop/知行录/data/shanhaijing.json', 'r', encoding='utf-8') as f:
    content = f.read()

# 修复emoji问题
content = content.replace('"icon": "\n', '"icon": "\\uD83D\\uDC3A",\n')

# 修复keyPoints中缺少的逗号
content = content.replace(
    '"title": "外形特征：牛形虎翼，猬毛音獆                "content"',
    '"title": "外形特征：牛形虎翼，猬毛音獆\n                "content"'
)

# 修复quotes中缺少的逗号
content = content.replace(
    '"text": "穷奇，帝鸿氏之不才子也。掩义隐贼，好行凶慝                "source"',
    '"text": "穷奇，帝鸿氏之不才子也。掩义隐贼，好行凶慝\n                "source"'
)

# 写回修复后的JSON
with open('/Users/jeffny/Desktop/知行录/data/shanhaijing.json', 'w', encoding='utf-8') as f:
    f.write(content)

# 验证JSON格式
try:
    with open('/Users/jeffny/Desktop/知行录/data/shanhaijing.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print('✓ JSON格式正确')
    print(f'✓ 标题: {data[0]["title"]}')
    print(f'✓ 章节数: {len(data[0]["chapters"])}')
    print(f'✓ 引言数: {len(data[0]["quotes"])}')
    print(f'✓ 延伸阅读数: {len(data[0]["extended"])}')
except json.JSONDecodeError as e:
    print(f'✗格式错误: {e}')
