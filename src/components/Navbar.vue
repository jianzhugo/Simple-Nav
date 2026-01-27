<template>
  <nav class="h-12 sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md px-4 py-2 flex justify-between items-center">
    <!-- 修改为 router-link 以实现跳转 -->
    <router-link to="/" class="text-xl font-bold text-blue-500">
      <i class="fas fa-heart"></i> 少即是多
    </router-link>
    
    <!-- 修改搜索区域显示逻辑 -->
    <div class="hidden md:flex items-center gap-2 flex-1 max-w-2xl mx-4">
      <div class="relative">
        <!-- 调整当前选择项的宽度和图标间距 -->
        <a href="javascript:;" 
          class="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1 flex items-center min-w-[120px]"
          @click="showEngines = !showEngines">
          <i :class="engineIcons[selectedEngine]" class="mr-2 text-sm w-4"></i>
          <span class="truncate">{{ engines[selectedEngine].name }}</span>
        </a>
        
        <!-- 调整下拉菜单宽度和选项对齐 -->
        <div v-show="showEngines" 
          class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg min-w-[160px] z-50">
          <a 
            v-for="(engine, key) in engines" 
            href="javascript:;" 
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
            @click="selectedEngine = key; showEngines = false"
          >
            <i :class="engineIcons[key]" class="mr-3 w-4 text-center"></i>
            <span class="truncate">{{ engine.name }}</span>
          </a>
        </div>
      </div>

      <!-- 保持原有的 input 和 button 不变 -->
      <input
        type="text"
        v-model="searchQuery"
        :placeholder="engines[selectedEngine].placeholder"
        class="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-1"
        @keyup.enter="search"
      />
      <button 
        @click="search"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg"
      >
        <i class="fas fa-search"></i>  <!-- 使用Font Awesome的搜索图标 -->
      </button>
    </div>
    
    <!-- 右侧按钮区域 -->
    <div class="flex items-center gap-0">
      <!-- 新增提交按钮 -->
      <div class="relative group w-8 h-8 flex items-center justify-center">
        <button
          @click="showPasswordDialog = true"
          class="w-full h-full flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
        >
          <i class="fas fa-plus-circle hover:scale-110 transition-transform duration-300"></i>
        </button>
        <span class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-center">添加网站</span>
      </div>
      
      <!-- 新增设置按钮 -->
      <div class="relative group w-8 h-8 flex items-center justify-center">
        <router-link 
          to="/settings"
          class="w-full h-full flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
        >
          <i class="fas fa-cog hover:rotate-90 transition-transform duration-300"></i>
        </router-link>
        <span class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-center">设置</span>
      </div>
      
      <!-- 新增GitHub图标 -->
      <div class="relative group w-8 h-8 flex items-center justify-center">
        <a 
          href="https://github.com/jianzhugo/Simple-Nav" 
          target="_blank"
          class="w-full h-full flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
        >
          <i class="fab fa-github hover:rotate-12 transition-transform"></i>
        </a>
        <span class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-center">GitHub</span>
      </div>
      
      <!-- 原有的暗黑模式切换按钮 -->
      <div class="relative group w-8 h-8 flex items-center justify-center">
        <button 
          @click="$emit('toggleDarkMode')" 
          class="w-full h-full flex items-center justify-center rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
        >
          <i class="fas hover:rotate-12 transition-transform" :class="darkMode ? 'fa-sun' : 'fa-moon' "></i>
        </button>
        <span class="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-center">{{ darkMode ? '浅色模式' : '暗黑模式' }}</span>
      </div>
    </div>
    
    <!-- 密码验证对话框 -->
    <PasswordDialog
      :visible="showPasswordDialog"
      :categories="categories"
      @close="showPasswordDialog = false"
      @password-validated="showAddWebsiteDialog = true"
    />
    
    <!-- 网址添加对话框 -->
    <AddWebsiteDialog
      :visible="showAddWebsiteDialog"
      :categories="categories"
      @close="showAddWebsiteDialog = false"
      @submit="handleSubmitWebsite"
    />
  </nav>
</template>

<script>
import PasswordDialog from './PasswordDialog.vue';
import AddWebsiteDialog from './AddWebsiteDialog.vue';

export default {
  components: {
    PasswordDialog,
    AddWebsiteDialog
  },
  props: ['darkMode', 'categories'],
  data() {
    return {
      showEngines: false,
      searchQuery: '',
      selectedEngine: 'baidu',
      engines: {
        bing: { 
          name: 'Bing', 
          url: 'https://www.bing.com/search?q=', 
          placeholder: '必应搜索...' 
        },
        baidu: { 
          name: '百度', 
          url: 'https://www.baidu.com/s?wd=', 
          placeholder: '百度一下...' 
        },
        google: { 
          name: '谷歌', 
          url: 'https://www.google.com/search?q=',
          placeholder: 'Google搜索...' 
        },
        local: { 
          name: '本地', 
          url: '/search?q=',
          placeholder: '站内搜索...' 
        }
      },
      engineIcons: {
        bing: 'fab fa-microsoft',
        baidu: 'fas fa-paw',
        google: 'fab fa-google', 
        local: 'fas fa-search'
      },
      showPasswordDialog: false,
      showAddWebsiteDialog: false
    };
  },
  methods: {
    search() {
      if (this.searchQuery.trim()) {
        if (this.selectedEngine === 'local') {
          // 使用 router 进行跳转
          this.$router.push({ 
            path: '/search',
            query: { q: this.searchQuery.trim() }
          });
        } else {
          const url = this.engines[this.selectedEngine].url + encodeURIComponent(this.searchQuery);
          window.open(url, '_blank');
        }
      }
    },
    
    // 处理网址提交
    async handleSubmitWebsite(websiteData) {
      try {
        // 调用父组件传递的提交方法
        await this.$emit('submit-website', websiteData);
      } catch (error) {
        console.error('提交网站失败:', error);
      }
    }
  }
};
</script>