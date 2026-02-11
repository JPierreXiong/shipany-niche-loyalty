# -*- coding: utf-8 -*-
import json
import sys

# Read the file
with open('src/config/locale/messages/zh/landing.json', 'r', encoding='utf-8') as f:
    content = f.read()

print("Checking JSON...")

try:
    data = json.loads(content)
    print("OK: JSON is valid!")
except json.JSONDecodeError as e:
    print(f"ERROR at line {e.lineno}, column {e.colno}")
    
    # Show context
    lines = content.split('\n')
    error_line = e.lineno - 1
    
    print(f"\nLine {e.lineno}:")
    if error_line < len(lines):
        print(lines[error_line])
    
    # Fix broken characters
    print("\nFixing...")
    fixed = content.replace('轻量级脚�?', '轻量级脚本')
    fixed = fixed.replace('一�?', '一个')
    fixed = fixed.replace('零拖�?', '零拖累')
    
    try:
        data = json.loads(fixed)
        print("OK: Fixed!")
        
        # Save
        with open('src/config/locale/messages/zh/landing.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print("OK: Saved!")
    except json.JSONDecodeError as e2:
        print(f"ERROR: Still broken - {e2.msg}")
        sys.exit(1)


