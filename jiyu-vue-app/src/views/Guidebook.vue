<template>
  <ScrollContainer class="guidebook-container" height="100vh">
    <div class="guidebook-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="guidebook-title">
            <el-icon><Reading /></el-icon>
            使用指南
          </h1>
          <p class="guidebook-subtitle">了解积语·云伴学的全部功能与使用方法</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="$router.push('/chat')" :icon="ChatDotRound" size="large">
            智能问答
          </el-button>
          <el-button @click="$router.push('/')" :icon="ArrowLeft">
            返回主页
          </el-button>
        </div>
      </div>
    </div>
    
    <div class="guidebook-content">
      <el-card>
        <el-tabs tab-position="left" class="guide-tabs">
          <el-tab-pane label="启动与设置">
            <div class="guide-section">
              <h2>启动</h2>
              <div class="guide-item">
                <h3>网址</h3>
                <ul>
                  <li><strong>积语·云伴学</strong> 的网址为：<el-link type="primary" href="https://xxxx.com" target="_blank">https://xxxx.com</el-link>, 请直接在浏览器中访问指定的URL并登录您的账户。</li>
                  <li>点击链接可以看到平台官网界面。</li>
                </ul>
              </div>
              
              <h2>账户设置</h2>
              <div class="guide-item">
                <h3>注册/登录</h3>
                <ul>
                  <li>如果是首次使用，您需要注册一个新账户。按照提示填写相关信息（如用户名、密码等），并完成验证。</li>
                  <li>已注册用户直接输入用户名和密码登录。</li>
                </ul>
                <div class="guide-image">
                  <el-image src="/src/assets/img_login.png" alt="登录界面" fit="contain" />
                </div>
              </div>
              
              <div class="guide-item">
                <h3>个性化设置</h3>
                <ul>
                  <li>登录后，请进入设置界面，认真阅读使用手册。</li>
                  <li>设置您的学习需求和偏好调整界面主题、语言、通知设置等，以便积语·云伴学能更精准地为您提供学习资源。</li>
                </ul>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="主要功能">
            <div class="guide-section">
              <h2>主要功能介绍</h2>
              
              <div class="guide-item">
                <h3>普通答疑</h3>
                <ol>
                  <li><strong>步骤1：</strong>点击 <strong>普通答疑</strong>，输入您的问题，积语·云伴学将快速提供详细的知识、定义、解释或示例。</li>
                  <li><strong>步骤2：</strong>针对 <strong>积语</strong> 的解答，您可以继续进行提问。<strong>积语·云伴学</strong>支持复杂问题拆解和多轮对话，深入理解您的需求。</li>
                </ol>
                <div class="guide-image">
                  <el-image src="/src/assets/image3.png" alt="普通答疑" fit="contain" />
                </div>
              </div>
              
              <div class="guide-item">
                <h3>批改订正</h3>
                <ol>
                  <li><strong>步骤1：</strong>点击 <strong>批改订正</strong>，输入 <strong>题目</strong> 和 <strong>答案</strong> 积语·云伴学系统将检查你的作答情况，如果答案错误，积语·云伴学将通过引导您一步一步进行解答</li>
                  <li><strong>步骤2：</strong>支持循循善诱式的答疑方式，像一位老师一样教导学生。</li>
                </ol>
                <div class="guide-image">
                  <el-image src="/src/assets/image4.png" alt="批改订正" fit="contain" />
                </div>
              </div>
              
              <div class="guide-item">
                <h3>个性化学习</h3>
                <ol>
                  <li><strong>步骤1：</strong>点击学习新知识，选择合适的学习方法，例如 <strong>费曼学习法</strong>。</li>
                  <div class="guide-image">
                    <el-image src="/src/assets/image5.png" alt="选择学习方法" fit="contain" />
                  </div>
                  
                  <li><strong>步骤2：</strong>在弹出的知识库中，点击年级和所学习的知识，开始学习。</li>
                  <div class="guide-image">
                    <el-image src="/src/assets/image6.png" alt="选择知识" fit="contain" />
                  </div>
                  <div class="guide-image">
                    <el-image src="/src/assets/image7.png" alt="选择知识" fit="contain" />
                  </div>
                  
                  <li><strong>步骤3：</strong>学习过程分为四个部分，知识点解释、概念巩固、总结、课后习题。</li>
                  <div class="guide-image">
                    <el-image src="/src/assets/image8.png" alt="学习过程" fit="contain" />
                  </div>
                </ol>
              </div>
              
              <div class="guide-item">
                <h3>学习资料</h3>
                <ul>
                  <li><strong>介绍：</strong>包含了丰富的教学资料，为学生提供良好的学习环境</li>
                  <li><strong>详情：</strong>包含 <strong>教材全解</strong>、<strong>知识点总结</strong>、<strong>解题技巧</strong>、<strong>数学公式大全</strong></li>
                </ul>
                <div class="guide-image">
                  <el-image src="/src/assets/image9.png" alt="学习资料" fit="contain" />
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="基础设置">
            <div class="guide-section">
              <h2>基础设置</h2>
              
              <div class="guide-item">
                <ul>
                  <li><strong>使用指南：</strong>提供网页各种功能的使用说明</li>
                  <li><strong>账号信息：</strong>修改账号信息</li>
                  <li><strong>知识库：</strong>包含一至六年级的所有知识点，当你在个性化学习中学会了这个知识点，你可以在此将知识点点亮。</li>
                  <li><strong>退出登录：</strong>点击退回登陆界面。</li>
                </ul>
                <div class="guide-image">
                  <el-image src="/src/assets/image10.png" alt="基础设置" fit="contain" />
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="使用技巧">
            <div class="guide-section">
              <h2>使用技巧</h2>
              
              <div class="guide-item">
                <ul>
                  <li><strong>文字输入：</strong>将问题输入到发送框，点击"Send"等待大模型回答。</li>
                  <li><strong>拍照输入：</strong>点击摄像机图标，进入摄像模式，点击确认发送图像。</li>
                </ul>
                <div class="guide-image">
                  <el-image src="/src/assets/img_camera.png" alt="拍照功能" fit="contain" />
                </div>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="安全与隐私">
            <div class="guide-section">
              <h2>安全与隐私</h2>
              
              <div class="guide-item">
                <ul>
                  <li>我们重视您的数据安全与隐私保护，所有数据传输均加密处理。</li>
                  <li>请勿在学习系统中输入敏感信息，如银行账户密码、身份证号等。</li>
                  <li>如需了解更多关于隐私政策的信息，请访问我们的官方网站。</li>
                </ul>
              </div>
              
              <div class="guide-conclusion">
                <h3>结语</h3>
                <p>感谢您选择 <strong>积语·云伴学</strong> 作为您的学习伙伴！我们期待与您一起成长，共同探索知识的无限可能。如有任何疑问或需要帮助，请随时联系我们的客服团队。</p>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </ScrollContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ScrollContainer from '@/components/common/ScrollContainer.vue'
