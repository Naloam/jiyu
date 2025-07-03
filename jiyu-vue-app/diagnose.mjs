#!/usr/bin/env node

/**
 * 前端项目重构诊断脚本
 * 检查Vue项目的依赖关系、模块化结构和潜在问题
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

class FrontendRefactorAnalyzer {
  constructor(projectPath = '.') {
    this.projectPath = projectPath;
    this.report = {
      summary: {},
      dependencies: {},
      components: {},
      assets: {},
      routes: {},
      issues: [],
      recommendations: []
    };
  }

  async analyze() {
    console.log('🔍 开始前端项目重构分析...\n');
    
    this.checkProjectStructure();
    this.analyzePackageJson();
    this.analyzeVueComponents();
    this.analyzeRoutes();
    this.analyzeAssets();
    this.analyzeDependencies();
    this.generateReport();
    
    return this.report;
  }

  checkProjectStructure() {
    console.log('📁 检查项目结构...');
    
    const requiredDirs = ['src', 'src/views', 'src/components', 'src/stores', 'src/assets'];
    const requiredFiles = ['package.json', 'vite.config.ts', 'src/main.ts', 'src/App.vue'];
    
    requiredDirs.forEach(dir => {
      const exists = existsSync(join(this.projectPath, dir));
      this.report.summary[dir] = exists ? '✅' : '❌';
      if (!exists) {
        this.report.issues.push(`缺少必要目录: ${dir}`);
      }
    });
    
    requiredFiles.forEach(file => {
      const exists = existsSync(join(this.projectPath, file));
      this.report.summary[file] = exists ? '✅' : '❌';
      if (!exists) {
        this.report.issues.push(`缺少必要文件: ${file}`);
      }
    });
  }

  analyzePackageJson() {
    console.log('📦 分析 package.json...');
    
    try {
      const packagePath = join(this.projectPath, 'package.json');
      const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
      
      this.report.dependencies = {
        production: Object.keys(packageJson.dependencies || {}),
        development: Object.keys(packageJson.devDependencies || {}),
        scripts: Object.keys(packageJson.scripts || {})
      };
      
      // 检查关键依赖
      const criticalDeps = ['vue', 'vue-router', 'pinia', 'element-plus'];
      criticalDeps.forEach(dep => {
        if (!packageJson.dependencies[dep]) {
          this.report.issues.push(`缺少关键依赖: ${dep}`);
        }
      });
      
    } catch (error) {
      this.report.issues.push('无法解析 package.json');
    }
  }

  analyzeVueComponents() {
    console.log('🎨 分析 Vue 组件...');
    
    const componentsDir = join(this.projectPath, 'src');
    const components = this.findVueFiles(componentsDir);
    
    components.forEach(component => {
      const relativePath = relative(this.projectPath, component);
      this.report.components[relativePath] = this.analyzeVueFile(component);
    });
  }

  analyzeVueFile(filePath) {
    try {
      const content = readFileSync(filePath, 'utf8');
      
      return {
        hasTemplate: content.includes('<template>'),
        hasScript: content.includes('<script'),
        hasStyle: content.includes('<style'),
        isTypeScript: content.includes('lang="ts"') || content.includes("lang='ts'"),
        imports: this.extractImports(content),
        size: statSync(filePath).size
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  extractImports(content) {
    const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"];?/g;
    const imports = [];
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      imports.push(match[1]);
    }
    
    return imports;
  }

  analyzeRoutes() {
    console.log('🛣️ 分析路由配置...');
    
    const routerPath = join(this.projectPath, 'src/router/index.ts');
    if (existsSync(routerPath)) {
      try {
        const content = readFileSync(routerPath, 'utf8');
        const routes = this.extractRoutes(content);
        this.report.routes = routes;
      } catch (error) {
        this.report.issues.push('无法解析路由配置');
      }
    } else {
      this.report.issues.push('路由配置文件不存在');
    }
  }

  extractRoutes(content) {
    const routes = [];
    const routeRegex = /path:\s*['"](.*?)['"].*?component.*?import\(['"](.*?)['"].*?\)/g;
    let match;
    
    while ((match = routeRegex.exec(content)) !== null) {
      routes.push({
        path: match[1],
        component: match[2]
      });
    }
    
    return routes;
  }

  analyzeAssets() {
    console.log('🖼️ 分析静态资源...');
    
    const assetsDir = join(this.projectPath, 'src/assets');
    if (existsSync(assetsDir)) {
      const assets = this.findAssetFiles(assetsDir);
      this.report.assets = {
        total: assets.length,
        types: this.categorizeAssets(assets),
        list: assets.map(asset => relative(this.projectPath, asset))
      };
    }
  }

  findVueFiles(dir) {
    const files = [];
    const items = readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findVueFiles(fullPath));
      } else if (extname(item) === '.vue') {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  findAssetFiles(dir) {
    const files = [];
    const items = readdirSync(dir);
    const assetExts = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.css', '.scss', '.less'];
    
    items.forEach(item => {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findAssetFiles(fullPath));
      } else if (assetExts.includes(extname(item).toLowerCase())) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  categorizeAssets(assets) {
    const types = {};
    assets.forEach(asset => {
      const ext = extname(asset).toLowerCase();
      types[ext] = (types[ext] || 0) + 1;
    });
    return types;
  }

  analyzeDependencies() {
    console.log('🔗 分析依赖关系...');
    
    // 这里可以添加更复杂的依赖分析逻辑
    this.report.recommendations.push('建议使用依赖分析工具（如 webpack-bundle-analyzer）进行深度分析');
  }

  generateReport() {
    console.log('\n📊 生成诊断报告...\n');
    
    console.log('='.repeat(60));
    console.log('           前端项目重构诊断报告');
    console.log('='.repeat(60));
    
    console.log('\n📁 项目结构检查:');
    Object.entries(this.report.summary).forEach(([key, value]) => {
      console.log(`  ${value} ${key}`);
    });
    
    console.log('\n📦 依赖分析:');
    console.log(`  生产依赖: ${this.report.dependencies.production?.length || 0} 个`);
    console.log(`  开发依赖: ${this.report.dependencies.development?.length || 0} 个`);
    console.log(`  NPM 脚本: ${this.report.dependencies.scripts?.length || 0} 个`);
    
    console.log('\n🎨 Vue 组件分析:');
    console.log(`  总组件数: ${Object.keys(this.report.components).length} 个`);
    
    console.log('\n🛣️ 路由分析:');
    console.log(`  总路由数: ${this.report.routes.length || 0} 个`);
    
    console.log('\n🖼️ 静态资源分析:');
    console.log(`  总资源数: ${this.report.assets.total || 0} 个`);
    if (this.report.assets.types) {
      Object.entries(this.report.assets.types).forEach(([ext, count]) => {
        console.log(`    ${ext}: ${count} 个`);
      });
    }
    
    if (this.report.issues.length > 0) {
      console.log('\n⚠️ 发现的问题:');
      this.report.issues.forEach(issue => {
        console.log(`  ❌ ${issue}`);
      });
    }
    
    if (this.report.recommendations.length > 0) {
      console.log('\n💡 优化建议:');
      this.report.recommendations.forEach(rec => {
        console.log(`  💡 ${rec}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
  }
}

// 运行分析
const analyzer = new FrontendRefactorAnalyzer();
analyzer.analyze().then(report => {
  console.log('\n✅ 分析完成！');
}).catch(error => {
  console.error('❌ 分析失败:', error.message);
});
