<template>
  <div class="h-screen flex flex-col">
    <router-view :categories="categories"></router-view>  <!-- 传递分类数据 -->
    <div class="flex flex-1 overflow-hidden relative">
      <Sidebar 
        :categories="categories" 
        :isCollapsed="isSidebarCollapsed"
        @select-category="filterByCategory"
        @toggle-sidebar="toggleSidebar"
      />
      <main class="flex-1 flex flex-col p-4 overflow-y-auto">
        <!-- 移除宽度限制容器，直接使用Navbar -->
        <Navbar 
          :darkMode="darkMode" 
          :categories="categories"
          @toggle-dark-mode="toggleDarkMode" 
          @submit-website="handleSubmitWebsite"
          class="mb-6"/>
        
        <div class="flex-grow">
          <!-- 加载状态 -->
          <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="text-gray-500 dark:text-gray-400">
              <i class="fas fa-spinner fa-spin mr-2"></i>正在加载数据...
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div v-else-if="error" class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center max-w-2xl mx-auto">
            <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
            <h3 class="text-xl font-semibold text-red-700 dark:text-red-300 mb-2">{{ error }}</h3>
            <button 
              @click="$router.push('/settings')"
              class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors mt-4"
            >
              <i class="fas fa-cog mr-2"></i>前往设置页面
            </button>
          </div>
          
          <!-- 数据展示 -->
          <div v-else>
            <div 
              class="grid gap-6" 
              :class="{
                'grid-cols-2 md:grid-cols-3': columns === 3,
                'grid-cols-2 md:grid-cols-4': columns === 4,
                'grid-cols-2 md:grid-cols-5': columns === 5,
                'grid-cols-2 md:grid-cols-6': columns === 6,
                'grid-cols-2 md:grid-cols-7': columns === 7,
                'grid-cols-2 md:grid-cols-8': columns === 8
              }"
            >
              <template v-for="(item, index) in filteredItems" :key="item.id">
                <!-- 卡片必须放在广告条件判断之前 -->
                <Card :item="item" />
                <!-- 修正广告显示逻辑 -->
                <AdBanner 
                  v-if="index === 9" 
                  class="col-span-full h-[120px] bg-blue-50 dark:bg-blue-900 mt-4"
                />
              </template>
            </div>
          </div>
        </div>

        <Footer class="mt-8" />
      </main>
    </div>
  </div>
</template>

<style>
/* 新增全局样式 */
html, body {
  height: 100%;
  margin: 0;
}
</style>

<script>
import { fetchData, addWebsite } from './api/fetchData';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import Card from './components/Card.vue';
import Footer from './components/Footer.vue';  // 确保导入Footer组件
import AdBanner from './components/AdBanner.vue'  // 确保导入广告组件

export default {
  components: { 
    Navbar, 
    Sidebar, 
    Card, 
    Footer,
    AdBanner // 必须在此注册广告组件
  },
  data() {
    return {
      columns: parseInt(localStorage.getItem('columns')) || 5, // 修复：确保转换为数字类型
      items: [],
      categories: [],
      selectedCategory: null,
      darkMode: localStorage.getItem('darkMode') === 'true',
      isSidebarCollapsed: window.innerWidth < 768, // 初始化时根据屏幕宽度判断
      loading: false,
      error: null
    };
  },
  computed: {
    filteredItems() {
      if (!this.selectedCategory) return this.items;
      return this.items.filter(item => item.category === this.selectedCategory);
    },
  },
  methods: {
    async loadData() {
      try {
        this.loading = true;
        this.error = null;
        const data = await fetchData();
        console.log('Loaded data:', data);
        this.items = data;
        this.categories = [...new Set(data.map(item => item.category))];
        // 将分类信息存储到localStorage，供设置页使用
        localStorage.setItem('appCategories', JSON.stringify(this.categories));
      } catch (error) {
        console.error('数据加载失败:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    filterByCategory(category) {
      this.selectedCategory = category;
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      console.log('=== 黑暗模式切换 ===');
      console.log('当前状态：', this.darkMode);
      console.log('切换前class列表：', document.documentElement.className);
      
      if (this.darkMode) {
        document.documentElement.classList.add('dark');
        console.log('已添加dark类');
      } else {
        document.documentElement.classList.remove('dark');
        console.log('已移除dark类');
      }
      
      console.log('切换后class列表：', document.documentElement.className);
      console.log('localStorage保存状态：', this.darkMode);
      localStorage.setItem('darkMode', this.darkMode);
      
      // 强制重新应用样式
      this.$nextTick(() => {
        console.log('强制重绘完成');
      });
    },
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    },
    // 处理网址提交
    async handleSubmitWebsite(websiteData) {
      try {
        // 调用API提交数据
        await addWebsite(websiteData);
        // 重新加载数据，更新分类列表
        await this.loadData();
      } catch (error) {
        console.error('提交网站失败:', error);
        throw error;
      }
    },
    // 可以移除的冗余代码
    handleGlobalClick(event) {
    // 改用document.querySelector获取元素
    const sidebar = document.querySelector('.sidebar-container');
    const cards = document.querySelectorAll('.card-container');
    
    // 只重置分类，不影响样式
    if (!sidebar.contains(event.target) && 
        !Array.from(cards).some(card => card.contains(event.target))) {
    this.selectedCategory = null;
    }
    },
    handleResize() {
      // 强制移动端侧边栏保持收起状态
      this.isSidebarCollapsed = window.innerWidth < 768
      // 添加调试日志（可选）
      console.log('窗口尺寸变化:', window.innerWidth, '侧边栏状态:', this.isSidebarCollapsed)
    }
  },
  watch: {
    '$route.query.category'(newCategory) {
      this.selectedCategory = newCategory || null;
    }
  },
  created() {
    this.loadData();
    // 确保黑暗模式状态正确初始化
    console.log('App.vue创建时黑暗模式状态：', this.darkMode);
  },
  mounted() {
    // 初始化黑暗模式
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // 初始化列数设置
    const savedColumns = localStorage.getItem('columns')
    if (savedColumns) {
      this.columns = parseInt(savedColumns)
    }
    
    // 初始化背景设置
    const savedBg = localStorage.getItem('background')
    const savedImage = localStorage.getItem('backgroundImage')
    
    if (savedBg) {
      document.body.style.backgroundColor = savedBg
    } else if (savedImage) {
      document.body.style.backgroundImage = `url('${savedImage}')`
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundPosition = 'center'
      document.body.style.backgroundRepeat = 'no-repeat'
    }
    // 添加窗口大小变化监听
    window.addEventListener('resize', this.handleResize)
    // 确保正确添加事件监听
    document.addEventListener('click', this.handleGlobalClick);
    // 初始化时应用移动端状态
    if (window.innerWidth < 768) {
      this.isSidebarCollapsed = true
    }
  },
  beforeUnmount() {
    // 移除事件监听
    document.removeEventListener('click', this.handleGlobalClick);
    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.handleResize);
  }
};
</script>