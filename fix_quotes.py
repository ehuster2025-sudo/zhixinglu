import re

with open('data/books.json', 'r', encoding='utf-8') as f:
    content = f.read()

# 只替换字符串值内的中文引号，不碰键名
# 查找 "key": "value with "problem"" 模式
def fix_quotes(match):
    s = match.group(0)
    # 第一个 : 前面是 key，后面是 value
    # 在 value 里的中文引号前加反斜杠
    s = s.replace('"', '\\"').replace('"', '\\"')
    return s

# 使用更精确的正则：键值对中的值部分
pattern = r'("[\w\u4e00-\u9fa5]+":\s*")([^"]*)(")'
# 这个太复杂，直接用简单替换

# 方法：把 " 替换为 \" 但只在 : 后面出现时
lines = content.split('\n')
fixed_lines = []
for line in lines:
    if ':' in line:
        # 找到第一个冒号的位置
        idx = line.index(':')
        key = line[:idx+1]
        value = line[idx+1:]
        # 只在值里替换中文引号
        value = value.replace('"', '\\"').replace('"', '\\"')
        line = key + value
    fixed_lines.append(line)

content = '\n'.join(fixed_lines)

with open('data/books.json', 'w', encoding='utf-8') as f:
    f.write(content)

# Verify
import json
with open('data/books.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print(f'books.json 修复成功 - {len(data)}本书')
