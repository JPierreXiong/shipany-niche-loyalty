import json
import sys

# Read the file with UTF-8 encoding
with open('src/config/locale/messages/zh/landing.json', 'r', encoding='utf-8') as f:
    content = f.read()

# Try to find and fix the broken line
# The error is around line 340, position 8291
print("Checking for JSON errors...")

try:
    # Try to parse
    data = json.loads(content)
    print("✅ JSON is valid!")
except json.JSONDecodeError as e:
    print(f"❌ JSON Error at line {e.lineno}, column {e.colno}")
    print(f"   Position: {e.pos}")
    print(f"   Message: {e.msg}")
    
    # Show context around the error
    lines = content.split('\n')
    error_line = e.lineno - 1
    
    print(f"\nContext around line {e.lineno}:")
    for i in range(max(0, error_line - 2), min(len(lines), error_line + 3)):
        marker = ">>> " if i == error_line else "    "
        print(f"{marker}{i+1:4d}: {lines[i]}")
    
    # Try to fix common issues
    print("\nAttempting to fix...")
    
    # Fix: Replace broken characters
    fixed_content = content
    
    # Common fixes
    fixes = [
        ('轻量级脚�?', '轻量级脚本'),
        ('一�?', '一个'),
        ('零拖�?', '零拖累'),
        ('�?', '于'),
    ]
    
    for old, new in fixes:
        if old in fixed_content:
            fixed_content = fixed_content.replace(old, new)
            print(f"  Fixed: {old} -> {new}")
    
    # Try to parse again
    try:
        data = json.loads(fixed_content)
        print("\n✅ JSON fixed successfully!")
        
        # Write the fixed version
        with open('src/config/locale/messages/zh/landing.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print("✅ File saved successfully!")
        
    except json.JSONDecodeError as e2:
        print(f"\n❌ Still has errors: {e2.msg}")
        sys.exit(1)
















