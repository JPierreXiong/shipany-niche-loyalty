const fs = require('fs');
const path = require('path');

const serverDir = path.join(process.cwd(), '.next/server');
const nftPath = path.join(serverDir, 'middleware.js.nft.json');
const manifestPath = path.join(serverDir, 'middleware-manifest.json');
const middlewareJsPath = path.join(serverDir, 'middleware.js');

try {
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // 兼容 Next.js 15/16 的清单结构，提取主路径 "/" 的文件依赖
    const middlewareConfig = manifest.middleware['/'];
    if (middlewareConfig && middlewareConfig.files) {
      const files = middlewareConfig.files;

      const nftContent = {
        version: 1,
        // 将路径中的 'server/' 前缀去除，因为 nft.json 是相对于 server 目录的
        files: files.map(f => path.relative('server', f))
      };

      // 确保目录存在
      if (!fs.existsSync(serverDir)) {
        fs.mkdirSync(serverDir, { recursive: true });
      }

      // 1. 生成 middleware.js.nft.json
      fs.writeFileSync(nftPath, JSON.stringify(nftContent, null, 2));
      console.log('✅ [ShipAny Fix] Successfully generated middleware.js.nft.json');
      console.log(`   Files traced: ${files.length}`);
      console.log(`   Output: ${path.relative(process.cwd(), nftPath)}`);

      // 2. 创建伪装的 middleware.js 解决 lstat 报错
      if (!fs.existsSync(middlewareJsPath)) {
        fs.writeFileSync(middlewareJsPath, '// Vercel placeholder - actual middleware runs via Edge Runtime chunks\n');
        console.log('✅ [ShipAny Fix] Created dummy middleware.js for lstat check');
      }
    } else {
      console.warn('⚠️ [ShipAny Fix] No middleware configuration found in manifest.');
    }
  } else {
    console.warn('⚠️ [ShipAny Fix] middleware-manifest.json not found, skipping NFT generation.');
  }
} catch (error) {
  console.error('❌ [ShipAny Fix] Failed to generate NFT file:', error.message);
  process.exit(1);
}
