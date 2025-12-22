<template>
  <div class="h-screen flex flex-col">
    <div class="flex flex-1 overflow-hidden relative">
      <main class="flex-1 flex flex-col p-4 overflow-y-auto">
        <!-- 移除Navbar组件 -->
        
        <div class="flex-grow">
          <div class="max-w-4xl mx-auto space-y-8">
            <!-- 修改标题样式为居中 -->
            <h2 
              class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-8 text-center hover:text-purple-800 dark:hover:text-purple-300 transition-colors cursor-pointer"
              @click="$router.push('/')"
            >
              系统设置
            </h2>
            
            <!-- 背景颜色设置 -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-palette text-blue-500 mr-2"></i>
                界面外观
              </h3>
              
              <!-- 默认颜色 -->
              <div class="mb-8">
                <h4 class="text-lg font-medium mb-4">默认配色方案</h4>
                <div class="grid grid-cols-3 gap-4">
                  <div 
                    v-for="color in backgroundColors" 
                    :key="color"
                    class="h-20 rounded-lg cursor-pointer border-2 transition-all"
                    :class="{ 'border-blue-500 scale-105': selectedBg === color }"
                    :style="{ backgroundColor: color }"
                    @click="changeBackground(color)"
                  ></div>
                </div>
              </div>
              
              <!-- 自定义颜色 -->
              <div class="mb-8">
                <h4 class="text-lg font-medium mb-4">自定义颜色</h4>
                <div class="flex items-center gap-4">
                  <input 
                    type="color"
                    v-model="customColorHex"
                    class="w-16 h-10 rounded cursor-pointer"
                  >
                  <input 
                    type="text" 
                    v-model="customColorHex"
                    placeholder="或输入十六进制颜色码"
                    class="flex-1 bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
                    @keyup.enter="applyCustomColor"
                  >
                  <button 
                    @click="applyCustomColor"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    应用
                  </button>
                </div>
              </div>
              
              <!-- 自定义背景图 -->
              <div>
                <h4 class="text-lg font-medium mb-4">自定义背景图</h4>
                <div class="flex items-center gap-4">
                  <input
                    type="url"
                    v-model="backgroundImage"
                    placeholder="输入在线图片URL (支持jpg/png/svg)"
                    class="flex-1 bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
                    @keyup.enter="applyBackgroundImage"
                  >
                  <button
                    @click="applyBackgroundImage"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    应用
                  </button>
                </div>
                <p class="text-sm text-gray-500 mt-2">
                  提示：建议使用高分辨率图片（1920x1080以上）
                </p>
              </div>
            </div>
            
            <!-- API配置 -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-key text-purple-500 mr-2"></i>
                数据源配置
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API密钥</label>
                  <input 
                    type="password"
                    v-model="apiKey"
                    placeholder="请输入维基云表格API密钥"
                    class="w-full bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">表格ID (datasheetId)</label>
                  <input 
                    type="text"
                    v-model="datasheetId"
                    placeholder="请输入维基云表格ID"
                    class="w-full bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">视图ID (viewId)</label>
                  <input 
                    type="text"
                    v-model="viewId"
                    placeholder="请输入表格视图ID"
                    class="w-full bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
                  >
                </div>
                <div class="flex gap-4">
                  <button
                    @click="saveApiConfig"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
                  >
                    保存配置
                  </button>
                  <button
                    @click="resetApiConfig"
                    class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                  >
                    重置
                  </button>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  配置说明：登录维基云表格，在「设置」-「API」中获取API密钥；表格ID和视图ID可在表格URL中找到。
                </p>
              </div>
            </div>
            
            <!-- 布局设置 -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-th-large text-green-500 mr-2"></i>
                布局设置
              </h3>
              <div class="flex items-center gap-4">
                <label class="text-gray-700 dark:text-gray-300">每行显示：</label>
                <select 
                  v-model.number="columns" 
                  class="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2"
                  @change="saveSettings"
                >
                  <option v-for="n in [3,4,5,6,7,8]" :key="n" :value="n">{{ n }} 列</option>
                </select>
              </div>
            </div>
            
            <!-- 配置导入导出 -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 class="text-xl font-semibold mb-4 flex items-center">
                <i class="fas fa-exchange-alt text-green-500 mr-2"></i>
                配置导入导出
              </h3>
              <div class="space-y-4">
                <!-- 配置项选择 -->
                <div>
                  <h4 class="text-lg font-medium mb-2">选择要导入/导出的配置项：</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label class="flex items-center gap-2">
                      <input v-model="exportOptions.darkMode" type="checkbox" class="rounded text-blue-500">
                      <span class="text-sm text-gray-700 dark:text-gray-300">黑暗模式</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input v-model="exportOptions.columns" type="checkbox" class="rounded text-blue-500">
                      <span class="text-sm text-gray-700 dark:text-gray-300">布局列数</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input v-model="exportOptions.background" type="checkbox" class="rounded text-blue-500">
                      <span class="text-sm text-gray-700 dark:text-gray-300">背景设置</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input v-model="exportOptions.categoryIcons" type="checkbox" class="rounded text-blue-500">
                      <span class="text-sm text-gray-700 dark:text-gray-300">分类图标</span>
                    </label>
                    <label class="flex items-center gap-2">
                      <input v-model="exportOptions.apiConfig" type="checkbox" class="rounded text-blue-500">
                      <span class="text-sm text-gray-700 dark:text-gray-300">API配置</span>
                    </label>
                  </div>
                </div>
                
                <!-- 导出配置 -->
                <div class="flex gap-4">
                  <button
                    @click="exportConfig"
                    class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
                  >
                    <i class="fas fa-download mr-2"></i>导出配置
                  </button>
                  
                  <!-- 导入配置 -->
                  <div class="relative">
                    <input
                      type="file"
                      ref="fileInput"
                      accept=".json"
                      class="absolute inset-0 opacity-0 cursor-pointer"
                      @change="importConfig"
                    >
                    <button
                      class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
                    >
                      <i class="fas fa-upload mr-2"></i>导入配置
                    </button>
                  </div>
                </div>
                
                <!-- 导入结果提示 -->
                <div v-if="importMessage" class="p-3 rounded-lg" :class="importMessageType === 'success' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'">
                  <i :class="importMessageType === 'success' ? 'fas fa-check-circle mr-2' : 'fas fa-exclamation-circle mr-2'"></i>
                  {{ importMessage }}
                </div>
              </div>
            </div>
            
            <!-- 分类图标设置 -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow mt-6">
              <!-- 折叠面板头部 -->
              <div 
                class="p-6 cursor-pointer flex justify-between items-center" 
                @click="isIconSettingsExpanded = !isIconSettingsExpanded"
              >
                <h3 class="text-xl font-semibold flex items-center">
                  <i class="fas fa-icons text-yellow-500 mr-2"></i>
                  分类图标设置
                </h3>
                <i :class="`fas fa-chevron-down transition-transform duration-300 ${isIconSettingsExpanded ? 'transform rotate-180' : ''}`"></i>
              </div>
              
              <!-- 折叠面板内容 -->
              <div 
                v-if="isIconSettingsExpanded" 
                class="p-6 pt-0 space-y-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div v-if="loadingCategories" class="text-center py-4 text-gray-500">
                  <i class="fas fa-spinner fa-spin mr-2"></i>正在加载分类数据...
                </div>
                <div v-else-if="loadError" class="text-center py-4 text-red-500">
                  <i class="fas fa-exclamation-circle mr-2"></i>{{ loadError }}
                  <button 
                    @click="loadCategories"
                    class="ml-2 text-blue-500 hover:text-blue-700 underline"
                  >
                    刷新
                  </button>
                </div>
                <div v-else-if="categories.length === 0" class="text-center py-4 text-gray-500">
                  未找到分类数据
                  <button 
                    @click="loadCategories"
                    class="ml-2 text-blue-500 hover:text-blue-700 underline"
                  >
                    刷新
                  </button>
                </div>
                <div v-else>
                  <div v-for="category in categories" :key="category" class="flex items-center gap-4">
                    <div class="min-w-[120px]">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ category }}</label>
                    </div>
                    <div class="flex-1 flex items-center gap-2">
                      <div class="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <i :class="categoryIcons[category] || 'fas fa-question-circle'"></i>
                      </div>
                      <div class="flex-1 flex items-center">
                        <!-- 使用input支持手动输入 -->
                        <input
                          v-model="categoryIcons[category]"
                          type="text"
                          placeholder="输入完整图标类名，如：fas fa-wrench"
                          class="flex-1 bg-gray-100 dark:bg-gray-700 rounded px-3 py-1"
                          style="height: 36px;"
                        >
                        <!-- 图标选择下拉菜单 -->
                        <div class="relative ml-2">
                          <button 
                            class="p-1 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center"
                            @click="showIconDropdown[category] = !showIconDropdown[category]"
                            style="min-width: 36px; height: 36px;"
                          >
                            <i class="fas fa-chevron-down"></i>
                          </button>
                          <!-- 图标选择面板 -->
                          <div 
                            v-if="showIconDropdown[category]" 
                            class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                          >
                            <div 
                              v-for="icon in availableIcons" 
                              :key="icon.name"
                              class="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                              @click="categoryIcons[category] = `fas ${icon.name}`; showIconDropdown[category] = false"
                            >
                              <i :class="`fas ${icon.name} mr-2 text-xl`"></i>
                              <span>{{ icon.displayName }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-4">
                  <button
                    @click="saveCategoryIcons"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
                    :disabled="loadingCategories"
                  >
                    保存图标配置
                  </button>
                  <button
                    @click="resetCategoryIcons"
                    class="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                  >
                    重置默认图标
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 统一添加Footer -->
        <Footer class="mt-8" />
      </main>
    </div>
  </div>
</template>

<script>
// 移除Navbar导入
import Footer from '../components/Footer.vue'
import { fetchData } from '../api/fetchData'

export default {
  components: { Footer }, // 移除Navbar组件
  data() {
    return {
      customColorHex: localStorage.getItem('customColor') || '',
      backgroundImage: localStorage.getItem('backgroundImage') || '',
      darkMode: localStorage.getItem('darkMode') === 'true',
      backgroundColors: ['#ffffff', '#f3f4f6', '#fef3c7', '#f0fdf4', '#f1f5f9', '#bfc9df'],
      selectedBg: localStorage.getItem('background') || '#ffffff',
      columns: localStorage.getItem('columns') || 5,
      // API配置相关变量
      apiKey: localStorage.getItem('apiKey') || '',
      datasheetId: localStorage.getItem('datasheetId') || '',
      viewId: localStorage.getItem('viewId') || '',
      // 分类图标相关变量
      categories: [], // 初始为空，不要默认分类
      loadingCategories: false,
      categoryIcons: {}, // 初始为空，通过loadCategoryIcons加载
      loadError: null, // 加载错误提示
      availableIcons: [
        { name: 'fa-wrench', displayName: '工具' },
        { name: 'fa-blog', displayName: '博客' },
        { name: 'fa-film', displayName: '影视' },
        { name: 'fa-fire', displayName: '火焰' },
        { name: 'fa-cloud', displayName: '云朵' },
        { name: 'fa-image', displayName: '图片' },
        { name: 'fa-palette', displayName: '调色板' },
        { name: 'fa-building', displayName: '建筑' },
        { name: 'fa-video', displayName: '视频' },
        { name: 'fa-key', displayName: '钥匙' },
        { name: 'fa-cloud-upload-alt', displayName: '上传' },
        { name: 'fa-wifi', displayName: 'WiFi' },
        { name: 'fa-cogs', displayName: '齿轮' },
        { name: 'fa-globe', displayName: '地球' },
        { name: 'fa-book', displayName: '书籍' },
        { name: 'fa-music', displayName: '音乐' },
        { name: 'fa-gamepad', displayName: '游戏手柄' },
        { name: 'fa-shopping-cart', displayName: '购物车' },
        { name: 'fa-question-circle', displayName: '问号' }
      ],
      isIconSettingsExpanded: false,
      // 为每个分类创建独立的下拉状态
      showIconDropdown: {},
      // 导入导出配置相关变量
      exportOptions: {
        darkMode: true,
        columns: true,
        background: true,
        categoryIcons: true,
        apiConfig: false // 默认不导出API配置，保护敏感信息
      },
      importMessage: '',
      importMessageType: ''
    }
  },
  // 移除与侧边栏相关的所有方法和props
  methods: {
    mounted() {  // 确保这是直接的方法，不是嵌套在methods中的
      // 初始化背景设置
      const savedBg = localStorage.getItem('background')
      const savedImage = localStorage.getItem('backgroundImage')
      
      if (savedBg) {
        this.changeBackground(savedBg)
      } else if (savedImage) {
        this.applyBackgroundImage()
      }
      
      // 加载分类数据和图标配置
      this.loadCategories()
    },
    
    // 加载分类数据
    loadCategories() {
      this.loadingCategories = true;
      this.loadError = null;
      try {
        // 直接从localStorage获取分类信息（由App.vue存储）
        console.log('从localStorage获取分类信息...');
        const savedCategories = localStorage.getItem('appCategories');
        if (savedCategories) {
          const categories = JSON.parse(savedCategories);
          if (categories.length > 0) {
            console.log('获取分类成功:', categories);
            this.categories = categories;
            this.loadCategoryIcons();
            return;
          }
        }
        
        // 获取失败，显示为空并提示
        console.log('获取分类失败，显示为空');
        this.categories = [];
        this.loadError = '无法获取分类信息，请先访问首页或刷新页面';
      } catch (error) {
        console.error('加载分类失败:', error);
        this.categories = [];
        this.loadError = '无法获取分类信息，请先访问首页或刷新页面';
      } finally {
        this.loadingCategories = false;
      }
    },
    
    // 加载分类图标配置
    loadCategoryIcons() {
      // 先从localStorage获取已保存的图标配置
      const savedIcons = localStorage.getItem('categoryIcons')
      const savedIconsObj = savedIcons ? JSON.parse(savedIcons) : {};
      
      // 为当前所有分类分配图标
      const newCategoryIcons = {};
      
      // 遍历当前分类列表（可能是从API获取的）
      this.categories.forEach(category => {
        // 如果有已保存的图标配置，使用它；否则使用默认图标
        if (savedIconsObj[category]) {
          newCategoryIcons[category] = savedIconsObj[category];
        } else {
          // 为新分类分配默认图标
          newCategoryIcons[category] = 'fas fa-question-circle';
        }
      });
      
      // 更新图标配置
      this.categoryIcons = newCategoryIcons;
    },
    
    // 保存分类图标配置
    saveCategoryIcons() {
      localStorage.setItem('categoryIcons', JSON.stringify(this.categoryIcons))
      alert('分类图标配置已保存')
    },
    
    // 重置分类图标为默认值
    resetCategoryIcons() {
      this.categoryIcons = {
        '在线工具': 'fas fa-wrench',
        '个人博客': 'fas fa-blog',
        '影视在线': 'fas fa-film',
        'AI大模型': 'fas fa-fire',
        '网络存储': 'fas fa-cloud',
        '素材网站': 'fas fa-image',
        '灵感图库': 'fas fa-palette',
        '建筑网站': 'fas fa-building',
        'AI音视频': 'fas fa-video',
        'AI绘画': 'fas fa-palette',
        '破解资源': 'fas fa-key',
        '云上平台': 'fas fa-cloud-upload-alt',
        '网站相关': 'fas fa-wifi',
        '杂项工具': 'fas fa-cogs'
      }
      localStorage.setItem('categoryIcons', JSON.stringify(this.categoryIcons))
      alert('分类图标已重置为默认值')
    },
    
    // 导出配置
    exportConfig() {
      try {
        const config = {
          version: '1.0',
          exportDate: new Date().toISOString(),
          settings: {}
        };
        
        // 根据选择的选项导出配置
        if (this.exportOptions.darkMode) {
          config.settings.darkMode = localStorage.getItem('darkMode') === 'true';
        }
        
        if (this.exportOptions.columns) {
          config.settings.columns = localStorage.getItem('columns');
        }
        
        if (this.exportOptions.background) {
          config.settings.background = localStorage.getItem('background');
          config.settings.backgroundImage = localStorage.getItem('backgroundImage');
          config.settings.customColor = localStorage.getItem('customColor');
        }
        
        if (this.exportOptions.categoryIcons) {
          config.settings.categoryIcons = JSON.parse(localStorage.getItem('categoryIcons') || '{}');
        }
        
        if (this.exportOptions.apiConfig) {
          config.settings.apiKey = localStorage.getItem('apiKey');
          config.settings.datasheetId = localStorage.getItem('datasheetId');
          config.settings.viewId = localStorage.getItem('viewId');
        }
        
        // 生成JSON文件并下载
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nav-settings-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('导出配置失败:', error);
        this.importMessage = '导出配置失败，请重试';
        this.importMessageType = 'error';
        setTimeout(() => {
          this.importMessage = '';
        }, 3000);
      }
    },
    
    // 导入配置
    importConfig(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          if (!config.settings) {
            throw new Error('无效的配置文件格式');
          }
          
          const { settings } = config;
          
          // 根据配置项导入
          if (settings.darkMode !== undefined) {
            localStorage.setItem('darkMode', settings.darkMode);
          }
          
          if (settings.columns) {
            localStorage.setItem('columns', settings.columns);
            this.columns = parseInt(settings.columns);
          }
          
          if (settings.background) {
            localStorage.setItem('background', settings.background);
            document.body.style.backgroundColor = settings.background;
          }
          
          if (settings.backgroundImage) {
            localStorage.setItem('backgroundImage', settings.backgroundImage);
            document.body.style.backgroundImage = `url('${settings.backgroundImage}')`;
          }
          
          if (settings.customColor) {
            localStorage.setItem('customColor', settings.customColor);
            this.customColorHex = settings.customColor;
          }
          
          if (settings.categoryIcons) {
            localStorage.setItem('categoryIcons', JSON.stringify(settings.categoryIcons));
            this.categoryIcons = { ...settings.categoryIcons };
          }
          
          if (settings.apiKey) {
            localStorage.setItem('apiKey', settings.apiKey);
            this.apiKey = settings.apiKey;
          }
          
          if (settings.datasheetId) {
            localStorage.setItem('datasheetId', settings.datasheetId);
            this.datasheetId = settings.datasheetId;
          }
          
          if (settings.viewId) {
            localStorage.setItem('viewId', settings.viewId);
            this.viewId = settings.viewId;
          }
          
          // 显示导入成功消息
          this.importMessage = '配置导入成功！页面将刷新以应用新配置';
          this.importMessageType = 'success';
          
          // 3秒后刷新页面
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } catch (error) {
          console.error('导入配置失败:', error);
          this.importMessage = '导入配置失败，请检查文件格式';
          this.importMessageType = 'error';
          setTimeout(() => {
            this.importMessage = '';
          }, 3000);
        }
      };
      reader.readAsText(file);
      
      // 重置文件输入，允许重复选择同一文件
      event.target.value = '';
    },
    applyCustomColor() {
      const colorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
      let color = this.customColorHex.trim()
      
      if (!color.startsWith('#')) {
        color = '#' + color
      }
      
      if (colorRegex.test(color)) {
        this.customColorHex = color  // 标准化格式
        this.changeBackground(color)
        localStorage.setItem('customColor', color)
      } else {
        alert('请输入有效的十六进制颜色码')
      }
    },
    
    applyBackgroundImage() {
      const imageRegex = /\.(jpeg|jpg|png|svg)(\?.*)?$/i
      if (imageRegex.test(this.backgroundImage)) {
        document.body.style.backgroundImage = `url('${this.backgroundImage}')`
        document.body.style.backgroundSize = 'cover'
        document.body.style.backgroundPosition = 'center'
        document.body.style.backgroundRepeat = 'no-repeat'
        document.body.style.backgroundColor = '' // 清除背景色
        
        // 持久化存储
        localStorage.setItem('backgroundImage', this.backgroundImage)
        localStorage.removeItem('background')
        localStorage.removeItem('customColor')
      } else {
        alert('请输入有效的图片URL，支持jpg/png/svg格式')
      }
    },
    
    changeBackground(color) {
      this.selectedBg = color
      this.customColorHex = color // 同步到颜色选择器
      document.body.style.backgroundColor = color
      document.body.style.backgroundImage = 'none'
      
      // 持久化存储
      localStorage.setItem('background', color)
      localStorage.setItem('customColor', color)
      localStorage.removeItem('backgroundImage')
    },
    saveSettings() {
      localStorage.setItem('columns', this.columns)
    },
    // 保存API配置
    saveApiConfig() {
      if (!this.apiKey.trim() || !this.datasheetId.trim() || !this.viewId.trim()) {
        alert('请填写完整的API配置信息');
        return;
      }
      
      localStorage.setItem('apiKey', this.apiKey);
      localStorage.setItem('datasheetId', this.datasheetId);
      localStorage.setItem('viewId', this.viewId);
      
      alert('API配置已保存，页面将刷新以应用新配置');
      window.location.reload();
    },
    // 重置API配置
    resetApiConfig() {
      this.apiKey = '';
      this.datasheetId = '';
      this.viewId = '';
      
      localStorage.removeItem('apiKey');
      localStorage.removeItem('datasheetId');
      localStorage.removeItem('viewId');
      
      alert('API配置已重置');
    },
  }
}
</script>