import { Reading, ChatDotRound, ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()

onMounted(() => {
  console.log('使用指南组件已加载')
})
</script>

<style scoped lang="scss">
.guidebook-container {
  padding: 24px;
  background: #f5f7fa;
}

.guidebook-header {
  margin-bottom: 32px;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .header-left {
    text-align: left;
  }
  
  .header-right {
    flex-shrink: 0;
    display: flex;
    gap: 10px;
  }
  
  .guidebook-title {
    font-size: 28px;
    color: #303133;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
  
  .guidebook-subtitle {
    color: #909399;
    font-size: 16px;
    margin: 0;
  }
}

.guidebook-content {
  max-width: 1200px;
  margin: 0 auto;
  
  .el-card {
    border-radius: 12px;
  }
  
  .guide-tabs {
    min-height: 600px;
    
    :deep(.el-tabs__content) {
      padding: 0 20px;
    }
  }
}

.guide-section {
  h2 {
    font-size: 24px;
    color: #303133;
    margin: 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
  }
}

.guide-item {
  margin-bottom: 30px;
  
  h3 {
    font-size: 18px;
    color: #409EFF;
    margin-bottom: 15px;
  }
  
  ul, ol {
    padding-left: 20px;
    margin-bottom: 15px;
    
    li {
      margin-bottom: 10px;
      line-height: 1.6;
      color: #606266;
    }
  }
  
  .guide-image {
    margin: 15px 0;
    text-align: center;
    
    .el-image {
      max-width: 100%;
      max-height: 400px;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.guide-conclusion {
  margin-top: 40px;
  padding: 20px;
  background-color: #ecf5ff;
  border-radius: 8px;
  
  h3 {
    font-size: 18px;
    color: #409EFF;
    margin-bottom: 10px;
  }
  
  p {
    line-height: 1.6;
    color: #606266;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .guidebook-header .guidebook-title {
    font-size: 24px;
  }
  
  .guide-tabs {
    :deep(.el-tabs__content) {
      padding: 0 10px;
    }
  }
  
  .guide-section h2 {
    font-size: 20px;
  }
  
  .guide-item h3 {
    font-size: 16px;
  }
}
</style>
