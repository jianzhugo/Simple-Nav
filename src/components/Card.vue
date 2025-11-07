<template>
  <a :href="item.url" target="_blank" 
     class="card-container flex items-start bg-white dark:bg-gray-700 p-3 sm:p-4 rounded shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] border-2 border-transparent relative">
    
    <!-- 调整图标大小 -->
    <img :src="item.icon" alt="icon" class="w-8 h-8 sm:w-12 sm:h-12 mr-3 sm:mr-4" />
    
    <div class="flex-1">
      <!-- 调整标题大小 -->
      <h3 class="text-base sm:text-lg font-bold">{{ item.name }}</h3>
      <!-- 调整描述文本 -->
      <p 
        class="desc-text text-xs sm:text-sm text-gray-600 dark:text-gray-400"
        :title="item.description"
      >
        {{ item.description }}
      </p>
    </div>
  </a>
</template>

<style scoped>
.desc-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  line-height: 1.4;
  word-break: break-all;
  box-sizing: border-box; 
}

/* 多颜色呼吸效果边框动画 */
.card-container:hover {
  animation: multiColorBreath 6s ease-in-out infinite;
}

@keyframes multiColorBreath {
  0%, 100% {
    border-color: rgba(216, 180, 254, 0.3); /* 浅紫色 */
    box-shadow: 0 0 5px rgba(216, 180, 254, 0.2);
  }
  16.6% {
    border-color: rgba(184, 61, 143, 0.8); /* 深粉色 */
    box-shadow: 0 0 15px rgba(184, 61, 143, 0.5);
  }
  33.3% {
    border-color: rgba(59, 130, 246, 0.3); /* 浅蓝色 */
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.2);
  }
  50% {
    border-color: rgba(29, 78, 216, 0.8); /* 深蓝色 */
    box-shadow: 0 0 15px rgba(29, 78, 216, 0.5);
  }
  66.6% {
    border-color: rgba(34, 197, 94, 0.3); /* 浅绿色 */
    box-shadow: 0 0 5px rgba(34, 197, 94, 0.2);
  }
  83.3% {
    border-color: rgba(21, 128, 61, 0.8); /* 深绿色 */
    box-shadow: 0 0 15px rgba(21, 128, 61, 0.5);
  }
}

/* 深色模式下的多颜色呼吸效果 */
:global(.dark) .card-container:hover {
  animation: multiColorBreathDark 4s ease-in-out infinite;
}

@keyframes multiColorBreathDark {
  0%, 100% {
    border-color: rgba(147, 51, 234, 0.3); /* 浅紫色 */
    box-shadow: 0 0 5px rgba(147, 51, 234, 0.2);
  }
  16.6% {
    border-color: rgba(168, 85, 247, 0.8); /* 深紫色 */
    box-shadow: 0 0 15px rgba(168, 85, 247, 0.5);
  }
  33.3% {
    border-color: rgba(96, 165, 250, 0.3); /* 浅蓝色 */
    box-shadow: 0 0 5px rgba(96, 165, 250, 0.2);
  }
  50% {
    border-color: rgba(59, 130, 246, 0.8); /* 深蓝色 */
    box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
  }
  66.6% {
    border-color: rgba(52, 211, 153, 0.3); /* 浅绿色 */
    box-shadow: 0 0 5px rgba(52, 211, 153, 0.2);
  }
  83.3% {
    border-color: rgba(16, 185, 129, 0.8); /* 深绿色 */
    box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
  }
}
</style>

<script>
export default {
  props: ['item'],
};
</script>
